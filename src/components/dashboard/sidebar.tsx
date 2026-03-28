"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  PlusCircle,
  History,
  Bell,
  Calendar,
  Archive,
  Settings,
  X,
  LogOut,
} from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { getUnreadCount } from "@/app/actions/notifications";
import { evaluateFoodItems } from "@/app/actions/expiration-logic";
import { useState, useEffect } from "react";

interface SidebarProps {
  onClose?: () => void;
  onAddFood?: () => void;
  initialUnreadCount?: number;
}

export function Sidebar({ onClose, onAddFood, initialUnreadCount = 0 }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const t = useTranslation(user?.language);
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);

  useEffect(() => {
    setUnreadCount(initialUnreadCount);
  }, [initialUnreadCount]);

  useEffect(() => {
    if (user) {
      const fetchCount = async () => {
        const count = await getUnreadCount(user.id);
        setUnreadCount(count);
      };

      // Refresh every 60 seconds as a reliable fallback
      const interval = setInterval(fetchCount, 60000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const menuItems = [
    { title: t.dashboard, icon: LayoutDashboard, href: "/dashboard" },
    { title: t.addFoodItem, icon: PlusCircle, onClick: onAddFood },
    { title: t.recentItems, icon: History, href: "/dashboard/recent" },
    { 
      title: t.notifications, 
      icon: Bell, 
      href: "/dashboard/notifications",
      badge: unreadCount > 0 ? unreadCount : null 
    },
    { title: t.reminders, icon: Calendar, href: "/dashboard/reminders" },
    { title: t.expiredItems, icon: Archive, href: "/dashboard/expired" },
    { title: t.settings, icon: Settings, href: "/dashboard/settings" },
  ];

  const isActive = (href: string) => pathname === href;

  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase()
    : "?";

  return (
    <div className="flex flex-col h-full bg-card border-r font-mono">
      <div className="p-6 flex items-center justify-between border-b bg-muted/10">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="FETS Logo"
            className="w-10 h-10 rounded-2xl shadow-lg bg-white p-1 border-2 border-primary/20 hover:border-primary/40 transition-all duration-300"
          />
          <h1 className="text-xl font-bold text-primary tracking-tighter">FETS</h1>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-muted rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const content = (
            <div className="flex items-center gap-3">
              <Icon className={cn("w-5 h-5", isActive(item.href!) ? "animate-pulse" : "")} />
              <span className="font-medium tracking-tight">{item.title}</span>
            </div>
          );

          if (item.onClick) {
            return (
              <button
                key={item.title}
                onClick={item.onClick}
                className="w-full text-left px-4 py-3 rounded-xl transition-all hover:bg-primary/10 hover:text-primary text-muted-foreground group"
              >
                {content}
              </button>
            );
          }

          return (
            <Link
              key={item.title}
              href={item.href!}
              className={cn(
                "flex items-center justify-between px-4 py-3 rounded-xl transition-all group",
                isActive(item.href!)
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:bg-primary/10 hover:text-primary",
              )}
            >
              {content}
              {"badge" in item && item.badge && (
                <span className="bg-destructive text-destructive-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-sm animate-in zoom-in duration-300">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t space-y-4 bg-muted/5">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-card border border-primary/5 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shadow-sm border-2 border-primary/20">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate">
              {user?.name?.split(" ")[0]}
            </p>
            <p className="text-[10px] text-muted-foreground truncate uppercase tracking-widest font-bold opacity-60">
              {user?.email}
            </p>
          </div>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-muted-foreground hover:bg-destructive hover:text-white rounded-xl px-4 transition-all border border-transparent hover:border-destructive/20"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-bold">{t.signOut}</span>
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
              <AlertDialogCancel className="rounded-xl mt-0">
                {t.cancel}
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={logout}
                className="bg-destructive hover:bg-destructive/90 text-white rounded-xl"
              >
                {t.signOut}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
