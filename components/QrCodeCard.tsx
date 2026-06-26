"use client"

import { QRCodeSVG } from "qrcode.react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

type Props = {
    driver: {
        id: string
        firstname: string
        lastname: string
        qrCode: string | null
        company: { name: string } | null
    }
    generateAction: (formData: FormData) => void
}

export default function QrCodeCard({ driver, generateAction }: Props) {
    return (
        <Card>
            <CardContent className="pt-6 flex flex-col items-center text-center gap-3">
                <div>
                    <p className="font-medium">{driver.firstname} {driver.lastname}</p>
                    {driver.company?.name && (
                        <p className="text-xs text-muted-foreground">{driver.company.name}</p>
                    )}
                </div>

                {driver.qrCode ? (
                    <>
                        <div className="rounded-lg border bg-white p-3">
                            <QRCodeSVG value={driver.qrCode} size={140} />
                        </div>
                        <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                            {driver.qrCode}
                        </p>
                    </>
                ) : (
                    <form action={generateAction}>
                        <input type="hidden" name="userId" value={driver.id} />
                        <Button type="submit" variant="outline" size="sm">Generieren</Button>
                    </form>
                )}
            </CardContent>
        </Card>
    )
}