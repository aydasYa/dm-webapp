import prisma from "@/lib/prisma"
import { Role } from "@/src/generated/prisma/enums"
import { Card, CardContent } from "@/components/ui/card"
import { CompanyRow } from "@/components/CompanyRow"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { requireUser } from "@/lib/auth"
import { PageHeader } from "@/components/PageHeader"

export const dynamic = "force-dynamic"

export default async function CompaniesPage() {
  await requireUser(Role.SUPER_ADMIN)

  const admins = await prisma.user.findMany({
    where: { role: Role.ADMIN, deletedAt: null },
    select: {
      id: true, 
      firstname: true, 
      lastname: true, 
      email: true, 
      phone: true,
      status: true,
      createdAt: true,
      company: {
        select: {
          name: true,
          address: true,
          postcode: true,
          city: true,
          phone: true,
          email: true,
          website: true,
          contactFirstname: true,
          contactLastname: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <PageHeader title="Unternehmen" subtitle={`${admins.length} Firmen-Admins`} />

      <p className="text-sm text-muted-foreground">{admins.length} Einträge insgesamt</p>

      {admins.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Noch keine Unternehmen</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Unternehmen</TableHead>
                  <TableHead>Admin</TableHead>
                  <TableHead>Registriert</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((a) => (
                  <CompanyRow key={a.id} user={a} />
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
