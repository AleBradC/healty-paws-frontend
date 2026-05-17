import { useState, type FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
import "../styles.css";

type LoginResponse = { id: string; role: string };

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthentication();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [error, setError] = useState<string | undefined>();
  const canSubmitLogin =
    email.trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    password.length >= 6;

  const validateForm = (): string | null => {
    if (!email.trim() && !password) {
      return "Please fill in all required fields.";
    }
    if (!email.trim()) {
      return "Email is required.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Please enter a valid email address.";
    }
    if (!password) {
      return "Password is required.";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters.";
    }
    return null;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: body } = await axios.post<ApiResponse<LoginResponse>>(
        `${API_BASE_URL}${loginEndpoint}`,
        { email, password },
        { withCredentials: true }
      );

      // Token is now an httpOnly cookie set by the server — never touches JS.
      // Use role and id returned in the response body to update auth state.
      const session = body.data;
      if (!session) {
        setError("Login failed. Please try again.");
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
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        setError(
          err.response.data.message ||
            "Login failed. Please check your credentials."
        );
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRedirect = (path: string) => {
    navigate(path);
  };

  return (
    <PublicRoute>
      <div className="auth-page">
        <div className="auth-card">
          <h1 className="auth-title">Login</h1>
          {error && <p className="global-error">{error}</p>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="Email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(undefined);
              }}
            />
            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="Password"
              autoComplete="current-password"
              showToggle
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(undefined);
              }}
            />

            <div className="auth-actions">
              <Button
                text={isSubmitting ? "Logging in..." : "Login"}
                color="accent"
                size="lg"
                type="submit"
                disabled={isSubmitting || !canSubmitLogin}
              />
            </div>
            <div className="auth-links">
              <Button
                onClick={() => handleRedirect(authResetPasswordPath)}
                text="Forgot password?"
                className="auth-inline-link"
                type="button"
              />
              <div>
                <p className="auth-note">Don't have an account?</p>
                <Button
                  onClick={() => handleRedirect(authRegisterPath)}
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
