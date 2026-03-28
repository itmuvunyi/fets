import { BellOff } from "lucide-react"

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center border-2 rounded-2xl bg-card border-dashed">
      <div className="w-20 h-20 rounded-full bg-secondary/50 flex items-center justify-center mb-5">
        <BellOff className="w-10 h-10 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-bold mb-2">No notifications yet</h3>
      <p className="text-muted-foreground max-w-sm">
        When food items expire or are close to expiring, notifications will appear here.
      </p>
    </div>
  )
}
