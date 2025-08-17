import "./globals.css";
import { Providers } from "./providers";
import CartSummary from "./components/cart/CartSummary";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Providers>
          <div className="flex min-h-screen">
            <main className="flex-1 p-4">{children}</main>
            <section className="w-72 mt-25 p-5 flex flex-col justify-between sticky top-6 h-fit self-start border-l border-gray-300">
              <CartSummary />
            </section>
          </div>
        </Providers>
      </body>
    </html>
  );
}
