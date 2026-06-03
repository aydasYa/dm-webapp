import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import { Role } from "@/src/generated/prisma/enums"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { QRCodeSVG } from "qrcode.react"

export const dynamic = "force-dynamic"

export default async function QrCodePage() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  if (!data?.claims) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { supabaseId: data.claims.sub },
    select: { role: true, firstname: true, lastname: true, companyName: true, qrCode: true },
  })
  if (!user) redirect("/login")
  if (user.role === Role.ADMIN) redirect("/dashboard")

  return (
    <div className="space-y-6 max-w-sm">
      <h1 className="text-2xl font-bold">Dein QR-Code</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {user.firstname} {user.lastname}
          </CardTitle>
          {user.companyName && (
            <CardDescription>{user.companyName}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {user.qrCode ? (
            <div className="flex flex-col gap-3">
              <div className="inline-block rounded-lg border bg-white p-4 w-fit">
                <QRCodeSVG value={user.qrCode} size={200} />
              </div>
              <p className="text-xs text-muted-foreground break-all">{user.qrCode}</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Noch kein QR-Code generiert. Ein Admin wird dir einen erstellen.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
