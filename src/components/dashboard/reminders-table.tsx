"use client"

import { useEffect, useState } from "react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { type FoodItem } from "@/lib/food-items"
import { fetchFoodItems, removeFoodItem } from "@/app/actions/food"
import { useAuth } from "@/lib/auth"
import { Edit, Trash2, Calendar } from "lucide-react"

export function RemindersTable() {
  const { user } = useAuth()
  const [items, setItems] = useState<FoodItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadItems = async () => {
    if (!user) return
    const allItems = await fetchFoodItems(user.id)
    // Filter for items expiring soon or fresh but with a reminder
    const expiringSoon = allItems.filter(item => item.status === "expiring-soon")
    setItems(expiringSoon)
    setIsLoading(false)
  }

  useEffect(() => {
    loadItems()
  }, [user])

  const handleDelete = async (itemId: string) => {
    if (!user) return
    await removeFoodItem(user.id, itemId)
    loadItems()
  }

  if (isLoading) return <div className="p-8 text-center">Loading reminders...</div>

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Expires In</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                No active reminders. Your pantry is looking good!
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    <Calendar className="w-3 h-3 mr-1" />
                    {item.expirationDate}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="p-2 hover:bg-destructive/10 text-destructive rounded-md transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
