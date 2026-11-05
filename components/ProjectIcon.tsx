"use client";
import { useState } from "react";

/** Logo from /public/images; falls back to the emoji if the file is missing. */
export default function ProjectIcon({ logo, icon }: { logo?: string; icon: string }) {
  const [bad, setBad] = useState(false);
  if (!logo || bad) return <>{icon}</>;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={logo} alt="" onError={() => setBad(true)} className="size-full object-cover" />;
}
