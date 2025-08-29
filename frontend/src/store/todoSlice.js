import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { loggedUser } from './authSlice';

const initialState = {
  todos: [],
  fetchStatus: 'idle',
  createStatus: 'idle',
  updateStatus: 'idle',
  deleteStatus: 'idle',
  error: null,
};

// CREATE Todo
export const createTodo = createAsyncThunk(
  'todos/createTodo',
  async (todoData, { getState, rejectWithValue }) => {
    try {
      const user = loggedUser(getState());
      const response = await axios.post('/todos', todoData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Create todo failed:', error);
      return rejectWithValue(error.response?.data?.message || 'Unable to create todo');
    }
  }
);

// FETCH Todos
export const fetchTodos = createAsyncThunk(
  'todos/fetchTodos',
  async (_, { getState, rejectWithValue }) => {
    try {
      const user = loggedUser(getState());
      const response = await axios.get('/todos', {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Fetch todos failed:', error);
      return rejectWithValue(error.response?.data?.message || 'Unable to fetch todos');
    }
  }
);

// UPDATE Todo (mark as completed)
export const markTodoAsCompleted = createAsyncThunk(
  'todos/markTodoAsCompleted',
  async ({ id, completed }, { getState, rejectWithValue }) => {
    try {
      const user = loggedUser(getState());
      const response = await axios.patch(`/todos/${id}`, { completed }, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data; // response returns updated list
    } catch (error) {
      console.error('Update todo failed:', error);
      return rejectWithValue(error.response?.data?.message || 'Unable to update todo');
    }
  }
);

// DELETE Todo
export const deleteTodo = createAsyncThunk(
  'todos/deleteTodo',
  async (id, { getState, rejectWithValue }) => {
    try {
      const user = loggedUser(getState());
      await axios.delete(`/todos/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
      });
      return { id };
    } catch (error) {
      console.error('Delete todo failed:', error);
      return rejectWithValue(error.response?.data?.message || 'Unable to delete todo');
    }
  }
);

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH TODOS
      .addCase(fetchTodos.pending, (state) => {
        state.fetchStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.fetchStatus = 'succeeded';
        state.todos = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.fetchStatus = 'failed';
        state.error = action.payload;
      })

      // CREATE TODO
      .addCase(createTodo.pending, (state) => {
        state.createStatus = 'loading';
        state.error = null;
      })
      .addCase(createTodo.fulfilled, (state, action) => {
        state.createStatus = 'succeeded';
        state.todos.unshift(action.payload);
      })
      .addCase(createTodo.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.error = action.payload;
      })

      // UPDATE TODO
      .addCase(markTodoAsCompleted.pending, (state) => {
        state.updateStatus = 'loading';
        state.error = null;
      })
      .addCase(markTodoAsCompleted.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        state.todos = action.payload; // if server returns updated list
      })
      .addCase(markTodoAsCompleted.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.error = action.payload;
      })

      // DELETE TODO
      .addCase(deleteTodo.pending, (state) => {
        state.deleteStatus = 'loading';
        state.error = null;
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.deleteStatus = 'succeeded';
        state.todos = state.todos.filter(todo => todo._id !== action.payload.id);
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.deleteStatus = 'failed';
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectAllTodos = (state) => state.todos.todos;
export const selectFetchStatus = (state) => state.todos.fetchStatus;
export const selectCreateStatus = (state) => state.todos.createStatus;
export const selectUpdateStatus = (state) => state.todos.updateStatus;
export const selectDeleteStatus = (state) => state.todos.deleteStatus;
export const selectTodoError = (state) => state.todos.error;

export default todoSlice.reducer;
