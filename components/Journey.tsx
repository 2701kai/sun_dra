"use client";

import { motion, useInView, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { content } from "@/app/content";
import { Wave } from "./Ornaments";
import { Reveal, Words, pop, stagger } from "./motion/Reveal";

/** Two layouts of the same route: wide (landscape) and tall (phones). Borkum first, Aotearoa last. */
const LAYOUTS = {
  wide: {
    viewBox: "0 0 1200 400",
    route: "M 70 90 C 180 40, 260 160, 380 120 S 560 40, 640 150 S 820 330, 940 240 S 1090 170, 1130 330",
    stops: [
      { x: 70, y: 90, label: "above" },
      { x: 380, y: 120, label: "above" },
      { x: 700, y: 210, label: "above" },
      { x: 1130, y: 330, label: "above" },
    ],
    stopR: 22,
    font: 26,
    beeScale: 1.6,
  },
  tall: {
    viewBox: "0 0 400 760",
    route: "M 70 60 C 260 40, 340 180, 200 250 S 40 400, 170 470 S 380 560, 250 640 S 120 740, 330 720",
    stops: [
      { x: 70, y: 60, label: "right" },
      { x: 200, y: 250, label: "right" },
      { x: 170, y: 470, label: "right" },
      { x: 330, y: 720, label: "left" },
    ],
    stopR: 18,
    font: 20,
    beeScale: 1.25,
  },
} as const;

type Layout = (typeof LAYOUTS)[keyof typeof LAYOUTS];

function Bee({ id }: { id: string }) {
  return (
    <g>
      {/* wings */}
      {[-1, 1].map((side) => (
        <motion.ellipse
          key={side}
          cx={side * 6 - 2}
          cy={-11}
          rx={6}
          ry={10}
          fill="rgba(246,234,210,0.8)"
          stroke="rgba(75,46,30,0.45)"
          strokeWidth={1}
          style={{ originX: "0px", originY: "0px", transformBox: "fill-box" }}
          animate={{ rotate: side > 0 ? [-25, 15, -25] : [25, -15, 25] }}
          transition={{ duration: 0.18, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      {/* body */}
      <ellipse cx={0} cy={0} rx={15} ry={10} fill="var(--color-mustard)" stroke="var(--color-cocoa)" strokeWidth={1.5} />
      <clipPath id={`bee-body-${id}`}>
        <ellipse cx={0} cy={0} rx={15} ry={10} />
      </clipPath>
      <g clipPath={`url(#bee-body-${id})`} fill="var(--color-cocoa)">
        <rect x={-8} y={-12} width={4} height={24} />
        <rect x={-1} y={-12} width={4} height={24} />
        <rect x={6} y={-12} width={4} height={24} />
      </g>
      <circle cx={15} cy={-1} r={5.5} fill="var(--color-cocoa)" />
      <circle cx={16.5} cy={-2.5} r={1.5} fill="var(--color-cream)" />
      <path d="M-15 0 L-21 2 L-15 4 Z" fill="var(--color-cocoa)" />
      <path d="M17 -6 Q 20 -13 24 -12 M14 -7 Q 15 -14 19 -15" fill="none" stroke="var(--color-cocoa)" strokeWidth={1.3} strokeLinecap="round" />
    </g>
  );
}

function Route({
  id,
  layout,
  offsetDistance,
}: {
  id: string;
  layout: Layout;
  offsetDistance: string | MotionValue<string>;
}) {
  const { journey } = content;
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  return (
    <svg ref={ref} viewBox={layout.viewBox} className="w-full overflow-visible" aria-hidden="true">
      <motion.path
        d={layout.route}
        fill="none"
        stroke="var(--color-brown)"
        strokeOpacity={0.45}
        strokeWidth={3}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: inView ? 1 : 0 }}
        transition={{ duration: 3, ease: "easeInOut" }}
      />
      {layout.stops.map((s, i) => {
        const lx = s.label === "above" ? s.x : s.label === "right" ? s.x + layout.stopR + 12 : s.x - layout.stopR - 12;
        const ly = s.label === "above" ? s.y - layout.stopR - 12 : s.y + layout.font * 0.35;
        const anchor = s.label === "above" ? "middle" : s.label === "right" ? "start" : "end";
        return (
          <motion.g
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.4 + i * 0.6 }}
            style={{ transformBox: "fill-box", originX: 0.5, originY: 0.5 }}
          >
            <circle cx={s.x} cy={s.y} r={layout.stopR} fill="var(--color-mustard)" stroke="var(--color-orange)" strokeWidth={5} />
            <text x={s.x} y={s.y + layout.stopR * 0.32} textAnchor="middle" fill="var(--color-brown)" className="font-display" fontSize={layout.stopR * 0.9}>
              {i + 1}
            </text>
            <text x={lx} y={ly} textAnchor={anchor} fill="var(--color-ember)" className="font-display" fontSize={layout.font}>
              {journey.stops[i].name}
            </text>
          </motion.g>
        );
      })}

      {/* the bumblebee rides the route as you scroll */}
      <motion.g style={{ offsetPath: `path('${layout.route}')`, offsetRotate: "auto", offsetDistance }}>
        <motion.g animate={{ y: [0, -6, 0] }} transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}>
          <g transform={`scale(${layout.beeScale})`}>
            <Bee id={id} />
          </g>
          <text x={0} y={-24 * layout.beeScale} textAnchor="middle" fill="var(--color-brown)" className="font-serif italic" fontSize={9 * layout.beeScale}>
            {journey.bee}
          </text>
        </motion.g>
      </motion.g>
    </svg>
  );
}

export function Journey() {
  const { journey } = content;
  const section = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: section, offset: ["start 85%", "end 45%"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 20, mass: 0.6 });
  const offsetDistance = useTransform(smooth, (v) => `${Math.min(100, Math.max(0, v * 100))}%`);

  return (
    <section ref={section} className="relative overflow-hidden bg-[linear-gradient(180deg,var(--color-cream)_0%,#e2eef0_45%,var(--color-cream)_100%)]">
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-20 sm:pb-32 sm:pt-28">
        <div className="max-w-2xl">
          <Reveal>
            <p className="font-serif text-sm uppercase tracking-[0.35em] text-river">{journey.label}</p>
          </Reveal>
          <Words as="h2" text={journey.title} step={0.07} className="mt-4 font-display text-[clamp(2.4rem,6vw,4.6rem)] leading-[0.95] text-ember" />
          <Words text={journey.intro} delay={0.3} step={0.018} className="mt-8 font-serif text-lg leading-relaxed text-brown/85 sm:text-xl" />
        </div>

        {/* the route, wide on landscape screens, tall on phones */}
        <div className="relative mt-10 sm:mt-14">
          <div className="hidden sm:block">
            <Route id="wide" layout={LAYOUTS.wide} offsetDistance={reduce ? "100%" : offsetDistance} />
          </div>
          <div className="mx-auto max-w-sm sm:hidden">
            <Route id="tall" layout={LAYOUTS.tall} offsetDistance={reduce ? "100%" : offsetDistance} />
          </div>
        </div>

        {/* the stops */}
        <motion.ol
          variants={stagger(0.2, 0.15)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {journey.stops.map((s, i) => (
            <motion.li
              key={s.name}
              variants={pop}
              whileHover={{ y: -8, rotate: i % 2 ? 1.5 : -1.5 }}
              className="rounded-[28px] border-4 border-brown/80 bg-cream/80 p-5 shadow-[8px_8px_0_var(--color-teal)] backdrop-blur-sm"
            >
              <p className="font-display text-2xl text-ember">
                <span className="mr-2 text-mustard">{String(i + 1).padStart(2, "0")}</span>
                {s.name}
              </p>
              <p className="mt-1 font-serif text-xs font-semibold uppercase tracking-[0.25em] text-brown/60">{s.sub}</p>
              <p className="mt-4 font-serif text-base leading-relaxed text-brown/85">{s.text}</p>
            </motion.li>
          ))}
        </motion.ol>
      </div>

      <Wave className="absolute -bottom-px left-0 h-16 sm:h-24" fill="var(--color-cream)" />
    </section>
  );
}
