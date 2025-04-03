// components/ui/Button.tsx
import React from "react";
import { twMerge } from "tailwind-merge"; // Optional: for merging Tailwind classes gracefully

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}) => {
  const baseStyle =
    "inline-flex items-center justify-center rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const variantStyles = {
    primary:
      "bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary",
    secondary:
      "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400",
    outline:
      "border border-primary text-primary hover:bg-primary/10 focus:ring-primary",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const combinedClassName = twMerge(
    baseStyle,
    variantStyles[variant],
    sizeStyles[size],
    className // Allow overriding classes
  );

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
};

export default Button;
