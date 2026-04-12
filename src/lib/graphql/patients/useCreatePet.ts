import { useMutation } from "@apollo/client/react";
import {
  CreatePetDocument,
  type CreatePetMutationVariables,
} from "../../../generated/graphql";

export const useCreatePet = () => {
  const [mutate, { loading, error }] = useMutation(CreatePetDocument);

  const createPet = async (input: CreatePetMutationVariables["input"]) => {
    try {
      const { data } = await mutate({ variables: { input } });
      return data?.createPet ?? null;
    } catch (e) {
      console.error("Error creating pet:", e);
      throw e;
    }
  };

  return { createPet, loading, error };
};
