"use client";
import { useEffect, useId, useRef, useState } from "react";
import { useInView } from "framer-motion";

/** Loaded and rendered only when the diagram scrolls near the screen. */
export default function Mermaid({ code }: { code: string }) {
  const id = "m" + useId().replace(/\W/g, "");
  const ref = useRef<HTMLDivElement>(null);
  const near = useInView(ref, { once: true, margin: "300px" });
  const [svg, setSvg] = useState("");
  const [err, setErr] = useState(false);
  useEffect(() => {
    if (!near) return;
    let off = false;
    import("mermaid")
      .then(async ({ default: m }) => {
        m.initialize({ startOnLoad: false, theme: "dark", securityLevel: "strict", fontFamily: "inherit" });
        const r = await m.render(id, code);
        if (!off) setSvg(r.svg);
      })
      .catch(() => { if (!off) setErr(true); });
    return () => { off = true; };
  }, [near, code, id]);
  if (err) return <pre><code>{code}</code></pre>;
  if (!svg) return <div ref={ref} className="h-24 animate-pulse rounded-2xl bg-white/5" />;
  return <div className="readme-scroll" dangerouslySetInnerHTML={{ __html: svg }} />;
}
