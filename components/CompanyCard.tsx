"use client"

import { updateCompanyAdminStatus, deleteCompanyAdmin } from "@/app/actions/companies"
import { UserStatus } from "@/src/generated/prisma/enums"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { ConfirmActionButton } from "./ConfirmActionButton"

export type CompanyCardUser = {
  id: string
  firstname: string
  lastname: string
  email: string
  phone: string | null
  status: UserStatus
  createdAt: Date
  company: {
    name: string
    address: string | null
    postcode: string | null
    city: string | null
    phone: string | null
    email: string | null
    website: string | null
    contactFirstname: string | null
    contactLastname: string | null
  } | null
}

const STATUS_LABEL: Record<UserStatus, string> = {
  ACTIVE: "Aktiv",
  PENDING: "Ausstehend",
  INACTIVE: "Deaktiviert",
  REJECTED: "Abgelehnt",
}

const STATUS_STYLE: Record<UserStatus, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-800",
  PENDING: "bg-yellow-100 text-yellow-800",
  INACTIVE: "bg-gray-200 text-gray-700",
  REJECTED: "bg-red-100 text-red-700",
}

export function CompanyCard({ user }: { user: CompanyCardUser }) {
  const isPending = user.status === UserStatus.PENDING
  const isInactive = user.status === UserStatus.INACTIVE

  return (
    <Card>
      <Dialog>
        <DialogTrigger asChild>
          <div className="cursor-pointer rounded-t-xl hover:bg-muted/50 transition-colors">
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-xl font-bold">{user.company?.name ?? "—"}</CardTitle>
                <span className={`text-xs font-medium rounded-full px-2 py-1 ${STATUS_STYLE[user.status]}`}>
                  {STATUS_LABEL[user.status]}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>{user.firstname} {user.lastname} · {user.email}</p>
                <p>Registriert: {user.createdAt.toLocaleDateString("de-DE")}</p>
              </div>
            </CardContent>
          </div>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>{user.company?.name ?? "Unternehmen"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Firma</p>
              {user.company?.name && <p>{user.company.name}</p>}
              {user.company?.address && <p>{user.company.address}</p>}
              {(user.company?.postcode || user.company?.city) && (
                <p>{[user.company?.postcode, user.company?.city].filter(Boolean).join(" ")}</p>
              )}
              {user.company?.phone && <p>Tel: {user.company.phone}</p>}
              {user.company?.email && <p>E-Mail: {user.company.email}</p>}
              {user.company?.website && <p>Web: {user.company.website}</p>}
            </div>

            <div className="space-y-1 border-t pt-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Ansprechpartner / Admin</p>
              <p>{user.firstname} {user.lastname}</p>
              <p>{user.email}</p>
              {user.phone && <p>Tel: {user.phone}</p>}
              {(user.company?.contactFirstname || user.company?.contactLastname) && (
                <p>
                  Kontakt: {[user.company?.contactFirstname, user.company?.contactLastname].filter(Boolean).join(" ")}
                </p>
              )}
            </div>

            <div className="space-y-1 border-t pt-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Status</p>
              <p>{STATUS_LABEL[user.status]} · Registriert {user.createdAt.toLocaleDateString("de-DE")}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Aktionen — bewusst AUSSERHALB des Triggers, damit der Klick nicht das Popup öffnet */}
      <CardContent className="pt-0">
        <div className="flex justify-end gap-2">
          {isPending ? (
            <>
              <form action={updateCompanyAdminStatus}>
                <input type="hidden" name="userId" value={user.id} />
                <input type="hidden" name="newStatus" value={UserStatus.ACTIVE} />
                <Button type="submit" size="sm">Freigeben</Button>
              </form>
              <form action={updateCompanyAdminStatus}>
                <input type="hidden" name="userId" value={user.id} />
                <input type="hidden" name="newStatus" value={UserStatus.REJECTED} />
                <Button type="submit" size="sm" variant="outline">Ablehnen</Button>
              </form>
            </>
          ) : (
            <>
              {isInactive ? (
                <form action={updateCompanyAdminStatus}>
                  <input type="hidden" name="userId" value={user.id} />
                  <input type="hidden" name="newStatus" value={UserStatus.ACTIVE} />
                  <Button type="submit" size="sm" variant="outline">Aktivieren</Button>
                </form>
              ) : (
                <ConfirmActionButton
                  action={updateCompanyAdminStatus}
                  fields={{ userId: user.id, newStatus: UserStatus.INACTIVE }}
                  triggerLabel="Deaktivieren"
                  confirmLabel="Deaktivieren"
                  triggerVariant="outline"
                  confirmVariant="outline"
                  title="Unternehmen deaktivieren?"
                  description={`Unternehmen „${user.company?.name ?? ""}" wird deaktiviert.`}
                />
              )}

              <ConfirmActionButton
                action={deleteCompanyAdmin}
                fields={{ userId: user.id }}
                triggerLabel="Löschen"
                confirmLabel="Löschen"
                title="Wirklich löschen?"
                description={`Unternehmen „${user.company?.name ?? ""}" wird gelöscht.`}
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
