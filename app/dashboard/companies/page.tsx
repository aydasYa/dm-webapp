import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import { Role, UserStatus } from "@/src/generated/prisma/enums"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { reviewCompanyAdmin } from "@/app/actions/auth"

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
      id: true, firstname: true, lastname: true, email: true,
      status: true, companyName: true, createdAt: true,
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
            <Card key={a.id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-4 pt-6">
                <div>
                  <p className="font-semibold">{a.companyName ?? "—"}</p>
                  <p className="text-sm text-muted-foreground">
                    {a.firstname} {a.lastname} · {a.email}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">Status: {a.status}</p>
                </div>

                {a.status === UserStatus.PENDING && (
                  <div className="flex gap-2">
                    <form action={reviewCompanyAdmin}>
                      <input type="hidden" name="userId" value={a.id} />
                      <input type="hidden" name="newStatus" value={UserStatus.ACTIVE} />
                      <Button type="submit" size="sm">Freigeben</Button>
                    </form>
                    <form action={reviewCompanyAdmin}>
                      <input type="hidden" name="userId" value={a.id} />
                      <input type="hidden" name="newStatus" value={UserStatus.REJECTED} />
                      <Button type="submit" size="sm" variant="outline">Ablehnen</Button>
                    </form>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
