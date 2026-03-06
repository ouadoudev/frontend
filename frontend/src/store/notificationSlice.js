import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// Async thunk to fetch all notifications (admin use)
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async () => {
    try {
      const response = await axios.get('/all-notifications')
      return response.data
    } catch (error) {
      throw Error(error.response?.data?.error || error.message)
    }
  }
)

// Fetch notifications for a specific user
export const fetchUserNotifications = createAsyncThunk(
  'notifications/fetchUserNotifications',
  async (userId) => {
    const response = await axios.get(`/notifications/${userId}`)
    return response.data
  }
)

// Mark a specific notification as read
export const markNotificationAsRead = createAsyncThunk(
  'notifications/markNotificationAsRead',
  async (id) => {
    try {
      await axios.put(`/mark-as-read/${id}`, { isRead: true })
      return id
    } catch (error) {
      throw Error(error.response?.data?.error || error.message)
    }
  }
)

// Mark all notifications as read for a user
export const markAllNotificationsAsRead = createAsyncThunk(
  'notifications/markAllNotificationsAsRead',
  async (userId) => {
    try {
      const response = await axios.put(`/mark-all-as-read/${userId}`)
      return response.data.notifications 
    } catch (error) {
      throw Error(error.response?.data?.error || error.message)
    }
  }
)

// Notification slice
const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    notifications: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload)
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all (admin)
      .addCase(fetchNotifications.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.notifications = action.payload
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })

      // Fetch user
      .addCase(fetchUserNotifications.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchUserNotifications.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.notifications = action.payload
      })
      .addCase(fetchUserNotifications.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })

      // Mark one as read
      .addCase(markNotificationAsRead.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.notifications = state.notifications.map((notification) =>
          notification._id === action.payload
            ? { ...notification, isRead: true }
            : notification
        )
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })

      // Mark all as read
      .addCase(markAllNotificationsAsRead.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(markAllNotificationsAsRead.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.notifications = action.payload
      })
      .addCase(markAllNotificationsAsRead.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  },
})

export const { addNotification, clearError } = notificationSlice.actions
export default notificationSlice.reducer
