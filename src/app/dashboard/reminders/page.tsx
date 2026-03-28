"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth"
import { fetchFoodItems } from "@/app/actions/food"
import { type FoodItem, getDaysUntilExpiry } from "@/lib/food-items"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calendar, AlertTriangle, Loader2 } from "lucide-react"
import { useTranslation } from "@/lib/i18n"
import { evaluateFoodItems } from "@/app/actions/expiration-logic"

export default function RemindersPage() {
  const { user } = useAuth()
  const t = useTranslation(user?.language)
  const [items, setItems] = useState<FoodItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadItems = async () => {
    if (user) {
      await evaluateFoodItems(user.id) // Ensure statuses are fresh
      const allItems = await fetchFoodItems(user.id)
      const expiringItems = allItems.filter(item => item.status === "expiring-soon" && getDaysUntilExpiry(item.expirationDate) >= 0)
      setItems(expiringItems)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadItems()
  }, [user])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl font-mono">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-yellow-100 rounded-xl text-yellow-600 shadow-sm border border-yellow-200">
          <Calendar className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.reminders}</h1>
          <p className="text-muted-foreground italic">Items that need your attention soon.</p>
        </div>
      </div>

      <Card className="border-2 shadow-sm">
        <CardContent className="p-0">
          {items.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="text-lg">No items currently match this reminder setting.</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-muted font-bold">
                <TableRow className="bg-transparent hover:bg-transparent">
                  <TableHead className="font-bold">Name</TableHead>
                  <TableHead className="font-bold">Category</TableHead>
                  <TableHead className="font-bold">Quantity</TableHead>
                  <TableHead className="font-bold">Expires In</TableHead>
                  <TableHead className="font-bold">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id} className="border-b hover:bg-transparent">
                    <TableCell className="font-bold">{item.name}</TableCell>
                    <TableCell className="capitalize">{item.category}</TableCell>
                    <TableCell>{item.quantity} {item.unit}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        {getDaysUntilExpiry(item.expirationDate)} days
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 cursor-default">
                        Priority
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
