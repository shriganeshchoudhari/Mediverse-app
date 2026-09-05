'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  evaluateAbg,
  evaluateCbc,
  evaluateElectrolytes,
  evaluateCoagulation,
  CLINICAL_LAB_PRESETS,
  ClinicalLabCasePreset,
  AbgInputParams,
  CbcInputParams,
  ElectrolyteInputParams,
  CoagInputParams,
} from '@/.gemini/skills/ClinicalLabInterpretationEngine';
import {
  Activity,
  FlaskConical,
  Microscope,
  Stethoscope,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Info,
  RotateCcw,
  HelpCircle,
  TrendingUp,
  Droplet,
  ChevronRight,
  ShieldAlert,
  Sliders,
  BookOpen,
} from 'lucide-react';

export type LabPanelType = 'ABG' | 'CBC' | 'CMP' | 'COAG';

export default function ClinicalLabInterpretationSimulator() {
  // Active Navigation Panel
  const [activePanel, setActivePanel] = useState<LabPanelType>('ABG');

  // Selected Preset
  const [selectedPresetId, setSelectedPresetId] = useState<string>('dka');
  const [showCaseVignette, setShowCaseVignette] = useState<boolean>(true);
  const [revealedRationale, setRevealedRationale] = useState<boolean>(false);

  // -------------------------------------------------------------
  // ABG State
  // -------------------------------------------------------------
  const [abgParams, setAbgParams] = useState<AbgInputParams>({
    pH: 7.15,
    paCO2: 20,
    hco3: 7,
    paO2: 98,
    fiO2: 0.21,
    na: 132,
    cl: 98,
    albumin: 4.0,
    patientAge: 24,
    atmosphericPressure: 760,
  });

  // -------------------------------------------------------------
  // CBC State
  // -------------------------------------------------------------
  const [cbcParams, setCbcParams] = useState<CbcInputParams>({
    hemoglobin: 7.2,
    hematocrit: 23,
    rbc: 3.1,
    mcv: 68,
    rdw: 19.8,
    wbc: 6.4,
    platelets: 510,
    reticulocytePercent: 0.8,
    patientSex: 'female',
  });

  // -------------------------------------------------------------
  // CMP State
  // -------------------------------------------------------------
  const [cmpParams, setCmpParams] = useState<ElectrolyteInputParams>({
    sodium: 132,
    potassium: 5.4,
    chloride: 98,
    bicarbonate: 7,
    bun: 42,
    creatinine: 1.8,
    glucose: 540,
    calcium: 9.0,
    albumin: 4.0,
    measuredOsmolality: 320,
  });

  // -------------------------------------------------------------
  // COAG State
  // -------------------------------------------------------------
  const [coagParams, setCoagParams] = useState<CoagInputParams>({
    pt: 12.2,
    inr: 1.0,
    aptt: 68.0,
    thrombinTime: 16.0,
    fibrinogen: 280,
    dDimer: 210,
    mixingStudyAptt: 29.0,
    ast: 22,
    alt: 18,
    alp: 110,
    ggt: 20,
    totalBilirubin: 0.7,
    directBilirubin: 0.2,
  });

  // Load Preset Case Handler
  const handleSelectPreset = useCallback((preset: ClinicalLabCasePreset) => {
    setSelectedPresetId(preset.id);
    setActivePanel(preset.panel);
    setRevealedRationale(false);

    if (preset.abgParams) setAbgParams((prev) => ({ ...prev, ...preset.abgParams }));
    if (preset.cbcParams) setCbcParams((prev) => ({ ...prev, ...preset.cbcParams }));
    if (preset.cmpParams) setCmpParams((prev) => ({ ...prev, ...preset.cmpParams }));
    if (preset.coagParams) setCoagParams((prev) => ({ ...prev, ...preset.coagParams }));
  }, []);

  // Computed Evaluations
  const abgResult = useMemo(() => evaluateAbg(abgParams), [abgParams]);
  const cbcResult = useMemo(() => evaluateCbc(cbcParams), [cbcParams]);
  const cmpResult = useMemo(() => evaluateElectrolytes(cmpParams), [cmpParams]);
  const coagResult = useMemo(() => evaluateCoagulation(coagParams), [coagParams]);

  // Current Active Preset
  const activePreset = useMemo(
    () => CLINICAL_LAB_PRESETS.find((p) => p.id === selectedPresetId) || CLINICAL_LAB_PRESETS[0],
    [selectedPresetId]
  );

  // Consult AI Context Bridge
  const handleConsultAI = useCallback(() => {
    let summary = '';
    if (activePanel === 'ABG') {
      summary = `ABG Analysis: pH ${abgParams.pH}, PaCO2 ${abgParams.paCO2} mmHg, HCO3 ${abgParams.hco3} mEq/L, Na ${abgParams.na}, Cl ${abgParams.cl}, Albumin ${abgParams.albumin}. Primary disorder: ${abgResult.primaryDisturbance}. Anion Gap: ${abgResult.correctedAnionGap} (${abgResult.anionGapStatus}). Compensation: ${abgResult.compensationStatus}. Delta-Delta: ${abgResult.deltaDeltaRatio ?? 'N/A'}.`;
    } else if (activePanel === 'CBC') {
      summary = `CBC Analysis: Hb ${cbcParams.hemoglobin} g/dL, Hct ${cbcParams.hematocrit}%, RBC ${cbcParams.rbc}, MCV ${cbcParams.mcv} fL, RDW ${cbcParams.rdw}%, WBC ${cbcParams.wbc}, Plt ${cbcParams.platelets}, Retic ${cbcParams.reticulocytePercent}%. Mentzer Index: ${cbcResult.mentzerIndex} (${cbcResult.mentzerInterpretation}). RPI: ${cbcResult.reticulocyteProductionIndex} (${cbcResult.rpiClassification}).`;
    } else if (activePanel === 'CMP') {
      summary = `CMP Analysis: Na ${cmpParams.sodium} (Corrected: ${cmpResult.correctedSodium}), K ${cmpParams.potassium}, Cl ${cmpParams.chloride}, HCO3 ${cmpParams.bicarbonate}, BUN ${cmpParams.bun}, Cr ${cmpParams.creatinine} (BUN/Cr: ${cmpResult.bunCreatinineRatio}), Glucose ${cmpParams.glucose}, Ca ${cmpParams.calcium} (Corrected: ${cmpResult.correctedCalcium}). Osmolar Gap: ${cmpResult.osmolarGap ?? 'N/A'}.`;
    } else {
      summary = `Coagulation & Liver Analysis: PT ${coagParams.pt}s (INR ${coagParams.inr}), aPTT ${coagParams.aptt}s (Mixing study: ${coagParams.mixingStudyAptt ?? 'Not tested'}s), Fibrinogen ${coagParams.fibrinogen}, D-Dimer ${coagParams.dDimer}. AST ${coagParams.ast}, ALT ${coagParams.alt} (De Ritis AST/ALT: ${coagResult.deRitisRatio}), ALP ${coagParams.alp}, GGT ${coagParams.ggt}, Bili ${coagParams.totalBilirubin}/${coagParams.directBilirubin}.`;
    }

    const context = `[Clinical Diagnostic Laboratory Solver - Panel: ${activePanel}]\nPatient Scenario: ${activePreset.title}\nVignette: ${activePreset.patientVignette}\nLab Findings: ${summary}\nPlease explain the pathophysiology, differential diagnosis, and next management steps.`;

    window.dispatchEvent(
      new CustomEvent('mediverse:open-ai-with-context', {
        detail: { context },
      })
    );
  }, [activePanel, abgParams, abgResult, cbcParams, cbcResult, cmpParams, cmpResult, coagParams, coagResult, activePreset]);

  // Reset to default panel values
  const handleResetPanel = useCallback(() => {
    if (activePanel === 'ABG') {
      setAbgParams({
        pH: 7.40,
        paCO2: 40,
        hco3: 24,
        paO2: 95,
        fiO2: 0.21,
        na: 140,
        cl: 104,
        albumin: 4.0,
        patientAge: 40,
        atmosphericPressure: 760,
      });
    } else if (activePanel === 'CBC') {
      setCbcParams({
        hemoglobin: 14.0,
        hematocrit: 42,
        rbc: 4.8,
        mcv: 90,
        rdw: 12.8,
        wbc: 7.0,
        platelets: 250,
        reticulocytePercent: 1.2,
        patientSex: 'female',
      });
    } else if (activePanel === 'CMP') {
      setCmpParams({
        sodium: 140,
        potassium: 4.2,
        chloride: 102,
        bicarbonate: 24,
        bun: 14,
        creatinine: 0.9,
        glucose: 90,
        calcium: 9.2,
        albumin: 4.0,
        measuredOsmolality: 290,
      });
    } else {
      setCoagParams({
        pt: 12.0,
        inr: 1.0,
        aptt: 28.0,
        thrombinTime: 15.0,
        fibrinogen: 300,
        dDimer: 150,
        mixingStudyAptt: null,
        ast: 22,
        alt: 20,
        alp: 80,
        ggt: 22,
        totalBilirubin: 0.8,
        directBilirubin: 0.2,
      });
    }
  }, [activePanel]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 text-slate-100">
      {/* ----------------- Top Header & Navigation ----------------- */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
                <FlaskConical className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                  Clinical Diagnostic Laboratory & Blood Gas Solver
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono">
                    Board Standard
                  </span>
                </h1>
                <p className="text-sm text-slate-400">
                  Step-by-step multi-disorder acid-base, anemia differentiation, electrolyte osmolar gap, and coagulation cascade analyzer.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleConsultAI}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold rounded-xl shadow-lg transition"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              Consult Socratic AI
            </button>
            <button
              onClick={handleResetPanel}
              className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium rounded-xl transition"
              title="Reset current panel to standard normal parameters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
        </div>

        {/* Panel Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-6 pt-5 border-t border-slate-800">
          <button
            onClick={() => setActivePanel('ABG')}
            className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-xs font-semibold transition ${
              activePanel === 'ABG'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-700/50'
            }`}
          >
            <Activity className="w-4 h-4" />
            ABG / VBG Blood Gas
          </button>
          <button
            onClick={() => setActivePanel('CBC')}
            className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-xs font-semibold transition ${
              activePanel === 'CBC'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-700/50'
            }`}
          >
            <Microscope className="w-4 h-4" />
            CBC & Anemia
          </button>
          <button
            onClick={() => setActivePanel('CMP')}
            className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-xs font-semibold transition ${
              activePanel === 'CMP'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-700/50'
            }`}
          >
            <Droplet className="w-4 h-4" />
            CMP & Electrolytes
          </button>
          <button
            onClick={() => setActivePanel('COAG')}
            className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-xs font-semibold transition ${
              activePanel === 'COAG'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-700/50'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            Coagulation & Liver
          </button>
        </div>
      </div>

      {/* ----------------- Clinical Case Presets Bar ----------------- */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Board-Style Clinical Scenarios & Presets
            </span>
          </div>
          <button
            onClick={() => setShowCaseVignette(!showCaseVignette)}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
          >
            {showCaseVignette ? 'Hide Case Details' : 'Show Case Details'}
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700">
          {CLINICAL_LAB_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition border ${
                selectedPresetId === preset.id
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-semibold'
                  : 'bg-slate-800/70 hover:bg-slate-800 border-slate-700/60 text-slate-400'
              }`}
            >
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950/80 mr-1.5 font-mono text-slate-400">
                {preset.panel}
              </span>
              {preset.title}
            </button>
          ))}
        </div>

        {/* Selected Preset Vignette Box */}
        {showCaseVignette && activePreset && (
          <div className="mt-3.5 p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Case: {activePreset.title}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setRevealedRationale(!revealedRationale)}
                  className="text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 rounded-lg transition"
                >
                  {revealedRationale ? 'Hide Clinical Teaching' : 'Reveal Expected Diagnosis'}
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{activePreset.patientVignette}</p>
            <div className="flex flex-wrap gap-2 pt-1">
              {activePreset.examClues.map((clue, idx) => (
                <span
                  key={idx}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800/90 border border-slate-700/60 text-slate-300 font-mono"
                >
                  🔍 {clue}
                </span>
              ))}
            </div>
            {revealedRationale && (
              <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 space-y-1.5 text-xs">
                <p className="font-semibold text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Expected Board Diagnosis: {activePreset.expectedDiagnosis}
                </p>
                <p className="text-slate-300 leading-relaxed">{activePreset.teachingExplanation}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ----------------- Main Lab Station Workspace ----------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Lab Parameter Sliders & Inputs (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              {activePanel === 'ABG' && 'Arterial Blood Gas Parameters'}
              {activePanel === 'CBC' && 'Complete Blood Count Parameters'}
              {activePanel === 'CMP' && 'Metabolic Panel & Electrolytes'}
              {activePanel === 'COAG' && 'Coagulation Cascade & Liver Tests'}
            </h2>
            <span className="text-[11px] text-slate-400 font-mono">Live Recalculation</span>
          </div>

          {/* 1. ABG INPUT CONTROLS */}
          {activePanel === 'ABG' && (
            <div className="space-y-4">
              {/* pH */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-200">Arterial pH</span>
                  <span className="font-mono font-bold text-emerald-400">{abgParams.pH.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="6.80"
                  max="7.80"
                  step="0.01"
                  value={abgParams.pH}
                  onChange={(e) => setAbgParams({ ...abgParams, pH: parseFloat(e.target.value) })}
                  className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>Acidemia (&lt; 7.35)</span>
                  <span className="text-slate-300 font-semibold">Normal 7.35 - 7.45</span>
                  <span>Alkalemia (&gt; 7.45)</span>
                </div>
              </div>

              {/* PaCO2 */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-200">PaCO2 (mmHg)</span>
                  <span className="font-mono font-bold text-emerald-400">{abgParams.paCO2} mmHg</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="1"
                  value={abgParams.paCO2}
                  onChange={(e) => setAbgParams({ ...abgParams, paCO2: parseInt(e.target.value) })}
                  className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>Hyperventilation (&lt; 35)</span>
                  <span>Normal 35 - 45</span>
                  <span>Hypoventilation (&gt; 45)</span>
                </div>
              </div>

              {/* HCO3 */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-200">Serum HCO3- (mEq/L)</span>
                  <span className="font-mono font-bold text-emerald-400">{abgParams.hco3} mEq/L</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="55"
                  step="1"
                  value={abgParams.hco3}
                  onChange={(e) => setAbgParams({ ...abgParams, hco3: parseInt(e.target.value) })}
                  className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>Low (&lt; 22)</span>
                  <span>Normal 22 - 26</span>
                  <span>High (&gt; 26)</span>
                </div>
              </div>

              {/* Electrolytes for Anion Gap */}
              <div className="grid grid-cols-3 gap-2.5 pt-2">
                <div>
                  <label className="text-[11px] text-slate-400">Na+ (mEq/L)</label>
                  <input
                    type="number"
                    value={abgParams.na ?? 140}
                    onChange={(e) => setAbgParams({ ...abgParams, na: parseFloat(e.target.value) || 140 })}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400">Cl- (mEq/L)</label>
                  <input
                    type="number"
                    value={abgParams.cl ?? 102}
                    onChange={(e) => setAbgParams({ ...abgParams, cl: parseFloat(e.target.value) || 102 })}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400">Albumin (g/dL)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={abgParams.albumin ?? 4.0}
                    onChange={(e) => setAbgParams({ ...abgParams, albumin: parseFloat(e.target.value) || 4.0 })}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-white"
                  />
                </div>
              </div>

              {/* Oxygenation */}
              <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-800">
                <div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-300">PaO2</span>
                    <span className="font-mono text-emerald-400">{abgParams.paO2} mmHg</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="300"
                    step="1"
                    value={abgParams.paO2 ?? 95}
                    onChange={(e) => setAbgParams({ ...abgParams, paO2: parseInt(e.target.value) })}
                    className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-300">FiO2</span>
                    <span className="font-mono text-emerald-400">{Math.round((abgParams.fiO2 ?? 0.21) * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.21"
                    max="1.00"
                    step="0.01"
                    value={abgParams.fiO2 ?? 0.21}
                    onChange={(e) => setAbgParams({ ...abgParams, fiO2: parseFloat(e.target.value) })}
                    className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                <span>Patient Age: {abgParams.patientAge} yrs</span>
                <input
                  type="range"
                  min="18"
                  max="90"
                  value={abgParams.patientAge ?? 40}
                  onChange={(e) => setAbgParams({ ...abgParams, patientAge: parseInt(e.target.value) })}
                  className="w-32 accent-emerald-500"
                />
              </div>
            </div>
          )}

          {/* 2. CBC INPUT CONTROLS */}
          {activePanel === 'CBC' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-300">Patient Sex:</span>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setCbcParams({ ...cbcParams, patientSex: 'female' })}
                    className={`px-3 py-1 rounded-md text-xs font-semibold ${
                      cbcParams.patientSex === 'female' ? 'bg-pink-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    Female
                  </button>
                  <button
                    onClick={() => setCbcParams({ ...cbcParams, patientSex: 'male' })}
                    className={`px-3 py-1 rounded-md text-xs font-semibold ${
                      cbcParams.patientSex === 'male' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    Male
                  </button>
                </div>
              </div>

              {/* Hemoglobin */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-200">Hemoglobin (Hb)</span>
                  <span className="font-mono font-bold text-emerald-400">{cbcParams.hemoglobin.toFixed(1)} g/dL</span>
                </div>
                <input
                  type="range"
                  min="3.0"
                  max="20.0"
                  step="0.1"
                  value={cbcParams.hemoglobin}
                  onChange={(e) => setCbcParams({ ...cbcParams, hemoglobin: parseFloat(e.target.value) })}
                  className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>Severe &lt; 8.0</span>
                  <span>Normal {cbcParams.patientSex === 'male' ? '13.5 - 17.5' : '12.0 - 16.0'}</span>
                  <span>Polycythemia</span>
                </div>
              </div>

              {/* Hematocrit & RBC */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">Hematocrit (%)</span>
                    <span className="font-mono text-emerald-400">{cbcParams.hematocrit}%</span>
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="60"
                    step="1"
                    value={cbcParams.hematocrit}
                    onChange={(e) => setCbcParams({ ...cbcParams, hematocrit: parseInt(e.target.value) })}
                    className="w-full accent-emerald-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">RBC (x10^6)</span>
                    <span className="font-mono text-emerald-400">{cbcParams.rbc.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="8.0"
                    step="0.1"
                    value={cbcParams.rbc}
                    onChange={(e) => setCbcParams({ ...cbcParams, rbc: parseFloat(e.target.value) })}
                    className="w-full accent-emerald-500"
                  />
                </div>
              </div>

              {/* MCV & RDW */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">MCV (fL)</span>
                    <span className="font-mono text-emerald-400">{cbcParams.mcv} fL</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="130"
                    step="1"
                    value={cbcParams.mcv}
                    onChange={(e) => setCbcParams({ ...cbcParams, mcv: parseInt(e.target.value) })}
                    className="w-full accent-emerald-500"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                    <span>&lt;80 Micro</span>
                    <span>80-100</span>
                    <span>&gt;100 Macro</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">RDW (%)</span>
                    <span className="font-mono text-emerald-400">{cbcParams.rdw.toFixed(1)}%</span>
                  </div>
                  <input
                    type="range"
                    min="10.0"
                    max="26.0"
                    step="0.1"
                    value={cbcParams.rdw}
                    onChange={(e) => setCbcParams({ ...cbcParams, rdw: parseFloat(e.target.value) })}
                    className="w-full accent-emerald-500"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                    <span>Uniform &lt;14.5</span>
                    <span>Anisocytosis &gt;14.5</span>
                  </div>
                </div>
              </div>

              {/* Reticulocyte % */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Reticulocyte Count (%)</span>
                  <span className="font-mono text-emerald-400">{cbcParams.reticulocytePercent?.toFixed(1) ?? '1.0'}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="20.0"
                  step="0.1"
                  value={cbcParams.reticulocytePercent ?? 1.0}
                  onChange={(e) => setCbcParams({ ...cbcParams, reticulocytePercent: parseFloat(e.target.value) })}
                  className="w-full accent-emerald-500"
                />
              </div>

              {/* WBC and Platelets */}
              <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-800">
                <div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">WBC (x10^3)</span>
                    <span className="font-mono text-emerald-400">{cbcParams.wbc.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="35.0"
                    step="0.1"
                    value={cbcParams.wbc}
                    onChange={(e) => setCbcParams({ ...cbcParams, wbc: parseFloat(e.target.value) })}
                    className="w-full accent-emerald-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">Platelets (x10^3)</span>
                    <span className="font-mono text-emerald-400">{cbcParams.platelets}</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="800"
                    step="5"
                    value={cbcParams.platelets}
                    onChange={(e) => setCbcParams({ ...cbcParams, platelets: parseInt(e.target.value) })}
                    className="w-full accent-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 3. CMP INPUT CONTROLS */}
          {activePanel === 'CMP' && (
            <div className="space-y-4">
              {/* Glucose */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-200">Serum Glucose (mg/dL)</span>
                  <span className="font-mono font-bold text-emerald-400">{cmpParams.glucose} mg/dL</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="800"
                  step="5"
                  value={cmpParams.glucose}
                  onChange={(e) => setCmpParams({ ...cmpParams, glucose: parseInt(e.target.value) })}
                  className="w-full accent-emerald-500"
                />
                <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                  <span>Hypoglycemia (&lt;70)</span>
                  <span>Normal 70-100</span>
                  <span>Hyperglycemia (&gt;200)</span>
                </div>
              </div>

              {/* Sodium & Potassium */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">Sodium (mEq/L)</span>
                    <span className="font-mono text-emerald-400">{cmpParams.sodium}</span>
                  </div>
                  <input
                    type="range"
                    min="115"
                    max="165"
                    step="1"
                    value={cmpParams.sodium}
                    onChange={(e) => setCmpParams({ ...cmpParams, sodium: parseInt(e.target.value) })}
                    className="w-full accent-emerald-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">Potassium (mEq/L)</span>
                    <span className="font-mono text-emerald-400">{cmpParams.potassium.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="1.5"
                    max="8.0"
                    step="0.1"
                    value={cmpParams.potassium}
                    onChange={(e) => setCmpParams({ ...cmpParams, potassium: parseFloat(e.target.value) })}
                    className="w-full accent-emerald-500"
                  />
                </div>
              </div>

              {/* BUN & Creatinine */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">BUN (mg/dL)</span>
                    <span className="font-mono text-emerald-400">{cmpParams.bun}</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    step="1"
                    value={cmpParams.bun}
                    onChange={(e) => setCmpParams({ ...cmpParams, bun: parseInt(e.target.value) })}
                    className="w-full accent-emerald-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">Creatinine (mg/dL)</span>
                    <span className="font-mono text-emerald-400">{cmpParams.creatinine.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.4"
                    max="12.0"
                    step="0.1"
                    value={cmpParams.creatinine}
                    onChange={(e) => setCmpParams({ ...cmpParams, creatinine: parseFloat(e.target.value) })}
                    className="w-full accent-emerald-500"
                  />
                </div>
              </div>

              {/* Calcium & Albumin */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">Total Calcium</span>
                    <span className="font-mono text-emerald-400">{cmpParams.calcium.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="5.0"
                    max="15.0"
                    step="0.1"
                    value={cmpParams.calcium}
                    onChange={(e) => setCmpParams({ ...cmpParams, calcium: parseFloat(e.target.value) })}
                    className="w-full accent-emerald-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">Albumin (g/dL)</span>
                    <span className="font-mono text-emerald-400">{cmpParams.albumin.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="5.5"
                    step="0.1"
                    value={cmpParams.albumin}
                    onChange={(e) => setCmpParams({ ...cmpParams, albumin: parseFloat(e.target.value) })}
                    className="w-full accent-emerald-500"
                  />
                </div>
              </div>

              {/* Measured Osmolality */}
              <div className="pt-2 border-t border-slate-800">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Measured Serum Osmolality</span>
                  <span className="font-mono text-emerald-400">{cmpParams.measuredOsmolality ?? 'None'} mOsm/kg</span>
                </div>
                <input
                  type="range"
                  min="260"
                  max="380"
                  step="1"
                  value={cmpParams.measuredOsmolality ?? 290}
                  onChange={(e) => setCmpParams({ ...cmpParams, measuredOsmolality: parseInt(e.target.value) })}
                  className="w-full accent-emerald-500"
                />
              </div>
            </div>
          )}

          {/* 4. COAG INPUT CONTROLS */}
          {activePanel === 'COAG' && (
            <div className="space-y-4">
              {/* PT / INR & aPTT */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">PT (sec) / INR</span>
                    <span className="font-mono text-emerald-400">{coagParams.pt.toFixed(1)}s ({coagParams.inr.toFixed(2)})</span>
                  </div>
                  <input
                    type="range"
                    min="10.0"
                    max="35.0"
                    step="0.5"
                    value={coagParams.pt}
                    onChange={(e) => {
                      const newPt = parseFloat(e.target.value);
                      const newInr = Number((newPt / 12.0).toFixed(2));
                      setCoagParams({ ...coagParams, pt: newPt, inr: newInr });
                    }}
                    className="w-full accent-emerald-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">aPTT (sec)</span>
                    <span className="font-mono text-emerald-400">{coagParams.aptt.toFixed(1)}s</span>
                  </div>
                  <input
                    type="range"
                    min="20.0"
                    max="100.0"
                    step="1.0"
                    value={coagParams.aptt}
                    onChange={(e) => setCoagParams({ ...coagParams, aptt: parseFloat(e.target.value) })}
                    className="w-full accent-emerald-500"
                  />
                </div>
              </div>

              {/* 1:1 Mixing Study aPTT */}
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-200">1:1 Mixing Study aPTT</span>
                  <span className="font-mono font-bold text-amber-400">
                    {coagParams.mixingStudyAptt ? `${coagParams.mixingStudyAptt.toFixed(1)}s` : 'Not Done'}
                  </span>
                </div>
                <input
                  type="range"
                  min="24.0"
                  max="80.0"
                  step="1.0"
                  value={coagParams.mixingStudyAptt ?? 30.0}
                  onChange={(e) => setCoagParams({ ...coagParams, mixingStudyAptt: parseFloat(e.target.value) })}
                  className="w-full accent-amber-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <button
                    onClick={() => setCoagParams({ ...coagParams, mixingStudyAptt: 28.0 })}
                    className="hover:text-emerald-400"
                  >
                    Quick: Corrects (28s)
                  </button>
                  <button
                    onClick={() => setCoagParams({ ...coagParams, mixingStudyAptt: 56.0 })}
                    className="hover:text-rose-400"
                  >
                    Quick: Fails (56s)
                  </button>
                </div>
              </div>

              {/* Fibrinogen & D-Dimer */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">Fibrinogen</span>
                    <span className="font-mono text-emerald-400">{coagParams.fibrinogen}</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="600"
                    step="10"
                    value={coagParams.fibrinogen}
                    onChange={(e) => setCoagParams({ ...coagParams, fibrinogen: parseInt(e.target.value) })}
                    className="w-full accent-emerald-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">D-Dimer</span>
                    <span className="font-mono text-emerald-400">{coagParams.dDimer}</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="4000"
                    step="50"
                    value={coagParams.dDimer}
                    onChange={(e) => setCoagParams({ ...coagParams, dDimer: parseInt(e.target.value) })}
                    className="w-full accent-emerald-500"
                  />
                </div>
              </div>

              {/* Liver Enzymes AST / ALT */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                <div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">AST (U/L)</span>
                    <span className="font-mono text-emerald-400">{coagParams.ast}</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="600"
                    step="5"
                    value={coagParams.ast}
                    onChange={(e) => setCoagParams({ ...coagParams, ast: parseInt(e.target.value) })}
                    className="w-full accent-emerald-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">ALT (U/L)</span>
                    <span className="font-mono text-emerald-400">{coagParams.alt}</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="600"
                    step="5"
                    value={coagParams.alt}
                    onChange={(e) => setCoagParams({ ...coagParams, alt: parseInt(e.target.value) })}
                    className="w-full accent-emerald-500"
                  />
                </div>
              </div>

              {/* ALP & GGT */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">ALP (U/L)</span>
                    <span className="font-mono text-emerald-400">{coagParams.alp}</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="500"
                    step="5"
                    value={coagParams.alp}
                    onChange={(e) => setCoagParams({ ...coagParams, alp: parseInt(e.target.value) })}
                    className="w-full accent-emerald-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">GGT (U/L)</span>
                    <span className="font-mono text-emerald-400">{coagParams.ggt}</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="400"
                    step="5"
                    value={coagParams.ggt}
                    onChange={(e) => setCoagParams({ ...coagParams, ggt: parseInt(e.target.value) })}
                    className="w-full accent-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Diagnostic Tree & Physiological Rationale (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Primary Conclusion Banner */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" />
                Diagnostic Interpretation Engine
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono">
                {activePanel}
              </span>
            </div>

            {/* ABG Primary Headline */}
            {activePanel === 'ABG' && (
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    {abgResult.primaryDisturbance}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">{abgResult.compensationStatus}</p>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 uppercase font-mono">Anion Gap</span>
                    <p className="text-base font-bold text-emerald-400 mt-0.5">
                      {abgResult.correctedAnionGap ?? '--'}
                      <span className="text-[10px] font-normal text-slate-400 ml-1">mEq/L</span>
                    </p>
                    <span className="text-[10px] text-slate-400">
                      {abgResult.anionGapStatus === 'HIGH_AG' ? '⚠️ High AG (>12)' : 'Normal AG (8-12)'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 uppercase font-mono">Winter's PaCO2</span>
                    <p className="text-base font-bold text-emerald-400 mt-0.5">
                      {abgResult.wintersExpectedPaCO2 ? `${abgResult.wintersExpectedPaCO2.min}-${abgResult.wintersExpectedPaCO2.max}` : '--'}
                      <span className="text-[10px] font-normal text-slate-400 ml-1">mmHg</span>
                    </p>
                    <span className="text-[10px] text-slate-400">Actual: {abgParams.paCO2} mmHg</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 uppercase font-mono">Delta-Delta</span>
                    <p className="text-base font-bold text-emerald-400 mt-0.5">
                      {abgResult.deltaDeltaRatio !== null ? abgResult.deltaDeltaRatio.toFixed(2) : '--'}
                    </p>
                    <span className="text-[10px] text-slate-400">Target 1.0 - 2.0</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 uppercase font-mono">A-a Gradient</span>
                    <p className="text-base font-bold text-emerald-400 mt-0.5">
                      {abgResult.aaGradient ?? '--'}
                      <span className="text-[10px] font-normal text-slate-400 ml-1">mmHg</span>
                    </p>
                    <span className="text-[10px] text-slate-400">Expected: ~{abgResult.expectedAaGradient}</span>
                  </div>
                </div>

                {/* Step-by-Step Rationale */}
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
                    Step-by-Step Acid-Base Reasoning Algorithm
                  </h4>
                  <div className="space-y-1.5">
                    {abgResult.stepByStepRationale.map((step, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/60 text-xs text-slate-300 leading-relaxed font-mono"
                      >
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* CBC Primary Headline */}
            {activePanel === 'CBC' && (
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    {cbcResult.pancytopenia
                      ? 'Pancytopenia (All 3 Cell Lines Reduced)'
                      : cbcResult.hasAnemia
                      ? `${cbcResult.mcvClassification} Anemia`
                      : 'Non-Anemic CBC Profile'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {cbcResult.mentzerInterpretation ?? 'Mentzer Index applicable in microcytic profiles (MCV < 80).'}
                  </p>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 uppercase font-mono">Mentzer Index</span>
                    <p className="text-base font-bold text-emerald-400 mt-0.5">
                      {cbcResult.mentzerIndex ?? '--'}
                    </p>
                    <span className="text-[10px] text-slate-400">
                      {cbcResult.mentzerIndex && cbcResult.mentzerIndex < 13 ? 'Thal Trait (<13)' : 'IDA (>=13)'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 uppercase font-mono">RPI Index</span>
                    <p className="text-base font-bold text-emerald-400 mt-0.5">
                      {cbcResult.reticulocyteProductionIndex ?? '--'}
                    </p>
                    <span className="text-[10px] text-slate-400">
                      {cbcResult.rpiClassification === 'HYPERPROLIFERATIVE' ? 'Hyperprolif (>=2.0)' : 'Hypoprolif (<2.0)'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 uppercase font-mono">RDW Status</span>
                    <p className="text-sm font-bold text-emerald-400 mt-0.5">
                      {cbcResult.rdwStatus === 'ELEVATED_ANISOCYTOSIS' ? 'Anisocytosis' : 'Homogeneous'}
                    </p>
                    <span className="text-[10px] text-slate-400">{cbcParams.rdw}%</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 uppercase font-mono">Platelets</span>
                    <p className="text-sm font-bold text-emerald-400 mt-0.5">
                      {cbcResult.plateletStatus}
                    </p>
                    <span className="text-[10px] text-slate-400">{cbcParams.platelets}k /uL</span>
                  </div>
                </div>

                {/* Differential Diagnosis List */}
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
                    Hematological Differential Diagnosis
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {cbcResult.differentialDiagnosis.map((dx, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/60 text-xs text-slate-300 flex items-start gap-2"
                      >
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{dx}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* CMP Primary Headline */}
            {activePanel === 'CMP' && (
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    {cmpResult.akiPhenotype === 'PRE_RENAL_AZOTEMIA' && 'Pre-Renal Azotemia (BUN/Cr > 20:1)'}
                    {cmpResult.akiPhenotype === 'INTRINSIC_RENAL_ATN' && 'Intrinsic Renal AKI (Acute Tubular Necrosis)'}
                    {cmpResult.akiPhenotype === 'NORMAL_OR_POST_RENAL' && 'Renal Function & Electrolyte Profile'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    BUN/Cr Ratio: {cmpResult.bunCreatinineRatio} | Corrected Na: {cmpResult.correctedSodium} mEq/L | Corrected Ca: {cmpResult.correctedCalcium} mg/dL
                  </p>
                </div>

                {/* Critical Alerts */}
                {(cmpResult.hyperkalemiaRisk || cmpResult.hypokalemiaRisk) && (
                  <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 flex items-start gap-2 text-xs text-rose-300">
                    <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-rose-200">Electrolyte Critical Warning</p>
                      <p>{cmpResult.hyperkalemiaRisk || cmpResult.hypokalemiaRisk}</p>
                    </div>
                  </div>
                )}

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 uppercase font-mono">Corrected Na</span>
                    <p className="text-base font-bold text-emerald-400 mt-0.5">
                      {cmpResult.correctedSodium}
                      <span className="text-[10px] font-normal text-slate-400 ml-1">mEq/L</span>
                    </p>
                    <span className="text-[10px] text-slate-400">Measured: {cmpParams.sodium}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 uppercase font-mono">BUN / Cr Ratio</span>
                    <p className="text-base font-bold text-emerald-400 mt-0.5">
                      {cmpResult.bunCreatinineRatio}:1
                    </p>
                    <span className="text-[10px] text-slate-400">
                      {cmpResult.bunCreatinineRatio > 20 ? 'Pre-Renal (>20)' : 'Intrinsic (<15)'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 uppercase font-mono">Corrected Ca</span>
                    <p className="text-base font-bold text-emerald-400 mt-0.5">
                      {cmpResult.correctedCalcium}
                      <span className="text-[10px] font-normal text-slate-400 ml-1">mg/dL</span>
                    </p>
                    <span className="text-[10px] text-slate-400">Measured: {cmpParams.calcium}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 uppercase font-mono">Osmolar Gap</span>
                    <p className="text-base font-bold text-emerald-400 mt-0.5">
                      {cmpResult.osmolarGap !== null ? `${cmpResult.osmolarGap}` : '--'}
                    </p>
                    <span className="text-[10px] text-slate-400">
                      {cmpResult.osmolarGapElevated ? '⚠️ High Gap (>10)' : 'Normal (<10)'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* COAG Primary Headline */}
            {activePanel === 'COAG' && (
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    {coagResult.suspicionOfDic
                      ? '⚠️ CRITICAL: Consumptive Coagulopathy (DIC)'
                      : coagResult.coagPathwayDefect === 'ISOLATED_INTRINSIC_APTT'
                      ? 'Isolated Intrinsic Pathway Prolongation (aPTT)'
                      : coagResult.coagPathwayDefect === 'ISOLATED_EXTRINSIC_PT'
                      ? 'Isolated Extrinsic Pathway Prolongation (PT/INR)'
                      : coagResult.coagPathwayDefect === 'COMBINED_COMMON_PATHWAY'
                      ? 'Combined Pathway Defect (Both PT & aPTT Prolonged)'
                      : 'Normal Hemostatic Profile'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {coagResult.mixingStudyOutcome === 'CORRECTS_FACTOR_DEFICIENCY' && '1:1 Mixing Study Corrects -> Suggests Clotting Factor Deficiency (e.g. Factor VIII/IX).'}
                    {coagResult.mixingStudyOutcome === 'FAILS_TO_CORRECT_INHIBITOR' && '1:1 Mixing Study FAILS to Correct -> Suggests Circulating Inhibitor (Lupus Anticoagulant).'}
                    {coagResult.mixingStudyOutcome === 'NOT_TESTED' && '1:1 Mixing Study not performed.'}
                  </p>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 uppercase font-mono">De Ritis AST/ALT</span>
                    <p className="text-base font-bold text-emerald-400 mt-0.5">
                      {coagResult.deRitisRatio}
                    </p>
                    <span className="text-[10px] text-slate-400">
                      {coagResult.deRitisRatio >= 2.0 ? 'Alcoholic (>=2)' : 'Viral / NASH (<1)'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 uppercase font-mono">Mixing Study</span>
                    <p className="text-sm font-bold text-emerald-400 mt-0.5">
                      {coagResult.mixingStudyOutcome === 'CORRECTS_FACTOR_DEFICIENCY' ? 'Corrects' : coagResult.mixingStudyOutcome === 'FAILS_TO_CORRECT_INHIBITOR' ? 'Inhibitor' : 'N/A'}
                    </p>
                    <span className="text-[10px] text-slate-400">{coagParams.mixingStudyAptt ? `${coagParams.mixingStudyAptt}s` : '--'}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 uppercase font-mono">Liver Pattern</span>
                    <p className="text-xs font-bold text-emerald-400 mt-0.5">
                      {coagResult.liverEnzymePattern.replace('_', ' ')}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 uppercase font-mono">Jaundice</span>
                    <p className="text-xs font-bold text-emerald-400 mt-0.5">
                      {coagResult.hyperbilirubinemiaType.replace('_', ' ')}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Clinical Pearls & Next Steps */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Info className="w-4 h-4 text-emerald-400" />
              Evidence-Based Diagnostic Pearls & Workup
            </h3>
            <div className="space-y-2">
              {(activePanel === 'ABG' ? abgResult.diagnosticPearls :
                activePanel === 'CBC' ? cbcResult.diagnosticPearls :
                activePanel === 'CMP' ? cmpResult.diagnosticPearls :
                coagResult.diagnosticPearls
              ).map((pearl, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-slate-300 leading-relaxed flex items-start gap-2.5"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>{pearl}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
