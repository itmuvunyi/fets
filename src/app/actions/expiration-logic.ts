"use server"

import { db } from "@/server/db"
import { revalidatePath } from "next/cache"

import { calculateStatus } from "@/lib/food-items"
import { sendExpirationEmail } from "./email"

export async function evaluateFoodItems(userId: string) {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { alertThresholdDays: true }
    })

    if (!user) return { success: false, message: "User not found" }

    const foodItems = await db.foodItem.findMany({
      where: { userId }
    })

    let changesCount = 0

    for (const item of foodItems) {
      const dateStr = item.expirationDate.toISOString().split("T")[0]
      const newStatus = calculateStatus(dateStr, user.alertThresholdDays)


      if (item.status !== newStatus) {
        // Update status in DB
        await db.foodItem.update({
          where: { id: item.id },
          data: { status: newStatus }
        })
        changesCount++
      }

      // Create notification if it's a concern (even if status didn't change in this run, we check if one exists)
      if (newStatus === "expired") {
        // Check if we already have an "expired" notification for this item
        const existingNotif = await db.notification.findFirst({
          where: { userId, foodItemId: item.id, type: "error" }
        })

        if (!existingNotif) {
          await db.notification.create({
            data: {
              userId,
              foodItemId: item.id,
              title: "Item Expired!",
              message: `${item.name} has passed its expiration date.`,
              type: "error"
            }
          })
          await sendExpirationEmail(userId, item.id)
        }
      } else if (newStatus === "expiring-soon") {
        // Check if we already have an "expiring-soon" notification for this item
        const existingNotif = await db.notification.findFirst({
          where: { userId, foodItemId: item.id, type: "warning" }
        })

        if (!existingNotif) {
          await db.notification.create({
            data: {
              userId,
              foodItemId: item.id,
              title: "Expiring Soon!",
              message: `${item.name} will expire in few days.`,
              type: "warning"
            }
          })
          await sendExpirationEmail(userId, item.id)
        }
      }
    }

    if (changesCount > 0) {
      revalidatePath("/dashboard")
    }

    return { success: true, changesCount }
  } catch (error) {
    console.error("Error evaluating food items:", error)
    return { success: false, error: String(error) }
  }
}
