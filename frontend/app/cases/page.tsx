'use client';

/**
 * Clinical Cases Rounds & Case Solver Page
 * Location: frontend/app/cases/page.tsx
 */

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import ClinicalCaseSolverStation from '@/components/cases/ClinicalCaseSolverStation';
import { ArrowLeft, BookOpen, ShieldCheck, Stethoscope } from 'lucide-react';

function CasesPageContent() {
  const searchParams = useSearchParams();
  const caseId = searchParams.get('caseId') || undefined;

  return <ClinicalCaseSolverStation initialCaseId={caseId} />;
}

export default function ClinicalCasesPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link
          href="/healthcare"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Healthcare Domains
        </Link>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <ShieldCheck size={14} className="text-emerald-400" />
          <span>NMC CBME / DCI / CCIM / PCI / INC Standardized Rounds</span>
        </div>
      </div>

      {/* Main Content with Suspense for useSearchParams */}
      <Suspense
        fallback={
          <div className="max-w-7xl mx-auto p-12 text-center text-slate-400 text-sm font-mono animate-pulse">
            Loading clinical encounter station...
          </div>
        }
      >
        <CasesPageContent />
      </Suspense>
    </div>
  );
}
