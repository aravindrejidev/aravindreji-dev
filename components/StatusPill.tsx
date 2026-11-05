"use client";
import { useEffect, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Glass } from "glisse";
import { PROFILE } from "@/data/profile";

function Equalizer() {
  return (
    <span aria-hidden className="flex h-4 items-end gap-0.5">
      {[0, 1, 2, 3].map((i) => (
        <i key={i} className="a-eq h-4 w-[3px] rounded-full bg-neon shadow-[0_0_8px_var(--color-neon)]"
          style={{ ["--dl" as string]: `${i * 0.17}s` } as CSSProperties} />
      ))}
    </span>
  );
}

export default function StatusPill() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % PROFILE.vibes.length), 3200);
    return () => clearInterval(t);
  }, []);
  return (
    <Glass aria-live="polite" className="!inline-flex !items-center !gap-3 !rounded-full !px-4 !py-2.5 text-sm font-medium">
      <Equalizer />
      <span className="relative inline-grid min-w-[17ch] overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={i} initial={{ y: 14, opacity: 0, filter: "blur(6px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }} exit={{ y: -14, opacity: 0, filter: "blur(6px)" }}
            transition={{ duration: 0.35 }}>{PROFILE.vibes[i]}</motion.span>
        </AnimatePresence>
      </span>
      <span className="relative flex size-2">
        <span className="a-ping absolute inset-0 rounded-full bg-emerald-400" />
        <span className="relative size-2 rounded-full bg-emerald-400" />
      </span>
    </Glass>
  );
}
