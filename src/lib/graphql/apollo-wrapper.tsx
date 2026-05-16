import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
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

  window.location.href = authLoginPath;
};

// Two auth-failure shapes to handle:
//  1. GraphQL resolvers throwing UNAUTHENTICATED — comes through graphQLErrors,
//     HTTP status is 200, so networkError is null.
//  2. REST cookie-auth failures — surface as a network error with status 401.
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors?.some((e) => e.extensions?.code === "UNAUTHENTICATED")) {
    handleUnauthenticated();
    return;
  }

  if (
    networkError &&
    "statusCode" in networkError &&
    (networkError as { statusCode: number }).statusCode === 401
  ) {
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
