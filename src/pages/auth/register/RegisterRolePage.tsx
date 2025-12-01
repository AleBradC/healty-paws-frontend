import React, { type FC } from "react";
import { useNavigate } from "react-router-dom";
import { PublicRoute } from "../../../components/PublicRoute/PublicRoute";
import { Button } from "../../../components/Button/Button";
import {
  authLoginPath,
  authRegisterDoctorPath,
  authRegisterPatientPath,
} from "../../../utils/path";
import "../styles.css";

export const RegisterRolePage: FC = () => {
  const navigate = useNavigate();

  const handleRedirect = (path: string) => {
    navigate(path);
  };

  return (
    <PublicRoute>
      <div className="auth-page">
        <div className="auth-card">
          <h1 className="auth-title">Join Healthy Paws</h1>
          <p className="auth-note auth-note-centered">
            How would you like to register?
          </p>

          <div className="auth-role-buttons">
            <Button
              onClick={() => handleRedirect(authRegisterDoctorPath)}
              text="Register as a Doctor"
              color="primary"
              size="lg"
            />
            <Button
              onClick={() => handleRedirect(authRegisterPatientPath)}
              text="Register your pet"
              color="accent"
              size="lg"
            />
          </div>

          <div className="auth-links">
            <p className="auth-note">
              Already have an account?
              <Button
                onClick={() => handleRedirect(authLoginPath)}
                text="Login"
                className="auth-inline-link"
                size="md"
              />
            </p>
          </div>
        </div>
      </div>
    </PublicRoute>
  );
};

export default RegisterRolePage;
