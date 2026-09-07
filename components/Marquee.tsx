import { content } from "@/app/content";

function Strip({
  words,
  className,
  reverse = false,
}: {
  words: readonly string[];
  className: string;
  reverse?: boolean;
}) {
  const row = [...words, ...words, ...words];
  return (
    <div className={`overflow-hidden border-y-4 border-brown py-3 ${className}`}>
      <div
        className="marquee-track flex w-max whitespace-nowrap hover:[animation-play-state:paused]"
        style={reverse ? { animationDirection: "reverse" } : undefined}
      >
        {row.map((word, i) => (
          <span key={i} className="flex items-center font-display text-2xl sm:text-3xl">
            <span className="px-5">{word}</span>
            <span className="text-ember" aria-hidden="true">
              ✿
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

/** Two strips crossing at slightly different angles. Hover to pause either. */
export function Marquee() {
  return (
    <div className="relative z-10 -my-4 overflow-x-clip py-6">
      <Strip words={content.marquee} className="-rotate-1 bg-mustard text-brown shadow-[0_10px_0_var(--color-orange)]" />
      <Strip
        words={content.marqueeTwo}
        reverse
        className="-mt-2 rotate-[1.5deg] bg-ember text-cream shadow-[0_10px_0_var(--color-brown)]"
      />
    </div>
  );
}
