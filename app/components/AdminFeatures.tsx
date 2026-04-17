// Admin Dashboard page, qr code generator

'use client'

import { QRCodeSVG } from 'qrcode.react'

type Driver = {
  id: string
  firstname: string
  lastname: string
}

type Props = {
  firstname: string
  lastname: string
  drivers: Driver[]
}

export default function AdminFeatures({ firstname, lastname, drivers }: Props) {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <p className="text-muted-foreground mt-1">
        Willkommen, {firstname} {lastname}
      </p>

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