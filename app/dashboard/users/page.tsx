import prisma from "@/lib/prisma"
import { Role } from "@/src/generated/prisma/enums"
import { Card, CardContent } from "@/components/ui/card"
import { DriverRow } from "@/components/DriverRow"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { Pagination } from "@/components/Pagination"
import { Button } from "@/components/ui/button"
import { requireUser } from "@/lib/auth"
import { PageHeader } from "@/components/PageHeader"

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
      <PageHeader
        title="Fahrer-Verwaltung"
        subtitle={`${total} Fahrer`}
        action={
          <Button asChild>
            <Link href="/dashboard/users/new">Fahrer anlegen</Link>
          </Button>
        }
      />

      {drivers.length === 0 ? (
        
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Noch keine Fahrer</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>E-Mail</TableHead>
                  <TableHead>Registriert</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {drivers.map((u) => (
                  <DriverRow key={u.id} user={u} />
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      <Pagination page={page} totalPages={totalPages} basePath="/dashboard/users" />
    </div>
  )
}