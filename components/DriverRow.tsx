"use client"

import { updateUserStatus, deleteDriver } from "@/app/actions/drivers"
import { UserStatus } from "@/src/generated/prisma/enums"
import { QRCodeSVG } from "qrcode.react"
import { TableCell, TableRow } from "@/components/ui/table"
import { StatusBadge, DRIVER_STATUS } from "@/components/StatusBadge"
import { ConfirmActionButton } from "./ConfirmActionButton"
import { SubmitButton } from "./SubmitButton"
import { toast } from "sonner"
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

export function DriverRow({ user }: { user: DriverCardUser }) {
  const isInactive = user.status === UserStatus.INACTIVE
  const s = DRIVER_STATUS[user.status] ?? DRIVER_STATUS.PENDING

  return (
    <TableRow>
      <TableCell className="font-medium">
        <Dialog>
          <DialogTrigger asChild>
            <button className="text-left hover:underline">
              {user.firstname} {user.lastname}
            </button>
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
      </TableCell>

      <TableCell className="text-muted-foreground">{user.email}</TableCell>
      <TableCell className="text-muted-foreground">{user.createdAt.toLocaleDateString("de-DE")}</TableCell>
      <TableCell><StatusBadge tone={s.tone}>{s.label}</StatusBadge></TableCell>

      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          {isInactive ? (
            <form action={async (fd) => { await updateUserStatus(fd); toast.success("Fahrer aktiviert") }}>
              <input type="hidden" name="userId" value={user.id} />
              <input type="hidden" name="newStatus" value="ACTIVE" />
              <SubmitButton size="sm" variant="outline">Aktivieren</SubmitButton>
            </form>
          ) : (
            <ConfirmActionButton
              action={updateUserStatus}
              fields={{ userId: user.id, newStatus: "INACTIVE" }}
              triggerLabel="Deaktivieren"
              confirmLabel="Deaktivieren"
              triggerVariant="outline"
              confirmVariant="outline"
              title="Fahrer deaktivieren?"
              description={`Fahrer „${user.firstname} ${user.lastname}" wird deaktiviert.`}
              successMessage="Fahrer deaktiviert"
            />
          )}

          <ConfirmActionButton
            action={deleteDriver}
            fields={{ userId: user.id }}
            triggerLabel="Löschen"
            confirmLabel="Löschen"
            title="Wirklich löschen?"
            description={`Fahrer „${user.firstname} ${user.lastname}" wird gelöscht.`}
            successMessage="Fahrer gelöscht"
          />
        </div>
      </TableCell>
    </TableRow>
  )
}
