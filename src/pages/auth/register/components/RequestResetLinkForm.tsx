import { useCallback, useState, type ChangeEvent, type FormEvent } from "react";
import { Input } from "../../../../components/ui/Input/Input";
import { Button } from "../../../../components/ui/Button/Button";
import { AuthInfoScreen } from "./AuthInfoScreen";
import { useRequestPasswordReset } from "./useResetPasswordApi";

export interface RequestResetLinkFormProps {
  onBackToLogin: () => void;
}

export function RequestResetLinkForm({
  onBackToLogin,
}: RequestResetLinkFormProps) {
  const [email, setEmail] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const { submit, isLoading, error, clearError } = useRequestPasswordReset();

  const canSubmit = email.trim().length > 0 && !isLoading;

  const handleEmailChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value);
      clearError();
    },
    [clearError]
  );

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const trimmed = email.trim();
      if (!trimmed) return;
      const result = await submit(trimmed);
      if (result.ok) setSubmittedEmail(trimmed);
    },
    [email, submit]
  );

  if (submittedEmail) {
    return (
      <AuthInfoScreen
        title="Check your email"
        description={
          <>
            If an account exists for <strong>{submittedEmail}</strong>,
            we&apos;ve sent a password reset link. Open it from the same device
            when you&apos;re ready.
          </>
        }
        ctaLabel="Back to login"
        onCta={onBackToLogin}
      />
    );
  }

  return (
    <>
      <h1 className="auth-title">Reset Password</h1>
      <p className="auth-subtitle">
        Enter your email address and we&apos;ll send you a link to reset your
        password.
      </p>
      {error && <p className="global-error">{error}</p>}
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <Input
          label="Email Address"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="Enter your email address"
          value={email}
          onChange={handleEmailChange}
        />
        <div className="auth-actions centered">
          <Button
            text={isLoading ? "Sending..." : "Send Reset Link"}
            color="primary"
            size="lg"
            type="submit"
            disabled={!canSubmit}
          />
        </div>
        <div className="auth-links">
          <Button
            onClick={onBackToLogin}
            text="Back to login"
            className="auth-inline-link"
            type="button"
          />
        </div>
      </form>
    </>
  );
}
