import { useMutation } from "@apollo/client/react";
import {
  RemoveDoctorSpecializationDocument,
  type RemoveDoctorSpecializationMutationVariables,
} from "../../../generated/graphql";

export const useRemoveDoctorSpecialization = () => {
  const [mutate, { loading, error }] = useMutation(RemoveDoctorSpecializationDocument);

  const removeDoctorSpecialization = async (
    input: RemoveDoctorSpecializationMutationVariables["input"]
  ) => {
    try {
      const { data } = await mutate({ variables: { input } });
      return data?.removeDoctorSpecialization ?? null;
    } catch (e) {
      console.error("Error removing doctor specialization:", e);
      throw e;
    }
  };

  return { removeDoctorSpecialization, loading, error };
};
