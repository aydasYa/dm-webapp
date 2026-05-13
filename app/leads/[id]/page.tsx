import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import Link from "next/link"

export const dynamic = "force-dynamic"

type Params = { id:string }

// Detailansicht eines einzelnen Leads
// Sicherheitscheck: Abschlepper darf nur seine eigenen Leads sehen – fremde IDs werden auf /leads umgeleitet
export default async function LeadDetailPage({ params }: { params: Promise<Params> }) {
    const { id } = await params

    // Login prüfen
    const supabase = await createClient()
    const { data } = await supabase.auth.getClaims()

    if (!data?.claims) {
    redirect("/login")
    }

    // Prisma-Nutzer anhand der ID suchen
    const driver = await prisma.user.findUnique({
    where: { supabaseId: data.claims.sub },
    select: { id: true, },
    })

    if (!driver) redirect("/login")

    const lead = await prisma.lead.findUnique({
        where: { id },
        select: {
            id: true,
            customerLastName: true,
            vehicleMake: true,
            vehicleModel: true,
            breakdownAddress: true,
            status: true,
            createdAt: true,
            towTruckDriverId: true,
            internNotice: true,
         },
    })

    // Gehört der Lead nicht zum eingeloggten Abschlepper, wird er weggeschickt
    if (!lead || lead.towTruckDriverId !== driver.id) {
        redirect("/leads")
    }

   return (
        <main className="p-8">
            <h1 className="text-2xl font-semibold">Lead Details</h1>
            
            <div className="mt-6 flex flex-col gap-2 max-w-md">
            <p>Kunde: {lead.customerLastName}</p>
            <p>Fahrzeug: {lead.vehicleMake} {lead.vehicleModel}</p>
            <p>Adresse: {lead.breakdownAddress}</p>
            <p>Status: {lead.status}</p>
            <p className="text-sm text-muted-foreground">
                Erstellt: {lead.createdAt.toLocaleString('de-DE')}
            </p>
            {lead.internNotice && (
                <p className="text-sm text-muted-foreground">
                    Notiz: {lead.internNotice}
                    </p>
            )}
            </div>

            <p className="mt-6">
            <Link href="/leads" className="underline">Zurück zur Übersicht</Link>
            </p>
        </main>
    )
}