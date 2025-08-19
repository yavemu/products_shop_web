import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem, Product } from "@/lib/types/product";

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product & { quantity: number }>) => {
      // const existing = state.items.find((item) => item.id === action.payload.id);
      // if (existing) {
      //   existing.quantity = action.payload.quantity;
      // } else {
      //   state.items.push(action.payload);
      // }

      const stored = localStorage.getItem("carrito");

      // Guardar en localStorage de forma segura
      if (typeof window !== "undefined") {
        localStorage.setItem("carrito", JSON.stringify(state.items));
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
