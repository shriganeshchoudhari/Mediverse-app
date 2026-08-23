'use client';

import React from 'react';
import Link from 'next/link';
import VirtualPatientSimulator from '@/components/clinical/VirtualPatientSimulator';
import { ArrowLeft, Stethoscope, Sparkles } from 'lucide-react';

export default function VirtualPatientPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Top Banner */}
      <div className="border-b border-rose-950/80 bg-gradient-to-r from-slate-950 via-rose-950/40 to-slate-950 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles size={14} /> AI Diagnostic Reasoning &amp; Clinical Decision Simulator
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              🩺 Virtual Patient Clinical Case Simulator
            </h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mt-2 leading-relaxed">
              Step into the role of the attending clinician: interrogate patient history, order diagnostic biomarkers, administer emergency interventions, and establish evidence-based differential diagnoses.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/simulators"
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-sm font-semibold transition flex items-center gap-2"
            >
              <ArrowLeft size={16} /> All Simulators
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8">
        <VirtualPatientSimulator />
      </div>
    </div>
  );
}
