import React from "react";
import SideMenu from "../Base/SideMenu/SideMenu";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";
  return (
    <div className="flex">
      <SideMenu />
      <section
        style={{
          position: "fixed",
          width: "1575px",
          height: "800px",
          left: "53px",
          top: "90px",
          zIndex: 1,
          // i want in dashboard background color is #eaeaea
          // in other pages background color is #fff
          backgroundColor: isDashboard ? "#eaeaea" : "#fff",
          padding: "30px",
        }}
      >
        {children}
      </section>
    </div>
  );
};

export default Layout;
