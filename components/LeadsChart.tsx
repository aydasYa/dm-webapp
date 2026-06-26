"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

type Props = {
  data: {
    day: string
    count: number
  }[]
}

const chartConfig = {
  count: {
    label: "Leads",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export default function LeadsChart({ data }: Props) {
  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <AreaChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="day" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area dataKey="count" type="monotone" stroke="var(--color-count)" fill="var(--color-count)" fillOpacity={0.2} />
      </AreaChart>
    </ChartContainer>
  )
}