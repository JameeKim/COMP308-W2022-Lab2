import { Link } from "react-router-dom";

export default function NavBar(): JSX.Element {
  return (
    <nav className="navbar fixed-top navbar-light bg-light">
      <div className="container">
        <Link to="/" className="navbar-brand">Hello</Link>
      </div>
    </nav>
  );
}
