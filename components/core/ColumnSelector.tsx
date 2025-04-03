// components/core/ColumnSelector.tsx
"use client"; // Required for checkbox state interaction

import React from "react";
import Checkbox from "../ui/Checkbox"; // Adjust path
import Card, { CardHeader, CardTitle, CardContent } from "../ui/Card"; // Adjust path
import type { ColumnSelectorProps } from "@/types"; // Adjust path

const ColumnSelector: React.FC<ColumnSelectorProps> = ({
  columns,
  selectedColumns,
  onSelectionChange,
}) => {
  if (!columns || columns.length === 0) {
    return null; // Don't render if there are no columns
  }

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    onSelectionChange(name, checked);
  };

  // Optional: Select/Deselect All functionality
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    columns.forEach((col) => onSelectionChange(col, isChecked));
  };
  const areAllSelected =
    columns.length > 0 && selectedColumns.size === columns.length;

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Select Columns to Visualize</CardTitle>
          {/* Select All Checkbox */}
          <Checkbox
            id="select-all-columns"
            label="Select All"
            checked={areAllSelected}
            onChange={handleSelectAll}
            disabled={columns.length === 0}
          />
        </div>
      </CardHeader>
      <CardContent>
        {columns.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-2">
            {columns.map((header) => (
              <Checkbox
                key={header}
                id={`col-${header}`} // Ensure unique ID
                name={header}
                label={header}
                checked={selectedColumns.has(header)}
                onChange={handleCheckboxChange}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No columns found in the data.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ColumnSelector;
