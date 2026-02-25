import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { providerApi } from '@api/providerApi';
import toast from 'react-hot-toast';

// Async thunks
export const fetchProviders = createAsyncThunk(
  'providers/fetchProviders',
  async (params, { rejectWithValue }) => {
    try {
      const response = await providerApi.getProviders(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchProviderById = createAsyncThunk(
  'providers/fetchProviderById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await providerApi.getProviderById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const createProvider = createAsyncThunk(
  'providers/createProvider',
  async (data, { rejectWithValue }) => {
    try {
      const response = await providerApi.createProvider(data);
      toast.success('Provider profile created successfully');
      return response.data;
    } catch (error) {
      toast.error('Failed to create provider profile');
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'providers/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await providerApi.getCategories();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const initialState = {
  providers: [],
  currentProvider: null,
  categories: [],
  loading: false,
  error: null,
  pagination: {
    count: 0,
    next: null,
    previous: null,
  },
};

const providerSlice = createSlice({
  name: 'providers',
  initialState,
  reducers: {
    clearCurrentProvider: (state) => {
      state.currentProvider = null;
    },
    clearProviders: (state) => {
      state.providers = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch providers
      .addCase(fetchProviders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProviders.fulfilled, (state, action) => {
        state.loading = false;
        state.providers = action.payload.results || action.payload;
        state.pagination = {
          count: action.payload.count,
          next: action.payload.next,
          previous: action.payload.previous,
        };
      })
      .addCase(fetchProviders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch provider by ID
      .addCase(fetchProviderById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProviderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProvider = action.payload;
      })
      .addCase(fetchProviderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create provider
      .addCase(createProvider.fulfilled, (state, action) => {
        state.currentProvider = action.payload;
      })
      // Fetch categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      });
  },
});

export const { clearCurrentProvider, clearProviders } = providerSlice.actions;
export default providerSlice.reducer;
