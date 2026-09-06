'use client';

import React, { useState, useMemo } from 'react';
import {
  Activity,
  RotateCcw,
  FileText,
  Sparkles,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Info,
  Droplets,
  Heart,
  Zap,
  Gauge,
  Sliders,
  Syringe,
  Layers,
  Flame,
  Scale,
  Stethoscope,
  Pill,
} from 'lucide-react';
import {
  computeCirrhosisState,
  CIRRHOSIS_PRESETS,
  CirrhosisInputParams,
  CirrhosisPresetId,
  CirrhosisDecompensationState,
  EncephalopathyGrade,
  AscitesSeverity,
} from '@/.gemini/skills/CirrhosisPortalHypertensionEngine';

const PRESET_KEYS: CirrhosisPresetId[] = [
  'COMPENSATED_CIRRHOSIS_CHILD_A',
  'ACUTE_VARICEAL_HEMORRHAGE_CSPH',
  'DECOMPENSATED_ASCITES_SBP_PERITONITIS',
  'SEVERE_ALCOHOLIC_HEPATITIS_MADDREY_HIGH',
  'HEPATORENAL_SYNDROME_TYPE_1_HRS_AKI',
  'OVERT_HEPATIC_ENCEPHALOPATHY_GRADE_3',
  'POST_TIPS_SHUNT_DYSFUNCTION',
  'END_STAGE_CIRRHOSIS_TRANSPLANT_PRIORITY',
];

