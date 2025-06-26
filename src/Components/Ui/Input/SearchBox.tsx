// src/Components/Ui/Input/SearchBox.tsx
import React from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchBox: React.FC<Props> = ({ value, onChange, placeholder }) => (
  <input
    type="text"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    style={{
      width: 250,
      height: 40,
      border: "1px solid #D1D1D1",
      borderRadius: 8,
      padding: "0 16px",
      fontSize: 16,
      marginLeft: 12,
      outline: "none",
      direction: "rtl",
    }}
  />
);

export default SearchBox;
