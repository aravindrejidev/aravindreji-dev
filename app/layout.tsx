import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

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
    <html lang="en" data-theme="dark" className={font.variable}>
      <body className="min-h-dvh overflow-x-hidden bg-black font-sans text-white antialiased">{children}</body>
    </html>
  );
}
