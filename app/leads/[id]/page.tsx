import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import Link from "next/link"
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
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { StatusBadge, statusOptions } from "@/components/ui/status-badge"
import { updateLeadStatus } from "@/app/actions/leads"
import CancelLeadButton from "@/components/CancelLeadButton"
import {
  Car,
  MapPin,
  Calendar,
  FileText,
  Pencil,
  ArrowLeft,
} from "lucide-react"

export const dynamic = "force-dynamic"

type Params = { id: string }

export default async function LeadDetailPage({ params }: { params: Promise<Params> }) {
  const { id } = await params

  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()

  if (!data?.claims) {
    redirect("/login")
  }

  const driver = await prisma.user.findUnique({
    where: { supabaseId: data.claims.sub },
    select: { id: true },
  })

  if (!driver) redirect("/login")

  const lead = await prisma.lead.findUnique({
    where: { id },
    select: {
      id: true,
      customerLastName: true,
      vehicleMake: true,
      vehicleModel: true,
      breakdownAddress: true,
      status: true,
      createdAt: true,
      towTruckDriverId: true,
      internNotice: true,
    },
  })

  if (!lead || lead.towTruckDriverId !== driver.id) {
    redirect("/leads")
  }

  const isCancelled = lead.status === "CANCELLED"
  const isCompleted = lead.status === "COMPLETED"

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-3xl p-4 md:p-6 lg:p-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/leads">Meine Leads</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{lead.customerLastName}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">
                {lead.customerLastName}
              </h1>
              <StatusBadge status={lead.status} />
            </div>
            <p className="mt-1 text-muted-foreground">
              Lead-Details und Status verwalten
            </p>
          </div>
          {!isCancelled && (
            <Button variant="outline" asChild>
              <Link href={`/leads/${lead.id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Bearbeiten
              </Link>
            </Button>
          )}
        </div>

        <div className="grid gap-6">
          {/* Main Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Lead-Informationen</CardTitle>
              <CardDescription>
                Erfasst am {new Date(lead.createdAt).toLocaleDateString("de-DE", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              {/* Fahrzeug */}
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10">
                  <Car className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Fahrzeug</p>
                  <p className="font-medium">
                    {lead.vehicleMake} {lead.vehicleModel}
                  </p>
                </div>
              </div>

              {/* Standort */}
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pannen-Adresse</p>
                  <p className="font-medium">{lead.breakdownAddress}</p>
                </div>
              </div>

              {/* Datum */}
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Erstellt</p>
                  <p className="font-medium">
                    {new Date(lead.createdAt).toLocaleString("de-DE")}
                  </p>
                </div>
              </div>

              {/* Notiz */}
              {lead.internNotice && (
                <div className="flex items-start gap-3 sm:col-span-2">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Interne Notiz</p>
                    <p className="font-medium">{lead.internNotice}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Status Card */}
          {!isCancelled && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Status verwalten</CardTitle>
                <CardDescription>
                  Aktualisiere den Status dieses Leads
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form action={updateLeadStatus} className="flex flex-wrap items-end gap-3">
                  <input type="hidden" name="leadId" value={lead.id} />
                  <div className="flex-1 min-w-[200px]">
                    <label htmlFor="status" className="mb-2 block text-sm font-medium">
                      Neuer Status
                    </label>
                    <Select name="status" defaultValue={lead.status}>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Status wählen" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit">Status speichern</Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Cancelled/Completed Info */}
          {isCancelled && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="py-4">
                <p className="text-center text-sm font-medium text-red-700">
                  Dieser Lead wurde storniert und kann nicht mehr bearbeitet werden.
                </p>
              </CardContent>
            </Card>
          )}

          {isCompleted && (
            <Card className="border-emerald-200 bg-emerald-50">
              <CardContent className="py-4">
                <p className="text-center text-sm font-medium text-emerald-700">
                  Dieser Lead wurde erfolgreich abgeschlossen.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          {!isCancelled && !isCompleted && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Aktionen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" asChild>
                    <Link href={`/leads/${lead.id}/edit`}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Bearbeiten
                    </Link>
                  </Button>
                  <CancelLeadButton leadId={lead.id} />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Back Link */}
        <div className="mt-6 flex justify-center">
          <Button variant="ghost" asChild>
            <Link href="/leads">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zurück zur Übersicht
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
