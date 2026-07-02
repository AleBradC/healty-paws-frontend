import {
  createContext,
  useState,
  useContext,
  useEffect,
  type ReactNode,
} from "react";
import { API_BASE_URL, sessionEndpoint, logoutEndpoint } from "../api/endpoint";
import apolloClient from "../lib/graphql/apollo-wrapper";
import type { ApiResponse } from "../types";

type SessionData = SessionResponse | null;

type SessionResponse = { id: string; email: string; role: string };

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

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}${sessionEndpoint}`, {
          credentials: "include",
        });

        if (cancelled || !res.ok) return;

        const body = (await res.json()) as ApiResponse<SessionData>;
        if (cancelled || !body.data) return;

        setUser({
          id: body.data.id,
          username: body.data.email ?? "",
          role: body.data.role,
        });
        setIsLoggedIn(true);
      } catch {
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = (id: string, role: string) => {
    setUser({ id, username: "", role });
    setIsLoggedIn(true);
  };

  const logout = () => {
    fetch(`${API_BASE_URL}${logoutEndpoint}`, {
      method: "POST",
      credentials: "include",
    }).catch(() => {});
    apolloClient.clearStore().catch(() => {});
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
