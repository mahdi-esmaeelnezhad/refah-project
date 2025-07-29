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
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
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
  backgroundColor?: string;
  onUpload?: (file: File) => void;
  readOnly?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      placeholder,
      value,
      onChange,
      onFocus,
      onBlur,
      onKeyDown,
      onClick,
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
      backgroundColor = "#f2f2f2",
      onUpload,
      readOnly = false,
    },
    ref
  ) => {
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
            backgroundColor: backgroundColor,
          }}
        >
          {icon && <span className={styles.icon}>{icon}</span>}
          <input
            ref={ref}
            type={type}
            className={`${styles.input} ${icon ? styles.withIcon : ""}`}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            onClick={onClick}
            disabled={disabled}
            readOnly={readOnly}
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
  }
);

export default Input;
