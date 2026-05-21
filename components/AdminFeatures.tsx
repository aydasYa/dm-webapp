'use client'

import { QRCodeSVG } from 'qrcode.react'
import { updateUserStatus, generateQrCode } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { StatsCard } from '@/components/ui/stats-card'
import { StatusBadge, statusOptions } from '@/components/ui/status-badge'
import { FileText, Users, QrCode, Clock, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { DashboardShell } from '@/components/dashboard/dashboard-shell'

type Driver = {
  id: string
  firstname: string
  lastname: string
  qrCode: string | null
  companyName: string | null
}

type PendingUser = {
  id: string
  firstname: string
  lastname: string
  email: string
  companyName: string | null
  createdAt: Date
}

type Lead = {
  id: string
  customerLastName: string
  vehicleMake: string
  vehicleModel: string
  breakdownAddress: string
  status: string
  createdAt: Date
  internNotice: string | null
  towTruckDriver: {
    firstname: string
    lastname: string
    companyName: string | null
  }
}

type Props = {
  user: {
    firstname: string
    lastname: string
    email: string
    role: string
  }
  drivers: Driver[]
  pendingUsers: PendingUser[]
  allLeads: Lead[]
  selectedStatus?: string
}

export default function AdminFeatures({ user, drivers, pendingUsers, allLeads, selectedStatus }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentTab = searchParams.get('tab') ?? 'overview'

  // Statistiken berechnen
  const totalLeads = allLeads.length
  const completedLeads = allLeads.filter(l => l.status === 'COMPLETED').length
  const activeLeads = allLeads.filter(l => !['COMPLETED', 'CANCELLED'].includes(l.status)).length
  const cancelledLeads = allLeads.filter(l => l.status === 'CANCELLED').length

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'overview') {
      params.delete('tab')
    } else {
      params.set('tab', value)
    }
    router.push(`/dashboard?${params.toString()}`)
  }

  const handleStatusFilter = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'all') {
      params.delete('status')
    } else {
      params.set('status', value)
    }
    router.push(`/dashboard?${params.toString()}`)
  }

  return (
    <DashboardShell user={user} pendingCount={pendingUsers.length}>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Willkommen zurück, {user.firstname}</h2>
          <p className="text-muted-foreground">
            Hier ist eine Übersicht über alle Aktivitäten.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Gesamt Leads"
            value={totalLeads}
            icon={FileText}
          />
          <StatsCard
            title="Aktive Leads"
            value={activeLeads}
            description="In Bearbeitung"
            icon={Clock}
          />
          <StatsCard
            title="Abgeschlossen"
            value={completedLeads}
            icon={CheckCircle}
          />
          <StatsCard
            title="Ausstehende Freigaben"
            value={pendingUsers.length}
            description={pendingUsers.length > 0 ? "Warten auf Prüfung" : "Alles erledigt"}
            icon={Users}
          />
        </div>

        {/* Tabs */}
        <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Übersicht</TabsTrigger>
            <TabsTrigger value="users" className="relative">
              Freigaben
              {pendingUsers.length > 0 && (
                <span className="ml-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground">
                  {pendingUsers.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="qrcodes">QR-Codes</TabsTrigger>
            <TabsTrigger value="leads">Alle Leads</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Recent Leads */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Neueste Leads</CardTitle>
                  <CardDescription>Die letzten 5 erfassten Leads</CardDescription>
                </CardHeader>
                <CardContent>
                  {allLeads.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Noch keine Leads vorhanden.</p>
                  ) : (
                    <div className="space-y-3">
                      {allLeads.slice(0, 5).map((lead) => (
                        <Link
                          key={lead.id}
                          href={`/leads/${lead.id}`}
                          className="flex items-center justify-between rounded-md border p-3 transition-colors hover:bg-muted/50"
                        >
                          <div className="space-y-1">
                            <p className="text-sm font-medium">{lead.customerLastName}</p>
                            <p className="text-xs text-muted-foreground">
                              {lead.vehicleMake} {lead.vehicleModel}
                            </p>
                          </div>
                          <StatusBadge status={lead.status} />
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Pending Approvals Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Ausstehende Freigaben</CardTitle>
                  <CardDescription>Nutzer warten auf Aktivierung</CardDescription>
                </CardHeader>
                <CardContent>
                  {pendingUsers.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Keine ausstehenden Freigaben.</p>
                  ) : (
                    <div className="space-y-3">
                      {pendingUsers.slice(0, 3).map((pu) => (
                        <div
                          key={pu.id}
                          className="flex items-center justify-between rounded-md border p-3"
                        >
                          <div className="space-y-1">
                            <p className="text-sm font-medium">
                              {pu.firstname} {pu.lastname}
                            </p>
                            <p className="text-xs text-muted-foreground">{pu.email}</p>
                          </div>
                          <div className="flex gap-1">
                            <form action={updateUserStatus}>
                              <input type="hidden" name="userId" value={pu.id} />
                              <input type="hidden" name="newStatus" value="ACTIVE" />
                              <Button type="submit" size="sm" variant="outline">
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            </form>
                            <form action={updateUserStatus}>
                              <input type="hidden" name="userId" value={pu.id} />
                              <input type="hidden" name="newStatus" value="REJECTED" />
                              <Button type="submit" size="sm" variant="outline">
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </form>
                          </div>
                        </div>
                      ))}
                      {pendingUsers.length > 3 && (
                        <Button
                          variant="link"
                          className="w-full text-sm"
                          onClick={() => handleTabChange('users')}
                        >
                          Alle {pendingUsers.length} anzeigen
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users/Approvals Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Ausstehende Freigaben</CardTitle>
                <CardDescription>
                  Nutzer, die auf Aktivierung warten ({pendingUsers.length})
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pendingUsers.length === 0 ? (
                  <p className="text-muted-foreground py-8 text-center">
                    Keine ausstehenden Freigaben.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>E-Mail</TableHead>
                        <TableHead>Firma</TableHead>
                        <TableHead>Registriert</TableHead>
                        <TableHead className="text-right">Aktionen</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingUsers.map((pu) => (
                        <TableRow key={pu.id}>
                          <TableCell className="font-medium">
                            {pu.firstname} {pu.lastname}
                          </TableCell>
                          <TableCell>{pu.email}</TableCell>
                          <TableCell>{pu.companyName ?? '-'}</TableCell>
                          <TableCell>
                            {new Date(pu.createdAt).toLocaleDateString('de-DE')}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <form action={updateUserStatus}>
                                <input type="hidden" name="userId" value={pu.id} />
                                <input type="hidden" name="newStatus" value="ACTIVE" />
                                <Button type="submit" size="sm">
                                  Freigeben
                                </Button>
                              </form>
                              <form action={updateUserStatus}>
                                <input type="hidden" name="userId" value={pu.id} />
                                <input type="hidden" name="newStatus" value="REJECTED" />
                                <Button type="submit" size="sm" variant="destructive">
                                  Ablehnen
                                </Button>
                              </form>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* QR Codes Tab */}
          <TabsContent value="qrcodes">
            <Card>
              <CardHeader>
                <CardTitle>QR-Codes der Abschlepper</CardTitle>
                <CardDescription>
                  QR-Codes für alle aktiven Fahrer verwalten ({drivers.length} Fahrer)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {drivers.map((driver) => (
                    <div
                      key={driver.id}
                      className="flex flex-col items-center rounded-lg border p-4 text-center"
                    >
                      <p className="mb-2 text-sm font-medium">
                        {driver.firstname} {driver.lastname}
                      </p>
                      {driver.companyName && (
                        <p className="mb-3 text-xs text-muted-foreground">
                          {driver.companyName}
                        </p>
                      )}

                      {driver.qrCode ? (
                        <>
                          <div className="rounded-lg border bg-white p-3">
                            <QRCodeSVG value={driver.qrCode} size={140} />
                          </div>
                          <p className="mt-2 max-w-[160px] truncate text-xs text-muted-foreground">
                            {driver.qrCode}
                          </p>
                        </>
                      ) : (
                        <form action={generateQrCode} className="mt-2">
                          <input type="hidden" name="userId" value={driver.id} />
                          <Button type="submit" variant="outline" size="sm">
                            <QrCode className="mr-2 h-4 w-4" />
                            Generieren
                          </Button>
                        </form>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* All Leads Tab */}
          <TabsContent value="leads">
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle>Alle Leads</CardTitle>
                    <CardDescription>
                      Übersicht aller erfassten Leads ({allLeads.length})
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <Select
                      value={selectedStatus ?? 'all'}
                      onValueChange={handleStatusFilter}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Alle Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Alle Status</SelectItem>
                        {statusOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {allLeads.length === 0 ? (
                  <p className="text-muted-foreground py-8 text-center">
                    Keine Leads gefunden.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Kunde</TableHead>
                          <TableHead>Fahrzeug</TableHead>
                          <TableHead>Standort</TableHead>
                          <TableHead>Fahrer</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Datum</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {allLeads.map((lead) => (
                          <TableRow key={lead.id}>
                            <TableCell>
                              <Link
                                href={`/leads/${lead.id}`}
                                className="font-medium hover:underline"
                              >
                                {lead.customerLastName}
                              </Link>
                            </TableCell>
                            <TableCell>
                              {lead.vehicleMake} {lead.vehicleModel}
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate">
                              {lead.breakdownAddress}
                            </TableCell>
                            <TableCell>
                              {lead.towTruckDriver.firstname} {lead.towTruckDriver.lastname}
                              {lead.towTruckDriver.companyName && (
                                <span className="block text-xs text-muted-foreground">
                                  {lead.towTruckDriver.companyName}
                                </span>
                              )}
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={lead.status} />
                            </TableCell>
                            <TableCell>
                              {new Date(lead.createdAt).toLocaleDateString('de-DE')}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  )
}
