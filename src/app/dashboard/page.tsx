"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth"
import { DashboardHeader } from "@/components/dashboard/header"
import { StatsOverview } from "@/components/dashboard/stats-overview"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { RecentItems } from "@/components/dashboard/recent-items"
import { FoodList } from "@/components/food/food-list"
import { AddFoodForm } from "@/components/food/add-food-form"
import type { FoodItem } from "@/lib/food-items"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"

export default function DashboardPage() {
  const { user } = useAuth()
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleAddSuccess = () => {
    setShowAddForm(false)
    setEditingItem(null)
    setRefreshTrigger((prev) => prev + 1)
  }

  const handleEditItem = (item: FoodItem) => {
    setEditingItem(item)
    setShowAddForm(true)
  }

  if (!user) return null

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back, {user.name.split(' ')[0]}!</h1>
        <p className="text-muted-foreground italic">Track, manage, and never waste food again.</p>
      </div>

      <StatsOverview refreshTrigger={refreshTrigger} />

      {/* Edit Form Modal is still here if needed by other components, but the main dashboard is now just an overview */}
      <Dialog open={showAddForm && !!editingItem} onOpenChange={(open) => !open && setShowAddForm(false)}>
        <DialogContent className="max-w-md p-0 overflow-hidden border-none bg-transparent shadow-none">
          <DialogTitle className="sr-only font-bold">Edit Food Item</DialogTitle>
          <DialogDescription className="sr-only">Update your food item details below.</DialogDescription>
          <AddFoodForm
            editingItem={editingItem!}
            onSuccess={handleAddSuccess}
            onCancel={() => setShowAddForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
