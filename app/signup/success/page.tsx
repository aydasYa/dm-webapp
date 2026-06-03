import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function SignupSuccessPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-md flex-col gap-2">
        <Link href="/" className="flex items-center justify-center self-center">
          <Image
            src="/logo.png"
            alt="DeinMotorschaden Logo"
            width={280}
            height={84}
            priority
            className="h-28 w-auto object-contain"
          />
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Registrierung erfolgreich</CardTitle>
            <CardDescription>Bitte bestätige deine E-Mail-Adresse</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Wir haben dir einen Bestätigungslink geschickt. Klicke auf den Link in deiner E-Mail, um deine Registrierung abzuschließen.
            </p>
            <p className="text-sm text-muted-foreground">
              Nach der Bestätigung muss dein Konto noch von einem Admin freigegeben werden. Du erhältst eine E-Mail sobald das erledigt ist.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/login">Zum Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
