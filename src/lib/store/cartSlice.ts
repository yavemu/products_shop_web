import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { productItem } from "@/components/products/ProductActions";

interface CartState {
  items: productItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { id, quantity, name, price } = action.payload;

      const existingItemIndex = state.items.findIndex((item) => item.id === id);

      if (existingItemIndex >= 0) {
        // Si ya existe, actualizar cantidad
        state.items[existingItemIndex].quantity = quantity;
      } else {
        // Si no existe, agregar nuevo item
        state.items.push({ id, quantity, name, price });
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      if (typeof window !== "undefined") {
        localStorage.setItem("carrito", JSON.stringify(state.items));
      }
    },
    clearCart: (state) => {
      state.items = [];
      if (typeof window !== "undefined") {
        localStorage.removeItem("carrito");
      }
    },
    loadCart: (state) => {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("carrito");
        if (stored) {
          try {
            state.items = JSON.parse(stored);
          } catch (error) {
            console.error("Error loading cart:", error);
            state.items = [];
          }
        }
      }
    },
  },
});

export const { addToCart, removeFromCart, clearCart, loadCart } = cartSlice.actions;
export default cartSlice.reducer;
