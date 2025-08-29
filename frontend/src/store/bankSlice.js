import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { loggedUser } from "./authSlice";

const initialState = {
  bankAccounts: [],
  bankAccount: null,
  status: "idle",
  error: null,
};

// Ajouter un compte bancaire
export const addBankAccount = createAsyncThunk(
  "bankAccounts/add",
  async (data, { getState, rejectWithValue }) => {
    try {
      const user = loggedUser(getState());
      const response = await axios.post("/bank-accounts", data, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

// Modifier un compte bancaire
export const updateBankAccount = createAsyncThunk(
  "bankAccounts/update",
  async ({ id, data }, { getState, rejectWithValue }) => {
    try {
      const user = loggedUser(getState());
      const response = await axios.put(`/bank-accounts/${id}`, data, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

// Récupérer tous les comptes bancaires
export const fetchBankAccounts = createAsyncThunk(
  "bankAccounts/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/bank-accounts");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

// Définir un compte par défaut
export const setDefaultBankAccount = createAsyncThunk(
  "bankAccounts/setDefault",
  async (id, { getState, rejectWithValue }) => {
    try {
      const user = loggedUser(getState());
      const response = await axios.patch(
        `/bank-accounts/${id}/set-default`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

// Activer / désactiver un compte bancaire
export const toggleBankAccountStatus = createAsyncThunk(
  "bankAccounts/toggleStatus",
  async (id, { getState, rejectWithValue }) => {
    try {
      const user = loggedUser(getState());
      const response = await axios.patch(
        `/bank-accounts/${id}/toggle-status`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const deleteBankAccount = createAsyncThunk(
  "bankAccounts/delete",
  async (id, { getState, rejectWithValue }) => {
    try {
      const user = loggedUser(getState());
      await axios.delete(`/bank-accounts/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

const bankAccountSlice = createSlice({
  name: "bankAccounts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addBankAccount.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addBankAccount.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.bankAccounts.unshift(action.payload);
      })
      .addCase(addBankAccount.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateBankAccount.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateBankAccount.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.bankAccounts.findIndex(
          (acc) => acc._id === action.payload._id
        );
        if (index !== -1) {
          state.bankAccounts[index] = action.payload;
        }
      })
      .addCase(updateBankAccount.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchBankAccounts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBankAccounts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.bankAccounts = action.payload;
      })
      .addCase(fetchBankAccounts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteBankAccount.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteBankAccount.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.bankAccounts = state.bankAccounts.filter(
          (acc) => acc._id !== action.payload
        );
      })
      .addCase(deleteBankAccount.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(setDefaultBankAccount.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.bankAccounts = state.bankAccounts.map((acc) =>
          acc._id === action.payload._id
            ? { ...acc, isDefault: true, isActive: true }
            : { ...acc, isDefault: false }
        );
      })
      .addCase(toggleBankAccountStatus.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.bankAccounts.findIndex(
          (acc) => acc._id === action.payload._id
        );
        if (index !== -1) {
          state.bankAccounts[index] = action.payload;
        }
      });
  },
});

export default bankAccountSlice.reducer;
