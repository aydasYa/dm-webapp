import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import { Role, LeadStatus } from "@/src/generated/prisma/enums"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { STATUS_LABELS, STATUS_STYLES } from "@/lib/lead-status"

export const dynamic = "force-dynamic"

type SearchParams = { status?: string; q?: string }

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const { status, q } = await searchParams

  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  if (!data?.claims) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { supabaseId: data.claims.sub },
    select: { id: true, role: true, companyId: true },
  })
  if (!user) redirect("/login")

  const isAdmin = user.role === Role.ADMIN

  const leads = await prisma.lead.findMany({
    where: {
      deletedAt: null,
      // Admin sieht alle Leads SEINER Firma (über den Fahrer), Driver nur eigene
      ...(isAdmin ? { towTruckDriver: { companyId: user.companyId } } : { towTruckDriverId: user.id }),
      ...(status ? { status: status as LeadStatus } : {}),
      ...(q ? {
        OR: [
          { customerLastName: { contains: q, mode: "insensitive" } },
          { vehicleMake:      { contains: q, mode: "insensitive" } },
          { vehicleModel:     { contains: q, mode: "insensitive" } },
          { breakdownCity:    { contains: q, mode: "insensitive" } },
        ],
      } : {}),
    },
    select: {
      id: true,
      customerLastName: true,
      vehicleMake: true,
      vehicleModel: true,
      breakdownCity: true,
      breakdownPostcode: true,
      status: true,
      createdAt: true,
      ...(isAdmin && {
        towTruckDriver: {
          select: { firstname: true, lastname: true, companyName: true },
        },
      }),
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{isAdmin ? "Alle Leads" : "Meine Leads"}</h1>
        {!isAdmin && (
          <Button asChild>
            <Link href="/dashboard/leads/new">+ Neuer Lead</Link>
          </Button>
        )}
      </div>

      {/* Filter & Suche */}
      <form method="get" className="flex flex-wrap gap-3 items-end">
        <div className="flex flex-col gap-1">
          <label htmlFor="q" className="text-sm font-medium">Suche</label>
          <Input
            id="q"
            name="q"
            placeholder="Kunde, Fahrzeug, Ort…"
            defaultValue={q ?? ""}
            className="w-56"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="status" className="text-sm font-medium">Status</label>
          <select
            id="status"
            name="status"
            defaultValue={status ?? ""}
            className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm"
          >
            <option value="">Alle</option>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <Button type="submit" variant="outline" size="sm">Filtern</Button>
        {(q || status) && (
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard/leads">Zurücksetzen</Link>
          </Button>
        )}
      </form>

      {/* Tabelle */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium text-muted-foreground">
            {leads.length} {leads.length === 1 ? "Lead" : "Leads"} gefunden
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {leads.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">Keine Leads gefunden</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Datum</TableHead>
                  <TableHead>Kunde</TableHead>
                  <TableHead>Fahrzeug</TableHead>
                  <TableHead>Ort</TableHead>
                  <TableHead>Status</TableHead>
                  {isAdmin && <TableHead>Fahrer</TableHead>}
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {lead.createdAt.toLocaleDateString("de-DE")}
                    </TableCell>
                    <TableCell className="font-medium">{lead.customerLastName}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {lead.vehicleMake} {lead.vehicleModel}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {lead.breakdownPostcode} {lead.breakdownCity}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[lead.status] ?? ""}`}>
                        {STATUS_LABELS[lead.status] ?? lead.status}
                      </span>
                    </TableCell>
                    {isAdmin && (
                      <TableCell className="text-sm text-muted-foreground">
                        {"towTruckDriver" in lead && lead.towTruckDriver
                          ? `${lead.towTruckDriver.firstname} ${lead.towTruckDriver.lastname}`
                          : "—"}
                      </TableCell>
                    )}
                    <TableCell>
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/dashboard/leads/${lead.id}`}>Details</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
