import { useMutation } from "@apollo/client/react";
import { createPetMutation } from "../queries";
import type { LifelongCondition, ActiveTreatment } from "../../../types";

export interface queryInput {
  ownerId: string;
  name: string;
  type: string;
  breed: string;
  age: number;
  weight: number;
}

export interface queryResponse {
  createPet: {
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

export const useCreatePet = () => {
  const [mutate, { loading, error }] =
    useMutation<queryResponse>(createPetMutation);

  const createPet = async (
    input: queryInput
  ): Promise<queryResponse["createPet"] | null> => {
    try {
      const { data } = await mutate({ variables: { input } });
      return data?.createPet ?? null;
    } catch (e) {
      console.error("Error creating pet:", e);
      throw e;
    }
  };

  return {
    createPet,
    loading,
    error,
  };
};
