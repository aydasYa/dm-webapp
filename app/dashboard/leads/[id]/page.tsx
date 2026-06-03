import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { updateLeadStatus } from "@/app/actions/leads"
import CancelLeadDialog from "@/components/CancelLeadDialog"
import { Role } from "@/src/generated/prisma/enums"
import { STATUS_LABELS } from "@/lib/lead-status"

export const dynamic = "force-dynamic"

type Params = { id: string }

export default async function LeadDetailPage({ params }: { params: Promise<Params> }) {
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
      status: true,
      createdAt: true,
      towTruckDriverId: true,
      internNotice: true,
    },
  })

  if (!lead || (!isAdmin && lead.towTruckDriverId !== user.id)) {
    redirect("/dashboard/leads")
  }

  const isCancelled = lead.status === "CANCELLED"

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/dashboard/leads" className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4">
            ← Zur Übersicht
          </Link>
          <h1 className="text-2xl font-bold mt-1">Lead: {lead.customerLastName}</h1>
        </div>
        {!isCancelled && (
          <Button asChild variant="outline">
            <Link href={`/dashboard/leads/${lead.id}/edit`}>Bearbeiten</Link>
          </Button>
        )}
      </div>

      {/* Fahrzeugdaten */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Fahrzeug</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <Row label="Marke" value={lead.vehicleMake} />
          <Row label="Modell" value={lead.vehicleModel} />
          {lead.vehicleType     && <Row label="Typ"       value={lead.vehicleType} />}
          {lead.vehicleFuelType && <Row label="Kraftstoff" value={lead.vehicleFuelType} />}
          {lead.vehicleMileage  && <Row label="Kilometerstand" value={`${lead.vehicleMileage} km`} />}
          {lead.vehicleEngine   && <Row label="Motor"     value={lead.vehicleEngine} />}
          {lead.vehicleMotorCode && <Row label="Motorcode" value={lead.vehicleMotorCode} />}
          {lead.vehicleHsn      && <Row label="HSN"       value={lead.vehicleHsn} />}
          {lead.vehicleTsn      && <Row label="TSN"       value={lead.vehicleTsn} />}
        </CardContent>
      </Card>

      {/* Pannort */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pannort</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <Row label="Straße"  value={lead.breakdownStreet} />
          <Row label="PLZ"     value={lead.breakdownPostcode} />
          <Row label="Ort"     value={lead.breakdownCity} />
        </CardContent>
      </Card>

      {/* Probleme & Diagnose */}
      {(lead.vehicleProblems.length > 0 || lead.vehicleDiagnosis) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Problembeschreibung</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {lead.vehicleProblems.length > 0 && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">Symptome</p>
                <ul className="list-disc list-inside space-y-0.5">
                  {lead.vehicleProblems.map((p) => <li key={p}>{p}</li>)}
                </ul>
              </div>
            )}
            {lead.vehicleDiagnosis && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">Diagnose</p>
                <p>{lead.vehicleDiagnosis}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <p>Aktuell: <span className="font-medium">{STATUS_LABELS[lead.status] ?? lead.status}</span></p>
          <p className="text-muted-foreground">Erstellt: {lead.createdAt.toLocaleString("de-DE")}</p>
          {lead.internNotice && (
            <p className="text-muted-foreground">Interne Notiz: {lead.internNotice}</p>
          )}

          {!isCancelled && (
            <form action={updateLeadStatus} className="flex items-center gap-3 pt-2">
              <input type="hidden" name="leadId" value={lead.id} />
              <label htmlFor="status" className="font-medium">Status ändern:</label>
              <select
                name="status"
                id="status"
                defaultValue={lead.status}
                className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm"
              >
                {Object.entries(STATUS_LABELS)
                  .filter(([v]) => v !== "CANCELLED")
                  .map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
              </select>
              <Button type="submit" variant="outline" size="sm">Speichern</Button>
            </form>
          )}
        </CardContent>
      </Card>

      {!isCancelled && <CancelLeadDialog leadId={lead.id} />}
    </div>
  )
}

function Row({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null
  return (
    <>
      <span className="text-muted-foreground">{label}</span>
      <span>{value}</span>
    </>
  )
}
