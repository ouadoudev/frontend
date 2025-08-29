// src/features/contactForm/contactFormSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const sendEmail = createAsyncThunk(
  'contactForm/sendEmail',
  async (formData, thunkAPI) => {
    try {
      const response = await axios.post('https://tamadrus-api.onrender.com/send-email', formData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const contactFormSlice = createSlice({
  name: 'contact',
  initialState: {
    firstName: '',
    lastName: '',
    email: '',
    message: '',
    status: 'idle',
    error: null
  },
  reducers: {
    updateField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendEmail.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(sendEmail.fulfilled, (state) => {
        state.status = 'succeeded';
        state.firstName = '';
        state.lastName = '';
        state.email = '';
        state.message = '';
      })
      .addCase(sendEmail.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { updateField } = contactFormSlice.actions;

export default contactFormSlice.reducer;
