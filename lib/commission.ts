import { CommissionStatus } from "@/src/generated/prisma/enums"

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


type CommissionLike = { amount: number; status: string }

// Summiert Provisionsbeträge: gesamt + je Status
export function summarizeCommissions(items: CommissionLike[]) {
  const sumBy = (status?: CommissionStatus) =>
    items
      .filter((c) => status === undefined || c.status === status)
      .reduce((sum, c) => sum + Number(c.amount), 0)

  return {
    total: sumBy(),
    pending: sumBy(CommissionStatus.PENDING),
    approved: sumBy(CommissionStatus.APPROVED),
    paid: sumBy(CommissionStatus.PAID),
    rejected: sumBy(CommissionStatus.REJECTED),
  }
}