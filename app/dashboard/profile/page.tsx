import Link from "next/link"
import { requireUser } from "@/lib/auth"
import { QRCodeSVG } from "qrcode.react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Role } from "@/src/generated/prisma/enums"
import { PageHeader } from "@/components/PageHeader"
import { FlashToast } from "@/components/FlashToast"

export const dynamic = "force-dynamic"

export default async function ProfilePage({
    searchParams,
}: {
    searchParams: Promise<{ saved?: string }>
}) {
    const user = await requireUser()
    const { saved } = await searchParams

    return (
        <div className="space-y-6">
            {saved && <FlashToast message="Profil gespeichert" />}
            <PageHeader
                title="Profil"
                action={
                    <Button asChild>
                        <Link href="/dashboard/profile/edit">Bearbeiten</Link>
                    </Button>
                }
            />

            <Card>
                <CardHeader>
                    <CardTitle>Persönliche Daten</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <p><span className="text-muted-foreground">Name:</span> {user.firstname} {user.lastname}</p>
                    <p><span className="text-muted-foreground">E-Mail:</span> {user.email}</p>
                    <p><span className="text-muted-foreground">Telefon:</span> {user.phone ?? "—"}</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Firmendaten</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <p><span className="text-muted-foreground">Firma:</span> {user.company?.name ?? "—"}</p>
                    <p><span className="text-muted-foreground">Adresse:</span> {user.company?.address ?? "—"}</p>
                    <p><span className="text-muted-foreground">PLZ/Ort:</span> {user.company?.postcode ?? "—"} {user.company?.city ?? ""}</p>
                    <p><span className="text-muted-foreground">Telefon:</span> {user.company?.phone ?? "—"}</p>
                    <p><span className="text-muted-foreground">E-Mail:</span> {user.company?.email ?? "—"}</p>
                    <p>
                        <span className="text-muted-foreground">Ansprechpartner:</span>{" "}
                        {user.company?.contactFirstname || user.company?.contactLastname
                            ? `${user.company?.contactFirstname ?? ""} ${user.company?.contactLastname ?? ""}`.trim()
                            : "—"}
                    </p>
                </CardContent>
            </Card>

            {user.role === Role.TOW_TRUCK_DRIVER && (
                <Card>
                    <CardHeader>
                        <CardTitle>Dein QR-Code</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {user.qrCode ? (
                            <div className="flex flex-col gap-2">
                                <div className="inline-block rounded-lg border bg-white p-4 w-fit">
                                    <QRCodeSVG value={user.qrCode} size={180} />
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
            )}
        </div>
    )
}