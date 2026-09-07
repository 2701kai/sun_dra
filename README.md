# sun_dra

An over-the-top, 70s-hearted birthday celebration for Sandra: a free spirit who travelled twenty thousand kilometres to arrive at herself, and built a paradise when she got there.

Next.js 16 (App Router, Turbopack), React 19, TypeScript 7, Tailwind CSS 4, Motion 13, Bun.

## Run it

```sh
bun install
bun dev        # http://localhost:3000
bun run build  # production build
bun start
```

## What moves

Everything, on purpose. Motion (motion.dev) does the heavy lifting; only `transform`, `opacity` and `filter` are animated, and `prefers-reduced-motion` is honoured globally through `MotionConfig`.

- **Hero**: sunburst scales with scroll, the sun springs up, the name bounces in letter by letter (hover a letter, it jumps), the flowers are draggable and float when you leave them alone.
- **The flower field** (`components/motion/FlowerField.tsx`): a hand-rolled canvas particle system, no packages, in the spirit of the spores on Titis on Decks. Daisies drift like spores across the whole page, a bumblebee (the *lekker hommeltje*) follows your pointer and the flowers gather and bloom around it, a click or tap bursts a handful more, a fast bee sheds petals, and while the turntable plays the whole field pulses to the music through a Web Audio analyser (`lib/audio-bus.ts`). On phones the bee wanders on its own.
- **Ambient**: a rainbow scroll-progress bar.
- **20,000 km**: the number counts up, the road draws itself with a sun riding along it, the photo parallaxes and tilts.
- **From Borkum to paradise**: the route draws itself, the stops pop in, and the hommeltje flies the whole way as you scroll (a wide route on landscape screens, a tall one on phones). Four stop cards below: Borkum, Amsterdam, everywhere between, Aotearoa. Add or rename stops in `content.ts`; the route geometry lives at the top of `components/Journey.tsx`.
- **Paradise**: word-by-word headlines, the video frame drifts, the sound button pulses until pressed.
- **The river**: ripples, two-speed parallax, photos straighten on hover.
- **Sovereign**: lines slam in from alternating sides, peace signs rotate with scroll.
- **The best one**: cards fly in, a "best version, incl. all earlier versions" stamp slams down and fires confetti.
- **Steely San**: a turntable. Drop the needle and the record spins, the tonearm swings over, the sleeve slides out, an equaliser dances, and the "now playing" highlight walks through a ten-track list of her strengths (Side A) and achievements (Side B). Audio for this first pressing is the soundtrack of her own paradise walk.
- **Finale**: the rainbow paints itself, "Happy Birthday" bounces in, confetti fires on arrival and on demand.

## Edit it

- **Every word** is in `app/content.ts`: name, signature, all copy, the tracklist, the Spotify link.
- **Media** lives in `public/media/`. Swap a file, keep the name.
  - `sandra-sun.webp`, `sandra-couch.webp`, `river-pool.webp`, `river-above.webp`
  - `paradise.mp4` / `paradise.webm` + `paradise-poster.jpg` (the walk, with sound toggle)
  - `grin.mp4` / `grin.webm` + `grin-poster.jpg` (the tongue-out loop), `sandra-grin.gif` (same clip as a GIF)
  - `paradise.mp3` / `paradise.ogg` (the Steely San audio; drop any other track in under the same names)
- **Colours and fonts** are Tailwind theme tokens at the top of `app/globals.css`. Shrikhand for display, Fraunces for everything else, both via `next/font/google`.
- **Sections** are one component each in `components/`, stacked in `app/page.tsx`. Shared motion helpers (`Reveal`, `Words`, `Letters`, `confetti`, `ScrollProgress`, `FlowerField`) live in `components/motion/`.

## Deploy

Plain Next.js: `vercel` from the project root, or connect the repo in the Vercel dashboard. No env vars, no database, no server actions.

## Notes

- No lyrics anywhere, only titles. Keep it that way.
- The turntable audio is whatever was playing in the video. If that's a commercial track, swap it before the page goes anywhere public.

Author: 2701kai
