import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface WishlistItem {
  product: string; // Product ID
  title: string;
  price: number;
  image?: string;
}

interface WishlistState {
  items: WishlistItem[];
}

const initialState: WishlistState = {
  items: [],
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist(state, action: PayloadAction<WishlistItem>) {
      const exists = state.items.some((item) => item.product === action.payload.product);
      if (!exists) {
        state.items.push(action.payload);
      }
    },
    removeFromWishlist(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.product !== action.payload);
    },
    toggleWishlist(state, action: PayloadAction<WishlistItem>) {
      const index = state.items.findIndex((item) => item.product === action.payload.product);
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push(action.payload);
      }
    },
    clearWishlist(state) {
      state.items = [];
    },
    setWishlist(state, action: PayloadAction<WishlistItem[]>) {
      state.items = action.payload;
    },
  },
});

export const { addToWishlist, removeFromWishlist, toggleWishlist, clearWishlist, setWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
