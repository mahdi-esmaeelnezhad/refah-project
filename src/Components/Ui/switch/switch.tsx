import React from "react";

interface SwitchProps {
  on: boolean;
  onToggle: () => void;
}

export const Switch: React.FC<SwitchProps> = ({ on, onToggle }) => {
  return (
    <div
      onClick={onToggle}
      style={{
        width: 50,
        height: 24,
        borderRadius: 12,
        backgroundColor: on ? "#4a4cd3" : "#ccc",
        display: "flex",
        justifyContent: on ? "flex-end" : "flex-start",
        padding: 2,
        cursor: "pointer",
      }}
    >
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          backgroundColor: "#fff",
          boxShadow: "0 0 2px rgba(0,0,0,0.3)",
        }}
      />
    </div>
  );
};
