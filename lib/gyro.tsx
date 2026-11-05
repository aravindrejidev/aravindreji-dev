"use client";
import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";
import { useMotionValue, type MotionValue } from "framer-motion";

type Tilt = { x: MotionValue<number>; y: MotionValue<number> };
type IOSOrientation = typeof DeviceOrientationEvent & { requestPermission?: () => Promise<"granted" | "denied"> };
const Ctx = createContext<Tilt | null>(null);
const clamp = (v: number) => Math.max(-0.5, Math.min(0.5, v));

/** Phone-tilt as motion values in -0.5..0.5. iOS asks permission on the first tap. */
export function TiltProvider({ children }: { children: ReactNode }) {
  const x = useMotionValue(0), y = useMotionValue(0);
  useEffect(() => {
    if (typeof DeviceOrientationEvent === "undefined") return;
    const on = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      const nx = clamp(e.gamma / 60), ny = clamp((e.beta - 45) / 60);
      if (Math.abs(nx - x.get()) < 0.004 && Math.abs(ny - y.get()) < 0.004) return; // ignore sensor noise
      x.set(nx); y.set(ny);
    };
    const start = () => window.addEventListener("deviceorientation", on, { passive: true });
    const D = DeviceOrientationEvent as IOSOrientation;
    const ask = () => { D.requestPermission?.().then((r) => r === "granted" && start()).catch(() => {}); };
    if (typeof D.requestPermission === "function") window.addEventListener("click", ask, { once: true });
    else start();
    return () => { window.removeEventListener("click", ask); window.removeEventListener("deviceorientation", on); };
  }, [x, y]);
  const value = useMemo(() => ({ x, y }), [x, y]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTilt(): Tilt {
  const c = useContext(Ctx);
  if (!c) throw new Error("useTilt must be used inside <TiltProvider>");
  return c;
}
