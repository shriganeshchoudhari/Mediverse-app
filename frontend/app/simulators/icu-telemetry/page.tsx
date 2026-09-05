'use client';

/**
 * ICU Central Telemetry Station & Multi-Bed Alarm Simulator Page
 * Location: frontend/app/simulators/icu-telemetry/page.tsx
 */

import React from 'react';
import Link from 'next/link';
import MultiBedIcuCentralStation from '@/components/emr/MultiBedIcuCentralStation';
import { ArrowLeft, ShieldCheck, Activity } from 'lucide-react';

export default function IcuTelemetryPage() {
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
          <Activity size={14} className="text-rose-400 animate-pulse" />
          <span>Continuous High-Acuity ICU Telemetry & Alarm Surveillance</span>
        </div>
      </div>

      {/* Main ICU Central Station Component */}
      <div className="max-w-7xl mx-auto">
        <MultiBedIcuCentralStation />
      </div>
    </div>
  );
}
