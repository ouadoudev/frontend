// import { useEffect, useRef, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import io from "socket.io-client";
// import { loggedUser } from "@/store/authSlice";
// import {
//   fetchTeacherConversations,
//   setCurrentConversation,
// } from "@/store/conversationSlice";
// import { createMessage, fetchMessages } from "@/store/messageSlice";
// import {
//   MoveHorizontalIcon,
//   PhoneIcon,
//   SearchIcon,
//   SendIcon,
//   VideoIcon,
// } from "lucide-react";
// import { Button } from "../ui/button";
// import { ScrollArea } from "../ui/scroll-area";
// import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
// import { Textarea } from "../ui/textarea";

// // Socket.IO client setup
// const socket = io("https://najihoun-api.onrender.com", {
//   transports: ["websocket"],
//   withCredentials: true,
// });

// const Conversation = () => {
//   const dispatch = useDispatch();
//   const {
//     conversations = [],
//     currentConversation,
//     loading,
//     error,
//   } = useSelector((state) => state.conversations);
//   const messages = useSelector((state) => state.messages.messages);
//   const teacher = useSelector((state) => loggedUser(state));

//   const [newMessage, setNewMessage] = useState("");
//   const teacherId = teacher?.id;
//   const endOfMessagesRef = useRef(null);

//   useEffect(() => {
//     if (teacherId) {
//       dispatch(fetchTeacherConversations(teacherId));
//     }
//   }, [dispatch, teacherId]);

//   useEffect(() => {
//     if (currentConversation) {
//       console.log("Joining conversation:", currentConversation._id);
//       socket.emit("joinConversation", currentConversation._id);

//       const handleNewMessage = (message) => {
//         if (
//           currentConversation &&
//           message.conversationId === currentConversation._id
//         ) {
//           console.log("New message received:", message);
//           dispatch(createMessage(message));
//         }
//       };

//       const handleGetMessages = (messages) => {
//         console.log("Received messages:", messages);
//         dispatch(fetchMessages(currentConversation._id));
//       };

//       const handleUpdateLastMessage = ({ conversationId, lastMessage }) => {
//         if (currentConversation && conversationId === currentConversation._id) {
//           console.log("Update last message:", lastMessage);
//           dispatch(setCurrentConversation({
//             ...currentConversation,
//             lastMessage
//           }));
//         }
//       };

//       socket.on("newMessage", handleNewMessage);
//       socket.on("getMessages", handleGetMessages);
//       socket.on("updateLastMessage", handleUpdateLastMessage);

//       return () => {
//         socket.off("newMessage", handleNewMessage);
//         socket.off("getMessages", handleGetMessages);
//         socket.off("updateLastMessage", handleUpdateLastMessage);
//       };
//     }
//   }, [currentConversation, dispatch]);

//   useEffect(() => {
//     if (currentConversation) {
//       console.log(
//         "Fetching messages for conversation ID:",
//         currentConversation._id
//       );
//       dispatch(fetchMessages(currentConversation._id));
//     } else {
//       console.error("No conversation selected for fetching messages");
//     }
//   }, [currentConversation, dispatch]);

//   useEffect(() => {
//     // Scroll to the bottom whenever messages change
//     if (endOfMessagesRef.current) {
//       endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [messages]);

//   const handleConversationClick = (conversation) => {
//     console.log("Conversation clicked:", conversation);
//     dispatch(setCurrentConversation(conversation));
//   };

//   const handleSendMessage = (message) => {
//     if (newMessage.trim()) {
//       if (currentConversation?._id) {
//         console.log("Sending message:", {
//           conversationId: currentConversation._id,
//           content: newMessage,
//         });
//         // Emit the message through the socket
//         socket.emit("sendMessage", {
//           conversationId: currentConversation._id,
//           senderId: teacherId,
//           content: newMessage,
//           mediaFiles: [], // Attach media files if available
//         });
//         dispatch(fetchMessages(currentConversation._id));
//         setNewMessage("");
//       } else {
//         console.error("Conversation ID is missing");
//       }
//     } else {
//       console.error("No message content");
//     }
//   };

