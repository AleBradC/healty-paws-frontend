import { useQuery } from "@apollo/client/react";
import { doctorsQuery } from "../queries";

interface queryResponse {
  doctors: {
    items: {
      id: string;
      name: string;
      clinic_name: string;
      clinic_address: string;
      imageUrl?: string;
      specializations: {
        name: string;
      }[];
    }[];
    totalCount: number;
  };
}

export const useDoctors = (limit: number, skip: number) => {
  const { data, loading, error, previousData } = useQuery<queryResponse>(
    doctorsQuery,
    {
      variables: { limit, skip },
      fetchPolicy: "cache-first",
      notifyOnNetworkStatusChange: true,
    }
  );

  return {
    doctors: data?.doctors || previousData?.doctors,
    loading,
    error: Boolean(error),
  };
};
