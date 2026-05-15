import Link from "next/link"
import { login } from "@/app/login/actions"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  return (
    <form action={login} className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Anmelden</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Melde dich mit deinem Account an
          </p>
        </div>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="name@firma.de"
            required
            className="bg-background"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Passwort</FieldLabel>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            className="bg-background"
          />
        </Field>

        <Field>
          <Button type="submit">Anmelden</Button>
        </Field>

        <FieldDescription className="text-center">
          Noch kein Konto?{" "}
          <Link href="/signup" className="underline underline-offset-4">
            Registrieren
          </Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  )
}