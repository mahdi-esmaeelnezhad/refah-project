import { useLocation } from "react-router-dom";
import { NavBar } from "./NavBar";
import { useEffect, useState } from "react";

const GlobalHeader = () => {
  const location = useLocation();
  const [loadFactorHandler, setLoadFactorHandler] = useState<
    ((factor: any) => void) | null
  >(null);
  const [selectProductHandler, setSelectProductHandler] = useState<
    ((product: any) => void) | null
  >(null);

  useEffect(() => {
    // اضافه کردن event listener برای دریافت handler از Content
    const handleSetLoadFactorHandler = (event: CustomEvent) => {
      setLoadFactorHandler(() => event.detail.handler);
    };

    const handleSetSelectProductHandler = (event: CustomEvent) => {
      setSelectProductHandler(() => event.detail.handler);
    };

    window.addEventListener(
      "setLoadFactorHandler",
      handleSetLoadFactorHandler as EventListener
    );

    window.addEventListener(
      "setSelectProductHandler",
      handleSetSelectProductHandler as EventListener
    );

    return () => {
      window.removeEventListener(
        "setLoadFactorHandler",
        handleSetLoadFactorHandler as EventListener
      );
      window.removeEventListener(
        "setSelectProductHandler",
        handleSetSelectProductHandler as EventListener
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

  const handleSelectProduct = (product: any) => {
    if (selectProductHandler) {
      selectProductHandler(product);
    }
  };

  return (
    <NavBar
      showFullNav={showFullNav}
      onLoadSavedFactor={handleLoadSavedFactor}
      onSelectProduct={handleSelectProduct}
    />
  );
};

export default GlobalHeader;
