'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  FlaskConical,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Droplets,
  Zap,
  Eye,
  Microscope,
  ShieldAlert,
  ChevronRight,
  Flame,
  Clock,
  Pill,
} from 'lucide-react';
import {
  IngestedSubstance,
  ToxicAlcoholPatientInput,
  evaluateToxicAlcoholKinetics,
  TOXIC_ALCOHOL_PRESETS,
} from '../../.gemini/skills/ToxicAlcoholsOsmolalGapEngine';

export default function ToxicAlcoholsSimulator() {
  const [substance, setSubstance] = useState<IngestedSubstance>('ETHYLENE_GLYCOL');
  const [hoursPostIngestion, setHoursPostIngestion] = useState<number>(10);
  const [ingestedVolumeMl, setIngestedVolumeMl] = useState<number>(250);
  const [bodyWeightKg, setBodyWeightKg] = useState<number>(75);
  const [measuredOsm, setMeasuredOsm] = useState<number>(330);
  const [sodium, setSodium] = useState<number>(142);
  const [chloride, setChloride] = useState<number>(102);
  const [bicarbonate, setBicarbonate] = useState<number>(10);
  const [glucose, setGlucose] = useState<number>(120);
  const [bun, setBun] = useState<number>(34);
  const [ethanol, setEthanol] = useState<number>(0);
  const [fomepizoleActive, setFomepizoleActive] = useState<boolean>(false);
  const [cofactorsGiven, setCofactorsGiven] = useState<boolean>(false);
  const [hemodialysisActive, setHemodialysisActive] = useState<boolean>(false);

  const patientInput: ToxicAlcoholPatientInput = useMemo(
    () => ({
      substance,
      hoursPostIngestion,
      ingestedVolumeMl,
      bodyWeightKg,
      measuredOsmolalityMOsmKg: measuredOsm,
      sodiumMEqL: sodium,
      chlorideMEqL: chloride,
      bicarbonateMEqL: bicarbonate,
      glucoseMgDl: glucose,
      bunMgDl: bun,
      ethanolMgDl: ethanol,
      fomepizoleAdministered: fomepizoleActive,
      folicAcidOrThiamineB6Given: cofactorsGiven,
      hemodialysisActive,
    }),
    [
      substance,
      hoursPostIngestion,
      ingestedVolumeMl,
      bodyWeightKg,
      measuredOsm,
      sodium,
      chloride,
      bicarbonate,
      glucose,
      bun,
      ethanol,
      fomepizoleActive,
      cofactorsGiven,
      hemodialysisActive,
    ]
  );

  const metrics = useMemo(() => evaluateToxicAlcoholKinetics(patientInput), [patientInput]);

  const applyPreset = (presetId: string) => {
    const preset = TOXIC_ALCOHOL_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setSubstance(preset.input.substance);
    setHoursPostIngestion(preset.input.hoursPostIngestion);
    setIngestedVolumeMl(preset.input.ingestedVolumeMl);
    setBodyWeightKg(preset.input.bodyWeightKg);
    setMeasuredOsm(preset.input.measuredOsmolalityMOsmKg);
    setSodium(preset.input.sodiumMEqL);
    setChloride(preset.input.chlorideMEqL);
    setBicarbonate(preset.input.bicarbonateMEqL);
    setGlucose(preset.input.glucoseMgDl);
    setBun(preset.input.bunMgDl);
    setEthanol(preset.input.ethanolMgDl);
    setFomepizoleActive(preset.input.fomepizoleAdministered);
    setCofactorsGiven(preset.input.folicAcidOrThiamineB6Given);
    setHemodialysisActive(preset.input.hemodialysisActive);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Navigation */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 tracking-wider uppercase mb-1">
              <FlaskConical className="w-4 h-4 text-emerald-400" />
              Critical Care Toxicology &amp; Osmolal Gap Workstation
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Toxic Alcohols, Osmolal Gap &amp; Fomepizole Precision Solver
            </h1>
            <p className="text-slate-400 text-xs md:text-sm mt-1 max-w-3xl">
              Model parent alcohol osmolality vs toxic organic acid metabolism, Anion Gap surge kinetics,
              Methanol optic disc hyperemia, Ethylene Glycol calcium oxalate nephrocalcinosis, and Isopropanol
              ketosis without acidosis.
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

        {/* Clinical Presets */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            Toxicology Ingestion Presets &amp; Clinical Scenarios
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {TOXIC_ALCOHOL_PRESETS.map((p) => {
              const isActive =
                substance === p.input.substance &&
                hoursPostIngestion === p.input.hoursPostIngestion &&
                ethanol === p.input.ethanolMgDl;
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

        {/* Main 3-Column Workstation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Column 1: Patient Biochemistry & Time Post-Ingestion (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Clock className="w-4 h-4 text-emerald-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Ingestion Profile &amp; Timing
                </h2>
              </div>

              {/* Substance Picker */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Ingested Toxin:</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'ETHYLENE_GLYCOL', label: 'Ethylene Glycol' },
                    { id: 'METHANOL', label: 'Methanol' },
                    { id: 'ISOPROPANOL', label: 'Isopropanol' },
                    { id: 'ALCOHOLIC_KETOACIDOSIS', label: 'AKA (Control)' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSubstance(item.id as IngestedSubstance)}
                      className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition ${
                        substance === item.id
                          ? 'bg-emerald-600 border-emerald-500 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Time Post-Ingestion:</span>
                  <strong className="text-white font-mono">{hoursPostIngestion} hours</strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max="36"
                  step="1"
                  value={hoursPostIngestion}
                  onChange={(e) => setHoursPostIngestion(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>

              {/* Patient Weight */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Body Weight (kg):</span>
                  <strong className="text-white font-mono">{bodyWeightKg} kg</strong>
                </div>
                <input
                  type="range"
                  min="40"
                  max="120"
                  step="5"
                  value={bodyWeightKg}
                  onChange={(e) => setBodyWeightKg(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>

              {/* Lab Panel Inputs */}
              <div className="pt-2 border-t border-slate-800 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Serum Chemistries &amp; Osmolality
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Measured Osm (mOsm/kg):</label>
                    <input
                      type="number"
                      value={measuredOsm}
                      onChange={(e) => setMeasuredOsm(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Sodium Na+ (mEq/L):</label>
                    <input
                      type="number"
                      value={sodium}
                      onChange={(e) => setSodium(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Chloride Cl- (mEq/L):</label>
                    <input
                      type="number"
                      value={chloride}
                      onChange={(e) => setChloride(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Bicarbonate HCO3- (mEq/L):</label>
                    <input
                      type="number"
                      value={bicarbonate}
                      onChange={(e) => setBicarbonate(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Glucose (mg/dL):</label>
                    <input
                      type="number"
                      value={glucose}
                      onChange={(e) => setGlucose(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">BUN (mg/dL):</label>
                    <input
                      type="number"
                      value={bun}
                      onChange={(e) => setBun(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-slate-400 block mb-1">Co-ingested Ethanol (mg/dL):</label>
                    <input
                      type="number"
                      value={ethanol}
                      onChange={(e) => setEthanol(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Interactive Kinetic Curve & Microscopic End-Organ Panel (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            {/* Osmolal Gap vs Anion Gap Crossover Graphic */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Gap Dynamics &amp; Crossover
                </span>
                <span className="text-[11px] font-bold text-emerald-400">
                  {substance.replace('_', ' ')}
                </span>
              </div>

              {/* Kinetic Crossover SVG */}
              <div className="bg-slate-950/90 rounded-xl p-3 border border-slate-800">
                <svg viewBox="0 0 280 120" className="w-full h-28">
                  {/* Axis */}
                  <line x1="30" y1="105" x2="270" y2="105" stroke="#475569" strokeWidth="1.5" />
                  <line x1="30" y1="10" x2="30" y2="105" stroke="#475569" strokeWidth="1.5" />

                  {/* Curve 1: Osmolal Gap (starts high, declines) */}
                  <path
                    d="M 30 20 Q 120 40, 260 100"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="3"
                    strokeDasharray={fomepizoleActive ? '4,4' : 'none'}
                  />
                  {/* Curve 2: Anion Gap (starts low, surges) */}
                  {substance !== 'ISOPROPANOL' && (
                    <path
                      d="M 30 100 Q 120 90, 260 25"
                      fill="none"
                      stroke="#f43f5e"
                      strokeWidth="3"
                      strokeDasharray={fomepizoleActive ? '4,4' : 'none'}
                    />
                  )}

                  {/* Current timeline pin */}
                  <line
                    x1={30 + (hoursPostIngestion / 36) * 230}
                    y1="10"
                    x2={30 + (hoursPostIngestion / 36) * 230}
                    y2="105"
                    stroke="#e2e8f0"
                    strokeWidth="2"
                    strokeDasharray="2,2"
                  />
                  <circle
                    cx={30 + (hoursPostIngestion / 36) * 230}
                    cy="60"
                    r="4"
                    fill="#10b981"
                  />

                  {/* Labels */}
                  <text x="35" y="22" fill="#38bdf8" fontSize="9" fontWeight="bold">
                    Osmolal Gap
                  </text>
                  {substance !== 'ISOPROPANOL' && (
                    <text x="180" y="32" fill="#f43f5e" fontSize="9" fontWeight="bold">
                      Anion Gap
                    </text>
                  )}
                  <text x="140" y="117" fill="#94a3b8" fontSize="8" textAnchor="middle">
                    Time (0 to 36 hours post-ingestion)
                  </text>
                </svg>

                {fomepizoleActive && (
                  <div className="mt-2 text-center text-[10px] font-bold text-emerald-400 bg-emerald-950/40 py-1 rounded border border-emerald-500/30">
                    ADH Blocked by Fomepizole (Halts Toxic Acid Surge)
                  </div>
                )}
              </div>

              {/* End-Organ Microscopic & Diagnostic Feature Box */}
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Microscope className="w-3.5 h-3.5 text-cyan-400" />
                  Specific Pathology Markers
                </div>

                {substance === 'ETHYLENE_GLYCOL' && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Calcium Oxalate Crystals:</span>
                      <strong
                        className={
                          metrics.calciumOxalateCrystalsPresent
                            ? 'text-amber-400 font-bold'
                            : 'text-slate-500'
                        }
                      >
                        {metrics.calciumOxalateCrystalsPresent
                          ? 'Present (Envelope / Needles)'
                          : 'None Seen'}
                      </strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Wood\'s Lamp Fluorescence:</span>
                      <strong
                        className={
                          metrics.woodsLampUrineFluorescence
                            ? 'text-emerald-400 font-bold'
                            : 'text-slate-500'
                        }
                      >
                        {metrics.woodsLampUrineFluorescence ? 'POSITIVE (Fluorescein)' : 'Negative'}
                      </strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Renal Function:</span>
                      <strong
                        className={
                          metrics.acuteKidneyInjuryStage !== 'NONE'
                            ? 'text-rose-400 font-bold'
                            : 'text-emerald-400'
                        }
                      >
                        {metrics.acuteKidneyInjuryStage.replace('_', ' ')}
                      </strong>
                    </div>
                  </div>
                )}

                {substance === 'METHANOL' && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Visual Impairment:</span>
                      <strong
                        className={
                          metrics.visualImpairmentGrade === 'SNOWSTORM_BLINDNESS'
                            ? 'text-rose-400 font-bold'
                            : metrics.visualImpairmentGrade === 'BLURRED_VISION'
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }
                      >
                        {metrics.visualImpairmentGrade.replace('_', ' ')}
                      </strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Optic Fundus:</span>
                      <strong className="text-rose-300">
                        {metrics.visualImpairmentGrade !== 'NONE'
                          ? 'Optic Disc Hyperemia & Edema'
                          : 'Normal'}
                      </strong>
                    </div>
                  </div>
                )}

                {substance === 'ISOPROPANOL' && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Serum / Urine Ketones:</span>
                      <strong className="text-purple-400 font-bold">LARGE (Acetone)</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Acidosis:</span>
                      <strong className="text-emerald-400 font-bold">ABSENT (Normal pH)</strong>
                    </div>
                    <div className="text-[11px] text-slate-400 italic">
                      Key clinical pearl: Acetone is a non-acid ketone; does not produce HAGMA or tissue infarction.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Column 3: Diagnostic Solver & Antidote Protocol (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            {/* Live Numerical Metrics Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Biochemical Solvers
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    metrics.osmolalGapMOsmKg > 15
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  Gap: {metrics.osmolalGapMOsmKg} mOsm/kg
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-[11px]">Calculated Osm:</div>
                  <div className="text-base font-bold text-white">
                    {metrics.calculatedOsmolalityMOsmKg}
                  </div>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-[11px]">Osmolal Gap:</div>
                  <div
                    className={`text-base font-bold ${
                      metrics.osmolalGapMOsmKg > 15 ? 'text-amber-400' : 'text-emerald-400'
                    }`}
                  >
                    {metrics.osmolalGapMOsmKg} mOsm
                  </div>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-[11px]">Anion Gap (AG):</div>
                  <div
                    className={`text-base font-bold ${
                      metrics.anionGapMEqL > 16 ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    {metrics.anionGapMEqL} mEq/L
                  </div>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-[11px]">Arterial pH (est):</div>
                  <div
                    className={`text-base font-bold ${
                      metrics.arterialPh < 7.25 ? 'text-rose-400' : 'text-white'
                    }`}
                  >
                    {metrics.arterialPh}
                  </div>
                </div>
              </div>

              {/* Antidote & Dialysis Action Checklist */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  Emergent Action &amp; Antidote Protocol
                </div>

                <div className="space-y-1.5">
                  {metrics.urgentActionChecklist.map((act, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-200"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Treatment Toggles */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Pill className="w-3.5 h-3.5 text-emerald-400" />
                  Therapeutic Interventions
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => setFomepizoleActive(!fomepizoleActive)}
                    className={`w-full py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-between transition ${
                      fomepizoleActive
                        ? 'bg-emerald-600 border-emerald-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span>Fomepizole (15 mg/kg IV Loading)</span>
                    <span>{fomepizoleActive ? 'ACTIVE (ADH Blocked)' : 'Instill Antidote'}</span>
                  </button>

                  <button
                    onClick={() => setCofactorsGiven(!cofactorsGiven)}
                    className={`w-full py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-between transition ${
                      cofactorsGiven
                        ? 'bg-purple-600 border-purple-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span>Cofactors (Thiamine/B6/Folate)</span>
                    <span>{cofactorsGiven ? 'GIVEN' : 'Administer'}</span>
                  </button>

                  <button
                    onClick={() => setHemodialysisActive(!hemodialysisActive)}
                    className={`w-full py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-between transition ${
                      hemodialysisActive
                        ? 'bg-rose-600 border-rose-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span>Emergent Intermittent Hemodialysis</span>
                    <span>{hemodialysisActive ? 'RUNNING (Clearance)' : 'Initiate HD'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
