import { useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PublicRoute } from "../../../router/PublicRoute/PublicRoute";
import { authLoginPath, authResetPasswordPath } from "../../../utils/path";
import { RequestResetLinkForm } from "./components/RequestResetLinkForm";
import { NewPasswordForm } from "./components/NewPasswordForm";
import "../styles.css";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const goToLogin = useCallback(() => navigate(authLoginPath), [navigate]);
  const restartReset = useCallback(
    () => navigate(authResetPasswordPath, { replace: true }),
    [navigate],
  );

  return (
    <PublicRoute>
      <div className="auth-page">
        <div className="auth-card">
          {token ? (
            <NewPasswordForm
              token={token}
              onBackToLogin={goToLogin}
              onRequestNewLink={restartReset}
            />
          ) : (
            <RequestResetLinkForm onBackToLogin={goToLogin} />
          )}
        </div>
      </div>
    </PublicRoute>
  );
}
