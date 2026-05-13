import Link from "next/link"
import prisma from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"
import { redirect,  } from "next/navigation"
import { LeadStatus } from "@/src/generated/prisma/enums"
import { Button } from "@/components/ui/button"

// force-dynamic: neue Leads sollen sofort sichtbar sein, kein Caching
export const dynamic = "force-dynamic"

type SearchParams ={
    status?: string,
}

// Leads-Übersicht für den eingeloggten Abschlepper
// Zeigt nur seine eigenen Leads – optional nach Status filterbar via URL-Parameter
export default async function LeadsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
    const supabase = await createClient()
    const { data } = await supabase.auth.getClaims()
    const { status } = await searchParams

    // data.claims enthält die Session-Infos des eingeloggten Nutzers
    if (!data?.claims) {
        redirect("/login")
    }

    // data.claims.sub ist die eindeutige Supabase-Nutzer-ID (UUID)
    // damit holen wir den passenden Eintrag aus unserer eigenen Datenbank
    const driver = await prisma.user.findUnique({
        where: { supabaseId: data.claims.sub },
        select: { id: true },
    })

    if (!driver) redirect("/login")

    // Leads per Prisma laden
    const driverLeads = await prisma.lead.findMany({
        where: {
            towTruckDriverId: driver.id,
            deletedAt: null,
            // falls ein Status-Filter gesetzt ist, wird er hier dynamisch ergänzt
            ...(status && { status: status as LeadStatus }),
        },
        select: {
            id: true,
            customerLastName: true,
            vehicleMake: true,
            vehicleModel: true,
            breakdownAddress: true,
            status: true,
            createdAt: true,
        },
        orderBy: { createdAt: 'desc' }
    })

    // Darstellung
    return (
    <main className="p-8">
        <h1>Alle Leads in einer Übersicht</h1>
        <Button asChild>
            <Link href="/leads/new">Neuen Lead anlegen + </Link>
        </Button>
        
        <form action="/leads" method="get" className="mb-6">
            <label htmlFor="status" className="mr-2">Status:</label>
            <select 
                id="status" 
                name="status" 
                defaultValue={status ?? ''}
                className="border rounded px-2 py-1"
            >
                <option value="">Alle</option>
                <option value="NEW">NEW</option>
                <option value="DISTRIBUTED">DISTRIBUTED</option>
                <option value="QR_SCANNED">QR_SCANNED</option>
                <option value="WORKSHOP_SELECTED">WORKSHOP_SELECTED</option>
                <option value="IN_REPAIR">IN_REPAIR</option>
                <option value="REPAIR_DONE">REPAIR_DONE</option>
                <option value="VEHICLE_DELIVERED">VEHICLE_DELIVERED</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
            </select>
            <button type="submit" className="ml-2 underline">Filtern</button>
        </form>

        {driverLeads.length === 0 ? (
        <p>Noch keine Leads erfasst</p>
        ) : (
        <div>
            {driverLeads.map((lead) => (
            <Link 
                key={lead.id} 
                href={`/leads/${lead.id}`}
                className="block hover:bg-muted/50 rounded-lg p-2"
            >
                <p>Kunde: {lead.customerLastName}</p>
                <p>Fahrzeug: {lead.vehicleMake} {lead.vehicleModel}</p>
                <p>Adresse: {lead.breakdownAddress}</p>
                <p>Status: {lead.status}</p>
            </Link>
            ))}
        </div>
        )}

        {/* Navigation zurück zum Dashboard */}
        <Link href="/dashboard" className="bg-black text-white rounded px-4 py-2">Zurück zum Dashboard</Link>
    </main>
    )
}