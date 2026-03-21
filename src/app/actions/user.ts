"use server"

import { db } from "@/server/db"
import bcrypt from "bcryptjs"

export async function syncUserToDatabase(id: string, email: string, name?: string, password?: string) {
  console.log("Syncing user:", { id, email, name, password: password ? "[PROVIDED]" : "[MISSING]" });
  if (!id || !email) {
    console.error("Sync failed: Missing required fields");
    return { success: false, error: "Missing required fields" }
  }

  try {
    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { id }
    })

    if (existingUser) {
      console.log("User already exists in Prisma DB:", id);
      return { success: true, user: existingUser }
    }

    // Hash password if provided
    let hashedPassword = ""
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10)
    }

    // Create new user in our public.User table to match Supabase auth.users
    const newUser = await db.user.create({
      data: {
        id,
        email,
        name: name || "",
        password: hashedPassword,
      }
    })

    return { success: true, user: newUser }
  } catch (error) {
    console.error("Error syncing user to database:", error)
    return { success: false, error: "Failed to sync user" }
  }
}
