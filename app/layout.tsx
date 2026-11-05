import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

// Runs before first paint so phones never flash the heavy glass: saved choice, else Lite on touch screens.
const PERF_INIT = `try{var m=localStorage.getItem("perf-mode"),c=matchMedia("(pointer:coarse)").matches,l=["full","lite","min"][+localStorage.getItem("perf-level")||0]||"full";document.documentElement.dataset.perf=m==="full"?"full":(m==="lite"||(!m&&c))?"lite":l}catch(e){}`;

const font = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font" });

export const metadata: Metadata = {
  title: "Aravind · Project Hub",
  description: "Apps, web projects and open source by Aravind.",
};
export const viewport: Viewport = {
  themeColor: "#000000", viewportFit: "cover", width: "device-width", initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" className={font.variable} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: PERF_INIT }} /></head>
      <body className="min-h-dvh overflow-x-hidden bg-black font-sans text-white antialiased">{children}</body>
    </html>
  );
}
