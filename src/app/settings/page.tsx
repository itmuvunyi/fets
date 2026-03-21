"use client"

import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { NotificationSettings } from "@/components/notifications/notification-settings"
import { LanguageSwitcher } from "@/components/language/language-switcher"
import { useAuth } from "@/lib/auth"
import { useTranslation } from "@/lib/i18n"

import { useEffect } from "react"

export default function SettingsPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const t = useTranslation(user?.language)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth")
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>{t.loading || "Loading..."}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.back || "Back"}
          </Button>
          <h1 className="text-3xl font-bold">{t.settings || "Settings"}</h1>
          <p className="text-muted-foreground mt-2">
            {t.managePreferences || "Manage your app preferences and notifications"}
          </p>
        </div>

        <div className="grid gap-6 max-w-4xl">
          {/* Language Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>{t.language || "Language"}</CardTitle>
              <CardDescription>{t.languageDescription || "Choose your preferred language for the app"}</CardDescription>
            </CardHeader>
            <CardContent>
              <LanguageSwitcher />
            </CardContent>
          </Card>

          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle>{t.profile || "Profile"}</CardTitle>
              <CardDescription>{t.profileDescription || "Your account information"}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">{t.name || "Name"}</label>
                <p className="text-muted-foreground">{user.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium">{t.email || "Email"}</label>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <NotificationSettings />
        </div>
      </div>
    </div>
  )
}
