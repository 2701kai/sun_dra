"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { content } from "@/app/content";
import { Wave } from "./Ornaments";
import { Reveal, Words, stagger } from "./motion/Reveal";

function Equalizer({ on }: { on: boolean }) {
  return (
    <span aria-hidden="true" className="inline-flex h-4 items-end gap-[3px]">
      {[0.5, 0.9, 0.7, 1, 0.6].map((h, i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-sm bg-ember"
          animate={on ? { scaleY: [0.3, h, 0.4, 1, 0.3] } : { scaleY: 0.25 }}
          transition={on ? { duration: 0.9 + i * 0.13, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 }}
          style={{ height: 16, originY: 1 }}
        />
      ))}
    </span>
  );
}

function Turntable({ playing, onToggle }: { playing: boolean; onToggle: () => void }) {
  const { steelySan } = content;
  return (
    <div className="mx-auto w-[min(80vw,24rem)]">
      <div className="relative aspect-square">
      {/* sleeve, tilted out behind the platter */}
      <motion.div
        initial={{ x: -10, rotate: -2 }}
        animate={playing ? { x: -60, rotate: -8, y: -10 } : { x: -10, rotate: -2, y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 14 }}
        className="absolute inset-0 rounded-lg bg-mustard p-4 shadow-[8px_8px_0_var(--color-brown)]"
      >
        <div className="flex h-full flex-col justify-between border-4 border-brown/70 p-3">
          <div>
            <p className="font-display text-2xl leading-none text-ember sm:text-3xl">{steelySan.artist}</p>
            <p className="mt-1 font-serif text-xs font-semibold uppercase tracking-[0.25em] text-brown/80">{steelySan.album}</p>
          </div>
          <div className="space-y-1.5">
            {["bg-ember", "bg-orange", "bg-pink", "bg-teal", "bg-avocado"].map((c) => (
              <div key={c} className={`h-2 rounded-full ${c}`} />
            ))}
          </div>
        </div>
      </motion.div>

      {/* the record */}
      <motion.button
        type="button"
        onClick={onToggle}
        aria-pressed={playing}
        aria-label={playing ? steelySan.pause : steelySan.play}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="relative block aspect-square w-full cursor-pointer"
      >
        <div
          className="animate-spin-record absolute inset-0 rounded-full bg-cocoa shadow-[0_18px_40px_rgba(0,0,0,0.35)]"
          style={{
            animationPlayState: playing ? "running" : "paused",
            backgroundImage: "repeating-radial-gradient(circle at center, rgba(255,255,255,0.05) 0 2px, transparent 2px 6px)",
          }}
        >
          <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_200deg,transparent_0deg,rgba(255,255,255,0.14)_40deg,transparent_80deg,transparent_200deg,rgba(255,255,255,0.1)_240deg,transparent_280deg)]" />
          <div className="absolute left-1/2 top-1/2 flex h-[36%] w-[36%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-orange">
            <p className="absolute top-[18%] font-display text-[0.55rem] uppercase tracking-widest text-cream sm:text-[0.7rem]">
              {steelySan.artist}
            </p>
            <div className="h-[10%] w-[10%] rounded-full bg-cream" />
          </div>
        </div>

        {/* tonearm */}
        <motion.div
          aria-hidden="true"
          initial={false}
          animate={{ rotate: playing ? 22 : -8 }}
          transition={{ type: "spring", stiffness: 90, damping: 12 }}
          className="absolute -right-3 -top-3 h-[62%] w-4 origin-top"
        >
          <div className="absolute left-1/2 top-0 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brown shadow-[0_3px_0_var(--color-cocoa)]" />
          <div className="mx-auto h-full w-[6px] rounded-full bg-brown" />
          <div className="absolute bottom-0 left-1/2 h-8 w-3 -translate-x-1/2 rounded-b-md bg-ember" />
        </motion.div>
      </motion.button>
      </div>

      <motion.p
        animate={playing ? { opacity: [0.6, 1, 0.6] } : { opacity: 0.7 }}
        transition={{ duration: 1.6, repeat: Infinity }}
        className="mt-6 text-center font-serif text-sm uppercase tracking-[0.35em] text-brown"
      >
        {playing ? steelySan.nowPlaying : steelySan.play}
      </motion.p>
    </div>
  );
}

