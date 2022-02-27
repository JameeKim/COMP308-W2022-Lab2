import { useState } from "react";

import type { StudentData } from "@dohyunkim/common";
import UserInfoForm from "src/components/UserInfoForm";
import { useAuth, useRequireAuth } from "src/contexts/auth";

export default function Account(): JSX.Element {
  const { user, update } = useAuth();
  const [pending, setPending] = useState(false);

  useRequireAuth();

  const onSubmit = async (data?: StudentData): Promise<void> => {
    if (!data) return;
    setPending(true);
    await update(data);
    setPending(false);
  };

  return (
    <main className="card">
      <div className="card-body px-5">
        <h1 className="card-title mb-3">Account Information</h1>
      </div>
      <UserInfoForm
        action="/api/auth/change"
        method="post"
        className="list-group list-group-flush"
        id="user-info"
        user={user}
        disabled={pending}
        aria-disabled={pending}
        onSubmit={onSubmit}
      />
      <div className="card-body text-center">
        <button type="submit" form="user-info" className="btn btn-primary" disabled={pending}>
          Register
        </button>
      </div>
    </main>
  );
}
