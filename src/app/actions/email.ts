"use server"

import { db } from "@/server/db"

/**
 * Sends an expiration reminder email to the user.
 * Note: In a production app, you'd use a service like Resend or SendGrid.
 * To use Resend:
 * 1. npm install resend
 * 2. Add RESEND_API_KEY to .env
 * 3. Uncomment the Resend block below.
 */
export async function sendExpirationEmail(userId: string, itemId: string) {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
    })

    const item = await db.foodItem.findUnique({
      where: { id: itemId },
    })

    if (!user || !item) return false

    console.log(`[EMAIL SYSTEM] Preparing email for ${user.email}`)
    console.log(`[EMAIL SYSTEM] Subject: Action Required: ${item.name} expires in 1 day!`)
    console.log(`[EMAIL SYSTEM] Body: Hello ${user.name || "User"}, your food item "${item.name}" will expire in 24 hours. Please use it soon to avoid waste!`)

    // Implementation example with Resend:
    /*
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'FETS Reminders <onboarding@resend.dev>',
      to: user.email,
      subject: `Action Required: ${item.name} expires in 1 day!`,
      text: `Hello ${user.name || "User"}, your food item "${item.name}" will expire in 24 hours. Please use it soon to avoid waste!`,
    });
    */

    return true
  } catch (error) {
    console.error("Failed to send expiration email:", error)
    return false
  }
}
