import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client";
import { ErrorLink } from "@apollo/client/link/error";
import { RetryLink } from "@apollo/client/link/retry";
import { createPersistedQueryLink } from "@apollo/client/link/persisted-queries";
import { CombinedGraphQLErrors, ServerError } from "@apollo/client/errors";
import * as Sentry from "@sentry/react";
import { API_BASE_URL, graphqlEndpoint, logoutEndpoint } from "../../api/endpoint";
import { authLoginPath } from "../../utils/path";

const EXPECTED_GRAPHQL_CODES = new Set([
  "UNAUTHENTICATED",
  "FORBIDDEN",
  "BAD_USER_INPUT",
  "EMAIL_NOT_VERIFIED",
]);

const sha256 = async (text: string): Promise<string> => {
  const buffer = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(text)
  );
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

const httpLink = new HttpLink({
  uri: `${API_BASE_URL}${graphqlEndpoint}`,
  credentials: "include",
});

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

const persistedQueriesLink = createPersistedQueryLink({ sha256 });

const isAlreadyOnLogin = () =>
  window.location.pathname.startsWith(authLoginPath);

const handleUnauthenticated = () => {
  if (isAlreadyOnLogin()) return;

  fetch(`${API_BASE_URL}${logoutEndpoint}`, {
    method: "POST",
    credentials: "include",
  }).catch(() => {});

  apolloClient.clearStore().catch(() => {});

  window.location.href = authLoginPath;
};

const errorLink = new ErrorLink(({ error, operation }) => {
  if (
    CombinedGraphQLErrors.is(error) &&
    error.errors.some((e) => e.extensions?.code === "UNAUTHENTICATED")
  ) {
    handleUnauthenticated();
    return;
  }

  if (ServerError.is(error) && error.statusCode === 401) {
    handleUnauthenticated();
    return;
  }

  if (CombinedGraphQLErrors.is(error)) {
    for (const e of error.errors) {
      const code = e.extensions?.code as string | undefined;
      if (code && EXPECTED_GRAPHQL_CODES.has(code)) continue;
      Sentry.captureException(e, {
        tags: {
          source: "apollo",
          operation: operation.operationName ?? "anonymous",
          code: code ?? "UNKNOWN",
        },
      });
    }
    return;
  }

  Sentry.captureException(error, {
    tags: {
      source: "apollo-network",
      operation: operation.operationName ?? "anonymous",
    },
  });
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
  link: from([errorLink, retryLink, persistedQueriesLink, httpLink]),
  cache,
});

export default apolloClient;
