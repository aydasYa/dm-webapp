export type DateRange = { gte?: Date; lte?: Date }

export function resolveRange(preset?: string, from?: string, to?: string): DateRange {
  const now = new Date()

  if (preset === "7d") return { gte: new Date(now.getTime() - 7 * 86400000) }
  if (preset === "30d") return { gte: new Date(now.getTime() - 30 * 86400000) }
  if (preset === "3m") return { gte: new Date(now.getFullYear(), now.getMonth() - 3, now.getDate()) }

  // Free range (only the fields that are set)
  const range: DateRange = {}
  if (from) range.gte = new Date(from)
  if (to) {
    const end = new Date(to)
    end.setHours(23, 59, 59, 999) // include the whole "to" day
    range.lte = end
  }
  return range
}

export function inRange(date: Date, range: DateRange): boolean {
  if (range.gte && date < range.gte) return false
  if (range.lte && date > range.lte) return false
  return true
}