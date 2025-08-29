import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { loggedUser } from './authSlice';

const initialState = {
  questions: [],
  answers: [],
  status: 'idle',
  error: null,
};

// Async thunks for questions
export const fetchLessonQuestions = createAsyncThunk(
  'question/fetchLessonQuestions',
  async (lessonId) => {
    try {
      const response = await axios.get(`/questions/${lessonId}`);
      return response.data.data; 
    } catch (error) {
      throw error.response.data.error;
    }
  }
);

export const addQuestionToLesson = createAsyncThunk(
  'question/addQuestionToLesson',
  async ({ lessonId, questionData },{ getState, dispatch, rejectWithValue }) => {
    try {
      const state = getState();
      const user = loggedUser(state);

      if (!user || !user.id || !user.token) {
        throw new Error('User not authenticated');
      }

      const questionPayload = {
        user: user.id, 
        ...questionData,
      };
      const response = await axios.post(`/questions/${lessonId}`, questionPayload,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      dispatch(fetchLessonQuestions( lessonId ));
      return response.data.data; 
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateQuestion = createAsyncThunk(
  'question/updateQuestion',
  async ({ lessonId,questionId, questionData },{ getState, dispatch,rejectWithValue }) => {
    try {
      const state = getState();
      const user = loggedUser(state);

      if (!user || !user.id || !user.token) {
        throw new Error('User not authenticated');
      }
      const response = await axios.put(`/questions/${lessonId}/${questionId}`, questionData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
        });
        dispatch(fetchLessonQuestions( lessonId ));
      return response.data.data; 
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteQuestion = createAsyncThunk(
  'question/deleteQuestion',
  async ({lessonId,questionId},{ getState, rejectWithValue }) => {
    try {
      const state = getState();
      const user = loggedUser(state);

      if (!user || !user.id || !user.token) {
        throw new Error('User not authenticated');
      }
      await axios.delete(`/questions/${lessonId}/${questionId}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
        });
      return questionId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunks for answers
export const fetchQuestionAnswers = createAsyncThunk(
  'question/fetchQuestionAnswers',
  async (questionId) => {
    try {
      const response = await axios.get(`/questions/answers/${questionId}`);
      return { questionId, answers: response.data }; 
    } catch (error) {
      throw error.response.data.error;
    }
  }
);

export const addAnswerToQuestion = createAsyncThunk(
  'question/addAnswerToQuestion',
  async ({ questionId, answerData },{ getState, dispatch, rejectWithValue }) => {
    try {
      const state = getState();
      const user = loggedUser(state);

      if (!user || !user.id || !user.token) {
        throw new Error('User not authenticated');
      }

      const response = await axios.post(`/questions/answers/${questionId}`, answerData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
        });
      dispatch(fetchQuestionAnswers(questionId))
      return response.data.data; 
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateAnswer = createAsyncThunk(
  'question/updateAnswer',
  async ({ questionId, answerId, answerData },{ getState,dispatch, rejectWithValue }) => {
    try {
      const state = getState();
      const user = loggedUser(state);

      if (!user || !user.id || !user.token) {
        throw new Error('User not authenticated');
      }
      const response = await axios.put(`/questions/${questionId}/answers/${answerId}`, answerData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
        });
        dispatch(fetchQuestionAnswers(questionId))
      return response.data.data; 
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteAnswer = createAsyncThunk(
  'question/deleteAnswer',
  async ({ questionId, answerId },{ getState, dispatch,rejectWithValue }) => {
    try {
      const state = getState();
      const user = loggedUser(state);

      if (!user || !user.id || !user.token) {
        throw new Error('User not authenticated');
      }

      await axios.delete(`/questions/${questionId}/answers/${answerId}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
        });
      dispatch(fetchQuestionAnswers(questionId))
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const questionSlice = createSlice({
  name: 'question',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      // Reducers for questions
      .addCase(fetchLessonQuestions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLessonQuestions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.questions = action.payload;
      })
      .addCase(fetchLessonQuestions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addQuestionToLesson.fulfilled, (state, action) => {
        state.questions.push(action.payload);
      })
      .addCase(updateQuestion.fulfilled, (state, action) => {
        const updatedQuestion = action.payload;
        const existingQuestionIndex = state.questions.findIndex(q => q._id === updatedQuestion._id);
        if (existingQuestionIndex !== -1) {
          state.questions[existingQuestionIndex] = updatedQuestion;
        }
      })
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        state.questions = state.questions.filter(q => q._id !== action.payload);
      })
      // Reducers for answers
      .addCase(fetchQuestionAnswers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchQuestionAnswers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.answers[action.payload.questionId] = action.payload.answers;
      })
      .addCase(fetchQuestionAnswers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addAnswerToQuestion.fulfilled, (state, action) => {
        const { questionId, ...newAnswer } = action.payload;
        state.answers[questionId].push(newAnswer);
      })
      .addCase(updateAnswer.fulfilled, (state, action) => {
        const updatedAnswer = action.payload;
        const existingAnswerIndex = state.answers[updatedAnswer.question].findIndex(a => a._id === updatedAnswer._id);
        if (existingAnswerIndex !== -1) {
          state.answers[updatedAnswer.question][existingAnswerIndex] = updatedAnswer;
        }
      })
      .addCase(deleteAnswer.fulfilled, (state, action) => {
        const { questionId, answerId } = action.payload;
        state.answers[questionId] = state.answers[questionId].filter(a => a._id !== answerId);
      });
  },
});

export default questionSlice.reducer;
