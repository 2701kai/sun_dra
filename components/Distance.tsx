"use client";

import Image from "next/image";
import { animate, motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { content } from "@/app/content";
import { Reveal, Words, slideRight } from "./motion/Reveal";

function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(reduce ? to : 0);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, to, {
      duration: 2.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduce, to]);

  return (
    <span ref={ref} className="tabular-nums">
      {value.toLocaleString("en-NZ")}
    </span>
  );
}

export function Distance() {
  const { distance } = content;
  const section = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: section, offset: ["start end", "end start"] });
  const photoY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const photoRotate = useTransform(scrollYProgress, [0, 1], [-3, 3]);
  const bgRotate = useTransform(scrollYProgress, [0, 1], [8, -6]);

  return (
    <section
      id="distance"
      ref={section}
      className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 sm:py-32 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20"
    >
      <div>
        <Reveal>
          <p className="font-display text-[clamp(4rem,14vw,9rem)] leading-none text-ember">
            <CountUp to={distance.number} />
          </p>
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            whileInView={{ opacity: 1, letterSpacing: "0.3em" }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="-mt-2 font-serif text-2xl uppercase text-brown/70"
          >
            {distance.unit}
          </motion.p>
        </Reveal>

        <Words
          as="h2"
          text={distance.title}
          delay={0.2}
          className="mt-10 max-w-xl font-serif text-3xl font-semibold leading-tight text-brown sm:text-4xl"
        />
        <Words
          text={distance.body}
          delay={0.4}
          step={0.02}
          className="mt-6 max-w-xl font-serif text-lg leading-relaxed text-brown/85 sm:text-xl"
        />

        {/* the long dotted road draws itself, and a little sun rides along it */}
        <Reveal delay={0.3} className="mt-10">
          <svg viewBox="0 0 400 90" className="w-full max-w-md overflow-visible text-brown/70" aria-hidden="true">
            <circle cx="14" cy="70" r="6" fill="currentColor" />
            <motion.path
              d="M14 70 C 90 -10, 190 130, 300 40 S 380 20, 386 26"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2.4, ease: "easeInOut", delay: 0.3 }}
            />
            <motion.g
              initial={{ offsetDistance: "0%", scale: 0 }}
              whileInView={{ offsetDistance: "100%", scale: 1 }}
              viewport={{ once: true }}
              transition={{ offsetDistance: { duration: 2.4, ease: "easeInOut", delay: 0.3 }, scale: { delay: 0.3 } }}
              style={{ offsetPath: "path('M14 70 C 90 -10, 190 130, 300 40 S 380 20, 386 26')", offsetRotate: "0deg" }}
            >
              <circle r="13" fill="var(--color-mustard)" stroke="var(--color-orange)" strokeWidth="3" />
            </motion.g>
          </svg>
          <p className="mt-2 font-serif text-sm italic text-brown/70">{distance.aside}</p>
        </Reveal>
      </div>

      <Reveal variants={slideRight} delay={0.15} className="relative mx-auto w-full max-w-sm lg:max-w-none">
        <motion.figure
          style={{ y: reduce ? 0 : photoY, rotate: reduce ? 0 : photoRotate }}
          whileHover={{ scale: 1.03 }}
          className="relative"
        >
          <motion.div
            style={{ rotate: reduce ? 2 : bgRotate }}
            className="absolute -inset-3 -z-10 rounded-[999px_999px_36px_36px] bg-orange"
          />
          <div className="absolute -inset-3 -z-20 -rotate-3 rounded-[999px_999px_36px_36px] bg-avocado" />
          <div className="arch relative aspect-[3/4] overflow-hidden bg-sand">
            <Image
              src="/media/sandra-sun.webp"
              alt="Sandra, laughing into the sun on a bright day, green fields behind her"
              fill
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover"
              priority
            />
          </div>
        </motion.figure>
      </Reveal>
    </section>
  );
}
