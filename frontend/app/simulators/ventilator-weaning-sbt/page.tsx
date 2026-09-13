import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Wind, Activity, Gauge, ShieldAlert, Sparkles, Stethoscope, FileText, CheckCircle2 } from 'lucide-react';
import VentilatorWeaningSimulator from '../../../components/simulators/VentilatorWeaningSimulator';

export const metadata: Metadata = {
  title: 'Difficult Ventilator Weaning & Spontaneous Breathing Trials | Mediverse Simulators',
  description:
    'Pulmonology and critical care simulation of difficult mechanical ventilator liberation, Yang-Tobin RSBI kinetics, P0.1 neuro-ventilatory drive, diaphragmatic ultrasound (TFdi & excursion), PSV vs T-piece trials, and cuff leak laryngeal edema screening.',
};

export default function VentilatorWeaningPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/simulators"
            className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-cyan-400 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Clinical Simulators Catalog
          </Link>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
            <span>Pulmonology &amp; Critical Care Medicine</span>
            <span>&bull;</span>
            <span className="text-cyan-400">Track B25 (Route #226)</span>
          </div>
        </div>

        {/* Interactive Simulator Component */}
        <VentilatorWeaningSimulator />

        {/* Evidence & Deep Physiology Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {/* 1. Yang-Tobin RSBI & Dynamic Rate-of-Rise */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Gauge className="w-4 h-4 text-cyan-400" />
              1. Yang-Tobin RSBI &amp; Dynamic Fatigue Kinetics
            </h3>
            <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
              <p>
                <strong>The Classic RSBI Threshold:</strong> The Rapid Shallow Breathing Index (RSBI = RR / V<sub>t</sub> in L) is the most widely validated bedside predictor of weaning success. A value &lt; 105 breaths/min/L during spontaneous unassisted breathing demonstrates preserved pulmonary reserve.
              </p>
              <p>
                <strong>Dynamic Rate-of-Rise:</strong> A single snapshot minute-1 RSBI can be falsely reassuring. A subsequent rise &gt; 20% over 30 to 120 minutes heralds occult diaphragmatic fatigue, microatelectasis, or worsening respiratory system compliance before gross tachypnea becomes apparent.
              </p>
            </div>
          </div>

          {/* 2. Diaphragmatic Ultrasound & VIDD Screen */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-cyan-400" />
              2. Diaphragm POCUS (TFdi &amp; Excursion)
            </h3>
            <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
              <p>
                <strong>Ventilator-Induced Diaphragmatic Dysfunction (VIDD):</strong> Controlled mechanical ventilation causes rapid proteolytic degradation and myofibrillar disuse atrophy of the costal diaphragm within 18&ndash;24 hours of total inactivity.
              </p>
              <p>
                <strong>Quantitative Metrics:</strong> Diaphragmatic Thickening Fraction (TF<sub>di</sub> = [(T<sub>insp</sub> &minus; T<sub>exp</sub>) / T<sub>exp</sub>] &times; 100%) &ge; 30% and craniocaudal M-mode excursion &ge; 1.0&ndash;1.5 cm correlate with successful extubation and exclude persistent VIDD.
              </p>
            </div>
          </div>

          {/* 3. Cuff Leak Test & Occult Diastolic Overload */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-cyan-400" />
              3. Cuff Leak Test &amp; Diastolic Cardiac Failure
            </h3>
            <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
              <p>
                <strong>Laryngeal Edema Prevention:</strong> An absolute cuff leak &lt; 110 mL or &lt; 15% of delivered tidal volume indicates critical glottic narrowing. IV Methylprednisolone (20 mg q4h &times; 4 doses) requires at least 4&ndash;6 hours to diminish airway edema prior to extubation.
              </p>
              <p>
                <strong>Cardiovascular Weaning Failure:</strong> Transitioning from positive pressure to spontaneous breathing causes abrupt thoracic decompression, surging preload and LV transmural afterload. In ischemic or diastolic cardiomyopathy, this precipitates flash cardiogenic pulmonary edema during the SBT.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
