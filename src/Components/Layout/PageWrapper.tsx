import React from "react";
import { useLocation } from "react-router-dom";
import Layout from "./Layout";

interface PageWrapperProps {
  children: React.ReactNode;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
  const location = useLocation();
  if (location.pathname === "/") {
    return <>{children}</>;
  }

  return <Layout>{children}</Layout>;
};

export default PageWrapper;
