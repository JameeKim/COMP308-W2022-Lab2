import { FormEvent, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";

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
    <nav className="navbar navbar-expand fixed-top navbar-light bg-light">
      <div className="container">
        <Link to="/" className="navbar-brand">Hello</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink to="/courses" className="nav-link">Courses</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/students" className="nav-link">Students</NavLink>
            </li>
          </ul>
          <div className="d-flex">
            {authSection}
          </div>
        </div>
      </div>
    </nav>
  );
}
