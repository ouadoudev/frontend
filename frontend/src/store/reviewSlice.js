import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { loggedUser } from './authSlice';

const initialState = {
  reviews: [],
  status: 'idle',
  error: null,
};

export const fetchReviews = createAsyncThunk(
  'reviews/fetchReviews',
  async ({ courseId }, { rejectWithValue }) => {
    try {
      // const state = getState();
      // const user = loggedUser(state);

      // if (!user || !user.id || !user.token) {
      //   throw new Error('User not authenticated');
      // }

      const response = await axios.get(
        `https://tamadrus-api.onrender.com/reviews/${courseId}`,
        // {
        //   headers: {
        //     Authorization: `Bearer ${user.token}`,
        //     'Content-Type': 'application/json',
        //   },
        // }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createReview = createAsyncThunk(
  'reviews/createReview',
  async ({ courseId, reviewData }, { getState, dispatch, rejectWithValue }) => {
    try {
      const state = getState();
      const user = loggedUser(state);

      if (!user || !user.id || !user.token) {
        throw new Error('User not authenticated');
      }

      const reviewPayload = {
        user: user.id, 
        ...reviewData,
      };

      const response = await axios.post(
        `https://tamadrus-api.onrender.com/reviews/${courseId}`,
        reviewPayload,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      dispatch(fetchReviews({ courseId }));

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateReview = createAsyncThunk(
  'reviews/updateReview',
  async ({ courseId, reviewId, reviewData }, { getState, dispatch, rejectWithValue }) => {
    try {
      const state = getState();
      const user = loggedUser(state);

      if (!user || !user.id || !user.token) {
        throw new Error('User not authenticated');
      }

      const response = await axios.put(
        `https://tamadrus-api.onrender.com/reviews/${courseId}/${reviewId}`,
        reviewData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
        }
      );

     
      dispatch(fetchReviews({ courseId }));

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteReview = createAsyncThunk(
  'reviews/deleteReview',
  async ({ courseId, reviewId }, { getState, dispatch, rejectWithValue }) => {
    try {
      const state = getState();
      const user = loggedUser(state);

      if (!user || !user.id || !user.token) {
        throw new Error('User not authenticated');
      }

      await axios.delete(
        `https://tamadrus-api.onrender.com/reviews/${courseId}/${reviewId}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Refresh reviews after deletion
      dispatch(fetchReviews({ courseId }));

      return { reviewId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.reviews = action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.reviews.push(action.payload.review);
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedReview = action.payload.review;
        const index = state.reviews.findIndex((review) => review.id === updatedReview.id);
        if (index !== -1) {
          state.reviews[index] = updatedReview; 
        }
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })

      .addCase(deleteReview.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.reviews = state.reviews.filter((review) => review.id !== action.payload.reviewId); 
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

export default reviewSlice.reducer;
