import {
  ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState,
} from "react";
import { useNavigate } from "react-router-dom";

import type { StudentData } from "@dohyunkim/common";

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
  readonly needHealthCheck: boolean;
  readonly user: StudentData | null;
  readonly signIn: (credentials: AuthCredentials) => Promise<AuthRequestResult>;
  readonly signOut: () => Promise<AuthRequestResult>;
  readonly register: (data: StudentData) => Promise<AuthRequestResult>;
  readonly update: (data: StudentData) => Promise<AuthRequestResult>;
  readonly healthCheck: () => Promise<AuthRequestResult>;
}

const AuthContext = createContext<AuthContextData | null>(null);
AuthContext.displayName = "Auth";

export class AuthContextError extends Error {}

/**
 * Use data from AuthContext
 */
export const useAuth = (): AuthContextData => {
  const data = useContext(AuthContext);

  if (!data) {
    throw new AuthContextError("useAuth must be used with AuthProvider");
  }

  return data;
};

/**
 * Redirect to the sign in page if not logged in
 */
export const useRequireAuth = (redirectTo = "/auth/sign-in"): void => {
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) navigate(redirectTo, { replace: true });
  }, [navigate, redirectTo, user]);
};

/**
 * Redirect to the provided url if the user is already logged in
 */
export const useRequireNoAuth = (redirectTo = "/"): void => {
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (user) navigate(redirectTo, { replace: true });
  }, [navigate, redirectTo, user]);
};

export interface AuthProviderProps {
  children?: ReactNode;
}

const isRedirect = (status: number): boolean => (status >= 300 && status < 400);

/**
 * Context provider
 */
export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [needHealthCheck, setNeedHealthCheck] = useState(true);
  const [user, setUser] = useState<StudentData | null>(null);

  const signIn = useCallback<AuthContextData["signIn"]>(async (credentials) => {
    const response = await fetch("/api/auth/login", {
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      method: "POST",
      body: JSON.stringify(credentials),
      redirect: "manual",
    });
    let success = false;
    if (isRedirect(response.status) || response.type === "opaqueredirect") {
      setNeedHealthCheck(true);
      success = true;
    }
    return { success, response };
  }, []);

  const signOut = useCallback<AuthContextData["signOut"]>(async () => {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      redirect: "manual",
    });
    let success = false;
    if (isRedirect(response.status) || response.type === "opaqueredirect") {
      setUser(null);
      success = true;
    }
    return { success, response };
  }, []);

  const register = useCallback<AuthContextData["register"]>(async (data) => {
    const response = await fetch("/api/auth/register", {
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      method: "POST",
      body: JSON.stringify(data),
      redirect: "manual",
    });
    let success = false;
    if (isRedirect(response.status) || response.type === "opaqueredirect") {
      setUser(data);
      success = true;
    }
    return { success, response };
  }, []);

  const update = useCallback<AuthContextData["update"]>(async (data) => {
    const response = await fetch("/api/auth/update", {
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      method: "POST",
      body: JSON.stringify(data),
    });
    let success = false;
    if (response.status === 200) {
      setUser((await response.json()).data);
      success = true;
    }
    return { success, response };
  }, []);

  const healthCheck = useCallback<AuthContextData["healthCheck"]>(async () => {
    const response = await fetch("/api/auth/whoami", {
      headers: { "Accept": "application/json" },
      method: "GET",
    });
    let success = false;
    if (response.status === 200) {
      const res = await response.json();
      setNeedHealthCheck(false);
      setUser(res.data ?? null);
      success = true;
    }
    return { success, response };
  }, []);

  const data = useMemo<AuthContextData>(
    () => ({ needHealthCheck, user, signIn, signOut, register, update, healthCheck }),
    [healthCheck, needHealthCheck, register, signIn, signOut, update, user],
  );

  return (
    <AuthContext.Provider value={data}>
      {children}
    </AuthContext.Provider>
  );
}
