import Link from "next/link"
import Image from "next/image"
import { FormField } from "@/components/form/FormField"
import { signupFields } from "@/app/signup/fields"
import { signup } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { PasswordMatchHint } from "@/components/form/PasswordMatchHint"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

const ERROR_MESSAGES: Record<string, string> = {
  missing_fields:    "Bitte fülle alle Pflichtfelder aus.",
  password_too_short:"Das Passwort muss mindestens 8 Zeichen lang sein.",
  password_mismatch: "Die Passwörter stimmen nicht überein.",
  invalid_email:     "Bitte gib eine gültige E-Mail-Adresse ein.",
  invalid_format:    "Ein oder mehrere Felder enthalten ungültige Zeichen.",
  signup_failed:     "Registrierung fehlgeschlagen. Bitte versuche es erneut.",
  db_failed:         "Ein Fehler ist aufgetreten. Bitte versuche es erneut.",
}

export default async function SignUp({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  const errorMessage = error ? (ERROR_MESSAGES[error] ?? "Ein unbekannter Fehler ist aufgetreten.") : null

  // Felder als Lookup damit wir sie gezielt platzieren können
  const f = Object.fromEntries(signupFields.map((field) => [field.id, field]))

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-5xl flex-col gap-2">
        <Link href="/" className="flex items-center justify-center self-center">
          <Image
            src="/logo.png"
            alt="DeinMotorschaden Logo"
            width={380}
            height={114}
            priority
            className="h-40 w-auto object-contain"
          />
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Registrieren</CardTitle>
            <CardDescription>Erstelle deinen Account</CardDescription>
            <p className="text-sm text-muted-foreground">
              Felder mit <span className="font-medium text-red-600">*</span> sind Pflichtfelder.
            </p>
            {errorMessage && (
              <p className="text-sm font-medium text-destructive">{errorMessage}</p>
            )}
          </CardHeader>

          <form action={signup}>
            <CardContent className="flex flex-col gap-8">
              <div className="grid gap-8 md:grid-cols-2">

                {/* ── Persönliche Informationen ── */}
                <div className="flex flex-col gap-4">
                  <h2 className="font-semibold">Persönliche Informationen</h2>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField field={f.firstname} />
                    <FormField field={f.lastname} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField field={f.password} />
                    <FormField field={f.passwordConfirm} />
                  </div>
                  <PasswordMatchHint />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField field={f.email} />
                    <FormField field={f.phone} />
                  </div>
                </div>

                {/* ── Firmen Informationen ── */}
                <div className="flex flex-col gap-4">
                  <h2 className="font-semibold">Firmen Informationen</h2>

                  <FormField field={f.companyName} />

                  <div className="grid grid-cols-[2fr_1fr_1.5fr] gap-4">
                    <FormField field={f.companyAddress} />
                    <FormField field={f.companyPostcode} />
                    <FormField field={f.companyCity} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField field={f.companyPhone} />
                    <FormField field={f.companyEmail} />
                    <FormField field={f.companyWebsite} />
                  </div>
                </div>

              </div>

              <Button type="submit" className="w-full">Registrieren</Button>

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
