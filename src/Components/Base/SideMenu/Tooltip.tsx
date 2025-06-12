import React, { useRef, useEffect } from "react";

type ClickTooltipProps = {
  component: React.ReactNode;
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const ClickTooltip: React.FC<ClickTooltipProps> = ({
  component,
  children,
  isOpen,
  setIsOpen,
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
          className="absolute z-50 whitespace-normal break-words rounded-lg shadow bg-white text-black py-1.5 px-3 font-sans text-sm font-normal  focus:outline-none"
          style={{
            top: "calc(100% + 8px)",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          {component}
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rotate-45 z-1"></div>
        </div>
      )}
    </div>
  );
};

export default ClickTooltip;
