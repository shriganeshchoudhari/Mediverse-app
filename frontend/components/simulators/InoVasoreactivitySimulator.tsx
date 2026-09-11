'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Wind,
  Activity,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Stethoscope,
  Heart,
  Gauge,
  Sparkles,
  Flame,
  ShieldAlert,
  Zap,
} from 'lucide-react';
import {
  InoPatientInput,
  VasoreactivityAgent,
  evaluateInoCase,
  INO_PRESETS,
} from '../../.gemini/skills/InoVasoreactivityEngine';

export default function InoVasoreactivitySimulator() {
  const [baselineMpap, setBaselineMpap] = useState<number>(48);
  const [baselineCo, setBaselineCo] = useState<number>(4.2);
  const [baselinePcwp, setBaselinePcwp] = useState<number>(10);
  const [baselineMap, setBaselineMap] = useState<number>(88);
  const [baselineCvp, setBaselineCvp] = useState<number>(8);
  const [baselineSvo2, setBaselineSvo2] = useState<number>(62);
  const [agent, setAgent] = useState<VasoreactivityAgent>('INHALED_NITRIC_OXIDE');
  const [dose, setDose] = useState<number>(20);
  const [duration, setDuration] = useState<number>(15);
  const [abruptWean, setAbruptWean] = useState<boolean>(false);

  const currentInput: InoPatientInput = useMemo(
    () => ({
      baselineMpapMmHg: baselineMpap,
      baselineCoLMin: baselineCo,
      baselinePcwpMmHg: baselinePcwp,
      baselineMapMmHg: baselineMap,
      baselineCvpMmHg: baselineCvp,
      baselineSvo2Percent: baselineSvo2,
      agent,
      dosePpmOrMcg: dose,
      durationMinutes: duration,
      abruptWeaning: abruptWean,
    }),
    [
      baselineMpap,
      baselineCo,
      baselinePcwp,
      baselineMap,
      baselineCvp,
      baselineSvo2,
      agent,
      dose,
      duration,
      abruptWean,
    ]
  );

  const metrics = useMemo(() => evaluateInoCase(currentInput), [currentInput]);

  const applyPreset = (presetId: string) => {
    const p = INO_PRESETS.find((item) => item.id === presetId);
    if (!p) return;
    setBaselineMpap(p.input.baselineMpapMmHg);
    setBaselineCo(p.input.baselineCoLMin);
    setBaselinePcwp(p.input.baselinePcwpMmHg);
    setBaselineMap(p.input.baselineMapMmHg);
    setBaselineCvp(p.input.baselineCvpMmHg);
    setBaselineSvo2(p.input.baselineSvo2Percent);
    setAgent(p.input.agent);
    setDose(p.input.dosePpmOrMcg);
    setDuration(p.input.durationMinutes);
    setAbruptWean(p.input.abruptWeaning);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 tracking-wider uppercase mb-1">
              <Wind className="w-4 h-4 text-cyan-400" />
              Pulmonology &amp; Critical Care / ESC/ERS Pulmonary Vascular Guidelines
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Inhaled Nitric Oxide (iNO) &amp; Acute Vasoreactivity Testing Workstation
            </h1>
            <p className="text-slate-400 text-xs md:text-sm mt-1 max-w-3xl">
              Simulate selective pulmonary vasodilation, ESC/ERS acute vasoreactivity testing (Sitbon criteria),
              RHC hemodynamics (PVR/SVR), rebound pulmonary hypertension upon abrupt cessation, and MetHb/NO2 toxicity.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/simulators"
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold hover:border-slate-700 transition"
            >
              ← Simulators Catalog
            </Link>
          </div>
        </div>

        {/* Clinical Presets Carousel */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            Clinical Hemodynamic &amp; Challenge Presets
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
            {INO_PRESETS.map((p) => {
              const isActive =
                baselineMpap === p.input.baselineMpapMmHg &&
                dose === p.input.dosePpmOrMcg &&
                agent === p.input.agent &&
                abruptWean === p.input.abruptWeaning;
              return (
                <button
                  key={p.id}
                  onClick={() => applyPreset(p.id)}
                  className={`flex flex-col text-left p-2.5 rounded-xl border text-xs transition duration-150 ${
                    isActive
                      ? 'bg-cyan-950/50 border-cyan-500/80 text-white shadow-lg shadow-cyan-950/50'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <span className="font-bold truncate text-[11px] text-cyan-300">{p.name}</span>
                  <span className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-tight">
                    {p.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Workstation 3-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Column 1: Baseline RHC Hemodynamics (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Heart className="w-4 h-4 text-rose-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Baseline Right Heart Catheterization
                </h2>
              </div>

              {/* Baseline mPAP */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Baseline Mean PAP (mPAP):</span>
                  <strong className="text-rose-400 font-mono font-bold">{baselineMpap} mmHg</strong>
                </div>
                <input
                  type="range"
                  min="20"
                  max="80"
                  step="1"
                  value={baselineMpap}
                  onChange={(e) => setBaselineMpap(Number(e.target.value))}
                  className="w-full accent-rose-400 cursor-pointer"
                />
                <div className="text-[10px] text-slate-500 flex justify-between">
                  <span>Normal &le; 20 mmHg</span>
                  <span>PAH &gt; 20 mmHg</span>
                </div>
              </div>

              {/* Baseline Cardiac Output */}
              <div className="space-y-1 pt-1 border-t border-slate-800">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Cardiac Output (CO):</span>
                  <strong className="text-emerald-400 font-mono">{baselineCo} L/min</strong>
                </div>
                <input
                  type="range"
                  min="2.0"
                  max="8.0"
                  step="0.1"
                  value={baselineCo}
                  onChange={(e) => setBaselineCo(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>

              {/* Baseline PCWP */}
              <div className="space-y-1 pt-1 border-t border-slate-800">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">PCWP (Wedge):</span>
                  <strong className="text-blue-400 font-mono">{baselinePcwp} mmHg</strong>
                </div>
                <input
                  type="range"
                  min="4"
                  max="20"
                  step="1"
                  value={baselinePcwp}
                  onChange={(e) => setBaselinePcwp(Number(e.target.value))}
                  className="w-full accent-blue-400 cursor-pointer"
                />
                <div className="text-[10px] text-slate-500">
                  {baselinePcwp <= 15 ? 'Pre-capillary PAH (PCWP &le; 15)' : 'Post-capillary / Left heart (PCWP &gt; 15)'}
                </div>
              </div>

              {/* Baseline Systemic MAP & CVP */}
              <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-800">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">MAP:</span>
                    <strong className="text-white font-mono">{baselineMap}</strong>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="110"
                    step="2"
                    value={baselineMap}
                    onChange={(e) => setBaselineMap(Number(e.target.value))}
                    className="w-full accent-slate-400 cursor-pointer"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">CVP:</span>
                    <strong className="text-white font-mono">{baselineCvp}</strong>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="18"
                    step="1"
                    value={baselineCvp}
                    onChange={(e) => setBaselineCvp(Number(e.target.value))}
                    className="w-full accent-slate-400 cursor-pointer"
                  />
                </div>
              </div>

              {/* Calculated Baseline Resistances */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Baseline PVR:</span>
                  <strong className="text-rose-300 font-mono">
                    {metrics.baselinePvrWoodUnits} Wood Units ({Math.round(metrics.baselinePvrWoodUnits * 80)} dynes)
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Baseline SVR:</span>
                  <strong className="text-slate-300 font-mono">
                    {metrics.baselineSvrDynes} dynes·s·cm⁻⁵
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Vasodilator Challenge & Delivery Circuit (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Wind className="w-4 h-4 text-cyan-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Vasoreactivity Challenge &amp; Circuit
                </h2>
              </div>

              {/* Agent Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Vasodilator Challenge Agent:</label>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  <button
                    onClick={() => setAgent('INHALED_NITRIC_OXIDE')}
                    className={`p-2 rounded-lg border text-left font-semibold transition ${
                      agent === 'INHALED_NITRIC_OXIDE'
                        ? 'bg-cyan-600 border-cyan-500 text-white shadow-md shadow-cyan-900/40'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Inhaled NO (iNO)
                  </button>
                  <button
                    onClick={() => setAgent('IV_EPOPROSTENOL')}
                    className={`p-2 rounded-lg border text-left font-semibold transition ${
                      agent === 'IV_EPOPROSTENOL'
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-900/40'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    IV Epoprostenol
                  </button>
                  <button
                    onClick={() => setAgent('INHALED_ILOPROST')}
                    className={`p-2 rounded-lg border text-left font-semibold transition ${
                      agent === 'INHALED_ILOPROST'
                        ? 'bg-teal-600 border-teal-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Inhaled Iloprost
                  </button>
                  <button
                    onClick={() => setAgent('IV_ADENOSINE')}
                    className={`p-2 rounded-lg border text-left font-semibold transition ${
                      agent === 'IV_ADENOSINE'
                        ? 'bg-amber-600 border-amber-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    IV Adenosine
                  </button>
                </div>
              </div>

              {/* Dose Slider */}
              <div className="space-y-1 pt-1 border-t border-slate-800">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">
                    {agent === 'INHALED_NITRIC_OXIDE' ? 'iNO Concentration (ppm):' : 'Dose:'}
                  </span>
                  <strong className="text-cyan-400 font-mono font-bold">
                    {dose} {agent === 'INHALED_NITRIC_OXIDE' ? 'ppm' : 'mcg/kg/min'}
                  </strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max={agent === 'INHALED_NITRIC_OXIDE' ? '80' : '20'}
                  step={agent === 'INHALED_NITRIC_OXIDE' ? '5' : '1'}
                  value={dose}
                  onChange={(e) => setDose(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="text-[10px] text-slate-500 flex justify-between">
                  <span>Usual testing: 10-20 ppm</span>
                  <span>Max therapeutic: 40 ppm</span>
                  <span>&gt; 40 ppm = toxic risk</span>
                </div>
              </div>

              {/* Exposure Duration & Abrupt Wean */}
              <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-800">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Duration:</span>
                    <strong className="text-white font-mono">{duration} min</strong>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="120"
                    step="5"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full accent-slate-400 cursor-pointer"
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <button
                    onClick={() => setAbruptWean(!abruptWean)}
                    className={`py-2 px-2.5 rounded-lg border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      abruptWean
                        ? 'bg-rose-600 border-rose-500 text-white animate-pulse'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    {abruptWean ? 'ABRUPT STOP (REBOUND)' : 'Gradual Wean'}
                  </button>
                </div>
              </div>

              {/* Simulated Alveolar-Capillary Vasodilation Diagram */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col items-center">
                <div className="text-[10px] text-slate-400 mb-1.5 flex justify-between w-full">
                  <span>Alveolus: Ventilation-Perfusion Matching</span>
                  <span className="text-cyan-400 font-bold">Selective sGC Activation</span>
                </div>
                <svg viewBox="0 0 240 100" className="w-full h-24 border border-slate-800/80 rounded-lg bg-slate-950">
                  {/* Alveolar sac */}
                  <circle cx="80" cy="50" r="32" fill="#082f49" stroke="#0284c7" strokeWidth="2" />
                  <text x="80" y="46" textAnchor="middle" fill="#38bdf8" fontSize="9" fontWeight="bold">Alveolus</text>
                  <text x="80" y="58" textAnchor="middle" fill="#94a3b8" fontSize="8">iNO Gas</text>

                  {/* Diffusion arrows into pulmonary capillary */}
                  <path d="M 115 50 L 140 50" stroke="#06b6d4" strokeWidth="2" strokeDasharray="3 2" markerEnd="url(#arrow)" />

                  {/* Pulmonary Capillary - dynamic lumen height */}
                  {/* Baseline lumen is 20px, widens with vasodilation */}
                  {(() => {
                    const lumenHalf = Math.min(22, 10 + Math.abs(metrics.deltaPvrPercent) * 0.3);
                    return (
                      <g>
                        <rect x="145" y={50 - lumenHalf} width="85" height={lumenHalf * 2} rx="6" fill="#881337" opacity="0.8" stroke="#f43f5e" strokeWidth="1.5" />
                        <text x="187" y="48" textAnchor="middle" fill="#fecdd3" fontSize="8" fontWeight="bold">Arteriole</text>
                        <text x="187" y="58" textAnchor="middle" fill="#fda4af" fontSize="7">PVR: {metrics.currentPvrWoodUnits} WU</text>
                      </g>
                    );
                  })()}
                </svg>
              </div>

              {/* Circuit Toxicology Meters: MetHb & NO2 */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Methemoglobin (Co-Oximetry):</span>
                  <strong
                    className={`font-mono ${
                      metrics.methemoglobinPercent >= 5.0
                        ? 'text-rose-400 font-bold animate-pulse'
                        : metrics.methemoglobinPercent >= 2.5
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {metrics.methemoglobinPercent}% (Safe &lt; 2.5%)
                  </strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Circuit Nitrogen Dioxide (NO2):</span>
                  <strong
                    className={`font-mono ${
                      metrics.nitrogenDioxidePpm >= 1.0
                        ? 'text-rose-400 font-bold'
                        : metrics.nitrogenDioxidePpm >= 0.5
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {metrics.nitrogenDioxidePpm} ppm (Safe &lt; 0.5)
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Response, ESC/ERS Criteria & Therapy (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Acute Vasoreactivity Response
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    metrics.isVasoreactivePositive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  {metrics.isVasoreactivePositive ? 'POSITIVE RESPONDER' : 'NON-RESPONDER'}
                </span>
              </div>

              {/* Hemodynamic Response Metrics */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Mean PAP During Challenge:</span>
                  <strong
                    className={`text-2xl font-black ${
                      metrics.currentMpapMmHg <= 40 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {metrics.currentMpapMmHg} mmHg
                  </strong>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800/80">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Δ mPAP Drop:</span>
                    <strong
                      className={`font-mono ${
                        metrics.deltaMpapMmHg <= -10 ? 'text-emerald-400 font-bold' : 'text-slate-300'
                      }`}
                    >
                      {metrics.deltaMpapMmHg > 0 ? '+' : ''}{metrics.deltaMpapMmHg} mmHg
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Cardiac Output:</span>
                    <strong
                      className={`font-mono ${
                        metrics.deltaCoLMin >= 0 ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {metrics.currentCoLMin} L/min ({metrics.deltaCoLMin > 0 ? '+' : ''}{metrics.deltaCoLMin})
                    </strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800/80">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Pulmonary Resistance:</span>
                    <strong className="text-cyan-300 font-mono">{metrics.deltaPvrPercent}% Δ PVR</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Systemic Resistance:</span>
                    <strong className="text-slate-300 font-mono">{metrics.deltaSvrPercent}% Δ SVR</strong>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 flex justify-between pt-1">
                  <span>Pulmonary Selectivity Index:</span>
                  <strong className="text-white font-mono">{metrics.selectivityIndex}x</strong>
                </div>
              </div>

              {/* ESC/ERS Sitbon Criteria Checklist */}
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ESC/ERS Positive AVT Criteria (Sitbon)
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span>1. Drop in mPAP &ge; 10 mmHg:</span>
                    {metrics.deltaMpapMmHg <= -10 ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Pass ({Math.abs(metrics.deltaMpapMmHg)} mmHg)
                      </span>
                    ) : (
                      <span className="text-rose-400 font-bold flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> Fail ({metrics.deltaMpapMmHg} mmHg)
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span>2. Absolute mPAP &le; 40 mmHg:</span>
                    {metrics.currentMpapMmHg <= 40 ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Pass ({metrics.currentMpapMmHg} mmHg)
                      </span>
                    ) : (
                      <span className="text-rose-400 font-bold flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> Fail ({metrics.currentMpapMmHg} mmHg)
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span>3. Stable or Increased Cardiac Output:</span>
                    {metrics.deltaCoLMin >= -0.05 ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Pass ({metrics.currentCoLMin} L/min)
                      </span>
                    ) : (
                      <span className="text-rose-400 font-bold flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> Fail (Dropped)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Recommended Pharmacotherapy */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                <div className="text-slate-400 text-[10px] uppercase tracking-wider font-bold">
                  Targeted Pharmacotherapy Recommendation:
                </div>
                <div
                  className={`font-bold ${
                    metrics.recommendedTherapy === 'ORAL_CALCIUM_CHANNEL_BLOCKERS'
                      ? 'text-emerald-300'
                      : 'text-amber-300'
                  }`}
                >
                  {metrics.recommendedTherapy === 'ORAL_CALCIUM_CHANNEL_BLOCKERS'
                    ? 'High-Dose Oral Calcium Channel Blocker Trial (e.g. Diltiazem, Nifedipine)'
                    : metrics.recommendedTherapy === 'PAH_PROSTACYCLIN_INFUSION'
                    ? 'Parenteral Prostacyclin Infusion (Epoprostenol / Treprostinil)'
                    : 'Initial Dual Oral Combination Therapy (ERA + PDE-5 Inhibitor)'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Clinical Alerts & Diagnostic Guidance Banner */}
        {metrics.clinicalAlerts.length > 0 && (
          <div className="bg-rose-950/40 border border-rose-800/80 rounded-2xl p-4 space-y-2">
            <div className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              Critical Pulmonology &amp; Critical Care Alerts
            </div>
            <div className="space-y-1 text-xs text-rose-200">
              {metrics.clinicalAlerts.map((alert, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-rose-400">•</span>
                  <span>{alert}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Diagnostic Guidance Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 text-xs">
          <div className="text-cyan-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            ESC/ERS Guidelines Summary &amp; Mechanistic Rationale
          </div>
          <p className="text-slate-300 leading-relaxed">{metrics.diagnosticGuidance}</p>
        </div>
      </div>
    </div>
  );
}
