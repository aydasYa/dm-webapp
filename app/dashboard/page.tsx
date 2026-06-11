import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Role } from "@/src/generated/prisma/enums"
import AdminDashboard from "@/components/dashboard/AdminDashboard"
import DriverDashboard from "@/components/dashboard/DriverDashboard"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  if (!data?.claims) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { supabaseId: data.claims.sub },
    select: { firstname: true, role: true },
  })
  if (!user) redirect("/login")

  // 👉 your turn: return <AdminDashboard .../> for admins, else <DriverDashboard .../>
  return user.role === Role.ADMIN
	? <AdminDashboard firstname={user.firstname} />
	: <DriverDashboard supabaseId={data.claims.sub} firstname={user.firstname} />
}