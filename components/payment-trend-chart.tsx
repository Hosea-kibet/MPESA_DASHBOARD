"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { PaymentTrend } from "@/lib/types"

export function PaymentTrendChart({ data }: { data: PaymentTrend[] }) {
  return (
    <ChartContainer
      config={{
        amount: {
          label: "Amount (KSh)",
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
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="amount" stroke="var(--color-amount)" activeDot={{ r: 8 }} />
          <Line yAxisId="right" type="monotone" dataKey="transactions" stroke="var(--color-transactions)" />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
