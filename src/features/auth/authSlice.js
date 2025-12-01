import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '@api/authApi';
import { storage } from '@utils/storage';
import toast from 'react-hot-toast';

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      const { access, refresh, user } = response.data;
      
      storage.setAccessToken(access);
      storage.setRefreshToken(refresh);
      storage.setUser(user);
      
      return { user, tokens: { access, refresh } };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Login failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authApi.register(userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Registration failed');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout();
      storage.clearTokens();
      storage.clearUser();
    } catch (error) {
      // Logout anyway even if API call fails
      storage.clearTokens();
      storage.clearUser();
    }
  }
);

const initialState = {
  user: storage.getUser(),
  isAuthenticated: !!storage.getAccessToken(),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      storage.setUser(action.payload);
    },
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      storage.clearTokens();
      storage.clearUser();
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        toast.success('Login successful!');
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload?.detail || 'Login failed');
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
        toast.success('Registration successful! Please check your email.');
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error('Registration failed');
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        toast.success('Logged out successfully');
      });
  },
});

export const { setUser, clearAuth, clearError } = authSlice.actions;
export default authSlice.reducer;
