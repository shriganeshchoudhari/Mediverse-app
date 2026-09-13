"use client";

import React, { useState, useMemo } from "react";
import {
  Droplets,
  Activity,
  AlertTriangle,
  Heart,
  ShieldCheck,
  Stethoscope,
  Wind,
  Zap,
  CheckCircle2,
  AlertCircle,
  Pill,
  Syringe,
  FlaskConical,
  TestTube
} from "lucide-react";
import {
  MethemoglobinPatientParams,
  ToxinEtiology,
  DEFAULT_METHB_PATIENT,
  computeMethemoglobinKinetics
} from "../../.gemini/skills/MethemoglobinemiaEngine";

export default function MethemoglobinSimulator() {
  const [params, setParams] = useState<MethemoglobinPatientParams>(DEFAULT_METHB_PATIENT);
  const [activeTab, setActiveTab] = useState<"toxin" | "genetics" | "antidote">("toxin");

  const output = useMemo(() => computeMethemoglobinKinetics(params), [params]);

  const updateParam = <K extends keyof MethemoglobinPatientParams>(
    key: K,
    value: MethemoglobinPatientParams[K]
  ) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  // Case Vignettes / Clinical Presets
  const applyPreset = (
    presetKey:
      | "benzocaine_post_tee"
      | "dapsone_rebound"
      | "g6pd_crisis"
      | "sulfhemoglobinemia"
      | "lethal_nitrite_exchange"
  ) => {
    switch (presetKey) {
      case "benzocaine_post_tee":
        setParams({
          ...DEFAULT_METHB_PATIENT,
          etiology: "BENZOCAINE",
          baselineMetHbPct: 38,
          sulfhemoglobinPresent: false,
          sulfHbPct: 0,
          g6pdDeficient: false,
          concurrentSsriUse: false,
          methyleneBlueDoseMgKg: 0,
          ascorbicAcidDoseGrams: 0,
          exchangeTransfusionCompleted: false,
          elapsedMinutesSinceTreatment: 0
        });
        break;
      case "dapsone_rebound":
        setParams({
          ...DEFAULT_METHB_PATIENT,
          etiology: "DAPSONE",
          baselineMetHbPct: 45,
          sulfhemoglobinPresent: false,
          sulfHbPct: 0,
          g6pdDeficient: false,
          concurrentSsriUse: false,
          methyleneBlueDoseMgKg: 1.5,
          ascorbicAcidDoseGrams: 0,
          exchangeTransfusionCompleted: false,
          elapsedMinutesSinceTreatment: 300 // 5 hours post-dose (enterohepatic rebound phase)
        });
        break;
      case "g6pd_crisis":
        setParams({
          ...DEFAULT_METHB_PATIENT,
          etiology: "DAPSONE",
          baselineMetHbPct: 32,
          sulfhemoglobinPresent: false,
          sulfHbPct: 0,
          g6pdDeficient: true, // G6PD Deficient
          concurrentSsriUse: false,
          methyleneBlueDoseMgKg: 1.5, // Fatal mistake
          ascorbicAcidDoseGrams: 0,
          exchangeTransfusionCompleted: false,
          elapsedMinutesSinceTreatment: 30
        });
        break;
      case "sulfhemoglobinemia":
        setParams({
          ...DEFAULT_METHB_PATIENT,
          etiology: "SULFONAMIDES",
          baselineMetHbPct: 8,
          sulfhemoglobinPresent: true,
          sulfHbPct: 12,
          g6pdDeficient: false,
          concurrentSsriUse: false,
          methyleneBlueDoseMgKg: 1.5, // Ineffective
          ascorbicAcidDoseGrams: 0,
          exchangeTransfusionCompleted: false,
          elapsedMinutesSinceTreatment: 45
        });
        break;
      case "lethal_nitrite_exchange":
        setParams({
          ...DEFAULT_METHB_PATIENT,
          etiology: "NITRITES_POPPERS",
          baselineMetHbPct: 68,
          sulfhemoglobinPresent: false,
          sulfHbPct: 0,
          g6pdDeficient: false,
          concurrentSsriUse: false,
          methyleneBlueDoseMgKg: 2.0,
          ascorbicAcidDoseGrams: 0,
          exchangeTransfusionCompleted: false,
          elapsedMinutesSinceTreatment: 15
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
            <span className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Droplets className="w-7 h-7" />
            </span>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                Methemoglobinemia &amp; Sulfhemoglobinemia Workstation
              </h1>
              <p className="text-sm text-slate-400">
                Pulse Oximetry Saturation Gap (~85% Plateau), Multi-Wavelength Co-Oximetry, Methylene Blue Kinetics &amp; G6PD Hemolysis
              </p>
            </div>
          </div>
        </div>

        {/* Global Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <div className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 ${
            output.currentMetHbPct >= 50
              ? "bg-rose-950/80 border-rose-500 text-rose-300 animate-pulse"
              : output.currentMetHbPct >= 30
              ? "bg-amber-950/80 border-amber-500 text-amber-300"
              : output.currentMetHbPct >= 15
              ? "bg-sky-950/80 border-sky-500 text-sky-300"
              : "bg-emerald-950/60 border-emerald-500 text-emerald-300"
          }`}>
            <Activity className="w-3.5 h-3.5" />
            <span>MetHb: {output.currentMetHbPct}%</span>
          </div>

          {params.sulfhemoglobinPresent && (
            <div className="px-3 py-1.5 rounded-lg bg-purple-950/80 border border-purple-500 text-purple-300 text-xs font-semibold flex items-center gap-1.5">
              <FlaskConical className="w-3.5 h-3.5" />
              <span>SulfHb: {output.currentSulfHbPct}%</span>
            </div>
          )}

          <div className={`px-3 py-1.5 rounded-lg border text-xs font-semibold ${
            output.bloodVisualAppearance === "CHOCOLATE_BROWN"
              ? "bg-amber-950 border-amber-700 text-amber-300"
              : output.bloodVisualAppearance === "SLATE_BLACK"
              ? "bg-slate-900 border-purple-700 text-purple-300"
              : "bg-emerald-950 border-emerald-700 text-emerald-300"
          }`}>
            <span>Blood: {output.bloodVisualAppearance.replace(/_/g, " ")}</span>
          </div>

          <div className={`px-3 py-1.5 rounded-lg border text-xs font-semibold ${
            output.g6pdHemolysisCrisis
              ? "bg-rose-950 border-rose-500 text-rose-300 animate-pulse"
              : output.antidoteEfficacy.methyleneBlueEffective
              ? "bg-teal-950 border-teal-500 text-teal-300"
              : "bg-slate-900 border-slate-800 text-slate-400"
          }`}>
            <span>{output.g6pdHemolysisCrisis ? "G6PD CRISIS!" : output.antidoteEfficacy.methyleneBlueEffective ? "MB ACTIVE" : "NO ANTIDOTE"}</span>
          </div>
        </div>
      </div>

      {/* Preset Vignette Selector */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
          <Zap className="w-4 h-4 text-cyan-400" />
          <span>Clinical Case Vignettes:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 w-full md:w-auto">
          <button
            onClick={() => applyPreset("benzocaine_post_tee")}
            className="px-2.5 py-1.5 text-xs rounded-lg bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-600/40 text-cyan-300 transition text-left"
          >
            1. Post-TEE Benzocaine Spray
          </button>
          <button
            onClick={() => applyPreset("dapsone_rebound")}
            className="px-2.5 py-1.5 text-xs rounded-lg bg-amber-950/40 hover:bg-amber-900/50 border border-amber-600/40 text-amber-300 transition text-left"
          >
            2. Dapsone Rebound Surge
          </button>
          <button
            onClick={() => applyPreset("g6pd_crisis")}
            className="px-2.5 py-1.5 text-xs rounded-lg bg-rose-950/40 hover:bg-rose-900/50 border border-rose-600/40 text-rose-300 transition text-left"
          >
            3. G6PD Hemolysis Catastrophe
          </button>
          <button
            onClick={() => applyPreset("sulfhemoglobinemia")}
            className="px-2.5 py-1.5 text-xs rounded-lg bg-purple-950/40 hover:bg-purple-900/50 border border-purple-600/40 text-purple-300 transition text-left"
          >
            4. Sulfhemoglobinemia &amp; MB Fail
          </button>
          <button
            onClick={() => applyPreset("lethal_nitrite_exchange")}
            className="px-2.5 py-1.5 text-xs rounded-lg bg-red-950/40 hover:bg-red-900/50 border border-red-600/40 text-red-300 transition text-left"
          >
            5. Lethal Nitrite &amp; RBC Exchange
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

      {/* Hero Oximetry & Spectrophotometry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Pulse Oximeter (2 Wavelength) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Pulse Oximeter (SpO2)
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 font-mono">
              660 / 940 nm
            </span>
          </div>
          <div className="py-4 text-center">
            <div className="text-4xl md:text-5xl font-extrabold text-cyan-400 font-mono">
              {output.measuredPulseSpO2}<span className="text-2xl font-normal text-cyan-500">%</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">
              PaO2: <span className="font-mono text-emerald-300 font-bold">{params.paO2MmHg} mmHg</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 text-center bg-slate-950/60 py-1.5 rounded-lg border border-slate-800/80">
            Plateaus near <span className="text-cyan-300 font-bold">~85%</span> (1:1 absorbance ratio)
          </div>
        </div>

        {/* Co-Oximetry SaO2 (Multi-Wavelength Gold Standard) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Co-Oximetry (SaO2)
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 font-mono">
              Multi-&lambda; Gold Std
            </span>
          </div>
          <div className="py-4 text-center">
            <div className="text-4xl md:text-5xl font-extrabold text-emerald-400 font-mono">
              {output.coOximetrySaO2}<span className="text-2xl font-normal text-emerald-500">%</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Functional OxyHb: <span className="font-mono text-emerald-300 font-bold">{output.effectiveOxyHbPct}%</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 text-center bg-slate-950/60 py-1.5 rounded-lg border border-slate-800/80">
            Differentiates OxyHb, DeoxyHb, MetHb, SulfHb
          </div>
        </div>

        {/* Saturation Gap */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Saturation Gap
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold ${
              Math.abs(output.saturationGap) >= 5
                ? "bg-rose-950 text-rose-400 border border-rose-700"
                : "bg-emerald-950 text-emerald-400 border border-emerald-700"
            }`}>
              {Math.abs(output.saturationGap) >= 5 ? "GAP >= 5% (DIAGNOSTIC)" : "NORMAL GAP"}
            </span>
          </div>
          <div className="py-4 text-center">
            <div className={`text-4xl md:text-5xl font-extrabold font-mono ${
              Math.abs(output.saturationGap) >= 5 ? "text-rose-400" : "text-emerald-400"
            }`}>
              &Delta; {output.saturationGap}<span className="text-2xl font-normal">%</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Pulse SpO2 minus Co-Oximetry SaO2
            </p>
          </div>
          <div className="text-[11px] text-slate-400 text-center bg-slate-950/60 py-1.5 rounded-lg border border-slate-800/80">
            Normal gap &lt; 5%; &ge; 5% heralds dyshemoglobin
          </div>
        </div>

        {/* Blood Appearance Sample */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <TestTube className="w-3.5 h-3.5" />
              Blood Appearance
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
              Filter Paper Test
            </span>
          </div>
          <div className="py-3 text-center flex flex-col items-center">
            <div className={`w-14 h-14 rounded-full border-2 shadow-inner my-1 ${
              output.bloodVisualAppearance === "CHOCOLATE_BROWN"
                ? "bg-amber-950 border-amber-600"
                : output.bloodVisualAppearance === "SLATE_BLACK"
                ? "bg-slate-900 border-purple-600 ring-2 ring-purple-500/50"
                : output.bloodVisualAppearance === "DARK_VENOUS"
                ? "bg-rose-950 border-rose-700"
                : "bg-red-600 border-red-400"
            }`}></div>
            <div className="text-sm font-bold text-white mt-1">
              {output.bloodVisualAppearance.replace(/_/g, " ")}
            </div>
          </div>
          <div className="text-[11px] text-slate-400 text-center bg-slate-950/60 py-1.5 rounded-lg border border-slate-800/80">
            Fails to turn red upon exposure to air
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
              onClick={() => setActiveTab("toxin")}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                activeTab === "toxin"
                  ? "bg-cyan-600 text-white shadow-lg shadow-cyan-600/30"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5" />
              1. Toxin Etiology &amp; Exposure
            </button>
            <button
              onClick={() => setActiveTab("genetics")}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                activeTab === "genetics"
                  ? "bg-cyan-600 text-white shadow-lg shadow-cyan-600/30"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              2. Genetics &amp; Vulnerabilities
            </button>
            <button
              onClick={() => setActiveTab("antidote")}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                activeTab === "antidote"
                  ? "bg-cyan-600 text-white shadow-lg shadow-cyan-600/30"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              <Syringe className="w-3.5 h-3.5" />
              3. Methylene Blue &amp; Transfusion
            </button>
          </div>

          {/* TAB 1: Toxin Exposure */}
          {activeTab === "toxin" && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-5">
              <div>
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <FlaskConical className="w-4 h-4 text-cyan-400" />
                  Etiological Oxidizing Agent &amp; Exposure Parameters
                </h3>
                <p className="text-xs text-slate-400">
                  Select the underlying toxic trigger oxidizing hemoglobin from ferrous (Fe2+) to ferric (Fe3+) state.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Oxidizing Agent / Etiology</label>
                  <select
                    value={params.etiology}
                    onChange={(e) => updateParam("etiology", e.target.value as ToxinEtiology)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="BENZOCAINE">Benzocaine Topical Spray (Endoscopy / ENT)</option>
                    <option value="DAPSONE">Dapsone (Enterohepatic Rebound Phenomenon)</option>
                    <option value="NITRITES_POPPERS">Nitrites / Amyl Nitrite Poppers / Well Water</option>
                    <option value="PHENAZOPYRIDINE">Phenazopyridine (Pyridium)</option>
                    <option value="SULFONAMIDES">Sulfonamides (TMP-SMX)</option>
                    <option value="CONGENITAL_CYT_B5R">Congenital Cytochrome b5 Reductase Def</option>
                  </select>
                </div>

                <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Baseline MetHb Fraction:</span>
                    <span className="font-mono text-cyan-400 font-bold">{params.baselineMetHbPct}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={80}
                    step={1}
                    value={params.baselineMetHbPct}
                    onChange={(e) => updateParam("baselineMetHbPct", parseInt(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                  <div className="text-[10px] text-slate-500">Threshold &ge; 20-30% for antidote treatment</div>
                </div>

                {/* Sulfhemoglobinemia Toggle */}
                <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800 sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-white">Co-Occurring Sulfhemoglobinemia</div>
                      <div className="text-[11px] text-slate-400">
                        Irreversible sulfur incorporation into porphyrin ring (Methylene Blue is ineffective!)
                      </div>
                    </div>
                    <button
                      onClick={() => updateParam("sulfhemoglobinPresent", !params.sulfhemoglobinPresent)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                        params.sulfhemoglobinPresent
                          ? "bg-purple-600 text-white"
                          : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                      }`}
                    >
                      {params.sulfhemoglobinPresent ? "Active (SulfHb)" : "Absent"}
                    </button>
                  </div>
                  {params.sulfhemoglobinPresent && (
                    <div className="pt-2">
                      <div className="flex justify-between text-xs text-slate-300">
                        <span>SulfHb Percentage:</span>
                        <span className="font-mono text-purple-400 font-bold">{params.sulfHbPct}%</span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={20}
                        step={1}
                        value={params.sulfHbPct}
                        onChange={(e) => updateParam("sulfHbPct", parseInt(e.target.value))}
                        className="w-full accent-purple-500"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Arterial PaO2:</span>
                    <span className="font-mono text-emerald-400 font-bold">{params.paO2MmHg} mmHg</span>
                  </div>
                  <input
                    type="range"
                    min={60}
                    max={550}
                    step={10}
                    value={params.paO2MmHg}
                    onChange={(e) => updateParam("paO2MmHg", parseInt(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                  <div className="text-[10px] text-slate-500">Dissolved oxygen is normal or elevated on 100% O2</div>
                </div>

                <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Total Hemoglobin:</span>
                    <span className="font-mono text-cyan-400 font-bold">{params.hemoglobinGPerDl.toFixed(1)} g/dL</span>
                  </div>
                  <input
                    type="range"
                    min={6.0}
                    max={18.0}
                    step={0.5}
                    value={params.hemoglobinGPerDl}
                    onChange={(e) => updateParam("hemoglobinGPerDl", parseFloat(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                  <div className="text-[10px] text-slate-500">Baseline total erythrocyte hemoglobin</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Genetics & Vulnerabilities */}
          {activeTab === "genetics" && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-5">
              <div>
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Pharmacogenetic Risks &amp; Lethal Drug Interactions
                </h3>
                <p className="text-xs text-slate-400">
                  Screening for G6PD deficiency and concurrent serotonergic medication usage prior to Methylene Blue administration.
                </p>
              </div>

              {/* G6PD Deficiency Toggle */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      Glucose-6-Phosphate Dehydrogenase (G6PD) Status
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      G6PD is the sole generator of NADPH in RBCs. Methylene Blue is strictly contraindicated!
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateParam("g6pdDeficient", false)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                        !params.g6pdDeficient
                          ? "bg-emerald-950/60 border-emerald-500 text-emerald-300"
                          : "bg-slate-900 border-slate-800 text-slate-400"
                      }`}
                    >
                      G6PD Normal
                    </button>
                    <button
                      onClick={() => updateParam("g6pdDeficient", true)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                        params.g6pdDeficient
                          ? "bg-rose-950/80 border-rose-500 text-rose-300 ring-1 ring-rose-500"
                          : "bg-slate-900 border-slate-800 text-slate-400"
                      }`}
                    >
                      G6PD Deficient
                    </button>
                  </div>
                </div>
                {params.g6pdDeficient && (
                  <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-700/50 text-xs text-rose-200">
                    <span className="font-bold">CRITICAL WARNING: </span>
                    Administering Methylene Blue to a G6PD-deficient patient fails to reduce MetHb and induces acute massive intravascular hemolysis, Heinz bodies, hyperkalemic cardiotoxicity, and renal failure.
                  </div>
                )}
              </div>

              {/* SSRI/SNRI Co-Administration */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Pill className="w-4 h-4 text-purple-400" />
                    Concurrent SSRI / SNRI / TCA Therapy
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Methylene Blue is a potent MAO-A inhibitor. Concomitant use precipitates Serotonin Syndrome.
                  </div>
                </div>
                <button
                  onClick={() => updateParam("concurrentSsriUse", !params.concurrentSsriUse)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    params.concurrentSsriUse
                      ? "bg-amber-600 text-white"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  {params.concurrentSsriUse ? "Active SSRI" : "None"}
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Antidotal Therapy & Reduction */}
          {activeTab === "antidote" && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-5">
              <div>
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <Syringe className="w-4 h-4 text-cyan-400" />
                  Antidote Administration &amp; Reduction Kinetics
                </h3>
                <p className="text-xs text-slate-400">
                  Titrate Methylene Blue, Ascorbic Acid, or execute emergency RBC Exchange Transfusion.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Methylene Blue Slider */}
                <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Methylene Blue IV Dose:</span>
                    <span className="font-mono text-cyan-400 font-bold">{params.methyleneBlueDoseMgKg.toFixed(1)} mg/kg</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={2.5}
                    step={0.5}
                    value={params.methyleneBlueDoseMgKg}
                    onChange={(e) => updateParam("methyleneBlueDoseMgKg", parseFloat(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                  <div className="text-[10px] text-slate-500">Standard: 1 &ndash; 2 mg/kg IV over 5 min (max 7 mg/kg cumulative)</div>
                </div>

                {/* Ascorbic Acid Slider */}
                <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Ascorbic Acid IV (Vitamin C):</span>
                    <span className="font-mono text-emerald-400 font-bold">{params.ascorbicAcidDoseGrams} g</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={10}
                    step={1}
                    value={params.ascorbicAcidDoseGrams}
                    onChange={(e) => updateParam("ascorbicAcidDoseGrams", parseInt(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                  <div className="text-[10px] text-slate-500">Alternative non-enzymatic reducing agent for G6PD deficiency</div>
                </div>

                {/* Elapsed Time Slider */}
                <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800 sm:col-span-2">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Elapsed Time Post-Treatment:</span>
                    <span className="font-mono text-cyan-400 font-bold">{params.elapsedMinutesSinceTreatment} minutes</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={180}
                    step={15}
                    value={params.elapsedMinutesSinceTreatment}
                    onChange={(e) => updateParam("elapsedMinutesSinceTreatment", parseInt(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                  <div className="text-[10px] text-slate-500">Expected reduction of ~15-25% MetHb per hour with Methylene Blue</div>
                </div>

                {/* Exchange Transfusion Toggle */}
                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 flex items-center justify-between sm:col-span-2">
                  <div>
                    <div className="text-xs font-bold text-white">Emergency RBC Exchange Transfusion</div>
                    <div className="text-[11px] text-slate-400">
                      Definitive removal of MetHb/SulfHb and replacement with donor erythrocytes.
                    </div>
                  </div>
                  <button
                    onClick={() => updateParam("exchangeTransfusionCompleted", !params.exchangeTransfusionCompleted)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                      params.exchangeTransfusionCompleted
                        ? "bg-emerald-600 text-white shadow-md"
                        : output.exchangeTransfusionIndicated
                        ? "bg-rose-600 text-white animate-pulse"
                        : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                    }`}
                  >
                    {params.exchangeTransfusionCompleted ? "Transfusion Completed" : "Perform Exchange Transfusion"}
                  </button>
                </div>
              </div>

              {/* Antidote Advisory Summary */}
              {output.antidoteEfficacy.summary && (
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  <span className="font-bold text-cyan-400">Mechanistic Kinetics: </span>
                  {output.antidoteEfficacy.summary}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Physiological Dashboards & Oxygen Delivery (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Oxygen Carriage & Dissociation Curve */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Oxygen Delivery &amp; Hemoglobin Dissociation Allostery
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80">
                <div className="text-[11px] text-slate-400">Total Oxygen Content (CaO2):</div>
                <div className={`text-xl font-mono font-extrabold ${
                  output.totalOxygenContentCaO2 < 10 ? "text-rose-400" : "text-cyan-400"
                }`}>
                  {output.totalOxygenContentCaO2} <span className="text-xs text-slate-400">mL O2/dL</span>
                </div>
                <div className="text-[10px] text-slate-500">Normal: 18 &ndash; 20 mL/dL</div>
              </div>

              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80">
                <div className="text-[11px] text-slate-400">P50 (Left Shift Allostery):</div>
                <div className={`text-xl font-mono font-extrabold ${
                  output.leftShiftP50MmHg < 20 ? "text-amber-400" : "text-cyan-400"
                }`}>
                  {output.leftShiftP50MmHg} <span className="text-xs text-slate-400">mmHg</span>
                </div>
                <div className="text-[10px] text-slate-500">Normal P50 ~ 26.8 mmHg</div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">Clinical Severity Tier:</span>
                <span className="font-mono font-bold text-slate-200">
                  {output.clinicalSeverity.replace(/_/g, " ")}
                </span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">Reduction Velocity:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {output.antidoteEfficacy.reductionRatePerHour}% / hour
                </span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">Exchange Transfusion Need:</span>
                <span className={`font-mono font-bold ${
                  output.exchangeTransfusionIndicated ? "text-rose-400" : "text-emerald-400"
                }`}>
                  {output.exchangeTransfusionIndicated ? "INDICATED" : "NOT REQUIRED"}
                </span>
              </div>
            </div>
          </div>

          {/* Educational Quick Reference Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              Clinical Toxicology Pearls
            </h3>
            <ul className="text-xs text-slate-300 space-y-2 leading-relaxed list-disc list-inside">
              <li>
                <span className="font-semibold text-white">The ~85% Oximeter Trap:</span> At 660 nm and 940 nm, MetHb absorbance is identical (ratio = 1.0), locking 2-wavelength pulse oximeters around 85% regardless of hyperoxia.
              </li>
              <li>
                <span className="font-semibold text-white">The Chocolate Tube:</span> Venous blood that stays dark brown when exposed to atmospheric air on white filter paper confirms MetHb over simple deoxygenation.
              </li>
              <li>
                <span className="font-semibold text-white">G6PD Fatal Hazard:</span> Methylene blue is dependent on NADPH from G6PD; without it, MB becomes an oxidant and triggers acute intravascular hemolysis.
              </li>
              <li>
                <span className="font-semibold text-white">Sulfhemoglobin Caution:</span> Methylene blue is completely ineffective in sulfhemoglobinemia; only exchange transfusion or RBC clearance works.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
