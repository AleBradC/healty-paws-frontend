import { useQuery } from "@apollo/client/react";
import {
  GetDoctorDocument,
  type GetDoctorQueryVariables,
} from "../../../generated/graphql";

export const useDoctor = (id: string | null) => {
  const variables: GetDoctorQueryVariables = { id: id ?? "" };
  const { data, loading, error, refetch } = useQuery(GetDoctorDocument, {
    variables,
    skip: !id,
    fetchPolicy: "network-only",
  });

  return { doctor: data?.doctor, loading, error: Boolean(error), refetch };
};
