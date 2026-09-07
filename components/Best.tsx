"use client";

import Image from "next/image";
import { motion, type Variants } from "motion/react";
import { content } from "@/app/content";
import { Flower } from "./Ornaments";
import { Reveal, Words, stagger } from "./motion/Reveal";
import { confetti } from "./motion/Ambient";

const card = (rotate: number, from: number): Variants => ({
  hidden: { opacity: 0, y: 160, rotate: from, scale: 0.8 },
  show: { opacity: 1, y: 0, rotate, scale: 1, transition: { type: "spring", stiffness: 160, damping: 13 } },
});

function Stamp() {
  const { best } = content;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 3.2, rotate: 20 }}
      whileInView={{ opacity: 1, scale: 1, rotate: -12 }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ type: "spring", stiffness: 380, damping: 16, delay: 0.5 }}
      whileHover={{ rotate: -4, scale: 1.06 }}
      onViewportEnter={(entry) => {
        const r = entry?.boundingClientRect;
        if (r) setTimeout(() => confetti({ x: r.left + r.width / 2, y: r.top + r.height / 2 }, 70), 650);
      }}
      className="pointer-events-auto absolute right-4 top-10 z-10 rounded-full border-[5px] border-ember px-4 py-2.5 text-center text-ember mix-blend-multiply sm:right-10 sm:top-24 sm:px-7 sm:py-4 lg:right-24"
      style={{ boxShadow: "inset 0 0 0 3px var(--color-cream), inset 0 0 0 5px var(--color-ember)" }}
    >
      <p className="font-display text-xl uppercase leading-none tracking-wide sm:text-3xl">{best.stamp}</p>
      <p className="mt-1 font-serif text-[10px] font-semibold uppercase tracking-[0.2em] sm:text-xs">{best.stampSmall}</p>
    </motion.div>
  );
}

export function Best() {
  const { best } = content;
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
      <motion.div
        animate={{ y: [0, -14, 0], rotate: [0, 20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -top-6 right-8 w-16 text-pink sm:w-24"
      >
        <Flower className="w-full" />
      </motion.div>

      <Stamp />

      <div className="relative max-w-3xl">
        <Reveal>
          <p className="font-serif text-sm uppercase tracking-[0.35em] text-ember">{best.label}</p>
        </Reveal>
        <Words as="h2" text={best.title} step={0.05} className="mt-4 max-w-2xl font-display text-[clamp(2rem,5vw,3.8rem)] leading-[1] text-orange" />
        <Words
          text={best.subtitle}
          delay={0.5}
          step={0.06}
          className="mt-4 font-display text-xl text-ember sm:text-2xl"
        />
        <Words text={best.body} delay={0.6} step={0.018} className="mt-8 font-serif text-lg leading-relaxed text-brown/85 sm:text-xl" />
      </div>

      <motion.ul
        variants={stagger(0.1, 0.18)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="mt-16 grid gap-10 sm:grid-cols-3 sm:gap-6"
      >
        <motion.li variants={card(-3, -25)} whileHover={{ rotate: 0, scale: 1.05, y: -10 }} whileTap={{ rotate: 6 }}>
          <div className="relative aspect-[3/4] overflow-hidden rounded-[28px] border-[6px] border-cream bg-sand shadow-[10px_10px_0_var(--color-pink)]">
            <video
              className="h-full w-full object-cover"
              poster="/media/grin-poster.jpg"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="Sandra at the river, grinning and sticking her tongue out"
            >
              <source src="/media/grin.mp4" type="video/mp4" />
              <source src="/media/grin.webm" type="video/webm" />
            </video>
          </div>
          <p className="mt-4 font-serif text-sm italic text-brown/70">{best.captions[0]}</p>
        </motion.li>

        <motion.li variants={card(2, 25)} whileHover={{ rotate: 0, scale: 1.05, y: -10 }} whileTap={{ rotate: -6 }} className="sm:mt-12">
          <div className="relative aspect-[3/4] overflow-hidden rounded-[28px] border-[6px] border-cream bg-sand shadow-[-10px_10px_0_var(--color-teal)]">
            <Image src="/media/sandra-sun.webp" alt="Sandra smiling in bright sunshine" fill sizes="(min-width: 640px) 30vw, 90vw" className="object-cover" />
          </div>
          <p className="mt-4 font-serif text-sm italic text-brown/70">{best.captions[1]}</p>
        </motion.li>

        <motion.li variants={card(-1.5, -20)} whileHover={{ rotate: 0, scale: 1.05, y: -10 }} whileTap={{ rotate: 6 }}>
          <div className="relative aspect-[3/4] overflow-hidden rounded-[28px] border-[6px] border-cream bg-sand shadow-[10px_10px_0_var(--color-mustard)]">
            <Image
              src="/media/sandra-couch.webp"
              alt="Sandra lying on a sofa in a black jumper with a big pink smiley on it, laughing"
              fill
              sizes="(min-width: 640px) 30vw, 90vw"
              className="object-cover"
            />
          </div>
          <p className="mt-4 font-serif text-sm italic text-brown/70">{best.captions[2]}</p>
        </motion.li>
      </motion.ul>
    </section>
  );
}
