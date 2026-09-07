import { Best } from "@/components/Best";
import { Distance } from "@/components/Distance";
import { Finale } from "@/components/Finale";
import { Hero } from "@/components/Hero";
import { Journey } from "@/components/Journey";
import { Marquee } from "@/components/Marquee";
import { Paradise } from "@/components/Paradise";
import { River } from "@/components/River";
import { Sovereign } from "@/components/Sovereign";
import { SteelySan } from "@/components/SteelySan";
import { ScrollProgress } from "@/components/motion/Ambient";
import { FlowerField } from "@/components/motion/FlowerField";

export default function Page() {
  return (
    <main className="relative">
      <ScrollProgress />
      <FlowerField />
      <Hero />
      <Marquee />
      <Distance />
      <Journey />
      <Paradise />
      <River />
      <Sovereign />
      <Best />
      <SteelySan />
      <Finale />
    </main>
  );
}
