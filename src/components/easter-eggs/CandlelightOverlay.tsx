"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * The candlelight overlay.
 *
 * A fixed sheet that darkens the page, with a soft radial hole in it positioned
 * at the pointer. The result should read as a flame lighting the page rather
 * than a spotlight cutting through it.
 *
 * Performance is the whole design here. Pointer position is written to CSS
 * custom properties inside a single rAF loop and never enters React state: a
 * `setState` per `pointermove` would re-render the tree on every mouse movement
 * and drop frames badly. Only gradients move, so nothing reflows.
 *
 * The light also drifts and breathes slightly, driven by summed sine waves at
 * incommensurate frequencies. A perfectly still circle looks like a flashlight;
 * an irregular wobble looks like a flame.
 */
export function CandlelightOverlay({ onExit }: { onExit: () => void }) {
  const pathname = usePathname();

  // A moment, not a setting: changing page blows the candle out.
  useEffect(() => {
    onExit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    // Start centred so the effect is visible before the pointer first moves.
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let x = targetX;
    let y = targetY;
    let raf = 0;
    const start = performance.now();
    const root = document.documentElement;

    function onPointerMove(event: PointerEvent) {
      targetX = event.clientX;
      targetY = event.clientY;
    }

    function frame(now: number) {
      // Ease toward the pointer rather than snapping. The slight lag gives the
      // light weight, like a flame being carried across a room.
      x += (targetX - x) * 0.18;
      y += (targetY - y) * 0.18;

      const t = (now - start) / 1000;
      const flicker =
        Math.sin(t * 8.1) * 0.5 + Math.sin(t * 13.7) * 0.3 + Math.sin(t * 3.3) * 0.2;

      // Written to the document root rather than to one overlay: the darkness
      // layer and the warm-tint layer are siblings and must read the same
      // values, and custom properties only inherit downward.
      root.style.setProperty("--cx", `${x}px`);
      root.style.setProperty("--cy", `${y}px`);
      root.style.setProperty("--r", `${170 + flicker * 11}px`);

      raf = requestAnimationFrame(frame);
    }

    function onKeyDown(event: KeyboardEvent) {
      // Escape must always work. An overlay with no exit is a trap.
      if (event.key === "Escape") onExit();
    }

    raf = requestAnimationFrame(frame);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("keydown", onKeyDown);
      root.style.removeProperty("--cx");
      root.style.removeProperty("--cy");
      root.style.removeProperty("--r");
    };
  }, [onExit]);

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-60"
        style={{
          // Warm rather than neutral: the darkness should feel like a dim room,
          // not a grey scrim dropped over a webpage.
          background:
            "radial-gradient(circle at var(--cx, 50%) var(--cy, 50%), rgba(26,21,18,0) 0px, rgba(26,21,18,0.55) calc(var(--r, 170px) * 0.7), rgba(20,16,13,0.94) calc(var(--r, 170px) * 1.6))",
        }}
      />
      {/* Warm tint concentrated in the lit pool, sitting beneath the darkness. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-59 mix-blend-soft-light"
        style={{
          background:
            "radial-gradient(circle at var(--cx, 50%) var(--cy, 50%), rgba(229,170,66,0.5) 0px, rgba(229,170,66,0) calc(var(--r, 170px) * 1.2))",
        }}
      />
      <p role="status" aria-live="polite" className="sr-only">
        Candlelight on. Press Escape to blow it out.
      </p>
    </>
  );
}
