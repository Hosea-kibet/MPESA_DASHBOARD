"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { DailyTransaction } from "@/lib/types"

export function DailyTransactionsChart({ data }: { data: DailyTransaction[] }) {
  return (
    <ChartContainer
      config={{
        till: {
          label: "Till",
          color: "hsl(var(--chart-1))",
        },
        paybill: {
          label: "Paybill",
          color: "hsl(var(--chart-2))",
        },
        ussd: {
          label: "USSD",
          color: "hsl(var(--chart-3))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hour" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area type="monotone" dataKey="till" stackId="1" stroke="var(--color-till)" fill="var(--color-till)" />
          <Area
            type="monotone"
            dataKey="paybill"
            stackId="1"
            stroke="var(--color-paybill)"
            fill="var(--color-paybill)"
          />
          <Area type="monotone" dataKey="ussd" stackId="1" stroke="var(--color-ussd)" fill="var(--color-ussd)" />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
