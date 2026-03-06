// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';
// import { loggedUser } from './authSlice';

// const API_URL = 'https://tamadrus-api.onrender.com/planning';

// /* =====================================================
//    HELPER
// ===================================================== */
// const getAuthConfig = (getState) => {
//   const state = getState();
//   const user = loggedUser(state);

//   if (!user?.token) {
//     throw new Error('User not authenticated');
//   }

//   return {
//     headers: {
//       Authorization: `Bearer ${user.token}`,
//       'Content-Type': 'application/json',
//     },
//   };
// };

// /* =====================================================
//    CREATE PLAN
// ===================================================== */
// export const createAnnualPlan = createAsyncThunk(
//   'planning/createAnnualPlan',
//   async (data, { getState, rejectWithValue }) => {
//     try {
//       const config = getAuthConfig(getState);
//       const response = await axios.post(API_URL, data, config);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || { message: error.message });
//     }
//   }
// );

// /* =====================================================
//    GET ALL PLANS
// ===================================================== */
// export const fetchAnnualPlans = createAsyncThunk(
//   'planning/fetchAnnualPlans',
//   async (_, { getState, rejectWithValue }) => {
//     try {
//       const config = getAuthConfig(getState);
//       const response = await axios.get(API_URL, config);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || { message: error.message });
//     }
//   }
// );

// /* =====================================================
//    GET ONE PLAN
// ===================================================== */
// export const fetchAnnualPlanById = createAsyncThunk(
//   'planning/fetchAnnualPlanById',
//   async (id, { getState, rejectWithValue }) => {
//     try {
//       const config = getAuthConfig(getState);
//       const response = await axios.get(`${API_URL}/${id}`, config);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || { message: error.message });
//     }
//   }
// );

// /* =====================================================
//    UPDATE SESSION STATUS
// ===================================================== */
// export const updateSessionStatus = createAsyncThunk(
//   'planning/updateSessionStatus',
//   async ({ planId, sessionId, data }, { getState, rejectWithValue }) => {
//     try {
//       const config = getAuthConfig(getState);
//       const response = await axios.patch(
//         `${API_URL}/${planId}/session/${sessionId}`,
//         data,
//         config
//       );
//       return { ...response.data, sessionId };
//     } catch (error) {
//       return rejectWithValue(error.response?.data || { message: error.message });
//     }
//   }
// );

// /* =====================================================
//    PUBLISH PLAN
// ===================================================== */
// export const publishAnnualPlan = createAsyncThunk(
//   'planning/publishAnnualPlan',
//   async (id, { getState, rejectWithValue }) => {
//     try {
//       const config = getAuthConfig(getState);
//       await axios.patch(`${API_URL}/${id}/publish`, {}, config);
//       return id;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || { message: error.message });
//     }
//   }
// );

// /* =====================================================
//    DELETE PLAN
// ===================================================== */
// export const deleteAnnualPlan = createAsyncThunk(
//   'planning/deleteAnnualPlan',
//   async (id, { getState, rejectWithValue }) => {
//     try {
//       const config = getAuthConfig(getState);
//       await axios.delete(`${API_URL}/${id}`, config);
//       return id;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || { message: error.message });
//     }
//   }
// );

// /* NOUVEAU : Ajouter une activité manuelle (Soutien/Contrôle) -> Provoque le Ripple Effect */
// export const addActivitySession = createAsyncThunk(
//   'planning/addActivitySession',
//   async ({ planId, data }, { getState, rejectWithValue }) => {
//     try {
//       const config = getAuthConfig(getState);
//       // Le backend renvoie le plan complet recalculé (sessions décalées)
//       const response = await axios.post(`${API_URL}/${planId}/activity-sessions`, data, config);
//       return response.data.plan; 
//     } catch (error) {
//       return rejectWithValue(error.response?.data || { message: error.message });
//     }
//   }
// );

// /* NOUVEAU : Supprimer une activité manuelle */
// export const deleteActivitySession = createAsyncThunk(
//   'planning/deleteActivitySession',
//   async ({ planId, activityId }, { getState, rejectWithValue }) => {
//     try {
//       const config = getAuthConfig(getState);
//       const response = await axios.delete(`${API_URL}/${planId}/activity-sessions/${activityId}`, config);
//       return response.data.plan; // Renvoie le plan recalculé
//     } catch (error) {
//       return rejectWithValue(error.response?.data || { message: error.message });
//     }
//   }
// );

