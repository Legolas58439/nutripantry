"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// The chart's config maps the "kcal" series to a label and a color. shadcn turns
// `color` into a CSS variable (--color-kcal) we reference on the <Bar>.
const chartConfig = {
  kcal: { label: "kcal", color: "var(--chart-1)" },
} satisfies ChartConfig;

export default function KcalChart({
  data,
}: {
  data: { date: string; kcal: number }[];
}) {
  return (
    <ChartContainer config={chartConfig} className="h-[220px] w-full">
      <BarChart data={data} margin={{ left: 0, right: 0, top: 8 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          fontSize={11}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="kcal" fill="var(--color-kcal)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
