import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { loggedUser } from "./authSlice";

// Async thunk to create an exercise
export const createExercise = createAsyncThunk(
  "exercise/create",
  async (exerciseData, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const user = loggedUser(state);

      if (!user || !user.id || !user.token) {
        throw new Error("User not authenticated");
      }
      const response = await axios.post("/exercise", exerciseData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || error.message);
    }
  }
);

// Async thunk to fetch all exercises
export const fetchExercises = createAsyncThunk(
  "exercise/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/exercises");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || error.message);
    }
  }
);

// Async thunk to fetch Exercise by Lesson
export const fetchExercisesByLesson = createAsyncThunk(
  "exercise/fetchByLesson",
  async (lessonId, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const user = loggedUser(state);

      if (!user || !user.id || !user.token) {
        throw new Error("User not authenticated");
      }
      const response = await axios.get(`/lesson/${lessonId}/exercises`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || error.message);
    }
  }
);

// Async thunk to fetch a single exercise by ID
export const fetchExerciseById = createAsyncThunk(
  "exercise/fetchById",
  async (id, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const user = loggedUser(state);

      if (!user || !user.id || !user.token) {
        throw new Error("User not authenticated");
      }
      const response = await axios.get(`/exercise/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || error.message);
    }
  }
);

// Async thunk to update an exercise by ID
export const updateExercise = createAsyncThunk(
  "exercise/update",
  async ({ id, exerciseData }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const user = loggedUser(state);

      if (!user || !user.id || !user.token) {
        throw new Error("User not authenticated");
      }
      const response = await axios.put(`/exercise/${id}`, exerciseData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || error.message);
    }
  }
);

// Async thunk to delete an exercise by ID
export const deleteExercise = createAsyncThunk(
  "exercise/delete",
  async (id, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const user = loggedUser(state);
      if (!user || !user.id || !user.token) {
        throw new Error("User not authenticated");
      }
      await axios.delete(`/exercise/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      });
      return id; // Return the ID of the deleted exercise
    } catch (error) {
      return rejectWithValue(error.response.data || error.message);
    }
  }
);

// Async thunk to submit the exercise
export const submitExercise = createAsyncThunk(
  "exercise/submit",
  async (
    { id, userAnswers, userId, startTime },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState();
      const user = loggedUser(state);

      if (!user || !user.id || !user.token) {
        throw new Error("User not authenticated");
      }
      const response = await axios.post(
        `/exercise/${id}/submit`,
        { userAnswers, userId, startTime },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to fetch the user score for each exercice
export const fetchUserScore = createAsyncThunk(
  "exercise/fetchUserScore",
  async ({ userId, exerciseId }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const user = loggedUser(state);
      if (!user || !user.id || !user.token) {
        throw new Error("User not authenticated");
      }
      const response = await axios.get(
        `/user/${userId}/exercise/${exerciseId}/score`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || error.message);
    }
  }
);

// Create the slice
const exerciseSlice = createSlice({
  name: "exercises",
  initialState: {
    exercises: [],
    exercise: null,
    pointsAwarded: 0,
    highestPoints: 0,
    attempts: 0,
    success: false,
    loading: false,
    error: null,
  },
  reducers: {
        clearFetchedExercise: (state) => {
      state.exercise = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle createExercise actions
      .addCase(createExercise.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createExercise.fulfilled, (state, action) => {
        state.loading = false;
        state.exercises.push(action.payload);
      })
      .addCase(createExercise.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle fetchExercises actions
      .addCase(fetchExercises.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExercises.fulfilled, (state, action) => {
        state.loading = false;
        state.exercises = action.payload;
      })
      .addCase(fetchExercises.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle fetchExerciseById actions
      .addCase(fetchExerciseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExerciseById.fulfilled, (state, action) => {
        state.loading = false;
        state.exercise = action.payload;
      })
      .addCase(fetchExerciseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle updateExercise actions
      .addCase(updateExercise.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExercise.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.exercises.findIndex(
          (ex) => ex._id === action.payload.exercise._id
        );
        if (index !== -1) {
          state.exercises[index] = action.payload.exercise;
        }
      })
      .addCase(updateExercise.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle deleteExercise actions
      .addCase(deleteExercise.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExercise.fulfilled, (state, action) => {
        state.loading = false;
        state.exercises = state.exercises.filter(
          (ex) => ex._id !== action.payload
        );
      })
      .addCase(deleteExercise.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle fetchExercisesByLesson actions
      .addCase(fetchExercisesByLesson.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchExercisesByLesson.fulfilled, (state, action) => {
        state.loading = false;
        state.exercises = action.payload;
        state.error = null;
      })
      .addCase(fetchExercisesByLesson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle submitExercise actions
      .addCase(submitExercise.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitExercise.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.pointsAwarded = action.payload.pointsAwarded;
        state.highestPoints = action.payload.highestPoints;
        state.attempts = action.payload.attempts;
      })
      .addCase(submitExercise.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      })

      // Handle fetchUserScore actions
      .addCase(fetchUserScore.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserScore.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(fetchUserScore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { clearFetchedExercise } = exerciseSlice.actions;
// Export the reducer
export default exerciseSlice.reducer;
