import React from "react";

type ButtonVariant = "filled" | "outline";
type ButtonState = "normal" | "pressed" | "loading" | "disabled";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  color?: string; 
  radius?: number; 
  variant?: ButtonVariant;
  state?: ButtonState;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  color = "#4CAF50",
  radius = 10,
  variant = "filled",
  state = "normal",
  disabled,
  ...props
}) => {
  const isDisabled = disabled || state === "disabled";

  const getBackgroundColor = () => {
    if (variant === "outline") return "transparent";
    if (state === "pressed") return darkenColor(color, 20);
    if (state === "disabled") return "#ccc";
    return color;
  };

  const getTextColor = () => {
    if (variant === "outline") return color;
    if (state === "disabled") return "#fff";
    return "#fff";
  };

  const getBorder = () => {
    if (variant === "outline") return `2px solid ${color}`;
    return "none";
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: getBackgroundColor(),
    color: getTextColor(),
    border: getBorder(),
    borderRadius: `${radius}px`,
    padding: "10px 20px",
    fontSize: "16px",
    cursor: isDisabled ? "not-allowed" : "pointer",
    opacity: isDisabled ? 0.6 : 1,
    transition: "all 0.2s ease-in-out",
    minWidth: 120,
  };

  return (
    <button style={buttonStyle} disabled={isDisabled} {...props}>
      {state === "loading" ? `${label} ...` : label}
    </button>
  );
};

function darkenColor(hex: string, percent: number) {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) - amt;
  const G = ((num >> 8) & 0x00ff) - amt;
  const B = (num & 0x0000ff) - amt;
  return (
    "#" +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
}
