type SvgProps = { className?: string; style?: React.CSSProperties };

/** A fat, friendly daisy. Rounded petals, a mustard heart. */
export function Flower({ className = "", style }: SvgProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden="true">
      {Array.from({ length: 8 }).map((_, i) => (
        <ellipse
          key={i}
          cx="50"
          cy="22"
          rx="13"
          ry="22"
          fill="currentColor"
          transform={`rotate(${i * 45} 50 50)`}
        />
      ))}
      <circle cx="50" cy="50" r="14" fill="var(--color-mustard)" />
      <circle cx="50" cy="50" r="6" fill="var(--color-brown)" opacity="0.35" />
    </svg>
  );
}

/** The 70s sunset: a disc sliced into horizontal bands. */
export function Sun({ className = "", style }: SvgProps) {
  const bands = [
    { y: 0, h: 22, c: "var(--color-mustard)" },
    { y: 26, h: 18, c: "var(--color-orange)" },
    { y: 48, h: 14, c: "var(--color-ember)" },
    { y: 66, h: 11, c: "var(--color-pink)" },
    { y: 81, h: 8, c: "var(--color-brown)" },
    { y: 93, h: 7, c: "var(--color-cocoa)" },
  ];
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden="true">
      <defs>
        <clipPath id="sun-clip">
          <circle cx="50" cy="50" r="50" />
        </clipPath>
      </defs>
      <g clipPath="url(#sun-clip)">
        {bands.map((b) => (
          <rect key={b.y} x="0" y={b.y} width="100" height={b.h} fill={b.c} />
        ))}
      </g>
    </svg>
  );
}

/** Rainbow arcs, the ones that were painted on every van. */
export function Rainbow({ className = "", style }: SvgProps) {
  const colours = [
    "var(--color-ember)",
    "var(--color-orange)",
    "var(--color-mustard)",
    "var(--color-avocado)",
    "var(--color-teal)",
    "var(--color-pink)",
  ];
  return (
    <svg viewBox="0 0 200 100" className={className} style={style} aria-hidden="true">
      {colours.map((c, i) => (
        <path
          key={c}
          d={`M ${8 + i * 14} 100 A ${92 - i * 14} ${92 - i * 14} 0 0 1 ${192 - i * 14} 100`}
          fill="none"
          stroke={c}
          strokeWidth="12"
        />
      ))}
    </svg>
  );
}

/** A soft wave used as a section divider. `flip` turns it upside down. */
export function Wave({
  className = "",
  fill = "var(--color-cream)",
  flip = false,
}: {
  className?: string;
  fill?: string;
  flip?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 1440 90"
      preserveAspectRatio="none"
      className={`block w-full ${className}`}
      style={flip ? { transform: "scaleY(-1)" } : undefined}
      aria-hidden="true"
    >
      <path
        d="M0,40 C180,90 360,0 540,40 C720,80 900,0 1080,40 C1260,80 1350,20 1440,40 L1440,90 L0,90 Z"
        fill={fill}
      />
    </svg>
  );
}

/** A little peace sign, because of course. */
export function Peace({ className = "", style }: SvgProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden="true">
      <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="9" />
      <path
        d="M50 8 V92 M50 50 L20 80 M50 50 L80 80"
        fill="none"
        stroke="currentColor"
        strokeWidth="9"
        strokeLinecap="round"
      />
    </svg>
  );
}
