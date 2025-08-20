"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Package } from "lucide-react";

function Header() {
  const pathname = usePathname();
  const isProductsPage = pathname === "/" || pathname === "/products";

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-nav">
          <Link href="/" className="app-title-link">
            <h1 className="app-title">
              <ShoppingBag size={24} />
              <span>My Product Store</span>
            </h1>
          </Link>

          <nav className="header-navigation">
            <Link href="/" className={`nav-link ${isProductsPage ? "nav-link-active" : ""}`}>
              <Package size={18} />
              <span>Ver Productos</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
