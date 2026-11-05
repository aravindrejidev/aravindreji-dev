import raw from "@/data/projects.json";

export type Section = "apps" | "websites" | "contributions";
export type View = "all" | Section;
export type ProjectLink = { label: string; href: string };
export type Project = {
  id: string; title: string; blurb: string; details: string; icon: string;
  section: Section; tags: string[]; hue: number; links: ProjectLink[];
  highlights: string[]; pin: View[];
  repo: string; logo: string; license: string; langs: { name: string; pct: number }[];
};

export const VIEWS: { value: View; label: string; icon: string }[] = [
  { value: "all", label: "All", icon: "✦" },
  { value: "apps", label: "Apps", icon: "📱" },
  { value: "websites", label: "Websites", icon: "🌐" },
  { value: "contributions", label: "Contributions", icon: "🔀" },
];

const SECTIONS: Section[] = ["apps", "websites", "contributions"];
const HUE: Record<Section, number> = { apps: 190, websites: 285, contributions: 150 };
const str = (v: unknown, d = "") => (typeof v === "string" ? v : d);
const strs = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []);

/** Forgiving loader: a typo in data/projects.json skips that entry instead of breaking the site. */
function normalize(r: Record<string, unknown>): Project | null {
  const id = str(r.id), title = str(r.title), section = r.section as Section;
  if (!id || !title || !SECTIONS.includes(section)) {
    console.warn(`[projects] skipped invalid entry: ${id || title || "?"}`);
    return null;
  }
  const links = (Array.isArray(r.links) ? r.links : []) as { label?: unknown; href?: unknown }[];
  return {
    id, title, section,
    blurb: str(r.blurb), details: str(r.details, str(r.blurb)), icon: str(r.icon, "✦"),
    tags: strs(r.tags), highlights: strs(r.highlights),
    hue: typeof r.hue === "number" ? r.hue : HUE[section],
    links: links.flatMap((l) => (str(l.label) && str(l.href) ? [{ label: str(l.label), href: str(l.href) }] : [])),
    repo: str(r.repo), logo: str(r.logo), license: str(r.license),
    langs: ((Array.isArray(r.langs) ? r.langs : []) as { name?: unknown; pct?: unknown }[]).flatMap((l) => (str(l.name) && typeof l.pct === "number" ? [{ name: str(l.name), pct: l.pct }] : [])),
    pin: strs(r.pin).filter((v): v is View => v === "all" || SECTIONS.includes(v as Section)),
  };
}

export const PROJECTS: Project[] = (raw as unknown as Record<string, unknown>[])
  .map(normalize).filter((p): p is Project => p !== null);

/** Pins are per view: pinned in "apps" only floats up in Apps. */
export function projectsFor(view: View): Project[] {
  const list = PROJECTS.filter((p) => view === "all" || p.section === view);
  return [...list.filter((p) => p.pin.includes(view)), ...list.filter((p) => !p.pin.includes(view))];
}
