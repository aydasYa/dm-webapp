import Link from "next/link"
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left side - Form */}
      <div className="flex flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center px-6 md:px-10">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-sm">
              DM
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Abschlepper Dashboard</span>
              <span className="text-xs text-muted-foreground">von DeinMotorschaden</span>
            </div>
          </Link>
        </div>

        {/* Form Container */}
        <div className="flex flex-1 items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-sm">
            <LoginForm />
          </div>
        </div>
      </div>

      {/* Right side - Branding */}
      <div className="relative hidden bg-primary lg:block">
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
          <div className="max-w-md text-center text-primary-foreground">
            <h2 className="text-3xl font-bold tracking-tight">
              Willkommen zurück
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/80">
              Verwalte deine Leads, scanne QR-Codes und behalte den Überblick über alle Einsätze.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4 text-sm">
              <div className="rounded-lg bg-primary-foreground/10 p-4">
                <div className="text-2xl font-bold">100+</div>
                <div className="text-primary-foreground/70">Fahrer</div>
              </div>
              <div className="rounded-lg bg-primary-foreground/10 p-4">
                <div className="text-2xl font-bold">5000+</div>
                <div className="text-primary-foreground/70">Leads</div>
              </div>
              <div className="rounded-lg bg-primary-foreground/10 p-4">
                <div className="text-2xl font-bold">98%</div>
                <div className="text-primary-foreground/70">Zufrieden</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
