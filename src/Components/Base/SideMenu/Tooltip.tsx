import React, { useRef, useEffect } from "react";

type ClickTooltipProps = {
  component: React.ReactNode;
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  position?: "left" | "bottom";
};

const ClickTooltip: React.FC<ClickTooltipProps> = ({
  component,
  children,
  isOpen,
  setIsOpen,
  position = "bottom",
}) => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsOpen]);

  const getTooltipStyles = () => {
    if (position === "left") {
      return {
        top: "50%",
        right: "calc(100% + 8px)",
        transform: "translateY(-50%)",
      };
    }
    // default bottom position
    return {
      top: "calc(100% + 8px)",
      left: "50%",
      transform: "translateX(-50%)",
    };
  };

  const getArrowStyles = () => {
    if (position === "left") {
      return {
        position: "absolute" as const,
        top: "50%",
        right: "-4px",
        transform: "translateY(-50%) rotate(45deg)",
        width: "8px",
        height: "8px",
        backgroundColor: "white",
        zIndex: 50,
      };
    }
    // default bottom position
    return {
      position: "absolute" as const,
      top: "-4px",
      left: "50%",
      transform: "translateX(-50%) rotate(45deg)",
      width: "8px",
      height: "8px",
      backgroundColor: "white",
      zIndex: 50,
    };
  };

  return (
    <div className="relative inline-block">
      {/* Button */}
      <div
        ref={buttonRef}
        data-ripple-light="true"
        onClick={() => setIsOpen(!isOpen)}
      >
        {children}
      </div>

      {/* Tooltip */}
      {isOpen && (
        <div
          ref={tooltipRef}
          className="absolute z-50 whitespace-normal break-words rounded-lg shadow bg-white text-black py-1.5 px-3 font-sans text-sm font-normal focus:outline-none"
          style={getTooltipStyles()}
        >
          {component}
          <div style={getArrowStyles()}></div>
        </div>
      )}
    </div>
  );
};

export default ClickTooltip;
