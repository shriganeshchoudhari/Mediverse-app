'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  Eye,
  Sun,
  Moon,
  Flashlight,
  Droplets,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Activity,
  ArrowRight,
  RotateCcw,
  Zap,
  Flame,
  ShieldAlert,
  ChevronRight,
} from 'lucide-react';
import {
  PathologyType,
  EyedropChallenge,
  FlashlightPosition,
  PupilStateInput,
  evaluatePupilDynamics,
  PUPIL_PATHOLOGY_PRESETS,
} from '../../.gemini/skills/PupilAnisocoriaHornerEngine';

export default function PupilAnisocoriaHornerSimulator() {
  const [ambientLux, setAmbientLux] = useState<number>(300);
  const [flashlight, setFlashlight] = useState<FlashlightPosition>('OFF');
  const [nearEffort, setNearEffort] = useState<boolean>(false);
  const [pathology, setPathology] = useState<PathologyType>('HORNER_POSTGANGLIONIC_3RD_ORDER');
  const [affectedEye, setAffectedEye] = useState<'RIGHT' | 'LEFT' | 'NEITHER'>('RIGHT');
  const [activeDrop, setActiveDrop] = useState<EyedropChallenge>('NONE');
  const [swingingActive, setSwingingActive] = useState<boolean>(false);

  // Swinging flashlight cycle
  useEffect(() => {
    if (!swingingActive) return;
    const interval = setInterval(() => {
      setFlashlight((prev) => (prev === 'RIGHT_EYE' ? 'LEFT_EYE' : 'RIGHT_EYE'));
    }, 2000);
    return () => clearInterval(interval);
  }, [swingingActive]);

  const currentState: PupilStateInput = useMemo(
    () => ({
      ambientLux,
      flashlight,
      nearEffort,
      pathology,
      affectedEye,
      activeDrop,
    }),
    [ambientLux, flashlight, nearEffort, pathology, affectedEye, activeDrop]
  );

  const diagnostic = useMemo(() => evaluatePupilDynamics(currentState), [currentState]);

  const applyPreset = (presetId: string) => {
    const found = PUPIL_PATHOLOGY_PRESETS.find((p) => p.id === presetId);
    if (!found) return;
    setAmbientLux(found.state.ambientLux);
    setFlashlight(found.state.flashlight);
    setNearEffort(found.state.nearEffort);
    setPathology(found.state.pathology);
    setAffectedEye(found.state.affectedEye);
    setActiveDrop(found.state.activeDrop);
    setSwingingActive(found.state.pathology === 'RAPD_MARCUS_GUNN');
  };

  // Pupil SVG pixel radius calculation (1 mm pupil ~ 10 SVG pixels radius)
  const getEyeSvgMetrics = (diamMm: number, ptosisMm: number) => {
    const pupilRadius = Math.max(8, Math.min(42, diamMm * 5.2));
    const irisRadius = 48;
    // Eyelid droop: lid covers top of iris by ptosis amount
    const eyelidY = -38 + ptosisMm * 7;
    return { pupilRadius, irisRadius, eyelidY };
  };

  const rightSvg = getEyeSvgMetrics(
    diagnostic.rightEye.pupilDiameterMm,
    diagnostic.rightEye.ptosisMm
  );
  const leftSvg = getEyeSvgMetrics(
    diagnostic.leftEye.pupilDiameterMm,
    diagnostic.leftEye.ptosisMm
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Navigation */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 tracking-wider uppercase mb-1">
              <Eye className="w-4 h-4 text-cyan-400" />
              Neuro-Ophthalmology &amp; Pupillary Dynamics Lab
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Anisocoria, Pupillary Light Reflex &amp; Horner Syndrome Workstation
            </h1>
            <p className="text-slate-400 text-xs md:text-sm mt-1 max-w-3xl">
              Simulate sympathetic and parasympathetic pupillomotor pathways, photopic vs scotopic anisocoria,
              swinging flashlight RAPD detection, and pharmacologic localization with Apraclonidine, Cocaine,
              Hydroxyamphetamine, and dilute Pilocarpine.
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
            High-Yield Clinical Presets &amp; Case Scenarios
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2">
            {PUPIL_PATHOLOGY_PRESETS.map((p) => {
              const isActive = pathology === p.state.pathology && affectedEye === p.state.affectedEye;
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

        {/* Main Examination & Diagnostic Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left / Center Column: Visualizer & Physical Exam Rig (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Interactive Eye Examination Stage */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                    Anterior Segment &amp; Pupillary Ocular Stage
                  </h2>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-slate-400">
                    Ambient:{' '}
                    <strong className="text-cyan-300">
                      {ambientLux} lux ({ambientLux < 50 ? 'Scotopic/Dark' : ambientLux > 500 ? 'Photopic/Bright' : 'Mesopic'})
                    </strong>
                  </span>
                  {diagnostic.anisocoriaMm > 0.6 && (
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[11px] font-bold">
                      ANISOCORIA: {diagnostic.anisocoriaMm} mm
                    </span>
                  )}
                </div>
              </div>

              {/* Eyes SVG Rig */}
              <div className="grid grid-cols-2 gap-4 bg-slate-950/90 rounded-xl p-6 border border-slate-800/80">
                {/* Right Eye (OD) */}
                <div className="flex flex-col items-center">
                  <div className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-2">
                    <span>RIGHT EYE (OD)</span>
                    {affectedEye === 'RIGHT' && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Affected
                      </span>
                    )}
                    {flashlight === 'RIGHT_EYE' && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-yellow-400/20 text-yellow-300 border border-yellow-400/40 animate-pulse">
                        Penlight
                      </span>
                    )}
                  </div>

                  <div className="relative w-44 h-32 flex items-center justify-center">
                    <svg viewBox="-90 -65 180 130" className="w-full h-full drop-shadow-md">
                      {/* Sclera & Eye outline */}
                      <ellipse cx="0" cy="0" rx="76" ry="46" fill="#f8fafc" stroke="#64748b" strokeWidth="2.5" />
                      {/* Iris */}
                      <circle cx="0" cy="0" r={rightSvg.irisRadius} fill="#0284c7" stroke="#0369a1" strokeWidth="2" />
                      <circle cx="0" cy="0" r={rightSvg.irisRadius - 6} fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3,3" />
                      {/* Pupil */}
                      <circle cx="0" cy="0" r={rightSvg.pupilRadius} fill="#09090b" />
                      {/* Cornea light reflection */}
                      <ellipse cx={-rightSvg.pupilRadius * 0.3} cy={-rightSvg.pupilRadius * 0.3} rx="4" ry="2.5" fill="#ffffff" opacity="0.85" />

                      {/* Penlight beam overlay */}
                      {(flashlight === 'RIGHT_EYE' || flashlight === 'AMONG_BOTH') && (
                        <circle cx="0" cy="0" r="58" fill="#fef08a" opacity="0.28" className="animate-pulse" />
                      )}

                      {/* Upper Eyelid / Ptosis Simulator */}
                      <path
                        d={`M -76 0 Q 0 ${rightSvg.eyelidY} 76 0 L 76 -50 L -76 -50 Z`}
                        fill="#334155"
                        stroke="#475569"
                        strokeWidth="2"
                      />
                    </svg>

                    {/* Facial Anhidrosis indicator */}
                    {diagnostic.rightEye.anhidrosisArea !== 'NONE' && (
                      <div className="absolute top-0 right-0 bg-red-950/80 border border-red-500/50 rounded px-1.5 py-0.5 text-[9px] text-red-300 font-bold">
                        Anhidrosis (Dry)
                      </div>
                    )}
                  </div>

                  {/* OD Metrics Card */}
                  <div className="mt-3 w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-center text-xs space-y-1">
                    <div className="text-slate-400 text-[11px]">Diameter:</div>
                    <div className="text-lg font-black text-cyan-400">
                      {diagnostic.rightEye.pupilDiameterMm} mm
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Ptosis: <strong className="text-white">{diagnostic.rightEye.ptosisMm} mm</strong>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Light Reflex: <strong className="text-cyan-300">{diagnostic.rightEye.lightReflexResponse}</strong>
                    </div>
                  </div>
                </div>

                {/* Left Eye (OS) */}
                <div className="flex flex-col items-center">
                  <div className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-2">
                    <span>LEFT EYE (OS)</span>
                    {affectedEye === 'LEFT' && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Affected
                      </span>
                    )}
                    {flashlight === 'LEFT_EYE' && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-yellow-400/20 text-yellow-300 border border-yellow-400/40 animate-pulse">
                        Penlight
                      </span>
                    )}
                  </div>

                  <div className="relative w-44 h-32 flex items-center justify-center">
                    <svg viewBox="-90 -65 180 130" className="w-full h-full drop-shadow-md">
                      {/* Sclera */}
                      <ellipse cx="0" cy="0" rx="76" ry="46" fill="#f8fafc" stroke="#64748b" strokeWidth="2.5" />
                      {/* Iris */}
                      <circle cx="0" cy="0" r={leftSvg.irisRadius} fill="#0284c7" stroke="#0369a1" strokeWidth="2" />
                      <circle cx="0" cy="0" r={leftSvg.irisRadius - 6} fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3,3" />
                      {/* Pupil */}
                      <circle cx="0" cy="0" r={leftSvg.pupilRadius} fill="#09090b" />
                      {/* Cornea reflection */}
                      <ellipse cx={-leftSvg.pupilRadius * 0.3} cy={-leftSvg.pupilRadius * 0.3} rx="4" ry="2.5" fill="#ffffff" opacity="0.85" />

                      {/* Penlight overlay */}
                      {(flashlight === 'LEFT_EYE' || flashlight === 'AMONG_BOTH') && (
                        <circle cx="0" cy="0" r="58" fill="#fef08a" opacity="0.28" className="animate-pulse" />
                      )}

                      {/* Upper Eyelid / Ptosis Simulator */}
                      <path
                        d={`M -76 0 Q 0 ${leftSvg.eyelidY} 76 0 L 76 -50 L -76 -50 Z`}
                        fill="#334155"
                        stroke="#475569"
                        strokeWidth="2"
                      />
                    </svg>

                    {/* Facial Anhidrosis indicator */}
                    {diagnostic.leftEye.anhidrosisArea !== 'NONE' && (
                      <div className="absolute top-0 right-0 bg-red-950/80 border border-red-500/50 rounded px-1.5 py-0.5 text-[9px] text-red-300 font-bold">
                        Anhidrosis (Dry)
                      </div>
                    )}
                  </div>

                  {/* OS Metrics Card */}
                  <div className="mt-3 w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-center text-xs space-y-1">
                    <div className="text-slate-400 text-[11px]">Diameter:</div>
                    <div className="text-lg font-black text-cyan-400">
                      {diagnostic.leftEye.pupilDiameterMm} mm
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Ptosis: <strong className="text-white">{diagnostic.leftEye.ptosisMm} mm</strong>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Light Reflex: <strong className="text-cyan-300">{diagnostic.leftEye.lightReflexResponse}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Examination Tools Row: Light, Near, Swinging Flashlight */}
              <div className="mt-5 space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                  <div className="w-full sm:w-1/2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Sun className="w-3.5 h-3.5 text-amber-400" />
                        Ambient Lighting (Lux)
                      </span>
                      <span className="font-bold text-white">{ambientLux} lx</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="1000"
                      step="15"
                      value={ambientLux}
                      onChange={(e) => setAmbientLux(Number(e.target.value))}
                      className="w-full accent-cyan-400 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => setAmbientLux(15)}
                      className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 ${
                        ambientLux <= 30
                          ? 'bg-indigo-600 border-indigo-500 text-white'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      <Moon className="w-3.5 h-3.5" />
                      Dark (15 lx)
                    </button>
                    <button
                      onClick={() => setAmbientLux(600)}
                      className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 ${
                        ambientLux >= 500
                          ? 'bg-amber-600 border-amber-500 text-white'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      <Sun className="w-3.5 h-3.5" />
                      Bright (600 lx)
                    </button>
                  </div>
                </div>

                {/* Penlight & Test Controls */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={() => {
                      setSwingingActive(false);
                      setFlashlight((f) => (f === 'RIGHT_EYE' ? 'OFF' : 'RIGHT_EYE'));
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      flashlight === 'RIGHT_EYE' && !swingingActive
                        ? 'bg-yellow-500 text-slate-950 border-yellow-400 shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <Flashlight className="w-3.5 h-3.5" />
                    Penlight OD
                  </button>

                  <button
                    onClick={() => {
                      setSwingingActive(false);
                      setFlashlight((f) => (f === 'LEFT_EYE' ? 'OFF' : 'LEFT_EYE'));
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      flashlight === 'LEFT_EYE' && !swingingActive
                        ? 'bg-yellow-500 text-slate-950 border-yellow-400 shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <Flashlight className="w-3.5 h-3.5" />
                    Penlight OS
                  </button>

                  <button
                    onClick={() => {
                      setSwingingActive(!swingingActive);
                      if (!swingingActive) setFlashlight('RIGHT_EYE');
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      swingingActive
                        ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <Activity className="w-3.5 h-3.5" />
                    Swinging Flashlight
                  </button>

                  <button
                    onClick={() => setNearEffort(!nearEffort)}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      nearEffort
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Near Target (10 cm)
                  </button>
                </div>
              </div>
            </div>

            {/* Pharmacological Eyedrop Testing Bench */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Diagnostic Eyedrop Challenge Shelf
                  </h3>
                </div>
                {activeDrop !== 'NONE' && (
                  <button
                    onClick={() => setActiveDrop('NONE')}
                    className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 font-semibold transition"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Washout Eyedrops
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  {
                    id: 'APRACLONIDINE_05',
                    label: '0.5% Apraclonidine',
                    badge: 'Horner Diagnosis (Reversal)',
                    color: 'text-amber-300',
                  },
                  {
                    id: 'COCAINE_10',
                    label: '10% Cocaine',
                    badge: 'NE Reuptake Block',
                    color: 'text-sky-300',
                  },
                  {
                    id: 'HYDROXYAMPHETAMINE_1',
                    label: '1% Hydroxyamphetamine',
                    badge: '3rd-Order Localization',
                    color: 'text-emerald-300',
                  },
                  {
                    id: 'PILOCARPINE_0125',
                    label: '0.125% Dilute Pilocarpine',
                    badge: 'Adie Supersensitivity',
                    color: 'text-purple-300',
                  },
                  {
                    id: 'PILOCARPINE_1',
                    label: '1.0% High Pilocarpine',
                    badge: 'CN III vs Pharmacologic',
                    color: 'text-rose-300',
                  },
                  {
                    id: 'NONE',
                    label: 'No Eyedrops (Baseline)',
                    badge: 'Natural Pupil Dynamics',
                    color: 'text-slate-400',
                  },
                ].map((drop) => {
                  const isSelected = activeDrop === drop.id;
                  return (
                    <button
                      key={drop.id}
                      onClick={() => setActiveDrop(drop.id as EyedropChallenge)}
                      className={`p-2.5 rounded-xl border text-left transition ${
                        isSelected
                          ? 'bg-cyan-950/70 border-cyan-500 text-white shadow'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className={`font-bold text-xs ${drop.color}`}>{drop.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{drop.badge}</div>
                    </button>
                  );
                })}
              </div>

              {/* Eyedrop Interpretation Alert Box */}
              <div
                className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                  activeDrop === 'NONE'
                    ? 'bg-slate-950/60 border-slate-800/80 text-slate-400'
                    : 'bg-indigo-950/50 border-indigo-500/50 text-indigo-200'
                }`}
              >
                <div className="font-bold uppercase tracking-wider text-[11px] mb-1 flex items-center gap-1.5 text-indigo-300">
                  <Zap className="w-3.5 h-3.5" />
                  Pharmacologic Response &amp; Mechanistic Interpretation:
                </div>
                {diagnostic.dropTestInterpretation}
              </div>
            </div>
          </div>

          {/* Right Column: Algorithmic Differential Solver & Urgent Workup (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Primary Diagnostic Summary Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Diagnostic Classification
                </span>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                    diagnostic.dominantDefect === 'SYMPATHETIC_DEFICIT'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : diagnostic.dominantDefect === 'PARASYMPATHETIC_DEFICIT'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : diagnostic.dominantDefect === 'AFFERENT_DEFICIT'
                      ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  {diagnostic.dominantDefect.replace('_', ' ')}
                </span>
              </div>

              {/* Differential Flowchart Logic */}
              <div className="space-y-3">
                <div className="text-xs font-semibold text-slate-300">
                  Anisocoria Pattern Identification:
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Light vs Dark Relationship:</span>
                    <strong
                      className={`font-mono ${
                        diagnostic.anisocoriaCondition === 'GREATER_IN_DARK'
                          ? 'text-amber-400'
                          : diagnostic.anisocoriaCondition === 'GREATER_IN_LIGHT'
                          ? 'text-rose-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {diagnostic.anisocoriaCondition.replace(/_/g, ' ')}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Pathological Pupil:</span>
                    <strong className="text-white font-mono">
                      {diagnostic.abnormalPupil.replace(/_/g, ' ')}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">RAPD (Marcus Gunn):</span>
                    <strong
                      className={diagnostic.rapdPresent ? 'text-yellow-400 font-bold' : 'text-slate-500'}
                    >
                      {diagnostic.rapdPresent ? `POSITIVE (Grade ${diagnostic.rapdGrade}+)` : 'Negative'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Differential Diagnoses Ranked */}
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  Leading Differential Diagnoses
                </div>
                <div className="space-y-1.5">
                  {diagnostic.differentialDiagnosis.map((diff, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 p-2 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs text-slate-200"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                      <span>{diff}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Urgent Workup */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  Urgent Clinical Next Steps &amp; Neuroimaging
                </div>
                <ul className="space-y-1 text-xs text-slate-300">
                  {diagnostic.recommendedUrgentWorkup.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-rose-400 font-bold">•</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* High-Yield Clinical Pearl */}
              <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/40 text-xs text-cyan-200 leading-relaxed">
                <div className="font-bold text-cyan-400 uppercase tracking-wider text-[11px] mb-1 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  High-Yield Neuro-Ophthalmology Pearl:
                </div>
                {diagnostic.clinicalPearl}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
