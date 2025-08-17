import { Product } from "@/types/products/product";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartItem extends Product {
  quantity: number;
}

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
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find((item) => item.id === action.payload.id);
      if (existing) {
        existing.quantity = action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    loadCart: (state) => {
      const stored = localStorage.getItem("cart");
      if (stored) {
        state.items = JSON.parse(stored);
      }
    },
  },
});

export const { addToCart, loadCart } = cartSlice.actions;
export default cartSlice.reducer;
