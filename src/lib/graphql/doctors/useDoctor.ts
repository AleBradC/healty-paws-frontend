import { useQuery } from "@apollo/client/react";
import { doctorQuery } from "../queries";
import type { Doctor } from "../../../types";

interface queryResponse {
  doctor: Doctor;
}

interface queryInput {
  id: string | null;
}

export const useDoctor = (id: string | null) => {
  const { data, loading, error, refetch } = useQuery<queryResponse, queryInput>(
    doctorQuery,
    {
      variables: { id },
      skip: !id,
      fetchPolicy: "network-only",
    }
  );

  return {
    doctor: data?.doctor,
    loading,
    error: Boolean(error),
    refetch,
  };
};
