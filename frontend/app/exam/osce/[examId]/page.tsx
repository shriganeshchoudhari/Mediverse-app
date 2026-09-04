'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { SEEDED_OSCE_SCENARIOS } from '@/.gemini/skills/OSCEExamSkills';
import OSCEStationCarousel from '@/components/exam/OSCEStationCarousel';
import { ChevronLeft, GraduationCap, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function OsceExamRoomPage() {
  const params = useParams();
  const router = useRouter();
  const examId = (params?.examId as string) || 'osce-stemi-cardiology';

  const currentScenario =
    SEEDED_OSCE_SCENARIOS.find((s) => s.id === examId) || SEEDED_OSCE_SCENARIOS[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 flex flex-col items-center">
      <div className="max-w-6xl w-full space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/leaderboards"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ChevronLeft size={16} /> Back to Leaderboards & OSCE Scenarios
          </Link>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>NMC / USMLE Step 2 CS Standardized Protocol</span>
          </div>
        </div>

        {/* OSCE Carousel */}
        <OSCEStationCarousel scenario={currentScenario} />
      </div>
    </div>
  );
}
