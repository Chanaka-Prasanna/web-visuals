// components/core/PieChartDisplay.tsx
"use client"; // Recharts components often need client-side rendering

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Card, { CardHeader, CardTitle, CardContent } from "../ui/Card"; // Adjust path
import type { PieChartDisplayProps } from "@/types"; // Adjust path

// Define shades of orange (or use a library for color generation)
const PRIMARY_COLOR = "#F97316"; // Tailwind orange-500
const COLORS = [
  PRIMARY_COLOR,
  "#FB923C", // orange-400
  "#EA580C", // orange-600
  "#FDBA74", // orange-300
  "#C2410C", // orange-700
  "#FED7AA", // orange-200
  "#9A3412", // orange-800
];

const PieChartDisplay: React.FC<PieChartDisplayProps> = ({ title, data }) => {
  if (!data || data.size === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            No data available for this category.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Convert Map to array format suitable for Recharts
  const chartData = Array.from(data.entries()).map(([name, value]) => ({
    name,
    value,
  }));

  // Sort data for potentially better legend/tooltip order (optional)
  // chartData.sort((a, b) => b.value - a.value);

  // Handle too many categories (optional: group smallest slices into "Other")
  const MAX_SLICES = 7; // Example limit
  let processedData = chartData;
  if (chartData.length > MAX_SLICES) {
    chartData.sort((a, b) => b.value - a.value); // Sort descending by value
    const topSlices = chartData.slice(0, MAX_SLICES - 1);
    const otherValue = chartData
      .slice(MAX_SLICES - 1)
      .reduce((sum, item) => sum + item.value, 0);
    processedData = [...topSlices, { name: "Other", value: otherValue }];
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Use ResponsiveContainer for chart resizing */}
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={processedData}
              cx="50%" // Center horizontally
              cy="50%" // Center vertically
              labelLine={false}
              // label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} // Example label
              outerRadius={80} // Adjust size
              fill="#8884d8" // Default fill (overridden by Cells)
              dataKey="value"
              nameKey="name"
            >
              {processedData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `${value}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default PieChartDisplay;
