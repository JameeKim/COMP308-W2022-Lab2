import { FormEventHandler, ReactNode, useCallback } from "react";

import { useAuth } from "src/contexts/auth";

export interface SimpleButtonFormProps {
  action: string;
  method: string;
  btnClass?: string;
  formClass?: string;
  children?: ReactNode;
  disabled?: boolean;
  onResponse?: (res: Response) => void;
}

export default function SimpleButtonForm(
  { action, method, btnClass, formClass, children, disabled, onResponse }: SimpleButtonFormProps,
): JSX.Element {
  const { markHealthCheck } = useAuth();

  const onSubmit: FormEventHandler<HTMLFormElement> = useCallback(async (e) => {
    if (!onResponse) return;
    e.preventDefault();

    const res = await fetch(action, {
      headers: {
        "Accept": "application/json",
        "X-HTTP-Method-Override": method.toUpperCase(),
      },
      method: "POST",
      cache: "no-cache",
      body: new FormData(e.target as HTMLFormElement),
    });

    if (res.status === 401) {
      markHealthCheck();
    }

    onResponse(res);
  }, [onResponse, action, method, markHealthCheck]);

  return (
    <form action={action} method="post" className={formClass} onSubmit={onSubmit}>
      <input type="hidden" name="_method" value={method} />
      <button type="submit" className={btnClass} disabled={disabled}>{children}</button>
    </form>
  );
}
