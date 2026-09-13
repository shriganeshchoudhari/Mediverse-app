import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Baby, Activity, Gauge, ShieldAlert, Sparkles, Stethoscope, Droplets, CheckCircle2 } from 'lucide-react';
import AmnioticFluidEmbolismSimulator from '../../../components/simulators/AmnioticFluidEmbolismSimulator';

export const metadata: Metadata = {
  title: 'Amniotic Fluid Embolism (AFE) & Obstetric Collapse | Mediverse Simulators',
  description: 'Obstetric critical care simulation of Amniotic Fluid Embolism (AFE), Clark diagnostic criteria (SMFM 2016), biphasic right ventricular failure and consumptive hyperfibrinolytic DIC, A-OK protocol, inhaled epoprostenol, and VA-ECMO salvage.',
  openGraph: {
    title: 'Amniotic Fluid Embolism (AFE) & Obstetric Collapse | Mediverse Simulators',
    description: 'Obstetric critical care simulation of Amniotic Fluid Embolism (AFE), Clark diagnostic criteria (SMFM 2016), biphasic right ventricular failure and consumptive hyperfibrinolytic DIC, A-OK protocol, inhaled epoprostenol, and VA-ECMO salvage.',
    url: 'https://mediverse.app/simulators/amniotic-fluid-embolism-afe',
    siteName: 'Mediverse Medical Simulation',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Amniotic Fluid Embolism (AFE) & Obstetric Collapse | Mediverse Simulators',
    description: 'Obstetric critical care simulation of Amniotic Fluid Embolism (AFE), Clark diagnostic criteria (SMFM 2016), biphasic right ventricular failure and consumptive hyperfibrinolytic DIC, A-OK protocol, inhaled epoprostenol, and VA-ECMO salvage.',
  },
};


export const dynamic = 'force-static';
export default function AmnioticFluidEmbolismPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/simulators"
            className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-pink-400 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Clinical Simulators Catalog
          </Link>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
            <span>Obstetrics &amp; Maternal-Fetal Critical Care</span>
            <span>&bull;</span>
            <span className="text-pink-400">Track B27 (Route #228)</span>
          </div>
        </div>

        {/* Interactive Simulator Component */}
        <AmnioticFluidEmbolismSimulator />

        {/* Evidence & Deep Physiology Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {/* 1. Clark Diagnostic Criteria */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Baby className="w-4 h-4 text-pink-400" />
              1. Clark Diagnostic Criteria (SMFM 2016)
            </h3>
            <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
              <p>
                <strong>The 4 Mandatory Elements:</strong> (1) Sudden cardiorespiratory arrest or both hypotension (SBP &lt; 90 mmHg) AND hypoxia (SpO<sub>2</sub> &lt; 90%); (2) Documented overt DIC; (3) Onset during labor or &le; 30 min post-delivery; (4) Strict absence of fever (&ge; 38.0&deg;C) or alternative etiology.
              </p>
              <p>
                <strong>Exclusion of Mimics:</strong> Intrapartum fever points decisively toward septic shock from chorioamnionitis. Massive PE, uterine rupture, eclampsia, and anesthetic toxicity must be rigorously distinguished.
              </p>
            </div>
          </div>

          {/* 2. Biphasic Pathophysiology & RV Protection */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Gauge className="w-4 h-4 text-pink-400" />
              2. Biphasic Pathophysiology &amp; RV Bundle
            </h3>
            <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
              <p>
                <strong>Phase 1 (Acute Cor Pulmonale):</strong> Transient release of fetal endothelin, thromboxane, and leukotrienes produces catastrophic pulmonary vasoconstriction (PVR &gt; 400&ndash;800 dyn&middot;s/cm<sup>5</sup>), acute RV dilation, septal flattening, and PEA arrest. Aggressive fluid loading dilates the failing RV and triggers fatal ischemia.
              </p>
              <p>
                <strong>Phase 2 (LV Atony &amp; Consumptive DIC):</strong> Patients surviving Phase 1 progress to severe secondary LV myocardial depression, profound uterine atony, and explosive consumption of fibrinogen and platelets.
              </p>
            </div>
          </div>

          {/* 3. A-OK Protocol & Hemostatic Rescue */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Droplets className="w-4 h-4 text-pink-400" />
              3. A-OK Protocol &amp; Cryoprecipitate
            </h3>
            <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
              <p>
                <strong>A-OK Receptor Antagonism:</strong> Atropine (1 mg) blunts vagal bradycardia; Ondansetron (8 mg) blocks 5-HT<sub>3</sub> receptors stopping serotonin-induced pulmonary spasm; Ketorolac (30 mg) halts thromboxane-mediated vasoconstriction.
              </p>
              <p>
                <strong>Critical Fibrinogen Threshold:</strong> Normal term pregnancy baseline is 400&ndash;600 mg/dL. A level &lt; 200 mg/dL represents critical coagulopathy. Administer Tranexamic Acid (TXA 1g) and Cryoprecipitate (10&ndash;20 units) or Fibrinogen Concentrate immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
