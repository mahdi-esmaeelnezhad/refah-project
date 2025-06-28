import React, { type CSSProperties, type ReactNode } from "react";
interface MenuItemProps {
  children: ReactNode;
  textClassName?: string;
  style?: CSSProperties;
  className?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({
  children,
  textClassName = "",
  style = {},
  className = "",
  icon = "",
  onClick,
}) => {
  return (
    <li>
      <button
        onClick={onClick}
        className={`menu-item flex items-center gap-[11px] w-full text-left ${className}`}
        style={style}
      >
        {icon}
        <span className={textClassName}>{children}</span>
      </button>
    </li>
  );
};

export default MenuItem;
