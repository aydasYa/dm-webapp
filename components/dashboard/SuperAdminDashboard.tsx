import prisma from "@/lib/prisma"
import { Role, UserStatus } from "@/src/generated/prisma/enums"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function SuperAdminDashboard({ firstname }: { firstname: string }) {
  const pendingAdmins = await prisma.user.count({ where: { role: Role.ADMIN, status: UserStatus.PENDING } })
  const activeAdmins = await prisma.user.count({ where: { role: Role.ADMIN, status: UserStatus.ACTIVE } })
  const totalCompanies = await prisma.company.count({ where: { deletedAt: null } })

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
        <Card>
          <CardHeader><CardTitle className="text-base font-semibold">Warten auf Freigabe</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{pendingAdmins}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base font-semibold">Aktive Unternehmen</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{activeAdmins}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base font-semibold">Unternehmen gesamt</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{totalCompanies}</p></CardContent>
        </Card>
      </div>
    </div>
  )
}
