import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Heart, Activity, Gauge, ShieldAlert, Sparkles, Stethoscope, Layers, CheckCircle2 } from 'lucide-react';
import ReboaSimulator from '../../../components/simulators/ReboaSimulator';

export const metadata: Metadata = {
  title: 'REBOA & Aortic Occlusion Workstation | Mediverse Simulators',
  description:
    'Trauma and critical care simulation of Resuscitative Endovascular Balloon Occlusion of the Aorta (REBOA), Zone 1 vs Zone 3 occlusion, partial REBOA (pREBOA) titration, ischemia-reperfusion windows, and damage control resuscitation.',
};


export const dynamic = 'force-static';
export default function ReboaPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/simulators"
            className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-rose-400 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Clinical Simulators Catalog
          </Link>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
            <span>Trauma Surgery &amp; Emergency Critical Care</span>
            <span>&bull;</span>
            <span className="text-rose-400">Track B26 (Route #227)</span>
          </div>
        </div>

        {/* Interactive Simulator Component */}
        <ReboaSimulator />

        {/* Evidence & Deep Physiology Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {/* 1. Aortic Occlusion Zones */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Layers className="w-4 h-4 text-rose-400" />
              1. Aortic Occlusion Anatomical Zones
            </h3>
            <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
              <p>
                <strong>Zone 1 (Thoracic Aorta &ndash; T4 to T12):</strong> Extends from left subclavian artery to celiac axis. Indicated for intra-abdominal exsanguination, non-compressible retroperitoneal hematomas, and traumatic cardiac arrest. Strict 30-minute safe ceiling.
              </p>
              <p>
                <strong>Zone 2 (Visceral &ndash; NO-FLY ZONE):</strong> Celiac to lowest renal artery. Balloon inflation is strictly contraindicated as it causes catastrophic visceral and renal artery thrombosis without definitive proximal hemorrhage control.
              </p>
              <p>
                <strong>Zone 3 (Infrarenal &ndash; L3 to L5):</strong> Lowest renal artery to aortic bifurcation. Indicated for severe pelvic fracture hemorrhage and junctional groin exsanguination. Tolerates 60&ndash;90 minutes of partial occlusion.
              </p>
            </div>
          </div>

          {/* 2. Partial REBOA (pREBOA) & Hemodynamic Transduction */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Gauge className="w-4 h-4 text-rose-400" />
              2. Partial REBOA (pREBOA) &amp; Dual Arterial Lines
            </h3>
            <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
              <p>
                <strong>The pREBOA Breakthrough:</strong> Complete aortic occlusion produces complete distal ischemia. By micro-deflating the balloon (0.5 mL increments) to target a distal MAP of 35&ndash;45 mmHg, low-volume pulsatile flow perfuses distal beds, dramatically attenuating visceral ischemia while maintaining proximal MAP &ge; 65 mmHg.
              </p>
              <p>
                <strong>Afterload Strain Alert:</strong> Complete inflation can cause proximal systolic pressure to surge &gt; 160 mmHg, precipitating acute left ventricular failure, pulmonary edema, or intracranial hemorrhage. Real-time radial vs femoral transduction is mandatory.
              </p>
            </div>
          </div>

          {/* 3. Ischemia-Reperfusion & Washout Acidosis */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              3. Ischemia-Reperfusion &amp; Deflation Shock
            </h3>
            <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
              <p>
                <strong>Deflation Shock:</strong> Abrupt balloon deflation causes sudden vascular bed decompression, loss of afterload, and massive wash-in of ischemic metabolites (lactate, adenosine, potassium), precipitating refractory cardiac arrest.
              </p>
              <p>
                <strong>Pre-Emptive Resuscitation:</strong> Transfuse balanced blood products (1:1:1 PRBC, FFP, platelets) to restore circulating volume before deflation. Administer IV Calcium Chloride (1g) and Sodium Bicarbonate when ischemic duration exceeds 20 minutes to prevent fatal hyperkalemic asystole.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
