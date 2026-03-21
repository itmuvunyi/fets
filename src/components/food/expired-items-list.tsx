"use client"

import { useEffect, useState } from "react"
import { type FoodItem } from "@/lib/food-items"
import { fetchFoodItems } from "@/app/actions/food"
import { useAuth } from "@/lib/auth"
import { FoodItemCard } from "./food-item-card"

export function ExpiredItemsList() {
  const { user } = useAuth()
  const [items, setItems] = useState<FoodItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadItems = async () => {
      if (!user) return
      const allItems = await fetchFoodItems(user.id)
      setItems(allItems.filter(item => item.status === "expired"))
      setIsLoading(false)
    }
    loadItems()
  }, [user])

  if (isLoading) return <div className="p-8 text-center">Loading expired items...</div>

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-primary flex items-center gap-2">
        Expired Inventory
        <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-1 rounded-full">{items.length}</span>
      </h2>
      {items.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-xl border-2 border-dashed">
          <p className="text-muted-foreground">No expired items found. Great job managing your food!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <FoodItemCard 
              key={item.id} 
              item={item} 
              onEdit={() => {}} 
              onDelete={() => setItems(items.filter(i => i.id !== item.id))} 
            />
          ))}
        </div>
      )}
    </div>
  )
}
