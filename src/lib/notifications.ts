export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "warning" | "error" | "success"
  timestamp: string
  read: boolean
  foodItemId?: string
}

export function getNotifications(userId: string): Notification[] {
  const stored = localStorage.getItem(`notifications-${userId}`)
  return stored ? JSON.parse(stored) : []
}

export function saveNotifications(userId: string, notifications: Notification[]): void {
  localStorage.setItem(`notifications-${userId}`, JSON.stringify(notifications))
}

export function addNotification(userId: string, notification: Omit<Notification, "id" | "timestamp" | "read">): void {
  const notifications = getNotifications(userId)
  const newNotification: Notification = {
    ...notification,
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    read: false,
  }
  notifications.unshift(newNotification)
  // Keep only last 50 notifications
  if (notifications.length > 50) {
    notifications.splice(50)
  }
  saveNotifications(userId, notifications)
}

export function markNotificationAsRead(userId: string, notificationId: string): void {
  const notifications = getNotifications(userId)
  const notification = notifications.find((n) => n.id === notificationId)
  if (notification) {
    notification.read = true
    saveNotifications(userId, notifications)
  }
}

export function markAllNotificationsAsRead(userId: string): void {
  const notifications = getNotifications(userId)
  notifications.forEach((n) => (n.read = true))
  saveNotifications(userId, notifications)
}

export function deleteNotification(userId: string, notificationId: string): void {
  const notifications = getNotifications(userId)
  const filtered = notifications.filter((n) => n.id !== notificationId)
  saveNotifications(userId, filtered)
}

export function clearAllNotifications(userId: string): void {
  localStorage.removeItem(`notifications-${userId}`)
}

export function getUnreadCount(userId: string): number {
  const notifications = getNotifications(userId)
  return notifications.filter((n) => !n.read).length
}

// Browser notification API wrapper
export function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!("Notification" in window)) {
    return Promise.resolve("denied")
  }
  return Notification.requestPermission()
}

export function showBrowserNotification(title: string, options?: NotificationOptions): void {
  if (Notification.permission === "granted") {
    new Notification(title, {
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      ...options,
    })
  }
}