//   if (loading) return <p>Loading conversations...</p>;
//   if (error) return <p>Error loading conversations: {error.message}</p>;

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] h-[70%] w-full">
//       <div className="bg-background border-r flex flex-col">
//         <div className="border-b p-4 flex items-center justify-between">
//           <h3 className="text-lg font-semibold">Messages</h3>
//           <Button variant="ghost" size="icon">
//             <SearchIcon className="w-5 h-5" />
//           </Button>
//         </div>
//         <ScrollArea className="flex-1 max-h-screen overflow-hidden">
//           <div className="p-4 space-y-4">
//             {conversations.map((conversation) => (
//               <div
//                 key={conversation._id}
//                 className="flex items-center cursor-pointer hover:bg-muted p-2 rounded"
//                 onClick={() => handleConversationClick(conversation)}
//               >
//                 <Avatar>
//                   <AvatarImage
//                     src={
//                       conversation.participants?.[0]?.user_image?.url ||
//                       "/placeholder-user.jpg"
//                     }
//                   />
//                   <AvatarFallback>
//                     {conversation.participants?.[0]?.username?.[0] || "?"}
//                   </AvatarFallback>
//                 </Avatar>
//                 <div className="flex-1 truncate ml-2">
//                   <div className="font-medium">{conversation.groupTitle}</div>
//                   <div className="text-sm text-muted-foreground truncate">
//                     {conversation.lastMessage || "No messages yet"}
//                   </div>
//                 </div>
//                 <div className="text-xs text-muted-foreground">
//                   {new Date(conversation.updatedAt).toLocaleTimeString()}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </ScrollArea>
//       </div>
//       <div className="flex flex-col">
//         {currentConversation ? (
//           <>
//             <div className="border-b p-4 flex items-center justify-between">
//               <h3 className="text-lg font-semibold">
//                 {currentConversation.groupTitle}
//               </h3>
//               <div className="flex items-center gap-2">
//                 <Button variant="ghost" size="icon">
//                   <PhoneIcon className="w-5 h-5" />
//                 </Button>
//                 <Button variant="ghost" size="icon">
//                   <VideoIcon className="w-5 h-5" />
//                 </Button>
//                 <Button variant="ghost" size="icon">
//                   <MoveHorizontalIcon className="w-5 h-5" />
//                 </Button>
//               </div>
//             </div>
//             <ScrollArea className="flex-1 max-h-[360px] overflow-hidden p-4 space-y-4">
//               {messages &&
//                 messages.map((message) => (
//                   <div
//                     key={message._id}
//                     className={`flex items-start gap-4 ${
//                       message.senderId._id === teacherId
//                         ? "justify-end"
//                         : "justify-start"
//                     }`}
//                   >
//                     {message.senderId._id !== teacherId && (
//                       <Avatar className="flex-shrink-0">
//                         <AvatarImage
//                           src={
//                             message.senderId.user_image?.url ||
//                             "/placeholder-user.jpg"
//                           }
//                         />
//                         <AvatarFallback>
//                           {message.senderId.username[0] || "?"}
//                         </AvatarFallback>
//                       </Avatar>
//                     )}
//                     <div
//                       className={`flex flex-col gap-1 text-sm ${
//                         message.senderId._id === teacherId
//                           ? "items-end"
//                           : "items-start"
//                       }`}
//                     >
//                       <div
//                         className={`font-medium ${
//                           message.senderId._id === teacherId ? "text-right" : ""
//                         }`}
//                       >
//                         {message.senderId._id === teacherId
//                           ? "You"
//                           : message.senderId.username}
//                       </div>
//                       <div
//                         className={`bg-${
//                           message.senderId._id === teacherId
//                             ? "primary text-primary-foreground"
//                             : "muted"
//                         } px-3 py-2 rounded-lg max-w-[75%]`}
//                       >
//                         {message.content}
//                         {message.media?.map((media) => (
//                           <div key={media._id} className="mt-2">
//                             {media.type === "video" ? (
//                               <video
//                                 controls
//                                 className="w-full rounded"
//                               >
//                                 <source
//                                   src={`https://najihoun-api.onrender.com/${media.url}`}
//                                   type="video/mp4"
//                                 />
//                                 Your browser does not support the video tag.
//                               </video>
//                             ) : (
//                               <a
//                                 href={`https://najihoun-api.onrender.com/${media.url}`}
//                                 download
//                                 className="text-blue-500 underline"
//                               >
//                                 Download {media.filename}
//                               </a>
//                             )}
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               <div ref={endOfMessagesRef} />
//             </ScrollArea>
//             <div className="border-t p-4 flex items-center gap-2">
//               <Textarea
//                 rows={2}
//                 value={newMessage}
//                 onChange={(e) => setNewMessage(e.target.value)}
//                 placeholder="Type a message..."
//               />
//               <Button
//                 onClick={() => handleSendMessage(newMessage)}
//                 className="flex-shrink-0"
//                 variant="outline"
//               >
//                 <SendIcon className="w-5 h-5" />
//               </Button>
//             </div>
//           </>
//         ) : (
//           <div className="flex items-center justify-center h-full">
//             <p>Select a conversation to start messaging</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Conversation;

