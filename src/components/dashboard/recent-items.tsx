"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { type FoodItem, FOOD_CATEGORIES, getDaysUntilExpiry } from "@/lib/food-items"
import { fetchFoodItems } from "@/app/actions/food"
import { useAuth } from "@/lib/auth"
import { Calendar, AlertTriangle, ArrowRight } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface RecentItemsProps {
  refreshTrigger?: number
  showAll?: boolean
}

export function RecentItems({ refreshTrigger, showAll = false }: RecentItemsProps) {
  const { user } = useAuth()
  const [recentItems, setRecentItems] = useState<FoodItem[]>([])

  useEffect(() => {
    if (user) {
      fetchFoodItems(user.id).then(items => {
        // Sort by creation date or purchase date (most recent first)
        const sorted = items
          .sort((a, b) => {
            const dateA = new Date(a.createdAt || a.purchaseDate).getTime()
            const dateB = new Date(b.createdAt || b.purchaseDate).getTime()
            return dateB - dateA
          })
        
        setRecentItems(showAll ? sorted : sorted.slice(0, 5))
      })
    }
  }, [user, refreshTrigger])

  const getStatusColor = (status: FoodItem["status"]) => {
    switch (status) {
      case "expired":
        return "bg-destructive text-destructive-foreground"
      case "expiring-soon":
        return "bg-yellow-500 text-white"
      case "fresh":
        return "bg-green-500 text-white"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Items</CardTitle>
        <CardDescription>Your latest food additions</CardDescription>
      </CardHeader>
      <CardContent>
        {recentItems.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">📦</div>
            <p className="text-muted-foreground">No items added yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentItems.map((item) => {
              const category = FOOD_CATEGORIES.find((cat) => cat.id === item.category)
              const daysUntilExpiry = getDaysUntilExpiry(item.expirationDate)

              return (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{category?.icon || "📦"}</span>
                    <div>
                      <div className="font-medium text-sm sm:text-base">{item.name}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {item.quantity} {item.unit}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.status === "expired" && <AlertTriangle className="w-4 h-4 text-destructive" />}
                    <Badge className={cn(getStatusColor(item.status), "text-[10px] sm:text-xs")} variant="secondary">
                      {item.status === "expired"
                        ? `${Math.abs(daysUntilExpiry)}d ago`
                        : item.status === "expiring-soon"
                          ? `${daysUntilExpiry}d left`
                          : `${daysUntilExpiry}d fresh`}
                    </Badge>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {!showAll && recentItems.length >= 5 && (
          <div className="mt-4 pt-4 border-t">
            <Link 
              href="/dashboard/recent" 
              className="text-sm font-medium text-primary hover:underline flex items-center justify-center gap-1"
            >
              View All Recent Items
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
