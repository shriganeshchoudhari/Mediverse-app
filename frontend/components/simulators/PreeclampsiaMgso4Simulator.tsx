'use client';

import React, { useState, useMemo } from 'react';
import {
  Activity,
  AlertTriangle,
  Baby,
  Brain,
  CheckCircle2,
  Droplets,
  Heart,
  Info,
  Layers,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Zap,
  Flame,
  Stethoscope,
  Pill,
} from 'lucide-react';
import {
  MaternalObstetricVitals,
  MaternalLabs,
  Mgso4Regimen,
  PREECLAMPSIA_PRESETS,
  evaluatePreeclampsiaWorkstation,
} from '../../.gemini/skills/PreeclampsiaMgso4Engine';

export default function PreeclampsiaMgso4Simulator() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(
    'PREECLAMPSIA_SEVERE_FEATURES_LABOR'
  );

  const [vitals, setVitals] = useState<MaternalObstetricVitals>(
    PREECLAMPSIA_PRESETS[0].vitals
  );

  const [labs, setLabs] = useState<MaternalLabs>(
    PREECLAMPSIA_PRESETS[0].labs
  );

  const [regimen, setRegimen] = useState<Mgso4Regimen>(
    PREECLAMPSIA_PRESETS[0].regimen
  );

  const [activeTab, setActiveTab] = useState<
    'criteria' | 'mgso4_kinetics' | 'toxicity_antidote' | 'antihypertensives' | 'delivery'
  >('criteria');

  // Master Evaluation
  const evaluation = useMemo(() => {
    return evaluatePreeclampsiaWorkstation(vitals, labs, regimen);
  }, [vitals, labs, regimen]);

  // Preset Switcher
  const handleSelectPreset = (presetId: string) => {
    const preset = PREECLAMPSIA_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setSelectedPresetId(presetId);
    setVitals({ ...preset.vitals });
    setLabs({ ...preset.labs });
    setRegimen({ ...preset.regimen });
  };

  // Push 6g MgSO4 Loading Bolus
  const handlePushMgso4Bolus = () => {
    setRegimen((prev) => ({
      ...prev,
      loadingDoseGrams: 6,
      maintenanceRateGramsHr: 2,
    }));
    setVitals((prev) => ({
      ...prev,
      hasActiveSeizure: false,
    }));
    alert(
      'EMERGENCY MAGNESIUM SULFATE BOLUS GIVEN: 6 g IV infused over 15–20 minutes. Seizure arrested! Maintenance infusion set to 2 g/hr. Continuous maternal lateral tilt and fetal monitoring established.'
    );
  };

  // Administer 10% Calcium Gluconate Antidote
  const handleAdministerCalcium = () => {
    setRegimen((prev) => ({
      ...prev,
      calciumGluconateAdministered: true,
      maintenanceRateGramsHr: 0,
    }));
    setVitals((prev) => ({
      ...prev,
      respiratoryRateBpm: Math.max(14, prev.respiratoryRateBpm + 6),
      patellarReflexGrade: 1,
      oxygenSaturationPct: 98,
    }));
    alert(
      '10% CALCIUM GLUCONATE ADMINISTERED: 1 g (10 mL) IV pushed slowly over 3–5 minutes. Magnesium infusion HALTED. Competitive neuromuscular antagonism initiated. Spontaneous breathing and deep tendon reflexes restoring.'
    );
  };

  // Administer Emergent Antihypertensive
  const handleAdministerLabetalol = () => {
    setRegimen((prev) => ({
      ...prev,
      antihypertensiveSelected: 'LABETALOL_IV',
      antihypertensiveDoseGiven: 'Labetalol 20 mg IV push',
    }));
    setVitals((prev) => ({
      ...prev,
      systolicBpMmHg: Math.max(138, prev.systolicBpMmHg - 25),
      diastolicBpMmHg: Math.max(88, prev.diastolicBpMmHg - 18),
    }));
    alert(
      'EMERGENT ANTIHYPERTENSIVE GIVEN: Labetalol 20 mg IV push over 2 minutes. Blood pressure reducing into safe target zone (140–150 / 90–100 mmHg). Repeat BP measurement in 10 minutes scheduled.'
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-md bg-rose-500/20 text-rose-400 border border-rose-500/30">
                Obstetrics &amp; Maternal-Fetal Medicine
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-md bg-purple-500/20 text-purple-400 border border-purple-500/30">
                ACOG &amp; SOAP Guidelines
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mt-2 text-white">
              Preeclampsia with Severe Features, Eclampsia &amp; MgSO4 Workstation
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              ACOG diagnostic classification, Zuspan/Pritchard Magnesium Sulfate kinetics, toxicity monitoring, 10% Calcium Gluconate antidote, and emergent antihypertensives.
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
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:outline-none"
            >
              {PREECLAMPSIA_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Emergency Active Eclampsia Seizure Banner */}
        {vitals.hasActiveSeizure && (
          <div className="mt-4 p-4 rounded-xl bg-rose-950/80 border-2 border-rose-500 flex flex-col md:flex-row items-center justify-between gap-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-rose-600 rounded-full text-white">
                <Flame className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-rose-400 font-black tracking-wider text-sm uppercase">
                    CRITICAL OBSTETRIC EMERGENCY: ACTIVE ECLAMPTIC SEIZURE
                  </span>
                  <span className="px-2 py-0.5 bg-rose-500/30 text-rose-200 text-xs font-mono rounded">
                    BP {vitals.systolicBpMmHg}/{vitals.diastolicBpMmHg}
                  </span>
                </div>
                <p className="text-rose-200 text-xs mt-1">
                  Generalized tonic-clonic convulsions &bull; Protect maternal airway &bull; Left lateral tilt &bull; Administer Magnesium Sulfate 6 g IV loading dose immediately!
                </p>
              </div>
            </div>
            <button
              onClick={handlePushMgso4Bolus}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-black rounded-lg transition whitespace-nowrap shadow-lg shadow-rose-900/50"
            >
              Push 6g IV MgSO4 Bolus
            </button>
          </div>
        )}

        {/* Emergency Magnesium Toxicity Banner */}
        {evaluation.isMagnesiumToxic && (
          <div className="mt-4 p-4 rounded-xl bg-purple-950/80 border-2 border-purple-500 flex flex-col md:flex-row items-center justify-between gap-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-600 rounded-full text-white">
                <ShieldAlert className="w-6 h-6 animate-spin" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-300 font-black tracking-wider text-sm uppercase">
                    MAGNESIUM TOXICITY DETECTED: {evaluation.magnesiumToxicityStage.replace(/_/g, ' ')}
                  </span>
                  <span className="px-2 py-0.5 bg-purple-500/30 text-purple-200 text-xs font-mono rounded">
                    SERUM MG: {evaluation.estimatedSerumMagnesiumMgDl} mg/dL (Max: 8.4)
                  </span>
                </div>
                <p className="text-purple-200 text-xs mt-1">
                  Respiratory rate {vitals.respiratoryRateBpm} bpm &bull; Reflex grade {vitals.patellarReflexGrade} &bull; Immediately STOP infusion &amp; push 10% Calcium Gluconate 1g IV!
                </p>
              </div>
            </div>
            <button
              onClick={handleAdministerCalcium}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-black rounded-lg transition whitespace-nowrap shadow-lg shadow-purple-900/50"
            >
              Administer 10% Calcium Gluconate (1g IV)
            </button>
          </div>
        )}

        {/* Emergency Severe Blood Pressure Banner */}
        {(vitals.systolicBpMmHg >= 160 || vitals.diastolicBpMmHg >= 110) && !vitals.hasActiveSeizure && (
          <div className="mt-4 p-4 rounded-xl bg-amber-950/70 border border-amber-500 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-600 rounded-full text-white">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-amber-300 font-bold text-xs uppercase tracking-wider">
                    ACUTE SEVERE HYPERTENSION (STROKE RISK)
                  </span>
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-200 text-xs font-mono rounded">
                    {vitals.systolicBpMmHg}/{vitals.diastolicBpMmHg} mmHg
                  </span>
                </div>
                <p className="text-amber-200 text-xs mt-0.5">
                  ACOG mandates emergent IV antihypertensive therapy within 30&ndash;60 minutes to prevent hemorrhagic stroke.
                </p>
              </div>
            </div>
            <button
              onClick={handleAdministerLabetalol}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-lg transition whitespace-nowrap"
            >
              Administer IV Labetalol 20 mg
            </button>
          </div>
        )}

        {/* Scoreboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          {/* Card 1: Diagnostic Classification */}
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
            <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              Diagnostic Classification
            </div>
            <div className="mt-1">
              <span
                className={`px-2 py-0.5 text-xs font-extrabold rounded inline-block truncate max-w-full ${
                  evaluation.classification === 'ECLAMPSIA'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : evaluation.classification === 'HELLP_SYNDROME'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : evaluation.classification === 'PREECLAMPSIA_WITH_SEVERE_FEATURES'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                {evaluation.classification.replace(/_/g, ' ')}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1 truncate">
              {vitals.gestationalAgeWeeks.toFixed(1)} Weeks &bull; {evaluation.hasSevereFeatures ? 'Severe Features Present' : 'No Severe Features'}
            </div>
          </div>

          {/* Card 2: Circulating Magnesium Level */}
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
            <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              Circulating Serum Mg2+
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span
                className={`text-2xl font-black font-mono ${
                  evaluation.isMagnesiumToxic
                    ? 'text-purple-400'
                    : evaluation.estimatedSerumMagnesiumMgDl >= 4.8
                    ? 'text-emerald-400'
                    : 'text-sky-400'
                }`}
              >
                {evaluation.estimatedSerumMagnesiumMgDl}
              </span>
              <span className="text-xs text-slate-400 font-mono">mg/dL</span>
              <span className="text-xs text-slate-400 font-mono">
                ({evaluation.serumMagnesiumMmolL} mmol/L)
              </span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Therapeutic: 4.8&ndash;8.4 mg/dL &bull; {evaluation.magnesiumToxicityStage.replace(/_/g, ' ')}
            </div>
          </div>

          {/* Card 3: Maternal Hemodynamics */}
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
            <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              Maternal Blood Pressure
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span
                className={`text-2xl font-black font-mono ${
                  vitals.systolicBpMmHg >= 160 || vitals.diastolicBpMmHg >= 110
                    ? 'text-rose-400'
                    : 'text-white'
                }`}
              >
                {vitals.systolicBpMmHg} / {vitals.diastolicBpMmHg}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                (MAP {Math.round((vitals.systolicBpMmHg + 2 * vitals.diastolicBpMmHg) / 3)})
              </span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              HR {vitals.heartRateBpm} bpm &bull; SpO2 {vitals.oxygenSaturationPct}%
            </div>
          </div>

          {/* Card 4: Reflexes & Respiratory Safety */}
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
            <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              Reflexes &amp; Respiration
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span
                className={`text-2xl font-black font-mono ${
                  vitals.patellarReflexGrade === 0
                    ? 'text-purple-400'
                    : vitals.patellarReflexGrade >= 3
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                Reflex +{vitals.patellarReflexGrade}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                &bull; RR {vitals.respiratoryRateBpm}/min
              </span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Urine Output: {vitals.urineOutputMlHr} mL/hr {vitals.urineOutputMlHr < 30 ? '(Oliguric)' : ''}
            </div>
          </div>
        </div>
      </header>

      {/* Main Tabs Navigation */}
      <main className="max-w-7xl mx-auto">
        <div className="flex border-b border-slate-800 mb-6 gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('criteria')}
            className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-t-lg transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'criteria'
                ? 'bg-slate-900 text-rose-400 border-t-2 border-rose-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            1. Diagnostic Criteria &amp; Severe Features
          </button>
          <button
            onClick={() => setActiveTab('mgso4_kinetics')}
            className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-t-lg transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'mgso4_kinetics'
                ? 'bg-slate-900 text-rose-400 border-t-2 border-rose-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Droplets className="w-4 h-4" />
            2. Zuspan MgSO4 Loading &amp; Infusion
          </button>
          <button
            onClick={() => setActiveTab('toxicity_antidote')}
            className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-t-lg transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'toxicity_antidote'
                ? 'bg-slate-900 text-rose-400 border-t-2 border-rose-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            3. Toxicity Cascades &amp; Calcium Antidote
          </button>
          <button
            onClick={() => setActiveTab('antihypertensives')}
            className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-t-lg transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'antihypertensives'
                ? 'bg-slate-900 text-rose-400 border-t-2 border-rose-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Pill className="w-4 h-4" />
            4. Emergent Antihypertensive Cascade
          </button>
          <button
            onClick={() => setActiveTab('delivery')}
            className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-t-lg transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'delivery'
                ? 'bg-slate-900 text-rose-400 border-t-2 border-rose-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Baby className="w-4 h-4" />
            5. Obstetric Delivery &amp; HELLP Planning
          </button>
        </div>

        {/* TAB 1: DIAGNOSTIC CRITERIA */}
        {activeTab === 'criteria' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4 bg-slate-900/60 border border-slate-800 p-5 rounded-xl">
              <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-rose-400" />
                Maternal Bedside Exam &amp; Laboratory Parameters
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {/* Systolic BP */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Systolic Blood Pressure</span>
                    <span className={`font-mono font-bold ${vitals.systolicBpMmHg >= 160 ? 'text-rose-400' : 'text-slate-200'}`}>
                      {vitals.systolicBpMmHg} mmHg
                    </span>
                  </div>
                  <input
                    type="range"
                    min="110"
                    max="220"
                    step="2"
                    value={vitals.systolicBpMmHg}
                    onChange={(e) =>
                      setVitals({ ...vitals, systolicBpMmHg: parseInt(e.target.value, 10) })
                    }
                    className="w-full accent-rose-500"
                  />
                  <span className="text-[10px] text-slate-400">&ge; 160 is severe range</span>
                </div>

                {/* Diastolic BP */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Diastolic Blood Pressure</span>
                    <span className={`font-mono font-bold ${vitals.diastolicBpMmHg >= 110 ? 'text-rose-400' : 'text-slate-200'}`}>
                      {vitals.diastolicBpMmHg} mmHg
                    </span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="140"
                    step="2"
                    value={vitals.diastolicBpMmHg}
                    onChange={(e) =>
                      setVitals({ ...vitals, diastolicBpMmHg: parseInt(e.target.value, 10) })
                    }
                    className="w-full accent-rose-500"
                  />
                  <span className="text-[10px] text-slate-400">&ge; 110 is severe range</span>
                </div>

                {/* Gestational Age */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Gestational Age</span>
                    <span className="font-mono font-bold text-sky-400">
                      {vitals.gestationalAgeWeeks.toFixed(1)} wks
                    </span>
                  </div>
                  <input
                    type="range"
                    min="18"
                    max="42"
                    step="0.5"
                    value={vitals.gestationalAgeWeeks}
                    onChange={(e) =>
                      setVitals({ ...vitals, gestationalAgeWeeks: parseFloat(e.target.value) })
                    }
                    className="w-full accent-sky-500"
                  />
                  <span className="text-[10px] text-slate-400">34 wks = severe threshold | 37 wks = term</span>
                </div>
              </div>

              {/* Labs Sliders */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
                {/* Platelets */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Platelet Count</span>
                    <span className={`font-mono font-bold ${labs.plateletCountPerUl < 100000 ? 'text-rose-400' : 'text-slate-200'}`}>
                      {labs.plateletCountPerUl.toLocaleString()} /µL
                    </span>
                  </div>
                  <input
                    type="range"
                    min="20000"
                    max="350000"
                    step="5000"
                    value={labs.plateletCountPerUl}
                    onChange={(e) =>
                      setLabs({ ...labs, plateletCountPerUl: parseInt(e.target.value, 10) })
                    }
                    className="w-full accent-purple-500"
                  />
                  <span className="text-[10px] text-slate-400">&lt; 100k severe | &lt; 50k neuraxial contraindication</span>
                </div>

                {/* AST */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">AST Transaminase</span>
                    <span className={`font-mono font-bold ${labs.astUperL >= 70 ? 'text-amber-400' : 'text-slate-200'}`}>
                      {labs.astUperL} U/L
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="600"
                    step="10"
                    value={labs.astUperL}
                    onChange={(e) =>
                      setLabs({ ...labs, astUperL: parseInt(e.target.value, 10) })
                    }
                    className="w-full accent-amber-500"
                  />
                  <span className="text-[10px] text-slate-400">&ge; 70 U/L (&ge; 2x ULN) is severe feature</span>
                </div>

                {/* Serum Creatinine */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Serum Creatinine</span>
                    <span className={`font-mono font-bold ${labs.serumCreatinineMgDl > 1.1 ? 'text-rose-400' : 'text-slate-200'}`}>
                      {labs.serumCreatinineMgDl} mg/dL
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.4"
                    max="3.0"
                    step="0.1"
                    value={labs.serumCreatinineMgDl}
                    onChange={(e) =>
                      setLabs({ ...labs, serumCreatinineMgDl: parseFloat(e.target.value) })
                    }
                    className="w-full accent-rose-500"
                  />
                  <span className="text-[10px] text-slate-400">&gt; 1.1 mg/dL = renal insufficiency</span>
                </div>
              </div>

              {/* Symptom Checkboxes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4 border-t border-slate-800 text-xs">
                <label className="flex items-center gap-2 p-3 bg-slate-900 rounded-lg border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={vitals.hasPersistentSevereHeadacheOrVisualChanges}
                    onChange={(e) =>
                      setVitals({ ...vitals, hasPersistentSevereHeadacheOrVisualChanges: e.target.checked })
                    }
                    className="rounded accent-rose-500"
                  />
                  <div>
                    <strong className="text-slate-200">Severe Unremitting Headache or Scotomata</strong>
                    <p className="text-[11px] text-slate-400">Cerebral vasospasm preceding eclamptic convulsions</p>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-3 bg-slate-900 rounded-lg border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={vitals.hasSevereEpigastricOrRuqPain}
                    onChange={(e) =>
                      setVitals({ ...vitals, hasSevereEpigastricOrRuqPain: e.target.checked })
                    }
                    className="rounded accent-rose-500"
                  />
                  <div>
                    <strong className="text-slate-200">RUQ / Epigastric Pain</strong>
                    <p className="text-[11px] text-slate-400">Hepatic capsular distension or subcapsular hematoma</p>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-3 bg-slate-900 rounded-lg border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={vitals.hasPulmonaryEdema}
                    onChange={(e) =>
                      setVitals({ ...vitals, hasPulmonaryEdema: e.target.checked })
                    }
                    className="rounded accent-rose-500"
                  />
                  <div>
                    <strong className="text-slate-200">Pulmonary Edema</strong>
                    <p className="text-[11px] text-slate-400">Increased systemic afterload and capillary leak</p>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-3 bg-slate-900 rounded-lg border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={vitals.hasActiveSeizure}
                    onChange={(e) =>
                      setVitals({ ...vitals, hasActiveSeizure: e.target.checked })
                    }
                    className="rounded accent-rose-500"
                  />
                  <div>
                    <strong className="text-rose-400">Active Convulsion / Seizure</strong>
                    <p className="text-[11px] text-slate-400">Diagnostic of Eclampsia</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Criteria Evaluation Card */}
            <div className="space-y-4">
              <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Severe Feature Criteria Met ({evaluation.severeFeatureCriteriaMet.length})
                </h3>
                {evaluation.severeFeatureCriteriaMet.length > 0 ? (
                  <ul className="space-y-2 text-xs text-rose-300">
                    {evaluation.severeFeatureCriteriaMet.map((c, i) => (
                      <li key={i} className="flex items-start gap-1.5 p-2 bg-rose-950/40 rounded border border-rose-900/50">
                        <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-3 bg-slate-900 rounded border border-slate-800 text-xs text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>No severe feature criteria met. Manage as non-severe disease.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ZUSPAN MGSO4 KINETICS */}
        {activeTab === 'mgso4_kinetics' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4 bg-slate-900/60 border border-slate-800 p-5 rounded-xl">
              <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2">
                <Droplets className="w-4 h-4 text-sky-400" />
                Zuspan Magnesium Sulfate Dosing &amp; Pharmacokinetics
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Loading Dose */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    IV Loading Dose (Over 15&ndash;20 min)
                  </label>
                  <div className="flex gap-2">
                    {[0, 4, 6].map((grams) => (
                      <button
                        key={grams}
                        onClick={() => setRegimen({ ...regimen, loadingDoseGrams: grams })}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                          regimen.loadingDoseGrams === grams
                            ? 'bg-purple-600 text-white'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {grams === 0 ? '0 g (None)' : `${grams} g IV Load`}
                      </button>
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400">
                    4g standard in severe preeclampsia; 6g preferred in eclampsia
                  </span>
                </div>

                {/* Maintenance Rate */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Continuous Maintenance Infusion</span>
                    <span className="font-mono font-bold text-purple-400">
                      {regimen.maintenanceRateGramsHr} g/hr
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="3"
                    step="0.5"
                    value={regimen.maintenanceRateGramsHr}
                    onChange={(e) =>
                      setRegimen({
                        ...regimen,
                        maintenanceRateGramsHr: parseFloat(e.target.value),
                      })
                    }
                    className="w-full accent-purple-500"
                  />
                  <span className="text-[10px] text-slate-400">
                    Standard rate: 1 to 2 g/hr; reduce to 1 g/hr in renal compromise
                  </span>
                </div>
              </div>

              {/* Infusion Hours & Urine Output */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Infusion Duration Elapsed</span>
                    <span className="font-mono font-bold text-slate-200">
                      {regimen.infusionHoursElapsed} hours
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="24"
                    step="1"
                    value={regimen.infusionHoursElapsed}
                    onChange={(e) =>
                      setRegimen({
                        ...regimen,
                        infusionHoursElapsed: parseInt(e.target.value, 10),
                      })
                    }
                    className="w-full accent-slate-400"
                  />
                  <span className="text-[10px] text-slate-400">
                    Continue through labor &amp; 24 hours postpartum
                  </span>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Urine Output Rate (Renal Elimination)</span>
                    <span className={`font-mono font-bold ${vitals.urineOutputMlHr < 30 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {vitals.urineOutputMlHr} mL/hr
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    step="5"
                    value={vitals.urineOutputMlHr}
                    onChange={(e) =>
                      setVitals({ ...vitals, urineOutputMlHr: parseInt(e.target.value, 10) })
                    }
                    className="w-full accent-cyan-500"
                  />
                  <span className="text-[10px] text-slate-400">
                    &lt; 30 mL/hr = severe risk of rapid magnesium accumulation!
                  </span>
                </div>
              </div>

              {/* Protocol Guidance Box */}
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase">
                  ACOG Magnesium Sulfate Protocol Guidance
                </span>
                <p className="text-xs text-purple-200 leading-relaxed">
                  {evaluation.mgso4IndicationRecommendation}
                </p>
              </div>
            </div>

            {/* Pharmacokinetic Windows Card */}
            <div className="space-y-4">
              <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Magnesium Concentration Windows
                </h3>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="p-2 bg-slate-900 rounded border border-slate-800">
                    <strong className="text-sky-400">1.7 &ndash; 2.4 mg/dL:</strong>
                    <span className="text-slate-400 block text-[11px]">Normal baseline non-pregnant level</span>
                  </div>
                  <div className="p-2 bg-emerald-950/40 rounded border border-emerald-900/50">
                    <strong className="text-emerald-400">4.8 &ndash; 8.4 mg/dL (2.0&ndash;3.5 mmol/L):</strong>
                    <span className="text-slate-300 block text-[11px]">Optimal therapeutic anticonvulsant window</span>
                  </div>
                  <div className="p-2 bg-amber-950/40 rounded border border-amber-900/50">
                    <strong className="text-amber-400">9.0 &ndash; 12.0 mg/dL:</strong>
                    <span className="text-slate-300 block text-[11px]">Loss of deep tendon reflexes (first sign of toxicity)</span>
                  </div>
                  <div className="p-2 bg-rose-950/40 rounded border border-rose-900/50">
                    <strong className="text-rose-400">12.0 &ndash; 15.0 mg/dL:</strong>
                    <span className="text-slate-300 block text-[11px]">Respiratory depression and hypoventilation</span>
                  </div>
                  <div className="p-2 bg-rose-950/80 rounded border border-rose-700">
                    <strong className="text-rose-300">&gt; 15.0 &ndash; 20.0 mg/dL:</strong>
                    <span className="text-slate-200 block text-[11px]">AV nodal block and asystolic cardiac arrest</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TOXICITY & CALCIUM ANTIDOTE */}
        {activeTab === 'toxicity_antidote' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4 bg-slate-900/60 border border-slate-800 p-5 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-slate-200">
                    Magnesium Toxicity Monitoring &amp; 10% Calcium Gluconate Antidote
                  </h2>
                  <p className="text-xs text-slate-400">
                    Hourly bedside physical assessment prevents catastrophic respiratory arrest and cardiac conduction blocks.
                  </p>
                </div>
                <button
                  onClick={handleAdministerCalcium}
                  className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Push 10% Calcium Gluconate
                </button>
              </div>

              {/* Physical Exam Sliders */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Patellar Reflex Grade */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Patellar Deep Tendon Reflex</span>
                    <span className={`font-mono font-bold ${vitals.patellarReflexGrade === 0 ? 'text-purple-400' : 'text-slate-200'}`}>
                      Grade +{vitals.patellarReflexGrade}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {([0, 1, 2, 3, 4] as const).map((grade) => (
                      <button
                        key={grade}
                        onClick={() => setVitals({ ...vitals, patellarReflexGrade: grade })}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                          vitals.patellarReflexGrade === grade
                            ? grade === 0
                              ? 'bg-purple-600 text-white'
                              : 'bg-indigo-600 text-white'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        +{grade}
                      </button>
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400">
                    0 = Absent (toxicity warning) | 1 = Hypo | 2 = Normal | 3 = Hyper | 4 = Clonus
                  </span>
                </div>

                {/* Respiratory Rate */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Respiratory Rate (Breaths/min)</span>
                    <span className={`font-mono font-bold ${vitals.respiratoryRateBpm < 12 ? 'text-rose-400' : 'text-slate-200'}`}>
                      {vitals.respiratoryRateBpm} bpm
                    </span>
                  </div>
                  <input
                    type="range"
                    min="6"
                    max="30"
                    step="1"
                    value={vitals.respiratoryRateBpm}
                    onChange={(e) =>
                      setVitals({ ...vitals, respiratoryRateBpm: parseInt(e.target.value, 10) })
                    }
                    className="w-full accent-rose-500"
                  />
                  <span className="text-[10px] text-slate-400">
                    &lt; 12 breaths/min = severe respiratory depression
                  </span>
                </div>
              </div>

              {/* Antidote Protocol Box */}
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase">
                  Antidote Administration Protocol
                </span>
                <p className="text-xs text-purple-300 leading-relaxed">
                  <strong>10% Calcium Gluconate:</strong> 1 g (10 mL of 10% solution) IV given slowly over 3 to 5 minutes. Calcium competitively antagonizes the motor endplate blocking action of hypermagnesemia. Repeat every 10&ndash;15 minutes if respiratory depression persists.
                </p>
              </div>
            </div>

            {/* Bedside Safety Triad Card */}
            <div className="space-y-4">
              <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Hourly Bedside Safety Triad
                </h3>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="p-2.5 bg-slate-900 rounded border border-slate-800">
                    <strong className="text-indigo-300">1. Patellar Reflexes Present:</strong>
                    <p className="text-[11px] text-slate-400">Loss of reflexes reliably precedes respiratory depression. Never give maintenance if reflexes are absent!</p>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded border border-slate-800">
                    <strong className="text-indigo-300">2. Respiratory Rate &ge; 12 bpm:</strong>
                    <p className="text-[11px] text-slate-400">Early hypoventilation requires immediate cessation of infusion and calcium prep.</p>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded border border-slate-800">
                    <strong className="text-indigo-300">3. Urine Output &ge; 30 mL/hr:</strong>
                    <p className="text-[11px] text-slate-400">Foley catheter mandatory. Oliguria causes rapid toxic accumulation.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ANTIHYPERTENSIVES */}
        {activeTab === 'antihypertensives' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4 bg-slate-900/60 border border-slate-800 p-5 rounded-xl">
              <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2">
                <Pill className="w-4 h-4 text-rose-400" />
                ACOG Emergent Antihypertensive Algorithms
              </h2>
              <p className="text-xs text-slate-400">
                Target blood pressure reduction to 140&ndash;150 / 90&ndash;100 mmHg within 30 to 60 minutes. Avoid dropping DBP below 80 mmHg to maintain placental perfusion.
              </p>

              {/* Drug Selection Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <button
                  onClick={() => {
                    setRegimen({
                      ...regimen,
                      antihypertensiveSelected: 'LABETALOL_IV',
                      antihypertensiveDoseGiven: 'Labetalol 20 mg IV push',
                    });
                    setVitals((prev) => ({
                      ...prev,
                      systolicBpMmHg: Math.max(138, prev.systolicBpMmHg - 22),
                      diastolicBpMmHg: Math.max(86, prev.diastolicBpMmHg - 16),
                    }));
                  }}
                  className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-sky-500 rounded-xl text-left transition"
                >
                  <strong className="text-sky-400 block text-xs">IV Labetalol (1st Line)</strong>
                  <span className="text-[11px] text-slate-400 block mt-1">20 mg IV over 2 min. If still severe at 10 min: 40 mg, then 80 mg (max 220 mg).</span>
                </button>

                <button
                  onClick={() => {
                    setRegimen({
                      ...regimen,
                      antihypertensiveSelected: 'HYDRALAZINE_IV',
                      antihypertensiveDoseGiven: 'Hydralazine 10 mg IV push',
                    });
                    setVitals((prev) => ({
                      ...prev,
                      systolicBpMmHg: Math.max(135, prev.systolicBpMmHg - 26),
                      diastolicBpMmHg: Math.max(84, prev.diastolicBpMmHg - 18),
                      heartRateBpm: prev.heartRateBpm + 10,
                    }));
                  }}
                  className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500 rounded-xl text-left transition"
                >
                  <strong className="text-amber-400 block text-xs">IV Hydralazine</strong>
                  <span className="text-[11px] text-slate-400 block mt-1">5&ndash;10 mg IV over 2 min. Re-check BP in 20 min. Watch for reflex tachycardia.</span>
                </button>

                <button
                  onClick={() => {
                    setRegimen({
                      ...regimen,
                      antihypertensiveSelected: 'NIFEDIPINE_ORAL',
                      antihypertensiveDoseGiven: 'Nifedipine 10 mg PO',
                    });
                    setVitals((prev) => ({
                      ...prev,
                      systolicBpMmHg: Math.max(140, prev.systolicBpMmHg - 20),
                      diastolicBpMmHg: Math.max(88, prev.diastolicBpMmHg - 14),
                    }));
                  }}
                  className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500 rounded-xl text-left transition"
                >
                  <strong className="text-emerald-400 block text-xs">Oral Nifedipine (IR)</strong>
                  <span className="text-[11px] text-slate-400 block mt-1">10&ndash;20 mg PO capsule. If still severe at 20 min: 20 mg PO. Avoid sublingual.</span>
                </button>
              </div>

              {/* Recommendation Box */}
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase">
                  Antihypertensive Strategy Guidance
                </span>
                <p className="text-xs text-rose-200 leading-relaxed">
                  {evaluation.antihypertensiveRecommendation}
                </p>
              </div>
            </div>

            {/* Contraindications Card */}
            <div className="space-y-4">
              <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Drug Contraindications
                </h3>
                <div className="space-y-2 text-xs text-slate-300">
                  <p className="text-[11px] text-slate-400">
                    &bull; <strong>Labetalol:</strong> Avoid in severe asthma, heart block, or bradycardia (HR &lt; 60).
                  </p>
                  <p className="text-[11px] text-slate-400">
                    &bull; <strong>Hydralazine:</strong> Can cause sudden profound hypotension, reflex tachycardia, and fetal heart decelerations.
                  </p>
                  <p className="text-[11px] text-slate-400">
                    &bull; <strong>ACE-I / ARBs:</strong> Strictly contraindicated in pregnancy due to fetopathy and renal agenesis.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: OBSTETRIC DELIVERY & HELLP */}
        {activeTab === 'delivery' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4 bg-slate-900/60 border border-slate-800 p-5 rounded-xl">
              <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2">
                <Baby className="w-4 h-4 text-emerald-400" />
                Delivery Timing &amp; HELLP Syndrome Management
              </h2>

              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase">
                  ACOG Delivery Timing Recommendation
                </span>
                <p className="text-xs text-emerald-300 leading-relaxed">
                  {evaluation.deliveryTimingRecommendation}
                </p>
              </div>

              {/* HELLP Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                  <strong className="text-purple-400">HELLP Syndrome Triad</strong>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    H = Hemolysis (LDH &ge; 600 U/L, schistocytes) &bull; EL = Elevated Liver Enzymes (AST/ALT &ge; 70) &bull; LP = Low Platelets (&lt; 100,000 /µL).
                  </p>
                </div>

                <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                  <strong className="text-rose-400">Anesthetic Considerations</strong>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Spinal/epidural neuraxial block is contraindicated if platelet count &lt; 50,000 to 70,000 /µL due to risk of spinal epidural hematoma. General anesthesia with rapid sequence induction required.
                  </p>
                </div>
              </div>
            </div>

            {/* Gestational Age Milestones Card */}
            <div className="space-y-4">
              <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Gestational Age Thresholds
                </h3>
                <div className="space-y-2 text-xs text-slate-300">
                  <div>&bull; <strong>&ge; 37.0 wks:</strong> Deliver for any preeclampsia or gestational HTN.</div>
                  <div>&bull; <strong>&ge; 34.0 wks:</strong> Deliver for preeclampsia with severe features.</div>
                  <div>&bull; <strong>&lt; 34.0 wks:</strong> Betamethasone 12 mg IM q24h &times; 2 doses for lung maturity if stable.</div>
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
