"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchFoodItems } from "@/app/actions/food"
import { useAuth } from "@/lib/auth"
import { useTranslation } from "@/lib/i18n"
import { Package, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import { getDaysUntilExpiry } from "@/lib/food-items" // Added this import
import { cn } from "@/lib/utils" // Added this import for `cn` utility

interface StatsOverviewProps {
  refreshTrigger?: number // Added refresh trigger prop for auto-updates
}

export function StatsOverview({ refreshTrigger }: StatsOverviewProps) {
  const { user } = useAuth()
  const t = useTranslation(user?.language)
  const [stats, setStats] = useState({
    total: 0,
    fresh: 0,
    expiringSoon: 0,
    expired: 0,
    nextExpiry: null as { hours: number; minutes: number } | null,
  })

  const updateStats = async () => {
    if (user) {
      try {
        const items = await fetchFoodItems(user.id)
        if (Array.isArray(items)) {
          const expiringSoonItems = items.filter((item) => item.status === "expiring-soon")
          
          // Find nearest expiry within 24h
          let nearest: { diff: number; hours: number; minutes: number } | null = null;
          const now = new Date().getTime();
          
          items.forEach(item => {
            const expiry = new Date(item.expirationDate).getTime();
            const diff = expiry - now;
            if (diff > 0 && diff <= 24 * 60 * 60 * 1000) {
              if (!nearest || diff < nearest.diff) {
                nearest = { 
                  diff,
                  hours: Math.floor(diff / (1000 * 60 * 60)),
                  minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
                }
              }
            }
          });

          setStats({
            total: items.length,
            fresh: items.filter((item) => item.status === "fresh").length,
            expiringSoon: expiringSoonItems.length,
            expired: items.filter((item) => item.status === "expired").length,
            nextExpiry: nearest ? { hours: (nearest as any).hours, minutes: (nearest as any).minutes } : null,
          })
        }
      } catch (error) {
        console.error("Failed to update stats:", error)
      }
    }
  }

  useEffect(() => {
    updateStats()
  }, [user, refreshTrigger])

  useEffect(() => {
    const interval = setInterval(() => {
      updateStats()
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [user])

  const nextExpiry = stats.nextExpiry; // Define nextExpiry here for use in statsConfig

  const statsConfig = [
    {
      title: t.totalItems,
      value: stats.total,
      description: t.foodItemsTracked,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: t.freshItems,
      value: stats.fresh,
      description: t.stillGoodToEat,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: t.expiringSoon,
      value: stats.expiringSoon,
      description: nextExpiry 
        ? `${t.nextIn} ${nextExpiry.hours}h ${nextExpiry.minutes}m`
        : t.useWithinDays,
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
    {
      title: t.expiredItems,
      value: stats.expired,
      description: t.needAttention,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsConfig.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className={cn("p-2 rounded-lg", stat.bgColor)}>
              <stat.icon className={cn("h-4 w-4", stat.color)} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
