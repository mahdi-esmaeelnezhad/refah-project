import React from "react";
import styles from "./switch.module.css";

interface SwitchProps {
  on: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export const Switch: React.FC<SwitchProps> = ({ on, onToggle, disabled = false }) => {
  const id = React.useId();

  return (
    <label className={styles.wrapper} htmlFor={id}>
      <input
        type="checkbox"
        id={id}
        checked={on}
        onChange={onToggle}
        role="switch"
        disabled={disabled}
        className={styles.hiddenInput}
      />
      <span className={`${styles.slider} ${on ? styles.on : ""}`} />
    </label>
  );
};
