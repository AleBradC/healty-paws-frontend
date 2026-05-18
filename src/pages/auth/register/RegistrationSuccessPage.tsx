import { type FC } from "react";
import { useNavigate } from "react-router-dom";
import { authLoginPath } from "../../../utils/path";
import { Button } from "../../../components/ui/Button/Button";
import "../styles.css";

export const RegistrationSuccessPage: FC = () => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate(authLoginPath);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-subtitle">Check your email</h2>
        <p className="auth-note">
          We've sent you a verification link. Click it to activate your account
          before signing in.
        </p>
        <p className="auth-note" style={{ fontSize: "0.85rem", color: "#666" }}>
          The link expires in 24 hours. If it doesn't arrive within a few
          minutes, check your spam folder or request a new one from the
          login page.
        </p>
        <Button
          text="Proceed to Login"
          color="primary"
          size="lg"
          onClick={handleRedirect}
        />
      </div>
    </div>
  );
};

export default RegistrationSuccessPage;
