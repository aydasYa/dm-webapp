import prisma from "@/lib/prisma"
import { LeadStatus } from "@/src/generated/prisma/enums"

/**
 * Berechnet den Provisionsbetrag für einen Driver basierend auf der Anzahl
 * abgeschlossener Leads in diesem Jahr.
 *
 * Staffel (pro Lead):
 * - Position 1-4:   50€
 * - Position 5-10:  50€ + 135€ Bonus = 185€
 * - Position 11+:   50€ + 450€ Bonus = 500€
 *
 * Zeitraum: Kalenderjahr (jeder 1. Jan startet bei 0)
 */

export async function calculateCommissionAmount(driverId: string, excludedLeadId?: string): Promise<number> {
    const yearStart = new Date(new Date().getFullYear(), 0, 1)

    // Zähle wie viele Leads dieser Driver dieses Jahr schon abgeschlossen hat
    const completedThisYear = await prisma.lead.count({
        where: {
            towTruckDriverId: driverId,
            status: LeadStatus.COMPLETED,
            deletedAt: null,
            createdAt: { gte: yearStart },
            ...(excludedLeadId ? { id: { not: excludedLeadId } } : {}),
        },
    })

    // Die nächste Position = aktuell completed + 1
    const position = completedThisYear + 1

    if (position >= 11) return 500
    if (position >= 5) return 185
    return 50
}

