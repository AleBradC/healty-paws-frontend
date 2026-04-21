import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

const GET_DOCTORS = gql`
  query GetDoctors($limit: Int, $skip: Int, $name: String, $specializationId: ID) {
    doctors(limit: $limit, skip: $skip, name: $name, specializationId: $specializationId) {
      items {
        id
        name
        clinic_address
        clinic_name
        email
        specializations {
          id
          name
        }
      }
      totalCount
    }
  }
`;

export const useDoctors = (
  limit: number,
  skip: number,
  name?: string,
  specializationId?: string
) => {
  const { data, loading, error, previousData } = useQuery<any>(GET_DOCTORS, {
    variables: {
      limit,
      skip,
      name: name || undefined,
      specializationId: specializationId || undefined,
    },
    fetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
  });

  return {
    doctors: data?.doctors ?? previousData?.doctors,
    loading,
    error: Boolean(error),
  };
};
