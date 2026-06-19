"use client"

import { Pie, PieChart, Cell } from "recharts"
import { ChartContainer, type ChartConfig } from "@/components/ui/chart"

// Each slice carries its own color so filtering out zero-values keeps colors aligned
type Slice = { name: string; value: number; color: string }

const chartConfig = { value: { label: "Unternehmen" } } satisfies ChartConfig

export default function CompanyStatusChart({ data }: { data: Slice[] }) {
  const total = data.reduce((sum, d) => sum + d.value, 0)

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
      <ChartContainer config={chartConfig} className="aspect-square h-[220px]">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} strokeWidth={2}>
            {data.map((d) => (
              <Cell key={d.name} fill={d.color} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>

      <ul className="space-y-2 text-sm">
        {data.map((d) => (
          <li key={d.name} className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: d.color }} />
            <span className="font-medium">{d.name}</span>
            <span className="text-muted-foreground">
              {d.value}{total > 0 ? ` (${Math.round((d.value / total) * 100)} %)` : ""}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
