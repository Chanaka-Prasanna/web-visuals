// components/core/LineChartDisplay.tsx
"use client"; // Recharts components often need client-side rendering

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/Card"; // Adjust path
import type { LineChartDisplayProps } from "@/types"; // Adjust path

// Use primary color for the line
const LINE_COLOR = "#F97316"; // Tailwind orange-500

const LineChartDisplay: React.FC<LineChartDisplayProps> = ({
  title,
  data,
  xAxisLabel,
  yAxisLabel,
}) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            No data available for this chart.
          </p>
        </CardContent>
      </Card>
    );
  }

  // --- Prepare Data & Determine X-Axis Type ---
  let xAxisType: "number" | "category" = "category"; // Default
  const formattedData = data
    .map((item) => {
      let xValue: number | string =
        item.x instanceof Date ? item.x.getTime() : item.x; // Convert dates to timestamps for numeric axis

      // Check if all xValues are numeric (including timestamps)
      if (typeof xValue !== "number") {
        xAxisType = "category"; // If any non-numeric X found, treat axis as categorical
      } else if (xAxisType !== "category") {
        // Only keep checking if still potentially numeric
        xAxisType = "number";
      }

      return { ...item, x: xValue }; // Return data with potentially converted x value
    })
    .sort((a, b) => (a.x as number) - (b.x as number)); // IMPORTANT: Sort by X value for lines

  // --- X-Axis Formatting ---
  const xAxisTickFormatter = (tick: any): string => {
    if (xAxisType === "number" && typeof tick === "number") {
      // If it looks like a timestamp (check range if needed), format as date
      if (tick > 10000000000) {
        // Simple check for ms timestamp range
        try {
          return new Date(tick).toLocaleDateString("en-LK", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }); // Sri Lanka locale
        } catch (e) {
          return String(tick);
        } // Fallback
      }
      return tick.toLocaleString(); // Format other numbers
    }
    return String(tick); // Return as string for categorical
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={formattedData}
            margin={{
              top: 5,
              right: 30, // Increased margin for Y axis label/ticks
              left: 20, // Increased margin for potential Y axis labels
              bottom: 25, // Increased margin for X axis label/ticks
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="x"
              type={xAxisType} // Set axis type ('number' for continuous/time, 'category' for discrete)
              domain={
                xAxisType === "number" ? ["dataMin", "dataMax"] : undefined
              } // Needed for numeric axis range
              tickFormatter={xAxisTickFormatter} // Format ticks (especially dates)
              tick={{ fontSize: 10 }}
              // interval="preserveStartEnd" // Adjust interval if needed
              angle={xAxisType === "category" ? -30 : 0} // Angle only if categorical labels are long
              textAnchor={xAxisType === "category" ? "end" : "middle"}
              height={50} // Adjust height based on angle/labels
              label={{
                value: xAxisLabel,
                position: "insideBottom",
                offset: -15,
                fontSize: 12,
                fill: "#6b7280",
              }}
              scale={xAxisType === "number" ? "time" : "auto"} // Use time scale for number if they are timestamps
            />
            <YAxis
              tickFormatter={(value) => value.toLocaleString()} // Format Y-axis ticks
              tick={{ fontSize: 10 }}
              label={{
                value: yAxisLabel,
                angle: -90,
                position: "insideLeft",
                offset: -10,
                fontSize: 12,
                fill: "#6b7280",
              }}
            />
            <Tooltip
              formatter={(value: number) => `${value.toLocaleString()}`} // Format tooltip value
              labelFormatter={xAxisTickFormatter} // Format tooltip label (X value)
              cursor={{ stroke: "#cbd5e1", strokeWidth: 1 }} // Customize tooltip cursor line
            />
            <Legend verticalAlign="top" height={36} />
            <Line
              type="monotone" // Smoothed line, use "linear" for straight lines
              dataKey="y" // Key for the Y-axis value
              name={yAxisLabel || "Value"} // Name for legend/tooltip
              stroke={LINE_COLOR}
              strokeWidth={2}
              activeDot={{
                r: 6,
                fill: LINE_COLOR,
                stroke: "#fff",
                strokeWidth: 2,
              }} // Style active dot on hover
              dot={false} // Hide dots by default, show on activeDot
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default LineChartDisplay;
