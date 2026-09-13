import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Layers, Droplets, ShieldAlert, Sparkles, Microscope } from 'lucide-react';
import DicSepsisCoagulopathySimulator from '../../../components/simulators/DicSepsisCoagulopathySimulator';

export const metadata: Metadata = {
  title: 'DIC & Sepsis-Induced Coagulopathy (SIC) Workstation | Mediverse Simulators',
  description:
    'Biophysical simulation of Disseminated Intravascular Coagulation (DIC), ISTH overt vs non-overt diagnostic scoring, Sepsis-Induced Coagulopathy (SIC), microvascular thrombosis vs consumptive hemorrhage, and component replacement dosing.',
};


export const dynamic = 'force-static';
export default function DicSepsisCoagulopathyPage() {
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
            <span>Hematology &amp; Critical Care</span>
            <span>&bull;</span>
            <span className="text-rose-400">Track B17 (Route #218)</span>
          </div>
        </div>

        {/* Interactive Simulator Component */}
        <DicSepsisCoagulopathySimulator />

        {/* Deep Physiology & Clinical Evidence Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {/* Pathophysiology & Paradox */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Layers className="w-4 h-4 text-rose-400" />
              1. The Coagulation Paradox
            </h3>
            <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
              <p>
                DIC is characterized by systemic, unchecked generation of thrombin driven by massive intravascular exposure to Tissue Factor (TF) from endotoxin, trauma, or malignancy.
              </p>
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 font-mono text-[11px] text-rose-300">
                Tissue Factor &rarr; Thrombin Surge &rarr; Microthrombi + Factor Consumption
              </div>
              <p>
                Microvascular fibrin deposition occludes capillaries (driving AKI, ARDS, and Purpura Fulminans), while catastrophic consumption of platelets, fibrinogen, and Factor V/VIII causes simultaneous diffuse bleeding.
              </p>
            </div>
          </div>

          {/* ISTH & SIC Consensus Scoring */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Microscope className="w-4 h-4 text-cyan-400" />
              2. Diagnostic Criteria (ISTH / SIC)
            </h3>
            <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
              <p>
                <strong>ISTH Overt DIC Scoring (Taylor et al. 2001):</strong> Requires a known underlying disorder.
              </p>
              <ul className="space-y-1 list-disc pl-4 text-[11px]">
                <li>Platelets: &gt;100k (0), 50-100k (1), &lt;50k (2)</li>
                <li>D-Dimer: Normal (0), Moderate &times;2-5 (2), Strong &gt;5&times; (3)</li>
                <li>PT Prolongation: &lt;3s (0), 3-6s (1), &gt;6s (2)</li>
                <li>Fibrinogen: &gt;100 mg/dL (0), &lt;100 mg/dL (1)</li>
                <li><strong>Score &ge; 5</strong>: Overt DIC (repeat every 12-24h).</li>
              </ul>
              <p>
                <strong>SIC Scoring (Iba et al. 2017):</strong> Incorporates cardiorespiratory SOFA + platelets + INR (&ge;4 confirms sepsis-induced coagulopathy before overt DIC).
              </p>
            </div>
          </div>

          {/* Hemostatic Therapy & TXA Warning */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              3. Blood Components &amp; TXA Hazard
            </h3>
            <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
              <p>
                <strong>Treatment Principle:</strong> Treat the underlying cause immediately. Do not transfuse blood components purely to correct laboratory numbers in non-bleeding patients.
              </p>
              <ul className="space-y-1 list-disc pl-4 text-[11px]">
                <li><strong>Platelets</strong>: Target &ge;50,000/&mu;L for active hemorrhage or invasive surgery; &ge;10,000-20,000/&mu;L prophylactic.</li>
                <li><strong>Fibrinogen / Cryo</strong>: Target &ge;150 mg/dL if bleeding. 10u Cryo &approx; 2.5 g fibrinogen.</li>
                <li><strong>FFP</strong>: 15-25 mL/kg for INR &gt;1.5 with bleeding; monitor for TACO.</li>
              </ul>
              <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 text-[11px]">
                <strong>Black Box Contraindication:</strong> Tranexamic Acid (TXA) is contraindicated in septic DIC because halting secondary fibrinolysis triggers total microvascular thrombosis and bilateral renal cortical necrosis!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
