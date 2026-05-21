import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { updateLead } from "@/app/actions/leads";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


export const dynamic = "force-dynamic"

type Params = { id: string }

export default async function EditLeadPage({ params }: { params: Promise<Params>}) {
    const { id } = await params

    // 1. Login prüfen + Driver laden
    const supabase = await createClient()
    const { data } = await supabase.auth.getClaims()
    if (!data?.claims) redirect("/login")
    
    // 1.1 Driver laden
    const driver = await prisma.user.findUnique({
        where: { supabaseId: data.claims.sub },
        select: { id: true },
    })
    if (!driver) redirect("/login")

    // 2. Lead laden mit Owner-Check
    const lead = await prisma.lead.findUnique({
        where: { id },
        select: {
            id: true,
            customerLastName: true,
            vehicleMake: true,
            vehicleModel: true,
            // breakdownAddress: true,
            breakdownStreet: true,
            breakdownPostcode: true,
            breakdownCity: true,
            towTruckDriverId: true,
            internNotice: true,
        },
    })
    if (!lead || lead.towTruckDriverId !== driver.id) {
        redirect("/leads")
    }

    // Return JSX
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
        <div className="flex w-full max-w-md flex-col gap-6">
            <Link href="/" className="flex items-center gap-2 self-center font-medium">
            </Link>

            <Card>
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Lead bearbeiten</CardTitle>
                <CardDescription>Aktualisiere die Daten dieses Leads</CardDescription>
            </CardHeader>

            <form action={updateLead}>
                <CardContent className="flex flex-col gap-6">
                <FieldGroup>
                    <Field>
                    <FieldLabel htmlFor="customerLastName">Nachname des Kunden</FieldLabel>
                    <Input
                        id="customerLastName"
                        name="customerLastName"
                        type="text"
                        required
                        defaultValue={lead.customerLastName}
                    />
                    </Field>

                    <Field>
                    <FieldLabel htmlFor="vehicleMake">Fahrzeug-Marke</FieldLabel>
                    <Input
                        id="vehicleMake"
                        name="vehicleMake"
                        type="text"
                        required
                        defaultValue={lead.vehicleMake}
                    />
                    </Field>

                    <Field>
                    <FieldLabel htmlFor="vehicleModel">Fahrzeug-Modell</FieldLabel>
                    <Input
                        id="vehicleModel"
                        name="vehicleModel"
                        type="text"
                        required
                        defaultValue={lead.vehicleModel}
                    />
                    </Field>

                    <Field>
                    <FieldLabel htmlFor="breakdownStreet">Pannen-Straße</FieldLabel>
                    <Input
                        id="breakdownStreet"
                        name="breakdownStreet"
                        type="text"
                        required
                        defaultValue={lead.breakdownStreet}
                    />
                    </Field>

                    <Field>
                    <FieldLabel htmlFor="breakdownPostcode">Pannen-PLZ</FieldLabel>
                    <Input
                        id="breakdownPostcode"
                        name="breakdownPostcode"
                        type="text"
                        required
                        defaultValue={lead.breakdownPostcode}
                    />
                    </Field>

                    <Field>
                    <FieldLabel htmlFor="breakdownCity">Pannen-Ort</FieldLabel>
                    <Input
                        id="breakdownCity"
                        name="breakdownCity"
                        type="text"
                        required
                        defaultValue={lead.breakdownCity}
                    />
                    </Field>

                    <Field>
                    <FieldLabel htmlFor="internNotice">Interne Notiz (Optional)</FieldLabel>
                    <Textarea
                        id="internNotice"
                        name="internNotice"
                        rows={3}
                        defaultValue={lead.internNotice ?? ""}
                    />
                    </Field>
                    <input 
                        type="hidden"
                        name="leadId" 
                        value={lead.id}
                    />
                </FieldGroup>

                <div className="flex gap-3">
                    <Button asChild variant="outline" className="flex-1">
                        <Link href={`/leads/${lead.id}`}>Abbrechen</Link>
                    </Button>
                    <Button type="submit" className="flex-1">Speichern</Button>
                </div>
                </CardContent>
            </form>
            </Card>
        </div>
        </div>
    )
}

