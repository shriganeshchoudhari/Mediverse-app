import React from 'react';
import Link from 'next/link';
import LifelikeHeartViewer from '@/components/3d/LifelikeHeartViewer';
import { ArrowLeft, Sparkles, Heart, ShieldCheck, Microscope } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lifelike 3D Heart & Ventricular Wringing | Mediverse',
  description: 'Photorealistic 3D human heart simulation featuring living biological tissue shaders, dual-phase Wiggers pumping, apical wringing, and surgical dissection.',
};

export default function LifelikeHeartPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 flex flex-col items-center">
      <div className="max-w-7xl w-full space-y-6">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link
              href="/simulators"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors mb-2"
            >
              <ArrowLeft size={16} /> Back to Virtual Physiology Labs
            </Link>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold bg-rose-950 text-rose-300 border border-rose-800/60 px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1">
                <Sparkles size={12} /> Next-Gen 3D Simulation
              </span>
              <span className="text-xs text-slate-400 font-mono">MBBS Cardiology / Physiology</span>
            </div>

            <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
              Photorealistic Living Heart &amp; Biomechanical Wringing
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed">
              Experience cardiac electro-mechanical coupling in high-fidelity 3D WebGL. Observe apical counter-clockwise torsion, compliant aortic pulse waves, coronary sulci bifurcations, and wet pericardial serosa optics.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto bg-slate-900 border border-slate-800 p-3 rounded-2xl text-xs font-mono">
            <Microscope size={20} className="text-rose-400" />
            <div>
              <div className="text-[10px] text-slate-400">Rendering Engine</div>
              <div className="font-bold text-slate-200">Three.js + R3F Living Tissue PBR</div>
            </div>
          </div>
        </div>

        {/* The 3D Living Heart Interactive Viewer */}
        <LifelikeHeartViewer />
      </div>
    </div>
  );
}
