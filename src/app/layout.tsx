import type React from "react";
import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { AuthProvider } from "@/lib/auth";
import { Suspense } from "react";
import { Toaster } from "@/components/ui/toast";
import "./globals.css";

import { TRPCReactProvider } from "@/trpc/react";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Food Tracker Expiry System",
  description:
    "Advanced food tracking with real-time suggestions and smart reminders.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-mono ${jetbrainsMono.variable}`}>
        <TRPCReactProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <AuthProvider>{children}</AuthProvider>
          </Suspense>
          <Toaster />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
