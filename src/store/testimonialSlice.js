// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
// import axios from "axios"
// import { loggedUser } from "./authSlice"

// // Helper pour l'en-tête d'auth
// const getAuthHeader = (token) => ({
//   headers: {
//     Authorization: `Bearer ${token}`,
//     "Content-Type": "application/json",
//   },
// })

// // Async thunks

// export const fetchTestimonials = createAsyncThunk(
//   "testimonials/fetchAll",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`/testimonials`)
//       return response.data 
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || error.message)
//     }
//   }
// )

// export const createTestimonial = createAsyncThunk(
//   "testimonials/create",
//   async (data, { getState, rejectWithValue }) => {
//     try {
//       const state = getState()
//       const user = loggedUser(state)

//       if (!user || !user.id || !user.token) {
//         throw new Error("User not authenticated")
//       }

//       const response = await axios.post(`/testimonials`, data, getAuthHeader(user.token))
//       return response.data // { testimonial: {...} }
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || error.message)
//     }
//   }
// )

// export const approveTestimonial = createAsyncThunk(
//   "testimonials/approve",
//   async (id, { getState, rejectWithValue }) => {
//     try {
//       const state = getState()
//       const user = loggedUser(state)

//       if (!user || !user.id || !user.token) {
//         throw new Error("User not authenticated")
//       }

//       await axios.patch(`/testimonials/${id}/approve`, {}, getAuthHeader(user.token))
//       return id
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || error.message)
//     }
//   }
// )

// export const toggleVisibility = createAsyncThunk(
//   "testimonials/toggleVisibility",
//   async (id, { getState, rejectWithValue }) => {
//     try {
//       const state = getState()
//       const user = loggedUser(state)

//       if (!user || !user.id || !user.token) {
//         throw new Error("User not authenticated")
//       }

//       await axios.patch(`/testimonials/${id}/visibility`, {}, getAuthHeader(user.token))
//       return id
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || error.message)
//     }
//   }
// )

// export const deleteTestimonial = createAsyncThunk(
//   "testimonials/delete",
//   async (id, { getState, rejectWithValue }) => {
//     try {
//       const state = getState()
//       const user = loggedUser(state)

//       if (!user || !user.id || !user.token) {
//         throw new Error("User not authenticated")
//       }

//       await axios.delete(`/testimonials/${id}`, getAuthHeader(user.token))
//       return id
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || error.message)
//     }
//   }
// )
// export const updateTestimonial = createAsyncThunk(
//   "testimonials/update",
//   async ({ id, data }, { getState, rejectWithValue }) => {
//     try {
//       const user = loggedUser(getState())
//       if (!user || !user.token) throw new Error("User not authenticated")

//       const response = await axios.put(`/testimonials/${id}`, data, getAuthHeader(user.token))
//       return response.data.testimonial
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || error.message)
//     }
//   }
// )

// export const updateUserTime = createAsyncThunk(
//   "testimonials/updateTime",
//   async (timeSpent, { getState, rejectWithValue }) => {
//     try {
//       const user = loggedUser(getState())
//       if (!user || !user.token) throw new Error("User not authenticated")
//         if (user.role === "admin") return

//       const response = await axios.post(`/testimonials/update-time`, { timeSpent }, getAuthHeader(user.token))
//       return response.data
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || error.message)
//     }
//   }
// )

// export const checkEligibility = createAsyncThunk(
//   "testimonials/checkEligibility",
//   async (_, { getState, rejectWithValue }) => {
//     try {
//       const user = loggedUser(getState())
//       if (!user || !user.token) throw new Error("User not authenticated")

//       const response = await axios.get(`/testimonials/check-eligibility`, getAuthHeader(user.token))
//       return response.data
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || error.message)
//     }
//   }
// )


// // Initial state
// const initialState = {
//   testimonials: [],
//   userTestimonial: null,
//   userTime: null,
//   eligibility: null,
//   status: "idle",
//   error: null,
// }


