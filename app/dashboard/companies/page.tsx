import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import { Role } from "@/src/generated/prisma/enums"
import { Card, CardContent } from "@/components/ui/card"
import { CompanyCard } from "@/components/CompanyCard"

export const dynamic = "force-dynamic"

export default async function CompaniesPage() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  if (!data?.claims) redirect("/login")

  const caller = await prisma.user.findUnique({
    where: { supabaseId: data.claims.sub },
    select: { role: true },
  })
  if (caller?.role !== Role.SUPER_ADMIN) redirect("/dashboard")

  const admins = await prisma.user.findMany({
    where: { role: Role.ADMIN, deletedAt: null },
    select: {
      id: true, firstname: true, lastname: true, email: true, phone: true,
      status: true, createdAt: true,
      companyName: true, companyAddress: true, companyPostcode: true,
      companyCity: true, companyPhone: true, companyEmail: true, companyWebsite: true,
      companyContactFirstname: true, companyContactLastname: true,
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Unternehmen</h1>
        <p className="text-muted-foreground">{admins.length} Firmen-Admins</p>
      </div>

      {admins.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Noch keine Unternehmen</p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {admins.map((a) => (
            <CompanyCard key={a.id} user={a} />
          ))}
        </div>
      )}
    </div>
  )
}
