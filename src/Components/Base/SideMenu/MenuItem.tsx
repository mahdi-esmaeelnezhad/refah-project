import React, { type CSSProperties, type ReactNode } from "react";
interface MenuItemProps {
  children: ReactNode;
  textClassName?: string;
  style?: CSSProperties;
  className?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  badge?: number;
}

const MenuItem: React.FC<MenuItemProps> = ({
  children,
  textClassName = "",
  style = {},
  className = "",
  icon = "",
  onClick,
  badge,
}) => {
  const toPersianNumber = (number: number) => {
    return number.toLocaleString("fa-IR");
  };

  return (
    <li>
      <button
        onClick={onClick}
        className={`menu-item flex items-center gap-[11px] w-full text-left ${className}`}
        style={style}
      >
        {icon}
        <span className={textClassName}>{children}</span>
        {badge && badge > 0 && (
          <div className="absolute top-[0px] right-[175px] w-[32px] h-[32px] bg-[#49CD3D] rounded-full flex items-center justify-center text-white text-[20px] font-[500]">
            {/* set badge to persian number */}
            <span style={{ fontSize: 20 }}>{toPersianNumber(badge)}</span>
          </div>
        )}
      </button>
    </li>
  );
};

export default MenuItem;
