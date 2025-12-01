import { useMutation } from "@apollo/client/react";
import { addDoctorAvailabilityMutation } from "../queries";
import type { Doctor } from "../../../types";

export interface queryResponse {
  addDoctorAvailability: Doctor;
}

export interface queryInput {
  doctorId: string;
  availabilities: string[];
}

export const useAddDoctorAvailability = () => {
  const [mutate, { loading, error }] = useMutation<queryResponse>(
    addDoctorAvailabilityMutation
  );

  const addDoctorAvailability = async (
    input: queryInput
  ): Promise<Doctor | null> => {
    try {
      const { data } = await mutate({
        variables: {
          input,
        },
      });
      return data?.addDoctorAvailability || null;
    } catch (e) {
      console.error("Error adding doctor availability:", e);
      throw e;
    }
  };

  return {
    addDoctorAvailability,
    loading,
    error,
  };
};
