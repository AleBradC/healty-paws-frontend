import { useMutation } from "@apollo/client/react";
import {
  AddDoctorSpecializationDocument,
  type AddDoctorSpecializationMutationVariables,
} from "../../../generated/graphql";

export const useAddDoctorSpecialization = () => {
  const [mutate, { loading, error }] = useMutation(AddDoctorSpecializationDocument);

  const addDoctorSpecialization = async (
    input: AddDoctorSpecializationMutationVariables["input"]
  ) => {
    try {
      const { data } = await mutate({ variables: { input } });
      return data?.addDoctorSpecialization ?? null;
    } catch (e) {
      console.error("Error adding doctor specialization:", e);
      throw e;
    }
  };

  return { addDoctorSpecialization, loading, error };
};
