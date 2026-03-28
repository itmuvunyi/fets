"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FOOD_CATEGORIES, UNITS, type FoodItem } from "@/lib/food-items"
import { createFoodItem, modifyFoodItem } from "@/app/actions/food"
import { useAuth } from "@/lib/auth"
import { Plus, X, Loader2, Scan, Calendar as CalendarIcon, ChevronDown } from "lucide-react"
import { BarcodeScanner } from "@/components/barcode/barcode-scanner"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

import { addToast } from "@/lib/toast"
import { useTranslation } from "@/lib/i18n"

interface AddFoodFormProps {
  onSuccess: () => void
  onCancel: () => void
  initialBarcode?: string // Added optional barcode prop
  editingItem?: FoodItem // Added optional editingItem prop
  title?: string // Custom title
  submitText?: string // Custom submit text
  hideBarcode?: boolean // Hide barcode field
}

export function AddFoodForm({ onSuccess, onCancel, editingItem, initialBarcode, title, submitText, hideBarcode }: AddFoodFormProps) {
  const { user } = useAuth()
  const t = useTranslation(user?.language)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [formData, setFormData] = useState<FoodItem | {
    name: string;
    category: string;
    expirationDate: string;
    purchaseDate: string;
    quantity: number;
    unit: string;
    notes: string;
    barcode: string;
    expirationTime: string;
  }>(
    editingItem
      ? {
        ...editingItem,
        expirationDate: editingItem.expirationDate ? new Date(editingItem.expirationDate).toISOString().split("T")[0] : "",
        purchaseDate: editingItem.purchaseDate ? new Date(editingItem.purchaseDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        barcode: initialBarcode || editingItem.barcode || "",
        expirationTime: editingItem.expirationTime || "12:00",
      }
      : {
        name: "",
        category: "",
        expirationDate: "",
        purchaseDate: new Date().toISOString().split("T")[0],
        quantity: 1,
        unit: "pieces",
        notes: "",
        barcode: initialBarcode || "",
        expirationTime: "12:00",
      }
  )

  const [purchaseOpen, setPurchaseOpen] = useState(false)
  const [expirationOpen, setExpirationOpen] = useState(false)
  const [isScannerOpen, setIsScannerOpen] = useState(false)


  const handleBarcodeDetected = async (barcode: string) => {
    setIsScannerOpen(false) // Close scanner dialog immediately
    setIsSearching(true)
    setFormData(prev => ({ ...prev, barcode })) // Store barcode even if hidden
    
    try {
      // 5-second artificial delay for "detecting" feedback
      await new Promise(resolve => setTimeout(resolve, 5000))

      const response = await fetch("/api/barcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ barcode }),
      })

      const result = await response.json()

      if (result.success && result.data) {
        const product = result.data
        setFormData(prev => ({
          ...prev,
          name: product.name,
          notes: product.brand || prev.notes,
          category: product.category || prev.category,
        }))
        addToast({ title: "Success", description: `Product "${product.name}" found!`, type: "success" })
      } else {
        addToast({ title: "Not Found", description: "the item is not available", type: "error" })
      }
    } catch (error) {
      console.error("Barcode scan processing failed:", error)
      addToast({ title: "Error", description: "An error occurred while searching", type: "error" })
    } finally {
      setIsSearching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    if (!formData.name) {
      addToast({ title: t?.error || "Error", description: "Food name is required", type: "error" })
      return
    }
    if (!formData.category) {
      addToast({ title: t?.error || "Error", description: "Category is required", type: "error" })
      return
    }
    if (!formData.expirationDate) {
      addToast({ title: t?.error || "Error", description: "Expiration date is required", type: "error" })
      return
    }

    setIsSubmitting(true)
    try {
      if (editingItem) {
        await modifyFoodItem(user.id, editingItem.id, formData as any)
        addToast({ title: t.success, description: "Food item updated successfully", type: "success" })
      } else {
        await createFoodItem(user.id, formData as any)
        addToast({ title: t.success, description: "Food item added successfully", type: "success" })
      }
      onSuccess()
    } catch (error) {
      console.error("Failed to save food item:", error)
      addToast({ title: t.error, description: "Failed to save food item", type: "error" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="w-full max-w-md max-h-[90vh] flex flex-col shadow-2xl border-secondary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">{title || (editingItem ? "Edit Food Item" : "Add Food Item")}</CardTitle>
            <CardDescription>{editingItem ? "Update your food item details" : "Track a new food item and its expiration date"}</CardDescription>
          </div>
          <DialogClose className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground ml-auto rounded-full p-1.5 opacity-70 transition-all hover:opacity-100 hover:bg-secondary/10 hover:text-secondary focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
            <X />
            <span className="sr-only">Close</span>
          </DialogClose>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto pr-2">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2 relative">
            <div className="flex items-center justify-between">
              <Label htmlFor="name">Food Name</Label>
              <Dialog open={isScannerOpen} onOpenChange={setIsScannerOpen}>
                <DialogTrigger asChild>
                  <Button type="button" variant="secondary" size="sm" className="h-7 px-2 text-xs gap-1 shadow-sm">
                    <Scan className="h-3 w-3" />
                    Scan Barcode
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md p-0 overflow-hidden border-none shadow-none">
                  <DialogTitle className="sr-only">Barcode Scanner</DialogTitle>
                  <DialogDescription className="sr-only">Point your camera at a barcode to scan or enter it manually.</DialogDescription>
                  <BarcodeScanner
                    onBarcodeDetected={handleBarcodeDetected}
                    onClose={() => setIsScannerOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
            <div className="relative">
              <Input
                id="name"
                placeholder="e.g., Bananas, Milk, Bread"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="pr-10"
                required
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              )}
            </div>

          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => handleChange("category", value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {FOOD_CATEGORIES.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <span className="flex items-center gap-2">
                      <span>{category.icon}</span>
                      {category.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => handleChange("quantity", Number.parseInt(e.target.value) || 1)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Select value={formData.unit} onValueChange={(value) => handleChange("unit", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {UNITS.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 flex flex-col">
              <Label htmlFor="purchaseDate">Purchase Date</Label>
              <Popover open={purchaseOpen} onOpenChange={setPurchaseOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    data-empty={!formData.purchaseDate}
                    className="w-full justify-between text-left font-normal border-input hover:bg-secondary hover:text-secondary-foreground transition-all px-3 data-[empty=true]:bg-secondary data-[empty=true]:text-secondary-foreground data-[empty=true]:border-secondary/20"
                  >
                    {formData.purchaseDate ? format(new Date(formData.purchaseDate), "dd/MM/yyyy") : "Select date"}
                    <ChevronDown className={cn("h-4 w-4 opacity-50", !formData.purchaseDate && "text-secondary-foreground/50 opacity-100")} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-black border-zinc-800" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.purchaseDate ? new Date(formData.purchaseDate) : undefined}
                    onSelect={(date) => {
                      if (date) {
                        const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
                        setFormData({ ...formData, purchaseDate: localDate.toISOString().split('T')[0] });
                        setPurchaseOpen(false)
                      }
                    }}
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date > today;
                    }}
                    captionLayout="dropdown"
                    startMonth={new Date(new Date().getFullYear() - 10, 0)}
                    endMonth={new Date(new Date().getFullYear() + 10, 11)}
                    defaultMonth={formData.purchaseDate ? new Date(formData.purchaseDate) : undefined}
                    initialFocus
                    className="p-3 bg-black text-white"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2 flex flex-col">
              <Label htmlFor="expirationDate">Expiration Date</Label>
              <Popover open={expirationOpen} onOpenChange={setExpirationOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    data-empty={!formData.expirationDate}
                    className="w-full justify-between text-left font-normal border-input hover:bg-secondary hover:text-secondary-foreground transition-all px-3 data-[empty=true]:bg-secondary data-[empty=true]:text-secondary-foreground data-[empty=true]:border-secondary/20"
                  >
                    {formData.expirationDate ? format(new Date(formData.expirationDate), "dd/MM/yyyy") : "Select date"}
                    <ChevronDown className={cn("h-4 w-4 opacity-50", !formData.expirationDate && "text-secondary-foreground/50 opacity-100")} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-black border-zinc-800" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.expirationDate ? new Date(formData.expirationDate) : undefined}
                    onSelect={(date) => {
                      if (date) {
                        const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
                        setFormData({ ...formData, expirationDate: localDate.toISOString().split('T')[0] });
                        setExpirationOpen(false)
                      }
                    }}
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const baseDate = formData.purchaseDate ? new Date(formData.purchaseDate) : today;
                      baseDate.setHours(0, 0, 0, 0);
                      // Use the more restrictive of today vs purchase date
                      const minDate = baseDate > today ? baseDate : today;
                      return date < minDate;
                    }}
                    captionLayout="dropdown"
                    startMonth={new Date(new Date().getFullYear() - 5, 0)}
                    endMonth={new Date(new Date().getFullYear() + 15, 11)}
                    defaultMonth={formData.expirationDate ? new Date(formData.expirationDate) : (formData.purchaseDate ? new Date(formData.purchaseDate) : undefined)}
                    initialFocus
                    className="p-3 bg-black text-white"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {editingItem && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Expiration Hour</Label>
                <Select 
                  value={formData.expirationTime?.split(":")[0] || "12"} 
                  onValueChange={(val) => {
                    const [h, m] = (formData.expirationTime || "12:00").split(":")
                    setFormData({ ...formData, expirationTime: `${val.padStart(2, '0')}:${m}` })
                  }}
                >
                  <SelectTrigger className="bg-background border-2">
                    <SelectValue placeholder="Hour" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {Array.from({ length: 24 }).map((_, i) => (
                      <SelectItem key={i} value={i.toString().padStart(2, '0')}>
                        {i.toString().padStart(2, '0')}h
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Expiration Minute</Label>
                <Select 
                  value={formData.expirationTime?.split(":")[1] || "00"} 
                  onValueChange={(val) => {
                    const [h, m] = (formData.expirationTime || "12:00").split(":")
                    setFormData({ ...formData, expirationTime: `${h}:${val.padStart(2, '0')}` })
                  }}
                >
                  <SelectTrigger className="bg-background border-2">
                    <SelectValue placeholder="Min" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {Array.from({ length: 60 }).map((_, i) => (
                      <SelectItem key={i} value={i.toString().padStart(2, '0')}>
                        {i.toString().padStart(2, '0')}m
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (e.g., Brand, Storage)</Label>
            <Textarea
              id="notes"
              placeholder="Added specific details..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="resize-none"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1 btn-cancel-red">
              Cancel
            </Button>
            <Button type="submit" variant="secondary" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : (!editingItem ? <Plus className="w-4 h-4 mr-2" /> : null)}
              {submitText || (editingItem ? "Update Food" : "Add Food")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
