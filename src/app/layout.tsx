import type { Metadata } from "next";
import "./globals.css";
import { ShoppingBag } from "lucide-react";
import CartSummary from "./components/cart/CartSummary";
import { StoreProvider } from "@/lib/store/providers";

export const metadata: Metadata = {
  title: "My Product Store",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#6366f1" />
      </head>
      <body>
        <StoreProvider>
          <CartSummary />

          <div className="main-layout">
            <header className="app-header">
              <h1 className="app-title">
                <ShoppingBag size={24} style={{ display: "inline", marginRight: "0.5rem" }} />
                My Product Store
              </h1>
            </header>

            <div className="app-content">
              <main>{children}</main>
            </div>
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
