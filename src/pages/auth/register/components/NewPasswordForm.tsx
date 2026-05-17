import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Input } from "../../../../components/ui/Input/Input";
import { Button } from "../../../../components/ui/Button/Button";
import { AuthInfoScreen } from "./AuthInfoScreen";
import { useResetPasswordWithToken } from "./useResetPasswordApi";
import {
  newPasswordSchema,
  PASSWORD_RULE_TEXT,
  type NewPasswordFormValues,
} from "../../../../lib/validation/auth";

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
  const [success, setSuccess] = useState(false);
  const {
    submit,
    isLoading,
    error: serverError,
    isTokenInvalid,
    clearError,
  } = useResetPasswordWithToken();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<NewPasswordFormValues>({
    resolver: zodResolver(newPasswordSchema),
    mode: "onChange",
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const onSubmit = handleSubmit(async ({ newPassword }) => {
    const result = await submit(token, newPassword);
    if (result.ok) setSuccess(true);
  });

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
      {serverError && <p className="global-error">{serverError}</p>}
      <form className="auth-form" onSubmit={onSubmit} noValidate>
        <Input
          label="New Password"
          type="password"
          autoComplete="new-password"
          placeholder="Enter your new password"
          hint={PASSWORD_RULE_TEXT}
          error={errors.newPassword?.message}
          {...register("newPassword", {
            onChange: () => serverError && clearError(),
          })}
        />
        <Input
          label="Confirm Password"
          type="password"
          autoComplete="new-password"
          placeholder="Re-enter your new password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword", {
            onChange: () => serverError && clearError(),
          })}
        />
        <div className="auth-actions centered">
          <Button
            text={isLoading ? "Resetting..." : "Reset Password"}
            color="primary"
            size="lg"
            type="submit"
            disabled={!isValid || isLoading}
          />
        </div>
      </form>
    </>
  );
}
