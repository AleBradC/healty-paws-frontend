import { useQuery } from "@apollo/client/react";
import { petQuery } from "../queries";
import type { Pet } from "../../../types";

export interface PetResponse {
  pet: Pet;
}

export interface PetInput {
  id: string | undefined;
}

export const usePet = (id: string) => {
  const { data, loading, error } = useQuery<PetResponse, PetInput>(petQuery, {
    variables: { id },
    skip: !id,
    fetchPolicy: "network-only",
  });

  return {
    pet: data?.pet,
    loading,
    error,
  };
};
