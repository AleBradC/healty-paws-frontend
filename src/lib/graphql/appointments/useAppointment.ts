import { useQuery } from "@apollo/client/react";
import {
  GetAppointmentDocument,
  type GetAppointmentQueryVariables,
} from "../../../generated/graphql";

export const useAppointment = (id: string) => {
  const variables: GetAppointmentQueryVariables = { id };
  const { data, loading, error, refetch } = useQuery(GetAppointmentDocument, {
    variables,
    skip: !id,
    fetchPolicy: "network-only",
  });

  return { appointment: data?.appointment, loading, error, refetch };
};
