"use server"

import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { Role, CommissionStatus } from "@/src/generated/prisma/enums"

// Admin: Commission freigeben (PENDING → APPROVED)
export async function approveCommission(formData: FormData) {
    const commissionId = formData.get("commissionId") as string

    // Login + Admin-Check
    const supabase = await createClient()
    const { data } = await supabase.auth.getClaims()
    if (!data?.claims) redirect("/login")

    const caller = await prisma.user.findUnique({
        where: { supabaseId: data.claims.sub },
        select: { role: true },
    })
    if (caller?.role !== Role.ADMIN) throw new Error("Keine Berechtigung")

    await prisma.commission.update({
        where: { id: commissionId },
        data: { status: CommissionStatus.APPROVED },
    })

    revalidatePath("/dashboard/commissions")
}

// Admin: Commission als bezahlt markieren (APPROVED → PAID)
export async function markCommissionAsPaid(formData: FormData) {
    const commissionId = formData.get("commissionId") as string
    const paymentRef = formData.get("paymentRef") as string | null

    const supabase = await createClient()
    const { data } = await supabase.auth.getClaims()
    if (!data?.claims) redirect("/login")

    const caller = await prisma.user.findUnique({
        where: { supabaseId: data.claims.sub },
        select: { role: true },
    })
    if (caller?.role !== Role.ADMIN) throw new Error("Keine Berechtigung")

    await prisma.commission.update({
        where: { id: commissionId },
        data: {
            status: CommissionStatus.PAID,
            paidAt: new Date(),
            paymentRef,
        },
    })

    revalidatePath("/dashboard/commissions")
}