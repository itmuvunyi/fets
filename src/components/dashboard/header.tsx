"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { LanguageSwitcher } from "@/components/language/language-switcher";
import { useTranslation } from "@/lib/i18n";
import { LogOut, User, BellOff } from "lucide-react";
import { updateUserSettings } from "@/app/actions/user-settings";
import { addToast } from "@/lib/toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function DashboardHeader() {
  const { user, logout } = useAuth();
  const t = useTranslation(user?.language);

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="FETS Logo"
              className="w-12 h-12 rounded-2xl shadow-lg bg-white p-1 border-2 border-primary/20 hover:border-primary/40 transition-all duration-300"
            />
            <div>
              <p className="text-muted-foreground text-xs">
                {t.reduceWasteSaveMoney}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 mr-2 bg-muted/50 px-3 py-1.5 rounded-full border border-primary/10">
              <BellOff className="w-4 h-4 text-muted-foreground" />
              <Label htmlFor="mute-notifications" className="text-xs cursor-pointer">
                {t.muteToday}
              </Label>
              <Switch 
                id="mute-notifications"
                checked={!!user?.muteNotificationsUntil && new Date(user.muteNotificationsUntil) > new Date()}
                onCheckedChange={async (checked) => {
                  if (!user) return;
                  const muteUntil = checked ? new Date() : null;
                  if (muteUntil) {
                    muteUntil.setHours(23, 59, 59, 999);
                  }
                  
                  const result = await updateUserSettings(user.id, { 
                    muteNotificationsUntil: muteUntil?.toISOString() || null 
                  });
                  
                  if (result.success) {
                    addToast({
                      title: checked ? t.notificationsMuted : t.notificationsUnmuted,
                      description: checked ? t.muteDescription : t.unmuteDescription,
                      type: "success"
                    });
                    // Force refresh user state if possible or let session handle it
                    window.location.reload(); // Simple way to sync for now since state is in AuthProvider session fetch
                  } else {
                    addToast({
                      title: t.error,
                      description: "Could not update notification settings.",
                      type: "error"
                    });
                  }
                }}
              />
            </div>

            <LanguageSwitcher />
            <NotificationBell />
            <div className="flex items-center gap-2 text-sm font-bold">
              <User className="w-4 h-4" />
              <span>
                {t.welcome}, {user?.name?.split(" ")[0]}
              </span>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:bg-amber-600 hover:text-white transition-colors rounded-xl"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {t.signOut}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="font-mono">
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {t.areYouSureLogout}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {t.logoutDescription}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-xl mt-0">Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={logout}
                    className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl"
                  >
                    {t.signOut}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </header>
  );
}
