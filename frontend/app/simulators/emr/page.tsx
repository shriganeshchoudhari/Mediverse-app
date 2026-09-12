'use client';

import React from 'react';
import Link from 'next/link';
import InpatientEmrWorkstation from '@/components/emr/InpatientEmrWorkstation';
import {
  Activity,
  ArrowLeft,
  ChevronRight,
  Database,
  Pill,
  ShieldCheck,
} from 'lucide-react';

export default function EmrSandboxPage() {
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
            <Database className="w-3.5 h-3.5 text-indigo-400" />
            Inpatient Electronic Medical Record (EMR) &amp; Hospital Charting Simulator
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-950 border border-indigo-500/40 text-indigo-300 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-indigo-400" />
            Track B2 &bull; Enterprise Hospital CIS
          </span>
        </div>
      </div>

      {/* Main Full-Height Workstation */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <InpatientEmrWorkstation />
      </div>

      {/* Pedagogical Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 px-6 py-3 flex-shrink-0 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-slate-300 font-medium">
            <Pill className="w-3.5 h-3.5 text-indigo-400" />
            Point-of-Care eMAR Barcode Scanning &bull; 5-Rights Verification &bull; High-Alert Dual Sign-Off
          </span>
          <span className="text-slate-600">&bull;</span>
          <span className="flex items-center gap-1.5 text-slate-300 font-medium">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            Hourly Inpatient Flowsheet &bull; Shift I&amp;O Fluid Balancing &bull; Oliguria Alerts
          </span>
        </div>
        <div className="text-[11px] text-slate-500 font-mono">
          Mediverse Hospital Information System (HIS/EMR) &bull; AAMC Core EPAs Aligned
        </div>
      </footer>
    </div>
  );
}
