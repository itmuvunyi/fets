"use client"

import { useState, useEffect } from "react"
import { type FoodItem } from "@/lib/food-items"
import { fetchFoodItems } from "@/app/actions/food"
import { useAuth } from "@/lib/auth"
import { FoodItemCard } from "./food-item-card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FOOD_CATEGORIES } from "@/lib/food-items"
import { Search, Filter } from "lucide-react"

interface FoodListProps {
  onEditItem: (item: FoodItem) => void
  refreshTrigger: number
}

export function FoodList({ onEditItem, refreshTrigger }: FoodListProps) {
  const { user } = useAuth()
  const [items, setItems] = useState<FoodItem[]>([])
  const [filteredItems, setFilteredItems] = useState<FoodItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  useEffect(() => {
    if (user) {
      loadItems()
    }
  }, [user, refreshTrigger])

  useEffect(() => {
    filterItems()
  }, [items, searchTerm, statusFilter, categoryFilter])

  const loadItems = async () => {
    if (!user) return
    const userItems = await fetchFoodItems(user.id)
    setItems(userItems)
  }

  const filterItems = () => {
    let filtered = [...items]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((item) => item.status === statusFilter)
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((item) => item.category === categoryFilter)
    }

    // Sort by expiration date (soonest first)
    filtered.sort((a, b) => new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime())

    setFilteredItems(filtered)
  }

  const handleDeleteItem = () => {
    loadItems() // Refresh the list after deletion
  }

  if (!user) return null

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search food items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="fresh">Fresh</SelectItem>
            <SelectItem value="expiring-soon">Expiring Soon</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {FOOD_CATEGORIES.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.icon} {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🍽️</div>
          <h3 className="text-lg font-semibold mb-2">No food items found</h3>
          <p className="text-muted-foreground">
            {items.length === 0
              ? "Start by adding your first food item to track its expiration date."
              : "Try adjusting your search or filter criteria."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <FoodItemCard key={item.id} item={item} onEdit={onEditItem} onDelete={handleDeleteItem} />
          ))}
        </div>
      )}
    </div>
  )
}
