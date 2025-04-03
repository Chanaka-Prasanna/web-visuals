// app/about/page.tsx
import React from "react";

export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="prose lg:prose-xl max-w-4xl mx-auto">
        {" "}
        {/* Using prose for nice text formatting */}
        <h1>About Web Visuals</h1>
        <p>
          Web Visuals was created to provide a simple, fast, and accessible way
          for anyone to gain insights from their data without needing complex
          software or coding skills.
        </p>
        <h2>Our Mission</h2>
        <p>
          Our goal is to empower users to quickly understand trends and patterns
          in their datasets. By simply uploading a CSV or JSON file, you can
          instantly generate key visualizations like pie charts for categorical
          data and statistical summaries for numerical data.
        </p>
        <h2>How It Works</h2>
        <p>
          The application leverages modern web technologies like Next.js and
          React, performing all data parsing and analysis directly within your
          browser. This ensures your data remains private and processing is
          quick for most standard file sizes. We use robust libraries for
          parsing and charting to provide reliable results.
        </p>
        <h2>Future Plans</h2>
        <ul>
          <li>
            Support for more chart types (histograms, bar charts, scatter
            plots).
          </li>
          <li>Enhanced data cleaning suggestions.</li>
          <li>Options for chart customization (colors, labels).</li>
          <li>Handling larger datasets more efficiently.</li>
        </ul>
        <p>Thank you for using Web Visuals!</p>
      </div>
    </main>
  );
}

// Optional: Add Tailwind Typography plugin for nice prose styles
// 1. npm install -D @tailwindcss/typography
// 2. Add require('@tailwindcss/typography') to plugins in tailwind.config.ts
