'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  FlaskConical,
  Activity,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
  Droplets,
  Layers,
  Pill,
  Scale,
  Zap,
} from 'lucide-react';
import {
  evaluateRenalTubularAcidosis,
  SerumElectrolytesInput,
  UrineElectrolytesInput,
} from '../../.gemini/skills/RenalTubularAcidosisEngine';

interface PresetCase {
  id: string;
  name: string;
  badge: string;
  summary: string;
  serum: SerumElectrolytesInput;
  urine: UrineElectrolytesInput;
}

const PRESET_CASES: PresetCase[] = [
  {
    id: 'distal-rta-type1',
    name: 'Classic Distal RTA (Type 1) with Nephrocalcinosis',
    badge: 'Type 1 Distal RTA',
    summary:
      '34-year-old female with Sjögren syndrome and recurrent nephrolithiasis. Inability to acidify urine (pH 6.8) despite systemic acidemia, positive UAG (+35), and hypokalemia.',
    serum: {
      sodiumMeqL: 140,
      potassiumMeqL: 3.1,
      chlorideMeqL: 114,
      bicarbonateMeqL: 15,
      arterialPh: 7.28,
      pco2MmHg: 33,
      creatinineMgDl: 1.0,
    },
    urine: {
      urineSodiumMeqL: 50,
      urinePotassiumMeqL: 30,
      urineChlorideMeqL: 45,
      urinePh: 6.8,
      measuredUrineOsmolalityMOsmKg: 340,
      urineUreaNitrogenMgDl: 300,
      urineGlucoseMgDl: 0,
      urineCreatinineMgDl: 80,
    },
  },
  {
    id: 'proximal-rta-type2',
    name: 'Proximal RTA (Type 2) with Fanconi Syndrome',
    badge: 'Type 2 Proximal RTA',
    summary:
      '52-year-old male with multiple myeloma light-chain nephropathy. Massive bicarbonate wasting (FE_HCO3 > 15%), normoglycemic glucosuria, and hypophosphatemic bone disease.',
    serum: {
      sodiumMeqL: 138,
      potassiumMeqL: 3.3,
      chlorideMeqL: 112,
      bicarbonateMeqL: 18,
      arterialPh: 7.32,
      pco2MmHg: 36,
      creatinineMgDl: 1.0,
    },
    urine: {
      urineSodiumMeqL: 60,
      urinePotassiumMeqL: 35,
      urineChlorideMeqL: 75,
      urinePh: 6.5,
      measuredUrineOsmolalityMOsmKg: 400,
      urineUreaNitrogenMgDl: 320,
      urineGlucoseMgDl: 140,
      urineCreatinineMgDl: 30,
      urineBicarbonateMeqL: 120,
    },
  },
  {
    id: 'hyperkalemic-rta-type4',
    name: 'Hyperkalemic RTA (Type 4) in Diabetic Nephropathy',
    badge: 'Type 4 Hyperkalemic',
    summary:
      '66-year-old diabetic on lisinopril and spironolactone with hyporeninemic hypoaldosteronism. Hyperkalemia (5.9) suppresses ammoniagenesis, but urine pH is appropriately acidic (5.0).',
    serum: {
      sodiumMeqL: 136,
      potassiumMeqL: 5.9,
      chlorideMeqL: 110,
      bicarbonateMeqL: 17,
      arterialPh: 7.30,
      pco2MmHg: 35,
      creatinineMgDl: 1.6,
    },
    urine: {
      urineSodiumMeqL: 42,
      urinePotassiumMeqL: 18,
      urineChlorideMeqL: 36,
      urinePh: 5.0,
      measuredUrineOsmolalityMOsmKg: 380,
      urineUreaNitrogenMgDl: 350,
      urineGlucoseMgDl: 0,
      urineCreatinineMgDl: 90,
    },
  },
  {
    id: 'secretory-diarrhea-gi',
    name: 'Secretory Diarrhea (Gastrointestinal HCO3- Loss)',
    badge: 'GI Bicarbonate Loss',
    summary:
      '45-year-old female with profuse watery diarrhea. Intact renal acidification and brisk NH4+ excretion yields strongly negative UAG (-40) and high urine osmolal gap (>150).',
    serum: {
      sodiumMeqL: 138,
      potassiumMeqL: 3.2,
      chlorideMeqL: 116,
      bicarbonateMeqL: 14,
      arterialPh: 7.26,
      pco2MmHg: 30,
      creatinineMgDl: 1.1,
    },
    urine: {
      urineSodiumMeqL: 25,
      urinePotassiumMeqL: 20,
      urineChlorideMeqL: 85,
      urinePh: 4.9,
      measuredUrineOsmolalityMOsmKg: 520,
      urineUreaNitrogenMgDl: 420,
      urineGlucoseMgDl: 0,
      urineCreatinineMgDl: 100,
    },
  },
];

