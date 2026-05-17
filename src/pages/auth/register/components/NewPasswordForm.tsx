import {
  useCallback,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { Input } from "../../../../components/ui/Input/Input";
import { Button } from "../../../../components/ui/Button/Button";
import { AuthInfoScreen } from "./AuthInfoScreen";
import { useResetPasswordWithToken } from "./useResetPasswordApi";
import {
  PASSWORD_RULE_TEXT,
  validateNewPassword,
} from "./passwordValidation";

export interface NewPasswordFormProps {
  token: string;
  onBackToLogin: () => void;
  onRequestNewLink: () => void;
}

export function NewPasswordForm({
  token,
  onBackToLogin,
  onRequestNewLink,
}: NewPasswordFormProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [clientError, setClientError] = useState<string | undefined>();
  const [success, setSuccess] = useState(false);
  const {
    submit,
    isLoading,
    error: serverError,
    isTokenInvalid,
    clearError,
  } = useResetPasswordWithToken();

  const isFormValid = useMemo(
    () => validateNewPassword(newPassword, confirmPassword) === null,
    [newPassword, confirmPassword]
  );
  const canSubmit = isFormValid && !isLoading;
  const displayedError = clientError ?? serverError;

  const clearErrors = useCallback(() => {
    setClientError(undefined);
    clearError();
  }, [clearError]);

  const handleNewPasswordChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setNewPassword(e.target.value);
      clearErrors();
    },
    [clearErrors]
  );

  const handleConfirmPasswordChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setConfirmPassword(e.target.value);
      clearErrors();
    },
    [clearErrors]
  );

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const validationError = validateNewPassword(newPassword, confirmPassword);
      if (validationError) {
        setClientError(validationError);
        return;
      }
      setClientError(undefined);
      const result = await submit(token, newPassword);
      if (result.ok) setSuccess(true);
    },
    [newPassword, confirmPassword, submit, token]
  );

  if (success) {
    return (
      <AuthInfoScreen
        title="Password reset"
        description="Your password has been updated. You can now sign in with your new password."
        ctaLabel="Back to login"
        onCta={onBackToLogin}
      />
    );
  }

  if (isTokenInvalid) {
    return (
      <AuthInfoScreen
        title="Link expired"
        description="This reset link is invalid or has expired. Request a new one to continue."
        ctaLabel="Request a new link"
        onCta={onRequestNewLink}
      />
    );
  }

  return (
    <>
      <h1 className="auth-title">Set new password</h1>
      <p className="auth-subtitle">Create a new password for your account.</p>
      {displayedError && <p className="global-error">{displayedError}</p>}
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <Input
          label="New Password"
          type="password"
          name="newPassword"
          autoComplete="new-password"
          placeholder="Enter your new password"
          value={newPassword}
          hint={PASSWORD_RULE_TEXT}
          onChange={handleNewPasswordChange}
        />
        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          autoComplete="new-password"
          placeholder="Re-enter your new password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
        />
        <div className="auth-actions centered">
          <Button
            text={isLoading ? "Resetting..." : "Reset Password"}
            color="primary"
            size="lg"
            type="submit"
            disabled={!canSubmit}
          />
        </div>
      </form>
    </>
  );
}
