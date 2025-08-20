import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store/providers";
import Header from "./components/Header";

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
          <div className="main-layout">
            <Header />

            <div className="app-content">
              <main>{children}</main>
            </div>
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
