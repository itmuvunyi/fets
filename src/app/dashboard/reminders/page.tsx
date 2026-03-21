"use client"

import { RemindersTable } from "@/components/dashboard/reminders-table"
import { useAuth } from "@/lib/auth"
import { useTranslation } from "@/lib/i18n"
import { Calendar } from "lucide-react"

export default function RemindersPage() {
  const { user } = useAuth()
  const t = useTranslation(user?.language)

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-primary/10 rounded-xl text-primary">
          <Calendar className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Food Reminders</h1>
          <p className="text-muted-foreground">Don't let your food go to waste. Use these items soon!</p>
        </div>
      </div>
      
      <RemindersTable />
    </div>
  )
}
