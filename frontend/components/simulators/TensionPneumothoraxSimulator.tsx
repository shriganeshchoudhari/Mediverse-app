"use client";

import React, { useState, useMemo } from "react";
import {
  Wind,
  Activity,
  AlertTriangle,
  Heart,
  ShieldCheck,
  Stethoscope,
  Scissors,
  Zap,
  CheckCircle2,
  AlertCircle,
  Droplets,
  Layers,
  ArrowRight
} from "lucide-react";
import {
  TensionPneumoPatientParams,
  DecompressionIntervention,
  NeedleCatheterLength,
  DEFAULT_TENSION_PNEUMO_PATIENT,
  computeTensionPneumothoraxPhysiology
} from "../../.gemini/skills/TensionPneumothoraxEngine";

export default function TensionPneumothoraxSimulator() {
  const [params, setParams] = useState<TensionPneumoPatientParams>(DEFAULT_TENSION_PNEUMO_PATIENT);
  const [activeTab, setActiveTab] = useState<"mechanics" | "intervention" | "drainage">("mechanics");

  const output = useMemo(() => computeTensionPneumothoraxPhysiology(params), [params]);

  const updateParam = <K extends keyof TensionPneumoPatientParams>(
    key: K,
    value: TensionPneumoPatientParams[K]
  ) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  // Case Vignettes / Presets
  const applyPreset = (
    presetKey:
      | "icu_barotrauma"
      | "needle_failure_mcl"
      | "finger_thoracostomy_trauma"
      | "massive_hemothorax_autotransfusion"
      | "bronchopleural_fistula"
  ) => {
    switch (presetKey) {
      case "icu_barotrauma":
        setParams({
          ...DEFAULT_TENSION_PNEUMO_PATIENT,
          patientBmi: 25,
          sideAffected: "RIGHT",
          pneumothoraxTensionActive: true,
          intrapleuralAirVolumeMl: 2000,
          hemothoraxPresent: false,
          pleuralBloodVolumeMl: 0,
          mechanicalVentilationPositivePressure: true,
          interventionApplied: "NONE",
          needleLength: "STANDARD_4_5_CM",
          autotransfusionActive: false,
          bronchopleuralFistulaActive: false
        });
        break;
      case "needle_failure_mcl":
        setParams({
          ...DEFAULT_TENSION_PNEUMO_PATIENT,
          patientBmi: 34, // Thick chest wall
          sideAffected: "RIGHT",
          pneumothoraxTensionActive: true,
          intrapleuralAirVolumeMl: 1800,
          hemothoraxPresent: false,
          pleuralBloodVolumeMl: 0,
          mechanicalVentilationPositivePressure: true,
          interventionApplied: "NEEDLE_2ND_ICS_MCL",
          needleLength: "STANDARD_4_5_CM", // Short needle fails in thick wall!
          autotransfusionActive: false,
          bronchopleuralFistulaActive: false
        });
        break;
      case "finger_thoracostomy_trauma":
        setParams({
          ...DEFAULT_TENSION_PNEUMO_PATIENT,
          patientBmi: 28,
          sideAffected: "LEFT",
          pneumothoraxTensionActive: true,
          intrapleuralAirVolumeMl: 1600,
          hemothoraxPresent: false,
          pleuralBloodVolumeMl: 0,
          mechanicalVentilationPositivePressure: true,
          interventionApplied: "FINGER_THORACOSTOMY",
          needleLength: "EXTENDED_8_0_CM",
          autotransfusionActive: false,
          bronchopleuralFistulaActive: false
        });
        break;
      case "massive_hemothorax_autotransfusion":
        setParams({
          ...DEFAULT_TENSION_PNEUMO_PATIENT,
          patientBmi: 26,
          sideAffected: "RIGHT",
          pneumothoraxTensionActive: true,
          intrapleuralAirVolumeMl: 800,
          hemothoraxPresent: true,
          pleuralBloodVolumeMl: 1650, // >= 1500 mL massive
          mechanicalVentilationPositivePressure: true,
          interventionApplied: "TUBE_THORACOSTOMY",
          chestTubeSizeFr: 36,
          suctionPressureCmH2O: -20,
          autotransfusionActive: true,
          bronchopleuralFistulaActive: false
        });
        break;
      case "bronchopleural_fistula":
        setParams({
          ...DEFAULT_TENSION_PNEUMO_PATIENT,
          patientBmi: 24,
          sideAffected: "RIGHT",
          pneumothoraxTensionActive: false,
          intrapleuralAirVolumeMl: 400,
          hemothoraxPresent: false,
          pleuralBloodVolumeMl: 0,
          mechanicalVentilationPositivePressure: true,
          interventionApplied: "TUBE_THORACOSTOMY",
          chestTubeSizeFr: 28,
          suctionPressureCmH2O: -20,
          autotransfusionActive: false,
          bronchopleuralFistulaActive: true
        });
        break;
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Wind className="w-7 h-7" />
            </span>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                Tension Pneumothorax &amp; Thoracic Decompression Workstation
              </h1>
              <p className="text-sm text-slate-400">
                Obstructive Shock Hemodynamics, Needle vs Finger vs Tube Thoracostomy, 3-Bottle Drainage &amp; Massive Hemothorax
              </p>
            </div>
          </div>
        </div>

        {/* Global Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <div className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 ${
            output.intrapleuralPressureCmH2O > 0
              ? "bg-rose-950/80 border-rose-500 text-rose-300 animate-pulse"
              : "bg-teal-950/80 border-teal-500 text-teal-300"
          }`}>
            <Activity className="w-3.5 h-3.5" />
            <span>P(pleural): {output.intrapleuralPressureCmH2O > 0 ? `+${output.intrapleuralPressureCmH2O}` : output.intrapleuralPressureCmH2O} cmH2O</span>
          </div>

          <div className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 ${
            output.mediastinalShiftMm >= 15
              ? "bg-rose-950 border-rose-600 text-rose-300"
              : output.mediastinalShiftMm > 0
              ? "bg-amber-950 border-amber-600 text-amber-300"
              : "bg-slate-900 border-slate-800 text-slate-400"
          }`}>
            <Heart className="w-3.5 h-3.5" />
            <span>Shift: {output.mediastinalShiftMm} mm ({output.trachealDeviation.replace(/_/g, " ")})</span>
          </div>

          <div className={`px-3 py-1.5 rounded-lg border text-xs font-semibold ${
            output.systolicBp < 90
              ? "bg-rose-900/80 border-rose-500 text-rose-200 animate-pulse"
              : "bg-emerald-950/60 border-emerald-500 text-emerald-300"
          }`}>
            <span>BP: {output.systolicBp} mmHg (IVC &darr;{output.cardiacPreloadReductionPct}%)</span>
          </div>

          <div className={`px-3 py-1.5 rounded-lg border text-xs font-semibold ${
            output.decompressionSuccess
              ? "bg-emerald-950 border-emerald-500 text-emerald-300"
              : params.interventionApplied !== "NONE"
              ? "bg-rose-950 border-rose-500 text-rose-300 animate-pulse"
              : "bg-slate-900 border-slate-800 text-slate-400"
          }`}>
            <span>{output.decompressionSuccess ? "DECOMPRESSED" : params.interventionApplied !== "NONE" ? "FAILED NEEDLE" : "UNRELIEVED"}</span>
          </div>
        </div>
      </div>

      {/* Preset Vignette Selector */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>Clinical Case Vignettes:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 w-full md:w-auto">
          <button
            onClick={() => applyPreset("icu_barotrauma")}
            className="px-2.5 py-1.5 text-xs rounded-lg bg-rose-950/40 hover:bg-rose-900/50 border border-rose-600/40 text-rose-300 transition text-left"
          >
            1. ICU Ventilator Barotrauma
          </button>
          <button
            onClick={() => applyPreset("needle_failure_mcl")}
            className="px-2.5 py-1.5 text-xs rounded-lg bg-amber-950/40 hover:bg-amber-900/50 border border-amber-600/40 text-amber-300 transition text-left"
          >
            2. 2nd ICS MCL Needle Failure
          </button>
          <button
            onClick={() => applyPreset("finger_thoracostomy_trauma")}
            className="px-2.5 py-1.5 text-xs rounded-lg bg-teal-950/40 hover:bg-teal-900/50 border border-teal-600/40 text-teal-300 transition text-left"
          >
            3. Finger Thoracostomy Rescue
          </button>
          <button
            onClick={() => applyPreset("massive_hemothorax_autotransfusion")}
            className="px-2.5 py-1.5 text-xs rounded-lg bg-red-950/40 hover:bg-red-900/50 border border-red-600/40 text-red-300 transition text-left"
          >
            4. Massive Hemothorax &amp; AutoTx
          </button>
          <button
            onClick={() => applyPreset("bronchopleural_fistula")}
            className="px-2.5 py-1.5 text-xs rounded-lg bg-indigo-950/40 hover:bg-indigo-900/50 border border-indigo-600/40 text-indigo-300 transition text-left"
          >
            5. Bronchopleural Air Leak Gr 5
          </button>
        </div>
      </div>

      {/* Critical Alert Banners */}
      {output.clinicalAlerts.map((alert, idx) => (
        <div
          key={idx}
          className={`p-4 rounded-xl border flex items-start gap-3 ${
            alert.level === "CRITICAL"
              ? "bg-rose-950/50 border-rose-500/60 text-rose-200"
              : alert.level === "WARNING"
              ? "bg-amber-950/40 border-amber-500/50 text-amber-200"
              : alert.level === "SUCCESS"
              ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-200"
              : "bg-sky-950/40 border-sky-500/50 text-sky-200"
          }`}
        >
          {alert.level === "CRITICAL" ? (
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          ) : alert.level === "WARNING" ? (
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          )}
          <div className="space-y-1">
            <h4 className="font-semibold text-sm">{alert.message}</h4>
            <p className="text-xs opacity-90 leading-relaxed">{alert.rationale}</p>
          </div>
        </div>
      ))}

      {/* Hero Physical Exam & Hemodynamics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Blood Pressure & Obstructive Shock */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${output.systolicBp < 90 ? "bg-rose-500 animate-ping" : "bg-emerald-400"}`}></span>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Blood Pressure / Shock
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
              MAP {output.meanArterialPressure}
            </span>
          </div>
          <div className="py-4 text-center">
            <div className={`text-4xl md:text-5xl font-extrabold font-mono ${
              output.systolicBp < 90 ? "text-rose-400" : "text-emerald-400"
            }`}>
              {output.systolicBp}<span className="text-2xl font-normal text-slate-400">/{(output.systolicBp * 0.65).toFixed(0)}</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Heart Rate: <span className="font-mono text-amber-300 font-bold">{output.heartRateBpm} bpm</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 text-center bg-slate-950/60 py-1.5 rounded-lg border border-slate-800/80">
            IVC Preload Collapsed: <span className="text-rose-400 font-bold">{output.cardiacPreloadReductionPct}%</span>
          </div>
        </div>

        {/* Trachea & Mediastinum */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Trachea &amp; Mediastinum
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950/80 text-amber-400 border border-amber-800/60 font-mono">
              {params.sideAffected} TENSION
            </span>
          </div>
          <div className="py-4 text-center">
            <div className={`text-4xl md:text-5xl font-extrabold font-mono ${
              output.mediastinalShiftMm >= 15 ? "text-rose-400" : output.mediastinalShiftMm > 0 ? "text-amber-400" : "text-emerald-400"
            }`}>
              {output.mediastinalShiftMm}<span className="text-2xl font-normal text-slate-400">mm</span>
            </div>
            <div className="text-xs text-slate-300 mt-1 font-semibold">
              {output.trachealDeviation.replace(/_/g, " ")}
            </div>
          </div>
          <div className="text-[11px] text-slate-400 text-center bg-slate-950/60 py-1.5 rounded-lg border border-slate-800/80">
            Deviates away from the affected {params.sideAffected} hemithorax
          </div>
        </div>

        {/* Auscultation & Percussion */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5" />
              Auscultation
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
              Physical Exam
            </span>
          </div>
          <div className="py-3 text-center space-y-2">
            <div>
              <div className="text-xs text-slate-400">Breath Sounds:</div>
              <div className={`text-lg font-bold ${
                output.breathSoundsIpsilateral === "ABSENT" ? "text-rose-400" : "text-emerald-400"
              }`}>
                {output.breathSoundsIpsilateral}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Percussion Note:</div>
              <div className="text-xs font-semibold text-amber-300">
                {output.percussionNote.replace(/_/g, " ")}
              </div>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 text-center bg-slate-950/60 py-1.5 rounded-lg border border-slate-800/80">
            SpO2: <span className="font-mono text-cyan-400 font-bold">{output.oxygenSaturationSpO2}%</span>
          </div>
        </div>

        {/* Chest Wall & Needle Depth */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              Chest Wall Depth
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
              BMI {params.patientBmi}
            </span>
          </div>
          <div className="py-4 text-center">
            <div className="text-4xl md:text-5xl font-extrabold text-amber-400 font-mono">
              {output.chestWallThicknessMm}<span className="text-2xl font-normal text-slate-400">mm</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Catheter: <span className="font-mono text-cyan-300 font-bold">
                {params.needleLength === "STANDARD_4_5_CM" ? "45 mm (1.75 in)" : "80 mm (3.25 in)"}
              </span>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 text-center bg-slate-950/60 py-1.5 rounded-lg border border-slate-800/80">
            {params.needleLength === "STANDARD_4_5_CM" && output.chestWallThicknessMm >= 45 ? (
              <span className="text-rose-400 font-bold">Catheter too short to penetrate pleura!</span>
            ) : (
              <span className="text-emerald-400 font-bold">Catheter exceeds chest wall depth</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Interactive Controls & Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Sub-Tab Navigation */}
          <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
            <button
              onClick={() => setActiveTab("mechanics")}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                activeTab === "mechanics"
                  ? "bg-amber-600 text-white shadow-lg shadow-amber-600/30"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              <Wind className="w-3.5 h-3.5" />
              1. Pneumothorax Mechanics
            </button>
            <button
              onClick={() => setActiveTab("intervention")}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                activeTab === "intervention"
                  ? "bg-amber-600 text-white shadow-lg shadow-amber-600/30"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              <Scissors className="w-3.5 h-3.5" />
              2. Decompression Bench
            </button>
            <button
              onClick={() => setActiveTab("drainage")}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                activeTab === "drainage"
                  ? "bg-amber-600 text-white shadow-lg shadow-amber-600/30"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              <Droplets className="w-3.5 h-3.5" />
              3. 3-Bottle Drainage &amp; AutoTx
            </button>
          </div>

          {/* TAB 1: Pneumothorax Mechanics */}
          {activeTab === "mechanics" && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-5">
              <div>
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <Wind className="w-4 h-4 text-amber-400" />
                  Pneumothorax Dynamics &amp; Airway Pressures
                </h3>
                <p className="text-xs text-slate-400">
                  Configure the one-way valve pleural defect, air trapping volume, and positive-pressure mechanical ventilation.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Hemithorax Affected</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateParam("sideAffected", "LEFT")}
                      className={`flex-1 py-2 rounded-lg text-xs font-semibold border ${
                        params.sideAffected === "LEFT"
                          ? "bg-amber-950/80 border-amber-500 text-amber-300"
                          : "bg-slate-950 border-slate-800 text-slate-400"
                      }`}
                    >
                      Left Hemithorax
                    </button>
                    <button
                      onClick={() => updateParam("sideAffected", "RIGHT")}
                      className={`flex-1 py-2 rounded-lg text-xs font-semibold border ${
                        params.sideAffected === "RIGHT"
                          ? "bg-amber-950/80 border-amber-500 text-amber-300"
                          : "bg-slate-950 border-slate-800 text-slate-400"
                      }`}
                    >
                      Right Hemithorax
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Intrapleural Air Volume:</span>
                    <span className="font-mono text-amber-400 font-bold">{params.intrapleuralAirVolumeMl} mL</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={2500}
                    step={100}
                    value={params.intrapleuralAirVolumeMl}
                    onChange={(e) => updateParam("intrapleuralAirVolumeMl", parseInt(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                  <div className="text-[10px] text-slate-500">&gt; 1000 mL generates positive tension pressure</div>
                </div>

                {/* Positive Pressure Mechanical Ventilation Toggle */}
                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 flex items-center justify-between sm:col-span-2">
                  <div>
                    <div className="text-xs font-bold text-white">Mechanical Positive Pressure Ventilation</div>
                    <div className="text-[11px] text-slate-400">
                      Positive pressure inflates air through pleural tear continuously, accelerating tension collapse.
                    </div>
                  </div>
                  <button
                    onClick={() => updateParam("mechanicalVentilationPositivePressure", !params.mechanicalVentilationPositivePressure)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      params.mechanicalVentilationPositivePressure
                        ? "bg-amber-600 text-white"
                        : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                    }`}
                  >
                    {params.mechanicalVentilationPositivePressure ? "Ventilator Active" : "Spontaneous Breathing"}
                  </button>
                </div>

                {/* Hemothorax Co-existence Toggle */}
                <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800 sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-white">Co-Existing Hemothorax (Hemopneumothorax)</div>
                      <div className="text-[11px] text-slate-400">
                        Blood pooling in dependent pleural space from chest trauma or vessel laceration.
                      </div>
                    </div>
                    <button
                      onClick={() => updateParam("hemothoraxPresent", !params.hemothoraxPresent)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                        params.hemothoraxPresent
                          ? "bg-rose-600 text-white"
                          : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                      }`}
                    >
                      {params.hemothoraxPresent ? "Hemothorax Active" : "Air Only"}
                    </button>
                  </div>
                  {params.hemothoraxPresent && (
                    <div className="pt-2">
                      <div className="flex justify-between text-xs text-slate-300">
                        <span>Pleural Blood Volume:</span>
                        <span className={`font-mono font-bold ${params.pleuralBloodVolumeMl >= 1500 ? "text-rose-400" : "text-amber-400"}`}>
                          {params.pleuralBloodVolumeMl} mL {params.pleuralBloodVolumeMl >= 1500 && "(MASSIVE HEMOTHORAX)"}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={100}
                        max={2000}
                        step={50}
                        value={params.pleuralBloodVolumeMl}
                        onChange={(e) => updateParam("pleuralBloodVolumeMl", parseInt(e.target.value))}
                        className="w-full accent-rose-500"
                      />
                    </div>
                  )}
                </div>

                {/* Bronchopleural Fistula Toggle */}
                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 flex items-center justify-between sm:col-span-2">
                  <div>
                    <div className="text-xs font-bold text-white">Bronchopleural Fistula (Parenchymal Air Leak)</div>
                    <div className="text-[11px] text-slate-400">
                      Persistent defect in visceral pleura causing continuous Grade 5 bubbling in water seal chamber.
                    </div>
                  </div>
                  <button
                    onClick={() => updateParam("bronchopleuralFistulaActive", !params.bronchopleuralFistulaActive)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      params.bronchopleuralFistulaActive
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                    }`}
                  >
                    {params.bronchopleuralFistulaActive ? "Fistula Present" : "Intact Visceral Pleura"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Decompression Bench */}
          {activeTab === "intervention" && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-5">
              <div>
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <Scissors className="w-4 h-4 text-amber-400" />
                  Thoracic Decompression Procedure &amp; Anatomical Sites
                </h3>
                <p className="text-xs text-slate-400">
                  Select decompression modality: traditional 2nd ICS MCL vs ATLS 10th Ed 5th ICS AAL vs Finger Thoracostomy vs Chest Tube.
                </p>
              </div>

              {/* Intervention Selector */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300">Decompression Modality</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() => updateParam("interventionApplied", "NONE")}
                    className={`p-3 rounded-xl border text-left text-xs transition ${
                      params.interventionApplied === "NONE"
                        ? "bg-rose-950/80 border-rose-500 text-rose-200"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div className="font-bold">None (Unrelieved Tension)</div>
                    <div className="text-[11px] opacity-80 mt-0.5">Progressive obstructive shock and impending arrest</div>
                  </button>

                  <button
                    onClick={() => updateParam("interventionApplied", "NEEDLE_2ND_ICS_MCL")}
                    className={`p-3 rounded-xl border text-left text-xs transition ${
                      params.interventionApplied === "NEEDLE_2ND_ICS_MCL"
                        ? "bg-amber-950/80 border-amber-500 text-amber-200"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div className="font-bold">Needle 2nd ICS Midclavicular Line</div>
                    <div className="text-[11px] opacity-80 mt-0.5">Traditional site; high failure rate in thick chest walls</div>
                  </button>

                  <button
                    onClick={() => updateParam("interventionApplied", "NEEDLE_5TH_ICS_AAL")}
                    className={`p-3 rounded-xl border text-left text-xs transition ${
                      params.interventionApplied === "NEEDLE_5TH_ICS_AAL"
                        ? "bg-teal-950/80 border-teal-500 text-teal-200"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div className="font-bold">Needle 5th ICS Anterior Axillary Line</div>
                    <div className="text-[11px] opacity-80 mt-0.5">ATLS 10th Ed preferred; thinner wall &amp; lower failure rate</div>
                  </button>

                  <button
                    onClick={() => updateParam("interventionApplied", "FINGER_THORACOSTOMY")}
                    className={`p-3 rounded-xl border text-left text-xs transition ${
                      params.interventionApplied === "FINGER_THORACOSTOMY"
                        ? "bg-emerald-950/80 border-emerald-500 text-emerald-200"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div className="font-bold">Finger Thoracostomy (Simple)</div>
                    <div className="text-[11px] opacity-80 mt-0.5">Rapid scalpel &amp; blunt finger entry in Triangle of Safety</div>
                  </button>

                  <button
                    onClick={() => updateParam("interventionApplied", "TUBE_THORACOSTOMY")}
                    className={`p-3 rounded-xl border text-left text-xs transition sm:col-span-2 ${
                      params.interventionApplied === "TUBE_THORACOSTOMY"
                        ? "bg-cyan-950/80 border-cyan-500 text-cyan-200"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div className="font-bold">Formal Tube Thoracostomy (Chest Tube + 3-Bottle Drainage)</div>
                    <div className="text-[11px] opacity-80 mt-0.5">Definitive large-bore evacuation connected to water seal and -20 cmH2O suction</div>
                  </button>
                </div>
              </div>

              {/* Needle Length & BMI Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <label className="text-xs font-medium text-slate-300">Needle Catheter Length</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateParam("needleLength", "STANDARD_4_5_CM")}
                      className={`flex-1 py-2 rounded-lg text-xs font-semibold border ${
                        params.needleLength === "STANDARD_4_5_CM"
                          ? "bg-amber-950/80 border-amber-500 text-amber-300"
                          : "bg-slate-900 border-slate-800 text-slate-400"
                      }`}
                    >
                      4.5 cm (1.75") Standard
                    </button>
                    <button
                      onClick={() => updateParam("needleLength", "EXTENDED_8_0_CM")}
                      className={`flex-1 py-2 rounded-lg text-xs font-semibold border ${
                        params.needleLength === "EXTENDED_8_0_CM"
                          ? "bg-teal-950/80 border-teal-500 text-teal-300"
                          : "bg-slate-900 border-slate-800 text-slate-400"
                      }`}
                    >
                      8.0 cm (3.25") Extended
                    </button>
                  </div>
                  <div className="text-[10px] text-slate-500">8 cm needle required for reliable penetration in &gt; 90% of adults</div>
                </div>

                <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Patient Body Mass Index (BMI):</span>
                    <span className="font-mono text-amber-400 font-bold">{params.patientBmi} kg/m&sup2;</span>
                  </div>
                  <input
                    type="range"
                    min={18}
                    max={42}
                    step={1}
                    value={params.patientBmi}
                    onChange={(e) => updateParam("patientBmi", parseInt(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                  <div className="text-[10px] text-slate-500">BMI directly increases chest wall thickness</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 3-Bottle Drainage & Autotransfusion */}
          {activeTab === "drainage" && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-5">
              <div>
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-cyan-400" />
                  Three-Bottle Chest Drainage System &amp; Autotransfusion
                </h3>
                <p className="text-xs text-slate-400">
                  Mechanics of the collection chamber, water seal with respiratory tidaling, air leak metering, and suction regulation.
                </p>
              </div>

              {/* Three-Bottle Schematic Display */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Bottle 1: Collection Chamber */}
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
                  <div className="text-xs font-bold text-slate-300 border-b border-slate-800 pb-1.5">
                    1. Collection Chamber
                  </div>
                  <div className="py-3 text-center">
                    <div className={`text-2xl font-mono font-extrabold ${
                      output.threeBottleDrainageState.collectionChamberBloodMl >= 1500 ? "text-rose-400" : "text-amber-400"
                    }`}>
                      {output.threeBottleDrainageState.collectionChamberBloodMl} mL
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">Shed pleural fluid/blood</div>
                  </div>
                  <div className="text-[10px] text-slate-400 text-center">
                    Threshold &ge; 1500 mL = Massive
                  </div>
                </div>

                {/* Bottle 2: Water Seal Chamber */}
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
                  <div className="text-xs font-bold text-slate-300 border-b border-slate-800 pb-1.5">
                    2. Water Seal Chamber
                  </div>
                  <div className="py-3 text-center">
                    <div className="text-xl font-mono font-extrabold text-cyan-400">
                      Tidaling: {output.threeBottleDrainageState.waterSealTidalingMm} mm
                    </div>
                    <div className="text-xs text-slate-300 mt-1 font-semibold">
                      Air Leak: Grade {output.threeBottleDrainageState.airLeakGrade} / 5
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-400 text-center">
                    {output.threeBottleDrainageState.airLeakGrade === 5 ? "Continuous Fistula Leak!" : "One-way water valve"}
                  </div>
                </div>

                {/* Bottle 3: Suction Control Chamber */}
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
                  <div className="text-xs font-bold text-slate-300 border-b border-slate-800 pb-1.5">
                    3. Suction Chamber
                  </div>
                  <div className="py-3 text-center">
                    <div className="text-2xl font-mono font-extrabold text-teal-400">
                      {params.suctionPressureCmH2O} cmH2O
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      {output.threeBottleDrainageState.suctionBubbleStatus.replace(/_/g, " ")}
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-400 text-center">
                    Regulated by water height
                  </div>
                </div>
              </div>

              {/* Suction & Tube Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Suction Pressure Level:</span>
                    <span className="font-mono text-teal-400 font-bold">{params.suctionPressureCmH2O} cmH2O</span>
                  </div>
                  <input
                    type="range"
                    min={-40}
                    max={0}
                    step={5}
                    value={params.suctionPressureCmH2O}
                    onChange={(e) => updateParam("suctionPressureCmH2O", parseInt(e.target.value))}
                    className="w-full accent-teal-500"
                  />
                  <div className="text-[10px] text-slate-500">Standard ICU/trauma suction is -20 cmH2O</div>
                </div>

                <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Chest Tube Caliber:</span>
                    <span className="font-mono text-cyan-400 font-bold">{params.chestTubeSizeFr} Fr</span>
                  </div>
                  <input
                    type="range"
                    min={14}
                    max={36}
                    step={2}
                    value={params.chestTubeSizeFr}
                    onChange={(e) => updateParam("chestTubeSizeFr", parseInt(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                  <div className="text-[10px] text-slate-500">28-36 Fr recommended for hemothorax to prevent clotting</div>
                </div>

                {/* Autotransfusion Toggle */}
                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 flex items-center justify-between sm:col-span-2">
                  <div>
                    <div className="text-xs font-bold text-white">Autologous Pleural Blood Autotransfusion</div>
                    <div className="text-[11px] text-slate-400">
                      Filter and re-infuse warm, fresh autologous shed pleural blood immediately during hemorrhagic shock.
                    </div>
                  </div>
                  <button
                    onClick={() => updateParam("autotransfusionActive", !params.autotransfusionActive)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                      params.autotransfusionActive
                        ? "bg-rose-600 text-white shadow-md"
                        : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                    }`}
                  >
                    {params.autotransfusionActive ? "Autotransfusion Active" : "Disabled"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Physiological Dashboards & Trauma Surgery Hub (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Emergency Thoracotomy & Surgical Alert Box */}
          <div className={`rounded-2xl p-5 border ${
            output.emergencyThoracotomyIndicated
              ? "bg-rose-950/80 border-rose-500 text-rose-100 animate-pulse shadow-xl shadow-rose-950/50"
              : "bg-slate-900/90 border-slate-800 text-slate-200"
          }`}>
            <div className="flex items-center gap-2 mb-2 font-bold text-sm">
              <Scissors className="w-5 h-5 text-rose-400" />
              <span>Trauma Surgery / Thoracotomy Status:</span>
            </div>
            <div className="text-xs leading-relaxed">
              {output.emergencyThoracotomyIndicated ? (
                <div>
                  <span className="font-extrabold text-white uppercase tracking-wider block mb-1">
                    CRITICAL INDICATION FOR EMERGENCY THORACOTOMY:
                  </span>
                  Initial chest tube output of {output.threeBottleDrainageState.collectionChamberBloodMl} mL exceeds the &ge; 1500 mL threshold (or &gt; 200 mL/h ongoing). Immediate operating room transfer required for surgical hemostasis.
                </div>
              ) : (
                <div>
                  Chest drainage output currently below operative thoracotomy thresholds. Continue close monitoring of hourly chest tube drainage and vitals.
                </div>
              )}
            </div>
          </div>

          {/* Autotransfusion Yield Display */}
          {params.autotransfusionActive && output.autotransfusionYieldMl > 0 && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-rose-400" />
                  Autotransfused Blood Volume:
                </div>
                <div className="text-[11px] text-slate-400">Warm autologous RBCs with 2,3-DPG</div>
              </div>
              <div className="text-2xl font-mono font-extrabold text-rose-400">
                {output.autotransfusionYieldMl} mL
              </div>
            </div>
          )}

          {/* ATLS 10th Edition Anatomical Pearls Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              ATLS 10th Edition Evidence-Based Pearls
            </h3>
            <ul className="text-xs text-slate-300 space-y-2.5 leading-relaxed list-disc list-inside">
              <li>
                <span className="font-semibold text-white">5th ICS AAL is Superior:</span> ATLS updated needle thoracostomy to the 5th intercostal space anterior axillary line because chest wall thickness is ~1 cm thinner than the 2nd ICS MCL.
              </li>
              <li>
                <span className="font-semibold text-white">Catheter Length Matters:</span> Standard 4.5 cm (1.75") catheters fail in up to 50% of adult patients. An 8 cm (3.25") catheter is required for reliable pleural entry.
              </li>
              <li>
                <span className="font-semibold text-white">Finger Thoracostomy in Ventilated Trauma:</span> In intubated patients with traumatic arrest or tension, simple finger thoracostomy into the pleural space provides definitive venting without risk of catheter occlusion.
              </li>
              <li>
                <span className="font-semibold text-white">Water Seal Tidaling:</span> Fluctuation of the water column indicates pleural communication. Cessation of tidaling signifies either complete lung re-expansion or tube occlusion.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
