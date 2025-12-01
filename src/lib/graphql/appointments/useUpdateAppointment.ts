import { useMutation } from "@apollo/client/react";
import { updateAppointment } from "../queries";
import type { Appointment } from "../../../types";

export interface AppointmentPetDetailsInput {
  name?: string;
  type?: string;
  breed?: string;
  age?: number;
  weight?: number;
}

export interface LifelongConditionInput {
  id?: string;
  condition: string;
  treatment: string;
}

export interface ActiveTreatmentInput {
  id?: string;
  condition: string;
  treatment: string;
  start_date: string;
  end_date?: string;
}

export interface queryInput {
  appointmentId: string;
  status?: string;
  reason?: string;
  consultationType?: string;
  investigation?: string;
  investigationResult?: string;
  patientDetails?: AppointmentPetDetailsInput;
  lifelongConditions?: LifelongConditionInput[];
  activeTreatments?: ActiveTreatmentInput[];
}

export interface queryResponse {
  updateAppointment: Appointment;
}

export const useUpdateAppointment = () => {
  const [mutate, { loading, error }] = useMutation<
    queryResponse,
    { input: queryInput }
  >(updateAppointment);

  const updateAppointmentDetails = async (
    input: queryInput
  ): Promise<Appointment | null> => {
    try {
      const { data } = await mutate({ variables: { input } });
      return data?.updateAppointment || null;
    } catch (e) {
      console.error("Error updating doctor details:", e);
      throw e;
    }
  };

  return { updateAppointmentDetails, loading, error };
};
