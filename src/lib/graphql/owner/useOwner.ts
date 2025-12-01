import { useQuery } from "@apollo/client/react";
import { ownerQuery } from "../queries";
import type { Owner } from "../../../types";

export interface queryResponse {
  owner: Owner;
}

export interface queryInput {
  id: string | null;
}

export const useOwner = (id: string | null) => {
  const { data, loading, error, refetch } = useQuery<queryResponse, queryInput>(
    ownerQuery,
    {
      variables: { id },
      skip: !id,
      fetchPolicy: "network-only",
    }
  );

  return {
    owner: data?.owner,
    loading,
    error,
    refetch,
  };
};
