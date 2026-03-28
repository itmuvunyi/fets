import { getUnreadCount } from "@/app/actions/notifications"
import { createClient } from "@/lib/supabaseServer"
import { DashboardLayoutClient } from "@/components/dashboard/dashboard-layout-client"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()
  
  const unreadCount = data?.user ? await getUnreadCount(data.user.id) : 0

  return (
    <DashboardLayoutClient initialUnreadCount={unreadCount}>
      {children}
    </DashboardLayoutClient>
  )
}
