import { useCallback, useEffect, useState } from "react";

import { useFetch } from "src/contexts/fetch";
import { isAbortError } from "src/utils";

export enum FetchStatus {
  Pending,
  Error,
  Success,
  Cancelled,
}

export interface FetchData<T> {
  status: FetchStatus;
  pending: boolean;
  responseStatus: number;
  error: string;
  data: T | null;
  refetch: () => void;
}

const useFetchData = <T>(url: string, inactive = false): FetchData<T> => {
  const [trigger, setTrigger] = useState(false);
  const [status, setStatus] = useState<FetchStatus>(FetchStatus.Pending);
  const [responseStatus, setResponseStatus] = useState(0);
  const [error, setError] = useState("");
  const [data, setData] = useState<T | null>(null);
  const { get } = useFetch();

  const refetch = useCallback(() => setTrigger(!trigger), [trigger]);

  useEffect(() => {
    if (inactive) {
      setStatus(FetchStatus.Cancelled);
      return;
    }

    const abort = new AbortController();

    const sendRequest = async (): Promise<void> => {
      if (inactive) return;

      try {
        setStatus(FetchStatus.Pending);
        const res = await get(url, { signal: abort.signal });
        const body = await res.json();
        setResponseStatus(res.status);
        setError(body.error ?? "");
        setStatus(res.status === 200 ? FetchStatus.Success : FetchStatus.Error);
        if (res.status === 200) setData(body.data ?? null);
      } catch (e) {
        if (isAbortError(e)) {
          setStatus(FetchStatus.Cancelled);
        } else {
          console.error(e);
          setStatus(FetchStatus.Error);
        }
      }
    };

    sendRequest();

    return () => abort.abort();
  }, [get, inactive, refetch, trigger, url]);

  const pending = status === FetchStatus.Pending;

  return { status, pending, responseStatus, error, data, refetch };
};

export default useFetchData;
