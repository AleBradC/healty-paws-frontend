import { useMutation } from "@apollo/client/react";
import {
  UpdateAppointmentDocument,
  type UpdateAppointmentMutationVariables,
} from "../../../generated/graphql";

export const useUpdateAppointment = () => {
  const [mutate, { loading, error }] = useMutation(UpdateAppointmentDocument);

  const updateAppointmentDetails = async (
    input: UpdateAppointmentMutationVariables["input"]
  ) => {
    try {
      const { data } = await mutate({ variables: { input } });
      return data?.updateAppointment ?? null;
    } catch (e) {
      console.error("Error updating appointment:", e);
      throw e;
    }
  };

  return { updateAppointmentDetails, loading, error };
};
