export interface TextInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "tel" | "password";
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  maxLength?: number;
  error?: string;
  className?: string;
}

function TextInput({
  id,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  disabled = false,
  maxLength,
  error,
  className = "",
}: TextInputProps) {
  return (
    <div className={`form-group ${className}`}>
      <label htmlFor={id} className="form-label">
        {label} {required && "*"}
      </label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`form-input ${error ? "error" : ""}`}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        maxLength={maxLength}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
}

export default TextInput;