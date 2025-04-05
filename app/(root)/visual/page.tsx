// app/visual/page.tsx
"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Menu } from "lucide-react";

import FileUploader from "@/components/core/FileUploader";
import DashboardSidebar from "@/components/core/DashboardSidebar";
import DataPreviewTable from "@/components/core/DataPreviewTable";
import PieChartDisplay from "@/components/core/PieChartDisplay";
import StatsDisplay from "@/components/core/StatsDisplay";
import BarChartDisplay from "@/components/core/BarChartDisplay";
import LineChartDisplay from "@/components/core/LineChartDisplay";
import { analyzeData, generateChartSuggestions } from "@/lib/analyzer";
import type {
  ParsedData,
  AnalysisResult,
  ChartSuggestion,
  ColumnAnalysis,
} from "@/types";

type DashboardSection =
  | "overview"
  | "charts"
  | "analysis"
  | "cleaning"
  | "pivot";

export default function VisualPage() {
  // Data and Analysis State
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [chartSuggestions, setChartSuggestions] = useState<ChartSuggestion[]>(
    []
  );

  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [activeSection, setActiveSection] =
    useState<DashboardSection>("overview");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false); // State for mobile sidebar

  const handleFileParsed = useCallback(
    (data: ParsedData | null, parseError?: string) => {
      // ... reset logic ...
      setError(null);
      setAnalysisResult(null);
      setParsedData(null);
      setChartSuggestions([]);
      setIsDataLoaded(false);
      setActiveSection("overview");
      setIsMobileSidebarOpen(false); // Close sidebar on new upload

      if (parseError) {
        setError(`Parsing Error: ${parseError}`);
        setIsLoading(false);
        return;
      }
      if (data && data.rows.length > 0 && data.headers.length > 0) {
        setIsLoading(true);
        setParsedData(data);
        setTimeout(() => {
          /* ... analysis logic ... */
          // Inside analysis success:
          const results = analyzeData(data);
          setAnalysisResult(results);
          const suggestions = generateChartSuggestions(results);
          setChartSuggestions(suggestions);
          setIsDataLoaded(true); // Enable Dashboard View
          setIsLoading(false);
        }, 10);
      } else if (data) {
        setError("Parsed file appears to be empty or lacks headers.");
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    },
    []
  );

  // --- Helper Function to Render Suggested Chart (Keep as is) ---
  const renderSuggestedChart = (suggestion: ChartSuggestion) => {
    // ... (previous implementation remains the same) ...
    if (!analysisResult || !parsedData) return null;

    const requiredAnalysis = suggestion.requiredColumns.map(
      (reqCol) => analysisResult[reqCol.header]
    );
    if (requiredAnalysis.some((col) => !col)) return null;

    try {
      switch (suggestion.type) {
        case "Pie":
          const pieCol = requiredAnalysis[0];
          if (pieCol.type === "categorical" && pieCol.uniqueValues) {
            return (
              <PieChartDisplay
                key={suggestion.title}
                title={suggestion.title}
                data={pieCol.uniqueValues}
              />
            );
          }
          break;
        case "Bar":
          const barCol = requiredAnalysis[0];
          if (barCol.type === "categorical" && barCol.uniqueValues) {
            const barData = Array.from(barCol.uniqueValues.entries())
              .map(([name, value]) => ({ name, value }))
              .sort((a, b) => b.value - a.value);
            return (
              <BarChartDisplay
                key={suggestion.title}
                title={suggestion.title}
                data={barData}
                yAxisLabel="Count"
                xAxisLabel={barCol.header}
              />
            );
          }
          break;
        case "Line":
          const dateCol = requiredAnalysis.find((c) => c.type === "date");
          const numCol = requiredAnalysis.find((c) => c.type === "numerical");
          if (dateCol && numCol && parsedData.rows) {
            const lineData: { x: string | number | Date; y: number }[] =
              parsedData.rows
                .map((row) => ({
                  x:
                    row[dateCol.header] instanceof Date
                      ? row[dateCol.header]
                      : new Date(String(row[dateCol.header])),
                  y: Number(row[numCol.header]),
                }))
                .filter((item) => !isNaN(item.x.getTime()) && !isNaN(item.y));
            return (
              <LineChartDisplay
                key={suggestion.title}
                title={suggestion.title}
                data={lineData}
                xAxisLabel={dateCol.header}
                yAxisLabel={numCol.header}
              />
            );
          }
          break;
        case "StatsTable":
          const statsCol = requiredAnalysis[0];
          if (statsCol.type === "numerical" && statsCol.stats) {
            return (
              <StatsDisplay
                key={suggestion.title}
                title={statsCol.header}
                stats={statsCol.stats}
              />
            );
          }
          if (statsCol.type === "date" && statsCol.stats) {
            const dateStats = {
              count: statsCol.stats.count,
              min: statsCol.stats.min,
              max: statsCol.stats.max,
              mean: NaN,
              median: NaN,
              stddev: NaN,
            };
            return (
              <StatsDisplay
                key={suggestion.title}
                title={`${statsCol.header} (Date Range)`}
                stats={dateStats}
              />
            );
          }
          break;
        default:
          return null;
      }
    } catch (error) {
      console.error(
        "Error rendering suggested chart:",
        suggestion.title,
        error
      );
      return (
        <div
          key={suggestion.title}
          className="text-red-500 text-xs p-2 border rounded border-red-200"
        >
          Error rendering chart: {suggestion.title}
        </div>
      );
    }
    return null;
  };

  // --- Main Render Logic ---
  return (
    <div className="flex flex-col min-h-[calc(100vh-128px)] bg-gray-100">
      {" "}
      {/* Slightly off-white background */}
      {/* Conditional Rendering: Uploader or Dashboard */}
      {!isDataLoaded ? (
        // ==== UPLOADER VIEW ====
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center justify-center flex-grow bg-white rounded-lg shadow-sm my-4">
          {" "}
          {/* Added bg/shadow */}
          <h1 className="text-3xl font-bold mb-6 text-center">
            Upload Your Data
          </h1>
          <FileUploader
            onFileParsed={handleFileParsed}
            acceptedFileTypes=".csv, .json, .xlsx, .xls"
          />
          {isLoading && (
            <p className="text-center mt-4 text-gray-600 animate-pulse">
              Loading & Analyzing...
            </p>
          )}
          {error && (
            <p className="text-center mt-4 text-red-600 bg-red-100 border border-red-400 rounded p-3 max-w-lg">
              {error}
            </p>
          )}
        </div>
      ) : (
        // ==== DASHBOARD VIEW ====
        <div className="flex flex-1 overflow-hidden relative">
          {" "}
          {/* Added relative positioning for mobile button */}
          {/* Sidebar Component */}
          <DashboardSidebar
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            isOpenOnMobile={isMobileSidebarOpen}
            setIsOpenOnMobile={setIsMobileSidebarOpen}
          />
          {/* Main Content Area */}
          <main
            className={`flex-1 p-4 sm:p-6 overflow-y-auto bg-white transition-all duration-300 ease-in-out ${
              isMobileSidebarOpen ? "md:ml-64" : ""
            }`}
          >
            {" "}
            {/* Adjust margin-left based on desktop sidebar width */}
            {/* Mobile Header Bar */}
            <div className="md:hidden flex items-center justify-between mb-4 pb-2 border-b">
              {/* Hamburger Button to open Sidebar */}
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="p-2 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Open sidebar"
              >
                <Menu className="h-6 w-6 text-gray-700" />
              </button>
              {/* Display current section title */}
              <h2 className="text-lg font-semibold capitalize">
                {activeSection}
              </h2>
              {/* Placeholder for potential actions */}
              <div></div>
            </div>
            {isLoading && (
              <p className="text-center text-gray-600 animate-pulse">
                Updating...
              </p>
            )}
            {error && (
              <p className="text-center text-red-600 bg-red-100 border border-red-400 rounded p-3 mb-4">
                {error}
              </p>
            )}
            {/* Render content based on activeSection */}
            {/* Wrapped content in divs for consistent spacing/structure */}
            <div
              className={`${activeSection === "overview" ? "block" : "hidden"}`}
            >
              <h2 className="text-2xl font-semibold mb-4 hidden md:block">
                Data Overview & Preview
              </h2>
              {parsedData && <DataPreviewTable data={parsedData} />}
            </div>
            <div
              className={`${activeSection === "charts" ? "block" : "hidden"}`}
            >
              <h2 className="text-2xl font-semibold mb-4 hidden md:block">
                Charts
              </h2>
              {chartSuggestions.length > 0 ? (
                <>
                  <p className="text-sm text-gray-600 mb-4">
                    Showing suggested visualizations based on data analysis:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-6">
                    {" "}
                    {/* Reduced XL columns */}
                    {chartSuggestions.map((suggestion) =>
                      renderSuggestedChart(suggestion)
                    )}
                  </div>
                </>
              ) : (
                <p className="text-gray-500">
                  No specific chart suggestions generated.
                </p>
              )}
            </div>
            {/* Placeholder sections */}
            <div
              className={`${activeSection === "analysis" ? "block" : "hidden"}`}
            >
              <h2 className="text-2xl font-semibold mb-4 hidden md:block">
                Analyze Data
              </h2>
              <p className="text-gray-500">
                Smart insights generation coming soon!
              </p>
            </div>
            <div
              className={`${activeSection === "cleaning" ? "block" : "hidden"}`}
            >
              <h2 className="text-2xl font-semibold mb-4 hidden md:block">
                Data Cleaning Tools
              </h2>
              <p className="text-gray-500">
                Tools for handling null values, duplicates, etc. coming soon!
              </p>
            </div>
            <div
              className={`${activeSection === "pivot" ? "block" : "hidden"}`}
            >
              <h2 className="text-2xl font-semibold mb-4 hidden md:block">
                Pivot Table
              </h2>
              <p className="text-gray-500">
                Functionality to group data coming soon!
              </p>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}
