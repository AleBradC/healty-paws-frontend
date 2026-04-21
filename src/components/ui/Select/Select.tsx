import { useId, type FC, type SelectHTMLAttributes } from "react";
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
}

export const Select: FC<SelectProps> = ({
  title,
  label,
  options,
  value,
  name,
  onChange,
  required = false,
  disabled = false,
  className = "",
  hideDefaultPlaceholder = false,
  ...props
}) => {
  const generatedId = useId();
  const selectId = props.id || name || generatedId;

  return (
  <div className="select-container">
    {title && (
      <label htmlFor={selectId} className="select-label">
        {title}
      </label>
    )}
    <div className="select-wrapper">
      <select
        id={selectId}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
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
  </div>
);
};
