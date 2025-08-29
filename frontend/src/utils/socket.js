import io from "socket.io-client"

class SocketManager {
  constructor() {
    this.socket = null
    this.isConnecting = false
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectDelay = 1000
  }

  connect() {
    if (this.socket?.connected || this.isConnecting) {
      return this.socket
    }

    this.isConnecting = true

    try {
      this.socket = io("http://tamadrus-api.onrender.com", {
        transports: ["websocket", "polling"], // Add polling as fallback
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectDelay,
        reconnectionDelayMax: 5000,
        timeout: 10000, // 10 second timeout
        forceNew: false, // Reuse existing connection if available
      })

      // Connection event handlers
      this.socket.on("connect", () => {
        console.log("Socket connected:", this.socket.id)
        this.isConnecting = false
        this.reconnectAttempts = 0
      })

      this.socket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason)
        this.isConnecting = false
      })

      this.socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error)
        this.isConnecting = false
        this.reconnectAttempts++
      })

      this.socket.on("reconnect", (attemptNumber) => {
        console.log("Socket reconnected after", attemptNumber, "attempts")
        this.reconnectAttempts = 0
      })

      this.socket.on("reconnect_error", (error) => {
        console.error("Socket reconnection error:", error)
      })

      this.socket.on("reconnect_failed", () => {
        console.error("Socket reconnection failed after", this.maxReconnectAttempts, "attempts")
      })
    } catch (error) {
      console.error("Failed to create socket connection:", error)
      this.isConnecting = false
    }

    return this.socket
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
    this.isConnecting = false
    this.reconnectAttempts = 0
  }

  getSocket() {
    if (!this.socket || !this.socket.connected) {
      return this.connect()
    }
    return this.socket
  }

  isConnected() {
    return this.socket?.connected || false
  }

  // Force reconnection
  forceReconnect() {
    if (this.socket) {
      this.socket.disconnect()
    }
    setTimeout(() => {
      this.connect()
    }, 1000)
  }
}

// Create singleton instance
const socketManager = new SocketManager()

// Export the socket instance
export default socketManager.getSocket()

// Export the manager for advanced operations
export { socketManager }
