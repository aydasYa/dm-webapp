import { cn } from "@/lib/utils"

type Tone = "success" | "warning" | "info" | "destructive" | "muted"

const toneClasses: Record<Tone, string> = {
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  info: "bg-info/10 text-info",
  destructive: "bg-destructive/10 text-destructive",
  muted: "bg-muted text-muted-foreground",
}

// Status → Farbton + deutsches Label (zentral, damit Farben/Labels an einer Stelle leben)
export const COMMISSION_STATUS: Record<string, { tone: Tone; label: string }> = {
  PENDING: { tone: "warning", label: "Offen" },
  APPROVED: { tone: "info", label: "Genehmigt" },
  PAID: { tone: "success", label: "Ausbezahlt" },
  REJECTED: { tone: "destructive", label: "Abgelehnt" },
}

// Fahrer werden nicht „abgelehnt" — REJECTED zeigt „Deaktiviert"
export const DRIVER_STATUS: Record<string, { tone: Tone; label: string }> = {
  ACTIVE: { tone: "success", label: "Aktiv" },
  PENDING: { tone: "warning", label: "Ausstehend" },
  INACTIVE: { tone: "muted", label: "Deaktiviert" },
  REJECTED: { tone: "muted", label: "Deaktiviert" },
}

// Firmen-Admins: REJECTED = „Abgelehnt" (roter Ton)
export const COMPANY_STATUS: Record<string, { tone: Tone; label: string }> = {
  ACTIVE: { tone: "success", label: "Aktiv" },
  PENDING: { tone: "warning", label: "Ausstehend" },
  INACTIVE: { tone: "muted", label: "Deaktiviert" },
  REJECTED: { tone: "destructive", label: "Abgelehnt" },
}

export function StatusBadge({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        toneClasses[tone]
      )}
    >
      {children}
    </span>
  )
}
