"use client"

import { useState } from "react"
import { updateUserStatus } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export type DriverCardUser = {
  id: string
  firstname: string
  lastname: string
  email: string
  createdAt: Date
  companyName: string | null
  companyAddress: string | null
  companyPostcode: string | null
  companyCity: string | null
  companyPhone: string | null
  companyEmail: string | null
  companyContactFirstname: string | null
  companyContactLastname: string | null
  phone: string | null
}

export function DriverCard({ user, showActions = true }: { user: DriverCardUser; showActions?: boolean }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          {user.firstname} {user.lastname}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Basis-Infos — immer sichtbar */}
        <div className="text-sm text-muted-foreground space-y-1">
          <p>{user.email}</p>
          {user.companyName && <p>Firma: {user.companyName}</p>}
          <p>Registriert: {user.createdAt.toLocaleDateString("de-DE")}</p>
        </div>

        {/* Erweiterte Details */}
        {expanded && (
          <div className="text-sm border-t pt-3 space-y-3">
            <div className="space-y-1">
              <p className="font-medium text-xs uppercase tracking-wide text-muted-foreground">Firma</p>
              {user.companyAddress && <p>{user.companyAddress}</p>}
              {(user.companyPostcode || user.companyCity) && (
                <p>{[user.companyPostcode, user.companyCity].filter(Boolean).join(" ")}</p>
              )}
              {user.companyPhone && <p>Tel: {user.companyPhone}</p>}
              {user.companyEmail && <p>E-Mail: {user.companyEmail}</p>}
            </div>

            {(user.companyContactFirstname || user.companyContactLastname) && (
              <div className="space-y-1">
                <p className="font-medium text-xs uppercase tracking-wide text-muted-foreground">Ansprechpartner</p>
                <p>{[user.companyContactFirstname, user.companyContactLastname].filter(Boolean).join(" ")}</p>
                {user.phone && <p>Tel: {user.phone}</p>}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => setExpanded(v => !v)}
            className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            {expanded ? "Weniger anzeigen" : "Mehr anzeigen"}
          </button>

          {showActions && (
            <div className="flex gap-2">
              <form action={updateUserStatus}>
                <input type="hidden" name="userId" value={user.id} />
                <input type="hidden" name="newStatus" value="ACTIVE" />
                <Button type="submit" size="sm">Freigeben</Button>
              </form>
              <form action={updateUserStatus}>
                <input type="hidden" name="userId" value={user.id} />
                <input type="hidden" name="newStatus" value="REJECTED" />
                <Button type="submit" size="sm" variant="destructive">Ablehnen</Button>
              </form>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
