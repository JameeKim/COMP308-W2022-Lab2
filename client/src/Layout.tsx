import { Outlet } from "react-router-dom";

import NavBar from "./components/NavBar";

import "./Layout.css";

export default function Layout(): JSX.Element {
  return (
    <>
      <NavBar />
      <div className="container container-md-max px-3">
        <Outlet />
      </div>
    </>
  );
}
