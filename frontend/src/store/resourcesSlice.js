import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { loggedUser } from "./authSlice"; 

// Base URL for the resource API
const API_URL = "/resources";

// Async thunk to create a new resource
export const newResource = createAsyncThunk(
  "resources/newResource",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to get all resources grouped by educational details
export const getGroupedResources = createAsyncThunk(
  "resources/getGroupedResources",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/grouped`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to get resources for a specific student, grouped by subject
export const getStudentResourcesBySubject = createAsyncThunk(
  "resources/getStudentResourcesBySubject",
  async (studentId, { getState, rejectWithValue }) => {
    try {
      const user = loggedUser(getState());
      if (!user || !user.token) {
        return rejectWithValue({ message: "User not authenticated." });
      }
      if (!studentId) {
        return rejectWithValue({ message: "Student ID is required." });
      }
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const response = await axios.get(`${API_URL}/student/${studentId}`, config);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "An unexpected error occurred." });
    }
  }
);
// Async thunk to get a single resource by ID
export const getResourceById = createAsyncThunk(
  "resources/getResourceById",
  async (resourceId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${resourceId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to update an existing resource
export const updateResource = createAsyncThunk(
  "resources/updateResource",
  async ({ resourceId, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/${resourceId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to delete a resource
export const deleteResource = createAsyncThunk(
  "resources/deleteResource",
  async (resourceId, { rejectWithValue }) => {

    try {
      const response = await axios.delete(`${API_URL}/${resourceId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  resources: [],
  groupedResources: [],
  studentResources: [],
  singleResource: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

const resourceSlice = createSlice({
  name: "resources",
  initialState,
  reducers: {
    // A reset function to clear the state
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // New Resource
      .addCase(newResource.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(newResource.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.resources.push(action.payload.data);
        state.message = action.payload.message;
      })
      .addCase(newResource.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload.error || action.payload.message;
      })
      // Get Grouped Resources
      .addCase(getGroupedResources.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(getGroupedResources.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.groupedResources = action.payload.data;
        state.message = action.payload.message;
      })
      .addCase(getGroupedResources.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload.error || action.payload.message;
        state.groupedResources = []; // Clear data on error
      })
      // Get Student Resources
      .addCase(getStudentResourcesBySubject.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(getStudentResourcesBySubject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.studentResources = action.payload.data; // Store the data array
        state.message = action.payload.message;
      })
      .addCase(getStudentResourcesBySubject.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload.message || "An error occurred";
        state.studentResources = [];
      })
      // Get Resource by ID
      .addCase(getResourceById.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(getResourceById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.singleResource = action.payload.data;
        state.message = action.payload.message;
      })
      .addCase(getResourceById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload.error || action.payload.message;
        state.singleResource = null; // Clear data on error
      })
      // Update Resource
      .addCase(updateResource.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(updateResource.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.singleResource = action.payload.data; // Update the single resource in state
        state.message = action.payload.message;
        // Optionally update the list of resources in state if needed
        const index = state.resources.findIndex(
          (r) => r._id === action.payload.data._id
        );
        if (index !== -1) {
          state.resources[index] = action.payload.data;
        }
      })
      .addCase(updateResource.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload.error || action.payload.message;
      })
      // Delete Resource
      .addCase(deleteResource.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(deleteResource.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message;
        state.resources = state.resources.filter(
          (r) => r._id !== action.payload.data._id
        );
      })
      .addCase(deleteResource.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload.error || action.payload.message;
      });
  },
});

export const { reset } = resourceSlice.actions;
export default resourceSlice.reducer;
