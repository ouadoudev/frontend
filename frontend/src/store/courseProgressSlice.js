import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { loggedUser, updateUserSuccess } from './authSlice';

// Fetch course progress
export const fetchCourseProgress = createAsyncThunk(
  'courseProgress/fetchCourseProgress',
  async (courseId, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const user = loggedUser(state);

      if (!user || !user.id || !user.token) {
        throw new Error('User not authenticated');
      }

      const response = await axios.get(`/courses/progress/${courseId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json"
        }
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : { error: 'An error occurred' });
    }
  }
);

// Update progress
export const updateProgress = createAsyncThunk(
  'courses/updateProgress',
  async ({ courseId, lessonId }, { getState, dispatch, rejectWithValue }) => {
    try {
      const state = getState();
      const user = loggedUser(state);

      if (!user || !user.id || !user.token) {
        throw new Error('User not authenticated');
      }

      const response = await axios.put(
        '/courses/progress',
        { courseId, lessonId },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json"
          }
        }
      );

      // Update just the user's progress in the auth slice
      dispatch(updateUserSuccess({ progress: response.data.progress,ongoingCourses: response.data.ongoingCourses }));

      // Return progress to the courseProgressSlice too
      return response.data.progress;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : { error: 'An error occurred' });
    }
  }
);

const courseProgressSlice = createSlice({
  name: 'courseProgress',
  initialState: {
    progress: null,
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourseProgress.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCourseProgress.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.progress = action.payload.data;
      })
      .addCase(fetchCourseProgress.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.error || action.error.message;
      })
      .addCase(updateProgress.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateProgress.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.progress = action.payload;
      })
      .addCase(updateProgress.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.error || action.error.message;
      });
  }
});

export default courseProgressSlice.reducer;
