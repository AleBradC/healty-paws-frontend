import React from "react";
import apolloClient from "./lib/graphql/apollo-wrapper";
import { ApolloProvider } from "@apollo/client/react";

export function ApolloProviderWrapper({ children }: React.PropsWithChildren) {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
}
