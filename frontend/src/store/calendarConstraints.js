import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// --- Async Thunks ---
// Récupérer toutes les contraintes filtrées par année et région
export const fetchConstraints = createAsyncThunk(
  "calendar/fetchConstraints",
  async ({ academicYear, region }, { rejectWithValue }) => {
    try {
      const response = await axios.get("/calendar", { params: { academicYear, region } });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Créer une nouvelle contrainte
export const createConstraint = createAsyncThunk(
  "calendar/createConstraint",
  async (constraintData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/calendar", constraintData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Mettre à jour une contrainte existante
export const updateConstraint = createAsyncThunk(
  "calendar/updateConstraint",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/calendar/${id}`, updates);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Supprimer une contrainte
export const deleteConstraint = createAsyncThunk(
  "calendar/deleteConstraint",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/calendar/${id}`);
      return { id, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// --- Slice ---
const calendarSlice = createSlice({
  name: "calendar",
  initialState: {
    constraints: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCalendarError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchConstraints
      .addCase(fetchConstraints.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConstraints.fulfilled, (state, action) => {
        state.loading = false;
        state.constraints = action.payload;
      })
      .addCase(fetchConstraints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // createConstraint
      .addCase(createConstraint.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createConstraint.fulfilled, (state, action) => {
        state.loading = false;
        state.constraints.push(action.payload);
      })
      .addCase(createConstraint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // updateConstraint
      .addCase(updateConstraint.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateConstraint.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.constraints.findIndex(c => c._id === action.payload._id);
        if (index !== -1) state.constraints[index] = action.payload;
      })
      .addCase(updateConstraint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // deleteConstraint
      .addCase(deleteConstraint.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteConstraint.fulfilled, (state, action) => {
        state.loading = false;
        state.constraints = state.constraints.filter(c => c._id !== action.payload.id);
      })
      .addCase(deleteConstraint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCalendarError } = calendarSlice.actions;

export default calendarSlice.reducer;
