import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardFooter,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type StatCardProps = {
  label: string
  value: string
  trend?: string   // shown as a pill top-right, e.g. "↑ 150 € vs. Mai"
  footer?: string  // optional muted line at the bottom
}

export function StatCard({ label, value, trend, footer }: StatCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl font-bold tabular-nums">{value}</CardTitle>
        {trend && (
          <CardAction>
            <Badge variant="outline">{trend}</Badge>
          </CardAction>
        )}
      </CardHeader>
      {footer && (
        <CardFooter className="text-sm text-muted-foreground">{footer}</CardFooter>
      )}
    </Card>
  )
}
