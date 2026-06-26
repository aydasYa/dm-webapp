import data from "@/data/demo-leads.json"

// Eine Lead-Zeile (so wie die JSON / später Salesforce sie liefert)
export type LeadRecord = {
  id: string
  companyId: string
  driverId: string
  status: "COMPLETED" | "IN_PROGRESS" | "OPEN" | "CANCELLED"
  createdAt: string
}

// Holt die Leads einer Firma (optional auf einen Fahrer eingegrenzt)
export async function getLeads({
  companyId,
  driverId,
}: {
  companyId: string
  driverId?: string
}): Promise<LeadRecord[]> {
  const records = data.records as LeadRecord[]
  return records.filter((l) => {
    if (l.companyId !== companyId) return false
    if (driverId && l.driverId !== driverId) return false
    return true
  })
}