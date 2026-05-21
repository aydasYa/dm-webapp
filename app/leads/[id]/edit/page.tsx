import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import { updateLead } from "@/app/actions/leads"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ArrowLeft } from "lucide-react"

export const dynamic = "force-dynamic"

type Params = { id: string }

export default async function EditLeadPage({ params }: { params: Promise<Params> }) {
  const { id } = await params

  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  if (!data?.claims) redirect("/login")

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
      towTruckDriverId: true,
      internNotice: true,
      status: true,
    },
  })

  if (!lead || lead.towTruckDriverId !== driver.id) {
    redirect("/leads")
  }

  // Stornierte Leads können nicht bearbeitet werden
  if (lead.status === "CANCELLED") {
    redirect(`/leads/${lead.id}`)
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-xl p-4 md:p-6 lg:p-8">
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
              <BreadcrumbLink href={`/leads/${lead.id}`}>
                {lead.customerLastName}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Bearbeiten</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Lead bearbeiten</CardTitle>
            <CardDescription>
              Aktualisiere die Daten für {lead.customerLastName}
            </CardDescription>
          </CardHeader>

          <form action={updateLead}>
            <CardContent className="flex flex-col gap-6">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="customerLastName">
                    Nachname des Kunden
                  </FieldLabel>
                  <Input
                    id="customerLastName"
                    name="customerLastName"
                    type="text"
                    required
                    defaultValue={lead.customerLastName}
                  />
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="vehicleMake">Fahrzeug-Marke</FieldLabel>
                    <Input
                      id="vehicleMake"
                      name="vehicleMake"
                      type="text"
                      required
                      defaultValue={lead.vehicleMake}
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="vehicleModel">Fahrzeug-Modell</FieldLabel>
                    <Input
                      id="vehicleModel"
                      name="vehicleModel"
                      type="text"
                      required
                      defaultValue={lead.vehicleModel}
                    />
                  </Field>
                </div>

                <Field>
                  <FieldLabel htmlFor="breakdownAddress">
                    Pannen-Adresse
                  </FieldLabel>
                  <Input
                    id="breakdownAddress"
                    name="breakdownAddress"
                    type="text"
                    required
                    defaultValue={lead.breakdownAddress}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="internNotice">
                    Interne Notiz{" "}
                    <span className="font-normal text-muted-foreground">
                      (Optional)
                    </span>
                  </FieldLabel>
                  <Textarea
                    id="internNotice"
                    name="internNotice"
                    rows={3}
                    defaultValue={lead.internNotice ?? ""}
                  />
                </Field>
                <input type="hidden" name="leadId" value={lead.id} />
              </FieldGroup>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button variant="outline" asChild>
                  <Link href={`/leads/${lead.id}`}>Abbrechen</Link>
                </Button>
                <Button type="submit">Änderungen speichern</Button>
              </div>
            </CardContent>
          </form>
        </Card>

        {/* Back Link */}
        <div className="mt-6 flex justify-center">
          <Button variant="ghost" asChild>
            <Link href={`/leads/${lead.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zurück zum Lead
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
