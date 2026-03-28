import { getDaysUntilExpiry, type FoodItem } from "./food-items"
import { showBrowserNotification } from "./notifications"
import { fetchFoodItems } from "@/app/actions/food"
import { evaluateFoodItems } from "@/app/actions/expiration-logic"

export async function checkExpiringItems(user: { id: string; alertThresholdDays?: number; muteNotificationsUntil?: string | null }): Promise<void> {
  // 1. Centralized Backend sync: This updates DB status, generates DB notifications, and sends real emails synchronously without duplicates.
  await evaluateFoodItems(user.id)
  
  // 2. Fetch fresh items
  const items = await fetchFoodItems(user.id)
  const alertThreshold = user.alertThresholdDays || 3
  const muteUntil = user.muteNotificationsUntil ? new Date(user.muteNotificationsUntil) : null
  const isMuted = muteUntil && muteUntil > new Date()
  
  if (isMuted) return

  items.forEach((item) => {
    const daysUntilExpiry = getDaysUntilExpiry(item.expirationDate)

    if (daysUntilExpiry === -1) {
      showBrowserNotification("Food Expired!", {
        body: `${item.name} expired yesterday`,
        tag: `expired-${item.id}`,
      })
    } else if (daysUntilExpiry === alertThreshold) {
      showBrowserNotification("Food Expiring Soon!", {
        body: `${item.name} expires in ${alertThreshold} days`,
        tag: `expiring-${item.id}`,
      })
    } else if (daysUntilExpiry === 0) {
      showBrowserNotification("Food Expires Today!", {
        body: `${item.name} expires today!`,
        tag: `expires-today-${item.id}`,
      })
    }
  })
}

export function scheduleExpirationChecks(user: { id: string; alertThresholdDays?: number; muteNotificationsUntil?: string | null }): void {
  // Check immediately
  checkExpiringItems(user)

  // Schedule daily checks at 9 AM
  const now = new Date()
  const tomorrow9AM = new Date(now)
  tomorrow9AM.setDate(tomorrow9AM.getDate() + 1)
  tomorrow9AM.setHours(9, 0, 0, 0)

  const timeUntil9AM = tomorrow9AM.getTime() - now.getTime()

  setTimeout(() => {
    checkExpiringItems(user)
    // Then check every 24 hours
    setInterval(() => checkExpiringItems(user), 24 * 60 * 60 * 1000)
  }, timeUntil9AM)
}
