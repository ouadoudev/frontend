import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { loggedUser } from "./authSlice";

const initialState = {
  lesson: null,
  lessons: [],
  reviews: [],
  relatedLessons: [],
  status: "idle",
  error: null,
};

export const fetchLessons = createAsyncThunk(
  "lessons/fetchLessons",
  async () => {
    try {
      const response = await axios.get("/lessons");
      return response.data.data;
    } catch (error) {
      return Promise.reject(error.response?.data?.message || error.message);
    }
  }
);

export const addLesson = createAsyncThunk(
  "lessons/addLesson",
  async (lessonData, { getState, dispatch }) => {
    try {
      const state = getState();
      const user = loggedUser(state);
      const response = await axios.post("/lessons", lessonData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      dispatch(fetchLessons());
      return response.data;
    } catch (error) {
      return Promise.reject(error.response?.data?.message || error.message);
    }
  }
);

export const fetchLesson = createAsyncThunk(
  "lessons/fetchLesson",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/lessons/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "An error occurred while fetching the lesson."
      );
    }
  }
);

export const fetchLessonsByCourse = createAsyncThunk(
  "lessons/fetchLessonsByCourse",
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/courses/${courseId}/lessons`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "An error occurred while fetching lessons for the course."
      );
    }
  }
);

export const fetchRelatedLessons = createAsyncThunk(
  "lessons/fetchRelatedLessons",
  async (lessonId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/lessons/related/${lessonId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "An error occurred while fetching related lessons."
      );
    }
  }
);

export const updateLesson = createAsyncThunk(
  "lessons/updateLesson",
  async ({ lessonId, formData }, { dispatch }) => {
    const response = await axios.put(`/lessons/${lessonId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    dispatch(fetchLessons());
    return response.data;
  }
);

export const deleteLesson = createAsyncThunk(
  "lessons/deleteLesson",
  async (lessonId) => {
    try {
      await axios.delete(`/lessons/${lessonId}`);
      return lessonId;
    } catch (error) {
      return Promise.reject(error.response?.data?.message || error.message);
    }
  }
);

const lessonSlice = createSlice({
  name: "lesson",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLessons.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchLessons.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.lessons = action.payload;
      })
      .addCase(fetchLessons.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(fetchRelatedLessons.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchRelatedLessons.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.relatedLessons = action.payload;
      })
      .addCase(fetchRelatedLessons.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(addLesson.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addLesson.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.lessons.push(action.payload);
      })
      .addCase(addLesson.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(updateLesson.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateLesson.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.lessons.findIndex(
          (l) => l._id === action.payload._id
        );
        if (index !== -1) {
          state.lessons[index] = action.payload;
        }
      })
      .addCase(updateLesson.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(deleteLesson.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteLesson.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.lessons = state.lessons.filter(
          (lesson) => lesson._id !== action.payload
        );
      })
      .addCase(deleteLesson.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(fetchLessonsByCourse.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchLessonsByCourse.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.lessons = action.payload;
      })
      .addCase(fetchLessonsByCourse.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(fetchLesson.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLesson.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.lesson = action.payload;
      })
      .addCase(fetchLesson.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default lessonSlice.reducer;
