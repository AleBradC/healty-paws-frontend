import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client";
import { ErrorLink } from "@apollo/client/link/error";
import { RetryLink } from "@apollo/client/link/retry";
import { createPersistedQueryLink } from "@apollo/client/link/persisted-queries";
import { CombinedGraphQLErrors, ServerError } from "@apollo/client/errors";
import { API_BASE_URL, graphqlEndpoint, logoutEndpoint } from "../../api/endpoint";
import { authLoginPath } from "../../utils/path";

// SHA-256 implementation used by the persisted-queries link. The browser's
// native SubtleCrypto avoids pulling in a JS hashing dependency.
const sha256 = async (text: string): Promise<string> => {
  const buffer = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(text)
  );
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

// The httpOnly cookie is sent automatically with every same-origin request —
// no manual Authorization header needed. URL is built from the shared
// API_BASE_URL constant so config changes happen in one place.
const httpLink = new HttpLink({
  uri: `${API_BASE_URL}${graphqlEndpoint}`,
  credentials: "include",
});

// Retry transient network failures on idempotent reads. Mutations are
// explicitly excluded — retrying a non-idempotent mutation can create
// duplicate side effects (double bookings, double payments, etc.).
const retryLink = new RetryLink({
  delay: { initial: 200, max: 2000, jitter: true },
  attempts: {
    max: 3,
    retryIf: (error, operation) => {
      if (!error) return false;
      const isQuery =
        operation.query.definitions.some(
          (d) =>
            d.kind === "OperationDefinition" &&
            (d.operation === "query" || d.operation === "subscription")
        );
      return Boolean(isQuery);
    },
  },
});

// Automatic Persisted Queries: send a SHA-256 hash first; if the server
// doesn't recognise it, send the full query and the server caches the hash
// for next time. Cuts request size on repeat queries and lets a CDN cache
// public GET-able queries by URL.
const persistedQueriesLink = createPersistedQueryLink({ sha256 });

// When auth fails, clear the cookie server-side and redirect to login.
// Short-circuit when already on the login page to avoid redirect loops on
// failed POST /login calls.
const isAlreadyOnLogin = () =>
  window.location.pathname.startsWith(authLoginPath);

const handleUnauthenticated = () => {
  if (isAlreadyOnLogin()) return;

  // Best-effort server-side cookie clear. Fire-and-forget — errorLink stays sync.
  fetch(`${API_BASE_URL}${logoutEndpoint}`, {
    method: "POST",
    credentials: "include",
  }).catch(() => {});

  // Evict cached PII from the in-memory store so the next user (or the same
  // user re-authenticating) cannot see the previous session's data via a
  // cache-only read. Errors are ignored — the full-page navigation below
  // discards everything anyway, this is belt-and-braces for the race window.
  apolloClient.clearStore().catch(() => {});

  window.location.href = authLoginPath;
};

// Two auth-failure shapes to handle (Apollo Client v4 surfaces both through a
// single `error` field, narrowed via the static `is()` helpers):
//  1. GraphQL resolvers throwing UNAUTHENTICATED — wrapped in CombinedGraphQLErrors,
//     HTTP status is 200.
//  2. REST cookie-auth failures — wrapped in ServerError with statusCode 401.
const errorLink = new ErrorLink(({ error }) => {
  if (
    CombinedGraphQLErrors.is(error) &&
    error.errors.some((e) => e.extensions?.code === "UNAUTHENTICATED")
  ) {
    handleUnauthenticated();
    return;
  }

  if (ServerError.is(error) && error.statusCode === 401) {
    handleUnauthenticated();
  }
});

const cache = new InMemoryCache({
  typePolicies: {
    Doctor: {
      fields: {
        availabilities: {
          merge(_, incoming) {
            return incoming;
          },
        },
      },
    },
    Availability: {
      keyFields: ["id"],
    },
  },
});

const apolloClient = new ApolloClient({
  // Order matters: errorLink first (sees every failure), retryLink second
  // (transparent retries before APQ negotiation), then persisted queries
  // (rewrites the wire payload), finally httpLink (terminating).
  link: from([errorLink, retryLink, persistedQueriesLink, httpLink]),
  cache,
});

export default apolloClient;
