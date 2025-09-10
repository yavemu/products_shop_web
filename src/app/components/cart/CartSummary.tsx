"use client";

import { formatCurrency } from "@/lib/currency-utils";
import { clearCart, loadCart, removeFromCart, updateItemQuantity } from "@/lib/store/cartSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import { CreditCard, ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import { useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

interface CartItem {
  id: number;
  name: string;
  totalPrice: number;
  quantity: number;
}

const CartSummary = () => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const router = useRouter();

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
      return sum + (item?.totalPrice ? item.totalPrice * item.quantity : 0);
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
      router.push("/order");
    }
  }, [cartStats.totalItems, router]);

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

  const handleQuantityChange = useCallback(
    (productId: number, newQuantity: number) => {
      if (newQuantity <= 0) {
        dispatch(removeFromCart(productId));
      } else {
        dispatch(updateItemQuantity({ id: productId, quantity: newQuantity }));
      }
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
    const itemTotal = formatPrice(item.totalPrice * item.quantity);

    return (
      <div key={item.id} className="cart-item-expanded">
        <div className="item-info-expanded">
          <span className="item-name">{item.name}</span>
          <span className="item-unit-price">{formatPrice(item.totalPrice)} c/u</span>
        </div>
        <div className="item-controls">
          <div className="quantity-controls-cart">
            <button
              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
              className="quantity-btn-cart"
              disabled={item.quantity <= 1}
              title="Disminuir cantidad"
            >
              <Minus size={16} />
            </button>
            <span className="quantity-display-cart">{item.quantity}</span>
            <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)} className="quantity-btn-cart" title="Aumentar cantidad">
              <Plus size={16} />
            </button>
          </div>
          <span className="item-total-price">{itemTotal}</span>
          <button
            onClick={() => handleRemoveItem(item.id)}
            className="remove-item-btn"
            title="Eliminar del carrito"
            aria-label={`Eliminar ${item.name} del carrito`}
          >
            <Trash2 size={16} />
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
    <section className="cart-summary-full-width" aria-label="Resumen del carrito">
      <div className="cart-header">
        <h2 className="cart-title">
          <ShoppingCart size={20} aria-hidden="true" />
          <span>Mi Carrito</span>
        </h2>
      </div>

      <div className="cart-content-grid">
        <div className="cart-stats-section">
          <CartStats />
        </div>

        <div className="cart-items-section">
          <CartItemsList />
        </div>

        <div className="cart-actions-section">
          <CartActions />
        </div>
      </div>
    </section>
  );
};

export default CartSummary;
