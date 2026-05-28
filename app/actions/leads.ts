"use server"

// Server-Aktionen rund um Leads (Pannenfälle)
// Hier wird ein neuer Lead angelegt und direkt dem eingeloggten Abschlepper zugewiesen

import { createClient } from "@/lib/supabase/server"
import prisma from '@/lib/prisma'
import { redirect } from "next/navigation"
import { LeadStatus, CancelReason, Role } from "@/src/generated/prisma/enums"
import { calculateCommissionAmount } from "@/lib/commission"

// Neuen Lead anlegen – nur für eingeloggte Abschlepper
// Der Lead wird automatisch mit der ID des aktuellen Nutzers verknüpft
export async function createLead(formData: FormData) {
    const customerLastName  = formData.get("customerLastName") as string
    const vehicleMake       = formData.get("vehicleMake") as string
    const vehicleModel      = formData.get("vehicleModel") as string
    // const breakdownAddress  = formData.get("breakdownAddress") as string
    const breakdownStreet   = formData.get("breakdownStreet") as string
    const breakdownPostcode = formData.get("breakdownPostcode") as string
    const breakdownCity     = formData.get("breakdownCity") as string
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
            breakdownStreet,
            breakdownPostcode,
            breakdownCity,
            towTruckDriverId: driver.id,
            internNotice,
        },
    })

    redirect("/dashboard/leads")
}


// updateLead: Updaten von leads vom User (Abschlepper)
export async function updateLead(formData: FormData) {
    const leadId            = formData.get("leadId") as string
    const customerLastName  = formData.get("customerLastName") as string
    const vehicleMake       = formData.get("vehicleMake") as string
    const vehicleModel      = formData.get("vehicleModel") as string
    // const breakdownAddress  = formData.get("breakdownAddress") as string
    const breakdownStreet   = formData.get("breakdownStreet") as string
    const breakdownPostcode   = formData.get("breakdownPostcode") as string
    const breakdownCity   = formData.get("breakdownCity") as string
    const internNotice      = formData.get("internNotice") as string | null

    // 1. Login Prüfen
    // Supabase-Login des Nutzers prüfen
    const supabase = await createClient()
    const { data } = await supabase.auth.getClaims()
    if (!data?.claims) redirect("/login")

    // 2. Prisma user laden
    // Prisma-Nuzer anhand der Supabase-ID laden, um die 
    // interne DB-ID zu bekommen
    const user = await prisma.user.findUnique({
        where: { supabaseId: data.claims.sub },
        select: { id: true, role: true },
    })
    if (!user) redirect("/login")
    
    const isAdmin = user.role === Role.ADMIN

    // 3. Dann erst Prisma-Operation
    const existingLead = await prisma.lead.findUnique({
        where: { id: leadId },
        select: { towTruckDriverId: true },
    })


    if (!existingLead || (!isAdmin && existingLead.towTruckDriverId !== user.id)) {
        redirect("/dashboard/leads")
    }

    // 4. Update
    await prisma.lead.update({
        where: { id: leadId },
        data: {
            customerLastName,
            vehicleMake,
            vehicleModel,
            breakdownStreet,
            breakdownPostcode,
            breakdownCity,
            internNotice,
        },
    })

    redirect(`/dashboard/leads/${leadId}`)
}

export async function updateLeadStatus(formData: FormData) {
    // 1. FormData lesen - nur leadId + status
    const leadId    = formData.get("leadId") as string
    const newStatus = formData.get("status") as LeadStatus

    if (newStatus === LeadStatus.CANCELLED) {
        throw new Error("CANCELLED ist nur über Storno erlaubt")
    }

    // 2. Login prüfen
    const supabase = await createClient()
    const { data } = await supabase.auth.getClaims()
    if (!data?.claims) redirect("/login")
    
    // 3. Driver laden
    const user = await prisma.user.findUnique({
        where:  { supabaseId: data.claims.sub },
        select: { id: true, role: true },
    })
    if(!user) redirect("/login")

    const isAdmin = user.role === Role.ADMIN
    
    // 4. Lead laden + Owner-Check
    const existingLead = await prisma.lead.findUnique({
    where:  { id: leadId },
    select: { towTruckDriverId: true },
    })
    
    if (!existingLead || (!isAdmin && existingLead.towTruckDriverId !== user.id)) {
        redirect("/dashboard/leads")
    }

    // 5. Update: Diesmal NUR das status-Feld
    await prisma.lead.update({
        where:  { id: leadId },
        data:   { status: newStatus },
    })

    // Wenn Lead auf COMPLETED gesetzt wird: automatisch Commission erstellen
    if (newStatus === LeadStatus.COMPLETED) {
        // Prüfen ob es schon eine Commission gibt (Doppelt-Erstellung vermeiden)
        const existingCommission = await prisma.commission.findUnique({
            where: { leadId },
        })

        if (!existingCommission) {
            const amount = await calculateCommissionAmount(existingLead.towTruckDriverId)
            await prisma.commission.create({
                data: {
                    leadId,
                    towTruckDriverId: existingLead.towTruckDriverId,
                    amount,
                }
            })
        }
    }

    // 6. redirect zur Detail-Seite
    redirect(`/dashboard/leads/${leadId}`)
}

// lead stonierung vom abschlepper
export async function cancelLead(formData: FormData) {
    const leadId = formData.get("leadId") as string
    const cancelReason = formData.get("cancelReason") as CancelReason
    const invoiceId = formData.get("invoiceId") as string

    const supabase = await createClient()
    const { data } = await supabase.auth.getClaims()

    if (!data?.claims) redirect("/login")

    // driver laden
    const user = await prisma.user.findUnique({
        where: { supabaseId: data.claims.sub },
        select: { id: true, role: true },
    })
    if (!user) redirect("/login")

    const isAdmin = user.role === Role.ADMIN

    // db abgleich leadId und prisma user
    const existingLead = await prisma.lead.findUnique({
    where:  { id: leadId },
    select: { towTruckDriverId: true },
    })

    if (!existingLead || (!isAdmin && existingLead.towTruckDriverId !== user.id)) {
        redirect("/dashboard/leads")
    }

    // 5. Update: Diesmal NUR das status-Feld
    await prisma.lead.update({
        where:  { id: leadId },
        data:   {
            status: LeadStatus.CANCELLED,
            cancelReason,
            invoiceId,
            cancelledAt: new Date(),
            cancelledByUserId: user.id,
        },
    })

    // 6. redirect zur Detail-Seite
    redirect(`/dashboard/leads`)
}