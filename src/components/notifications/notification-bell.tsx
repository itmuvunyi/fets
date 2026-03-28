"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bell, Check, Trash2, CheckCheck } from "lucide-react"
import { useAuth } from "@/lib/auth"
import {
  getNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "@/app/actions/notifications"
import type { Notification } from "./notification-item"
import { cn } from "@/lib/utils"

export function NotificationBell() {
  const { user } = useAuth()
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (user) {
      loadNotifications()
      // Refresh notifications every minute
      const interval = setInterval(loadNotifications, 60000)
      return () => clearInterval(interval)
    }
  }, [user])

  const loadNotifications = async () => {
    if (!user) return
    try {
      const [userNotifications, unread] = await Promise.all([
        getNotifications(user.id),
        getUnreadCount(user.id)
      ])
      setNotifications(userNotifications as unknown as Notification[])
      setUnreadCount(unread)
    } catch (e) {
      console.error(e)
    }
  }

  const handleMarkAsRead = async (notificationId: string) => {
    if (!user) return
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n))
    setUnreadCount(prev => Math.max(0, prev - 1))
    await markNotificationAsRead(notificationId)
  }

  const handleMarkAllAsRead = async () => {
    if (!user) return
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
    await markAllNotificationsAsRead(user.id)
  }

  const handleDelete = async (notificationId: string) => {
    if (!user) return
    const n = notifications.find(x => x.id === notificationId)
    setNotifications(prev => prev.filter(n => n.id !== notificationId))
    if (n && !n.read) {
      setUnreadCount(prev => Math.max(0, prev - 1))
    }
    await deleteNotification(notificationId)
  }

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "error":
        return "🚨"
      case "warning":
        return "⚠️"
      case "success":
        return "✅"
      default:
        return "ℹ️"
    }
  }

  const getNotificationColor = (type: Notification["type"]) => {
    switch (type) {
      case "error":
        return "border-l-destructive"
      case "warning":
        return "border-l-yellow-500"
      case "success":
        return "border-l-green-500"
      default:
        return "border-l-blue-500"
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="relative bg-transparent">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
              <CheckCheck className="h-4 w-4 mr-1" />
              Mark all read
            </Button>
          )}
        </div>

        <ScrollArea className="h-80">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            <div className="p-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => {
                    handleMarkAsRead(notification.id)
                    setIsOpen(false)
                    // Navigate based on type
                    if (notification.type === "error" || notification.title.toLowerCase().includes("expired")) {
                      router.push("/dashboard/expired")
                    } else if (notification.type === "warning" || notification.title.toLowerCase().includes("expiring")) {
                      router.push("/dashboard/reminders")
                    } else {
                      router.push("/dashboard")
                    }
                  }}
                  className={cn(
                    "p-3 mb-2 rounded-lg border-l-4 bg-card hover:bg-accent/50 transition-colors cursor-pointer",
                    getNotificationColor(notification.type),
                    !notification.read && "bg-accent/20",
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm">{getNotificationIcon(notification.type)}</span>
                        <h4 className="font-medium text-sm truncate">{notification.title}</h4>
                        {!notification.read && <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />}
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="h-6 w-6 p-0"
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(notification.id)}
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
