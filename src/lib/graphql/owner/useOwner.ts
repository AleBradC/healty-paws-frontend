import { useQuery } from "@apollo/client/react";
import {
  GetOwnerDocument,
  type GetOwnerQueryVariables,
} from "../../../generated/graphql";

export const useOwner = (id: string | null) => {
  const variables: GetOwnerQueryVariables = { id: id ?? "" };
  const { data, loading, error, refetch } = useQuery(GetOwnerDocument, {
    variables,
    skip: !id,
    fetchPolicy: "network-only",
  });

  return { owner: data?.owner, loading, error, refetch };
};
