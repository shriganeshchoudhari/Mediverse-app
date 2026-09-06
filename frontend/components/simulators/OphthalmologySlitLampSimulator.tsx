'use client';

import React, { useState, useEffect } from 'react';
import {
  computeSlitLampState,
  SLIT_LAMP_PRESETS,
  SlitLampInputParams,
  SlitLampState,
  PresetId,
  SlitFilter,
} from '@/.gemini/skills/OphthalmologySlitLampEngine';

const DEFAULT_PARAMS: SlitLampInputParams = {
  presetId: 'ACUTE_ANGLE_CLOSURE_GLAUCOMA',
  slitWidthMm: 1.0,
  beamAngleDeg: 45,
  filter: 'DIFFUSE_WHITE',
  magnification: '16X',
  fluoresceinDyeInstilled: false,
  tonometerDialMmHg: 64,
  cctUm: 540,
  topicalPilocarpineGiven: false,
  ivAcetazolamideGiven: false,
  topicalTimololGiven: false,
  laserIridotomyPerformed: false,
};

function alarmBadgeColor(alarm: string) {
  if (alarm === 'OPTIMAL') return 'bg-emerald-900/60 text-emerald-300 border-emerald-500/50';
  if (alarm.includes('CRISIS') || alarm.includes('RUPTURE') || alarm.includes('CLOSED')) {
    return 'bg-rose-900/70 text-rose-200 border-rose-500 animate-pulse';
  }
  return 'bg-amber-900/60 text-amber-200 border-amber-500/60';
}

