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
import { Edit, Trash2, Calendar, MoreHorizontal, AlertTriangle } from "lucide-react"
import { addToast } from "@/lib/toast"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { AddFoodForm } from "@/components/food/add-food-form"
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog"

export function RemindersTable() {
  const { user } = useAuth()
  const [items, setItems] = useState<FoodItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [editingItem, setEditingItem] = useState<FoodItem | null>(null)
  const [showEditForm, setShowEditForm] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const loadItems = async () => {
    if (!user) return
    setIsLoading(true)
    try {
      const allItems = await fetchFoodItems(user.id)
      // Filter for items expiring soon
      const expiringSoon = allItems.filter(item => item.status === "expiring-soon")
      setItems(expiringSoon)
    } catch (error) {
      console.error("Failed to load reminders:", error)
      addToast({ title: "Error", description: "Failed to load reminders", type: "error" })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadItems()
  }, [user])

  const handleDelete = async () => {
    if (!user || !itemToDelete) return
    try {
      const success = await removeFoodItem(user.id, itemToDelete)
      if (success) {
        addToast({ title: "Item Removed", description: "Food item has been deleted.", type: "success" })
        loadItems()
      } else {
        addToast({ title: "Error", description: "Failed to remove item", type: "error" })
      }
    } catch (error) {
      addToast({ title: "Error", description: "An unexpected error occurred", type: "error" })
    } finally {
      setShowDeleteDialog(false)
      setItemToDelete(null)
    }
  }

  const confirmDelete = (itemId: string) => {
    setItemToDelete(itemId)
    setShowDeleteDialog(true)
  }

  const handleEdit = (item: FoodItem) => {
    setEditingItem(item)
    setShowEditForm(true)
  }

  const handleEditSuccess = () => {
    setShowEditForm(false)
    setEditingItem(null)
    loadItems()
    addToast({ title: "Success", description: "Food item updated successfully", type: "success" })
  }

  if (isLoading) return <div className="p-8 text-center">Loading reminders...</div>

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow className="hover:bg-transparent">
            <TableHead className="font-semibold">Product</TableHead>
            <TableHead className="font-semibold">Category</TableHead>
            <TableHead className="font-semibold">Expires In</TableHead>
            <TableHead className="font-semibold text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                No active reminders. Your pantry is looking good!
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <TableRow key={item.id} className="hover:bg-transparent">
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    <Calendar className="w-3 h-3 mr-1" />
                    {item.expirationDate}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleEdit(item)}
                    className="hover:bg-secondary"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <button 
                    onClick={() => confirmDelete(item.id)}
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

      <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
        <DialogContent 
          className="max-w-md p-0 overflow-hidden border-none bg-transparent shadow-none"
          showCloseButton={false}
        >
          <DialogTitle className="sr-only">Edit Food Item</DialogTitle>
          <DialogDescription className="sr-only">Make changes to your food item here.</DialogDescription>
          {editingItem && (
            <AddFoodForm
              editingItem={editingItem}
              onSuccess={handleEditSuccess}
              onCancel={() => setShowEditForm(false)}
              title="Manage Food Reminder"
              submitText="Update Reminder"
              hideBarcode={true}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Remove Reminder?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this food item? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
