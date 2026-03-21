"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { requestNotificationPermission } from "@/lib/notifications"
import { Bell, BellOff } from "lucide-react"

interface NotificationSettings {
  browserNotifications: boolean
  dailyReminders: boolean
  reminderTime: string
  expirationWarningDays: number
}

export function NotificationSettings() {
  const [settings, setSettings] = useState<NotificationSettings>({
    browserNotifications: false,
    dailyReminders: true,
    reminderTime: "09:00",
    expirationWarningDays: 3,
  })
  const [permission, setPermission] = useState<NotificationPermission>("default")

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

  const saveSettings = (newSettings: NotificationSettings) => {
    setSettings(newSettings)
    localStorage.setItem("notification-settings", JSON.stringify(newSettings))
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

  const handleSettingChange = (key: keyof NotificationSettings, value: any) => {
    saveSettings({ ...settings, [key]: value })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Settings
        </CardTitle>
        <CardDescription>Configure how and when you receive expiration reminders</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Browser Notifications */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Browser Notifications</Label>
            <p className="text-sm text-muted-foreground">Receive desktop notifications for expiring items</p>
          </div>
          <Switch
            checked={settings.browserNotifications && permission === "granted"}
            onCheckedChange={handleBrowserNotificationToggle}
            disabled={permission === "denied"}
          />
        </div>

        {permission === "denied" && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2">
              <BellOff className="h-4 w-4 text-yellow-600" />
              <p className="text-sm text-yellow-800">
                Browser notifications are blocked. Enable them in your browser settings to receive desktop alerts.
              </p>
            </div>
          </div>
        )}

        {/* Daily Reminders */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Daily Reminders</Label>
            <p className="text-sm text-muted-foreground">Get daily summaries of expiring items</p>
          </div>
          <Switch
            checked={settings.dailyReminders}
            onCheckedChange={(checked) => handleSettingChange("dailyReminders", checked)}
          />
        </div>

        {/* Reminder Time */}
        {settings.dailyReminders && (
          <div className="space-y-2">
            <Label>Daily Reminder Time</Label>
            <Select value={settings.reminderTime} onValueChange={(value) => handleSettingChange("reminderTime", value)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="07:00">7:00 AM</SelectItem>
                <SelectItem value="08:00">8:00 AM</SelectItem>
                <SelectItem value="09:00">9:00 AM</SelectItem>
                <SelectItem value="10:00">10:00 AM</SelectItem>
                <SelectItem value="11:00">11:00 AM</SelectItem>
                <SelectItem value="12:00">12:00 PM</SelectItem>
                <SelectItem value="18:00">6:00 PM</SelectItem>
                <SelectItem value="19:00">7:00 PM</SelectItem>
                <SelectItem value="20:00">8:00 PM</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Warning Days */}
        <div className="space-y-2">
          <Label>Expiration Warning</Label>
          <Select
            value={settings.expirationWarningDays.toString()}
            onValueChange={(value) => handleSettingChange("expirationWarningDays", Number.parseInt(value))}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 day before</SelectItem>
              <SelectItem value="2">2 days before</SelectItem>
              <SelectItem value="3">3 days before</SelectItem>
              <SelectItem value="5">5 days before</SelectItem>
              <SelectItem value="7">1 week before</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">Get notified when items are about to expire</p>
        </div>

        {/* Test Notification */}
        <div className="pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => {
              if (settings.browserNotifications && permission === "granted") {
                new Notification("Food Tracker Test", {
                  body: "This is a test notification from your Food Tracker app!",
                  icon: "/favicon.ico",
                })
              } else {
                alert("Test notification: Your Food Tracker app is working!")
              }
            }}
          >
            Test Notification
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
