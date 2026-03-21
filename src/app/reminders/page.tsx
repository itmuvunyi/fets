"use client"

import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, AlertTriangle, Clock, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { useTranslation } from "@/lib/i18n"
import { getDaysUntilExpiry, type FoodItem } from "@/lib/food-items"
import { fetchFoodItems, removeFoodItem } from "@/app/actions/food"
import { useState, useEffect } from "react"

export default function RemindersPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const t = useTranslation(user?.language)
  const [foodItems, setFoodItems] = useState<FoodItem[]>([])
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    if (user) {
      fetchFoodItems(user.id).then(items => {
        // Filter for expiring soon and expired items
        const urgentItems = items
          .filter((item) => item.status === "expiring-soon" || item.status === "expired")
          .sort((a, b) => {
            // Sort by days until expiry (expired items first, then by urgency)
            const daysA = getDaysUntilExpiry(a.expirationDate)
            const daysB = getDaysUntilExpiry(b.expirationDate)
            return daysA - daysB
          })
        setFoodItems(urgentItems)
      })
    }
  }, [user, refreshTrigger])
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth")
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>{t.loading || "Loading..."}</p>
      </div>
    )
  }

  const handleDeleteItem = async (itemId: string) => {
    const success = await removeFoodItem(user.id, itemId)
    if (success) {
      setRefreshTrigger((prev) => prev + 1)
    }
  }

  const expiredItems = foodItems.filter((item) => item.status === "expired")
  const expiringSoonItems = foodItems.filter((item) => item.status === "expiring-soon")

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.back || "Back"}
          </Button>
          <h1 className="text-3xl font-bold">{t.reminders || "Reminders"}</h1>
          <p className="text-muted-foreground mt-2">{t.remindersDescription || "Items that need your attention"}</p>
        </div>

        <div className="grid gap-6 max-w-4xl">
          {/* Expired Items */}
          {expiredItems.length > 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <AlertTriangle className="w-5 h-5" />
                  {t.expiredItems || "Expired Items"} ({expiredItems.length})
                </CardTitle>
                <CardDescription className="text-red-600">
                  {t.expiredItemsDescription || "These items have passed their expiration date"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {expiredItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{item.name}</h3>
                          <Badge variant="destructive">{t.expired || "Expired"}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} {item.unit} • {t.category || "Category"}: {item.category}
                        </p>
                        <p className="text-sm text-red-600">
                          {t.expiredOn || "Expired on"}: {item.expirationDate}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Expiring Soon Items */}
          {expiringSoonItems.length > 0 && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-700">
                  <Clock className="w-5 h-5" />
                  {t.expiringSoon || "Expiring Soon"} ({expiringSoonItems.length})
                </CardTitle>
                <CardDescription className="text-yellow-600">
                  {t.expiringSoonDescription || "These items will expire within 3 days"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {expiringSoonItems.map((item) => {
                    const daysLeft = getDaysUntilExpiry(item.expirationDate)
                    return (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{item.name}</h3>
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                              {daysLeft === 0
                                ? t.expiresToday || "Expires today"
                                : daysLeft === 1
                                  ? t.expiresTomorrow || "Expires tomorrow"
                                  : `${daysLeft} ${t.daysLeft || "days left"}`}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {item.quantity} {item.unit} • {t.category || "Category"}: {item.category}
                          </p>
                          <p className="text-sm text-yellow-600">
                            {t.expiresOn || "Expires on"}: {item.expirationDate}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-muted-foreground hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* No Items */}
          {foodItems.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">{t.noReminders || "No urgent reminders"}</h3>
                <p className="text-muted-foreground">
                  {t.noRemindersDescription || "All your food items are fresh! Check back later."}
                </p>
                <Button onClick={() => router.push("/")} className="mt-4">
                  {t.backToDashboard || "Back to Dashboard"}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
