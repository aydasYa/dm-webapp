import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import { Role } from "@/src/generated/prisma/enums"
import { Card, CardContent } from "@/components/ui/card"
import { DriverCard } from "@/components/DriverCard"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic"

const USER_SELECT = {
  id: true, firstname: true, lastname: true, email: true, phone: true,
  status: true, qrCode: true,
  createdAt: true, companyName: true, companyAddress: true, companyPostcode: true,
  companyCity: true, companyPhone: true, companyEmail: true,
  companyContactFirstname: true, companyContactLastname: true,
} as const

export default async function UsersPage() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  if (!data?.claims) redirect("/login")

  const caller = await prisma.user.findUnique({
    where: { supabaseId: data.claims.sub },
    select: { role: true },
  })
  if (caller?.role !== Role.ADMIN) redirect("/dashboard")

  const drivers = await prisma.user.findMany({
    where: { role: Role.TOW_TRUCK_DRIVER, deletedAt: null },
    select: USER_SELECT,
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Fahrer-Verwaltung</h1>
          <p className="text-muted-foreground">{drivers.length} Fahrer</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/users/new">Fahrer anlegen</Link>
        </Button>
      </div>

      {drivers.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Noch keine Fahrer</p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {drivers.map((u) => (
            <DriverCard key={u.id} user={u} />
          ))}
        </div>
      )}
    </div>
  )
}