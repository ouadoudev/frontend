import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { loggedUser, updateUserSuccess } from "./authSlice";

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/users");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchUserById = createAsyncThunk(
  "users/fetchUserById",
  async (id, { getState, rejectWithValue }) => {
  try {
      const state = getState();
      const user = loggedUser(state);

      if (!user || !user.id || !user.token) {
        throw new Error("User not authenticated");
      }
      const response = await axios.get(`/users/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch user');
    }
  }
);

export const educationalDetails = createAsyncThunk(
  "users/educationalDetails",
  async (details, { getState, dispatch, rejectWithValue }) => {
    try {
      const state = getState();
      const user = loggedUser(state);

      if (!user || !user.id || !user.token) {
        throw new Error("User not authenticated");
      }

      const response = await axios.post(`/users/educational-details`, details, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      dispatch(updateUserSuccess(response.data.user));
      return response.data.user;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      } else if (error.request) {
        return rejectWithValue({ message: "No response from server" });
      } else {
        return rejectWithValue({ message: error.message });
      }
    }
  }
);

export const updateEducationalDetails = createAsyncThunk(
  "user/updateEducationalDetails",
  async ({ userId, educationalCycle, educationalLevel, stream }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        "/users/update-educational-details",
        { userId, educationalCycle, educationalLevel, stream }
      );
      return response.data.user;
    } catch (err) {
      const error = err.response?.data?.message || "Failed to update educational details.";
      return rejectWithValue(error);
    }
  }
);

export const assignEducationToTeacher = createAsyncThunk(
  "user/assignEducationToTeacher",
  async (
    { userId, educationalCycles, educationalLevels },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post("/users/assign-educational-details", {
        userId,
        educationalCycles,
        educationalLevels,
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      } else if (error.request) {
        return rejectWithValue({ message: "No response from server" });
      } else {
        return rejectWithValue({ message: error.message });
      }
    }
  }
);

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async ({ id, userData }, { getState, dispatch, rejectWithValue }) => {
    try {
      const state = getState();
      const user = loggedUser(state);

      if (!user || !user.id || !user.token) {
        throw new Error("User not authenticated");
      }

      const response = await axios.put(`/users/${id}`, userData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      dispatch(updateUserSuccess(response.data.user));
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (userId, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const user = loggedUser(state);

      if (!user || !user.id || !user.token) {
        throw new Error("User not authenticated");
      }
      await axios.delete(`/users/${userId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      return userId;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete user');
    }
  }
);

export const registerTeacher = createAsyncThunk(
  "users/registerTeacher",
  async (teacherData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "/users/register/teacher",
        teacherData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchCvByUserId = createAsyncThunk(
  "user/fetchCvByUserId",
  async (userId, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const user = loggedUser(state);

      if (!user || !user.id || !user.token) {
        throw new Error("User not authenticated");
      }
      const response = await axios.get(`/users/cv/${userId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Network error");
    }
  }
);

export const hiringTeacher = createAsyncThunk(
  "users/hiringTeacher",
  async (
    { userId, action, interviewDate },
    { dispatch, getState, rejectWithValue }
  ) => {
   try {
      const state = getState();
      const user = loggedUser(state);

      if (!user || !user.id || !user.token) {
        throw new Error("User not authenticated");
      }

      if (user.role !== "admin") {
        return rejectWithValue({ error: "Access denied: Admin role required" });
      }

      const response = await axios.put(
        `/users/hiring/${userId}`,
        { action, interviewDate },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      dispatch(fetchUsers());
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    users: [],
    user: null,
    cv: null,
    status: "idle",
    error: null,
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Fetch user by ID
      .addCase(fetchUserById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user._id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(registerTeacher.pending, (state) => {
        state.status = "loading";
      })
      .addCase(registerTeacher.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
      })
      .addCase(registerTeacher.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

       .addCase(fetchCvByUserId.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCvByUserId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cv = action.payload; 
      })
      .addCase(fetchCvByUserId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch CV';
      })
      // Hiring teacher
      .addCase(hiringTeacher.pending, (state) => {
        state.status = "loading";
      })
      .addCase(hiringTeacher.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
      })
      .addCase(hiringTeacher.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(educationalDetails.pending, (state) => {
        state.status = "loading";
      })
      .addCase(educationalDetails.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
      })
      .addCase(educationalDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
       .addCase(updateEducationalDetails.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateEducationalDetails.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = {
          ...state.user,
          ...action.payload,
        };
      })
      .addCase(updateEducationalDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(assignEducationToTeacher.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(assignEducationToTeacher.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = {
          ...state.user,
          educationalCycles: action.payload.educationalCycles,
          educationalLevels: action.payload.educationalLevels,
        };
        localStorage.setItem("user", JSON.stringify(state.user));
      })
      .addCase(assignEducationToTeacher.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
