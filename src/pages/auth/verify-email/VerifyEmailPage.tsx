import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  API_BASE_URL,
  verifyEmailEndpoint,
  resendVerificationEndpoint,
} from "../../../api/endpoint";
import { Button } from "../../../components/ui/Button/Button";
import { Input } from "../../../components/ui/Input/Input";
import { authLoginPath } from "../../../utils/path";
import "../styles.css";

type VerifyStatus = "pending" | "verifying" | "success" | "error";

// Three jobs on this page:
//   1. If a ?token is present in the URL → POST it to /verify-email immediately
//      and surface success/failure.
//   2. If no ?token, or after a failure, give the user a form to request a
//      new verification link by entering their email.
//   3. Never reveal whether an email is registered/already verified — the
//      backend is enumeration-safe so the UI mirrors that.
export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<VerifyStatus>(token ? "verifying" : "pending");
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  // React StrictMode double-invokes effects in dev, which would call
  // /verify-email twice for the same token and (correctly) get a "used" error
  // on the second pass. The ref gates against that.
  const hasAttempted = useRef(false);

  useEffect(() => {
    if (!token) return;
    if (hasAttempted.current) return;
    hasAttempted.current = true;

    (async () => {
      try {
        await axios.post(`${API_BASE_URL}${verifyEmailEndpoint}`, { token });
        setStatus("success");
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          setErrorMessage(
            err.response.data?.message ??
              "Verification failed. The link may be expired."
          );
        } else {
          setErrorMessage("An unexpected error occurred.");
        }
        setStatus("error");
      }
    })();
  }, [token]);

  const [email, setEmail] = useState("");
  const [resending, setResending] = useState(false);
  const [resentMessage, setResentMessage] = useState<string | undefined>();

  const handleResend = async () => {
    if (!email.trim() || resending) return;
    setResending(true);
    setResentMessage(undefined);
    try {
      const { data } = await axios.post(
        `${API_BASE_URL}${resendVerificationEndpoint}`,
        { email }
      );
      setResentMessage(
        data?.message ??
          "If this email is registered and unverified, a new link has been sent."
      );
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setResentMessage(
          err.response.data?.message ??
            "Could not send a new link. Please try again later."
        );
      } else {
        setResentMessage("An unexpected error occurred.");
      }
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Verify your email</h1>

        {status === "verifying" && (
          <p className="auth-note">Verifying your email, please wait…</p>
        )}

        {status === "success" && (
          <>
            <p className="auth-note">
              Your email is verified. You can now sign in.
            </p>
            <Button
              text="Go to login"
              color="primary"
              size="lg"
              onClick={() => navigate(authLoginPath)}
            />
          </>
        )}

        {(status === "pending" || status === "error") && (
          <>
            {status === "error" && errorMessage && (
              <p className="global-error">{errorMessage}</p>
            )}
            <p className="auth-note">
              {status === "error"
                ? "The link may have expired. Enter your email to request a new one."
                : "Enter the email you registered with to receive a verification link."}
            </p>
            <div className="auth-form">
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="auth-actions">
                <Button
                  text={resending ? "Sending…" : "Send verification email"}
                  color="accent"
                  size="lg"
                  onClick={handleResend}
                  disabled={!email.trim() || resending}
                />
              </div>
              {resentMessage && <p className="auth-note">{resentMessage}</p>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
