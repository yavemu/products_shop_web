"use client";

import { formatCurrency } from "@/lib/currency-utils";
import { clearCart, loadCart, removeFromCart } from "@/lib/store/cartSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import { CreditCard, ShoppingCart, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo } from "react";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const LOCALE = "es-ES";

const CartSummary = () => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);

  useEffect(() => {
    dispatch(loadCart());
  }, [dispatch]);

  const cartStats = useMemo(() => {
    if (!cartItems?.length) {
      return {
        totalItems: 0,
        totalProducts: 0,
        totalAmount: 0,
        formattedTotal: formatCurrency(0),
      };
    }

    const totalItems = cartItems.reduce((sum, item) => sum + (item?.quantity || 0), 0);
    const totalProducts = cartItems.length;
    const totalAmount = cartItems.reduce((sum, item) => {
      return sum + (item?.price ? item.price * item.quantity : 0);
    }, 0);

    return {
      totalItems,
      totalProducts,
      totalAmount,
      formattedTotal: formatCurrency(totalAmount),
    };
  }, [cartItems]);

  const formatPrice = useCallback((amount: number) => {
    return formatCurrency(amount);
  }, []);

  const clearLocalStorage = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("carrito");
    }
  }, []);

  const handleCheckout = useCallback(() => {
    if (cartStats.totalItems > 0) {
      alert(`Procesando compra por ${cartStats.formattedTotal}. ¡Gracias por su compra!`);
      dispatch(clearCart());
      clearLocalStorage();
    }
  }, [cartStats.totalItems, cartStats.formattedTotal, dispatch, clearLocalStorage]);

  const handleClearCart = useCallback(() => {
    if (confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
      dispatch(clearCart());
      clearLocalStorage();
    }
  }, [dispatch, clearLocalStorage]);

  const handleRemoveItem = useCallback(
    (productId: number) => {
      dispatch(removeFromCart(productId));
    },
    [dispatch],
  );

  const CartStats = () => (
    <div className="cart-stats">
      <div className="stat-item">
        <span className="stat-label">Productos:</span>
        <span className="stat-value">{cartStats.totalProducts}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">Unidades:</span>
        <span className="stat-value">{cartStats.totalItems}</span>
      </div>
      <div className="stat-item total-amount">
        <span className="stat-label">Total:</span>
        <span className="stat-value">{cartStats.formattedTotal}</span>
      </div>
    </div>
  );

  const CartItemComponent = ({ item }: { item: CartItem }) => {
    const itemTotal = formatPrice(item.price * item.quantity);

    return (
      <div key={item.id} className="cart-item">
        <div className="item-info">
          <span className="item-name">{item.name}</span>
          <span className="item-quantity">x{item.quantity}</span>
        </div>
        <div className="item-actions">
          <span className="item-price">{itemTotal}</span>
          <button
            onClick={() => handleRemoveItem(item.id)}
            className="remove-item-btn"
            title="Eliminar del carrito"
            aria-label={`Eliminar ${item.name} del carrito`}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    );
  };

  const CartItemsList = () => {
    if (!cartItems?.length) return null;

    return (
      <div className="cart-items">
        <h3 className="items-title">Productos en el carrito:</h3>
        <div className="items-list">
          {cartItems.map((item) => {
            if (!item) return null;
            return <CartItemComponent key={item.id} item={item} />;
          })}
        </div>
      </div>
    );
  };

  const CartActions = () => (
    <div className="cart-actions">
      <button onClick={handleCheckout} disabled={cartStats.totalItems === 0} className="checkout-btn" aria-label="Finalizar compra">
        <CreditCard size={18} />
        <span>Finalizar Compra</span>
      </button>

      {cartStats.totalItems > 0 && (
        <button onClick={handleClearCart} className="clear-cart-btn" aria-label="Vaciar carrito">
          <Trash2 size={16} />
          <span>Vaciar Carrito</span>
        </button>
      )}
    </div>
  );

  return (
    <aside className="cart-summary" role="complementary" aria-label="Resumen del carrito">
      <div className="cart-header">
        <h2 className="cart-title">
          <ShoppingCart size={20} aria-hidden="true" />
          <span>Mi Carrito</span>
        </h2>
      </div>

      <CartStats />
      <CartItemsList />
      <CartActions />
    </aside>
  );
};

export default CartSummary;
