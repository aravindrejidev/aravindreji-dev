export type Category = "android" | "web" | "oss";
export type ProjectLink = { label: string; href: string };
export type Project = {
  id: string; title: string; blurb: string; icon: string;
  cat: Category; tags: string[]; hue: number; links: ProjectLink[];
};

export const PROFILE = {
  name: "Aravind",
  handle: "@gh9aravind_3000",
  github: "https://github.com/aravindrejidev",
  instagram: "https://instagram.com/gh9aravind_3000",
  tagline: "Apps, web experiments and open source, built for the love of sound and code.",
  vibes: ["Vibe coding", "Hi-Res audio on repeat", "Shipping at 2 a.m.", "Tuning the DAC"],
};

const GH = PROFILE.github;
// ✏️ Replace with your real projects. Links point to your GitHub for now.
export const PROJECTS: Project[] = [
  { id: "glass-player", title: "Glass Player", icon: "🎧", cat: "android", hue: 190,
    blurb: "Bit-perfect music player with a liquid glass UI and parametric EQ.",
    tags: ["Kotlin", "Hi-Res", "FLAC"],
    links: [{ label: "Download", href: GH }, { label: "GitHub", href: GH }] },
  { id: "signal-lab", title: "Signal Lab", icon: "📡", cat: "web", hue: 285,
    blurb: "Live audio spectrum and frequency-response visualiser in the browser.",
    tags: ["Next.js", "WebAudio"],
    links: [{ label: "Live Demo", href: GH }, { label: "GitHub", href: GH }] },
  { id: "dotfiles-zero", title: "dotfiles-zero", icon: "⌘", cat: "oss", hue: 150,
    blurb: "Minimal, fast terminal and editor setup. Clone, run, done.",
    tags: ["Shell", "Neovim"], links: [{ label: "GitHub", href: GH }] },
  { id: "amp-notes", title: "Amp Notes", icon: "🔊", cat: "android", hue: 25,
    blurb: "Pocket notebook for IEMs, DACs and amps: gear, measurements, impressions.",
    tags: ["Jetpack Compose"],
    links: [{ label: "Download", href: GH }, { label: "GitHub", href: GH }] },
  { id: "vibe-kit", title: "Vibe Kit", icon: "✨", cat: "oss", hue: 330,
    blurb: "Tiny React toolkit of glass, glow and spring-physics primitives.",
    tags: ["TypeScript", "React"],
    links: [{ label: "GitHub", href: GH }, { label: "Live Demo", href: GH }] },
];
