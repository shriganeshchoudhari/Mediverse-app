'use client';

import React, { useState, useEffect } from 'react';
import {
  computeEVDHydrodynamics,
  EVD_PRESETS,
  EVDInputParams,
  EVDHydrodynamicState,
  EVDPresetId,
} from '@/.gemini/skills/NeurosurgeryEVDEngine';

const DEFAULT_PARAMS: EVDInputParams = {
  presetId: 'ANEURYSMAL_SAH_ACUTE_HYDROCEPHALUS',
  trajectory: {
    burrHoleFromNasionCm: 11.0,
    burrHoleFromMidlineCm: 3.0,
    coronalAngleDeg: 90,
    sagittalAngleDeg: 90,
    catheterDepthCm: 6.0,
  },
  chamberHeightCmH2O: 15,
  clampState: 'OPEN_DRAINING',
  catheterPatencyPercent: 90,
  hypertonicSalineGiven: false,
  mannitolGiven: false,
  sterileFlushPerformed: false,
  intrathecalTpaGiven: false,
};

function alarmBadgeClass(alarm: string) {
  if (alarm === 'OPTIMAL') return 'bg-emerald-900/60 text-emerald-300 border-emerald-500/50';
  if (alarm.includes('HYPERTENSION') || alarm.includes('OVERDRAINAGE') || alarm.includes('COLLAPSE') || alarm.includes('MISPLACEMENT')) {
    return 'bg-rose-900/70 text-rose-200 border-rose-500 animate-pulse';
  }
  return 'bg-amber-900/60 text-amber-200 border-amber-500/60';
}

