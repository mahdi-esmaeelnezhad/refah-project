import React from "react";

interface RadioButtonProps {
  selected: boolean;
  onChange: () => void;
}

export const RadioButton: React.FC<RadioButtonProps> = ({ selected, onChange }) => {
  return (
    <div
      onClick={onChange}
      style={{
        width: 24,
        height: 24,
        borderRadius: "50%",
        border: "2px solid black",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      }}
    >
      {selected && (
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            backgroundColor: "#4a4cd3",
          }}
        />
      )}
    </div>
  );
};
