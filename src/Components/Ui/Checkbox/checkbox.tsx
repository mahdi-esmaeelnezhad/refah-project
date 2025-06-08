import React from "react";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange }) => {
  return (
    <div
      onClick={() => onChange(!checked)}
      style={{
        width: 24,
        height: 24,
        border: "2px solid black",
        borderRadius: 4,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {checked && (
        <div
          style={{
            width: 12,
            height: 12,
            backgroundColor: "#4a4cd3",
            clipPath: "polygon(14% 44%, 0% 65%, 50% 100%, 100% 30%, 80% 15%, 43% 62%)",
          }}
        />
      )}
    </div>
  );
};
