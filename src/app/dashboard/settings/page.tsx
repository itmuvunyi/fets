"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { NotificationSettings } from "@/components/notifications/notification-settings"
import { LanguageSwitcher } from "@/components/language/language-switcher"
import { useAuth } from "@/lib/auth"
import { useTranslation } from "@/lib/i18n"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Mail, CreditCard } from "lucide-react"

export default function SettingsPage() {
  const { user } = useAuth()
  const t = useTranslation(user?.language)

  if (!user) {
    return null
  }

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl space-y-8 font-mono">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">{t.settings || "Settings"}</h1>
        <p className="text-muted-foreground italic">
          {t.managePreferences || "Manage your app preferences and notifications"}
        </p>
      </div>

      <div className="grid gap-6">
        {/* Profile Information */}
        <Card className="border-2 shadow-sm overflow-hidden bg-card transition-all duration-300">
          <CardHeader className="bg-muted/30 dark:bg-muted/10 border-b pb-8">
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
              <div className="relative group">
                <Avatar className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 border-4 border-background shadow-2xl transition-transform duration-300 group-hover:scale-105">
                  <AvatarImage src={user.image || ""} alt={user.name} className="object-cover" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 rounded-full border-2 border-primary/20 pointer-events-none group-hover:border-primary/40 transition-colors duration-300"></div>
              </div>
              <div className="space-y-2 text-center sm:text-left">
                <CardTitle className="text-3xl font-bold tracking-tight">{t.profile || "Profile"}</CardTitle>
                <CardDescription className="text-base font-medium opacity-80">
                  {t.profileDescription || "Manage your account and preferences"}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest">
                  <User className="w-4 h-4" />
                  {t.name || "Full Name"}
                </div>
                <div className="p-5 bg-muted/20 dark:bg-muted/5 rounded-2xl border border-primary/5 text-lg font-bold shadow-inner">
                  {user.name}
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest">
                  <Mail className="w-4 h-4" />
                  {t.email || "Email Address"}
                </div>
                <div className="p-5 bg-muted/20 dark:bg-muted/5 rounded-2xl border border-primary/5 text-lg font-bold shadow-inner truncate">
                  {user.email}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Language Preferences */}
          <Card className="border-2 shadow-sm lg:col-span-1 h-full">
            <CardHeader>
              <CardTitle className="text-xl">{t.language || "Language"}</CardTitle>
              <CardDescription>{t.languageDescription || "Choose your preferred language"}</CardDescription>
            </CardHeader>
            <CardContent>
              <LanguageSwitcher />
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <div className="border-2 rounded-xl overflow-hidden shadow-sm lg:col-span-2">
            <NotificationSettings />
          </div>
        </div>
      </div>
    </div>
  )
}
