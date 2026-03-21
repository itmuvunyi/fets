"use client"

import { ExpiredItemsList } from "@/components/food/expired-items-list"
import { Archive } from "lucide-react"

export default function ExpiredPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-primary/10 rounded-xl text-primary">
          <Archive className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Expired Items</h1>
          <p className="text-muted-foreground">Clear out these items to keep your inventory fresh.</p>
        </div>
      </div>
      
      <ExpiredItemsList />
    </div>
  )
}
