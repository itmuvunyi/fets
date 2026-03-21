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
  }
}

export async function fetchFoodItems(userId: string): Promise<FoodItem[]> {
  try {
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
  const status = calculateStatus(item.expirationDate)
  const food = await db.foodItem.create({
    data: {
      name: item.name,
      category: {
        connectOrCreate: {
          where: { name: item.category },
          create: { name: item.category },
        },
      },
      expirationDate: new Date(item.expirationDate),
      purchaseDate: new Date(item.purchaseDate),
      quantity: item.quantity,
      unit: item.unit,
      status,
      barcode: item.barcode,
      notes: item.notes,
      user: { connect: { id: userId } },
    },
  })
  revalidatePath("/dashboard")
  revalidatePath("/reminders")
  return mapToFoodItem(food)
}

export async function modifyFoodItem(userId: string, itemId: string, updates: Partial<FoodItem>): Promise<FoodItem | null> {
  const dataToUpdate: any = { ...updates }
  
  if (updates.expirationDate) {
    dataToUpdate.expirationDate = new Date(updates.expirationDate)
    dataToUpdate.status = calculateStatus(updates.expirationDate)
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

  try {
    const food = await db.foodItem.update({
      where: { id: itemId, userId },
      data: dataToUpdate,
      include: { category: true },
    })
    revalidatePath("/dashboard")
    revalidatePath("/reminders")
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

export async function searchFoodItems(query: string) {
  if (!query || query.length < 2) return []

  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
        query
      )}&search_simple=1&action=process&json=1&page_size=10`
    )
    const data = await response.json()
    
    return (data.products || []).map((p: any) => ({
      name: p.product_name || p.generic_name || "Unknown Product",
      brand: p.brands || "Unknown Brand",
      image: p.image_small_url || p.image_thumb_url || null,
      category: p.categories_tags?.[0]?.replace("en:", "") || "other",
    }))
  } catch (error) {
    console.error("OpenFoodFacts API error:", error)
    return []
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
