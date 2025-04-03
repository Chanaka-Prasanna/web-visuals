// components/sections/HeroSection.tsx
import React from "react";
import Link from "next/link";
import Button from "../ui/Button"; // Adjust path if needed

const HeroSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-b from-orange-50 via-white to-white py-16 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block">Instant Insights with</span>
          <span className="block text-primary">Web Visuals</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Upload your CSV or JSON data and get beautiful, informative charts
          generated automatically. No coding required.
        </p>
        <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
          <div className="rounded shadow">
            <Link href="/visual">
              <Button size="lg" variant="primary">
                Start Visualizing Now
              </Button>
            </Link>
          </div>
          {/* Optional secondary button */}
          {/* <div className="mt-3 rounded shadow sm:mt-0 sm:ml-3">
            <Link href="/about">
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </Link>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
