import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { setUser, clearUser } from './userSlice';

export interface CartItem {
  product: string; // Product ID
  title: string;
  quantity: number;
  price: number;
  variation?: string;
  image?: string;
}

interface CartState {
  items: CartItem[]; // Currently active items for components to render
  guestItems: CartItem[]; // Preserved guest session cart items
  userCarts: { [userId: string]: CartItem[] }; // Scoped carts for logged-in users
  activeUserId: string | null; // Tracks active authenticated user ID
}

const initialState: CartState = {
  items: [],
  guestItems: [],
  userCarts: {},
  activeUserId: null,
};

// DRY helper to update the appropriate partition (guest vs specific user)
const syncCartPartition = (state: CartState) => {
  if (!state.userCarts) state.userCarts = {};
  if (!state.guestItems) state.guestItems = [];
  if (state.activeUserId) {
    state.userCarts[state.activeUserId] = state.items;
  } else {
    state.guestItems = state.items;
  }
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
      syncCartPartition(state);
    },
    removeFromCart(state, action: PayloadAction<{ product: string; variation?: string }>) {
      state.items = state.items.filter(
        (item) =>
          !(item.product === action.payload.product && item.variation === action.payload.variation)
      );
      syncCartPartition(state);
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
      syncCartPartition(state);
    },
    clearCart(state) {
      state.items = [];
      syncCartPartition(state);
    },
    setCartItems(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
      syncCartPartition(state);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setUser, (state, action) => {
        if (!state.userCarts) state.userCarts = {};
        if (!state.guestItems) state.guestItems = [];
        const userId = action.payload.id;
        state.activeUserId = userId;

        const guestCart = state.guestItems || [];
        const userCart = state.userCarts[userId] || [];
        
        // Merge guest items into existing user cart
        const mergedCart = [...userCart];
        guestCart.forEach((guestItem) => {
          const existingItem = mergedCart.find(
            (item) =>
              item.product === guestItem.product &&
              item.variation === guestItem.variation
          );
          if (existingItem) {
            existingItem.quantity += guestItem.quantity;
          } else {
            mergedCart.push(guestItem);
          }
        });

        state.userCarts[userId] = mergedCart;
        state.guestItems = []; // Clear temporary guest cart
        state.items = mergedCart; // Update active visible items
      })
      .addCase(clearUser, (state) => {
        if (!state.guestItems) state.guestItems = [];
        state.activeUserId = null;
        state.items = state.guestItems || []; // Restore guest items state
      });
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, setCartItems } = cartSlice.actions;
export default cartSlice.reducer;
