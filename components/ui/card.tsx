// components/ui/Card.tsx
import React from "react";
import { twMerge } from "tailwind-merge";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ className, children, ...props }) => {
  const baseStyle =
    "bg-white border border-gray-200 rounded shadow-sm overflow-hidden";
  const combinedClassName = twMerge(baseStyle, className);

  return (
    <div className={combinedClassName} {...props}>
      {children}
    </div>
  );
};

// Optional: Sub-components for structure
export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div
    className={twMerge("px-4 py-3 border-b border-gray-200", className)}
    {...props}
  >
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  children,
  ...props
}) => (
  <h3
    className={twMerge("text-lg font-semibold text-foreground", className)}
    {...props}
  >
    {children}
  </h3>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div className={twMerge("p-4", className)} {...props}>
    {children}
  </div>
);

export default Card;
