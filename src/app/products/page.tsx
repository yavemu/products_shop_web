import { Product } from "@/types/products/product";
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
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">Productos</h1>

      {products.length === 0 ? (
        <p>No hay productos.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </main>
  );
}
