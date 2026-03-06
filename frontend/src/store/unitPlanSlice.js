import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { loggedUser } from "./authSlice";

const API_URL = "https://tamadrus-api.onrender.com/unit-plans";

/* =====================================================
   HELPER : Configuration Auth
===================================================== */
const getAuthConfig = (getState) => {
  const state = getState();
  const user = loggedUser(state);

  if (!user?.token) {
    throw new Error("User not authenticated");
  }

  return {
    headers: {
      Authorization: `Bearer ${user.token}`,
      "Content-Type": "application/json",
    },
  };
};

/* =====================================================
   THUNKS
===================================================== */

/**
 * Récupère le plan d'une unité spécifique.
 * Si le plan n'existe pas en base, le backend le génère à la volée.
 */
export const fetchUnitPlan = createAsyncThunk(
  "unitPlan/fetchUnitPlan",
  async ({ annualPlanId, unitId }, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState);
      const response = await axios.get(
        `${API_URL}/${annualPlanId}/${unitId}`,
        config,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message },
      );
    }
  },
);

/**
 * Récupère mes plans d'une unités.
 */
export const getMyUnitPlans = createAsyncThunk(
  "unitPlan/fetchMyUnitPlans",
  async (_, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState);
      const response = await axios.get(`${API_URL}/`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message },
      );
    }
  },
);

/**
 * Met à jour les ressources ou les remarques d'un UnitPlan
 */
export const updateUnitPlan = createAsyncThunk(
  "unitPlan/updateUnitPlan",
  async ({ id, data }, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState);
      const response = await axios.put(`${API_URL}/${id}`, data, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message },
      );
    }
  },
);

/* =====================================================
   SLICE
===================================================== */
const unitPlanSlice = createSlice({
  name: "unitPlan",
  initialState: {
    unitPlans: [],
    currentUnitPlan: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearUnitPlanState: (state) => {
      state.error = null;
      state.success = false;
    },
    resetCurrentUnitPlan: (state) => {
      state.currentUnitPlan = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* --- FETCH All UNIT PLAN --- */
      .addCase(getMyUnitPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyUnitPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.unitPlans = action.payload; // On stocke dans le tableau
      })
      .addCase(getMyUnitPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Erreur chargement unités";
      })
      /* --- FETCH UNIT PLAN --- */
      .addCase(fetchUnitPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUnitPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUnitPlan = action.payload;
      })
      .addCase(fetchUnitPlan.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message ||
          "Erreur lors du chargement du plan d'unité";
      })

      /* --- UPDATE UNIT PLAN --- */
      .addCase(updateUnitPlan.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUnitPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.currentUnitPlan = action.payload;
      })
      .addCase(updateUnitPlan.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Erreur lors de la mise à jour";
      })

      /* --- MATCHERS (Optionnel pour uniformiser) --- */
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
        },
      );
  },
});

export const { clearUnitPlanState, resetCurrentUnitPlan } =
  unitPlanSlice.actions;
export default unitPlanSlice.reducer;
