import { useMutation } from "@apollo/client/react";
import {
  RemoveDoctorAvailabilityDocument,
  type RemoveDoctorAvailabilityMutationVariables,
} from "../../../generated/graphql";

export const useRemoveDoctorAvailability = () => {
  const [mutate, { loading, error }] = useMutation(RemoveDoctorAvailabilityDocument);

  const removeDoctorAvailability = async (
    input: RemoveDoctorAvailabilityMutationVariables["input"]
  ) => {
    try {
      const { data } = await mutate({ variables: { input } });
      return data?.removeDoctorAvailability ?? null;
    } catch (e) {
      console.error("Error removing doctor availability:", e);
      throw e;
    }
  };

  return { removeDoctorAvailability, loading, error };
};
