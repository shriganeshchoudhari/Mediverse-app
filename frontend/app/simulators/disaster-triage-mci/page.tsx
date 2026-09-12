import React from "react";
import Link from "next/link";
import DisasterTriageMciSimulator from "@/components/simulators/DisasterTriageMciSimulator";
import {
  ArrowLeft,
  ChevronRight,
  ShieldAlert,
  Users,
  Award,
  Truck,
  Building2,
  Activity,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disaster Triage & Mass Casualty Incident (MCI) Command Station | Mediverse",
  description:
    "START & JumpSTART pediatric disaster triage, point-of-injury lifesaving interventions, and Hospital Incident Command System (HICS) surge capacity logistics simulation.",
};

export default function DisasterTriageMciPage() {
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
            <Truck className="w-3.5 h-3.5 text-amber-400" />
            Disaster Triage &amp; MCI Command Station
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-950 border border-amber-500/40 text-amber-300 flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-amber-400" />
            Track B5 &bull; Disaster Medicine &amp; HICS (Route #206)
          </span>
        </div>
      </div>

      {/* Main Full-Height Workstation */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <DisasterTriageMciSimulator />
      </div>

      {/* Pedagogical Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 px-6 py-3 flex-shrink-0 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-slate-300 font-medium">
            <Activity className="w-3.5 h-3.5 text-red-400" />
            START &amp; JumpSTART RPM Algorithms &bull; Immediate Lifesaving Interventions
          </span>
          <span className="text-slate-600">&bull;</span>
          <span className="flex items-center gap-1.5 text-slate-300 font-medium">
            <Building2 className="w-3.5 h-3.5 text-violet-400" />
            HICS Hospital Surge Capacity &bull; Decontamination Corridors &bull; Under/Over-Triage Audit
          </span>
        </div>
        <div className="text-[11px] text-slate-500 font-mono">
          NDLS / FEMA MCI Guidelines &bull; ACS-COT Disaster Milestones &bull; METTAG Disaster Tagging Standards
        </div>
      </footer>
    </div>
  );
}