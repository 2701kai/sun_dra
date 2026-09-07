"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { content } from "@/app/content";
import { Flower, Wave } from "./Ornaments";
import { Reveal, Words, slideLeft } from "./motion/Reveal";

export function Paradise() {
  const { paradise } = content;
  const videoRef = useRef<HTMLVideoElement>(null);
  const section = useRef<HTMLElement>(null);
  const [muted, setMuted] = useState(true);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: section, offset: ["start end", "end start"] });
  const frameY = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const leafY = useTransform(scrollYProgress, [0, 1], [-120, 160]);

  function toggleSound() {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (v.paused) void v.play();
  }

  return (
    <section ref={section} className="relative overflow-hidden bg-olive text-cream">
      <Wave className="absolute -top-px left-0 h-16 sm:h-24" fill="var(--color-cream)" flip />

      {/* leaves blowing through the section on scroll */}
      <motion.div style={{ y: reduce ? 0 : leafY }} aria-hidden="true" className="pointer-events-none absolute inset-0">
        <Flower className="absolute left-[4%] top-[20%] w-10 text-avocado sm:w-16" />
        <Flower className="absolute right-[6%] top-[35%] w-14 text-mustard/70 sm:w-24" />
        <Flower className="absolute left-[45%] bottom-[12%] w-8 text-avocado sm:w-12" />
      </motion.div>

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-28 pt-32 sm:pt-40 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <Reveal variants={slideLeft} className="order-2 mx-auto w-full max-w-xs lg:order-1 lg:max-w-sm">
          <motion.figure style={{ y: reduce ? 0 : frameY }}>
            <div className="relative">
              <motion.div
                animate={{ rotate: [0, 2, -1, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -inset-4 -z-10 rounded-[999px_999px_40px_40px] bg-mustard"
              />
              <motion.div
                animate={{ x: [16, 22, 12, 16], y: [16, 10, 22, 16] }}
                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -inset-4 -z-20 rounded-[999px_999px_40px_40px] bg-ember"
              />
              <div className="arch relative aspect-[474/850] overflow-hidden bg-cocoa">
                <video
                  ref={videoRef}
                  className="h-full w-full object-cover"
                  poster="/media/paradise-poster.jpg"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                >
                  <source src="/media/paradise.mp4" type="video/mp4" />
                  <source src="/media/paradise.webm" type="video/webm" />
                </video>
              </div>
              <motion.button
                type="button"
                onClick={toggleSound}
                aria-pressed={!muted}
                animate={muted ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                transition={{ duration: 1.4, repeat: muted ? Infinity : 0, ease: "easeInOut" }}
                whileHover={{ scale: 1.1, rotate: -3 }}
                whileTap={{ scale: 0.92 }}
                className="absolute -bottom-5 left-1/2 -translate-x-1/2 rounded-full border-4 border-brown bg-mustard px-5 py-2 font-display text-sm text-brown shadow-[0_6px_0_var(--color-brown)]"
              >
                {muted ? `♪ ${paradise.soundOn}` : `♪ ${paradise.soundOff}`}
              </motion.button>
            </div>
            <figcaption className="mt-10 text-center font-serif text-sm italic text-cream/70">{paradise.caption}</figcaption>
          </motion.figure>
        </Reveal>

        <div className="order-1 lg:order-2">
          <Reveal>
            <p className="font-serif text-sm uppercase tracking-[0.35em] text-mustard">{paradise.label}</p>
          </Reveal>
          <Words
            as="h2"
            text={paradise.title}
            step={0.07}
            className="mt-4 font-display text-[clamp(2.4rem,6vw,4.6rem)] leading-[0.95] text-cream"
          />
          <Words
            text={paradise.body}
            delay={0.3}
            step={0.018}
            className="mt-8 max-w-xl font-serif text-lg leading-relaxed text-cream/85 sm:text-xl"
          />
        </div>
      </div>

      <Wave className="absolute -bottom-px left-0 h-16 sm:h-24" fill="var(--color-cream)" />
    </section>
  );
}
