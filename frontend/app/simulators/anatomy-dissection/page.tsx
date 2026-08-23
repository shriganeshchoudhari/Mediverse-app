'use client';

import React from 'react';
import Link from 'next/link';
import LayeredDissectionViewer from '@/components/3d/LayeredDissectionViewer';
import { ArrowLeft, Scissors, Sparkles } from 'lucide-react';

export default function AnatomyDissectionPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Top Banner */}
      <div className="border-b border-purple-950/80 bg-gradient-to-r from-slate-950 via-purple-950/40 to-slate-950 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles size={14} /> Virtual Dissection &amp; Surgical Anatomy
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              🔬 3D Multi-Layer Anatomical Dissection Lab
            </h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mt-2 leading-relaxed">
              Explore stratified tissue architecture in high-fidelity 3D WebGL. Peel back epidermal layers, evaluate fascial planes, identify deep neurovascular bundles, and correlate surgical approaches.
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
        <LayeredDissectionViewer />
      </div>
    </div>
  );
}
