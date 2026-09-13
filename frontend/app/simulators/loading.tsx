import React from 'react';
import { Activity } from 'lucide-react';

export default function SimulatorLoading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 bg-slate-950 text-slate-100">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
          <Activity className="w-6 h-6 text-indigo-400 absolute inset-0 m-auto animate-pulse" />
        </div>
        <div className="text-center space-y-1">
          <h3 className="text-sm font-semibold text-white tracking-wide">Initializing Virtual Physiology Lab</h3>
          <p className="text-xs text-slate-500 font-mono">Loading differential equations &amp; 3D bio-mesh...</p>
        </div>
      </div>
    </div>
  );
}
