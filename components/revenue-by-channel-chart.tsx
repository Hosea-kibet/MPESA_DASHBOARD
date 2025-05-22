"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { RevenueByChannel } from "@/lib/types"

export function RevenueByChannelChart({ data }: { data: RevenueByChannel[] }) {
  return (
    <ChartContainer
      config={{
        revenue: {
          label: "Revenue (KSh)",
          color: "hsl(var(--chart-1))",
        },
        transactions: {
          label: "Transactions",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis yAxisId="left" orientation="left" stroke="var(--color-revenue)" />
          <YAxis yAxisId="right" orientation="right" stroke="var(--color-transactions)" />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          <Bar yAxisId="left" dataKey="revenue" fill="var(--color-revenue)" />
          <Bar yAxisId="right" dataKey="transactions" fill="var(--color-transactions)" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
