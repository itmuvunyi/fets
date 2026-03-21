"use client"

import { useState, useCallback } from "react"

export interface Toast {
  id: string
  title: string
  description?: string
  type: "success" | "error" | "info"
}

let toastCounter = 0
const toastListeners: ((toasts: Toast[]) => void)[] = []
let toasts: Toast[] = []

export function addToast(toast: Omit<Toast, "id">) {
  const newToast: Toast = {
    ...toast,
    id: `toast-${++toastCounter}`,
  }

  toasts = [...toasts, newToast]
  toastListeners.forEach((listener) => listener(toasts))

  // Auto remove after 5 seconds
  setTimeout(() => {
    removeToast(newToast.id)
  }, 5000)
}

export function removeToast(id: string) {
  toasts = toasts.filter((toast) => toast.id !== id)
  toastListeners.forEach((listener) => listener(toasts))
}

export function useToasts() {
  const [currentToasts, setCurrentToasts] = useState<Toast[]>(toasts)

  const subscribe = useCallback((listener: (toasts: Toast[]) => void) => {
    toastListeners.push(listener)
    return () => {
      const index = toastListeners.indexOf(listener)
      if (index > -1) {
        toastListeners.splice(index, 1)
      }
    }
  }, [])

  useState(() => {
    const unsubscribe = subscribe(setCurrentToasts)
    return unsubscribe
  })

  return currentToasts
}
