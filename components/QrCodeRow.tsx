"use client"

import { QRCodeSVG } from "qrcode.react"
import { TableCell, TableRow } from "@/components/ui/table"
import { StatusBadge } from "@/components/StatusBadge"
import { Button } from "@/components/ui/button"
import { SubmitButton } from "./SubmitButton"
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"

type Props = {
  driver: {
    id: string
    firstname: string
    lastname: string
    qrCode: string | null
    company: { name: string } | null
  }
  generateAction: (formData: FormData) => void | Promise<void>
}

export function QrCodeRow({ driver, generateAction }: Props) {
  return (
    <TableRow>
      <TableCell className="font-medium">{driver.firstname} {driver.lastname}</TableCell>

      <TableCell>
        {driver.qrCode ? (
          <StatusBadge tone="success">Vorhanden</StatusBadge>
        ) : (
          <StatusBadge tone="muted">Kein QR</StatusBadge>
        )}
      </TableCell>

      <TableCell className="text-muted-foreground">
        {driver.qrCode ? (
          <a
            href={driver.qrCode}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline-offset-2 hover:underline"
          >
            {driver.qrCode.replace(/^https?:\/\//, "")}
          </a>
        ) : (
          "—"
        )}
      </TableCell>

      <TableCell className="text-right">
        {driver.qrCode ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">QR anzeigen</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{driver.firstname} {driver.lastname}</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center gap-3">
                <div className="rounded-lg border bg-white p-4">
                  <QRCodeSVG value={driver.qrCode} size={200} />
                </div>
                <a
                  href={driver.qrCode}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary underline-offset-2 hover:underline break-all"
                >
                  {driver.qrCode}
                </a>
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          <form action={async (fd) => { await generateAction(fd); toast.success("QR-Code generiert") }}>
            <input type="hidden" name="userId" value={driver.id} />
            <SubmitButton variant="outline" size="sm">Generieren</SubmitButton>
          </form>
        )}
      </TableCell>
    </TableRow>
  )
}
