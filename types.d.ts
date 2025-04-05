// types.d.ts

// Represents a single row of parsed data, where keys are column headers
export type DataRow = {
  [key: string]: string | number | null | undefined;
};

// Represents the result of parsing (data + headers)
export interface ParsedData {
  headers: string[];
  rows: DataRow[];
}

export type ColumnDataType = "numerical" | "categorical" | "date" | "other";

// Represents the analysis results for a single column
export type ColumnAnalysis = {
  header: string;
  // type: 'categorical' | 'numerical' | 'other'; // Old
  type: ColumnDataType; // New, more specific type
  totalCount: number; // Total rows for this column
  missingCount: number; // How many null/undefined/empty
  uniqueValues?: Map<string | number, number>; // For categorical
  stats?: {
    // For numerical
    count: number; // Non-missing count
    min: number;
    max: number;
    mean: number;
    median: number;
    stddev: number;
    q1?: number; // Quartile 1 (for box plots later)
    q3?: number; // Quartile 3 (for box plots later)
  };
  // Add time series info if 'date' type detected
  isLikelyTimeSeries?: boolean;
  timeScale?: "years" | "months" | "days" | "hours"; // Example
};

// Suggestion for a chart type
export type ChartSuggestion = {
  type:
    | "Pie"
    | "Bar"
    | "Line"
    | "Histogram"
    | "BoxPlot"
    | "Scatter"
    | "Heatmap"
    | "StatsTable"
    | "PivotTable"; // Extend as needed
  title: string;
  description: string; // Why this chart is suggested
  requiredColumns: { header: string; type: ColumnDataType }[]; // Columns needed
  score: number; // How relevant is this suggestion (0-1)
};

// Props for Data Preview Table
export interface DataPreviewTableProps {
  data: ParsedData;
}

// Map from column header to its analysis result
export type AnalysisResult = {
  [key: string]: ColumnAnalysis;
};

// Props for Pie Chart display component
export interface PieChartDisplayProps {
  title: string;
  data: Map<string | number, number>; // Map of labels to values
}

// Props for Stats display component
export interface StatsDisplayProps {
  title: string;
  stats: {
    count: number;
    min: number;
    max: number;
    mean: number;
    median: number;
    stddev: number;
  };
}

// Props for Column Selector component
export interface ColumnSelectorProps {
  columns: string[]; // Array of column headers
  selectedColumns: Set<string>; // Set of currently selected headers
  onSelectionChange: (header: string, isSelected: boolean) => void;
}

// Props for File Uploader component
export interface FileUploaderProps {
  onFileParsed: (data: ParsedData | null, error?: string) => void; // Callback with parsed data or error
  acceptedFileTypes?: string; // e.g., ".csv, .json"
}

// Props for Chart Display Components (Could be unified later)
export interface BarChartDisplayProps {
  title: string;
  data: { name: string | number; value: number }[]; // Label -> Value
  xAxisLabel?: string;
  yAxisLabel?: string;
}

export interface LineChartDisplayProps {
  title: string;
  data: { x: string | number | Date; y: number }[]; // X-axis value -> Y-axis value
  xAxisLabel?: string;
  yAxisLabel?: string;
}
