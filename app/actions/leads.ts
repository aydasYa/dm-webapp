"use server"

// Server-Aktionen rund um Leads (Pannenfälle)
// Hier wird ein neuer Lead angelegt und direkt dem eingeloggten Abschlepper zugewiesen

import { createClient } from "@/lib/supabase/server"
import prisma from '@/lib/prisma'
import { redirect } from "next/navigation"

// Neuen Lead anlegen – nur für eingeloggte Abschlepper
// Der Lead wird automatisch mit der ID des aktuellen Nutzers verknüpft
export async function createLead(formData: FormData) {
    const customerLastName  = formData.get("customerLastName") as string
    const vehicleMake      = formData.get("vehicleMake") as string
    const vehicleModel      = formData.get("vehicleModel") as string
    const breakdownAddress  = formData.get("breakdownAddress") as string
    const internNotice      = formData.get("internNotice") as string | null

    // Supabase-Login des Nutzers prüfen
    const supabase = await createClient()
    const { data } = await supabase.auth.getClaims()

    if (!data?.claims) {
        redirect("/login")
    }

    // Prisma-Nutzer anhand der Supabase-ID laden, um die interne DB-ID zu bekommen
    const driver = await prisma.user.findUnique({
        where: { supabaseId: data.claims.sub },
        select: { id: true },
    })

    if (!driver) {
        redirect("/login")
    }

    await prisma.lead.create({
        data: {
            customerLastName,
            vehicleMake,
            vehicleModel,
            breakdownAddress,
            towTruckDriverId: driver.id,
            internNotice,
        },
    })

    redirect("/leads")
}