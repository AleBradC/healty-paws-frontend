import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  API_BASE_URL,
  loginEndpoint,
  resendVerificationEndpoint,
} from "../../../api/endpoint";
import { Input } from "../../../components/ui/Input/Input";
import { PublicRoute } from "../../../router/PublicRoute/PublicRoute";
import { useAuthentication } from "../../../context/AuthenticationContext";
import { Button } from "../../../components/ui/Button/Button";
import {
  authResetPasswordPath,
  authRegisterPath,
  homePath,
} from "../../../utils/path";
import type { ApiResponse } from "../../../types";
import {
  loginSchema,
  type LoginFormValues,
} from "../../../lib/validation/auth";
import "../styles.css";

type LoginResponse = { id: string; role: string };

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthentication();
  const [serverError, setServerError] = useState<string | undefined>();
  // When the backend returns 403 EMAIL_NOT_VERIFIED, we surface a CTA that
  // re-sends the verification link to the email the user just typed. We store
  // the email here (rather than just reading from the form values) so the
  // CTA still works after the user has cleared/modified the field.
  const [needsVerification, setNeedsVerification] = useState<{
    email: string;
  } | null>(null);
  const [resendInfo, setResendInfo] = useState<string | undefined>();
  const [resending, setResending] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  const handleResendVerification = async () => {
    if (!needsVerification || resending) return;
    setResending(true);
    setResendInfo(undefined);
    try {
      const { data } = await axios.post(
        `${API_BASE_URL}${resendVerificationEndpoint}`,
        { email: needsVerification.email }
      );
      setResendInfo(
        data?.message ??
          "If this email is registered and unverified, a new link has been sent."
      );
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setResendInfo(err.response.data.message);
      } else {
        setResendInfo("Could not send a new link. Please try again later.");
      }
    } finally {
      setResending(false);
    }
  };

  // Gate the submit button on emptiness so it matches the old UX (disabled
  // until the user has typed something in both fields). Zod handles message
  // generation once they start interacting.
  const values = watch();
  const hasValues = Boolean(values.email && values.password);
  const hasErrors = Boolean(errors.email || errors.password);
  const canSubmit = hasValues && !hasErrors && !isSubmitting;

  const onSubmit = handleSubmit(async ({ email, password }) => {
    setServerError(undefined);
    setNeedsVerification(null);
    setResendInfo(undefined);
    try {
      const { data: body } = await axios.post<ApiResponse<LoginResponse>>(
        `${API_BASE_URL}${loginEndpoint}`,
        { email, password },
        { withCredentials: true }
      );

      const session = body.data;
      if (!session) {
        setServerError("Login failed. Please try again.");
        return;
      }

      login(session.id, session.role);

      if (session.role === "owner") {
        navigate("/dashboard/owner");
      } else if (session.role === "doctor") {
        navigate("/dashboard/doctor");
      } else {
        navigate(homePath);
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        // 403 is the dedicated unverified-email status. Switch the UI from
        // "wrong creds" to a resend prompt so the user has a one-click
        // recovery path. The email is captured from the form values.
        if (err.response.status === 403) {
          setNeedsVerification({ email });
          setServerError(
            err.response.data.message ??
              "Please verify your email address before signing in."
          );
        } else {
          setServerError(
            err.response.data.message ||
              "Login failed. Please check your credentials."
          );
        }
      } else {
        setServerError("An unexpected error occurred. Please try again.");
      }
    }
  });

  return (
    <PublicRoute>
      <div className="auth-page">
        <div className="auth-card">
          <h1 className="auth-title">Login</h1>
          {serverError && <p className="global-error">{serverError}</p>}
          {needsVerification && (
            <div className="auth-form" style={{ marginBottom: "1rem" }}>
              <Button
                text={resending ? "Sending…" : "Resend verification email"}
                color="accent"
                size="md"
                type="button"
                onClick={handleResendVerification}
                disabled={resending}
              />
              {resendInfo && (
                <p className="auth-note" style={{ marginTop: "0.5rem" }}>
                  {resendInfo}
                </p>
              )}
            </div>
          )}

          <form className="auth-form" onSubmit={onSubmit} noValidate>
            <Input
              label="Email"
              type="email"
              placeholder="Email"
              autoComplete="email"
              error={errors.email?.message}
              {...register("email", {
                onChange: () => serverError && setServerError(undefined),
              })}
            />
            <Input
              label="Password"
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              showToggle
              error={errors.password?.message}
              {...register("password", {
                onChange: () => serverError && setServerError(undefined),
              })}
            />

            <div className="auth-actions">
              <Button
                text={isSubmitting ? "Logging in..." : "Login"}
                color="accent"
                size="lg"
                type="submit"
                disabled={!canSubmit}
              />
            </div>
            <div className="auth-links">
              <Button
                onClick={() => navigate(authResetPasswordPath)}
                text="Forgot password?"
                className="auth-inline-link"
                type="button"
              />
              <div>
                <p className="auth-note">Don't have an account?</p>
                <Button
                  onClick={() => navigate(authRegisterPath)}
                  text="Register"
                  className="auth-inline-link"
                  type="button"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </PublicRoute>
  );
}
