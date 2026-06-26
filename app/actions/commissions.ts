"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { Role, CommissionStatus } from "@/src/generated/prisma/enums"
import { requireUser } from "@/lib/auth"


// Admin: Commission freigeben (PENDING → APPROVED)
export async function approveCommission(formData: FormData) {
    const commissionId = formData.get("commissionId") as string

    const caller = await requireUser()
    if (caller.role !== Role.ADMIN) throw new Error("Keine Berechtigung")

    if (!caller.companyId) throw new Error("Keine Berechtigung")

    const result = await prisma.commission.updateMany({
        where: {
            id: commissionId,
            status: CommissionStatus.PENDING,
            towTruckDriver: { companyId: caller.companyId }
        },
        data: { status: CommissionStatus.APPROVED },
    })
    if (result.count === 0) {
        throw new Error("Provision kann nicht freigegeben werden")
    }

    revalidatePath("/dashboard/commissions")
}


// Admin: Commission als bezahlt markieren (APPROVED → PAID)
export async function markCommissionAsPaid(formData: FormData) {
    const commissionId = formData.get("commissionId") as string
    const paymentRef = formData.get("paymentRef") as string | null

    const caller = await requireUser()
    if (caller.role !== Role.ADMIN) throw new Error("Keine Berechtigung")

    if (!caller.companyId) throw new Error("Keine Berechtigung")

    const result = await prisma.commission.updateMany({
        where: {
            id: commissionId,
            status: CommissionStatus.APPROVED,
            towTruckDriver: { companyId: caller.companyId }
        },
        data: {
            status: CommissionStatus.PAID,
            paidAt: new Date(),
            paymentRef,
        },
    })

    if (result.count === 0) {
        throw new Error("Provision kann nicht als bezahlt markiert werden")
    }

    revalidatePath("/dashboard/commissions")
}