"use client";
import { useEffect } from "react";
import { motion, useDragControls } from "framer-motion";
import { Glass } from "glisse";
import ProjectIcon from "./ProjectIcon";
import Readme from "./Readme";
import type { Project } from "@/lib/projects";

const LANG: Record<string, string> = { Kotlin: "#a97bff", C: "#9aa0a6", "C++": "#f34b7d", CMake: "#da3434", Shell: "#89e051" };
const color = (n: string) => LANG[n] ?? "#6b7280";

/** Bottom sheet: drag the handle down, tap the backdrop, or press Esc to close. */
export default function ProjectSheet({ p, onClose }: { p: Project; onClose: () => void }) {
  const controls = useDragControls();
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.dataset.sheet = "1"; // pauses the aurora while the sheet is open
    window.addEventListener("keydown", esc);
    return () => { delete document.body.dataset.sheet; document.body.style.overflow = prev; window.removeEventListener("keydown", esc); };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center" role="dialog" aria-modal="true" aria-label={p.title}>
      <motion.div className="absolute inset-0 bg-black/70" onClick={onClose}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
      <motion.div className="relative w-full max-w-[560px]" drag="y" dragListener={false} dragControls={controls}
        dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0, bottom: 0.6 }}
        onDragEnd={(_, i) => { if (i.offset.y > 120 || i.velocity.y > 700) onClose(); }}
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", stiffness: 320, damping: 34 }}>
        <Glass className="!flex !max-h-[92dvh] !flex-col !gap-5 !overflow-y-auto !rounded-[36px_36px_0_0] !p-6 !pb-[calc(env(safe-area-inset-bottom)+24px)]"
          style={{ backgroundImage: `radial-gradient(120% 40% at 50% 0%, hsl(${p.hue} 100% 60% / .22), transparent 70%)` }}>
          <div onPointerDown={(e) => controls.start(e)} className="-mt-3 flex touch-none justify-center pb-2 pt-3">
            <span className="h-1.5 w-11 rounded-full bg-white/30" />
          </div>
          <div className="flex items-center gap-4">
            <span className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-[22px] text-3xl"
              style={{ background: `hsl(${p.hue} 100% 60% / .18)`, boxShadow: `0 0 34px hsl(${p.hue} 100% 55% / .45), inset 0 0 0 1px hsl(${p.hue} 100% 72% / .4)` }}>
              <ProjectIcon logo={p.logo} icon={p.icon} />
            </span>
            <div className="min-w-0">
              <h2 className="text-2xl font-extrabold tracking-tight">{p.title}</h2>
              <p className="text-sm text-white/50"><span className="capitalize">{p.section}</span>{p.license && ` · ${p.license}`}</p>
            </div>
          </div>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {p.links.map((l, k) => (
              <motion.a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" whileTap={{ scale: 0.95 }}
                className={k === 0
                  ? "rounded-2xl bg-white py-3.5 text-center text-[15px] font-semibold text-black shadow-[0_0_30px_rgb(255_255_255/.25)]"
                  : "rounded-2xl bg-white/10 py-3.5 text-center text-[15px] font-semibold ring-1 ring-inset ring-white/15"}>{l.label}</motion.a>
            ))}
          </div>
          {p.langs.length > 0 && (
            <div>
              <div className="flex h-2 gap-0.5 overflow-hidden rounded-full">
                {p.langs.map((l) => (
                  <motion.span key={l.name} initial={{ flexGrow: 0 }} animate={{ flexGrow: l.pct }} transition={{ duration: 0.9, delay: 0.2 }}
                    style={{ flexBasis: 0, minWidth: 3, background: color(l.name) }} />
                ))}
              </div>
              <div className="mt-2 flex flex-wrap gap-x-3.5 gap-y-1 text-xs text-white/55">
                {p.langs.map((l) => (
                  <span key={l.name} className="flex items-center gap-1.5">
                    <i className="size-2 rounded-full" style={{ background: color(l.name) }} />{l.name} {l.pct}%
                  </span>
                ))}
              </div>
            </div>
          )}
          <hr className="border-white/10" />
          <Readme id={p.id} repo={p.repo} fallback={p.details} />
        </Glass>
      </motion.div>
    </div>
  );
}
