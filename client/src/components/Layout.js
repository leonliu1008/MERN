import { Outlet } from "react-router-dom";
import Nav from "./nav-component";

const Layout = () => {
  return (
    <div>
      <Nav />
      <Outlet />
    </div>
  );
};

export default Layout;
