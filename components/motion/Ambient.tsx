"use client";

import { animate, motion, useScroll, useSpring } from "motion/react";

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
