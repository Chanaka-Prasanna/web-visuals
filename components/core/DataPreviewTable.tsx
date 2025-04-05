// components/core/DataPreviewTable.tsx
"use client"; // Required for TanStack Table hooks and state

import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel, // Optional: for basic filtering later
  getSortedRowModel, // Optional: for sorting later
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import type { ParsedData, DataRow } from "@/types"; // Adjust path
import Button from "@/components/ui/Button"; // Adjust path

interface DataPreviewTableProps {
  data: ParsedData;
}

const DataPreviewTable: React.FC<DataPreviewTableProps> = ({ data }) => {
  const { headers, rows } = data;

  // Define columns dynamically from headers for TanStack Table
  const columns = useMemo<ColumnDef<DataRow>[]>(() => {
    return headers.map((header) => ({
      accessorKey: header, // Access data using the header key
      header: () => <span>{header}</span>, // Render header text
      cell: (info) => {
        // Render cell value, handle different types if needed
        const value = info.getValue();
        if (value instanceof Date) {
          return value.toLocaleDateString(); // Simple date format
        }
        // Handle null/undefined gracefully
        if (value === null || value === undefined)
          return <span className="text-gray-400">N/A</span>;
        // Truncate long text potentially
        const stringValue = String(value);
        return (
          <span title={stringValue}>
            {stringValue.length > 50
              ? stringValue.substring(0, 50) + "..."
              : stringValue}
          </span>
        );
      },
      // enableSorting: true, // Enable later
      // enableFiltering: true, // Enable later
    }));
  }, [headers]);

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(), // Enable pagination
    // getSortedRowModel: getSortedRowModel(), // Enable later
    // getFilteredRowModel: getFilteredRowModel(), // Enable later
    initialState: {
      pagination: {
        pageSize: 10, // Show 10 rows per page
      },
    },
  });

  if (!rows || rows.length === 0) {
    return (
      <p className="text-gray-500 text-center my-4">No data rows to display.</p>
    );
  }

  return (
    <div className="mt-6 overflow-x-auto bg-white border rounded shadow-sm">
      <h3 className="text-lg font-semibold p-4 border-b">
        Data Preview ({rows.length} Rows)
      </h3>
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  scope="col"
                  className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider"
                  // Add onClick for sorting later
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  {/* Add sort indicators later */}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-2 whitespace-nowrap">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between p-3 border-t gap-2">
        <span className="text-xs text-gray-600">
          Page{" "}
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>{" "}
          | Total Rows: {rows.length}
        </span>
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {"<<"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"<"} Prev
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next {">"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {">>"}
          </Button>
          {/* Optional: Go to page input */}
          {/* <span className="flex items-center gap-1">
             | Go to page:
             <input
                type="number"
                defaultValue={table.getState().pagination.pageIndex + 1}
                onChange={e => {
                 const page = e.target.value ? Number(e.target.value) - 1 : 0
                 table.setPageIndex(page)
                }}
                className="border p-1 rounded w-12 text-xs"
             />
           </span> */}
          {/* Optional: Page size selector */}
          {/* <select
             value={table.getState().pagination.pageSize}
             onChange={e => {
               table.setPageSize(Number(e.target.value))
             }}
             className="border p-1 rounded text-xs"
           >
             {[10, 20, 30, 40, 50].map(pageSize => (
               <option key={pageSize} value={pageSize}>
                 Show {pageSize}
               </option>
             ))}
           </select> */}
        </div>
      </div>
    </div>
  );
};

export default DataPreviewTable;
