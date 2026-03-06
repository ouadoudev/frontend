import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { loggedUser } from "./authSlice";

const API_URL = "https://tamadrus-api.onrender.com/joudada";

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
   THUNKS (Actions Asynchrones)
===================================================== */

/**
 * Récupère une Joudada existante ou en génère une nouvelle
 * basée sur le programme officiel (Smart Fill).
 */
export const fetchOrCreateJoudada = createAsyncThunk(
  "joudada/fetchOrCreate",
  async ({ annualPlanId, sessionId }, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState);
      const response = await axios.get(`${API_URL}/${annualPlanId}/${sessionId}`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);


export const fetchMyJoudadas = createAsyncThunk(
  "joudada/fetchMyJoudadas",
  async (_, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState);
      const response = await axios.get(`${API_URL}/`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

/**
 * Sauvegarde les modifications de la Joudada sur le serveur.
 */
export const saveJoudada = createAsyncThunk(
  "joudada/save",
  async (joudadaData, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState);
      // On utilise l'ID de la joudada pour le PUT
      const response = await axios.put(`${API_URL}/${joudadaData._id}`, joudadaData, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

/* =====================================================
   SLICE
===================================================== */
const joudadaSlice = createSlice({
  name: "joudada",
  initialState: {
    joudadas: [], // Liste de toutes les joudadas de l'enseignant
    currentJoudada: null,
    loading: false,
    saving: false,
    error: null,
    success: false,
  },
  reducers: {
    // Réinitialiser l'état (utile quand on quitte l'éditeur)
    resetJoudadaState: (state) => {
      state.currentJoudada = null;
      state.error = null;
      state.success = false;
    },

    // --- MISE À JOUR LOCALE (UI Réactive) ---
    
    // Mise à jour du cadre pédagogique (objectifs, supports...)
    updatePedagogicalFrame: (state, action) => {
      const { field, value } = action.payload; // field = 'didacticTools' | 'objectives' | 'prerequisites'
      if (state.currentJoudada) {
        state.currentJoudada.pedagogicalFrame[field] = value;
      }
    },

    // Mise à jour d'une étape spécifique du déroulement
    updateStep: (state, action) => {
      const { index, field, value } = action.payload;
      if (state.currentJoudada && state.currentJoudada.steps[index]) {
        state.currentJoudada.steps[index][field] = value;
      }
    },

    // Ajouter une nouvelle phase vide
    addStep: (state) => {
      if (state.currentJoudada) {
        state.currentJoudada.steps.push({
          phase: "Nouvelle phase",
          teacherActivity: "",
          studentActivity: "",
          duration: 10,
          modality: "Collectif"
        });
      }
    },

    // Supprimer une phase
    removeStep: (state, action) => {
      const index = action.payload;
      if (state.currentJoudada) {
        state.currentJoudada.steps.splice(index, 1);
      }
    },

    // Mise à jour des observations
    updateObservations: (state, action) => {
      if (state.currentJoudada) {
        state.currentJoudada.observations = action.payload;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      /* --- FETCH --- */
      .addCase(fetchOrCreateJoudada.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrCreateJoudada.fulfilled, (state, action) => {
        state.loading = false;
        state.currentJoudada = action.payload;
      })
      .addCase(fetchOrCreateJoudada.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      .addCase(fetchMyJoudadas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyJoudadas.fulfilled, (state, action) => {
        state.loading = false;  
        state.joudadas = action.payload;
      })
      .addCase(fetchMyJoudadas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      /* --- SAVE --- */
      .addCase(saveJoudada.pending, (state) => {
        state.saving = true;
      })
      .addCase(saveJoudada.fulfilled, (state, action) => {
        state.saving = false;
        state.success = true;
        state.currentJoudada = action.payload; // Mise à jour avec les données serveur
      })
      .addCase(saveJoudada.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload?.message;
      });
  },
});

export const { 
  resetJoudadaState, 
  updatePedagogicalFrame, 
  updateStep, 
  addStep, 
  removeStep,
  updateObservations 
} = joudadaSlice.actions;

export default joudadaSlice.reducer;