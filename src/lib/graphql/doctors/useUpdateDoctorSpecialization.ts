import { useMutation } from "@apollo/client/react";
import { updateDoctorSpecializationMutation } from "../queries";
import type { Doctor } from "../../../types";

interface ServiceUpdateInput {
  id: string | null;
  name: string;
  price: number;
}

interface queryInput {
  doctorId: string;
  specializationId: string;
  services: ServiceUpdateInput[];
}

interface queryResponse {
  updateDoctorSpecialization: Doctor;
}

export const useUpdateDoctorSpecialization = () => {
  const [mutate, { loading, error }] = useMutation<
    queryResponse,
    { input: queryInput }
  >(updateDoctorSpecializationMutation, {
    update(cache, { data }) {
      if (!data?.updateDoctorSpecialization) return;
      cache.modify({
        id: cache.identify({
          __typename: "Doctor",
          id: data.updateDoctorSpecialization.id,
        }),
        fields: {
          specializations() {
            return data.updateDoctorSpecialization.specializations;
          },
        },
      });
    },
  });

  const updateDoctorSpecialization = async (
    input: queryInput
  ): Promise<Doctor | null> => {
    try {
      const { data } = await mutate({
        variables: { input },
      });
      return data?.updateDoctorSpecialization || null;
    } catch (e) {
      console.error("Error updating doctor specialization and services:", e);
      throw e;
    }
  };

  return { updateDoctorSpecialization, loading, error };
};
