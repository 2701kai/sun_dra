import { Best } from "@/components/Best";
import { Distance } from "@/components/Distance";
import { Finale } from "@/components/Finale";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Paradise } from "@/components/Paradise";
import { River } from "@/components/River";
import { Sovereign } from "@/components/Sovereign";
import { SteelySan } from "@/components/SteelySan";
import { CursorTrail, Drift, ScrollProgress } from "@/components/motion/Ambient";

export default function Page() {
  return (
    <main className="relative">
      <ScrollProgress />
      <Drift />
      <CursorTrail />
      <Hero />
      <Marquee />
      <Distance />
      <Paradise />
      <River />
      <Sovereign />
      <Best />
      <SteelySan />
      <Finale />
    </main>
  );
}
