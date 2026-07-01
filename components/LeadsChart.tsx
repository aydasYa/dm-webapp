"use client"

import { useState } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Point = { date: string; count: number } // date = ISO, z.B. "2026-06-01"
type Props = {
  data: Point[]
  title?: string
}

function parse(iso: string) {
  return new Date(`${iso}T12:00:00`)
}
function formatShort(iso: string) {
  return parse(iso).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" })
}
function formatLong(iso: string) {
  return parse(iso).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" })
}

// Tageswerte zu 7-Tage-Blöcken summieren
function aggregateWeekly(data: Point[]): Point[] {
  const out: Point[] = []
  for (let i = 0; i < data.length; i += 7) {
    const chunk = data.slice(i, i + 7)
    if (chunk.length === 0) continue
    out.push({ date: chunk[0].date, count: chunk.reduce((a, b) => a + b.count, 0) })
  }
  return out
}

export default function LeadsChart({ data, title = "Lead-Entwicklung" }: Props) {
  const [view, setView] = useState<"daily" | "weekly">("daily")
  const weekly = view === "weekly"
  const series = weekly ? aggregateWeekly(data) : data

  const chartConfig = {
    count: {
      label: weekly ? "Leads pro Woche" : "Leads pro Tag",
      color: "var(--primary)",
    },
  } satisfies ChartConfig

  // Saubere Y-Achse: Schrittweite passend wählen, Maximum aufrunden → gleichmäßige Ticks
  const maxCount = Math.max(10, ...series.map((d) => d.count))
  const step = maxCount <= 20 ? 2 : maxCount <= 60 ? 10 : 20
  const top = Math.ceil(maxCount / step) * step
  const ticks = Array.from({ length: top / step + 1 }, (_, i) => i * step)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-base font-semibold">{title}</h3>
        <Select value={view} onValueChange={(v) => setView(v as "daily" | "weekly")}>
          <SelectTrigger className="h-8 w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Täglich</SelectItem>
            <SelectItem value="weekly">Wöchentlich</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ChartContainer config={chartConfig} className="h-[300px] w-full">
        <AreaChart data={series} margin={{ left: 12, right: 12, top: 8 }}>
          <defs>
            <linearGradient id="fillLeads" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-count)" stopOpacity={0.4} />
              <stop offset="95%" stopColor="var(--color-count)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={true}
            axisLine={false}
            tickMargin={8}
            minTickGap={24}
            padding={{ left: 12, right: 8 }}
            tickFormatter={formatShort}
          />
          <YAxis
            tickLine={true}
            axisLine={false}
            width={28}
            domain={[0, top]}
            ticks={ticks}
            allowDecimals={false}
          />
          <ChartTooltip
            content= {<ChartTooltipContent labelFormatter={(value) => formatLong(value as string)} />}
          />
          <Area
            dataKey="count"
            type="monotone"
            stroke="var(--color-count)"
            strokeWidth={2}
            fill="url(#fillLeads)"
          />
          <ChartLegend content={<ChartLegendContent />} />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}
