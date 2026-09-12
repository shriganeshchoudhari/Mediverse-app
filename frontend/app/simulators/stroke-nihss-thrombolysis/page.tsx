import React from 'react';
import { Metadata } from 'next';
import { StrokeNihssThrombolysisSimulator } from '@/components/simulators/StrokeNihssThrombolysisSimulator';
import { Brain, Activity, ShieldAlert, Clock, Layers, Syringe, Zap, AlertTriangle, HeartPulse } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Acute Ischemic Stroke (AIS), NIHSS, ASPECTS & Thrombolysis Protocol | Mediverse',
  description: 'Complete 11-item NIHSS examination scoring, 10-region ASPECTS neuroimaging, AHA/ASA IV Thrombolysis (Tenecteplase / Alteplase) eligibility & weight-adjusted dosing, LVO Endovascular Thrombectomy (EVT) triage, and permissive hemodynamic guardrails.'
};

export default function StrokeNihssThrombolysisPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Interactive Stroke Simulation Workstation */}
      <StrokeNihssThrombolysisSimulator />

      {/* Comprehensive Neurocritical Care Reference & Thrombolysis Manual */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pb-16">
        <div className="border-t border-slate-800 pt-10 mt-10 space-y-12">
          {/* Section 1: Overview & Time-Is-Brain Paradigm */}
          <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white">
                  1. The Hyperacute Stroke Paradigm: Time is Brain &amp; Penumbral Salvage
                </h2>
                <p className="text-sm text-slate-400">
                  AHA/ASA 2019/2021 Guidelines for the Early Management of Acute Ischemic Stroke
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              Acute Ischemic Stroke (AIS) represents a medical emergency where focal arterial occlusion deprives downstream cerebral parenchyma of oxygen and glucose. In the central <strong>ischemic core</strong>, severe hypoperfusion (cerebral blood flow &lt; 10-12 mL/100g/min) leads to rapid membrane depolarization, massive calcium influx, mitochondrial exhaustion, and irreversible infarction within minutes. Surrounding the core lies the <strong>ischemic penumbra</strong> (cerebral blood flow 12-22 mL/100g/min), where neurons are functionally silent but structurally viable, sustained transiently by collateral leptomeningeal flow.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-cyan-400 font-bold">
                  <Clock className="w-4 h-4" />
                  Rate of Neuronal Loss
                </div>
                <p className="text-slate-300 leading-relaxed">
                  During an untreated large vessel occlusion stroke, an estimated <strong>1.9 million neurons, 14 billion synapses, and 7.5 miles of myelinated fibers</strong> are lost every minute.
                </p>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <Syringe className="w-4 h-4" />
                  IV Thrombolysis Windows
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Standard window: <strong>0 to 3.0 hours</strong> from Last Known Well. Extended window: <strong>3.0 to 4.5 hours</strong>. Unknown onset / Wake-up: MRI DWI-FLAIR mismatch (WAKE-UP trial protocol).
                </p>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-purple-400 font-bold">
                  <Zap className="w-4 h-4" />
                  EVT Thrombectomy Windows
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Standard window: <strong>0 to 6.0 hours</strong> for proximal LVO (ICA, M1). Extended window: <strong>6 to 24 hours</strong> using DAWN or DEFUSE-3 clinical-core mismatch criteria.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: NIHSS & ASPECTS Framework */}
          <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white">
                  2. Clinical Deficit &amp; Neuroimaging Stratification: NIHSS &amp; ASPECTS
                </h2>
                <p className="text-sm text-slate-400">
                  Quantitative Severity Metrics and Topographic Infarct Sizing
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-3">
                <h3 className="text-sm font-bold text-indigo-300 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-indigo-400" />
                  The NIH Stroke Scale (NIHSS, 0 - 42)
                </h3>
                <p className="leading-relaxed">
                  The NIHSS is a validated 11-item examination tool that objectively quantifies acute neurological impairment. Higher scores correlate directly with larger infarct volume and unfavorable 90-day functional outcomes:
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-400">
                  <li><strong>0:</strong> No stroke deficits</li>
                  <li><strong>1 - 4:</strong> Minor stroke (favorable natural history, but disabling deficits still warrant lytic therapy)</li>
                  <li><strong>5 - 15:</strong> Moderate stroke (standard lytic qualification)</li>
                  <li><strong>16 - 20:</strong> Moderate to severe stroke (high suspicion for proximal LVO)</li>
                  <li><strong>21 - 42:</strong> Severe stroke (massive hemispheric or basilar occlusion)</li>
                </ul>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-3">
                <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  The ASPECTS Neuroimaging Score (0 - 10)
                </h3>
                <p className="leading-relaxed">
                  The Alberta Stroke Program Early CT Score (ASPECTS) divides the MCA vascular territory into 10 anatomical regions on two non-contrast CT axial slices (ganglionic and supraganglionic). Each region exhibiting early ischemic hypoattenuation or loss of gray-white distinction deducts 1 point:
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-400">
                  <li><strong>Subcortical (4 points):</strong> Caudate head, Lentiform nucleus, Internal capsule, Insular ribbon</li>
                  <li><strong>Cortical (6 points):</strong> M1 (anterior), M2 (lateral), M3 (posterior), and M4, M5, M6 (supraganglionic cortical equivalents)</li>
                  <li><strong>Threshold &ge; 6:</strong> Favorable small-to-moderate ischemic core; establishes eligibility for mechanical thrombectomy</li>
                  <li><strong>Threshold &lt; 6:</strong> Frank demarcation indicates large established core (&gt; 70-100 mL)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3: Pharmacology & Hemodynamic Guardrails */}
          <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <HeartPulse className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white">
                  3. Thrombolytic Pharmacology &amp; Reperfusion Hemodynamics
                </h2>
                <p className="text-sm text-slate-400">
                  Tenecteplase vs Alteplase Precision Dosing, Blood Pressure Protocols &amp; Complication Protocols
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-3">
                <h3 className="text-sm font-bold text-emerald-400">Thrombolytic Agent Comparison</h3>
                <p className="leading-relaxed">
                  <strong>Tenecteplase (TNK-tPA):</strong> A genetically engineered variant of native tPA with three amino acid substitutions. Features 14-fold higher fibrin specificity and an 80-fold longer half-life. Dosing: <strong>0.25 mg/kg (max 25 mg)</strong> as a single, rapid IV push bolus over 5-10 seconds. Eliminates secondary infusion pump errors and accelerates door-to-needle and door-to-groin times (EXTEND-IA TNK).
                </p>
                <p className="leading-relaxed">
                  <strong>Alteplase (rt-PA):</strong> Recombinant human tissue-type plasminogen activator. Dosing: <strong>0.9 mg/kg (max 90 mg)</strong>; 10% administered as an initial IV bolus over 1 minute, with the remaining 90% infused over 60 minutes.
                </p>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-3">
                <h3 className="text-sm font-bold text-rose-400">Blood Pressure Guardrails &amp; Rescue</h3>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  <li><strong>Pre-Thrombolysis:</strong> SBP &lt; 185 mmHg and DBP &lt; 110 mmHg. Lower actively using IV Nicardipine (5-15 mg/h) or IV Labetalol (10-20 mg IV push) before initiating lytic.</li>
                  <li><strong>Post-Thrombolysis:</strong> Maintain strictly <strong>&lt; 180/105 mmHg</strong> for at least 24 hours to prevent reperfusion intracerebral hemorrhage.</li>
                  <li><strong>Non-Thrombolyzed Permissive HTN:</strong> Up to <strong>220/120 mmHg</strong>. Do NOT lower blood pressure in acute non-thrombolyzed stroke unless &gt; 220/120 mmHg or acute aortic dissection / acute pulmonary edema co-exists.</li>
                  <li><strong>sICH Emergency Rescue Protocol:</strong> If sudden neurological decline (&ge; 4 NIHSS points increase) or severe headache occurs: immediately stop thrombolytic, order stat NCCT, and administer <strong>Cryoprecipitate 10 units IV</strong> + <strong>Tranexamic Acid 1000 mg IV</strong> over 10 minutes.</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
