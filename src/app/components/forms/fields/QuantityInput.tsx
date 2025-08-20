import { Plus, Minus } from "lucide-react";

export interface QuantityInputProps {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  className?: string;
}

function QuantityInput({
  label,
  value,
  onChange,
  min = 1,
  max = 999,
  disabled = false,
  className = "",
}: QuantityInputProps) {
  const handleDecrease = () => {
    if (value > min && !disabled) {
      onChange(value - 1);
    }
  };

  const handleIncrease = () => {
    if (value < max && !disabled) {
      onChange(value + 1);
    }
  };

  return (
    <div className={`quantity-input-wrapper ${className}`}>
      {label && <span className="quantity-label">{label}</span>}
      <div className="quantity-controls">
        <button
          type="button"
          onClick={handleDecrease}
          className="quantity-btn"
          disabled={disabled || value <= min}
          aria-label="Disminuir cantidad"
        >
          <Minus size={16} />
        </button>
        <span className="quantity-display">{value}</span>
        <button
          type="button"
          onClick={handleIncrease}
          className="quantity-btn"
          disabled={disabled || value >= max}
          aria-label="Aumentar cantidad"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}

export default QuantityInput;