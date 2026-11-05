"use client";
import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useMotionValue, type MotionValue } from "framer-motion";

type Status = "on" | "prompt" | "off";
type Tilt = { x: MotionValue<number>; y: MotionValue<number>; status: Status; request: () => void };
type IOSOrientation = typeof DeviceOrientationEvent & { requestPermission?: () => Promise<"granted" | "denied"> };
const Ctx = createContext<Tilt | null>(null);
const clamp = (v: number) => Math.max(-0.5, Math.min(0.5, v));
const GESTURES = ["click", "touchend"] as const;

/**
 * Phone-tilt as motion values in -0.5..0.5.
 * Android: starts at once. iOS: needs a permission, asked on the first tap (and again on every
 * tap until answered) or from the "Tap to enable tilt" chip.
 */
export function TiltProvider({ children }: { children: ReactNode }) {
  const x = useMotionValue(0), y = useMotionValue(0);
  const [status, setStatus] = useState<Status>("off");
  const askRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (typeof DeviceOrientationEvent === "undefined") return;
    let last = 0, listening = false;
    const on = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      if (document.documentElement.dataset.perf === "min") return;
      if (e.timeStamp - last < 33) return; // ~30 Hz is plenty for a tilt
      last = e.timeStamp;
      const nx = clamp(e.gamma / 60), ny = clamp((e.beta - 45) / 60);
      if (Math.abs(nx - x.get()) < 0.01 && Math.abs(ny - y.get()) < 0.01) return; // ignore sensor noise
      x.set(nx); y.set(ny);
    };
    const start = () => {
      if (listening) return;
      listening = true;
      window.addEventListener("deviceorientation", on, { passive: true });
      setStatus("on");
    };
    const stopAsking = () => GESTURES.forEach((g) => window.removeEventListener(g, ask, true));
    const D = DeviceOrientationEvent as IOSOrientation;
    function ask() {
      if (!D.requestPermission || listening) return;
      D.requestPermission()
        .then((r) => { stopAsking(); if (r === "granted") start(); else setStatus("off"); })
        .catch(() => {}); // not a valid gesture yet: try again on the next tap
    }
    askRef.current = ask;
    if (typeof D.requestPermission === "function") {
      setStatus("prompt");
      GESTURES.forEach((g) => window.addEventListener(g, ask, true));
    } else start();
    return () => { stopAsking(); window.removeEventListener("deviceorientation", on); };
  }, [x, y]);

  const value = useMemo(() => ({ x, y, status, request: () => askRef.current() }), [x, y, status]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTilt(): Tilt {
  const c = useContext(Ctx);
  if (!c) throw new Error("useTilt must be used inside <TiltProvider>");
  return c;
}

/** Shown only on iPhones until the motion permission is granted. */
export function TiltHint() {
  const { status, request } = useTilt();
  if (status !== "prompt") return null;
  return (
    <button type="button" onClick={request}
      className="rounded-full bg-white/[.07] px-3.5 py-1.5 text-xs font-medium text-white/65 ring-1 ring-inset ring-white/15 active:scale-95">
      📱 Tap to enable tilt
    </button>
  );
}
