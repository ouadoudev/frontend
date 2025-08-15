import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import axios from "axios";

const user = JSON.parse(localStorage.getItem("user"));

const initialState = {
  user: user ? user : null,
  status: "idle",
  error: null,
  isAuthenticated: user ? true : false,
  token: user ? user.token : null,
};

export const setUserRole = createAction("auth/setUserRole");
export const updateUserSuccess = createAction("auth/updateUserSuccess");

// export const registerUser = createAsyncThunk(
//     'auth/registerUser',
//     async (userData, { rejectWithValue }) => {
//       try {
//         const response = await axios.post('/users/register', userData, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//         localStorage.setItem('user', JSON.stringify(response.data));
//         return  response.data ;
//       } catch (error) {
//         return rejectWithValue(error.response?.data?.message || 'Unable to register. Please try again later.');
//       }
//     }
//   );

export const registerAdmin = createAsyncThunk(
  "auth/registerAdmin",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/users/register/admin", userData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      // Handle axios errors
      if (error.response) {
        const { data, status } = error.response;

        // Handle 422 Validation Errors
        if (status === 422 && data.errors?.[0]?.msg) {
          return rejectWithValue(data.errors[0].msg);
        }

        // Handle 400 Bad Requests
        if (status === 400 && data.error) {
          return rejectWithValue(data.error);
        }

        // Handle 403 Email Exists
        if (status === 403 && data.message) {
          return rejectWithValue(data.message);
        }

        // Handle 500 Server Errors
        if (status === 500 && data.message) {
          return rejectWithValue(data.message);
        }
      }

      // Fallback for network errors or unhandled cases
      return rejectWithValue(
        error.message || "Admin registration failed. Please try again."
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/users/register", userData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      if (error.message === "Network Error") {
        return rejectWithValue("Problème de connexion au serveur");
      }
      if (error.response) {
        const { data, status } = error.response;

        // Handle 422 Validation Errors
        if (status === 422 && data.errors?.[0]?.msg) {
          return rejectWithValue(data.errors[0].msg);
        }

        // Handle 400 Bad Requests
        if (status === 400 && data.error) {
          return rejectWithValue(data.error);
        }

        // Handle 403 Email Exists
        if (status === 403 && data.message) {
          return rejectWithValue(data.message);
        }

        // Handle 500 Server Errors
        if (status === 500 && data.message) {
          return rejectWithValue(data.message);
        }
      }

      // Fallback for network errors or unhandled cases
      return rejectWithValue(
        error.message || "Registration failed. Please try again."
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post("/users/login", userData, {
        headers: { "Content-Type": "application/json" },
      });
      localStorage.setItem("user", JSON.stringify(response.data));
      dispatch(setUserRole(response.data.role));
      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.msg || "Unable to login. Please try again later."
      );
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      try {
        axios
          .post("/users/logout", null, {
            headers: { Authorization: `Bearer ${state.token}` },
          })
          .then(() => {
            localStorage.removeItem("user");
            state.user = null;
            state.token = null;
            state.role = null;
            state.status = "idle";
            state.error = null;
            state.isAuthenticated = false;
          })
          .catch((error) => {
            console.error("Logout error:", error);
          });
      } catch (error) {
        console.error("Logout action error:", error);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.token = action.payload.token;
        state.role = action.payload.role;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      .addCase(setUserRole, (state, action) => {
        state.role = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(registerAdmin.pending, (state) => {
        state.status = "loading";
      })
      .addCase(registerAdmin.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerAdmin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateUserSuccess, (state, action) => {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem("user", JSON.stringify(state.user));
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
export const loggedUser = (state) => state.auth.user;
