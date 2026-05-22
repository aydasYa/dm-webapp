"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"

type Props = {
    data: {
        month: string,
        amount: number
    }[]
}

const chartConfig = {
    amount: {
        label: "Provision (€)",
        color: "hsl(var(--chart-1",
    },
} satisfies ChartConfig

export default function CommissionsChart({ data }: Props) {
    return (
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart data={data}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="amount" fill="var(--color-amount)" radius={4} />
            </BarChart>
        </ChartContainer>
    )
}