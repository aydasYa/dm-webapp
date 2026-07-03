type CommissionLike = { amount: number; createdAt: Date }

const MONTH_NAMES = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"]

// Provision pro Monat (aktuelles Jahr) — für das Balkendiagramm
export function buildMonthlyCommissions(items: CommissionLike[], year = new Date().getFullYear()) {
  return MONTH_NAMES.map((month, idx) => ({
    month,
    amount: items
      .filter((c) => c.createdAt.getFullYear() === year && c.createdAt.getMonth() === idx)
      .reduce((sum, c) => sum + Number(c.amount), 0),
  }))
}

// Vormonats-Trend als anzeige-fertiger String, z.B. "↑ 150 € vs. Jun"
export function buildCommissionTrend(items: CommissionLike[], ref = new Date()) {
  const sumForMonth = (year: number, month: number) =>
    items
      .filter((c) => c.createdAt.getFullYear() === year && c.createdAt.getMonth() === month)
      .reduce((sum, c) => sum + Number(c.amount), 0)

  const thisMonth = sumForMonth(ref.getFullYear(), ref.getMonth())
  const last = new Date(ref.getFullYear(), ref.getMonth() - 1, 1)
  const diff = thisMonth - sumForMonth(last.getFullYear(), last.getMonth())

  return `${diff >= 0 ? "↑" : "↓"} ${Math.abs(diff).toFixed(0)} € vs. ${last.toLocaleDateString("de-DE", { month: "short" })}`
}

// Provisions-Status-Verteilung (für den Donut) aus den Summen
export function buildCommissionStatus(s: { pending: number; approved: number; paid: number; rejected: number }) {
  return [
    { name: "Offen", value: Math.round(s.pending), color: "var(--warning)" },
    { name: "Genehmigt", value: Math.round(s.approved), color: "var(--info)" },
    { name: "Ausbezahlt", value: Math.round(s.paid), color: "var(--success)" },
    { name: "Abgelehnt", value: Math.round(s.rejected), color: "var(--destructive)" },
  ].filter((d) => d.value > 0)
}