import { login } from './actions'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Anmelden</CardTitle>
          <CardDescription>Melde dich mit deinem Account an</CardDescription>
        </CardHeader>

        <form>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@firma.de"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Passwort</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-2 border-t-0 pt-0">
            <Button formAction={login} className="w-full mt-4">Anmelden</Button>

            <Button asChild variant="outline" className="w-full">
              <Link href="/signup">Noch kein Konto? Registrieren</Link>
            </Button>

            <Button asChild variant="ghost" className="w-full">
              <Link href="/">Zurück</Link>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}