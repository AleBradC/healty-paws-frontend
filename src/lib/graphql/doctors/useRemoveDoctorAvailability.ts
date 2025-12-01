import { useMutation } from "@apollo/client/react";
import { removeDoctorAvailabilityMutation } from "../queries";
import type { Doctor } from "../../../types";

interface queryInput {
  doctorId: string;
  availabilityId: string;
}

interface queryResponse {
  removeDoctorAvailability: Doctor;
}

export const useRemoveDoctorAvailability = () => {
  const [mutate, { loading, error }] = useMutation<
    queryResponse,
    { input: queryInput }
  >(removeDoctorAvailabilityMutation);

  const removeDoctorAvailability = async (
    input: queryInput
  ): Promise<Doctor | null> => {
    try {
      const { data } = await mutate({
        variables: { input },
      });

      return data?.removeDoctorAvailability || null;
    } catch (error) {
      console.error("Error removing doctor specialization:", error);
      throw error;
    }
  };

  return { removeDoctorAvailability, loading, error };
};
