// components/core/DashboardSidebar.tsx
import React from "react";
import { X } from "lucide-react"; // Icon for closing on mobile
import {
  LayoutDashboard,
  Table,
  BarChart2,
  Activity,
  Wrench,
  Rows,
} from "lucide-react";

const sections = [
  // ... (keep sections array as before)
  { id: "overview", label: "Overview & Preview", icon: Table },
  { id: "charts", label: "Charts", icon: BarChart2 },
  { id: "analysis", label: "Analyze Data", icon: Activity, disabled: true },
  { id: "cleaning", label: "Data Cleaning", icon: Wrench, disabled: true },
  { id: "pivot", label: "Pivot Table", icon: Rows, disabled: true },
];

interface DashboardSidebarProps {
  activeSection: string;
  setActiveSection: (sectionId: string) => void;
  isOpenOnMobile: boolean; // State from parent for mobile view
  setIsOpenOnMobile: (isOpen: boolean) => void; // Function to close from parent
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  activeSection,
  setActiveSection,
  isOpenOnMobile,
  setIsOpenOnMobile,
}) => {
  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
    // Close sidebar on mobile after clicking a section
    if (window.innerWidth < 768) {
      // Check if on mobile width (md breakpoint)
      setIsOpenOnMobile(false);
    }
  };

  return (
    <>
      {/* Overlay for mobile view - closes sidebar when clicked */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden ${
          isOpenOnMobile ? "block" : "hidden"
        }`}
        onClick={() => setIsOpenOnMobile(false)}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <nav
        className={`
          fixed top-0 left-0 h-full w-64 p-4 border-r border-gray-200 bg-gray-50
          flex flex-col space-y-1 z-40 transition-transform duration-300 ease-in-out
          ${isOpenOnMobile ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0 md:h-auto md:z-auto md:flex md:flex-shrink-0
        `} // Handle mobile toggle and desktop static display
      >
        {/* Header with Close button for Mobile */}
        <div className="flex justify-between items-center mb-4 px-2">
          <h2 className="text-lg font-semibold text-gray-700">Dashboard</h2>
          {/* Close button only on mobile */}
          <button
            onClick={() => setIsOpenOnMobile(false)}
            className="md:hidden p-1 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Navigation Links */}
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => !section.disabled && handleSectionClick(section.id)}
            disabled={section.disabled}
            className={`
              flex items-center w-full px-3 py-2.5 rounded text-sm font-medium text-left transition-colors
              ${
                section.disabled
                  ? "text-gray-400 cursor-not-allowed"
                  : activeSection === section.id
                  ? "bg-primary/10 text-primary hover:bg-primary/20"
                  : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
              }
            `}
          >
            <section.icon className="mr-3 h-5 w-5 flex-shrink-0" />{" "}
            {/* Added flex-shrink-0 */}
            <span className="flex-grow">{section.label}</span>{" "}
            {/* Added flex-grow */}
            {section.disabled && (
              <span className="ml-auto text-xs text-gray-400 flex-shrink-0">
                (Soon)
              </span>
            )}
          </button>
        ))}
      </nav>
    </>
  );
};

export default DashboardSidebar;
