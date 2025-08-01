import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { loggedUser } from './authSlice';

// Fetch all pending monthly revenues (Admin)
export const fetchPendingMonthlyRevenues = createAsyncThunk(
  'revenue/fetchPendingMonthlyRevenues',
  async (_, { getState, rejectWithValue }) => {
    try {
      const user = loggedUser(getState());
      const response = await axios.get('/revenue/pending', {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data.monthlyRevenues;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch pending revenues");
    }
  }
);
export const fetchMonthlyRevenues = createAsyncThunk(
  'revenue/fetchMonthlyRevenues',
  async (_, { getState, rejectWithValue }) => {
    try {
      const user = loggedUser(getState());
      const response = await axios.get('/revenue', {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data.monthlyRevenues;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch pending revenues");
    }
  }
);

// Pay a monthly revenue (Admin)
export const payMonthlyRevenue = createAsyncThunk(
  'revenue/payMonthlyRevenue',
  async (id, { getState, rejectWithValue }) => {
    try {
      const user = loggedUser(getState());
      const response = await axios.put(`/revenue/pay/${id}`, null, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      return response.data.monthlyRevenue;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to pay revenue");
    }
  }
);

// Fetch all revenues (Admin reporting)
export const fetchAllRevenues = createAsyncThunk(
  'revenue/fetchAllRevenues',
  async (filters = {}, { getState, rejectWithValue }) => {
    try {
      const user = loggedUser(getState());
      const response = await axios.get('/revenue/all', {
        params: filters,
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      return response.data.revenues;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch revenues");
    }
  }
);

// Fetch teacher's own revenue history
export const fetchTeacherRevenueHistory = createAsyncThunk(
  'revenue/fetchTeacherRevenueHistory',
  async (_, { getState, rejectWithValue }) => {
    try {
      const user = loggedUser(getState());
      const response = await axios.get('/revenue/history', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch teacher revenue history");
    }
  }
);

export const fetchPlatformMetrics = createAsyncThunk(
  'revenue/fetchPlatformMetrics',
  async ({ timeframe, year, month }, { getState, rejectWithValue }) => {
    try {
      const user = loggedUser(getState());
      const response = await axios.get('/revenue/platform/metrics', {
        params: { timeframe, year, month },
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      return response.data.metrics;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch platform metrics");
    }
  }
);

// Fetch platform fees (Admin)
export const fetchPlatformFees = createAsyncThunk(
  'revenue/fetchPlatformFees',
  async ({ year, month, subject, subscription, page, limit }, { getState, rejectWithValue }) => {
    try {
      const user = loggedUser(getState());
      const response = await axios.get('/revenue/platform/fees', {
        params: { year, month, subject, subscription, page, limit },
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch platform fees");
    }
  }
);


const initialState = {
  pendingMonthlyRevenues: [],
  monthlyRevenues: [],
  allRevenues: [],
  platformMetrics: null,
  platformFees: {
    data: [],
    total: 0,
    page: 1,
    totalPages: 1,
  },
  monthlyRevenues: [],
  detailedRevenues: [],
  loading: false,
  error: null,
};

const revenueSlice = createSlice({
  name: 'revenue',
  initialState,
  reducers: {
    clearRevenueError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch pending revenues
      .addCase(fetchPendingMonthlyRevenues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingMonthlyRevenues.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingMonthlyRevenues = action.payload;
      })
      .addCase(fetchPendingMonthlyRevenues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch revenues
      .addCase(fetchMonthlyRevenues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMonthlyRevenues.fulfilled, (state, action) => {
        state.loading = false;
        state.monthlyRevenues = action.payload;
      })
      .addCase(fetchMonthlyRevenues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Pay monthly revenue
      .addCase(payMonthlyRevenue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(payMonthlyRevenue.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingMonthlyRevenues = state.pendingMonthlyRevenues.filter(
          (item) => item._id !== action.payload._id
        );
      })
      .addCase(payMonthlyRevenue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch all revenues
      .addCase(fetchAllRevenues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllRevenues.fulfilled, (state, action) => {
        state.loading = false;
        state.allRevenues = action.payload;
      })
      .addCase(fetchAllRevenues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Teacher revenue history
      .addCase(fetchTeacherRevenueHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeacherRevenueHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.monthlyRevenues = action.payload.monthlyRevenues;
        state.detailedRevenues = action.payload.detailedRevenues;
      })
      .addCase(fetchTeacherRevenueHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
 .addCase(fetchPlatformMetrics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlatformMetrics.fulfilled, (state, action) => {
        state.loading = false;
        state.platformMetrics = action.payload;
      })
      .addCase(fetchPlatformMetrics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch platform fees
      .addCase(fetchPlatformFees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlatformFees.fulfilled, (state, action) => {
        state.loading = false;
        state.platformFees = {
          data: action.payload.fees,
          total: action.payload.total,
          page: action.payload.page,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchPlatformFees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearRevenueError } = revenueSlice.actions;

export default revenueSlice.reducer;
