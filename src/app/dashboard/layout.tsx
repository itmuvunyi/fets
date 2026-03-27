"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Menu } from "lucide-react";
import { AddFoodForm } from "@/components/food/add-food-form";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="flex min-h-screen bg-background font-mono text-sm">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 lg:relative lg:translate-x-0",
          isSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0",
        )}
      >
        <Sidebar
          onAddFood={() => setShowAddForm(true)}
          onClose={() => setIsSidebarOpen(false)}
        />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="lg:hidden border-b p-4 flex items-center justify-between bg-card shrink-0">
          <div className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="FETS Logo"
              className="w-8 h-8 rounded-xl shadow-md bg-white p-0.5 border border-primary/20 hover:border-primary/40 transition-all duration-300"
            />
            <span className="font-bold">FETS</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-muted rounded-md"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>

      {/* Global Add Food Modal */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent 
          className="max-w-md p-0 overflow-hidden border-none bg-transparent shadow-none"
          showCloseButton={false}
        >
          <DialogTitle className="sr-only">Add Food Item</DialogTitle>
          <DialogDescription className="sr-only">
            Enter the details of your food item to track it.
          </DialogDescription>
          <AddFoodForm
            onSuccess={() => setShowAddForm(false)}
            onCancel={() => setShowAddForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
