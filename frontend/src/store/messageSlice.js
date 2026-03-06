
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

// Async thunk for creating a message (for API calls when needed)
export const createMessage = createAsyncThunk(
  "messages/createMessage",
  async ({ conversationId, senderId, content, images, videos }, { rejectWithValue }) => {
    try {
      const formData = new FormData()
      formData.append("conversationId", conversationId)
      formData.append("senderId", senderId)
      formData.append("content", content)

      if (images) {
        images.forEach((image) => {
          formData.append("images", image)
        })
      }

      if (videos) {
        videos.forEach((video) => {
          formData.append("videos", video)
        })
      }

      const response = await axios.post("/messages", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  },
)

// Async thunk for fetching messages
export const fetchMessages = createAsyncThunk("messages/fetchMessages", async (conversationId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`/messages/${conversationId}`)
    return response.data.messages
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

const messageSlice = createSlice({
  name: "messages",
  initialState: {
    messages: [],
    status: "idle",
    error: null,
  },
  reducers: {
    // Add message immediately (for real-time and optimistic updates)
    addMessage: (state, action) => {
      const newMessage = action.payload

      // Check if message already exists (prevent duplicates)
      const existingMessage = state.messages.find(
        (msg) =>
          msg._id === newMessage._id ||
          (msg.isOptimistic &&
            newMessage.content === msg.content &&
            Math.abs(new Date(newMessage.timestamp) - new Date(msg.timestamp)) < 5000),
      )

      if (!existingMessage) {
        state.messages.push(newMessage)
      }
    },

    // Replace optimistic message with real message from server
    replaceOptimisticMessage: (state, action) => {
      const { tempId, message } = action.payload
      const index = state.messages.findIndex((msg) => msg._id === tempId)

      if (index !== -1) {
        // Replace optimistic message with real message
        state.messages[index] = {
          ...message,
          status: "sent",
        }
      } else {
        // If optimistic message not found, just add the new message
        state.messages.push({
          ...message,
          status: "sent",
        })
      }
    },

    // Update message status (sent, delivered, read)
    updateMessageStatus: (state, action) => {
      const { messageId, tempId, status } = action.payload
      const message = state.messages.find((msg) => msg._id === messageId || msg._id === tempId)

      if (message) {
        message.status = status
        if (messageId && message._id !== messageId) {
          message._id = messageId // Update temp ID with real ID
        }
      }
    },

    // Remove failed optimistic message
    removeFailedMessage: (state, action) => {
      const tempId = action.payload
      state.messages = state.messages.filter((msg) => msg._id !== tempId)
    },

    // Clear messages (when switching conversations)
    clearMessages: (state) => {
      state.messages = []
      state.status = "idle"
      state.error = null
    },

    // Update message (for editing)
    updateMessage: (state, action) => {
      const { messageId, content } = action.payload
      const message = state.messages.find((msg) => msg._id === messageId)

      if (message) {
        message.content = content
        message.edited = true
        message.editedAt = new Date().toISOString()
      }
    },

    deleteMessage: (state, action) => {
      const messageId = action.payload
      state.messages = state.messages.filter((msg) => msg._id !== messageId)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createMessage.pending, (state) => {
        state.status = "loading"
      })
      .addCase(createMessage.fulfilled, (state, action) => {
        state.status = "succeeded"
      })
      .addCase(createMessage.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })
      .addCase(fetchMessages.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.messages = action.payload
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })
  },
})

// Export actions
export const {
  addMessage,
  replaceOptimisticMessage,
  updateMessageStatus,
  removeFailedMessage,
  clearMessages,
  updateMessage,
  deleteMessage,
} = messageSlice.actions

export default messageSlice.reducer
