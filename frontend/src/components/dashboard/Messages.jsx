// import { useEffect, useRef, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { createMessage, fetchMessages } from "@/store/messageSlice";
// import { Button } from "../ui/button";
// import { RxDividerVertical } from "react-icons/rx";
// import { FiSend } from "react-icons/fi";
// import { GrUploadOption } from "react-icons/gr";
// import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
// import { ScrollArea } from "../ui/scroll-area";
// import moment from "moment";
// import io from "socket.io-client";

// // Create a single socket instance
// const socket = io("http://tamadrus-api.onrender.com", {
//   transports: ["websocket"],
//   withCredentials: true,
// });

// const Messages = ({ currentConversation }) => {
//   const dispatch = useDispatch();
//   const messages = useSelector((state) => state.messages.messages);
//   const teacher = useSelector((state) => state.auth.loggedUser);
//   const teacherId = teacher?.id;
//   const endOfMessagesRef = useRef(null);
//   const [newMessage, setNewMessage] = useState("");

//   useEffect(() => {
//     if (currentConversation) {
//       socket.emit("joinConversation", currentConversation._id);

//       const handleNewMessage = (message) => {
//         if (currentConversation._id === message.conversationId) {
//           dispatch(createMessage(message));
//         }
//       };

//       const handleGetMessages = () => {
//         dispatch(fetchMessages(currentConversation._id));
//       };

//       socket.on("newMessage", handleNewMessage);
//       socket.on("getMessages", handleGetMessages);

//       return () => {
//         socket.off("newMessage", handleNewMessage);
//         socket.off("getMessages", handleGetMessages);
//         socket.emit("leaveConversation", currentConversation._id);
//       };
//     }
//   }, [currentConversation, dispatch]);

//   useEffect(() => {
//     // Scroll to the bottom whenever messages change
//     if (endOfMessagesRef.current) {
//       endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [messages]);

//   const handleSendMessage = () => {
//     if (newMessage.trim()) {
//       if (currentConversation._id) {
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

//   return (
//     <div className="flex flex-col h-full">
//       <div className="border-b p-4 flex items-center justify-between">
//         <h3 className="text-lg font-semibold relative">
//           {currentConversation?.participants?.[0]?.username}
//           <span
//             className={`absolute top-0 left-full ml-1 w-3 h-3 rounded-full ${
//               currentConversation &&
//               socket.connected &&
//               "bg-green-500"
//             }`}
//           ></span>
//         </h3>
//       </div>
//       <ScrollArea className="flex-1 max-h-[400px] overflow-hidden p-4 md:p-6 bg-[#d4e5fd]">
//         <div className="grid gap-4">
//           {messages &&
//             messages.map((message) => (
//               <div
//                 key={message._id}
//                 className={`flex items-start gap-3 ${
//                   message.senderId._id === teacherId
//                     ? "justify-end"
//                     : "justify-start"
//                 }`}
//               >
//                 {message.senderId._id !== teacherId && (
//                   <Avatar className="h-8 w-8 border">
//                     <AvatarImage
//                       src={
//                         currentConversation.participants?.find(
//                           (p) => p._id === message.senderId._id
//                         )?.user_image?.url || "/placeholder-user.jpg"
//                       }
//                       alt="Avatar"
//                     />
//                     <AvatarFallback>
//                       {
//                         currentConversation.participants.find(
//                           (p) => p._id === message.senderId._id
//                         )?.username[0]
//                       }
//                     </AvatarFallback>
//                   </Avatar>
//                 )}
//                 <div
//                   className={`rounded-lg p-3 text-sm shadow-md ${
//                     message.senderId._id === teacherId
//                       ? "bg-[#dcf8c6] text-black"
//                       : "bg-white text-black"
//                   }`}
//                 >
//                   <p>{message.content}</p>
//                   {message.media?.map((media) => (
//                     <div key={media._id} className="mt-2">
//                       {media.type === "image" ? (
//                         <img
//                           src={`http://tamadrus-api.onrender.com/${media.url}`}
//                           alt="media"
//                           className="max-w-full h-auto rounded"
//                         />
//                       ) : media.type === "video" ? (
//                         <video
//                           controls
//                           className="max-w-full h-auto rounded"
//                         >
//                           <source
//                             src={`http://tamadrus-api.onrender.com/${media.url}`}
//                             type="video/mp4"
//                           />
//                           Your browser does not support the video tag.
//                         </video>
//                       ) : null}
//                     </div>
//                   ))}
//                   <div className="mt-1 ml-2 text-xs text-black text-right">
//                     {moment(message.timestamp).format("hh:mm")}
//                   </div>
//                 </div>
//                 {message.senderId._id === teacherId && (
//                   <Avatar className="h-8 w-8 border">
//                     <AvatarImage
//                       src={
//                         message.senderId?.user_image?.url ||
//                         "/placeholder-user.jpg"
//                       }
//                       alt="Avatar"
//                     />
//                     <AvatarFallback>
//                       {message.senderId?.username[0]}
//                     </AvatarFallback>
//                   </Avatar>
//                 )}
//               </div>
//             ))}
//         </div>
//         <div ref={endOfMessagesRef} />
//       </ScrollArea>
//       <div className="border-t p-4 h-14 max-w-[90%] flex ml-12 mt-2 justify-center items-center bg-gray-900 rounded-3xl">
//         <div className="relative flex items-center">
//           <label
//             htmlFor="file"
//             className="cursor-pointer relative flex items-center justify-center mr-2"
//           >
//             <GrUploadOption className="text-gray-600 hover:text-gray-300 transition-colors duration-300 text-xl" />
//             <span className="absolute top-[-40px] hidden opacity-0 text-white text-xs bg-black px-2 py-1 border border-gray-600 rounded-sm shadow-lg transition-all duration-300 tooltip">
//               Add an image
//             </span>
//           </label>
//           <input name="file" id="file" type="file" className="hidden" />
//         </div>
//         <RxDividerVertical className="text-gray-600 mr-4" size={30} />
//         <input
//           type="text"
//           placeholder="Type a message..."
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           className="flex-1 bg-transparent text-gray-300 placeholder-gray-500 border-none outline-none pl-2"
//         />
//         <RxDividerVertical className="text-gray-600" size={30} />
//         <Button
//           onClick={handleSendMessage}
//           className="cursor-pointer relative flex items-center justify-center mr-2"
//         >
//           <FiSend className="text-gray-600 hover:text-gray-300 transition-colors duration-300 text-xl" />
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default Messages;

