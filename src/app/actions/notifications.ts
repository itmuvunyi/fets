"use server"

import { db } from "@/server/db"
import { revalidatePath } from "next/cache"

export async function getNotifications(userId: string) {
  try {
    return await db.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    })
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return []
  }
}

export async function getUnreadCount(userId: string) {
  try {
    return await db.notification.count({
      where: { userId, read: false },
    })
  } catch (error) {
    console.error("Error fetching unread count:", error)
    return 0
  }
}

export async function markNotificationAsRead(id: string) {
  try {
    await db.notification.update({
      where: { id },
      data: { read: true },
    })
    revalidatePath("/dashboard", "layout")
    return { success: true }
  } catch (error) {
    console.error("Error marking notification as read:", error)
    return { success: false }
  }
}

export async function markAllNotificationsAsRead(userId: string) {
  try {
    await db.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    })
    revalidatePath("/dashboard", "layout")
    return { success: true }
  } catch (error) {
    console.error("Error marking all notifications as read:", error)
    return { success: false }
  }
}

export async function deleteNotification(id: string) {
  try {
    await db.notification.delete({
      where: { id },
    })
    revalidatePath("/dashboard", "layout")
    return { success: true }
  } catch (error) {
    console.error("Error deleting notification:", error)
    return { success: false }
  }
}

export async function clearAllNotifications(userId: string) {
  try {
    await db.notification.deleteMany({
      where: { userId },
    })
    revalidatePath("/dashboard", "layout")
    return { success: true }
  } catch (error) {
    console.error("Error clearing all notifications:", error)
    return { success: false }
  }
}

export async function createNotification(userId: string, title: string, message: string, type: string = "info", foodItemId?: string) {
  try {
    const notification = await db.notification.create({
      data: {
        userId,
        title,
        message,
        type,
        foodItemId,
      },
    })
    revalidatePath("/dashboard", "layout")
    return notification
  } catch (error) {
    console.error("Error creating notification:", error)
    return null
  }
}
