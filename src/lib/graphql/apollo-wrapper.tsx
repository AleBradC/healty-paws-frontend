import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client";
import { onError } from "@apollo/client/link/error";

// The httpOnly cookie is sent automatically with every same-origin request —
// no manual Authorization header needed.
const httpLink = new HttpLink({
  uri: "http://localhost/graphql",
  credentials: "include",
});

// On a 401 the access token has expired or is invalid — redirect to login
// so the user can re-authenticate rather than staying in a broken state.
const errorLink = onError(({ networkError }) => {
  if (
    networkError &&
    "statusCode" in networkError &&
    networkError.statusCode === 401
  ) {
    window.location.href = "/login";
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
