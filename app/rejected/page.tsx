import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { signout } from "@/app/actions/auth"

export default function RejectedPage() {
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
            <CardTitle className="text-xl font-bold">Account nicht freigegeben</CardTitle>
            <CardDescription>
              Dein Account wurde leider nicht aktiviert.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Falls du Fragen hast oder denkst, dass dies ein Fehler ist, erreichst du uns unter{" "}
              <a href="mailto:info@deinmotorschaden.de" className="underline underline-offset-4 hover:text-foreground">
                info@deinmotorschaden.de
              </a>.
            </p>
            <form action={signout}>
              <Button variant="outline" className="w-full" type="submit">
                Abmelden
              </Button>
            </form>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
