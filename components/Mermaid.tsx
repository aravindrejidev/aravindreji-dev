"use client";
import { useEffect, useId, useState } from "react";

/** Mermaid is loaded lazily, only when a README actually contains a diagram. */
export default function Mermaid({ code }: { code: string }) {
  const id = "m" + useId().replace(/\W/g, "");
  const [svg, setSvg] = useState("");
  const [err, setErr] = useState(false);
  useEffect(() => {
    let off = false;
    import("mermaid")
      .then(async ({ default: m }) => {
        m.initialize({ startOnLoad: false, theme: "dark", securityLevel: "strict", fontFamily: "inherit" });
        const r = await m.render(id, code);
        if (!off) setSvg(r.svg);
      })
      .catch(() => { if (!off) setErr(true); });
    return () => { off = true; };
  }, [code, id]);
  if (err) return <pre><code>{code}</code></pre>;
  if (!svg) return <div className="h-24 animate-pulse rounded-2xl bg-white/5" />;
  return <div className="readme-scroll" dangerouslySetInnerHTML={{ __html: svg }} />;
}
