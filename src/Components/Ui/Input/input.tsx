import React from "react";
import styles from "./input.module.css";

export type InputVariant =
  | "default"
  | "withIcon"
  | "error"
  | "disabled"
  | "search"
  | "amount"
  | "dropdown"
  | "tagged"
  | "imageUpload";

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  error?: string;
  required?: boolean;
  variant?: InputVariant;

  icon?: React.ReactNode;
  suffix?: string;
  hasButton?: boolean;
  buttonText?: string;
  onButtonClick?: () => void;

  onUpload?: (file: File) => void;
}

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  disabled = false,
  error,
  required,
  variant = "default",
  icon,
  suffix,
  hasButton,
  buttonText,
  onButtonClick,
  onUpload,
}) => {
  const renderInput = () => {
    if (variant === "imageUpload") {
      return (
        <div className={styles.imageUploadWrapper}>
          <input
            type="file"
            accept="image/*"
            className={styles.hiddenInput}
            onChange={(e) => e.target.files && onUpload?.(e.target.files[0])}
          />
          <div className={styles.imageBox}>+</div>
        </div>
      );
    }

    return (
      <div
        className={`${styles.inputWrapper} ${error ? styles.error : ""} ${
          disabled ? styles.disabled : ""
        }`}
      >
        {icon && <span className={styles.icon}>{icon}</span>}
        <input
          type="text"
          className={`${styles.input} ${icon ? styles.withIcon : ""}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
        {suffix && <span className={styles.suffix}>{suffix}</span>}
        {hasButton && buttonText && (
          <button className={styles.tagButton} onClick={onButtonClick}>
            {buttonText}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {label && (
        <label className={styles.label}>
          {label} {required && <span className={styles.required}>*</span>}
        </label>
      )}
      {renderInput()}
      {error && <div className={styles.errorText}>{error}</div>}
    </div>
  );
};

export default Input;
