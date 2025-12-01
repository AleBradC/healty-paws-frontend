import { useMutation } from "@apollo/client/react";
import { updatePetMutation } from "../queries";
import type { LifelongCondition, ActiveTreatment } from "../../../types";

export interface queryInput {
  petId: string;
  name: string;
  type: string;
  breed: string;
  age: number;
  weight: number;
}

export interface queryResponse {
  updatePet: {
    id: string;
    name: string;
    age: number;
    weight: number;
    type: string;
    breed: string;
    lifelong_conditions: LifelongCondition[];
    active_treatments: ActiveTreatment[];
  };
}

export const useUpdatePet = () => {
  const [mutate, { loading, error }] =
    useMutation<queryResponse>(updatePetMutation);

  const updatePet = async (
    input: queryInput
  ): Promise<queryResponse["updatePet"] | null> => {
    try {
      const { data } = await mutate({ variables: { input } });
      return data?.updatePet ?? null;
    } catch (e) {
      console.error("Error updating pet:", e);
      throw e;
    }
  };

  return {
    updatePet,
    loading,
    error,
  };
};
