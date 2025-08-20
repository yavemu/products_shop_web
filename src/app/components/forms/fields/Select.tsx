export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps {
  id: string;
  label: string;
  value: string | number;
  onChange: (value: string | number) => void;
  options: SelectOption[];
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
}

function Select({
  id,
  label,
  value,
  onChange,
  options,
  required = false,
  disabled = false,
  error,
  className = "",
}: SelectProps) {
  return (
    <div className={`form-group ${className}`}>
      <label htmlFor={id} className="form-label">
        {label} {required && "*"}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`form-input ${error ? "error" : ""}`}
        required={required}
        disabled={disabled}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="error-message">{error}</span>}
    </div>
  );
}

export default Select;