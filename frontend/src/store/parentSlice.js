import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { loggedUser } from "./authSlice";

// Fetch children
export const getChildren = createAsyncThunk(
  "parent/getChildren",
  async (parentId, { getState, rejectWithValue }) => {
    try {
      const user = loggedUser(getState());
      if (!user?.token) throw new Error("User not authenticated");

      const response = await axios.get(`/parent/${parentId}/children`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Add child
export const addChild = createAsyncThunk(
  "parent/addChild",
  async ({ parentId, childId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/parent/${parentId}/children/${childId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Remove child
export const removeChild = createAsyncThunk(
  "parent/removeChild",
  async ({ parentId, childId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/parent/${parentId}/children/${childId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Child metrics
export const getChildMetrics = createAsyncThunk(
  "parent/getChildMetrics",
  async (childId, { getState, rejectWithValue }) => {
    try {
      const user = loggedUser(getState());
      if (!user?.token) throw new Error("User not authenticated");

      const response = await axios.get(`/parent/child/${childId}/metrics`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const parentSlice = createSlice({
  name: "parent",
  initialState: {
    children: [],
    loadingChildren: false,
    childrenError: null,
    childMetrics: null,
    loadingMetrics: false,
    metricsError: null,
  },
  reducers: {
    clearChildMetrics: (state) => {
      state.childMetrics = null;
      state.metricsError = null;
      state.loadingMetrics = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // getChildren
      .addCase(getChildren.pending, (state) => { state.loadingChildren = true; state.childrenError = null; })
      .addCase(getChildren.fulfilled, (state, action) => { state.loadingChildren = false; state.children = action.payload; })
      .addCase(getChildren.rejected, (state, action) => { state.loadingChildren = false; state.childrenError = action.payload; })

      // addChild
      .addCase(addChild.fulfilled, (state, action) => {
        if (action.payload.childId) {
          state.children.push(action.payload.childId);
        }
      })

      // removeChild
      .addCase(removeChild.fulfilled, (state, action) => {
        if (action.payload.childId) {
          state.children = state.children.filter(c => c._id !== action.payload.childId);
        }
      })

      // getChildMetrics
      .addCase(getChildMetrics.pending, (state) => { state.loadingMetrics = true; state.metricsError = null; })
      .addCase(getChildMetrics.fulfilled, (state, action) => { state.loadingMetrics = false; state.childMetrics = action.payload; })
      .addCase(getChildMetrics.rejected, (state, action) => { state.loadingMetrics = false; state.metricsError = action.payload; });
  },
});

export const { clearChildMetrics } = parentSlice.actions;
export default parentSlice.reducer;
