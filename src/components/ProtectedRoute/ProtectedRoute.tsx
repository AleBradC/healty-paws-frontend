import React, { type FC, type ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthentication } from "../../context/AuthenticationContext";
import { homePath } from "../../utils/path";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { isLoggedIn, user } = useAuthentication();
  const navigate = useNavigate();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) {
      return;
    }

    if (!isLoggedIn || !user) {
      navigate(homePath);
      return;
    }

    if (
      allowedRoles &&
      allowedRoles.length > 0 &&
      !allowedRoles.includes(user.role)
    ) {
      navigate(homePath);
    }
  }, [isClient, isLoggedIn, user, navigate, allowedRoles]);

  let isAuthorized = false;
  if (isLoggedIn && user) {
    isAuthorized =
      allowedRoles && allowedRoles.length > 0
        ? allowedRoles.includes(user.role)
        : true;
  }

  if (!isClient || !isAuthorized) {
    return null;
  }

  return <>{children}</>;
};
