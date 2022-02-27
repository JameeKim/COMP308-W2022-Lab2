import { ReactNode, createContext, useCallback, useContext, useMemo } from "react";

import { useAuth } from "./auth";

export interface FetchOptions<T> {
  headers?: Record<string, string>;
  data?: T;
  redirect?: RequestRedirect;
}

export interface FetchContextData {
  get: <T>(url: string, options?: FetchOptions<T>) => Promise<Response>;
  post: <T>(url: string, options?: FetchOptions<T>) => Promise<Response>;
}

const FetchContext = createContext<FetchContextData | null>(null);
FetchContext.displayName = "Fetch";

export class FetchContextError extends Error {}

export const useFetch = (): FetchContextData => {
  const data = useContext(FetchContext);

  if (!data) {
    throw new FetchContextError("useFetch must be used with FetchProvider");
  }

  return data;
};

export interface FetchProviderProps {
  children?: ReactNode;
}

export function FetchProvider({ children }: FetchProviderProps): JSX.Element {
  const { markHealthCheck } = useAuth();

  const get = useCallback<FetchContextData["get"]>(async (url, options) => {
    options = options ?? {};

    // TODO implement including body for get (query string in url)
    const res = await fetch(url, {
      headers: {
        ...options.headers,
        "Accept": "application/json",
      },
      method: "GET",
      cache: "no-cache",
      redirect: options.redirect,
    });

    if (res.status === 401) {
      markHealthCheck();
    }

    return res;
  }, [markHealthCheck]);

  const post = useCallback<FetchContextData["post"]>(async (url, options) => {
    options = options ?? {};

    const res = await fetch(url, {
      headers: {
        ...options.headers,
        "Content-Type": "application/json; charset=utf-8",
        "Accept": "application/json",
      },
      method: "POST",
      cache: "no-cache",
      redirect: options.redirect,
      body: options.data ? JSON.stringify(options.data) : undefined,
    });

    if (res.status === 401) {
      markHealthCheck();
    }

    return res;
  }, [markHealthCheck]);

  const data = useMemo(() => ({ get, post }), [get, post]);

  return (
    <FetchContext.Provider value={data}>
      {children}
    </FetchContext.Provider>
  );
}
