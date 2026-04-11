import { useMutation } from "@apollo/client/react";
import {
  UpdatePetDocument,
  type UpdatePetMutationVariables,
} from "../../../generated/graphql";

export const useUpdatePet = () => {
  const [mutate, { loading, error }] = useMutation(UpdatePetDocument);

  const updatePet = async (input: UpdatePetMutationVariables["input"]) => {
    try {
      const { data } = await mutate({ variables: { input } });
      return data?.updatePet ?? null;
    } catch (e) {
      console.error("Error updating pet:", e);
      throw e;
    }
  };

  return { updatePet, loading, error };
};
