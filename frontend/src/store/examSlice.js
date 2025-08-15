import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { loggedUser } from "./authSlice";

// Create Exam
export const createExam = createAsyncThunk(
  "exam/createExam",
  async (examData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/exam`, examData);
      return response.data.exam; // Backend returns { message, exam }
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Edit Exam
export const editExam = createAsyncThunk(
  "exam/editExam",
  async ({ examId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/exam/${examId}`, updatedData);
      return response.data.exam; // Backend returns { message, exam }
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Delete Exam
export const deleteExam = createAsyncThunk(
  "exam/deleteExam",
  async (examId, { rejectWithValue }) => {
    try {
      await axios.delete(`/exam/${examId}`);
      return examId;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Get Exams by Course
export const getAllCourseExams = createAsyncThunk(
  "exam/getAllCourseExams",
  async (courseId, { getState , rejectWithValue }) => {
    try {
       const state = getState();
      const user = loggedUser(state);
         if (!user || !user.id || !user.token) {
        throw new Error("User not authenticated");
      }
      const res = await axios.get(`/exam/course/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        });
      return res.data.exams; 
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
// export const getAllCourseExams = createAsyncThunk(
//   "exam/getAllCourseExams",
//   async (courseId, { getState, rejectWithValue }) => {
//     try {
//       const state = getState()
//       const user = loggedUser(state)

//       if (!user || !user.id || !user.token) {
//         throw new Error("User not authenticated")
//       }

//       const res = await axios.get(`/exam/course/${courseId}`, {
//         headers: {
//           Authorization: `Bearer ${user.token}`,
//           "Content-Type": "application/json",
//         },
//       })
//       return res.data.exams
//     } catch (err) {
//       return rejectWithValue(err.response?.data || err.message)
//     }
//   },
// )

// Get Exam by ID - Updated to handle course data
export const getExamById = createAsyncThunk(
  "exam/getExamById",
  async (examId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/exam/${examId}`);
      return res.data; // Backend returns { message, exam, course }
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Submit Exam - Updated to match backend format
export const submitExam = createAsyncThunk(
  "exam/submitExam",
  async ({ examId, userAnswers }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const user = loggedUser(state);

      if (!user || !user.id || !user.token) {
        throw new Error("User not authenticated");
      }

      const response = await axios.post(
        `/exam/submit/${examId}`,
        { userId: user.id, userAnswers },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data; // e.g. { message, totalScore, details }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
// Get User Score
export const getUserScore = createAsyncThunk(
  "exam/getUserScore",
  async ({ examId }, { getState, rejectWithValue }) => {
    const user = loggedUser(getState());
    try {
      const res = await axios.get(`/exam/${examId}/score/${user.id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Get All Submissions
export const getExamSubmissions = createAsyncThunk(
  "exam/getExamSubmissions",
  async (examId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/exam/${examId}/submissions`);
      return res.data; // Backend returns submissions data
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Get Leaderboard
export const getExamLeaderboard = createAsyncThunk(
  "exam/getExamLeaderboard",
  async (examId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/exam/${examId}/leaderboard`);
      return res.data.topSubmissions; // Backend returns { message, examTitle, totalSubmissions, averageScore, topSubmissions }
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ───── Initial State ─────
const initialState = {
  exams: [],
  currentExam: null,
  currentCourse: null, // Add course data
  submissionResults: null,
  leaderboard: [],
  loading: false,
  error: null,
};

// ───── Slice ─────
const examSlice = createSlice({
  name: "exam",
  initialState,
  reducers: {
    clearExamState: (state) => {
      state.exams = [];
      state.currentExam = null;
      state.currentCourse = null;
      state.submissionResults = null;
      state.leaderboard = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Exam
      .addCase(createExam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createExam.fulfilled, (state, action) => {
        state.loading = false;
        state.exams.push(action.payload);
      })
      .addCase(createExam.rejected, (state, action) => {
        state.loading = false;
      })
      // Edit Exam
      .addCase(editExam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editExam.fulfilled, (state, action) => {
        state.loading = false;
        state.exams = state.exams.map((exam) =>
          exam._id === action.payload._id ? action.payload : exam
        );
        if (state.currentExam?._id === action.payload._id) {
          state.currentExam = action.payload;
        }
      })
      .addCase(editExam.rejected, (state, action) => {
        state.loading = false;
      })
      // Delete Exam
      .addCase(deleteExam.fulfilled, (state, action) => {
        state.exams = state.exams.filter((exam) => exam._id !== action.payload);
      })
      .addCase(deleteExam.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Get All Exams
    .addCase(getAllCourseExams.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(getAllCourseExams.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.exams = action.payload 
        state.error = null
      })
      .addCase(getAllCourseExams.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })
      // Get Exam By ID - Updated to handle course data
      .addCase(getExamById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getExamById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentExam = action.payload.exam;
        state.currentCourse = action.payload.course; // Store course data
      })
      .addCase(getExamById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Submit Exam
      .addCase(submitExam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitExam.fulfilled, (state, action) => {
        state.loading = false;
        state.submissionResults = action.payload;
      })
      .addCase(submitExam.rejected, (state, action) => {
        state.loading = false;
      })
      // Get User Score
      .addCase(getUserScore.fulfilled, (state, action) => {
        state.submissionResults = action.payload;
      })
      .addCase(getUserScore.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Get Submissions
      .addCase(getExamSubmissions.fulfilled, (state, action) => {
        state.currentExam = {
          ...state.currentExam,
          submissions: action.payload.submissions,
        };
      })
      .addCase(getExamSubmissions.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Get Leaderboard
      .addCase(getExamLeaderboard.fulfilled, (state, action) => {
        state.leaderboard = action.payload;
      })
      .addCase(getExamLeaderboard.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearExamState } = examSlice.actions;
export default examSlice.reducer;
