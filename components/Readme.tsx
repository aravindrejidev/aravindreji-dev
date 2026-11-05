"use client";
import { Children, useEffect, useMemo, useRef, useState, type MouseEvent, type ReactElement } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import Mermaid from "./Mermaid";
import { PROFILE } from "@/data/profile";

const attrs = defaultSchema.attributes ?? {};
const schema = {
  ...defaultSchema,
  clobber: [],
  attributes: {
    ...attrs,
    "*": [...(attrs["*"] ?? []), "id", "align", "width", "height"],
    a: [...(attrs.a ?? []), "target", "rel"],
  },
};
const ABS = /^([a-z][a-z0-9+.-]*:|\/\/)/i;
const clean = (p: string) => p.replace(/^\.?\//, "");

/** Reads /readmes/<id>.md first, then the repo's own README from GitHub. */
function useReadme(id: string, repo: string) {
  const [md, setMd] = useState<string | null | undefined>(undefined);
  useEffect(() => {
    let off = false;
    const urls = [`/readmes/${id}.md`, ...(repo ? [`https://raw.githubusercontent.com/${PROFILE.user}/${repo}/HEAD/README.md`] : [])];
    (async () => {
      for (const u of urls) {
        try {
          const r = await fetch(u);
          if (r.ok) { const t = await r.text(); if (!off) setMd(t); return; }
        } catch {}
      }
      if (!off) setMd(null);
    })();
    return () => { off = true; };
  }, [id, repo]);
  return md;
}

export default function Readme({ id, repo, fallback }: { id: string; repo: string; fallback: string }) {
  const md = useReadme(id, repo);
  const root = useRef<HTMLDivElement>(null);
  // Parse and paint the README only after the sheet's slide-in has finished.
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 380); return () => clearTimeout(t); }, []);
  const components = useMemo<Components>(() => ({
    img: ({ src, alt, width, height }) => {
      const s = typeof src === "string" ? src : "";
      const url = ABS.test(s) ? s : `https://raw.githubusercontent.com/${PROFILE.user}/${repo}/HEAD/${clean(s)}`;
      // eslint-disable-next-line @next/next/no-img-element
      return <img src={url} alt={alt ?? ""} width={width} height={height} loading="lazy" />;
    },
    a: ({ href = "", children }) => {
      if (href.startsWith("#")) {
        const go = (e: MouseEvent) => {
          e.preventDefault();
          root.current?.querySelector(`[id="${href.slice(1)}"]`)?.scrollIntoView({ behavior: "smooth", block: "start" });
        };
        return <a href={href} onClick={go}>{children}</a>;
      }
      const url = ABS.test(href) ? href : `${PROFILE.github}/${repo}/blob/HEAD/${clean(href)}`;
      return <a href={url} target="_blank" rel="noopener noreferrer">{children}</a>;
    },
    table: ({ children }) => <div className="readme-scroll"><table>{children}</table></div>,
    pre: ({ children }) => {
      const c = Children.toArray(children)[0] as ReactElement<{ className?: string }> | undefined;
      return c?.props?.className?.includes("language-mermaid") ? <>{children}</> : <pre>{children}</pre>;
    },
    code: ({ className, children }) =>
      /language-mermaid/.test(className ?? "")
        ? <Mermaid code={String(children).trim()} />
        : <code className={className}>{children}</code>,
  }), [repo]);

  if (md === undefined || !ready) return <div className="grid gap-3">{[70, 100, 85].map((w) => <div key={w} className="h-4 animate-pulse rounded-full bg-white/10" style={{ width: `${w}%` }} />)}</div>;
  if (md === null) return <p className="text-[15px] leading-relaxed text-white/75">{fallback}</p>;
  return (
    <div ref={root} className="readme">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, [rehypeSanitize, schema]]} components={components}>{md}</ReactMarkdown>
    </div>
  );
}
