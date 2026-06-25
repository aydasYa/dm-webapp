import data from "@/data/aydas-commissions.json"

// Eine Provisions-Zeile (so wie die JSON / später Salesforce sie liefert)
export type CommissionRecord = {
  id: string
  companyId: string
  driverId: string
  driverName: string
  amount: number
  status: "PAID" | "PENDING" | "APPROVED" | "REJECTED"
  createdAt: string
}

// Holt die Provisionen für eine Firma (optional auf einen Fahrer eingegrenzt)
export async function getCommissions({
  companyId,
  driverId,
}: {
  companyId: string
  driverId?: string
}): Promise<CommissionRecord[]> {
  const records = data.records as CommissionRecord[]
  return records.filter((c) => {
    if (c.companyId !== companyId) return false
    if (driverId && c.driverId !== driverId) return false
    return true
  })
}