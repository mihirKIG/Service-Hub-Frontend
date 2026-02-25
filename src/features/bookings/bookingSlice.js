import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { bookingApi } from '@api/bookingApi';
import toast from 'react-hot-toast';

// Async thunks
export const fetchBookings = createAsyncThunk(
  'bookings/fetchBookings',
  async (params, { rejectWithValue }) => {
    try {
      const response = await bookingApi.getBookings(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchBookingById = createAsyncThunk(
  'bookings/fetchBookingById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await bookingApi.getBookingById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const createBooking = createAsyncThunk(
  'bookings/createBooking',
  async (data, { rejectWithValue }) => {
    try {
      const response = await bookingApi.createBooking(data);
      toast.success('Booking created successfully');
      return response.data;
    } catch (error) {
      toast.error('Failed to create booking');
      return rejectWithValue(error.response?.data);
    }
  }
);

export const cancelBooking = createAsyncThunk(
  'bookings/cancelBooking',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const response = await bookingApi.cancelBooking(id, reason);
      toast.success('Booking cancelled');
      return response.data;
    } catch (error) {
      toast.error('Failed to cancel booking');
      return rejectWithValue(error.response?.data);
    }
  }
);

export const confirmBooking = createAsyncThunk(
  'bookings/confirmBooking',
  async (id, { rejectWithValue }) => {
    try {
      const response = await bookingApi.confirmBooking(id);
      toast.success('Booking confirmed');
      return response.data;
    } catch (error) {
      toast.error('Failed to confirm booking');
      return rejectWithValue(error.response?.data);
    }
  }
);

const initialState = {
  bookings: [],
  currentBooking: null,
  upcomingBookings: [],
  loading: false,
  error: null,
};

const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    },
    clearBookings: (state) => {
      state.bookings = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch bookings
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload.results || action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch booking by ID
      .addCase(fetchBookingById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBookingById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload;
      })
      .addCase(fetchBookingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create booking
      .addCase(createBooking.fulfilled, (state, action) => {
        state.bookings.unshift(action.payload);
        state.currentBooking = action.payload;
      })
      // Cancel booking
      .addCase(cancelBooking.fulfilled, (state, action) => {
        const index = state.bookings.findIndex(b => b.id === action.payload.id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
        if (state.currentBooking?.id === action.payload.id) {
          state.currentBooking = action.payload;
        }
      })
      // Confirm booking
      .addCase(confirmBooking.fulfilled, (state, action) => {
        const index = state.bookings.findIndex(b => b.id === action.payload.id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
        if (state.currentBooking?.id === action.payload.id) {
          state.currentBooking = action.payload;
        }
      });
  },
});

export const { clearCurrentBooking, clearBookings } = bookingSlice.actions;
export default bookingSlice.reducer;
