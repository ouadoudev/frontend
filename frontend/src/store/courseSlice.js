import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { loggedUser, updateUserSuccess } from "./authSlice";
import { fetchReviews } from "./reviewSlice";

const initialState = {
  courses: [],
  course: null,
  reviews: [],
  lessons: [],
  progress: 0,
  status: "idle",
  error: null,
};

export const createCourse = createAsyncThunk(
  "courses/createCourse",
  async (courseData, { getState,dispatch }) => {
    try {
      const state = getState();
      const user = loggedUser(state);
      const response = await axios.post(
        "/courses",
        courseData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      dispatch(fetchCourses())
      return response.data;
    } catch (error) {
      console.error("Error adding course:", error);
      return Promise.reject(error.response.data.message || error.message);
    }
  }
);

export const fetchCourses = createAsyncThunk(
  "courses/fetchCourses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/courses");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCourseById = createAsyncThunk(
  "courses/fetchCourseById",
  async (id, { rejectWithValue,dispatch }) => {
    try {
      const response = await axios.get(`/courses/${id}`);
      const courseId = response.data.data._id;
      dispatch(fetchReviews({ courseId }));
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const startCourse = createAsyncThunk(
  "courses/startCourse",
  async (id, { getState, rejectWithValue,dispatch }) => {
    try {
      const state = getState();
      const user = loggedUser(state);
      const response = await axios.post(
        `/courses/${id}/start`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      dispatch(updateUserSuccess(response.data.user));
      return response.data; 
    } catch (error) {
      console.error("Error starting course:", error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


export const fetchLessonsByCourseId = createAsyncThunk(
  "courses/fetchLessonsByCourseId",
  async (id) => {
    try {
      const response = await axios.get(
        `/courses/${id}/lessons`
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching lessons by course ID:", error);
      return Promise.reject(error.response.data.message || error.message);
    }
  }
);

export const updateCourse = createAsyncThunk(
  "courses/updateCourse",
  async ({ id, formData }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const user = loggedUser(state);

      const response = await axios.put(`/courses/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const deleteCourse = createAsyncThunk(
  "courses/deleteCourse",
  async (courseId) => {
    try {
      await axios.delete(`/courses/${courseId}`, {});
      return courseId;
    } catch (error) {
      console.error("Error deleting course:", error);
      return Promise.reject(error.response.data.message || error.message);
    }
  }
);

const courseSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createCourse.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.courses.push(action.payload);
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchCourses.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.courses = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchCourseById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.course = action.payload;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchLessonsByCourseId.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLessonsByCourseId.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.lessons = action.payload;
      })
      .addCase(fetchLessonsByCourseId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateCourse.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.courses.findIndex(
          (course) => course._id === action.payload._id
        );
        if (index !== -1) {
          state.courses[index] = action.payload;
        }
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteCourse.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        console.log("Deleted course ID:", action.payload);
        state.status = "succeeded";
        state.courses = state.courses.filter(
          (course) => course._id !== action.payload
        );
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(startCourse.pending, (state) => {
        state.status = "loading";
      })
      .addCase(startCourse.fulfilled, (state,) => {
        state.status = "succeeded";
        if (action.payload.enrollmentIncremented && state.course) {
          state.course.enrolls = action.payload.courseEnrolls
        }
      })
      .addCase(startCourse.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default courseSlice.reducer;
