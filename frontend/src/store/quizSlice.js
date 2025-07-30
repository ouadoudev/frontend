import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { loggedUser } from './authSlice';


// Async thunks for API calls
export const createQuiz = createAsyncThunk(
  'quiz/createQuiz',
  async (quizData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/quiz`, quizData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Failed to create quiz' });
    }
  }
);

export const getQuizByLesson = createAsyncThunk(
  'quiz/getQuizByLesson',
  async (lessonId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/${lessonId}/quiz`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Failed to fetch quiz' });
    }
  }
);

export const submitQuizAnswers = createAsyncThunk(
  'quiz/submitQuizAnswers',
  async ({ quizId, answersData }, {getState, rejectWithValue }) => {
    try {
           const state = getState();
      const user = loggedUser(state);

      if (!user || !user.id || !user.token) {
        throw new Error('User not authenticated');
      }
      const response = await axios.post(`/quiz/${quizId}/submit-answers`, answersData,
         {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Failed to submit quiz answers' });
    }
  }
);

export const getQuizAnswers = createAsyncThunk(
  'quiz/getQuizAnswers',
  async ({ quizId, userId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/quiz/${quizId}/answers/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Failed to fetch quiz answers' });
    }
  }
);

export const updateQuiz = createAsyncThunk(
  'quiz/updateQuiz',
  async ({ quizId, quizData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/quiz/${quizId}`, quizData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Failed to update quiz' });
    }
  }
);

export const deleteQuiz = createAsyncThunk(
  'quiz/deleteQuiz',
  async (quizId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/quiz/${quizId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Failed to delete quiz' });
    }
  }
);

export const retakeQuiz = createAsyncThunk(
  'quiz/retakeQuiz',
  async ({ quizId, userId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/quiz/${quizId}/retake`, { userId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Failed to retake quiz' });
    }
  }
);

const quizSlice = createSlice({
  name: 'quiz',
  initialState: {
    currentQuiz: null,
    submission: null,
    loading: false,
    error: null,
    successMessage: null,
    submissionsReset: false,
  },
  reducers: {
    clearQuizState: (state) => {
      state.currentQuiz = null;
      state.submission = null;
      state.error = null;
      state.successMessage = null;
      state.submissionsReset = false;
    },
  },
  extraReducers: (builder) => {
    // Create Quiz
    builder
      .addCase(createQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.currentQuiz = action.payload.quiz;
        state.successMessage = action.payload.message;
      })
      .addCase(createQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      });

    // Get Quiz By Lesson
    builder
      .addCase(getQuizByLesson.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getQuizByLesson.fulfilled, (state, action) => {
        state.loading = false;
        state.currentQuiz = action.payload.quiz;
      })
      .addCase(getQuizByLesson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      });

    // Submit Quiz Answers
    builder
      .addCase(submitQuizAnswers.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(submitQuizAnswers.fulfilled, (state, action) => {
        state.loading = false;
        state.submission = action.payload.submission;
        state.successMessage = action.payload.message;
      })
      .addCase(submitQuizAnswers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      });

    // Get Quiz Answers
    builder
      .addCase(getQuizAnswers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getQuizAnswers.fulfilled, (state, action) => {
        state.loading = false;
        state.submission = action.payload.submission;
      })
      .addCase(getQuizAnswers.rejected, (state, action) => {
        state.loading = false;
      });

    // Update Quiz
    builder
      .addCase(updateQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
        state.submissionsReset = false;
      })
      .addCase(updateQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.currentQuiz = action.payload.quiz;
        state.successMessage = action.payload.message;
        state.submissionsReset = action.payload.resetSubmissions || false;
      })
      .addCase(updateQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      });

    // Delete Quiz
    builder
      .addCase(deleteQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.currentQuiz = null;
        state.submission = null;
        state.successMessage = action.payload.message;
      })
      .addCase(deleteQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      });

    // Retake Quiz
    builder
      .addCase(retakeQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(retakeQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.submission = null;
        state.successMessage = action.payload.message;
      })
      .addCase(retakeQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      });
  },
});

export const { clearQuizState } = quizSlice.actions;
export default quizSlice.reducer;