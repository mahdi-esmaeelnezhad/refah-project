const MenuItem = ({
  children,
  textClassName = "",
  style = {},
  className = "",
  icon = "",
}) => {
  return (
    <li
      className={`menu-item flex ${className}`}
      style={{
        alignItems: "center",
        gap: "11px",
        ...style,
      }}
    >
      {icon}
      <span className={textClassName}>{children}</span>
    </li>
  );
};

export default MenuItem;
