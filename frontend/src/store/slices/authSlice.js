import { createSlice } from '@reduxjs/toolkit';

const TOKEN_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes
const REFRESH_BEFORE_MS = 5 * 60 * 1000; // Refresh 5 minutes before expiry

const storedUser = localStorage.getItem('user');

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: localStorage.getItem('token'),
  refreshToken: localStorage.getItem('refreshToken'),
  tokenExpiry: localStorage.getItem('tokenExpiry') ? parseInt(localStorage.getItem('tokenExpiry')) : null,
  isAuthenticated: !!localStorage.getItem('token'),
  sessionTimer: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { accessToken, refreshToken, user } = action.payload;
      state.token = accessToken;
      state.refreshToken = refreshToken;
      state.user = user;
      state.isAuthenticated = true;
      state.tokenExpiry = Date.now() + TOKEN_EXPIRY_MS;
      
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('tokenExpiry', state.tokenExpiry.toString());
      localStorage.setItem('user', JSON.stringify(user));
    },
    updateToken: (state, action) => {
      const { accessToken } = action.payload;
      state.token = accessToken;
      state.tokenExpiry = Date.now() + TOKEN_EXPIRY_MS;
      
      localStorage.setItem('token', accessToken);
      localStorage.setItem('tokenExpiry', state.tokenExpiry.toString());
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.tokenExpiry = null;
      state.isAuthenticated = false;
      state.sessionTimer = null;
      
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('tokenExpiry');
      localStorage.removeItem('user');
    },
    setSessionTimer: (state, action) => {
      state.sessionTimer = action.payload;
    },
    loadUserFromStorage: (state) => {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      const storedRefreshToken = localStorage.getItem('refreshToken');
      const storedTokenExpiry = localStorage.getItem('tokenExpiry');
      
      console.log('Loading from storage:', { 
        hasUser: !!storedUser, 
        hasToken: !!storedToken,
        hasRefreshToken: !!storedRefreshToken,
        tokenExpiry: storedTokenExpiry
      });
      
      if (storedUser && storedToken) {
        state.user = JSON.parse(storedUser);
        state.token = storedToken;
        state.refreshToken = storedRefreshToken;
        state.tokenExpiry = storedTokenExpiry ? parseInt(storedTokenExpiry) : null;
        state.isAuthenticated = true;
        console.log('Auth state loaded from storage:', state.user);
      } else {
        console.log('No valid auth data in storage');
      }
    },
  },
});

export const { setCredentials, updateToken, logout, setSessionTimer, loadUserFromStorage } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectTokenExpiry = (state) => state.auth.tokenExpiry;
export const selectUserRole = (state) => state.auth.user?.role;
