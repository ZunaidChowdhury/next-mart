import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from './storage';
import cartReducer from './slices/cartSlice';
import wishlistReducer from './slices/wishlistSlice';
import userReducer from './slices/userSlice';

const rootReducer = combineReducers({
  cart: cartReducer,
  wishlist: wishlistReducer,
  user: userReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['cart', 'wishlist', 'user'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/PURGE',
          'persist/REGISTER',
          'persist/FLUSH',
        ],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
