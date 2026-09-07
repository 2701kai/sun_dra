"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { content } from "@/app/content";
import { Peace, Wave } from "./Ornaments";
import { Reveal } from "./motion/Reveal";

export function Sovereign() {
  const { sovereign } = content;
  const section = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: section, offset: ["start end", "end start"] });
  const spin = useTransform(scrollYProgress, [0, 1], [-60, 120]);
  const spinBack = useTransform(scrollYProgress, [0, 1], [90, -90]);

  return (
    <section ref={section} className="relative overflow-hidden bg-brown text-cream">
      <Wave className="absolute -top-px left-0 h-16 sm:h-24" fill="var(--color-cream)" flip />

      <motion.div style={{ rotate: reduce ? 0 : spin }} className="pointer-events-none absolute -right-16 top-24 w-64 text-orange/20 sm:w-96">
        <Peace className="w-full" />
      </motion.div>
      <motion.div style={{ rotate: reduce ? 0 : spinBack }} className="pointer-events-none absolute -left-20 bottom-16 w-52 text-mustard/15 sm:w-80">
        <Peace className="w-full" />
      </motion.div>

      <div className="relative mx-auto max-w-5xl px-6 pb-32 pt-32 sm:pt-40">
        <Reveal>
          <p className="font-serif text-sm uppercase tracking-[0.35em] text-mustard">{sovereign.label}</p>
        </Reveal>

        <div className="mt-8 space-y-1 sm:space-y-2">
          {sovereign.lines.map((line, i) => {
            const fromLeft = i % 2 === 0;
            const colour = i === 0 || i === 1 ? "text-mustard" : i === 4 ? "text-orange" : "text-cream";
            return (
              <motion.p
                key={line}
                initial={{ opacity: 0, x: fromLeft ? -160 : 160, rotate: fromLeft ? -6 : 6, scale: 0.9 }}
                whileInView={{ opacity: 1, x: 0, rotate: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ type: "spring", stiffness: 170, damping: 13, delay: i * 0.08 }}
                whileHover={{ x: fromLeft ? 16 : -16, skewX: fromLeft ? -4 : 4 }}
                className={`origin-left font-display text-[clamp(1.8rem,4.6vw,4rem)] leading-[1.05] ${colour}`}
              >
                {line}
              </motion.p>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 120, damping: 18, delay: 0.5 }}
          className="mt-16 max-w-xl origin-left border-l-4 border-orange pl-6"
        >
          <p className="font-serif text-xl italic leading-relaxed text-cream/85 sm:text-2xl">{sovereign.coda}</p>
        </motion.div>
      </div>

      <Wave className="absolute -bottom-px left-0 h-16 sm:h-24" fill="var(--color-cream)" />
    </section>
  );
}
