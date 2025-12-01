import React, { type FC } from "react";
import { useNavigate } from "react-router-dom";
import { authLoginPath } from "../../../utils/path";
import { Button } from "../../../components/Button/Button";
import "../styles.css";

export const RegistrationSuccessPage: FC = () => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate(authLoginPath);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-subtitle">Registration Complete!</h2>
        <p className="auth-note">Thank you for joining Healthy Paws.</p>
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
