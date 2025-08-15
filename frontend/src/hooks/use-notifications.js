"use client"

import { useEffect, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchUserNotifications, addNotification, clearError } from "@/store/notificationSlice"
import socket from "@/utils/socket"

export function useNotifications(userId) {
  const dispatch = useDispatch()
  const { notifications, status, error, unreadCount } = useSelector((state) => state.notifications)

  // Fetch notifications with retry logic
  const fetchNotifications = useCallback(async () => {
    if (!userId) {
      console.warn("No user ID provided for fetching notifications")
      return
    }

    try {
      await dispatch(fetchUserNotifications(userId)).unwrap()
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
      // Optionally retry after a delay
      setTimeout(() => {
        if (userId) {
          dispatch(fetchUserNotifications(userId))
        }
      }, 5000) // Retry after 5 seconds
    }
  }, [dispatch, userId])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  useEffect(() => {
    if (!userId) return

    const handleNewNotification = (notification) => {
      console.log("New notification received:", notification)
      // Only add if it's for the current user
      if (notification.user === userId) {
        dispatch(addNotification(notification))

        // Show browser notification if permission granted
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("New Notification", {
            body: notification.message,
            icon: "/favicon.ico",
            tag: notification._id, 
          })
        }
      }
    }

    const handleSocketError = (error) => {
      console.error("Socket error:", error)
    }

    const handleSocketConnect = () => {
      console.log("Socket connected")
    }

    const handleSocketDisconnect = () => {
      console.log("Socket disconnected")
    }

    // Socket event listeners
    socket.on("newNotification", handleNewNotification)
    socket.on("connect", handleSocketConnect)
    socket.on("disconnect", handleSocketDisconnect)
    socket.on("error", handleSocketError)

    return () => {
      socket.off("newNotification", handleNewNotification)
      socket.off("connect", handleSocketConnect)
      socket.off("disconnect", handleSocketDisconnect)
      socket.off("error", handleSocketError)
    }
  }, [dispatch, userId])

  // Request notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        console.log("Notification permission:", permission)
      })
    }
  }, [])

  // Clear error after some time
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError())
      }, 10000) // Clear error after 10 seconds

      return () => clearTimeout(timer)
    }
  }, [error, dispatch])

  return {
    notifications,
    status,
    error,
    unreadCount,
    isLoading: status === "loading",
    refetch: fetchNotifications,
  }
}
