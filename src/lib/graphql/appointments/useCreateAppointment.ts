import { useMutation } from "@apollo/client/react";
import { createAppointmentMutation } from "../queries";

export interface queryInput {
  petId: string;
  doctorId: string;
  appointmentDatetime: string;
  status: string;
  consultationType: string;
}

export interface queryResponse {
  createAppointment: {
    id: string;
    datetime: string;
    status: string;
    consultation_type: string;
    doctor: {
      id: string;
      name: string;
    };
    patient: {
      id: string;
      name: string;
      owner: {
        id: string;
        name: string;
      };
    };
  };
}

export const useCreateAppointment = () => {
  const [mutate, { loading, error }] = useMutation<queryResponse>(
    createAppointmentMutation
  );

  const createAppointment = async (
    input: queryInput
  ): Promise<queryResponse["createAppointment"] | null> => {
    try {
      const { data } = await mutate({
        variables: {
          input,
        },
      });
      return data?.createAppointment ?? null;
    } catch (e) {
      console.error("Error creating appointment:", e);
      throw e;
    }
  };

  return {
    createAppointment,
    loading,
    error,
  };
};
