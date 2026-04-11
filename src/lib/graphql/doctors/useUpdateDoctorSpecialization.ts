import { useMutation } from "@apollo/client/react";
import {
  UpdateDoctorSpecializationDocument,
  type UpdateDoctorSpecializationMutationVariables,
} from "../../../generated/graphql";

export const useUpdateDoctorSpecialization = () => {
  const [mutate, { loading, error }] = useMutation(
    UpdateDoctorSpecializationDocument,
    {
      update(cache, { data }: { data?: { updateDoctorSpecialization?: { id: string; specializations?: unknown } | null } | null }) {
        if (!data?.updateDoctorSpecialization) return;
        cache.modify({
          id: cache.identify({
            __typename: "Doctor",
            id: data.updateDoctorSpecialization.id,
          }),
          fields: {
            specializations() {
              return data.updateDoctorSpecialization?.specializations;
            },
          },
        });
      },
    }
  );

  const updateDoctorSpecialization = async (
    input: UpdateDoctorSpecializationMutationVariables["input"]
  ) => {
    try {
      const { data } = await mutate({ variables: { input } });
      return data?.updateDoctorSpecialization ?? null;
    } catch (e) {
      console.error("Error updating doctor specialization:", e);
      throw e;
    }
  };

  return { updateDoctorSpecialization, loading, error };
};
