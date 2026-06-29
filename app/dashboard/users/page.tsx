import prisma from "@/lib/prisma"
import { Role } from "@/src/generated/prisma/enums"
import { Card, CardContent } from "@/components/ui/card"
import { DriverCard } from "@/components/DriverCard"
import Link from "next/link"
import { Pagination } from "@/components/Pagination"
import { Button } from "@/components/ui/button"
import { requireUser } from "@/lib/auth"

export const dynamic = "force-dynamic"

const USER_SELECT = {
  id: true, 
  firstname: true,
  lastname: true, 
  email: true, 
  phone: true,
  status: true, 
  qrCode: true,
  createdAt: true,
  company: {
    select: {
      name: true,
      address: true,
      postcode: true,
      city: true,
      phone: true,
      email: true,
      contactFirstname: true,
      contactLastname: true,
    },
  },
} as const

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const caller = await requireUser(Role.ADMIN)

  const { page: pageParam } = await searchParams
  const page = Math.max(1, Number(pageParam) || 1)
  const pageSize = 5

  const where = { role: Role.TOW_TRUCK_DRIVER, deletedAt: null, companyId: caller.companyId }

  const [total, drivers] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      select: USER_SELECT,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ])

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Fahrer-Verwaltung</h1>
          <p className="text-muted-foreground">{total} Fahrer</p>
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
      <Pagination page={page} totalPages={totalPages} basePath="/dashboard/users" />
    </div>
  )
}