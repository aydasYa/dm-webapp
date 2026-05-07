"use server"

import { createClient } from "@/lib/supabase/server"
import prisma from '@/lib/prisma'
import { redirect } from "next/navigation"


export async function createLead(formData: FormData) {
    const customerLastName  = formData.get("customerLastName") as string
    const vehicleMake      = formData.get("vehicleMake") as string
    const vehicleModel      = formData.get("vehicleModel") as string
    const breakdownAddress  = formData.get("breakdownAddress") as string

    // check user supabase logged-in user
    const supabase = await createClient()
    const { data } = await supabase.auth.getClaims()

    if (!data?.claims) {
        redirect("/login")
    }

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
        },
    })

    redirect("/leads")
}