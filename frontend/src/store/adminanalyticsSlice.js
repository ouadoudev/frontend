import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch the analytics data
export const fetchAnalytics = createAsyncThunk(
  "analytics/fetchAnalytics",
  async ({ timeframe, startDate, endDate }) => {
    const response = await axios.get("/admin/analytics", {
      params: { timeframe, startDate, endDate },
    });
    return response.data;
  }
);

// Initial state for the analytics slice
const initialState = {
  onlineUsers: 0,
  totalUsers: 0,
  totalStudents: 0,
  studentsStats: [],
  totalTeachers: 0,
  teachersStats: [],
  topTeachers: [],
  topSubjects: [],
  topCompletedCourses: [],
  newEnrollments: [],
  totalRevenue: 0,
  revenueDistribution: {},
  subjectRevenue: [],
  teacherRevenue: [],
  growth: {
    totalUsersGrowth: 0,
    totalStudentsGrowth: 0,
    totalTeachersGrowth: 0,
  },
  status: "idle", // 'loading', 'succeeded', 'failed'
  error: null,
};

// Redux slice
const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Storing the API response data in the state
        state.onlineUsers = action.payload.onlineUsers;
        state.totalUsers = action.payload.totalUsers;
        state.totalStudents = action.payload.totalStudents;
        state.studentsStats = action.payload.studentsStats;
        state.totalTeachers = action.payload.totalTeachers;
        state.teachersStats = action.payload.teachersStats;
        state.topTeachers = action.payload.topTeachers;
        state.topSubjects = action.payload.topSubjects;
        state.topCompletedCourses = action.payload.topCompletedCourses;
        state.newEnrollments = action.payload.newEnrollments;
        state.totalRevenue = action.payload.totalRevenue;
        state.subjectRevenue = action.payload.subjectRevenue;
        state.teacherRevenue = action.payload.teacherRevenue;
        state.revenueDistribution = action.payload.revenueDistribution;
        
        // Store growth metrics
        state.growth = action.payload.growth;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

// Export the async thunk and the reducer
export default analyticsSlice.reducer;
