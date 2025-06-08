import React from "react";
import styles from "./radioButton.module.css";

interface RadioButtonProps {
  name: string;
  value: string;
  selected: boolean;
  onChange: () => void;
  disabled?: boolean;
}

export const Radio: React.FC<RadioButtonProps> = ({
  name,
  value,
  selected,
  onChange,
  disabled = false,
}) => {
  return (
    <label className={styles.wrapper}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={selected}
        onChange={onChange}
        disabled={disabled}
        className={styles.hiddenRadio}
      />
      <span className={`${styles.customRadio} ${selected ? styles.selected : ""}`} />
    </label>
  );
};
