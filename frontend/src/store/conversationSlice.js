// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';

// // Async thunk to create a conversation
// export const createConversation = createAsyncThunk(
//   'conversations/createConversation',
//   async ({ userId, teacherId, groupTitle }, { rejectWithValue }) => {
//     try {
//       const response = await axios.post('/conversation', { userId, teacherId, groupTitle });
//       return response.data.conversation;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// // Async thunk to fetch user conversations
// export const fetchUserConversations = createAsyncThunk(
//   'conversations/fetchUserConversations',
//   async (userId, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`/conversation/${userId}`);
//       return response.data.conversations;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// // Async thunk to fetch teacher conversations
// export const fetchTeacherConversations = createAsyncThunk(
//   'conversations/fetchTeacherConversations',
//   async (teacherId, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`/conversation/${teacherId}`);
//       return response.data.conversations;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// // Async thunk to update the last message in a conversation
// export const updateLastMessage = createAsyncThunk(
//   'conversations/updateLastMessage',
//   async ({ conversationId, lastMessage, lastMessageId }, { rejectWithValue }) => {
//     try {
//       const response = await axios.put(`/conversation/${conversationId}`,
//         { lastMessage, lastMessageId },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         }
//       );
//       return response.data.conversation;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// const conversationsSlice = createSlice({
//   name: 'conversations',
//   initialState: {
//     conversations: [],
//     currentConversation: null,
//     loading: false,
//     error: null,
//   },
//   reducers: {
//     setCurrentConversation(state, action) {
//       state.currentConversation = action.payload;
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(createConversation.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(createConversation.fulfilled, (state, action) => {
//         state.loading = false;
//         state.conversations.push(action.payload);
//       })
//       .addCase(createConversation.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(fetchUserConversations.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchUserConversations.fulfilled, (state, action) => {
//         state.loading = false;
//         state.conversations = action.payload;
//       })
//       .addCase(fetchUserConversations.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(fetchTeacherConversations.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchTeacherConversations.fulfilled, (state, action) => {
//         state.loading = false;
//         state.conversations = action.payload;
//       })
//       .addCase(fetchTeacherConversations.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(updateLastMessage.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(updateLastMessage.fulfilled, (state, action) => {
//         const updatedConversation = action.payload;
//         const index = state.conversations.findIndex(
//           (conversation) => conversation._id === updatedConversation._id
//         );
//         if (index !== -1) {
//           state.conversations[index] = updatedConversation;
//         }
//       })
//       .addCase(updateLastMessage.rejected, (state, action) => {
//         state.error = action.error.message;
//       });
//   },
// });

// export const { setCurrentConversation } = conversationsSlice.actions;

// export default conversationsSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to create a conversation
export const createConversation = createAsyncThunk(
  'conversations/createConversation',
  async ({ userId, teacherId, groupTitle }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/conversation', { userId, teacherId, groupTitle });
      return response.data.conversation;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to fetch user conversations
export const fetchUserConversations = createAsyncThunk(
  'conversations/fetchUserConversations',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/conversation/${userId}`);
      return response.data.conversations;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to fetch teacher conversations
export const fetchTeacherConversations = createAsyncThunk(
  'conversations/fetchTeacherConversations',
  async (teacherId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/conversation/${teacherId}`);
      return response.data.conversations;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to update the last message in a conversation
export const updateLastMessage = createAsyncThunk(
  'conversations/updateLastMessage',
  async ({ conversationId, lastMessage, lastMessageId }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/conversation/${conversationId}`,
        { lastMessage, lastMessageId },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data.conversation;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const conversationsSlice = createSlice({
  name: 'conversations',
  initialState: {
    conversations: [],
    currentConversation: null,
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentConversation: (state, action) => {
      state.currentConversation = action.payload;
    },
    updateLastMessageRedux: (state, action) => {
      const { conversationId, lastMessage, lastMessageId } = action.payload;
      const conversationToUpdate = state.conversations.find(
        (conv) => conv._id === conversationId
      );
      if (conversationToUpdate) {
        conversationToUpdate.lastMessage = lastMessage;
        conversationToUpdate.lastMessageId = lastMessageId;
      }
      if (state.currentConversation && state.currentConversation._id === conversationId) {
        state.currentConversation.lastMessage = lastMessage;
        state.currentConversation.lastMessageId = lastMessageId;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createConversation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createConversation.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations.push(action.payload);
      })
      .addCase(createConversation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchUserConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTeacherConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeacherConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchTeacherConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateLastMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLastMessage.fulfilled, (state, action) => {
        const updatedConversation = action.payload;
        const index = state.conversations.findIndex(
          (conversation) => conversation._id === updatedConversation._id
        );
        if (index !== -1) {
          state.conversations[index] = updatedConversation;
        }
      })
      .addCase(updateLastMessage.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export const { setCurrentConversation, updateLastMessageRedux } = conversationsSlice.actions;

export default conversationsSlice.reducer;