"use client";

import { useEffect, useState } from "react";

/**
 * Tracks scroll position and direction for the auto-hiding header.
 *
 * Reads are batched into a rAF callback rather than running on every scroll
 * event — scroll fires far more often than the screen refreshes, and touching
 * `scrollY` in the handler itself forces layout on each one.
 */
export function useScrollDirection({ threshold = 80 }: { threshold?: number } = {}) {
  const [direction, setDirection] = useState<"up" | "down">("up");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    function update() {
      const y = window.scrollY;
      setIsScrolled(y > 24);

      // Ignore sub-pixel jitter and iOS rubber-banding past the top.
      if (Math.abs(y - lastY) > 6 && y > 0) {
        setDirection(y > lastY && y > threshold ? "down" : "up");
        lastY = y;
      }
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return { direction, isScrolled };
}
