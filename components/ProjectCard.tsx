"use client";
import { useEffect, useRef, type KeyboardEvent, type PointerEvent } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Glass } from "glisse";
import ProjectIcon from "./ProjectIcon";
import { useTilt } from "@/lib/gyro";
import type { Project } from "@/lib/projects";

const spring = { stiffness: 170, damping: 15, mass: 0.6 };
type Props = { p: Project; index: number; pinned: boolean; onOpen: (p: Project) => void };

export default function ProjectCard({ p, index, pinned, onOpen }: Props) {
  const tilt = useTilt();
  const hovering = useRef(false);
  const mx = useMotionValue(0.5), my = useMotionValue(0.5);
  const rx = useSpring(0, spring), ry = useSpring(0, spring);
  const gx = useTransform(mx, (v) => `${v * 100}%`);
  const gy = useTransform(my, (v) => `${v * 100}%`);
  const glare = useMotionTemplate`radial-gradient(240px circle at ${gx} ${gy}, hsl(${p.hue} 100% 72% / .32), transparent 65%)`;

  // Gyro drives the tilt whenever a finger/cursor isn't on the card.
  useEffect(() => {
    const sync = () => {
      if (hovering.current) return;
      const x = tilt.x.get(), y = tilt.y.get();
      ry.set(x * 28); rx.set(-y * 28); mx.set(0.5 + x); my.set(0.5 + y);
    };
    const a = tilt.x.on("change", sync), b = tilt.y.on("change", sync);
    return () => { a(); b(); };
  }, [tilt, rx, ry, mx, my]);

  const move = (e: PointerEvent<HTMLElement>) => {
    hovering.current = true;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    mx.set(x); my.set(y); ry.set((x - 0.5) * 16); rx.set(-(y - 0.5) * 16);
  };
  const leave = () => { hovering.current = false; mx.set(0.5); my.set(0); rx.set(0); ry.set(0); };
  const key = (e: KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(p); } };

  return (
    <motion.article layout style={{ perspective: 1000 }}
      initial={{ opacity: 0, y: 48, scale: 0.92, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.88, filter: "blur(10px)" }}
      transition={{ type: "spring", stiffness: 240, damping: 26, delay: index * 0.07 }}>
      <motion.div role="button" tabIndex={0} aria-label={`Open ${p.title}`} onKeyDown={key}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }} className="cursor-pointer touch-pan-y"
        whileTap={{ scale: 0.97 }} onPointerMove={move} onPointerLeave={leave} onPointerUp={leave} onClick={() => onOpen(p)}>
        <Glass className="relative !flex !flex-col !gap-4 !overflow-hidden !rounded-[32px] !p-5"
          style={{ boxShadow: `0 30px 80px -30px hsl(${p.hue} 100% 55% / .45)` }}>
          <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: glare }} />
          {pinned && (
            <motion.span initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", delay: 0.3 }}
              className="absolute right-4 top-4 z-10 rounded-full bg-white/12 px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ring-white/20">
              📌 Pinned
            </motion.span>
          )}
          <div className="relative flex items-center gap-4" style={{ transform: "translateZ(40px)" }}>
            <motion.span animate={{ y: [0, -4, 0] }} transition={{ duration: 3.4 + index * 0.3, repeat: Infinity, ease: "easeInOut" }}
              className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-[20px] text-2xl"
              style={{ background: `hsl(${p.hue} 100% 60% / .16)`, boxShadow: `0 0 28px hsl(${p.hue} 100% 55% / .35), inset 0 0 0 1px hsl(${p.hue} 100% 72% / .4)` }}>
              <ProjectIcon logo={p.logo} icon={p.icon} />
            </motion.span>
            <div className="min-w-0">
              <h2 className="text-[22px] font-bold tracking-tight">{p.title}</h2>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {p.tags.map((t) => (
                  <span key={t} className="rounded-full px-2 py-0.5 text-[11.5px] font-medium"
                    style={{ color: `hsl(${p.hue} 100% 80%)`, background: `hsl(${p.hue} 100% 60% / .12)` }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
          <p className="relative line-clamp-2 text-[14.5px] leading-relaxed text-white/70" style={{ transform: "translateZ(24px)" }}>{p.blurb}</p>
          <div className="relative flex flex-wrap gap-2.5" style={{ transform: "translateZ(50px)" }}>
            {p.links.map((l, k) => (
              <motion.a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                whileHover={{ scale: 1.07, y: -2 }} whileTap={{ scale: 0.9 }} transition={{ type: "spring", stiffness: 500, damping: 20 }}
                className={k === 0
                  ? "rounded-full bg-white px-[18px] py-2.5 text-sm font-semibold text-black shadow-[0_0_26px_rgb(255_255_255/.28)]"
                  : "rounded-full bg-white/10 px-[18px] py-2.5 text-sm font-semibold text-white ring-1 ring-inset ring-white/15 backdrop-blur"}>
                {l.label}
              </motion.a>
            ))}
          </div>
        </Glass>
      </motion.div>
    </motion.article>
  );
}
