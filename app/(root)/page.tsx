import HeroSection from "@/components/sections/HeroSection";
import IntroSection from "@/components/sections/IntroSection";

export default function Home() {
  return (
    <main className="w-full mx-auto">
      <main>
        <HeroSection />
        <IntroSection />
        {/* Add other sections as needed */}
        {/* <FeaturesSection /> */}
      </main>
    </main>
  );
}