// /* =====================================================
//    SLICE
// ===================================================== */
// const planningSlice = createSlice({
//   name: 'planning',
//   initialState: {
//     plans: [],
//     currentPlan: null,
//     loading: false,
//     error: null,
//     success: false,
//   },
//   reducers: {
//     clearPlanningState: (state) => {
//       state.error = null;
//       state.success = false;
//     },
//     clearCurrentPlan: (state) => {
//       state.currentPlan = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder

//       /* ================= CREATE ================= */
//       .addCase(createAnnualPlan.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(createAnnualPlan.fulfilled, (state, action) => {
//         state.loading = false;
//         state.success = true;
//         state.plans.unshift(action.payload);
//       })
//       .addCase(createAnnualPlan.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload?.message;
//       })

//       /* ================= FETCH ALL ================= */
//       .addCase(fetchAnnualPlans.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchAnnualPlans.fulfilled, (state, action) => {
//         state.loading = false;
//         state.plans = action.payload;
//       })
//       .addCase(fetchAnnualPlans.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload?.message;
//       })

//       /* ================= FETCH ONE ================= */
//       .addCase(fetchAnnualPlanById.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchAnnualPlanById.fulfilled, (state, action) => {
//         state.loading = false;
//         state.currentPlan = action.payload;
//       })
//       .addCase(fetchAnnualPlanById.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload?.message;
//       })

//       /* ================= UPDATE SESSION ================= */
//       .addCase(updateSessionStatus.fulfilled, (state, action) => {
//         if (state.currentPlan) {
//           const session = state.currentPlan.sessions.find(
//             (s) => s._id === action.payload.sessionId
//           );
//           if (session) {
//             session.status = action.meta.arg.data.status;
//             session.observations = action.meta.arg.data.observations;
//           }
//         }
//       })
//       /* ================= AJOUTER UNE ACTIVITÉ MANUELLE ================= */
//       .addCase(addActivitySession.fulfilled, (state, action) => {
//         if (state.currentPlan) {
//           state.currentPlan.sessions = action.payload.sessions;
//         }
//       })
//       /* ================= SUPPRIMER UNE ACTIVITÉ MANUELLE ================= */
//       .addCase(deleteActivitySession.fulfilled, (state, action) => {
//         if (state.currentPlan) {
//           state.currentPlan.sessions = action.payload.sessions;
//         }
//       })
//       /* ================= PUBLISH ================= */
//       .addCase(publishAnnualPlan.fulfilled, (state, action) => {
//         const plan = state.plans.find((p) => p._id === action.payload);
//         if (plan) plan.isPublished = true;

//         if (state.currentPlan?._id === action.payload) {
//           state.currentPlan.isPublished = true;
//         }
//       })

//       /* ================= DELETE ================= */
//       .addCase(deleteAnnualPlan.fulfilled, (state, action) => {
//         state.plans = state.plans.filter(
//           (plan) => plan._id !== action.payload
//         );
//       });
//   },
// });

// export const { clearPlanningState, clearCurrentPlan } = planningSlice.actions;
// export default planningSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { loggedUser } from './authSlice';

const API_URL = 'https://tamadrus-api.onrender.com/planning';

/* =====================================================
   HELPER : Configuration Auth
===================================================== */
const getAuthConfig = (getState, isBlob = false) => {
  const state = getState();
  const user = loggedUser(state);

  if (!user?.token) {
    throw new Error('User not authenticated');
  }

  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
      'Content-Type': 'application/json',
    },
  };

  if (isBlob) config.responseType = 'blob'; // Pour le téléchargement de fichiers
  return config;
};

/* =====================================================
   THUNKS
===================================================== */

