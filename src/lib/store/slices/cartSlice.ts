import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  product: string; // Product ID
  title: string;
  quantity: number;
  price: number;
  variation?: string;
  image?: string;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const { product, variation, quantity } = action.payload;
      const existingItem = state.items.find(
        (item) => item.product === product && item.variation === variation
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    removeFromCart(state, action: PayloadAction<{ product: string; variation?: string }>) {
      state.items = state.items.filter(
        (item) =>
          !(item.product === action.payload.product && item.variation === action.payload.variation)
      );
    },
    updateQuantity(
      state,
      action: PayloadAction<{ product: string; variation?: string; quantity: number }>
    ) {
      const item = state.items.find(
        (item) =>
          item.product === action.payload.product && item.variation === action.payload.variation
      );
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
    clearCart(state) {
      state.items = [];
    },
    setCartItems(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, setCartItems } = cartSlice.actions;
export default cartSlice.reducer;
