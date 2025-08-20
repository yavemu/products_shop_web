"use client";
import { Product } from "@/lib/types/product";
import ProductCard from "../components/products/ProductCard";
import CartSummary from "../components/cart/CartSummary";
import ErrorMessage from "../components/ui/ErrorMessage";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useApi } from "@/lib/hooks/useApi";

export const dynamic = "force-dynamic";

export default function ProductsPage() {
  const { data: products, loading, error, retry } = useApi<Product[]>("/products");

  if (loading)
    return (
      <div className="products-page-layout">
        <LoadingSpinner message="Cargando productos..." />
      </div>
    );

  if (error)
    return (
      <div className="products-page-layout">
        <ErrorMessage error={error} onRetry={retry} />
      </div>
    );

  return (
    <div className="products-page-layout">
      <CartSummary />

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
    </div>
  );
}
