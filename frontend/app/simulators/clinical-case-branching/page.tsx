'use client';

/**
 * Clinical Case Branching & AI OSCE Evaluator Simulator Page
 * Location: frontend/app/simulators/clinical-case-branching/page.tsx
 */

import React from 'react';
import Link from 'next/link';
import ClinicalCaseBranchingSimulator from '@/components/osce/ClinicalCaseBranchingSimulator';
import { ArrowLeft, Brain, ShieldCheck } from 'lucide-react';

export default function ClinicalCaseBranchingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Navigation */}
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link
          href="/simulators"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Clinical Simulators Catalog
        </Link>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <ShieldCheck size={14} className="text-emerald-400" />
          <span>USMLE Step 2 CS / MRCP PACES / NMC Standardized Encounters</span>
        </div>
      </div>

      {/* Simulator Main Component */}
      <ClinicalCaseBranchingSimulator />
    </div>
  );
}
