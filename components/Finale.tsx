"use client";

import { motion } from "motion/react";
import { useRef } from "react";
import { content } from "@/app/content";
import { Flower } from "./Ornaments";
import { Reveal, Letters, stagger } from "./motion/Reveal";
import { confetti } from "./motion/Ambient";

const colours = ["var(--color-ember)", "var(--color-orange)", "var(--color-mustard)", "var(--color-avocado)", "var(--color-teal)", "var(--color-pink)"];

/** The rainbow paints itself arc by arc, outer to inner. */
function DrawnRainbow() {
  return (
    <svg viewBox="0 0 200 100" className="block w-full overflow-visible" aria-hidden="true">
      {colours.map((c, i) => (
        <motion.path
          key={c}
          d={`M ${8 + i * 14} 100 A ${92 - i * 14} ${92 - i * 14} 0 0 1 ${192 - i * 14} 100`}
          fill="none"
          stroke={c}
          strokeWidth="12"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: i * 0.12 }}
        />
      ))}
    </svg>
  );
}

function BouncyWord({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const words = text.split(" ");
  let n = 0;
  return (
    <motion.span
      className={`inline-flex flex-wrap justify-center gap-x-[0.25em] ${className ?? ""}`}
      variants={stagger(delay, 0.05)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
      aria-label={text}
    >
      {words.map((word, w) => (
        <span key={w} className="inline-flex whitespace-nowrap" aria-hidden="true">
          {word.split("").map((ch, i) => {
            const k = n++;
            return (
              <motion.span
                key={i}
                className="inline-block"
                variants={{
                  hidden: { y: 90, opacity: 0, rotate: k % 2 ? 14 : -14 },
                  show: { y: 0, opacity: 1, rotate: 0, transition: { type: "spring", stiffness: 260, damping: 12 } },
                }}
                whileHover={{ y: -18, rotate: k % 2 ? 10 : -10, color: "var(--color-pink)" }}
              >
                {ch}
              </motion.span>
            );
          })}
        </span>
      ))}
    </motion.span>
  );
}

export function Finale() {
  const { finale, name, signature } = content;
  const bigRef = useRef<HTMLHeadingElement>(null);

  function celebrate(e?: React.MouseEvent) {
    const r = (e?.currentTarget as HTMLElement | undefined)?.getBoundingClientRect() ?? bigRef.current?.getBoundingClientRect();
    confetti(r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : undefined, 160);
  }

  return (
    <footer className="relative isolate overflow-hidden px-6 pb-16 pt-20 text-center sm:pt-28">
      {[
        { cls: "left-[6%] top-[52%] w-12 text-teal sm:w-20", d: 0 },
        { cls: "right-[7%] top-[46%] w-11 text-pink sm:w-20", d: 1.5 },
        { cls: "bottom-[9%] left-[20%] w-9 text-orange sm:w-14", d: 2.5 },
        { cls: "bottom-[14%] right-[18%] w-10 text-avocado sm:w-16", d: 0.8 },
      ].map((f, i) => (
        <motion.div
          key={i}
          drag
          dragMomentum
          whileDrag={{ scale: 1.4, rotate: 180 }}
          animate={{ y: [0, -16, 0], rotate: [-5, 6, -5] }}
          transition={{ duration: 6 + f.d, repeat: Infinity, ease: "easeInOut", delay: -f.d }}
          className={`absolute cursor-grab active:cursor-grabbing ${f.cls}`}
        >
          <Flower className="w-full" />
        </motion.div>
      ))}

      <div className="mx-auto w-[min(92vw,44rem)]">
        <DrawnRainbow />
      </div>

      <div className="mx-auto mt-4 max-w-3xl">
        <Reveal delay={0.6}>
          <p className="mx-auto max-w-md font-serif text-base italic text-brown/80 sm:text-lg">{finale.small}</p>
        </Reveal>

        <motion.h2
          ref={bigRef}
          onViewportEnter={() => setTimeout(() => celebrate(), 900)}
          viewport={{ once: true, amount: 0.8 }}
          className="mt-6 font-display text-[clamp(3rem,11vw,7.5rem)] leading-[0.9] text-orange drop-shadow-[0_5px_0_var(--color-brown)]"
        >
          <BouncyWord text={finale.big} delay={0.8} />
        </motion.h2>
        <p className="mt-2 font-display text-[clamp(2.4rem,8vw,5.5rem)] leading-[1] text-ember">
          <Letters text={name} delay={1.6} step={0.07} />
        </p>

        <Reveal delay={0.3}>
          <p className="mt-10 font-serif text-lg text-brown/85 sm:text-xl">{finale.with}</p>
          <motion.p
            whileHover={{ rotate: -6, scale: 1.15 }}
            className="mt-3 inline-block font-display text-3xl text-brown"
          >
            {signature}
          </motion.p>
        </Reveal>

        <motion.button
          type="button"
          onClick={celebrate}
          initial={{ opacity: 0, scale: 0.6 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 260, damping: 12, delay: 2.2 }}
          whileHover={{ scale: 1.1, rotate: 3 }}
          whileTap={{ scale: 0.9, rotate: -6 }}
          className="mt-12 rounded-full border-4 border-brown bg-pink px-6 py-3 font-display text-lg text-cocoa shadow-[0_6px_0_var(--color-brown)]"
        >
          {finale.confetti}
        </motion.button>
      </div>

      <p className="mt-24 font-serif text-xs uppercase tracking-[0.3em] text-brown/50">{finale.footer}</p>
    </footer>
  );
}
