import { useMutation } from "@apollo/client/react";
import { removeDoctorSpecializationMutation } from "../queries";
import type { Doctor } from "../../../types";

interface queryInput {
  doctorId: string;
  specializationId: string;
}

interface queryResponse {
  removeDoctorSpecialization: Doctor;
}

export const useRemoveDoctorSpecialization = () => {
  const [mutate, { loading, error }] = useMutation<
    queryResponse,
    { input: queryInput }
  >(removeDoctorSpecializationMutation);

  const removeDoctorSpecialization = async (
    input: queryInput
  ): Promise<Doctor | null> => {
    try {
      const { data } = await mutate({
        variables: { input },
      });
      return data?.removeDoctorSpecialization || null;
    } catch (e) {
      console.error("Error removing doctor specialization:", e);
      throw e;
    }
  };

  return { removeDoctorSpecialization, loading, error };
};
