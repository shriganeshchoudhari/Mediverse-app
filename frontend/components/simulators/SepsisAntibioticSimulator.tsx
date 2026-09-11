'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Flame,
  Activity,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
  Pill,
  Timer,
  Droplets,
  HeartPulse,
  TrendingDown,
  Clock,
} from 'lucide-react';
import {
  evaluateSep1Compliance,
  calculateAntibioticPkPd,
  evaluateProcalcitoninKinetics,
  PatientSepsisVitals,
  Sep1BundleChecklist,
  AntibioticPkPdDosingInput,
  AntibioticClassType,
} from '../../.gemini/skills/SepsisAntibioticPkPdEngine';

interface PresetCase {
  id: string;
  name: string;
  badge: string;
  summary: string;
  vitals: PatientSepsisVitals;
  bundle: Sep1BundleChecklist;
  antibiotic: AntibioticPkPdDosingInput;
}

const PRESET_CASES: PresetCase[] = [
  {
    id: 'septic-shock-pneumonia',
    name: 'Severe Pneumosepsis in Septic Shock',
    badge: 'SEP-1 Hour-1 Crisis',
    summary:
      '68-year-old male with severe community-acquired pneumonia, MAP 56 mmHg, and serum lactate 4.6 mmol/L. Requires rapid 30 mL/kg crystalloid, blood cultures prior to antibiotics, and immediate norepinephrine.',
    vitals: {
      weightKg: 80,
      creatinineClearanceMlMin: 75,
      systolicBpMmHg: 82,
      meanArterialPressureMmHg: 56,
      heartRateBpm: 126,
      serumLactateMmolL: 4.6,
      baselineProcalcitoninMcgL: 9.8,
      currentProcalcitoninMcgL: 8.2,
      isNorepinephrineInfusing: true,
      norepinephrineDoseMcgKgMin: 0.15,
      isVasopressinInfusing: false,
    },
    bundle: {
      serumLactateMeasuredInitial: true,
      bloodCulturesDrawnBeforeAntibiotics: true,
      broadSpectrumAntibioticsAdministeredWithin1Hour: true,
      crystalloid30MlPerKgCompleted: true,
      repeatLactateWithin2To4Hours: true,
      dynamicFluidResponsivenessAssessed: true,
    },
    antibiotic: {
      drugName: 'Piperacillin-Tazobactam',
      antibioticClass: 'BETA_LACTAM_TIME_DEPENDENT',
      doseMg: 4500,
      dosingIntervalHours: 6,
      infusionDurationHours: 4.0, // Extended infusion
      pathogenMicMgL: 16,
    },
  },
  {
    id: 'augmented-renal-clearance',
    name: 'Polytrauma Sepsis with Augmented Renal Clearance (ARC)',
    badge: 'ARC PK Failure Hazard',
    summary:
      '27-year-old ICU patient with ventilator-associated pneumonia and hyperdynamic circulation (CrCl 165 mL/min). Standard short infusion fails target attainment; requires 4h extended infusion.',
    vitals: {
      weightKg: 75,
      creatinineClearanceMlMin: 165,
      systolicBpMmHg: 115,
      meanArterialPressureMmHg: 78,
      heartRateBpm: 94,
      serumLactateMmolL: 1.8,
      baselineProcalcitoninMcgL: 4.5,
      currentProcalcitoninMcgL: 3.8,
      isNorepinephrineInfusing: false,
      norepinephrineDoseMcgKgMin: 0,
      isVasopressinInfusing: false,
    },
    bundle: {
      serumLactateMeasuredInitial: true,
      bloodCulturesDrawnBeforeAntibiotics: true,
      broadSpectrumAntibioticsAdministeredWithin1Hour: true,
      crystalloid30MlPerKgCompleted: true,
      repeatLactateWithin2To4Hours: true,
      dynamicFluidResponsivenessAssessed: true,
    },
    antibiotic: {
      drugName: 'Meropenem',
      antibioticClass: 'BETA_LACTAM_TIME_DEPENDENT',
      doseMg: 2000,
      dosingIntervalHours: 8,
      infusionDurationHours: 3.0,
      pathogenMicMgL: 2.0,
    },
  },
  {
    id: 'urosepsis-aminoglycoside',
    name: 'Pyelonephritis Urosepsis with Amikacin Peak Optimization',
    badge: 'Concentration-Dependent',
    summary:
      '72-year-old female with ESBL E. coli bacteremia from obstructive pyelonephritis. Extended-interval aminoglycoside dosing achieves therapeutic Cmax/MIC >= 8-10.',
    vitals: {
      weightKg: 65,
      creatinineClearanceMlMin: 65,
      systolicBpMmHg: 95,
      meanArterialPressureMmHg: 68,
      heartRateBpm: 108,
      serumLactateMmolL: 2.4,
      baselineProcalcitoninMcgL: 6.5,
      currentProcalcitoninMcgL: 5.0,
      isNorepinephrineInfusing: false,
      norepinephrineDoseMcgKgMin: 0,
      isVasopressinInfusing: false,
    },
    bundle: {
      serumLactateMeasuredInitial: true,
      bloodCulturesDrawnBeforeAntibiotics: true,
      broadSpectrumAntibioticsAdministeredWithin1Hour: true,
      crystalloid30MlPerKgCompleted: true,
      repeatLactateWithin2To4Hours: true,
      dynamicFluidResponsivenessAssessed: true,
    },
    antibiotic: {
      drugName: 'Amikacin',
      antibioticClass: 'AMINOGLYCOSIDE_CONC_DEPENDENT',
      doseMg: 1300,
      dosingIntervalHours: 24,
      infusionDurationHours: 1.0,
      pathogenMicMgL: 4.0,
    },
  },
  {
    id: 'pct-stewardship-deescalation',
    name: 'Day-4 Sepsis Response with 88% Procalcitonin Clearance',
    badge: 'Antimicrobial Stewardship',
    summary:
      'Day 4 of source-controlled intra-abdominal sepsis. Procalcitonin plummeted from 16.0 to 1.8 mcg/L. Favorable kinetic decline prompts safe antimicrobial de-escalation.',
    vitals: {
      weightKg: 78,
      creatinineClearanceMlMin: 80,
      systolicBpMmHg: 122,
      meanArterialPressureMmHg: 84,
      heartRateBpm: 76,
      serumLactateMmolL: 1.1,
      baselineProcalcitoninMcgL: 16.0,
      currentProcalcitoninMcgL: 1.8,
      isNorepinephrineInfusing: false,
      norepinephrineDoseMcgKgMin: 0,
      isVasopressinInfusing: false,
    },
    bundle: {
      serumLactateMeasuredInitial: true,
      bloodCulturesDrawnBeforeAntibiotics: true,
      broadSpectrumAntibioticsAdministeredWithin1Hour: true,
      crystalloid30MlPerKgCompleted: true,
      repeatLactateWithin2To4Hours: true,
      dynamicFluidResponsivenessAssessed: true,
    },
    antibiotic: {
      drugName: 'Piperacillin-Tazobactam',
      antibioticClass: 'BETA_LACTAM_TIME_DEPENDENT',
      doseMg: 3375,
      dosingIntervalHours: 6,
      infusionDurationHours: 4.0,
      pathogenMicMgL: 8.0,
    },
  },
];

