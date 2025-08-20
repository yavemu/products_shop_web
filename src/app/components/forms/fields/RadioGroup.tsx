export interface RadioOption {
  value: string | number;
  label: string;
  description?: string;
  cost?: string;
}

export interface RadioGroupProps {
  name: string;
  label: string;
  value: string | number;
  onChange: (value: string | number) => void;
  options: RadioOption[];
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
}

function RadioGroup({
  name,
  label,
  value,
  onChange,
  options,
  required = false,
  disabled = false,
  error,
  className = "",
}: RadioGroupProps) {
  return (
    <div className={`form-group ${className}`}>
      <fieldset className="radio-fieldset">
        <legend className="form-label">
          {label} {required && "*"}
        </legend>
        <div className="radio-group">
          {options.map((option) => (
            <label key={option.value} className="radio-option">
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={() => onChange(option.value)}
                required={required}
                disabled={disabled}
              />
              <div className="radio-content">
                <span className="radio-label">{option.label}</span>
                {option.description && (
                  <span className="radio-description">{option.description}</span>
                )}
                {option.cost && (
                  <span className="radio-cost">{option.cost}</span>
                )}
              </div>
            </label>
          ))}
        </div>
        {error && <span className="error-message">{error}</span>}
      </fieldset>
    </div>
  );
}

export default RadioGroup;