export function SteelySan() {
  const { steelySan } = content;
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [track, setTrack] = useState(-1);

  // Cycle the "now playing" highlight through the tracklist while the audio runs.
  useEffect(() => {
    if (!playing) return;
    setTrack(0);
    const id = setInterval(() => setTrack((t) => (t + 1) % steelySan.tracks.length), 2600);
    return () => clearInterval(id);
  }, [playing, steelySan.tracks.length]);

  async function toggle() {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      try {
        await a.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    } else {
      a.pause();
      setPlaying(false);
    }
  }

  const sideA = steelySan.tracks.slice(0, 5);
  const sideB = steelySan.tracks.slice(5);

  const list = (title: string, items: typeof sideA, offset: number) => (
    <motion.ol variants={stagger(0, 0.07)} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} className="space-y-1.5">
      <li className="mb-2 font-serif text-xs font-semibold uppercase tracking-[0.3em] text-ember">{title}</li>
      {items.map((t, i) => {
        const idx = offset + i;
        const active = playing && track === idx;
        return (
          <motion.li
            key={t.n}
            variants={{ hidden: { opacity: 0, x: -30 }, show: { opacity: 1, x: 0 } }}
            whileHover={{ x: 10, scale: 1.02 }}
            onClick={() => setTrack(idx)}
            className={`flex cursor-default items-baseline gap-3 rounded-2xl border-2 px-4 py-2 transition-colors ${
              active ? "border-ember bg-cream" : "border-brown/20 bg-cream/40"
            }`}
          >
            <span className="font-display text-ember">{t.n}</span>
            <span className="flex-1">
              <span className="font-serif text-base font-semibold text-brown sm:text-lg">{t.title}</span>
              <span className="block font-serif text-xs italic text-brown/60 sm:inline sm:before:content-['_·_']">{t.note}</span>
            </span>
            {active && <Equalizer on={playing} />}
          </motion.li>
        );
      })}
    </motion.ol>
  );

  return (
    <section className="relative bg-sand">
      <Wave className="absolute -top-px left-0 h-16 sm:h-24" fill="var(--color-cream)" flip />

      <audio ref={audioRef} loop preload="none" onEnded={() => setPlaying(false)}>
        <source src="/media/paradise.mp3" type="audio/mpeg" />
        <source src="/media/paradise.ogg" type="audio/ogg" />
      </audio>

      <div className="mx-auto max-w-6xl px-6 pb-28 pt-32 sm:pt-40">
        <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <Reveal amount={0.3}>
            <Turntable playing={playing} onToggle={toggle} />
          </Reveal>

          <div>
            <Reveal>
              <p className="font-display text-3xl text-ember sm:text-4xl">{steelySan.label}</p>
            </Reveal>
            <Words as="h2" text={steelySan.title} step={0.07} className="mt-2 font-display text-[clamp(2rem,5vw,3.8rem)] leading-[1] text-brown" />
            <Words text={steelySan.body} delay={0.3} step={0.018} className="mt-8 max-w-xl font-serif text-lg leading-relaxed text-brown/85 sm:text-xl" />

            <motion.button
              type="button"
              onClick={toggle}
              aria-pressed={playing}
              whileHover={{ scale: 1.06, rotate: -2 }}
              whileTap={{ scale: 0.94 }}
              className="mt-8 inline-flex items-center gap-3 rounded-full border-4 border-brown bg-orange px-6 py-3 font-display text-lg text-cream shadow-[0_6px_0_var(--color-brown)]"
            >
              <span>♪</span>
              {playing ? steelySan.pause : steelySan.play}
              {playing && <Equalizer on />}
            </motion.button>
          </div>
        </div>

        <div className="mt-20 grid gap-10 md:grid-cols-2 md:gap-8">
          {list(steelySan.sideA, sideA, 0)}
          {list(steelySan.sideB, sideB, 5)}
        </div>

        <Reveal delay={0.2} className="mt-10 flex flex-wrap items-center justify-between gap-4">
          <p className="max-w-xl font-serif text-xs italic text-brown/60 sm:text-sm">{steelySan.liner}</p>
          <a
            href={steelySan.otherHref}
            target="_blank"
            rel="noopener noreferrer"
            className="font-serif text-xs font-semibold uppercase tracking-[0.25em] text-ember underline decoration-2 underline-offset-4 hover:text-orange"
          >
            {steelySan.other} ↗
          </a>
        </Reveal>
      </div>

      <Wave className="absolute -bottom-px left-0 h-16 sm:h-24" fill="var(--color-cream)" />
    </section>
  );
}
