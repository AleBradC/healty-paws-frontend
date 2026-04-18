import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = new HttpLink({
  uri: "http://localhost/graphql",
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem("accessToken");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
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
  link: authLink.concat(httpLink),
  cache,
});

export default apolloClient;
