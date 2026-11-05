"use client";
import { useEffect, useState } from "react";

/**
 * Keeps the hub smooth on any phone without touching the animations:
 *  - pauses the ambient aurora while you scroll (so the glass isn't re-filtered every frame)
 *  - in "auto" mode watches the frame rate and, only if the phone struggles, swaps the glass
 *    refraction for plain frosted glass (level 1), then also freezes aurora + gyro (level 2).
 * The choice is remembered. Tap the small label in the footer to force Full or Lite.
 */
type Mode = "auto" | "full" | "lite";
const LEVELS = ["full", "lite", "min"] as const;
const NEXT: Record<Mode, Mode> = { auto: "full", full: "lite", lite: "auto" };
const root = () => document.documentElement;
const save = (k: string, v: string) => { try { localStorage.setItem(k, v); } catch {} };

export default function PerfGovernor() {
  const [mode, setMode] = useState<Mode>("auto");
  const [level, setLevel] = useState(0);

  useEffect(() => {
    try {
      const m = localStorage.getItem("perf-mode") as Mode | null;
      if (m && m in NEXT) setMode(m);
      setLevel(Math.min(2, Number(localStorage.getItem("perf-level")) || 0));
    } catch {}
  }, []);

  useEffect(() => {
    root().dataset.perf = mode === "auto" ? LEVELS[level] : mode === "full" ? "full" : "lite";
  }, [mode, level]);

  // Pause the ambient animation while scrolling.
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const on = () => {
      if (!root().hasAttribute("data-scrolling")) root().setAttribute("data-scrolling", "");
      clearTimeout(t);
      t = setTimeout(() => root().removeAttribute("data-scrolling"), 160);
    };
    window.addEventListener("scroll", on, { passive: true });
    return () => { window.removeEventListener("scroll", on); clearTimeout(t); };
  }, []);

  // Frame-rate watchdog: runs for the first seconds, then in short bursts while scrolling.
  useEffect(() => {
    if (mode !== "auto" || level >= 2) return;
    let raf = 0, running = false, off = false;
    const burst = (ms: number) => {
      if (running || off) return;
      running = true;
      const start = performance.now();
      let last = 0, n = 0, slow = 0;
      const tick = (t: number) => {
        if (off) return;
        const d = t - last;
        if (last && t - start > 700 && d < 500) { n++; if (d > 25) slow++; }
        last = t;
        if (n >= 50) {
          if (slow / n > 0.4) {
            const next = level + 1;
            save("perf-level", String(next)); setLevel(next); running = false; return;
          }
          n = 0; slow = 0;
        }
        if (t - start < ms) raf = requestAnimationFrame(tick); else running = false;
      };
      raf = requestAnimationFrame(tick);
    };
    burst(9000);
    const onScroll = () => burst(2500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { off = true; cancelAnimationFrame(raf); window.removeEventListener("scroll", onScroll); };
  }, [mode, level]);

  const label = mode === "auto" ? `Auto · ${LEVELS[level] === "full" ? "Full" : "Lite"}` : mode === "full" ? "Full" : "Lite";
  return (
    <button type="button" className="w-full text-center text-xs text-white/35 active:text-white/70"
      onClick={() => { const m = NEXT[mode]; setMode(m); save("perf-mode", m); }}
      aria-label="Glass quality">
      Glass quality: {label}
    </button>
  );
}
