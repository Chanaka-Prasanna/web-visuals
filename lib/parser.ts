// lib/parser.ts
import Papa from "papaparse";
import * as XLSX from "xlsx";
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

// Function to parse Excel (.xlsx, .xls) content
const parseExcel = (fileBuffer: ArrayBuffer): Promise<ParsedData> => {
  return new Promise((resolve, reject) => {
    try {
      const workbook = XLSX.read(fileBuffer, {
        type: "buffer",
        cellDates: true,
      }); // cellDates: true tries to parse dates

      // Assume data is in the first sheet
      const firstSheetName = workbook.SheetNames[0];
      if (!firstSheetName) {
        return reject(new Error("Excel file contains no sheets."));
      }
      const worksheet = workbook.Sheets[firstSheetName];

      // Convert sheet to JSON array of objects
      // header: 1 assumes first row is header
      // defval: null handles blank cells more gracefully than empty strings sometimes
      const jsonData = XLSX.utils.sheet_to_json<DataRow>(worksheet, {
        header: 1,
        defval: null,
      });

      if (!jsonData || jsonData.length === 0) {
        return reject(new Error("Excel sheet appears to be empty."));
      }

      // Extract headers from the first row
      const headers = jsonData[0] as string[];
      // Remove the header row from data
      const rows = jsonData.slice(1).map((rowArray: any) => {
        const rowObject: DataRow = {};
        headers.forEach((header, index) => {
          // Handle potential date objects correctly if cellDates was true
          let value = rowArray[index];
          if (value instanceof Date) {
            // Optionally format dates here, or keep as Date objects
            // value = value.toISOString().split('T')[0]; // Example: format as YYYY-MM-DD string
          }
          rowObject[header] = value;
        });
        return rowObject;
      });

      // Basic validation on headers
      if (
        !headers ||
        headers.length === 0 ||
        headers.every((h) => h === null || h === "")
      ) {
        return reject(
          new Error(
            "Could not parse headers from the Excel sheet. Check the first row."
          )
        );
      }

      resolve({ headers, rows });
    } catch (error: any) {
      console.error("Excel Parsing Failed:", error);
      reject(
        new Error(
          `Failed to parse Excel file: ${error.message || "Unknown error"}`
        )
      );
    }
  });
};

// Main file parsing function
export const parseFileContent = async (
  fileContent: string | ArrayBuffer, // Can now be string (CSV/JSON) or ArrayBuffer (Excel)
  fileName: string
): Promise<ParsedData> => {
  const fileExtension = fileName.split(".").pop()?.toLowerCase();

  if (fileExtension === "csv" && typeof fileContent === "string") {
    return parseCsv(fileContent);
  } else if (fileExtension === "json" && typeof fileContent === "string") {
    return parseJson(fileContent);
  } else if (
    (fileExtension === "xlsx" || fileExtension === "xls") &&
    fileContent instanceof ArrayBuffer
  ) {
    return parseExcel(fileContent); // Use the new Excel parser
  } else {
    throw new Error(
      "Unsupported file type or content format mismatch. Please upload CSV, JSON, or Excel files."
    );
  }
};
