import { getFoodItems, getDaysUntilExpiry } from "./food-items"
import { addNotification, showBrowserNotification } from "./notifications"
import { sendExpirationEmail } from "@/app/actions/email"

export function checkExpiringItems(userId: string): void {
  const items = getFoodItems(userId)
  const today = new Date()

  items.forEach((item) => {
    const daysUntilExpiry = getDaysUntilExpiry(item.expirationDate)

    // Check if item just expired (within last 24 hours)
    if (daysUntilExpiry === -1) {
      addNotification(userId, {
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

    // Check if item is expiring soon (exactly 3 days before)
    else if (daysUntilExpiry === 3) {
      addNotification(userId, {
        title: "Food Expiring Soon",
        message: `${item.name} expires in 3 days. Use it soon!`,
        type: "warning",
        foodItemId: item.id,
      })
  
      showBrowserNotification("Food Expiring Soon!", {
        body: `${item.name} expires in 3 days`,
        tag: `expiring-${item.id}`,
      })
  
      // Send Email if 3 days left
      sendExpirationEmail(userId, item.id)
    }

    // Check if item expires today
    else if (daysUntilExpiry === 0) {
      addNotification(userId, {
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
  })
}

export function scheduleExpirationChecks(userId: string): void {
  // Check immediately
  checkExpiringItems(userId)

  // Schedule daily checks at 9 AM
  const now = new Date()
  const tomorrow9AM = new Date(now)
  tomorrow9AM.setDate(tomorrow9AM.getDate() + 1)
  tomorrow9AM.setHours(9, 0, 0, 0)

  const timeUntil9AM = tomorrow9AM.getTime() - now.getTime()

  setTimeout(() => {
    checkExpiringItems(userId)
    // Then check every 24 hours
    setInterval(() => checkExpiringItems(userId), 24 * 60 * 60 * 1000)
  }, timeUntil9AM)
}
