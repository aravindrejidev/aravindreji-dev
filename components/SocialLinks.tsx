"use client";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { PROFILE } from "@/data/profile";

const S = { width: 22, height: 22, viewBox: "0 0 24 24", "aria-hidden": true } as const;
const line = { fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round" } as const;

const ICONS: Record<string, ReactNode> = {
  github: (
    <svg {...S} fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  ),
  instagram: (
    <svg {...S} {...line} strokeWidth="1.9">
      <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5.2" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r=".9" fill="currentColor" stroke="none" />
    </svg>
  ),
  x: (
    <svg {...S} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  reddit: (
    <svg {...S} {...line} strokeWidth="1.7">
      <ellipse cx="12" cy="14.2" rx="7.6" ry="5.2" />
      <circle cx="4.3" cy="11.6" r="1.7" />
      <circle cx="19.7" cy="11.6" r="1.7" />
      <circle cx="9" cy="13.6" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="13.6" r="1.1" fill="currentColor" stroke="none" />
      <path d="M9.3 16.6c1.5 1.1 4 1.1 5.4 0" />
      <path d="M12 9l1.1-5 4.2 1" />
      <circle cx="18" cy="5.1" r="1.4" />
    </svg>
  ),
};

/** Logo-only social row. Each tile glows in its brand colour on hover / tap. */
export default function SocialLinks() {
  return (
    <nav aria-label="Social links" className="flex justify-center gap-3">
      {PROFILE.socials.map((s, i) => (
        <motion.a key={s.id} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} title={s.label}
          className="grid size-12 place-items-center rounded-2xl bg-white/[.07] text-white/85 ring-1 ring-inset ring-white/15 shadow-[inset_0_1px_0_rgb(255_255_255/.18)]"
          initial={{ opacity: 0, y: 14, scale: 0.7 }} animate={{ opacity: 1, y: 0, scale: 1 }}
          whileHover={{ scale: 1.14, y: -3, color: s.color, boxShadow: `0 10px 30px -6px ${s.color}88` }}
          whileTap={{ scale: 0.88, color: s.color }}
          transition={{ type: "spring", stiffness: 320, damping: 18, delay: 0.55 + i * 0.07 }}>
          {ICONS[s.id]}
        </motion.a>
      ))}
    </nav>
  );
}
