import { useMutation } from "@apollo/client/react";
import {
  RemoveAppointmentDocument,
  type RemoveAppointmentMutationVariables,
} from "../../../generated/graphql";

export const useRemoveAppointment = () => {
  const [mutate, { loading, error }] = useMutation(RemoveAppointmentDocument);

  const removeAppointment = async (
    input: RemoveAppointmentMutationVariables["input"]
  ) => {
    try {
      const { data } = await mutate({ variables: { input } });
      return data?.removeAppointment ?? null;
    } catch (e) {
      console.error("Error removing appointment:", e);
      throw e;
    }
  };

  return { removeAppointment, loading, error };
};
