import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Filter, Droplets, ShieldAlert, Sparkles, Activity } from 'lucide-react';
import CrrtCitrateClearanceSimulator from '../../../components/simulators/CrrtCitrateClearanceSimulator';

export const metadata: Metadata = {
  title: 'CRRT Kinetics, Modalities & Regional Citrate Anticoagulation | Mediverse Simulators',
  description: 'Advanced biophysical simulation of Continuous Renal Replacement Therapy (CRRT: CVVH, CVVHD, CVVHDF, SCUF), convective vs diffusive solute clearance, filtration fraction, KDIGO effluent dosing, and Regional Citrate Anticoagulation (RCA).',
  openGraph: {
    title: 'CRRT Kinetics, Modalities & Regional Citrate Anticoagulation | Mediverse Simulators',
    description: 'Advanced biophysical simulation of Continuous Renal Replacement Therapy (CRRT: CVVH, CVVHD, CVVHDF, SCUF), convective vs diffusive solute clearance, filtration fraction, KDIGO effluent dosing, and Regional Citrate Anticoagulation (RCA).',
    url: 'https://mediverse.app/simulators/crrt-citrate-clearance',
    siteName: 'Mediverse Medical Simulation',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CRRT Kinetics, Modalities & Regional Citrate Anticoagulation | Mediverse Simulators',
    description: 'Advanced biophysical simulation of Continuous Renal Replacement Therapy (CRRT: CVVH, CVVHD, CVVHDF, SCUF), convective vs diffusive solute clearance, filtration fraction, KDIGO effluent dosing, and Regional Citrate Anticoagulation (RCA).',
  },
};


export const dynamic = 'force-static';
export default function CrrtCitrateClearancePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/simulators"
            className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-teal-400 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Clinical Simulators Catalog
          </Link>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
            <span>Nephrology &amp; Critical Care</span>
            <span>&bull;</span>
            <span className="text-teal-400">Track B18 (Route #219)</span>
          </div>
        </div>

        {/* Interactive Simulator Component */}
        <CrrtCitrateClearanceSimulator />

        {/* Deep Physiology & Clinical Evidence Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {/* Convection vs Diffusion */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Filter className="w-4 h-4 text-teal-400" />
              1. Convection vs Diffusion
            </h3>
            <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
              <p>
                <strong>Diffusion (Dialysis - CVVHD):</strong> Solute transport down a concentration gradient across a semipermeable membrane into counter-current dialysate flow. Highly efficient for small molecules (&lt; 500 Da) like urea and creatinine.
              </p>
              <p>
                <strong>Convection (Hemofiltration - CVVH):</strong> Solutes dragged across membrane by ultrafiltered bulk fluid flow (solvent drag). Superior for middle and large molecules like vancomycin (1.4 kDa) and myoglobin (17.8 kDa).
              </p>
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 font-mono text-[11px] text-teal-300">
                CVVHDF = Convection (Qrep) + Diffusion (Qd)
              </div>
            </div>
          </div>

          {/* KDIGO Effluent & Filtration Fraction */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              2. KDIGO Dosing &amp; Filtration Fraction
            </h3>
            <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
              <p>
                <strong>KDIGO Practice Guidelines:</strong> Recommend delivering 20-25 mL/kg/h of effluent dose. Typically prescribed at 25-30 mL/kg/h to account for procedural downtime (nursing bag exchanges, line flushes, diagnostic scans).
              </p>
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 font-mono text-[11px] text-cyan-300">
                FF (%) = Quf / (Qp + Qrep,pre) &times; 100
              </div>
              <p>
                <strong>Filtration Fraction (FF) Ceiling:</strong> Must remain &le; 20-25%. Exceeding this limit causes extreme hemoconcentration and protein cake deposition on membrane pores, precipitating premature circuit clotting.
              </p>
            </div>
          </div>

          {/* Regional Citrate & Citrate Lock */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              3. Citrate Kinetics &amp; "Citrate Lock"
            </h3>
            <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
              <p>
                <strong>Regional Citrate Anticoagulation (RCA):</strong> Pre-filter citrate infusion chelates free calcium (target circuit iCa 0.25-0.35 mmol/L), inhibiting tenase/prothrombinase complexes and extending filter life without systemic bleeding risk.
              </p>
              <p>
                Systemic calcium replacement infuses IV Calcium Gluconate or Chloride to maintain patient iCa 1.10-1.30 mmol/L.
              </p>
              <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 text-[11px]">
                <strong>Citrate Lock Surveillance:</strong> Total Calcium / Ionized Calcium ratio &gt; 2.5 indicates failure of hepatic citrate oxidation into bicarbonate, causing anion-gap metabolic acidosis and profound hypocalcemia.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
