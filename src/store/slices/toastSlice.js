import { createSlice, nanoid } from '@reduxjs/toolkit';

const toastSlice = createSlice({
  name: 'toast',
  initialState: {
    items: [], // [{ id, message, type: 'success' | 'error' | 'info' }]
  },
  reducers: {
    addToast: {
      reducer: (state, action) => {
        state.items.push(action.payload);
      },
      prepare: (message, type = 'success') => ({
        payload: {
          id: nanoid(),
          message,
          type,
        },
      }),
    },
    removeToast: (state, action) => {
      state.items = state.items.filter((t) => t.id !== action.payload);
    },
  },
});

export const { addToast, removeToast } = toastSlice.actions;
export const selectToasts = (state) => state.toast.items;
export default toastSlice.reducer;