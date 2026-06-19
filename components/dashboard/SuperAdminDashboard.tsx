import prisma from "@/lib/prisma"
import { Role, UserStatus } from "@/src/generated/prisma/enums"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { StatCard } from "@/components/StatCard"
import DonutChart from "@/components/DonutChart"
import CompaniesChart from "@/components/CompaniesChart"

export default async function SuperAdminDashboard({ firstname }: { firstname: string }) {
  const pendingAdmins = await prisma.user.count({ where: { role: Role.ADMIN, status: UserStatus.PENDING } })
  const activeAdmins = await prisma.user.count({ where: { role: Role.ADMIN, status: UserStatus.ACTIVE } })
  const inactiveAdmins = await prisma.user.count({ where: { role: Role.ADMIN, status: UserStatus.INACTIVE } })
  const totalCompanies = await prisma.company.count({ where: { deletedAt: null } })
  const rejectedCompanies = await prisma.user.count({ where: { role: Role.ADMIN, status: UserStatus.REJECTED } })

  // New companies this month vs last month
  const now = new Date()
  const startThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const newThisMonth = await prisma.company.count({ where: { deletedAt: null, createdAt: { gte: startThisMonth } } })
  const newLastMonth = await prisma.company.count({ where: { deletedAt: null, createdAt: { gte: startLastMonth, lt: startThisMonth } } })
  const companyDiff = newThisMonth - newLastMonth
  const companyTrend = `${companyDiff >= 0 ? "↑" : "↓"} ${Math.abs(companyDiff)} vs. ${startLastMonth.toLocaleDateString("de-DE", { month: "short" })}`

  // Company-admin status distribution for the donut (color travels with each slice)
  const statusData = [
    { name: "Aktiv", value: activeAdmins, color: "#059669" },
    { name: "Ausstehend", value: pendingAdmins, color: "#ca8a04" },
    { name: "Deaktiviert", value: inactiveAdmins, color: "#6b7280" },
    { name: "Abgelehnt", value: rejectedCompanies, color: "#dc2626" },
  ].filter((d) => d.value > 0)

  // New companies per month (current year) for the bar chart
  const monthNames = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"]
  const currentYear = now.getFullYear()
  const yearStart = new Date(currentYear, 0, 1)
  const companiesThisYear = await prisma.company.findMany({
    where: { deletedAt: null, createdAt: { gte: yearStart } },
    select: { createdAt: true },
  })
  const companyChartData = monthNames.map((month, idx) => ({
    month,
    count: companiesThisYear.filter((c) => c.createdAt.getMonth() === idx).length,
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Willkommen, {firstname}</h1>
          <p className="text-muted-foreground">Plattform-Übersicht</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/companies">Unternehmen verwalten</Link>
        </Button>
      </div>

     <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Warten auf Freigabe" value={String(pendingAdmins)} />
        <StatCard label="Aktive Unternehmen" value={String(activeAdmins)} />
        <StatCard label="Unternehmen gesamt" value={String(totalCompanies)} trend={companyTrend} />
      </div>

      <div className="flex justify-around">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Unternehmen nach Status</CardTitle>
          </CardHeader>
          <CardContent>
            {statusData.length === 0 ? (
              <p className="text-center text-muted-foreground">Noch keine Unternehmen</p>
            ) : (
              <DonutChart data={statusData} />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Neue Unternehmen {currentYear} (pro Monat)</CardTitle>
          </CardHeader>
          <CardContent>
            <CompaniesChart data={companyChartData} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
