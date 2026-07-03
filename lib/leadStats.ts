import type { LeadRecord } from "@/lib/getLeads"

type LeadStatusSlice = { name: string; value: number; color: string }


// Lead-Status-Verteilung (für den Donut)
export function buildLeadStatus(records: LeadRecord[]): LeadStatusSlice[] {
  const count = (status: LeadRecord["status"]) => records.filter((l) => l.status === status).length
  return [
    { name: "Abgeschlossen", value: count("COMPLETED"), color: "var(--success)" },
    { name: "In Bearbeitung", value: count("IN_PROGRESS"), color: "var(--info)" },
    { name: "Offen", value: count("OPEN"), color: "var(--warning)" },
    { name: "Storniert", value: count("CANCELLED"), color: "var(--destructive)" },
  ].filter((d) => d.value > 0)
}

// Leads pro Tag im Monat von `ref` (für das Verlaufs-Diagramm)
export function buildLeadTrend(records: LeadRecord[], ref: Date = new Date()) {
  const year = ref.getFullYear()
  const month = ref.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const mm = String(month + 1).padStart(2, "0")

  return Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1
    const count = records.filter((l) => {
      const d = new Date(l.createdAt)
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day
    }).length
    return { date: `${year}-${mm}-${String(day).padStart(2, "0")}`, count }
  })
}