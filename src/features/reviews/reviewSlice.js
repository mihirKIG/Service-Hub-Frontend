import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { reviewApi } from '@api/reviewApi';
import toast from 'react-hot-toast';

// Async thunks
export const fetchReviews = createAsyncThunk(
  'reviews/fetchReviews',
  async (params, { rejectWithValue }) => {
    try {
      const response = await reviewApi.getReviews(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchProviderReviews = createAsyncThunk(
  'reviews/fetchProviderReviews',
  async ({ providerId, params }, { rejectWithValue }) => {
    try {
      const response = await reviewApi.getProviderReviews(providerId, params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const createReview = createAsyncThunk(
  'reviews/createReview',
  async (data, { rejectWithValue }) => {
    try {
      const response = await reviewApi.createReview(data);
      toast.success('Review submitted successfully');
      return response.data;
    } catch (error) {
      toast.error('Failed to submit review');
      return rejectWithValue(error.response?.data);
    }
  }
);

export const updateReview = createAsyncThunk(
  'reviews/updateReview',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await reviewApi.updateReview(id, data);
      toast.success('Review updated');
      return response.data;
    } catch (error) {
      toast.error('Failed to update review');
      return rejectWithValue(error.response?.data);
    }
  }
);

export const deleteReview = createAsyncThunk(
  'reviews/deleteReview',
  async (id, { rejectWithValue }) => {
    try {
      await reviewApi.deleteReview(id);
      toast.success('Review deleted');
      return id;
    } catch (error) {
      toast.error('Failed to delete review');
      return rejectWithValue(error.response?.data);
    }
  }
);

const initialState = {
  reviews: [],
  providerReviews: [],
  loading: false,
  error: null,
};

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    clearReviews: (state) => {
      state.reviews = [];
    },
    clearProviderReviews: (state) => {
      state.providerReviews = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch reviews
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.results || action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch provider reviews
      .addCase(fetchProviderReviews.fulfilled, (state, action) => {
        state.providerReviews = action.payload.results || action.payload;
      })
      // Create review
      .addCase(createReview.fulfilled, (state, action) => {
        state.reviews.unshift(action.payload);
      })
      // Update review
      .addCase(updateReview.fulfilled, (state, action) => {
        const index = state.reviews.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.reviews[index] = action.payload;
        }
      })
      // Delete review
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter(r => r.id !== action.payload);
      });
  },
});

export const { clearReviews, clearProviderReviews } = reviewSlice.actions;
export default reviewSlice.reducer;
