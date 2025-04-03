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

// Represents the analysis results for a single column
export type ColumnAnalysis = {
  header: string;
  type: "categorical" | "numerical" | "other";
  uniqueValues?: Map<string | number, number>; // For categorical: value -> count
  stats?: {
    // For numerical
    count: number;
    min: number;
    max: number;
    mean: number;
    median: number;
    stddev: number; // Standard Deviation
  };
  // Add other potential analysis results here if needed
};

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
