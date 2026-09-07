"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { audioLevel, isPlaying } from "@/lib/audio-bus";

/**
 * The flower field. A hand-rolled canvas particle system, no packages:
 * daisies drift like spores, gather around the bumblebee that follows your pointer,
 * and pulse to whatever the Steely San turntable is playing.
 */

const PETALS = ["#e36ba8", "#2f8f8a", "#d9622b", "#7a8b3e", "#e4a93a", "#b5432a", "#7fb7d9"];
const TAU = Math.PI * 2;

type Flower = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  petals: number;
  colour: string;
  rot: number;
  spin: number;
  phase: number;
  depth: number;
  bloom: number;
  life: number; // -1 = immortal, otherwise seconds left (bursts)
};

function rand(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function makeFlower(w: number, h: number, x?: number, y?: number, burst = false): Flower {
  const depth = rand(0.35, 1);
  return {
    x: x ?? rand(0, w),
    y: y ?? rand(0, h),
    vx: burst ? rand(-3, 3) : rand(-0.15, 0.15),
    vy: burst ? rand(-3.5, 1.5) : rand(-0.25, -0.05),
    r: burst ? rand(5, 11) : rand(6, 20),
    petals: 5 + Math.floor(rand(0, 4)),
    colour: PETALS[Math.floor(rand(0, PETALS.length))],
    rot: rand(0, TAU),
    spin: rand(-0.01, 0.01),
    phase: rand(0, TAU),
    depth,
    bloom: burst ? 0.2 : 1,
    life: burst ? rand(2.5, 4.5) : -1,
  };
}

function drawFlower(c: CanvasRenderingContext2D, f: Flower, scale: number) {
  const s = f.depth * f.bloom * scale;
  c.save();
  c.translate(f.x, f.y);
  c.rotate(f.rot);
  c.scale(s, s);
  c.globalAlpha = 0.22 + f.depth * 0.42;
  c.fillStyle = f.colour;
  for (let i = 0; i < f.petals; i++) {
    c.beginPath();
    c.ellipse(0, -f.r * 0.58, f.r * 0.34, f.r * 0.58, 0, 0, TAU);
    c.fill();
    c.rotate(TAU / f.petals);
  }
  c.fillStyle = "#e4a93a";
  c.beginPath();
  c.arc(0, 0, f.r * 0.3, 0, TAU);
  c.fill();
  c.fillStyle = "rgba(75,46,30,0.45)";
  c.beginPath();
  c.arc(0, 0, f.r * 0.13, 0, TAU);
  c.fill();
  c.restore();
}

function drawBee(c: CanvasRenderingContext2D, x: number, y: number, dir: number, t: number, buzz: number) {
  const flap = Math.sin(t * 0.045) * (0.5 + buzz * 0.4);
  c.save();
  c.translate(x, y);
  c.scale(dir * 1.25, 1.25);
  c.rotate(Math.sin(t * 0.006) * 0.12);

  // wings
  c.globalAlpha = 0.55;
  c.fillStyle = "#f6ead2";
  c.strokeStyle = "rgba(75,46,30,0.45)";
  c.lineWidth = 1;
  for (const side of [-1, 1]) {
    c.save();
    c.translate(-2, -7);
    c.rotate(side * (0.9 + flap * 0.5) - 0.9);
    c.beginPath();
    c.ellipse(0, -7, 5, 9, 0, 0, TAU);
    c.fill();
    c.stroke();
    c.restore();
  }

  // body
  c.globalAlpha = 1;
  c.fillStyle = "#e4a93a";
  c.beginPath();
  c.ellipse(0, 0, 13, 9, 0, 0, TAU);
  c.fill();
  c.save();
  c.beginPath();
  c.ellipse(0, 0, 13, 9, 0, 0, TAU);
  c.clip();
  c.fillStyle = "#2e1a10";
  for (const sx of [-6, 0, 6]) c.fillRect(sx - 1.8, -10, 3.6, 20);
  c.restore();
  c.strokeStyle = "#2e1a10";
  c.lineWidth = 1.5;
  c.beginPath();
  c.ellipse(0, 0, 13, 9, 0, 0, TAU);
  c.stroke();

  // head, eye, stinger
  c.fillStyle = "#2e1a10";
  c.beginPath();
  c.arc(13, -1, 5, 0, TAU);
  c.fill();
  c.fillStyle = "#f6ead2";
  c.beginPath();
  c.arc(14.5, -2.5, 1.4, 0, TAU);
  c.fill();
  c.beginPath();
  c.moveTo(-13, 0);
  c.lineTo(-18, 1.5);
  c.lineTo(-13, 3);
  c.closePath();
  c.fillStyle = "#2e1a10";
  c.fill();

  // antennae
  c.strokeStyle = "#2e1a10";
  c.lineWidth = 1.2;
  c.beginPath();
  c.moveTo(15, -5);
  c.quadraticCurveTo(18, -12, 22, -11);
  c.moveTo(12, -6);
  c.quadraticCurveTo(13, -13, 17, -14);
  c.stroke();
  c.restore();
}

export function FlowerField() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (reduce) return;
    const canvas = ref.current;
    if (!canvas) return;
    const c = canvas.getContext("2d");
    if (!c) return;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let flowers: Flower[] = [];
    let raf = 0;
    let last = performance.now();
    let level = 0;
    let hidden = document.hidden;
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    const pointer = { x: -9999, y: -9999, active: false, t: 0 };
    const bee = { x: 0, y: 0, vx: 0, vy: 0, dir: 1 };

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      c!.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = Math.round(Math.min(70, Math.max(24, (w * h) / 21000)));
      const base = flowers.filter((f) => f.life < 0);
      while (base.length < target) base.push(makeFlower(w, h));
      flowers = [...base.slice(0, target), ...flowers.filter((f) => f.life >= 0)];
      if (!pointer.active) {
        bee.x = w * 0.5;
        bee.y = h * 0.35;
      }
    }

    function burst(x: number, y: number, n = 14) {
      for (let i = 0; i < n; i++) flowers.push(makeFlower(w, h, x, y, true));
      if (flowers.length > 220) flowers.splice(0, flowers.length - 220);
    }

    function onMove(e: PointerEvent) {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
      pointer.t = performance.now();
    }
    function onDown(e: PointerEvent) {
      onMove(e);
      burst(e.clientX, e.clientY);
    }
    function onLeave() {
      pointer.active = false;
    }
    function onVis() {
      hidden = document.hidden;
      if (!hidden) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    }

    function frame(now: number) {
      if (hidden) return;
      const dt = Math.min(48, now - last) / 16.667; // in "frames" at 60fps
      last = now;
      const t = now;

      // audio
      const target = audioLevel();
      level += (target - level) * (target > level ? 0.35 : 0.08);
      const dancing = isPlaying();

      // bee: chase the pointer, or wander when nobody's there
      let tx: number;
      let ty: number;
      const idle = !pointer.active || (coarse && now - pointer.t > 4000);
      if (idle) {
        tx = w * 0.5 + Math.sin(t * 0.00037) * w * 0.35 + Math.sin(t * 0.0011) * 40;
        ty = h * 0.4 + Math.cos(t * 0.00051) * h * 0.25 + Math.cos(t * 0.0013) * 30;
      } else {
        tx = pointer.x + 26;
        ty = pointer.y - 22;
      }
      const ax = (tx - bee.x) * 0.012 * dt;
      const ay = (ty - bee.y) * 0.012 * dt;
      bee.vx = (bee.vx + ax) * Math.pow(0.86, dt);
      bee.vy = (bee.vy + ay) * Math.pow(0.86, dt);
      bee.x += bee.vx * dt;
      bee.y += bee.vy * dt + Math.sin(t * 0.008) * 0.6;
      if (Math.abs(bee.vx) > 0.3) bee.dir = bee.vx > 0 ? 1 : -1;
      const speed = Math.hypot(bee.vx, bee.vy);

      c!.clearRect(0, 0, w, h);

      for (let i = flowers.length - 1; i >= 0; i--) {
        const f = flowers[i];

        // gentle wind, gentle updraft
        f.vx += Math.sin(t * 0.0004 + f.phase) * 0.004 * dt;
        f.vy += (-0.0025 + Math.cos(t * 0.0006 + f.phase) * 0.003) * dt;

        // the bee gathers flowers around it
        const dx = bee.x - f.x;
        const dy = bee.y - f.y;
        const d = Math.hypot(dx, dy);
        let bloomTarget = 1;
        if (d < 230 && d > 1) {
          const k = (1 - d / 230) * 0.035 * dt;
          f.vx += (dx / d) * k - (dy / d) * k * 0.9; // pull in, swirl around
          f.vy += (dy / d) * k + (dx / d) * k * 0.9;
          bloomTarget = 1.55 - d / 230;
        }
        if (dancing) {
          bloomTarget *= 1 + level * 0.9;
          f.rot += level * 0.06 * dt;
        }
        f.bloom += (bloomTarget - f.bloom) * 0.12 * dt;

        const damp = Math.pow(f.life >= 0 ? 0.965 : 0.985, dt);
        f.vx *= damp;
        f.vy *= damp;
        f.x += f.vx * dt;
        f.y += f.vy * dt;
        f.rot += f.spin * dt;

        if (f.life >= 0) {
          f.life -= dt / 60;
          f.vy += 0.03 * dt; // bursts fall
          if (f.life <= 0) {
            flowers.splice(i, 1);
            continue;
          }
        } else {
          const m = 40;
          if (f.x < -m) f.x = w + m;
          if (f.x > w + m) f.x = -m;
          if (f.y < -m) f.y = h + m;
          if (f.y > h + m) f.y = -m;
        }

        drawFlower(c!, f, f.life >= 0 ? Math.min(1, f.life) : 1);
      }

      // a fast bee sheds petals
      if (speed > 6 && Math.random() < 0.35) {
        const f = makeFlower(w, h, bee.x - bee.dir * 10, bee.y + 4, true);
        f.r = rand(3, 6);
        f.life = rand(0.8, 1.6);
        f.vx = -bee.vx * 0.15 + rand(-0.5, 0.5);
        f.vy = rand(-0.5, 1);
        flowers.push(f);
      }

      drawBee(c!, bee.x, bee.y, bee.dir, t, Math.min(1, speed / 8 + level));
      raf = requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVis);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [reduce]);

  if (reduce) return null;
  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[55]" />;
}
