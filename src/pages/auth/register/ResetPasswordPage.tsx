import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../../api/endpoint";
import { Input } from "../../../components/ui/Input/Input";
import { PublicRoute } from "../../../router/PublicRoute/PublicRoute";
import { authLoginPath } from "../../../utils/path";
import { Button } from "../../../components/ui/Button/Button";
import "../styles.css";

type ResetStep = "email" | "code" | "password" | "success";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<ResetStep>("email");
  const [newPassword, setNewPassword] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const canSendResetCode = email.trim().length > 0;
  const canVerifyCode = code.trim().length === 6;
  const canResetPassword = newPassword.length >= 8;

  const handleRedirect = (path: string) => navigate(path);

  const apiCall = async (url: string, body: any) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/${url}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  };

  const handleSubmitEmail = async (e: FormEvent) => {
    e.preventDefault();
    setError(undefined);

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      await apiCall("reset-password/send-code", { email });
      setCurrentStep("code");
    } catch (err: any) {
      setError(err.message || "Failed to send reset code");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitCode = async (e: FormEvent) => {
    e.preventDefault();
    setError(undefined);

    if (!code.trim()) {
      setError("Please enter the verification code.");
      return;
    }

    if (code.length !== 6) {
      setError("The code must be exactly 6 digits.");
      return;
    }

    setIsSubmitting(true);

    try {
      await apiCall("reset-password/verify-code", { email, code });
      setCurrentStep("password");
    } catch (err: any) {
      setError(err.message || "Invalid or expired code");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitPassword = async (e: FormEvent) => {
    e.preventDefault();
    setError(undefined);

    if (!newPassword) {
      setError("Please enter a new password.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setIsSubmitting(true);

    try {
      await apiCall("reset-password/reset", { email, code, newPassword });
      setMessage("Your password has been successfully reset!");
      setCurrentStep("success");
    } catch (err: any) {
      setError(err.message || "Failed to reset password");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case "email":
        return "Reset Password";
      case "code":
        return "Verify Your Email";
      case "password":
        return "Set New Password";
      default:
        return "Success!";
    }
  };

  const getStepSubtitle = () => {
    switch (currentStep) {
      case "email":
        return "Enter your email address to receive a reset code";
      case "code":
        return "Enter the 6-digit code sent to your email";
      case "password":
        return "Create a new password for your account";
      default:
        return "";
    }
  };

  if (currentStep === "success" && message) {
    return (
      <PublicRoute>
        <div className="auth-page">
          <div className="auth-card">
            <h1 className="auth-title">{getStepTitle()}</h1>
            <div className="confirmation-step">
              <p className="auth-note">{message}</p>
              <div className="auth-actions">
                <Button
                  onClick={() => handleRedirect(authLoginPath)}
                  text="Return to Login"
                  color="primary"
                  size="md"
                />
              </div>
            </div>
          </div>
        </div>
      </PublicRoute>
    );
  }

  return (
    <PublicRoute>
      <div className="auth-page">
        <div className="auth-card">
          <h1 className="auth-title">{getStepTitle()}</h1>
          {currentStep !== "success" && (
            <p className="auth-subtitle">{getStepSubtitle()}</p>
          )}
          {error && <p className="global-error">{error}</p>}
          {currentStep === "email" && (
            <form className="auth-form" onSubmit={handleSubmitEmail} noValidate>
              <Input
                label="Email Address"
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(undefined);
                }}
              />
              <div className="auth-actions centered">
                <Button
                  text={isSubmitting ? "Sending Code..." : "Send Reset Code"}
                  color="primary"
                  size="lg"
                  type="submit"
                  disabled={isSubmitting || !canSendResetCode}
                />
              </div>
              <div className="auth-links">
                <Button
                  onClick={() => handleRedirect(authLoginPath)}
                  text="Back to login"
                  className="auth-inline-link"
                  type="button"
                />
              </div>
            </form>
          )}

          {currentStep === "code" && (
            <form className="auth-form" onSubmit={handleSubmitCode} noValidate>
              <Input
                label="Verification Code"
                type="text"
                name="code"
                placeholder="Enter 6-digit code"
                maxLength={6}
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.replace(/\D/g, ""));
                  if (error) setError(undefined);
                }}
              />
              <p className="auth-note">
                Code sent to <strong>{email}</strong>
                <br />
                <button
                  type="button"
                  className="auth-inline-link"
                  onClick={() => {
                    setCurrentStep("email");
                    setError(undefined);
                  }}
                  style={{
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    padding: 0,
                    font: "inherit",
                  }}
                >
                  Change Email
                </button>
              </p>
              <div className="auth-actions centered">
                <Button
                  text={isSubmitting ? "Verifying..." : "Verify Code"}
                  color="primary"
                  size="lg"
                  type="submit"
                  disabled={isSubmitting || !canVerifyCode}
                />
              </div>
            </form>
          )}

          {currentStep === "password" && (
            <form
              className="auth-form"
              onSubmit={handleSubmitPassword}
              noValidate
            >
              <Input
                label="New Password"
                type="password"
                name="newPassword"
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (error) setError(undefined);
                }}
                minLength={6}
              />
              <p className="auth-note">
                Password must be at least 8 characters
                <br />
                <button
                  type="button"
                  className="auth-inline-link"
                  onClick={() => {
                    setCurrentStep("code");
                    setError(undefined);
                  }}
                  style={{
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    padding: 0,
                    font: "inherit",
                  }}
                >
                  Back to Code
                </button>
              </p>
              <div className="auth-actions centered">
                <Button
                  text={isSubmitting ? "Resetting..." : "Reset Password"}
                  color="primary"
                  size="lg"
                  type="submit"
                  disabled={isSubmitting || !canResetPassword}
                />
              </div>
            </form>
          )}
        </div>
      </div>
    </PublicRoute>
  );
}
