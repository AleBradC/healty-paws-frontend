import { type FC, type SelectHTMLAttributes } from "react";
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
  ...props
}) => (
  <div className="select-container">
    <label htmlFor={name} className="select-label">
      {title}
    </label>
    <div className="select-wrapper">
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`select-input ${className}`}
        {...props}
      >
        <option value="" disabled>
          Select {label.toLowerCase()}...
        </option>
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
