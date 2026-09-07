"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { content } from "@/app/content";
import { Reveal, Words, slideLeft, slideRight } from "./motion/Reveal";

function Ripples() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute right-0 top-10 -z-10 aspect-square w-[55vw] max-w-3xl">
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border-[3px] border-teal/40"
          initial={{ scale: 0.2, opacity: 0 }}
          animate={{ scale: [0.2, 1], opacity: [0, 0.6, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeOut", delay: i * 1.75 }}
        />
      ))}
    </div>
  );
}

export function River() {
  const { river } = content;
  const section = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: section, offset: ["start end", "end start"] });
  const yA = useTransform(scrollYProgress, [0, 1], [40, -90]);
  const yB = useTransform(scrollYProgress, [0, 1], [140, -40]);
  const rotA = useTransform(scrollYProgress, [0, 1], [-4, 1]);
  const rotB = useTransform(scrollYProgress, [0, 1], [4, -1]);

  return (
    <section ref={section} className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
      <Ripples />

      <div className="max-w-2xl">
        <Reveal>
          <p className="font-serif text-sm uppercase tracking-[0.35em] text-river">{river.label}</p>
        </Reveal>
        <Words as="h2" text={river.title} step={0.07} className="mt-4 font-display text-[clamp(2.4rem,6vw,4.6rem)] leading-[0.95] text-river" />
        <Words text={river.body} delay={0.3} step={0.018} className="mt-8 font-serif text-lg leading-relaxed text-brown/85 sm:text-xl" />
      </div>

      <div className="mt-16 grid gap-10 sm:grid-cols-[1.35fr_1fr] sm:gap-8">
        <Reveal variants={slideLeft}>
          <motion.figure style={{ y: reduce ? 0 : yA, rotate: reduce ? -1 : rotA }} whileHover={{ scale: 1.03, rotate: 0 }}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[32px] border-[6px] border-cream bg-sand shadow-[14px_14px_0_var(--color-teal)]">
              <Image
                src="/media/river-pool.webp"
                alt="A turquoise river pool between pale boulders, every stone on the bottom visible"
                fill
                sizes="(min-width: 640px) 55vw, 90vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-4 font-serif text-sm italic text-brown/70">{river.captions[0]}</figcaption>
          </motion.figure>
        </Reveal>

        <Reveal variants={slideRight} delay={0.15} className="sm:mt-20">
          <motion.figure style={{ y: reduce ? 0 : yB, rotate: reduce ? 2 : rotB }} whileHover={{ scale: 1.03, rotate: 0 }}>
            <div className="relative aspect-[3/4] overflow-hidden rounded-[32px] border-[6px] border-cream bg-sand shadow-[-14px_14px_0_var(--color-mustard)]">
              <Image
                src="/media/river-above.webp"
                alt="Looking down a clear green river lined with trees"
                fill
                sizes="(min-width: 640px) 40vw, 90vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-4 font-serif text-sm italic text-brown/70">{river.captions[1]}</figcaption>
          </motion.figure>
        </Reveal>
      </div>
    </section>
  );
}