// // Slice
// const testimonialSlice = createSlice({
//   name: "testimonials",
//   initialState,
//   reducers: {
//     clearError: (state) => {
//       state.error = null
//     },
//     updateTimeSpent: (state, action) => {
//       state.userTime = (state.userTime || 0) + action.payload
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Fetch testimonials
//       .addCase(fetchTestimonials.pending, (state) => {
//         state.status = "loading"
//       })
//       .addCase(fetchTestimonials.fulfilled, (state, action) => {
//         state.status = "succeeded"
//         state.testimonials = action.payload.testimonials
//       })
//       .addCase(fetchTestimonials.rejected, (state, action) => {
//         state.status = "failed"
//         state.error = action.payload
//       })

//       // Create
//       .addCase(createTestimonial.pending, (state) => {
//         state.status = "loading"
//       })
//       .addCase(createTestimonial.fulfilled, (state, action) => {
//         state.status = "succeeded"
//         state.testimonials.unshift(action.payload.testimonial)
//       })
//       .addCase(createTestimonial.rejected, (state, action) => {
//         state.status = "failed"
//         state.error = action.payload
//       })

//       // Approve
//       .addCase(approveTestimonial.pending, (state) => {
//         state.status = "loading"
//       })
//       .addCase(approveTestimonial.fulfilled, (state, action) => {
//         state.status = "succeeded"
//         const testimonial = state.testimonials.find((t) => t._id === action.payload)
//         if (testimonial) {
//           testimonial.isApproved = true
//           testimonial.isVisible = true
//         }
//       })
//       .addCase(approveTestimonial.rejected, (state, action) => {
//         state.status = "failed"
//         state.error = action.payload
//       })

//       // Toggle visibility
//       .addCase(toggleVisibility.pending, (state) => {
//         state.status = "loading"
//       })
//       .addCase(toggleVisibility.fulfilled, (state, action) => {
//         state.status = "succeeded"
//         const testimonial = state.testimonials.find((t) => t._id === action.payload)
//         if (testimonial) {
//           testimonial.isVisible = !testimonial.isVisible
//         }
//       })
//       .addCase(toggleVisibility.rejected, (state, action) => {
//         state.status = "failed"
//         state.error = action.payload
//       })

//       // Delete
//       .addCase(deleteTestimonial.pending, (state) => {
//         state.status = "loading"
//       })
//       .addCase(deleteTestimonial.fulfilled, (state, action) => {
//         state.status = "succeeded"
//         state.testimonials = state.testimonials.filter((t) => t._id !== action.payload)
//       })
//       .addCase(deleteTestimonial.rejected, (state, action) => {
//         state.status = "failed"
//         state.error = action.payload
//       })
//   },
// })

// export const { clearError,updateTimeSpent } = testimonialSlice.actions
// export default testimonialSlice.reducer


import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import { loggedUser } from "./authSlice"

// Helper for auth header
const getAuthHeader = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
})

