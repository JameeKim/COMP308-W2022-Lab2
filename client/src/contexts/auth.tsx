import { useQuery } from "@apollo/client";
import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import type { StudentData } from "@dohyunkim/common";
import { gql } from "src/graphql";
import type { WhoAmIQuery } from "src/graphql/graphql";

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
  readonly user: WhoAmIQuery["whoami"];
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

const WHO_AM_I = gql(/* GraphQL */`
  query WhoAmI {
    whoami {
      ...StudentSelf
    }
  }
`);

export interface AuthProviderProps {
  children?: ReactNode;
}

/**
 * Context provider
 */
// TODO implement auto refresh of token
export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  // FIXME login state getting out of sync; should probably update cache in mutations
  const { loading, data, refetch } = useQuery(WHO_AM_I);

  // Function to trigger whoami request
  const doWhoami = useCallback<AuthContextData["doWhoami"]>(
    () => { refetch(); },
    [refetch],
  );

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
      cache: "no-cache",
      body: JSON.stringify(data),
      redirect: "follow",
    });
    let success = false;
    if (response.status === 200) {
      refetch();
      success = true;
    }
    return { success, response };
  }, [refetch]);

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
      cache: "no-cache",
      body: JSON.stringify(data),
    });
    let success = false;
    if (response.status === 200) {
      refetch();
      success = true;
    }
    return { success, response };
  }, [refetch]);

  const value = useMemo<AuthContextData>(
    () => ({
      whoamiInProgress: loading,
      user: data?.whoami,
      register,
      update,
      doWhoami,
    }),
    [loading, data?.whoami, register, update, doWhoami],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