import { useEffect, useRef, useState, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { createMessage, fetchMessages } from "@/store/messageSlice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  Send,
  Upload,
  ImageIcon,
  Video,
  File,
  Smile,
  MoreVertical,
  Wifi,
  WifiOff,
  Check,
  CheckCheck,
  Clock,
  X,
} from "lucide-react"
import moment from "moment"
import io from "socket.io-client"

// Enhanced socket configuration with reconnection logic
const createSocket = () => {
  return io("http://tamadrus-api.onrender.com", {
    transports: ["websocket"],
    withCredentials: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  })
}

const Messages = ({ currentConversation }) => {
  const dispatch = useDispatch()
  const messages = useSelector((state) => state.messages.messages)
  const teacher = useSelector((state) => state.auth.loggedUser)
  const teacherId = teacher?.id

  // Refs
  const endOfMessagesRef = useRef(null)
  const fileInputRef = useRef(null)
  const messageInputRef = useRef(null)
  const socketRef = useRef(null)

  // State
  const [newMessage, setNewMessage] = useState("")
  const [isConnected, setIsConnected] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [typingUsers, setTypingUsers] = useState([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [error, setError] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState([])

  // Initialize socket connection
  useEffect(() => {
    socketRef.current = createSocket()
    const socket = socketRef.current

    // Connection event handlers
    socket.on("connect", () => {
      setIsConnected(true)
      setError(null)
    })

    socket.on("disconnect", () => {
      setIsConnected(false)
    })

    socket.on("connect_error", (error) => {
      setError("Connection failed. Retrying...")
      setIsConnected(false)
    })

    // User status handlers
    socket.on("userOnline", (userId) => {
      setOnlineUsers((prev) => [...prev.filter((id) => id !== userId), userId])
    })

    socket.on("userOffline", (userId) => {
      setOnlineUsers((prev) => prev.filter((id) => id !== userId))
    })

    // Typing indicators
    socket.on("userTyping", ({ userId, username }) => {
      if (userId !== teacherId) {
        setTypingUsers((prev) => [...prev.filter((u) => u !== username), username])
      }
    })

    socket.on("userStoppedTyping", ({ userId, username }) => {
      setTypingUsers((prev) => prev.filter((u) => u !== username))
    })

    return () => {
      socket.disconnect()
    }
  }, [teacherId])

  // Handle conversation changes
  useEffect(() => {
    if (currentConversation && socketRef.current) {
      const socket = socketRef.current

      socket.emit("joinConversation", currentConversation._id)
      dispatch(fetchMessages(currentConversation._id))

      const handleNewMessage = (message) => {
        if (currentConversation._id === message.conversationId) {
          dispatch(createMessage(message))
        }
      }

      const handleMessageStatus = ({ messageId, status }) => {
        // Update message status in Redux store
        // This would need to be implemented in your messageSlice
      }

      socket.on("newMessage", handleNewMessage)
      socket.on("messageStatus", handleMessageStatus)

      return () => {
        socket.off("newMessage", handleNewMessage)
        socket.off("messageStatus", handleMessageStatus)
        socket.emit("leaveConversation", currentConversation._id)
      }
    }
  }, [currentConversation, dispatch])

  // Auto-scroll to bottom
  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Typing indicator logic
  const handleTyping = useCallback(() => {
    if (socketRef.current && currentConversation) {
      socketRef.current.emit("typing", {
        conversationId: currentConversation._id,
        userId: teacherId,
        username: teacher?.username,
      })

      if (!isTyping) {
        setIsTyping(true)
        setTimeout(() => {
          setIsTyping(false)
          socketRef.current?.emit("stopTyping", {
            conversationId: currentConversation._id,
            userId: teacherId,
            username: teacher?.username,
          })
        }, 2000)
      }
    }
  }, [currentConversation, teacherId, teacher?.username, isTyping])

  // Send message
  const handleSendMessage = useCallback(async () => {
    if (!newMessage.trim() && selectedFiles.length === 0) return
    if (!currentConversation?._id || !socketRef.current) return

    try {
      const messageData = {
        conversationId: currentConversation._id,
        senderId: teacherId,
        content: newMessage.trim(),
        mediaFiles: selectedFiles,
        timestamp: new Date().toISOString(),
      }

      socketRef.current.emit("sendMessage", messageData)
      setNewMessage("")
      setSelectedFiles([])
      setError(null)
    } catch (error) {
      setError("Failed to send message. Please try again.")
    }
  }, [newMessage, selectedFiles, currentConversation, teacherId])

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
      setError("Some files were rejected. Only images, videos, and PDFs under 10MB are allowed.")
    }

    setSelectedFiles((prev) => [...prev, ...validFiles])
  }

  // Remove selected file
  const removeSelectedFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  // Handle keyboard shortcuts
  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      handleSendMessage()
    }
  }

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

  // Get participant info
  const getParticipant = () => {
    return currentConversation?.participants?.find((p) => p._id !== teacherId)
  }

  const participant = getParticipant()
  const isParticipantOnline = participant && onlineUsers.includes(participant._id)

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full bg-white">
        {/* Header */}
        <div className="border-b p-4 flex items-center justify-between bg-white shadow-sm">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={participant?.user_image?.url || "/placeholder-user.jpg"}
                  alt={participant?.username || "User"}
                />
                <AvatarFallback>{participant?.username?.[0]?.toUpperCase() || "U"}</AvatarFallback>
              </Avatar>
              {isParticipantOnline && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{participant?.username || "Unknown User"}</h3>
              <p className="text-sm text-gray-500">{isParticipantOnline ? "Online" : "Offline"}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger>
                {isConnected ? (
                  <Wifi className="w-5 h-5 text-green-500" />
                ) : (
                  <WifiOff className="w-5 h-5 text-red-500" />
                )}
              </TooltipTrigger>
              <TooltipContent>{isConnected ? "Connected" : "Disconnected"}</TooltipContent>
            </Tooltip>
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="m-4 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              {error}
              <Button variant="ghost" size="sm" className="ml-2 h-auto p-0 text-red-800" onClick={() => setError(null)}>
                <X className="w-4 h-4" />
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4 bg-gray-50">
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
                      src={message.senderId?.user_image?.url || "/placeholder-user.jpg"}
                      alt={message.senderId?.username || "User"}
                    />
                    <AvatarFallback>{message.senderId?.username?.[0]?.toUpperCase() || "U"}</AvatarFallback>
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
                          src={`http://tamadrus-api.onrender.com/${media.url}`}
                          alt="Shared image"
                          className="max-w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => window.open(`http://tamadrus-api.onrender.com/${media.url}`, "_blank")}
                        />
                      ) : media.type === "video" ? (
                        <video controls className="max-w-full h-auto rounded-lg" preload="metadata">
                          <source src={`http://tamadrus-api.onrender.com/${media.url}`} type="video/mp4" />
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
                    <AvatarImage
                      src={message.senderId?.user_image?.url || "/placeholder-user.jpg"}
                      alt={message.senderId?.username || "You"}
                    />
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
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                </div>
                <span>
                  {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing...
                </span>
              </div>
            )}
          </div>
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
            <div className="flex gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    <Upload className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Upload file</TooltipContent>
              </Tooltip>

              <Button variant="ghost" size="sm">
                <Smile className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex-1 relative">
              <Input
                ref={messageInputRef}
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value)
                  handleTyping()
                }}
                onKeyPress={handleKeyPress}
                className="pr-12 resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                disabled={!isConnected}
              />
            </div>

            <Button
              onClick={handleSendMessage}
              disabled={(!newMessage.trim() && selectedFiles.length === 0) || !isConnected || isUploading}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Send className="w-4 h-4" />
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
      </div>
    </TooltipProvider>
  )
}

export default Messages
