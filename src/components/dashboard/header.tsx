"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { LanguageSwitcher } from "@/components/language/language-switcher";
import { useTranslation } from "@/lib/i18n";
import { LogOut, User } from "lucide-react";

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
            <LanguageSwitcher />
            <NotificationBell />
            <div className="flex items-center gap-2 text-sm">
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
                  className="hover:bg-amber-600 hover:text-white transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {t.signOut === "Sign Out" ? "Log Out" : t.signOut}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure you want to log out?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    You will be redirected to the home page.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={logout}
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    Log Out
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
