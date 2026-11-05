"use client";
import { useEffect, useLayoutEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useTilt } from "@/lib/gyro";

// Soft gradients instead of blur() filters, and CSS keyframes instead of JS loops:
// the looping drift now runs on the compositor and costs the main thread nothing.
const BLOBS = [
  { c: "0 229 255", cls: "-top-[30vmax] -left-[25vmax] size-[75vmax] opacity-40", k: 40, d: "0s" },
  { c: "160 32 240", cls: "-bottom-[35vmax] -right-[30vmax] size-[75vmax] opacity-40", k: -60, d: "-8s" },
  { c: "255 45 149", cls: "top-[40%] left-[30%] size-[45vmax] opacity-20", k: 90, d: "-14s" },
];
const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='.8' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

type BlobProps = (typeof BLOBS)[number] & { px: MotionValue<number>; py: MotionValue<number> };

function Blob({ c, cls, k, d, px, py }: BlobProps) {
  const x = useTransform(px, (v) => v * k);
  const y = useTransform(py, (v) => v * k);
  return (
    <motion.div className={`absolute will-change-transform ${cls}`} style={{ x, y }}>
      <div className="a-drift size-full rounded-full"
        style={{ animationDelay: d, background: `radial-gradient(closest-side, rgb(${c} / .95) 40%, rgb(${c} / 0) 100%)` }} />
    </motion.div>
  );
}

export default function Aurora() {
  const root = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0), my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 40, damping: 18 });
  const py = useSpring(my, { stiffness: 40, damping: 18 });
  const tilt = useTilt();

  // On Chromium, glisse bends the live backdrop anyway. Marking the aurora as well would add a
  // per-frame lens loop for every glass, so the mark is kept only for Safari/iOS, which needs it.
  useLayoutEffect(() => {
    if (/Chrom(?:e|ium)\//.test(navigator.userAgent)) root.current?.removeAttribute("data-glisse-backdrop");
  }, []);

  useEffect(() => {
    const a = tilt.x.on("change", (v) => mx.set(v)), b = tilt.y.on("change", (v) => my.set(v));
    return () => { a(); b(); };
  }, [tilt, mx, my]);
  useEffect(() => {
    const move = (e: PointerEvent) => {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [mx, my]);

  return (
    <div ref={root} data-glisse-backdrop aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {BLOBS.map((b) => <Blob key={b.c} {...b} px={px} py={py} />)}
      <div className="absolute inset-0 opacity-[.05]" style={{ backgroundImage: NOISE }} />
    </div>
  );
}
