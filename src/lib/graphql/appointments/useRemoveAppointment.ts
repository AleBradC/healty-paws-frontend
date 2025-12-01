import { useMutation } from "@apollo/client/react";
import { removeAppointmentMutation } from "../queries";
import type { Appointment } from "../../../types";

export interface queryInput {
  appointmentId: string;
}

export interface queryResponse {
  removeDoctorAppointment: Appointment;
}

export const useRemoveAppointment = () => {
  const [mutate, { loading, error }] = useMutation<
    queryResponse,
    { input: queryInput }
  >(removeAppointmentMutation, {
    update(cache, { data }) {
      if (!data?.removeDoctorAppointment) return;

      const removedId = data.removeDoctorAppointment.id;

      cache.modify({
        fields: {
          appointments(existingRefs = [], { readField }) {
            return existingRefs.filter(
              (ref: any) => readField("id", ref) !== removedId
            );
          },
        },
      });
    },
  });

  const removeAppointment = async (
    input: queryInput
  ): Promise<Appointment | null> => {
    try {
      const { data } = await mutate({ variables: { input } });
      return data?.removeDoctorAppointment || null;
    } catch (error) {
      console.error("Error removing doctor appointment:", error);
      throw error;
    }
  };

  return { removeAppointment, loading, error };
};