export default function NeurosurgeryEVDSimulator() {
  const [selectedPreset, setSelectedPreset] = useState<EVDPresetId>('ANEURYSMAL_SAH_ACUTE_HYDROCEPHALUS');
  const [params, setParams] = useState<EVDInputParams>(() => ({
    ...DEFAULT_PARAMS,
    ...EVD_PRESETS['ANEURYSMAL_SAH_ACUTE_HYDROCEPHALUS'].initialState,
  }));
  const [liveData, setLiveData] = useState<EVDHydrodynamicState>(() =>
    computeEVDHydrodynamics({ ...DEFAULT_PARAMS, ...EVD_PRESETS['ANEURYSMAL_SAH_ACUTE_HYDROCEPHALUS'].initialState })
  );

  useEffect(() => {
    setLiveData(computeEVDHydrodynamics(params));
  }, [params]);

  function loadPreset(id: EVDPresetId) {
    setSelectedPreset(id);
    setParams({
      ...DEFAULT_PARAMS,
      ...EVD_PRESETS[id].initialState,
      presetId: id,
    });
  }

  function toggleClamp() {
    setParams(p => ({
      ...p,
      clampState: p.clampState === 'OPEN_DRAINING' ? 'CLAMPED_MONITORING' : 'OPEN_DRAINING',
    }));
  }

  function giveHypertonicSaline() {
    setParams(p => ({ ...p, hypertonicSalineGiven: true }));
  }

  function giveMannitol() {
    setParams(p => ({ ...p, mannitolGiven: true }));
  }

  function performSterileFlush() {
    setParams(p => ({ ...p, sterileFlushPerformed: true }));
  }

  function giveIntrathecalTpa() {
    setParams(p => ({ ...p, intrathecalTpaGiven: true }));
  }

  function openSocraticAI() {
    window.dispatchEvent(
      new CustomEvent('mediverse:open-ai-with-context', {
        detail: {
          module: 'Neurosurgery EVD & Kocher Point Ventriculostomy',
          preset: EVD_PRESETS[selectedPreset].title,
          icpMmHg: `${liveData.icpMmHg} mmHg (${liveData.icpCmH2O} cmH2O)`,
          cppMmHg: `${liveData.cppMmHg} mmHg`,
          chamberHeight: `${params.chamberHeightCmH2O} cmH2O`,
          clampState: params.clampState,
          drainageRate: `${liveData.csfDrainageRateMlHr} mL/hr`,
          patencyPercent: `${params.catheterPatencyPercent}%`,
          trajectoryAccuracy: liveData.trajectoryAccuracy,
          activeAlarms: liveData.activeAlarms,
          recommendation: liveData.clinicalRecommendation,
        },
      })
    );
  }

  const isSlitVentricle = liveData.activeAlarms.includes('VENTRICULAR_SLIT_COLLAPSE');
  const isSevereHydrocephalus = selectedPreset === 'ANEURYSMAL_SAH_ACUTE_HYDROCEPHALUS' || selectedPreset === 'NPH_CSF_TAP_TRIAL';

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen p-4 md:p-6 font-mono">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black text-cyan-400 tracking-tight">
              NEUROSURGERY — Kocher&apos;s Point Ventriculostomy &amp; EVD Hydrodynamics
            </h1>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                liveData.icpMmHg >= 20
                  ? 'border-rose-500 bg-rose-950/70 text-rose-300 animate-pulse'
                  : 'border-emerald-500 bg-emerald-950/60 text-emerald-300'
              }`}
            >
              ICP: {liveData.icpMmHg} mmHg ({liveData.icpCmH2O} cmH2O)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Stereotactic Landmarks | Monro-Kellie Hydrodynamics | Poiseuille Burette Drainage | Tragus Zero Reference
          </p>
        </div>

        <button
          onClick={openSocraticAI}
          className="self-start md:self-auto px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg transition border border-cyan-400/40 flex items-center gap-2"
        >
          <span>✨</span> Ask Socratic AI Tutor
        </button>
      </div>

      {/* Preset Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-4">
        {Object.values(EVD_PRESETS).map(p => (
          <button
            key={p.id}
            onClick={() => loadPreset(p.id)}
            className={`p-2.5 rounded-lg border text-left transition ${
              selectedPreset === p.id
                ? 'border-cyan-500 bg-cyan-950/80 text-white shadow-md'
                : 'border-slate-800 bg-slate-900/60 hover:border-slate-600 text-slate-300'
            }`}
          >
            <span className="text-[10px] block font-mono text-cyan-400 font-bold truncate">Target ICP: {p.targetIcpMmHg} mmHg</span>
            <p className="text-xs font-semibold mt-0.5 line-clamp-1">{p.title}</p>
          </button>
        ))}
      </div>

      {/* Active Alarm Banner */}
      {liveData.activeAlarms.length > 0 && liveData.activeAlarms[0] !== 'OPTIMAL' ? (
        <div className="p-2.5 rounded-xl border border-rose-600/70 bg-rose-950/50 mb-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-rose-300">⚠ NEUROSURGICAL ALERTS:</span>
          {liveData.activeAlarms.map(alarm => (
            <span key={alarm} className={`text-[11px] px-2 py-0.5 rounded border font-semibold ${alarmBadgeClass(alarm)}`}>
              {alarm.replace(/_/g, ' ')}
            </span>
          ))}
        </div>
      ) : (
        <div className="p-2.5 rounded-xl border border-emerald-600/70 bg-emerald-950/40 mb-4 text-xs font-bold text-emerald-300">
          ✓ OPTIMAL EVD HOMEOSTASIS — Patent Ventricular Drain, ICP &lt; 20 mmHg, CPP &gt; 60 mmHg
        </div>
      )}

      {/* Main Simulation Viewport: 3-Column Console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Left Column: Stereotactic Navigation & Kocher's Point Entry */}
        <div className="border border-slate-800 rounded-2xl bg-slate-900/70 p-4 space-y-4">
          <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
            Stereotactic Ventriculostomy Navigation
          </h2>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Entry from Nasion:</span>
              <span className="font-bold text-cyan-300">{params.trajectory.burrHoleFromNasionCm} cm (Target: 11 cm)</span>
            </div>
            <input
              type="range"
              min="9.0"
              max="13.0"
              step="0.5"
              value={params.trajectory.burrHoleFromNasionCm}
              onChange={e =>
                setParams(p => ({
                  ...p,
                  trajectory: { ...p.trajectory, burrHoleFromNasionCm: Number(e.target.value) },
                }))
              }
              className="w-full accent-cyan-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Entry from Midline:</span>
              <span className="font-bold text-cyan-300">{params.trajectory.burrHoleFromMidlineCm} cm (Target: 3 cm)</span>
            </div>
            <input
              type="range"
              min="1.5"
              max="4.5"
              step="0.5"
              value={params.trajectory.burrHoleFromMidlineCm}
              onChange={e =>
                setParams(p => ({
                  ...p,
                  trajectory: { ...p.trajectory, burrHoleFromMidlineCm: Number(e.target.value) },
                }))
              }
              className="w-full accent-cyan-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Coronal Angle (Medial Canthus):</span>
              <span className="font-bold text-cyan-300">{params.trajectory.coronalAngleDeg}&deg; (Perpendicular 90&deg;)</span>
            </div>
            <input
              type="range"
              min="70"
              max="110"
              value={params.trajectory.coronalAngleDeg}
              onChange={e =>
                setParams(p => ({
                  ...p,
                  trajectory: { ...p.trajectory, coronalAngleDeg: Number(e.target.value) },
                }))
              }
              className="w-full accent-cyan-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Catheter Insertion Depth:</span>
              <span className="font-bold text-cyan-300">{params.trajectory.catheterDepthCm} cm (Target: 5.5–6.5 cm)</span>
            </div>
            <input
              type="range"
              min="4.0"
              max="8.0"
              step="0.5"
              value={params.trajectory.catheterDepthCm}
              onChange={e =>
                setParams(p => ({
                  ...p,
                  trajectory: { ...p.trajectory, catheterDepthCm: Number(e.target.value) },
                }))
              }
              className="w-full accent-cyan-500"
            />
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Trajectory Status:</span>
              <span
                className={`font-bold ${
                  liveData.ventricleCannulated ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {liveData.trajectoryAccuracy.replace(/_/g, ' ')}
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Foramen of Monro:</span>
              <span className="text-slate-300 font-semibold">
                {liveData.ventricleCannulated ? '✓ Frontal Horn Cannulated' : '✗ Missed Ventricular Cavity'}
              </span>
            </div>
          </div>
        </div>

        {/* Center Column: Coronal Ventricular & Burette Drainage Visualizer SVG */}
        <div className="border border-slate-800 rounded-2xl bg-slate-900/70 p-4 flex flex-col items-center justify-between">
          <div className="w-full flex justify-between items-center mb-2 text-xs">
            <span className="text-slate-400 font-mono">CORONAL SECTION &amp; DRAINAGE COLUMN</span>
            <span className="text-cyan-400 font-bold">
              {params.clampState === 'OPEN_DRAINING' ? 'OPEN DRAIN' : 'CLAMPED'}
            </span>
          </div>

          {/* SVG Viewport */}
          <div className="w-full h-72 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 relative flex items-center justify-center">
            <svg viewBox="0 0 320 200" className="w-full h-full">
              {/* Brain Calvarium Outline */}
              <path
                d="M 40 180 C 20 120, 30 40, 110 30 C 190 40, 200 120, 180 180 Z"
                fill="#1e293b"
                stroke="#334155"
                strokeWidth="2"
              />

              {/* Lateral Ventricles (Frontal Horns) */}
              <path
                d={
                  isSlitVentricle
                    ? "M 90 90 Q 95 105 90 120 M 130 90 Q 125 105 130 120"
                    : isSevereHydrocephalus
                    ? "M 70 80 Q 95 65 100 115 Q 85 135 70 125 Z M 150 80 Q 125 65 120 115 Q 135 135 150 125 Z"
                    : "M 82 85 Q 96 75 98 115 Q 88 128 82 120 Z M 138 85 Q 124 75 122 115 Q 132 128 138 120 Z"
                }
                fill={isSlitVentricle ? 'none' : '#0284c7'}
                stroke="#38bdf8"
                strokeWidth={isSlitVentricle ? '2' : '1.5'}
                opacity={isSlitVentricle ? 0.6 : 0.85}
              />

              {/* Third Ventricle & Foramen of Monro */}
              <ellipse cx="110" cy="120" rx="6" ry="12" fill="#0284c7" opacity="0.8" />

              {/* Kocher's Point Entry Hole */}
              <circle cx="85" cy="40" r="4" fill="#f43f5e" stroke="#fff" strokeWidth="1" />
              <text x="50" y="32" fill="#94a3b8" fontSize="8">Kocher&apos;s Pt</text>

              {/* EVD Catheter Path from Skull into Ventricle */}
              <line
                x1="85"
                y1="40"
                x2={85 + (params.trajectory.coronalAngleDeg - 90) * 0.8}
                y2={40 + params.trajectory.catheterDepthCm * 11}
                stroke="#22c55e"
                strokeWidth="2.5"
                strokeDasharray="4 2"
              />
              {/* Catheter Tip Marker */}
              <circle
                cx={85 + (params.trajectory.coronalAngleDeg - 90) * 0.8}
                cy={40 + params.trajectory.catheterDepthCm * 11}
                r="3"
                fill="#eab308"
              />

              {/* Right Side: Graduated EVD Drainage Burette */}
              <g transform="translate(230, 20)">
                {/* Burette Column Backplate */}
                <rect x="0" y="0" width="40" height="150" rx="6" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
                {/* Scale markings */}
                {[0, 5, 10, 15, 20, 25].map(val => (
                  <g key={val}>
                    <line x1="0" y1={130 - val * 5} x2="10" y2={130 - val * 5} stroke="#64748b" strokeWidth="1" />
                    <text x="14" y={133 - val * 5} fill="#94a3b8" fontSize="8">{val}</text>
                  </g>
                ))}
                {/* Burette Chamber Threshold Level (User Setting) */}
                <line
                  x1="0"
                  y1={130 - params.chamberHeightCmH2O * 5}
                  x2="40"
                  y2={130 - params.chamberHeightCmH2O * 5}
                  stroke="#f43f5e"
                  strokeWidth="2"
                />
                {/* CSF Fluid in Burette */}
                <rect
                  x="4"
                  y={130 - Math.min(params.chamberHeightCmH2O, liveData.icpCmH2O) * 5}
                  width="32"
                  height={Math.max(0, Math.min(params.chamberHeightCmH2O, liveData.icpCmH2O) * 5)}
                  fill="#38bdf8"
                  opacity="0.6"
                />
                {/* Dripping Meniscus when draining */}
                {params.clampState === 'OPEN_DRAINING' && liveData.csfDrainageRateMlHr > 0 && (
                  <circle cx="20" cy="140" r="3" fill="#38bdf8" className="animate-ping" />
                )}
                <text x="-5" y="165" fill="#38bdf8" fontSize="9" fontWeight="bold">
                  {liveData.csfDrainageRateMlHr} mL/hr
                </text>
              </g>

              {/* Laser Level Line from Tragus (assumed baseline y=130) */}
              <line x1="180" y1="130" x2="230" y2="130" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 2" />
              <text x="160" y="142" fill="#f59e0b" fontSize="8">Tragus Level (0 cmH2O)</text>
            </svg>
          </div>

          <div className="mt-3 text-center text-xs text-slate-300 font-mono">
            {EVD_PRESETS[selectedPreset].ctImagingFinding}
          </div>
        </div>

        {/* Right Column: Hydrodynamic Controls & Neurocritical Interventions */}
        <div className="border border-slate-800 rounded-2xl bg-slate-900/70 p-4 space-y-4">
          <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
            Hydrodynamic Burette &amp; Bedside Deck
          </h2>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Burette Chamber Height:</span>
              <span className="font-bold text-cyan-300">{params.chamberHeightCmH2O} cmH2O</span>
            </div>
            <input
              type="range"
              min="0"
              max="25"
              value={params.chamberHeightCmH2O}
              onChange={e => setParams(p => ({ ...p, chamberHeightCmH2O: Number(e.target.value) }))}
              className="w-full accent-cyan-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
              <span>0 (Overdrain Risk)</span>
              <span>10–15 (Standard)</span>
              <span>25 cmH2O (Wean)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Catheter Patency:</span>
              <span className="font-bold text-cyan-300">{params.catheterPatencyPercent}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={params.catheterPatencyPercent}
              onChange={e => setParams(p => ({ ...p, catheterPatencyPercent: Number(e.target.value) }))}
              className="w-full accent-cyan-500"
            />
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-300">Drainage Stopcock:</span>
            <button
              onClick={toggleClamp}
              className={`text-xs px-3 py-1.5 rounded-lg border font-semibold ${
                params.clampState === 'OPEN_DRAINING'
                  ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                  : 'bg-rose-950 border-rose-500 text-rose-300'
              }`}
            >
              {params.clampState === 'OPEN_DRAINING' ? '✓ OPEN & DRAINING' : '✕ CLAMPED'}
            </button>
          </div>

          {/* Bedside Neurocritical Interventions Deck */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <span className="text-[11px] font-bold text-cyan-400 block uppercase">Bedside Neurocritical Actions</span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={giveHypertonicSaline}
                className={`text-xs p-2 rounded-lg border font-semibold truncate ${
                  params.hypertonicSalineGiven
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-600'
                }`}
              >
                3% NaCl 250mL
              </button>
              <button
                onClick={giveMannitol}
                className={`text-xs p-2 rounded-lg border font-semibold truncate ${
                  params.mannitolGiven
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-600'
                }`}
              >
                20% Mannitol 1g/kg
              </button>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={performSterileFlush}
                className={`text-xs p-2 rounded-lg border font-semibold truncate ${
                  params.sterileFlushPerformed
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-600'
                }`}
              >
                Sterile Saline Flush
              </button>
              <button
                onClick={giveIntrathecalTpa}
                className={`text-xs p-2 rounded-lg border font-semibold truncate ${
                  params.intrathecalTpaGiven
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-600'
                }`}
              >
                Intrathecal rt-PA 1mg
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