export const createAnnualPlan = createAsyncThunk(
  'planning/createAnnualPlan',
  async (data, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState);
      const response = await axios.post(API_URL, data, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchAnnualPlans = createAsyncThunk(
  'planning/fetchAnnualPlans',
  async (_, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState);
      const response = await axios.get(API_URL, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchAnnualPlanById = createAsyncThunk(
  'planning/fetchAnnualPlanById',
  async (id, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState);
      const response = await axios.get(`${API_URL}/${id}`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateSessionStatus = createAsyncThunk(
  'planning/updateSessionStatus',
  async ({ planId, sessionId, data }, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState);
      const response = await axios.patch(`${API_URL}/${planId}/session/${sessionId}`, data, config);
      // Le backend renvoie { message, progress }
      return { progress: response.data.progress, sessionId, data };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const addActivitySession = createAsyncThunk(
  'planning/addActivitySession',
  async ({ planId, data }, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState);
      const response = await axios.post(`${API_URL}/${planId}/activity-sessions`, data, config);
      return response.data.plan; // Renvoie le plan complet recalculé (Ripple Effect)
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deleteActivitySession = createAsyncThunk(
  'planning/deleteActivitySession',
  async ({ planId, activityId }, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState);
      const response = await axios.delete(`${API_URL}/${planId}/activity-sessions/${activityId}`, config);
      return response.data.plan;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const downloadFile = createAsyncThunk(
  'export/download',
  async ({ url, fileName }, { getState }) => {
    const token = getState().auth.user.token;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob'
    });
    const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
  }
);

export const publishAnnualPlan = createAsyncThunk(
  'planning/publishAnnualPlan',
  async (id, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState);
      await axios.patch(`${API_URL}/${id}/publish`, {}, config);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deleteAnnualPlan = createAsyncThunk(
  'planning/deleteAnnualPlan',
  async (id, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState);
      await axios.delete(`${API_URL}/${id}`, config);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

/* =====================================================
   SLICE
===================================================== */
const planningSlice = createSlice({
  name: 'planning',
  initialState: {
    plans: [],
    currentPlan: null,
    loading: false,
    exportLoading: false, // État séparé pour les téléchargements
    error: null,
    success: false,
  },
  reducers: {
    clearPlanningState: (state) => {
      state.error = null;
      state.success = false;
    },
    clearCurrentPlan: (state) => {
      state.currentPlan = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* --- FETCH ALL --- */
      .addCase(fetchAnnualPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = action.payload;
      })

      /* --- FETCH ONE / CREATE / UPDATE ACTIVITIES (RIPPLE EFFECT) --- */
      .addCase(fetchAnnualPlanById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPlan = action.payload;
      })
      .addCase(createAnnualPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.plans.unshift(action.payload);
      })
      .addCase(addActivitySession.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPlan = action.payload; // On remplace le plan complet car les dates ont changé
      })
      .addCase(deleteActivitySession.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPlan = action.payload;
      })

      /* --- UPDATE SESSION STATUS --- */
      .addCase(updateSessionStatus.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentPlan) {
          const session = state.currentPlan.sessions.find(s => s._id === action.payload.sessionId);
          if (session) {
            session.status = action.payload.data.status;
            session.observations = action.payload.data.observations;
          }
          state.currentPlan.progress = action.payload.progress;
        }
      })

      /* --- EXPORTS --- */
      .addCase(downloadFile.pending, (state) => { state.exportLoading = true; })
      .addCase(downloadFile.fulfilled, (state) => { state.exportLoading = false; })
      .addCase(downloadFile.rejected, (state, action) => { 
        state.exportLoading = false; 
        state.error = action.payload?.message;
      })

      /* --- PUBLISH --- */
      .addCase(publishAnnualPlan.fulfilled, (state, action) => {
        state.loading = false;
        const plan = state.plans.find((p) => p._id === action.payload);
        if (plan) plan.isPublished = true;
        if (state.currentPlan?._id === action.payload) state.currentPlan.isPublished = true;
      })

      /* --- DELETE --- */
      .addCase(deleteAnnualPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = state.plans.filter((p) => p._id !== action.payload);
        if (state.currentPlan?._id === action.payload) state.currentPlan = null;
      })

      /* --- MATCHERS : Gestion automatique du Loading et des Erreurs --- */
      // .addMatcher(
      //   (action) => action.type.endsWith('/pending') && !action.type.includes('downloadExport'),
      //   (state) => {
      //     state.loading = true;
      //     state.error = null;
      //     state.success = false;
      //   }
      // )
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false;
          state.error = action.payload?.message || "Une erreur est survenue";
        }
      );
  },
});

export const { clearPlanningState, clearCurrentPlan } = planningSlice.actions;
export default planningSlice.reducer;