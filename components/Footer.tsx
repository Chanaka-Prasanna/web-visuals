// components/Footer.tsx
import React from "react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  // Get current date/time dynamically for Sri Lanka
  let formattedDateTime = "";
  try {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZone: "Asia/Colombo", // Specify Sri Lanka Time Zone
      timeZoneName: "shortOffset", // Get +05:30
      hour12: true, // Use AM/PM
    };
    formattedDateTime = new Intl.DateTimeFormat("en-LK", options).format(
      new Date()
    );
    // Clean up potential double spaces if locale format varies
    formattedDateTime = formattedDateTime.replace(/\s+/g, " ");
  } catch (e) {
    console.error("Could not format date for Sri Lanka:", e);
    // Fallback or leave empty if formatting fails
    formattedDateTime = `Timezone: Asia/Colombo`;
  }

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      {" "}
      {/* Use mt-auto if parent is flex-col */}
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm text-gray-500">
          &copy; {currentYear} Web Visuals. All rights reserved.
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {/* Display the dynamic time */}
          {formattedDateTime}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
