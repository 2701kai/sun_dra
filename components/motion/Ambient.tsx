"use client";

import { animate, motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { useEffect, useMemo, useRef } from "react";
import { Flower, Peace } from "../Ornaments";

/** Rainbow progress bar pinned to the top of the viewport. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 });
  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[70] h-2 origin-left bg-[linear-gradient(90deg,var(--color-ember),var(--color-orange),var(--color-mustard),var(--color-avocado),var(--color-teal),var(--color-pink))]"
      style={{ scaleX }}
    />
  );
}

type Bit = { id: number; x: number; size: number; duration: number; delay: number; kind: "flower" | "peace"; colour: string };

/** Flowers and peace signs drifting up behind everything, all page long. */
export function Drift({ count = 14 }: { count?: number }) {
  const reduce = useReducedMotion();
  const bits = useMemo<Bit[]>(() => {
    const colours = ["text-pink", "text-teal", "text-orange", "text-avocado", "text-mustard", "text-ember"];
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: (i * 71) % 100,
      size: 18 + ((i * 37) % 40),
      duration: 18 + ((i * 13) % 16),
      delay: -((i * 7) % 20),
      kind: i % 4 === 0 ? "peace" : "flower",
      colour: colours[i % colours.length],
    }));
  }, [count]);

  if (reduce) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {bits.map((b) => (
        <motion.div
          key={b.id}
          className={`absolute opacity-25 ${b.colour}`}
          style={{ left: `${b.x}vw`, width: b.size, bottom: -b.size * 2 }}
          animate={{ y: ["0vh", "-120vh"], rotate: [0, b.id % 2 ? 360 : -360], x: [0, 30, -30, 0] }}
          transition={{
            y: { duration: b.duration, repeat: Infinity, ease: "linear", delay: b.delay },
            rotate: { duration: b.duration, repeat: Infinity, ease: "linear", delay: b.delay },
            x: { duration: b.duration / 3, repeat: Infinity, ease: "easeInOut", delay: b.delay },
          }}
        >
          {b.kind === "peace" ? <Peace className="w-full" /> : <Flower className="w-full" />}
        </motion.div>
      ))}
    </div>
  );
}

/** Little flowers that bloom wherever the pointer goes, then fade. Mouse only. */
export function CursorTrail() {
  const reduce = useReducedMotion();
  const layer = useRef<HTMLDivElement>(null);
  const last = useRef(0);

  useEffect(() => {
    if (reduce) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const colours = ["#e36ba8", "#2f8f8a", "#d9622b", "#7a8b3e", "#e4a93a"];
    let n = 0;

    function onMove(e: PointerEvent) {
      const now = performance.now();
      if (now - last.current < 55) return;
      last.current = now;
      const host = layer.current;
      if (!host || host.childElementCount > 28) return;

      const el = document.createElement("div");
      const size = 10 + Math.random() * 14;
      el.style.cssText = `position:absolute;left:${e.clientX - size / 2}px;top:${e.clientY - size / 2}px;width:${size}px;height:${size}px;color:${colours[n++ % colours.length]};pointer-events:none;`;
      el.innerHTML =
        '<svg viewBox="0 0 100 100" width="100%" height="100%"><g fill="currentColor">' +
        [0, 60, 120].map((r) => `<ellipse cx="50" cy="50" rx="48" ry="16" transform="rotate(${r} 50 50)"/>`).join("") +
        '</g><circle cx="50" cy="50" r="12" fill="#f6ead2"/></svg>';
      host.appendChild(el);

      animate(
        el,
        { scale: [0, 1.2, 0], rotate: [0, 90 + Math.random() * 120], y: [0, -30 - Math.random() * 30], opacity: [1, 1, 0] },
        { duration: 0.9 + Math.random() * 0.4, ease: "easeOut" },
      ).then(() => el.remove());
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce]);

  return <div ref={layer} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[65]" />;
}

/** Throws a pile of confetti from a point. Works on any element; falls back to the viewport centre. */
export function confetti(origin?: { x: number; y: number }, amount = 110) {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const colours = ["#d9622b", "#e4a93a", "#7a8b3e", "#2f8f8a", "#e36ba8", "#b5432a", "#7fb7d9"];
  const ox = origin?.x ?? window.innerWidth / 2;
  const oy = origin?.y ?? window.innerHeight / 2;
  const layer = document.createElement("div");
  layer.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:80;overflow:hidden;";
  document.body.appendChild(layer);

  const pieces = Array.from({ length: amount }, (_, i) => {
    const el = document.createElement("div");
    const w = 6 + Math.random() * 8;
    const h = 8 + Math.random() * 12;
    const round = i % 3 === 0;
    el.style.cssText = `position:absolute;left:${ox}px;top:${oy}px;width:${w}px;height:${round ? w : h}px;background:${colours[i % colours.length]};border-radius:${round ? "50%" : "2px"};will-change:transform;`;
    layer.appendChild(el);
    const angle = Math.random() * Math.PI * 2;
    const power = 260 + Math.random() * 520;
    const dx = Math.cos(angle) * power;
    const dy = Math.sin(angle) * power * 0.7 - 260;
    return animate(
      el,
      {
        x: [0, dx, dx + (Math.random() - 0.5) * 120],
        y: [0, dy, window.innerHeight + 80],
        rotate: [0, Math.random() * 720 - 360, Math.random() * 1440 - 720],
        opacity: [1, 1, 0.9],
      },
      { duration: 1.9 + Math.random() * 1.2, ease: ["easeOut", "easeIn"], times: [0, 0.35, 1] },
    );
  });

  Promise.all(pieces).then(() => layer.remove());
}
