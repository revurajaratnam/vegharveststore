import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from './slices/authSlice';
import productsReducer from './slices/productsSlice';
import cartReducer from './slices/cartSlice';
import { ecommerceApi } from './api/ecommerceApi';
import toastReducer from './slices/toastSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    cart: cartReducer,
    toast: toastReducer,
    [ecommerceApi.reducerPath]: ecommerceApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(ecommerceApi.middleware),
});

setupListeners(store.dispatch);

store.subscribe(() => {
  try {
    const { items } = store.getState().cart;
    localStorage.setItem('freshharvest_cart', JSON.stringify(items));
  } catch {
    // Ignore storage quota errors
  }
});