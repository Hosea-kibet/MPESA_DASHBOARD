"use client"

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { UserActivity } from "@/lib/types"

export function UserActivityMap({ data }: { data: UserActivity[] }) {
  return (
    <ChartContainer
      config={{
        x: {
          label: "Longitude",
          color: "hsl(var(--chart-1))",
        },
        y: {
          label: "Latitude",
          color: "hsl(var(--chart-2))",
        },
        z: {
          label: "Transactions",
          color: "hsl(var(--chart-3))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid />
          <XAxis type="number" dataKey="x" name="longitude" />
          <YAxis type="number" dataKey="y" name="latitude" />
          <ChartTooltip cursor={{ strokeDasharray: "3 3" }} content={<ChartTooltipContent />} />
          <Scatter name="User Activity" data={data} fill="var(--color-x)" />
        </ScatterChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
