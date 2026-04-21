import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

const GET_SPECIALIZATIONS = gql`
  query GetSpecializations {
    specializations {
      id
      name
    }
  }
`;

export const useSpecializations = () => {
  const { data, loading, error } = useQuery<any>(GET_SPECIALIZATIONS);

  return {
    specializations: data?.specializations ?? [],
    loading,
    error: Boolean(error),
  };
};
