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

export default function NewLead() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-md flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 self-center font-medium">
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Neuen Lead erstellen</CardTitle>
            <CardDescription>Erfasse einen neuen Lead aus deinem Einsatz</CardDescription>
          </CardHeader>

          <form action={createLead}>
            <CardContent className="flex flex-col gap-6">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="customerLastName">Nachname des Kunden</FieldLabel>
                  <Input
                    id="customerLastName"
                    name="customerLastName"
                    type="text"
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="vehicleMake">Fahrzeug-Marke</FieldLabel>
                  <Input
                    id="vehicleMake"
                    name="vehicleMake"
                    type="text"
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="vehicleModel">Fahrzeug-Modell</FieldLabel>
                  <Input
                    id="vehicleModel"
                    name="vehicleModel"
                    type="text"
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="breakdownAddress">Pannen-Adresse</FieldLabel>
                  <Input
                    id="breakdownAddress"
                    name="breakdownAddress"
                    type="text"
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="internNotice">Interne Notiz (Optional)</FieldLabel>
                  <Textarea
                    id="internNotice"
                    name="internNotice"
                    rows={3}
                  />
                </Field>
              </FieldGroup>

              <Button type="submit" className="w-full">
                Lead speichern
              </Button>

              <div className="flex justify-center gap-4 text-sm text-muted-foreground">
                <Link href="/leads" className="underline underline-offset-4">
                  Zur Lead-Übersicht
                </Link>
                <Link href="/dashboard" className="underline underline-offset-4">
                  Zum Dashboard
                </Link>
              </div>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  )
}