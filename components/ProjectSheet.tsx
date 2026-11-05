"use client";
import { useEffect } from "react";
import { motion, useDragControls } from "framer-motion";
import { Glass } from "glisse";
import type { Project } from "@/lib/projects";

/** Bottom sheet: drag the handle down, tap the backdrop, or press Esc to close. */
export default function ProjectSheet({ p, onClose }: { p: Project; onClose: () => void }) {
  const controls = useDragControls();
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", esc);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", esc); };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center" role="dialog" aria-modal="true" aria-label={p.title}>
      <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
      <motion.div className="relative w-full max-w-[520px]" drag="y" dragListener={false} dragControls={controls}
        dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0, bottom: 0.6 }}
        onDragEnd={(_, i) => { if (i.offset.y > 120 || i.velocity.y > 700) onClose(); }}
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", stiffness: 320, damping: 34 }}>
        <Glass className="!flex !max-h-[88dvh] !flex-col !gap-5 !overflow-y-auto !rounded-[36px_36px_0_0] !p-6 !pb-[calc(env(safe-area-inset-bottom)+24px)]"
          style={{ backgroundImage: `radial-gradient(120% 60% at 50% 0%, hsl(${p.hue} 100% 60% / .22), transparent 70%)` }}>
          <div onPointerDown={(e) => controls.start(e)} className="-mt-3 flex touch-none justify-center pb-2 pt-3">
            <span className="h-1.5 w-11 rounded-full bg-white/30" />
          </div>
          <div className="flex items-center gap-4">
            <span className="grid size-16 place-items-center rounded-[22px] text-3xl"
              style={{ background: `hsl(${p.hue} 100% 60% / .18)`, boxShadow: `0 0 34px hsl(${p.hue} 100% 55% / .45), inset 0 0 0 1px hsl(${p.hue} 100% 72% / .4)` }}>{p.icon}</span>
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight">{p.title}</h2>
              <p className="text-sm capitalize text-white/50">{p.section}</p>
            </div>
          </div>
          <p className="text-[15px] leading-relaxed text-white/75">{p.details}</p>
          {p.highlights.length > 0 && (
            <ul className="grid gap-2.5">
              {p.highlights.map((h, i) => (
                <motion.li key={h} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.07 }}
                  className="flex items-center gap-3 text-[14.5px] text-white/85">
                  <span className="size-1.5 rounded-full" style={{ background: `hsl(${p.hue} 100% 70%)`, boxShadow: `0 0 10px hsl(${p.hue} 100% 60%)` }} />{h}
                </motion.li>
              ))}
            </ul>
          )}
          <div className="flex flex-wrap gap-1.5">
            {p.tags.map((t) => (
              <span key={t} className="rounded-full px-2.5 py-1 text-xs font-medium"
                style={{ color: `hsl(${p.hue} 100% 80%)`, background: `hsl(${p.hue} 100% 60% / .12)` }}>{t}</span>
            ))}
          </div>
          <div className="grid gap-2.5">
            {p.links.map((l, k) => (
              <motion.a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" whileTap={{ scale: 0.95 }}
                className={k === 0
                  ? "rounded-2xl bg-white py-3.5 text-center text-[15px] font-semibold text-black shadow-[0_0_30px_rgb(255_255_255/.25)]"
                  : "rounded-2xl bg-white/10 py-3.5 text-center text-[15px] font-semibold ring-1 ring-inset ring-white/15"}>{l.label}</motion.a>
            ))}
          </div>
        </Glass>
      </motion.div>
    </div>
  );
}
