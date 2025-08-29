import { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import socket from "@/utils/socket";
import { loggedUser } from "@/store/authSlice";
import moment from "moment";
import {
  fetchTeacherConversations,
  setCurrentConversation,
   updateLastMessageRedux,
} from "@/store/conversationSlice";
import { createMessage, fetchMessages } from "@/store/messageSlice";
import {
  MoveHorizontalIcon,
  Menu,
  Plus,
  Smile,
  Paperclip,
  MoreVertical,
  PhoneIcon,
  SearchIcon,
  VideoIcon,
  Send,
  Upload,
  ImageIcon,
  Video,
  File,
  X,
  Check,
  CheckCheck,
  Clock,
  Wifi,
  WifiOff,
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Conversation = () => {
  const dispatch = useDispatch();
  const {
    conversations = [],
    loading,
    error,
  } = useSelector((state) => state.conversations);
  const currentConversation = useSelector(
    (state) => state.conversations.currentConversation
  );
  const messages = useSelector((state) => state.messages.messages);
  const messagesLoading = useSelector((state) => state.messages.loading);
  const teacher = useSelector((state) => loggedUser(state));

  // State
  const [newMessage, setNewMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState({});
  const [typingUsers, setTypingUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false); // Add this state
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);

  // Refs
  const teacherId = teacher?.id;
  const endOfMessagesRef = useRef(null);
  const fileInputRef = useRef(null);
  const messageInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const connectionCheckInterval = useRef(null); // Add this ref

  // Check connection status periodically
  useEffect(() => {
    const checkConnection = () => {
      const connected = socket.connected;
      setIsConnected(connected);

      if (!connected && !isConnecting) {
        setConnectionError("Connection lost. Attempting to reconnect...");
      } else if (connected && connectionError) {
        setConnectionError(null);
      }
    };

    // Initial check
    checkConnection();

    // Check every 2 seconds
    connectionCheckInterval.current = setInterval(checkConnection, 2000);

    return () => {
      if (connectionCheckInterval.current) {
        clearInterval(connectionCheckInterval.current);
      }
    };
  }, [isConnecting, connectionError]);

  // Force reconnect function
  const handleForceReconnect = useCallback(() => {
    setIsConnecting(true);
    setConnectionError("Reconnecting...");

    // Disconnect and reconnect
    if (socket.connected) {
      socket.disconnect();
    }

    setTimeout(() => {
      socket.connect();
      setIsConnecting(false);
    }, 1000);
  }, []);

  // Initialize and fetch conversations
  useEffect(() => {
    if (teacherId) {
      dispatch(fetchTeacherConversations(teacherId));
      socket.emit("join", teacherId);
    }

    // Socket connection handlers
    const handleConnect = () => {
      setIsConnected(true);
      setIsConnecting(false);
      setConnectionError(null);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      setIsConnecting(false);
      setConnectionError("Connection lost. Trying to reconnect...");
    };

    const handleConnectError = () => {
      setIsConnected(false);
      setIsConnecting(false);
      setConnectionError("Failed to connect to server");
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.off("updateOnlineStatus");
    };
  }, [dispatch, teacherId]);

  // Handle current conversation changes
  useEffect(() => {
    if (currentConversation) {
      console.log("Joining conversation:", currentConversation._id);
      socket.emit("joinConversation", currentConversation._id);
      dispatch(fetchMessages(currentConversation._id));

      const handleNewMessage = (message) => {
        if (
          currentConversation &&
          message.conversationId === currentConversation._id
        ) {
          console.log("New message received:", message);
          dispatch(createMessage(message));
        }
      };

      const handleGetMessages = (messages) => {
        console.log("Received messages:", messages);
        dispatch(fetchMessages(currentConversation._id));
      };

      const handleUpdateLastMessage = ({
        conversationId,
        lastMessage,
        lastMessageId,
      }) => {
        dispatch(
          updateLastMessageRedux({ conversationId, lastMessage, lastMessageId })
        );
      };

      const handleTyping = ({ userId, username }) => {
        if (userId !== teacherId) {
          setTypingUsers((prev) => {
            if (!prev.includes(username)) {
              return [...prev, username];
            }
            return prev;
          });
        }
      };

      const handleStopTyping = ({ userId, username }) => {
        setTypingUsers((prev) => prev.filter((user) => user !== username));
      };

      socket.on("newMessage", handleNewMessage);
      socket.on("getMessages", handleGetMessages);
      socket.on("updateLastMessage", handleUpdateLastMessage);
      socket.on("userTyping", handleTyping);
      socket.on("userStoppedTyping", handleStopTyping);

      return () => {
        socket.off("newMessage", handleNewMessage);
        socket.off("getMessages", handleGetMessages);
        socket.off("updateLastMessage", handleUpdateLastMessage);
        socket.off("userTyping", handleTyping);
        socket.off("userStoppedTyping", handleStopTyping);
        socket.emit("leaveConversation", currentConversation._id);
      };
    }
  }, [currentConversation, dispatch, teacherId]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Handle online status updates
  useEffect(() => {
    const handleUpdateOnlineStatus = (onlineUsers) => {
      console.log("Online users updated:", onlineUsers);
      setOnlineUsers(onlineUsers);
    };

    socket.on("updateOnlineStatus", (data) => {
      console.log("Received updateOnlineStatus event:", data);
      handleUpdateOnlineStatus(data);
    });

    return () => {
      socket.off("updateOnlineStatus");
    };
  }, []);

  // Typing indicator logic
  const handleTyping = useCallback(() => {
    if (currentConversation && !isTyping) {
      setIsTyping(true);
      socket.emit("typing", {
        conversationId: currentConversation._id,
        userId: teacherId,
        username: teacher?.username,
      });
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket.emit("stopTyping", {
        conversationId: currentConversation._id,
        userId: teacherId,
        username: teacher?.username,
      });
    }, 2000);
  }, [currentConversation, teacherId, teacher?.username, isTyping]);

  // Handle conversation selection
  const handleConversationClick = (conversation) => {
    console.log("Conversation clicked:", conversation);
    dispatch(setCurrentConversation(conversation));
    setSearchQuery("");
    setShowSearch(false);
  };

  // Handle file selection
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter((file) => {
      const isValidType =
        file.type.startsWith("image/") ||
        file.type.startsWith("video/") ||
        file.type === "application/pdf";
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      setConnectionError(
        "Some files were rejected. Only images, videos, and PDFs under 10MB are allowed."
      );
      setTimeout(() => setConnectionError(null), 5000);
    }

    setSelectedFiles((prev) => [...prev, ...validFiles]);
  };

  // Remove selected file
  const removeSelectedFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Send message
  const handleSendMessage = useCallback(async () => {
    if (!newMessage.trim() && selectedFiles.length === 0) return;

    if (!currentConversation?._id) {
      setConnectionError("No conversation selected");
      return;
    }

    if (!isConnected) {
      setConnectionError(
        "Not connected to server. Please wait for reconnection."
      );
      return;
    }

    try {
      setIsUploading(selectedFiles.length > 0);

      // Simulate upload progress for files
      if (selectedFiles.length > 0) {
        for (let i = 0; i <= 100; i += 10) {
          setUploadProgress(i);
          await new Promise((resolve) => setTimeout(resolve, 50));
        }
      }

      const messageData = {
        conversationId: currentConversation._id,
        senderId: teacherId,
        content: newMessage.trim(),
        mediaFiles: selectedFiles,
      };

      console.log("Sending message:", messageData);
      socket.emit("sendMessage", messageData);

      setNewMessage("");
      setSelectedFiles([]);
      setUploadProgress(0);
      setIsUploading(false);
      setConnectionError(null);

      // Focus back to input
      messageInputRef.current?.focus();
    } catch (error) {
      setConnectionError("Failed to send message. Please try again.");
      setIsUploading(false);
      console.error("Error sending message:", error);
    }
  }, [newMessage, selectedFiles, currentConversation, teacherId, isConnected]);

  // Handle keyboard shortcuts
  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  // Handle message input change
  const handleMessageChange = (e) => {
    setNewMessage(e.target.value);
    handleTyping();
  };

  // Filter conversations based on search
  const filteredConversations = conversations.filter((conversation) =>
    conversation.participants?.[0]?.username
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Get message status icon
  const getMessageStatusIcon = (status) => {
    switch (status) {
      case "sending":
        return <Clock className="w-3 h-3 text-gray-400" />;
      case "sent":
        return <Check className="w-3 h-3 text-gray-400" />;
      case "delivered":
        return <CheckCheck className="w-3 h-3 text-gray-400" />;
      case "read":
        return <CheckCheck className="w-3 h-3 text-blue-500" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading conversations...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading conversations: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-background">
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div
          className={`
            fixed inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 ease-in-out
            lg:relative lg:translate-x-0 lg:z-0
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <div className="h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
            <div className="p-4 border-b border-sidebar-border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading font-bold text-xl text-sidebar-foreground">
                  Messages
                </h2>
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
                      {isConnecting
                        ? "Connecting..."
                        : isConnected
                        ? "Connected"
                        : "Disconnected"}
                    </TooltipContent>
                  </Tooltip>

                  {!isConnected && !isConnecting && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleForceReconnect}
                          className="text-sidebar-foreground hover:bg-sidebar-accent"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Reconnect</TooltipContent>
                    </Tooltip>
                  )}

                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-sidebar-foreground hover:bg-sidebar-accent"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="lg:hidden text-sidebar-foreground hover:bg-sidebar-accent"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-2">
                {filteredConversations.map((conversation) => {
                  const participant = conversation.participants?.[0];
                  const isOnline = onlineUsers[participant?._id];
                  const isActive =
                    currentConversation?._id === conversation._id;

                  return (
                    <div
                      key={conversation._id}
                      className={`
                        p-4 border-b border-sidebar-border cursor-pointer transition-colors rounded-lg mb-1
                        hover:bg-sidebar-accent
                        ${isActive ? "bg-sidebar-accent" : ""}
                      `}
                      onClick={() => handleConversationClick(conversation)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <Avatar className="h-12 w-12 flex-shrink-0">
                            <AvatarImage
                              src={
                                participant?.user_image?.url ||
                                "/placeholder.svg"
                              }
                              alt={participant?.username || "User"}
                            />
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {participant?.username?.[0]?.toUpperCase() || "?"}
                            </AvatarFallback>
                          </Avatar>
                          {isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-sidebar rounded-full"></div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium text-sidebar-foreground truncate">
                              {participant?.username || "Unknown User"}
                            </h3>
                            <span className="text-xs text-muted-foreground flex-shrink-0">
                              {moment(conversation.updatedAt).format("HH:mm")}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground truncate">
                              {conversation.lastMessage || "No messages yet"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredConversations.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    {searchQuery
                      ? "No conversations found"
                      : "No conversations yet"}
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-sidebar-border">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={teacher?.user_image?.url || "/placeholder.svg"}
                      alt="You"
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {teacher?.username?.[0]?.toUpperCase() || "Y"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-sidebar rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sidebar-foreground">
                    {teacher?.username || "You"}
                  </p>
                  <p className="text-sm text-muted-foreground">Online</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          <div className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-card">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="text-foreground"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="font-heading font-bold text-lg text-foreground">
              ChatApp
            </h1>
            <div className="w-10" />
          </div>

          {currentConversation ? (
            <>
              {connectionError && (
                <Alert className="m-4 border-destructive/50 bg-destructive/10">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-destructive flex items-center justify-between">
                    <span>{connectionError}</span>
                    <div className="flex items-center gap-2">
                      {!isConnected && !isConnecting && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleForceReconnect}
                          className="text-destructive"
                        >
                          <RefreshCw className="w-4 h-4 mr-1" />
                          Retry
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 text-destructive"
                        onClick={() => setConnectionError(null)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <div className="p-4 border-b border-border bg-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={
                            currentConversation.participants?.[0]?.user_image
                              ?.url ||
                            "/placeholder.svg" ||
                            "/placeholder.svg" ||
                            "/placeholder.svg" ||
                            "/placeholder.svg" ||
                            "/placeholder.svg"
                          }
                          alt={
                            currentConversation.participants?.[0]?.username ||
                            "User"
                          }
                        />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {currentConversation.participants?.[0]?.username?.[0]?.toUpperCase() ||
                            "U"}
                        </AvatarFallback>
                      </Avatar>
                      {onlineUsers[
                        currentConversation.participants?.[0]?._id
                      ] && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-card rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-card-foreground">
                        {currentConversation.participants?.[0]?.username ||
                          "Unknown User"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {typingUsers.length > 0
                          ? "typing..."
                          : onlineUsers[
                              currentConversation.participants?.[0]?._id
                            ]
                          ? "Online"
                          : "Offline"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={!isConnected}
                          className="text-card-foreground"
                        >
                          <PhoneIcon className="w-5 h-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Voice call</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={!isConnected}
                          className="text-card-foreground"
                        >
                          <VideoIcon className="w-5 h-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Video call</TooltipContent>
                    </Tooltip>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-card-foreground"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex-1 flex flex-col min-h-0">
                <ScrollArea className="flex-1 p-4">
                  {messagesLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      <span className="ml-2 text-foreground">
                        Loading messages...
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages?.map((message) => (
                        <div
                          key={message._id}
                          className={`flex gap-3 ${
                            message.senderId._id === teacherId
                              ? "flex-row-reverse"
                              : "flex-row"
                          }`}
                        >
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarImage
                              src={
                                message.senderId._id === teacherId
                                  ? teacher?.user_image?.url ||
                                    "/placeholder.svg"
                                  : currentConversation.participants?.find(
                                      (p) => p._id === message.senderId._id
                                    )?.user_image?.url || "/placeholder.svg"
                              }
                              alt="Avatar"
                            />
                            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                              {message.senderId?.username?.[0]?.toUpperCase() ||
                                "U"}
                            </AvatarFallback>
                          </Avatar>

                          <div
                            className={`flex flex-col max-w-xs sm:max-w-md ${
                              message.senderId._id === teacherId
                                ? "items-end"
                                : "items-start"
                            }`}
                          >
                            <div
                              className={`
                                px-4 py-2 rounded-lg text-sm leading-relaxed
                                ${
                                  message.senderId._id === teacherId
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-card text-card-foreground border border-border"
                                }
                              `}
                            >
                              {message.content && <p>{message.content}</p>}

                              {message.media?.length > 0 && (
                                <div className="mt-2 space-y-2">
                                  {message.media.map((media, index) => (
                                    <div
                                      key={media._id || media.url || index}
                                      className="mt-2"
                                    >
                                      {media.type === "image" ? (
                                        <img
                                          src={media.url || "/placeholder.svg"}
                                          alt="Shared image"
                                          className="max-w-full h-auto rounded-lg"
                                          style={{ maxHeight: "200px" }}
                                        />
                                      ) : media.type === "video" ? (
                                        <video
                                          controls
                                          className="max-w-full h-auto rounded-lg"
                                          style={{ maxHeight: "200px" }}
                                        >
                                          <source
                                            src={media.url}
                                            type="video/mp4"
                                          />
                                          Your browser does not support the
                                          video tag.
                                        </video>
                                      ) : (
                                        <a
                                          href={media.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex items-center gap-2 p-2 bg-muted rounded-lg"
                                        >
                                          <File className="w-4 h-4" />
                                          <span className="text-sm">
                                            {media.type === "pdf"
                                              ? "PDF Document"
                                              : "Document"}
                                          </span>
                                        </a>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-muted-foreground">
                                {moment(message.timestamp).format("HH:mm")}
                              </span>
                              {message.senderId._id === teacherId && (
                                <div>
                                  {getMessageStatusIcon(message.status)}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}

                      {typingUsers.length > 0 && (
                        <div className="flex gap-3">
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarImage
                              src={
                                currentConversation.participants?.[0]
                                  ?.user_image?.url || "/placeholder.svg"
                              }
                              alt="Avatar"
                            />
                            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                              {currentConversation.participants?.[0]?.username?.[0]?.toUpperCase() ||
                                "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex items-center bg-card border border-border rounded-lg px-4 py-2">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                              <div
                                className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                                style={{ animationDelay: "0.1s" }}
                              ></div>
                              <div
                                className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  <div ref={endOfMessagesRef} />
                </ScrollArea>
              </div>

              {selectedFiles.length > 0 && (
                <div className="border-t border-border p-3 bg-card">
                  <div className="flex flex-wrap gap-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="relative">
                        <Badge variant="secondary" className="pr-6">
                          {file.type.startsWith("image/") && (
                            <ImageIcon className="w-3 h-3 mr-1" />
                          )}
                          {file.type.startsWith("video/") && (
                            <Video className="w-3 h-3 mr-1" />
                          )}
                          {!file.type.startsWith("image/") &&
                            !file.type.startsWith("video/") && (
                              <File className="w-3 h-3 mr-1" />
                            )}
                          {file.name}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute -top-1 -right-1 h-4 w-4 p-0 rounded-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                          onClick={() => removeSelectedFile(index)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {isUploading && (
                <div className="border-t border-border p-3 bg-card">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Uploading...
                    </span>
                    <Progress value={uploadProgress} className="flex-1" />
                    <span className="text-sm text-muted-foreground">
                      {uploadProgress}%
                    </span>
                  </div>
                </div>
              )}

              <div className="p-4 border-t border-border bg-card">
                <div className="flex items-end gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading || !isConnected}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Paperclip className="w-5 h-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Upload file</TooltipContent>
                  </Tooltip>

                  <div className="flex-1 relative">
                    <Input
                      ref={messageInputRef}
                      type="text"
                      placeholder={
                        isConnected ? "Type a message..." : "Connecting..."
                      }
                      value={newMessage}
                      onChange={handleMessageChange}
                      onKeyPress={handleKeyPress}
                      disabled={!isConnected || isUploading}
                      className="pr-12 bg-input border-border text-foreground placeholder:text-muted-foreground"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <Smile className="h-4 w-4" />
                    </Button>
                  </div>

                  <Button
                    onClick={handleSendMessage}
                    disabled={
                      (!newMessage.trim() && selectedFiles.length === 0) ||
                      !isConnected ||
                      isUploading
                    }
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {isUploading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
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
            <div className="flex-1 flex items-center justify-center bg-background">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2 text-foreground">
                  Welcome to Messages
                </h3>
                <p className="text-muted-foreground">
                  Select a conversation to start chatting
                </p>
                {!isConnected && (
                  <div className="mt-4">
                    <Button
                      onClick={handleForceReconnect}
                      variant="outline"
                      className="gap-2 bg-transparent"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Connect to Server
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {selectedMedia && (
          <div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setSelectedMedia(null)}
          >
            <button
              onClick={() => setSelectedMedia(null)}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <div
              className="relative max-w-[95vw] max-h-[95vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedMedia.type === "image" ? (
                <img
                  src={selectedMedia.url || "/placeholder.svg"}
                  alt="Full size image"
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              ) : (
                <video
                  controls
                  autoPlay
                  className="max-w-full max-h-full object-contain rounded-lg"
                  poster={selectedMedia.thumbnail}
                >
                  <source src={selectedMedia.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/70 text-sm">
              Click outside to close
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default Conversation;
