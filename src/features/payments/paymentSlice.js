import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { paymentApi } from '@api/paymentApi';
import toast from 'react-hot-toast';

// Async thunks
export const fetchPayments = createAsyncThunk(
  'payments/fetchPayments',
  async (params, { rejectWithValue }) => {
    try {
      const response = await paymentApi.getPayments(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const createPayment = createAsyncThunk(
  'payments/createPayment',
  async (data, { rejectWithValue }) => {
    try {
      const response = await paymentApi.createPayment(data);
      return response.data;
    } catch (error) {
      toast.error('Payment failed');
      return rejectWithValue(error.response?.data);
    }
  }
);

export const confirmPayment = createAsyncThunk(
  'payments/confirmPayment',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await paymentApi.confirmPayment(id, data);
      toast.success('Payment successful');
      return response.data;
    } catch (error) {
      toast.error('Payment confirmation failed');
      return rejectWithValue(error.response?.data);
    }
  }
);

export const requestRefund = createAsyncThunk(
  'payments/requestRefund',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await paymentApi.requestRefund(id, data);
      toast.success('Refund requested');
      return response.data;
    } catch (error) {
      toast.error('Failed to request refund');
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchPaymentMethods = createAsyncThunk(
  'payments/fetchPaymentMethods',
  async (_, { rejectWithValue }) => {
    try {
      const response = await paymentApi.getPaymentMethods();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const initialState = {
  payments: [],
  paymentMethods: [],
  currentPayment: null,
  loading: false,
  error: null,
};

const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    clearCurrentPayment: (state) => {
      state.currentPayment = null;
    },
    clearPayments: (state) => {
      state.payments = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch payments
      .addCase(fetchPayments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload.results || action.payload;
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create payment
      .addCase(createPayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPayment = action.payload;
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Confirm payment
      .addCase(confirmPayment.fulfilled, (state, action) => {
        state.currentPayment = action.payload;
        state.payments.unshift(action.payload);
      })
      // Fetch payment methods
      .addCase(fetchPaymentMethods.fulfilled, (state, action) => {
        state.paymentMethods = action.payload;
      });
  },
});

export const { clearCurrentPayment, clearPayments } = paymentSlice.actions;
export default paymentSlice.reducer;
