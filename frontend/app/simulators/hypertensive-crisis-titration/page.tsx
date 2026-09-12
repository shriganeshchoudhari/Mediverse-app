import React from 'react';
import { Metadata } from 'next';
import { HypertensiveCrisisSimulator } from '@/components/simulators/HypertensiveCrisisSimulator';
import { ShieldAlert, BookOpen, HeartPulse, Brain, AlertTriangle, Activity, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Hypertensive Crisis & IV Antihypertensive Titration Workstation | Mediverse',
  description: 'Emergency vs Urgency triage, acute target organ damage stratification, cerebral autoregulation curve shifts, and precision pharmacotherapy bench (Nicardipine, Clevidipine, Labetalol, Esmolol, Nitroprusside, Nitroglycerin).'
};

export default function HypertensiveCrisisPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Interactive Simulator */}
      <HypertensiveCrisisSimulator />

      {/* Comprehensive Clinical Reference Guide & Pharmacovigilance Manual */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pb-16">
        <div className="border-t border-slate-800 pt-10 mt-10 space-y-12">
          {/* Section 1: Overview and Diagnostic Triage */}
          <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <HeartPulse className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white">
                  1. Diagnostic Triage: Hypertensive Emergency vs Hypertensive Urgency
                </h2>
                <p className="text-sm text-slate-400">
                  ACC/AHA 2017/2024 Guidelines and Neurocritical Care Society (NCS) Consensus
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              Hypertensive crisis is defined as a severe elevation in blood pressure, typically systolic blood pressure (SBP) &ge; 180 mmHg and/or diastolic blood pressure (DBP) &ge; 120 mmHg. The paramount clinical distinction lies not in the absolute numerical blood pressure value, but in the presence or absence of progressive <strong>acute target organ damage (TOD)</strong>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="bg-slate-950/80 border border-rose-900/40 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-base">
                  <ShieldAlert className="w-5 h-5" />
                  Hypertensive Emergency
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Severe BP elevation <strong>with acute, life-threatening target organ damage</strong> (acute aortic dissection, acute myocardial infarction, acute flash pulmonary edema, acute ischemic stroke, intracranial hemorrhage, hypertensive encephalopathy, or severe preeclampsia).
                </p>
                <div className="text-xs text-rose-300 bg-rose-950/30 border border-rose-800/50 p-2.5 rounded-lg">
                  <strong>Mandatory Management:</strong> Immediate admission to an intensive care unit (ICU) or resuscitation bay, continuous arterial line monitoring, and rapid titration of parenteral (IV) antihypertensives.
                </div>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
                  <Activity className="w-5 h-5" />
                  Hypertensive Urgency
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Severe BP elevation (SBP &ge; 180 or DBP &ge; 120 mmHg) in an asymptomatic or minimally symptomatic patient <strong>without evidence of acute target organ damage</strong>.
                </p>
                <div className="text-xs text-amber-300 bg-amber-950/30 border border-amber-800/50 p-2.5 rounded-lg">
                  <strong>Crucial Safety Rule:</strong> Avoid IV antihypertensive infusions or precipitous BP reduction! Rapid drops induce iatrogenic watershed cerebral infarction and acute coronary hypoperfusion. Manage with oral agents (Amlodipine, Captopril, Labetalol PO) over 24 to 48 hours.
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Cerebral Autoregulation */}
          <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white">
                  2. Cerebral Autoregulation &amp; Rightward Plateau Shift
                </h2>
                <p className="text-sm text-slate-400">
                  Biophysical Mechanisms of Watershed Infarction and the 20-25% MAP Drop Rule
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              In healthy normotensive individuals, cerebral blood flow (CBF) remains tightly autoregulated across a mean arterial pressure (MAP) range of approximately 60 to 120 mmHg. Arteriolar smooth muscle constricts in response to elevated transmural pressure (myogenic Bayliss response) to protect fragile capillary beds, and dilates during hypotension to preserve neuronal perfusion.
            </p>

            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-cyan-300">
                The Chronic Hypertensive Adaptation Hazard
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                In chronic, long-standing hypertension, media hypertrophy and hyaline arteriolosclerosis permanently reset the cerebrovascular resistance. The entire autoregulation plateau shifts rightward: the lower limit of autoregulation rises from MAP 60-65 mmHg to <strong>MAP 105-115 mmHg</strong>, while the upper limit rises from 120 mmHg to 175-180 mmHg.
              </p>
              <div className="p-3 rounded-lg bg-red-950/30 border border-red-800/50 text-xs text-red-200">
                <strong>Iatrogenic Watershed Infarction:</strong> If a patient with chronic hypertension presenting at 220/130 mmHg (MAP ~160 mmHg) is abruptly lowered to &quot;normal&quot; 120/80 mmHg (MAP 93 mmHg), their MAP drops far below their shifted lower autoregulatory threshold (105 mmHg). This precipitates profound cerebral hypoperfusion, causing border-zone watershed ischemic infarctions (anterior-middle cerebral artery watershed boundaries), retinal ischemic blindness, or acute oliguric tubular necrosis.
              </div>
            </div>
          </section>

          {/* Section 3: Condition-Specific Protocols */}
          <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white">
                  3. Condition-Specific Hemodynamic Protocols &amp; Target Matrix
                </h2>
                <p className="text-sm text-slate-400">
                  Tailored Pharmacotherapy Based on Organ-Specific Vulnerabilities
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2">
                <h3 className="text-sm font-bold text-rose-400">Acute Aortic Dissection (Type A or B)</h3>
                <p className="text-slate-300 leading-relaxed">
                  <strong>The Sole Exception to the 25% Rule:</strong> Shear stress on the aortic intimal tear is governed by the rate of ventricular pressure rise over time (dP/dt). Goals are SBP &lt; 120 mmHg (ideally 100-110 mmHg) and HR &lt; 60 bpm within 15 to 20 minutes.
                </p>
                <div className="p-2.5 rounded bg-rose-950/40 border border-rose-800/40 text-rose-200">
                  <strong>Sequence Interlock:</strong> Administer IV Beta-blockers (Esmolol loading bolus + infusion or Labetalol) <em>prior to or concurrently with</em> vasodilators. Vasodilation alone triggers reflex sympathetic tachycardia, increasing dP/dt and causing fatal aortic rupture.
                </div>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2">
                <h3 className="text-sm font-bold text-blue-400">Sympathetic Crashing Acute Pulmonary Edema (SCAPE)</h3>
                <p className="text-slate-300 leading-relaxed">
                  Severe afterload mismatch drives acute left ventricular diastolic dysfunction and retrograde alveolar flooding. Target: Rapid 20% to 30% reduction in SBP over 30 to 60 minutes.
                </p>
                <div className="p-2.5 rounded bg-blue-950/40 border border-blue-800/40 text-blue-200">
                  <strong>Preferred Regimen:</strong> High-dose IV Nitroglycerin (100 to 400 &mu;g/min) and/or IV Nicardipine alongside non-invasive positive pressure ventilation (BiPAP/CPAP). Pure beta-blockers are strictly contraindicated due to acute negative inotropy.
                </div>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2">
                <h3 className="text-sm font-bold text-amber-400">Acute Ischemic Stroke (AIS)</h3>
                <p className="text-slate-300 leading-relaxed">
                  In acute focal cerebral ischemia, autoregulation in the ischemic penumbra is paralyzed; perfusion depends passively on systemic MAP.
                </p>
                <div className="p-2.5 rounded bg-amber-950/40 border border-amber-800/40 text-amber-200">
                  <strong>Thrombolysis Candidate:</strong> Reduce BP to &lt; 185/110 mmHg prior to IV Alteplase/Tenecteplase, and maintain &lt; 180/105 mmHg for 24 hours.<br />
                  <strong>Non-Thrombolysis Candidate:</strong> Maintain <strong>permissive hypertension up to 220/120 mmHg</strong>. Do not treat unless &gt; 220/120 mmHg (then lower by only 15%).
                </div>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2">
                <h3 className="text-sm font-bold text-emerald-400">Acute Intracerebral Hemorrhage (ICH)</h3>
                <p className="text-slate-300 leading-relaxed">
                  According to AHA/ASA 2022 Guidelines, in patients presenting with SBP between 150 and 220 mmHg, acute lowering of SBP to 130-140 mmHg within 1 to 2 hours is safe and attenuates hematoma expansion.
                </p>
                <div className="p-2.5 rounded bg-emerald-950/40 border border-emerald-800/40 text-emerald-200">
                  <strong>Guardrail:</strong> Avoid SBP &lt; 130 mmHg, which is associated with increased acute renal failure and adverse outcomes.
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Toxicology and Pharmacovigilance */}
          <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white">
                  4. Toxicology &amp; Critical Care Pharmacovigilance
                </h2>
                <p className="text-sm text-slate-400">
                  Cyanide Poisoning, Thiocyanate Encephalopathy &amp; Drug-Specific Hazards
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-2">
                <h3 className="text-sm font-bold text-red-400">Sodium Nitroprusside Toxicity</h3>
                <p className="leading-relaxed">
                  Sodium Nitroprusside (SNP) consists of a ferrous iron core bound to five cyanide groups and one nitrosyl group. RBC hemoglobin reduces SNP, non-enzymatically releasing five free cyanide (CN&minus;) ions.
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-400">
                  <li><strong>Cyanide Toxicity:</strong> Free CN&minus; binds ferric (Fe3+) iron in mitochondrial cytochrome c oxidase, halting oxidative phosphorylation. Symptoms include refractory lactic acidosis, mixed venous hyperoxia (inability to extract oxygen), altered sensorium, and cardiovascular collapse.</li>
                  <li><strong>Prevention &amp; Rescue:</strong> Limit rate to &lt; 2 &mu;g/kg/min and duration &lt; 24-48 hours. Co-infuse Sodium Thiosulfate (1 g per 100 mg SNP) to supply sulfur donors for hepatic rhodanese. Treat acute poisoning with IV Hydroxocobalamin (5 g).</li>
                  <li><strong>Thiocyanate Toxicity:</strong> Thiocyanate clearance depends entirely on renal excretion (t&frac12; 3-7 days, extended to 14 days in renal failure). Symptoms include tinnitus, hyperreflexia, psychosis, and seizures.</li>
                </ul>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-2">
                <h3 className="text-sm font-bold text-cyan-400">Clevidipine Lipid Emulsion Formulation</h3>
                <p className="leading-relaxed">
                  Clevidipine is an ultra-short-acting third-generation dihydropyridine calcium channel blocker cleaved by ubiquitous blood and tissue esterases (independent of hepatic or renal clearance).
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-400">
                  <li><strong>Lipid Caloric Load:</strong> Formulated as a 20% soybean oil-in-water lipid emulsion containing 0.2 g fat/mL (2.0 kcal/mL). Prolonged infusions (&gt; 24-72 hours) or high titration rates deliver substantial lipid calories.</li>
                  <li><strong>Pancreatitis Risk:</strong> Monitor serum triglycerides in patients with pre-existing hypertriglyceridemia, acute pancreatitis history, or prolonged therapy. Contraindicated in patients with severe egg or soy allergies.</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
