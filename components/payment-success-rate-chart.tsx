"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { PaymentSuccessRate } from "@/lib/types"

export function PaymentSuccessRateChart({ data }: { data: PaymentSuccessRate[] }) {
  return (
    <ChartContainer
      config={{
        success: {
          label: "Success",
          color: "hsl(var(--chart-1))",
        },
        failure: {
          label: "Failure",
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
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          <Bar dataKey="success" fill="var(--color-success)" />
          <Bar dataKey="failure" fill="var(--color-failure)" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
