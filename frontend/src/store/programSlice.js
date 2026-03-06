import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { loggedUser } from "./authSlice"; // Assurez-vous que le chemin est correct

const API_URL = "https://tamadrus-api.onrender.com/programs"; // Ajustez selon votre préfixe de route

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
   THUNKS (Appels API)
===================================================== */

/**
 * Récupérer tous les programmes (avec filtres optionnels)
 * @param {Object} filters - ex: { cycle: "Lycée", level: "Tronc Commun", subject: "Mathématiques" }
 */
export const fetchPrograms = createAsyncThunk(
  "program/fetchPrograms",
  async (filters = {}, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState);
      // Axios transformera l'objet filters en query string (?cycle=...&level=...)
      const response = await axios.get(API_URL, { ...config, params: filters });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || error.response?.data?.message || error.message
      );
    }
  }
);

/**
 * Récupérer un programme spécifique par ID
 */
export const fetchProgramById = createAsyncThunk(
  "program/fetchProgramById",
  async (id, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState);
      const response = await axios.get(`${API_URL}/${id}`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || error.response?.data?.message || error.message
      );
    }
  }
);

/**
 * Créer un nouveau programme
 */
export const createProgram = createAsyncThunk(
  "program/createProgram",
  async (programData, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState);
      const response = await axios.post(API_URL, programData, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || error.response?.data?.message || error.message
      );
    }
  }
);

/**
 * Mettre à jour un programme existant
 */
export const updateProgram = createAsyncThunk(
  "program/updateProgram",
  async ({ id, data }, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState);
      const response = await axios.put(`${API_URL}/${id}`, data, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || error.response?.data?.message || error.message
      );
    }
  }
);

/**
 * Supprimer un programme
 */
export const deleteProgram = createAsyncThunk(
  "program/deleteProgram",
  async (id, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState);
      await axios.delete(`${API_URL}/${id}`, config);
      return id; // On renvoie l'ID pour le retirer du state local
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || error.response?.data?.message || error.message
      );
    }
  }
);

/* =====================================================
   SLICE
===================================================== */
const programSlice = createSlice({
  name: "program",
  initialState: {
    programs:[],
    currentProgram: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearProgramState: (state) => {
      state.error = null;
      state.success = false;
    },
    clearCurrentProgram: (state) => {
      state.currentProgram = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* --- FETCH ALL --- */
      .addCase(fetchPrograms.fulfilled, (state, action) => {
        state.loading = false;
        state.programs = action.payload;
      })

      /* --- FETCH ONE --- */
      .addCase(fetchProgramById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProgram = action.payload;
      })

      /* --- CREATE --- */
      .addCase(createProgram.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.programs.push(action.payload); // Ajout direct à la liste
      })

      /* --- UPDATE --- */
      .addCase(updateProgram.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // Mise à jour dans la liste
        const index = state.programs.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) {
          state.programs = action.payload;
        }
        // Mise à jour si c'est le programme actuellement consulté
        if (state.currentProgram?._id === action.payload._id) {
          state.currentProgram = action.payload;
        }
      })

      /* --- DELETE --- */
      .addCase(deleteProgram.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // Retirer de la liste
        state.programs = state.programs.filter((p) => p._id !== action.payload);
        // Nettoyer currentProgram s'il vient d'être supprimé
        if (state.currentProgram?._id === action.payload) {
          state.currentProgram = null;
        }
      })

      /* --- MATCHERS : PENDING (Doit être APRÈS les addCase) --- */
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
          state.success = false;
        }
      )

      /* --- MATCHERS : REJECTED (Doit être APRÈS les addCase) --- */
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          // Capture des messages d'erreurs (y compris ceux de validation du contrôleur)
          state.error = action.payload || "Une erreur est survenue avec les programmes.";
        }
      );
  },
});

export const { clearProgramState, clearCurrentProgram } = programSlice.actions;
export default programSlice.reducer;