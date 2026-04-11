import { useMutation } from "@apollo/client/react";
import {
  UpdateDoctorProfileDocument,
  type UpdateDoctorProfileMutationVariables,
} from "../../../generated/graphql";

export const useUpdateDoctorDetails = () => {
  const [mutate, { loading, error }] = useMutation(UpdateDoctorProfileDocument);

  const updateDoctorDetails = async (
    input: UpdateDoctorProfileMutationVariables["input"]
  ) => {
    try {
      const { data } = await mutate({ variables: { input } });
      return data?.updateDoctorProfile ?? null;
    } catch (e) {
      console.error("Error updating doctor details:", e);
      throw e;
    }
  };

  return { updateDoctorDetails, loading, error };
};
