// components/core/StatsDisplay.tsx
"use client"; // Keep consistent, might add interactions later

import React from "react";
import Card, { CardHeader, CardTitle, CardContent } from "../ui/Card"; // Adjust path
import type { StatsDisplayProps } from "@/types"; // Adjust path

// Helper to format numbers nicely
const formatNumber = (num: number | undefined | null): string => {
  if (num === undefined || num === null || isNaN(num)) return "N/A";
  // Simple formatting, adjust as needed (e.g., locale, precision)
  return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
};

const StatsDisplay: React.FC<StatsDisplayProps> = ({ title, stats }) => {
  if (!stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            Statistics could not be calculated.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistics: {title}</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div className="font-medium text-gray-600">Count:</div>
          <div className="text-gray-800">{formatNumber(stats.count)}</div>

          <div className="font-medium text-gray-600">Mean:</div>
          <div className="text-gray-800">{formatNumber(stats.mean)}</div>

          <div className="font-medium text-gray-600">Median:</div>
          <div className="text-gray-800">{formatNumber(stats.median)}</div>

          <div className="font-medium text-gray-600">Std Dev:</div>
          <div className="text-gray-800">{formatNumber(stats.stddev)}</div>

          <div className="font-medium text-gray-600">Min:</div>
          <div className="text-gray-800">{formatNumber(stats.min)}</div>

          <div className="font-medium text-gray-600">Max:</div>
          <div className="text-gray-800">{formatNumber(stats.max)}</div>
        </dl>
        {/* Placeholder for future histogram/boxplot */}
        {/* <div className="mt-4 border-t pt-4">
             <p className="text-xs text-gray-400">Histogram/Box Plot coming soon...</p>
         </div> */}
      </CardContent>
    </Card>
  );
};

export default StatsDisplay;
