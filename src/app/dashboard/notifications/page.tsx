"use client"

import { getNotifications, markAllNotificationsAsRead } from "@/lib/notifications"
import { useAuth } from "@/lib/auth"
import { useEffect, useState } from "react"
import { Bell, CheckCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function NotificationsPage() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<any[]>([])

  useEffect(() => {
    if (user) {
      setNotifications(getNotifications(user.id))
    }
  }, [user])

  const handleMarkAllRead = () => {
    if (user) {
      markAllNotificationsAsRead(user.id)
      setNotifications(getNotifications(user.id))
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-100 rounded-xl text-amber-600">
            <Bell className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
            <p className="text-muted-foreground">Stay updated on your inventory and reminders.</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleMarkAllRead} className="gap-2 hover:bg-primary hover:text-primary-foreground transition-all">
          <CheckCheck className="w-4 h-4" />
          Mark all as read
        </Button>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No notifications yet.
          </div>
        ) : (
          notifications.map((n) => (
            <Card key={n.id} className={!n.read ? "border-primary/50 bg-primary/5" : ""}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{n.title}</h3>
                    <p className="text-sm text-muted-foreground">{n.message}</p>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground mt-2 block">
                      {new Date(n.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
