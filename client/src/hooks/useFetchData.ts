import { useCallback, useEffect, useState } from "react";

import { useFetch } from "src/contexts/fetch";

export enum FetchStatus {
  Pending,
  Error,
  Success,
}

export interface FetchData<T> {
  status: FetchStatus;
  responseStatus: number;
  data: T | null;
  refetch: () => Promise<void>;
}

const useFetchData = <T>(url: string, inactive = false): FetchData<T> => {
  const [status, setStatus] = useState<FetchStatus>(FetchStatus.Pending);
  const [responseStatus, setResponseStatus] = useState(0);
  const [data, setData] = useState<T | null>(null);
  const { get } = useFetch();

  const refetch = useCallback(
    async (): Promise<void> => {
      if (inactive) return;
      setStatus(FetchStatus.Pending);
      const res = await get(url);
      setResponseStatus(res.status);
      if (res.status === 200) {
        setData((await res.json()).data);
        setStatus(FetchStatus.Success);
      } else {
        setStatus(FetchStatus.Error);
      }
    },
    [get, inactive, url],
  );

  useEffect(() => {
    if (inactive) return;
    refetch();
  }, [inactive, refetch]);

  return { status, responseStatus, data, refetch };
};

export default useFetchData;
