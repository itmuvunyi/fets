"use server"

import { db } from "@/server/db"
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendExpirationEmail(userId: string, itemId: string) {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
    })

    const item = await db.foodItem.findUnique({
      where: { id: itemId },
    })

    if (!user || !item) return false

    const isExpired = new Date(item.expirationDate) <= new Date()
    const subject = isExpired 
      ? `🚨 Urgent: ${item.name} has EXPIRED!` 
      : `⚠️ Reminder: ${item.name} expires in 3 days!`
    
    const message = isExpired
      ? `Hello ${user.name || "User"},\n\nYour food item "${item.name}" has officially expired. Please check your inventory and remove it to maintain food safety.\n\nBest regards,\nFETS Team`
      : `Hello ${user.name || "User"},\n\nYour food item "${item.name}" is reaching its expiration date in 3 days. Please try to use it soon to avoid waste!\n\nBest regards,\nFETS Team`

    await transporter.sendMail({
      from: `"FETS Reminders" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: subject,
      text: message,
    })

    console.log(`[EMAIL SENT] Notification for ${item.name} sent to ${user.email}`)
    return true
  } catch (error) {
    console.error("Failed to send expiration email:", error)
    return false
  }
}
