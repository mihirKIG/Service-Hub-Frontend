import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import providerService from '@api/providerService';

// Initial state
const initialState = {
  // Provider Profile
  profile: null,
  
  // Dashboard Stats
  stats: null,
  earningsGraph: null,
  
  // Services
  myServices: [],
  currentService: null,
  
  // Orders
  myOrders: [],
  currentOrder: null,
  ordersPagination: {
    total: 0,
    page: 1,
    pages: 1,
  },
  
  // Earnings
  earnings: [],
  earningsSummary: null,
  
  // Applications
  applications: [],
  currentApplication: null,
  
  // Service Posts
  servicePosts: [],
  currentServicePost: null,
  
  // Loading states
  loading: false,
  servicesLoading: false,
  ordersLoading: false,
  earningsLoading: false,
  applicationsLoading: false,
  
  // Error
  error: null,
};

// ============================================
// ASYNC THUNKS
// ============================================

// Dashboard
export const fetchDashboardStats = createAsyncThunk(
  'providerManagement/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await providerService.getProviderDashboardStats();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchEarningsGraph = createAsyncThunk(
  'providerManagement/fetchEarningsGraph',
  async (period = 'week', { rejectWithValue }) => {
    try {
      const response = await providerService.getProviderEarningsGraph(period);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Services
export const fetchMyServices = createAsyncThunk(
  'providerManagement/fetchMyServices',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await providerService.getMyServices(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createProviderService = createAsyncThunk(
  'providerManagement/createService',
  async (serviceData, { rejectWithValue }) => {
    try {
      const response = await providerService.createService(serviceData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateProviderService = createAsyncThunk(
  'providerManagement/updateService',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await providerService.updateService(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteProviderService = createAsyncThunk(
  'providerManagement/deleteService',
  async (id, { rejectWithValue }) => {
    try {
      await providerService.deleteService(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const toggleServiceStatus = createAsyncThunk(
  'providerManagement/toggleServiceStatus',
  async (id, { rejectWithValue }) => {
    try {
      const response = await providerService.toggleServiceStatus(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Orders
export const fetchProviderOrders = createAsyncThunk(
  'providerManagement/fetchProviderOrders',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await providerService.getProviderOrders(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const acceptOrder = createAsyncThunk(
  'providerManagement/acceptOrder',
  async (id, { rejectWithValue }) => {
    try {
      const response = await providerService.acceptOrder(id);
      return { id, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const rejectOrder = createAsyncThunk(
  'providerManagement/rejectOrder',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const response = await providerService.rejectOrder(id, reason);
      return { id, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'providerManagement/updateOrderStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await providerService.updateOrderStatus(id, status);
      return { id, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const uploadWorkProof = createAsyncThunk(
  'providerManagement/uploadWorkProof',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await providerService.uploadWorkProof(id, data);
      return { id, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Earnings
export const fetchEarningsHistory = createAsyncThunk(
  'providerManagement/fetchEarningsHistory',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await providerService.getEarningsHistory(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchEarningsSummary = createAsyncThunk(
  'providerManagement/fetchEarningsSummary',
  async (_, { rejectWithValue }) => {
    try {
      const response = await providerService.getEarningsSummary();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Profile
export const fetchProviderProfile = createAsyncThunk(
  'providerManagement/fetchProviderProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await providerService.getProviderProfile();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateProviderProfile = createAsyncThunk(
  'providerManagement/updateProviderProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await providerService.updateProviderProfile(profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Applications
export const submitApplication = createAsyncThunk(
  'providerManagement/submitApplication',
  async (applicationData, { rejectWithValue }) => {
    try {
      const response = await providerService.submitProviderApplication(applicationData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchMyApplications = createAsyncThunk(
  'providerManagement/fetchMyApplications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await providerService.getMyApplications();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Service Posts
export const fetchServicePosts = createAsyncThunk(
  'providerManagement/fetchServicePosts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await providerService.getServicePosts(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchServicePost = createAsyncThunk(
  'providerManagement/fetchServicePost',
  async (id, { rejectWithValue }) => {
    try {
      const response = await providerService.getServicePost(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ============================================
// SLICE
// ============================================

const providerManagementSlice = createSlice({
  name: 'providerManagement',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentService: (state) => {
      state.currentService = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    setCurrentService: (state, action) => {
      state.currentService = action.payload;
    },
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Dashboard Stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Earnings Graph
      .addCase(fetchEarningsGraph.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEarningsGraph.fulfilled, (state, action) => {
        state.loading = false;
        state.earningsGraph = action.payload;
      })
      .addCase(fetchEarningsGraph.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Services
      .addCase(fetchMyServices.pending, (state) => {
        state.servicesLoading = true;
        state.error = null;
      })
      .addCase(fetchMyServices.fulfilled, (state, action) => {
        state.servicesLoading = false;
        state.myServices = action.payload;
      })
      .addCase(fetchMyServices.rejected, (state, action) => {
        state.servicesLoading = false;
        state.error = action.payload;
      })
      
      // Create Service
      .addCase(createProviderService.fulfilled, (state, action) => {
        state.myServices.push(action.payload);
      })
      
      // Update Service
      .addCase(updateProviderService.fulfilled, (state, action) => {
        const index = state.myServices.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.myServices[index] = action.payload;
        }
      })
      
      // Delete Service
      .addCase(deleteProviderService.fulfilled, (state, action) => {
        state.myServices = state.myServices.filter(s => s.id !== action.payload);
      })
      
      // Toggle Service Status
      .addCase(toggleServiceStatus.fulfilled, (state, action) => {
        const index = state.myServices.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.myServices[index] = action.payload;
        }
      })
      
      // Fetch Orders
      .addCase(fetchProviderOrders.pending, (state) => {
        state.ordersLoading = true;
        state.error = null;
      })
      .addCase(fetchProviderOrders.fulfilled, (state, action) => {
        state.ordersLoading = false;
        state.myOrders = action.payload.data;
        state.ordersPagination = action.payload.pagination || state.ordersPagination;
      })
      .addCase(fetchProviderOrders.rejected, (state, action) => {
        state.ordersLoading = false;
        state.error = action.payload;
      })
      
      // Accept Order
      .addCase(acceptOrder.fulfilled, (state, action) => {
        const index = state.myOrders.findIndex(o => o.id === action.payload.id);
        if (index !== -1) {
          state.myOrders[index].status = 'accepted';
        }
      })
      
      // Reject Order
      .addCase(rejectOrder.fulfilled, (state, action) => {
        const index = state.myOrders.findIndex(o => o.id === action.payload.id);
        if (index !== -1) {
          state.myOrders[index].status = 'rejected';
        }
      })
      
      // Update Order Status
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.myOrders.findIndex(o => o.id === action.payload.id);
        if (index !== -1) {
          state.myOrders[index] = action.payload.data;
        }
      })
      
      // Earnings
      .addCase(fetchEarningsHistory.pending, (state) => {
        state.earningsLoading = true;
      })
      .addCase(fetchEarningsHistory.fulfilled, (state, action) => {
        state.earningsLoading = false;
        state.earnings = action.payload;
      })
      .addCase(fetchEarningsHistory.rejected, (state, action) => {
        state.earningsLoading = false;
        state.error = action.payload;
      })
      
      .addCase(fetchEarningsSummary.fulfilled, (state, action) => {
        state.earningsSummary = action.payload;
      })
      
      // Profile
      .addCase(fetchProviderProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      
      .addCase(updateProviderProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      
      // Applications
      .addCase(fetchMyApplications.pending, (state) => {
        state.applicationsLoading = true;
      })
      .addCase(fetchMyApplications.fulfilled, (state, action) => {
        state.applicationsLoading = false;
        state.applications = action.payload;
      })
      .addCase(fetchMyApplications.rejected, (state, action) => {
        state.applicationsLoading = false;
        state.error = action.payload;
      })
      
      .addCase(submitApplication.fulfilled, (state, action) => {
        state.applications.push(action.payload);
      })
      
      // Service Posts
      .addCase(fetchServicePosts.fulfilled, (state, action) => {
        // Handle both array and object responses
        state.servicePosts = Array.isArray(action.payload) 
          ? action.payload 
          : action.payload?.data || action.payload?.results || [];
      })
      
      .addCase(fetchServicePost.fulfilled, (state, action) => {
        state.currentServicePost = action.payload;
      });
  },
});

// Export actions
export const {
  clearError,
  clearCurrentService,
  clearCurrentOrder,
  setCurrentService,
  setCurrentOrder,
} = providerManagementSlice.actions;

// Selectors
export const selectProviderProfile = (state) => state.providerManagement.profile;
export const selectProviderStats = (state) => state.providerManagement.stats;
export const selectProviderEarningsGraph = (state) => state.providerManagement.earningsGraph;
export const selectMyServices = (state) => state.providerManagement.myServices;
export const selectCurrentService = (state) => state.providerManagement.currentService;
export const selectMyOrders = (state) => state.providerManagement.myOrders;
export const selectCurrentOrder = (state) => state.providerManagement.currentOrder;
export const selectProviderEarnings = (state) => state.providerManagement.earnings;
export const selectEarningsSummary = (state) => state.providerManagement.earningsSummary;
export const selectApplications = (state) => state.providerManagement.applications;
export const selectServicePosts = (state) => state.providerManagement.servicePosts;
export const selectCurrentServicePost = (state) => state.providerManagement.currentServicePost;
export const selectProviderLoading = (state) => state.providerManagement.loading;
export const selectServicesLoading = (state) => state.providerManagement.servicesLoading;
export const selectOrdersLoading = (state) => state.providerManagement.ordersLoading;
export const selectProviderError = (state) => state.providerManagement.error;

export default providerManagementSlice.reducer;
