"use client"

import { updateUserStatus, deleteDriver } from "@/app/actions/drivers"
import { UserStatus } from "@/src/generated/prisma/enums"
import { QRCodeSVG } from "qrcode.react"
import { Button } from "@/components/ui/button"
import { ConfirmDeleteButton } from "./ConfirmDeleteButton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"

export type DriverCardUser = {
  id: string
  firstname: string
  lastname: string
  email: string
  status: UserStatus
  qrCode: string | null
  createdAt: Date
  company: {
    name: string
    address: string | null
    postcode: string | null
    city: string | null
    phone: string | null
    email: string | null
    contactFirstname: string | null
    contactLastname: string | null
  } | null
  phone: string | null
}

const STATUS_LABEL: Record<UserStatus, string> = {
  ACTIVE: "Aktiv",
  PENDING: "Ausstehend",
  INACTIVE: "Deaktiviert",
  REJECTED: "Deaktiviert", // Fahrer werden nicht „abgelehnt" – nur deaktiviert
}

const STATUS_STYLE: Record<UserStatus, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-800",
  PENDING: "bg-yellow-100 text-yellow-800",
  INACTIVE: "bg-gray-200 text-gray-700",
  REJECTED: "bg-gray-200 text-gray-700",
}

export function DriverCard({ user }: { user: DriverCardUser }) {
  const isInactive = user.status === UserStatus.INACTIVE

  return (
    <Card>
      <Dialog>
        <DialogTrigger asChild>
          <div className="cursor-pointer rounded-t-xl hover:bg-muted/50 transition-colors">
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-xl font-bold">{user.firstname} {user.lastname}</CardTitle>
                <span className={`text-xs font-medium rounded-full px-2 py-1 ${STATUS_STYLE[user.status]}`}>
                  {STATUS_LABEL[user.status]}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>{user.email}</p>
                <p>Registriert: {user.createdAt.toLocaleDateString("de-DE")}</p>
              </div>
            </CardContent>
          </div>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>{user.firstname} {user.lastname}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Kontakt</p>
              <p>{user.email}</p>
              {user.phone && <p>Tel: {user.phone}</p>}
              <p>Registriert: {user.createdAt.toLocaleDateString("de-DE")}</p>
            </div>
            <div className="space-y-1 border-t pt-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Firma</p>
              {user.company?.name && <p>{user.company.name}</p>}
              {user.company?.address && <p>{user.company.address}</p>}
              {(user.company?.postcode || user.company?.city) && (
                <p>{[user.company?.postcode, user.company?.city].filter(Boolean).join(" ")}</p>
              )}
              {user.company?.phone && <p>Tel: {user.company.phone}</p>}
              {user.company?.email && <p>E-Mail: {user.company.email}</p>}
            </div>
            {(user.company?.contactFirstname || user.company?.contactLastname) && (
              <div className="space-y-1 border-t pt-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Ansprechpartner</p>
                <p>{[user.company?.contactFirstname, user.company?.contactLastname].filter(Boolean).join(" ")}</p>
              </div>
            )}
            {user.qrCode ? (
              <div className="border-t pt-3 flex flex-col items-center gap-2">
                <p className="text-xs uppercase tracking-wide text-muted-foreground self-start">QR-Code</p>
                <div className="rounded-lg border bg-white p-3">
                  <QRCodeSVG value={user.qrCode} size={140} />
                </div>
              </div>
            ) : (
              <p className="border-t pt-3 text-xs text-muted-foreground">Noch kein QR-Code generiert.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Aktionen — bewusst AUSSERHALB des Triggers, damit der Klick darauf nicht das Popup öffnet */}
      <CardContent className="pt-0">
        <div className="flex justify-end gap-2">
          <form action={updateUserStatus}>
            <input type="hidden" name="userId" value={user.id} />
            <input type="hidden" name="newStatus" value={isInactive ? "ACTIVE" : "INACTIVE"} />
            <Button type="submit" size="sm" variant="outline">
              {isInactive ? "Aktivieren" : "Deaktivieren"}
            </Button>
          </form>
         <ConfirmDeleteButton 
            action={deleteDriver}
            userId={user.id}
            description={`Fahrer „${user.firstname} ${user.lastname}" wird deaktiviert.`}
         />
        </div>
      </CardContent>
    </Card>
  )
}
