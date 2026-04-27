// Admin Dashboard page, qr code generator

'use client'
import LogoutButton from './LogoutButton'
import { QRCodeSVG } from 'qrcode.react'
import { updateUserStatus } from '../actions/auth'

type Driver = {
  id: string
  firstname: string
  lastname: string
}

type PendingUser = {
  id: string
  firstname: string
  lastname: string
  email: string
  companyName: string | null
  createdAt: Date
}

type Props = {
  firstname: string
  lastname: string
  drivers: Driver[]
  pendingUsers: PendingUser[]
}

export default function AdminFeatures({ firstname, lastname, drivers, pendingUsers }: Props) {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <p className="text-muted-foreground mt-1">
        Willkommen, {firstname} {lastname}
      </p>
      <LogoutButton />


      <h2 className="text-lg font-semibold mt-8 mb-4">
        Ausstehende Freigaben ({pendingUsers.length})
      </h2>

      {pendingUsers.length === 0 ? (
        <p className="text-muted-foreground">Keine User zur Freigabe.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {pendingUsers.map((pu) => (
            <div key={pu.id} className="border border-border rounded-lg p-4">
              <p className="font-medium">{pu.firstname} {pu.lastname}</p>
              <p className="text-sm text-muted-foreground">{pu.email}</p>
              {pu.companyName && (
                <p className="text-sm text-muted-foreground">Firma: {pu.companyName}</p>
              )}
              <div className="flex gap-2 mt-3">
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




      <h2 className="text-lg font-semibold mt-8 mb-4">QR Codes — Abschlepper</h2>

      <div className="flex flex-col gap-8">
        {drivers.map((driver) => {
          const url = `https://angebot.deinmotorschaden.de?utm_medium=${driver.id}&utm_source=ADAC_Abschlepper`

          return (
            <div key={driver.id} className="flex flex-col gap-2">
              <p className="text-sm font-medium">
                {driver.firstname} {driver.lastname}
              </p>
              <div className="p-4 border border-border rounded-lg inline-block bg-white">
                <QRCodeSVG value={url} size={180} />
              </div>
              <p className="text-xs text-muted-foreground">{url}</p>
            </div>
          )
        })}
      </div>
    </main>
  )
}