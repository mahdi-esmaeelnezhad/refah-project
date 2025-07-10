import { useLocation } from "react-router-dom";
import { NavBar } from "./NavBar";
import { useEffect, useState } from "react";

const GlobalHeader = () => {
  const location = useLocation();
  const [loadFactorHandler, setLoadFactorHandler] = useState<
    ((factor: any) => void) | null
  >(null);

  useEffect(() => {
    // اضافه کردن event listener برای دریافت handler از Content
    const handleSetLoadFactorHandler = (event: CustomEvent) => {
      setLoadFactorHandler(() => event.detail.handler);
    };

    window.addEventListener(
      "setLoadFactorHandler",
      handleSetLoadFactorHandler as EventListener
    );

    return () => {
      window.removeEventListener(
        "setLoadFactorHandler",
        handleSetLoadFactorHandler as EventListener
      );
    };
  }, []);

  if (location.pathname === "/") {
    return null;
  }

  const showFullNav = location.pathname === "/dashboard";

  const handleLoadSavedFactor = (factor: any) => {
    if (loadFactorHandler) {
      loadFactorHandler(factor);
    }
  };

  return (
    <NavBar
      showFullNav={showFullNav}
      onLoadSavedFactor={handleLoadSavedFactor}
    />
  );
};

export default GlobalHeader;
