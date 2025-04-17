"use client";
import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label, Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "green",
  },
  safari: {
    label: "Safari",
    color: "red",
  },
} satisfies ChartConfig;

// Data for the first chart
const chartData1 = [
  { browser: "chrome", visitors: 100, fill: "var(--color-chrome)" },
];

// Data for the second chart
const chartData2 = [
  { browser: "chrome", visitors: 80, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 20, fill: "var(--color-safari)" },
];

export default function QuizPage() {
  // Calculate total visitors for first chart
  const totalVisitors1 = React.useMemo(() => {
    return chartData1.reduce((acc, curr) => acc + curr.visitors, 0);
  }, []);

  // Calculate total visitors for second chart
  const totalVisitors2 = React.useMemo(() => {
    return chartData2.reduce((acc, curr) => acc + curr.visitors, 0);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gray-100">
      <div className="w-full max-w-4xl bg-white rounded-2xl p-6 shadow-md space-y-6">
        <h3 className="text-center text-lg font-medium">
          Qual dessas opções te deixa mais confortável?
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Card */}
          <Card className="flex flex-col">
            <CardContent className="flex-1 pt-6">
              <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square max-h-64"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={chartData1}
                    dataKey="visitors"
                    nameKey="browser"
                    innerRadius={20}
                    outerRadius={40}
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
                                className="fill-foreground text-sm font-bold"
                              >
                                {totalVisitors1.toLocaleString()}
                              </tspan>
                            </text>
                          );
                        }
                      }}
                    />
                  </Pie>
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Second Card */}
          <Card className="flex flex-col">
            <CardContent className="flex-1 pt-6">
              <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square max-h-64"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={chartData2}
                    dataKey="visitors"
                    nameKey="browser"
                    innerRadius={20}
                    outerRadius={40}
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
                                className="fill-foreground text-sm font-bold"
                              >
                                {totalVisitors2.toLocaleString()}
                              </tspan>
                            </text>
                          );
                        }
                      }}
                    />
                  </Pie>
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}