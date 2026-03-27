export interface FoodItem {
  id: string
  name: string
  category: string
  expirationDate: string
  purchaseDate: string
  quantity: number
  unit: string
  status: "fresh" | "expiring-soon" | "expired"
  barcode?: string
  notes?: string
  userId: string
}

export interface FoodCategory {
  id: string
  name: string
  icon: string
}

import { useTranslation, type Language } from "./i18n"

export const FOOD_CATEGORIES: FoodCategory[] = [
  { id: "fruits", name: "Fruits", icon: "🍎" },
  { id: "vegetables", name: "Vegetables", icon: "🥕" },
  { id: "dairy", name: "Dairy", icon: "🥛" },
  { id: "meat", name: "Meat & Fish", icon: "🥩" },
  { id: "grains", name: "Grains & Cereals", icon: "🌾" },
  { id: "beverages", name: "Beverages", icon: "🥤" },
  { id: "snacks", name: "Snacks", icon: "🍪" },
  { id: "condiments", name: "Condiments", icon: "🧂" },
  { id: "frozen", name: "Frozen Foods", icon: "🧊" },
  { id: "other", name: "Other", icon: "📦" },
]

export function getLocalizedCategories(language: Language = "en"): FoodCategory[] {
  const t = useTranslation(language)
  return [
    { id: "fruits", name: t.fruits, icon: "🍎" },
    { id: "vegetables", name: t.vegetables, icon: "🥕" },
    { id: "dairy", name: t.dairy, icon: "🥛" },
    { id: "meat", name: t.meatFish, icon: "🥩" },
    { id: "grains", name: t.grainsCereals, icon: "🌾" },
    { id: "beverages", name: t.beverages, icon: "🥤" },
    { id: "snacks", name: t.snacks, icon: "🍪" },
    { id: "condiments", name: t.condiments, icon: "🧂" },
    { id: "frozen", name: t.frozenFoods, icon: "🧊" },
    { id: "other", name: t.other, icon: "📦" },
  ]
}

export const UNITS = [
  "pieces",
  "kg",
  "g",
  "liters",
  "ml",
  "cups",
  "tablespoons",
  "teaspoons",
  "cans",
  "bottles",
  "packages",
]

export function calculateStatus(expirationDate: string, alertThreshold = 3): FoodItem["status"] {
  const today = new Date()
  const expiry = new Date(expirationDate)
  const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (daysUntilExpiry < 0) return "expired"
  if (daysUntilExpiry <= alertThreshold) return "expiring-soon"
  return "fresh"
}

export function getDaysUntilExpiry(expirationDate: string): number {
  const today = new Date()
  const expiry = new Date(expirationDate)
  return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}
