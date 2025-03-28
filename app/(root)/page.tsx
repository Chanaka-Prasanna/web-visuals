import ShowDynamicPieChart from "@/components/charts/ShowPieChart";
import ShowPieChart from "@/components/charts/ShowPieChart";
import HeroBanner from "@/components/home/hero-section";
import HowToUse from "@/components/home/how-to-use";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="w-full mx-auto">
      <HeroBanner />
      <HowToUse />
      <Button size="lg" className="bg-primary text-primary-foreground">
        Hi theere
      </Button>
    </main>
  );
}
