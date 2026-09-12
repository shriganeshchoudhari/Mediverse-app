import React from 'react';
import Link from 'next/link';
import WebXrProceduralTheater from '@/components/3d/WebXrProceduralTheater';
import {
  ArrowLeft,
  ChevronRight,
  Move3d,
  ShieldCheck,
  Glasses,
  Waves,
  Crosshair,
  Award,
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'WebXR Spatial Anatomy & Procedural Intervention Theater | Mediverse',
  description:
    'Interactive 3D spatial computing, real-time multiplanar ultrasound simulation, and 6-DoF catheter trajectory planning for Central Venous Lines, Pericardiocentesis, and Lumbar Puncture.',
};

export default function WebXrProceduralTheaterPage() {
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
            <Move3d className="w-3.5 h-3.5 text-indigo-400" />
            WebXR Spatial Anatomy &amp; Procedural Intervention Theater
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-950 border border-indigo-500/40 text-indigo-300 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-indigo-400" />
            Track B3 &bull; Spatial Computing &amp; Kinematics (Route #204)
          </span>
        </div>
      </div>

      {/* Main Full-Height Workstation */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <WebXrProceduralTheater />
      </div>

      {/* Pedagogical Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 px-6 py-3 flex-shrink-0 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-slate-300 font-medium">
            <Waves className="w-3.5 h-3.5 text-cyan-400" />
            Multiplanar B-Mode Ultrasound &bull; Compressibility &bull; Color Doppler Flow
          </span>
          <span className="text-slate-600">&bull;</span>
          <span className="flex items-center gap-1.5 text-slate-300 font-medium">
            <Crosshair className="w-3.5 h-3.5 text-rose-400" />
            6-DoF Needle Trajectory &bull; Tactile Haptic Resistance &bull; Carotid Puncture Avoidance
          </span>
        </div>
        <div className="text-[11px] text-slate-500 font-mono">
          WebXR Device API &bull; Meta Quest 3 / Apple Vision Pro Spatial VR &bull; ACGME Core Procedural Milestones
        </div>
      </footer>
    </div>
  );
}
