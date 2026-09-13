"use client";

import React, { useState, useMemo } from "react";
import {
  Activity,
  AlertTriangle,
  ShieldCheck,
  Stethoscope,
  Wind,
  CheckCircle2,
  AlertCircle,
  Droplets,
  Heart,
  Gauge,
  Info,
  ShieldAlert,
  Microscope,
  Layers,
  ArrowRight,
  Flame,
  Pill,
  Clock,
  Skull,
  RefreshCw,
  XCircle,
  Scissors
} from "lucide-react";
import {
  BpfPatientParams,
  CerfolioAirLeakClass,
  FistulaAnatomicLocation,
  PleuralDrainageMode,
  DEFAULT_BPF_PATIENT,
  simulateBronchopleuralFistula
} from "../../.gemini/skills/BronchopleuralFistulaEngine";

export default function BronchopleuralFistulaSimulator() {
  const [params, setParams] = useState<BpfPatientParams>(DEFAULT_BPF_PATIENT);
  const [activeTab, setActiveTab] = useState<"steal_cerfolio" | "ilv_dual_vent" | "suction_dilemma" | "interventions">("steal_cerfolio");

  const output = useMemo(() => simulateBronchopleuralFistula(params), [params]);

  const updateParam = <K extends keyof BpfPatientParams>(
    key: K,
    value: BpfPatientParams[K]
  ) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  // Case Vignettes / Presets
  const applyPreset = (
    presetKey:
      | "central_stump_dehiscence"
      | "ilv_dual_ventilation"
      | "peripheral_pal_blood_patch"
      | "endobronchial_valves"
      | "clamped_tube_catastrophe"
  ) => {
    switch (presetKey) {
      case "central_stump_dehiscence":
        setParams({
          ...DEFAULT_BPF_PATIENT,
          fistulaLocation: "CENTRAL_MAIN_BRONCHUS",
          fistulaDiameterMm: 6.5,
          cerfolioClass: "CLASS_C_CONTINUOUS",
          airLeakVolumeMlPerBreath: 320,
          pleuralDrainageMode: "HIGH_SUCTION_20",
          singleVentModeActive: true,
          independentLungVentilationActive: false,
          endobronchialValvesPlaced: false,
          autologousBloodPatchInstilled: false,
          surgicalStumpFlapCoverageDone: false
        });
        break;
      case "ilv_dual_ventilation":
        setParams({
          ...DEFAULT_BPF_PATIENT,
          fistulaLocation: "CENTRAL_MAIN_BRONCHUS",
          fistulaDiameterMm: 6.5,
          cerfolioClass: "CLASS_C_CONTINUOUS",
          singleVentModeActive: false,
          independentLungVentilationActive: true,
          dltPositionConfirmedBronchoscopically: true,
          fistulaLungTidalVolumeMl: 120,
          fistulaLungPeepCmH2O: 0,
          healthyLungTidalVolumeMl: 380,
          healthyLungPeepCmH2O: 8,
          pleuralDrainageMode: "WATER_SEAL_NO_SUCTION",
          endobronchialValvesPlaced: false,
          autologousBloodPatchInstilled: false,
          surgicalStumpFlapCoverageDone: false
        });
        break;
      case "peripheral_pal_blood_patch":
        setParams({
          ...DEFAULT_BPF_PATIENT,
          fistulaLocation: "PERIPHERAL_ALVEOLOPLEURAL",
          fistulaDiameterMm: 2.0,
          cerfolioClass: "CLASS_E_EXPIRATORY",
          airLeakVolumeMlPerBreath: 90,
          daysPostoperativeOrOnset: 7,
          pleuralDrainageMode: "WATER_SEAL_NO_SUCTION",
          singleVentModeActive: true,
          independentLungVentilationActive: false,
          endobronchialValvesPlaced: false,
          autologousBloodPatchInstilled: true,
          surgicalStumpFlapCoverageDone: false
        });
        break;
      case "endobronchial_valves":
        setParams({
          ...DEFAULT_BPF_PATIENT,
          fistulaLocation: "LOBAR_SEGMENTAL_BRONCHUS",
          fistulaDiameterMm: 3.5,
          cerfolioClass: "CLASS_I_INSPIRATORY",
          airLeakVolumeMlPerBreath: 140,
          daysPostoperativeOrOnset: 10,
          pleuralDrainageMode: "LOW_SUCTION_10",
          singleVentModeActive: true,
          independentLungVentilationActive: false,
          endobronchialValvesPlaced: true,
          autologousBloodPatchInstilled: false,
          surgicalStumpFlapCoverageDone: false
        });
        break;
      case "clamped_tube_catastrophe":
        setParams({
          ...DEFAULT_BPF_PATIENT,
          fistulaLocation: "CENTRAL_MAIN_BRONCHUS",
          fistulaDiameterMm: 6.5,
          pleuralDrainageMode: "CLAMPED_HAZARD" // Triggers acute lethal tension pneumothorax!
        });
        break;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 lg:p-8">
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-cyan-500/20 border border-cyan-500/40 rounded-xl text-cyan-400">
                <Wind className="w-8 h-8 animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                  Bronchopleural Fistula (BPF) & Persistent Air Leak Workstation
                </h1>
                <p className="text-sm text-slate-400">
                  Cerfolio Classification (C/I/E/F), Ventilatory Steal Mechanics, Dual-Ventilator Independent Lung Ventilation (ILV), Suction Dilemma, and Endobronchial Valves (EBV)
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 rounded-full text-xs font-semibold flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" /> Track B39 (Route #240)
            </span>
            <span className="px-3 py-1 bg-sky-950/60 border border-sky-800/60 text-sky-300 rounded-full text-xs font-semibold flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" /> Cerfolio Class (C/I/E/F)
            </span>
            <span className="px-3 py-1 bg-indigo-950/60 border border-indigo-800/60 text-indigo-300 rounded-full text-xs font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Dual-Ventilator ILV
            </span>
          </div>
        </div>

        {/* Case Presets Navigation */}
        <div className="mt-4 p-3 bg-slate-900/70 border border-slate-800/80 rounded-xl">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Stethoscope className="w-3.5 h-3.5 text-cyan-400" /> Clinical Scenarios & High-Yield Vignettes:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
            <button
              onClick={() => applyPreset("central_stump_dehiscence")}
              className={`text-left p-2.5 rounded-lg border text-xs transition ${
                params.fistulaLocation === "CENTRAL_MAIN_BRONCHUS" && !params.independentLungVentilationActive && params.pleuralDrainageMode !== "CLAMPED_HAZARD"
                  ? "bg-cyan-950/80 border-cyan-500 text-cyan-200 shadow-md shadow-cyan-950/50"
                  : "bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>1. Central Stump Dehiscence</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-rose-900 text-rose-200 rounded">Class C</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                6.5mm mainstem BPF, 67% ventilatory steal, continuous bubbling, flooding risk.
              </p>
            </button>

            <button
              onClick={() => applyPreset("ilv_dual_ventilation")}
              className={`text-left p-2.5 rounded-lg border text-xs transition ${
                params.independentLungVentilationActive
                  ? "bg-indigo-950/80 border-indigo-500 text-indigo-200 shadow-md shadow-indigo-950/50"
                  : "bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>2. Dual-Ventilator ILV</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-indigo-900 text-indigo-200 rounded">Dual ETT</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                DLT isolation, healthy lung on 380mL/PEEP 8; fistula lung on 120mL/ZEEP.
              </p>
            </button>

            <button
              onClick={() => applyPreset("peripheral_pal_blood_patch")}
              className={`text-left p-2.5 rounded-lg border text-xs transition ${
                params.fistulaLocation === "PERIPHERAL_ALVEOLOPLEURAL" && params.autologousBloodPatchInstilled
                  ? "bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-950/50"
                  : "bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>3. Peripheral PAL & Blood Patch</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-emerald-900 text-emerald-200 rounded">Class E</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                Alveolopleural leak day 7 post-wedge, autologous 80mL blood patch seals parenchyma.
              </p>
            </button>

            <button
              onClick={() => applyPreset("endobronchial_valves")}
              className={`text-left p-2.5 rounded-lg border text-xs transition ${
                params.endobronchialValvesPlaced
                  ? "bg-sky-950/80 border-sky-500 text-sky-200 shadow-md shadow-sky-950/50"
                  : "bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>4. One-Way Valves (EBV)</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-sky-900 text-sky-200 rounded">Bronchoscopy</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                Spiration duckbill valves block inspiratory flow into fistula while permitting secretions.
              </p>
            </button>

            <button
              onClick={() => applyPreset("clamped_tube_catastrophe")}
              className={`text-left p-2.5 rounded-lg border text-xs transition ${
                params.pleuralDrainageMode === "CLAMPED_HAZARD"
                  ? "bg-red-950/80 border-red-500 text-red-200 shadow-md shadow-red-950/50"
                  : "bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>5. Clamped Tube Catastrophe</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-red-900 text-red-200 rounded">LETHAL</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                Chest tube clamped with BPF traps positive pressure; rapid tension arrest.
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* Hero 4-Panel Hemodynamic & Respiratory Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Panel 1: Ventilatory Steal & Effective MV */}
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-semibold">
              <span className="flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-cyan-400" /> Ventilatory Steal
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  output.ventilatoryStealPercentage >= 40
                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse"
                    : output.ventilatoryStealPercentage > 15
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                    : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                }`}
              >
                {output.ventilatoryStealPercentage >= 40 ? "SEVERE STEAL" : output.ventilatoryStealPercentage > 0 ? "MODERATE LEAK" : "SEALED"}
              </span>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className={`text-3xl font-extrabold ${output.ventilatoryStealPercentage >= 40 ? "text-rose-400" : output.ventilatoryStealPercentage > 0 ? "text-amber-400" : "text-emerald-400"}`}>
                  {output.ventilatoryStealPercentage}%
                </span>
                <span className="text-xs text-slate-400">Tidal Volume Lost</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px]">EFFECTIVE MINUTE VENT</span>
                  <span className="font-bold text-sm text-cyan-300">
                    {output.effectiveMinuteVentilationLPerMin} L/min
                  </span>
                </div>
                <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px]">VENTILATION MODE</span>
                  <span className={`font-bold text-xs ${params.independentLungVentilationActive ? "text-indigo-400" : "text-slate-300"}`}>
                    {params.independentLungVentilationActive ? "Dual-Vent ILV" : "Single Vent"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Gas Exchange State:</span>
            <span className={`font-semibold ${params.paCo2MmHg > 55 ? "text-rose-400" : "text-slate-300"}`}>
              PaCO2 {params.paCo2MmHg} mmHg ({params.arterialPh.toFixed(2)})
            </span>
          </div>
        </div>

        {/* Panel 2: Cerfolio Classification & Air Leak Phase */}
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-semibold">
              <span className="flex items-center gap-1.5">
                <Wind className="w-4 h-4 text-sky-400" /> Cerfolio Air Leak
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  params.cerfolioClass === "CLASS_C_CONTINUOUS"
                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse"
                    : params.cerfolioClass === "CLASS_I_INSPIRATORY"
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                    : "bg-sky-500/20 text-sky-400 border border-sky-500/40"
                }`}
              >
                {params.cerfolioClass.replace("CLASS_", "")}
              </span>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-sky-400">
                  {params.airLeakVolumeMlPerBreath}
                </span>
                <span className="text-xs text-slate-400">mL / breath lost</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px]">LEAK TIMING</span>
                  <span className="font-bold text-xs text-slate-200 truncate block">
                    {params.cerfolioClass === "CLASS_C_CONTINUOUS" ? "Inspiration + Exp" : params.cerfolioClass === "CLASS_I_INSPIRATORY" ? "Inspiratory Only" : params.cerfolioClass === "CLASS_E_EXPIRATORY" ? "Expiratory Only" : "Forced / Cough"}
                  </span>
                </div>
                <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px]">FISTULA DIAMETER</span>
                  <span className="font-bold text-sm text-sky-300">
                    {params.fistulaDiameterMm} mm
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Anatomy:</span>
            <span className="font-semibold text-slate-300 truncate block text-[10px]">
              {params.fistulaLocation.replace("_", " ")}
            </span>
          </div>
        </div>

        {/* Panel 3: Transpulmonary Shear Stress & Suction */}
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-semibold">
              <span className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-amber-400" /> Transpulmonary Shear
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  output.fistulaShearStressIndex > 65
                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                    : output.fistulaShearStressIndex > 35
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                    : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                }`}
              >
                SHEAR INDEX {output.fistulaShearStressIndex}/100
              </span>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className={`text-3xl font-extrabold ${output.fistulaShearStressIndex > 65 ? "text-rose-400" : "text-amber-400"}`}>
                  {output.fistulaShearStressIndex}
                </span>
                <span className="text-xs text-slate-400">/ 100 Shear Index</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px]">DRAINAGE MODE</span>
                  <span className="font-bold text-xs text-amber-300 truncate block">
                    {params.pleuralDrainageMode.replace("_", " ")}
                  </span>
                </div>
                <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px]">FISTULA STATUS</span>
                  <span className={`font-bold text-xs ${params.surgicalStumpFlapCoverageDone ? "text-emerald-400" : params.endobronchialValvesPlaced ? "text-sky-300" : "text-rose-400"}`}>
                    {params.surgicalStumpFlapCoverageDone ? "Flap Sealed" : params.endobronchialValvesPlaced ? "Valved (EBV)" : "Patent Defect"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Driving Pressure:</span>
            <span className="font-semibold text-slate-300 truncate block text-[10px]">
              {params.independentLungVentilationActive ? "Fistula ZEEP + Healthy 8 PEEP" : `PIP ${params.peakInspiratoryPressureCmH2O} / PEEP ${params.peepCmH2O}`}
            </span>
          </div>
        </div>

        {/* Panel 4: Tension Risk & Healing Score */}
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-semibold">
              <span className="flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-400" /> Tension Risk & Healing
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  output.tensionPneumothoraxRisk === "CRITICAL_LETHAL"
                    ? "bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse"
                    : output.healingLikelihoodScorePercent >= 70
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                    : "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                }`}
              >
                {output.tensionPneumothoraxRisk === "CRITICAL_LETHAL" ? "TENSION ARREST" : `${output.healingLikelihoodScorePercent}% HEALING`}
              </span>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className={`text-3xl font-extrabold ${output.tensionPneumothoraxRisk === "CRITICAL_LETHAL" ? "text-red-400" : output.healingLikelihoodScorePercent >= 70 ? "text-emerald-400" : "text-cyan-400"}`}>
                  {output.healingLikelihoodScorePercent}%
                </span>
                <span className="text-xs text-slate-400">Closure Likelihood</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px]">FLOODING RISK</span>
                  <span className={`font-bold text-xs ${output.contralateralFloodingRisk ? "text-rose-400 font-bold" : "text-emerald-400"}`}>
                    {output.contralateralFloodingRisk ? "Good Lung Flooding" : "Protected"}
                  </span>
                </div>
                <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px]">PERSISTENCE</span>
                  <span className="font-bold text-sm text-cyan-300">
                    Day {params.daysPostoperativeOrOnset} (PAL)
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Tension Risk:</span>
            <span className={`font-bold ${output.tensionPneumothoraxRisk === "CRITICAL_LETHAL" ? "text-red-400" : "text-emerald-400"}`}>
              {output.tensionPneumothoraxRisk === "CRITICAL_LETHAL" ? "Catastrophic Clamping!" : "Vented via Drain"}
            </span>
          </div>
        </div>
      </div>

      {/* Clinical Alerts Strip */}
      {output.clinicalAlerts.length > 0 && (
        <div className="max-w-7xl mx-auto mb-6 space-y-2">
          {output.clinicalAlerts.map((alert, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border flex items-start gap-3 text-xs font-medium ${
                alert.includes("LETHAL DISASTER") || alert.includes("PULMONARY FLOODING")
                  ? "bg-rose-950/70 border-rose-600 text-rose-200 animate-pulse"
                  : alert.includes("SEVERE VENTILATORY STEAL") || alert.includes("SUCTION DILEMMA")
                  ? "bg-amber-950/70 border-amber-600 text-amber-200"
                  : "bg-cyan-950/70 border-cyan-600 text-cyan-200"
              }`}
            >
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{alert}</span>
            </div>
          ))}
        </div>
      )}

      {/* Main Interactive Tab Navigation */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex border-b border-slate-800 overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab("steal_cerfolio")}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
              activeTab === "steal_cerfolio"
                ? "border-cyan-500 text-cyan-400 bg-cyan-950/20"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Gauge className="w-4 h-4" /> 1. Ventilatory Steal & Cerfolio Classification
          </button>
          <button
            onClick={() => setActiveTab("ilv_dual_vent")}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
              activeTab === "ilv_dual_vent"
                ? "border-cyan-500 text-cyan-400 bg-cyan-950/20"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Layers className="w-4 h-4" /> 2. Dual-Ventilator Independent Lung Ventilation (ILV)
          </button>
          <button
            onClick={() => setActiveTab("suction_dilemma")}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
              activeTab === "suction_dilemma"
                ? "border-cyan-500 text-cyan-400 bg-cyan-950/20"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Droplets className="w-4 h-4" /> 3. Pleural Suction vs Water Seal Dilemma & Clamping Hazard
          </button>
          <button
            onClick={() => setActiveTab("interventions")}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
              activeTab === "interventions"
                ? "border-cyan-500 text-cyan-400 bg-cyan-950/20"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Scissors className="w-4 h-4" /> 4. Interventional EBV Valves & Surgical Flap Coverage
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      <div className="max-w-7xl mx-auto">
        {/* Tab 1: Ventilatory Steal & Cerfolio Classification */}
        {activeTab === "steal_cerfolio" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
                <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
                  <Wind className="w-5 h-5 text-cyan-400" /> Cerfolio Air Leak Classification System
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {(
                    [
                      { id: "CLASS_C_CONTINUOUS", label: "Class C: Continuous Leak", desc: "Air leak present throughout both inspiration AND expiration. Indicates large central BPF." },
                      { id: "CLASS_I_INSPIRATORY", label: "Class I: Inspiratory Only", desc: "Air leak emerges only during active positive pressure inspiratory cycle of ventilator." },
                      { id: "CLASS_E_EXPIRATORY", label: "Class E: Expiratory Only", desc: "Air leak occurs only on expiration (characteristic of peripheral alveolopleural parenchymal tear)." },
                      { id: "CLASS_F_FORCED_EXPIRATORY", label: "Class F: Forced / Cough", desc: "Leak occurs solely on forced expiration, deep sigh, or coughing; marks near-complete healing." }
                    ] as const
                  ).map(item => (
                    <button
                      key={item.id}
                      onClick={() => updateParam("cerfolioClass", item.id as CerfolioAirLeakClass)}
                      className={`p-3 rounded-xl border text-left transition ${
                        params.cerfolioClass === item.id
                          ? "bg-cyan-950 border-cyan-500 text-cyan-200 shadow-md"
                          : "bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800"
                      }`}
                    >
                      <span className="font-bold block text-slate-200">{item.label}</span>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                    </button>
                  ))}
                </div>

                {/* Steal Dynamics Explanation */}
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs text-slate-300">
                  <strong className="text-slate-100 block">The Ventilatory Steal Paradox:</strong>
                  Positive pressure delivered by the ventilator follows the path of least resistance: air preferentially pours across the open bronchial defect into the negative-pressure pleural space rather than inflating stiff, high-resistance alveoli. Setting higher tidal volumes or PEEP paradoxically increases air loss through the chest tube while deteriorating alveolar ventilation.
                </div>
              </div>
            </div>

            {/* Right Column: Airway & Leak Sliders */}
            <div className="space-y-6">
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
                <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
                  <Gauge className="w-5 h-5 text-sky-400" /> Fistula & Air Loss Metrics
                </h3>

                {/* Air Leak Volume Slider */}
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Air Leak Volume per Breath:</span>
                    <span className="font-mono font-bold text-rose-400">{params.airLeakVolumeMlPerBreath} mL</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="500"
                    step="10"
                    value={params.airLeakVolumeMlPerBreath}
                    onChange={e => updateParam("airLeakVolumeMlPerBreath", parseInt(e.target.value))}
                    className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>50 mL (Small)</span>
                    <span>250 mL (Moderate)</span>
                    <span>500 mL (Catastrophic)</span>
                  </div>
                </div>

                {/* Fistula Diameter Slider */}
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Fistula Orifice Diameter:</span>
                    <span className="font-mono font-bold text-sky-300">{params.fistulaDiameterMm} mm</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="12.0"
                    step="0.5"
                    value={params.fistulaDiameterMm}
                    onChange={e => updateParam("fistulaDiameterMm", parseFloat(e.target.value))}
                    className="w-full accent-sky-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>1 mm (Peripheral)</span>
                    <span>5 mm (Lobar)</span>
                    <span>12 mm (Main Bronchus)</span>
                  </div>
                </div>

                {/* Anatomic Location Selector */}
                <div className="space-y-1.5 text-xs">
                  <label className="block text-slate-400">Fistula Anatomic Location:</label>
                  <select
                    value={params.fistulaLocation}
                    onChange={e => updateParam("fistulaLocation", e.target.value as FistulaAnatomicLocation)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                  >
                    <option value="CENTRAL_MAIN_BRONCHUS">Central Mainstem Bronchial Stump (Post-Pneumonectomy)</option>
                    <option value="LOBAR_SEGMENTAL_BRONCHUS">Lobar / Segmental Bronchus (Post-Lobectomy)</option>
                    <option value="PERIPHERAL_ALVEOLOPLEURAL">Peripheral Alveolopleural (Parenchymal / Barotrauma)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Dual-Ventilator Independent Lung Ventilation (ILV) */}
        {activeTab === "ilv_dual_vent" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-400" /> Independent Lung Ventilation (ILV) Setup
              </h3>

              <div className="space-y-3 text-xs text-slate-300">
                {/* ILV Toggle Button */}
                <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div>
                    <span className="font-bold text-slate-200 block">Dual-Ventilator ILV via Left DLT:</span>
                    <span className="text-[11px] text-slate-400">Separates mechanical ventilation of each lung</span>
                  </div>
                  <button
                    onClick={() => updateParam("independentLungVentilationActive", !params.independentLungVentilationActive)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      params.independentLungVentilationActive
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {params.independentLungVentilationActive ? "Active (Dual Vents)" : "Single Vent (Standard ETT)"}
                  </button>
                </div>

                {/* Bronchoscopy Confirmation */}
                <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div>
                    <span className="font-bold text-slate-200 block">Fiberoptic Bronchoscopy DLT Check:</span>
                    <span className="text-[11px] text-slate-400">Blue bronchial cuff visual confirmation at carina</span>
                  </div>
                  <button
                    onClick={() => updateParam("dltPositionConfirmedBronchoscopically", !params.dltPositionConfirmedBronchoscopically)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      params.dltPositionConfirmedBronchoscopically
                        ? "bg-emerald-600 text-white"
                        : "bg-amber-600 text-slate-950"
                    }`}
                  >
                    {params.dltPositionConfirmedBronchoscopically ? "Confirmed Seated" : "Unverified"}
                  </button>
                </div>

                <div className="p-3 bg-indigo-950/40 border border-indigo-600/60 rounded-xl space-y-1.5">
                  <strong className="text-indigo-200 block">Physiological Rationale for ILV:</strong>
                  In large BPF, a single ventilator cannot simultaneously recruit the collapsed normal lung and depressurize the fistulous lung. ILV applies asymmetric settings: the healthy lung receives full tidal volume and protective PEEP to maintain oxygenation, while the fistula lung is rested on ultra-low tidal volume and zero PEEP (ZEEP), stopping continuous fistula shearing.
                </div>
              </div>
            </div>

            {/* Asymmetric Vent Settings Card */}
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
                <Gauge className="w-5 h-5 text-indigo-400" /> Asymmetric Lung Vent Titration
              </h3>

              <div className="space-y-4 text-xs">
                {/* Fistula Lung Vent */}
                <div className="p-3 bg-slate-950 border border-rose-900/60 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-rose-300">Fistula Lung (Pathologic):</span>
                    <span className="px-2 py-0.5 bg-rose-950 text-rose-300 text-[10px] rounded">Low Shear Target</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <span className="text-slate-400 block text-[10px]">TIDAL VOLUME</span>
                      <span className="font-bold text-sm text-slate-200">{params.fistulaLungTidalVolumeMl} mL (2 mL/kg)</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">PEEP SETTING</span>
                      <span className="font-bold text-sm text-emerald-400">{params.fistulaLungPeepCmH2O} cmH2O (ZEEP)</span>
                    </div>
                  </div>
                </div>

                {/* Healthy Lung Vent */}
                <div className="p-3 bg-slate-950 border border-emerald-900/60 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-emerald-300">Healthy Contralateral Lung:</span>
                    <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 text-[10px] rounded">Recruitment Target</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <span className="text-slate-400 block text-[10px]">TIDAL VOLUME</span>
                      <span className="font-bold text-sm text-slate-200">{params.healthyLungTidalVolumeMl} mL (6-8 mL/kg)</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">PEEP SETTING</span>
                      <span className="font-bold text-sm text-cyan-300">{params.healthyLungPeepCmH2O} cmH2O</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Pleural Suction vs Water Seal Dilemma & Clamping Hazard */}
        {activeTab === "suction_dilemma" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Suction Selector Card */}
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
                <Droplets className="w-5 h-5 text-cyan-400" /> Pleural Drainage Mode & Suction Dilemma
              </h3>

              <div className="space-y-2 text-xs">
                {(
                  [
                    { id: "HIGH_SUCTION_20", label: "High Continuous Suction (-20 cmH2O)", desc: "Maintains lung re-expansion, but maximizes transpulmonary pressure gradient, perpetuating fistula patency." },
                    { id: "LOW_SUCTION_10", label: "Low Suction (-10 cmH2O)", desc: "Balanced compromise: ensures pleural apposition while decreasing transpulmonary air leak velocity." },
                    { id: "WATER_SEAL_NO_SUCTION", label: "Water Seal (No Wall Suction)", desc: "Best for fistula closure if lung remains fully expanded against the parietal pleura." },
                    { id: "CLAMPED_HAZARD", label: "Clamped Chest Tube (CATASTROPHIC HAZARD)", desc: "LETHAL: Traps positive-pressure air inside thorax, creating rapid tension pneumothorax & PEA arrest." }
                  ] as const
                ).map(item => (
                  <button
                    key={item.id}
                    onClick={() => updateParam("pleuralDrainageMode", item.id as PleuralDrainageMode)}
                    className={`p-3 rounded-xl border text-left w-full transition ${
                      params.pleuralDrainageMode === item.id
                        ? item.id === "CLAMPED_HAZARD"
                          ? "bg-red-950 border-red-500 text-red-200 animate-pulse"
                          : "bg-cyan-950 border-cyan-500 text-cyan-200"
                        : "bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span>{item.label}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${item.id === "CLAMPED_HAZARD" ? "bg-red-900 text-red-200" : "bg-cyan-900/60 text-cyan-300"}`}>
                        {item.id === "CLAMPED_HAZARD" ? "FATAL" : "Drainage"}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Clamping Warning & Tension Pathophysiology */}
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
                <Skull className="w-5 h-5 text-red-500" /> The Chest Tube Clamping Catastrophe
              </h3>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3 text-xs text-slate-300">
                <p className="leading-relaxed">
                  In nursing units and transport, staff are sometimes tempted to clamp chest tubes to assess for leak resolution or prevent drainage siphoning. <strong>In mechanically ventilated patients with a bronchopleural fistula, clamping a chest tube is a lethal medical error.</strong>
                </p>

                <div className="p-3 bg-red-950/40 border border-red-600/60 rounded-xl text-xs text-red-200 space-y-1.5">
                  <strong className="text-red-100 block">Tension Pneumothorax Mechanism:</strong>
                  The mechanical ventilator pumps 400-500 mL of pressurized air into the trachea every few seconds. With the chest tube clamped, this positive-pressure gas has no escape route. Intrapleural pressure skyrockets above atmospheric pressure within 30-60 seconds, collapsing the lung, shifting the mediastinum, kinking the inferior vena cava, abolishing cardiac venous return, and inducing pulseless electrical activity (PEA) arrest.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Interventional EBV Valves & Surgical Flap Coverage */}
        {activeTab === "interventions" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bronchoscopic Interventions */}
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
                <Microscope className="w-5 h-5 text-sky-400" /> Interventional Bronchoscopy (EBV & Blood Patch)
              </h3>

              <div className="space-y-3 text-xs text-slate-300">
                {/* EBV Toggle */}
                <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div>
                    <span className="font-bold text-slate-200 block">One-Way Endobronchial Valves (EBV):</span>
                    <span className="text-[11px] text-slate-400">Spiration / Zephyr valves block inspiratory flow</span>
                  </div>
                  <button
                    onClick={() => updateParam("endobronchialValvesPlaced", !params.endobronchialValvesPlaced)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      params.endobronchialValvesPlaced
                        ? "bg-sky-600 text-white"
                        : "bg-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {params.endobronchialValvesPlaced ? "Deployed (Valved)" : "Not Placed"}
                  </button>
                </div>

                {/* Blood Patch Toggle */}
                <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div>
                    <span className="font-bold text-slate-200 block">Autologous Blood Patch (50-100 mL):</span>
                    <span className="text-[11px] text-slate-400">Instilled into chest drain for peripheral PAL</span>
                  </div>
                  <button
                    onClick={() => updateParam("autologousBloodPatchInstilled", !params.autologousBloodPatchInstilled)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      params.autologousBloodPatchInstilled
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {params.autologousBloodPatchInstilled ? "Instilled (Clotted)" : "Not Instilled"}
                  </button>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <strong className="text-slate-100 block mb-1">EBV Mechanism:</strong>
                  The one-way silicone duckbill valve is placed into the segmental feeding bronchus. During inspiration, negative pleural pressure or positive ventilator pressure closes the valve leaflets, preventing airflow into the fistula. During expiration, coughing, and secretion clearance, positive alveolar pressure forces the leaflets open, allowing mucus and gas to escape without air-trapping.
                </div>
              </div>
            </div>

            {/* Thoracic Surgical Reconstruction */}
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
                <Scissors className="w-5 h-5 text-indigo-400" /> Surgical Muscle Flap Re-Exploration
              </h3>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div>
                    <span className="font-bold text-slate-200 block">Vascularized Pedicle Muscle Flap:</span>
                    <span className="text-[11px] text-slate-400">Latissimus dorsi / serratus / omental wrap</span>
                  </div>
                  <button
                    onClick={() => updateParam("surgicalStumpFlapCoverageDone", !params.surgicalStumpFlapCoverageDone)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      params.surgicalStumpFlapCoverageDone
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {params.surgicalStumpFlapCoverageDone ? "Flap Repaired (Sealed)" : "Dehisced Stump"}
                  </button>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <strong className="text-slate-100 block mb-1">Indications for Surgical Revision:</strong>
                  Early post-pneumonectomy stump dehiscence (&gt; 5 mm) within the first 1-2 weeks requires urgent surgical re-exploration before severe empyema and mediastinal sepsis consolidate. A vascularized intercostal, latissimus dorsi, or omental flap brings fresh blood supply, promotes fibroblast proliferation, and seals the cartilaginous defect.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
