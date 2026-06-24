import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Role } from "@/src/generated/prisma/enums"
import AdminDashboard from "@/components/dashboard/AdminDashboard"
import SuperAdminDashboard from "@/components/dashboard/SuperAdminDashboard"
import CommissionOverview from "@/components/CommissionOverview"

export const dynamic = "force-dynamic"

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ driver?: string; preset?: string; from?: string; to?: string }>
}) {
  const { driver, preset, from, to } = await searchParams

  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  if (!data?.claims) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { supabaseId: data.claims.sub },
    select: {
      id: true,
      firstname: true,
      lastname: true,
      role: true,
      companyId: true,
    },
  })
  if (!user) redirect("/login")

  if (user.role === Role.SUPER_ADMIN) return <SuperAdminDashboard firstname={user.firstname} />

  return user.role === Role.ADMIN
    ? <AdminDashboard firstname={user.firstname} companyId={user.companyId} selectedDriverId={driver} adminId={user.id} adminName={`${user.firstname} ${user.lastname}`} />
    : <CommissionOverview userId={user.id} companyId={user.companyId} preset={preset} from={from} to={to} />
}