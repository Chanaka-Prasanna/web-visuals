// lib/analyzer.ts
import type {
  ParsedData,
  DataRow,
  ColumnAnalysis,
  AnalysisResult,
} from "@/types"; // Adjust path

// Helper to check if a value looks numeric
const isNumeric = (value: any): boolean => {
  // Allow numbers, or strings that can be cleanly converted to finite numbers
  if (typeof value === "number" && isFinite(value)) return true;
  if (typeof value !== "string") return false;
  if (value.trim() === "") return false; // Don't count empty strings as numeric
  const num = Number(value);
  return !isNaN(num) && isFinite(num);
};

// Helper to calculate basic statistics
const calculateNumericStats = (values: number[]) => {
  const count = values.length;
  if (count === 0)
    return {
      count: 0,
      min: NaN,
      max: NaN,
      mean: NaN,
      median: NaN,
      stddev: NaN,
    };

  const sum = values.reduce((acc, val) => acc + val, 0);
  const mean = sum / count;
  const sortedValues = [...values].sort((a, b) => a - b);
  const min = sortedValues[0];
  const max = sortedValues[count - 1];

  let median;
  const mid = Math.floor(count / 2);
  if (count % 2 === 0) {
    median = (sortedValues[mid - 1] + sortedValues[mid]) / 2;
  } else {
    median = sortedValues[mid];
  }

  const variance =
    values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / count;
  const stddev = Math.sqrt(variance);

  return { count, min, max, mean, median, stddev };
};

// Main analysis function
export const analyzeData = (parsedData: ParsedData): AnalysisResult => {
  const { headers, rows } = parsedData;
  const analysisResult: AnalysisResult = {};

  if (!headers || headers.length === 0 || rows.length === 0) {
    return analysisResult; // Return empty analysis for empty data
  }

  headers.forEach((header) => {
    const columnValues = rows
      .map((row) => row[header])
      .filter((value) => value !== null && value !== undefined && value !== ""); // Filter out empty/null values

    if (columnValues.length === 0) {
      analysisResult[header] = { header, type: "other" }; // Column is empty
      return;
    }

    // --- Type Detection Heuristic ---
    // Check if a significant portion (e.g., > 80%) of the first N (e.g., 100) values are numeric
    const sampleSize = Math.min(columnValues.length, 100);
    const numericSampleCount = columnValues
      .slice(0, sampleSize)
      .filter(isNumeric).length;
    const numericThreshold = 0.8; // 80% threshold

    let columnType: ColumnAnalysis["type"] = "categorical"; // Default to categorical

    if (numericSampleCount / sampleSize >= numericThreshold) {
      // Further check: ensure *all* values can be treated as numbers if we decide it's numeric
      const allNumericValues = columnValues.filter(isNumeric).map(Number);
      if (allNumericValues.length === columnValues.length) {
        // If ALL values are numeric
        columnType = "numerical";
      } // else, mixed types, treat as categorical for simplicity now
    }

    // --- Perform Analysis Based on Type ---
    if (columnType === "numerical") {
      const numericValues = columnValues.map(Number); // We know they are convertible
      const stats = calculateNumericStats(numericValues);
      analysisResult[header] = { header, type: "numerical", stats };
    } else {
      // Treat as Categorical (or 'other' if type detection failed)
      const uniqueValues = new Map<string | number, number>();
      columnValues.forEach((value) => {
        const key = typeof value === "number" ? value : String(value); // Ensure keys are consistent
        uniqueValues.set(key, (uniqueValues.get(key) || 0) + 1);
      });
      analysisResult[header] = { header, type: "categorical", uniqueValues };
    }
  });

  return analysisResult;
};
