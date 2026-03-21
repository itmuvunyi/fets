"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth"
import { Globe } from "lucide-react"
import type { Language } from "@/lib/i18n"

export function LanguageSwitcher() {
  const { user } = useAuth()

  const handleLanguageChange = (language: Language) => {
    if (user) {
      // Update user language preference
      localStorage.setItem("food-tracker-language", language)
      // Force page reload to apply language changes
      window.location.reload()
    }
  }

  if (!user) return null

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <Select value={user.language} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="rw">Kinyarwanda</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
