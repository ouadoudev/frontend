import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


export const fetchSubjects = createAsyncThunk('subjects/fetch', async () => {
  const response = await axios.get(`/subjects`);
  return response.data.subjects;
});

export const fetchSubjectById = createAsyncThunk(
  'subjects/fetchSubjectById',async (id,{rejectWithValue})=>{
    try {
      const response = await axios.get(`/subjects/${id}`);
      return response.data.subject;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
)

export const fetchCourseBySubjectId = createAsyncThunk(
  'subjects/fetchCourseBySubjectId',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/subjects/${id}/courses`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching courses by subject ID:', error);
      return rejectWithValue(error.response.data.message || error.message);
    }
  }
);

export const addSubject = createAsyncThunk('subjects/add', async (newSubject,{dispatch}) => {
  const response = await axios.post(`/subjects`, newSubject);
  dispatch(fetchSubjects())
  return response.data;
});

export const updateSubject = createAsyncThunk('subjects/update', async (subject) => {
  await axios.put(`/subjects/${subject._id}`, subject);
  return subject;
});

export const deleteSubject = createAsyncThunk('subjects/delete', async (subjectId) => {
  await axios.delete(`/subjects/${subjectId}`);
  return subjectId;
});

// Create the slice
const subjectSlice = createSlice({
  name: 'subjects',
  initialState: {
    entities: [],
    courses: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    fetchSubjectsStart: (state) => {
      state.isLoading = true;
    },
    fetchSubjectsSuccess: (state, action) => {
      state.isLoading = false;
      state.entities = action.payload;
    },
    fetchSubjectsError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubjects.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.entities = action.payload;
      })
      .addCase(fetchSubjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(fetchSubjectById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSubjectById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.subject = action.payload;
      })
      .addCase(fetchSubjectById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.error;
      })

      .addCase(fetchCourseBySubjectId.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.courses = action.payload;
      })


      .addCase(addSubject.fulfilled, (state, action) => {
        state.entities.push(action.payload);
      })
      .addCase(updateSubject.fulfilled, (state, action) => {
        const index = state.entities.findIndex((subject) => subject._id === action.payload._id);
        if (index !== -1) {
          state.entities[index] = action.payload;
        }
      })
      .addCase(deleteSubject.fulfilled, (state, action) => {
        state.entities = state.entities.filter((subject) => subject._id !== action.payload);
      });
  },
});

export const { fetchSubjectsStart, fetchSubjectsSuccess, fetchSubjectsError } = subjectSlice.actions;
export default subjectSlice.reducer;