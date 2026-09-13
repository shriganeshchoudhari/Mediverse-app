'use client';

import React, { useState, useMemo } from 'react';
import {
  Droplets,
  Activity,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Flame,
  ShieldCheck,
  Scale,
  Sparkles,
  Info,
  Layers,
  HeartCrack,
  Microscope,
  Stethoscope,
  ChevronRight,
  AlertOctagon,
} from 'lucide-react';
import {
  calculateIsthScore,
  calculateSicScore,
  calculateReplacementDosing,
  evaluateMicrovascularInjury,
  DIC_SCENARIOS,
  HemostaticState,
} from '../../.gemini/skills/DicSepsisCoagulopathyEngine';

export default function DicSepsisCoagulopathySimulator() {
  const [selectedScenarioKey, setSelectedScenarioKey] = useState<string>('septic_shock_purpura');
  const scenario = DIC_SCENARIOS[selectedScenarioKey] || DIC_SCENARIOS.septic_shock_purpura;

  // Simulator State
  const [plateletsK, setPlateletsK] = useState<number>(scenario.initialLabs.plateletsKPerUl);
  const [fibrinogenMgDl, setFibrinogenMgDl] = useState<number>(scenario.initialLabs.fibrinogenMgDl);
  const [ptSeconds, setPtSeconds] = useState<number>(scenario.initialLabs.ptSeconds);
  const [inr, setInr] = useState<number>(scenario.initialLabs.inr);
  const [dDimerNgMl, setDDimerNgMl] = useState<number>(scenario.initialLabs.dDimerNgMlFeu);
  const [antithrombinIii, setAntithrombinIii] = useState<number>(scenario.initialLabs.antithrombinIiiPercent);
  const [proteinC, setProteinC] = useState<number>(scenario.initialLabs.proteinCPercent);

  const [sofaNonHematologic, setSofaNonHematologic] = useState<number>(scenario.sofaNonHematologic);
  const [patientWeightKg, setPatientWeightKg] = useState<number>(scenario.weightKg);
  const [activeBleeding, setActiveBleeding] = useState<boolean>(scenario.activeBleeding);
  const [plannedProcedure, setPlannedProcedure] = useState<boolean>(scenario.plannedInvasiveProcedure);

  // Load Scenario Handler
  const handleLoadScenario = (key: string) => {
    setSelectedScenarioKey(key);
    const sc = DIC_SCENARIOS[key];
    if (!sc) return;

    setPlateletsK(sc.initialLabs.plateletsKPerUl);
    setFibrinogenMgDl(sc.initialLabs.fibrinogenMgDl);
    setPtSeconds(sc.initialLabs.ptSeconds);
    setInr(sc.initialLabs.inr);
    setDDimerNgMl(sc.initialLabs.dDimerNgMlFeu);
    setAntithrombinIii(sc.initialLabs.antithrombinIiiPercent);
    setProteinC(sc.initialLabs.proteinCPercent);
    setSofaNonHematologic(sc.sofaNonHematologic);
    setPatientWeightKg(sc.weightKg);
    setActiveBleeding(sc.activeBleeding);
    setPlannedProcedure(sc.plannedInvasiveProcedure);
  };

  // 1. Calculations
  const ptControlSeconds = 12.0;
  const ptProlongationSeconds = Math.max(0, ptSeconds - ptControlSeconds);

  const isthScore = useMemo(
    () => calculateIsthScore(plateletsK, dDimerNgMl, ptProlongationSeconds, fibrinogenMgDl),
    [plateletsK, dDimerNgMl, ptProlongationSeconds, fibrinogenMgDl]
  );

  const sicScore = useMemo(
    () => calculateSicScore(sofaNonHematologic, plateletsK, inr),
    [sofaNonHematologic, plateletsK, inr]
  );

  const currentLabs: HemostaticState = useMemo(
    () => ({
      plateletsKPerUl: plateletsK,
      fibrinogenMgDl,
      ptSeconds,
      inr,
      dDimerNgMlFeu: dDimerNgMl,
      antithrombinIiiPercent: antithrombinIii,
      proteinCPercent: proteinC,
    }),
    [plateletsK, fibrinogenMgDl, ptSeconds, inr, dDimerNgMl, antithrombinIii, proteinC]
  );

  const isHyperfibrinolytic = selectedScenarioKey === 'apl_hyperfibrinolysis';

  const replacementAdvice = useMemo(
    () =>
      calculateReplacementDosing(
        currentLabs,
        patientWeightKg,
        activeBleeding,
        plannedProcedure,
        isHyperfibrinolytic
      ),
    [currentLabs, patientWeightKg, activeBleeding, plannedProcedure, isHyperfibrinolytic]
  );

  const microvascularReport = useMemo(
    () => evaluateMicrovascularInjury(currentLabs, isthScore.isOvertDic, activeBleeding),
    [currentLabs, isthScore.isOvertDic, activeBleeding]
  );

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-rose-500/10 text-rose-400 rounded-lg border border-rose-500/20">
                <Layers className="w-6 h-6" />
              </span>
              <div>
                <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                  Disseminated Intravascular Coagulation (DIC) &amp; SIC Workstation
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    ISTH Diagnostic Criteria
                  </span>
                </h1>
                <p className="text-xs text-slate-400">
                  Overt vs Non-Overt DIC, Sepsis-Induced Coagulopathy (SIC), Microthrombosis vs Consumption Hemorrhage &amp; Component Replacement
                </p>
              </div>
            </div>
          </div>

          {/* Scenario Selector */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Clinical Scenario:</span>
            {Object.keys(DIC_SCENARIOS).map((key) => {
              const sc = DIC_SCENARIOS[key];
              const isActive = selectedScenarioKey === key;
              return (
                <button
                  key={key}
                  onClick={() => handleLoadScenario(key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition border ${
                    isActive
                      ? 'bg-rose-600 border-rose-500 text-white shadow-sm'
                      : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                >
                  {sc.name.split('(')[0]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Scenario Details Banner */}
        <div className="mt-4 p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5">
            <span className="font-bold text-rose-400">{scenario.name}</span>
            <p className="text-slate-300">{scenario.patientProfile}</p>
          </div>
          <div className="flex items-center gap-4 text-slate-400 shrink-0 font-mono text-[11px]">
            <span>Trigger: <strong className="text-slate-200">{scenario.underlyingCondition}</strong></span>
            <span>Weight: <strong className="text-slate-200">{patientWeightKg} kg</strong></span>
          </div>
        </div>
      </div>

      {/* Main 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Coagulation & Biomarker Sliders (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <Microscope className="w-4 h-4 text-rose-400" />
                Hemostatic &amp; Laboratory Parameters
              </h2>
              <span className="text-[11px] font-mono text-slate-400">Control PT: 12.0s</span>
            </div>

            {/* Platelets Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Platelet Count:</span>
                <span
                  className={`font-mono font-bold ${
                    plateletsK < 50
                      ? 'text-rose-400'
                      : plateletsK <= 100
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {plateletsK} &times; 10³/&mu;L
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="250"
                step="5"
                value={plateletsK}
                onChange={(e) => setPlateletsK(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>&lt; 50k (+2 pts)</span>
                <span>50-100k (+1 pt)</span>
                <span>&gt; 100k (0 pts)</span>
              </div>
            </div>

            {/* Fibrinogen Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Fibrinogen Level:</span>
                <span
                  className={`font-mono font-bold ${
                    fibrinogenMgDl < 100 ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {fibrinogenMgDl} mg/dL
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="500"
                step="5"
                value={fibrinogenMgDl}
                onChange={(e) => setFibrinogenMgDl(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>&lt; 100 mg/dL (+1 pt)</span>
                <span>Target &ge; 150 mg/dL</span>
                <span>Normal: 200-400</span>
              </div>
            </div>

            {/* PT & Prolongation */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Prothrombin Time (PT):</span>
                <span
                  className={`font-mono font-bold ${
                    ptProlongationSeconds > 6
                      ? 'text-rose-400'
                      : ptProlongationSeconds >= 3
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {ptSeconds}s (&Delta;+{ptProlongationSeconds.toFixed(1)}s)
                </span>
              </div>
              <input
                type="range"
                min="11"
                max="40"
                step="0.5"
                value={ptSeconds}
                onChange={(e) => setPtSeconds(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>&lt; 3s (0 pts)</span>
                <span>3 - 6s (+1 pt)</span>
                <span>&gt; 6s (+2 pts)</span>
              </div>
            </div>

            {/* INR */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">International Normalized Ratio (INR):</span>
                <span className="font-mono font-bold text-amber-300">{inr.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.9"
                max="4.5"
                step="0.05"
                value={inr}
                onChange={(e) => setInr(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            {/* D-Dimer FEU Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">D-Dimer (FEU):</span>
                <span
                  className={`font-mono font-bold ${
                    dDimerNgMl > 4000 ? 'text-rose-400' : 'text-amber-400'
                  }`}
                >
                  {dDimerNgMl.toLocaleString()} ng/mL
                </span>
              </div>
              <input
                type="range"
                min="200"
                max="20000"
                step="500"
                value={dDimerNgMl}
                onChange={(e) => setDDimerNgMl(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>&lt; 1000 (0 pts)</span>
                <span>1000-4000 (+2 pts)</span>
                <span>&gt; 4000 (+3 pts)</span>
              </div>
            </div>

            {/* Natural Anticoagulants (Antithrombin III & Protein C) */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Antithrombin III:</span>
                  <span className={`font-mono font-bold ${antithrombinIii < 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {antithrombinIii}%
                  </span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="120"
                  step="5"
                  value={antithrombinIii}
                  onChange={(e) => setAntithrombinIii(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Protein C:</span>
                  <span className={`font-mono font-bold ${proteinC < 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {proteinC}%
                  </span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="120"
                  step="5"
                  value={proteinC}
                  onChange={(e) => setProteinC(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>
            </div>

            {/* Clinical Modifiers */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-slate-300">Clinical Status:</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setActiveBleeding(!activeBleeding)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition ${
                    activeBleeding
                      ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  {activeBleeding ? '🩸 Active Bleeding' : 'No Active Bleed'}
                </button>
                <button
                  onClick={() => setPlannedProcedure(!plannedProcedure)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition ${
                    plannedProcedure
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  {plannedProcedure ? '🔪 Planned Surgery' : 'No Surgery'}
                </button>
              </div>

              {/* Non-Hematologic SOFA */}
              <div className="pt-1 flex items-center justify-between text-xs">
                <span className="text-slate-400">Cardiorespiratory SOFA:</span>
                <div className="flex gap-1 font-mono">
                  {[0, 1, 2].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSofaNonHematologic(s)}
                      className={`px-2 py-0.5 rounded text-xs font-bold ${
                        sofaNonHematologic === s
                          ? 'bg-rose-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center Column: ISTH & SIC Scorecards (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* ISTH Overt DIC Main Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  ISTH Consensus Scoring (Taylor et al. 2001)
                </span>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  Diagnostic Scorecard: {isthScore.totalScore} / 8 Points
                </h3>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-black border ${
                  isthScore.isOvertDic
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}
              >
                {isthScore.isOvertDic ? 'OVERT DIC (SCORE ≥ 5)' : 'NON-OVERT DIC (< 5)'}
              </span>
            </div>

            {/* Points Grid Breakdown */}
            <div className="grid grid-cols-4 gap-2">
              <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-center">
                <div className="text-[10px] text-slate-400 font-medium">Platelets</div>
                <div className="text-lg font-black text-rose-400 font-mono">+{isthScore.plateletScore}</div>
                <div className="text-[9px] text-slate-500">Max 2</div>
              </div>
              <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-center">
                <div className="text-[10px] text-slate-400 font-medium">D-Dimer</div>
                <div className="text-lg font-black text-rose-400 font-mono">+{isthScore.fibrinMarkerScore}</div>
                <div className="text-[9px] text-slate-500">Max 3</div>
              </div>
              <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-center">
                <div className="text-[10px] text-slate-400 font-medium">PT Prolong</div>
                <div className="text-lg font-black text-rose-400 font-mono">+{isthScore.ptProlongationScore}</div>
                <div className="text-[9px] text-slate-500">Max 2</div>
              </div>
              <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-center">
                <div className="text-[10px] text-slate-400 font-medium">Fibrinogen</div>
                <div className="text-lg font-black text-rose-400 font-mono">+{isthScore.fibrinogenScore}</div>
                <div className="text-[9px] text-slate-500">Max 1</div>
              </div>
            </div>

            {/* Clinical Interpretation Banner */}
            <div
              className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                isthScore.isOvertDic
                  ? 'bg-rose-500/10 border-rose-500/20 text-rose-200'
                  : 'bg-amber-500/10 border-amber-500/20 text-amber-200'
              }`}
            >
              <div className="font-bold mb-1 flex items-center gap-1.5">
                {isthScore.isOvertDic ? (
                  <AlertOctagon className="w-4 h-4 text-rose-400" />
                ) : (
                  <Info className="w-4 h-4 text-amber-400" />
                )}
                <span>Clinical Interpretation:</span>
              </div>
              {isthScore.interpretation}
              <div className="mt-2 text-[11px] font-mono text-slate-300">
                Mandatory Reassessment: Repeat coagulation panel every {isthScore.repeatIntervalHours} hours.
              </div>
            </div>
          </div>

          {/* Sepsis-Induced Coagulopathy (SIC) Scoring */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Sepsis-3 Coagulopathy Criteria (Iba et al. 2017)
                </span>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  SIC Score: {sicScore.totalScore} / 6 Points
                </h3>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  sicScore.isSicPositive
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {sicScore.isSicPositive ? 'SIC CRITERIA MET (≥ 4)' : 'SIC NEGATIVE (< 4)'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 bg-slate-950/70 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px]">SOFA Organs:</span>
                <div className="font-mono font-bold text-slate-200">+{sicScore.sofaScore}</div>
              </div>
              <div className="p-2 bg-slate-950/70 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px]">Platelets:</span>
                <div className="font-mono font-bold text-slate-200">+{sicScore.plateletScore}</div>
              </div>
              <div className="p-2 bg-slate-950/70 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px]">PT-INR:</span>
                <div className="font-mono font-bold text-slate-200">+{sicScore.inrScore}</div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              {sicScore.interpretation}
            </p>
          </div>

          {/* TXA Black Box Warning */}
          <div
            className={`p-4 rounded-2xl border space-y-2 ${
              replacementAdvice.antifibrinolyticsContraindicated
                ? 'bg-rose-950/40 border-rose-600/50 text-rose-200'
                : 'bg-emerald-950/40 border-emerald-600/50 text-emerald-200'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-xs">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Antifibrinolytic (TXA) Black Box Safety Advisory:</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              {replacementAdvice.txaSafetyWarning}
            </p>
          </div>
        </div>

        {/* Right Column: Blood Component Dosing & Microvascular Injury (3 cols) */}
        <div className="lg:col-span-3 space-y-5">
          {/* Blood Component Replacement Bench */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3.5 shadow-lg">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Droplets className="w-4 h-4 text-rose-400" />
              Component Dosing Calculator
            </h3>

            <div className="space-y-3 text-xs">
              {/* Platelets Recommendation */}
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
                <div className="flex justify-between font-medium">
                  <span className="text-slate-400">Platelet Transfusion:</span>
                  <span className="font-mono font-bold text-rose-400">
                    {replacementAdvice.plateletsUnitsRecommended > 0
                      ? `${replacementAdvice.plateletsUnitsRecommended} Apheresis Pool(s)`
                      : '0 Units (Withhold)'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  {replacementAdvice.plateletRationale}
                </p>
              </div>

              {/* Cryoprecipitate / Fibrinogen */}
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
                <div className="flex justify-between font-medium">
                  <span className="text-slate-400">Fibrinogen / Cryo:</span>
                  <span className="font-mono font-bold text-cyan-400">
                    {replacementAdvice.cryoprecipitateUnitsRecommended > 0
                      ? `${replacementAdvice.cryoprecipitateUnitsRecommended}u Cryo (~${replacementAdvice.fibrinogenConcentrateGramsRecommended}g)`
                      : 'Not Indicated'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  {replacementAdvice.fibrinogenRationale}
                </p>
              </div>

              {/* FFP Dosing */}
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
                <div className="flex justify-between font-medium">
                  <span className="text-slate-400">Fresh Frozen Plasma:</span>
                  <span className="font-mono font-bold text-amber-400">
                    {replacementAdvice.ffpVolumeMlRecommended > 0
                      ? `${replacementAdvice.ffpVolumeMlRecommended} mL (15 mL/kg)`
                      : '0 mL'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  {replacementAdvice.ffpRationale}
                </p>
              </div>
            </div>
          </div>

          {/* Microvascular Thrombosis & End-Organ Injury */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3.5 shadow-lg">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Microvascular Thrombosis Audit
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center p-2.5 bg-slate-950/70 rounded-lg border border-slate-800 font-medium">
                <span className="text-slate-400">Phenotype:</span>
                <span className="font-bold text-rose-300">{microvascularReport.primaryPhenotype}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2 rounded bg-slate-950/70 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Thrombosis Risk</div>
                  <div className="font-bold text-rose-400">{microvascularReport.thrombosisRiskLevel}</div>
                </div>
                <div className="p-2 rounded bg-slate-950/70 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Bleeding Risk</div>
                  <div className="font-bold text-rose-400">{microvascularReport.bleedingRiskLevel}</div>
                </div>
              </div>

              {/* Organ Failure Warnings */}
              {microvascularReport.targetOrganInjuryAlerts.length > 0 && (
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Target Organ Risks:</span>
                  <ul className="space-y-1 text-[10px] text-slate-300">
                    {microvascularReport.targetOrganInjuryAlerts.map((alert, idx) => (
                      <li key={idx} className="flex items-start gap-1">
                        <ChevronRight className="w-3 h-3 text-rose-400 shrink-0 mt-0.5" />
                        <span>{alert}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
