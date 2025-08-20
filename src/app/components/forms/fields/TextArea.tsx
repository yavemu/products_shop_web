export interface TextAreaProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  maxLength?: number;
  error?: string;
  className?: string;
}

function TextArea({
  id,
  label,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  rows = 3,
  maxLength,
  error,
  className = "",
}: TextAreaProps) {
  return (
    <div className={`form-group ${className}`}>
      <label htmlFor={id} className="form-label">
        {label} {required && "*"}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`form-textarea ${error ? "error" : ""}`}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
}

export default TextArea;