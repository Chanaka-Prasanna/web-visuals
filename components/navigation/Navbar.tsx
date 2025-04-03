// components/navigation/Navbar.tsx
"use client"; // Needed for using usePathname hook

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Import usePathname

const Navbar: React.FC = () => {
  const pathname = usePathname(); // Get current path

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/visual", label: "Visualize" },
    { href: "/about", label: "About Us" },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-primary">
              Web Visuals
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  px-3 py-2 rounded text-sm font-medium transition-colors
                  ${
                    pathname === item.href
                      ? "text-primary border-b-2 border-primary" // Active style
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100" // Inactive style
                  }
                `}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button (Optional) */}
          {/* <div className="md:hidden">
             <button>...</button>
           </div> */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
