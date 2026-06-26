import prisma from "@/lib/prisma"
import { Role, UserStatus } from "@/src/generated/prisma/enums"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { StatCard } from "@/components/StatCard"
import DonutChart from "@/components/DonutChart"
import CompaniesChart from "@/components/CompaniesChart"

export default async function SuperAdminDashboard({ firstname }: { firstname: string }) {
  // Daten zuerst (synchron) – damit alle Queries parallel laufen können
  const now = new Date()
  const startThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const currentYear = now.getFullYear()
  const yearStart = new Date(currentYear, 0, 1)

  const [
    pendingAdmins,
    activeAdmins,
    inactiveAdmins,
    totalCompanies,
    rejectedCompanies,
    newThisMonth,
    newLastMonth,
    companiesThisYear,
  ] = await Promise.all([
    prisma.user.count({ where: { role: Role.ADMIN, status: UserStatus.PENDING } }),
    prisma.user.count({ where: { role: Role.ADMIN, status: UserStatus.ACTIVE } }),
    prisma.user.count({ where: { role: Role.ADMIN, status: UserStatus.INACTIVE } }),
    prisma.company.count({ where: { deletedAt: null } }),
    prisma.user.count({ where: { role: Role.ADMIN, status: UserStatus.REJECTED } }),
    prisma.company.count({ where: { deletedAt: null, createdAt: { gte: startThisMonth } } }),
    prisma.company.count({ where: { deletedAt: null, createdAt: { gte: startLastMonth, lt: startThisMonth } } }),
    prisma.company.findMany({
      where: { deletedAt: null, createdAt: { gte: yearStart } },
      select: { createdAt: true },
    }),
  ])

  const companyDiff = newThisMonth - newLastMonth
  const companyTrend = `${companyDiff >= 0 ? "↑" : "↓"} ${Math.abs(companyDiff)} vs. ${startLastMonth.toLocaleDateString("de-DE", { month: "short" })}`

  // Status-Verteilung der Firmen-Admins für den Donut
  const statusData = [
    { name: "Aktiv", value: activeAdmins, color: "#059669" },
    { name: "Ausstehend", value: pendingAdmins, color: "#ca8a04" },
    { name: "Deaktiviert", value: inactiveAdmins, color: "#6b7280" },
    { name: "Abgelehnt", value: rejectedCompanies, color: "#dc2626" },
  ].filter((d) => d.value > 0)

  // Neue Firmen pro Monat (aktuelles Jahr) für das Balkendiagramm
  const monthNames = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"]
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

      <div className="grid gap-4 md:grid-cols-2">
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
