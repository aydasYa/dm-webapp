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

    // 1. Login prüfen
    // Supabase-Login des Nutzers prüfen
    const supabase = await createClient()
    const { data } = await supabase.auth.getClaims()
    if (!data?.claims) redirect("/login")
    
    // 2. Prsima user Laden
    // Prisma-Nutzer anhand der Supabase-ID laden, um die interne DB-ID zu bekommen
    const driver = await prisma.user.findUnique({
        where: { supabaseId: data.claims.sub },
        select: { id: true },
    })
    if (!driver) redirect("/login")

        // 3. Dann erst Prisma-Operation
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


// updateLead: Updaten von leads vom User (Abschlepper)
export async function updateLead(formData: FormData) {
    const leadId            = formData.get("leadId") as string
    const customerLastName  = formData.get("customerLastName") as string
    const vehicleMake       = formData.get("vehicleMake") as string
    const vehicleModel      = formData.get("vehicleModel") as string
    const breakdownAddress  = formData.get("breakdownAddress") as string
    const internNotice      = formData.get("internNotice") as string | null

    // 1. Login Prüfen
    // Supabase-Login des Nutzers prüfen
    const supabase = await createClient()
    const { data } = await supabase.auth.getClaims()
    if (!data?.claims) redirect("/login")

    // 2. Prisma user laden
    // Prisma-Nuzer anhand der Supabase-ID laden, um die 
    // interne DB-ID zu bekommen
    const driver = await prisma.user.findUnique({
        where: { supabaseId: data.claims.sub },
        select: { id: true },
    })
    if (!driver) redirect("/login")

    // 3. Dann erst Prisma-Operation
    const existingLead = await prisma.lead.findUnique({
        where: { id: leadId },
        select: { towTruckDriverId: true },
    })
    if (!existingLead || existingLead.towTruckDriverId !== driver.id) {
        redirect("/leads")
    }

    // 4. Update
    await prisma.lead.update({
        where: { id: leadId },
        data: {
            customerLastName,
            vehicleMake,
            vehicleModel,
            breakdownAddress,
            internNotice,
        },
    })

    redirect(`/leads/${leadId}`)
}