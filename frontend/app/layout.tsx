import React from "react";
import ClientProviders from "../components/ClientProviders";
import GlobalSearch from "../components/GlobalSearch";
import GlobalSocraticAssistant from "../components/ai/GlobalSocraticAssistant";
import Navbar from "../components/Navbar";
import "./globals.css";
import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Mediverse | Medical Education & Simulation Platform",
  description: "Interactive Medical Education & Clinical Simulation Platform covering 19 MBBS disciplines, 12 residency tracks, 3D organ dissection, mathematical physiology solvers, and AI Socratic tutoring.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Mediverse",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col">
        <ClientProviders>
          <Navbar />
          <GlobalSearch />
          <div className="flex-1">
            {children}
          </div>
          <GlobalSocraticAssistant />
        </ClientProviders>
      </body>
    </html>
  );
}
