import { useMutation } from "@apollo/client/react";
import { updateOwnerDetailsMutation } from "../queries";

export interface QueryInput {
  ownerId: string;
  name: string;
}

export interface QueryResponse {
  updateOwnerProfile: {
    id: string;
    name: string;
  };
}

export const useUpdateOwner = () => {
  const [mutate, { loading, error }] = useMutation<QueryResponse>(
    updateOwnerDetailsMutation
  );

  const updateOwner = async (
    input: QueryInput
  ): Promise<QueryResponse["updateOwnerProfile"] | null> => {
    try {
      const { data } = await mutate({ variables: { input } });
      return data?.updateOwnerProfile ?? null;
    } catch (e) {
      console.error("Error updating owner:", e);
      throw e;
    }
  };

  return {
    updateOwner,
    loading,
    error,
  };
};
