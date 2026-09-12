import React from "react";
import Link from "next/link";
import AclsMegacodeSimulator from "@/components/simulators/AclsMegacodeSimulator";
import {
  ArrowLeft,
  ChevronRight,
  HeartPulse,
  Activity,
  Zap,
  Award,
  Stethoscope,
  ShieldAlert,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ACLS Megacode & Cardiac Arrest Resuscitation Simulator | Mediverse",
  description:
    "AHA 2020/2025 Advanced Cardiovascular Life Support (ACLS) megacode simulation: shockable (VF/pVT) and non-shockable (PEA/Asystole) algorithms, biphasic defibrillation, quantitative waveform capnography, and the 10 reversible causes (H's and T's).",
};

export default function AclsMegacodePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Breadcrumb & Station Context Bar */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-6 py-2.5 flex items-center justify-between text-xs flex-shrink-0">
        <div className="flex items-center gap-2 text-slate-400">
          <Link
            href="/simulators"
            className="hover:text-indigo-400 flex items-center gap-1 font-medium transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Clinical Simulators
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-600" />
          <span className="text-slate-200 font-semibold flex items-center gap-1.5">
            <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
            ACLS Megacode &amp; Resuscitation
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-950 border border-rose-500/40 text-rose-300 flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" />
            Track B6 &bull; Advanced Cardiac Life Support (Route #207)
          </span>
        </div>
      </div>

      {/* Main Full-Height Workstation */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AclsMegacodeSimulator />
      </div>

      {/* Pedagogical Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 px-6 py-3 flex-shrink-0 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-slate-300 font-medium">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            AHA 2020/2025 Adult Cardiac Arrest Algorithms &bull; Biphasic Defibrillation 200J
          </span>
          <span className="text-slate-600">&bull;</span>
          <span className="flex items-center gap-1.5 text-slate-300 font-medium">
            <Stethoscope className="w-3.5 h-3.5 text-cyan-400" />
            Quantitative Waveform Capnography (&ge; 35 mmHg ROSC) &bull; Reversible H&apos;s and T&apos;s
          </span>
        </div>
        <div className="text-[11px] text-slate-500 font-mono">
          AHA ECC Guidelines &bull; ILCOR Consensus on Science &bull; ACLS Provider Milestones
        </div>
      </footer>
    </div>
  );
}