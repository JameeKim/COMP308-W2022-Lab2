import { useMutation } from "@apollo/client";
import type { FormEvent } from "react";
import { Link, NavLink } from "react-router-dom";

import { useAuth } from "src/contexts/auth";
import { gql } from "src/graphql";

const LOG_OUT = gql(/* GraphQL */`
  mutation LogOut {
    logout
  }
`);

// TODO NavBar collapse
export default function NavBar(): JSX.Element {
  const { user } = useAuth();
  const [logoutMutation, { loading }] = useMutation(LOG_OUT, {
    refetchQueries: ["WhoAmI"],
  });

  const onSignOut = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    await logoutMutation();
  };

  const authSection = user
    ? <>
      <Link to="/auth/account" className="navbar-text me-3">
        {user.firstName}
      </Link>
      <form action="/api/auth/logout" method="POST" onSubmit={onSignOut}>
        <input type="hidden" name="_method" value="DELETE" />
        <button type="submit" className="btn btn-danger" disabled={loading}>
          Sign Out
        </button>
      </form>
    </>
    : <Link to="/auth/sign-in" className="btn btn-primary">Sign In</Link>;

  return (
    <nav
      className="navbar navbar-expand fixed-top navbar-light bg-primary"
      style={{ "--bs-bg-opacity": 0.3 }}
    >
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
