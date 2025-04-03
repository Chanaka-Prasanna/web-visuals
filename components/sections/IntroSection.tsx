// components/sections/IntroSection.tsx
import React from "react";
import { UploadCloud, PieChart, BarChartHorizontal } from "lucide-react"; // Example icons

const features = [
  {
    name: "Easy Upload",
    description: "Simply drag and drop or select your CSV or JSON file.",
    icon: UploadCloud,
  },
  {
    name: "Automatic Charting",
    description:
      "Get Pie Charts for categories and clear Stats or Histograms for numbers.",
    icon: PieChart, // Or a more general chart icon
  },
  {
    name: "Column Selection",
    description:
      "Focus on the data that matters most by selecting specific columns.",
    icon: BarChartHorizontal, // Example icon
  },
];

const IntroSection: React.FC = () => {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">
            How it Works
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Visualize Data in 3 Simple Steps
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Turn your raw data into meaningful visuals without hassle.
          </p>
        </div>

        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded bg-primary text-white">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                    {feature.name}
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
};

export default IntroSection;
