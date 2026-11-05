"use client";
import { useEffect } from "react";
import { useTilt } from "@/lib/gyro";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";

const BLOBS = [
  { c: "#00e5ff", cls: "-top-[30vmax] -left-[25vmax] size-[70vmax] opacity-35", k: 40 },
  { c: "#a020f0", cls: "-bottom-[35vmax] -right-[30vmax] size-[70vmax] opacity-35", k: -60 },
  { c: "#ff2d95", cls: "top-[40%] left-[30%] size-[40vmax] opacity-15", k: 90 },
];
const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='.8' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

type BlobProps = (typeof BLOBS)[number] & { px: MotionValue<number>; py: MotionValue<number> };

function Blob({ c, cls, k, px, py }: BlobProps) {
  const x = useTransform(px, (v) => v * k);
  const y = useTransform(py, (v) => v * k);
  return (
    <motion.div
      className={`absolute rounded-full blur-[90px] ${cls}`}
      style={{ background: c, x, y }}
      animate={{ scale: [1, 1.15, 1], rotate: [0, 25, 0] }}
      transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

/** Pointer-parallax aurora. `data-glisse-backdrop` lets glisse bend it through the glass. */
export default function Aurora() {
  const mx = useMotionValue(0), my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 40, damping: 18 });
  const py = useSpring(my, { stiffness: 40, damping: 18 });
  const tilt = useTilt();
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
    <div data-glisse-backdrop aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {BLOBS.map((b) => <Blob key={b.c} {...b} px={px} py={py} />)}
      <div className="absolute inset-0 opacity-[.07] mix-blend-overlay" style={{ backgroundImage: NOISE }} />
    </div>
  );
}
