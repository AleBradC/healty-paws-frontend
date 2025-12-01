import { useMutation } from "@apollo/client/react";
import { addDoctorSpecializationMutation } from "../queries";
import type { Doctor } from "../../../types";

interface ServiceInput {
  name: string;
  price: number;
}

interface queryInput {
  doctorId: string;
  specializationName: string;
  services: ServiceInput[];
}

interface queryResponse {
  addDoctorSpecialization: Doctor;
}

export const useAddDoctorSpecialization = () => {
  const [mutate, { loading, error }] = useMutation<
    queryResponse,
    { input: queryInput }
  >(addDoctorSpecializationMutation);

  const addDoctorSpecialization = async (
    input: queryInput
  ): Promise<Doctor | null> => {
    try {
      const { data } = await mutate({
        variables: { input },
      });
      return data?.addDoctorSpecialization || null;
    } catch (e) {
      console.error("Error adding doctor specialization:", e);
      throw e;
    }
  };

  return { addDoctorSpecialization, loading, error };
};
