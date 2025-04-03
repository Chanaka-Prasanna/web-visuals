// components/core/FileUploader.tsx
"use client"; // Required for handling user interactions and file input

import React, { useState, useCallback, useRef } from "react";
import { UploadCloud } from "lucide-react";
import Button from "../ui/Button"; // Adjust path as needed
import { parseFileContent } from "@/lib/parser"; // Adjust path
import type { FileUploaderProps, ParsedData } from "@/types"; // Adjust path

const FileUploader: React.FC<FileUploaderProps> = ({
  onFileParsed,
  acceptedFileTypes = ".csv, .json",
}) => {
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        await processFile(file);
      }
      // Reset file input to allow uploading the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [] // Keep empty dependency array if onFileParsed is stable
    // If onFileParsed might change, include it: [onFileParsed]
  );

  const processFile = async (file: File) => {
    setIsParsing(true);
    setError(null);
    setFileName(file.name);
    onFileParsed(null); // Clear previous results immediately

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const fileContent = e.target?.result as string;
        if (!fileContent) {
          throw new Error("Could not read file content.");
        }
        try {
          const parsedData: ParsedData = await parseFileContent(
            fileContent,
            file.name
          );
          onFileParsed(parsedData);
        } catch (parseError: any) {
          console.error("Parsing Error:", parseError);
          setError(parseError.message || "Failed to parse the file.");
          onFileParsed(null, parseError.message || "Failed to parse the file.");
        } finally {
          setIsParsing(false);
        }
      };
      reader.onerror = (e) => {
        console.error("FileReader Error:", e);
        setError("Failed to read the file.");
        onFileParsed(null, "Failed to read the file.");
        setIsParsing(false);
      };
      reader.readAsText(file); // Read file as text
    } catch (err: any) {
      console.error("File Processing Error:", err);
      setError(err.message || "An unexpected error occurred.");
      onFileParsed(null, err.message || "An unexpected error occurred.");
      setIsParsing(false);
    }
  };

  // Handle clicking the button/div to trigger the hidden file input
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Optional Drag and Drop Handlers
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault(); // Necessary to allow drop
    event.stopPropagation();
    // Add visual indication (e.g., change border color)
  };
  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    // Remove visual indication
    const file = event.dataTransfer.files?.[0];
    // Basic validation for file type on drop
    if (
      file &&
      acceptedFileTypes
        .split(",")
        .some((type) => file.name.toLowerCase().endsWith(type.trim()))
    ) {
      await processFile(file);
    } else if (file) {
      setError(`Invalid file type. Please upload ${acceptedFileTypes}.`);
      onFileParsed(
        null,
        `Invalid file type. Please upload ${acceptedFileTypes}.`
      );
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div
        className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:border-primary hover:bg-orange-50 transition-colors"
        onClick={handleButtonClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        // Add onDragLeave/onDragEnd handlers if you change style on dragOver
      >
        <UploadCloud className="w-12 h-12 text-gray-400 mb-3" />
        <p className="mb-2 text-sm text-gray-500">
          <span className="font-semibold text-primary">Click to upload</span> or
          drag and drop
        </p>
        <p className="text-xs text-gray-500">CSV or JSON files</p>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={acceptedFileTypes}
          className="hidden" // Hide the default input
          disabled={isParsing}
        />
      </div>

      {/* Display File Name and Status */}
      {fileName && !isParsing && !error && (
        <p className="mt-3 text-sm text-center text-green-600">
          Successfully loaded: <strong>{fileName}</strong>
        </p>
      )}
      {isParsing && (
        <p className="mt-3 text-sm text-center text-gray-600 animate-pulse">
          Parsing {fileName ? ` ${fileName}` : "file"}...
        </p>
      )}
      {error && (
        <p className="mt-3 text-sm text-center text-red-600">Error: {error}</p>
      )}

      {/* Alternative: Simple Button Uploader */}
      {/* <Button onClick={handleButtonClick} disabled={isParsing} variant="primary">
        {isParsing ? 'Parsing...' : 'Upload CSV or JSON'}
      </Button>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".csv,.json" className="hidden" />
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>} */}
    </div>
  );
};

export default FileUploader;
