import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from './storage';
import cartReducer from './slices/cartSlice';
import wishlistReducer from './slices/wishlistSlice';
import userReducer, { initialState as userInitialState } from './slices/userSlice';

const safeUserReducer = (state: any, action: any) => {
  const s = state === null ? undefined : state;
  const result = userReducer(s, action);
  return result === null ? userInitialState : result;
};

const rootReducer = combineReducers({
  cart: cartReducer,
  wishlist: wishlistReducer,
  user: safeUserReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['cart', 'wishlist', 'user'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const rootReducerWithSafety = (state: any, action: any) => {
  const nextState = persistedReducer(state, action);
  if (nextState && (nextState.user === null || nextState.user === undefined)) {
    return {
      ...nextState,
      user: userInitialState,
    };
  }
  return nextState;
};

export const store = configureStore({
  reducer: rootReducerWithSafety,
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
