import { ReactNode, createContext, useCallback, useContext, useMemo } from "react";

import { useAuth } from "./auth";

export interface FetchOptions<T> {
  headers?: Record<string, string>;
  data?: T;
  redirect?: RequestRedirect;
  signal?: AbortSignal;
}

export interface FetchContextData {
  get: <T>(url: string, options?: FetchOptions<T>) => Promise<Response>;
  post: <T>(url: string, options?: FetchOptions<T>) => Promise<Response>;
  put: <T>(url: string, options?: FetchOptions<T>) => Promise<Response>;
  del: <T>(url: string, options?: FetchOptions<T>) => Promise<Response>;
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

/**
 * Provide convenience functions for making api calls
 */
export function FetchProvider({ children }: FetchProviderProps): JSX.Element {
  const { doWhoami } = useAuth();

  /**
   * Send a GET request
   */
  const get = useCallback<FetchContextData["get"]>(async (url, options) => {
    const { headers, redirect, signal } = options ?? {};

    // TODO implement including data for get (query string in url)
    const res = await fetch(url, {
      headers: {
        "Accept": "application/json",
        ...headers,
      },
      method: "GET",
      cache: "no-store",
      redirect,
      signal,
    });

    if (res.status === 401) {
      doWhoami();
    }

    return res;
  }, [doWhoami]);

  /**
   * Send a POST request
   */
  const post = useCallback<FetchContextData["post"]>(async (url, options) => {
    const { headers, data, redirect, signal } = options ?? {};

    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Accept": "application/json",
        ...headers,
      },
      method: "POST",
      cache: "no-store",
      redirect,
      signal,
      body: JSON.stringify(data ?? {}),
    });

    if (res.status === 401) {
      doWhoami();
    }

    return res;
  }, [doWhoami]);

  /**
   * Send a PUT request
   */
  const put = useCallback<FetchContextData["put"]>(async (url, options) => {
    const { headers, data, redirect, signal } = options ?? {};

    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Accept": "application/json",
        "X-HTTP-Method-Override": "PUT",
        ...headers,
      },
      method: "POST",
      cache: "no-store",
      redirect,
      signal,
      body: JSON.stringify(data ?? {}),
    });

    if (res.status === 401) {
      doWhoami();
    }

    return res;
  }, [doWhoami]);

  /**
   * Send a DELETE request
   */
  const del = useCallback<FetchContextData["del"]>(async (url, options) => {
    const { headers, data, redirect, signal } = options ?? {};

    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Accept": "application/json",
        "X-HTTP-Method-Override": "DELETE",
        ...headers,
      },
      method: "POST",
      cache: "no-store",
      redirect,
      signal,
      body: JSON.stringify(data ?? {}),
    });

    if (res.status === 401) {
      doWhoami();
    }

    return res;
  }, [doWhoami]);

  const data = useMemo(() => ({ get, post, put, del }), [del, get, post, put]);

  return (
    <FetchContext.Provider value={data}>
      {children}
    </FetchContext.Provider>
  );
}
