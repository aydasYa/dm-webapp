import Link from "next/link"
import prisma from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"
import { redirect,  } from "next/navigation"
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic"

export default async function LeadsPage() {
    const supabase = await createClient()
    const { data } = await supabase.auth.getClaims()

    if (!data?.claims) {
        redirect("/login")
    }

    // prisma user finden per id
    const driver = await prisma.user.findUnique({
        where: { supabaseId: data.claims.sub },
        select: { id: true },
    })

    if (!driver) redirect("/login")

    // leads holen mit prisma
    const driverLeads = await prisma.lead.findMany({
        where: { 
            towTruckDriverId: driver.id,
            deletedAt: null,
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

    // UI
    return (
    <main className="p-8">
        <h1>Alle Leads in einer Übersicht</h1>
        <Button asChild>
            <Link href="/leads/new">Neuen Lead anlegen + </Link>
        </Button>
        
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

        {/* navigation back to dashbaord user */}
        <Link href="/dashboard" className="bg-black text-white rounded px-4 py-2">Zurück zum Dashboard</Link>
    </main>
    )
}