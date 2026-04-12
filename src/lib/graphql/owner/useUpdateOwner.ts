import { useMutation } from "@apollo/client/react";
import {
  UpdateOwnerProfileDocument,
  type UpdateOwnerProfileMutation,
  type UpdateOwnerProfileMutationVariables,
} from "../../../generated/graphql";

export type { UpdateOwnerProfileInput as queryInput } from "../../../generated/graphql";

export const useUpdateOwner = () => {
  const [mutate, { loading, error }] = useMutation(UpdateOwnerProfileDocument);

  const updateOwner = async (
    input: UpdateOwnerProfileMutationVariables["input"]
  ): Promise<UpdateOwnerProfileMutation["updateOwnerProfile"] | null> => {
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
