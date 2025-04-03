// lib/parser.ts
import Papa from "papaparse";
import type { ParsedData, DataRow } from "@/types"; // Adjust path if needed

// Function to parse CSV content
const parseCsv = (csvContent: string): Promise<ParsedData> => {
  return new Promise((resolve, reject) => {
    Papa.parse<DataRow>(csvContent, {
      header: true, // Assume first row is header
      skipEmptyLines: true,
      dynamicTyping: true, // Automatically convert numbers/booleans
      complete: (results) => {
        if (results.errors.length > 0) {
          console.error("CSV Parsing Errors:", results.errors);
          // Return partial data but signal error, or reject fully?
          // For now, rejecting on first critical error found.
          return reject(
            new Error(results.errors[0].message || "Error parsing CSV")
          );
        }
        if (!results.meta.fields || results.meta.fields.length === 0) {
          return reject(
            new Error(
              "Could not parse headers from CSV. Is the file empty or format incorrect?"
            )
          );
        }
        const headers = results.meta.fields as string[];
        resolve({ headers, rows: results.data });
      },
      error: (error: any) => {
        console.error("CSV Parsing Failed:", error);
        reject(error);
      },
    });
  });
};

// Function to parse JSON content (assuming array of objects)
const parseJson = (jsonContent: string): Promise<ParsedData> => {
  return new Promise((resolve, reject) => {
    try {
      const data: unknown = JSON.parse(jsonContent);

      // Basic validation: Check if it's an array and not empty
      if (!Array.isArray(data)) {
        return reject(
          new Error("Invalid JSON format: Expected an array of objects.")
        );
      }
      if (data.length === 0) {
        // Handle empty array case - perhaps valid, return empty data?
        return resolve({ headers: [], rows: [] });
        // Or reject if empty data is not allowed:
        // return reject(new Error('JSON file is empty.'));
      }

      // Assume structure is [{ key1: val1, ... }, { key1: val2, ... }]
      // Check if all items are objects (or handle mixed types if necessary)
      if (
        !data.every(
          (item) =>
            typeof item === "object" && item !== null && !Array.isArray(item)
        )
      ) {
        return reject(
          new Error("Invalid JSON format: Expected an array of objects.")
        );
      }

      const rows = data as DataRow[]; // Type assertion

      // Extract headers from the keys of the first object
      // Assumption: all objects have similar keys. Handle variations if needed.
      const headers = Object.keys(rows[0]);
      if (headers.length === 0 && rows.length > 0) {
        return reject(
          new Error("Invalid JSON format: Objects have no keys (headers).")
        );
      }

      resolve({ headers, rows });
    } catch (error) {
      console.error("JSON Parsing Failed:", error);
      if (error instanceof SyntaxError) {
        reject(new Error(`Invalid JSON syntax: ${error.message}`));
      } else if (error instanceof Error) {
        reject(error);
      } else {
        reject(new Error("An unknown error occurred during JSON parsing."));
      }
    }
  });
};

// Main file parsing function
export const parseFileContent = async (
  fileContent: string,
  fileName: string
): Promise<ParsedData> => {
  const fileExtension = fileName.split(".").pop()?.toLowerCase();

  if (fileExtension === "csv") {
    return parseCsv(fileContent);
  } else if (fileExtension === "json") {
    return parseJson(fileContent);
  } else {
    throw new Error("Unsupported file type. Please upload a CSV or JSON file.");
  }
};
