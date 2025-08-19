"use client";
import { Product } from "@/lib/types/product";
import ProductCard from "../components/products/ProductCard";
import { useApi } from "@/lib/hooks/useApi";

export const dynamic = "force-dynamic";

export default function ProductsPage() {
  const { data: products, loading, error } = useApi<Product[]>("/products");

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <section className="products-section">
      <h3 className="section-title">Productos Destacados</h3>

      {products && products.length === 0 ? (
        <div className="no-products">
          <p>No hay productos disponibles</p>
        </div>
      ) : (
        <div className="products-grid">
          {products?.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
