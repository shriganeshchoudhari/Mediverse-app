'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  FlaskConical,
  Activity,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Brain,
  Droplets,
  ShieldAlert,
  Sparkles,
  Zap,
} from 'lucide-react';
import {
  SalicylatePatientInput,
  SalicylateExposureType,
  evaluateSalicylateCase,
  SALICYLATE_PRESETS,
} from '../../.gemini/skills/SalicylateToxicityEngine';

export default function SalicylateToxicitySimulator() {
  const [exposureType, setExposureType] = useState<SalicylateExposureType>('ACUTE_OVERDOSE');
  const [salicylateLevel, setSalicylateLevel] = useState<number>(72);
  const [pco2, setPco2] = useState<number>(20);
  const [hco3, setHco3] = useState<number>(14);
  const [potassium, setPotassium] = useState<number>(4.2);
  const [urinePh, setUrinePh] = useState<number>(6.0);
  const [weightKg, setWeightKg] = useState<number>(70);
  const [amsSeizures, setAmsSeizures] = useState<boolean>(false);
  const [pulmEdema, setPulmEdema] = useState<boolean>(false);
  const [bicarbActive, setBicarbActive] = useState<boolean>(false);

  const currentInput: SalicylatePatientInput = useMemo(
    () => ({
      exposureType,
      serumSalicylateMgDl: salicylateLevel,
      arterialPco2MmHg: pco2,
      serumBicarbonateMeqL: hco3,
      serumPotassiumMeqL: potassium,
      urinePh,
      patientWeightKg: weightKg,
      alteredMentalStatusOrSeizures: amsSeizures,
      pulmonaryEdemaArds: pulmEdema,
      bicarbonateInfusionActive: bicarbActive,
    }),
    [
      exposureType,
      salicylateLevel,
      pco2,
      hco3,
      potassium,
      urinePh,
      weightKg,
      amsSeizures,
      pulmEdema,
      bicarbActive,
    ]
  );

  const metrics = useMemo(() => evaluateSalicylateCase(currentInput), [currentInput]);

  const applyPreset = (presetId: string) => {
    const p = SALICYLATE_PRESETS.find((item) => item.id === presetId);
    if (!p) return;
    setExposureType(p.input.exposureType);
    setSalicylateLevel(p.input.serumSalicylateMgDl);
    setPco2(p.input.arterialPco2MmHg);
    setHco3(p.input.serumBicarbonateMeqL);
    setPotassium(p.input.serumPotassiumMeqL);
    setUrinePh(p.input.urinePh);
    setWeightKg(p.input.patientWeightKg);
    setAmsSeizures(p.input.alteredMentalStatusOrSeizures);
    setPulmEdema(p.input.pulmonaryEdemaArds);
    setBicarbActive(p.input.bicarbonateInfusionActive);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 tracking-wider uppercase mb-1">
              <FlaskConical className="w-4 h-4 text-emerald-400" />
              Clinical Toxicology, Nephrology &amp; Critical Care / EXTRIP Guidelines
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Salicylate Toxicity, Ion Trapping &amp; EXTRIP Hemodialysis Workstation
            </h1>
            <p className="text-slate-400 text-xs md:text-sm mt-1 max-w-3xl">
              Model mitochondrial oxidative phosphorylation uncoupling, mixed respiratory alkalosis + HAGMA, blood-brain barrier
              ion trapping biophysics, hypokalemic paradoxical aciduria, and EXTRIP emergent hemodialysis indications.
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
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            Toxicology &amp; Nephrology Clinical Presets
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {SALICYLATE_PRESETS.map((p) => {
              const isActive =
                exposureType === p.input.exposureType &&
                salicylateLevel === p.input.serumSalicylateMgDl &&
                pco2 === p.input.arterialPco2MmHg &&
                hco3 === p.input.serumBicarbonateMeqL;
              return (
                <button
                  key={p.id}
                  onClick={() => applyPreset(p.id)}
                  className={`flex flex-col text-left p-2.5 rounded-xl border text-xs transition duration-150 ${
                    isActive
                      ? 'bg-emerald-950/50 border-emerald-500/80 text-white shadow-lg shadow-emerald-950/50'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <span className="font-bold truncate text-[11px] text-emerald-300">{p.name}</span>
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
          {/* Column 1: Exposure & Blood Gas Panel (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <FlaskConical className="w-4 h-4 text-emerald-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Exposure &amp; Blood Gas Profile
                </h2>
              </div>

              {/* Exposure Type Toggle */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Presentation:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setExposureType('ACUTE_OVERDOSE')}
                    className={`py-1.5 rounded-lg border text-xs font-bold transition ${
                      exposureType === 'ACUTE_OVERDOSE'
                        ? 'bg-emerald-600 border-emerald-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Acute Overdose
                  </button>
                  <button
                    onClick={() => setExposureType('CHRONIC_INGESTION')}
                    className={`py-1.5 rounded-lg border text-xs font-bold transition ${
                      exposureType === 'CHRONIC_INGESTION'
                        ? 'bg-amber-600 border-amber-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Chronic Toxicity
                  </button>
                </div>
              </div>

              {/* Serum Salicylate Concentration */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Serum Salicylate:</span>
                  <strong
                    className={`font-mono font-bold text-sm ${
                      salicylateLevel >= 100
                        ? 'text-rose-400 animate-pulse'
                        : salicylateLevel >= 50
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {salicylateLevel} mg/dL ({(salicylateLevel * 0.0724).toFixed(1)} mmol/L)
                  </strong>
                </div>
                <input
                  type="range"
                  min="10"
                  max="140"
                  step="2"
                  value={salicylateLevel}
                  onChange={(e) => setSalicylateLevel(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
                <div className="text-[10px] text-slate-500 flex justify-between">
                  <span>Therapeutic 15-30</span>
                  <span>Toxic &gt; 40-50</span>
                  <span>Dialysis &ge; 100 mg/dL</span>
                </div>
              </div>

              {/* Arterial PaCO2 */}
              <div className="space-y-1 pt-1 border-t border-slate-800">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Arterial PaCO2 (Ventilatory Drive):</span>
                  <strong className="text-sky-400 font-mono font-bold">{pco2} mmHg</strong>
                </div>
                <input
                  type="range"
                  min="12"
                  max="50"
                  step="1"
                  value={pco2}
                  onChange={(e) => setPco2(Number(e.target.value))}
                  className="w-full accent-sky-400 cursor-pointer"
                />
                <div className="text-[10px] text-slate-500">
                  {pco2 < 35 ? 'Hyperventilation / Primary Respiratory Alkalosis' : 'Normal or Hypoventilation'}
                </div>
              </div>

              {/* Serum Bicarbonate */}
              <div className="space-y-1 pt-1 border-t border-slate-800">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Serum Bicarbonate (HCO3-):</span>
                  <strong className="text-amber-400 font-mono font-bold">{hco3} mEq/L</strong>
                </div>
                <input
                  type="range"
                  min="6"
                  max="30"
                  step="1"
                  value={hco3}
                  onChange={(e) => setHco3(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              {/* Calculated pH & Anion Gap Box */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Calculated Arterial pH:</span>
                  <strong
                    className={`font-mono font-bold text-sm ${
                      metrics.calculatedArterialPh < 7.30
                        ? 'text-rose-400'
                        : metrics.calculatedArterialPh > 7.50
                        ? 'text-sky-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {metrics.calculatedArterialPh.toFixed(2)}
                  </strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Estimated Anion Gap:</span>
                  <strong className="text-white font-mono">{metrics.anionGapMeqL} mEq/L (Normal 8-12)</strong>
                </div>
                <div className="pt-1 text-[10px] text-slate-400">
                  {metrics.primaryAcidBaseDisorders.join(' + ')}
                </div>
              </div>

              {/* High-Risk Complication Toggles */}
              <div className="space-y-1.5 pt-1 border-t border-slate-800 text-xs">
                <div className="flex items-center justify-between">
                  <span>Altered Mental Status / Seizures:</span>
                  <button
                    onClick={() => setAmsSeizures(!amsSeizures)}
                    className={`px-2 py-0.5 rounded border font-semibold ${
                      amsSeizures
                        ? 'bg-rose-600 border-rose-500 text-white animate-pulse'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    {amsSeizures ? 'PRESENT (SEIZURES/COMA)' : 'Alert/Oriented'}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span>Pulmonary Edema (ARDS):</span>
                  <button
                    onClick={() => setPulmEdema(!pulmEdema)}
                    className={`px-2 py-0.5 rounded border font-semibold ${
                      pulmEdema
                        ? 'bg-rose-600 border-rose-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    {pulmEdema ? 'NON-CARDIOGENIC EDEMA' : 'Clear Lungs'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Ion Trapping & Nephrology Workbench (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Droplets className="w-4 h-4 text-cyan-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Ion Trapping &amp; Renal Clearance
                </h2>
              </div>

              {/* Urine pH Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Urinary pH (Ion Trapping Target):</span>
                  <strong
                    className={`font-mono font-bold text-sm ${
                      urinePh >= 7.5 ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    pH {urinePh.toFixed(1)}
                  </strong>
                </div>
                <input
                  type="range"
                  min="5.0"
                  max="8.5"
                  step="0.1"
                  value={urinePh}
                  onChange={(e) => setUrinePh(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="text-[10px] text-slate-500 flex justify-between">
                  <span>Acidic pH 5.0</span>
                  <span>Target: pH 7.5 - 8.0</span>
                  <span>Max pH 8.5</span>
                </div>
              </div>

              {/* Serum Potassium Slider (Crucial for Alkalinization) */}
              <div className="space-y-1 pt-1 border-t border-slate-800">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Serum Potassium (K+):</span>
                  <strong
                    className={`font-mono font-bold ${
                      potassium < 3.8 ? 'text-rose-400 font-bold' : 'text-emerald-400'
                    }`}
                  >
                    {potassium} mEq/L
                  </strong>
                </div>
                <input
                  type="range"
                  min="2.5"
                  max="5.5"
                  step="0.1"
                  value={potassium}
                  onChange={(e) => setPotassium(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="text-[10px] text-slate-500">
                  {potassium < 3.8
                    ? 'Hypokalemia causes distal H+ secretion (Paradoxical Aciduria)!'
                    : 'Potassium adequate to permit urinary alkalinization'}
                </div>
              </div>

              {/* Renal Clearance Meter */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Renal Tubular Clearance:</span>
                  <strong className="text-cyan-400 font-mono font-bold text-sm">
                    {metrics.renalSalicylateClearanceMlMin} mL/min
                  </strong>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 transition-all duration-300"
                    style={{ width: `${Math.min(100, (metrics.renalSalicylateClearanceMlMin / 140) * 100)}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-400 leading-tight">
                  Alkaline urine (pH 8.0) ionizes salicylic acid into charged salicylate (A-), preventing tubular reabsorption and
                  boosting renal clearance up to 10-20x over baseline.
                </div>
              </div>

              {/* Simulated Ion Trapping Mechanism SVG */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col items-center">
                <div className="text-[10px] text-slate-400 mb-1.5 flex justify-between w-full">
                  <span>Blood-Brain Barrier vs Renal Tubule</span>
                  <span className="text-emerald-400 font-bold">Henderson-Hasselbalch</span>
                </div>
                <svg viewBox="0 0 240 85" className="w-full h-20 border border-slate-800/80 rounded-lg bg-slate-950">
                  {/* Blood Compartment */}
                  <rect x="10" y="10" width="105" height="65" rx="6" fill="#1e1b4b" stroke="#4338ca" strokeWidth="1" />
                  <text x="62" y="24" textAnchor="middle" fill="#a5b4fc" fontSize="8" fontWeight="bold">Blood (pH {metrics.calculatedArterialPh.toFixed(2)})</text>
                  <text x="62" y="44" textAnchor="middle" fill="#c7d2fe" fontSize="8">HA (Lipophilic) ⇄ A⁻</text>
                  <text x="62" y="62" textAnchor="middle" fill="#f43f5e" fontSize="7">Non-ionized: {metrics.nonIonizedFractionPercent}%</text>

                  {/* Diffusion to Brain Arrow */}
                  <path d="M 115 42 L 135 42" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3 2" markerEnd="url(#arrow)" />

                  {/* Brain / Urine Target */}
                  <rect x="140" y="10" width="90" height="65" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                  <text x="185" y="24" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="bold">Renal Tubule</text>
                  <text x="185" y="44" textAnchor="middle" fill="#38bdf8" fontSize="8">Urine (pH {urinePh.toFixed(1)})</text>
                  <text x="185" y="62" textAnchor="middle" fill="#34d399" fontSize="7">Trapped A⁻ Ions</text>
                </svg>
              </div>

              {/* Paradoxical Aciduria Alert */}
              {metrics.paradoxicalAciduriaPresent && (
                <div className="bg-rose-950/40 border border-rose-600/80 rounded-xl p-3 text-xs space-y-1">
                  <div className="text-rose-300 font-bold flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                    PARADOXICAL ACIDURIA DETECTED
                  </div>
                  <p className="text-rose-200/90 text-[11px] leading-relaxed">
                    Distal nephron H+/K+-ATPase secretes H+ to conserve potassium. Alkalinization is failing despite bicarbonate!
                    Mandatory aggressive potassium repletion required (goal K+ &gt; 4.0 mEq/L).
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Column 3: EXTRIP Hemodialysis Solver (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  EXTRIP Dialysis Solver
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    metrics.hemodialysisRequiredExtrip
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {metrics.hemodialysisRequiredExtrip ? 'DIALYSIS MANDATORY' : 'ALKALINIZATION SUFFICIENT'}
                </span>
              </div>

              {/* Status Display Card */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">EXTRIP Workgroup Recommendation:</span>
                </div>
                <div
                  className={`text-lg font-black leading-tight ${
                    metrics.hemodialysisRequiredExtrip ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {metrics.hemodialysisRequiredExtrip
                    ? 'EMERGENT INTERMITTENT HEMODIALYSIS'
                    : 'IV SODIUM BICARBONATE PROTOCOL'}
                </div>

                {metrics.extripIndicationReasons.length > 0 && (
                  <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[11px] text-rose-300">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Trigger Criteria Met:</span>
                    {metrics.extripIndicationReasons.map((r, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <span className="text-rose-400">•</span>
                        <span>{r}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bicarbonate Dosing Protocol Card */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="text-cyan-400 font-bold uppercase tracking-wider text-[10px]">
                  Urinary Alkalinization Protocol:
                </div>
                <div className="space-y-1 text-slate-300 text-[11px]">
                  <div>• Initial Bolus: 1 - 2 mEq/kg IV Sodium Bicarbonate over 5-10 min.</div>
                  <div>• Infusion: 150 mEq NaHCO3 in 1 L D5W + 20-40 mEq KCl at 150-250 mL/hr.</div>
                  <div>• Goal Urine pH: 7.5 - 8.0 (measure q1-2h).</div>
                  <div>• Blood Gas Monitoring: Stop infusion if arterial pH &ge; 7.55.</div>
                </div>
              </div>

              {/* CNS Penetration Warning */}
              <div
                className={`p-3 rounded-xl border text-xs space-y-1 ${
                  metrics.cnsToxicityRisk === 'SEVERE_CRITICAL_CNS_PENETRATION'
                    ? 'bg-rose-950/40 border-rose-500/60 text-rose-200'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold">
                  <Brain className="w-3.5 h-3.5 text-rose-400" />
                  <span>CNS Toxicity Risk: {metrics.cnsToxicityRisk.replace(/_/g, ' ')}</span>
                </div>
                <p className="text-[10px] leading-relaxed">
                  Systemic acidemia pushes salicylic acid into its lipid-soluble uncharged form, driving cerebral uptake and
                  mitochondrial neuroglycopenia.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Clinical Action Checklist */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Toxicology &amp; Critical Care Action Checklist
          </div>
          <div className="space-y-1.5 text-xs text-slate-300">
            {metrics.clinicalActionChecklist.map((act, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{act}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
