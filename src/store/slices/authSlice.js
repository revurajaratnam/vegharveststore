import { createSlice } from '@reduxjs/toolkit';

const loadSavedUser = () => {
  try {
    const savedUser = localStorage.getItem('auth_user');
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    localStorage.removeItem('auth_user');
    return null;
  }
};

const savedToken = localStorage.getItem('auth_token');

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: loadSavedUser(),
    token: savedToken || null,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('auth_user', JSON.stringify(action.payload.user));
      localStorage.setItem('auth_token', action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_token');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export const selectCurrentUser = (state) => state.auth.user;
export default authSlice.reducer;