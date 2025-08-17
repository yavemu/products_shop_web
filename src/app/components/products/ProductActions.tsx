"use client";

import { Product } from "@/types/products/product";
import { useState, useEffect } from "react";

interface Props {
  product: Product;
  onAdd: (productId: number, quantity: number) => void;
}

const QuantitySelector = ({ quantity, onDecrease, onIncrease }: { quantity: number; onDecrease: () => void; onIncrease: () => void }) => (
  <div className="flex items-center justify-center gap-3">
    <button onClick={onDecrease} className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 text-black">
      -
    </button>
    <span className="min-w-[2rem] text-center font-medium">{quantity}</span>
    <button onClick={onIncrease} className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 text-black">
      +
    </button>
  </div>
);

const StockInfo = ({ stock, quantity }: { stock: number; quantity: number }) => (
  <p className="text-sm text-gray-600 text-center">
    Stock disponible: <span className="font-semibold">{stock - quantity}</span>
  </p>
);

const ProductActions = ({ product, onAdd }: Props) => {
  const [quantity, setQuantity] = useState(0);
  const { id: productId, stock } = product;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`quantity-${productId}`);
      if (saved) {
        setQuantity(parseInt(saved, 10));
      }
    }
  }, [productId]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(`quantity-${productId}`, quantity.toString());
    }

    // Avisar al carrito
    onAdd(productId, quantity);
  }, [quantity, productId, onAdd]);

  const decrease = () => {
    if (quantity > 0) setQuantity((q) => q - 1);
  };

  const increase = () => {
    if (quantity < stock) setQuantity((q) => q + 1);
  };

  return (
    <div className="flex flex-col gap-3 items-center">
      <QuantitySelector quantity={quantity} onDecrease={decrease} onIncrease={increase} />
      <StockInfo stock={stock} quantity={quantity} />
    </div>
  );
};

export default ProductActions;
