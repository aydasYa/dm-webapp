import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const MESSAGES: Record<string, { title: string; description: string }> = {
  deleted: {
    title: "Konto gelöscht",
    description: "Dein Konto wurde gelöscht. Bitte wende dich an deinen Admin, falls das ein Fehler war.",
  },
  inactive: {
    title: "Konto deaktiviert",
    description: "Dein Konto wurde deaktiviert/pausiert. Bitte wende dich an deinen Admin, um es wieder zu aktivieren.",
  },
}

export default async function BlockedPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>
}) {
  const { reason } = await searchParams
  const msg = MESSAGES[reason ?? ""] ?? MESSAGES.inactive

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <Card className="w-full max-w-sm text-center">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{msg.title}</CardTitle>
          <CardDescription>{msg.description}</CardDescription>
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
