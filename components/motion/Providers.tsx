"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/** One place for global motion settings. `reducedMotion="user"` honours the OS setting. */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ type: "spring", stiffness: 260, damping: 22 }}>
      {children}
    </MotionConfig>
  );
}
