import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { API_BASE_URL, loginEndpoint } from "../../../api/endpoint";
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

  // Gate the submit button on emptiness so it matches the old UX (disabled
  // until the user has typed something in both fields). Zod handles message
  // generation once they start interacting.
  const values = watch();
  const hasValues = Boolean(values.email && values.password);
  const hasErrors = Boolean(errors.email || errors.password);
  const canSubmit = hasValues && !hasErrors && !isSubmitting;

  const onSubmit = handleSubmit(async ({ email, password }) => {
    setServerError(undefined);
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
        setServerError(
          err.response.data.message ||
            "Login failed. Please check your credentials."
        );
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
