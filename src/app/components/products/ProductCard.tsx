"use client";

import { useDispatch } from "react-redux";
import { addToCart } from "@/lib/store/cartSlice";
import { Product } from "@/lib/types/product";
import ProductImage from "./ProductImage";
import ProductActions from "./ProductActions";
import { Package } from "lucide-react";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const dispatch = useDispatch();

  const handleAdd = ({ id, quantity, price, name }: { id: string | number; quantity: number; price: number; name: string }) => {
    console.log("estoy en handleAdd", { id, quantity, price, name });
    dispatch(
      addToCart({
        id,
        quantity,
        name,
        price,
      }),
    );
  };

  const formattedPrice = new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "COP",
  }).format(product.price);

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
      <div className="product-price">{formattedPrice}</div>
      <ProductActions product={product} onAdd={handleAdd} />
    </article>
  );
}
