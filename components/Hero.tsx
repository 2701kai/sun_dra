"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { content } from "@/app/content";
import { Flower, Sun } from "./Ornaments";
import { Letters } from "./motion/Reveal";

const flowers = [
  { cls: "left-[6%] top-[12%] w-16 text-pink sm:w-24", d: 0 },
  { cls: "right-[8%] top-[18%] w-12 text-teal sm:w-20", d: 0.8 },
  { cls: "bottom-[16%] left-[12%] w-10 text-avocado sm:w-16", d: 1.4 },
  { cls: "bottom-[22%] right-[10%] w-14 text-orange sm:w-24", d: 0.4 },
  { cls: "left-[28%] top-[8%] w-8 text-mustard sm:w-12", d: 1.9 },
  { cls: "right-[26%] bottom-[10%] w-9 text-ember sm:w-14", d: 1.1 },
];

export function Hero() {
  const { hero, name } = content;
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const burstScale = useTransform(scrollYProgress, [0, 1], [1, 1.6]);
  const sunY = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
  const nameY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <header
      ref={ref}
      className="relative isolate flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 pb-20 pt-20 text-center"
    >
      <motion.div
        aria-hidden="true"
        style={{ scale: reduce ? 1 : burstScale }}
        className="pointer-events-none absolute left-1/2 top-1/2 -z-20 aspect-square w-[180vmax] -translate-x-1/2 -translate-y-1/2"
      >
        <div
          className="sunburst animate-spin-slow h-full w-full opacity-[0.55]"
          style={{
            maskImage: "radial-gradient(circle at center, black 0%, rgba(0,0,0,0.5) 32%, transparent 68%)",
            WebkitMaskImage: "radial-gradient(circle at center, black 0%, rgba(0,0,0,0.5) 32%, transparent 68%)",
          }}
        />
      </motion.div>

      {flowers.map((f, i) => (
        <motion.div
          key={i}
          className={`absolute cursor-grab active:cursor-grabbing ${f.cls}`}
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.6 + f.d * 0.25 }}
          drag
          dragMomentum
          dragElastic={0.4}
          whileHover={{ scale: 1.25, rotate: 20 }}
          whileDrag={{ scale: 1.4, rotate: 180 }}
        >
          <motion.div
            animate={{ y: [0, -14, 0], rotate: [-4, 5, -4] }}
            transition={{ duration: 5 + f.d, repeat: Infinity, ease: "easeInOut", delay: -f.d }}
          >
            <Flower className="w-full" />
          </motion.div>
        </motion.div>
      ))}

      <motion.p
        style={{ opacity: fade }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6 font-serif text-sm uppercase tracking-[0.35em] text-brown/80 sm:text-base"
      >
        {hero.kicker}
        <span className="block text-ember normal-case tracking-normal italic sm:inline sm:before:content-['_·_']">
          {hero.kickerTail}
        </span>
      </motion.p>

      <motion.div style={{ y: reduce ? 0 : sunY }} className="relative w-[min(78vw,26rem)]">
        <motion.svg
          viewBox="0 0 200 200"
          className="absolute inset-0 -z-10 w-full"
          aria-hidden="true"
          initial={{ opacity: 0, rotate: -40 }}
          animate={{ opacity: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 60, damping: 14, delay: 0.9 }}
        >
          <defs>
            <path id="arc-path" d="M 20 100 A 80 80 0 0 1 180 100" />
          </defs>
          <text className="font-serif text-[11px] font-semibold uppercase tracking-[0.28em]" fill="var(--color-brown)">
            <textPath href="#arc-path" startOffset="50%" textAnchor="middle">
              {hero.arc}
            </textPath>
          </text>
        </motion.svg>

        <motion.div
          initial={{ y: "70%", opacity: 0, scale: 0.6 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 110, damping: 13, mass: 1.2, delay: 0.15 }}
          className="mx-auto mt-[13%] w-[76%]"
        >
          <motion.div animate={{ rotate: [0, 3, -3, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}>
            <Sun className="drop-shadow-[0_18px_40px_rgba(75,46,30,0.25)]" />
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.h1
        style={{ y: reduce ? 0 : nameY }}
        className="-mt-[0.55em] font-display text-[clamp(4.5rem,20vw,13rem)] leading-[0.85] text-orange drop-shadow-[0_6px_0_var(--color-brown)]"
      >
        <Letters text={name} delay={0.5} step={0.09} />
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
        className="mt-8 max-w-md font-serif text-lg italic text-brown/85 sm:text-xl"
      >
        {hero.tagline}
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.6 }}
        className="mt-4 hidden font-serif text-xs tracking-wide text-brown/50 sm:block"
      >
        {hero.hint}
      </motion.p>

      <motion.a
        href="#distance"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ opacity: { delay: 1.8 }, y: { duration: 1.6, repeat: Infinity, ease: "easeInOut" } }}
        whileHover={{ scale: 1.15 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 font-serif text-xs uppercase tracking-[0.3em] text-brown/70"
      >
        {hero.scroll} ↓
      </motion.a>
    </header>
  );
}
