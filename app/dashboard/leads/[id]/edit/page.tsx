import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import { updateLead } from "@/app/actions/leads"
import { Role } from "@/src/generated/prisma/enums"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { LeadForm } from "@/components/LeadForm"

export const dynamic = "force-dynamic"

type Params = { id: string }

export default async function EditLeadPage({ params }: { params: Promise<Params> }) {
  const { id } = await params

  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  if (!data?.claims) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { supabaseId: data.claims.sub },
    select: { id: true, role: true },
  })
  if (!user) redirect("/login")

  const isAdmin = user.role === Role.ADMIN

  const lead = await prisma.lead.findUnique({
    where: { id },
    select: {
      id: true,
      customerLastName: true,
      vehicleMake: true,
      vehicleModel: true,
      vehicleHsn: true,
      vehicleTsn: true,
      vehicleType: true,
      vehicleEngine: true,
      vehicleMotorCode: true,
      vehicleMileage: true,
      vehicleFuelType: true,
      vehicleProblems: true,
      vehicleDiagnosis: true,
      breakdownStreet: true,
      breakdownPostcode: true,
      breakdownCity: true,
      towTruckDriverId: true,
      internNotice: true,
    },
  })

  if (!lead || (!isAdmin && lead.towTruckDriverId !== user.id)) {
    redirect("/dashboard/leads")
  }

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <Link href={`/dashboard/leads/${lead.id}`} className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4">
          ← Zurück zum Lead
        </Link>
        <h1 className="text-2xl font-bold mt-1">Lead bearbeiten</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Lead-Daten</CardTitle>
          <CardDescription>Aktualisiere die Daten dieses Leads</CardDescription>
        </CardHeader>
        <LeadForm
          action={updateLead}
          lead={lead}
          cancelHref={`/dashboard/leads/${lead.id}`}
        />
      </Card>
    </div>
  )
}
