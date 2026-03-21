"use client"

import { RecentItems } from "@/components/dashboard/recent-items"
import { History } from "lucide-react"

export default function RecentPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
          <History className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recent Activity</h1>
          <p className="text-muted-foreground">Your history of recently added and modified items.</p>
        </div>
      </div>
      
      <div className="max-w-2xl">
        <RecentItems showAll={true} />
      </div>
    </div>
  )
}
