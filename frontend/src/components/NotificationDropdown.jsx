import {
  BellIcon,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { markNotificationAsRead, markAllNotificationsAsRead } from "@/store/notificationSlice";
import { cn } from "@/lib/utils";

export default function NotificationDropdown({
  notifications = [],
  isLoading,
  notificationError,
  userId,
  onRefresh
}) {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const unreadNotifications = notifications.filter(n => !n.isRead);
  const unreadCount = unreadNotifications.length;

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      dispatch(markNotificationAsRead(notification._id));
    }
  };

  const handleMarkAllAsRead = () => {
    if (unreadCount > 0) {
      dispatch(markAllNotificationsAsRead(userId));
    }
  };

  const handleRefresh = () => {
    if (onRefresh) onRefresh();
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 60000);
    if (diff < 1) return "Just now";
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return `${Math.floor(diff / 1440)}d ago`;
  };

  const sorted = [...notifications].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
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
            <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={isLoading} className="h-auto p-1">
              <RefreshCw className={cn("h-3 w-3", isLoading && "animate-spin")} />
            </Button>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead} disabled={isLoading} className="h-auto p-1 text-xs">
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
              <span className="ml-2 text-sm text-muted-foreground">Loading notifications...</span>
            </div>
          ) : sorted.length > 0 ? (
            <div className="space-y-1">
              {sorted.map((n) => (
                <DropdownMenuItem
                  key={n._id}
                  onClick={() => handleNotificationClick(n)}
                  className={cn(
                    "flex flex-col items-start p-3 cursor-pointer",
                    !n.isRead && "bg-blue-50 dark:bg-blue-950/20 border-l-2 border-blue-500"
                  )}
                >
                  <div className="flex items-start justify-between w-full">
                    <div className="flex-1 space-y-1">
                      <p className={cn("text-sm", !n.isRead && "font-semibold")}>
                        {n.message}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{formatTimeAgo(n.createdAt)}</span>
                        {n.type && <Badge variant="secondary">{n.type}</Badge>}
                      </div>
                    </div>
                    {!n.isRead && <div className="h-2 w-2 bg-blue-500 rounded-full ml-2" />}
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <BellIcon className="mx-auto h-6 w-6 mb-2" />
              No notifications
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
