import { type FC, type ChangeEvent } from "react";
import "./styles.css";

interface TextareaProps {
  name: string;
  label?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  placeholder?: string;
}

export const Textarea: FC<TextareaProps> = ({
  name,
  label,
  value,
  onChange,
  rows = 4,
  placeholder,
}) => (
  <div className="textarea-wrapper">
    {label && (
      <label htmlFor={name} className="textarea-label">
        {label}
      </label>
    )}
    <textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      rows={rows}
      placeholder={placeholder}
      className="textarea-field"
    />
  </div>
);