export default function OphthalmologySlitLampSimulator() {
  const [selectedPreset, setSelectedPreset] = useState<PresetId>('ACUTE_ANGLE_CLOSURE_GLAUCOMA');
  const [params, setParams] = useState<SlitLampInputParams>(() => ({
    ...DEFAULT_PARAMS,
    ...SLIT_LAMP_PRESETS['ACUTE_ANGLE_CLOSURE_GLAUCOMA'].initialState,
  }));
  const [liveData, setLiveData] = useState<SlitLampState>(() =>
    computeSlitLampState({ ...DEFAULT_PARAMS, ...SLIT_LAMP_PRESETS['ACUTE_ANGLE_CLOSURE_GLAUCOMA'].initialState })
  );

  useEffect(() => {
    setLiveData(computeSlitLampState(params));
  }, [params]);

  function loadPreset(id: PresetId) {
    setSelectedPreset(id);
    setParams({
      ...DEFAULT_PARAMS,
      ...SLIT_LAMP_PRESETS[id].initialState,
      presetId: id,
    });
  }

  // Optics & Filter toggles
  function setFilter(f: SlitFilter) {
    setParams(p => ({ ...p, filter: f }));
  }

  function toggleFluorescein() {
    setParams(p => ({ ...p, fluoresceinDyeInstilled: !p.fluoresceinDyeInstilled }));
  }

  // Glaucoma Crisis Rescues
  function giveAcetazolamide() {
    setParams(p => ({ ...p, ivAcetazolamideGiven: true }));
  }

  function giveTimolol() {
    setParams(p => ({ ...p, topicalTimololGiven: true }));
  }

  function givePilocarpine() {
    setParams(p => ({ ...p, topicalPilocarpineGiven: true }));
  }

  function performLaserIridotomy() {
    setParams(p => ({ ...p, laserIridotomyPerformed: true }));
  }

  function openSocraticAI() {
    window.dispatchEvent(
      new CustomEvent('mediverse:open-ai-with-context', {
        detail: {
          module: 'Ophthalmology Slit Lamp & Goldmann Tonometry',
          preset: SLIT_LAMP_PRESETS[selectedPreset].title,
          iopMeasured: `${params.tonometerDialMmHg} mmHg`,
          iopCorrected: `${liveData.goldmann.correctedTrueIopMmHg} mmHg (CCT ${params.cctUm} um)`,
          semicirclesAligned: liveData.goldmann.fluoresceinSemicirclesAligned,
          vanHerickAngle: liveData.vanHerick,
          filter: params.filter,
          pupilExam: liveData.pupilStatus,
          activeAlarms: liveData.activeAlarms,
          recommendation: liveData.clinicalRecommendation,
        },
      })
    );
  }

  const isDendrite = selectedPreset === 'HSV_DENDRITIC_KERATITIS';
  const isAngleClosure = selectedPreset === 'ACUTE_ANGLE_CLOSURE_GLAUCOMA';
  const isSeidel = selectedPreset === 'PENETRATING_GLOBE_SEIDEL_POSITIVE';
  const isHypopyon = selectedPreset === 'ACUTE_ANTERIOR_UVEITIS_HYPOPYON';
  const isCataract = selectedPreset === 'NUCLEAR_CATARACT_SENILE';

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen p-4 md:p-6 font-mono">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black text-teal-400 tracking-tight">
              OPHTHALMOLOGY — Slit Lamp &amp; Goldmann Tonometry Workstation
            </h1>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                liveData.goldmann.correctedTrueIopMmHg >= 30
                  ? 'border-rose-500 bg-rose-950/70 text-rose-300 animate-pulse'
                  : 'border-emerald-500 bg-emerald-950/60 text-emerald-300'
              }`}
            >
              IOP: {liveData.goldmann.correctedTrueIopMmHg} mmHg (CCT: {params.cctUm} μm)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Biomicroscopy Optical Slices | Goldmann Applanation Meniscus | Van Herick Chamber Angle | Seidel Corneal Sign
          </p>
        </div>

        <button
          onClick={openSocraticAI}
          className="self-start md:self-auto px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white shadow-lg transition border border-teal-400/40 flex items-center gap-2"
        >
          <span>✨</span> Ask Socratic AI Tutor
        </button>
      </div>

      {/* Preset Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-4">
        {Object.values(SLIT_LAMP_PRESETS).map(p => (
          <button
            key={p.id}
            onClick={() => loadPreset(p.id)}
            className={`p-2.5 rounded-lg border text-left transition ${
              selectedPreset === p.id
                ? 'border-teal-500 bg-teal-950/80 text-white shadow-md'
                : 'border-slate-800 bg-slate-900/60 hover:border-slate-600 text-slate-300'
            }`}
          >
            <span className="text-[10px] block font-mono text-teal-400 font-bold truncate">IOP: {p.targetIopMmHg} mmHg</span>
            <p className="text-xs font-semibold mt-0.5 line-clamp-1">{p.title}</p>
          </button>
        ))}
      </div>

      {/* Active Alarm Banner */}
      {liveData.activeAlarms.length > 0 && liveData.activeAlarms[0] !== 'OPTIMAL' ? (
        <div className="p-2.5 rounded-xl border border-rose-600/70 bg-rose-950/50 mb-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-rose-300">⚠ OPHTHALMIC ALERTS:</span>
          {liveData.activeAlarms.map(alarm => (
            <span key={alarm} className={`text-[11px] px-2 py-0.5 rounded border font-semibold ${alarmBadgeColor(alarm)}`}>
              {alarm.replace(/_/g, ' ')}
            </span>
          ))}
        </div>
      ) : (
        <div className="p-2.5 rounded-xl border border-emerald-600/70 bg-emerald-950/40 mb-4 text-xs font-bold text-emerald-300">
          ✓ NORMO-TENSIVE EYE — Clear Cornea, Open Angle (Van Herick 4), Normal IOP
        </div>
      )}

      {/* Main Simulation Viewport: 3-Column Console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Left Column: Slit Lamp Optical Controls */}
        <div className="border border-slate-800 rounded-2xl bg-slate-900/70 p-4 space-y-4">
          <h2 className="text-xs font-bold text-teal-400 uppercase tracking-wider">
            Slit Lamp Optical Controls
          </h2>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Slit Beam Width:</span>
              <span className="font-bold text-teal-300">{params.slitWidthMm} mm</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="14.0"
              step="0.1"
              value={params.slitWidthMm}
              onChange={e => setParams(p => ({ ...p, slitWidthMm: Number(e.target.value) }))}
              className="w-full accent-teal-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
              <span>0.1 mm (Optical Slice)</span>
              <span>14 mm (Diffuse)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Illumination Angle:</span>
              <span className="font-bold text-teal-300">{params.beamAngleDeg}&deg;</span>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              value={params.beamAngleDeg}
              onChange={e => setParams(p => ({ ...p, beamAngleDeg: Number(e.target.value) }))}
              className="w-full accent-teal-500"
            />
          </div>

          {/* Illumination Filter Selector */}
          <div>
            <span className="text-xs text-slate-400 block mb-1">Illumination Filter:</span>
            <div className="grid grid-cols-3 gap-1.5">
              {(['DIFFUSE_WHITE', 'COBALT_BLUE', 'RED_FREE_GREEN'] as SlitFilter[]).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-[11px] py-1.5 px-2 rounded-lg border font-semibold truncate ${
                    params.filter === f
                      ? 'bg-teal-950 border-teal-500 text-teal-200'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {f === 'COBALT_BLUE' ? 'Cobalt Blue' : f === 'RED_FREE_GREEN' ? 'Red-Free' : 'White Light'}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-300">Fluorescein Eye Drops:</span>
            <button
              onClick={toggleFluorescein}
              className={`text-xs px-3 py-1.5 rounded-lg border font-semibold ${
                params.fluoresceinDyeInstilled
                  ? 'bg-yellow-950 border-yellow-500 text-yellow-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              {params.fluoresceinDyeInstilled ? '✓ INSTILLED' : 'INSTILL'}
            </button>
          </div>

          {/* Van Herick Anterior Chamber Depth */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Van Herick Angle:</span>
              <span className={`font-bold ${liveData.vanHerick === 'GRADE_0_CLOSED' ? 'text-rose-400' : 'text-emerald-400'}`}>
                {liveData.vanHerick.replace(/_/g, ' ')}
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Pupil Exam:</span>
              <span className="text-slate-300 text-[11px] truncate max-w-[180px]">{liveData.pupilStatus}</span>
            </div>
          </div>
        </div>

        {/* Center Column: High-Magnification Eyepiece Viewport SVG */}
        <div className="border border-slate-800 rounded-2xl bg-slate-900/70 p-4 flex flex-col items-center justify-between">
          <div className="w-full flex justify-between items-center mb-2 text-xs">
            <span className="text-slate-400 font-mono">OCULAR BIOMICROSCOPE</span>
            <span className="text-teal-400 font-bold">{params.magnification} MAG</span>
          </div>

          {/* Eyepiece Circular Viewport */}
          <div
            className={`w-64 h-64 sm:w-72 sm:h-72 rounded-full overflow-hidden border-4 border-slate-700 relative shadow-2xl flex items-center justify-center ${
              params.filter === 'COBALT_BLUE' ? 'bg-blue-950' : params.filter === 'RED_FREE_GREEN' ? 'bg-emerald-950' : 'bg-slate-950'
            }`}
          >
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {/* Sclera & Iris */}
              <circle cx="100" cy="100" r="90" fill="#f8fafc" opacity="0.15" />
              <circle cx="100" cy="100" r="65" fill="#334155" stroke="#475569" strokeWidth="2" />

              {/* Pupil */}
              <circle
                cx="100"
                cy="100"
                r={isAngleClosure ? (params.laserIridotomyPerformed ? 18 : 34) : isSeidel ? 24 : 22}
                fill="#020617"
              />

              {/* Pathology: Dendritic Ulcer under Cobalt Blue */}
              {isDendrite && (
                <g>
                  <path
                    d="M 60 90 Q 85 85 110 100 T 150 95 M 95 90 Q 105 70 115 60 M 110 100 Q 120 125 135 135"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  {/* Terminal bulbous end-feet */}
                  <circle cx="150" cy="95" r="3.5" fill="#4ade80" />
                  <circle cx="115" cy="60" r="3.5" fill="#4ade80" />
                  <circle cx="135" cy="135" r="3.5" fill="#4ade80" />
                </g>
              )}

              {/* Pathology: Positive Seidel Sign Aqueous Streaming */}
              {isSeidel && (
                <g>
                  {/* Laceration site at 4 o'clock */}
                  <line x1="120" y1="120" x2="135" y2="135" stroke="#f87171" strokeWidth="3" />
                  {/* Aqueous diluting fluorescein waterfall */}
                  <path d="M 125 125 Q 115 150 110 185" fill="none" stroke="#38bdf8" strokeWidth="5" strokeDasharray="3 2" />
                </g>
              )}

              {/* Pathology: Hypopyon Sterile Pus Meniscus */}
              {isHypopyon && (
                <path d="M 50 145 Q 100 160 150 145 Q 140 170 60 170 Z" fill="#fef08a" stroke="#eab308" strokeWidth="1.5" />
              )}

              {/* Pathology: Nuclear Sclerotic Cataract */}
              {isCataract && (
                <circle cx="100" cy="100" r="18" fill="#d97706" opacity="0.8" />
              )}

              {/* Laser Iridotomy Hole */}
              {params.laserIridotomyPerformed && (
                <circle cx="100" cy="42" r="3" fill="#020617" stroke="#ef4444" strokeWidth="1" />
              )}

              {/* Slit Lamp Optical Beam Slice Overlay */}
              <rect
                x={100 - params.slitWidthMm * 2}
                y="15"
                width={Math.max(2, params.slitWidthMm * 4)}
                height="170"
                fill="#ffffff"
                opacity={params.filter === 'COBALT_BLUE' ? 0.35 : 0.6}
                transform={`rotate(${params.beamAngleDeg - 30}, 100, 100)`}
              />
            </svg>
          </div>

          <div className="mt-3 text-center text-xs text-slate-300 font-mono">
            {liveData.pathologyFindings}
          </div>
        </div>

        {/* Right Column: Goldmann Applanation Tonometry (GAT) & Rescues */}
        <div className="border border-slate-800 rounded-2xl bg-slate-900/70 p-4 space-y-4">
          <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
            Goldmann Applanation Tonometry (GAT)
          </h2>

          {/* Semicircle Fluorescein Meniscus Alignment Graphic */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex flex-col items-center">
            <span className="text-[10px] text-slate-400 mb-1">Fluorescein Biprism Semicircle View:</span>
            <div className="w-36 h-24 bg-blue-950 border border-blue-900 rounded-lg relative overflow-hidden flex items-center justify-center">
              {/* Top semicircular arc */}
              <svg viewBox="0 0 100 60" className="w-full h-full">
                {/* Upper green semicircle */}
                <path
                  d={`M ${40 - liveData.goldmann.semicirclesOverlapMm * 5} 25 A 12 12 0 0 1 ${64 - liveData.goldmann.semicirclesOverlapMm * 5} 25`}
                  fill="none"
                  stroke="#4ade80"
                  strokeWidth="3.5"
                />
                {/* Lower green semicircle */}
                <path
                  d={`M ${36 + liveData.goldmann.semicirclesOverlapMm * 5} 35 A 12 12 0 0 0 ${60 + liveData.goldmann.semicirclesOverlapMm * 5} 35`}
                  fill="none"
                  stroke="#4ade80"
                  strokeWidth="3.5"
                />
              </svg>
            </div>
            <span className={`text-[10px] font-bold mt-1.5 ${liveData.goldmann.fluoresceinSemicirclesAligned ? 'text-emerald-400' : 'text-amber-400'}`}>
              {liveData.goldmann.fluoresceinSemicirclesAligned
                ? '✓ PERFECT APPLANATION (Inner Edges Touching)'
                : liveData.goldmann.semicirclesOverlapMm > 0
                ? '⚠ OVER-APPLANATED (Dial Too High)'
                : '⚠ UNDER-APPLANATED (Dial Too Low)'}
            </span>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Tonometer Dial Setting:</span>
              <span className="font-bold text-cyan-300">{params.tonometerDialMmHg} mmHg</span>
            </div>
            <input
              type="range"
              min="4"
              max="80"
              value={params.tonometerDialMmHg}
              onChange={e => setParams(p => ({ ...p, tonometerDialMmHg: Number(e.target.value) }))}
              className="w-full accent-cyan-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Central Corneal Thickness (CCT):</span>
              <span className="font-mono text-cyan-300">{params.cctUm} μm ({liveData.goldmann.cctCorrectionOffsetMmHg >= 0 ? `+${liveData.goldmann.cctCorrectionOffsetMmHg}` : liveData.goldmann.cctCorrectionOffsetMmHg} mmHg)</span>
            </div>
            <input
              type="range"
              min="460"
              max="620"
              step="10"
              value={params.cctUm}
              onChange={e => setParams(p => ({ ...p, cctUm: Number(e.target.value) }))}
              className="w-full accent-cyan-500"
            />
          </div>

          {/* Acute Angle Closure Emergency Intervention Deck */}
          {isAngleClosure && (
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-rose-400 block uppercase">Angle-Closure Decompression</span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={giveAcetazolamide}
                  className={`text-xs p-2 rounded-lg border font-semibold truncate ${
                    params.ivAcetazolamideGiven
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  IV Diamox 500mg
                </button>
                <button
                  onClick={giveTimolol}
                  className={`text-xs p-2 rounded-lg border font-semibold truncate ${
                    params.topicalTimololGiven
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  Timolol 0.5% Drops
                </button>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={givePilocarpine}
                  className={`text-xs p-2 rounded-lg border font-semibold truncate ${
                    params.topicalPilocarpineGiven
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  Pilocarpine 2%
                </button>
                <button
                  onClick={performLaserIridotomy}
                  className={`text-xs p-2 rounded-lg border font-semibold truncate ${
                    params.laserIridotomyPerformed
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                      : 'bg-rose-950 border-rose-500 text-rose-300'
                  }`}
                >
                  Nd:YAG Iridotomy
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
