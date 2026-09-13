'use client';

import React, { useState, useMemo } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Flame,
  Droplets,
  Zap,
  Gauge,
  Layers,
  Heart,
  Sparkles,
  ChevronRight,
  Info,
  Sliders,
  Filter,
  RefreshCw,
  AlertOctagon,
} from 'lucide-react';
import {
  calculateCrrtDose,
  calculateSoluteClearance,
  evaluateCitrateAnticoagulation,
  calculateFilterPressures,
  CRRT_SCENARIOS,
  CrrtModality,
  ReplacementMode,
} from '../../.gemini/skills/CrrtCitrateClearanceEngine';

export default function CrrtCitrateClearanceSimulator() {
  const [selectedScenarioKey, setSelectedScenarioKey] = useState<string>('septic_shock_aki');
  const scenario = CRRT_SCENARIOS[selectedScenarioKey] || CRRT_SCENARIOS.septic_shock_aki;

  // CRRT Device State
  const [modality, setModality] = useState<CrrtModality>(scenario.defaultParams.modality);
  const [bloodFlowQb, setBloodFlowQb] = useState<number>(scenario.defaultParams.bloodFlowQbMlMin);
  const [dialysateQd, setDialysateQd] = useState<number>(scenario.defaultParams.dialysateFlowQdMlHr);
  const [replacementQrep, setReplacementQrep] = useState<number>(scenario.defaultParams.replacementFlowQrepMlHr);
  const [replacementMode, setReplacementMode] = useState<ReplacementMode>(scenario.defaultParams.replacementMode);
  const [netUf, setNetUf] = useState<number>(scenario.defaultParams.netUltrafiltrationMlHr);
  const [patientWeightKg, setPatientWeightKg] = useState<number>(scenario.weightKg);
  const [hematocrit, setHematocrit] = useState<number>(scenario.hematocrit);

  // Citrate & Calcium State
  const [citrateInfusionRate, setCitrateInfusionRate] = useState<number>(scenario.defaultCitrate.citrateInfusionRateMmolHr);
  const [circuitICa, setCircuitICa] = useState<number>(scenario.defaultCitrate.circuitIonizedCaMmolL);
  const [systemicICa, setSystemicICa] = useState<number>(scenario.defaultCitrate.systemicIonizedCaMmolL);
  const [totalCa, setTotalCa] = useState<number>(scenario.defaultCitrate.totalSerumCaMmolL);
  const [hepaticFunction, setHepaticFunction] = useState<'normal' | 'mild_impairment' | 'severe_failure_shock'>(scenario.defaultCitrate.hepaticFunction);

  // Load Scenario Handler
  const handleLoadScenario = (key: string) => {
    setSelectedScenarioKey(key);
    const sc = CRRT_SCENARIOS[key];
    if (!sc) return;

    setModality(sc.defaultParams.modality);
    setBloodFlowQb(sc.defaultParams.bloodFlowQbMlMin);
    setDialysateQd(sc.defaultParams.dialysateFlowQdMlHr);
    setReplacementQrep(sc.defaultParams.replacementFlowQrepMlHr);
    setReplacementMode(sc.defaultParams.replacementMode);
    setNetUf(sc.defaultParams.netUltrafiltrationMlHr);
    setPatientWeightKg(sc.weightKg);
    setHematocrit(sc.hematocrit);

    setCitrateInfusionRate(sc.defaultCitrate.citrateInfusionRateMmolHr);
    setCircuitICa(sc.defaultCitrate.circuitIonizedCaMmolL);
    setSystemicICa(sc.defaultCitrate.systemicIonizedCaMmolL);
    setTotalCa(sc.defaultCitrate.totalSerumCaMmolL);
    setHepaticFunction(sc.defaultCitrate.hepaticFunction);
  };

  // 1. Calculations
  const crrtParams = useMemo(
    () => ({
      modality,
      bloodFlowQbMlMin: bloodFlowQb,
      dialysateFlowQdMlHr: dialysateQd,
      replacementFlowQrepMlHr: replacementQrep,
      replacementMode,
      netUltrafiltrationMlHr: netUf,
      patientWeightKg,
      hematocritFraction: hematocrit,
    }),
    [modality, bloodFlowQb, dialysateQd, replacementQrep, replacementMode, netUf, patientWeightKg, hematocrit]
  );

  const doseReport = useMemo(() => calculateCrrtDose(crrtParams), [crrtParams]);
  const soluteClearance = useMemo(() => calculateSoluteClearance(crrtParams, doseReport), [crrtParams, doseReport]);

  const citrateParams = useMemo(
    () => ({
      citrateInfusionRateMmolHr: citrateInfusionRate,
      circuitIonizedCaMmolL: circuitICa,
      systemicIonizedCaMmolL: systemicICa,
      totalSerumCaMmolL: totalCa,
      hepaticFunction,
    }),
    [citrateInfusionRate, circuitICa, systemicICa, totalCa, hepaticFunction]
  );

  const citrateSafety = useMemo(() => evaluateCitrateAnticoagulation(citrateParams), [citrateParams]);

  // Derived filter pressure simulation based on blood flow and filtration fraction
  const filterPressures = useMemo(() => {
    const artP = 80 + Math.round(bloodFlowQb * 0.2);
    const venP = 90 + Math.round(bloodFlowQb * 0.25);
    const effP = -30 - Math.round(doseReport.totalUltrafiltrationQufMlHr * 0.02);
    return calculateFilterPressures(artP, venP, effP);
  }, [bloodFlowQb, doseReport.totalUltrafiltrationQufMlHr]);

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-teal-500/10 text-teal-400 rounded-lg border border-teal-500/20">
                <Filter className="w-6 h-6" />
              </span>
              <div>
                <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                  Continuous Renal Replacement Therapy (CRRT) Workstation
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    KDIGO &amp; RCA Kinetics
                  </span>
                </h1>
                <p className="text-xs text-slate-400">
                  CVVH, CVVHD, CVVHDF &amp; SCUF, Convective vs Diffusive Clearance, Filtration Fraction &amp; Citrate Anticoagulation
                </p>
              </div>
            </div>
          </div>

          {/* Scenario Selector */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Clinical Case:</span>
            {Object.keys(CRRT_SCENARIOS).map((key) => {
              const sc = CRRT_SCENARIOS[key];
              const isActive = selectedScenarioKey === key;
              return (
                <button
                  key={key}
                  onClick={() => handleLoadScenario(key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition border ${
                    isActive
                      ? 'bg-teal-600 border-teal-500 text-white shadow-sm'
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
            <span className="font-bold text-teal-400">{scenario.name}</span>
            <p className="text-slate-300">{scenario.patientProfile}</p>
          </div>
          <div className="flex items-center gap-4 text-slate-400 shrink-0 font-mono text-[11px]">
            <span>Indication: <strong className="text-slate-200">{scenario.patientDiagnosis}</strong></span>
            <span>Weight: <strong className="text-slate-200">{patientWeightKg} kg</strong></span>
          </div>
        </div>
      </div>

      {/* Main 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: CRRT Circuit Controls (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-teal-400" />
                CRRT Circuit Prescription
              </h2>
              <span className="text-[11px] font-mono text-teal-400 uppercase font-bold">{modality}</span>
            </div>

            {/* Modality Selector */}
            <div className="grid grid-cols-4 gap-1.5">
              {(['cvvhdf', 'cvvh', 'cvvhd', 'scuf'] as CrrtModality[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setModality(m)}
                  className={`py-1.5 text-xs font-bold uppercase rounded-lg border transition ${
                    modality === m
                      ? 'bg-teal-600 border-teal-500 text-white shadow-sm'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            {/* Blood Flow Qb */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Blood Flow Rate (Qb):</span>
                <span className="font-mono font-bold text-teal-300">{bloodFlowQb} mL/min</span>
              </div>
              <input aria-label="Blood Flow Rate (Qb)"
                type="range"
                min="100"
                max="300"
                step="10"
                value={bloodFlowQb}
                onChange={(e) => setBloodFlowQb(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>100 mL/min</span>
                <span>Plasma Flow: {doseReport.plasmaFlowQpMlMin} mL/min</span>
                <span>300 mL/min</span>
              </div>
            </div>

            {/* Dialysate Flow Qd (if CVVHD or CVVHDF) */}
            {modality !== 'cvvh' && modality !== 'scuf' && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Dialysate Flow (Qd - Diffusion):</span>
                  <span className="font-mono font-bold text-teal-300">{dialysateQd} mL/h</span>
                </div>
                <input aria-label="Dialysate Flow (Qd - Diffusion)"
                  type="range"
                  min="0"
                  max="3500"
                  step="100"
                  value={dialysateQd}
                  onChange={(e) => setDialysateQd(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
                />
              </div>
            )}

            {/* Replacement Flow Qrep (if CVVH or CVVHDF) */}
            {modality !== 'cvvhd' && modality !== 'scuf' && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Replacement Flow (Qrep - Convection):</span>
                  <span className="font-mono font-bold text-cyan-300">{replacementQrep} mL/h</span>
                </div>
                <input aria-label="Replacement Flow (Qrep - Convection)"
                  type="range"
                  min="0"
                  max="3500"
                  step="100"
                  value={replacementQrep}
                  onChange={(e) => setReplacementQrep(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />

                {/* Replacement Mode */}
                <div className="pt-1 flex rounded-lg overflow-hidden border border-slate-700 text-[11px]">
                  <button
                    onClick={() => setReplacementMode('pre_filter')}
                    className={`flex-1 py-1 font-semibold ${
                      replacementMode === 'pre_filter' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    Pre-Filter
                  </button>
                  <button
                    onClick={() => setReplacementMode('split_50_50')}
                    className={`flex-1 py-1 font-semibold ${
                      replacementMode === 'split_50_50' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    50/50 Split
                  </button>
                  <button
                    onClick={() => setReplacementMode('post_filter')}
                    className={`flex-1 py-1 font-semibold ${
                      replacementMode === 'post_filter' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    Post-Filter
                  </button>
                </div>
              </div>
            )}

            {/* Net Ultrafiltration Rate */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Net Ultrafiltration (Fluid Removal):</span>
                <span className="font-mono font-bold text-amber-300">{netUf} mL/h</span>
              </div>
              <input aria-label="Net Ultrafiltration (Fluid Removal)"
                type="range"
                min="0"
                max="600"
                step="25"
                value={netUf}
                onChange={(e) => setNetUf(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            {/* Patient Weight & Hematocrit */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800 text-xs">
              <div className="space-y-1">
                <span className="text-slate-400">Weight:</span>
                <input
                  type="number"
                  min="40"
                  max="150"
                  value={patientWeightKg}
                  onChange={(e) => setPatientWeightKg(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 font-mono"
                />
              </div>
              <div className="space-y-1">
                <span className="text-slate-400">Hematocrit:</span>
                <input
                  type="number"
                  step="0.01"
                  min="0.15"
                  max="0.55"
                  value={hematocrit}
                  onChange={(e) => setHematocrit(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Center Column: KDIGO Dose, Clearance & Filtration Fraction (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* KDIGO Delivered Effluent Dose Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  KDIGO Clinical Dose Benchmark
                </span>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  Delivered Effluent Dose: {doseReport.effectiveDeliveredDoseMlKgHr} mL/kg/h
                </h3>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  doseReport.kdigoDoseAdequate
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}
              >
                {doseReport.kdigoDoseAdequate ? 'KDIGO ADEQUATE (≥ 20)' : 'SUB-THERAPEUTIC (< 20)'}
              </span>
            </div>

            {/* Dose Cards Grid */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                <div className="text-[10px] text-slate-400 font-medium">Prescribed Dose</div>
                <div className="text-xl font-black text-teal-400 font-mono">{doseReport.prescribedEffluentDoseMlKgHr}</div>
                <div className="text-[9px] text-slate-500">mL/kg/h</div>
              </div>
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                <div className="text-[10px] text-slate-400 font-medium">Delivered Dose</div>
                <div className="text-xl font-black text-emerald-400 font-mono">{doseReport.effectiveDeliveredDoseMlKgHr}</div>
                <div className="text-[9px] text-slate-500">mL/kg/h (adjusted)</div>
              </div>
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                <div className="text-[10px] text-slate-400 font-medium">Total Effluent</div>
                <div className="text-xl font-black text-cyan-400 font-mono">{doseReport.totalEffluentMlHr}</div>
                <div className="text-[9px] text-slate-500">mL/h</div>
              </div>
            </div>

            {/* Pre-dilution penalty note */}
            {doseReport.preDilutionClearancePenaltyPercent > 0 && (
              <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-300 flex items-center justify-between">
                <span>Pre-Dilution Clearance Penalty:</span>
                <span className="font-mono font-bold">-{doseReport.preDilutionClearancePenaltyPercent}% Solute Washout</span>
              </div>
            )}
          </div>

          {/* Filtration Fraction & Membrane Safety */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Filter Clotting Surveillance
                </span>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  Filtration Fraction (FF): {doseReport.filtrationFractionPercent}%
                </h3>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  doseReport.filtrationFractionSafe
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/30 animate-pulse'
                }`}
              >
                {doseReport.filtrationFractionSafe ? 'SAFE (≤ 25%)' : 'CRITICAL CLOTTING RISK (> 25%)'}
              </span>
            </div>

            {/* Bar meter */}
            <div className="space-y-1">
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    doseReport.filtrationFractionSafe ? 'bg-teal-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.min(100, (doseReport.filtrationFractionPercent / 35) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0%</span>
                <span>Target: 15-20%</span>
                <span>Upper Limit: 25%</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Total Ultrafiltration: <strong>{doseReport.totalUltrafiltrationQufMlHr} mL/h</strong>. Exceeding 25% FF leads to severe hemoconcentration within hollow fibers, causing protein cake formation and acute premature filter thrombosis.
            </p>
          </div>

          {/* Solute Clearance Spectrum */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-cyan-400" />
                Solute Clearance Kinetics (mL/min)
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">{soluteClearance.middleMoleculeAdvantage}</span>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl">
                <div className="text-[10px] text-slate-400">Urea (60 Da)</div>
                <div className="font-mono font-bold text-teal-400">{soluteClearance.ureaClearanceMlMin}</div>
              </div>
              <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl">
                <div className="text-[10px] text-slate-400">Creatinine (113 Da)</div>
                <div className="font-mono font-bold text-teal-400">{soluteClearance.creatinineClearanceMlMin}</div>
              </div>
              <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl">
                <div className="text-[10px] text-slate-400">Vancomycin (1.4 kDa)</div>
                <div className="font-mono font-bold text-cyan-400">{soluteClearance.vancomycinClearanceMlMin}</div>
              </div>
              <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl">
                <div className="text-[10px] text-slate-400">Myoglobin (17.8 kDa)</div>
                <div className="font-mono font-bold text-amber-400">{soluteClearance.myoglobinClearanceMlMin}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Regional Citrate Anticoagulation & Safety (3 cols) */}
        <div className="lg:col-span-3 space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3.5 shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <Droplets className="w-4 h-4 text-teal-400" />
                Regional Citrate (RCA)
              </h3>
              <span className="text-[10px] font-mono text-slate-400">Pre-Filter Infusion</span>
            </div>

            {/* Circuit & Systemic Calcium Sliders */}
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Circuit iCa (Post-Filter):</span>
                  <span
                    className={`font-mono font-bold ${
                      citrateSafety.circuitAnticoagulationAdequate ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    {circuitICa.toFixed(2)} mmol/L
                  </span>
                </div>
                <input aria-label="Circuit I Ca"
                  type="range"
                  min="0.15"
                  max="0.60"
                  step="0.01"
                  value={circuitICa}
                  onChange={(e) => setCircuitICa(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
                />
                <div className="text-[10px] text-slate-500">Target: 0.25 - 0.35 mmol/L</div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Systemic iCa (Patient):</span>
                  <span
                    className={`font-mono font-bold ${
                      citrateSafety.systemicHypocalcemiaAlert ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    {systemicICa.toFixed(2)} mmol/L
                  </span>
                </div>
                <input aria-label="Systemic I Ca"
                  type="range"
                  min="0.70"
                  max="1.50"
                  step="0.02"
                  value={systemicICa}
                  onChange={(e) => setSystemicICa(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
                />
                <div className="text-[10px] text-slate-500">Target: 1.10 - 1.30 mmol/L</div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Serum Calcium:</span>
                  <span className="font-mono font-bold text-slate-200">{totalCa.toFixed(2)} mmol/L</span>
                </div>
                <input aria-label="Total Serum Calcium"
                  type="range"
                  min="1.80"
                  max="3.50"
                  step="0.05"
                  value={totalCa}
                  onChange={(e) => setTotalCa(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
                />
              </div>

              {/* Citrate Lock Ratio Card */}
              <div
                className={`p-3 rounded-xl border text-center space-y-1 ${
                  citrateSafety.citrateAccumulationAlert
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-200'
                    : 'bg-slate-950/70 border-slate-800 text-slate-300'
                }`}
              >
                <div className="text-[10px] uppercase font-bold text-slate-400">Total Ca / Ionized Ca Ratio</div>
                <div
                  className={`text-2xl font-black font-mono ${
                    citrateSafety.citrateAccumulationAlert ? 'text-rose-400 animate-pulse' : 'text-emerald-400'
                  }`}
                >
                  {citrateSafety.totalToIonizedCaRatio}
                </div>
                <div className="text-[10px] font-semibold">
                  {citrateSafety.citrateAccumulationAlert
                    ? '⚠️ CITRATE LOCK DETECTED (Ratio ≥ 2.5)'
                    : 'Normal Citrate Metabolism (Ratio < 2.5)'}
                </div>
              </div>

              {/* Citrate Recommendations */}
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1 text-[11px] text-slate-400">
                <div className="font-bold text-teal-300">Action Plan:</div>
                <ul className="space-y-1">
                  {citrateSafety.recommendations.map((r, idx) => (
                    <li key={idx} className="flex items-start gap-1 text-[10px] text-slate-300">
                      <ChevronRight className="w-3 h-3 text-teal-400 shrink-0 mt-0.5" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
