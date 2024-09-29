"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { DieCalculationParameters, DieCalculationResults } from "@/types"

export const description = "Die Yield Results"

const chartData = (results: DieCalculationResults) => [
  {
    status: "Good",
    wafers: Math.round((results.yield / 100) * results.goodDevices),
    fill: "var(--color-good)",
  },
  {
    status: "Wasted",
    wafers: results.excludedDevices,
    fill: "var(--color-wasted)",
  },
  {
    status: "Partial",
    wafers: results.partialDevices,
    fill: "var(--color-partial)",
  },
  {
    status: "Defective",
    wafers:
      results.goodDevices -
      Math.round((results.yield / 100) * results.goodDevices),
    fill: "var(--color-defective)",
  },
]

const chartConfig = {
  good: {
    label: "Good",
    color: "hsl(var(--chart-good))",
  },
  wasted: {
    label: "Wasted",
    color: "hsl(var(--chart-wasted))",
  },
  partial: {
    label: "Partial",
    color: "hsl(var(--chart-partial))",
  },
  defective: {
    label: "Defective",
    color: "hsl(var(--chart-defective))",
  },
} satisfies ChartConfig

export const ResultsDisplay: React.FC<{
  parameters: DieCalculationParameters
  results: DieCalculationResults
}> = ({ parameters, results }) => {
  const totalDevices =
    results.goodDevices + results.partialDevices + results.excludedDevices
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Die Yield Results</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData(results)}
              dataKey="wafers"
              nameKey="status"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalDevices.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Dies
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Defect density {parameters.defectDensity} #/sq.cm
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Fabrication yield {results.yield}%
        </div>
      </CardFooter>
    </Card>
  )
}
