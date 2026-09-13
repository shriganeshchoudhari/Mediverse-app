'use client';

import React, { useState } from 'react';
import { ShieldAlert, ChevronDown, ChevronUp, ExternalLink, Info } from 'lucide-react';

export interface ClinicalSimulationDisclaimerProps {
  className?: string;
  compact?: boolean;
}

/**
 * Enterprise Clinical Simulation & SaMD Regulatory Disclaimer
 * 
 * Satisfies FDA Software as a Medical Device (SaMD) non-clinical guidance
 * and EU MDR Article 62 compliance requirements for medical education software.
 */
export default function ClinicalSimulationDisclaimer({
  className = '',
  compact = false,
}: ClinicalSimulationDisclaimerProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  if (compact) {
    return (
      <aside
        aria-label="Clinical Simulation Disclaimer"
        className={`bg-slate-950/90 border-t border-slate-800/80 px-4 py-2 text-[11px] text-slate-400 flex items-center justify-between gap-3 ${className}`}
      >
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>
            <strong className="text-slate-300">Educational Simulation Only:</strong> Not intended for direct clinical diagnostic or treatment decisions (FDA Non-Device / SaMD exempt).
          </span>
        </div>
      </aside>
    );
  }

  return (
    <aside
      aria-label="Clinical Simulation and SaMD Regulatory Disclaimer"
      className={`border-t border-slate-800/90 bg-slate-950/95 text-slate-400 px-4 sm:px-6 lg:px-8 py-4 ${className}`}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-2.5">
          <div className="p-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0 mt-0.5 sm:mt-0">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div className="text-xs leading-relaxed">
            <span className="font-semibold text-slate-200">
              Academic &amp; Training Simulation Notice:
            </span>{' '}
            Mediverse virtual physiology solvers and clinical cases are designed strictly for medical education and training.
            Not certified as Software as a Medical Device (SaMD).
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-indigo-400 hover:text-indigo-300 transition flex items-center gap-1 shrink-0 self-start sm:self-center font-medium"
          aria-expanded={isExpanded}
        >
          <span>{isExpanded ? 'Hide' : 'Regulatory Details'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="max-w-7xl mx-auto mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
          <div className="space-y-1">
            <h5 className="font-semibold text-slate-200 uppercase tracking-wider text-[10px]">SaMD Scope</h5>
            <p className="leading-snug">
              This system does not perform patient-specific medical diagnosis, therapy selection, or clinical monitoring under FDA 21 CFR 820 or EU MDR 2017/745.
            </p>
          </div>
          <div className="space-y-1">
            <h5 className="font-semibold text-slate-200 uppercase tracking-wider text-[10px]">Mathematical Models</h5>
            <p className="leading-snug">
              Equations (Henderson-Hasselbalch, Stewart Strong Ion, 3-Compartment PK/PD) are deterministic academic approximations parameterized from peer-reviewed literature.
            </p>
          </div>
          <div className="space-y-1">
            <h5 className="font-semibold text-slate-200 uppercase tracking-wider text-[10px]">Clinical Responsibility</h5>
            <p className="leading-snug">
              Attending clinicians and trainees must always rely on hospital protocols, laboratory findings, and direct physical examination for real-world patient care.
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
