import { type FC, type ReactNode, useEffect, useState } from "react";
import { useAuthentication } from "../../context/AuthenticationContext";
import { useNavigate } from "react-router-dom";
import { homePath } from "../../utils/path";

interface PublicRouteProps {
  children: ReactNode;
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

  return <>{children}</>;
};
