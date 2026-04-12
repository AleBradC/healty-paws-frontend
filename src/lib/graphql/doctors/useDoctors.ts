import { useQuery } from "@apollo/client/react";
import {
  GetDoctorsDocument,
  type GetDoctorsQueryVariables,
} from "../../../generated/graphql";

export const useDoctors = (limit: number, skip: number) => {
  const variables: GetDoctorsQueryVariables = { limit, skip };
  const { data, loading, error, previousData } = useQuery(GetDoctorsDocument, {
    variables,
    fetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
  });

  return {
    doctors: data?.doctors ?? previousData?.doctors,
    loading,
    error: Boolean(error),
  };
};
