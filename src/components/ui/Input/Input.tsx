import React, {
  forwardRef,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { Eye, EyeOff } from "./icons";
import "./styles.css";

type InputSize = "sm" | "md" | "lg";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  hint?: string;
  error?: string;
  size?: InputSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  showToggle?: boolean;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id: idFromProps,
      label,
      hint,
      error,
      size = "md",
      leftIcon,
      rightIcon,
      type = "text",
      showToggle = true,
      fullWidth = true,
      className,
      ...rest
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = idFromProps ?? generatedId;

    const isPassword = type === "password";
    const [visible, setVisible] = useState(false);

    const describedBy =
      [hint ? `${inputId}-hint` : null, error ? `${inputId}-error` : null]
        .filter(Boolean)
        .join(" ") || undefined;

    const containerClasses = [
      "input-field",
      fullWidth ? "full-width" : "",
      className || "",
    ].join(" ");

    const controlClasses = [
      "input-control",
      `size-${size}`,
      error ? "has-error" : "",
    ].join(" ");

    return (
      <div className={containerClasses}>
        {label && (
          <label className="input-label" htmlFor={inputId}>
            {label}
          </label>
        )}
        <div className={controlClasses}>
          {leftIcon && <span className="input-left-icon">{leftIcon}</span>}
          <input
            ref={ref}
            id={inputId}
            type={isPassword && visible ? "text" : type}
            className="input-native"
            aria-invalid={!!error || undefined}
            aria-describedby={describedBy}
            {...rest}
          />
          {rightIcon && !isPassword && (
            <span className="input-right-icon">{rightIcon}</span>
          )}
          {isPassword && showToggle && (
            <button
              aria-label={visible ? "Hide password" : "Show password"}
              className="input-toggle"
              onClick={() => setVisible((v) => !v)}
              type="button"
            >
              {visible ? <EyeOff /> : <Eye />}
            </button>
          )}
        </div>
        {hint && !error && (
          <div id={`${inputId}-hint`} className="input-hint">
            {hint}
          </div>
        )}
        {error && (
          <div id={`${inputId}-error`} className="input-error-text">
            {error}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
