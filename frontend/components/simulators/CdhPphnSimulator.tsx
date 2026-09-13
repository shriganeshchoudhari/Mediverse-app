"use client";

import React, { useState, useMemo } from "react";
import {
  Baby,
  Activity,
  AlertTriangle,
  Heart,
  ShieldCheck,
  Stethoscope,
  Wind,
  Zap,
  Info,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  Flame,
  AlertCircle
} from "lucide-react";
import {
  CdhPatientParams,
  CdhDefectType,
  VentilationMode,
  DEFAULT_CDH_PATIENT,
  computeCdhPphnPhysiology
} from "../../.gemini/skills/CdhPphnEngine";

export default function CdhPphnSimulator() {
  const [params, setParams] = useState<CdhPatientParams>(DEFAULT_CDH_PATIENT);
  const [activeTab, setActiveTab] = useState<"resus" | "vent" | "pharma" | "ecmo" | "surgery">("resus");

  const output = useMemo(() => computeCdhPphnPhysiology(params), [params]);

  const updateParam = <K extends keyof CdhPatientParams>(key: K, value: CdhPatientParams[K]) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  // Case Vignettes / Clinical Presets
  const applyPreset = (presetKey: "classic_term" | "bmv_disaster" | "ecmo_oi46" | "preterm_contraindicated") => {
    switch (presetKey) {
      case "classic_term":
        setParams({
          ...DEFAULT_CDH_PATIENT,
          gestationalAgeWeeks: 39,
          birthWeightKg: 3.3,
          defectType: "LEFT_BOCHDALEK",
          stomachPosition: "INTRATHORACIC",
          liverHerniated: false,
          bagMaskVentilationApplied: false,
          ogTubeDecompression: true,
          ventilationMode: "CONVENTIONAL_GENTLE",
          pip: 22,
          peep: 4,
          rateBpm: 45,
          fiO2: 0.50,
          iNoDosePpm: 20,
          sildenafilDoseMgKgH: 0.08,
          milrinoneDoseMcgKgMin: 0.35,
          norepinephrineDoseMcgKgMin: 0.05,
          cranialUltrasoundGradeIvh: 0,
          ecmoCannulated: false,
          ecmoMode: "NONE"
        });
        break;
      case "bmv_disaster":
        setParams({
          ...DEFAULT_CDH_PATIENT,
          gestationalAgeWeeks: 38,
          birthWeightKg: 3.1,
          defectType: "LEFT_BOCHDALEK",
          stomachPosition: "INTRATHORACIC",
          liverHerniated: false,
          bagMaskVentilationApplied: true, // Fatal BMV error
          ogTubeDecompression: false,
          ventilationMode: "CONVENTIONAL_AGGRESSIVE",
          pip: 30,
          peep: 4,
          rateBpm: 50,
          fiO2: 1.0,
          iNoDosePpm: 0,
          sildenafilDoseMgKgH: 0,
          milrinoneDoseMcgKgMin: 0,
          cranialUltrasoundGradeIvh: 0,
          ecmoCannulated: false
        });
        break;
      case "ecmo_oi46":
        setParams({
          ...DEFAULT_CDH_PATIENT,
          gestationalAgeWeeks: 38.5,
          birthWeightKg: 3.4,
          defectType: "LEFT_BOCHDALEK",
          stomachPosition: "INTRATHORACIC",
          liverHerniated: true, // Liver-up severe hypoplasia
          bagMaskVentilationApplied: false,
          ogTubeDecompression: true,
          ventilationMode: "HFOV",
          hfovMeanAirwayPressure: 17,
          hfovAmplitude: 38,
          hfovFrequencyHz: 10,
          fiO2: 1.0,
          iNoDosePpm: 20,
          sildenafilDoseMgKgH: 0.10,
          milrinoneDoseMcgKgMin: 0.50,
          norepinephrineDoseMcgKgMin: 0.15,
          cranialUltrasoundGradeIvh: 0,
          ecmoCannulated: false
        });
        break;
      case "preterm_contraindicated":
        setParams({
          ...DEFAULT_CDH_PATIENT,
          gestationalAgeWeeks: 32, // < 34 wks contraindication
          birthWeightKg: 1.7, // < 2.0 kg contraindication
          defectType: "LEFT_BOCHDALEK",
          stomachPosition: "INTRATHORACIC",
          liverHerniated: true,
          bagMaskVentilationApplied: false,
          ogTubeDecompression: true,
          ventilationMode: "CONVENTIONAL_GENTLE",
          pip: 24,
          peep: 5,
          rateBpm: 55,
          fiO2: 1.0,
          iNoDosePpm: 20,
          cranialUltrasoundGradeIvh: 3, // Grade 3 IVH contraindication
          ecmoCannulated: false
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
            <span className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400">
              <Baby className="w-7 h-7" />
            </span>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                Congenital Diaphragmatic Hernia & PPHN Workstation
              </h1>
              <p className="text-sm text-slate-400">
                Pre- vs Post-Ductal Saturation Gradient, CDH EURO Gentle Ventilation, iNO Resistance & Neonatal ECMO Triage
              </p>
            </div>
          </div>
        </div>

        {/* Global Physiological Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs flex items-center gap-1.5">
            <span className="text-slate-400">Neonate:</span>
            <span className="font-semibold text-teal-300">{params.gestationalAgeWeeks}w / {params.birthWeightKg}kg</span>
          </div>

          <div className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 ${
            output.pdaShuntDirection === "RIGHT_TO_LEFT"
              ? "bg-rose-950/60 border-rose-600/50 text-rose-300"
              : output.pdaShuntDirection === "BIDIRECTIONAL"
              ? "bg-amber-950/60 border-amber-600/50 text-amber-300"
              : "bg-emerald-950/60 border-emerald-600/50 text-emerald-300"
          }`}>
            <Heart className="w-3.5 h-3.5" />
            <span>PDA: {output.pdaShuntDirection.replace(/_/g, " ")} ({output.pdaShuntFractionPct}%)</span>
          </div>

          <div className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 ${
            output.oxygenationIndex >= 40
              ? "bg-rose-900/60 border-rose-500 text-rose-200 animate-pulse"
              : output.oxygenationIndex >= 25
              ? "bg-amber-900/60 border-amber-500 text-amber-200"
              : "bg-teal-900/40 border-teal-500/50 text-teal-200"
          }`}>
            <Activity className="w-3.5 h-3.5" />
            <span>OI: {output.oxygenationIndex}</span>
          </div>

          <div className={`px-3 py-1.5 rounded-lg border text-xs font-semibold ${
            params.ecmoCannulated
              ? "bg-indigo-950/60 border-indigo-500 text-indigo-300"
              : output.ecmoEligibility.isEligible
              ? "bg-rose-950/80 border-rose-500 text-rose-300"
              : "bg-slate-900 border-slate-800 text-slate-400"
          }`}>
            <span>ECMO: {params.ecmoCannulated ? params.ecmoMode : output.ecmoEligibility.isEligible ? "INDICATED" : "NOT IND"}</span>
          </div>
        </div>
      </div>

      {/* Preset Vignette Selector */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
          <Zap className="w-4 h-4 text-teal-400" />
          <span>Clinical Case Vignettes:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 w-full md:w-auto">
          <button
            onClick={() => applyPreset("classic_term")}
            className="px-3 py-1.5 text-xs rounded-lg bg-teal-950/40 hover:bg-teal-900/50 border border-teal-600/40 text-teal-300 transition text-left"
          >
            1. Term Left CDH + iNO Response
          </button>
          <button
            onClick={() => applyPreset("bmv_disaster")}
            className="px-3 py-1.5 text-xs rounded-lg bg-rose-950/40 hover:bg-rose-900/50 border border-rose-600/40 text-rose-300 transition text-left"
          >
            2. Delivery Room BMV Disaster
          </button>
          <button
            onClick={() => applyPreset("ecmo_oi46")}
            className="px-3 py-1.5 text-xs rounded-lg bg-indigo-950/40 hover:bg-indigo-900/50 border border-indigo-600/40 text-indigo-300 transition text-left"
          >
            3. Refractory PPHN & VA-ECMO
          </button>
          <button
            onClick={() => applyPreset("preterm_contraindicated")}
            className="px-3 py-1.5 text-xs rounded-lg bg-amber-950/40 hover:bg-amber-900/50 border border-amber-600/40 text-amber-300 transition text-left"
          >
            4. Preterm / IVH Contraindication
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

      {/* Top Vital Signs & Dual Oximetry Hero Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pre-ductal Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Pre-Ductal (Right Hand)
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 font-mono">
              Brachiocephalic / Cerebral
            </span>
          </div>
          <div className="py-4 text-center">
            <div className="text-4xl md:text-5xl font-extrabold text-emerald-400 font-mono">
              {output.preDuctalSpO2}<span className="text-2xl font-normal text-emerald-500">%</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">
              PaO2: <span className="font-mono text-emerald-300 font-bold">{output.preDuctalPaO2} mmHg</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 text-center bg-slate-950/60 py-1.5 rounded-lg border border-slate-800/80">
            Target Pre-ductal SpO2: <span className="text-emerald-300 font-semibold">85 &ndash; 95%</span> (avoid hyperoxia)
          </div>
        </div>

        {/* Dynamic Gradient & Shunt Engine Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Ductal Saturation Gradient
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold ${
              output.saturationGradient >= 10
                ? "bg-rose-950 text-rose-400 border border-rose-700"
                : output.saturationGradient >= 5
                ? "bg-amber-950 text-amber-400 border border-amber-700"
                : "bg-emerald-950 text-emerald-400 border border-emerald-700"
            }`}>
              {output.saturationGradient >= 10 ? "CRITICAL R->L SHUNT" : output.saturationGradient >= 5 ? "MODERATE SHUNT" : "SUBSYSTEMIC"}
            </span>
          </div>

          <div className="py-2 text-center">
            <div className={`text-4xl md:text-5xl font-extrabold font-mono ${
              output.saturationGradient >= 10
                ? "text-rose-400"
                : output.saturationGradient >= 5
                ? "text-amber-400"
                : "text-emerald-400"
            }`}>
              &Delta; {output.saturationGradient}<span className="text-2xl font-normal">%</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Pre-Ductal SpO2 minus Post-Ductal SpO2
            </p>
          </div>

          <div className="space-y-1.5 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Estimated RVSP / SBP:</span>
              <span className="font-mono font-bold text-slate-200">
                {output.estimatedRvSystolicPressure} / {output.systemicSystolicBp} mmHg
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>PVR:</span>
              <span className="font-mono font-bold text-slate-200">
                {output.pulmonaryVascularResistanceDyn} dyn&middot;s/cm&sup5;
              </span>
            </div>
          </div>
        </div>

        {/* Post-ductal Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${
                output.postDuctalSpO2 < 80 ? "bg-rose-500 animate-ping" : "bg-sky-400"
              }`}></span>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Post-Ductal (Lower Extremity)
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-sky-950/80 text-sky-400 border border-sky-800/60 font-mono">
              Post-PDA Aortic Mixing
            </span>
          </div>
          <div className="py-4 text-center">
            <div className={`text-4xl md:text-5xl font-extrabold font-mono ${
              output.postDuctalSpO2 < 75 ? "text-rose-400" : "text-sky-400"
            }`}>
              {output.postDuctalSpO2}<span className="text-2xl font-normal text-sky-500">%</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">
              PaO2: <span className="font-mono text-sky-300 font-bold">{output.postDuctalPaO2} mmHg</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 text-center bg-slate-950/60 py-1.5 rounded-lg border border-slate-800/80">
            Affected by <span className="text-amber-300 font-semibold">{output.pdaShuntFractionPct}% R&rarr;L ductal shunt</span> of desaturated PA blood
          </div>
        </div>
      </div>

      {/* Main Interactive Workstation Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Sub-Tab Navigation */}
          <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
            <button
              onClick={() => setActiveTab("resus")}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                activeTab === "resus"
                  ? "bg-teal-600 text-white shadow-lg shadow-teal-600/30"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              1. Delivery Room & Anatomy
            </button>
            <button
              onClick={() => setActiveTab("vent")}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                activeTab === "vent"
                  ? "bg-teal-600 text-white shadow-lg shadow-teal-600/30"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              <Wind className="w-3.5 h-3.5" />
              2. Gentle Ventilation Bench
            </button>
            <button
              onClick={() => setActiveTab("pharma")}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                activeTab === "pharma"
                  ? "bg-teal-600 text-white shadow-lg shadow-teal-600/30"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              3. Pulmonary Vasodilators
            </button>
            <button
              onClick={() => setActiveTab("ecmo")}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                activeTab === "ecmo"
                  ? "bg-teal-600 text-white shadow-lg shadow-teal-600/30"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              4. Neonatal ECMO Triage
            </button>
            <button
              onClick={() => setActiveTab("surgery")}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                activeTab === "surgery"
                  ? "bg-teal-600 text-white shadow-lg shadow-teal-600/30"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              5. Delayed Surgical Checklist
            </button>
          </div>

          {/* TAB 1: Delivery Room & Anatomy */}
          {activeTab === "resus" && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-5">
              <div>
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <Baby className="w-4 h-4 text-teal-400" />
                  Neonatal CDH Phenotype & Delivery Room Resuscitation
                </h3>
                <p className="text-xs text-slate-400">
                  Critical anatomical risk factors and strict airway protocols preventing fatal gastric distension.
                </p>
              </div>

              {/* Delivery Room Airway Mode: Intubation vs BMV */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Delivery Room Airway Management Protocol:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => updateParam("bagMaskVentilationApplied", false)}
                    className={`p-3 rounded-xl border text-left flex items-start gap-3 transition ${
                      !params.bagMaskVentilationApplied
                        ? "bg-emerald-950/60 border-emerald-500 text-emerald-200 shadow-md"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-white">Immediate ETT Intubation (Correct)</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Direct laryngoscopy and endotracheal intubation (2.5-3.5 ETT) without bag-mask ventilation.
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => updateParam("bagMaskVentilationApplied", true)}
                    className={`p-3 rounded-xl border text-left flex items-start gap-3 transition ${
                      params.bagMaskVentilationApplied
                        ? "bg-rose-950/80 border-rose-500 text-rose-200 shadow-md ring-1 ring-rose-500"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-rose-300">Bag-Mask Ventilation (BMV - Lethal)</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Forces gas into herniated stomach in chest, causing rapid mediastinal shift & cardiac arrest.
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Continuous OG Tube Replogle Suction */}
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-slate-950/60">
                <div>
                  <div className="text-xs font-semibold text-white">Continuous Replogle Orogastric Suction (10 Fr)</div>
                  <div className="text-[11px] text-slate-400">
                    Continuous low intermittent suction (-20 to -30 mmHg) to decompress the intrathoracic stomach and bowel.
                  </div>
                </div>
                <button
                  onClick={() => updateParam("ogTubeDecompression", !params.ogTubeDecompression)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                    params.ogTubeDecompression
                      ? "bg-teal-600 text-white"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  {params.ogTubeDecompression ? "Active" : "Omitted"}
                </button>
              </div>

              {/* Anatomical Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">CDH Defect Anatomy</label>
                  <select
                    value={params.defectType}
                    onChange={(e) => updateParam("defectType", e.target.value as CdhDefectType)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                  >
                    <option value="LEFT_BOCHDALEK">Left Bochdalek Hernia (85% incidence)</option>
                    <option value="RIGHT_BOCHDALEK">Right Bochdalek Hernia (13% incidence)</option>
                    <option value="BILATERAL">Bilateral Bochdalek (2% &ndash; Extreme mortality)</option>
                    <option value="MORGAGNI">Morgagni Hernia (Anterior/Retrosternal)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Liver Herniation ("Liver-Up")</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateParam("liverHerniated", false)}
                      className={`flex-1 py-2 rounded-lg text-xs font-semibold border ${
                        !params.liverHerniated
                          ? "bg-teal-950/60 border-teal-500 text-teal-300"
                          : "bg-slate-950 border-slate-800 text-slate-400"
                      }`}
                    >
                      Liver-Down
                    </button>
                    <button
                      onClick={() => updateParam("liverHerniated", true)}
                      className={`flex-1 py-2 rounded-lg text-xs font-semibold border ${
                        params.liverHerniated
                          ? "bg-rose-950/60 border-rose-500 text-rose-300"
                          : "bg-slate-950 border-slate-800 text-slate-400"
                      }`}
                    >
                      Liver-Up (Severe)
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Gestational Age:</span>
                    <span className="font-mono text-teal-400 font-bold">{params.gestationalAgeWeeks} weeks</span>
                  </div>
                  <input aria-label="Gestational Age"
                    type="range"
                    min={32}
                    max={41}
                    step={0.5}
                    value={params.gestationalAgeWeeks}
                    onChange={(e) => updateParam("gestationalAgeWeeks", parseFloat(e.target.value))}
                    className="w-full accent-teal-500"
                  />
                  <div className="text-[10px] text-slate-500">Threshold &ge; 34 weeks for ECMO safety</div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Birth Weight:</span>
                    <span className="font-mono text-teal-400 font-bold">{params.birthWeightKg.toFixed(1)} kg</span>
                  </div>
                  <input aria-label="Birth Weight"
                    type="range"
                    min={1.6}
                    max={4.2}
                    step={0.1}
                    value={params.birthWeightKg}
                    onChange={(e) => updateParam("birthWeightKg", parseFloat(e.target.value))}
                    className="w-full accent-teal-500"
                  />
                  <div className="text-[10px] text-slate-500">Threshold &ge; 2.0 kg for ECMO cannula insertion</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Gentle Ventilation Bench */}
          {activeTab === "vent" && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-5">
              <div>
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <Wind className="w-4 h-4 text-teal-400" />
                  CDH EURO Consortium Gentle Ventilation Protocol
                </h3>
                <p className="text-xs text-slate-400">
                  Permissive hypercapnia and low peak inspiratory pressures protect fragile hypoplastic lungs from volutrauma.
                </p>
              </div>

              {/* Mode Selector */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => updateParam("ventilationMode", "CONVENTIONAL_GENTLE")}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition ${
                    params.ventilationMode === "CONVENTIONAL_GENTLE"
                      ? "bg-teal-600 border-teal-500 text-white shadow-md"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  Conventional Gentle
                </button>
                <button
                  onClick={() => updateParam("ventilationMode", "CONVENTIONAL_AGGRESSIVE")}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition ${
                    params.ventilationMode === "CONVENTIONAL_AGGRESSIVE"
                      ? "bg-rose-900/80 border-rose-500 text-rose-200 shadow-md"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  Conventional Aggressive
                </button>
                <button
                  onClick={() => updateParam("ventilationMode", "HFOV")}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition ${
                    params.ventilationMode === "HFOV"
                      ? "bg-indigo-600 border-indigo-500 text-white shadow-md"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  HFOV Oscillatory
                </button>
              </div>

              {/* Conventional Controls */}
              {params.ventilationMode !== "HFOV" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>Peak Inspiratory Pressure (PIP):</span>
                      <span className={`font-mono font-bold ${
                        params.pip > 25 ? "text-rose-400" : "text-emerald-400"
                      }`}>
                        {params.pip} cmH2O
                      </span>
                    </div>
                    <input aria-label="Peak Inspiratory Pressure (PIP)"
                      type="range"
                      min={16}
                      max={36}
                      step={1}
                      value={params.pip}
                      onChange={(e) => updateParam("pip", parseInt(e.target.value))}
                      className="w-full accent-teal-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>Gentle Ceiling: &le; 25 cmH2O</span>
                      {params.pip > 25 && <span className="text-rose-400 font-bold">P-SILI Hazard!</span>}
                    </div>
                  </div>

                  <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>PEEP:</span>
                      <span className="font-mono text-teal-400 font-bold">{params.peep} cmH2O</span>
                    </div>
                    <input aria-label="PEEP"
                      type="range"
                      min={3}
                      max={8}
                      step={1}
                      value={params.peep}
                      onChange={(e) => updateParam("peep", parseInt(e.target.value))}
                      className="w-full accent-teal-500"
                    />
                    <div className="text-[10px] text-slate-500">Recommended: 3 &ndash; 5 cmH2O (avoid high PEEP)</div>
                  </div>

                  <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>Ventilator Rate:</span>
                      <span className="font-mono text-teal-400 font-bold">{params.rateBpm} bpm</span>
                    </div>
                    <input aria-label="Ventilator Rate"
                      type="range"
                      min={30}
                      max={70}
                      step={2}
                      value={params.rateBpm}
                      onChange={(e) => updateParam("rateBpm", parseInt(e.target.value))}
                      className="w-full accent-teal-500"
                    />
                    <div className="text-[10px] text-slate-500">Gentle rate: 40 &ndash; 60 bpm</div>
                  </div>

                  <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>FiO2:</span>
                      <span className="font-mono text-teal-400 font-bold">{(params.fiO2 * 100).toFixed(0)}%</span>
                    </div>
                    <input aria-label="FiO2"
                      type="range"
                      min={0.21}
                      max={1.0}
                      step={0.05}
                      value={params.fiO2}
                      onChange={(e) => updateParam("fiO2", parseFloat(e.target.value))}
                      className="w-full accent-teal-500"
                    />
                    <div className="text-[10px] text-slate-500">Titrate to pre-ductal SpO2 85 &ndash; 95%</div>
                  </div>
                </div>
              ) : (
                /* HFOV Controls */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>Mean Airway Pressure (MAP):</span>
                      <span className="font-mono text-indigo-400 font-bold">{params.hfovMeanAirwayPressure} cmH2O</span>
                    </div>
                    <input aria-label="Mean Airway Pressure (MAP)"
                      type="range"
                      min={10}
                      max={22}
                      step={1}
                      value={params.hfovMeanAirwayPressure}
                      onChange={(e) => updateParam("hfovMeanAirwayPressure", parseInt(e.target.value))}
                      className="w-full accent-indigo-500"
                    />
                    <div className="text-[10px] text-slate-500">Starting MAP ~ 13 &ndash; 17 cmH2O</div>
                  </div>

                  <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>Amplitude (&Delta;P):</span>
                      <span className="font-mono text-indigo-400 font-bold">{params.hfovAmplitude} cmH2O</span>
                    </div>
                    <input aria-label="Amplitude (&Delta;P)"
                      type="range"
                      min={20}
                      max={50}
                      step={2}
                      value={params.hfovAmplitude}
                      onChange={(e) => updateParam("hfovAmplitude", parseInt(e.target.value))}
                      className="w-full accent-indigo-500"
                    />
                    <div className="text-[10px] text-slate-500">Titrate to visible chest wiggle down to umbilicus</div>
                  </div>

                  <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>Frequency (Hz):</span>
                      <span className="font-mono text-indigo-400 font-bold">{params.hfovFrequencyHz} Hz</span>
                    </div>
                    <input aria-label="Frequency (Hz)"
                      type="range"
                      min={8}
                      max={15}
                      step={1}
                      value={params.hfovFrequencyHz}
                      onChange={(e) => updateParam("hfovFrequencyHz", parseInt(e.target.value))}
                      className="w-full accent-indigo-500"
                    />
                    <div className="text-[10px] text-slate-500">Standard neonate: 10 Hz (600 vibrations/min)</div>
                  </div>

                  <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>FiO2:</span>
                      <span className="font-mono text-indigo-400 font-bold">{(params.fiO2 * 100).toFixed(0)}%</span>
                    </div>
                    <input aria-label="FiO2"
                      type="range"
                      min={0.21}
                      max={1.0}
                      step={0.05}
                      value={params.fiO2}
                      onChange={(e) => updateParam("fiO2", parseFloat(e.target.value))}
                      className="w-full accent-indigo-500"
                    />
                    <div className="text-[10px] text-slate-500">Aim for post-ductal PaO2 &ge; 40 mmHg</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Pulmonary Vasodilators */}
          {activeTab === "pharma" && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-5">
              <div>
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <Heart className="w-4 h-4 text-teal-400" />
                  Targeted Pulmonary Vasodilators & Hemodynamics
                </h3>
                <p className="text-xs text-slate-400">
                  Nitric oxide, PDE inhibitors, and inotropic support to reverse right-to-left ductal shunting.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* iNO */}
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-white">Inhaled Nitric Oxide (iNO):</span>
                    <span className="font-mono text-teal-400 font-bold">{params.iNoDosePpm} ppm</span>
                  </div>
                  <input aria-label="Inhaled Nitric Oxide (iNO)"
                    type="range"
                    min={0}
                    max={40}
                    step={5}
                    value={params.iNoDosePpm}
                    onChange={(e) => updateParam("iNoDosePpm", parseInt(e.target.value))}
                    className="w-full accent-teal-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Target: 20 ppm</span>
                    <span className={`font-semibold ${
                      output.iNoResponseState === "RESPONDER" ? "text-emerald-400" : "text-amber-400"
                    }`}>
                      {output.iNoResponseState}
                    </span>
                  </div>
                </div>

                {/* Sildenafil */}
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-white">Sildenafil IV (PDE-5 Inhibitor):</span>
                    <span className="font-mono text-teal-400 font-bold">{params.sildenafilDoseMgKgH.toFixed(2)} mg/kg/h</span>
                  </div>
                  <input aria-label="Sildenafil IV (PDE-5 Inhibitor)"
                    type="range"
                    min={0}
                    max={0.15}
                    step={0.01}
                    value={params.sildenafilDoseMgKgH}
                    onChange={(e) => updateParam("sildenafilDoseMgKgH", parseFloat(e.target.value))}
                    className="w-full accent-teal-500"
                  />
                  <div className="text-[10px] text-slate-500">Potentiates cGMP signaling and prevents iNO rebound</div>
                </div>

                {/* Milrinone */}
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-white">Milrinone IV (PDE-3 Inodilator):</span>
                    <span className="font-mono text-teal-400 font-bold">{params.milrinoneDoseMcgKgMin.toFixed(2)} mcg/kg/min</span>
                  </div>
                  <input aria-label="Milrinone IV (PDE-3 Inodilator)"
                    type="range"
                    min={0}
                    max={0.75}
                    step={0.05}
                    value={params.milrinoneDoseMcgKgMin}
                    onChange={(e) => updateParam("milrinoneDoseMcgKgMin", parseFloat(e.target.value))}
                    className="w-full accent-teal-500"
                  />
                  <div className="text-[10px] text-slate-500">Relieves LV diastolic dysfunction & afterload</div>
                </div>

                {/* Norepinephrine */}
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-white">Norepinephrine IV (Vasopressor):</span>
                    <span className="font-mono text-teal-400 font-bold">{params.norepinephrineDoseMcgKgMin.toFixed(2)} mcg/kg/min</span>
                  </div>
                  <input aria-label="Norepinephrine IV (Vasopressor)"
                    type="range"
                    min={0}
                    max={0.30}
                    step={0.02}
                    value={params.norepinephrineDoseMcgKgMin}
                    onChange={(e) => updateParam("norepinephrineDoseMcgKgMin", parseFloat(e.target.value))}
                    className="w-full accent-teal-500"
                  />
                  <div className="text-[10px] text-slate-500">Maintains SVR &gt; PVR to reduce right-to-left ductal shunting</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Neonatal ECMO Triage */}
          {activeTab === "ecmo" && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-5">
              <div>
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-rose-400" />
                  Neonatal CDH ECMO Evaluation & Cannulation Station
                </h3>
                <p className="text-xs text-slate-400">
                  Extracorporeal life support eligibility based on sustained Oxygenation Index, gas exchange, and intracranial hemorrhage screening.
                </p>
              </div>

              {/* Cranial Ultrasound Screening Selector */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-white">Head Ultrasound: Intraventricular Hemorrhage (IVH) Grade</span>
                  <span className={`font-bold ${
                    params.cranialUltrasoundGradeIvh >= 3 ? "text-rose-400" : "text-emerald-400"
                  }`}>
                    {params.cranialUltrasoundGradeIvh === 0 ? "No IVH" : `Grade ${params.cranialUltrasoundGradeIvh}`}
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {([0, 1, 2, 3, 4] as const).map((grade) => (
                    <button
                      key={grade}
                      onClick={() => updateParam("cranialUltrasoundGradeIvh", grade)}
                      className={`py-1.5 rounded text-xs font-semibold border ${
                        params.cranialUltrasoundGradeIvh === grade
                          ? grade >= 3
                            ? "bg-rose-950 border-rose-500 text-rose-200"
                            : "bg-teal-950 border-teal-500 text-teal-200"
                          : "bg-slate-900 border-slate-800 text-slate-400"
                      }`}
                    >
                      {grade === 0 ? "Normal" : `Gr ${grade}`}
                    </button>
                  ))}
                </div>
                <div className="text-[10px] text-slate-500">
                  Grade III/IV IVH is an absolute contraindication to ECMO due to fatal intracranial hemorrhage risk under systemic heparinization.
                </div>
              </div>

              {/* ECMO Cannulation Action */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-white">Venoarterial (VA-ECMO) Cannulation Status</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Cannulation via Right Internal Jugular Vein & Right Common Carotid Artery (biventricular and pulmonary offloading).
                  </div>
                </div>
                <button
                  disabled={!params.ecmoCannulated && !output.ecmoEligibility.isEligible && output.ecmoEligibility.contraindications.length > 0}
                  onClick={() => {
                    if (params.ecmoCannulated) {
                      updateParam("ecmoCannulated", false);
                      updateParam("ecmoMode", "NONE");
                    } else {
                      updateParam("ecmoCannulated", true);
                      updateParam("ecmoMode", "VA_ECMO");
                    }
                  }}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-md ${
                    params.ecmoCannulated
                      ? "bg-rose-600 hover:bg-rose-500 text-white"
                      : output.ecmoEligibility.isEligible
                      ? "bg-indigo-600 hover:bg-indigo-500 text-white animate-pulse"
                      : "bg-slate-800 text-slate-500 cursor-not-allowed"
                  }`}
                >
                  {params.ecmoCannulated ? "Decannulate ECMO" : "Cannulate VA-ECMO"}
                </button>
              </div>

              {/* Recommendation Box */}
              <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
                params.ecmoCannulated
                  ? "bg-indigo-950/60 border-indigo-500 text-indigo-200"
                  : output.ecmoEligibility.isEligible
                  ? "bg-rose-950/70 border-rose-500 text-rose-200"
                  : output.ecmoEligibility.contraindications.length > 0
                  ? "bg-amber-950/60 border-amber-600 text-amber-200"
                  : "bg-slate-950/60 border-slate-800 text-slate-300"
              }`}>
                <span className="font-bold">ECMO Advisory: </span>
                {output.ecmoEligibility.recommendation}
              </div>
            </div>
          )}

          {/* TAB 5: Delayed Surgical Checklist */}
          {activeTab === "surgery" && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-5">
              <div>
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-400" />
                  CDH EURO Consortium Delayed Surgical Repair Readiness
                </h3>
                <p className="text-xs text-slate-400">
                  Surgical repair is deferred for 24-72 hours to avoid fatal intraoperative pulmonary hypertensive crisis.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-300">Physiological Stability Score:</div>
                  <div className="text-xs text-slate-500">Benchmark &ge; 80% with 0 unmet criteria for repair</div>
                </div>
                <div className="text-3xl font-mono font-extrabold text-teal-400">
                  {output.surgicalReadiness.stabilityScore}%
                </div>
              </div>

              <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
                output.surgicalReadiness.isStable
                  ? "bg-emerald-950/60 border-emerald-500 text-emerald-200"
                  : "bg-rose-950/60 border-rose-500 text-rose-200"
              }`}>
                <div className="font-bold mb-1">CDH Surgical Consensus Recommendation:</div>
                <p>{output.surgicalReadiness.verdict}</p>
                {output.surgicalReadiness.unmetCriteria.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <span className="font-semibold text-amber-300">Unmet Stability Benchmarks:</span>
                    <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-300">
                      {output.surgicalReadiness.unmetCriteria.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Comprehensive Physiological Dashboards (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Arterial Blood Gas & Ventilation Dashboard */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-400" />
              Arterial Blood Gas & Ventilation Mechanics
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80">
                <div className="text-[11px] text-slate-400">PaCO2 (Permissive):</div>
                <div className={`text-xl font-mono font-extrabold ${
                  output.paCO2 > 65 ? "text-rose-400" : "text-teal-400"
                }`}>
                  {output.paCO2} <span className="text-xs text-slate-400">mmHg</span>
                </div>
                <div className="text-[10px] text-slate-500">Target: 45 &ndash; 60 mmHg</div>
              </div>

              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80">
                <div className="text-[11px] text-slate-400">Arterial pH:</div>
                <div className={`text-xl font-mono font-extrabold ${
                  output.arterialPh < 7.25 ? "text-rose-400" : "text-teal-400"
                }`}>
                  {output.arterialPh}
                </div>
                <div className="text-[10px] text-slate-500">Target: 7.25 &ndash; 7.40</div>
              </div>

              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80">
                <div className="text-[11px] text-slate-400">Mean Airway Press (MAP):</div>
                <div className="text-xl font-mono font-extrabold text-teal-400">
                  {output.meanAirwayPressure} <span className="text-xs text-slate-400">cmH2O</span>
                </div>
                <div className="text-[10px] text-slate-500">Calculated airway distending P</div>
              </div>

              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80">
                <div className="text-[11px] text-slate-400">A-a DO2 Gradient:</div>
                <div className="text-xl font-mono font-extrabold text-teal-400">
                  {output.aaGradient} <span className="text-xs text-slate-400">mmHg</span>
                </div>
                <div className="text-[10px] text-slate-500">Normal newborn &lt; 100</div>
              </div>
            </div>
          </div>

          {/* Ductal & Cardiac Hemodynamics */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Heart className="w-4 h-4 text-teal-400" />
              Pulmonary & Systemic Hemodynamic Profile
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">Systemic Blood Pressure (BP):</span>
                <span className="font-mono font-bold text-slate-200">
                  {output.systemicSystolicBp} / {output.systemicMeanBp} mmHg (MAP {output.systemicMeanBp})
                </span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">Right Ventricular Pressure (RVSP):</span>
                <span className={`font-mono font-bold ${
                  output.estimatedRvSystolicPressure >= output.systemicSystolicBp ? "text-rose-400" : "text-emerald-400"
                }`}>
                  {output.estimatedRvSystolicPressure} mmHg ({output.estimatedRvSystolicPressure >= output.systemicSystolicBp ? "Suprasystemic" : "Subsystemic"})
                </span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">PDA Shunt Direction:</span>
                <span className={`font-mono font-bold ${
                  output.pdaShuntDirection === "RIGHT_TO_LEFT" ? "text-rose-400" : "text-emerald-400"
                }`}>
                  {output.pdaShuntDirection.replace(/_/g, " ")} ({output.pdaShuntFractionPct}%)
                </span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">Pneumothorax Hazard:</span>
                <span className={`font-mono font-bold ${
                  output.pneumothoraxRisk === "CRITICAL"
                    ? "text-rose-400 animate-pulse"
                    : output.pneumothoraxRisk === "MODERATE"
                    ? "text-amber-400"
                    : "text-emerald-400"
                }`}>
                  {output.pneumothoraxRisk}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
