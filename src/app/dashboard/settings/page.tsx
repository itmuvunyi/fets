"use client"

import { Settings as SettingsIcon, User as UserIcon, Lock, Bell, Globe } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function SettingsPage() {
  const { user } = useAuth()

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-muted rounded-xl">
          <SettingsIcon className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your account and app preferences.</p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="w-5 h-5" />
              Profile Information
            </CardTitle>
            <CardDescription>Update your account details and how others see you.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Full Name</Label>
              <Input defaultValue={user?.name} />
            </div>
            <div className="grid gap-2">
              <Label>Email Address</Label>
              <Input defaultValue={user?.email} disabled />
            </div>
            <Button className="w-fit">Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Lock className="w-5 h-5 text-destructive" />
              Security
            </CardTitle>
            <CardDescription>Change your password and manage security settings.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="hover:bg-primary hover:text-primary-foreground transition-all">Reset Password</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
