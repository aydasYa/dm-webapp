import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import Link from "next/link"
import { QRCodeSVG } from "qrcode.react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const dynamic = "force-dynamic"

export default async function ProfilePage() {
    const supabase = await createClient()
    const { data } = await supabase.auth.getClaims()
    if (!data?.claims) redirect("/login")

    const user = await prisma.user.findUnique({
        where: { supabaseId: data.claims.sub },
        select: {
            firstname: true,
            lastname: true,
            email: true,
            phone: true,
            qrCode: true,
            companyName: true,
            companyAddress: true,
            companyPostcode: true,
            companyCity: true,
            companyPhone: true,
            companyEmail: true,
            companyContactPerson: true,
        },
    })
    if (!user) redirect("/login")

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Profil</h1>
                <Button asChild>
                    <Link href="/profile/edit">Bearbeiten</Link>
                </Button>
            </div>

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
                    <p><span className="text-muted-foreground">Firma:</span> {user.companyName ?? "—"}</p>
                    <p><span className="text-muted-foreground">Adresse:</span> {user.companyAddress ?? "—"}</p>
                    <p><span className="text-muted-foreground">PLZ/Ort:</span> {user.companyPostcode ?? "—"} {user.companyCity ?? ""}</p>
                    <p><span className="text-muted-foreground">Telefon:</span> {user.companyPhone ?? "—"}</p>
                    <p><span className="text-muted-foreground">E-Mail:</span> {user.companyEmail ?? "—"}</p>
                    <p><span className="text-muted-foreground">Ansprechpartner:</span> {user.companyContactPerson ?? "—"}</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Ihr QR-Code</CardTitle>
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
                            Noch kein QR-Code generiert. Ein Admin muss dir einen erstellen.
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}