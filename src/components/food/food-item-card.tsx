"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { type FoodItem, FOOD_CATEGORIES, getDaysUntilExpiry } from "@/lib/food-items"
import { removeFoodItem } from "@/app/actions/food"
import { useAuth } from "@/lib/auth"
import { Calendar, Package, Trash2, Edit, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface FoodItemCardProps {
  item: FoodItem
  onEdit: (item: FoodItem) => void
  onDelete: () => void
}

export function FoodItemCard({ item, onEdit, onDelete }: FoodItemCardProps) {
  const { user } = useAuth()
  const [isDeleting, setIsDeleting] = useState(false)
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number } | null>(null)

  const category = FOOD_CATEGORIES.find((cat) => cat.id === item.category)
  const daysUntilExpiry = getDaysUntilExpiry(item.expirationDate)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()
      const expiry = new Date(item.expirationDate)
      const diff = expiry.getTime() - now.getTime()

      if (diff > 0 && diff <= 24 * 60 * 60 * 1000) {
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        setTimeLeft({ hours, minutes })
      } else {
        setTimeLeft(null)
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [item.expirationDate])

  const handleDelete = async () => {
    if (!user) return
    setIsDeleting(true)
    try {
      await removeFoodItem(user.id, item.id)
      onDelete()
    } catch (error) {
      console.error("Failed to delete item:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const getStatusColor = () => {
    switch (item.status) {
      case "expired":
        return "bg-destructive text-destructive-foreground"
      case "expiring-soon":
        return timeLeft ? "bg-amber-500 text-white animate-pulse" : "bg-yellow-500 text-white"
      case "fresh":
        return "bg-green-500 text-white"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusText = () => {
    if (timeLeft && item.status !== "expired") {
      return `${timeLeft.hours}h ${timeLeft.minutes}m remaining`
    }
    switch (item.status) {
      case "expired":
        return `Expired ${Math.abs(daysUntilExpiry)} days ago`
      case "expiring-soon":
        return `Expires in ${daysUntilExpiry} days`
      case "fresh":
        return `Fresh for ${daysUntilExpiry} days`
      default:
        return "Unknown status"
    }
  }

  return (
    <Card
      className={cn(
        "transition-all duration-200 hover:shadow-md",
        item.status === "expired" && "border-destructive/50",
        item.status === "expiring-soon" && "border-yellow-500/50",
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{category?.icon || "📦"}</span>
            <div>
              <h3 className="font-semibold text-lg">{item.name}</h3>
              <p className="text-sm text-muted-foreground">{category?.name}</p>
            </div>
          </div>
          <Badge className={cn(getStatusColor(), "text-[10px] sm:text-xs px-2 py-0.5 h-auto min-h-6 flex items-center whitespace-nowrap")}>
            {item.status === "expired" && <AlertTriangle className="w-3 h-3 mr-1 shrink-0" />}
            <span className="truncate">{getStatusText()}</span>
          </Badge>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Package className="w-4 h-4" />
            <span>
              {item.quantity} {item.unit}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Expires: {item.expirationDate}</span>
          </div>
          {item.notes && <p className="text-sm text-muted-foreground mt-2 p-2 bg-muted rounded">{item.notes}</p>}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(item)} className="flex-1">
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-destructive hover:text-destructive bg-transparent"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
