"use client";

import { Product } from "@/lib/types/product";
import { useState, useEffect } from "react";
import QuantitySelectorUI from "../ui/quantity-selector";

interface Props {
  product: Product;
  onAdd: (productId: number, quantity: number) => void;
}

const AvailableStock = ({ availableStock }: { availableStock: number }) => (
  <div className="stock-info">
    <span className="available-stock">Disponible: {availableStock}</span>
  </div>
);

const ProductActions = ({ product, onAdd }: Props) => {
  const [quantity, setQuantity] = useState(0);
  const { id: productId, stock } = product;
  const availableStock = product.stock - quantity;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
      const existingItem = carrito.find((item: any) => item.id === productId);
      if (existingItem) {
        setQuantity(existingItem.quantity);
      }
    }
  }, [productId]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
      const existingItemIndex = carrito.findIndex((item: any) => item.id === productId);

      if (quantity > 0) {
        const cartItem = {
          id: product.id,
          name: product.name,
          quantity: quantity,
        };

        if (existingItemIndex >= 0) {
          carrito[existingItemIndex] = cartItem;
        } else {
          carrito.push(cartItem);
        }
      } else {
        if (existingItemIndex >= 0) {
          carrito.splice(existingItemIndex, 1);
        }
      }

      localStorage.setItem("carrito", JSON.stringify(carrito));
    }

    onAdd(productId, quantity);
  }, [quantity, productId, product.name, product.id, onAdd]);

  const decrease = () => {
    if (quantity > 0) setQuantity((q) => q - 1);
  };

  const increase = () => {
    if (quantity < stock) setQuantity((q) => q + 1);
  };

  if (!product) {
    return <div className="product-card-skeleton">Cargando...</div>;
  }

  return (
    <div className="flex flex-col gap-3 items-center ">
      <QuantitySelectorUI quantity={quantity} onDecrease={decrease} onIncrease={increase} maxQuantity={stock} />
      <AvailableStock availableStock={availableStock} />
    </div>
  );
};

export default ProductActions;
