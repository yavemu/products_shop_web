import cartReducer, { addToCart, removeFromCart, clearCart } from "../cartSlice";

interface CartState {
  items: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
  }>;
}

describe("cartSlice - basic functionality", () => {
  const initialState: CartState = {
    items: [],
  };

  const mockProduct = {
    id: 1,
    name: "Test Product",
    price: 10000,
    quantity: 2,
  };

  beforeEach(() => {
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
      writable: true,
    });
  });

  it("should return the initial state", () => {
    expect(cartReducer(undefined, { type: "unknown" })).toEqual({
      items: [],
    });
  });

  it("should handle addToCart", () => {
    const actual = cartReducer(initialState, addToCart(mockProduct));
    expect(actual.items).toHaveLength(1);
    expect(actual.items[0]).toEqual(mockProduct);
  });

  it("should handle removeFromCart", () => {
    const stateWithItem = { items: [mockProduct] };
    const actual = cartReducer(stateWithItem, removeFromCart(1));
    expect(actual.items).toHaveLength(0);
  });

  it("should handle clearCart", () => {
    const stateWithItems = {
      items: [mockProduct, { ...mockProduct, id: 2 }],
    };
    const actual = cartReducer(stateWithItems, clearCart());
    expect(actual.items).toHaveLength(0);
  });

  it("should add item to existing cart", () => {
    const existingItem = { id: 2, name: "Product 2", price: 15000, quantity: 1 };
    const stateWithItem = { items: [existingItem] };

    const actual = cartReducer(stateWithItem, addToCart(mockProduct));

    expect(actual.items).toHaveLength(2);
    expect(actual.items).toContainEqual(existingItem);
    expect(actual.items).toContainEqual(mockProduct);
  });

  it("should update quantity when adding existing item", () => {
    const stateWithItem = { items: [mockProduct] };
    const updatedProduct = { ...mockProduct, quantity: 5 };

    const actual = cartReducer(stateWithItem, addToCart(updatedProduct));

    expect(actual.items).toHaveLength(1);
    expect(actual.items[0].quantity).toBe(5);
  });
});