// Async thunks
export const fetchTestimonials = createAsyncThunk(
  "testimonials/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/testimonials`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

export const fetchUserTestimonial = createAsyncThunk(
  "testimonials/fetchUserTestimonial",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState()
      const user = loggedUser(state)

      if (!user || !user.id || !user.token) {
        throw new Error("User not authenticated")
      }

      const response = await axios.get(`/testimonials/my-testimonial`, getAuthHeader(user.token))
      return response.data.testimonial || null
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

export const createTestimonial = createAsyncThunk(
  "testimonials/create",
  async ({ rating, testimonial }, { getState, rejectWithValue }) => {
    try {
      const state = getState()
      const user = loggedUser(state)

      if (!user || !user.id || !user.token) {
        throw new Error("User not authenticated")
      }

      const response = await axios.post(
        `/testimonials`,
        { rating, testimonial },
        getAuthHeader(user.token))
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

export const updateTestimonial = createAsyncThunk(
  "testimonials/update",
  async ({ id, rating, testimonial }, { getState, rejectWithValue }) => {
    try {
      const state = getState()
      const user = loggedUser(state)

      if (!user || !user.id || !user.token) {
        throw new Error("User not authenticated")
      }

      const response = await axios.put(
        `/testimonials/${id}`,
        { rating, testimonial },
        getAuthHeader(user.token))
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

export const deleteTestimonial = createAsyncThunk(
  "testimonials/delete",
  async (id, { getState, rejectWithValue }) => {
    try {
      const state = getState()
      const user = loggedUser(state)

      if (!user || !user.id || !user.token) {
        throw new Error("User not authenticated")
      }

      await axios.delete(`/testimonials/${id}`, getAuthHeader(user.token))
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

export const approveTestimonial = createAsyncThunk(
  "testimonials/approve",
  async (id, { getState, rejectWithValue }) => {
    try {
      const state = getState()
      const user = loggedUser(state)

      if (!user || !user.id || !user.token) {
        throw new Error("User not authenticated")
      }

      const response = await axios.patch(
        `/testimonials/${id}/approve`,
        {},
        getAuthHeader(user.token)
      )
      return response.data.testimonial
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

export const toggleVisibility = createAsyncThunk(
  "testimonials/toggleVisibility",
  async (id, { getState, rejectWithValue }) => {
    try {
      const state = getState()
      const user = loggedUser(state)

      if (!user || !user.id || !user.token) {
        throw new Error("User not authenticated")
      }

      const response = await axios.patch(
        `/testimonials/${id}/visibility`,
        {},
        getAuthHeader(user.token)
      )
      return response.data.testimonial
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

export const updateUserTime = createAsyncThunk(
  "testimonials/updateTime",
  async (timeSpent, { getState, rejectWithValue }) => {
    try {
      const state = getState()
      const user = loggedUser(state)

      if (!user || !user.token) throw new Error("User not authenticated")
      if (user.role === "admin") return

      const response = await axios.post(
        `/testimonials/update-time`,
        { timeSpent },
        getAuthHeader(user.token)
      )
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

export const checkEligibility = createAsyncThunk(
  "testimonials/checkEligibility",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState()
      const user = loggedUser(state)

      if (!user || !user.token) throw new Error("User not authenticated")

      const response = await axios.get(
        `/testimonials/check-eligibility`,
        getAuthHeader(user.token)
      )
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

// Initial state
const initialState = {
  testimonials: [],
  stats: {
    average: 0,
    count: 0
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  },
  userTestimonial: null,
  userTime: null,
  eligibility: {
    canGiveTestimonial: false,
    hasGivenTestimonial: false,
    totalTimeSpent: 0,
    timeRemaining: 300
  },
  status: "idle",
  error: null,
  operationStatus: "idle", // For individual operations
}

// Slice
const testimonialSlice = createSlice({
  name: "testimonials",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    resetOperationStatus: (state) => {
      state.operationStatus = "idle"
    },
    updateTimeSpent: (state, action) => {
      state.userTime = (state.userTime || 0) + action.payload
      state.eligibility.timeRemaining = Math.max(0, 300 - (state.userTime || 0))
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch testimonials
      .addCase(fetchTestimonials.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchTestimonials.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.testimonials = action.payload.testimonials
        state.stats = action.payload.stats || initialState.stats
        state.pagination = action.payload.pagination || initialState.pagination
      })
      .addCase(fetchTestimonials.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })

      // Fetch user testimonial
      .addCase(fetchUserTestimonial.pending, (state) => {
        state.operationStatus = "loading"
      })
      .addCase(fetchUserTestimonial.fulfilled, (state, action) => {
        state.operationStatus = "succeeded"
        state.userTestimonial = action.payload
      })
      .addCase(fetchUserTestimonial.rejected, (state, action) => {
        state.operationStatus = "failed"
        state.error = action.payload
      })

      // Create testimonial
      .addCase(createTestimonial.pending, (state) => {
        state.operationStatus = "loading"
      })
      .addCase(createTestimonial.fulfilled, (state, action) => {
        state.operationStatus = "succeeded"
        state.testimonials.unshift(action.payload.testimonial)
        state.userTestimonial = action.payload.testimonial
        state.eligibility.hasGivenTestimonial = true
        state.eligibility.canGiveTestimonial = false
      })
      .addCase(createTestimonial.rejected, (state, action) => {
        state.operationStatus = "failed"
        state.error = action.payload
      })

      // Update testimonial
      .addCase(updateTestimonial.pending, (state) => {
        state.operationStatus = "loading"
      })
      .addCase(updateTestimonial.fulfilled, (state, action) => {
        state.operationStatus = "succeeded"
        const index = state.testimonials.findIndex(
          t => t._id === action.payload.testimonial._id
        )
        if (index !== -1) {
          state.testimonials[index] = action.payload.testimonial
        }
        state.userTestimonial = action.payload.testimonial
      })
      .addCase(updateTestimonial.rejected, (state, action) => {
        state.operationStatus = "failed"
        state.error = action.payload
      })

      // Delete testimonial
      .addCase(deleteTestimonial.pending, (state) => {
        state.operationStatus = "loading"
      })
      .addCase(deleteTestimonial.fulfilled, (state, action) => {
        state.operationStatus = "succeeded"
        state.testimonials = state.testimonials.filter(t => t._id !== action.payload)
        state.userTestimonial = null
        state.eligibility.hasGivenTestimonial = false
        state.eligibility.canGiveTestimonial = 
          state.eligibility.totalTimeSpent >= 300
      })
      .addCase(deleteTestimonial.rejected, (state, action) => {
        state.operationStatus = "failed"
        state.error = action.payload
      })

      // Approve testimonial
      .addCase(approveTestimonial.pending, (state) => {
        state.operationStatus = "loading"
      })
      .addCase(approveTestimonial.fulfilled, (state, action) => {
        state.operationStatus = "succeeded"
        const index = state.testimonials.findIndex(
          t => t._id === action.payload._id
        )
        if (index !== -1) {
          state.testimonials[index] = action.payload
        }
        // Update stats
        if (action.payload.isApproved && action.payload.isVisible) {
          const approvedVisible = state.testimonials.filter(
            t => t.isApproved && t.isVisible
          )
          const totalRating = approvedVisible.reduce((sum, t) => sum + t.rating, 0)
          state.stats = {
            average: approvedVisible.length > 0 
              ? Math.round((totalRating / approvedVisible.length) * 10) / 10 
              : 0,
            count: approvedVisible.length
          }
        }
      })
      .addCase(approveTestimonial.rejected, (state, action) => {
        state.operationStatus = "failed"
        state.error = action.payload
      })

      // Toggle visibility
      .addCase(toggleVisibility.pending, (state) => {
        state.operationStatus = "loading"
      })
      .addCase(toggleVisibility.fulfilled, (state, action) => {
        state.operationStatus = "succeeded"
        const index = state.testimonials.findIndex(
          t => t._id === action.payload._id
        )
        if (index !== -1) {
          state.testimonials[index] = action.payload
        }
        // Update stats
        const approvedVisible = state.testimonials.filter(
          t => t.isApproved && t.isVisible
        )
        const totalRating = approvedVisible.reduce((sum, t) => sum + t.rating, 0)
        state.stats = {
          average: approvedVisible.length > 0 
            ? Math.round((totalRating / approvedVisible.length) * 10) / 10 
            : 0,
          count: approvedVisible.length
        }
      })
      .addCase(toggleVisibility.rejected, (state, action) => {
        state.operationStatus = "failed"
        state.error = action.payload
      })

      // Update user time
      .addCase(updateUserTime.pending, (state) => {
        state.operationStatus = "loading"
      })
      .addCase(updateUserTime.fulfilled, (state, action) => {
        state.operationStatus = "succeeded"
        if (action.payload) {
          state.userTime = action.payload.totalTimeSpent
          state.eligibility = {
            ...state.eligibility,
            totalTimeSpent: action.payload.totalTimeSpent,
            hasGivenTestimonial: action.payload.hasGivenTestimonial,
            canGiveTestimonial: 
              !action.payload.hasGivenTestimonial && 
              action.payload.totalTimeSpent >= 300,
            timeRemaining: Math.max(0, 300 - action.payload.totalTimeSpent)
          }
        }
      })
      .addCase(updateUserTime.rejected, (state, action) => {
        state.operationStatus = "failed"
        state.error = action.payload
      })

      // Check eligibility
      .addCase(checkEligibility.pending, (state) => {
        state.operationStatus = "loading"
      })
      .addCase(checkEligibility.fulfilled, (state, action) => {
        state.operationStatus = "succeeded"
        state.eligibility = {
          canGiveTestimonial: action.payload.canGiveTestimonial,
          hasGivenTestimonial: action.payload.hasGivenTestimonial,
          totalTimeSpent: action.payload.totalTimeSpent,
          timeRemaining: action.payload.timeRemaining
        }
        state.userTime = action.payload.totalTimeSpent
      })
      .addCase(checkEligibility.rejected, (state, action) => {
        state.operationStatus = "failed"
        state.error = action.payload
      })
  }
})

export const { clearError, resetOperationStatus, updateTimeSpent } = testimonialSlice.actions
export default testimonialSlice.reducer