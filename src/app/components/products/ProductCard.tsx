"use client";

import { useDispatch } from "react-redux";
import { addToCart } from "@/lib/store/cartSlice";
import { Product } from "@/types/product";
import ProductImage from "./ProductImage";
import ProductActions from "./ProductActions";
import { Package } from "lucide-react";
import { formatCurrency } from "@/lib/currency-utils";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const dispatch = useDispatch();

  const handleAdd = ({ id, quantity, totalPrice, name }: { id: string | number; quantity: number; totalPrice: number; name: string }) => {
    console.log("estoy en handleAdd", { id, quantity, totalPrice, name });
    dispatch(
      addToCart({
        id,
        quantity,
        name,
        totalPrice,
      }),
    );
  };

  if (!product) {
    return <div className="product-card-skeleton">Cargando...</div>;
  }

  return (
    <article className="product-card">
      <div className="product-card-header">
        <div className="product-brand">
          <Package size={14} />
          <span>{product.brand}</span>
        </div>
        <div className="product-stock">Stock: {product.stock}</div>
      </div>
      <div className="product-image-wrapper">
        <ProductImage src={product.mainImage} alt={product.name} />
      </div>
      <div className="product-info">
        <h3 className="product-title">{product.name}</h3>
      </div>
      <p className="product-description">{product.description}</p>
      <div className="product-price">
        <small>Subtotal: {formatCurrency(product.price)}</small>
        <br />
        <b>
          Total +({product.tax}%) {formatCurrency(product.totalPrice)}
        </b>
      </div>
      <ProductActions product={product} onAdd={handleAdd} />
    </article>
  );
}
