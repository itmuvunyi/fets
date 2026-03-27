"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth"
import { DashboardHeader } from "@/components/dashboard/header"
import { StatsOverview } from "@/components/dashboard/stats-overview"
import { Button } from "@/components/ui/button"
import { FoodList } from "@/components/food/food-list"
import { AddFoodForm } from "@/components/food/add-food-form"
import { type FoodItem } from "@/lib/food-items"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Info, AlertTriangle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { updateUserSettings } from "@/app/actions/user-settings"
import { addToast } from "@/lib/toast"
import { fetchFoodItems } from "@/app/actions/food"
import { useEffect } from "react"

export default function DashboardPage() {
  const { user } = useAuth()
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [foodItems, setFoodItems] = useState<FoodItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadFood() {
      if (user) {
        setIsLoading(true)
        const items = await fetchFoodItems(user.id)
        setFoodItems(items || [])
        setIsLoading(false)
      }
    }
    loadFood()
  }, [user, refreshTrigger])

  const handleAddSuccess = () => {
    setShowAddForm(false)
    setEditingItem(null)
    setRefreshTrigger((prev) => prev + 1)
  }

  const dairyItems = foodItems.filter(item => item.category === "dairy")
  const isDairyDominant = foodItems.length > 0 && (dairyItems.length / foodItems.length) >= 0.5
  const showDairySuggestion = isDairyDominant && (user?.alertThresholdDays || 3) > 2

  const handleEditItem = (item: FoodItem) => {
    setEditingItem(item)
    setShowAddForm(true)
  }

  if (!user) return null

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground animate-pulse text-lg">Loading your inventory...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back, {user.name.split(' ')[0]}!</h1>
        <p className="text-muted-foreground italic">Track, manage, and never waste food again.</p>
      </div>

      {showDairySuggestion && (
        <Card className="bg-amber-50 border-amber-200 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-amber-900">Smart Alert Suggestion</h3>
              <p className="text-sm text-amber-800">
                You store mostly dairy products. We suggest setting your expiry alerts to <strong>2 days</strong> for better freshness tracking.
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white border-amber-200 hover:bg-amber-100 text-amber-900"
              onClick={async () => {
                const result = await updateUserSettings(user.id, { alertThresholdDays: 2 })
                if (result.success) {
                  addToast({ title: "Settings Updated", description: "Your alert threshold is now set to 2 days.", type: "success" })
                  window.location.reload()
                }
              }}
            >
              Apply Now
            </Button>
          </CardContent>
        </Card>
      )}

      <StatsOverview refreshTrigger={refreshTrigger} />

      {/* Food List Section */}
      <FoodList onEditItem={handleEditItem} refreshTrigger={refreshTrigger} />

      {/* Edit Form Modal */}
      <Dialog open={showAddForm && !!editingItem} onOpenChange={(open) => !open && setShowAddForm(false)}>
        <DialogContent 
          className="max-w-md p-0 overflow-hidden border-none bg-transparent shadow-none"
          showCloseButton={false}
        >
          <DialogTitle className="sr-only font-bold">Edit Food Item</DialogTitle>
          <DialogDescription className="sr-only">Update your food item details below.</DialogDescription>
          {editingItem && (
            <AddFoodForm
              editingItem={editingItem}
              onSuccess={handleAddSuccess}
              onCancel={() => setShowAddForm(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
