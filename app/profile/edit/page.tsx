import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import { updateProfile } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { User, Building2, ArrowLeft } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function ProfileEditPage() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  if (!data?.claims) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { supabaseId: data.claims.sub },
    select: {
      firstname: true,
      lastname: true,
      email: true,
      phone: true,
      companyName: true,
      companyAddress: true,
      companyPostcode: true,
      companyCity: true,
      companyPhone: true,
      companyEmail: true,
      companyContactPerson: true,
    },
  })

  if (!user) redirect("/login")

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-2xl p-4 md:p-6 lg:p-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Profil bearbeiten</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Profil bearbeiten</CardTitle>
            <CardDescription>
              Aktualisiere deine persönlichen Daten und Firmenangaben
            </CardDescription>
          </CardHeader>

          <form action={updateProfile}>
            <CardContent className="flex flex-col gap-8">
              {/* Personal Data Section */}
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <h2 className="font-semibold">Persönliche Daten</h2>
                </div>
                <FieldGroup>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field>
                      <FieldLabel htmlFor="firstname">Vorname</FieldLabel>
                      <Input
                        id="firstname"
                        name="firstname"
                        required
                        defaultValue={user.firstname}
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="lastname">Nachname</FieldLabel>
                      <Input
                        id="lastname"
                        name="lastname"
                        required
                        defaultValue={user.lastname}
                      />
                    </Field>
                  </div>

                  <Field>
                    <FieldLabel htmlFor="email">
                      E-Mail{" "}
                      <span className="font-normal text-muted-foreground">
                        (nicht änderbar)
                      </span>
                    </FieldLabel>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      defaultValue={user.email}
                      disabled
                      className="bg-muted"
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="phone">Telefon</FieldLabel>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+49 123 456789"
                      defaultValue={user.phone ?? ""}
                    />
                  </Field>
                </FieldGroup>
              </div>

              {/* Company Data Section */}
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                    <Building2 className="h-4 w-4 text-primary" />
                  </div>
                  <h2 className="font-semibold">Firmendaten</h2>
                </div>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="companyName">Firmenname</FieldLabel>
                    <Input
                      id="companyName"
                      name="companyName"
                      placeholder="Muster GmbH"
                      defaultValue={user.companyName ?? ""}
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="companyAddress">Adresse</FieldLabel>
                    <Input
                      id="companyAddress"
                      name="companyAddress"
                      placeholder="Musterstraße 1"
                      defaultValue={user.companyAddress ?? ""}
                    />
                  </Field>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field>
                      <FieldLabel htmlFor="companyPostcode">PLZ</FieldLabel>
                      <Input
                        id="companyPostcode"
                        name="companyPostcode"
                        placeholder="12345"
                        defaultValue={user.companyPostcode ?? ""}
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="companyCity">Stadt</FieldLabel>
                      <Input
                        id="companyCity"
                        name="companyCity"
                        placeholder="Musterstadt"
                        defaultValue={user.companyCity ?? ""}
                      />
                    </Field>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field>
                      <FieldLabel htmlFor="companyPhone">Firmentelefon</FieldLabel>
                      <Input
                        id="companyPhone"
                        name="companyPhone"
                        type="tel"
                        placeholder="+49 123 456789"
                        defaultValue={user.companyPhone ?? ""}
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="companyEmail">Firmen-E-Mail</FieldLabel>
                      <Input
                        id="companyEmail"
                        name="companyEmail"
                        type="email"
                        placeholder="info@firma.de"
                        defaultValue={user.companyEmail ?? ""}
                      />
                    </Field>
                  </div>

                  <Field>
                    <FieldLabel htmlFor="companyContactPerson">
                      Ansprechpartner
                    </FieldLabel>
                    <Input
                      id="companyContactPerson"
                      name="companyContactPerson"
                      placeholder="Max Mustermann"
                      defaultValue={user.companyContactPerson ?? ""}
                    />
                  </Field>
                </FieldGroup>
              </div>

              {/* Buttons */}
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button variant="outline" asChild>
                  <Link href="/dashboard">Abbrechen</Link>
                </Button>
                <Button type="submit">Änderungen speichern</Button>
              </div>
            </CardContent>
          </form>
        </Card>

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
