import { Card } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type StatColor = "blue" | "green" | "purple" | "amber"

const colorMap: Record<StatColor, string> = {
  blue: "bg-primary/10 text-primary",
  green: "bg-success/10 text-success",
  purple: "bg-accent-purple/10 text-accent-purple",
  amber: "bg-warning/10 text-warning",
}

type StatCardProps = {
  label: string
  value: string
  icon?: LucideIcon
  color?: StatColor
  trend?: string
  footer?: string
  compact?: boolean
}

export function StatCard({ label, value, icon: Icon, color = "blue", trend, footer, compact = false }: StatCardProps) {
  return (
    <Card className={compact ? "p-4" : "p-5"}>
      <div className={cn("flex", compact ? "items-center gap-3" : "items-start gap-4")}>
        {Icon && (
          <div
            className={cn(
              "flex shrink-0 items-center justify-center rounded-xl",
              compact ? "size-9" : "size-11",
              colorMap[color]
            )}
          >
            <Icon className={compact ? "size-4" : "size-5"} />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className={cn("font-bold tabular-nums", compact ? "text-xl" : "text-2xl")}>{value}</p>
          {trend && (
            <p className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-success">
              <TrendingUp className="size-3.5" />
              {trend}
            </p>
          )}
        </div>
      </div>
      {footer && <p className="mt-3 text-sm text-muted-foreground">{footer}</p>}
    </Card>
  )
}
