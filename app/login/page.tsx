import { login } from './actions'
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-sm rounded-lg border border-border bg-card p-8 flex flex-col gap-6">

        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold text-card-foreground">Anmelden</h1>
          <p className="text-sm text-muted-foreground">Melde dich mit deinem Account an</p>
        </div>

        <form className="flex flex-col gap-4">

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-card-foreground">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="name@firma.de"
              required
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-card-foreground">
              Passwort
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <button
            formAction={login}
            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer"
          >
            Anmelden
          </button>
          <Link href="/" className="self-start rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer">Abbrechen und zurück</Link>
        </form>
      </div>
    </div>
  )
}
