"use client"

import { updateUserStatus, deleteDriver } from "@/app/actions/auth"
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

export function DriverCard({ user }: { user: DriverCardUser; showActions?: boolean }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{user.firstname} {user.lastname}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm text-muted-foreground space-y-1">
          <p>{user.email}</p>
          <p>Registriert: {user.createdAt.toLocaleDateString("de-DE")}</p>
        </div>

        <div className="flex justify-end gap-2">
          <form action={updateUserStatus}>
            <input type="hidden" name="userId" value={user.id} />
            <input type="hidden" name="newStatus" value="INACTIVE" />
            <Button type="submit" size="sm" variant="outline">Sperren</Button>
          </form>
          <form action={deleteDriver}>
            <input type="hidden" name="userId" value={user.id} />
            <Button type="submit" size="sm" variant="destructive">Löschen</Button>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}