export default function CirrhosisPortalHypertensionSimulator() {
  const [selectedPreset, setSelectedPreset] = useState<CirrhosisPresetId>(
    'COMPENSATED_CIRRHOSIS_CHILD_A'
  );
  const [params, setParams] = useState<CirrhosisInputParams>(
    () => CIRRHOSIS_PRESETS.COMPENSATED_CIRRHOSIS_CHILD_A.initialState
  );
  const [activeTab, setActiveTab] = useState<
    'meldChildPugh' | 'portalHemodynamics' | 'paracentesisSaag' | 'acuteDecompensation'
  >('meldChildPugh');
  const [reportExported, setReportExported] = useState(false);

  // Compute live hepatology state
  const state: CirrhosisDecompensationState = useMemo(() => {
    return computeCirrhosisState(params);
  }, [params]);

  // Load Preset
  const handleSelectPreset = (presetId: CirrhosisPresetId) => {
    setSelectedPreset(presetId);
    setParams(CIRRHOSIS_PRESETS[presetId].initialState);
  };

  // Reset
  const handleReset = () => {
    handleSelectPreset('COMPENSATED_CIRRHOSIS_CHILD_A');
    setReportExported(false);
  };

  // Export Report
  const handleExportReport = () => {
    setReportExported(true);
    setTimeout(() => setReportExported(false), 3000);
  };

  // Color helper for MELD-Na
  const getMeldColor = (meld: number) => {
    if (meld >= 30) return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
    if (meld >= 20) return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    if (meld >= 12) return 'bg-sky-500/20 text-sky-300 border-sky-500/40';
    return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
                <Stethoscope className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold tracking-tight bg-gradient-to-r from-amber-300 via-orange-300 to-rose-300 bg-clip-text text-transparent">
                  Hepatology, Cirrhosis Decompensation &amp; Portal Hemodynamics
                </h1>
                <p className="text-xs lg:text-sm text-slate-400 mt-1">
                  UNOS MELD-Na (2016) &bull; Child-Turcotte-Pugh (CTP) &bull; Maddrey DF &bull; HVPG Gradient &bull; SAAG &amp; SBP Paracentesis &bull; HRS-AKI
                </p>
              </div>
            </div>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className={`px-4 py-2 rounded-xl border font-mono text-center ${getMeldColor(state.meldNaScore)}`}>
              <div className="text-[10px] uppercase font-sans tracking-wider opacity-80">MELD-Na Score</div>
              <div className="text-2xl font-bold flex items-center justify-center gap-1.5">
                <span>{state.meldNaScore}</span>
                <span className="text-xs font-normal">({state.predicted90DayMortalityPct}% 90d Mort.)</span>
              </div>
            </div>

            <div className="px-4 py-2 rounded-xl border border-slate-800 bg-slate-900/80 font-mono text-center">
              <div className="text-[10px] uppercase font-sans tracking-wider text-slate-400">Child-Pugh Class</div>
              <div className="text-2xl font-bold text-amber-300">
                {state.childPughClass.replace(/_/g, ' ')} ({state.childPughScore} pts)
              </div>
            </div>

            <button
              onClick={handleExportReport}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition shadow-sm"
              title="Export Hepatology Consultation Record"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>{reportExported ? 'Consult Logged!' : 'Export Record'}</span>
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition shadow-sm"
              title="Reset to Compensated Cirrhosis Baseline"
            >
              <RotateCcw className="w-4 h-4 text-sky-400" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* 8 Preset Buttons Grid */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Cirrhosis Phenotypes &amp; Acute Decompensations
            </span>
            <span className="text-[11px] text-slate-500">8 Validated Clinical Scenarios</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {PRESET_KEYS.map((key) => {
              const preset = CIRRHOSIS_PRESETS[key];
              const isSelected = selectedPreset === key;
              return (
                <button
                  key={key}
                  onClick={() => handleSelectPreset(key)}
                  className={`p-2.5 rounded-xl text-left border transition-all flex flex-col justify-between h-20 ${
                    isSelected
                      ? 'bg-amber-950/60 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="text-xs font-medium leading-snug line-clamp-2">{preset.title.split('(')[0]}</div>
                  <div className="text-[10px] text-slate-500 truncate">
                    {key === 'COMPENSATED_CIRRHOSIS_CHILD_A'
                      ? 'Compensated Child A'
                      : key === 'ACUTE_VARICEAL_HEMORRHAGE_CSPH'
                      ? 'Variceal Bleed'
                      : key === 'DECOMPENSATED_ASCITES_SBP_PERITONITIS'
                      ? 'SBP Peritonitis'
                      : key === 'SEVERE_ALCOHOLIC_HEPATITIS_MADDREY_HIGH'
                      ? 'Severe Alc Hepatitis'
                      : key === 'HEPATORENAL_SYNDROME_TYPE_1_HRS_AKI'
                      ? 'HRS-AKI Type 1'
                      : key === 'OVERT_HEPATIC_ENCEPHALOPATHY_GRADE_3'
                      ? 'Hepatic Enceph'
                      : key === 'POST_TIPS_SHUNT_DYSFUNCTION'
                      ? 'TIPS Dysfunction'
                      : 'Transplant Priority'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Alarms and Clinical Guidance Banner */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-4 bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                Decompensation Alerts
              </span>
              <span className="text-[11px] font-mono text-slate-500">{state.activeAlarms.length} Active</span>
            </div>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {state.activeAlarms.map((alarm, idx) => (
                <div
                  key={idx}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono border flex items-center gap-2 ${
                    alarm.includes('PERITONITIS') || alarm.includes('HEPATORENAL') || alarm.includes('VARICEAL') || alarm.includes('TRANSPLANT')
                      ? 'bg-rose-950/40 border-rose-800/60 text-rose-300'
                      : alarm.includes('ALCOHOLIC') || alarm.includes('ENCEPHALOPATHY')
                      ? 'bg-amber-950/40 border-amber-800/60 text-amber-300'
                      : 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{alarm.replace(/_/g, ' ')}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-8 bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-400" />
                Hepatology Clinical Guidance
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                HVPG: {state.hepaticVenousPressureGradientMmhg} mmHg &bull; SAAG: {state.serumAscitesAlbuminGradientGDl} g/dL &bull; CTP 1y Survival: {state.childPughOneYearSurvivalPct}%
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{state.clinicalGuidance}</p>
            <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-slate-400 border-t border-slate-800/60">
              <span className="bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700/50">
                MELD-Na: <strong className={state.meldNaScore >= 20 ? 'text-rose-400' : 'text-emerald-300'}>{state.meldNaScore}</strong>
              </span>
              <span className="bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700/50">
                Child-Pugh: <strong className="text-amber-300">{state.childPughClass.replace(/_/g, ' ')}</strong> ({state.childPughScore} pts)
              </span>
              <span className="bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700/50">
                CSPH: <strong className={state.isClinicallySignificantPortalHypertension ? 'text-rose-400' : 'text-slate-300'}>
                  {state.isClinicallySignificantPortalHypertension ? 'Present (>=10 mmHg)' : 'Absent'}
                </strong>
              </span>
              {state.maddreyDiscriminantFunction > 0 && (
                <span className="bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700/50">
                  Maddrey DF: <strong className={state.isSevereAlcoholicHepatitis ? 'text-rose-400' : 'text-slate-300'}>{state.maddreyDiscriminantFunction}</strong>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-800 flex gap-2">
          <button
            onClick={() => setActiveTab('meldChildPugh')}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 transition flex items-center gap-2 ${
              activeTab === 'meldChildPugh'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            MELD-Na &amp; Child-Pugh Decompensation
          </button>
          <button
            onClick={() => setActiveTab('portalHemodynamics')}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 transition flex items-center gap-2 ${
              activeTab === 'portalHemodynamics'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Gauge className="w-4 h-4" />
            HVPG &amp; Variceal Hemodynamics
          </button>
          <button
            onClick={() => setActiveTab('paracentesisSaag')}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 transition flex items-center gap-2 ${
              activeTab === 'paracentesisSaag'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Droplets className="w-4 h-4" />
            Diagnostic Paracentesis, SAAG &amp; SBP
          </button>
          <button
            onClick={() => setActiveTab('acuteDecompensation')}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 transition flex items-center gap-2 ${
              activeTab === 'acuteDecompensation'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            Severe Alcoholic Hepatitis &amp; HRS-AKI
          </button>
        </div>

        {/* TAB 1: MELD-Na & Child-Pugh Decompensation */}
        {activeTab === 'meldChildPugh' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Liver Biomarkers Sliders */}
            <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-sm font-semibold flex items-center gap-2 text-slate-200">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  MELD-Na &amp; Laboratory Predictors
                </span>
                <span className="text-xs font-mono text-slate-400">UNOS / OPTN 2016</span>
              </div>

              {/* Total Bilirubin Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Total Bilirubin</span>
                  <span className="font-mono text-amber-300 font-bold">{params.biomarkers.totalBilirubinMgDl} mg/dL</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="30.0"
                  step="0.2"
                  value={params.biomarkers.totalBilirubinMgDl}
                  onChange={(e) =>
                    setParams((prev) => ({
                      ...prev,
                      biomarkers: { ...prev.biomarkers, totalBilirubinMgDl: parseFloat(e.target.value) },
                    }))
                  }
                  className="w-full accent-amber-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>

              {/* Serum Creatinine Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Serum Creatinine</span>
                  <span className="font-mono text-rose-300 font-bold">{params.biomarkers.serumCreatinineMgDl} mg/dL</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="6.0"
                  step="0.1"
                  value={params.biomarkers.serumCreatinineMgDl}
                  onChange={(e) =>
                    setParams((prev) => ({
                      ...prev,
                      biomarkers: { ...prev.biomarkers, serumCreatinineMgDl: parseFloat(e.target.value) },
                    }))
                  }
                  className="w-full accent-rose-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={params.biomarkers.onDialysisTwiceInPastWeek}
                      onChange={(e) =>
                        setParams((prev) => ({
                          ...prev,
                          biomarkers: { ...prev.biomarkers, onDialysisTwiceInPastWeek: e.target.checked },
                        }))
                      }
                      className="accent-rose-500 w-3.5 h-3.5"
                    />
                    <span>Dialysis &ge;2x in past 7 days (caps Cr to 4.0)</span>
                  </label>
                </div>
              </div>

              {/* INR Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">INR (Prothrombin Time)</span>
                  <span className="font-mono text-indigo-300 font-bold">{params.biomarkers.inr}</span>
                </div>
                <input
                  type="range"
                  min="0.9"
                  max="4.0"
                  step="0.1"
                  value={params.biomarkers.inr}
                  onChange={(e) =>
                    setParams((prev) => ({
                      ...prev,
                      biomarkers: { ...prev.biomarkers, inr: parseFloat(e.target.value) },
                    }))
                  }
                  className="w-full accent-indigo-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>

              {/* Serum Sodium Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Serum Sodium</span>
                  <span className="font-mono text-cyan-300 font-bold">{params.biomarkers.serumSodiumMeqL} mEq/L</span>
                </div>
                <input
                  type="range"
                  min="115"
                  max="145"
                  step="1"
                  value={params.biomarkers.serumSodiumMeqL}
                  onChange={(e) =>
                    setParams((prev) => ({
                      ...prev,
                      biomarkers: { ...prev.biomarkers, serumSodiumMeqL: parseInt(e.target.value) },
                    }))
                  }
                  className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
                <div className="text-[10px] text-slate-500">MELD-Na formula adjusts for sodium between 125 and 137 mEq/L.</div>
              </div>

              {/* Serum Albumin Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Serum Albumin</span>
                  <span className="font-mono text-emerald-300 font-bold">{params.biomarkers.serumAlbuminGDl} g/dL</span>
                </div>
                <input
                  type="range"
                  min="1.5"
                  max="5.0"
                  step="0.1"
                  value={params.biomarkers.serumAlbuminGDl}
                  onChange={(e) =>
                    setParams((prev) => ({
                      ...prev,
                      biomarkers: { ...prev.biomarkers, serumAlbuminGDl: parseFloat(e.target.value) },
                    }))
                  }
                  className="w-full accent-emerald-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Child-Pugh Clinical Assessment & MELD Matrix */}
            <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-sm font-semibold flex items-center gap-2 text-slate-200">
                  <Layers className="w-4 h-4 text-orange-400" />
                  Child-Turcotte-Pugh (CTP) Clinical Staging
                </span>
                <span className="text-xs font-mono text-amber-300">{state.childPughClass}</span>
              </div>

              {/* Ascites Toggle */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Ascites Staging</label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {(
                    [
                      { id: 'NONE', label: 'None (1 pt)' },
                      { id: 'MILD_CONTROLLED', label: 'Mild / Controlled (2 pts)' },
                      { id: 'MODERATE_SEVERE_REFRACTORY', label: 'Moderate / Refractory (3 pts)' },
                    ] as { id: AscitesSeverity; label: string }[]
                  ).map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setParams((prev) => ({ ...prev, ascites: item.id }))}
                      className={`p-2 rounded-lg border text-center transition ${
                        params.ascites === item.id
                          ? 'bg-amber-950/70 border-amber-500 text-white font-medium'
                          : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hepatic Encephalopathy Toggle */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Hepatic Encephalopathy (West Haven)</label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {(
                    [
                      { id: 'NONE', label: 'None (1 pt)' },
                      { id: 'GRADE_1_2', label: 'Grade 1-2 (2 pts)' },
                      { id: 'GRADE_3_4', label: 'Grade 3-4 (3 pts)' },
                    ] as { id: EncephalopathyGrade; label: string }[]
                  ).map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setParams((prev) => ({ ...prev, encephalopathy: item.id }))}
                      className={`p-2 rounded-lg border text-center transition ${
                        params.encephalopathy === item.id
                          ? 'bg-amber-950/70 border-amber-500 text-white font-medium'
                          : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Score Display Cards */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1 text-center">
                  <div className="text-xs text-slate-400">UNOS MELD-Na (2016)</div>
                  <div className="text-3xl font-bold font-mono text-amber-300">{state.meldNaScore}</div>
                  <div className="text-[11px] text-slate-500">
                    Predicted 90d Waitlist Mort: <strong>{state.predicted90DayMortalityPct}%</strong>
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1 text-center">
                  <div className="text-xs text-slate-400">Child-Turcotte-Pugh</div>
                  <div className="text-3xl font-bold font-mono text-orange-300">{state.childPughScore} <span className="text-sm font-normal">pts</span></div>
                  <div className="text-[11px] text-slate-500">
                    1-Yr Survival: <strong>{state.childPughOneYearSurvivalPct}%</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: HVPG & Variceal Hemodynamics */}
        {activeTab === 'portalHemodynamics' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-sm font-semibold flex items-center gap-2 text-slate-200">
                  <Gauge className="w-4 h-4 text-amber-400" />
                  Hepatic Venous Pressure Measurements
                </span>
                <span className="text-xs font-mono text-slate-400">Transjugular HVPG</span>
              </div>

              {/* Wedged Pressure (WHVP) */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Wedged Hepatic Venous Pressure (WHVP)</span>
                  <span className="font-mono text-rose-300 font-bold">{params.hemodynamics.wedgedHepaticVenousPressureMmhg} mmHg</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="35"
                  value={params.hemodynamics.wedgedHepaticVenousPressureMmhg}
                  onChange={(e) =>
                    setParams((prev) => ({
                      ...prev,
                      hemodynamics: { ...prev.hemodynamics, wedgedHepaticVenousPressureMmhg: parseInt(e.target.value) },
                    }))
                  }
                  className="w-full accent-rose-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>

              {/* Free Pressure (FHVP) */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Free Hepatic Venous Pressure (FHVP)</span>
                  <span className="font-mono text-sky-300 font-bold">{params.hemodynamics.freeHepaticVenousPressureMmhg} mmHg</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="12"
                  value={params.hemodynamics.freeHepaticVenousPressureMmhg}
                  onChange={(e) =>
                    setParams((prev) => ({
                      ...prev,
                      hemodynamics: { ...prev.hemodynamics, freeHepaticVenousPressureMmhg: parseInt(e.target.value) },
                    }))
                  }
                  className="w-full accent-sky-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>

              {/* Variceal Status Toggle */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <label className="text-xs font-medium text-slate-300">Endoscopic Variceal Classification</label>
                <div className="grid grid-cols-3 gap-1.5 text-xs">
                  {[
                    { id: 'NONE', label: 'No Varices' },
                    { id: 'SMALL', label: 'Small (<5mm)' },
                    { id: 'LARGE_HIGH_RISK_WALE_MARKS', label: 'Large (Red Wale)' },
                  ].map((v) => (
                    <button
                      key={v.id}
                      onClick={() =>
                        setParams((prev) => ({
                          ...prev,
                          hemodynamics: {
                            ...prev.hemodynamics,
                            varicealSize: v.id as any,
                            hasGastroesophagealVarices: v.id !== 'NONE',
                          },
                        }))
                      }
                      className={`p-2 rounded-lg border text-center transition ${
                        params.hemodynamics.varicealSize === v.id
                          ? 'bg-rose-950/70 border-rose-500 text-white font-medium'
                          : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* HVPG Gradient Bar & Baveno VII Prophylaxis */}
            <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-200">
                  Hepatic Venous Pressure Gradient (HVPG = WHVP &minus; FHVP)
                </h3>
                <p className="text-xs text-slate-400">
                  Gold standard surrogate for sinusoidal portal pressure (Baveno VII consensus)
                </p>
              </div>

              {/* Giant HVPG Bar */}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Calculated HVPG Gradient
                  </span>
                  <span className={`text-3xl font-bold font-mono ${
                    state.hepaticVenousPressureGradientMmhg >= 12 ? 'text-rose-400' : state.hepaticVenousPressureGradientMmhg >= 10 ? 'text-amber-300' : 'text-emerald-300'
                  }`}>
                    {state.hepaticVenousPressureGradientMmhg} <span className="text-sm font-normal text-slate-400">mmHg</span>
                  </span>
                </div>

                <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden relative">
                  <div
                    className={`h-full transition-all duration-300 ${
                      state.hepaticVenousPressureGradientMmhg < 10
                        ? 'bg-emerald-500'
                        : state.hepaticVenousPressureGradientMmhg < 12
                        ? 'bg-amber-500'
                        : 'bg-rose-600 animate-pulse'
                    }`}
                    style={{ width: `${Math.min(100, (state.hepaticVenousPressureGradientMmhg / 25.0) * 100)}%` }}
                  ></div>
                  {/* Reference line at 10 mmHg (CSPH) */}
                  <div className="absolute top-0 bottom-0 w-0.5 bg-amber-400" style={{ left: '40%' }} title="10 mmHg CSPH"></div>
                  {/* Reference line at 12 mmHg (Bleed Threshold) */}
                  <div className="absolute top-0 bottom-0 w-0.5 bg-rose-400" style={{ left: '48%' }} title="12 mmHg Bleed Threshold"></div>
                </div>

                <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                  <span>1 - 5 (Normal)</span>
                  <span className="text-amber-400">&ge;10 (CSPH Varices)</span>
                  <span className="text-rose-400 font-bold">&ge;12 (Bleed Hazard)</span>
                  <span>25 mmHg</span>
                </div>
              </div>

              {/* Baveno VII Recommendations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <div className="font-semibold text-emerald-400">Primary Prophylaxis:</div>
                  <p className="text-slate-300">
                    Carvedilol (6.25 - 12.5 mg/day) reduces HVPG through &beta;1 and &alpha;1 adrenergic blockade. If intolerant, perform Endoscopic Variceal Ligation (EVL).
                  </p>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <div className="font-semibold text-rose-400">Acute Variceal Bleed:</div>
                  <p className="text-slate-300">
                    Vasoactive infusion (Octreotide 50 ug bolus + 50 ug/h), prophylactic Ceftriaxone 1g/day x 7d, restrictive transfusion (Hb target 7-8 g/dL), and urgent EBL within 12h.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Paracentesis, SAAG & SBP */}
        {activeTab === 'paracentesisSaag' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-sm font-semibold flex items-center gap-2 text-slate-200">
                  <Droplets className="w-4 h-4 text-sky-400" />
                  Diagnostic Paracentesis Laboratory Analysis
                </span>
                <span className="text-xs font-mono text-slate-400">Runge SAAG Concept</span>
              </div>

              {/* Ascitic Albumin Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Ascitic Fluid Albumin</span>
                  <span className="font-mono text-sky-300 font-bold">{params.paracentesis.asciticAlbuminGDl} g/dL</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="3.5"
                  step="0.1"
                  value={params.paracentesis.asciticAlbuminGDl}
                  onChange={(e) =>
                    setParams((prev) => ({
                      ...prev,
                      paracentesis: { ...prev.paracentesis, asciticAlbuminGDl: parseFloat(e.target.value), hasAscites: true },
                    }))
                  }
                  className="w-full accent-sky-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>

              {/* Ascitic PMN Count Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Ascitic Absolute Neutrophil Count (PMN)</span>
                  <span className={`font-mono font-bold ${params.paracentesis.asciticAbsolutePmnCountPerMm3 >= 250 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {params.paracentesis.asciticAbsolutePmnCountPerMm3} /mm&sup3;
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="1200"
                  step="20"
                  value={params.paracentesis.asciticAbsolutePmnCountPerMm3}
                  onChange={(e) =>
                    setParams((prev) => ({
                      ...prev,
                      paracentesis: { ...prev.paracentesis, asciticAbsolutePmnCountPerMm3: parseInt(e.target.value), hasAscites: true },
                    }))
                  }
                  className="w-full accent-rose-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
                <div className="text-[10px] text-slate-500">Threshold: &ge; 250 /mm&sup3; confirms Spontaneous Bacterial Peritonitis (SBP).</div>
              </div>
            </div>

            {/* SAAG & SBP Diagnostic Matrix */}
            <div className="lg:col-span-6 space-y-4">
              {/* SAAG Card */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-300">Serum-Ascites Albumin Gradient (SAAG)</span>
                  <span className="font-mono text-xl font-bold text-sky-300">{state.serumAscitesAlbuminGradientGDl} g/dL</span>
                </div>
                <div className="text-xs">
                  {state.isPortalHypertensiveAscites ? (
                    <span className="text-emerald-400 font-medium">
                      SAAG &ge; 1.1 g/dL: High Gradient confirmed (Portal Hypertension present - Cirrhosis, Cardiac ascites, Budd-Chiari).
                    </span>
                  ) : (
                    <span className="text-amber-400 font-medium">
                      SAAG &lt; 1.1 g/dL: Low Gradient (Non-portal hypertension etiology - Peritoneal carcinomatosis, TB peritonitis, Nephrotic syndrome).
                    </span>
                  )}
                </div>
              </div>

              {/* SBP Protocol Card */}
              <div className="bg-rose-950/30 border border-rose-800/50 rounded-xl p-5 space-y-2">
                <div className="text-xs font-semibold text-rose-300 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  Spontaneous Bacterial Peritonitis (SBP) Management
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  When ascitic PMN &ge; 250/mm&sup3;, initiate IV Cefotaxime 2g q8h or Ceftriaxone 2g q24h. Concomitant 20% IV Albumin (1.5 g/kg on Day 1, 1.0 g/kg on Day 3) reduces incidence of hepatorenal syndrome from 30% to 10% and significantly decreases in-hospital mortality.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Acute Decompensation & HRS-AKI */}
        {activeTab === 'acuteDecompensation' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Maddrey DF & Alcoholic Hepatitis */}
            <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-sm font-semibold flex items-center gap-2 text-slate-200">
                  <Flame className="w-4 h-4 text-rose-400" />
                  Maddrey&apos;s Discriminant Function (Alcoholic Hepatitis)
                </span>
                <span className="text-xs font-mono text-rose-400">Threshold &ge; 32</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-xs text-slate-300">Patient Prothrombin Time (PT)</span>
                  <input
                    type="number"
                    value={params.biomarkers.patientPtSeconds}
                    onChange={(e) =>
                      setParams((prev) => ({
                        ...prev,
                        biomarkers: { ...prev.biomarkers, patientPtSeconds: parseFloat(e.target.value) || 12 },
                      }))
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs font-mono text-amber-300"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-slate-300">Control PT (seconds)</span>
                  <input
                    type="number"
                    value={params.biomarkers.controlPtSeconds}
                    onChange={(e) =>
                      setParams((prev) => ({
                        ...prev,
                        biomarkers: { ...prev.biomarkers, controlPtSeconds: parseFloat(e.target.value) || 12 },
                      }))
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs font-mono text-slate-300"
                  />
                </div>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-400">Calculated Maddrey DF:</span>
                <span className={`font-mono text-lg font-bold ${state.isSevereAlcoholicHepatitis ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {state.maddreyDiscriminantFunction} {state.isSevereAlcoholicHepatitis ? '(Severe: Prednisolone Indicated)' : '(Non-Severe)'}
                </span>
              </div>
            </div>

            {/* Hepatorenal Syndrome Type 1 (HRS-AKI) */}
            <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-sm font-semibold flex items-center gap-2 text-slate-200">
                  <Heart className="w-4 h-4 text-indigo-400" />
                  Hepatorenal Syndrome (HRS-AKI) Protocol
                </span>
                <span className="text-xs font-mono text-indigo-300">ICA-AKI Criteria</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                HRS-AKI arises from extreme splanchnic arterial vasodilation, resulting in compensatory renal vasoconstriction and drop in GFR without intrinsic parenchymal kidney damage.
              </p>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="font-semibold text-slate-200">First-Line Medical Therapy:</div>
                <div className="space-y-1 text-slate-300">
                  <div>&bull; <strong>Terlipressin:</strong> 1 mg IV bolus every 4–6 hours (or continuous infusion 2 mg/day), titrating up to 2 mg every 4 hours if serum creatinine fails to decrease by 25%.</div>
                  <div>&bull; <strong>20% IV Albumin:</strong> 20–40 g/day to maintain intravascular volume.</div>
                  <div>&bull; <strong>Alternative:</strong> Norepinephrine continuous infusion + Albumin in ICU if Terlipressin is unavailable.</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
