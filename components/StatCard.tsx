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
}

export function StatCard({ label, value, icon: Icon, color = "blue", trend, footer }: StatCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start gap-4">
        {Icon && (
          <div className={cn("flex size-11 shrink-0 items-center justify-center rounded-xl", colorMap[color])}>
            <Icon className="size-5" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold tabular-nums">{value}</p>
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