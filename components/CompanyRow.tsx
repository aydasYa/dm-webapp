"use client"

import { updateCompanyAdminStatus, deleteCompanyAdmin } from "@/app/actions/companies"
import { UserStatus } from "@/src/generated/prisma/enums"
import { TableCell, TableRow } from "@/components/ui/table"
import { StatusBadge, COMPANY_STATUS } from "@/components/StatusBadge"
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { ConfirmActionButton } from "./ConfirmActionButton"
import { SubmitButton } from "./SubmitButton"
import type { CompanyCardUser } from "./CompanyCard"

export function CompanyRow({ user }: { user: CompanyCardUser }) {
  const isPending = user.status === UserStatus.PENDING
  const isInactive = user.status === UserStatus.INACTIVE
  const s = COMPANY_STATUS[user.status] ?? COMPANY_STATUS.PENDING

  return (
    <TableRow>
      <TableCell className="font-medium">
        <Dialog>
          <DialogTrigger asChild>
            <button className="text-left hover:underline">{user.company?.name ?? "—"}</button>
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
                <p>{s.label} · Registriert {user.createdAt.toLocaleDateString("de-DE")}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </TableCell>

      <TableCell className="text-muted-foreground">{user.firstname} {user.lastname} · {user.email}</TableCell>
      <TableCell className="text-muted-foreground">{user.createdAt.toLocaleDateString("de-DE")}</TableCell>
      <TableCell><StatusBadge tone={s.tone}>{s.label}</StatusBadge></TableCell>

      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          {isPending ? (
            <>
              <form action={updateCompanyAdminStatus}>
                <input type="hidden" name="userId" value={user.id} />
                <input type="hidden" name="newStatus" value={UserStatus.ACTIVE} />
                <SubmitButton size="sm">Freigeben</SubmitButton>
              </form>
              <form action={updateCompanyAdminStatus}>
                <input type="hidden" name="userId" value={user.id} />
                <input type="hidden" name="newStatus" value={UserStatus.REJECTED} />
                <SubmitButton size="sm" variant="outline">Ablehnen</SubmitButton>
              </form>
            </>
          ) : (
            <>
              {isInactive ? (
                <form action={updateCompanyAdminStatus}>
                  <input type="hidden" name="userId" value={user.id} />
                  <input type="hidden" name="newStatus" value={UserStatus.ACTIVE} />
                  <SubmitButton size="sm" variant="outline">Aktivieren</SubmitButton>
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
                  successMessage="Unternehmen deaktiviert"
                />
              )}

              <ConfirmActionButton
                action={deleteCompanyAdmin}
                fields={{ userId: user.id }}
                triggerLabel="Löschen"
                confirmLabel="Löschen"
                title="Wirklich löschen?"
                description={`Unternehmen „${user.company?.name ?? ""}" wird gelöscht.`}
                successMessage="Unternehmen gelöscht"
              />
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  )
}
