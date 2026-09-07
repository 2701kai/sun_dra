"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

const springy = { type: "spring", stiffness: 220, damping: 20 } as const;

export const pop: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.92, rotate: -2 },
  show: { opacity: 1, y: 0, scale: 1, rotate: 0, transition: springy },
};

export const slideLeft: Variants = {
  hidden: { opacity: 0, x: -120, rotate: -4 },
  show: { opacity: 1, x: 0, rotate: 0, transition: { ...springy, stiffness: 180 } },
};

export const slideRight: Variants = {
  hidden: { opacity: 0, x: 120, rotate: 4 },
  show: { opacity: 1, x: 0, rotate: 0, transition: { ...springy, stiffness: 180 } },
};

export const stagger = (delayChildren = 0, staggerChildren = 0.08): Variants => ({
  hidden: {},
  show: { transition: { delayChildren, staggerChildren } },
});

type RevealProps = {
  children: ReactNode;
  className?: string;
  variants?: Variants;
  delay?: number;
  amount?: number;
  once?: boolean;
};

/** Pops its children in with a spring the first time they scroll into view. */
export function Reveal({
  children,
  className,
  variants = pop,
  delay = 0,
  amount = 0.25,
  once = true,
}: RevealProps) {
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

/** Reveals a sentence one word at a time, each word springing up from below. */
export function Words({
  text,
  className,
  wordClassName = "",
  delay = 0,
  step = 0.035,
  as: Tag = "p",
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  step?: number;
  as?: "p" | "h1" | "h2" | "h3" | "span";
}) {
  const words = text.split(" ");
  const MotionTag = motion[Tag];
  return (
    <MotionTag
      className={className}
      variants={stagger(delay, step)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      aria-label={text}
    >
      {words.map((word, i) => (
        <span key={i} aria-hidden="true">
          <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
            <motion.span
              className={`inline-block ${wordClassName}`}
              variants={{
                hidden: { y: "110%", rotate: 6, opacity: 0 },
                show: { y: 0, rotate: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } },
              }}
            >
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </MotionTag>
  );
}

/** Splits a word into letters that bounce in one after another and jump when hovered. */
export function Letters({
  text,
  className,
  letterClassName = "",
  delay = 0,
  step = 0.06,
}: {
  text: string;
  className?: string;
  letterClassName?: string;
  delay?: number;
  step?: number;
}) {
  return (
    <motion.span
      className={`inline-flex ${className ?? ""}`}
      variants={stagger(delay, step)}
      initial="hidden"
      animate="show"
      aria-label={text}
    >
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className={`inline-block cursor-default select-none ${letterClassName}`}
          variants={{
            hidden: { y: 140, opacity: 0, rotate: i % 2 ? 18 : -18, scale: 0.6 },
            show: {
              y: 0,
              opacity: 1,
              rotate: 0,
              scale: 1,
              transition: { type: "spring", stiffness: 240, damping: 14, mass: 0.9 },
            },
          }}
          whileHover={{ y: -22, rotate: i % 2 ? 8 : -8, scale: 1.12, transition: { type: "spring", stiffness: 500, damping: 12 } }}
          whileTap={{ scale: 0.85, rotate: 0 }}
        >
          {ch === " " ? " " : ch}
        </motion.span>
      ))}
    </motion.span>
  );
}
