import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, HeartPulse, Activity, Cpu, ShieldAlert, Sparkles, Scale } from 'lucide-react';
import CardiogenicShockSimulator from '../../../components/simulators/CardiogenicShockSimulator';

export const metadata: Metadata = {
  title: 'Cardiogenic Shock & MCS Escalation (SCAI Stages A-E, CPO, PAPi) | Mediverse Simulators',
  description: 'Biophysical critical care cardiology simulation of SCAI Shock Classification (Stages A to E), invasive Swan-Ganz indices (Cardiac Power Output [CPO], PAPi, PVR, SVR), biventricular failure, and device escalation (IABP, Impella CP/5.5, VA-ECMO, ECPELLA).',
  openGraph: {
    title: 'Cardiogenic Shock & MCS Escalation (SCAI Stages A-E, CPO, PAPi) | Mediverse Simulators',
    description: 'Biophysical critical care cardiology simulation of SCAI Shock Classification (Stages A to E), invasive Swan-Ganz indices (Cardiac Power Output [CPO], PAPi, PVR, SVR), biventricular failure, and device escalation (IABP, Impella CP/5.5, VA-ECMO, ECPELLA).',
    url: 'https://mediverse.app/simulators/cardiogenic-shock-mcs-escalation',
    siteName: 'Mediverse Medical Simulation',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cardiogenic Shock & MCS Escalation (SCAI Stages A-E, CPO, PAPi) | Mediverse Simulators',
    description: 'Biophysical critical care cardiology simulation of SCAI Shock Classification (Stages A to E), invasive Swan-Ganz indices (Cardiac Power Output [CPO], PAPi, PVR, SVR), biventricular failure, and device escalation (IABP, Impella CP/5.5, VA-ECMO, ECPELLA).',
  },
};


export const dynamic = 'force-static';
export default function CardiogenicShockPage() {
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
            <span>Critical Care Cardiology</span>
            <span>&bull;</span>
            <span className="text-rose-400">Track B23 (Route #224)</span>
          </div>
        </div>

        {/* Interactive Simulator Component */}
        <CardiogenicShockSimulator />

        {/* Deep Physiology & Clinical Evidence Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {/* SCAI Shock Classification */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-rose-400" />
              1. SCAI Classification &amp; Modifiers
            </h3>
            <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
              <p>
                <strong>The 5-Stage Hierarchy:</strong> Stage A (At Risk), Stage B (Beginning / Pre-Shock with
                hypotension or tachycardia but normal lactate), Stage C (Classic Shock requiring inotropes or MCS to
                sustain perfusion), Stage D (Deteriorating despite initial support), and Stage E (Extremis with
                circulatory collapse or ongoing CPR).
              </p>
              <p>
                <strong>The Cardiac Arrest (+A) Modifier:</strong> In-hospital or out-of-hospital cardiac arrest
                with ROSC imparts a dramatic excess mortality across every stage due to post-cardiac arrest syndrome,
                anoxic encephalopathy, and reperfusion vasoplegia.
              </p>
            </div>
          </div>

          {/* Biventricular Hemodynamics */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              2. CPO &amp; PAPi Hemodynamics
            </h3>
            <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
              <p>
                <strong>Cardiac Power Output (CPO):</strong> Calculated as (MAP &times; CO) / 451. In the landmark
                SHOCK trial (Fincke et al. JACC 2004), a CPO &lt; 0.60 Watts is the strongest independent predictor of
                in-hospital mortality in cardiogenic shock.
              </p>
              <p>
                <strong>PAPi &amp; RV Failure:</strong> Calculated as (PASP &minus; PADP) / CVP. A PAPi &lt; 0.90
                demonstrates severe right ventricular pump failure. In biventricular shock (CVP/PCWP &gt; 0.8), isolated
                left-sided microaxial pumps suffer cannula suction collapse, mandating biventricular support (Impella RP
                or VA-ECMO).
              </p>
            </div>
          </div>

          {/* DanGer Shock & ECPELLA Trap */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-teal-400" />
              3. DanGer Shock &amp; ECPELLA
            </h3>
            <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
              <p>
                <strong>DanGer Shock Trial (NEJM 2024):</strong> Routine microaxial flow pump (Impella CP) deployment
                in STEMI cardiogenic shock demonstrated a statistically significant reduction in 180-day all-cause
                mortality (45.8% vs 58.5%), offset by higher rates of vascular complications and bleeding.
              </p>
              <p>
                <strong>The Retrograde ECMO Afterload Trap:</strong> VA-ECMO pumps oxygenated blood retrograde up the
                aorta. If the failing LV cannot overcome this afterload, the aortic valve remains closed, causing LV
                cavity dilatation, massive pulmonary edema, and intracardiac thrombus. Concomitant LV unloading
                (ECPELLA) is mandatory.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
