"use client";
import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
  disabled?: boolean;
  maxQuantity?: number;
}

const QuantitySelectorUI = ({ quantity, onDecrease, onIncrease, maxQuantity, disabled = false }: QuantitySelectorProps) => (
  <div className="quantity-selector">
    <button onClick={onDecrease} disabled={disabled || quantity <= 0} className="quantity-btn quantity-btn-decrease">
      <Minus size={16} />
    </button>
    <span className="min-w-[2rem] text-center font-medium">{quantity}</span>
    <button
      onClick={onIncrease}
      disabled={disabled || (maxQuantity !== undefined && quantity >= maxQuantity)}
      className="quantity-btn quantity-btn-increase"
    >
      <Plus size={16} />
    </button>
  </div>
);

export default QuantitySelectorUI;
