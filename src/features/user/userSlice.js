import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userApi } from '@api/userApi';
import { storage } from '@utils/storage';
import toast from 'react-hot-toast';

// Async thunks
export const fetchProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userApi.getProfile();
      storage.setUser(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (data, { rejectWithValue }) => {
    try {
      const response = await userApi.updateProfile(data);
      storage.setUser(response.data);
      toast.success('Profile updated successfully');
      return response.data;
    } catch (error) {
      toast.error('Failed to update profile');
      return rejectWithValue(error.response?.data);
    }
  }
);

export const uploadProfileImage = createAsyncThunk(
  'user/uploadProfileImage',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await userApi.uploadProfileImage(formData);
      toast.success('Profile image updated');
      return response.data;
    } catch (error) {
      toast.error('Failed to upload image');
      return rejectWithValue(error.response?.data);
    }
  }
);

export const changePassword = createAsyncThunk(
  'user/changePassword',
  async (data, { rejectWithValue }) => {
    try {
      await userApi.changePassword(data);
      toast.success('Password changed successfully');
    } catch (error) {
      toast.error('Failed to change password');
      return rejectWithValue(error.response?.data);
    }
  }
);

const initialState = {
  profile: storage.getUser(),
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.profile = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch profile
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Upload profile image
      .addCase(uploadProfileImage.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.profile_image = action.payload.profile_image;
        }
      });
  },
});

export const { clearProfile } = userSlice.actions;
export default userSlice.reducer;
