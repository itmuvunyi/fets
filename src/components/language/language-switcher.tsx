"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Globe } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { updateUserSettings } from "@/app/actions/user-settings"
import type { Language } from "@/lib/i18n"

export function LanguageSwitcher() {
  const { user } = useAuth()
  const language = user?.language || (typeof window !== "undefined" ? localStorage.getItem("food-tracker-language") : "en") as Language

  const handleLanguageChange = async (newLanguage: Language) => {
    if (user) {
      await updateUserSettings(user.id, { language: newLanguage })
    }
    localStorage.setItem("food-tracker-language", newLanguage)
    // Reload to apply i18n changes across the app
    window.location.reload()
  }

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <Select value={language} onValueChange={handleLanguageChange}>
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
