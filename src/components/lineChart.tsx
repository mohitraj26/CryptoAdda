"use client";

import * as React from "react";
import { useEffect } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import type { ChartConfig } from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCoinStore } from "../store/useCoinStore";


export const description = "An interactive area chart";

const chartConfig = {
  price: {
    label: "Price",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

// Updated parseDate function with proper type checking
const parseDate = (dateStr: string | undefined | null): Date => {
  // Return current date as fallback
  if (!dateStr) return new Date();
  
  const parts = dateStr.split("/");
  // Ensure we have exactly 3 parts (day, month, year)
  if (parts.length !== 3) return new Date();
  
  const [day, month, year] = parts.map(Number);
  // Basic validation for date parts
  if (isNaN(day) || isNaN(month) || isNaN(year)) return new Date();
  
  return new Date(year, month - 1, day);
};

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: any[];
  label?: string;
}) => {
  if (!active || !payload || payload.length === 0 || !label) {
    return null;
  }

  try {
    const formattedDate = parseDate(label).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const formattedValue = `$${payload[0].value.toLocaleString()}`;

    return (
      <div className="rounded-md border bg-background p-2 shadow-sm">
        <div className="text-sm text-muted-foreground">{formattedDate}</div>
        <div className="font-semibold">{formattedValue}</div>
      </div>
    );
  } catch (error) {
    console.error("Error rendering tooltip:", error);
    return null;
  }
};

export function ChartAreaInteractive({ coinId }: { coinId: string }) {
  const [timeRange, setTimeRange] = React.useState("90d");
  const { coinData, fetchthreeMonthData } = useCoinStore();

  useEffect(() => {
    fetchthreeMonthData(coinId);
  }, [coinId, fetchthreeMonthData]);
  const data = coinData[coinId] || [];
  console.log("Three month data:", coinData);

const filteredData = data
  .filter((item) => {
    // Skip items with invalid dates
    if (!item.date) return false;
    
    try {
      const date = parseDate(item.date);
      const referenceDate = new Date();
      let daysToSubtract = 90;
      
      if (timeRange === "30d") {
        daysToSubtract = 30;
      } else if (timeRange === "7d") {
        daysToSubtract = 7;
      }
      
      const startDate = new Date(referenceDate);
      startDate.setDate(startDate.getDate() - daysToSubtract);
      return date >= startDate;
    } catch {
      return false;
    }
  })
  // Ensure data is sorted by date
  .sort((a, b) => {
    try {
      return parseDate(a.date).getTime() - parseDate(b.date).getTime();
    } catch {
      return 0;
    }
  });


  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle> {coinId.toUpperCase()}</CardTitle>
          <CardDescription>
            Showing price data for the selected period
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillPrice" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-price)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-price)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <YAxis
              domain={["dataMin", "dataMax"]}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                try {
                  const date = parseDate(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                } catch {
                  return "";
                }
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              dataKey="price"
              type="natural"
              fill="url(#fillPrice)"
              stroke="var(--color-price)"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
