"use client"

import { useState } from "react"
import { markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } from "@/app/actions/notifications"
import { NotificationItem, type Notification } from "./notification-item"
import { EmptyState } from "./empty-state"
import { Button } from "@/components/ui/button"
import { CheckCheck } from "lucide-react"
import { useAuth } from "@/lib/auth"

export function NotificationList({ initialNotifications }: { initialNotifications: Notification[] }) {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)

  const unreadCount = notifications.filter(n => !n.read).length

  const handleMarkAsRead = async (id: string) => {
    // Optimistic update
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    await markNotificationAsRead(id)
  }

  const handleDelete = async (id: string) => {
    // Optimistic update
    setNotifications(prev => prev.filter(n => n.id !== id))
    await deleteNotification(id)
  }

  const handleMarkAllAsRead = async () => {
    if (!user) return
    // Optimistic update
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    await markAllNotificationsAsRead(user.id)
  }

  if (notifications.length === 0) {
    return <EmptyState />
  }

  const unreadNotifications = notifications.filter(n => !n.read)
  const readNotifications = notifications.filter(n => n.read)

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            You have <strong className="text-foreground">{unreadCount}</strong> unread messages.
          </p>
        </div>
        
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={handleMarkAllAsRead} className="gap-2 rounded-xl">
            <CheckCheck className="w-4 h-4" />
            <span className="hidden sm:inline font-semibold">Mark all as read</span>
          </Button>
        )}
      </div>

      <div className="space-y-10">
        {unreadNotifications.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest pl-2">New</h3>
            <div className="flex flex-col gap-3">
              {unreadNotifications.map(notification => (
                <NotificationItem 
                  key={notification.id} 
                  notification={notification} 
                  onMarkAsRead={handleMarkAsRead} 
                  onDelete={handleDelete} 
                />
              ))}
            </div>
          </div>
        )}

        {readNotifications.length > 0 && (
          <div className="space-y-4 pt-4">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest pl-2">Earlier</h3>
            <div className="flex flex-col gap-3">
              {readNotifications.map(notification => (
                <NotificationItem 
                  key={notification.id} 
                  notification={notification} 
                  onMarkAsRead={handleMarkAsRead} 
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
