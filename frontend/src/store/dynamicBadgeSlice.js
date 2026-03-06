// store/dynamicBadgeSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Base API URL
const API_URL = "/badges";

// ===== Async Thunks =====

// Fetch all badges (optionally by category or includeSecret)
export const fetchAllBadges = createAsyncThunk(
  "badges/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(API_URL, { params });
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch a specific user's badges
export const fetchUserBadges = createAsyncThunk(
  "badges/fetchUserBadges",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/user/${userId}`);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch badge progress for a user
export const fetchBadgeProgress = createAsyncThunk(
  "badges/fetchProgress",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/user/${userId}/progress`);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Check and award badges for a user
export const checkAndAwardBadges = createAsyncThunk(
  "badges/checkAndAward",
  async (userId, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${API_URL}/check/${userId}`);
      // After successfully awarding badges, refetch the user's badges to ensure state consistency
      dispatch(fetchUserBadges(userId));
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ===== Initial State =====
const initialState = {
  allBadges: [],
  userBadges: { 
    earnedBadges: [], 
    availableBadges: [], 
    completionPercentage: 0, 
    totalBadges: 0 
  },
  badgeProgress: [],
  loading: {
    allBadges: false,
    userBadges: false,
    badgeProgress: false,
    checkAndAward: false
  },
  error: null,
};

// ===== Slice =====
const dynamicBadgeSlice = createSlice({
  name: "badges",
  initialState,
  reducers: {
    resetBadgeState: (state) => {
      state.allBadges = [];
      state.userBadges = { 
        earnedBadges: [], 
        availableBadges: [], 
        completionPercentage: 0, 
        totalBadges: 0 
      };
      state.badgeProgress = [];
      state.loading = {
        allBadges: false,
        userBadges: false,
        badgeProgress: false,
        checkAndAward: false
      };
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all badges
    builder
      .addCase(fetchAllBadges.pending, (state) => { 
        state.loading.allBadges = true; 
        state.error = null; 
      })
      .addCase(fetchAllBadges.fulfilled, (state, action) => { 
        state.loading.allBadges = false; 
        state.allBadges = action.payload; 
      })
      .addCase(fetchAllBadges.rejected, (state, action) => { 
        state.loading.allBadges = false; 
        state.error = action.payload; 
      });

    // Fetch user badges
    builder
      .addCase(fetchUserBadges.pending, (state) => { 
        state.loading.userBadges = true; 
        state.error = null; 
      })
      .addCase(fetchUserBadges.fulfilled, (state, action) => {
        state.loading.userBadges = false;
        state.userBadges = action.payload;
      })
      .addCase(fetchUserBadges.rejected, (state, action) => { 
        state.loading.userBadges = false; 
        state.error = action.payload; 
      });

    // Fetch badge progress
    builder
      .addCase(fetchBadgeProgress.pending, (state) => { 
        state.loading.badgeProgress = true; 
        state.error = null; 
      })
      .addCase(fetchBadgeProgress.fulfilled, (state, action) => { 
        state.loading.badgeProgress = false; 
        state.badgeProgress = action.payload; 
      })
      .addCase(fetchBadgeProgress.rejected, (state, action) => { 
        state.loading.badgeProgress = false; 
        state.error = action.payload; 
      });

    // Check and award badges
    builder
      .addCase(checkAndAwardBadges.pending, (state) => { 
        state.loading.checkAndAward = true; 
        state.error = null; 
      })
      .addCase(checkAndAwardBadges.fulfilled, (state, action) => {
        state.loading.checkAndAward = false;

        // Add new badges to earnedBadges
        state.userBadges.earnedBadges = [
          ...state.userBadges.earnedBadges,
          ...newBadges.map(badge => ({ ...badge, earned: true }))
        ];

        // Remove new badges from availableBadges
        state.userBadges.availableBadges = state.userBadges.availableBadges.filter(
          (badge) => !newBadgeIds.has(badge.badgeId)
        );

        // Update completion percentage
        const totalBadgesCount = state.userBadges.earnedBadges.length + state.userBadges.availableBadges.length;
        state.userBadges.completionPercentage = totalBadgesCount > 0
          ? ((state.userBadges.earnedBadges.length / totalBadgesCount) * 100).toFixed(1)
          : 0;
      })
      .addCase(checkAndAwardBadges.rejected, (state, action) => { 
        state.loading.checkAndAward = false; 
        state.error = action.payload; 
      });
  },
});

// ===== Exports =====
export const { resetBadgeState } = dynamicBadgeSlice.actions;
export default dynamicBadgeSlice.reducer;