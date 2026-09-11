'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Zap,
  Activity,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FlaskConical,
  Heart,
  ShieldAlert,
  Sparkles,
  Pill,
} from 'lucide-react';
import {
  DigoxinPatientInput,
  DigoxinToxicityType,
  DigoxinArrhythmiaPattern,
  evaluateDigoxinCase,
  DIGOXIN_PRESETS,
} from '../../.gemini/skills/DigoxinToxicityFabEngine';

export default function DigoxinToxicitySimulator() {
  const [toxicityType, setToxicityType] = useState<DigoxinToxicityType>('ACUTE_INGESTION');
  const [weightKg, setWeightKg] = useState<number>(70);
  const [sdc, setSdc] = useState<number>(8.5);
  const [potassium, setPotassium] = useState<number>(6.4);
  const [ingestedDose, setIngestedDose] = useState<number>(10.0);
  const [gfr, setGfr] = useState<number>(90);
  const [arrhythmia, setArrhythmia] = useState<DigoxinArrhythmiaPattern>(
    'BIDIRECTIONAL_VENTRICULAR_TACHYCARDIA'
  );
  const [cardiacArrest, setCardiacArrest] = useState<boolean>(false);
  const [vialsAdministered, setVialsAdministered] = useState<number>(0);

  const currentInput: DigoxinPatientInput = useMemo(
    () => ({
      toxicityType,
      patientWeightKg: weightKg,
      serumDigoxinNgMl: sdc,
      serumPotassiumMeqL: potassium,
      ingestedDoseMg: ingestedDose,
      estimatedGfrMlMin: gfr,
      arrhythmia,
      cardiacArrestOrHemodynamicCollapse: cardiacArrest,
      fabAdministeredVials: vialsAdministered,
    }),
    [
      toxicityType,
      weightKg,
      sdc,
      potassium,
      ingestedDose,
      gfr,
      arrhythmia,
      cardiacArrest,
      vialsAdministered,
    ]
  );

  const metrics = useMemo(() => evaluateDigoxinCase(currentInput), [currentInput]);

  const applyPreset = (presetId: string) => {
    const p = DIGOXIN_PRESETS.find((item) => item.id === presetId);
    if (!p) return;
    setToxicityType(p.input.toxicityType);
    setWeightKg(p.input.patientWeightKg);
    setSdc(p.input.serumDigoxinNgMl);
    setPotassium(p.input.serumPotassiumMeqL);
    setIngestedDose(p.input.ingestedDoseMg);
    setGfr(p.input.estimatedGfrMlMin);
    setArrhythmia(p.input.arrhythmia);
    setCardiacArrest(p.input.cardiacArrestOrHemodynamicCollapse);
    setVialsAdministered(p.input.fabAdministeredVials);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 tracking-wider uppercase mb-1">
              <Pill className="w-4 h-4 text-amber-400" />
              Clinical Toxicology &amp; Cardiovascular Pharmacotherapy
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Digoxin Toxicity, DigiFab Stoichiometry &amp; Arrhythmia Workstation
            </h1>
            <p className="text-slate-400 text-xs md:text-sm mt-1 max-w-3xl">
              Model myocardial Na+/K+-ATPase paralysis, hyperkalemia prognostic mortality curve, DigiFab antibody fragment
              neutralization stoichiometry, post-treatment assay interference, and Salvador Dalí scooped ST depressions.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/simulators"
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold hover:border-slate-700 transition"
            >
              ← Simulators Catalog
            </Link>
          </div>
        </div>

        {/* Clinical Presets Carousel */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            Toxicology &amp; Electrophysiology Presets
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {DIGOXIN_PRESETS.map((p) => {
              const isActive =
                toxicityType === p.input.toxicityType &&
                sdc === p.input.serumDigoxinNgMl &&
                potassium === p.input.serumPotassiumMeqL &&
                arrhythmia === p.input.arrhythmia;
              return (
                <button
                  key={p.id}
                  onClick={() => applyPreset(p.id)}
                  className={`flex flex-col text-left p-2.5 rounded-xl border text-xs transition duration-150 ${
                    isActive
                      ? 'bg-amber-950/50 border-amber-500/80 text-white shadow-lg shadow-amber-950/50'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <span className="font-bold truncate text-[11px] text-amber-300">{p.name}</span>
                  <span className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-tight">
                    {p.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Workstation 3-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Column 1: Exposure History & Patient Demographics (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <FlaskConical className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Patient Exposure &amp; Kinetics
                </h2>
              </div>

              {/* Toxicity Type Toggle */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Presentation Type:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setToxicityType('ACUTE_INGESTION')}
                    className={`py-1.5 rounded-lg border text-xs font-bold transition ${
                      toxicityType === 'ACUTE_INGESTION'
                        ? 'bg-rose-600 border-rose-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Acute Overdose
                  </button>
                  <button
                    onClick={() => setToxicityType('CHRONIC_ACCUMULATION')}
                    className={`py-1.5 rounded-lg border text-xs font-bold transition ${
                      toxicityType === 'CHRONIC_ACCUMULATION'
                        ? 'bg-amber-600 border-amber-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Chronic Toxicity
                  </button>
                </div>
              </div>

              {/* Patient Weight */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Patient Weight:</span>
                  <strong className="text-white font-mono">{weightKg} kg</strong>
                </div>
                <input
                  type="range"
                  min="40"
                  max="130"
                  step="1"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full accent-slate-400 cursor-pointer"
                />
              </div>

              {/* Serum Digoxin Concentration (SDC) */}
              <div className="space-y-1 pt-1 border-t border-slate-800">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Serum Digoxin (SDC):</span>
                  <strong
                    className={`font-mono font-bold ${
                      sdc > 2.0 ? 'text-rose-400' : sdc >= 1.2 ? 'text-amber-400' : 'text-emerald-400'
                    }`}
                  >
                    {sdc} ng/mL
                  </strong>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="15.0"
                  step="0.1"
                  value={sdc}
                  onChange={(e) => setSdc(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="text-[10px] text-slate-500 flex justify-between">
                  <span>Therapeutic 0.5-0.9 ng/mL</span>
                  <span>Toxic &gt; 2.0 ng/mL</span>
                </div>
              </div>

              {/* Known Ingested Dose (mg) - if acute */}
              {toxicityType === 'ACUTE_INGESTION' && (
                <div className="space-y-1 pt-1 border-t border-slate-800">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Known Ingested Amount:</span>
                    <strong className="text-rose-400 font-mono font-bold">{ingestedDose} mg</strong>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="0.5"
                    value={ingestedDose}
                    onChange={(e) => setIngestedDose(Number(e.target.value))}
                    className="w-full accent-rose-400 cursor-pointer"
                  />
                  <div className="text-[10px] text-slate-500">
                    {ingestedDose > 0
                      ? `Equivalent to ${Math.round(ingestedDose / 0.25)} tablets of 0.25 mg`
                      : 'Amount unknown (will use SDC formula)'}
                  </div>
                </div>
              )}

              {/* eGFR Renal Clearance */}
              <div className="space-y-1 pt-1 border-t border-slate-800">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">eGFR (Renal Clearance):</span>
                  <strong className="text-white font-mono">{gfr} mL/min</strong>
                </div>
                <input
                  type="range"
                  min="10"
                  max="120"
                  step="5"
                  value={gfr}
                  onChange={(e) => setGfr(Number(e.target.value))}
                  className="w-full accent-slate-400 cursor-pointer"
                />
                <div className="text-[10px] text-slate-500">
                  {gfr < 30 ? 'Severe CKD: Digoxin t1/2 prolonged to 3-5 days' : 'Normal/mild renal function'}
                </div>
              </div>

              {/* Cardiac Arrest / Code Toggle */}
              <div className="pt-2 border-t border-slate-800">
                <button
                  onClick={() => setCardiacArrest(!cardiacArrest)}
                  className={`w-full py-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                    cardiacArrest
                      ? 'bg-rose-600 border-rose-500 text-white animate-pulse'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4" />
                  {cardiacArrest ? 'HEMODYNAMIC COLLAPSE / ARREST (STAT 20 VIALS)' : 'Hemodynamically Stable'}
                </button>
              </div>
            </div>
          </div>

          {/* Column 2: Electrophysiology, Potassium & ECG (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Heart className="w-4 h-4 text-rose-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Potassium &amp; Electrophysiology
                </h2>
              </div>

              {/* Serum Potassium Slider (Prognostic Marker) */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Serum Potassium (K+):</span>
                  <strong
                    className={`font-mono font-bold ${
                      potassium > 5.5
                        ? 'text-rose-400 text-sm animate-pulse'
                        : potassium > 5.0
                        ? 'text-amber-400 text-sm'
                        : 'text-emerald-400'
                    }`}
                  >
                    {potassium} mEq/L
                  </strong>
                </div>
                <input
                  type="range"
                  min="2.5"
                  max="8.0"
                  step="0.1"
                  value={potassium}
                  onChange={(e) => setPotassium(Number(e.target.value))}
                  className="w-full accent-rose-400 cursor-pointer"
                />
                <div className="text-[10px] text-slate-500 flex justify-between">
                  <span>K+ &lt; 3.5 (Sensitizes)</span>
                  <span>5.0</span>
                  <span>K+ &gt; 5.5 (Lethal Risk)</span>
                </div>
              </div>

              {/* Smith Mortality Risk Gauge */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Smith Prognostic Mortality Risk:</span>
                  <strong
                    className={`font-mono font-bold ${
                      metrics.hyperkalemiaMortalityRiskPercent >= 50 ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    {metrics.hyperkalemiaMortalityRiskPercent}% Mortality
                  </strong>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      metrics.hyperkalemiaMortalityRiskPercent >= 70
                        ? 'bg-rose-500'
                        : metrics.hyperkalemiaMortalityRiskPercent >= 30
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, metrics.hyperkalemiaMortalityRiskPercent)}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-400 leading-tight">
                  In acute toxicity, Na+/K+-ATPase blockade prevents cellular potassium uptake. K+ &gt; 5.5 mEq/L
                  historically correlates with &gt; 80-100% mortality without DigiFab rescue.
                </div>
              </div>

              {/* Arrhythmia Pattern Selection */}
              <div className="space-y-1.5 pt-1 border-t border-slate-800">
                <label className="text-xs font-semibold text-slate-300">ECG Rhythm Pattern:</label>
                <div className="space-y-1 text-xs">
                  {[
                    {
                      id: 'NORMAL_SINUS_DIG_EFFECT',
                      name: 'Sinus with Salvador Dalí ST Depression',
                      badge: 'Benign Dig Effect',
                    },
                    {
                      id: 'SINUS_BRADYCARDIA_OR_EXIT_BLOCK',
                      name: 'Sinus Bradycardia / High-Grade AV Block',
                      badge: 'Vagal Hypertonia',
                    },
                    {
                      id: 'JUNCTIONAL_TACHYCARDIA_WITH_AV_DISSOCIATION',
                      name: 'Accelerated Junctional Tachycardia + AV Dissociation',
                      badge: 'Triggered Automaticity',
                    },
                    {
                      id: 'BIDIRECTIONAL_VENTRICULAR_TACHYCARDIA',
                      name: 'Bidirectional Ventricular Tachycardia',
                      badge: 'Pathognomonic for Digitalis',
                    },
                    {
                      id: 'VENTRICULAR_FIBRILLATION_ASYSTOLE',
                      name: 'Ventricular Fibrillation / Asystole',
                      badge: 'Lethal Collapse',
                    },
                  ].map((arr) => (
                    <button
                      key={arr.id}
                      onClick={() => setArrhythmia(arr.id as DigoxinArrhythmiaPattern)}
                      className={`w-full p-2 rounded-lg border text-left flex items-center justify-between transition ${
                        arrhythmia === arr.id
                          ? 'bg-amber-950/60 border-amber-500/80 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="font-semibold text-[11px]">{arr.name}</span>
                      <span className="text-[10px] text-amber-400/80">{arr.badge}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Simulated ECG Waveform SVG */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col items-center">
                <div className="text-[10px] text-slate-400 mb-1.5 flex justify-between w-full">
                  <span>Lead II Continuous Rhythm</span>
                  <span className="text-amber-400 font-bold">
                    {arrhythmia === 'BIDIRECTIONAL_VENTRICULAR_TACHYCARDIA'
                      ? 'Alternating QRS Axis'
                      : arrhythmia === 'NORMAL_SINUS_DIG_EFFECT'
                      ? 'Scooped Salvador Dalí ST'
                      : 'Digitalis Dysrhythmia'}
                  </span>
                </div>
                <svg viewBox="0 0 240 80" className="w-full h-20 border border-slate-800/80 rounded-lg bg-slate-950">
                  {arrhythmia === 'NORMAL_SINUS_DIG_EFFECT' && (
                    <g>
                      {/* Beat 1: P, Q, R, S, scooped ST, T */}
                      <path
                        d="M 10 40 L 25 40 Q 32 30, 40 40 L 46 40 L 49 46 L 54 10 L 59 48 L 63 40 Q 75 58, 88 44 Q 96 36, 105 40 L 120 40"
                        fill="none"
                        stroke="#22c55e"
                        strokeWidth="2"
                      />
                      {/* Beat 2 */}
                      <path
                        d="M 120 40 L 135 40 Q 142 30, 150 40 L 156 40 L 159 46 L 164 10 L 169 48 L 173 40 Q 185 58, 198 44 Q 206 36, 215 40 L 230 40"
                        fill="none"
                        stroke="#22c55e"
                        strokeWidth="2"
                      />
                      <text x="75" y="68" fill="#fbbf24" fontSize="8" fontFamily="monospace">Scooped ST Sagging</text>
                    </g>
                  )}
                  {arrhythmia === 'BIDIRECTIONAL_VENTRICULAR_TACHYCARDIA' && (
                    <g>
                      {/* Beat alternating positive and negative polarity */}
                      <path
                        d="M 10 40 L 20 40 L 26 12 L 34 68 L 42 40 L 52 40 L 58 68 L 66 12 L 74 40 L 84 40 L 90 12 L 98 68 L 106 40 L 116 40 L 122 68 L 130 12 L 138 40 L 148 40 L 154 12 L 162 68 L 170 40 L 180 40 L 186 68 L 194 12 L 202 40 L 220 40"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="2"
                      />
                      <text x="120" y="74" textAnchor="middle" fill="#f87171" fontSize="8" fontWeight="bold">
                        Bidirectional VT: Alternating 180° Frontal Axis
                      </text>
                    </g>
                  )}
                  {arrhythmia !== 'NORMAL_SINUS_DIG_EFFECT' && arrhythmia !== 'BIDIRECTIONAL_VENTRICULAR_TACHYCARDIA' && (
                    <g>
                      <path
                        d="M 10 40 L 40 40 L 45 15 L 52 65 L 58 40 L 100 40 L 105 15 L 112 65 L 118 40 L 160 40 L 165 15 L 172 65 L 178 40 L 220 40"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="1.8"
                      />
                      <text x="120" y="74" textAnchor="middle" fill="#fbbf24" fontSize="8">
                        Conduction Block / Escape Rhythm
                      </text>
                    </g>
                  )}
                </svg>
              </div>
            </div>
          </div>

          {/* Column 3: DigiFab Stoichiometry & Action Plan (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  DigiFab Dosing Stoichiometry
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    metrics.isToxicityConfirmed
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  {metrics.isToxicityConfirmed ? 'ANTIDOTE INDICATED' : 'OBSERVE (NO FAB)'}
                </span>
              </div>

              {/* Dosing Display Card */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Recommended DigiFab:</span>
                  <strong className="text-2xl font-black text-amber-400">
                    {metrics.recommendedFabVialsRounded} {metrics.recommendedFabVialsRounded === 1 ? 'Vial' : 'Vials'}
                  </strong>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800/80">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Total Antibody Protein:</span>
                    <strong className="text-white font-mono">{metrics.totalFabDoseMg} mg</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Calculation Formula:</span>
                    <strong className="text-cyan-300 font-mono text-[11px]">
                      {metrics.dosingCalculationMethod === 'ACUTE_KNOWN_DOSE'
                        ? 'Dose × 0.8 / 0.5'
                        : metrics.dosingCalculationMethod === 'STEADY_STATE_SDC'
                        ? 'SDC × Wt / 100'
                        : '20 Vials Empiric Code'}
                    </strong>
                  </div>
                </div>

                {/* Math Step Details */}
                <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 text-[11px] space-y-1 font-mono text-slate-300">
                  <div className="text-amber-400 font-bold">Stoichiometric Chemistry:</div>
                  <div>1 Vial (38 mg Fab) binds ~0.5 mg (500 µg) Digoxin</div>
                  <div>Exact requirement: {metrics.requiredFabVialsExact} vials</div>
                  <div>Rounded clinical dose: {metrics.recommendedFabVialsRounded} vials ({metrics.totalFabDoseMg} mg)</div>
                </div>
              </div>

              {/* Dynamic Neutralization Simulator */}
              <div className="space-y-1.5 pt-1 border-t border-slate-800">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Administered DigiFab Vials:</span>
                  <strong className="text-amber-400 font-mono">{vialsAdministered} vials</strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  step="1"
                  value={vialsAdministered}
                  onChange={(e) => setVialsAdministered(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="flex justify-between text-xs bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400">Post-Fab Free Active Digoxin:</span>
                  <strong
                    className={`font-mono ${
                      metrics.postFabFreeDigoxinEstimatedNgMl > 1.2 ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    {metrics.postFabFreeDigoxinEstimatedNgMl} ng/mL
                  </strong>
                </div>
              </div>

              {/* Critical Calcium Warning Banner */}
              {metrics.calciumAdministrationStrictlyContraindicated && (
                <div className="bg-rose-950/50 border border-rose-500/80 rounded-xl p-3 text-xs space-y-1">
                  <div className="text-rose-300 font-bold flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                    AVOID INTRAVENOUS CALCIUM (&quot;STONE HEART&quot;)
                  </div>
                  <p className="text-rose-200/90 text-[11px] leading-relaxed">
                    Digitalis poisons the Na+/K+-ATPase, causing severe intracellular calcium overload via reversed NCX.
                    Exogenous calcium salts precipitate tetanic contraction, refractory arrhythmias, and irreversible cardiac arrest.
                  </p>
                </div>
              )}

              {/* Post-Fab Lab Interference Warning */}
              {metrics.postFabTotalDigoxinAssayInterferenceWarning && (
                <div className="bg-amber-950/40 border border-amber-600/70 rounded-xl p-3 text-xs space-y-1">
                  <div className="text-amber-300 font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    POST-FAB LAB INTERFERENCE ALERT
                  </div>
                  <p className="text-amber-200/90 text-[11px] leading-relaxed">
                    Total serum digoxin immunoassay falsely spikes post-Fab as it measures inactive Fab-bound complex.
                    Do NOT order repeat total SDC to guide further dosing; monitor clinical resolution and free levels.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Clinical Action Checklist */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Clinical Management &amp; Pharmacotherapy Checklist
          </div>
          <div className="space-y-1.5 text-xs text-slate-300">
            {metrics.clinicalActionChecklist.map((act, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>{act}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
