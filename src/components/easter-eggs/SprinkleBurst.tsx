"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

/**
 * Sprinkles that fall from the logo when it is long-pressed.
 *
 * Wraps its children and listens for a sustained press. Particles are capped,
 * purely decorative, and `pointer-events: none`, so nothing underneath is ever
 * blocked. They clean themselves up on exit.
 *
 * Skipped entirely under `prefers-reduced-motion`: a burst of tumbling
 * particles is exactly what that setting is asking us not to do.
 */

const COLORS = ["var(--accent)", "var(--secondary)", "var(--tertiary)"];
const COUNT = 18;

type Sprinkle = {
  id: number;
  x: number;
  rotate: number;
  delay: number;
  color: string;
};

export function SprinkleBurst({ children }: { children: React.ReactNode }) {
  const [sprinkles, setSprinkles] = useState<Sprinkle[]>([]);
  const timer = useRef<number | null>(null);
  const allowed = useRef(true);

  useEffect(() => {
    allowed.current = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  function burst() {
    if (!allowed.current) return;
    const seed = Date.now();
    setSprinkles(
      Array.from({ length: COUNT }, (_, i) => ({
        id: seed + i,
        x: (Math.random() - 0.5) * 160,
        rotate: Math.random() * 720 - 360,
        delay: Math.random() * 0.25,
        color: COLORS[i % COLORS.length],
      })),
    );
    window.setTimeout(() => setSprinkles([]), 2600);
  }

  function startPress() {
    timer.current = window.setTimeout(burst, 550);
  }

  function cancelPress() {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  }

  useEffect(() => cancelPress, []);

  return (
    <span
      className="relative inline-block"
      onPointerDown={startPress}
      onPointerUp={cancelPress}
      onPointerLeave={cancelPress}
      onPointerCancel={cancelPress}
    >
      {children}

      <AnimatePresence>
        {sprinkles.map((sprinkle) => (
          <motion.span
            key={sprinkle.id}
            aria-hidden="true"
            initial={{ opacity: 1, y: 0, x: 0, rotate: 0 }}
            animate={{
              opacity: [1, 1, 0],
              y: 220,
              x: sprinkle.x,
              rotate: sprinkle.rotate,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1.9,
              delay: sprinkle.delay,
              // Gravity-ish: quick to fall, settling at the end.
              ease: [0.4, 0, 0.6, 1],
            }}
            className="pointer-events-none absolute start-1/2 top-full block h-2 w-[3px] rounded-full"
            style={{ backgroundColor: sprinkle.color }}
          />
        ))}
      </AnimatePresence>
    </span>
  );
}
