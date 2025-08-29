import { useDispatch } from "react-redux";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  BellIcon,
  LogOut,
  MessageSquare,
  RefreshCw,
  AlertCircle,
  Mail,
  Settings,
  PlusCircle,
  GraduationCap,
  BookOpen,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/store/notificationSlice";

export function UserProfileCard({
  user,
  userImageSrc,
  notifications = [],
  notificationError,
  isLoading,
  onRefresh,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  // Calculate unread notifications properly
  const unreadNotifications = notifications.filter(
    (notification) => !notification.isRead
  );
  const unreadCount = unreadNotifications.length;

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      dispatch(markNotificationAsRead(notification._id));
    }
  };

  const handleMarkAllAsRead = () => {
    if (unreadCount > 0) {
      dispatch(markAllNotificationsAsRead(user.id));
    }
  };

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return "Unknown";

    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMinutes = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60)
      );

      if (diffInMinutes < 1) return "Just now";
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    } catch (error) {
      return "Unknown";
    }
  };

  const sortedNotifications = [...notifications].sort(
    (a, b) =>
      new Date(b.createdAt || 0).getTime() -
      new Date(a.createdAt || 0).getTime()
  );

  const getRoleColor = (educationalCycle) => {
    switch (educationalCycle) {
      case "Primaire":
        return "bg-blue-500";
      case "Collège":
        return "bg-purple-500";
      case "Lycée":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };
  return (
    <Card className="flex-1 relative overflow-hidden">
      <CardHeader className="pb-4">
        <div className="absolute top-4 right-4">
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <BellIcon className="h-5 w-5 text-gray-500" />
                {isLoading && (
                  <RefreshCw className="h-3 w-3 animate-spin absolute -top-1 -left-1" />
                )}
                {unreadCount > 0 && !isLoading && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 rounded-xl" align="end">
              <div className="flex items-center justify-between px-2 py-1">
                <DropdownMenuLabel className="p-0">
                  Notifications {!isLoading && `(${unreadCount} unread)`}
                </DropdownMenuLabel>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={isLoading}
                    className="h-auto p-1"
                  >
                    <RefreshCw
                      className={cn("h-3 w-3", isLoading && "animate-spin")}
                    />
                  </Button>
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleMarkAllAsRead}
                      disabled={isLoading}
                      className="h-auto p-1 text-xs"
                    >
                      Mark all read
                    </Button>
                  )}
                </div>
              </div>

              {notificationError && (
                <>
                  <DropdownMenuSeparator />
                  <div className="p-2">
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-xs">
                        {notificationError}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleRefresh}
                          className="ml-2 h-auto p-0 text-xs underline"
                        >
                          Retry
                        </Button>
                      </AlertDescription>
                    </Alert>
                  </div>
                </>
              )}

              <DropdownMenuSeparator />
              <ScrollArea className="h-96">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                    <span className="ml-2 text-sm text-muted-foreground">
                      Loading notifications...
                    </span>
                  </div>
                ) : sortedNotifications.length > 0 ? (
                  <div className="space-y-1">
                    {sortedNotifications.map((notification) => (
                      <DropdownMenuItem
                        key={notification._id || notification.id}
                        className={cn(
                          "flex flex-col items-start p-3 cursor-pointer transition-colors",
                          !notification.isRead &&
                            "bg-blue-50 dark:bg-blue-950/20 border-l-2 border-l-blue-500"
                        )}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start justify-between w-full">
                          <div className="flex-1 space-y-1">
                            <p
                              className={cn(
                                "text-sm leading-relaxed",
                                !notification.isRead && "font-medium"
                              )}
                            >
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                {formatTimeAgo(notification.createdAt)}
                              </span>
                              {notification.type && (
                                <Badge variant="secondary" className="text-xs">
                                  {notification.type}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 ml-2">
                            {!notification.isRead && (
                              <div className="h-2 w-2 bg-blue-500 rounded-full" />
                            )}
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <BellIcon className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No notifications yet
                    </p>
                  </div>
                )}
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-start gap-4">
          <Avatar className="h-20 w-20 lg:h-32 lg:w-32 border-4 border-white shadow-xl">
            <AvatarImage
              src={userImageSrc || "/placeholder.svg"}
              alt={user?.username}
            />
            <AvatarFallback className="text-lg">
              {user?.username
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 ml-4 mt-4 lg:mt-16">
            <div className="flex flex-col items-start lg:flex-row lg:items-center gap-2 mb-2">
              <h1 className="lg:text-2xl text-sm font-bold">
                {user?.username}
              </h1>
              <div className="flex gap-2">
                <Badge className={getRoleColor(user?.educationalCycle)}>
                  {user?.educationalCycle}
                </Badge>
                {user?.isOnline && (
                  <Badge
                    variant="outline"
                    className="text-green-600 border-green-600"
                  >
                    Online
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center  justify-center gap-4 text-sm sm:justify-start">
          {user?.stream && (
            <div className="flex items-center space-x-1">
              <GraduationCap className="h-4 w-4" />
              <span>{user.stream}</span>
            </div>
          )}
          {user?.educationalLevel && (
            <div className="flex items-center space-x-1">
              <BookOpen className="h-4 w-4" />
              <span> {user.educationalLevel}</span>
            </div>
          )}
          <div className="flex items-center space-x-1">
            <Mail className="h-4 w-4" />
            <span> {user?.email}</span>
          </div>
        </div>
        <div className="text-center m-4">
          <p className="text-sm leading-relaxed">{user?.bio}</p>
        </div>
      </CardContent>
    </Card>
  );
}
