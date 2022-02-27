import { useState } from "react";
import { Link } from "react-router-dom";

import type { StudentData } from "@dohyunkim/common";
import UserInfoForm from "src/components/UserInfoForm";
import { useAuth, useRequireNoAuth } from "src/contexts/auth";

export default function Register(): JSX.Element {
  const { register } = useAuth();
  const [pending, setPending] = useState(false);

  useRequireNoAuth();

  const onSubmit = async (data?: StudentData): Promise<void> => {
    if (!data) return;
    setPending(true);
    await register(data);
    setPending(false);
  };

  return (
    <main className="card border-info">
      <div className="card-body px-5">
        <h1 className="card-title mb-3">Register For an Account</h1>
        <p className="card-text">
          Already have an account?{" "}
          <Link to="../sign-in">Sign in here</Link>
        </p>
      </div>
      <UserInfoForm
        action="/api/auth/register"
        method="post"
        className="list-group list-group-flush"
        id="user-register"
        disabled={pending}
        aria-disabled={pending}
        onSubmit={onSubmit}
      />
      <div className="card-body text-center">
        <button type="submit" form="user-register" className="btn btn-primary" disabled={pending}>
          Register
        </button>
      </div>
    </main>
  );
}
