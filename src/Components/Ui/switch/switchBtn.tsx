import React from "react";

interface SwitchProps {
  on: boolean;
  onToggle: () => void;
}

export const SwitchBtn: React.FC<SwitchProps> = ({ on, onToggle }) => {
  return (
    <div
      onClick={onToggle}
      style={{
        width: 50,
        height: 24,
        borderRadius: 24,
        border: "2px solid #4a4cd3",
        backgroundColor: on ? "#4a4cd3" : "transparent",
        display: "flex",
        justifyContent: on ? "flex-end" : "flex-start",
        padding: 2,
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
      }}
    >
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: "50%",
          backgroundColor: "#fff",
        }}
      />
    </div>
  );
};
