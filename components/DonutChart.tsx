"use client"

import { Pie, PieChart, Cell, Label } from "recharts"
import { ChartContainer, type ChartConfig } from "@/components/ui/chart"

// Generic donut: each slice carries its own color so filtering out zeros keeps colors aligned
type Slice = { name: string; value: number; color: string }

const chartConfig = { value: { label: "Wert" } } satisfies ChartConfig

export default function DonutChart({ data, unit }: { data: Slice[]; unit?: string }) {
  const total = data.reduce((sum, d) => sum + d.value, 0)

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
      <ChartContainer config={chartConfig} className="aspect-square h-[220px]">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} strokeWidth={2}>
            {data.map((d) => (
              <Cell key={d.name} fill={d.color} />
            ))}
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox) {
                  return (
                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                      <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                        {total.toLocaleString("de-DE")}
                      </tspan>
                      <tspan x={viewBox.cx} y={(viewBox.cy ?? 0) + 22} className="fill-muted-foreground text-sm">
                        Gesamt
                      </tspan>
                    </text>
                  )
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>

      <ul className="space-y-2 text-sm sm:min-w-[190px]">
        {data.map((d) => (
          <li key={d.name} className="flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="font-medium">{d.name}</span>
            <span className="ml-auto tabular-nums font-medium">
              {d.value.toLocaleString("de-DE")}{unit ? ` ${unit}` : ""}
            </span>
            {total > 0 && (
              <span className="w-12 text-right tabular-nums text-muted-foreground">
                {Math.round((d.value / total) * 100)} %
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
