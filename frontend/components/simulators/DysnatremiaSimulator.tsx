'use client';

import React, { useState, useMemo } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Droplets,
  Flame,
  Info,
  Layers,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Zap,
  HelpCircle,
  TrendingUp,
  Brain,
  Scale,
} from 'lucide-react';
import {
  DysnatremiaPatientProfile,
  InfusionRegimen,
  InfusateType,
  INFUSATE_REGISTRY,
  DYSNATREMIA_PRESETS,
  evaluateDysnatremiaWorkstation,
} from '../../.gemini/skills/DysnatremiaEngine';

export default function DysnatremiaSimulator() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(
    'ACUTE_SEVERE_SYMPTOMATIC_HYPONATREMIA'
  );

  const [patient, setPatient] = useState<DysnatremiaPatientProfile>(
    DYSNATREMIA_PRESETS[0].patient
  );

  const [regimen, setRegimen] = useState<InfusionRegimen>(
    DYSNATREMIA_PRESETS[0].regimen
  );

  const [activeTab, setActiveTab] = useState<
    'diagnostics' | 'kinetics' | 'boluses' | 'ods_safety' | 'osmotherapy'
  >('diagnostics');

  // Master Evaluation
  const evaluation = useMemo(() => {
    return evaluateDysnatremiaWorkstation(patient, regimen);
  }, [patient, regimen]);

  // Preset Switcher
  const handleSelectPreset = (presetId: string) => {
    const preset = DYSNATREMIA_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setSelectedPresetId(presetId);
    setPatient({ ...preset.patient });
    setRegimen({ ...preset.regimen });
  };

  // Push 3% NaCl Emergency Bolus
  const handlePush3PercentBolus = () => {
    setRegimen((prev) => ({
      ...prev,
      bolusesGiven3PercentCount: Math.min(3, prev.bolusesGiven3PercentCount + 1),
    }));
    alert(
      'EMERGENCY 3% HYPERTONIC SALINE BOLUS GIVEN: 100 mL IV infused over 10 minutes. Projected acute serum sodium elevation: +1.5 to +2.0 mEq/L. Expect rapid reduction in cerebral edema!'
    );
  };

  // Deploy DDAVP Clamp
  const handleDeployDdavpClamp = () => {
    setRegimen((prev) => ({
      ...prev,
      ddavpClampGiven: true,
      selectedInfusate: 'D5W_OR_FREE_WATER',
      infusionRateMlHr: 150,
      bolusesGiven3PercentCount: 0,
    }));
    alert(
      'DDAVP CLAMP & D5W RESCUE DEPLOYED: Desmopressin 2 mcg IV administered. Active saline infusions halted. D5W started at 150 mL/hr to re-lower serum sodium and avert Osmotic Demyelination Syndrome.'
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-md bg-sky-500/20 text-sky-400 border border-sky-500/30">
                Nephrology &amp; Critical Care
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Adrogu&eacute;-Madias &amp; ODS Safety
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mt-2 text-white">
              Dysnatremia, Hyponatremia/Hypernatremia Kinetics &amp; Osmotherapy Workstation
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Adrogu&eacute;-Madias fluid dynamics, Osmotic Demyelination Syndrome (ODS) prevention, 3% hypertonic saline bolus, DDAVP clamp, and neuro-osmotherapy.
            </p>
          </div>

          {/* Preset Selector */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="preset-select"
              className="text-xs text-slate-400 font-medium whitespace-nowrap"
            >
              Clinical Preset:
            </label>
            <select
              id="preset-select"
              aria-label="Clinical Preset"
              value={selectedPresetId}
              onChange={(e) => handleSelectPreset(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none"
            >
              {DYSNATREMIA_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Emergency Symptomatic Hyponatremia Banner */}
        {patient.hasSevereNeuroSymptoms && patient.baselineSerumSodiumMeqL < 130 && (
          <div className="mt-4 p-4 rounded-xl bg-rose-950/80 border-2 border-rose-500 flex flex-col md:flex-row items-center justify-between gap-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-rose-600 rounded-full text-white">
                <Brain className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-rose-400 font-black tracking-wider text-sm uppercase">
                    CRITICAL EMERGENCY: SEVERE SYMPTOMATIC HYPONATREMIA
                  </span>
                  <span className="px-2 py-0.5 bg-rose-500/30 text-rose-200 text-xs font-mono rounded">
                    SERUM NA: {patient.baselineSerumSodiumMeqL} mEq/L
                  </span>
                </div>
                <p className="text-rose-200 text-xs mt-1">
                  Seizures / Coma / Herniation risk &bull; Immediately administer 100&ndash;150 mL 3% Hypertonic Saline bolus over 10 min!
                </p>
              </div>
            </div>
            <button
              onClick={handlePush3PercentBolus}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-black rounded-lg transition whitespace-nowrap shadow-lg shadow-rose-900/50"
            >
              Push 100 mL 3% NaCl Bolus
            </button>
          </div>
        )}

        {/* Overcorrection / ODS Alert Banner */}
        {evaluation.isOvercorrecting && (
          <div className="mt-4 p-4 rounded-xl bg-purple-950/80 border-2 border-purple-500 flex flex-col md:flex-row items-center justify-between gap-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-600 rounded-full text-white">
                <ShieldAlert className="w-6 h-6 animate-spin" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-300 font-black tracking-wider text-sm uppercase">
                    OVERCORRECTION CRISIS: OSMOTIC DEMYELINATION (ODS) RISK
                  </span>
                  <span className="px-2 py-0.5 bg-purple-500/30 text-purple-200 text-xs font-mono rounded">
                    24h &Delta;NA: +{evaluation.predicted24hSodiumChangeMeqL} mEq/L (Max: {evaluation.safe24hCorrectionLimitMeqL})
                  </span>
                </div>
                <p className="text-purple-200 text-xs mt-1">
                  Correction exceeds safety limit! Risk of irreversible pontine myelinolysis &bull; Halt saline infusions &amp; initiate DDAVP clamp with D5W!
                </p>
              </div>
            </div>
            <button
              onClick={handleDeployDdavpClamp}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-black rounded-lg transition whitespace-nowrap shadow-lg shadow-purple-900/50"
            >
              Deploy DDAVP Clamp + D5W Rescue
            </button>
          </div>
        )}

        {/* Hyperglycemia Translocational Artifact Banner */}
        {patient.serumGlucoseMgDl > 250 && (
          <div className="mt-4 p-3 rounded-xl bg-amber-950/40 border border-amber-500/50 flex items-center gap-3">
            <Info className="w-5 h-5 text-amber-400 shrink-0" />
            <div className="text-xs text-amber-200">
              <strong className="text-amber-300">Hyperglycemia Translocational Shift:</strong> Measured sodium ({patient.baselineSerumSodiumMeqL} mEq/L) is lowered by osmotic fluid shift from intracellular to extracellular space. Katz corrected sodium is <strong className="text-white font-mono">{evaluation.glucoseCorrectedSodiumMeqL} mEq/L</strong>. Treat hyperglycemia first!
            </div>
          </div>
        )}

        {/* Scoreboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          {/* Card 1: Measured vs Corrected Sodium */}
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
            <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              Serum Sodium &amp; Posm
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-black text-sky-400 font-mono">
                {patient.baselineSerumSodiumMeqL}
              </span>
              <span className="text-xs text-slate-400 font-mono">mEq/L</span>
              {patient.serumGlucoseMgDl > 100 && (
                <span className="text-xs font-bold text-amber-400 font-mono">
                  (Corr: {evaluation.glucoseCorrectedSodiumMeqL})
                </span>
              )}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Posm: {evaluation.calculatedSerumOsmolalityMOsmKg} mOsm/kg &bull; {evaluation.effectiveTonicityState}
            </div>
          </div>

          {/* Card 2: 24h Projected Sodium Change */}
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
            <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              24-Hour Projected &Delta;Na
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span
                className={`text-2xl font-black font-mono ${
                  evaluation.isOvercorrecting
                    ? 'text-rose-400'
                    : evaluation.predicted24hSodiumChangeMeqL >= 4
                    ? 'text-emerald-400'
                    : 'text-amber-400'
                }`}
              >
                {evaluation.predicted24hSodiumChangeMeqL >= 0 ? '+' : ''}
                {evaluation.predicted24hSodiumChangeMeqL}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                / {evaluation.safe24hCorrectionLimitMeqL} max
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  evaluation.isOvercorrecting
                    ? 'bg-rose-500'
                    : 'bg-emerald-400'
                }`}
                style={{
                  width: `${Math.min(
                    100,
                    (Math.abs(evaluation.predicted24hSodiumChangeMeqL) /
                      evaluation.safe24hCorrectionLimitMeqL) *
                      100
                  )}%`,
                }}
              />
            </div>
          </div>

          {/* Card 3: Free Water Deficit */}
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
            <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              Free Water Deficit (FWD)
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-black text-cyan-400 font-mono">
                {evaluation.freeWaterDeficitLiters > 0
                  ? `${evaluation.freeWaterDeficitLiters} L`
                  : '0 L'}
              </span>
              {evaluation.recommendedWaterReplacementRateMlHr > 0 && (
                <span className="text-xs text-slate-400 font-mono">
                  ({evaluation.recommendedWaterReplacementRateMlHr} mL/hr)
                </span>
              )}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              TBW: {evaluation.totalBodyWaterLiters} L &bull; Replace over 24&ndash;48 hrs
            </div>
          </div>

          {/* Card 4: Etiology Classification */}
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
            <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              Etiology Classification
            </div>
            <div className="mt-1">
              <span
                className={`px-2 py-0.5 text-xs font-extrabold rounded inline-block truncate max-w-full ${
                  evaluation.etiologyClassification.includes('SIADH')
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    : evaluation.etiologyClassification.includes('HYPERTONIC')
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : evaluation.etiologyClassification.includes('DI')
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                {evaluation.etiologyClassification.replace(/_/g, ' ')}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1 truncate">
              UNa {patient.urineSodiumMeqL} &bull; UOsm {patient.urineOsmolalityMOsmKg}
            </div>
          </div>
        </div>
      </header>

      {/* Main Tabs Navigation */}
      <main className="max-w-7xl mx-auto">
        <div className="flex border-b border-slate-800 mb-6 gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('diagnostics')}
            className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-t-lg transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'diagnostics'
                ? 'bg-slate-900 text-sky-400 border-t-2 border-sky-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Scale className="w-4 h-4" />
            1. Diagnostic Algorithm &amp; Urine Studies
          </button>
          <button
            onClick={() => setActiveTab('kinetics')}
            className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-t-lg transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'kinetics'
                ? 'bg-slate-900 text-sky-400 border-t-2 border-sky-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            2. Adrogu&eacute;-Madias Fluid Kinetics
          </button>
          <button
            onClick={() => setActiveTab('boluses')}
            className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-t-lg transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'boluses'
                ? 'bg-slate-900 text-sky-400 border-t-2 border-sky-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-4 h-4" />
            3. Acute 3% NaCl Bolus Simulator
          </button>
          <button
            onClick={() => setActiveTab('ods_safety')}
            className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-t-lg transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'ods_safety'
                ? 'bg-slate-900 text-sky-400 border-t-2 border-sky-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            4. ODS Safety &amp; DDAVP Rescue
          </button>
          <button
            onClick={() => setActiveTab('osmotherapy')}
            className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-t-lg transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'osmotherapy'
                ? 'bg-slate-900 text-sky-400 border-t-2 border-sky-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Brain className="w-4 h-4" />
            5. Neuro-Osmotherapy (ICP &amp; TBI)
          </button>
        </div>

        {/* TAB 1: DIAGNOSTICS & URINE STUDIES */}
        {activeTab === 'diagnostics' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4 bg-slate-900/60 border border-slate-800 p-5 rounded-xl">
              <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2">
                <Scale className="w-4 h-4 text-sky-400" />
                Diagnostic Hyponatremia &amp; Hypernatremia Evaluator
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {/* Serum Sodium */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Serum Sodium ([Na+])</span>
                    <span className="font-mono font-bold text-sky-400">
                      {patient.baselineSerumSodiumMeqL} mEq/L
                    </span>
                  </div>
                  <input
                    type="range"
                    min="95"
                    max="175"
                    step="1"
                    value={patient.baselineSerumSodiumMeqL}
                    onChange={(e) =>
                      setPatient({
                        ...patient,
                        baselineSerumSodiumMeqL: parseInt(e.target.value, 10),
                      })
                    }
                    className="w-full accent-sky-500"
                  />
                  <span className="text-[10px] text-slate-400">Normal: 135&ndash;145 mEq/L</span>
                </div>

                {/* Serum Glucose */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Serum Glucose</span>
                    <span className="font-mono font-bold text-amber-400">
                      {patient.serumGlucoseMgDl} mg/dL
                    </span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="950"
                    step="10"
                    value={patient.serumGlucoseMgDl}
                    onChange={(e) =>
                      setPatient({
                        ...patient,
                        serumGlucoseMgDl: parseInt(e.target.value, 10),
                      })
                    }
                    className="w-full accent-amber-500"
                  />
                  <span className="text-[10px] text-slate-400">Katz correction if &gt; 100</span>
                </div>

                {/* Serum BUN */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Blood Urea Nitrogen (BUN)</span>
                    <span className="font-mono font-bold text-slate-200">
                      {patient.serumBunMgDl} mg/dL
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="90"
                    step="1"
                    value={patient.serumBunMgDl}
                    onChange={(e) =>
                      setPatient({
                        ...patient,
                        serumBunMgDl: parseInt(e.target.value, 10),
                      })
                    }
                    className="w-full accent-slate-400"
                  />
                  <span className="text-[10px] text-slate-400">Contributes to calculated osmolality</span>
                </div>
              </div>

              {/* Urine Studies */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
                {/* Urine Sodium */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Urine Sodium (UNa)</span>
                    <span className="font-mono font-bold text-indigo-400">
                      {patient.urineSodiumMeqL} mEq/L
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="120"
                    step="1"
                    value={patient.urineSodiumMeqL}
                    onChange={(e) =>
                      setPatient({
                        ...patient,
                        urineSodiumMeqL: parseInt(e.target.value, 10),
                      })
                    }
                    className="w-full accent-indigo-500"
                  />
                  <span className="text-[10px] text-slate-400">
                    &lt; 20 = Extrarenal retention | &gt; 30 = SIADH / Renal
                  </span>
                </div>

                {/* Urine Osmolality */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Urine Osmolality (UOsm)</span>
                    <span className="font-mono font-bold text-purple-400">
                      {patient.urineOsmolalityMOsmKg} mOsm/kg
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="1000"
                    step="10"
                    value={patient.urineOsmolalityMOsmKg}
                    onChange={(e) =>
                      setPatient({
                        ...patient,
                        urineOsmolalityMOsmKg: parseInt(e.target.value, 10),
                      })
                    }
                    className="w-full accent-purple-500"
                  />
                  <span className="text-[10px] text-slate-400">
                    &lt; 100 = Polydipsia / Potomania | &gt; 100 = ADH active
                  </span>
                </div>

                {/* Urine Output */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Urine Output Rate</span>
                    <span className="font-mono font-bold text-cyan-400">
                      {patient.urineOutputMlHr} mL/hr
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="600"
                    step="10"
                    value={patient.urineOutputMlHr}
                    onChange={(e) =>
                      setPatient({
                        ...patient,
                        urineOutputMlHr: parseInt(e.target.value, 10),
                      })
                    }
                    className="w-full accent-cyan-500"
                  />
                  <span className="text-[10px] text-slate-400">
                    &gt; 200 mL/hr = Free water diuresis risk
                  </span>
                </div>
              </div>

              {/* Patient Demographics */}
              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-medium">Biological Sex:</span>
                  <button
                    onClick={() =>
                      setPatient((prev) => ({ ...prev, sex: 'MALE' }))
                    }
                    className={`px-2.5 py-1 rounded font-bold ${
                      patient.sex === 'MALE'
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    Male (0.6 TBW)
                  </button>
                  <button
                    onClick={() =>
                      setPatient((prev) => ({ ...prev, sex: 'FEMALE' }))
                    }
                    className={`px-2.5 py-1 rounded font-bold ${
                      patient.sex === 'FEMALE'
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    Female (0.5 TBW)
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-medium">Age Group:</span>
                  <button
                    onClick={() =>
                      setPatient((prev) => ({ ...prev, ageCategory: 'ADULT' }))
                    }
                    className={`px-2.5 py-1 rounded font-bold ${
                      patient.ageCategory === 'ADULT'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    Adult (&lt; 65)
                  </button>
                  <button
                    onClick={() =>
                      setPatient((prev) => ({ ...prev, ageCategory: 'ELDERLY' }))
                    }
                    className={`px-2.5 py-1 rounded font-bold ${
                      patient.ageCategory === 'ELDERLY'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    Elderly (&ge; 65)
                  </button>
                </div>
              </div>
            </div>

            {/* Diagnostic Interpretation Card */}
            <div className="space-y-4">
              <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Diagnostic Rationale
                </h3>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs text-slate-300 space-y-2">
                  <p className="leading-relaxed">
                    {evaluation.etiologyDiagnosticRationale}
                  </p>
                  <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                    <div>&bull; Total Body Water (TBW): <strong>{evaluation.totalBodyWaterLiters} Liters</strong></div>
                    <div>&bull; Calculated Osmolality: <strong>{evaluation.calculatedSerumOsmolalityMOsmKg} mOsm/kg</strong></div>
                    <div>&bull; Glucose-Corrected Na: <strong>{evaluation.glucoseCorrectedSodiumMeqL} mEq/L</strong></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ADROGUE-MADIAS KINETICS */}
        {activeTab === 'kinetics' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4 bg-slate-900/60 border border-slate-800 p-5 rounded-xl">
              <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-sky-400" />
                Adrogu&eacute;-Madias Infusate Simulation &amp; Trajectory
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Infusate Type */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Select Infusate Solution
                  </label>
                  <select
                    value={regimen.selectedInfusate}
                    onChange={(e) =>
                      setRegimen({
                        ...regimen,
                        selectedInfusate: e.target.value as InfusateType,
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2"
                  >
                    {Object.entries(INFUSATE_REGISTRY).map(([key, item]) => (
                      <option key={key} value={key}>
                        {item.name} ([Na] {item.sodiumMeqL} mEq/L &bull; {item.osmolalityMOsmL} mOsm/L)
                      </option>
                    ))}
                  </select>
                  <span className="text-[10px] text-slate-400">
                    &Delta;Na per 1 Liter: {evaluation.deltaSodiumPerLiterInfusateMeqL >= 0 ? '+' : ''}
                    {evaluation.deltaSodiumPerLiterInfusateMeqL} mEq/L
                  </span>
                </div>

                {/* Infusion Rate */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Continuous Infusion Rate</span>
                    <span className="font-mono font-bold text-sky-400">
                      {regimen.infusionRateMlHr} mL/hr
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="500"
                    step="10"
                    value={regimen.infusionRateMlHr}
                    onChange={(e) =>
                      setRegimen({
                        ...regimen,
                        infusionRateMlHr: parseInt(e.target.value, 10),
                      })
                    }
                    className="w-full accent-sky-500"
                  />
                  <span className="text-[10px] text-slate-400">
                    Infusing {((regimen.infusionRateMlHr * regimen.durationHours) / 1000).toFixed(2)} L over {regimen.durationHours} hrs
                  </span>
                </div>
              </div>

              {/* Infusion Duration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Infusion Duration Window</span>
                    <span className="font-mono font-bold text-slate-200">
                      {regimen.durationHours} hours
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="24"
                    step="1"
                    value={regimen.durationHours}
                    onChange={(e) =>
                      setRegimen({
                        ...regimen,
                        durationHours: parseInt(e.target.value, 10),
                      })
                    }
                    className="w-full accent-slate-400"
                  />
                  <span className="text-[10px] text-slate-400">Standard ICU reassessment window: 24h</span>
                </div>

                {/* Projected Serum Sodium Display */}
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex flex-col justify-center">
                  <span className="text-[11px] text-slate-400 uppercase font-semibold">
                    Projected Serum Sodium at {regimen.durationHours} Hours
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-sky-400 font-mono">
                      {evaluation.projectedSerumSodiumMeqL} mEq/L
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      ({evaluation.predicted24hSodiumChangeMeqL >= 0 ? '+' : ''}
                      {evaluation.predicted24hSodiumChangeMeqL} mEq/L change)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Formula Reference Card */}
            <div className="space-y-4">
              <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Adrogu&eacute;-Madias Equation
                </h3>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs font-mono text-cyan-300">
                  &Delta;[Na+] = ([Na_inf] + [K_inf] - [Na_serum]) / (TBW + 1)
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Predicts the expected change in serum sodium following infusion of 1 Liter of any electrolyte solution into the total body water compartment.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ACUTE 3% NACL BOLUSES */}
        {activeTab === 'boluses' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4 bg-slate-900/60 border border-slate-800 p-5 rounded-xl">
              <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2">
                <Zap className="w-4 h-4 text-rose-400" />
                Acute Severe Symptomatic Hyponatremia &amp; 3% NaCl Bolus Protocol
              </h2>
              <p className="text-xs text-slate-400">
                In patients with active seizures, coma, or imminent brainstem herniation, do NOT use continuous slow infusions. Administer immediate 100&ndash;150 mL boluses of 3% Hypertonic Saline.
              </p>

              {/* Symptom Toggle */}
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <strong className="text-slate-200 text-sm">
                    Severe Neurological Symptoms (Seizures / Coma / Herniation)
                  </strong>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Indicates acute cerebral edema requiring emergent osmotic resuscitation
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={patient.hasSevereNeuroSymptoms}
                  onChange={(e) =>
                    setPatient({ ...patient, hasSevereNeuroSymptoms: e.target.checked })
                  }
                  className="w-5 h-5 rounded accent-rose-500 cursor-pointer"
                />
              </div>

              {/* Bolus Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Boluses of 3% NaCl Administered</span>
                    <span className="font-mono font-bold text-rose-400">
                      {regimen.bolusesGiven3PercentCount} &times; {regimen.bolusVolumeMl} mL
                    </span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    {[0, 1, 2, 3].map((count) => (
                      <button
                        key={count}
                        onClick={() =>
                          setRegimen({ ...regimen, bolusesGiven3PercentCount: count })
                        }
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                          regimen.bolusesGiven3PercentCount === count
                            ? 'bg-rose-600 text-white'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {count === 0 ? 'None' : `${count} Bolus${count > 1 ? 'es' : ''}`}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Bolus Volume Size
                  </label>
                  <select
                    value={regimen.bolusVolumeMl}
                    onChange={(e) =>
                      setRegimen({
                        ...regimen,
                        bolusVolumeMl: parseInt(e.target.value, 10),
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2"
                  >
                    <option value={100}>100 mL IV over 10 min (European Guidelines)</option>
                    <option value={150}>150 mL IV over 20 min (US Guidelines)</option>
                  </select>
                </div>
              </div>

              {/* Emergency Recommendation Box */}
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase">
                  Consensus Emergency Bolus Strategy
                </span>
                <p className="text-xs text-rose-300 leading-relaxed">
                  {evaluation.emergencyBolusRecommendation}
                </p>
              </div>
            </div>

            {/* Protocol Rules Card */}
            <div className="space-y-4">
              <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  The &ldquo;Rule of 4 to 6&rdquo;
                </h3>
                <div className="space-y-2 text-xs text-slate-300">
                  <p className="text-[11px] text-slate-400">
                    &bull; An acute increase of only <strong>4 to 6 mEq/L</strong> in serum sodium is sufficient to reduce brain swelling and abort active seizures.
                  </p>
                  <p className="text-[11px] text-slate-400">
                    &bull; Once seizures cease or +4 to +6 mEq/L is achieved, <strong>STOP</strong> bolus therapy and transition to slow maintenance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ODS SAFETY & DDAVP RESCUE */}
        {activeTab === 'ods_safety' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4 bg-slate-900/60 border border-slate-800 p-5 rounded-xl">
              <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-purple-400" />
                Osmotic Demyelination Syndrome (ODS) Guardrails &amp; DDAVP Clamp
              </h2>
              <p className="text-xs text-slate-400">
                Overly rapid sodium correction dehydrates brain endothelial and glial cells, stripping myelin from the pons (Central Pontine Myelinolysis) and causing quadriplegia, pseudobulbar palsy, and locked-in syndrome.
              </p>

              {/* High Risk Toggle */}
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <strong className="text-slate-200 text-sm">
                    High Risk for Osmotic Demyelination Syndrome (ODS)
                  </strong>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Baseline Na &lt; 105 mEq/L, Hypokalemia (K &lt; 3.0), Alcohol use disorder, Cirrhosis, Malnutrition
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={patient.isHighRiskForOds}
                  onChange={(e) =>
                    setPatient({ ...patient, isHighRiskForOds: e.target.checked })
                  }
                  className="w-5 h-5 rounded accent-purple-500 cursor-pointer"
                />
              </div>

              {/* Safety Limits Display */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-[11px] text-slate-400 uppercase font-semibold">
                    24-Hour Safe Correction Limit
                  </span>
                  <div className="text-2xl font-black text-purple-400 font-mono mt-1">
                    &le; {evaluation.safe24hCorrectionLimitMeqL} mEq/L / 24h
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {patient.isHighRiskForOds
                      ? 'Strict 4–6 mEq/L limit for high-risk patients'
                      : 'Standard 8 mEq/L ceiling (max 16 in 48h)'}
                  </span>
                </div>

                <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-[11px] text-slate-400 uppercase font-semibold">
                    DDAVP Clamp Status
                  </span>
                  <div className="text-2xl font-black text-cyan-400 font-mono mt-1">
                    {regimen.ddavpClampGiven ? 'ACTIVE CLAMP' : 'INACTIVE'}
                  </div>
                  <span className="text-[10px] text-slate-400">
                    Desmopressin 1&ndash;2 mcg IV/SC halts water loss
                  </span>
                </div>
              </div>

              {/* Overcorrection Rescue Plan */}
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase">
                  Overcorrection Rescue Action Plan
                </span>
                <p className="text-xs text-purple-200 leading-relaxed">
                  {evaluation.overcorrectionRescuePlan}
                </p>
              </div>
            </div>

            {/* ODS High-Yield Facts Card */}
            <div className="space-y-4">
              <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Pathophysiology of ODS
                </h3>
                <div className="space-y-2 text-xs text-slate-300">
                  <p className="text-[11px] text-slate-400">
                    In chronic hyponatremia, astrocytes extrude organic osmolytes (myo-inositol, glutamine, taurine) to protect brain volume.
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Rapid sodium rise causes acute brain cell dehydration because re-uptake of organic osmolytes takes 48 to 72 hours, resulting in oligodendrocyte apoptosis and myelinolysis.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: NEURO-OSMOTHERAPY */}
        {activeTab === 'osmotherapy' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4 bg-slate-900/60 border border-slate-800 p-5 rounded-xl">
              <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2">
                <Brain className="w-4 h-4 text-cyan-400" />
                Targeted Neuro-Osmotherapy (ICP, Cerebral Edema &amp; TBI)
              </h2>
              <p className="text-xs text-slate-400">
                Osmotherapy draws free water from swollen brain tissue into the vascular space across an intact blood-brain barrier.
              </p>

              {/* Equiosmolar Comparison Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-slate-300">
                  <thead className="text-[11px] uppercase bg-slate-800 text-slate-400">
                    <tr>
                      <th className="p-3">Agent</th>
                      <th className="p-3">Osmolality</th>
                      <th className="p-3">Reflection (&sigma;)</th>
                      <th className="p-3">Volume Effect</th>
                      <th className="p-3">Dose / Target</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    <tr>
                      <td className="p-3 font-bold text-sky-400">3% Hypertonic Saline</td>
                      <td className="p-3 font-mono">1026 mOsm/L</td>
                      <td className="p-3 font-mono">1.0 (impermeable)</td>
                      <td className="p-3 text-emerald-400">Expands intravascular volume</td>
                      <td className="p-3">Target Na 145&ndash;155 mEq/L</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-amber-400">20% Mannitol</td>
                      <td className="p-3 font-mono">1098 mOsm/L</td>
                      <td className="p-3 font-mono">0.9</td>
                      <td className="p-3 text-rose-400">Osmotic diuresis &amp; dehydration</td>
                      <td className="p-3">0.5&ndash;1.0 g/kg bolus over 20 min</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Osmotherapy Recommendation Box */}
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase">
                  Neuro-Osmotherapy Protocol Guidance
                </span>
                <p className="text-xs text-cyan-200 leading-relaxed">
                  {evaluation.osmotherapyRecommendation}
                </p>
              </div>
            </div>

            {/* Toxicity Cutoffs Card */}
            <div className="space-y-4">
              <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Osmotherapy Safety Ceilings
                </h3>
                <div className="space-y-2 text-xs text-slate-300">
                  <div>&bull; <strong>Max Serum Osmolality:</strong> &le; 320 mOsm/kg</div>
                  <div>&bull; <strong>Max Osmolar Gap:</strong> &le; 20 mOsm/kg for Mannitol</div>
                  <div>&bull; <strong>Renal Failure Risk:</strong> High serum osmolality with Mannitol causes acute tubular vacuolization and ATN.</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Clinical Safety Alerts Box */}
        {evaluation.clinicalSafetyAlerts.length > 0 && (
          <div className="mt-6 p-4 rounded-xl bg-amber-950/30 border border-amber-500/40">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase mb-2">
              <AlertTriangle className="w-4 h-4" />
              Active Clinical Safety Alerts
            </div>
            <ul className="space-y-1 text-xs text-amber-200">
              {evaluation.clinicalSafetyAlerts.map((alert, i) => (
                <li key={i} className="flex items-start gap-1.5 text-[11px]">
                  <span>&bull;</span>
                  <span>{alert}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}
