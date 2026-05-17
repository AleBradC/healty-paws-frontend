import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../../../components/ui/Input/Input";
import { Button } from "../../../../components/ui/Button/Button";
import { AuthInfoScreen } from "./AuthInfoScreen";
import { useRequestPasswordReset } from "./useResetPasswordApi";
import {
  requestResetSchema,
  type RequestResetFormValues,
} from "../../../../lib/validation/auth";

export interface RequestResetLinkFormProps {
  onBackToLogin: () => void;
}

export function RequestResetLinkForm({
  onBackToLogin,
}: RequestResetLinkFormProps) {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const { submit, isLoading, error, clearError } = useRequestPasswordReset();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RequestResetFormValues>({
    resolver: zodResolver(requestResetSchema),
    mode: "onChange",
    defaultValues: { email: "" },
  });

  const onSubmit = handleSubmit(async ({ email }) => {
    const trimmed = email.trim();
    const result = await submit(trimmed);
    if (result.ok) setSubmittedEmail(trimmed);
  });

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
      <form className="auth-form" onSubmit={onSubmit} noValidate>
        <Input
          label="Email Address"
          type="email"
          autoComplete="email"
          placeholder="Enter your email address"
          error={errors.email?.message}
          {...register("email", {
            onChange: () => error && clearError(),
          })}
        />
        <div className="auth-actions centered">
          <Button
            text={isLoading ? "Sending..." : "Send Reset Link"}
            color="primary"
            size="lg"
            type="submit"
            disabled={!isValid || isLoading}
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
