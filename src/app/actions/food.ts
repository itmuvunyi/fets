"use server"

import { db } from "@/server/db"
import { type FoodItem, calculateStatus } from "@/lib/food-items"
import { revalidatePath } from "next/cache"

function mapToFoodItem(food: any): FoodItem {
  return {
    id: food.id,
    name: food.name,
    category: food.category?.name || "Uncategorized",
    expirationDate: food.expirationDate.toISOString().split("T")[0],
    purchaseDate: food.purchaseDate.toISOString().split("T")[0],
    quantity: food.quantity,
    unit: food.unit,
    status: food.status as FoodItem["status"],
    barcode: food.barcode || undefined,
    notes: food.notes || undefined,
    userId: food.userId,
    createdAt: food.createdAt.toISOString(),
    expirationTime: food.expirationDate.toTimeString().split(" ")[0].slice(0, 5),
  }
}

import { evaluateFoodItems } from "./expiration-logic"
import { sendExpirationEmail } from "./email"

export async function fetchFoodItems(userId: string): Promise<FoodItem[]> {
  try {
    // Automatically update statuses and notifications before fetching
    await evaluateFoodItems(userId)
    
    const foods = await db.foodItem.findMany({
      where: { userId },
      include: { category: true },
      orderBy: { expirationDate: "asc" },
    })
    return foods.map(mapToFoodItem)
  } catch (error) {
    console.error("Fetch food items error:", error)
    return []
  }
}

export async function createFoodItem(userId: string, item: Omit<FoodItem, "id" | "status" | "userId">): Promise<FoodItem> {
  const expirationDate = new Date(item.expirationDate)
  if (item.expirationTime) {
    const [hours, minutes] = item.expirationTime.split(":").map(Number)
    expirationDate.setHours(hours, minutes)
  }
  
  const status = calculateStatus(expirationDate.toISOString())
  const food = await db.foodItem.create({
    data: {
      name: item.name,
      category: {
        connectOrCreate: {
          where: { name: item.category },
          create: { name: item.category },
        },
      },
      expirationDate,
      purchaseDate: new Date(item.purchaseDate),
      quantity: item.quantity,
      unit: item.unit,
      status,
      barcode: item.barcode,
      notes: item.notes,
      user: { connect: { id: userId } },
    },
  })

  // Create immediate notification if created as expired/expiring
  if (status === "expired") {
    await db.notification.create({
      data: { userId, foodItemId: food.id, title: "Item Expired!", message: `${item.name} has passed its expiration date.`, type: "error" }
    })
    await sendExpirationEmail(userId, food.id)
  } else if (status === "expiring-soon") {
    await db.notification.create({
      data: { userId, foodItemId: food.id, title: "Expiring Soon!", message: `${item.name} will expire in few days.`, type: "warning" }
    })
    await sendExpirationEmail(userId, food.id)
  }

  revalidatePath("/dashboard", "layout")
  return mapToFoodItem(food)
}

export async function modifyFoodItem(userId: string, itemId: string, updates: Partial<FoodItem>): Promise<FoodItem | null> {
  const dataToUpdate: any = { ...updates }

  if (updates.expirationDate) {
    const expirationDate = new Date(updates.expirationDate)
    if (updates.expirationTime) {
      const [hours, minutes] = updates.expirationTime.split(":").map(Number)
      expirationDate.setHours(hours, minutes)
    }
    dataToUpdate.expirationDate = expirationDate
    dataToUpdate.status = calculateStatus(expirationDate.toISOString())
    delete dataToUpdate.expirationTime
  }
  if (updates.purchaseDate) {
    dataToUpdate.purchaseDate = new Date(updates.purchaseDate)
  }

  if (updates.category) {
    const categoryName = updates.category
    delete dataToUpdate.category
    dataToUpdate.category = {
      connectOrCreate: {
        where: { name: categoryName },
        create: { name: categoryName },
      },
    }
  }
  
  delete dataToUpdate.createdAt
  delete dataToUpdate.userId

  try {
    const oldItem = await db.foodItem.findUnique({ where: { id: itemId, userId } })

    const food = await db.foodItem.update({
      where: { id: itemId, userId },
      data: dataToUpdate,
      include: { category: true },
    })

    if (oldItem && oldItem.status !== food.status) {
      if (food.status === "expired") {
        await db.notification.create({
          data: { userId, foodItemId: food.id, title: "Item Expired!", message: `${food.name} has passed its expiration date.`, type: "error" }
        })
        await sendExpirationEmail(userId, food.id)
      } else if (food.status === "expiring-soon") {
        await db.notification.create({
          data: { userId, foodItemId: food.id, title: "Expiring Soon!", message: `${food.name} will expire in few days.`, type: "warning" }
        })
        await sendExpirationEmail(userId, food.id)
      }
    }

    revalidatePath("/dashboard", "layout")
    return mapToFoodItem(food)
  } catch (error) {
    console.error("Modify error:", error)
    return null
  }
}

export async function removeFoodItem(userId: string, itemId: string): Promise<boolean> {
  try {
    await db.foodItem.delete({
      where: { id: itemId, userId },
    })
    revalidatePath("/dashboard")
    revalidatePath("/reminders")
    return true
  } catch (error) {
    return false
  }
}


export async function searchByBarcode(barcode: string) {
  if (!barcode) return null
  try {
    const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`)
    const data = await response.json()
    if (data.status === 1 && data.product) {
      const p = data.product
      return {
        name: p.product_name || p.generic_name || "Unknown Product",
        brand: p.brands || "",
        image: p.image_front_small_url || p.image_small_url || null,
        category: p.categories_tags?.[0]?.replace("en:", "") || "other",
      }
    }
    return null
  } catch (error) {
    console.error("Barcode lookup error:", error)
    return null
  }
}
