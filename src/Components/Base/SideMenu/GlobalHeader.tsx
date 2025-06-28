import { useLocation } from "react-router-dom";
import { NavBar } from "./NavBar";

const GlobalHeader = () => {
  const location = useLocation();

  if (location.pathname === "/") {
    return null;
  }

  const showFullNav = location.pathname === "/dashboard";

  return <NavBar showFullNav={showFullNav} />;
};

export default GlobalHeader;
