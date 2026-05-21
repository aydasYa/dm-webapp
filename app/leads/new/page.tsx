import Link from "next/link"
import { createLead } from "@/app/actions/leads"
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

export default function NewLeadPage() {
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
              <BreadcrumbPage>Neuer Lead</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Neuen Lead erstellen</CardTitle>
            <CardDescription>
              Erfasse einen neuen Lead aus deinem Einsatz
            </CardDescription>
          </CardHeader>

          <form action={createLead}>
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
                    placeholder="z.B. Müller"
                    required
                  />
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="vehicleMake">Fahrzeug-Marke</FieldLabel>
                    <Input
                      id="vehicleMake"
                      name="vehicleMake"
                      type="text"
                      placeholder="z.B. BMW"
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="vehicleModel">Fahrzeug-Modell</FieldLabel>
                    <Input
                      id="vehicleModel"
                      name="vehicleModel"
                      type="text"
                      placeholder="z.B. 320d"
                      required
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
                    placeholder="z.B. A1 Rastplatz Nord, km 234"
                    required
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
                    placeholder="Zusätzliche Informationen zum Einsatz..."
                  />
                </Field>
              </FieldGroup>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button variant="outline" asChild>
                  <Link href="/leads">Abbrechen</Link>
                </Button>
                <Button type="submit">Lead speichern</Button>
              </div>
            </CardContent>
          </form>
        </Card>

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
