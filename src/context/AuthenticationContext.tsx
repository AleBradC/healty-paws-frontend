import {
  createContext,
  useState,
  useContext,
  useEffect,
  type ReactNode,
} from "react";
import { API_BASE_URL, sessionEndpoint, logoutEndpoint } from "../api/endpoint";

interface User {
  id: string;
  username: string;
  profilePicture?: string;
  role: string;
}
interface AuthenticationContextType {
  isLoggedIn: boolean;
  user: User | null;
  isLoading: boolean;
  login: (id: string, role: string) => void;
  logout: () => void;
}

const AuthenticationContext = createContext<
  AuthenticationContextType | undefined
>(undefined);

export const AuthenticationProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, restore session by calling /me. The httpOnly cookie is sent
  // automatically — no localStorage token read needed.
  useEffect(() => {
    fetch(`${API_BASE_URL}${sessionEndpoint}`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.data) {
          setUser({
            id: data.data.id,
            username: data.data.email ?? "",
            role: data.data.role,
          });
          setIsLoggedIn(true);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  // Called after a successful POST /login — cookie is already set by the server.
  const login = (id: string, role: string) => {
    setUser({ id, username: "", role });
    setIsLoggedIn(true);
  };

  // Clears the httpOnly cookie server-side, then resets local state.
  const logout = () => {
    fetch(`${API_BASE_URL}${logoutEndpoint}`, {
      method: "POST",
      credentials: "include",
    }).catch(() => {});
    setUser(null);
    setIsLoggedIn(false);
  };

  const contextValue = {
    isLoggedIn,
    user,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthenticationContext.Provider value={contextValue}>
      {children}
    </AuthenticationContext.Provider>
  );
};

export const useAuthentication = () => {
  const context = useContext(AuthenticationContext);
  if (context === undefined) {
    throw new Error(
      "useAuthentication must be used within an AuthenticationProvider"
    );
  }
  return context;
};
