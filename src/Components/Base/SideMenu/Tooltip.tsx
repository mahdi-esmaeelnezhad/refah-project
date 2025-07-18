import React, { useRef, useEffect } from "react";
import { createPortal } from "react-dom";

type ClickTooltipProps = {
  component: React.ReactNode;
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  position?: "left" | "bottom";
  left?: number;
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
    if (!buttonRef.current) return {};

    const buttonRect = buttonRef.current.getBoundingClientRect();

    if (position === "left") {
      return {
        top: buttonRect.top + buttonRect.height / 2,
        right: window.innerWidth - buttonRect.left + 8,
        transform: "translateY(-50%)",
      };
    }
    // default bottom position
    return {
      top: buttonRect.bottom + 8,
      left: buttonRect.left + buttonRect.width / 2,
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
        zIndex: 9999,
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
      zIndex: 9999,
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
      {isOpen &&
        createPortal(
          <div
            ref={tooltipRef}
            className="fixed whitespace-normal break-words rounded-lg shadow bg-white text-black py-1.5 px-3 font-sans text-sm font-normal focus:outline-none"
            style={{
              ...getTooltipStyles(),
              zIndex: 9999,
            }}
          >
            {component}
            <div style={getArrowStyles()}></div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default ClickTooltip;
