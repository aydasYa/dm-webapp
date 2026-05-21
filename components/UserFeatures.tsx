'use client'

import { QRCodeSVG } from "qrcode.react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { 
  FileText, 
  Plus, 
  User, 
  Building2, 
  Mail, 
  Phone, 
  MapPin,
  QrCode,
  Pencil
} from "lucide-react"

type Props = {
  user: {
    email: string
    firstname: string
    lastname: string
    phone: string | null
    role: string
    status: string
    qrCode: string | null
    companyName: string | null
    companyAddress: string | null
    companyCity: string | null
    companyPostcode: string | null
    companyPhone: string | null
    companyEmail: string | null
    companyContactPerson: string | null
  }
}

export default function UserFeatures({ user }: Props) {
  const hasCompanyData = !!(
    user.companyName ||
    user.companyAddress ||
    user.companyCity ||
    user.companyPostcode ||
    user.companyPhone ||
    user.companyEmail ||
    user.companyContactPerson
  )

  // Für DashboardShell brauchen wir email
  const shellUser = {
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    role: user.role,
  }

  return (
    <DashboardShell user={shellUser}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Willkommen, {user.firstname}
            </h2>
            <p className="text-muted-foreground">
              Verwalte deine Leads und Profildaten.
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/leads/new">
                <Plus className="mr-2 h-4 w-4" />
                Neuer Lead
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/leads">
                <FileText className="mr-2 h-4 w-4" />
                Meine Leads
              </Link>
            </Button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* QR Code Card */}
          <Card className="lg:row-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                Mein QR-Code
              </CardTitle>
              <CardDescription>
                Für Kunden zum Scannen
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              {user.qrCode ? (
                <>
                  <div className="rounded-xl border-2 border-border bg-white p-4">
                    <QRCodeSVG value={user.qrCode} size={200} />
                  </div>
                  <p className="mt-3 max-w-[200px] text-center text-xs text-muted-foreground break-all">
                    {user.qrCode}
                  </p>
                </>
              ) : (
                <div className="flex flex-col items-center py-8">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <QrCode className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground text-center">
                    Dein QR-Code wird von einem Admin generiert.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Personal Data Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <User className="h-5 w-5" />
                  Persönliche Daten
                </CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/profile/edit">
                    <Pencil className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    {user.firstname} {user.lastname}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">{user.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">{user.phone ?? "Nicht angegeben"}</p>
              </div>
            </CardContent>
          </Card>

          {/* Company Data Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Building2 className="h-5 w-5" />
                  Firmendaten
                </CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/profile/edit">
                    <Pencil className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {hasCompanyData ? (
                <div className="space-y-3">
                  {user.companyName && (
                    <div className="flex items-start gap-3">
                      <Building2 className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-medium">{user.companyName}</p>
                    </div>
                  )}
                  {(user.companyAddress || user.companyPostcode || user.companyCity) && (
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <div className="text-sm">
                        {user.companyAddress && <p>{user.companyAddress}</p>}
                        {(user.companyPostcode || user.companyCity) && (
                          <p>
                            {user.companyPostcode} {user.companyCity}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  {user.companyPhone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm">{user.companyPhone}</p>
                    </div>
                  )}
                  {user.companyEmail && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm">{user.companyEmail}</p>
                    </div>
                  )}
                  {user.companyContactPerson && (
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm">{user.companyContactPerson}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Keine Firmendaten hinterlegt.
                  </p>
                  <Button variant="link" size="sm" asChild>
                    <Link href="/profile/edit">Jetzt hinzufügen</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Schnellaktionen</CardTitle>
              <CardDescription>Häufig verwendete Funktionen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                <Button
                  variant="outline"
                  className="h-auto justify-start gap-3 p-4"
                  asChild
                >
                  <Link href="/leads/new">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                      <Plus className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Neuen Lead anlegen</p>
                      <p className="text-xs text-muted-foreground">
                        Erfasse einen neuen Abschleppauftrag
                      </p>
                    </div>
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto justify-start gap-3 p-4"
                  asChild
                >
                  <Link href="/leads">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Meine Leads</p>
                      <p className="text-xs text-muted-foreground">
                        Alle erfassten Aufträge anzeigen
                      </p>
                    </div>
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto justify-start gap-3 p-4"
                  asChild
                >
                  <Link href="/profile/edit">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                      <Pencil className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Profil bearbeiten</p>
                      <p className="text-xs text-muted-foreground">
                        Daten und Einstellungen ändern
                      </p>
                    </div>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}
