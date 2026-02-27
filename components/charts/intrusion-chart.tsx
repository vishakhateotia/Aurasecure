"use client"

import { useState } from "react"
import { XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"

const data = [
  { day: "Mon", intrusions: 4, authorized: 45 },
  { day: "Tue", intrusions: 7, authorized: 52 },
  { day: "Wed", intrusions: 3, authorized: 48 },
  { day: "Thu", intrusions: 12, authorized: 61 },
  { day: "Fri", intrusions: 8, authorized: 55 },
  { day: "Sat", intrusions: 2, authorized: 23 },
  { day: "Sun", intrusions: 1, authorized: 18 },
]

export function IntrusionChart() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={cn("pastel-card rounded-2xl p-6 transition-all duration-300", isHovered && "shadow-xl")}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="p-2 rounded-xl bg-sky">
          <BarChart3 className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Intrusion Frequency</h3>
          <p className="text-sm text-muted-foreground">Last 7 days activity</p>
        </div>
      </div>
      <ChartContainer
        config={{
          intrusions: {
            label: "Intrusions",
            color: "oklch(0.72 0.14 20)",
          },
          authorized: {
            label: "Authorized",
            color: "oklch(0.75 0.14 160)",
          },
        }}
        className="h-[300px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="intrusionGradientPastel" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.88 0.08 350)" stopOpacity={0.6} />
                <stop offset="100%" stopColor="oklch(0.88 0.08 350)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="authorizedGradientPastel" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.88 0.08 170)" stopOpacity={0.6} />
                <stop offset="100%" stopColor="oklch(0.88 0.08 170)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.01 280)" vertical={false} />
            <XAxis dataKey="day" stroke="oklch(0.5 0.02 280)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="oklch(0.5 0.02 280)" fontSize={12} tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="authorized"
              stroke="oklch(0.75 0.14 160)"
              strokeWidth={2}
              fill="url(#authorizedGradientPastel)"
            />
            <Area
              type="monotone"
              dataKey="intrusions"
              stroke="oklch(0.72 0.14 20)"
              strokeWidth={2}
              fill="url(#intrusionGradientPastel)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}
