import Link from "next/link"
import prisma from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { LeadStatus } from "@/src/generated/prisma/enums"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StatusBadge, statusOptions } from "@/components/ui/status-badge"
import { Plus, ArrowLeft, FileText } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export const dynamic = "force-dynamic"

type SearchParams = {
  status?: string
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
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-5xl p-4 md:p-6 lg:p-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Meine Leads</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Meine Leads</h1>
            <p className="text-muted-foreground">
              {driverLeads.length} {driverLeads.length === 1 ? "Lead" : "Leads"} erfasst
            </p>
          </div>
          <Button asChild>
            <Link href="/leads/new">
              <Plus className="mr-2 h-4 w-4" />
              Neuer Lead
            </Link>
          </Button>
        </div>

        {/* Filter Card */}
        <Card className="mb-6">
          <CardContent className="py-4">
            <form action="/leads" method="get" className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">Filtern nach:</span>
              <Select name="status" defaultValue={status ?? "all"}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Alle Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Status</SelectItem>
                  {statusOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="submit" variant="secondary" size="sm">
                Anwenden
              </Button>
              {status && (
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/leads">Filter zurücksetzen</Link>
                </Button>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Leads Table/Cards */}
        {driverLeads.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Keine Leads gefunden</h3>
              <p className="mt-1 text-sm text-muted-foreground text-center">
                {status
                  ? "Keine Leads mit diesem Status vorhanden."
                  : "Du hast noch keine Leads erfasst."}
              </p>
              <Button asChild className="mt-4">
                <Link href="/leads/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Ersten Lead anlegen
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Desktop Table */}
            <Card className="hidden md:block">
              <CardHeader>
                <CardTitle className="text-base">Übersicht</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Kunde</TableHead>
                      <TableHead>Fahrzeug</TableHead>
                      <TableHead>Standort</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Datum</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {driverLeads.map((lead) => (
                      <TableRow key={lead.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell>
                          <Link
                            href={`/leads/${lead.id}`}
                            className="font-medium hover:underline"
                          >
                            {lead.customerLastName}
                          </Link>
                        </TableCell>
                        <TableCell>
                          {lead.vehicleMake} {lead.vehicleModel}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {lead.breakdownAddress}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={lead.status} />
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(lead.createdAt).toLocaleDateString("de-DE")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Mobile Cards */}
            <div className="flex flex-col gap-3 md:hidden">
              {driverLeads.map((lead) => (
                <Link key={lead.id} href={`/leads/${lead.id}`} className="block">
                  <Card className="transition-colors hover:bg-muted/50">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{lead.customerLastName}</CardTitle>
                        <StatusBadge status={lead.status} />
                      </div>
                      <CardDescription>
                        {lead.vehicleMake} {lead.vehicleModel}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground truncate">
                        {lead.breakdownAddress}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {new Date(lead.createdAt).toLocaleDateString("de-DE")}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* Back Link */}
        <div className="mt-6 flex justify-center">
          <Button variant="ghost" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zurück zum Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
