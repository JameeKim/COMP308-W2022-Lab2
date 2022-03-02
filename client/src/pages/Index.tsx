import { Link } from "react-router-dom";

export default function Index(): JSX.Element {
  return (
    <main>
      <h1 className="mb-5">Site Map</h1>
      <nav>
        <ul className="nav flex-column">
          <li className="nav-item mb-3">
            <code>/</code>
            <Link to="/" className="nav-link d-inline">Site Map</Link>
          </li>

          <li className="nav-item mb-3">
            <code>/auth</code>
            <span className="px-3 py-2">Authentication</span>
            <ul className="nav flex-column ps-4">
              <li className="nav-item">
                <code>/sign-in</code>
                <Link to="/auth/sign-in" className="nav-link d-inline">Sign In</Link>
                (should not be signed in)
              </li>
              <li className="nav-item">
                <code>/register</code>
                <Link to="/auth/register" className="nav-link d-inline">Register</Link>
                (should not be signed in)
              </li>
              <li className="nav-item">
                <code>/account</code>
                <Link to="/auth/account" className="nav-link d-inline">Account</Link>
                (should be signed in)
              </li>
            </ul>
          </li>

          <li className="nav-item mb-3">
            <code>/courses</code>
            <Link to="/courses" className="nav-link d-inline">List of My Courses</Link>
            (should be signed in)
            <ul className="nav flex-column ps-4">
              <li className="nav-item">
                <code>/all</code>
                <Link to="/courses/all" className="nav-link d-inline">All Courses</Link>
              </li>
              <li className="nav-item">
                <code>/add</code>
                <Link to="/courses/add" className="nav-link d-inline">Create a Course</Link>
                (should be signed in)
              </li>
              <li className="nav-item">
                <code>/:id</code>
                <span className="px-3 py-2">Details Page of the Specific Course</span>
                <ul className="nav flex-column ps-4">
                  <li className="nav-item">
                    <code>/edit</code>
                    <span className="px-3 py-2">Edit the Course</span>
                    (should be signed in)
                  </li>
                </ul>
              </li>
            </ul>
          </li>

          <li className="nav-item">
            <code>/students</code>
            <Link to="/students" className="nav-link d-inline">All Students</Link>
            (should be signed in)
            <ul className="nav flex-column ps-4">
              <li className="nav-item">
                <code>/:id</code>
                <span className="px-3 py-2">Details Page of the Student</span>
                (should be signed in)
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </main>
  );
}
