"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Scan, Bell, Settings } from "lucide-react"
import { useRouter } from "next/navigation"

interface QuickActionsProps {
  onAddFood: () => void
  onScanBarcode: () => void // Added barcode scanning callback
}

export function QuickActions({ onAddFood, onScanBarcode }: QuickActionsProps) {
  const router = useRouter()

  const actions = [
    {
      title: "Add Food Item",
      description: "Track a new food item",
      icon: Plus,
      onClick: onAddFood,
      variant: "default" as const,
    },
    {
      title: "Scan Barcode",
      description: "Quick add with barcode",
      icon: Scan,
      onClick: onScanBarcode, // Now calls the actual barcode scanner
      variant: "outline" as const,
    },
    {
      title: "View Reminders",
      description: "Check expiring items",
      icon: Bell,
      onClick: () => {
        router.push("/reminders")
      },
      variant: "outline" as const,
    },
    {
      title: "Settings",
      description: "App preferences",
      icon: Settings,
      onClick: () => {
        router.push("/settings")
      },
      variant: "outline" as const,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks and shortcuts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <Button
              key={action.title}
              variant={action.variant}
              onClick={action.onClick}
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <action.icon className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium text-sm">{action.title}</div>
                <div className="text-xs opacity-70">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
