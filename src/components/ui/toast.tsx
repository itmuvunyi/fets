"use client"

import { X, CheckCircle, AlertCircle, Info } from "lucide-react"
import { useToasts, removeToast, type Toast } from "@/lib/toast"

function ToastItem({ toast }: { toast: Toast }) {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
  }

  const Icon = icons[toast.type]

  const bgColors = {
    success: "bg-green-50 border-green-200",
    error: "bg-red-50 border-red-200",
    info: "bg-blue-50 border-blue-200",
  }

  const iconColors = {
    success: "text-green-600",
    error: "text-red-600",
    info: "text-blue-600",
  }

  return (
    <div className={`${bgColors[toast.type]} border rounded-lg p-4 shadow-lg max-w-sm w-full`}>
      <div className="flex items-start">
        <Icon className={`${iconColors[toast.type]} h-5 w-5 mt-0.5 mr-3 flex-shrink-0`} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">{toast.title}</p>
          {toast.description && <p className="text-sm text-gray-600 mt-1">{toast.description}</p>}
        </div>
        <button onClick={() => removeToast(toast.id)} className="ml-3 flex-shrink-0 text-gray-400 hover:text-gray-600">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export function Toaster() {
  const toasts = useToasts()

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  )
}
