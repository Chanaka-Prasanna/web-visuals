// lib/analyzer.ts
import type {
  ParsedData,
  DataRow,
  ColumnAnalysis,
  AnalysisResult,
  ColumnDataType,
  ChartSuggestion,
} from "@/types";

// --- Helper Functions ---
const isNumeric = (value: any): boolean => {
  /* ... (keep existing) ... */
};
const calculateNumericStats = (values: number[]) => {
  /* ... (keep existing, maybe add Q1, Q3 later) ... */
};

// Add a helper to check for potential Date types
const isLikelyDate = (value: any): boolean => {
  if (value instanceof Date && !isNaN(value.getTime())) {
    return true;
  }
  if (typeof value === "string") {
    // Basic check for common formats (YYYY-MM-DD, MM/DD/YYYY, ISO strings etc.)
    // More robust date parsing might be needed (e.g., using date-fns or dayjs)
    if (
      /^\d{4}-\d{2}-\d{2}/.test(value) ||
      /^\d{1,2}\/\d{1,2}\/\d{4}/.test(value)
    ) {
      // Try parsing to double-check
      const parsed = Date.parse(value);
      return !isNaN(parsed);
    }
    // Check for ISO 8601 format
    if (
      /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(\.\d+)?([+-][0-2]\d:[0-5]\d|Z)?/.test(
        value
      )
    ) {
      const parsed = Date.parse(value);
      return !isNaN(parsed);
    }
  }
  // Check if it's a plausible timestamp (e.g., seconds or milliseconds since epoch)
  if (
    typeof value === "number" &&
    value > 1000000000 &&
    value < 3000000000000
  ) {
    // Plausible range for sec/ms timestamps
    // This is ambiguous, could be a large ID. Need more context. Avoid classifying purely numeric as date.
  }
  return false;
};

// --- Main Analysis Function (Updated) ---
export const analyzeData = (parsedData: ParsedData): AnalysisResult => {
  const { headers, rows } = parsedData;
  const analysisResult: AnalysisResult = {};
  const totalRows = rows.length;

  if (!headers || headers.length === 0 || totalRows === 0) {
    return analysisResult;
  }

  headers.forEach((header) => {
    let nonMissingValues: (string | number | Date | null | undefined)[] = [];
    let numericValues: number[] = [];
    let dateValues: Date[] = []; // Store potential date objects
    let isPotentiallyNumeric = true;
    let isPotentiallyDate = true;

    // First pass: Collect non-missing values and check potential types
    for (const row of rows) {
      const value = row[header];
      if (
        value !== null &&
        value !== undefined &&
        String(value).trim() !== ""
      ) {
        nonMissingValues.push(value);
        if (!isNumeric(value)) isPotentiallyNumeric = false;
        if (!isLikelyDate(value)) isPotentiallyDate = false;
        // Keep collecting values even if type potential drops
        if (isNumeric(value)) numericValues.push(Number(value));
        if (value instanceof Date)
          dateValues.push(value); // Collect actual Date objects from Excel/JSON
        else if (isLikelyDate(value) && typeof value === "string") {
          // Try parsing likely date strings into Date objects
          const parsedDate = new Date(value);
          if (!isNaN(parsedDate.getTime())) dateValues.push(parsedDate);
        }
      }
    }

    const missingCount = totalRows - nonMissingValues.length;

    // --- Determine Column Type ---
    let columnType: ColumnDataType = "other"; // Default

    // Priority: Date > Numerical > Categorical
    // Heuristic: If a good portion of non-missing values are dates
    if (
      dateValues.length / nonMissingValues.length > 0.7 &&
      dateValues.length > 1
    ) {
      // Threshold for date detection
      columnType = "date";
    } else if (isPotentiallyNumeric && numericValues.length > 0) {
      columnType = "numerical";
    } else if (nonMissingValues.length > 0) {
      columnType = "categorical";
    }

    // --- Perform Analysis Based on Determined Type ---
    const baseAnalysis = { header, totalCount: totalRows, missingCount };

    if (columnType === "numerical") {
      const stats = calculateNumericStats(numericValues);
      analysisResult[header] = { ...baseAnalysis, type: "numerical", stats };
    } else if (columnType === "date") {
      // Basic date analysis (range, maybe timescale) - can be expanded
      dateValues.sort((a, b) => a.getTime() - b.getTime());
      const minDate = dateValues[0];
      const maxDate = dateValues[dateValues.length - 1];
      // Simple stats - count is non-missing dates
      const stats = {
        count: dateValues.length,
        min: minDate.getTime(),
        max: maxDate.getTime(),
        mean: NaN,
        median: NaN,
        stddev: NaN,
      }; // Use getTime() for numeric stats
      analysisResult[header] = {
        ...baseAnalysis,
        type: "date",
        stats,
        isLikelyTimeSeries: true,
      }; // Assume time series for now
      // TODO: Add timescale detection logic (years, months, days)
    } else if (columnType === "categorical") {
      const uniqueValues = new Map<string | number, number>();
      nonMissingValues.forEach((value) => {
        const key = typeof value === "number" ? value : String(value);
        uniqueValues.set(key, (uniqueValues.get(key) || 0) + 1);
      });
      analysisResult[header] = {
        ...baseAnalysis,
        type: "categorical",
        uniqueValues,
      };
    } else {
      analysisResult[header] = { ...baseAnalysis, type: "other" };
    }
  });

  return analysisResult;
};

