"use client";

import { Product } from "@/lib/types/product";
import { useState, useEffect } from "react";
import QuantitySelectorUI from "../ui/quantity-selector";

interface Props {
  product: Product;
  onAdd: ({ id, quantity, name, price }: { id: string | number; quantity: number; name: string; price: number }) => void;
}

const AvailableStock = ({ availableStock }: { availableStock: number }) => (
  <div className="stock-info">
    <span className="available-stock">Disponible: {availableStock}</span>
  </div>
);

const ProductActions = ({ product, onAdd }: Props) => {
  const [quantityToAdd, setQuantityToAdd] = useState(0);
  const { id: productId, stock } = product;
  const availableStock = product.stock - quantityToAdd;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
      const existingItem = carrito.find((item: any) => item.id === productId);
      if (existingItem) {
        setQuantityToAdd(existingItem.quantity);
      }
    }
  }, [productId]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
      const existingItemIndex = carrito.findIndex((item: any) => item.id === product.id);
      console.log("existingItemIndex", existingItemIndex);
      if (quantityToAdd > 0) {
        const cartItem = {
          id: product.id,
          name: product.name,
          quantity: quantityToAdd,
          price: product.price,
        };

        if (existingItemIndex >= 0) {
          carrito[existingItemIndex] = cartItem;
        } else {
          carrito.push(cartItem);
        }

        localStorage.setItem("carrito", JSON.stringify(carrito));
        onAdd({ id: product.id, quantity: quantityToAdd, name: product.name, price: product.price });
      }
    }
  }, [quantityToAdd, onAdd, product]);

  const decrease = () => {
    if (quantityToAdd > 0) setQuantityToAdd((q) => q - 1);
  };

  const increase = () => {
    if (quantityToAdd < stock) setQuantityToAdd((q) => q + 1);
  };

  if (!product) {
    return <div className="product-card-skeleton">Cargando...</div>;
  }

  return (
    <div className="flex flex-col gap-3 items-center ">
      <QuantitySelectorUI quantity={quantityToAdd} onDecrease={decrease} onIncrease={increase} maxQuantity={stock} />
      <AvailableStock availableStock={availableStock} />
    </div>
  );
};

export default ProductActions;
