// components/core/BarChartDisplay.tsx
"use client"; // Recharts components often need client-side rendering

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/Card"; // Adjust path
import type { BarChartDisplayProps } from "@/types"; // Adjust path

// Use primary color for bars
const BAR_COLOR = "#F97316"; // Tailwind orange-500

const BarChartDisplay: React.FC<BarChartDisplayProps> = ({
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

  // Sort data for potentially better axis order (optional, depends on data type)
  // Example: sort by value descending for categorical counts
  // const sortedData = [...data].sort((a, b) => b.value - a.value);
  const sortedData = data; // Use original order for now

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={sortedData}
            margin={{
              top: 5,
              right: 20, // Adjusted margin for Y-axis labels
              left: 10, // Adjusted margin for potential long X-axis labels
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="name" // Key for the category label on X-axis
              tick={{ fontSize: 10 }} // Smaller font size for ticks
              interval={0} // Show all ticks by default - adjust if too crowded
              angle={-30} // Angle ticks if labels are long
              textAnchor="end" // Adjust anchor for angled ticks
              height={50} // Increase height to accommodate angled labels
              label={{
                value: xAxisLabel,
                position: "insideBottom",
                offset: -5,
                fontSize: 12,
                fill: "#6b7280",
              }} // Optional X axis label
            />
            <YAxis
              tick={{ fontSize: 10 }}
              label={{
                value: yAxisLabel,
                angle: -90,
                position: "insideLeft",
                fontSize: 12,
                fill: "#6b7280",
              }} // Optional Y axis label
            />
            <Tooltip
              cursor={{ fill: "#f3f4f6" }} // Lighter gray on hover
              formatter={(value: number) => `${value.toLocaleString()}`} // Format tooltip value
            />
            {/* <Legend /> // Often not needed for single-series bar charts */}
            <Bar
              dataKey="value"
              fill={BAR_COLOR}
              name={yAxisLabel || "Count"}
            />{" "}
            // Use yAxisLabel or default for legend/tooltip name
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default BarChartDisplay;
