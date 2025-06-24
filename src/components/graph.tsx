// "use client"

// import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
// import type { ChartConfig } from "@/components/ui/chart"

// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import {
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useCoinStore } from "@/store/useCoinStore"
// import { useEffect, useState } from "react"

// export const description = "A line chart"




// const parseDate = (dateStr: string | undefined | null): Date => {
//   // Return current date as fallback
//   if (!dateStr) return new Date();
  
//   const parts = dateStr.split("/");
//   // Ensure we have exactly 3 parts (day, month, year)
//   if (parts.length !== 3) return new Date();
  
//   const [day, month, year] = parts.map(Number);
//   // Basic validation for date parts
//   if (isNaN(day) || isNaN(month) || isNaN(year)) return new Date();
  
//   return new Date(year, month - 1, day);
// };


// const chartConfig = {
//   desktop: {
//     label: "Desktop",
//     color: "var(--chart-1)",
//   },
// } satisfies ChartConfig

// export function ChartLineDefault({ coinId }: { coinId: string }) {
//     const {fetchthreeMonthData, loading, coinData} = useCoinStore();
//     const [timeRange, setTimeRange] = useState("90d");
//       useEffect(() => {
//         fetchthreeMonthData(coinId);
//       }, [coinId, fetchthreeMonthData]);
//       const data = coinData[coinId] || [];

//       if (loading) {
//         return <div className="h-[250px] w-full text-center">Loading...</div>;
//       }

// if (!coinData[coinId]) {
//   return <div className="h-[250px] w-full text-center">Loading...</div>;
// }


// const filteredData = data
//   .filter((item) => {
//     // Skip items with invalid dates
//     if (!item.date) return false;
    
//     try {
//       const date = parseDate(item.date);
//       const referenceDate = new Date();
//       let daysToSubtract = 90;
      
//       if (timeRange === "30d") {
//         daysToSubtract = 30;
//       } else if (timeRange === "7d") {
//         daysToSubtract = 7;
//       }
      
//       const startDate = new Date(referenceDate);
//       startDate.setDate(startDate.getDate() - daysToSubtract);
//       return date >= startDate;
//     } catch {
//       return false;
//     }
//   })
//   // Ensure data is sorted by date
//   .sort((a, b) => {
//     try {
//       return parseDate(a.date).getTime() - parseDate(b.date).getTime();
//     } catch {
//       return 0;
//     }
//   });
//   console.log("filteredData", filteredData);
    
//   return (
//     <Card>
//       <CardHeader>
//         <div className="flex items-center">
//         <CardTitle>Line Chart</CardTitle>
//             <Select value={timeRange} onValueChange={setTimeRange}>
//           <SelectTrigger
//             className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
//             aria-label="Select a value"
//           >
//             <SelectValue placeholder="Last 3 months" />
//           </SelectTrigger>
//           <SelectContent className="rounded-xl">
//             <SelectItem value="90d" className="rounded-lg">
//               Last 3 months
//             </SelectItem>
//             <SelectItem value="30d" className="rounded-lg">
//               Last 30 days
//             </SelectItem>
//             <SelectItem value="7d" className="rounded-lg">
//               Last 7 days
//             </SelectItem>
//           </SelectContent>
//         </Select>
//         </div>
//       </CardHeader>
//       <CardContent>
//         <ChartContainer config={chartConfig} className="w-full">
//           <LineChart
//             accessibilityLayer
//             data={filteredData}
//             margin={{
//               left: 12,
//               right: 12,
//             }}
//           >
//             <CartesianGrid vertical={false} />
//             {/* <XAxis
//               dataKey="date"
//               tickLine={false}
//               axisLine={false}
//               tickMargin={8}
//               tickFormatter={(value) => value.slice(0, 3)}
//             /> */}
//             <XAxis
//                 dataKey="date"
//                 tickLine={false}
//                 axisLine={false}
//                 tickMargin={8}
//                 minTickGap={32}
//                 tickFormatter={(value) => {
//                 try {
//                     const date = parseDate(value);
//                     return date.toLocaleDateString("en-US", {
//                     month: "short",
//                     day: "numeric",
//                     });
//                 } catch {
//                     return "";
//                 }
//                 }}
//             />
//             <ChartTooltip
//               cursor={false}
//               content={<ChartTooltipContent hideLabel />}
//             />
//             <Line
//               dataKey="price"
//               type="natural"
//               stroke="var(--color-desktop)"
//               strokeWidth={2}
//               dot={false}
//             />
//           </LineChart>
//         </ChartContainer>
//       </CardContent>
//       <CardFooter className="flex-col items-start gap-2 text-sm">
//       </CardFooter>
//     </Card>
//   )
// }






