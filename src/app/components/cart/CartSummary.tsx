"use client";

import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/store/store";
import { loadCart, clearCart, removeFromCart } from "@/lib/store/cartSlice";
import { ShoppingCart, Trash2, CreditCard, Package } from "lucide-react";

const CartSummary = () => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);

  useEffect(() => {
    dispatch(loadCart());
  }, [dispatch]);

  const totalItems = cartItems?.reduce((sum, item) => sum + (item?.quantity || 0), 0) || 0;

  const totalProducts = cartItems?.length || 0;

  const totalAmount =
    cartItems?.reduce((sum, item) => {
      return sum + (item?.price ? item.price * item.quantity : 0);
    }, 0) || 0;

  const formattedTotal = new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "COP",
  }).format(totalAmount);

  const handleCheckout = () => {
    if (totalItems > 0) {
      alert(`Procesando compra por ${formattedTotal}. ¡Gracias por su compra!`);
      dispatch(clearCart());
      if (typeof window !== "undefined") {
        localStorage.removeItem("carrito");
      }
    }
  };

  const handleClearCart = () => {
    if (confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
      dispatch(clearCart());
      if (typeof window !== "undefined") {
        localStorage.removeItem("carrito");
      }
    }
  };

  const handleRemoveItem = (productId: number) => {
    dispatch(removeFromCart(productId));
  };

  return (
    <aside className="cart-summary">
      <div className="cart-header">
        <h2 className="cart-title">
          <ShoppingCart size={20} />
          <span>Mi Carrito</span>
        </h2>
      </div>

      <div className="cart-stats">
        <div className="stat-item">
          <span className="stat-label">Productos:</span>
          <span className="stat-value">{totalProducts}</span>
        </div>

        <div className="stat-item">
          <span className="stat-label">Unidades:</span>
          <span className="stat-value">{totalItems}</span>
        </div>

        <div className="stat-item total-amount">
          <span className="stat-label">Total:</span>
          <span className="stat-value">{formattedTotal}</span>
        </div>
      </div>

      {cartItems && cartItems.length > 0 && (
        <div className="cart-items">
          <h3 className="items-title">Productos en el carrito:</h3>
          <div className="items-list">
            {cartItems.map((item) => {
              if (!item) return null;

              // Ya tenemos item.total en el carrito
              const formattedItemTotal = new Intl.NumberFormat("es-ES", {
                style: "currency",
                currency: "COP",
              }).format(item.price * item.quantity);

              return (
                <div key={item.id} className="cart-item">
                  <div className="item-info">
                    <span className="item-name">{item.name}</span>
                    <span className="item-quantity">x{item.quantity}</span>
                  </div>
                  <div className="item-actions">
                    <span className="item-price">{formattedItemTotal}</span>
                    <button onClick={() => handleRemoveItem(item.id)} className="remove-item-btn" title="Eliminar del carrito">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="cart-actions">
        <button onClick={handleCheckout} disabled={totalItems === 0} className="checkout-btn">
          <CreditCard size={18} />
          <span>Finalizar Compra</span>
        </button>

        {totalItems > 0 && (
          <button onClick={handleClearCart} className="clear-cart-btn">
            <Trash2 size={16} />
            <span>Vaciar Carrito</span>
          </button>
        )}
      </div>
    </aside>
  );
};

export default CartSummary;
