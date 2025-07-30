import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { loggedUser } from "./authSlice";

const initialState = {
  partenaires: [],
  partenaire: null,
  status: "idle",
  error: null,
};

export const addPartenaire = createAsyncThunk(
  "partenaire/addPartenaire",
  async (partenaireData, { getState }) => {
    try {
      const state = getState();
      const user = loggedUser(state);
      const response = await axios.post("/partenaires", partenaireData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error adding partenaire:", error);
      return Promise.reject(error.response.data.message || error.message);
    }
  }
);

export const fetchPartenaires = createAsyncThunk(
  "partenaire/fetchPartenaires",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/partenaires");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPartenaireById = createAsyncThunk(
  "partenaire/fetchPartenaire",
  async (id, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const user = loggedUser(state);
      const response = await axios.get(`/partenaires/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updatePartenaire = createAsyncThunk(
  "partenaires/updatePartenaire",
  async ({ id, formData }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const user = loggedUser(state);

      const response = await axios.put(`/partenaires/${id}`, formData, {
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

export const deletePartenaire = createAsyncThunk(
  "partenaires/deletePartenaire",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/partenaires/${id}`);
      return id;
    } catch (error) {
      console.error("Error deleting partenaire:", error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


const partenaireSlice = createSlice({
  name: "partenaires",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addPartenaire.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addPartenaire.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.partenaires.push(action.payload);
      })
      .addCase(addPartenaire.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchPartenaires.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPartenaires.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.partenaires = action.payload;
      })
      .addCase(fetchPartenaires.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchPartenaireById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPartenaireById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.partenaire = action.payload;
      })
      .addCase(fetchPartenaireById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updatePartenaire.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updatePartenaire.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.partenaires.findIndex(
          (partenaire) => partenaire._id === action.payload._id
        );
        if (index !== -1) {
          state.partenaires[index] = action.payload;
        }
      })
      .addCase(updatePartenaire.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deletePartenaire.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deletePartenaire.fulfilled, (state, action) => {
        console.log("Deleted partenaire ID:", action.payload);
        state.status = "succeeded";
        state.partenaires = state.partenaires.filter(
          (partenaire) => partenaire._id !== action.payload
        );
      })
      .addCase(deletePartenaire.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default partenaireSlice.reducer;