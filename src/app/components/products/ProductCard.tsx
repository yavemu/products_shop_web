"use client";

import { useDispatch } from "react-redux";
import { addToCart } from "@/store/cartSlice";
import { Product } from "@/types/products/product";
import ProductImage from "./ProductImage";
import ProductActions from "./ProductActions";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const dispatch = useDispatch();

  const handleAdd = (quantity: number) => {
    dispatch(
      addToCart({
        ...product,
        quantity,
      }),
    );
  };

  return (
    <div className=" border rounded-2xl p-4 shadow-md flex flex-col gap-3 min-w-[300px] max-w-[400px] mx-auto">
      <h3 className="text-lg font-semibold self-center text-center line-clamp-2 min-h-[3.5rem]">{product.name}</h3>
      <ProductImage src={product.mainImage} alt={product.name} />
      <p className="text-sm text-gray-600 line-clamp-3">{product.description}</p>
      <p className="font-bold text-green-600">${product.price}</p>
      <ProductActions product={product} onAdd={handleAdd} />
    </div>
  );
}
