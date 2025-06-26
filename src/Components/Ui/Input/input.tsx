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
  type?: string;
  required?: boolean;
  variant?: InputVariant;
  placeholderStyle?: React.CSSProperties;
  errorStyle?: React.CSSProperties;
  icon?: React.ReactNode;
  style?: React.CSSProperties;
  suffix?: string;
  width?: string | number;
  height?: string | number;
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
  type,
  placeholderStyle,
  errorStyle,
  required,
  variant = "default",
  icon,
  style,
  suffix,
  width,
  height,
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
        style={{
          height: typeof height === "number" ? `${height}px` : height,
        }}
      >
        {icon && <span className={styles.icon}>{icon}</span>}
        <input
          type={type}
          className={`${styles.input} ${icon ? styles.withIcon : ""}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          style={{
            height: typeof height === "number" ? `${height - 30}px` : height,
            ...placeholderStyle,
            ...errorStyle,
          }}
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
    <div
      className={styles.container}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        ...placeholderStyle,
        ...errorStyle,
        ...style,
      }}
    >
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
