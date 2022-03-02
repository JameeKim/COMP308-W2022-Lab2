import { useEffect, useState } from "react";

// TODO Make a proper home page
export default function Index(): JSX.Element {
  const [status, setStatus] = useState<string | null>(null);
  const [headers, setHeaders] = useState<string | null>(null);
  const [data, setData] = useState<string | null>(null);

  const meh = async (res: Response): Promise<void> => {
    setStatus(JSON.stringify(res.status));
    const h: Record<string, string> = {};
    res.headers.forEach((val, key) => h[key] = val);
    setHeaders(JSON.stringify(h, undefined, 2));
    const body = JSON.stringify(await res.json(), undefined, 2);
    setData(body);
  };

  useEffect(() => {
    fetch("/api/auth/test").then(meh).catch((error) => console.error(error));
  }, []);

  return (
    <main>
      <h1>Hello</h1>
      <p>Status: { status ?? "-" }</p>
      <p>Response Headers:</p>
      { headers && <pre>{headers}</pre> }
      <p>Data: </p>
      { data && <pre>{data}</pre> }
    </main>
  );
}
