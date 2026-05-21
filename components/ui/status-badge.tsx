import { cn } from "@/lib/utils"

// Deutsche Labels für alle Lead-Status
export const statusLabels: Record<string, string> = {
  NEW: "Neu",
  DISTRIBUTED: "Verteilt",
  QR_SCANNED: "QR gescannt",
  WORKSHOP_SELECTED: "Werkstatt gewählt",
  IN_REPAIR: "In Reparatur",
  REPAIR_DONE: "Reparatur fertig",
  VEHICLE_DELIVERED: "Fahrzeug geliefert",
  COMPLETED: "Abgeschlossen",
  CANCELLED: "Storniert",
}

// Farbschema für jeden Status
const statusStyles: Record<string, string> = {
  NEW: "bg-violet-100 text-violet-700 ring-violet-200",
  DISTRIBUTED: "bg-blue-100 text-blue-700 ring-blue-200",
  QR_SCANNED: "bg-cyan-100 text-cyan-700 ring-cyan-200",
  WORKSHOP_SELECTED: "bg-indigo-100 text-indigo-700 ring-indigo-200",
  IN_REPAIR: "bg-yellow-100 text-yellow-800 ring-yellow-300",
  REPAIR_DONE: "bg-orange-100 text-orange-700 ring-orange-200",
  VEHICLE_DELIVERED: "bg-teal-100 text-teal-700 ring-teal-200",
  COMPLETED: "bg-emerald-100 text-emerald-800 ring-emerald-300",
  CANCELLED: "bg-red-100 text-red-700 ring-red-200",
}

type StatusBadgeProps = {
  status: string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const label = statusLabels[status] ?? status
  const styles = statusStyles[status] ?? statusStyles.NEW

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        styles,
        className
      )}
    >
      {label}
    </span>
  )
}

// Export für Select-Optionen
export const statusOptions = Object.entries(statusLabels).map(([value, label]) => ({
  value,
  label,
}))
