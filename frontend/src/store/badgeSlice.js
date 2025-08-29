import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loggedUser, updateUserSuccess } from "./authSlice";
import axios from "axios";

// Initial state for the badge slice
const initialState = {
  // Public/user-facing data
  publicBadges: [],
  userBadges: {
    earnedBadges: [],
    availableBadges: [],
    totalBadges: 0,
    earnedCount: 0,
    completionPercentage: 0,
  },
  userProgress: [],
  leaderboard: [],

  // Admin-facing data
  adminBadges: [],
  badgeStats: null,

  // General state
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Thunks for Admin Operations
export const fetchAdminBadges = createAsyncThunk(
  "badges/fetchAdminBadges",
  async (params = {}, { getState, rejectWithValue }) => {
    try {
       const state = getState();
      const user = loggedUser(state); // Assumes auth state has a user object
      const response = await axios.get(`/badges/admin`, {
        params,
        headers: { Authorization: `Bearer ${user.token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch admin badges."
      );
    }
  }
);

// Thunk to fetch a single badge by its ID
export const fetchBadgeById = createAsyncThunk(
  "badges/fetchBadgeById",
  async (id, { getState, rejectWithValue }) => {
    try {
       const state = getState();
      const user = loggedUser(state);
      const response = await axios.get(`/badges/admin/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch badge."
      );
    }
  }
);

export const createBadge = createAsyncThunk(
  "badges/createBadge",
  async (badgeData, { getState, rejectWithValue, dispatch }) => {
    try {
       const state = getState();
      const user = loggedUser(state);
      const response = await axios.post(`/badges/admin`, badgeData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      dispatch(fetchAdminBadges());
      return response.data.badge;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to create badge."
      );
    }
  }
);

export const updateBadge = createAsyncThunk(
  "badges/updateBadge",
  async ({ id, updates }, { getState, rejectWithValue, dispatch }) => {
    try {
       const state = getState();
      const user = loggedUser(state);
      const response = await axios.put(`/badges/admin/${id}`, updates, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      dispatch(fetchAdminBadges());
      return response.data.badge;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to update badge."
      );
    }
  }
);

export const deleteBadge = createAsyncThunk(
  "badges/deleteBadge",
  async (badgeId, { getState, rejectWithValue, dispatch }) => {
    try {
       const state = getState();
      const user = loggedUser(state);
      await axios.delete(`/badges/admin/${badgeId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      dispatch(fetchAdminBadges());
      return badgeId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to delete badge."
      );
    }
  }
);

export const toggleBadgeStatus = createAsyncThunk(
  "badges/toggleBadgeStatus",
  async (badgeId, { getState, rejectWithValue }) => {
    try {
       const state = getState();
      const user = loggedUser(state);
      const response = await axios.patch(
        `/badges/admin/${badgeId}/toggle`,
        {},
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      return response.data.badge;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to toggle badge status."
      );
    }
  }
);

export const fetchBadgeStatistics = createAsyncThunk(
  "badges/fetchBadgeStatistics",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const user = loggedUser(state);
      const response = await axios.get(`/badges/admin/stats`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch badge statistics."
      );
    }
  }
);

export const bulkUpdateBadges = createAsyncThunk(
  "badges/bulkUpdateBadges",
  async ({ ids, updates }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const user = loggedUser(state);
      const response = await axios.patch(
        `/badges/admin/bulk`,
        { ids, updates },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      return { ids, updates, modifiedCount: response.data.modifiedCount };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Bulk update failed."
      );
    }
  }
);

// Thunks for Public/User Operations
export const fetchPublicBadges = createAsyncThunk(
  "badges/fetchPublicBadges",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/badges`, { params });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching public badges."
      );
    }
  }
);

export const fetchUserBadges = createAsyncThunk(
  "badges/fetchUserBadges",
  async (userId, { getState, rejectWithValue }) => {
    try {
       const state = getState();
      const user = loggedUser(state);
      const response = await axios.get(`/badges/user/${userId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching user badges."
      );
    }
  }
);

export const checkAndAwardBadges = createAsyncThunk(
  "badges/checkAndAwardBadges",
  async (userId, { getState, dispatch, rejectWithValue }) => {
    try {
       const state = getState();
      const user = loggedUser(state);
      const response = await axios.post(
        `/badges/check/${userId}`,
        {},
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      const { newBadges, userTotalPoints } = response.data.data;

      // Update the user's state directly via the authSlice
      if (newBadges.length > 0) {
        dispatch(
          updateUserSuccess({
            badges: newBadges.map((b) => b.badgeId),
            totalPoints: userTotalPoints,
          })
        );
      }
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error checking for new badges."
      );
    }
  }
);

export const fetchUserProgress = createAsyncThunk(
  "badges/fetchUserProgress",
  async (userId, { getState, rejectWithValue }) => {
    try {
       const state = getState();
      const user = loggedUser(state);
      const response = await axios.get(`/badges/user/${userId}/progress`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching badge progress."
      );
    }
  }
);

export const fetchLeaderboard = createAsyncThunk(
  "badges/fetchLeaderboard",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/badges/leaderboard`, { params });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching leaderboard."
      );
    }
  }
);

const badgeSlice = createSlice({
  name: "badges",
  initialState,
  reducers: {}, 
  extraReducers: (builder) => {
    builder
      // Admin Badges
      .addCase(fetchAdminBadges.fulfilled, (state, action) => {
        state.adminBadges = action.payload.badges;
      })
      .addCase(fetchBadgeById.fulfilled, (state, action) => {
        state.currentBadge = action.payload;
      })
      .addCase(createBadge.fulfilled, (state, action) => {
        state.adminBadges.unshift(action.payload);
      })
      .addCase(updateBadge.fulfilled, (state, action) => {
        const index = state.adminBadges.findIndex(
          (b) => b._id === action.payload._id
        );
        if (index !== -1) state.adminBadges[index] = action.payload;
      })
      .addCase(deleteBadge.fulfilled, (state, action) => {
        state.adminBadges = state.adminBadges.filter(
          (b) => b._id !== action.payload
        );
      })
      .addCase(toggleBadgeStatus.fulfilled, (state, action) => {
        const index = state.adminBadges.findIndex(
          (b) => b._id === action.payload._id
        );
        if (index !== -1)
          state.adminBadges[index].isActive = action.payload.isActive;
      })
      .addCase(fetchBadgeStatistics.fulfilled, (state, action) => {
        state.badgeStats = action.payload;
      })
      .addCase(bulkUpdateBadges.fulfilled, (state, action) => {
        const { ids, updates } = action.payload;
        ids.forEach((id) => {
          const index = state.adminBadges.findIndex((b) => b._id === id);
          if (index !== -1)
            state.adminBadges[index] = {
              ...state.adminBadges[index],
              ...updates,
            };
        });
      })

      // Public/User Badges
      .addCase(fetchPublicBadges.fulfilled, (state, action) => {
        state.publicBadges = action.payload;
      })
      .addCase(fetchUserBadges.fulfilled, (state, action) => {
        state.userBadges = action.payload;
      })
      .addCase(fetchUserProgress.fulfilled, (state, action) => {
        state.userProgress = action.payload;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.leaderboard = action.payload;
      })

      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.status = "loading";
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.status = "failed";
          state.error = action.payload;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/fulfilled"),
        (state) => {
          state.status = "succeeded";
        }
      );
  },
});

export default badgeSlice.reducer;
