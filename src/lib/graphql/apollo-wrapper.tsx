import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client";
import { ErrorLink } from "@apollo/client/link/error";
import { CombinedGraphQLErrors, ServerError } from "@apollo/client/errors";
import { API_BASE_URL, graphqlEndpoint, logoutEndpoint } from "../../api/endpoint";
import { authLoginPath } from "../../utils/path";

// The httpOnly cookie is sent automatically with every same-origin request —
// no manual Authorization header needed. URL is built from the shared
// API_BASE_URL constant so config changes happen in one place.
const httpLink = new HttpLink({
  uri: `${API_BASE_URL}${graphqlEndpoint}`,
  credentials: "include",
});

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
  link: from([errorLink, httpLink]),
  cache,
});

export default apolloClient;
