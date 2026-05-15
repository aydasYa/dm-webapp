import Link from "next/link"
import prisma from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { LeadStatus } from "@/src/generated/prisma/enums"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const dynamic = "force-dynamic"

type SearchParams = {
  status?: string
}

// Status-Farben: jeder Status erhält ein bestimmten Farb-code für bessere UX
const statusStyles: Record<string, string> = {
  NEW:               "bg-violet-100 text-violet-700 ring-violet-200",
  DISTRIBUTED:       "bg-blue-100 text-blue-700 ring-blue-200",
  QR_SCANNED:        "bg-cyan-100 text-cyan-700 ring-cyan-200",
  WORKSHOP_SELECTED: "bg-indigo-100 text-indigo-700 ring-indigo-200",
  IN_REPAIR:         "bg-yellow-100 text-yellow-700 ring-yellow-200",
  REPAIR_DONE:       "bg-orange-100 text-orange-700 ring-orange-200",
  VEHICLE_DELIVERED: "bg-teal-100 text-teal-700 ring-teal-200",
  COMPLETED:         "bg-emerald-100 text-emerald-800 ring-emerald-300",
  CANCELLED:         "bg-red-100 text-red-700 ring-red-200",
}

export default async function LeadsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  const { status } = await searchParams

  if (!data?.claims) redirect("/login")

  const driver = await prisma.user.findUnique({
    where: { supabaseId: data.claims.sub },
    select: { id: true },
  })

  if (!driver) redirect("/login")

  const driverLeads = await prisma.lead.findMany({
    where: {
      towTruckDriverId: driver.id,
      deletedAt: null,
      ...(status && { status: status as LeadStatus }),
    },
    select: {
      id: true,
      customerLastName: true,
      vehicleMake: true,
      vehicleModel: true,
      breakdownAddress: true,
      status: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <main className="min-h-svh bg-muted p-6 md:p-10">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Meine Leads</h1>
          <Button asChild>
            <Link href="/leads/new">+ Neuer Lead</Link>
          </Button>
        </div>

        {/* Filter */}
        <Card>
          <CardContent className="pt-6">
            <form action="/leads" method="get" className="flex items-center gap-3">
              <label htmlFor="status" className="text-sm font-medium">Status:</label>
              <select 
                id="status" 
                name="status" 
                defaultValue={status ?? ''}
                className="border rounded-md px-3 py-1.5 text-sm bg-background"
              >
                <option value="">Alle</option>
                <option value="NEW">NEW</option>
                <option value="DISTRIBUTED">DISTRIBUTED</option>
                <option value="QR_SCANNED">QR_SCANNED</option>
                <option value="WORKSHOP_SELECTED">WORKSHOP_SELECTED</option>
                <option value="IN_REPAIR">IN_REPAIR</option>
                <option value="REPAIR_DONE">REPAIR_DONE</option>
                <option value="VEHICLE_DELIVERED">VEHICLE_DELIVERED</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
              <Button type="submit" variant="outline" size="sm">Filtern</Button>
            </form>
          </CardContent>
        </Card>

        {/* Lead-Liste */}
        {driverLeads.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">Noch keine Leads erfasst</p>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {driverLeads.map((lead) => (
              <Link 
                key={lead.id} 
                href={`/leads/${lead.id}`}
                className="block"
              >
                <Card className="transition-colors hover:bg-accent">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{lead.customerLastName}</CardTitle>
                        <span className={`text-xs font-medium rounded-full px-2 py-1 ring-1 ring-inset ${statusStyles[lead.status] ?? statusStyles.NEW}`}>
                        {lead.status}
                        </span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-1 text-sm text-muted-foreground">
                    <p>{lead.vehicleMake} {lead.vehicleModel}</p>
                    <p>{lead.breakdownAddress}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-center">
          <Button asChild variant="ghost">
            <Link href="/dashboard" className="underline underline-offset-4 text-sm text-muted-foreground">Zurück zum Dashboard</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}