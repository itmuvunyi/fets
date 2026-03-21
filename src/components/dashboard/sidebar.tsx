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

interface SidebarProps {
  onClose?: () => void;
  onAddFood?: () => void;
}

export function Sidebar({ onClose, onAddFood }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const t = useTranslation(user?.language);

  const menuItems = [
    { title: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { title: "Add Food Item", icon: PlusCircle, onClick: onAddFood },
    { title: "Recent Items", icon: History, href: "/dashboard/recent" },
    { title: "Notifications", icon: Bell, href: "/dashboard/notifications" },
    { title: "Reminders", icon: Calendar, href: "/dashboard/reminders" },
    { title: "Expired Items", icon: Archive, href: "/dashboard/expired" },
    { title: "Settings", icon: Settings, href: "/dashboard/settings" },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className="flex flex-col h-full bg-card border-r">
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="FETS Logo"
            className="w-10 h-10 rounded-2xl shadow-lg bg-white p-1 border-2 border-primary/20 hover:border-primary/40 transition-all duration-300"
          />
          <h1 className="text-xl font-bold text-primary">FETS</h1>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-muted rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const content = (
            <div className="flex items-center gap-3">
              <Icon className="w-5 h-5" />
              <span>{item.title}</span>
            </div>
          );

          if (item.onClick) {
            return (
              <button
                key={item.title}
                onClick={item.onClick}
                className="w-full text-left px-4 py-3 rounded-xl transition-all hover:bg-primary/5 hover:text-primary text-muted-foreground"
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
                "flex items-center px-4 py-3 rounded-xl transition-all",
                isActive(item.href!)
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:bg-primary/5 hover:text-primary",
              )}
            >
              {content}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t space-y-4">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/50">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            {user?.name?.[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user?.name?.split(" ")[0]}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-muted-foreground hover:bg-primary hover:text-primary-foreground rounded-xl px-4 transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span>Log Out</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to log out?
              </AlertDialogTitle>
              <AlertDialogDescription>
                You will be redirected to the landing page.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="btn-cancel-red mt-0">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={logout}>Log Out</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
