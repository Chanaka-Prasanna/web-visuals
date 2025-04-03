// components/ui/Checkbox.tsx
"use client"; // Needs client state for checked status interaction (if used directly with state)

import React from "react";
import { twMerge } from "tailwind-merge";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id: string; // Required for label association
}

const Checkbox: React.FC<CheckboxProps> = ({
  className,
  label,
  id,
  ...props
}) => {
  const baseStyle =
    "h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed";
  const combinedClassName = twMerge(baseStyle, className);

  return (
    <div className="flex items-center space-x-2">
      <input type="checkbox" id={id} className={combinedClassName} {...props} />
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default Checkbox;
