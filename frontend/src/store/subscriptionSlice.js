import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { loggedUser } from "./authSlice";

// Async thunk for subscribing to subjects
export const subscribeToSubjects = createAsyncThunk(
  "subscription/subscribeToSubjects",
  async ({ customSubjects, plan }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const user = loggedUser(state);

      if (!user || !user.id || !user.token) {
        return rejectWithValue("User not authenticated");
      }

      const response = await axios.post(
        "/subscribe",
        { customSubjects, plan },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (err) {
      // Check if error response exists
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data);
      } else {
        // Handle other errors (network issues, etc.)
        return rejectWithValue("An unexpected error occurred.");
      }
    }
  }
);

// Async thunk for fetching all subscription requests (admin)
export const getAllSubscriptionRequests = createAsyncThunk(
  "subscription/getAllSubscriptionRequests",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const user = loggedUser(state);

      if (!user || !user.id || !user.token) {
        return rejectWithValue("User not authenticated");
      }
      const response = await axios.get("/subscription-requests", {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "An unexpected error occurred."
      );
    }
  }
);

// Async thunk for confirming a subscription
export const confirmSubscription = createAsyncThunk(
  "subscription/confirmSubscription",
  async ({ invoiceNumber }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const user = loggedUser(state);

      if (!user || !user.id || !user.token) {
        return rejectWithValue("User not authenticated");
      }
      const response = await axios.post(
        `/confirm-subscription`,
        {
          invoiceNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Error confirming subscription."
      );
    }
  }
);

// Async thunk for renewing a subscription
export const renewSubscription = createAsyncThunk(
  "subscription/renewSubscription",
  async (
    { invoiceNumber, bankAccountNumber },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState();
      const user = loggedUser(state);
      if (!user || !user.token) {
        return rejectWithValue("User not authenticated");
      }

      const response = await axios.post(
        "/renew-subscription",
        { invoiceNumber, bankAccountNumber },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Error renewing subscription."
      );
    }
  }
);

// Async thunk for checking active subscriptions
export const checkSubscriptionStatus = createAsyncThunk(
  "subscription/checkSubscriptionStatus",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const user = loggedUser(state);

      if (!user || !user.id || !user.token) {
        return rejectWithValue("User not authenticated");
      }

      const response = await axios.get("/check-subscription-status", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "An unexpected error occurred."
      );
    }
  }
);

// Initial state
const initialState = {
  subscriptions: [],
  subscription: null,
  subscriptionRequests: [],
  activeSubscriptions: [],
  loading: false,
  error: null,
};

// Create the slice
const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(subscribeToSubjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(subscribeToSubjects.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriptions.push(action.payload);
      })
      .addCase(subscribeToSubjects.rejected, (state, action) => {
        state.loading = false;
       state.error = action.payload?.msg || action.payload || "Une erreur est survenue.";
      })
      .addCase(getAllSubscriptionRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllSubscriptionRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriptionRequests = action.payload.subscriptionRequests;
      })
      .addCase(getAllSubscriptionRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.msg || action.payload || "Une erreur est survenue.";
      })
      .addCase(renewSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(renewSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.subscription = action.payload.subscription;
        state.activeSubscriptions.push(action.payload.subscription);
      })

      .addCase(renewSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.msg || action.payload || "Une erreur est survenue.";
      })
      .addCase(confirmSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(confirmSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.subscription = action.payload.subscription;
        state.subscriptionRequests = state.subscriptionRequests.filter(
          (req) =>
            req.invoiceNumber !== action.payload.subscription.invoiceNumber
        );
      })
      .addCase(confirmSubscription.rejected, (state, action) => {
        state.loading = false;
       state.error = action.payload?.msg || action.payload || "Une erreur est survenue.";
      })
      .addCase(checkSubscriptionStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkSubscriptionStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.activeSubscriptions = action.payload.activeSubscriptions;
      })
      .addCase(checkSubscriptionStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.msg || action.payload || "Une erreur est survenue.";
      });
  },
});

// Export the reducer
export default subscriptionSlice.reducer;
