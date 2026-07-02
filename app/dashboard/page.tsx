import { Role } from "@/src/generated/prisma/enums"
import AdminDashboard from "@/components/dashboard/AdminDashboard"
import SuperAdminDashboard from "@/components/dashboard/SuperAdminDashboard"
import CommissionOverview from "@/components/CommissionOverview"
import { requireUser } from "@/lib/auth"

export const dynamic = "force-dynamic"

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ driver?: string; preset?: string; from?: string; to?: string; page?: string }>
}) {
  const { driver, preset, from, to, page } = await searchParams

  const user = await requireUser()

  if (user.role === Role.SUPER_ADMIN) return <SuperAdminDashboard firstname={user.firstname} />

  return user.role === Role.ADMIN
    ? <AdminDashboard firstname={user.firstname} companyId={user.companyId} selectedDriverId={driver} adminId={user.id} adminName={`${user.firstname} ${user.lastname}`} preset={preset} from={from} to={to} />
    : <CommissionOverview userId={user.id} companyId={user.companyId} preset={preset} from={from} to={to} page={page} />
}