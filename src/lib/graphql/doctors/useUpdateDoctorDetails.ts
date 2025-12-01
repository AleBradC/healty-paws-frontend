import { useMutation } from "@apollo/client/react";
import { updateDoctorDetailsMutation } from "../queries";
import type { Doctor } from "../../../types";

interface queryInput {
  doctorId: string;
  name?: string;
  clinicName?: string;
  clinicAddress?: string;
}

interface queryResponse {
  updateDoctorProfile: Doctor;
}

export const useUpdateDoctorDetails = () => {
  const [mutate, { loading, error }] = useMutation<
    queryResponse,
    { input: queryInput }
  >(updateDoctorDetailsMutation);

  const updateDoctorDetails = async (
    input: queryInput
  ): Promise<Doctor | null> => {
    try {
      const { data } = await mutate({
        variables: { input },
      });
      return data?.updateDoctorProfile || null;
    } catch (e) {
      console.error("Error updating doctor details:", e);
      throw e;
    }
  };

  return {
    updateDoctorDetails,
    loading,
    error,
  };
};
