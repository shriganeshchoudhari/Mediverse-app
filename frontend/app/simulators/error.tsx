'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, ArrowLeft, RefreshCw } from 'lucide-react';

export default function SimulatorError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[SimulatorError] Caught runtime simulation fault:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 bg-slate-950 text-slate-100">
      <div className="max-w-lg w-full bg-slate-900/90 border border-rose-900/40 rounded-2xl p-6 shadow-2xl backdrop-blur-xl text-center space-y-4">
        <div className="w-14 h-14 mx-auto rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white tracking-tight">Simulation Runtime Fault</h2>
          <p className="text-xs text-slate-400">
            A physiological solver or rendering process encountered an unhandled state.
          </p>
        </div>
        {error.message && (
          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-left font-mono text-[11px] text-rose-300 break-words max-h-32 overflow-y-auto">
            {error.message}
          </div>
        )}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Simulator
          </button>
          <Link
            href="/simulators"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl flex items-center gap-2 transition border border-slate-700"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Return to Simulators
          </Link>
        </div>
      </div>
    </div>
  );
}
