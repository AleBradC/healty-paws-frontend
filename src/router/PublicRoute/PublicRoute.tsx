import { type FC, type ReactNode, useEffect, useState } from "react";
import { useAuthentication } from "../../context/AuthenticationContext";
import { Outlet, useNavigate } from "react-router-dom";
import { homePath } from "../../utils/path";

interface PublicRouteProps {
  // Optional so the component works both as a per-page wrapper and as a
  // route-level layout via <Route element={<PublicRoute />}>.
  children?: ReactNode;
}

export const PublicRoute: FC<PublicRouteProps> = ({ children }) => {
  const { isLoggedIn } = useAuthentication();
  const navigate = useNavigate();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && isLoggedIn) {
      navigate(homePath);
    }
  }, [isClient, isLoggedIn, navigate]);

  if (!isClient || isLoggedIn) {
    return null;
  }

  return <>{children ?? <Outlet />}</>;
};
