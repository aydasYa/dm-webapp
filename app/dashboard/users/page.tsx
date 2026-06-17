import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import { Role, UserStatus } from "@/src/generated/prisma/enums"
import { Card, CardContent } from "@/components/ui/card"
import { DriverCard } from "@/components/DriverCard"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic"

const STATUS_MAP: Record<string, UserStatus> = {
  pending: UserStatus.PENDING,
  active: UserStatus.ACTIVE,
  // rejected: UserStatus.REJECTED, (evtl. Nur in Super-Admin (DeinMotorschaden-Admin))
}

const TAB_LABELS: Record<string, string> = {
  pending: "Ausstehend",
  active: "Freigegeben",
  rejected: "Abgelehnt",
}

const USER_SELECT = {
  id: true,
  firstname: true,
  lastname: true,
  email: true,
  phone: true,
  createdAt: true,
  companyName: true,
  companyAddress: true,
  companyPostcode: true,
  companyCity: true,
  companyPhone: true,
  companyEmail: true,
  companyContactFirstname: true,
  companyContactLastname: true,
} as const

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  if (!data?.claims) redirect("/login")

  const caller = await prisma.user.findUnique({
    where: { supabaseId: data.claims.sub },
    select: { role: true },
  })
  if (caller?.role !== Role.ADMIN) redirect("/dashboard")

  const { status: statusParam } = await searchParams
  const activeTab = statusParam && statusParam in STATUS_MAP ? statusParam : "pending"
  const currentStatus = STATUS_MAP[activeTab]

  const driverFilter = currentStatus === UserStatus.ACTIVE ? { role: Role.TOW_TRUCK_DRIVER } : {}

  const [pendingCount, activeCount, rejectedCount, users] = await Promise.all([
    prisma.user.count({ where: { status: UserStatus.PENDING } }),
    prisma.user.count({ where: { status: UserStatus.ACTIVE, role: Role.TOW_TRUCK_DRIVER } }),
    prisma.user.count({ where: { status: UserStatus.REJECTED } }),
    prisma.user.findMany({
      where: { status: currentStatus, ...driverFilter },
      select: USER_SELECT,
      orderBy: { createdAt: "desc" },
    }),
  ])

  const counts: Record<string, number> = {
    pending: pendingCount,
    active: activeCount,
    rejected: rejectedCount,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Fahrer-Verwaltung</h1>
          <p className="text-muted-foreground">
            {users.length} {TAB_LABELS[activeTab].toLowerCase()}{users.length === 1 ? "r" : ""} Fahrer
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/users/new">Fahrer anlegen</Link>
        </Button>
      </div>

      {/* Tab-Navigation */}
      <div className="flex border-b">
        {(["pending", "active", ] as const).map((tab) => ( // <- man kan hier "rejected" einfügen damit der verstecke tab "Abgelehnt" aktiviert wird
          <Link
            key={tab}
            href={`?status=${tab}`}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {TAB_LABELS[tab]}
            {counts[tab] > 0 && (
              <span className={cn(
                "rounded-full px-1.5 py-0.5 text-xs font-medium",
                activeTab === tab
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}>
                {counts[tab]}
              </span>
            )}
          </Link>
        ))}
      </div>

      {/* Inhalt */}
      {users.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Keine {TAB_LABELS[activeTab].toLowerCase()}en Fahrer
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {users.map((u) => (
            <DriverCard
              key={u.id}
              user={u}
              // showActions={activeTab === "pending"} // kann wieder aktiviert werden für Super-Admin von DeinMotorschaden
              showActions={false}
            />
          ))}
        </div>
      )}
    </div>
  )
}
