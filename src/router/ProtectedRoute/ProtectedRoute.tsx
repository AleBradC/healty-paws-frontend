import { type FC, type ReactNode, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthentication } from "../../context/AuthenticationContext";
import { homePath } from "../../utils/path";

interface ProtectedRouteProps {
  // When used as a layout route in React Router (i.e. <Route element={...}>),
  // children is undefined and the component renders <Outlet/>. When used as
  // a per-page wrapper (the original pattern), the explicit children are
  // rendered. Both modes coexist so route-level guards in App.tsx can act as
  // the source of truth while individual pages keep their defensive wrapper
  // as a second line of defense.
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
