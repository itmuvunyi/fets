import { getDaysUntilExpiry, type FoodItem } from "./food-items"
import { addNotification, showBrowserNotification } from "./notifications"
import { sendExpirationEmail } from "@/app/actions/email"
import { fetchFoodItems } from "@/app/actions/food"

export async function checkExpiringItems(user: { id: string; alertThresholdDays?: number; muteNotificationsUntil?: string | null }): Promise<void> {
  const items = await fetchFoodItems(user.id)
  const alertThreshold = user.alertThresholdDays || 3
  const muteUntil = user.muteNotificationsUntil ? new Date(user.muteNotificationsUntil) : null
  const isMuted = muteUntil && muteUntil > new Date()

  items.forEach((item) => {
    const daysUntilExpiry = getDaysUntilExpiry(item.expirationDate)

    // Check if item just expired (within last 24 hours)
    if (daysUntilExpiry === -1) {
      if (!isMuted) {
        addNotification(user.id, {
          title: "Food Item Expired",
          message: `${item.name} expired yesterday. Consider removing it from your inventory.`,
          type: "error",
          foodItemId: item.id,
        })

        showBrowserNotification("Food Expired!", {
          body: `${item.name} expired yesterday`,
          tag: `expired-${item.id}`,
        })
      }
    }

    // Check if item is expiring soon (exactly alertThreshold days before)
    else if (daysUntilExpiry === alertThreshold) {
      if (!isMuted) {
        addNotification(user.id, {
          title: "Food Expiring Soon",
          message: `${item.name} expires in ${alertThreshold} days. Use it soon!`,
          type: "warning",
          foodItemId: item.id,
        })
    
        showBrowserNotification("Food Expiring Soon!", {
          body: `${item.name} expires in ${alertThreshold} days`,
          tag: `expiring-${item.id}`,
        })
    
        // Send Email if threshold reached
        sendExpirationEmail(user.id, item.id)
      }
    }

    // Check if item expires today
    else if (daysUntilExpiry === 0) {
      if (!isMuted) {
        addNotification(user.id, {
          title: "Food Expires Today",
          message: `${item.name} expires today! Use it now or it will go bad.`,
          type: "error",
          foodItemId: item.id,
        })

        showBrowserNotification("Food Expires Today!", {
          body: `${item.name} expires today!`,
          tag: `expires-today-${item.id}`,
        })
      }
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
