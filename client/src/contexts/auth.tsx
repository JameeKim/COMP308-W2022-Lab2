import {
  ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState,
} from "react";
import { Navigate, useNavigate } from "react-router-dom";

import type { StudentData, StudentDataFromServer } from "@dohyunkim/common";

export interface AuthCredentials {
  id: string,
  password: string,
}

export interface AuthRequestResult {
  success: boolean;
  response: Response;
}

/**
 * Context data type
 */
export interface AuthContextData {
  readonly whoamiInProgress: boolean;
  readonly user: StudentDataFromServer | null;
  readonly setUser: (newUser: StudentDataFromServer | null) => void;
  readonly signIn: (credentials: AuthCredentials) => Promise<AuthRequestResult>;
  readonly signOut: () => Promise<AuthRequestResult>;
  readonly register: (data: StudentData) => Promise<AuthRequestResult>;
  readonly update: (data: StudentData) => Promise<AuthRequestResult>;
  readonly doWhoami: () => void;
}

const AuthContext = createContext<AuthContextData | null>(null);
AuthContext.displayName = "Auth";

export class AuthContextError extends Error {}

/**
 * Use data from AuthContext
 */
export const useAuth = (): AuthContextData => {
  const data = useContext(AuthContext);
  if (!data) throw new AuthContextError("useAuth must be used with AuthProvider");
  return data;
};

/**
 * Redirect to the sign in page if not logged in (initial render happens)
 */
export const useRequireAuth = (redirectTo = "/auth/sign-in"): boolean => {
  const { whoamiInProgress, user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user && !whoamiInProgress) navigate(redirectTo, { replace: true });
  }, [navigate, redirectTo, user, whoamiInProgress]);
  return whoamiInProgress;
};

/**
 * Redirect to the provided url if the user is already logged in (initial render happens)
 */
export const useRequireNoAuth = (redirectTo = "/"): boolean => {
  const { whoamiInProgress, user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (user && !whoamiInProgress) navigate(redirectTo, { replace: true });
  }, [navigate, redirectTo, user, whoamiInProgress]);
  return whoamiInProgress;
};

export interface RequireAuthProps {
  children: ReactNode;
  to?: string;
  loading?: ReactNode;
}

/**
 * Redirect to the sign in page if not logged in (no render)
 */
// TODO implement `redirectTo`
export function RequireAuth({ children, to, loading }: RequireAuthProps): JSX.Element {
  const { whoamiInProgress, user } = useAuth();

  if (user)
    return <>{children}</>;

  if (whoamiInProgress)
    return <>{loading}</>;

  return <Navigate to={to || "/auth/sign-in"} replace />;
}

/**
 * Redirect to the provided url if the user is already logged in (no render)
 */
export function RequireNoAuth({ children, to, loading }: RequireAuthProps): JSX.Element {
  const { whoamiInProgress, user } = useAuth();

  if (!user)
    return <>{children}</>;

  if (whoamiInProgress)
    return <>{loading}</>;

  return <Navigate to={to || "/"} replace />;
}

export interface AuthProviderProps {
  children?: ReactNode;
}

/**
 * Context provider
 */
// TODO implement auto refresh of token
export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [whoamiTrigger, setWhoamiTrigger] = useState({});
  const [whoamiInProgress, setWhoamiInProgress] = useState(true);
  const [user, setUser] = useState<StudentDataFromServer | null>(null);

  // Function to trigger whoami request
  const doWhoami = useCallback<AuthContextData["doWhoami"]>(
    () => setWhoamiTrigger({}),
    [],
  );

  // Send whoami request when needed
  useEffect(() => {
    const abort = new AbortController();

    const sendFetch = async (): Promise<void> => {
      try {
        setWhoamiInProgress(true);

        const res = await fetch("/api/auth/whoami", {
          headers: { "Accept": "application/json" },
          method: "GET",
          cache: "no-store",
          signal: abort.signal,
        });

        if (res.status === 200) {
          const body = await res.json();
          setUser(body.data ?? null);
        } else {
          console.error(`"Who Am I" request failed with response status ${res.status}`);
        }
      } catch (e) {
        if (!(e instanceof DOMException) || e.name !== "AbortError") console.error(e);
      } finally {
        setWhoamiInProgress(false);
      }
    };

    sendFetch();

    return () => abort.abort();
  }, [whoamiTrigger]);

  /**
   * Function to send sign in request
   */
  const signIn = useCallback<AuthContextData["signIn"]>(async (credentials) => {
    const response = await fetch("/api/auth/login", {
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        "Accept": "application/json",
      },
      method: "POST",
      cache: "no-cache",
      body: JSON.stringify(credentials),
      redirect: "follow",
    });
    let success = false;
    if (response.status === 200) {
      const body = await response.json();
      setUser(body.data ?? null);
      success = true;
    }
    return { success, response };
  }, []);

  /**
   * Function to send sign out request
   */
  const signOut = useCallback<AuthContextData["signOut"]>(async () => {
    const response = await fetch("/api/auth/logout", {
      headers: {
        "Accept": "application/json",
        "X-HTTP-Method-Override": "DELETE",
      },
      method: "POST",
      cache: "no-cache",
    });
    let success = false;
    if (response.status === 200) {
      setUser(null);
      success = true;
    }
    return { success, response };
  }, []);

  /**
   * Function to send new user register request
   */
  const register = useCallback<AuthContextData["register"]>(async (data) => {
    const response = await fetch("/api/auth/register", {
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        "Accept": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
      redirect: "follow",
    });
    let success = false;
    if (response.status === 200) {
      const body = await response.json();
      setUser(body.data ?? null);
      success = true;
    }
    return { success, response };
  }, []);

  /**
   * Function to send user info update request
   */
  const update = useCallback<AuthContextData["update"]>(async (data) => {
    const response = await fetch("/api/auth/update", {
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        "Accept": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    });
    let success = false;
    if (response.status === 200) {
      const body = await response.json();
      setUser(body.data);
      success = true;
    }
    return { success, response };
  }, []);

  const data = useMemo<AuthContextData>(
    () => ({
      whoamiInProgress,
      user,
      setUser,
      signIn,
      signOut,
      register,
      update,
      doWhoami,
    }),
    [whoamiInProgress, user, signIn, signOut, register, update, doWhoami],
  );

  return (
    <AuthContext.Provider value={data}>
      {children}
    </AuthContext.Provider>
  );
}
