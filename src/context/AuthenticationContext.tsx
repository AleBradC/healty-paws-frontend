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

  // On mount, restore session by calling /session. The httpOnly cookie is sent
  // automatically. Since the JWT is httpOnly we can't decode exp client-side —
  // the server is the source of truth. A 401 means the token is expired or
  // invalid, in which case we proactively evict the stale cookie so subsequent
  // requests don't keep carrying it.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}${sessionEndpoint}`, {
          credentials: "include",
        });

        if (cancelled) return;

        if (res.ok) {
          const data = await res.json();
          if (!cancelled && data?.data) {
            setUser({
              id: data.data.id,
              username: data.data.email ?? "",
              role: data.data.role,
            });
            setIsLoggedIn(true);
          }
        } else if (res.status === 401) {
          // Token expired or invalid — clear the stale cookie server-side.
          fetch(`${API_BASE_URL}${logoutEndpoint}`, {
            method: "POST",
            credentials: "include",
          }).catch(() => {});
        }
        // Other status codes (5xx, etc.) — stay silent, user is treated as
        // logged-out and can retry.
      } catch {
        // Network failure — stay silent, treat as logged-out.
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
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
