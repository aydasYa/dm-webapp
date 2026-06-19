import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import { Role, UserStatus } from "@/src/generated/prisma/enums"
import { generateQrCode } from "@/app/actions/auth"
import QrCodeCard from "@/components/QrCodeCard"
import { Card, CardContent } from "@/components/ui/card"

export const dynamic = "force-dynamic"

export default async function QrCodesPage() {
    const supabase = await createClient()
    const { data } = await supabase.auth.getClaims()
    if (!data?.claims) redirect("/login")

    const caller = await prisma.user.findUnique({
        where: { supabaseId: data.claims.sub },
        select: { role: true,
            id: true,
            firstname: true,
            lastname: true,
            qrCode: true,
            companyName: true,
            companyId: true,
        },
    })
    if (caller?.role !== Role.ADMIN) redirect("/dashboard")

    const drivers = await prisma.user.findMany({
        // Nur Fahrer der EIGENEN Firma (Mandanten-Trennung)
        where: { role: Role.TOW_TRUCK_DRIVER, status: UserStatus.ACTIVE, companyId: caller.companyId },
        select: {
            id: true,
            firstname: true,
            lastname: true,
            qrCode: true,
            companyName: true,
        },
    })

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">QR-Codes</h1>
                <p className="text-muted-foreground">{drivers.length} aktive Abschlepper</p>
            </div>

            <div>
                <h2 className="font-semibold mb-2">Mein QR-Code</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <QrCodeCard driver={caller} generateAction={generateQrCode}/>
                </div>
            </div>

            <div>
                <h2 className="font-semibold mb-2">QR-Codes aller Fahrer</h2>
                {drivers.length === 0 ? (
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-center text-muted-foreground">Keine aktiven Abschlepper</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {drivers.map((d) => (
                            <QrCodeCard key={d.id} driver={d} generateAction={generateQrCode} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}