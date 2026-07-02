import { type FC, type ReactNode, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthentication } from "../../context/AuthenticationContext";
import { homePath } from "../../utils/path";

interface ProtectedRouteProps {
  children?: ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { isLoggedIn, user, isLoading } = useAuthentication();
  const navigate = useNavigate();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || isLoading) {
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
  }, [isClient, isLoading, isLoggedIn, user, navigate, allowedRoles]);

  let isAuthorized = false;
  if (isLoggedIn && user) {
    isAuthorized =
      allowedRoles && allowedRoles.length > 0
        ? allowedRoles.includes(user.role)
        : true;
  }

  if (!isClient || isLoading || !isAuthorized) {
    return null;
  }

  return <>{children ?? <Outlet />}</>;
};