export default function SepsisAntibioticSimulator() {
  const [activePreset, setActivePreset] = useState<PresetCase>(PRESET_CASES[0]);
  const [vitals, setVitals] = useState<PatientSepsisVitals>(PRESET_CASES[0].vitals);
  const [bundle, setBundle] = useState<Sep1BundleChecklist>(PRESET_CASES[0].bundle);
  const [antibiotic, setAntibiotic] = useState<AntibioticPkPdDosingInput>(PRESET_CASES[0].antibiotic);

  const applyPreset = (preset: PresetCase) => {
    setActivePreset(preset);
    setVitals(preset.vitals);
    setBundle(preset.bundle);
    setAntibiotic(preset.antibiotic);
  };

  // 1. SEP-1 compliance
  const sep1Result = useMemo(() => evaluateSep1Compliance(vitals, bundle), [vitals, bundle]);

  // 2. Antibiotic PK/PD target attainment
  const pkpdResult = useMemo(() => calculateAntibioticPkPd(vitals, antibiotic), [vitals, antibiotic]);

  // 3. Procalcitonin Kinetics
  const pctResult = useMemo(
    () => evaluateProcalcitoninKinetics(vitals.baselineProcalcitoninMcgL, vitals.currentProcalcitoninMcgL),
    [vitals.baselineProcalcitoninMcgL, vitals.currentProcalcitoninMcgL]
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Navigation */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-wider mb-1">
              <Link href="/simulators" className="hover:underline text-slate-400">
                Simulators
              </Link>
              <span>/</span>
              <span>Infectious Diseases, Critical Care &amp; Stewardship</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
              <Flame className="w-8 h-8 text-rose-500 animate-pulse" />
              Sepsis Bundles (SEP-1), Antibiotic PK/PD &amp; Procalcitonin Workstation
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              Surviving Sepsis Campaign Hour-1 bundle surveillance, precision antimicrobial pharmacokinetics/pharmacodynamics
              (%fT&gt;MIC, Cmax/MIC, AUC/MIC), augmented renal clearance (ARC), and serial procalcitonin de-escalation kinetics.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold rounded-full flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              PK/PD &amp; SEP-1 Engine
            </span>
          </div>
        </div>

        {/* Case Presets Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESET_CASES.map((preset) => {
            const isSelected = activePreset.id === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset)}
                className={'text-left p-3 rounded-xl border transition-all ' + (isSelected
                  ? 'bg-rose-950/40 border-rose-500 shadow-md shadow-rose-950/30'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900')}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400">
                    {preset.badge}
                  </span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />}
                </div>
                <h3 className="text-xs font-bold text-white line-clamp-1">{preset.name}</h3>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-snug">
                  {preset.summary}
                </p>
              </button>
            );
          })}
        </div>

        {/* 3-Column Workstation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Column 1: SEP-1 Bundle Quality Measures (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h2 className="text-sm font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-2">
                  <Timer className="w-4 h-4" /> SEP-1 Bundle Checklist
                </h2>
                <span className={'px-2.5 py-0.5 rounded text-xs font-bold ' + (sep1Result.isCompliant
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40')}>
                  {sep1Result.isCompliant ? 'SEP-1 COMPLIANT' : 'BUNDLE DEFICIENT'}
                </span>
              </div>

              {/* Vitals Summary */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                <div>
                  <span className="text-slate-400 block">Mean Arterial Pressure:</span>
                  <span className={'font-mono font-bold ' + (vitals.meanArterialPressureMmHg < 65 ? 'text-rose-400' : 'text-slate-200')}>
                    {vitals.meanArterialPressureMmHg} mmHg
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Initial Serum Lactate:</span>
                  <span className={'font-mono font-bold ' + (vitals.serumLactateMmolL >= 4.0
                    ? 'text-rose-400 animate-pulse'
                    : vitals.serumLactateMmolL > 2.0
                    ? 'text-amber-400'
                    : 'text-slate-200')}>
                    {vitals.serumLactateMmolL} mmol/L
                  </span>
                </div>
              </div>

              {/* Interactive Checklist Elements */}
              <div className="space-y-2.5 text-xs">
                <label className="flex items-center gap-2 cursor-pointer p-2 rounded bg-slate-950/40 border border-slate-800">
                  <input
                    type="checkbox"
                    checked={bundle.serumLactateMeasuredInitial}
                    onChange={(e) => setBundle((prev) => ({ ...prev, serumLactateMeasuredInitial: e.target.checked }))}
                    className="accent-rose-500"
                  />
                  <span className="text-slate-200">1. Measure Initial Serum Lactate (&le; 1h)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer p-2 rounded bg-slate-950/40 border border-slate-800">
                  <input
                    type="checkbox"
                    checked={bundle.bloodCulturesDrawnBeforeAntibiotics}
                    onChange={(e) =>
                      setBundle((prev) => ({
                        ...prev,
                        bloodCulturesDrawnBeforeAntibiotics: e.target.checked,
                      }))
                    }
                    className="accent-rose-500"
                  />
                  <span className="text-slate-200">2. Blood Cultures Drawn BEFORE Antibiotics</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer p-2 rounded bg-slate-950/40 border border-slate-800">
                  <input
                    type="checkbox"
                    checked={bundle.broadSpectrumAntibioticsAdministeredWithin1Hour}
                    onChange={(e) =>
                      setBundle((prev) => ({
                        ...prev,
                        broadSpectrumAntibioticsAdministeredWithin1Hour: e.target.checked,
                      }))
                    }
                    className="accent-rose-500"
                  />
                  <span className="text-slate-200">3. Broad-Spectrum IV Antibiotics (&le; 1 Hour)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer p-2 rounded bg-slate-950/40 border border-slate-800">
                  <input
                    type="checkbox"
                    checked={bundle.crystalloid30MlPerKgCompleted}
                    onChange={(e) =>
                      setBundle((prev) => ({
                        ...prev,
                        crystalloid30MlPerKgCompleted: e.target.checked,
                      }))
                    }
                    className="accent-rose-500"
                  />
                  <div>
                    <span className="text-slate-200 block font-semibold">
                      4. 30 mL/kg Crystalloid Completed
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Required if MAP &lt; 65 or Lactate &ge; 4.0: {sep1Result.fluidVolumeRequiredMl} mL
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-2 cursor-pointer p-2 rounded bg-slate-950/40 border border-slate-800">
                  <input
                    type="checkbox"
                    checked={bundle.repeatLactateWithin2To4Hours}
                    onChange={(e) =>
                      setBundle((prev) => ({
                        ...prev,
                        repeatLactateWithin2To4Hours: e.target.checked,
                      }))
                    }
                    className="accent-rose-500"
                  />
                  <span className="text-slate-200">5. Repeat Lactate within 2-4h (if initial &gt; 2.0)</span>
                </label>
              </div>

              {/* Failed Elements Alert Card */}
              {sep1Result.failedElements.length > 0 && (
                <div className="bg-rose-950/60 border border-rose-500/50 rounded-lg p-3 space-y-1 text-xs">
                  <span className="text-[11px] font-bold text-rose-400 uppercase flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Failed SEP-1 Bundle Measures:
                  </span>
                  <ul className="list-disc list-inside text-[11px] text-rose-300 space-y-0.5">
                    {sep1Result.failedElements.map((elem, i) => (
                      <li key={i}>{elem}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Column 2: Antimicrobial PK/PD Target Attainment (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h2 className="text-sm font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-2">
                  <Pill className="w-4 h-4" /> Antimicrobial PK/PD Solver
                </h2>
                <span className={'px-2 py-0.5 rounded text-xs font-mono font-bold ' + (pkpdResult.isTargetAttained
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40')}>
                  {pkpdResult.isTargetAttained ? 'TARGET ATTAINED' : 'SUB-THERAPEUTIC'}
                </span>
              </div>

              {/* Creatinine Clearance & ARC Badge */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Creatinine Clearance (CrCl):</span>
                  <span className={'font-mono font-bold ' + (vitals.creatinineClearanceMlMin > 130 ? 'text-amber-400' : 'text-slate-200')}>
                    {vitals.creatinineClearanceMlMin} mL/min
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="180"
                  step="5"
                  value={vitals.creatinineClearanceMlMin}
                  onChange={(e) => setVitals((prev) => ({ ...prev, creatinineClearanceMlMin: Number(e.target.value) }))}
                  className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                {pkpdResult.augmentedRenalClearanceHazard && (
                  <div className="p-1.5 rounded bg-amber-950/60 border border-amber-500/40 text-[10px] text-amber-300">
                    <strong>Augmented Renal Clearance (ARC &gt; 130 mL/min):</strong> Dramatically accelerates antibiotic clearance. Standard infusions result in therapeutic failure.
                  </div>
                )}
              </div>

              {/* Dosing Parameters */}
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Antibiotic Class / Killing Model:</label>
                  <select
                    value={antibiotic.antibioticClass}
                    onChange={(e) =>
                      setAntibiotic((prev) => ({
                        ...prev,
                        antibioticClass: e.target.value as AntibioticClassType,
                      }))
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-white"
                  >
                    <option value="BETA_LACTAM_TIME_DEPENDENT">&beta;-Lactams (%fT &gt; MIC) - Pip/Tazo, Meropenem</option>
                    <option value="AMINOGLYCOSIDE_CONC_DEPENDENT">Aminoglycosides (Cmax / MIC) - Amikacin, Gentamicin</option>
                    <option value="GLYCOPEPTIDE_AUC_DEPENDENT">Glycopeptides (AUC24 / MIC) - Vancomycin</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 block mb-1">Dose (mg):</label>
                    <input
                      type="number"
                      value={antibiotic.doseMg}
                      onChange={(e) => setAntibiotic((prev) => ({ ...prev, doseMg: Number(e.target.value) }))}
                      className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Interval (hours):</label>
                    <input
                      type="number"
                      value={antibiotic.dosingIntervalHours}
                      onChange={(e) => setAntibiotic((prev) => ({ ...prev, dosingIntervalHours: Number(e.target.value) }))}
                      className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white font-mono"
                    />
                  </div>
                </div>

                {/* Infusion Duration (Extended vs Short) */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-rose-400" /> Infusion Duration:
                    </span>
                    <span className="font-mono text-rose-400 font-bold">
                      {antibiotic.infusionDurationHours} hours {antibiotic.infusionDurationHours >= 3.0 ? '(Extended Infusion)' : '(Short Infusion)'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="6.0"
                    step="0.5"
                    value={antibiotic.infusionDurationHours}
                    onChange={(e) => setAntibiotic((prev) => ({ ...prev, infusionDurationHours: Number(e.target.value) }))}
                    className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>0.5h Standard</span>
                    <span>3.0-4.0h Extended Infusion</span>
                  </div>
                </div>

                {/* Pathogen MIC */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400">Pathogen MIC (mg/L):</span>
                    <span className="font-mono text-rose-400 font-bold">{antibiotic.pathogenMicMgL} mg/L</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="32"
                    step="0.5"
                    value={antibiotic.pathogenMicMgL}
                    onChange={(e) => setAntibiotic((prev) => ({ ...prev, pathogenMicMgL: Number(e.target.value) }))}
                    className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* Target Attainment Card */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Target Index:</span>
                  <span className="font-bold text-white font-mono">{pkpdResult.targetValueRequired}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Simulated Value:</span>
                  <span className={'text-base font-black font-mono ' + (pkpdResult.isTargetAttained ? 'text-emerald-400' : 'text-rose-400')}>
                    {pkpdResult.simulatedValue}{pkpdResult.indexType === 'fT_GREATER_THAN_MIC' ? '%' : ''}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug pt-1 border-t border-slate-800">
                  {pkpdResult.optimizationRecommendation}
                </p>
              </div>
            </div>
          </div>

          {/* Column 3: Procalcitonin (PCT) Kinetics & Stewardship (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h2 className="text-sm font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-2">
                  <TrendingDown className="w-4 h-4" /> Procalcitonin Kinetics
                </h2>
                <span className={'px-2 py-0.5 rounded text-xs font-bold ' + (pctResult.isDeEscalationSafe
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40')}>
                  {pctResult.isDeEscalationSafe ? 'SAFE DE-ESCALATION' : 'ONGOING INFECTION'}
                </span>
              </div>

              {/* Serial PCT Values */}
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400">Baseline Peak Procalcitonin:</span>
                    <span className="font-mono text-rose-400 font-bold">{vitals.baselineProcalcitoninMcgL} mcg/L</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="25.0"
                    step="0.5"
                    value={vitals.baselineProcalcitoninMcgL}
                    onChange={(e) => setVitals((prev) => ({ ...prev, baselineProcalcitoninMcgL: Number(e.target.value) }))}
                    className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400">Current Day Procalcitonin:</span>
                    <span className="font-mono text-rose-400 font-bold">{vitals.currentProcalcitoninMcgL} mcg/L</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="20.0"
                    step="0.1"
                    value={vitals.currentProcalcitoninMcgL}
                    onChange={(e) => setVitals((prev) => ({ ...prev, currentProcalcitoninMcgL: Number(e.target.value) }))}
                    className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Percentage Drop Gauge */}
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-semibold">Kinetic Decline:</span>
                    <span className={'text-lg font-black font-mono ' + (pctResult.procalcitoninDropPercent >= 80 ? 'text-emerald-400' : 'text-amber-400')}>
                      {pctResult.procalcitoninDropPercent}% Drop
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className={'h-full transition-all duration-300 ' + (pctResult.procalcitoninDropPercent >= 80 ? 'bg-emerald-400' : 'bg-amber-400')}
                      style={{ width: `${Math.min(100, Math.max(0, pctResult.procalcitoninDropPercent))}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Target &ge; 80% Drop</span>
                    <span>Or Current &lt; 0.50 mcg/L</span>
                  </div>
                </div>

                {/* Stewardship Decision Card */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 space-y-1.5 text-xs">
                  <span className="text-[11px] font-bold text-rose-400 uppercase block">
                    Antimicrobial Stewardship Action:
                  </span>
                  <p className="text-[11px] text-slate-200 leading-snug">
                    {pctResult.recommendation}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