"use client"

import { CartesianGrid, Line, LineChart, XAxis, ResponsiveContainer } from "recharts"
import type { ChartConfig } from "@/components/ui/chart"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCoinStore } from "@/store/useCoinStore"
import { useEffect, useMemo, useState } from "react"

export const description = "A responsive line chart"

/**
 * Parses a date string in "dd/mm/yyyy" format.
 * Returns a valid Date object or null if the format is invalid.
 */
const parseDate = (dateStr: string | undefined | null): Date | null => {
  if (!dateStr) return null

  const parts = dateStr.split("/")
  if (parts.length !== 3) return null

  const [day, month, year] = parts.map(Number)
  // Basic validation for date parts
  if (isNaN(day) || isNaN(month) || isNaN(year) || day > 31 || month > 12) {
    return null
  }

  return new Date(year, month - 1, day)
}

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function ChartLineDefault({ coinId }: { coinId: string }) {
  const { fetchthreeMonthData, loading, coinData } = useCoinStore()
  const [timeRange, setTimeRange] = useState("90d")

  useEffect(() => {
    fetchthreeMonthData(coinId)
  }, [coinId, fetchthreeMonthData])

  const data = coinData[coinId] || []

  // useMemo will prevent re-calculating the filtered data on every render
  // It only re-runs if the source data or the timeRange changes.
  const filteredData = useMemo(() => {
    const now = new Date()
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }

    const startDate = new Date(now)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    startDate.setHours(0, 0, 0, 0) // Normalize to the start of the day

    return data
      .map(item => ({
        ...item,
        // Convert date string to a Date object for reliable sorting and filtering
        parsedDate: parseDate(item.date),
      }))
      .filter(item => {
        // Ensure the date is valid and within the selected time range
        return item.parsedDate && item.parsedDate >= startDate
      })
      // Ensure data is sorted by date chronologically
      .sort((a, b) => {
        // We can now safely sort since invalid dates are filtered out
        return a.parsedDate!.getTime() - b.parsedDate!.getTime()
      })
  }, [data, timeRange])

  if (loading && filteredData.length === 0) {
    return (
      <div className="flex h-[350px] w-full items-center justify-center text-center">
        Loading...
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex h-[350px] w-full items-center justify-center text-center">
        No data available.
      </div>
    )
  }

  return (
    <Card className="w-full max-w-4xl mx-auto my-4">
      <CardHeader>
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>{coinId.toLocaleUpperCase()}</CardTitle>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="w-full sm:w-[160px]"
              aria-label="Select a time range"
            >
              <SelectValue placeholder="Select range" />
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
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="h-[250px] w-full min-w-[280px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              accessibilityLayer
              data={filteredData}
              margin={{
                top: 5,
                right: 20,
                left: 10,
                bottom: 5,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={20}
                tickFormatter={(value) => {
                  const date = parseDate(value)
                  if (!date) return ""
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Line
                dataKey="price"
                type="natural"
                stroke="var(--chart-1)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {/* You can add summary data here if needed */}
      </CardFooter>
    </Card>
  )
}
