import { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "src/contexts/auth";

export default function NavBar(): JSX.Element {
  const { needHealthCheck, user, signOut, healthCheck } = useAuth();
  const [signOutPending, setSignOutPending] = useState(false);

  useEffect(() => {
    if (!needHealthCheck) return;
    healthCheck();
  }, [healthCheck, needHealthCheck]);

  const onSignOut = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setSignOutPending(true);
    await signOut();
    setSignOutPending(false);
  };

  const authSection = user
    ? <>
      <Link to="/auth/account" className="navbar-text me-3">
        {user.firstName}
      </Link>
      <form action="/api/auth/logout" method="post" onSubmit={onSignOut}>
        <button type="submit" className="btn btn-outline-danger" disabled={signOutPending}>
          Sign Out
        </button>
      </form>
    </>
    : <Link to="/auth/sign-in" className="btn btn-outline-primary">Sign In</Link>;

  return (
    <nav className="navbar fixed-top navbar-light bg-light">
      <div className="container">
        <Link to="/" className="navbar-brand">Hello</Link>
        <div className="d-flex">
          {authSection}
        </div>
      </div>
    </nav>
  );
}
