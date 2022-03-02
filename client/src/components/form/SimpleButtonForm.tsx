import { FormEventHandler, ReactNode, useCallback } from "react";

import { FetchContextData, useFetch } from "src/contexts/fetch";

type Method = "post" | "put" | "delete";

export interface SimpleButtonFormProps {
  action: string;
  method: Method | Uppercase<Method>;
  btnClass?: string;
  formClass?: string;
  children?: ReactNode;
  disabled?: boolean;
  onResponse?: (res: Response) => void;
}

const methods: Readonly<{ [P in SimpleButtonFormProps["method"]]: keyof FetchContextData }> = {
  post: "post",
  POST: "post",
  put: "put",
  PUT: "put",
  delete: "del",
  DELETE: "del",
};

export default function SimpleButtonForm(
  { action, method, btnClass, formClass, children, disabled, onResponse }: SimpleButtonFormProps,
): JSX.Element {
  const f = useFetch();

  const onSubmit: FormEventHandler<HTMLFormElement> = useCallback(async (e) => {
    if (!onResponse) return;
    e.preventDefault();
    const res = await f[methods[method]](action);
    onResponse(res);
  }, [onResponse, f, method, action]);

  return (
    <form action={action} method="post" className={formClass} onSubmit={onSubmit}>
      <input type="hidden" name="_method" value={method} />
      <button type="submit" className={btnClass} disabled={disabled}>{children}</button>
    </form>
  );
}
