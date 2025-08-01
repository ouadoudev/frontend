import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for creating an order
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async ({ userId, orderData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/orders/${userId}`, orderData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for fetching all orders (only for admin/teacher)
export const fetchAllOrders = createAsyncThunk(
  'orders/fetchAllOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/orders/all');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Initial state
const initialState = {
  orders: [],
  loading: false,
  error: null,
};

// Slice
const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Reducer for createOrder
    builder.addCase(createOrder.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createOrder.fulfilled, (state, action) => {
      state.loading = false;
      // Update state with the newly created order
      state.orders.push(action.payload);
    });
    builder.addCase(createOrder.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message; // Assuming error message is in payload
    });

    // Reducer for fetchAllOrders
    builder.addCase(fetchAllOrders.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchAllOrders.fulfilled, (state, action) => {
      state.loading = false;
      state.orders = action.payload.orders;
    });
    builder.addCase(fetchAllOrders.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message; // Assuming error message is in payload
    });
  },
});

export default orderSlice.reducer;
