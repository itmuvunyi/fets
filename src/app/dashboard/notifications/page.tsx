import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabaseServer"
import { getNotifications } from "@/app/actions/notifications"
import { NotificationList } from "@/components/notifications/notification-list"
import { Metadata } from "next"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata: Metadata = {
  title: "Notifications | FETS",
  description: "View your alerts and expiring food item notifications",
}

import { evaluateFoodItems } from "@/app/actions/expiration-logic"

export default async function NotificationsPage() {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()
  
  if (!data?.user) {
    redirect("/auth")
  }

  // Ensure notifications are up to date
  await evaluateFoodItems(data.user.id)

  const notifications = await getNotifications(data.user.id)

  return (
    <div className="max-w-4xl mx-auto py-8 lg:py-12 px-2 sm:px-4">
      <NotificationList initialNotifications={notifications as any} />
    </div>
  )
}
