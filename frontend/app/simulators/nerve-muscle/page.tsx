"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Play,
  Square,
  Zap,
  Activity,
  Sliders,
  Shield,
  Award,
  Brain,
  Gauge,
  Info,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";
import NerveMuscleGraph from "../../../components/simulators/NerveMuscleGraph";
import { solveGoldmanHodgkinKatz } from "../../../lib/simulations/membraneSolver";

export default function NerveMuscleChamber() {
  const [activeTab, setActiveTab] = useState<"ghk" | "chamber">("ghk");

  // ==========================================
  // GHK Membrane Potential State
  // ==========================================
  const [kInside, setKInside] = useState<number>(140); // mM
  const [kOutside, setKOutside] = useState<number>(4.5); // mM
  const [kPerm, setKPerm] = useState<number>(1.0); // relative permeability

  const [naInside, setNaInside] = useState<number>(12); // mM
  const [naOutside, setNaOutside] = useState<number>(145); // mM
  const [naPerm, setNaPerm] = useState<number>(0.04); // relative permeability

  const [clInside, setClInside] = useState<number>(4); // mM
  const [clOutside, setClOutside] = useState<number>(115); // mM
  const [clPerm, setClPerm] = useState<number>(0.45); // relative permeability

  const [tempCelsius, setTempCelsius] = useState<number>(37); // Celsius

  const ghkPresets = [
    {
      name: "Resting Neuron (-70 mV)",
      ki: 140,
      ko: 4.5,
      pk: 1.0,
      nai: 12,
      nao: 145,
      pna: 0.04,
      cli: 4,
      clo: 115,
      pcl: 0.45,
      style: "hover:border-slate-500 bg-slate-800 text-white",
    },
    {
      name: "Severe Hyperkalemia ([K+]o = 8.5 mM)",
      ki: 140,
      ko: 8.5,
      pk: 1.0,
      nai: 12,
      nao: 145,
      pna: 0.04,
      cli: 4,
      clo: 115,
      pcl: 0.45,
      style: "hover:border-red-500 bg-red-950/20 text-red-400 border-red-900/40",
    },
    {
      name: "Hypokalemia ([K+]o = 2.5 mM)",
      ki: 140,
      ko: 2.5,
      pk: 1.0,
      nai: 12,
      nao: 145,
      pna: 0.04,
      cli: 4,
      clo: 115,
      pcl: 0.45,
      style: "hover:border-amber-500 bg-amber-950/20 text-amber-400 border-amber-900/40",
    },
    {
      name: "Action Potential Peak (Na+ Perm 20x)",
      ki: 140,
      ko: 4.5,
      pk: 1.0,
      nai: 12,
      nao: 145,
      pna: 20.0,
      cli: 4,
      clo: 115,
      pcl: 0.45,
      style: "hover:border-purple-500 bg-purple-950/20 text-purple-400 border-purple-900/40",
    },
    {
      name: "Skeletal Muscle Resting (-90 mV)",
      ki: 155,
      ko: 4.0,
      pk: 1.0,
      nai: 12,
      nao: 145,
      pna: 0.01,
      cli: 4,
      clo: 120,
      pcl: 0.5,
      style: "hover:border-emerald-500 bg-emerald-950/20 text-emerald-400 border-emerald-900/40",
    },
  ];

  const applyGhkPreset = (p: (typeof ghkPresets)[0]) => {
    setKInside(p.ki);
    setKOutside(p.ko);
    setKPerm(p.pk);
    setNaInside(p.nai);
    setNaOutside(p.nao);
    setNaPerm(p.pna);
    setClInside(p.cli);
    setClOutside(p.clo);
    setClPerm(p.pcl);
  };

  // Real-time pure functional calculation using solveGoldmanHodgkinKatz
  const ghkResults = useMemo(() => {
    return solveGoldmanHodgkinKatz({
      kInside,
      kOutside,
      kPermeability: kPerm,
      naInside,
      naOutside,
      naPermeability: naPerm,
      clInside,
      clOutside,
      clPermeability: clPerm,
      temperatureCelsius: tempCelsius,
    });
  }, [
    kInside,
    kOutside,
    kPerm,
    naInside,
    naOutside,
    naPerm,
    clInside,
    clOutside,
    clPerm,
    tempCelsius,
  ]);

  // Chart data for comparing resting membrane potential to individual Nernst potentials
  const potentialsChartData = useMemo(() => {
    return [
      { name: "Vm (Membrane)", value: ghkResults.restingPotential, color: "#a855f7" },
      { name: "E_K (Potassium)", value: ghkResults.eK, color: "#38bdf8" },
      { name: "E_Na (Sodium)", value: ghkResults.eNa, color: "#f43f5e" },
      { name: "E_Cl (Chloride)", value: ghkResults.eCl, color: "#10b981" },
    ];
  }, [ghkResults]);

  // Clinical explanation of current membrane state
  const getMembraneClinicalExplanation = () => {
    const vm = ghkResults.restingPotential;
    if (kOutside >= 6.0) {
      return {
        category: "Severe Hyperkalemic Depolarization",
        color: "text-red-400 bg-red-950/30 border-red-800/40",
        icon: <AlertTriangle className="w-5 h-5 text-red-400" />,
        text: `Elevated extracellular K+ (${kOutside} mM) diminishes the chemical gradient for K+ efflux, shifting E_K from normal ~ -90 mV towards 0 mV. This partially depolarizes V_m to ${vm} mV, inactivating voltage-gated Na+ channels and risking fatal cardiac arrhythmias (sine waves / ventricular fibrillation).`,
      };
    }
    if (kOutside <= 3.0) {
      return {
        category: "Hypokalemic Hyperpolarization",
        color: "text-amber-400 bg-amber-950/30 border-amber-800/40",
        icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
        text: `Low extracellular K+ (${kOutside} mM) steepens the concentration gradient, pulling E_K and resting V_m further negative (${vm} mV). The cell becomes hyperpolarized and less excitable, presenting clinically as muscle weakness, hyporeflexia, and cardiac U-waves.`,
      };
    }
    if (naPerm > 2.0) {
      return {
        category: "Depolarizing Action Potential Overshoot",
        color: "text-purple-400 bg-purple-950/30 border-purple-800/40",
        icon: <Zap className="w-5 h-5 text-purple-400" />,
        text: `Massive increase in Sodium Permeability (P_Na = ${naPerm}) swings membrane voltage toward the sodium equilibrium potential (+${ghkResults.eNa} mV), mirroring the rapid rising phase of an action potential.`,
      };
    }
    return {
      category: "Normal Physiological Resting Potential",
      color: "text-emerald-400 bg-emerald-950/30 border-emerald-800/40",
      icon: <CheckCircle className="w-5 h-5 text-emerald-400" />,
      text: `Because potassium permeability (P_K = ${kPerm}) dominates at rest, the membrane potential (${vm} mV) sits close to E_K (${ghkResults.eK} mV). The high Na+/K+-ATPase pump activity maintains the steep chemical gradients across the lipid bilayer.`,
    };
  };

  const ghkExplanation = getMembraneClinicalExplanation();

  // ==========================================
  // Neuromuscular Chamber Simulation State
  // ==========================================
  const [voltage, setVoltage] = useState<number>(5.0); // V
  const [frequency, setFrequency] = useState<number>(20); // Hz
  const [isStimulating, setIsStimulating] = useState<boolean>(false);

  // Live simulation variables
  const [force, setForce] = useState<number>(0);
  const [recruitment, setRecruitment] = useState<number>(50);
  const [fatigueIndex, setFatigueIndex] = useState<number>(0);

  // Historical scrolling data
  const [chartData, setChartData] = useState<any[]>([]);

  const stateRef = useRef({
    voltage,
    frequency,
    isStimulating,
    calcium: 0,
    fatigueFactor: 1.0,
    stimDuration: 0,
    time: 0,
    lastPulseTime: 0,
    singleShockTriggered: false,
  });

  const chamberPresets = [
    {
      name: "Single Twitch",
      voltage: 4.0,
      frequency: 1,
      run: false,
      style: "hover:border-slate-500 bg-slate-800 text-white",
    },
    {
      name: "Wave Summation",
      voltage: 4.0,
      frequency: 15,
      run: true,
      style: "hover:border-sky-500 bg-sky-950/20 text-sky-400 border-sky-900/40",
    },
    {
      name: "Unfused Tetanus",
      voltage: 4.0,
      frequency: 25,
      run: true,
      style: "hover:border-purple-500 bg-purple-950/20 text-purple-400 border-purple-900/40",
    },
    {
      name: "Fused Tetanus",
      voltage: 4.0,
      frequency: 60,
      run: true,
      style: "hover:border-pink-500 bg-pink-950/20 text-pink-400 border-pink-900/40",
    },
    {
      name: "Fatigue Demo",
      voltage: 4.0,
      frequency: 95,
      run: true,
      style: "hover:border-red-500 bg-red-950/20 text-red-400 border-red-900/40",
    },
  ];

  const applyChamberPreset = (p: (typeof chamberPresets)[0]) => {
    setVoltage(p.voltage);
    setFrequency(p.frequency);
    setIsStimulating(p.run);
    if (!p.run && p.name === "Single Twitch") {
      stateRef.current.singleShockTriggered = true;
    }
  };

  useEffect(() => {
    stateRef.current.voltage = voltage;
    stateRef.current.frequency = frequency;
    stateRef.current.isStimulating = isStimulating;
  }, [voltage, frequency, isStimulating]);

  useEffect(() => {
    let rec = 0;
    if (voltage >= 2.0) {
      rec = Math.min(100, Math.round(((voltage - 2.0) / 6.0) * 100));
    }
    setRecruitment(rec);
  }, [voltage]);

  const handleSingleShock = () => {
    stateRef.current.singleShockTriggered = true;
  };

  useEffect(() => {
    const initialPoints = [];
    for (let i = 0; i < 120; i++) {
      initialPoints.push({
        time: i * 0.02,
        force: 0,
        stim: 0,
      });
    }
    setChartData(initialPoints);
    stateRef.current.time = 2.4;

    const dt = 0.02;
    const interval = setInterval(() => {
      const state = stateRef.current;
      state.time += dt;

      let stimActive = 0;
      const recFactor = state.voltage >= 2.0 ? Math.min(1.0, (state.voltage - 2.0) / 6.0) : 0;

      let triggerPulse = false;
      if (state.singleShockTriggered) {
        triggerPulse = true;
        state.singleShockTriggered = false;
        stimActive = state.voltage;
      } else if (state.isStimulating) {
        state.stimDuration += dt;
        const pulseInterval = 1.0 / state.frequency;
        if (state.time - state.lastPulseTime >= pulseInterval) {
          triggerPulse = true;
          state.lastPulseTime = state.time;
          stimActive = state.voltage;
        }
      } else {
        state.stimDuration = Math.max(0, state.stimDuration - dt * 2.0);
      }

      if (triggerPulse) {
        state.calcium += 42.0 * recFactor;
      }

      state.calcium *= Math.exp(-dt / 0.12);

      if (state.isStimulating && state.stimDuration > 1.0) {
        const fatigueRate = (state.frequency / 200.0) * dt;
        state.fatigueFactor = Math.max(0.1, state.fatigueFactor - fatigueRate);
      } else if (!state.isStimulating) {
        state.fatigueFactor = Math.min(1.0, state.fatigueFactor + dt * 0.15);
      }

      const rawForce = Math.min(100.0, state.calcium);
      const computedForce = rawForce * state.fatigueFactor;

      setForce(parseFloat(computedForce.toFixed(1)));
      setFatigueIndex(Math.round((1.0 - state.fatigueFactor) * 100));

      setChartData((prev) => {
        const next = [...prev.slice(1)];
        next.push({
          time: state.time,
          force: parseFloat(computedForce.toFixed(1)),
          stim: stimActive,
        });
        return next;
      });
    }, 20);

    return () => clearInterval(interval);
  }, []);

  const getMuscleStateLabel = () => {
    if (force < 0.5) return "Rested / Baseline";
    if (fatigueIndex > 45) return "Fatigued Muscle Fiber";
    if (isStimulating) {
      if (frequency >= 50) return "Fused Tetany (Plateau Contracture)";
      if (frequency >= 15) return "Unfused Tetany (Wave Summation)";
      return "Individual Twitch Summation";
    }
    return "Relaxation Decay Phase";
  };

  const getMolecularState = () => {
    if (force < 0.5) {
      return {
        title: "Sarcomere: Relaxed State",
        caStatus: "Calcium Low / Absent",
        mechanism:
          "Tropomyosin blocks active actin binding sites. Myosin heads are cocked with ADP+Pi, awaiting Ca2+ influx.",
        color: "border-slate-800 text-slate-400 bg-slate-900/30",
      };
    }
    if (fatigueIndex > 30) {
      return {
        title: "Sarcomere: Metabolic Fatigue Block",
        caStatus: "Calcium Elevated, ATP Depleted",
        mechanism:
          "Intracellular acidosis and inorganic phosphate accumulation desensitize Troponin C to Ca2+, reducing cross-bridge force.",
        color: "border-red-900/40 text-red-400 bg-red-950/15",
      };
    }
    if (force > 50) {
      return {
        title: "Sarcomere: Fused Tetanic Contraction",
        caStatus: "Calcium Saturated (> 35)",
        mechanism:
          "Continuous high stimulus frequency prevents sarcoplasmic reticulum Ca2+ reuptake. Troponin C remains fully saturated.",
        color: "border-pink-900/40 text-pink-400 bg-pink-950/15",
      };
    }
    return {
      title: "Sarcomere: Active Cross-Bridge Cycling",
      caStatus: "Calcium Dynamic Flux (5 - 35)",
      mechanism:
        "Ca2+ binds to Troponin C, shifting Tropomyosin and allowing repetitive myosin power strokes.",
      color: "border-emerald-900/40 text-emerald-400 bg-emerald-950/15",
    };
  };

  const molState = getMolecularState();
  const muscleStateLabel = getMuscleStateLabel();

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8 text-slate-100">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/simulators"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition mb-6 text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Labs
        </Link>

        {/* Header */}
        <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2 flex items-center gap-3">
              <Brain className="w-8 h-8 text-purple-400" />
              Nerve-Muscle <span className="text-purple-400">&</span> Membrane Potential Lab
            </h1>
            <p className="text-slate-400 text-sm md:text-base">
              Simulate Goldman-Hodgkin-Katz resting membrane potentials and neuromuscular stimulation mechanics.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 self-start md:self-auto">
            <button
              onClick={() => setActiveTab("ghk")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                activeTab === "ghk"
                  ? "bg-purple-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Gauge className="w-3.5 h-3.5" />
              GHK Membrane Potential
            </button>
            <button
              onClick={() => setActiveTab("chamber")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                activeTab === "chamber"
                  ? "bg-purple-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              Neuromuscular Chamber
            </button>
          </div>
        </header>

        {activeTab === "ghk" ? (
          /* GHK Interactive Membrane Biophysics Workspace */
          <div className="space-y-6">
            {/* Status / Diagnostic Banner */}
            <div className={`p-4 md:p-5 rounded-2xl border flex gap-4 items-center ${ghkExplanation.color}`}>
              {ghkExplanation.icon}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-base md:text-lg text-white mb-0.5">
                    Membrane State: {ghkExplanation.category}
                  </h2>
                  <span className="text-xl md:text-2xl font-black text-purple-300">
                    Vm = {ghkResults.restingPotential} mV
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mt-1">
                  {ghkExplanation.text}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Ion Sliders & Presets */}
              <div className="lg:col-span-6 flex flex-col gap-6">
                {/* Presets */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                  <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-purple-400" />
                    Clinical Electrophysiology Presets
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {ghkPresets.map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => applyGhkPreset(p)}
                        className={`px-3 py-1.5 rounded-lg border border-transparent text-xs font-semibold transition ${p.style}`}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ionic Concentration & Permeability Sliders */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-purple-400" />
                    Transmembrane Ionic Concentrations & Permeabilities
                  </h3>

                  {/* Potassium Section */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-sky-900/30 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-xs font-bold text-sky-400">Potassium (K+) Dynamics</span>
                      <span className="text-xs font-mono text-slate-400">E_K = {ghkResults.eK} mV</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">[K+] Inside</span>
                          <span className="text-white font-bold">{kInside} mM</span>
                        </div>
                        <input
                          type="range"
                          min="50"
                          max="200"
                          step="1"
                          value={kInside}
                          onChange={(e) => setKInside(parseFloat(e.target.value))}
                          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">[K+] Outside</span>
                          <span className="text-sky-300 font-bold">{kOutside} mM</span>
                        </div>
                        <input
                          type="range"
                          min="1.0"
                          max="12.0"
                          step="0.1"
                          value={kOutside}
                          onChange={(e) => setKOutside(parseFloat(e.target.value))}
                          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">P_K (Relative)</span>
                          <span className="text-white font-bold">{kPerm.toFixed(2)}</span>
                        </div>
                        <input
                          type="range"
                          min="0.1"
                          max="2.0"
                          step="0.05"
                          value={kPerm}
                          onChange={(e) => setKPerm(parseFloat(e.target.value))}
                          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sodium Section */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-rose-900/30 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-xs font-bold text-rose-400">Sodium (Na+) Dynamics</span>
                      <span className="text-xs font-mono text-slate-400">E_Na = {ghkResults.eNa} mV</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">[Na+] Inside</span>
                          <span className="text-white font-bold">{naInside} mM</span>
                        </div>
                        <input
                          type="range"
                          min="2"
                          max="40"
                          step="1"
                          value={naInside}
                          onChange={(e) => setNaInside(parseFloat(e.target.value))}
                          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">[Na+] Outside</span>
                          <span className="text-rose-300 font-bold">{naOutside} mM</span>
                        </div>
                        <input
                          type="range"
                          min="80"
                          max="180"
                          step="1"
                          value={naOutside}
                          onChange={(e) => setNaOutside(parseFloat(e.target.value))}
                          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">P_Na (Relative)</span>
                          <span className="text-white font-bold">{naPerm.toFixed(2)}</span>
                        </div>
                        <input
                          type="range"
                          min="0.01"
                          max="25.0"
                          step="0.05"
                          value={naPerm}
                          onChange={(e) => setNaPerm(parseFloat(e.target.value))}
                          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Chloride Section */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-emerald-900/30 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-xs font-bold text-emerald-400">Chloride (Cl-) Dynamics</span>
                      <span className="text-xs font-mono text-slate-400">E_Cl = {ghkResults.eCl} mV</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">[Cl-] Inside</span>
                          <span className="text-white font-bold">{clInside} mM</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="20"
                          step="0.5"
                          value={clInside}
                          onChange={(e) => setClInside(parseFloat(e.target.value))}
                          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">[Cl-] Outside</span>
                          <span className="text-emerald-300 font-bold">{clOutside} mM</span>
                        </div>
                        <input
                          type="range"
                          min="80"
                          max="150"
                          step="1"
                          value={clOutside}
                          onChange={(e) => setClOutside(parseFloat(e.target.value))}
                          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">P_Cl (Relative)</span>
                          <span className="text-white font-bold">{clPerm.toFixed(2)}</span>
                        </div>
                        <input
                          type="range"
                          min="0.05"
                          max="1.0"
                          step="0.05"
                          value={clPerm}
                          onChange={(e) => setClPerm(parseFloat(e.target.value))}
                          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Comparison Graph & Biophysics Card */}
              <div className="lg:col-span-6 flex flex-col gap-6">
                {/* Potentials Comparison Bar Chart */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                  <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                    <span>⚡</span> Membrane Voltage vs. Nernst Equilibrium Potentials
                  </h3>
                  <p className="text-xs text-slate-400 mb-6">
                    Goldman-Hodgkin-Katz resting membrane potential reflects the weighted sum of permeant ions.
                  </p>

                  <div className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={potentialsChartData}
                        margin={{ top: 10, right: 20, left: -10, bottom: 10 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                        <YAxis
                          stroke="#64748b"
                          fontSize={11}
                          domain={[-100, 80]}
                          label={{
                            value: "Potential (mV)",
                            angle: -90,
                            position: "insideLeft",
                            offset: 10,
                            fill: "#64748b",
                          }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#0f172a",
                            borderColor: "#1e293b",
                            borderRadius: "8px",
                            color: "#fff",
                            fontSize: "12px",
                          }}
                        />
                        <ReferenceLine y={0} stroke="#475569" strokeWidth={1.5} />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                          {potentialsChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* GHK Formula & Educational Breakdown */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                  <h4 className="text-sm font-bold text-purple-400 flex items-center gap-2">
                    <Info className="w-4 h-4" /> Goldman-Hodgkin-Katz (GHK) Voltage Equation
                  </h4>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 leading-relaxed overflow-x-auto">
                    V_m = (RT / F) · ln [ (P_K[K+]_o + P_Na[Na+]_o + P_Cl[Cl-]_i) / (P_K[K+]_i + P_Na[Na+]_i + P_Cl[Cl-]_o) ]
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-500 font-bold uppercase">Resting V_m</div>
                      <div className="text-lg font-black text-purple-400">{ghkResults.restingPotential} mV</div>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-500 font-bold uppercase">E_K Nernst</div>
                      <div className="text-lg font-black text-sky-400">{ghkResults.eK} mV</div>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-500 font-bold uppercase">E_Na Nernst</div>
                      <div className="text-lg font-black text-rose-400">{ghkResults.eNa} mV</div>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-500 font-bold uppercase">E_Cl Nernst</div>
                      <div className="text-lg font-black text-emerald-400">{ghkResults.eCl} mV</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Neuromuscular Chamber Stimulation Workspace */
          <div className="space-y-6">
            {/* Live Diagnostics */}
            <div className="p-4 md:p-5 rounded-2xl border flex gap-4 items-center border-purple-500/20 bg-purple-950/10">
              <Zap className="w-6 h-6 text-purple-400 animate-pulse" />
              <div>
                <h2 className="font-bold text-lg text-white mb-0.5">
                  Live Chamber State: {muscleStateLabel}
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {frequency >= 50 && isStimulating && fatigueIndex <= 30
                    ? "Sustained high frequency prevents calcium reuptake into the sarcoplasmic reticulum, generating maximum fused tension."
                    : "Motor unit recruitment scales with voltage. Frequency summation and tetany occur as stimulus frequency exceeds 15-20 Hz."}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Controls Column */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-6 shadow-xl">
                  <div>
                    <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-purple-400" />
                      Stimulation Presets
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {chamberPresets.map((p, idx) => (
                        <button
                          key={idx}
                          onClick={() => applyChamberPreset(p)}
                          className={`px-3 py-1.5 rounded-lg border border-transparent text-xs font-semibold transition ${p.style}`}
                        >
                          {p.name}
                        </button>
                      ))}
                    </div>
                    <hr className="border-slate-800 my-2" />
                    <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2 mt-2">
                      <Sliders className="w-4 h-4 text-purple-400" />
                      Stimulator Controls
                    </h3>
                  </div>

                  {/* Stimulation Actions */}
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={handleSingleShock}
                      className="py-3 px-4 bg-purple-600/10 border border-purple-500/30 hover:bg-purple-600/25 text-purple-300 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
                    >
                      <Zap className="w-4 h-4 text-purple-400" /> Single Shock
                    </button>

                    {isStimulating ? (
                      <button
                        onClick={() => setIsStimulating(false)}
                        className="py-3 px-4 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
                      >
                        <Square className="w-4 h-4" /> Stop Train
                      </button>
                    ) : (
                      <button
                        onClick={() => setIsStimulating(true)}
                        className="py-3 px-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-purple-900/30"
                      >
                        <Play className="w-4 h-4" /> Run Train
                      </button>
                    )}
                  </div>

                  <div className="space-y-6">
                    {/* Stimulus Voltage */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-slate-300">Voltage (V)</span>
                        <span className="text-purple-400 font-bold text-sm bg-purple-400/10 px-2 py-0.5 rounded">
                          {voltage.toFixed(1)} V
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.0"
                        max="10.0"
                        step="0.5"
                        value={voltage}
                        onChange={(e) => setVoltage(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                      />
                      <div className="flex justify-between text-[9px] text-slate-500">
                        <span>Threshold (2V)</span>
                        <span>Max Recruitment (8V)</span>
                      </div>
                    </div>

                    {/* Stimulus Frequency */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-slate-300">Frequency (Hz)</span>
                        <span className="text-purple-400 font-bold text-sm bg-purple-400/10 px-2 py-0.5 rounded">
                          {frequency} Hz
                        </span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="100"
                        step="1"
                        value={frequency}
                        onChange={(e) => setFrequency(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                      />
                      <div className="flex justify-between text-[9px] text-slate-500">
                        <span>Summation (&gt;10Hz)</span>
                        <span>Tetanus (&gt;50Hz)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live Metrics */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                  <h3 className="text-white font-bold mb-1 flex items-center gap-2 text-sm">
                    <Shield className="w-4 h-4 text-purple-400" />
                    Chamber Dynamics
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-slate-800">
                      <span className="text-slate-400">Current Force</span>
                      <span className="font-bold text-pink-400 text-sm">{force} g</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-800">
                      <span className="text-slate-400">Motor Unit Recruitment</span>
                      <span className="font-bold text-white">{recruitment}%</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-slate-400">Fatigue Index</span>
                      <span
                        className={`font-black ${
                          fatigueIndex > 45 ? "text-red-400 animate-pulse" : "text-emerald-400"
                        }`}
                      >
                        {fatigueIndex}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Graph & Molecular Card Column */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                <NerveMuscleGraph data={chartData} />

                {/* Molecular Sarcomere Guide Card */}
                <div
                  className={`p-6 border rounded-2xl transition-colors duration-350 flex flex-col gap-3 shadow-lg ${molState.color}`}
                >
                  <h4 className="font-black text-sm uppercase tracking-wider flex items-center gap-2 text-white">
                    <Award className="w-4 h-4" />
                    {molState.title}
                  </h4>
                  <div className="text-xs font-bold">
                    Calcium State: <span className="underline">{molState.caStatus}</span>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-200">{molState.mechanism}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
