// components/Footer.tsx
import React from "react";

const Footer: React.FC = () => {
  // Using fixed current year - better to generate dynamically if needed elsewhere
  const currentYear = new Date().getFullYear();

  // Get current date using system time
  // const currentDate = new Date();
  // const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', timeZoneName: 'short' };
  // const formattedDate = currentDate.toLocaleDateString('en-LK', options) + " " + currentDate.toLocaleTimeString('en-LK', options).split(' ')[1] + " " + currentDate.toLocaleTimeString('en-LK', options).split(' ')[2];
  // const formattedDate = new Intl.DateTimeFormat('en-LK', options).format(currentDate);

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm text-gray-500">
          &copy; {currentYear} Web Visuals. All rights reserved.
        </p>
        {/* Optional: Display current time based on prompt */}
        {/* <p className="text-xs text-gray-400 mt-1">
                    Current Time (Sri Lanka): Thursday, April 3, 2025 at 1:36 PM +0530
                 </p> */}
      </div>
    </footer>
  );
};

export default Footer;
