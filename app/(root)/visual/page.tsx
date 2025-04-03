// app/visual/page.tsx
"use client";

import React, { useState, useCallback } from "react";
import FileUploader from "@/components/core/FileUploader"; // Adjust path
import ColumnSelector from "@/components/core/ColumnSelector"; // Adjust path
import PieChartDisplay from "@/components/core/PieChartDisplay"; // Adjust path
import StatsDisplay from "@/components/core/StatsDisplay"; // Adjust path
import { analyzeData } from "@/lib/analyzer"; // Adjust path
import type { ParsedData, AnalysisResult, ColumnAnalysis } from "@/types"; // Adjust path

export default function VisualPage() {
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [selectedColumns, setSelectedColumns] = useState<Set<string>>(
    new Set()
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileParsed = useCallback(
    (data: ParsedData | null, parseError?: string) => {
      setError(null); // Clear previous errors
      setAnalysisResult(null); // Clear previous analysis
      setSelectedColumns(new Set()); // Clear selections
      setParsedData(data); // Store raw parsed data (optional, maybe not needed long term)

      if (parseError) {
        setError(`Parsing Error: ${parseError}`);
        setIsLoading(false);
        return;
      }

      if (data && data.rows.length > 0 && data.headers.length > 0) {
        setIsLoading(true); // Start analysis loading state
        try {
          // Perform analysis (could be wrapped in a promise/worker for large datasets)
          const results = analyzeData(data);
          setAnalysisResult(results);
          // Automatically select all columns initially
          setSelectedColumns(new Set(data.headers));
        } catch (analyzeError: any) {
          console.error("Analysis Error:", analyzeError);
          setError(
            `Analysis Error: ${
              analyzeError.message || "Failed to analyze data"
            }`
          );
          setAnalysisResult(null); // Ensure analysis is cleared on error
        } finally {
          setIsLoading(false); // End loading state
        }
      } else if (data) {
        // Handle case where file is parsed but has no rows/headers
        setError("Parsed file appears to be empty or lacks headers.");
        setIsLoading(false);
      }
      // If data is null and no parseError, it means clearing the uploader
      if (!data && !parseError) {
        setIsLoading(false);
      }
    },
    []
  ); // Dependencies: ensure analyzeData is pure or add if needed

  const handleColumnSelectionChange = useCallback(
    (header: string, isSelected: boolean) => {
      setSelectedColumns((prevSelected) => {
        const newSelected = new Set(prevSelected);
        if (isSelected) {
          newSelected.add(header);
        } else {
          newSelected.delete(header);
        }
        return newSelected;
      });
    },
    []
  );

  // Get the details for the columns that are currently selected
  const selectedAnalysis: ColumnAnalysis[] = analysisResult
    ? Object.entries(analysisResult)
        .filter(([header]) => selectedColumns.has(header))
        .map(([, analysis]) => analysis)
    : [];

  return (
    <main className="container min-h-[calc(100vh-140px)] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Visualize Your Data
      </h1>

      {/* File Uploader */}
      <FileUploader
        onFileParsed={handleFileParsed}
        acceptedFileTypes=".csv, .json"
      />

      {/* Loading Indicator */}
      {isLoading && (
        <p className="text-center mt-4 text-gray-600 animate-pulse">
          Analyzing data...
        </p>
      )}

      {/* Error Display */}
      {error && (
        <p className="text-center mt-4 text-red-600 bg-red-100 border border-red-400 rounded p-3">
          {error}
        </p>
      )}

      {/* Column Selector - Only show if analysis is complete */}
      {analysisResult && !isLoading && !error && (
        <div className="mt-8">
          <ColumnSelector
            columns={Object.keys(analysisResult)}
            selectedColumns={selectedColumns}
            onSelectionChange={handleColumnSelectionChange}
          />
        </div>
      )}

      {/* Visualization Area - Grid */}
      {selectedAnalysis.length > 0 && !isLoading && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedAnalysis.map((analysis) => (
            <div key={analysis.header}>
              {analysis.type === "categorical" && analysis.uniqueValues && (
                <PieChartDisplay
                  title={analysis.header}
                  data={analysis.uniqueValues}
                />
              )}
              {analysis.type === "numerical" && analysis.stats && (
                <StatsDisplay title={analysis.header} stats={analysis.stats} />
              )}
              {/* Add placeholders or handling for 'other' type if needed */}
              {analysis.type === "other" && (
                <div className="p-4 border rounded bg-gray-50 text-sm text-gray-500">
                  Column "{analysis.header}" has an undetermined type or is
                  empty.
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Placeholder if data is loaded but no columns are selected */}
      {analysisResult &&
        selectedAnalysis.length === 0 &&
        !isLoading &&
        !error && (
          <p className="text-center mt-8 text-gray-500">
            Select columns above to generate visualizations.
          </p>
        )}
    </main>
  );
}
