import { useQuery } from "@apollo/client/react";
import { appointmentQuery } from "../queries";
import type { Appointment } from "../../../types";

interface queryInput {
  id: string | undefined;
}
interface queryResponse {
  appointment: Appointment;
}

export const useAppointment = (id: string) => {
  const { data, loading, error, refetch } = useQuery<queryResponse, queryInput>(
    appointmentQuery,
    {
      variables: { id: id },
      skip: !id,
      fetchPolicy: "network-only",
    }
  );

  return {
    appointment: data?.appointment,
    loading,
    error,
    refetch,
  };
};
