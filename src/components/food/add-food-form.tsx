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
import { createFoodItem, searchFoodItems, searchByBarcode, modifyFoodItem } from "@/app/actions/food"
import { useAuth } from "@/lib/auth"
import { Plus, X, Loader2, Scan, Calendar as CalendarIcon, ChevronDown } from "lucide-react"
import { useDebounce } from "@/hooks/use-debounce"
import { BarcodeScanner } from "@/components/barcode/barcode-scanner"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface AddFoodFormProps {
  onSuccess: () => void
  onCancel: () => void
  initialBarcode?: string // Added optional barcode prop
  editingItem?: FoodItem // Added optional editingItem prop
}

export function AddFoodForm({ onSuccess, onCancel, editingItem, initialBarcode }: AddFoodFormProps) {
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<FoodItem | {
    name: string;
    category: string;
    expirationDate: string;
    purchaseDate: string;
    quantity: number;
    unit: string;
    notes: string;
    barcode: string;
  }>(
    editingItem
      ? {
          ...editingItem,
          expirationDate: editingItem.expirationDate ? new Date(editingItem.expirationDate).toISOString().split("T")[0] : "",
          purchaseDate: editingItem.purchaseDate ? new Date(editingItem.purchaseDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
          barcode: initialBarcode || editingItem.barcode || "",
        }
      : {
          name: "",
          category: "",
          expirationDate: "", // Clear default
          purchaseDate: "",   // Clear default
          quantity: 1,
          unit: "pieces",
          notes: "",
          barcode: initialBarcode || "",
        }
  )
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [purchaseOpen, setPurchaseOpen] = useState(false)
  const [expirationOpen, setExpirationOpen] = useState(false)
  
  const debouncedName = useDebounce(formData.name, 500)

  useEffect(() => {
    if (debouncedName && debouncedName.length >= 2 && !isSubmitting) {
      handleLiveSearch()
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [debouncedName])

  const handleLiveSearch = async () => {
    setIsSearching(true)
    const results = await searchFoodItems(debouncedName)
    setSuggestions(results)
    setShowSuggestions(results.length > 0)
    setIsSearching(false)
  }

  const handleBarcodeDetected = async (barcode: string) => {
    setIsSearching(true)
    try {
      const product = await searchByBarcode(barcode)
      if (product) {
        setFormData(prev => ({
          ...prev,
          name: product.name,
          notes: product.brand || prev.notes,
          category: product.category || prev.category,
          barcode: barcode
        }))
      }
    } catch (error) {
      console.error("Barcode scan processing failed:", error)
    } finally {
      setIsSearching(false)
      setShowSuggestions(false)
    }
  }

  const handleSelectSuggestion = (s: any) => {
    setFormData(prev => ({
      ...prev,
      name: s.name,
      notes: s.brand || prev.notes,
      category: s.category || prev.category
    }))
    setSuggestions([])
    setShowSuggestions(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsSubmitting(true)
    try {
      if (editingItem) {
        await modifyFoodItem(user.id, editingItem.id, formData as any)
      } else {
        await createFoodItem(user.id, formData as any)
      }
      onSuccess()
    } catch (error) {
      console.error("Failed to save food item:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="w-full max-w-md max-h-[90vh] flex flex-col shadow-2xl border-primary/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Add Food Item</CardTitle>
            <CardDescription>Track a new food item and its expiration date</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel} className="h-8 w-8 p-0 rounded-full hover:bg-primary/10 hover:text-primary">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/20">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2 relative">
            <div className="flex items-center justify-between">
              <Label htmlFor="name">Food Name</Label>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="default" size="sm" className="h-7 px-2 text-xs gap-1 shadow-sm">
                    <Scan className="h-3 w-3" />
                    Scan Barcode
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md p-0 overflow-hidden border-none shadow-none">
                  <DialogTitle className="sr-only">Barcode Scanner</DialogTitle>
                  <DialogDescription className="sr-only">Point your camera at a barcode to scan.</DialogDescription>
                  <BarcodeScanner 
                    onBarcodeDetected={(barcode) => {
                      handleBarcodeDetected(barcode)
                    }} 
                    onClose={() => {}} 
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
            
            {showSuggestions && (
              <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-xl border overflow-hidden max-h-60 overflow-y-auto">
                {suggestions.map((s, idx) => (
                  <div 
                    key={idx} 
                    className="p-3 hover:bg-amber-50 cursor-pointer flex items-center gap-3 border-b last:border-0 transition-colors"
                    onClick={() => handleSelectSuggestion(s)}
                  >
                    {s.image ? (
                      <img src={s.image} alt={s.name} className="w-10 h-10 object-contain rounded bg-gray-50" />
                    ) : (
                      <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-[10px] text-gray-400">NO IMG</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate leading-tight">{s.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate uppercase tracking-wider">{s.brand}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {formData.barcode && (
            <div className="space-y-2">
              <Label htmlFor="barcode">Barcode</Label>
              <Input
                id="barcode"
                value={formData.barcode}
                onChange={(e) => handleChange("barcode", e.target.value)}
                placeholder="Scanned barcode will appear here"
                readOnly
                className="bg-muted"
              />
            </div>
          )}

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
                    variant="outline"
                    data-empty={!formData.purchaseDate}
                    className="w-full justify-between text-left font-normal border-input hover:bg-secondary hover:text-secondary-foreground transition-all px-3 data-[empty=true]:bg-primary data-[empty=true]:text-white data-[empty=true]:border-primary"
                  >
                    {formData.purchaseDate ? format(new Date(formData.purchaseDate), "yyyy-MM-dd") : "Select date"}
                    <ChevronDown className={cn("h-4 w-4 opacity-50", !formData.purchaseDate && "text-white opacity-100")} />
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
                    variant="outline"
                    data-empty={!formData.expirationDate}
                    className="w-full justify-between text-left font-normal border-input hover:bg-secondary hover:text-secondary-foreground transition-all px-3 data-[empty=true]:bg-primary data-[empty=true]:text-white data-[empty=true]:border-primary"
                  >
                    {formData.expirationDate ? format(new Date(formData.expirationDate), "yyyy-MM-dd") : "Select date"}
                    <ChevronDown className={cn("h-4 w-4 opacity-50", !formData.expirationDate && "text-white opacity-100")} />
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
                    defaultMonth={formData.expirationDate ? new Date(formData.expirationDate) : (formData.purchaseDate ? new Date(formData.purchaseDate) : undefined)}
                    initialFocus
                    className="p-3 bg-black text-white"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

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
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
              {"Add Food"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
