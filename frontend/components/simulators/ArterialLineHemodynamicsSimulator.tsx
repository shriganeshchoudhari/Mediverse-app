'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Activity,
  Droplets,
  AlertTriangle,
  CheckCircle2,
  Gauge,
  Wind,
  HelpCircle,
  Zap,
  Flame,
  Clock,
  RotateCcw,
  Sparkles,
  Info,
  Layers,
  ArrowRight,
} from 'lucide-react';
import {
  HemodynamicParameters,
  VentilatorSettings,
  FastFlushDampingState,
  evaluateArterialLineWorkstation,
  ARTERIAL_LINE_PRESETS,
} from '../../.gemini/skills/ArterialLineHemodynamicsEngine';

export default function ArterialLineHemodynamicsSimulator() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('EUVOLEMIC_VENTILATED_OPTIMAL');

  const [hemo, setHemo] = useState<HemodynamicParameters>(
    ARTERIAL_LINE_PRESETS[0].hemodynamics
  );

  const [vent, setVent] = useState<VentilatorSettings>(
    ARTERIAL_LINE_PRESETS[0].ventilator
  );

  const [damping, setDamping] = useState<FastFlushDampingState>(
    ARTERIAL_LINE_PRESETS[0].damping
  );

  const [userPpvOverride, setUserPpvOverride] = useState<number>(
    ARTERIAL_LINE_PRESETS[0].userPpvOverride ?? 7
  );

  const [activeTab, setActiveTab] = useState<'waveforms' | 'fluid_responsiveness' | 'damping_test' | 'confounders'>('waveforms');

  // Fast-Flush animation state
  const [isFlushing, setIsFlushing] = useState<boolean>(false);
  const [flushTimer, setFlushTimer] = useState<number>(0);

  // Trigger Fast-Flush Test
  const handleTriggerFlush = () => {
    setIsFlushing(true);
    setFlushTimer(1.5); // 1.5 seconds flush duration
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isFlushing && flushTimer > 0) {
      interval = setInterval(() => {
        setFlushTimer((prev) => {
          if (prev <= 0.2) {
            setIsFlushing(false);
            return 0;
          }
          return parseFloat((prev - 0.2).toFixed(1));
        });
      }, 200);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isFlushing, flushTimer]);

  // Master Evaluation
  const evaluation = useMemo(() => {
    return evaluateArterialLineWorkstation(hemo, vent, damping, userPpvOverride);
  }, [hemo, vent, damping, userPpvOverride]);

  // Preset Handler
  const handleSelectPreset = (presetId: string) => {
    const preset = ARTERIAL_LINE_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setSelectedPresetId(presetId);
    setHemo({ ...preset.hemodynamics });
    setVent({ ...preset.ventilator });
    setDamping({ ...preset.damping });
    setUserPpvOverride(preset.userPpvOverride ?? 10);
  };

  // Passive Leg Raise Simulator
  const handleSimulatePlr = () => {
    if (evaluation.fluidResponsiveness.responsivenessTier === 'RESPONSIVE') {
      alert(
        `PASSIVE LEG RAISE (PLR) POSITIVE: Cardiac Output increased by +18% (Stroke Volume +${Math.round(
          hemo.strokeVolumeMl * 0.18
        )} mL). Patient is genuinely fluid responsive!`
      );
    } else if (evaluation.fluidResponsiveness.responsivenessTier === 'NON_RESPONSIVE') {
      alert(
        'PASSIVE LEG RAISE (PLR) NEGATIVE: Cardiac Output increased by < 3%. Patient is preload-independent; fluids will not improve hemodynamics.'
      );
    } else {
      alert(
        'PASSIVE LEG RAISE (PLR) BORDERLINE: Stroke Volume changed by +7%. Consider mini-fluid challenge (150 mL).'
      );
    }
  };

  // Tidal Volume Challenge Simulator
  const handleSimulateVtChallenge = () => {
    if (vent.tidalVolumeMlPerKgPbw <= 6.5) {
      const deltaPpv = 7.5;
      alert(
        `TIDAL VOLUME CHALLENGE: Temporarily increasing Vt from 6 to 8 mL/kg caused PPV to jump by +${deltaPpv}% (> 3.5% threshold). Unmasked fluid responsiveness!`
      );
      setUserPpvOverride(userPpvOverride + deltaPpv);
      setVent((prev) => ({ ...prev, tidalVolumeMlPerKgPbw: 8.0 }));
    } else {
      alert(
        'Tidal volume is already >= 8 mL/kg PBW. Tidal volume challenge is primarily indicated for low Vt ARDS ventilation.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-md bg-rose-500/20 text-rose-400 border border-rose-500/30">
                Critical Care &amp; Hemodynamics
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-md bg-sky-500/20 text-sky-400 border border-sky-500/30">
                Invasive Arterial Line
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mt-2 text-white">
              Arterial Line Hemodynamics, PPV &amp; Fluid Responsiveness Workstation
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Pulse Pressure Variation (PPV), Stroke Volume Variation (SVV), Dynamic Arterial Elastance (Ea_dyn), and Fast-Flush Square Wave Damping Analysis.
            </p>
          </div>

          {/* Preset Selector */}
          <div className="flex items-center gap-2">
            <label htmlFor="preset-select" className="text-xs text-slate-400 font-medium whitespace-nowrap">
              Clinical Preset:
            </label>
            <select
              id="preset-select"
              aria-label="Clinical Preset"
              value={selectedPresetId}
              onChange={(e) => handleSelectPreset(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:outline-none"
            >
              {ARTERIAL_LINE_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Live Waveform Canvas Graphic */}
        <div className="mt-4 p-4 rounded-xl bg-slate-900 border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-rose-400">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping inline-block" />
                ART TRACE (mmHg)
              </div>
              <span className="text-xs text-slate-400">
                Scale: 0 &ndash; 200 mmHg &bull; Sweep: 25 mm/s
              </span>
            </div>

            {/* Trigger Fast Flush Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleTriggerFlush}
                disabled={isFlushing}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
                  isFlushing
                    ? 'bg-amber-600 text-white animate-pulse'
                    : 'bg-rose-600 hover:bg-rose-500 text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                {isFlushing ? 'FLUSHING (300 mmHg)...' : 'Trigger Fast-Flush Test'}
              </button>
            </div>
          </div>

          {/* SVG Waveform Simulation */}
          <div className="w-full h-36 bg-slate-950 rounded-lg border border-slate-800/80 relative flex items-center justify-center overflow-hidden">
            {/* Grid Lines */}
            <div className="absolute inset-0 grid grid-cols-12 grid-rows-4 opacity-10 pointer-events-none">
              {Array.from({ length: 48 }).map((_, i) => (
                <div key={i} className="border-b border-r border-rose-500" />
              ))}
            </div>

            {/* Pressure Reference Markers */}
            <div className="absolute left-2 top-2 text-[10px] font-mono text-slate-500">200 mmHg</div>
            <div className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-500">100 mmHg</div>
            <div className="absolute left-2 bottom-2 text-[10px] font-mono text-slate-500">0 mmHg</div>

            {/* SVG Path */}
            <svg className="w-full h-full" viewBox="0 0 1000 150" preserveAspectRatio="none">
              {isFlushing ? (
                // Square Wave Flush + Rings
                <path
                  d={`M 0,90 L 150,90 L 170,15 L 450,15 L 470,${
                    damping.dampingCoefficientZeta < 0.4
                      ? '125 L 490,20 L 510,110 L 530,35 L 550,95 L 570,75'
                      : damping.dampingCoefficientZeta > 0.75
                      ? '110 L 520,95 L 580,90'
                      : '115 L 495,65 L 515,95 L 535,88'
                  } L 600,90 L 620,40 L 635,80 L 645,72 L 720,90 L 740,38 L 755,78 L 765,70 L 840,90 L 860,36 L 875,76 L 885,68 L 960,90 L 980,35 L 1000,90`}
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : (
                // Pulsatile Waveform with Respiratory Variation
                <path
                  d={`
                    M 0,92
                    Q 20,${45 - (evaluation.fluidResponsiveness.ppvPct / 2)} 35,${40 - (evaluation.fluidResponsiveness.ppvPct / 2)}
                    Q 45,${72} 55,${70}
                    Q 85,88 120,92

                    Q 140,${42 - (evaluation.fluidResponsiveness.ppvPct / 3)} 155,${38 - (evaluation.fluidResponsiveness.ppvPct / 3)}
                    Q 165,${70} 175,${68}
                    Q 205,86 240,90

                    Q 260,${48 + (evaluation.fluidResponsiveness.ppvPct / 3)} 275,${44 + (evaluation.fluidResponsiveness.ppvPct / 3)}
                    Q 285,${74} 295,${72}
                    Q 325,89 360,93

                    Q 380,${52 + (evaluation.fluidResponsiveness.ppvPct / 2)} 395,${48 + (evaluation.fluidResponsiveness.ppvPct / 2)}
                    Q 405,${76} 415,${74}
                    Q 445,90 480,94

                    Q 500,${54 + (evaluation.fluidResponsiveness.ppvPct / 2)} 515,${50 + (evaluation.fluidResponsiveness.ppvPct / 2)}
                    Q 525,${77} 535,${75}
                    Q 565,91 600,95

                    Q 620,${48 + (evaluation.fluidResponsiveness.ppvPct / 3)} 635,${44 + (evaluation.fluidResponsiveness.ppvPct / 3)}
                    Q 645,${74} 655,${72}
                    Q 685,89 720,93

                    Q 740,${42 - (evaluation.fluidResponsiveness.ppvPct / 3)} 755,${38 - (evaluation.fluidResponsiveness.ppvPct / 3)}
                    Q 765,${70} 775,${68}
                    Q 805,86 840,90

                    Q 860,${40 - (evaluation.fluidResponsiveness.ppvPct / 2)} 875,${36 - (evaluation.fluidResponsiveness.ppvPct / 2)}
                    Q 885,${68} 895,${66}
                    Q 925,85 960,89

                    Q 980,${44} 1000,${42}
                  `}
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </svg>

            {/* Dicrotic Notch Annotation */}
            {!isFlushing && (
              <div className="absolute top-10 right-4 flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900/80 border border-slate-700 text-[10px] text-slate-300">
                <Info className="w-3 h-3 text-sky-400" />
                <span>Dicrotic Notch (Incisura): Aortic Valve Closure</span>
              </div>
            )}
          </div>
        </div>

        {/* Scoreboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          {/* Measured BP & Damping Artifact */}
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
            <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              Displayed Arterial BP
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-xl font-black text-white">
                {evaluation.dampingAnalysis.measuredSbpMmHg} / {evaluation.dampingAnalysis.measuredDbpMmHg}
              </span>
              <span className="text-xs font-mono font-bold text-rose-400">
                ({evaluation.dampingAnalysis.measuredMapMmHg})
              </span>
            </div>
            <div className="text-[10px] mt-1 text-slate-400">
              True BP: {hemo.systolicBpMmHg}/{hemo.diastolicBpMmHg} (MAP {evaluation.meanArterialPressureMmHg})
            </div>
            {evaluation.dampingAnalysis.sbpErrorMmHg !== 0 && (
              <div
                className={`text-[10px] font-bold mt-0.5 ${
                  evaluation.dampingAnalysis.sbpErrorMmHg > 0 ? 'text-amber-400' : 'text-rose-400'
                }`}
              >
                Artifact: {evaluation.dampingAnalysis.sbpErrorMmHg > 0 ? '+' : ''}
                {evaluation.dampingAnalysis.sbpErrorMmHg} mmHg SBP
              </div>
            )}
          </div>

          {/* Pulse Pressure Variation (PPV) */}
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
            <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              Pulse Pressure Variation
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-xl font-black text-indigo-400 font-mono">
                {evaluation.fluidResponsiveness.ppvPct}%
              </span>
              <span className="text-xs text-slate-400 font-mono">
                SVV: {evaluation.fluidResponsiveness.svvPct}%
              </span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  evaluation.fluidResponsiveness.ppvPct > 13
                    ? 'bg-emerald-500'
                    : evaluation.fluidResponsiveness.ppvPct >= 9
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${Math.min(100, evaluation.fluidResponsiveness.ppvPct * 3.5)}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Cutoff &gt; 13% fluid responsive
            </div>
          </div>

          {/* Dynamic Arterial Elastance (Ea_dyn) */}
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
            <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              Dynamic Elastance (Ea_dyn)
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-xl font-black text-white font-mono">
                {evaluation.fluidResponsiveness.eaDyn}
              </span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  evaluation.fluidResponsiveness.eaDyn >= 0.8
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-rose-500/20 text-rose-400'
                }`}
              >
                {evaluation.fluidResponsiveness.eaDyn >= 0.8 ? 'TONE PRESERVED' : 'VASOPLEGIA'}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              {evaluation.fluidResponsiveness.eaDyn >= 0.8
                ? 'Fluids will increase MAP'
                : 'Fluids fail to raise MAP (needs Norepi)'}
            </div>
          </div>

          {/* Responsiveness Tier */}
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
            <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              Volume Status Verdict
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span
                className={`px-2 py-0.5 text-xs font-extrabold rounded ${
                  evaluation.fluidResponsiveness.responsivenessTier === 'RESPONSIVE'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : evaluation.fluidResponsiveness.responsivenessTier === 'GRAY_ZONE'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : evaluation.fluidResponsiveness.responsivenessTier === 'INVALID_CONFOUNDED'
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}
              >
                {evaluation.fluidResponsiveness.responsivenessTier.replace(/_/g, ' ')}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1 line-clamp-2">
              {evaluation.fluidResponsiveness.responsivenessRationale}
            </div>
          </div>
        </div>
      </header>

      {/* Main Tabs Navigation */}
      <main className="max-w-7xl mx-auto">
        <div className="flex border-b border-slate-800 mb-6 gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('waveforms')}
            className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-t-lg transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'waveforms'
                ? 'bg-slate-900 text-rose-400 border-t-2 border-rose-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            1. Arterial Waveform &amp; Hemodynamics
          </button>
          <button
            onClick={() => setActiveTab('fluid_responsiveness')}
            className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-t-lg transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'fluid_responsiveness'
                ? 'bg-slate-900 text-rose-400 border-t-2 border-rose-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Droplets className="w-4 h-4" />
            2. Dynamic Fluid Responsiveness &amp; Ea_dyn
          </button>
          <button
            onClick={() => setActiveTab('damping_test')}
            className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-t-lg transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'damping_test'
                ? 'bg-slate-900 text-rose-400 border-t-2 border-rose-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Gauge className="w-4 h-4" />
            3. Fast-Flush Square Wave &amp; Damping
          </button>
          <button
            onClick={() => setActiveTab('confounders')}
            className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-t-lg transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'confounders'
                ? 'bg-slate-900 text-rose-400 border-t-2 border-rose-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wind className="w-4 h-4" />
            4. Ventilator Interactions &amp; Confounders
          </button>
        </div>

        {/* TAB 1: ARTERIAL WAVEFORM & HEMODYNAMICS */}
        {activeTab === 'waveforms' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4 bg-slate-900/60 border border-slate-800 p-5 rounded-xl">
              <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2">
                <Activity className="w-4 h-4 text-rose-400" />
                Hemodynamic Parameters &amp; Arterial Pulse Contour
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Systolic BP */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Systolic Blood Pressure (True SBP)</span>
                    <span className="font-mono font-bold text-slate-200">{hemo.systolicBpMmHg} mmHg</span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="220"
                    step="2"
                    value={hemo.systolicBpMmHg}
                    onChange={(e) => setHemo({ ...hemo, systolicBpMmHg: parseInt(e.target.value, 10) })}
                    className="w-full accent-rose-500"
                  />
                  <span className="text-[10px] text-slate-400">Normal range 90 &ndash; 140 mmHg</span>
                </div>

                {/* Diastolic BP */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Diastolic Blood Pressure (True DBP)</span>
                    <span className="font-mono font-bold text-slate-200">{hemo.diastolicBpMmHg} mmHg</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="130"
                    step="2"
                    value={hemo.diastolicBpMmHg}
                    onChange={(e) => setHemo({ ...hemo, diastolicBpMmHg: parseInt(e.target.value, 10) })}
                    className="w-full accent-rose-500"
                  />
                  <span className="text-[10px] text-slate-400">Normal range 60 &ndash; 90 mmHg</span>
                </div>

                {/* Heart Rate */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Heart Rate</span>
                    <span className="font-mono font-bold text-slate-200">{hemo.heartRateBpm} bpm</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="180"
                    step="1"
                    value={hemo.heartRateBpm}
                    onChange={(e) => setHemo({ ...hemo, heartRateBpm: parseInt(e.target.value, 10) })}
                    className="w-full accent-rose-500"
                  />
                  <span className="text-[10px] text-slate-400">Tachycardia shortens diastolic runoff time</span>
                </div>

                {/* Stroke Volume */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Stroke Volume</span>
                    <span className="font-mono font-bold text-slate-200">{hemo.strokeVolumeMl} mL</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="140"
                    step="2"
                    value={hemo.strokeVolumeMl}
                    onChange={(e) => setHemo({ ...hemo, strokeVolumeMl: parseInt(e.target.value, 10) })}
                    className="w-full accent-rose-500"
                  />
                  <span className="text-[10px] text-slate-400">Normal resting 60 &ndash; 100 mL</span>
                </div>

                {/* Central Venous Pressure (CVP) */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Central Venous Pressure (CVP)</span>
                    <span className="font-mono font-bold text-slate-200">{hemo.centralVenousPressureMmHg} mmHg</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="25"
                    step="1"
                    value={hemo.centralVenousPressureMmHg}
                    onChange={(e) =>
                      setHemo({ ...hemo, centralVenousPressureMmHg: parseInt(e.target.value, 10) })
                    }
                    className="w-full accent-rose-500"
                  />
                  <span className="text-[10px] text-slate-400">Normal 2 &ndash; 8 mmHg</span>
                </div>

                {/* Myocardial Inotropy dP/dt */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Contractility (Inotropy / dP/dt)</span>
                    <span className="font-mono font-bold text-slate-200">{hemo.myocardialInotropyPct}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="160"
                    step="5"
                    value={hemo.myocardialInotropyPct}
                    onChange={(e) =>
                      setHemo({ ...hemo, myocardialInotropyPct: parseInt(e.target.value, 10) })
                    }
                    className="w-full accent-rose-500"
                  />
                  <span className="text-[10px] text-slate-400">Steepness of systolic upstroke</span>
                </div>
              </div>
            </div>

            {/* Derived Hemodynamics Cards */}
            <div className="space-y-4">
              <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Calculated Hemodynamic Targets
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-400">CARDIAC OUTPUT</div>
                    <div className="text-lg font-black text-rose-400 font-mono mt-0.5">
                      {evaluation.cardiacOutputLMin} L/min
                    </div>
                    <div className="text-[10px] text-slate-500">Normal: 4.0 &ndash; 8.0</div>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-400">CALCULATED SVR</div>
                    <div className="text-lg font-black text-sky-400 font-mono mt-0.5">
                      {evaluation.systemicVascularResistanceDyns}
                    </div>
                    <div className="text-[10px] text-slate-500">dyn&middot;s/cm&sup5; (800-1200)</div>
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs text-slate-300">
                  <div className="font-bold text-slate-200 mb-1">Pulse Contour Morphology</div>
                  <p className="text-[11px] text-slate-400">
                    The area under the systolic portion (systolic upstroke to dicrotic notch) is proportional to stroke volume. The exponential decay slope during diastole reflects peripheral resistance (SVR) and arterial compliance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DYNAMIC FLUID RESPONSIVENESS */}
        {activeTab === 'fluid_responsiveness' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-slate-200">
                    Dynamic Preload Indices: PPV, SVV &amp; Dynamic Arterial Elastance
                  </h2>
                  <p className="text-xs text-slate-400">
                    Cyclic changes in intrathoracic pressure during mechanical ventilation modulate venous return and left ventricular stroke volume.
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-black text-indigo-400 font-mono">
                    PPV: {evaluation.fluidResponsiveness.ppvPct}%
                  </div>
                </div>
              </div>

              {/* PPV Slider */}
              <div className="pt-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">User Defined PPV (%)</span>
                  <span className="font-mono font-bold text-indigo-400">{userPpvOverride}%</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="35"
                  step="1"
                  value={userPpvOverride}
                  onChange={(e) => setUserPpvOverride(parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>&lt; 9% (Non-responder)</span>
                  <span>9 &ndash; 13% (Gray Zone)</span>
                  <span>&gt; 13% (Responder)</span>
                </div>
              </div>

              {/* Dynamic Tests Simulator Buttons */}
              <div className="pt-4 border-t border-slate-800">
                <div className="text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
                  Bedside Dynamic Diagnostic Maneuvers
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button
                    onClick={handleSimulatePlr}
                    className="p-3 bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-500/50 rounded-xl text-left transition flex items-start gap-3"
                  >
                    <div className="p-2 bg-indigo-600 rounded-lg text-white mt-0.5">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-indigo-200">Simulate Passive Leg Raise (PLR)</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Transfers 300-500 mL autologous blood from legs. Valid even in AFib, spontaneous breathing, or low Vt!
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={handleSimulateVtChallenge}
                    className="p-3 bg-sky-950/40 hover:bg-sky-900/60 border border-sky-500/50 rounded-xl text-left transition flex items-start gap-3"
                  >
                    <div className="p-2 bg-sky-600 rounded-lg text-white mt-0.5">
                      <Wind className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-sky-200">Tidal Volume Challenge (Vt 6 &rarr; 8)</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Transiently increase Vt to 8 mL/kg for 1 min. Delta-PPV &gt; 3.5% unmasks false negative hypovolemia in ARDS.
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Predictive Guidance Card */}
            <div className="space-y-4">
              <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Predicted Response to 500 mL Crystalloid
                </h3>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-xs text-slate-400">Predicted Stroke Volume Rise</span>
                    <span className="text-base font-mono font-bold text-emerald-400">
                      +{evaluation.fluidResponsiveness.predictedSvIncreaseWithFluidPct}%
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-slate-400">Predicted MAP Increase</span>
                    <span className="text-base font-mono font-bold text-sky-400">
                      +{evaluation.fluidResponsiveness.predictedMapIncreaseWithFluidMmHg} mmHg
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs text-slate-300">
                  <div className="font-bold text-indigo-400 mb-1">Dynamic Arterial Elastance (Ea_dyn)</div>
                  <p className="text-[11px] text-slate-400">
                    Ea_dyn is the ratio of PPV to SVV. When Ea_dyn &lt; 0.8, the systemic vasculature is paralyzed (vasoplegia). Fluid resuscitation will increase stroke volume, but the vessel beds cannot generate arterial pressure. Norepinephrine is essential.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: FAST-FLUSH SQUARE WAVE & DAMPING */}
        {activeTab === 'damping_test' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-rose-400" />
                    Fast-Flush Square Wave Test &amp; Dynamic Resonance
                  </h2>
                  <p className="text-xs text-slate-400">
                    Brief opening of the high-pressure continuous flush valve (300 mmHg) tests the natural frequency (fn) and damping coefficient (zeta) of the catheter-transducer fluid column.
                  </p>
                </div>
                <button
                  onClick={handleTriggerFlush}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg transition flex items-center gap-1"
                >
                  <Zap className="w-3 h-3" />
                  Perform Flush Test
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Damping Coefficient */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Damping Coefficient (&zeta;)</span>
                    <span className="font-mono font-bold text-rose-400">
                      {damping.dampingCoefficientZeta.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.15"
                    max="1.20"
                    step="0.05"
                    value={damping.dampingCoefficientZeta}
                    onChange={(e) =>
                      setDamping({ ...damping, dampingCoefficientZeta: parseFloat(e.target.value) })
                    }
                    className="w-full accent-rose-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>&lt; 0.40 (Underdamped)</span>
                    <span>0.55 - 0.75 (Optimal)</span>
                    <span>&gt; 0.75 (Overdamped)</span>
                  </div>
                </div>

                {/* Natural Frequency */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Natural Frequency (fn)</span>
                    <span className="font-mono font-bold text-slate-200">
                      {damping.naturalFrequencyHz} Hz
                    </span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="35"
                    step="1"
                    value={damping.naturalFrequencyHz}
                    onChange={(e) =>
                      setDamping({ ...damping, naturalFrequencyHz: parseInt(e.target.value, 10) })
                    }
                    className="w-full accent-rose-500"
                  />
                  <span className="text-[10px] text-slate-400">Normal &ge; 24 Hz (prevents resonance)</span>
                </div>
              </div>

              {/* Physical Causes Checkboxes */}
              <div className="pt-3 border-t border-slate-800">
                <div className="text-xs font-semibold text-slate-300 mb-2">
                  Physical Causes of Damping Artifacts
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                  <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-lg border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={damping.hasAirBubble}
                      onChange={(e) => setDamping({ ...damping, hasAirBubble: e.target.checked })}
                      className="rounded accent-rose-500"
                    />
                    <span className="text-slate-300">Air Bubble in Dome / Tubing</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-lg border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={damping.hasCatheterClotOrKink}
                      onChange={(e) =>
                        setDamping({ ...damping, hasCatheterClotOrKink: e.target.checked })
                      }
                      className="rounded accent-rose-500"
                    />
                    <span className="text-slate-300">Fibrin Clot / Kinked Line</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-lg border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={damping.hasCompliantTubing}
                      onChange={(e) =>
                        setDamping({ ...damping, hasCompliantTubing: e.target.checked })
                      }
                      className="rounded accent-amber-500"
                    />
                    <span className="text-slate-300">Compliant / Long Extension</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Damping Diagnosis & Corrective Actions */}
            <div className="space-y-4">
              <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 uppercase">Damping Tier</span>
                  <span
                    className={`text-xs font-extrabold px-2 py-0.5 rounded ${
                      evaluation.dampingAnalysis.dampingTier === 'OPTIMAL'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : evaluation.dampingAnalysis.dampingTier === 'UNDERDAMPED_WHIPPY'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {evaluation.dampingAnalysis.dampingTier.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs text-slate-300">
                  <div className="font-bold text-slate-200 mb-1">Clinical Impact</div>
                  <p className="text-[11px] text-slate-400">
                    {evaluation.dampingAnalysis.clinicalImplications}
                  </p>
                </div>

                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs text-slate-300">
                  <div className="font-bold text-indigo-400 mb-1">Corrective Troubleshooting</div>
                  <p className="text-[11px] text-slate-400">
                    {evaluation.dampingAnalysis.recommendedCorrectiveAction}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: VENTILATOR INTERACTIONS & CONFOUNDERS */}
        {activeTab === 'confounders' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-slate-200">
                    Strict Physiological Prerequisites for Dynamic Indices
                  </h2>
                  <p className="text-xs text-slate-400">
                    Heart-lung interactions depend on passive, uniform intrathoracic pressure transmission. Violating any prerequisite invalidates PPV and SVV cutoffs.
                  </p>
                </div>
                <span
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg ${
                    evaluation.fluidResponsiveness.isConfounded
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {evaluation.fluidResponsiveness.isConfounded ? 'CONFOUNDED' : 'VALID'}
                </span>
              </div>

              <div className="space-y-3 pt-2">
                {[
                  {
                    key: 'isSpontaneouslyBreathing',
                    title: '1. Absence of Spontaneous Breathing Efforts',
                    desc: 'Patient must be fully passive on the ventilator (sedated +/- paralyzed). Spontaneous respiratory effort produces negative intrathoracic swings that distort venous return.',
                    checked: vent.isSpontaneouslyBreathing,
                    onChange: (c: boolean) => setVent({ ...vent, isSpontaneouslyBreathing: c }),
                  },
                  {
                    key: 'hasCardiacArrhythmia',
                    title: '2. Regular Sinus Rhythm (No Atrial Fibrillation / Frequent PVCs)',
                    desc: 'Irregular cycle lengths generate beat-to-beat variations in diastolic filling, falsely elevating PPV independent of volume status.',
                    checked: vent.hasCardiacArrhythmia,
                    onChange: (c: boolean) => setVent({ ...vent, hasCardiacArrhythmia: c }),
                  },
                  {
                    key: 'tidalVolume',
                    title: '3. Tidal Volume &ge; 8 mL/kg Predicted Body Weight (PBW)',
                    desc: 'Low tidal volume ventilation (e.g. 6 mL/kg in ARDS) creates insufficient pleural pressure swings to induce preload variations, producing false negative PPV.',
                    checked: vent.tidalVolumeMlPerKgPbw < 8.0,
                    onChange: (c: boolean) =>
                      setVent({ ...vent, tidalVolumeMlPerKgPbw: c ? 6.0 : 8.5 }),
                  },
                  {
                    key: 'hasRightVentricularFailure',
                    title: '4. Absence of Severe Right Ventricular Failure / Cor Pulmonale',
                    desc: 'In acute cor pulmonale or severe RV strain, positive pressure inspiration compresses pulmonary capillaries, increasing RV afterload. PPV is high due to afterload sensitivity, NOT preload responsiveness! Fluid loading precipitates RV ischemia.',
                    checked: vent.hasRightVentricularFailure,
                    onChange: (c: boolean) => setVent({ ...vent, hasRightVentricularFailure: c }),
                  },
                  {
                    key: 'hasOpenChest',
                    title: '5. Closed Thoracic Cavity (No Open Pneumothorax / Thoracotomy)',
                    desc: 'Opening the chest cavity dissipates airway pressure swings directly into the atmosphere rather than compressing cardiac chambers.',
                    checked: vent.hasOpenChest,
                    onChange: (c: boolean) => setVent({ ...vent, hasOpenChest: c }),
                  },
                ].map((item, idx) => (
                  <label
                    key={idx}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                      item.checked
                        ? 'bg-rose-950/30 border-rose-500/50'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={(e) => item.onChange(e.target.checked)}
                      className="mt-1 rounded accent-rose-500"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-200">{item.title}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{item.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Confounders Summary */}
            <div className="space-y-4">
              <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Alternative Fluid Tests When Confounded
                </h3>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs text-slate-300 space-y-2">
                  <div>
                    <strong className="text-indigo-400">1. Passive Leg Raising (PLR):</strong>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      The gold standard when confounders are present. An increase in stroke volume or cardiac output &gt; 10% measured by echocardiography or pulse contour analysis confirms fluid responsiveness.
                    </p>
                  </div>
                  <div>
                    <strong className="text-sky-400">2. End-Expiratory Occlusion Test (EEOT):</strong>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Pausing mechanical ventilation at end-expiration for 15 seconds prevents cyclic impedance of venous return. An increase in cardiac output or arterial pulse pressure &gt; 5% indicates volume responsiveness.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Clinical Alerts Box */}
        {evaluation.alerts.length > 0 && (
          <div className="mt-6 p-4 rounded-xl bg-amber-950/30 border border-amber-500/40">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase mb-2">
              <AlertTriangle className="w-4 h-4" />
              Active Hemodynamic &amp; Measurement Alerts
            </div>
            <ul className="space-y-1 text-xs text-amber-200">
              {evaluation.alerts.map((alert, i) => (
                <li key={i} className="flex items-start gap-1.5 text-[11px]">
                  <span>&bull;</span>
                  <span>{alert}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}
