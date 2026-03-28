"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { requestNotificationPermission, addNotification, showBrowserNotification } from "@/lib/notifications"
import { Bell, BellOff } from "lucide-react"
import { addToast } from "@/lib/toast"
import { useAuth } from "@/lib/auth"
import { updateUserSettings } from "@/app/actions/user-settings"
import { useTranslation } from "@/lib/i18n"

interface NotificationSettings {
  browserNotifications: boolean
  dailyReminders: boolean
  reminderTime: string
  expirationWarningDays: number
}

export function NotificationSettings() {
  const { user } = useAuth()
  const [settings, setSettings] = useState<NotificationSettings>({
    browserNotifications: false,
    dailyReminders: true,
    reminderTime: "09:00",
    expirationWarningDays: 3,
  })
  const [permission, setPermission] = useState<NotificationPermission>("default")

  const t = useTranslation(user?.language)

  useEffect(() => {
    // Load settings from localStorage
    const stored = localStorage.getItem("notification-settings")
    if (stored) {
      setSettings(JSON.parse(stored))
    }

    // Check current notification permission
    if ("Notification" in window) {
      setPermission(Notification.permission)
    }
  }, [])

  const saveSettings = async (newSettings: NotificationSettings) => {
    setSettings(newSettings)
    localStorage.setItem("notification-settings", JSON.stringify(newSettings))
    
    if (user) {
      // Note: alertThresholdDays maps to expirationWarningDays in this UI
      const result = await updateUserSettings(user.id, { 
        alertThresholdDays: newSettings.expirationWarningDays 
      })
      
      if (result.success) {
        addToast({ 
          title: t.success, 
          description: t.settingsUpdatedToast || "Your notification preferences have been updated.", 
          type: "success" 
        })
      }
    }
  }

  const handleBrowserNotificationToggle = async (enabled: boolean) => {
    if (enabled && permission !== "granted") {
      const newPermission = await requestNotificationPermission()
      setPermission(newPermission)
      if (newPermission !== "granted") {
        return // Don't enable if permission denied
      }
    }

    saveSettings({ ...settings, browserNotifications: enabled })
  }

  const handleSettingChange = async (key: keyof NotificationSettings, value: any) => {
    const newSettings = { ...settings, [key]: value }
    await saveSettings(newSettings)

    if (key === "expirationWarningDays" && user) {
      try {
        const { fetchFoodItems } = await import("@/app/actions/food")
        const foodItems = await fetchFoodItems(user.id)
        
        const now = new Date()
        const warningDate = new Date()
        warningDate.setDate(now.getDate() + (value as number))
        
        const matchingItems = foodItems.filter(item => {
          const expiresAt = new Date(item.expirationDate)
          return expiresAt <= warningDate && expiresAt >= now
        })

        if (matchingItems.length === 0) {
          addToast({
            title: "Reminder Check",
            description: t.noRemindersDescription || `No items currently match this ${value}-day reminder setting.`,
            type: "info"
          })
        } else {
          addToast({
            title: "Reminders Active",
            description: `${matchingItems.length} items currently match this range and will trigger reminders.`,
            type: "success"
          })
        }
      } catch (error) {
        console.error("Error checking food items:", error)
      }
    }
  }

  return (
    <Card className="border-2 shadow-sm font-mono overflow-hidden">
      <CardHeader className="bg-muted/10 border-b">
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
          <Bell className="h-5 w-5 text-primary" />
          {t.notificationSettings}
        </CardTitle>
        <CardDescription className="font-medium brightness-75">
          {t.configureReminders}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {/* Browser Notifications */}
        <div className="flex items-center justify-between group">
          <div className="space-y-0.5">
            <Label className="text-base font-bold group-hover:text-primary transition-colors cursor-pointer">
              {t.browserNotifications}
            </Label>
            <p className="text-sm text-muted-foreground font-medium opacity-80">
              {t.desktopNotifications}
            </p>
          </div>
          <Switch
            checked={settings.browserNotifications && permission === "granted"}
            onCheckedChange={handleBrowserNotificationToggle}
            disabled={permission === "denied"}
            className="data-[state=checked]:bg-primary"
          />
        </div>

        {permission === "denied" && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-2xl animate-in fade-in slide-in-from-left-4 duration-300">
            <div className="flex items-center gap-3">
              <BellOff className="h-5 w-5 text-destructive" />
              <p className="text-sm text-destructive font-bold leading-tight">
                {t.notificationsBlocked}
              </p>
            </div>
          </div>
        )}

        {/* Daily Reminders */}
        <div className="flex items-center justify-between group">
          <div className="space-y-0.5">
            <Label className="text-base font-bold group-hover:text-primary transition-colors cursor-pointer">
              {t.dailyReminders}
            </Label>
            <p className="text-sm text-muted-foreground font-medium opacity-80">
              {t.dailySummaries}
            </p>
          </div>
          <Switch
            checked={settings.dailyReminders}
            onCheckedChange={(checked) => handleSettingChange("dailyReminders", checked)}
            className="data-[state=checked]:bg-primary"
          />
        </div>

        {/* Reminder Time */}
        {settings.dailyReminders && (
          <div className="space-y-3 p-4 bg-muted/20 rounded-2xl border border-primary/5 animate-in zoom-in-95 duration-200">
            <Label className="text-sm font-bold uppercase tracking-wider text-primary opacity-80">
              {t.dailyReminderTime}
            </Label>
            <Select value={settings.reminderTime} onValueChange={(value) => handleSettingChange("reminderTime", value)}>
              <SelectTrigger className="w-full bg-background border-2 rounded-xl h-12 font-bold focus:ring-primary/20 transition-all">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="font-mono rounded-xl border-2">
                <SelectItem value="07:00">{t.morning7}</SelectItem>
                <SelectItem value="08:00">{t.morning8}</SelectItem>
                <SelectItem value="09:00">{t.morning9}</SelectItem>
                <SelectItem value="10:00">{t.morning10}</SelectItem>
                <SelectItem value="11:00">{t.morning11}</SelectItem>
                <SelectItem value="12:00">{t.noon}</SelectItem>
                <SelectItem value="18:00">{t.evening6}</SelectItem>
                <SelectItem value="19:00">{t.evening7}</SelectItem>
                <SelectItem value="20:00">{t.evening8}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Warning Days */}
        <div className="space-y-3 p-4 bg-muted/20 rounded-2xl border border-primary/5">
          <Label className="text-sm font-bold uppercase tracking-wider text-primary opacity-80">
            {t.expirationWarning}
          </Label>
          <Select
            value={settings.expirationWarningDays.toString()}
            onValueChange={(value) => handleSettingChange("expirationWarningDays", Number.parseInt(value))}
          >
            <SelectTrigger className="w-full bg-background border-2 rounded-xl h-12 font-bold focus:ring-primary/20 transition-all">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="font-mono rounded-xl border-2">
              <SelectItem value="1">{t.dayBefore}</SelectItem>
              <SelectItem value="2">2 {t.daysBefore}</SelectItem>
              <SelectItem value="3">3 {t.daysBefore}</SelectItem>
              <SelectItem value="4">4 {t.daysBefore}</SelectItem>
              <SelectItem value="5">5 {t.daysBefore}</SelectItem>
              <SelectItem value="7">{t.weekBefore}</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground font-bold italic pl-1 opacity-70">
            {t.getNotifiedBefore}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
