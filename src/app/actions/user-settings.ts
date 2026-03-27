"use server"

import { db } from "@/server/db"
import { revalidatePath } from "next/cache"

export async function updateUserSettings(userId: string, data: { alertThresholdDays?: number, muteNotificationsUntil?: string | null }) {
  if (!userId) return { success: false, error: "User ID is required" }

  try {
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        alertThresholdDays: data.alertThresholdDays,
        muteNotificationsUntil: data.muteNotificationsUntil ? new Date(data.muteNotificationsUntil) : null,
      },
    })

    revalidatePath("/dashboard")
    return { success: true, user: updatedUser }
  } catch (error) {
    console.error("Error updating user settings:", error)
    return { success: false, error: "Failed to update settings" }
  }
}

export async function getUserSettings(userId: string) {
  if (!userId) return null

  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        alertThresholdDays: true,
        muteNotificationsUntil: true,
      }
    })
    return user
  } catch (error) {
    console.error("Error fetching user settings:", error)
    return null
  }
}
