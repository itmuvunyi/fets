import { formatDistanceToNow } from "date-fns"
import { AlertTriangle, CheckCircle, Info, XCircle, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

export type NotificationType = "info" | "warning" | "error" | "success"

export interface Notification {
  id: string
  title: string
  message: string
  type: string
  read: boolean
  createdAt: string | Date
}

interface NotificationItemProps {
  notification: Notification
  onMarkAsRead: (id: string) => void
  onDelete?: (id: string) => void
}

export function NotificationItem({ notification, onMarkAsRead, onDelete }: NotificationItemProps) {
  const router = useRouter()

  const getIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case "error":
        return <XCircle className="w-5 h-5 text-destructive" />
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "info":
      default:
        return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  const getBgColor = (type: string, read: boolean) => {
    if (read) return "bg-card hover:bg-muted/50"
    switch (type) {
      case "warning":
        return "bg-yellow-500/10 border-yellow-500/20 hover:bg-yellow-500/20"
      case "error":
        return "bg-destructive/10 border-destructive/20 hover:bg-destructive/20"
      case "success":
        return "bg-green-500/10 border-green-500/20 hover:bg-green-500/20"
      case "info":
      default:
        return "bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20"
    }
  }

  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification.id)
    }
    // Navigate based on type
    if (notification.type === "error" || notification.title.toLowerCase().includes("expired")) {
      router.push("/dashboard/expired")
    } else if (notification.type === "warning" || notification.title.toLowerCase().includes("expiring")) {
      router.push("/dashboard/reminders")
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        "flex gap-4 p-5 rounded-2xl border transition-all duration-200 cursor-pointer shadow-sm",
        getBgColor(notification.type, notification.read),
        notification.read ? "opacity-70 hover:opacity-100 border-border/50" : "border-transparent"
      )}
    >
      <div className="shrink-0 mt-0.5">{getIcon(notification.type)}</div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
          <h4 className={cn("font-bold text-base tracking-tight", !notification.read && "text-foreground")}>
            {notification.title}
          </h4>
          <span className="text-xs text-muted-foreground whitespace-nowrap font-medium">
            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
          </span>
        </div>
        <p className={cn("text-sm break-words", !notification.read ? "text-foreground/90 font-medium" : "text-muted-foreground")}>
          {notification.message}
        </p>
      </div>
      <div className="shrink-0 flex items-center gap-3 pl-2">
        {onDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(notification.id)
            }}
            className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors focus:outline-hidden"
            title="Delete notification"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
        {!notification.read && (
          <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-sm ring-4 ring-primary/20" />
        )}
      </div>
    </div>
  )
}
