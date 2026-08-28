"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Activity,
  Sliders,
  FileText,
  AlertTriangle,
  CheckCircle,
  FlaskConical,
  RotateCcw,
  Sparkles,
  Info,
  Layers,
  ChevronRight,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import DavenportDiagram from "../../../components/simulators/DavenportDiagram";
import {
  solveAcidBase,
  solvePH,
  AcidBaseInput,
  NORMAL_PH,
  NORMAL_PACO2,
  NORMAL_HCO3,
  NORMAL_AG,
} from "../../../lib/simulations/acidBaseSolver";
import SimulatorPresetPanel, { SimulatorPreset } from '../../../components/simulators/SimulatorPresetPanel';

const ACID_BASE_PRESETS: SimulatorPreset[] = [
  { id: 'normal', label: 'Normal ABG', icon: '💚', description: 'Normal arterial blood gas values.', values: { paco2: 40, hco3: 24, na: 140, cl: 104, albumin: 4.0 } },
  { id: 'resp-acid', label: 'Resp. Acidosis', icon: '🔴', badge: 'Acute', description: 'Acute respiratory acidosis (COPD exacerbation). PaCO2 ↑, HCO3 normal.', values: { paco2: 70, hco3: 26, na: 140, cl: 104, albumin: 4.0 } },
  { id: 'met-acid-ag', label: 'Met. Acidosis (AG+)', icon: '🟠', badge: 'High AG', description: 'High anion gap metabolic acidosis (e.g., DKA). Low HCO3, high AG.', values: { paco2: 28, hco3: 10, na: 138, cl: 100, albumin: 4.0 } },
  { id: 'met-alk', label: 'Met. Alkalosis', icon: '🟡', badge: 'Vomiting', description: 'Metabolic alkalosis (prolonged vomiting). High HCO3, compensatory CO2 rise.', values: { paco2: 48, hco3: 36, na: 140, cl: 90, albumin: 4.0 } },
  { id: 'resp-alk', label: 'Resp. Alkalosis', icon: '🔵', badge: 'Hyperventilation', description: 'Acute respiratory alkalosis (anxiety/PE). Low PaCO2, normal HCO3.', values: { paco2: 22, hco3: 22, na: 140, cl: 106, albumin: 4.0 } },
  { id: 'mixed', label: 'Mixed Disorder', icon: '⚠️', badge: 'Complex', badgeColor: 'rgba(124,58,237,0.8)', description: 'Mixed met. acidosis + resp. alkalosis (sepsis, liver failure).', values: { paco2: 25, hco3: 12, na: 142, cl: 108, albumin: 2.5 } },
];

