"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth"
import { fetchFoodItems } from "@/app/actions/food"
import { type FoodItem, FOOD_CATEGORIES } from "@/lib/food-items"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Archive, 
  AlertTriangle, 
  Loader2, 
  BarChart3, 
  ChevronRight, 
  Download, 
  Filter,
  PieChart
} from "lucide-react"
import { useTranslation } from "@/lib/i18n"
import { evaluateFoodItems } from "@/app/actions/expiration-logic"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { addToast } from "@/lib/toast"

export default function ExpiredPage() {
  const { user } = useAuth()
  const t = useTranslation(user?.language)
  const [items, setItems] = useState<FoodItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [reportRange, setReportRange] = useState("all")
  const [isReportOpen, setIsReportOpen] = useState(false)

  const loadItems = async () => {
    if (user) {
      await evaluateFoodItems(user.id)
      const allItems = await fetchFoodItems(user.id)
      const expiredItems = allItems.filter(item => item.status === "expired")
      setItems(expiredItems)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadItems()
  }, [user])

  const filterByRange = (items: FoodItem[], range: string) => {
    const now = new Date()
    const filterDate = new Date()
    
    if (range === "daily") filterDate.setDate(now.getDate() - 1)
    else if (range === "weekly") filterDate.setDate(now.getDate() - 7)
    else if (range === "monthly") filterDate.setMonth(now.getMonth() - 1)
    else if (range === "yearly") filterDate.setFullYear(now.getFullYear() - 1)
    else return items

    return items.filter(item => new Date(item.expirationDate) >= filterDate)
  }

  const reportItems = filterByRange(items, reportRange)
  const totalWastedValue = reportItems.length * 10 
  
  const categorySummary = FOOD_CATEGORIES.map(cat => ({
    ...cat,
    count: reportItems.filter(item => item.category === cat.id).length
  })).filter(cat => cat.count > 0)

  const handleExportCSV = () => {
    if (reportItems.length === 0) {
      addToast({ title: "Export Failed", description: "No items match the selected range to export.", type: "error" })
      return
    }

    const headers = ["Item Name", "Category", "Quantity", "Unit", "Expired Date", "Purchase Date", "Notes"]
    
    const csvContent = [
      headers.join(","),
      ...reportItems.map(item => {
        return [
          `"${item.name.replace(/"/g, '""')}"`,
          `"${item.category}"`,
          item.quantity,
          `"${item.unit}"`,
          `"${item.expirationDate}"`,
          `"${item.purchaseDate}"`,
          `"${(item.notes || '').replace(/"/g, '""').replace(/\n/g, " ")}"`
        ].join(",")
      })
    ].join("\n")

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `fets_expired_report_${reportRange}_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    addToast({ title: "Export Successful", description: "Your CSV file has been downloaded.", type: "success" })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl font-mono">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-100 rounded-xl text-red-600 shadow-sm border border-red-200">
            <Archive className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t.expiredItems}</h1>
            <p className="text-muted-foreground italic">Review items that passed their expiration date.</p>
          </div>
        </div>

        <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-primary hover:bg-primary/90 rounded-xl shadow-lg shadow-primary/20">
              <BarChart3 className="w-4 h-4" />
              View Reports
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl font-mono border-2">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-2xl">
                <PieChart className="w-6 h-6 text-primary" />
                Waste Analytics Report
              </DialogTitle>
              <DialogDescription>
                Summary of food items that expired within the selected range.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-2xl border">
                <div className="flex-1">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Select Range</p>
                  <Select value={reportRange} onValueChange={setReportRange}>
                    <SelectTrigger className="bg-background border-2 rounded-xl h-10 font-bold">
                      <SelectValue placeholder="Select Range" />
                    </SelectTrigger>
                    <SelectContent className="font-mono rounded-xl">
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="daily">Past 24 Hours</SelectItem>
                      <SelectItem value="weekly">Past 7 Days</SelectItem>
                      <SelectItem value="monthly">Past 30 Days</SelectItem>
                      <SelectItem value="yearly">Past Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Items Wasted</p>
                  <p className="text-3xl font-bold text-red-600">{reportItems.length}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-2 bg-muted/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm uppercase tracking-widest opacity-70">Category Analytics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {categorySummary.length > 0 ? (
                      categorySummary.map(cat => (
                        <div key={cat.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span>{cat.icon}</span>
                            <span className="text-sm font-bold">{cat.id}</span>
                          </div>
                          <Badge variant="outline" className="font-mono">{cat.count}</Badge>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground italic text-center py-4">No data for this range</p>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-2 bg-primary/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm uppercase tracking-widest opacity-70">Sustainability Tip</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs leading-relaxed italic">
                      Reducing food waste helps the environment and saves money. Try buying smaller quantities of items that expire quickly.
                    </p>
                    <Button onClick={handleExportCSV} variant="outline" size="sm" className="w-full mt-4 rounded-xl border-dashed border-2 group">
                      <Download className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                      Export CSV
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-2 shadow-sm overflow-hidden">
        <CardHeader className="bg-red-50/50 border-b">
          <CardTitle className="flex items-center gap-2 text-red-900">
            <AlertTriangle className="w-5 h-5" />
            Expired Inventory
          </CardTitle>
          <CardDescription className="text-red-800 opacity-80">These items have already expired and should be reviewed or removed.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {items.length === 0 ? (
            <div className="p-16 text-center text-muted-foreground">
              <Archive className="w-16 h-16 mx-auto mb-4 opacity-10" />
              <p className="text-lg italic font-medium">Your expired shelf is empty. Great job!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="font-bold">Item Name</TableHead>
                    <TableHead className="font-bold">Category</TableHead>
                    <TableHead className="font-bold text-center">Quantity</TableHead>
                    <TableHead className="font-bold text-center">Expired Date</TableHead>
                    <TableHead className="font-bold text-right pr-6">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id} className="hover:bg-red-50/30 transition-colors group">
                      <TableCell className="font-bold border-l-4 border-transparent group-hover:border-red-400 pl-4">{item.name}</TableCell>
                      <TableCell className="capitalize">
                        {FOOD_CATEGORIES.find(c => c.id === item.category)?.icon} {item.category}
                      </TableCell>
                      <TableCell className="text-center font-bold">{item.quantity} {item.unit}</TableCell>
                      <TableCell className="text-center font-medium opacity-70">{item.expirationDate}</TableCell>
                      <TableCell className="text-right pr-6">
                        <Badge variant="destructive" className="rounded-lg shadow-sm">
                          Expired
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
