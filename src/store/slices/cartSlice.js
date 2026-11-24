import { createSlice, createSelector } from '@reduxjs/toolkit';

const loadSavedCart = () => {
  try {
    const saved = localStorage.getItem('freshharvest_cart');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const initialState = {
  items: loadSavedCart(), // [{ id, name, price, unit, image, quantity }]
  isOpen: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existing = state.items.find((item) => item.id === product.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          unit: product.unit,
          image: product.image,
          quantity: 1,
        });
      }
    },
    decrementQuantity: (state, action) => {
      const id = action.payload;
      const existing = state.items.find((item) => item.id === id);
      if (!existing) return;

      if (existing.quantity > 1) {
        existing.quantity -= 1;
      } else {
        state.items = state.items.filter((item) => item.id !== id);
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    closeCart: (state) => {
      state.isOpen = false;
    },
  },
});

export const {
  addToCart,
  decrementQuantity,
  removeFromCart,
  clearCart,
  toggleCart,
  closeCart,
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartIsOpen = (state) => state.cart.isOpen;

export const selectCartCount = createSelector([selectCartItems], (items) =>
  items.reduce((sum, item) => sum + item.quantity, 0)
);

export const selectCartSubtotal = createSelector([selectCartItems], (items) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0)
);

export const selectItemQuantityById = (id) => (state) => {
  const item = state.cart.items.find((i) => i.id === id);
  return item ? item.quantity : 0;
};

export default cartSlice.reducer;