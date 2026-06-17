import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function BlockedPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <Card className="w-full max-w-sm text-center">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Konto deaktiviert</CardTitle>
          <CardDescription>
            Dein Konto wurde deaktiviert/pausiert. Bitte wende dich an deinen Admin, um es wieder zu aktivieren.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href="/login">Zum Login</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}