export default function AcidBaseSimulatorPage() {
  // Primary blood gas & electrolyte inputs
  const [paco2, setPaco2] = useState<number>(40);
  const [hco3, setHco3] = useState<number>(24);
  const [na, setNa] = useState<number>(140);
  const [cl, setCl] = useState<number>(104);
  const [albumin, setAlbumin] = useState<number>(4.0);
  const [isChronic, setIsChronic] = useState<boolean>(false);
  const [showAlbumin, setShowAlbumin] = useState<boolean>(false);

  // Active view tab: 'davenport' | 'engine' | 'electrolytes'
  const [activeTab, setActiveTab] = useState<"davenport" | "engine" | "electrolytes">("davenport");

  const handleAcidBasePreset = (values: Record<string, number | boolean>) => {
    if (typeof values.paco2 === 'number') setPaco2(values.paco2);
    if (typeof values.hco3 === 'number') setHco3(values.hco3);
    if (typeof values.na === 'number') setNa(values.na);
    if (typeof values.cl === 'number') setCl(values.cl);
    if (typeof values.albumin === 'number') setAlbumin(values.albumin);
  };
  const handleAcidBaseReset = () => { setPaco2(40); setHco3(24); setNa(140); setCl(104); setAlbumin(4.0); };

  // Clinical Case Presets
  const presets = [
    {
      id: "normal",
      name: "Normal Baseline",
      category: "Euvolemic / Baseline",
      paco2: 40,
      hco3: 24,
      na: 140,
      cl: 104,
      albumin: 4.0,
      isChronic: false,
      badge: "bg-emerald-950/40 text-emerald-300 border-emerald-800/40",
      description: "Resting healthy adult arterial blood gas and serum electrolytes.",
    },
    {
      id: "dka",
      name: "Diabetic Ketoacidosis (DKA)",
      category: "Metabolic Acidosis (High AG)",
      paco2: 20,
      hco3: 7,
      na: 134,
      cl: 96,
      albumin: 4.0,
      isChronic: false,
      badge: "bg-rose-950/40 text-rose-300 border-rose-800/40",
      description: "Severe ketoacidosis with classic Kussmaul hyperventilation and elevated anion gap.",
    },
    {
      id: "vomiting",
      name: "Severe Vomiting / Gastric Loss",
      category: "Metabolic Alkalosis",
      paco2: 48,
      hco3: 40,
      na: 138,
      cl: 86,
      albumin: 4.0,
      isChronic: false,
      badge: "bg-cyan-950/40 text-cyan-300 border-cyan-800/40",
      description: "Loss of gastric HCl causing hypochloremic metabolic alkalosis with hypoventilatory compensation.",
    },
    {
      id: "copd",
      name: "COPD Exacerbation (Acute-on-Chronic)",
      category: "Respiratory Acidosis",
      paco2: 70,
      hco3: 34,
      na: 140,
      cl: 96,
      albumin: 4.0,
      isChronic: true,
      badge: "bg-indigo-950/40 text-indigo-300 border-indigo-800/40",
      description: "Severe airflow limitation with baseline renal bicarbonate retention and acute CO2 rise.",
    },
    {
      id: "panic",
      name: "Panic Attack Hyperventilation",
      category: "Respiratory Alkalosis",
      paco2: 22,
      hco3: 21,
      na: 140,
      cl: 107,
      albumin: 4.0,
      isChronic: false,
      badge: "bg-sky-950/40 text-sky-300 border-sky-800/40",
      description: "Acute psychogenic hyperventilation driving arterial hypocapnia and acute alkalemia.",
    },
    {
      id: "salicylate",
      name: "Salicylate (Aspirin) Toxicity",
      category: "Mixed Disorder (HAGMA + Resp Alk)",
      paco2: 18,
      hco3: 12,
      na: 140,
      cl: 102,
      albumin: 4.0,
      isChronic: false,
      badge: "bg-purple-950/40 text-purple-300 border-purple-800/40",
      description: "Central respiratory center stimulation plus uncoupling of oxidative phosphorylation.",
    },
    {
      id: "diarrhea",
      name: "Severe Diarrhea / NAGMA",
      category: "Metabolic Acidosis (Normal AG)",
      paco2: 28,
      hco3: 12,
      na: 140,
      cl: 116,
      albumin: 4.0,
      isChronic: false,
      badge: "bg-amber-950/40 text-amber-300 border-amber-800/40",
      description: "Gastrointestinal bicarbonate wasting with compensatory hyperchloremia and normal AG.",
    },
    {
      id: "arrest",
      name: "Cardiac Arrest / Mixed Acidosis",
      category: "Mixed Severe Acidosis",
      paco2: 65,
      hco3: 14,
      na: 140,
      cl: 98,
      albumin: 4.0,
      isChronic: false,
      badge: "bg-red-950/50 text-red-300 border-red-800/50",
      description: "Combined lactic acidosis from tissue ischemia and hypercapnia from apnea/hypoventilation.",
    },
  ];

  const applyPreset = (preset: (typeof presets)[0]) => {
    setPaco2(preset.paco2);
    setHco3(preset.hco3);
    setNa(preset.na);
    setCl(preset.cl);
    setAlbumin(preset.albumin);
    setIsChronic(preset.isChronic);
  };

  // Run full physiological diagnostic solver
  const results = useMemo(() => {
    return solveAcidBase({
      paco2,
      hco3,
      na,
      cl,
      albumin: showAlbumin ? albumin : 4.0,
      isChronic,
    });
  }, [paco2, hco3, na, cl, albumin, isChronic, showAlbumin]);

  // Handle click on Davenport Diagram to set coordinates
  const handleDavenportClick = (newPH: number, newHCO3: number) => {
    setHco3(newHCO3);
    // PaCO2 = [HCO3-] / (0.03 * 10^(pH - 6.1))
    const calculatedPaCO2 = Math.round(newHCO3 / (0.03 * Math.pow(10, newPH - 6.1)));
    setPaco2(Math.max(10, Math.min(100, calculatedPaCO2)));
  };

  const getSeverityBadge = () => {
    switch (results.clinicalSeverity) {
      case "life_threatening":
        return {
          bg: "bg-red-500/20 text-red-400 border-red-500/40",
          label: "Critical / Life-Threatening",
          icon: <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />,
        };
      case "severe":
        return {
          bg: "bg-rose-500/20 text-rose-400 border-rose-500/40",
          label: "Severe Disturbance",
          icon: <AlertTriangle className="w-4 h-4 text-rose-400" />,
        };
      case "moderate":
        return {
          bg: "bg-amber-500/20 text-amber-400 border-amber-500/40",
          label: "Moderate Disturbance",
          icon: <Activity className="w-4 h-4 text-amber-400" />,
        };
      default:
        return {
          bg: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
          label: "Physiological Normal",
          icon: <CheckCircle className="w-4 h-4 text-emerald-400" />,
        };
    }
  };

  const severityInfo = getSeverityBadge();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation & Header */}
        <div>
          <Link
            href="/simulators"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition text-xs font-semibold mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Virtual Labs
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-3">
                <FlaskConical className="w-8 h-8 text-teal-400" />
                Acid-Base <span className="text-teal-400">&</span> Davenport Nomogram Lab
              </h1>
              <p className="text-slate-400 text-xs md:text-sm mt-1 max-w-2xl">
                Real-time Henderson-Hasselbalch equation solver, Winter&apos;s compensation model, Anion Gap / Delta-Delta evaluation, and 2D Davenport nomogram buffer lines.
              </p>
            </div>

            {/* View Tab Switcher */}
            <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 self-start lg:self-auto shrink-0">
              <button
                onClick={() => setActiveTab("davenport")}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                  activeTab === "davenport"
                    ? "bg-teal-500 text-slate-950 shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                Davenport Nomogram
              </button>
              <button
                onClick={() => setActiveTab("engine")}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                  activeTab === "engine"
                    ? "bg-teal-500 text-slate-950 shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                4-Step ABG Engine
              </button>
              <button
                onClick={() => setActiveTab("electrolytes")}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                  activeTab === "electrolytes"
                    ? "bg-teal-500 text-slate-950 shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                Ion Balance & AG
              </button>
            </div>
          </div>
        </div>

        <SimulatorPresetPanel presets={ACID_BASE_PRESETS} onApply={handleAcidBasePreset} onReset={handleAcidBaseReset} />

        {/* Clinical Presets Carousel / Quick-Select Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-300 flex items-center gap-2 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-teal-400" />
              Clinical Case Presets
            </h3>
            <span className="text-[11px] text-slate-500">Select a clinical case to instantly load parameters</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {presets.map((p) => (
              <button
                key={p.id}
                onClick={() => applyPreset(p)}
                className={`p-2 rounded-xl border text-left transition flex flex-col justify-between ${p.badge} hover:brightness-125`}
              >
                <span className="text-[11px] font-bold line-clamp-1">{p.name}</span>
                <span className="text-[9px] opacity-70 mt-1 line-clamp-1">{p.category}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Primary Diagnostic Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2.5">
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${severityInfo.bg}`}>
                {severityInfo.icon}
                {severityInfo.label}
              </span>
              <span className="text-xs font-mono text-slate-400">
                Primary ABG Diagnosis
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
              {results.diagnosticLabel}
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              {results.compensation.interpretation}
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 self-stretch lg:self-auto shrink-0 font-mono text-xs">
            <div className="bg-slate-950 border border-slate-850 p-3 rounded-xl flex flex-col justify-center">
              <span className="text-[10px] text-slate-400 uppercase font-sans font-bold">Arterial pH</span>
              <span className={`text-xl font-black ${results.ph < 7.35 ? "text-rose-400" : results.ph > 7.45 ? "text-cyan-400" : "text-emerald-400"}`}>
                {results.ph.toFixed(2)}
              </span>
              <span className="text-[10px] text-slate-500">[H⁺] = {results.hIonNmol} nmol/L</span>
            </div>

            <div className="bg-slate-950 border border-slate-850 p-3 rounded-xl flex flex-col justify-center">
              <span className="text-[10px] text-slate-400 uppercase font-sans font-bold">PaCO₂</span>
              <span className={`text-xl font-black ${paco2 > 45 ? "text-rose-400" : paco2 < 35 ? "text-cyan-400" : "text-emerald-400"}`}>
                {paco2} <span className="text-xs font-normal">mmHg</span>
              </span>
              <span className="text-[10px] text-slate-500">dCO₂ = {results.dissolvedCO2} mM</span>
            </div>

            <div className="bg-slate-950 border border-slate-850 p-3 rounded-xl flex flex-col justify-center">
              <span className="text-[10px] text-slate-400 uppercase font-sans font-bold">[HCO₃⁻]</span>
              <span className={`text-xl font-black ${hco3 < 22 ? "text-amber-400" : hco3 > 26 ? "text-cyan-400" : "text-emerald-400"}`}>
                {hco3} <span className="text-xs font-normal">mEq/L</span>
              </span>
              <span className="text-[10px] text-slate-500">Ref: 22 - 26</span>
            </div>

            <div className="bg-slate-950 border border-slate-850 p-3 rounded-xl flex flex-col justify-center">
              <span className="text-[10px] text-slate-400 uppercase font-sans font-bold">Anion Gap</span>
              <span className={`text-xl font-black ${results.anionGap.isHigh ? "text-rose-400" : "text-emerald-400"}`}>
                {results.anionGap.anionGap} <span className="text-xs font-normal">mEq/L</span>
              </span>
              <span className="text-[10px] text-slate-500">
                {results.anionGap.isHigh ? `ΔGap = +${results.anionGap.deltaGap}` : "Ref: 8 - 12"}
              </span>
            </div>
          </div>
        </div>

        {/* Main Work Area: Left Controls & Right Diagnostics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Interactive Parameters Panel */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-teal-400" />
                  Arterial & Serum Parameters
                </h3>
                <button
                  onClick={() => {
                    setPaco2(40);
                    setHco3(24);
                    setNa(140);
                    setCl(104);
                    setAlbumin(4.0);
                    setIsChronic(false);
                  }}
                  className="text-[11px] text-slate-400 hover:text-teal-300 flex items-center gap-1 transition"
                  title="Reset to Normal Baseline"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              </div>

              {/* Sliders */}
              <div className="space-y-5">
                {/* PaCO2 Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-300">Arterial PaCO₂</span>
                    <span className="text-teal-400 font-mono font-bold bg-teal-400/10 px-2 py-0.5 rounded">
                      {paco2} mmHg
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="1"
                    value={paco2}
                    onChange={(e) => setPaco2(parseInt(e.target.value) || 10)}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>10 (Hyperventilation)</span>
                    <span className="text-teal-400/80">40 (Normal)</span>
                    <span>100 (Hypoventilation)</span>
                  </div>
                </div>

                {/* HCO3- Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-300">Serum [HCO₃⁻]</span>
                    <span className="text-sky-400 font-mono font-bold bg-sky-400/10 px-2 py-0.5 rounded">
                      {hco3} mEq/L
                    </span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="55"
                    step="1"
                    value={hco3}
                    onChange={(e) => setHco3(parseInt(e.target.value) || 4)}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>4 (Acid Loss/Consumption)</span>
                    <span className="text-sky-400/80">24 (Normal)</span>
                    <span>55 (Alkaline Excess)</span>
                  </div>
                </div>

                {/* Serum Sodium [Na+] */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-300">Serum Sodium [Na⁺]</span>
                    <span className="text-indigo-400 font-mono font-bold bg-indigo-400/10 px-2 py-0.5 rounded">
                      {na} mEq/L
                    </span>
                  </div>
                  <input
                    type="range"
                    min="115"
                    max="165"
                    step="1"
                    value={na}
                    onChange={(e) => setNa(parseInt(e.target.value) || 115)}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>115 (Hyponatremia)</span>
                    <span className="text-indigo-400/80">140 (Normal)</span>
                    <span>165 (Hypernatremia)</span>
                  </div>
                </div>

                {/* Serum Chloride [Cl-] */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-300">Serum Chloride [Cl⁻]</span>
                    <span className="text-emerald-400 font-mono font-bold bg-emerald-400/10 px-2 py-0.5 rounded">
                      {cl} mEq/L
                    </span>
                  </div>
                  <input
                    type="range"
                    min="65"
                    max="135"
                    step="1"
                    value={cl}
                    onChange={(e) => setCl(parseInt(e.target.value) || 65)}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>65 (Hypochloremia)</span>
                    <span className="text-emerald-400/80">104 (Normal)</span>
                    <span>135 (Hyperchloremia)</span>
                  </div>
                </div>

                {/* Chronicity Toggle for Respiratory Disorders */}
                <div className="border-t border-slate-800 pt-4 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-slate-300 block">Respiratory Duration:</span>
                    <span className="text-[10px] text-slate-500">Renal HCO₃⁻ retention time</span>
                  </div>
                  <div className="flex gap-1 bg-slate-950 p-1 rounded-lg border border-slate-850">
                    <button
                      onClick={() => setIsChronic(false)}
                      className={`px-2.5 py-1 rounded font-semibold transition ${
                        !isChronic
                          ? "bg-teal-500/20 text-teal-300 border border-teal-500/30"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Acute (&lt;24h)
                    </button>
                    <button
                      onClick={() => setIsChronic(true)}
                      className={`px-2.5 py-1 rounded font-semibold transition ${
                        isChronic
                          ? "bg-teal-500/20 text-teal-300 border border-teal-500/30"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Chronic (3-5d)
                    </button>
                  </div>
                </div>

                {/* Optional Albumin Correction Section */}
                <div className="border-t border-slate-800 pt-3">
                  <button
                    onClick={() => setShowAlbumin(!showAlbumin)}
                    className="text-xs text-slate-400 hover:text-slate-200 flex items-center justify-between w-full font-semibold"
                  >
                    <span>Albumin Anion Gap Correction</span>
                    <span className="text-teal-400 font-mono text-[10px]">
                      {showAlbumin ? `Alb: ${albumin} g/dL` : "Default (4.0)"}
                    </span>
                  </button>
                  {showAlbumin && (
                    <div className="mt-3 space-y-1.5 bg-slate-950 p-3 rounded-xl border border-slate-850">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-300">Serum Albumin</span>
                        <span className="text-amber-400 font-mono font-bold">{albumin.toFixed(1)} g/dL</span>
                      </div>
                      <input
                        type="range"
                        min="1.0"
                        max="5.5"
                        step="0.1"
                        value={albumin}
                        onChange={(e) => setAlbumin(parseFloat(e.target.value) || 4.0)}
                        className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                      />
                      <p className="text-[10px] text-slate-500">
                        Formula: Corrected AG = AG + 2.5 × (4.0 - Albumin)
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Henderson-Hasselbalch Mathematical Box */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
              <h3 className="font-bold text-white text-xs flex items-center gap-2 uppercase tracking-wider">
                <FileText className="w-4 h-4 text-teal-400" />
                Henderson-Hasselbalch Equation
              </h3>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 font-mono text-xs text-slate-300 space-y-1.5">
                <div className="text-teal-400 font-bold">
                  pH = 6.10 + log₁₀([HCO₃⁻] / (0.03 × PaCO₂))
                </div>
                <div className="text-[11px] text-slate-400">
                  = 6.10 + log₁₀({hco3} / (0.03 × {paco2}))
                </div>
                <div className="text-[11px] text-slate-400">
                  = 6.10 + log₁₀({hco3} / {results.dissolvedCO2})
                </div>
                <div className="text-[11px] text-white font-bold pt-1 border-t border-slate-800">
                  = 6.10 + {Math.log10(hco3 / (0.03 * paco2)).toFixed(3)} ={" "}
                  <span className="text-teal-300">{results.ph.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic View Modes */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {activeTab === "davenport" && (
              <>
                <DavenportDiagram data={results.davenport} onPointClick={handleDavenportClick} />

                {/* Physiology Mechanics Breakdown */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <Info className="w-4 h-4 text-teal-400" />
                    Davenport Diagram Physiology Principles
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-1">
                      <strong className="text-teal-400 block font-semibold">1. Non-Bicarbonate Buffer Slope (β ≈ -25 slykes):</strong>
                      <p className="text-slate-400 leading-relaxed text-[11px]">
                        Buffering of carbonic acid by hemoglobin, proteins, and phosphates creates a linear buffer line. Acute respiratory changes move along this slope.
                      </p>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-1">
                      <strong className="text-sky-400 block font-semibold">2. CO₂ Isobar Curves:</strong>
                      <p className="text-slate-400 leading-relaxed text-[11px]">
                        Each isobar reflects fixed arterial PaCO₂. Metabolic disorders and renal compensation shift the operating point across isobars.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === "engine" && (
              <div className="space-y-4">
                {results.steps.map((s) => (
                  <div
                    key={s.step}
                    className={`bg-slate-900 border rounded-2xl p-5 shadow-xl space-y-2.5 transition ${
                      s.status === "critical"
                        ? "border-rose-900/60 bg-rose-950/10"
                        : s.status === "abnormal"
                          ? "border-amber-900/60 bg-amber-950/10"
                          : s.status === "compensated"
                            ? "border-sky-900/60 bg-sky-950/10"
                            : "border-slate-800"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-slate-800 text-teal-400 font-mono text-xs font-bold flex items-center justify-center border border-slate-700">
                          {s.step}
                        </span>
                        <h4 className="font-bold text-white text-sm">{s.title}</h4>
                      </div>
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                          s.status === "critical"
                            ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                            : s.status === "abnormal"
                              ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                              : s.status === "compensated"
                                ? "bg-sky-500/20 text-sky-300 border-sky-500/30"
                                : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                        }`}
                      >
                        {s.status}
                      </span>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 font-mono text-xs text-slate-300">
                      {s.observation}
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed font-medium">
                      {s.conclusion}
                    </p>
                  </div>
                ))}

                {/* Clinical Differential Diagnoses */}
                {results.differentials.length > 0 && (
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      Clinical Differential Diagnoses
                    </h4>
                    <div className="space-y-1.5 text-xs text-slate-300">
                      {results.differentials.map((diff, i) => (
                        <div
                          key={i}
                          className={diff.startsWith("•") ? "pl-4 text-slate-400 text-[11px]" : "font-bold text-teal-300 pt-2"}
                        >
                          {diff}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "electrolytes" && (
              <div className="space-y-6">
                {/* Electrolyte Balance Visualizer */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                  <div>
                    <h3 className="font-bold text-white text-sm mb-1 flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-teal-400" />
                      Serum Electrolyte &amp; Anion Gap Balance
                    </h3>
                    <p className="text-xs text-slate-400">
                      Electroneutrality Principle: Total Cations ([Na⁺]) = Total Anions ([Cl⁻] + [HCO₃⁻] + Unmeasured Anions [AG]).
                    </p>
                  </div>

                  {/* Stacked Bars Comparison */}
                  <div className="space-y-4">
                    {/* Cations Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="font-semibold text-indigo-300">Serum Cations ([Na⁺])</span>
                        <span className="font-bold text-white">{na} mEq/L</span>
                      </div>
                      <div className="w-full h-8 bg-slate-950 rounded-xl overflow-hidden flex border border-slate-800">
                        <div
                          style={{ width: "100%" }}
                          className="bg-indigo-600 flex items-center px-3 text-xs font-mono font-bold text-white"
                        >
                          Na⁺ ({na} mEq/L)
                        </div>
                      </div>
                    </div>

                    {/* Anions Bar (Cl- + HCO3- + AG) */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="font-semibold text-teal-300">Serum Anions ([Cl⁻] + [HCO₃⁻] + AG)</span>
                        <span className="font-bold text-white">
                          {cl + hco3 + Math.max(0, results.anionGap.anionGap)} mEq/L
                        </span>
                      </div>
                      <div className="w-full h-8 bg-slate-950 rounded-xl overflow-hidden flex border border-slate-800 text-[11px] font-mono font-bold">
                        <div
                          style={{ width: `${(cl / na) * 100}%` }}
                          className="bg-emerald-600 text-white flex items-center justify-center overflow-hidden whitespace-nowrap px-1"
                        >
                          Cl⁻ ({cl})
                        </div>
                        <div
                          style={{ width: `${(hco3 / na) * 100}%` }}
                          className="bg-sky-600 text-white flex items-center justify-center overflow-hidden whitespace-nowrap px-1"
                        >
                          HCO₃⁻ ({hco3})
                        </div>
                        <div
                          style={{
                            width: `${(Math.max(0, results.anionGap.anionGap) / na) * 100}%`,
                          }}
                          className={`${
                            results.anionGap.isHigh ? "bg-rose-600" : "bg-slate-700"
                          } text-white flex items-center justify-center overflow-hidden whitespace-nowrap px-1`}
                        >
                          AG ({results.anionGap.anionGap})
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Anion Gap Diagnostic Summary */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Calculated Anion Gap:</span>
                      <span className={`font-mono font-black text-sm ${results.anionGap.isHigh ? "text-rose-400" : "text-teal-400"}`}>
                        {results.anionGap.anionGap} mEq/L
                      </span>
                    </div>
                    {results.anionGap.deltaRatio !== null && (
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Delta Ratio (ΔAG / Δ[HCO₃⁻]):</span>
                        <span className="font-mono font-bold text-sky-300">
                          {results.anionGap.deltaRatio}
                        </span>
                      </div>
                    )}
                    <p className="text-slate-300 text-[11px] pt-1 border-t border-slate-800 leading-relaxed">
                      {results.anionGap.interpretation}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
