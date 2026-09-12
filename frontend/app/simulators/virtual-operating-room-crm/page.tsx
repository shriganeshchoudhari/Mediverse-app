import React from "react";
import Link from "next/link";
import VirtualOrTeamCrmSimulator from "@/components/simulators/VirtualOrTeamCrmSimulator";
import {
  ArrowLeft,
  ChevronRight,
  ShieldAlert,
  Users,
  Award,
  Stethoscope,
  Activity,
  HeartPulse,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Virtual OR & Surgical Airway Team Dynamics Simulator | Mediverse",
  description:
    "Interprofessional Operating Room Crisis Resource Management (CRM), Difficult Airway Society (DAS 2015) algorithm execution, and emergency scalpel-bougie-tube cricothyroidotomy procedural simulation.",
};

export default function VirtualOrTeamCrmPage() {
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
            <Users className="w-3.5 h-3.5 text-rose-400" />
            Virtual OR &amp; Surgical Airway Team Dynamics
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-950 border border-rose-500/40 text-rose-300 flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-rose-400" />
            Track B4 &bull; Crisis Resource Management (Route #205)
          </span>
        </div>
      </div>

      {/* Main Full-Height Workstation */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <VirtualOrTeamCrmSimulator />
      </div>

      {/* Pedagogical Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 px-6 py-3 flex-shrink-0 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-slate-300 font-medium">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            DAS 2015 Plan A &rarr; B &rarr; C &rarr; D Execution &bull; Fixation Penalty Detection
          </span>
          <span className="text-slate-600">&bull;</span>
          <span className="flex items-center gap-1.5 text-slate-300 font-medium">
            <Stethoscope className="w-3.5 h-3.5 text-cyan-400" />
            Scalpel-Bougie-Tube Cricothyroidotomy &bull; Tactile Tracheal Rings &bull; Square Wave EtCO2
          </span>
        </div>
        <div className="text-[11px] text-slate-500 font-mono">
          ACGME Anesthesiology Milestones &bull; ASA Difficult Airway Guidelines &bull; Closed-Loop Checkback Verification
        </div>
      </footer>
    </div>
  );
}