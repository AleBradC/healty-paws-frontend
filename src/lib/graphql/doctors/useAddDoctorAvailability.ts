import { useMutation } from "@apollo/client/react";
import {
  AddDoctorAvailabilityDocument,
  type AddDoctorAvailabilityMutationVariables,
} from "../../../generated/graphql";

export const useAddDoctorAvailability = () => {
  const [mutate, { loading, error }] = useMutation(AddDoctorAvailabilityDocument);

  const addDoctorAvailability = async (
    input: AddDoctorAvailabilityMutationVariables["input"]
  ) => {
    try {
      const { data } = await mutate({ variables: { input } });
      return data?.addDoctorAvailability ?? null;
    } catch (e) {
      console.error("Error adding doctor availability:", e);
      throw e;
    }
  };

  return { addDoctorAvailability, loading, error };
};
