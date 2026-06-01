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

export const dynamic = "force-dynamic"

export default async function ProfileEditPage() {
  // 1. Login prüfen
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  if (!data?.claims) redirect("/login")

  // 2. User laden -> alle Fehlder die im Form vorausgefüllt werden
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
      companyContactFirstname: true,
      companyContactLastname: true,
    },
  })

  if (!user) redirect("/login")

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-2xl flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Profil bearbeiten</CardTitle>
            <CardDescription>Aktualisiere deine persönlichen und Firmendaten</CardDescription>
          </CardHeader>

          <form action={updateProfile}>
            <CardContent className="flex flex-col gap-8">

              {/* SEKTION 1: PERSÖNLICHE DATEN */}
              <div>
                <h2 className="text-lg font-semibold mb-4">Persönliche Daten</h2>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="firstname">Vorname</FieldLabel>
                    <Input id="firstname" name="firstname" required defaultValue={user.firstname} />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="lastname">Nachname</FieldLabel>
                    <Input id="lastname" name="lastname" required defaultValue={user.lastname} />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="email">E-Mail (nicht änderbar)</FieldLabel>
                    <Input id="email" name="email" type="email" defaultValue={user.email} disabled />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="phone">Telefon</FieldLabel>
                    <Input id="phone" name="phone" type="tel" defaultValue={user.phone ?? ""} />
                  </Field>
                </FieldGroup>
              </div>{/*  */}

              {/* SEKTION 2: FIRMENDATEN */}
              <div>
                <h2 className="text-lg font-semibold mb-4">Firmendaten</h2>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="companyName">Firmenname</FieldLabel>
                    <Input id="companyName" name="companyName" defaultValue={user.companyName ?? ""} />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="companyAddress">Adresse</FieldLabel>
                    <Input id="companyAddress" name="companyAddress" defaultValue={user.companyAddress ?? ""} />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="companyPostcode">PLZ</FieldLabel>
                    <Input id="companyPostcode" name="companyPostcode" defaultValue={user.companyPostcode ?? ""} />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="companyCity">Stadt</FieldLabel>
                    <Input id="companyCity" name="companyCity" defaultValue={user.companyCity ?? ""} />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="companyPhone">Firmentelefon</FieldLabel>
                    <Input id="companyPhone" name="companyPhone" type="tel" defaultValue={user.companyPhone ?? ""} />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="companyEmail">Firma E-Mail</FieldLabel>
                    <Input id="companyEmail" name="companyEmail" type="email" defaultValue={user.companyEmail ?? ""} />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="companyContactFirstname">Vorname Ansprechpartner</FieldLabel>
                    <Input
                      id="companyContactFirstname"
                      name="companyContactFirstname"
                      defaultValue={user.companyContactFirstname ?? ""}
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="companyContactLastname">Nachname Ansprechpartner</FieldLabel>
                    <Input
                      id="companyContactLastname"
                      name="companyContactLastname"
                      defaultValue={user.companyContactLastname ?? ""}
                    />
                  </Field>
                </FieldGroup>
              </div>

              {/* BUTTONS */}
              <div className="flex gap-3">
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/dashboard/profile">Abbrechen</Link>
                </Button>
                <Button type="submit" className="flex-1">Speichern</Button>
              </div>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  )
}