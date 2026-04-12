import { useQuery } from "@apollo/client/react";
import {
  GetPetDocument,
  type GetPetQueryVariables,
} from "../../../generated/graphql";

export const usePet = (id: string) => {
  const variables: GetPetQueryVariables = { id };
  const { data, loading, error } = useQuery(GetPetDocument, {
    variables,
    skip: !id,
    fetchPolicy: "network-only",
  });

  return { pet: data?.pet, loading, error };
};
