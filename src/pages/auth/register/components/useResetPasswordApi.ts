import { useCallback, useState } from "react";
import axios from "axios";
import {
  API_BASE_URL,
  forgotPasswordEndpoint,
  resetPasswordEndpoint,
} from "../../../../api/endpoint";

const GENERIC_ERROR = "An unexpected error occurred. Please try again.";

function extractError(err: unknown): { status?: number; message: string } {
  if (axios.isAxiosError(err)) {
    return {
      status: err.response?.status,
      message: err.response?.data?.message ?? GENERIC_ERROR,
    };
  }
  return { message: GENERIC_ERROR };
}

type SubmitResult = { ok: true } | { ok: false };

export function useRequestPasswordReset() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const submit = useCallback(async (email: string): Promise<SubmitResult> => {
    setError(undefined);
    setIsLoading(true);
    try {
      await axios.post(`${API_BASE_URL}${forgotPasswordEndpoint}`, { email });
      return { ok: true };
    } catch (err) {
      setError(extractError(err).message);
      return { ok: false };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(undefined), []);

  return { submit, isLoading, error, clearError };
}

export function useResetPasswordWithToken() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [isTokenInvalid, setIsTokenInvalid] = useState(false);

  const submit = useCallback(
    async (token: string, newPassword: string): Promise<SubmitResult> => {
      setError(undefined);
      setIsTokenInvalid(false);
      setIsLoading(true);
      try {
        await axios.post(`${API_BASE_URL}${resetPasswordEndpoint}`, {
          token,
          newPassword,
        });
        return { ok: true };
      } catch (err) {
        const { status, message } = extractError(err);
        // The server returns 400 INVALID_RESET_TOKEN for unknown, expired, or
        // already-used tokens. Branch the UI on that specific case instead of
        // surfacing it as a generic form error.
        if (status === 400) {
          setIsTokenInvalid(true);
        } else {
          setError(message);
        }
        return { ok: false };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const clearError = useCallback(() => setError(undefined), []);

  return { submit, isLoading, error, isTokenInvalid, clearError };
}
