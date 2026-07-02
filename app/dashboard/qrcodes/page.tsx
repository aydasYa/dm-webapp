import prisma from "@/lib/prisma"
import { Role, UserStatus } from "@/src/generated/prisma/enums"
import { generateQrCode } from "@/app/actions/drivers"
import QrCodeCard from "@/components/QrCodeCard"
import { QrCodeRow } from "@/components/QrCodeRow"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { requireUser } from "@/lib/auth"
import { PageHeader } from "@/components/PageHeader"

export const dynamic = "force-dynamic"

export default async function QrCodesPage() {
   const caller = await requireUser(Role.ADMIN)

    const drivers = await prisma.user.findMany({
        // Nur Fahrer der EIGENEN Firma (Mandanten-Trennung)
        where: { 
            role: Role.TOW_TRUCK_DRIVER, 
            status: UserStatus.ACTIVE, 
            companyId: caller.companyId 
        },
        select: {
            id: true,
            firstname: true,
            lastname: true,
            qrCode: true,
            company: { select: { name: true } },
        },
    })

    return (
        <div className="space-y-6">
            <PageHeader title="QR-Codes" subtitle={`${drivers.length} aktive Abschlepper`} />

            <div className="space-y-3">
                <h2 className="font-semibold">Mein QR-Code</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <QrCodeCard driver={caller} generateAction={generateQrCode}/>
                </div>
            </div>

            <div className="space-y-3">
                <h2 className="font-semibold">QR-Codes aller Fahrer</h2>
                <p className="text-sm text-muted-foreground">{drivers.length} Einträge insgesamt</p>
                {drivers.length === 0 ? (
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-center text-muted-foreground">Keine aktiven Abschlepper</p>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Fahrer</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Link</TableHead>
                                        <TableHead className="text-right">Aktion</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {drivers.map((d) => (
                                        <QrCodeRow key={d.id} driver={d} generateAction={generateQrCode} />
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}