import { useEffect, useRef, useState, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import socket from "@/utils/socket"
import { loggedUser } from "@/store/authSlice"
import moment from "moment"
import { fetchTeacherConversations, setCurrentConversation } from "@/store/conversationSlice"
import { createMessage, fetchMessages } from "@/store/messageSlice"
import { MoveHorizontalIcon, PhoneIcon, SearchIcon, VideoIcon, Send, Upload, ImageIcon, Video, File, X, Check, CheckCheck, Clock, Wifi, WifiOff, AlertCircle, Loader2, RefreshCw } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const Conversation = () => {
  const dispatch = useDispatch()
  const { conversations = [], loading, error } = useSelector((state) => state.conversations)
  const currentConversation = useSelector((state) => state.conversations.currentConversation)
  const messages = useSelector((state) => state.messages.messages)
  const messagesLoading = useSelector((state) => state.messages.loading)
  const teacher = useSelector((state) => loggedUser(state))

  // State
  const [newMessage, setNewMessage] = useState("")
  const [onlineUsers, setOnlineUsers] = useState({})
  const [typingUsers, setTypingUsers] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [connectionError, setConnectionError] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false) // Add this state
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)

  // Refs
  const teacherId = teacher?.id
  const endOfMessagesRef = useRef(null)
  const fileInputRef = useRef(null)
  const messageInputRef = useRef(null)
  const typingTimeoutRef = useRef(null)
  const connectionCheckInterval = useRef(null) // Add this ref

  // Check connection status periodically
  useEffect(() => {
    const checkConnection = () => {
      const connected = socket.connected
      setIsConnected(connected)

      if (!connected && !isConnecting) {
        setConnectionError("Connection lost. Attempting to reconnect...")
      } else if (connected && connectionError) {
        setConnectionError(null)
      }
    }

    // Initial check
    checkConnection()

    // Check every 2 seconds
    connectionCheckInterval.current = setInterval(checkConnection, 2000)

    return () => {
      if (connectionCheckInterval.current) {
        clearInterval(connectionCheckInterval.current)
      }
    }
  }, [isConnecting, connectionError])

  // Force reconnect function
  const handleForceReconnect = useCallback(() => {
    setIsConnecting(true)
    setConnectionError("Reconnecting...")
    
    // Disconnect and reconnect
    if (socket.connected) {
      socket.disconnect()
    }
    
    setTimeout(() => {
      socket.connect()
      setIsConnecting(false)
    }, 1000)
  }, [])

  // Initialize and fetch conversations
  useEffect(() => {
    if (teacherId) {
      dispatch(fetchTeacherConversations(teacherId))
      socket.emit("join", teacherId)
    }

    // Socket connection handlers
    const handleConnect = () => {
      setIsConnected(true)
      setIsConnecting(false)
      setConnectionError(null)
    }

    const handleDisconnect = () => {
      setIsConnected(false)
      setIsConnecting(false)
      setConnectionError("Connection lost. Trying to reconnect...")
    }

    const handleConnectError = () => {
      setIsConnected(false)
      setIsConnecting(false)
      setConnectionError("Failed to connect to server")
    }

    socket.on("connect", handleConnect)
    socket.on("disconnect", handleDisconnect)
    socket.on("connect_error", handleConnectError)

    return () => {
      socket.off("connect", handleConnect)
      socket.off("disconnect", handleDisconnect)
      socket.off("connect_error", handleConnectError)
      socket.off("updateOnlineStatus")
    }
  }, [dispatch, teacherId])

  // Handle current conversation changes
  useEffect(() => {
    if (currentConversation) {
      console.log("Joining conversation:", currentConversation._id)
      socket.emit("joinConversation", currentConversation._id)
      dispatch(fetchMessages(currentConversation._id))

      const handleNewMessage = (message) => {
        if (currentConversation && message.conversationId === currentConversation._id) {
          console.log("New message received:", message)
          dispatch(createMessage(message))
        }
      }

      const handleGetMessages = (messages) => {
        console.log("Received messages:", messages)
        dispatch(fetchMessages(currentConversation._id))
      }

      const handleUpdateLastMessage = ({ conversationId, lastMessage, lastMessageId }) => {
        if (currentConversation && conversationId === currentConversation._id) {
          console.log("Update last message:", lastMessage)
          dispatch(
            setCurrentConversation({
              ...currentConversation,
              lastMessage,
              lastMessageId,
            }),
          )
        }
      }

      const handleTyping = ({ userId, username }) => {
        if (userId !== teacherId) {
          setTypingUsers((prev) => {
            if (!prev.includes(username)) {
              return [...prev, username]
            }
            return prev
          })
        }
      }

      const handleStopTyping = ({ userId, username }) => {
        setTypingUsers((prev) => prev.filter((user) => user !== username))
      }

      socket.on("newMessage", handleNewMessage)
      socket.on("getMessages", handleGetMessages)
      socket.on("updateLastMessage", handleUpdateLastMessage)
      socket.on("userTyping", handleTyping)
      socket.on("userStoppedTyping", handleStopTyping)

      return () => {
        socket.off("newMessage", handleNewMessage)
        socket.off("getMessages", handleGetMessages)
        socket.off("updateLastMessage", handleUpdateLastMessage)
        socket.off("userTyping", handleTyping)
        socket.off("userStoppedTyping", handleStopTyping)
        socket.emit("leaveConversation", currentConversation._id)
      }
    }
  }, [currentConversation, dispatch, teacherId])

  // Auto-scroll to bottom
  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Handle online status updates
  useEffect(() => {
    const handleUpdateOnlineStatus = (onlineUsers) => {
      console.log("Online users updated:", onlineUsers)
      setOnlineUsers(onlineUsers)
    }

    socket.on("updateOnlineStatus", (data) => {
      console.log("Received updateOnlineStatus event:", data)
      handleUpdateOnlineStatus(data)
    })

    return () => {
      socket.off("updateOnlineStatus")
    }
  }, [])

  // Typing indicator logic
  const handleTyping = useCallback(() => {
    if (currentConversation && !isTyping) {
      setIsTyping(true)
      socket.emit("typing", {
        conversationId: currentConversation._id,
        userId: teacherId,
        username: teacher?.username,
      })
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
      socket.emit("stopTyping", {
        conversationId: currentConversation._id,
        userId: teacherId,
        username: teacher?.username,
      })
    }, 2000)
  }, [currentConversation, teacherId, teacher?.username, isTyping])

  // Handle conversation selection
  const handleConversationClick = (conversation) => {
    console.log("Conversation clicked:", conversation)
    dispatch(setCurrentConversation(conversation))
    setSearchQuery("")
    setShowSearch(false)
  }

  // Handle file selection
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files || [])
    const validFiles = files.filter((file) => {
      const isValidType =
        file.type.startsWith("image/") || file.type.startsWith("video/") || file.type === "application/pdf"
      const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB limit
      return isValidType && isValidSize
    })

    if (validFiles.length !== files.length) {
      setConnectionError("Some files were rejected. Only images, videos, and PDFs under 10MB are allowed.")
      setTimeout(() => setConnectionError(null), 5000)
    }

    setSelectedFiles((prev) => [...prev, ...validFiles])
  }

  // Remove selected file
  const removeSelectedFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  // Send message
  const handleSendMessage = useCallback(async () => {
    if (!newMessage.trim() && selectedFiles.length === 0) return

    if (!currentConversation?._id) {
      setConnectionError("No conversation selected")
      return
    }

    if (!isConnected) {
      setConnectionError("Not connected to server. Please wait for reconnection.")
      return
    }

    try {
      setIsUploading(selectedFiles.length > 0)

      // Simulate upload progress for files
      if (selectedFiles.length > 0) {
        for (let i = 0; i <= 100; i += 10) {
          setUploadProgress(i)
          await new Promise((resolve) => setTimeout(resolve, 50))
        }
      }

      const messageData = {
        conversationId: currentConversation._id,
        senderId: teacherId,
        content: newMessage.trim(),
        mediaFiles: selectedFiles,
      }

      console.log("Sending message:", messageData)
      socket.emit("sendMessage", messageData)

      setNewMessage("")
      setSelectedFiles([])
      setUploadProgress(0)
      setIsUploading(false)
      setConnectionError(null)

      // Focus back to input
      messageInputRef.current?.focus()
    } catch (error) {
      setConnectionError("Failed to send message. Please try again.")
      setIsUploading(false)
      console.error("Error sending message:", error)
    }
  }, [newMessage, selectedFiles, currentConversation, teacherId, isConnected])

  // Handle keyboard shortcuts
  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      handleSendMessage()
    }
  }

  // Handle message input change
  const handleMessageChange = (e) => {
    setNewMessage(e.target.value)
    handleTyping()
  }

  // Filter conversations based on search
  const filteredConversations = conversations.filter((conversation) =>
    conversation.participants?.[0]?.username?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Get message status icon
  const getMessageStatusIcon = (status) => {
    switch (status) {
      case "sending":
        return <Clock className="w-3 h-3 text-gray-400" />
      case "sent":
        return <Check className="w-3 h-3 text-gray-400" />
      case "delivered":
        return <CheckCheck className="w-3 h-3 text-gray-400" />
      case "read":
        return <CheckCheck className="w-3 h-3 text-blue-500" />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading conversations...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Error loading conversations: {error.message}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr]  min-h-screen p-8 w-full">
        {/* Conversations List */}
        <div className="bg-background border-r flex flex-col ">
          <div className="border-b p-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Messages</h3>
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1">
                    {isConnecting ? (
                      <Loader2 className="w-5 h-5 text-yellow-500 animate-spin" />
                    ) : isConnected ? (
                      <Wifi className="w-5 h-5 text-green-500" />
                    ) : (
                      <WifiOff className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {isConnecting ? "Connecting..." : isConnected ? "Connected" : "Disconnected"}
                </TooltipContent>
              </Tooltip>

              {!isConnected && !isConnecting && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={handleForceReconnect}>
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Reconnect</TooltipContent>
                </Tooltip>
              )}

              <Button variant="ghost" size="icon" onClick={() => setShowSearch(!showSearch)}>
                <SearchIcon className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Search Input */}
          {showSearch && (
            <div className="p-4 border-b">
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
          )}

          <ScrollArea className="flex-1 max-h-screen overflow-hidden">
            <div className="p-4 space-y-2">
              {filteredConversations.map((conversation) => {
                const participant = conversation.participants?.[0]
                const isOnline = onlineUsers[participant?._id]
                const isActive = currentConversation?._id === conversation._id

                return (
                  <div
                    key={conversation._id}
                    className={`flex items-center cursor-pointer hover:bg-muted p-3 rounded-lg transition-colors ${
                      isActive ? "bg-muted" : ""
                    }`}
                    onClick={() => handleConversationClick(conversation)}
                  >
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={participant?.user_image?.url || "/placeholder-user.jpg"}
                          alt={participant?.username || "User"}
                        />
                        <AvatarFallback>{participant?.username?.[0]?.toUpperCase() || "?"}</AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                          isOnline ? "bg-green-500" : "bg-gray-400"
                        }`}
                      />
                    </div>

                    <div className="flex-1 min-w-0 ml-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm truncate">{participant?.username || "Unknown User"}</h4>
                        <span className="text-xs text-muted-foreground">
                          {moment(conversation.updatedAt).format("HH:mm")}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.lastMessage || "No messages yet"}
                      </p>
                    </div>
                  </div>
                )
              })}

              {filteredConversations.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  {searchQuery ? "No conversations found" : "No conversations yet"}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Messages Area */}
        <div className="flex flex-col">
          {currentConversation ? (
            <>
              {/* Connection Error Alert */}
              {connectionError && (
                <Alert className="m-4 border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-red-800 flex items-center justify-between">
                    <span>{connectionError}</span>
                    <div className="flex items-center gap-2">
                      {!isConnected && !isConnecting && (
                        <Button variant="ghost" size="sm" onClick={handleForceReconnect} className="text-red-800">
                          <RefreshCw className="w-4 h-4 mr-1" />
                          Retry
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 text-red-800"
                        onClick={() => setConnectionError(null)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* Header */}
              <div className="border-b p-4 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={
                          currentConversation.participants?.[0]?.user_image?.url ||
                          "/placeholder-user.jpg" ||
                          "/placeholder.svg"
                         || "/placeholder.svg"}
                        alt={currentConversation.participants?.[0]?.username || "User"}
                      />
                      <AvatarFallback>
                        {currentConversation.participants?.[0]?.username?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                        onlineUsers[currentConversation.participants?.[0]?._id] ? "bg-green-500" : "bg-gray-400"
                      }`}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {currentConversation.participants?.[0]?.username || "Unknown User"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {onlineUsers[currentConversation.participants?.[0]?._id] ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" disabled={!isConnected}>
                        <PhoneIcon className="w-5 h-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Voice call</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" disabled={!isConnected}>
                        <VideoIcon className="w-5 h-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Video call</TooltipContent>
                  </Tooltip>
                  <Button variant="ghost" size="icon">
                    <MoveHorizontalIcon className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4 bg-gray-50">
                {messagesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="ml-2">Loading messages...</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages?.map((message) => (
                      <div
                        key={message._id}
                        className={`flex items-end gap-2 ${
                          message.senderId._id === teacherId ? "justify-end" : "justify-start"
                        }`}
                      >
                        {message.senderId._id !== teacherId && (
                          <Avatar className="h-8 w-8 mb-1">
                            <AvatarImage
                              src={
                                currentConversation.participants?.find((p) => p._id === message.senderId._id)
                                  ?.user_image?.url || "/placeholder-user.jpg"
                              }
                              alt="Avatar"
                            />
                            <AvatarFallback>
                              {currentConversation.participants
                                ?.find((p) => p._id === message.senderId._id)
                                ?.username?.[0]?.toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                        )}

                        <div
                          className={`max-w-[70%] rounded-2xl px-4 py-2 shadow-sm ${
                            message.senderId._id === teacherId
                              ? "bg-blue-500 text-white rounded-br-md"
                              : "bg-white text-gray-900 rounded-bl-md border"
                          }`}
                        >
                          {message.content && <p className="text-sm leading-relaxed">{message.content}</p>}

                          {/* Media attachments */}
                          {message.media?.map((media) => (
                            <div key={media._id} className="mt-2">
                              {media.type === "image" ? (
                                <img
                                  src={`https://najihoun-api.onrender.com/${media.url}`}
                                  alt="Shared image"
                                  className="max-w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                  onClick={() => window.open(`https://najihoun-api.onrender.com/${media.url}`, "_blank")}
                                />
                              ) : media.type === "video" ? (
                                <video controls className="max-w-full h-auto rounded-lg" preload="metadata">
                                  <source src={`https://najihoun-api.onrender.com/${media.url}`} type="video/mp4" />
                                  Your browser does not support the video tag.
                                </video>
                              ) : (
                                <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg">
                                  <File className="w-4 h-4" />
                                  <span className="text-sm">{media.name || "File"}</span>
                                </div>
                              )}
                            </div>
                          ))}

                          <div
                            className={`flex items-center justify-between mt-1 text-xs ${
                              message.senderId._id === teacherId ? "text-blue-100" : "text-gray-500"
                            }`}
                          >
                            <span>{moment(message.timestamp).format("HH:mm")}</span>
                            {message.senderId._id === teacherId && (
                              <div className="ml-2">{getMessageStatusIcon(message.status)}</div>
                            )}
                          </div>
                        </div>

                        {message.senderId._id === teacherId && (
                          <Avatar className="h-8 w-8 mb-1">
                            <AvatarImage src={message.senderId?.user_image?.url || "/placeholder-user.jpg"} alt="You" />
                            <AvatarFallback>{message.senderId?.username?.[0]?.toUpperCase() || "Y"}</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))}

                    {/* Typing indicator */}
                    {typingUsers.length > 0 && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          />
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          />
                        </div>
                        <span>
                          {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing...
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <div ref={endOfMessagesRef} />
              </ScrollArea>

              {/* Selected Files Preview */}
              {selectedFiles.length > 0 && (
                <div className="border-t p-3 bg-gray-50">
                  <div className="flex flex-wrap gap-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="relative">
                        <Badge variant="secondary" className="pr-6">
                          {file.type.startsWith("image/") && <ImageIcon className="w-3 h-3 mr-1" />}
                          {file.type.startsWith("video/") && <Video className="w-3 h-3 mr-1" />}
                          {!file.type.startsWith("image/") && !file.type.startsWith("video/") && (
                            <File className="w-3 h-3 mr-1" />
                          )}
                          {file.name}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute -top-1 -right-1 h-4 w-4 p-0 rounded-full bg-red-500 hover:bg-red-600 text-white"
                          onClick={() => removeSelectedFile(index)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Progress */}
              {isUploading && (
                <div className="border-t p-3 bg-gray-50">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Uploading...</span>
                    <Progress value={uploadProgress} className="flex-1" />
                    <span className="text-sm text-gray-600">{uploadProgress}%</span>
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="border-t p-4 bg-white">
                <div className="flex items-end gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading || !isConnected}
                      >
                        <Upload className="w-5 h-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Upload file</TooltipContent>
                  </Tooltip>

                  <div className="flex-1">
                    <Input
                      ref={messageInputRef}
                      type="text"
                      placeholder={isConnected ? "Type a message..." : "Connecting..."}
                      value={newMessage}
                      onChange={handleMessageChange}
                      onKeyPress={handleKeyPress}
                      disabled={!isConnected || isUploading}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <Button
                    onClick={handleSendMessage}
                    disabled={(!newMessage.trim() && selectedFiles.length === 0) || !isConnected || isUploading}
                    className="bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
                  >
                    {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </Button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*,.pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Welcome to Messages</h3>
                <p>Select a conversation to start chatting</p>
                {!isConnected && (
                  <div className="mt-4">
                    <Button onClick={handleForceReconnect} variant="outline" className="gap-2 bg-transparent">
                      <RefreshCw className="w-4 h-4" />
                      Connect to Server
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}

export default Conversation

