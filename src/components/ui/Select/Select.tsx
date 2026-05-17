import { forwardRef, useId, type SelectHTMLAttributes } from "react";
import "./styles.css";

export interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  className?: string;
  title?: string;
  hideDefaultPlaceholder?: boolean;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      title,
      label,
      options,
      required = false,
      disabled = false,
      className = "",
      hideDefaultPlaceholder = false,
      error,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const selectId = props.id || props.name || generatedId;
    const errorId = error ? `${selectId}-error` : undefined;

    return (
      <div className="select-container">
        {title && (
          <label htmlFor={selectId} className="select-label">
            {title}
          </label>
        )}
        <div className="select-wrapper">
          <select
            ref={ref}
            id={selectId}
            required={required}
            disabled={disabled}
            aria-invalid={!!error || undefined}
            aria-describedby={errorId}
            className={`select-input ${className}`}
            {...props}
          >
            {!hideDefaultPlaceholder && (
              <option value="" disabled>
                Select {label.toLowerCase()}...
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span className="select-arrow" aria-hidden="true" />
        </div>
        {error && (
          <div id={errorId} className="input-error-text">
            {error}
          </div>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
