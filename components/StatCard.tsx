import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

type StatCardProps = {
  title: string
  value: string
  icon: LucideIcon
  iconClassName?: string   // z.B. "bg-blue-100 text-blue-600"
  trend?: string           // z.B. "↑ 16 % vs. Mai 2026"
}

export function StatCard({ title, value, icon: Icon, iconClassName, trend }: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-start gap-4 pt-6">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconClassName ?? "bg-muted text-foreground"}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
          {trend && <p className="text-xs font-medium text-emerald-600">{trend}</p>}
        </div>
      </CardContent>
    </Card>
  )
}