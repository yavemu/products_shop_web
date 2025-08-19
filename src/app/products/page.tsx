import { Product } from "@/lib/types/product";
import ProductCard from "../components/products/ProductCard";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error("Error al consultar productos");
  }

  const products: Product[] = await res.json();

  return (
    <section className="products-section">
      <h3 className="section-title">Productos Destacados</h3>

      {products.length === 0 ? (
        <div className="no-products">
          <p>No hay productos disponibles</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
