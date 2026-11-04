"use client";
import { useState } from "react";
import { AnimatePresence, LayoutGroup, MotionConfig, motion, useScroll, useSpring } from "framer-motion";
import { Glass, SegmentedControl } from "glisse";
import Aurora from "./Aurora";
import ProjectCard from "./ProjectCard";
import StatusPill from "./StatusPill";
import { PROFILE, PROJECTS } from "@/data/projects";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "android", label: "Android" },
  { value: "web", label: "Web" },
  { value: "oss", label: "Open Source" },
];

export default function Hub() {
  const [filter, setFilter] = useState("all");
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  const list = PROJECTS.filter((p) => filter === "all" || p.cat === filter);

  return (
    <MotionConfig reducedMotion="user">
      <Aurora />
      <motion.div style={{ scaleX: progress }} className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-linear-to-r from-neon via-plasma to-hot" />
      <main className="relative z-10 mx-auto max-w-[520px] px-[18px] pb-[calc(env(safe-area-inset-bottom)+40px)] pt-[calc(env(safe-area-inset-top)+40px)]">
        <section className="mb-7 flex flex-col items-center gap-4 text-center">
          <motion.div initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: 0 }}
            whileHover={{ rotate: 8, scale: 1.08 }} whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 260, damping: 16 }}>
            <Glass aria-hidden className="!grid !size-[88px] !place-items-center !rounded-[32px] text-4xl font-bold">A</Glass>
          </motion.div>
          <h1 className="overflow-hidden text-[clamp(48px,15vw,68px)] font-extrabold leading-none tracking-tighter" aria-label={PROFILE.name}>
            {PROFILE.name.split("").map((c, i) => (
              <motion.span key={i} aria-hidden className="inline-block bg-linear-to-b from-white to-white/45 bg-clip-text text-transparent"
                initial={{ y: "110%", rotate: 10, opacity: 0 }} animate={{ y: 0, rotate: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 190, damping: 17, delay: 0.2 + i * 0.05 }}>{c}</motion.span>
            ))}
          </h1>
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
            className="max-w-[30ch] text-[15px] leading-normal text-white/60">{PROFILE.tagline}</motion.p>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.9, type: "spring" }}>
            <StatusPill />
          </motion.div>
        </section>

        <div className="sticky top-[calc(env(safe-area-inset-top)+10px)] z-20 mb-6 flex justify-center">
          <SegmentedControl items={FILTERS} value={filter} onValueChange={setFilter} aria-label="Filter projects" />
        </div>

        <LayoutGroup>
          <motion.section layout className="grid gap-4">
            <AnimatePresence mode="popLayout">
              {list.map((p, i) => <ProjectCard key={p.id} p={p} index={i} />)}
            </AnimatePresence>
          </motion.section>
        </LayoutGroup>

        <motion.footer initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-10 flex flex-wrap justify-center gap-2.5">
          {[{ l: "GitHub", h: PROFILE.github, m: true }, { l: PROFILE.handle, h: PROFILE.instagram, m: false }].map((x) => (
            <motion.a key={x.l} href={x.h} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.07, y: -2 }} whileTap={{ scale: 0.9 }}
              className={x.m ? "rounded-full bg-white px-5 py-3 text-sm font-semibold text-black" : "rounded-full bg-white/10 px-5 py-3 text-sm font-semibold ring-1 ring-inset ring-white/15 backdrop-blur"}>
              {x.l}
            </motion.a>
          ))}
        </motion.footer>
      </main>
    </MotionConfig>
  );
}
