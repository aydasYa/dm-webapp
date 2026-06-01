import Link from "next/link"
import { FormField } from "@/components/form/FormField"
import { signupFields } from "@/app/signup/fields"
import { signup } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { FieldGroup } from "@/components/ui/field"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function SignUp() {
  const personalFields = signupFields.filter((f) => f.group === 'personal')
  const companyFields = signupFields.filter((f) => f.group === 'company')

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-3xl flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 self-center font-medium">
          {/* <span className="text-lg font-bold">DeinMotorschaden</span> */}
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Registrieren</CardTitle>
            <CardDescription className="text-sm text-balance text-muted-foreground">Erstelle deinen Account</CardDescription>
            <p className="text-sm text-muted-foreground">
              Felder mit <span className="font-medium text-red-600">*</span> sind Pflichtfelder.
            </p>
          </CardHeader>

          <form action={signup}>
            <CardContent className="flex flex-col gap-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FieldGroup>
                  <h2 className="font-semibold">Persönliche Informationen</h2>
                  {personalFields.map((field) => (
                    <FormField field={field} key={field.id} />
                  ))}
                </FieldGroup>

                <FieldGroup>
                  <h2 className="font-semibold">Firmen Informationen</h2>
                  {companyFields.map((field) => (
                    <FormField field={field} key={field.id} />
                  ))}
                </FieldGroup>
              </div>

              <Button type="submit" className="w-full">
                Registrieren
              </Button>

              <p className="text-sm text-center text-muted-foreground">
                Konto vorhanden?{" "}
                <Link href="/login" className="underline underline-offset-4">
                  Anmelden
                </Link>
              </p>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  )
}