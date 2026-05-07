'use client'

import LogoutButton from './LogoutButton'
import { QRCodeSVG } from 'qrcode.react'
import { updateUserStatus, generateQrCode } from '@/app/actions/auth'
import { Button } from './ui/button'

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
  id: string,
  customerLastName: string,
  vehicleMake: string,
  vehicleModel: string,
  breakdownAddress: string,
  status: string,
  createdAt: Date,
  towTruckDriver: {
    firstname: string, 
    lastname: string, 
    companyName: string | null 
  }
}

type Props = {
  user: {
    firstname: string
    lastname: string
    role: string
  }
  drivers: Driver[]
  pendingUsers: PendingUser[]
  allLeads: Lead[]
}

export default function AdminFeatures({ user, drivers, pendingUsers, allLeads }: Props) {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">Admin - Dashboard</h1>
      <p className="mt-1 text-muted-foreground">
        Willkommen, {user.firstname} {user.lastname}
      </p>
      <LogoutButton />

      <h2 className="mb-4 mt-8 text-lg font-semibold">
        Ausstehende Freigaben ({pendingUsers.length})
      </h2>

      {pendingUsers.length === 0 ? (
        <p className="text-muted-foreground">Keine User zur Freigabe.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {pendingUsers.map((pu) => (
            <div key={pu.id} className="rounded-lg border border-border p-4">
              <p className="font-medium">
                {pu.firstname} {pu.lastname}
              </p>
              <p className="text-sm text-muted-foreground">{pu.email}</p>
              {pu.companyName && (
                <p className="text-sm text-muted-foreground">Firma: {pu.companyName}</p>
              )}
              <div className="mt-3 flex gap-2">
                <form action={updateUserStatus}>
                  <input type="hidden" name="userId" value={pu.id} />
                  <input type="hidden" name="newStatus" value="ACTIVE" />
                  <button type="submit">Freigeben</button>
                </form>
                <form action={updateUserStatus}>
                  <input type="hidden" name="userId" value={pu.id} />
                  <input type="hidden" name="newStatus" value="REJECTED" />
                  <button type="submit">Ablehnen</button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 className="mb-4 mt-8 text-lg font-semibold">QR Codes — Abschlepper</h2>

      {/* QR Codes werden auf Adming Dashboard gerendert, falls dieser
          Abschlepper Freigegeben wurde, mit Button wird der QR Code dann generiert */}
      <div className="flex flex-col gap-8">
        {drivers.map((driver) => (
          <div key={driver.id} className="flex flex-col gap-2">
            <p className="text-sm font-medium">
              {driver.firstname} {driver.lastname}
              {driver.companyName && (
                <span className="text-muted-foreground"> 
                — {driver.companyName}
                </span>
              )}
            </p>

            {driver.qrCode ? (
              <>
                <div className="inline-block rounded-lg border border-border bg-white p-4">
                  <QRCodeSVG value={driver.qrCode} size={180} />
                </div>
                <p className="text-xs text-muted-foreground">{driver.qrCode}</p>
              </>
            ) : (
              <form action={generateQrCode}>
                <input type="hidden" name="userId" value={driver.id} />
                <Button type="submit" >QR-Code generieren</Button>
              </form>
            )}
          </div>
        ))}
      </div>

      {/* Leads von allen abschleppern */}
      <h2 className="mb-4 mt-8 text-lg font-semibold">
        Alle Leads ({allLeads.length})
      </h2>

      {allLeads.length === 0 ? (
        <p className="text-muted-foreground">Noch keine Leads.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {allLeads.map((lead) => (
            <div key={lead.id} className="rounded-lg border border-border p-4">
              <p className="font-medium">{lead.customerLastName}</p>
              <p className="text-sm">{lead.vehicleMake} {lead.vehicleModel}</p>
              <p className="text-sm text-muted-foreground">{lead.breakdownAddress}</p>
              <p className="text-sm">Status: {lead.status}</p>
              <p className="text-sm text-muted-foreground">
                Driver: {lead.towTruckDriver.firstname} {lead.towTruckDriver.lastname}
                {lead.towTruckDriver.companyName && ` — ${lead.towTruckDriver.companyName}`}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
