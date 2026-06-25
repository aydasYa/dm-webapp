import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import { updateProfile } from "@/app/actions/profile"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

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
      companyContactFirstname: true,
      companyContactLastname: true,
    },
  })
  if (!user) redirect("/login")

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <Link href="/dashboard/profile" className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4">
          ← Zurück zum Profil
        </Link>
        <h1 className="text-2xl font-bold mt-1">Profil bearbeiten</h1>
      </div>

      <form action={updateProfile} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Persönliche Daten</CardTitle>
            <CardDescription>Dein Name und Kontakt</CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Firmendaten</CardTitle>
            <CardDescription>Deine Niederlassung und Ansprechpartner</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="companyName">Firmenname</FieldLabel>
                <Input id="companyName" name="companyName" defaultValue={user.companyName ?? ""} />
              </Field>
              <Field>
                <FieldLabel htmlFor="companyAddress">Straße und Hausnummer</FieldLabel>
                <Input id="companyAddress" name="companyAddress" defaultValue={user.companyAddress ?? ""} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="companyPostcode">PLZ</FieldLabel>
                  <Input id="companyPostcode" name="companyPostcode" defaultValue={user.companyPostcode ?? ""} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="companyCity">Ort</FieldLabel>
                  <Input id="companyCity" name="companyCity" defaultValue={user.companyCity ?? ""} />
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor="companyPhone">Firmentelefon</FieldLabel>
                <Input id="companyPhone" name="companyPhone" type="tel" defaultValue={user.companyPhone ?? ""} />
              </Field>
              <Field>
                <FieldLabel htmlFor="companyEmail">Firmen-E-Mail</FieldLabel>
                <Input id="companyEmail" name="companyEmail" type="email" defaultValue={user.companyEmail ?? ""} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="companyContactFirstname">Vorname Ansprechpartner</FieldLabel>
                  <Input id="companyContactFirstname" name="companyContactFirstname" defaultValue={user.companyContactFirstname ?? ""} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="companyContactLastname">Nachname Ansprechpartner</FieldLabel>
                  <Input id="companyContactLastname" name="companyContactLastname" defaultValue={user.companyContactLastname ?? ""} />
                </Field>
              </div>
            </FieldGroup>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button asChild variant="outline" className="flex-1">
            <Link href="/dashboard/profile">Abbrechen</Link>
          </Button>
          <Button type="submit" className="flex-1">Speichern</Button>
        </div>
      </form>
    </div>
  )
}