// --- NEW: Chart Suggestion Logic ---
export const generateChartSuggestions = (
  analysisResult: AnalysisResult
): ChartSuggestion[] => {
  const suggestions: ChartSuggestion[] = [];
  const columns = Object.values(analysisResult);

  // Simple suggestion rules (can be made much more complex)

  // 1. Single Categorical Column (Low Cardinality) -> Pie Chart
  columns.forEach((col) => {
    if (
      col.type === "categorical" &&
      col.uniqueValues &&
      col.uniqueValues.size > 1 &&
      col.uniqueValues.size <= 10
    ) {
      // Limit cardinality for pie
      suggestions.push({
        type: "Pie",
        title: `Distribution of ${col.header}`,
        description: `Shows proportions for each category in '${col.header}'.`,
        requiredColumns: [{ header: col.header, type: col.type }],
        score: 0.8,
      });
    }
  });

  // 2. Single Categorical Column -> Bar Chart (Good for higher cardinality too)
  columns.forEach((col) => {
    if (
      col.type === "categorical" &&
      col.uniqueValues &&
      col.uniqueValues.size > 1
    ) {
      suggestions.push({
        type: "Bar",
        title: `Counts per category in ${col.header}`,
        description: `Compares counts across different categories in '${col.header}'.`,
        requiredColumns: [{ header: col.header, type: col.type }],
        score: 0.9, // Generally useful
      });
    }
  });

  // 3. Single Numerical Column -> Histogram (Distribution) / Stats Table
  columns.forEach((col) => {
    if (col.type === "numerical" && col.stats && col.stats.count > 1) {
      suggestions.push({
        type: "StatsTable", // Use the StatsDisplay component
        title: `Statistics for ${col.header}`,
        description: `Key summary statistics for the numerical column '${col.header}'.`,
        requiredColumns: [{ header: col.header, type: col.type }],
        score: 0.95, // Always useful
      });
      suggestions.push({
        type: "Histogram",
        title: `Distribution of ${col.header}`,
        description: `Shows the frequency distribution of values in '${col.header}'.`,
        requiredColumns: [{ header: col.header, type: col.type }],
        score: 0.7, // Requires implementation
      });
      // Add BoxPlot suggestion later
    }
  });

  // 4. Date/Time Column vs Numerical Column -> Line Chart (Trend)
  const dateColumns = columns.filter((c) => c.type === "date");
  const numericColumns = columns.filter((c) => c.type === "numerical");
  if (dateColumns.length > 0 && numericColumns.length > 0) {
    // Suggest for the first pair found (can iterate all pairs)
    const dateCol = dateColumns[0];
    const numCol = numericColumns[0];
    suggestions.push({
      type: "Line",
      title: `Trend of ${numCol.header} over ${dateCol.header}`,
      description: `Shows how '${numCol.header}' changes over time based on '${dateCol.header}'.`,
      requiredColumns: [
        { header: dateCol.header, type: dateCol.type },
        { header: numCol.header, type: numCol.type },
      ],
      score: 0.85,
    });
  }

  // Add rules for Scatter (2 numeric), Heatmap (2 categorical or correlation matrix), etc. later

  // Sort suggestions by score (highest first)
  suggestions.sort((a, b) => b.score - a.score);

  return suggestions;
};
