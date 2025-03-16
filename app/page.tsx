import ShowPieChart from "@/components/charts/ShowPieChart";
import { ModeToggle } from "@/components/toggle";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      <ShowPieChart />
      <ModeToggle />
    </main>
  );
}
