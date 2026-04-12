import { useMutation } from "@apollo/client/react";
import {
  CreateAppointmentDocument,
  type CreateAppointmentMutationVariables,
  type CreateAppointmentInput,
} from "../../../generated/graphql";

export type { CreateAppointmentInput as queryInput };

export const useCreateAppointment = () => {
  const [mutate, { loading, error }] = useMutation(CreateAppointmentDocument);

  const createAppointment = async (
    input: CreateAppointmentMutationVariables["input"]
  ) => {
    try {
      const { data } = await mutate({ variables: { input } });
      return data?.createAppointment ?? null;
    } catch (e) {
      console.error("Error creating appointment:", e);
      throw e;
    }
  };

  return { createAppointment, loading, error };
};