export default function RenalTubularAcidosisSimulator() {
  const [activePreset, setActivePreset] = useState<PresetCase>(PRESET_CASES[0]);
  const [serum, setSerum] = useState<SerumElectrolytesInput>(PRESET_CASES[0].serum);
  const [urine, setUrine] = useState<UrineElectrolytesInput>(PRESET_CASES[0].urine);

  const applyPreset = (preset: PresetCase) => {
    setActivePreset(preset);
    setSerum(preset.serum);
    setUrine(preset.urine);
  };

  // Diagnostic Outcome
  const rtaOutcome = useMemo(() => evaluateRenalTubularAcidosis(serum, urine), [serum, urine]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Navigation */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-400 uppercase tracking-wider mb-1">
              <Link href="/simulators" className="hover:underline text-slate-400">
                Simulators
              </Link>
              <span>/</span>
              <span>Nephrology &amp; Clinical Acid-Base</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
              <FlaskConical className="w-8 h-8 text-teal-400" />
              Renal Tubular Acidosis (RTA) &amp; Urine Anion Gap Workstation
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              Solve Normal Anion Gap Metabolic Acidosis (NAGMA), differentiate RTA Types 1, 2, and 4 from GI diarrhea,
              compute Urine Anion Gap (UAG) and Urine Osmolal Gap (UOG), and guide precision alkali and kaliuretic regimens.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold rounded-full flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Tubular Acid-Base Engine
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
                  ? 'bg-teal-950/40 border-teal-500 shadow-md shadow-teal-950/30'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900')}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400">
                    {preset.badge}
                  </span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />}
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
          {/* Column 1: Serum Electrolytes & Acid-Base Panel (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h2 className="text-sm font-semibold text-teal-400 uppercase tracking-wider flex items-center gap-2">
                  <Scale className="w-4 h-4" /> Serum Electrolytes &amp; AG
                </h2>
                <span className={'px-2.5 py-0.5 rounded text-xs font-mono font-bold ' + (rtaOutcome.serumAnionGap > 12
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30')}>
                  Serum AG: {rtaOutcome.serumAnionGap}
                </span>
              </div>

              <div className="space-y-3 text-xs">
                {/* Serum Sodium */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400">Serum Sodium (Na+):</span>
                    <span className="font-mono text-teal-400 font-bold">{serum.sodiumMeqL} mEq/L</span>
                  </div>
                  <input
                    type="range"
                    min="120"
                    max="155"
                    step="1"
                    value={serum.sodiumMeqL}
                    onChange={(e) => setSerum((prev) => ({ ...prev, sodiumMeqL: Number(e.target.value) }))}
                    className="w-full accent-teal-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Serum Potassium */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400">Serum Potassium (K+):</span>
                    <span className={'font-mono font-bold ' + (serum.potassiumMeqL > 5.0
                      ? 'text-rose-400'
                      : serum.potassiumMeqL < 3.5
                      ? 'text-amber-400'
                      : 'text-slate-200')}>
                      {serum.potassiumMeqL.toFixed(1)} mEq/L ({rtaOutcome.hypokalemiaOrHyperkalemia})
                    </span>
                  </div>
                  <input
                    type="range"
                    min="2.0"
                    max="7.0"
                    step="0.1"
                    value={serum.potassiumMeqL}
                    onChange={(e) => setSerum((prev) => ({ ...prev, potassiumMeqL: Number(e.target.value) }))}
                    className="w-full accent-teal-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>&lt;3.5 Hypo (Types 1 &amp; 2)</span>
                    <span>&gt;5.0 Hyper (Type 4)</span>
                  </div>
                </div>

                {/* Serum Chloride */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400">Serum Chloride (Cl-):</span>
                    <span className="font-mono text-teal-400 font-bold">{serum.chlorideMeqL} mEq/L</span>
                  </div>
                  <input
                    type="range"
                    min="90"
                    max="125"
                    step="1"
                    value={serum.chlorideMeqL}
                    onChange={(e) => setSerum((prev) => ({ ...prev, chlorideMeqL: Number(e.target.value) }))}
                    className="w-full accent-teal-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Hyperchloremia characteristic of NAGMA</span>
                  </div>
                </div>

                {/* Serum Bicarbonate */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400">Serum Bicarbonate (HCO3-):</span>
                    <span className="font-mono text-amber-400 font-bold">{serum.bicarbonateMeqL} mEq/L</span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="30"
                    step="1"
                    value={serum.bicarbonateMeqL}
                    onChange={(e) => setSerum((prev) => ({ ...prev, bicarbonateMeqL: Number(e.target.value) }))}
                    className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Arterial pH */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400">Arterial pH:</span>
                    <span className={'font-mono font-bold ' + (serum.arterialPh < 7.35 ? 'text-rose-400' : 'text-slate-200')}>
                      {serum.arterialPh.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="7.10"
                    max="7.48"
                    step="0.01"
                    value={serum.arterialPh}
                    onChange={(e) => setSerum((prev) => ({ ...prev, arterialPh: Number(e.target.value) }))}
                    className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* Serum Anion Gap Status Card */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Acidosis Classification:</span>
                  <span className={'font-bold ' + (rtaOutcome.isNormalAnionGapMetabolicAcidosis
                    ? 'text-teal-400'
                    : 'text-amber-400')}>
                    {rtaOutcome.isNormalAnionGapMetabolicAcidosis
                      ? 'NAGMA (Hyperchloremic)'
                      : 'Non-NAGMA / Other'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Serum AG = {serum.sodiumMeqL} - ({serum.chlorideMeqL} + {serum.bicarbonateMeqL}) = {rtaOutcome.serumAnionGap} mEq/L (Normal 8-12).
                </p>
              </div>
            </div>
          </div>

          {/* Column 2: Urine Chemistry, UAG & Ammonium Kinetics (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h2 className="text-sm font-semibold text-teal-400 uppercase tracking-wider flex items-center gap-2">
                  <Droplets className="w-4 h-4" /> Urine Anion Gap &amp; NH4+
                </h2>
                <span className={'px-2.5 py-0.5 rounded text-xs font-mono font-bold ' + (urine.urinePh > 5.3
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-teal-500/20 text-teal-300 border border-teal-500/30')}>
                  Urine pH {urine.urinePh.toFixed(1)}
                </span>
              </div>

              <div className="space-y-3 text-xs">
                {/* Urine pH */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400">Urine pH (Acidification test):</span>
                    <span className={'font-mono font-bold ' + (urine.urinePh > 5.3 ? 'text-amber-400' : 'text-teal-400')}>
                      {urine.urinePh.toFixed(1)} {urine.urinePh > 5.3 ? '(Inability to Acidify)' : '(Preserved)'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="4.5"
                    max="7.8"
                    step="0.1"
                    value={urine.urinePh}
                    onChange={(e) => setUrine((prev) => ({ ...prev, urinePh: Number(e.target.value) }))}
                    className="w-full accent-teal-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>&le;5.3 Normal distal pump / Type 4</span>
                    <span>&gt;5.3 Distal RTA (Type 1)</span>
                  </div>
                </div>

                {/* Urine Electrolytes */}
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-slate-400 block mb-1">Urine Na+:</label>
                    <input
                      type="number"
                      value={urine.urineSodiumMeqL}
                      onChange={(e) => setUrine((prev) => ({ ...prev, urineSodiumMeqL: Number(e.target.value) }))}
                      className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Urine K+:</label>
                    <input
                      type="number"
                      value={urine.urinePotassiumMeqL}
                      onChange={(e) => setUrine((prev) => ({ ...prev, urinePotassiumMeqL: Number(e.target.value) }))}
                      className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Urine Cl-:</label>
                    <input
                      type="number"
                      value={urine.urineChlorideMeqL}
                      onChange={(e) => setUrine((prev) => ({ ...prev, urineChlorideMeqL: Number(e.target.value) }))}
                      className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white font-mono"
                    />
                  </div>
                </div>

                {/* Urine Anion Gap Scale Graphic */}
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-semibold">Urine Anion Gap (UAG):</span>
                    <span className={'text-base font-black font-mono ' + (rtaOutcome.urineAnionGap < 0
                      ? 'text-emerald-400'
                      : 'text-rose-400')}>
                      {rtaOutcome.urineAnionGap > 0 ? `+${rtaOutcome.urineAnionGap}` : rtaOutcome.urineAnionGap} mEq/L
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    Formula: (U_Na {urine.urineSodiumMeqL} + U_K {urine.urinePotassiumMeqL}) - U_Cl {urine.urineChlorideMeqL}
                  </div>
                  <div className={'p-2 rounded text-[11px] border ' + (rtaOutcome.urineAnionGap < 0
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                    : 'bg-rose-950/40 border-rose-500/40 text-rose-200')}>
                    {rtaOutcome.urineAnionGap < 0
                      ? 'NEGATIVE UAG: High unmeasured NH4+ cations excreted with Cl-. Points to intact renal acidification (Diarrhea).'
                      : 'POSITIVE UAG: Impaired renal ammonium (NH4+) excretion. Defect in distal acidification (Type 1 or 4 RTA).'}
                  </div>
                </div>

                {/* Urine Osmolal Gap & Ammonium Output */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Urine Osmolal Gap (UOG):</span>
                    <span className="font-mono text-white font-bold">{rtaOutcome.urineOsmolalGap} mOsm/kg</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Estimated Urinary NH4+:</span>
                    <span className="font-mono text-teal-300 font-bold">{rtaOutcome.estimatedUrineAmmoniumMeqL} mEq/L</span>
                  </div>
                  {rtaOutcome.fractionalExcretionBicarbonatePercent > 0 && (
                    <div className="flex justify-between items-center pt-1 border-t border-slate-800">
                      <span className="text-slate-400">FE Bicarbonate (FE_HCO3):</span>
                      <span className={'font-mono font-bold ' + (rtaOutcome.fractionalExcretionBicarbonatePercent > 15
                        ? 'text-rose-400'
                        : 'text-slate-300')}>
                        {rtaOutcome.fractionalExcretionBicarbonatePercent}% (Cutoff &gt; 15%)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Diagnostic Resolution & Targeted Nephrology Rx (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h2 className="text-sm font-semibold text-teal-400 uppercase tracking-wider flex items-center gap-2">
                  <Pill className="w-4 h-4" /> Diagnostic &amp; Therapy Solver
                </h2>
                <span className="text-xs font-mono font-bold text-teal-300">
                  Targeted Rx
                </span>
              </div>

              {/* Diagnosis Badge & Title */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider">
                  Confirmed Acid-Base Diagnosis:
                </span>
                <h3 className="text-base font-black text-white">
                  {rtaOutcome.diagnosisTitle}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed pt-1 border-t border-slate-800">
                  {rtaOutcome.pathophysiologicalMechanism}
                </p>
              </div>

              {/* Pharmacotherapy Regimen */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 space-y-2 text-xs">
                <div className="space-y-0.5">
                  <span className="text-[11px] font-bold text-teal-400 uppercase">
                    1. First-Line Pharmacotherapy:
                  </span>
                  <p className="text-sm font-bold text-white">
                    {rtaOutcome.recommendedTherapy.firstLineDrug}
                  </p>
                  <p className="text-[11px] text-slate-300">
                    {rtaOutcome.recommendedTherapy.dosingStrategy}
                  </p>
                </div>

                {rtaOutcome.recommendedTherapy.adjunctsAndMonitoring.length > 0 && (
                  <div className="pt-2 border-t border-slate-800 space-y-1">
                    <span className="text-[11px] font-semibold text-teal-300">
                      Adjuncts &amp; Surveillance:
                    </span>
                    <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-0.5">
                      {rtaOutcome.recommendedTherapy.adjunctsAndMonitoring.map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {rtaOutcome.recommendedTherapy.contraindicatedDrugs.length > 0 && (
                  <div className="pt-2 border-t border-slate-800 space-y-1">
                    <span className="text-[11px] font-bold text-rose-400 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Contraindicated Drugs:
                    </span>
                    <ul className="list-disc list-inside text-[11px] text-rose-300 space-y-0.5">
                      {rtaOutcome.recommendedTherapy.contraindicatedDrugs.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
