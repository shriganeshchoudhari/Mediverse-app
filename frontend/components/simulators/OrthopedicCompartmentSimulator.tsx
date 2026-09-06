'use client';

import React, { useState, useEffect } from 'react';
import {
  computeOrthopedicState,
  ORTHOPEDIC_PRESETS,
  OrthopedicInputParams,
  OrthopedicState,
  PresetId,
} from '@/.gemini/skills/OrthopedicCompartmentEngine';

const DEFAULT_PARAMS: OrthopedicInputParams = {
  presetId: 'TIBIAL_FRACTURE_ANTERIOR_ACS',
  region: 'LOWER_LEG_4_COMPARTMENT',
  sbpMmHg: 128,
  dbpMmHg: 70,
  anteriorPressureMmHg: 48,
  lateralPressureMmHg: 26,
  superficialPostPressureMmHg: 16,
  deepPostPressureMmHg: 22,
  forearmVolarPressureMmHg: 18,
  castSplitBivalved: false,
  legElevatedAboveHeart: false,
  anterolateralIncision: false,
  posteromedialIncision: false,
  volarIncision: false,
  hoursSinceInjury: 4,
  urineColorMyoglobinuria: 'CLEAR_YELLOW',
  serumCreatineKinaseUPerL: 1400,
  passiveStretchPain: true,
};

function alarmBadgeColor(alarm: string) {
  if (alarm === 'OPTIMAL') return 'bg-emerald-900/60 text-emerald-300 border-emerald-500/50';
  if (alarm.includes('ACUTE') || alarm.includes('FASCIOTOMY') || alarm.includes('CRITICAL')) {
    return 'bg-rose-900/70 text-rose-200 border-rose-500 animate-pulse';
  }
  return 'bg-amber-900/60 text-amber-200 border-amber-500/60';
}

export default function OrthopedicCompartmentSimulator() {
  const [selectedPreset, setSelectedPreset] = useState<PresetId>('TIBIAL_FRACTURE_ANTERIOR_ACS');
  const [params, setParams] = useState<OrthopedicInputParams>(() => ({
    ...DEFAULT_PARAMS,
    ...ORTHOPEDIC_PRESETS['TIBIAL_FRACTURE_ANTERIOR_ACS'].initialState,
  }));
  const [liveData, setLiveData] = useState<OrthopedicState>(() =>
    computeOrthopedicState({ ...DEFAULT_PARAMS, ...ORTHOPEDIC_PRESETS['TIBIAL_FRACTURE_ANTERIOR_ACS'].initialState })
  );

  useEffect(() => {
    setLiveData(computeOrthopedicState(params));
  }, [params]);

  function loadPreset(id: PresetId) {
    setSelectedPreset(id);
    setParams({
      ...DEFAULT_PARAMS,
      ...ORTHOPEDIC_PRESETS[id].initialState,
      presetId: id,
    });
  }

  // Interventions
  function toggleBivalveCast() {
    setParams(p => ({ ...p, castSplitBivalved: !p.castSplitBivalved }));
  }

  function toggleLegElevation() {
    setParams(p => ({ ...p, legElevatedAboveHeart: !p.legElevatedAboveHeart }));
  }

  function performAnterolateralFasciotomy() {
    setParams(p => ({ ...p, anterolateralIncision: true }));
  }

  function performPosteromedialFasciotomy() {
    setParams(p => ({ ...p, posteromedialIncision: true }));
  }

  function performVolarFasciotomy() {
    setParams(p => ({ ...p, volarIncision: true }));
  }

  function openSocraticAI() {
    window.dispatchEvent(
      new CustomEvent('mediverse:open-ai-with-context', {
        detail: {
          module: 'Orthopedic Surgery & Acute Compartment Syndrome',
          preset: ORTHOPEDIC_PRESETS[selectedPreset].title,
          region: liveData.region,
          worstDeltaP: `${liveData.worstDeltaPMmHg} mmHg (DBP - ICP)`,
          worstIcp: `${liveData.worstAbsoluteIcpMmHg} mmHg`,
          acsDiagnosed: liveData.acsDiagnosed,
          fasciotomyIndicated: liveData.fasciotomyIndicated,
          fasciotomyState: liveData.fasciotomyState,
          ck: `${params.serumCreatineKinaseUPerL} U/L`,
          rhabdo: liveData.rhabdomyolysisSeverity,
          activeAlarms: liveData.activeAlarms,
          recommendation: liveData.clinicalRecommendation,
        },
      })
    );
  }

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen p-4 md:p-6 font-mono">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black text-cyan-400 tracking-tight">
              ORTHOPEDIC SURGERY — Compartment Syndrome &amp; Fasciotomy Workstation
            </h1>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                liveData.acsDiagnosed
                  ? 'border-rose-500 bg-rose-950/70 text-rose-300 animate-pulse'
                  : 'border-emerald-500 bg-emerald-950/60 text-emerald-300'
              }`}
            >
              {liveData.acsDiagnosed ? 'ACUTE COMPARTMENT SYNDROME (ACS)' : 'ADEQUATE PERFUSION'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Delta P (DBP - ICP &le; 30 mmHg) | Whitesides Manometer | 2-Incision 4-Compartment Fasciotomy | Volkmann Ischemia
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
        {Object.values(ORTHOPEDIC_PRESETS).map(p => (
          <button
            key={p.id}
            onClick={() => loadPreset(p.id)}
            className={`p-2.5 rounded-lg border text-left transition ${
              selectedPreset === p.id
                ? 'border-cyan-500 bg-cyan-950/80 text-white shadow-md'
                : 'border-slate-800 bg-slate-900/60 hover:border-slate-600 text-slate-300'
            }`}
          >
            <span className="text-[10px] block font-mono text-cyan-400 font-bold truncate">{p.injuryMechanism}</span>
            <p className="text-xs font-semibold mt-0.5 line-clamp-1">{p.title}</p>
          </button>
        ))}
      </div>

      {/* Active Alarm Banner */}
      {liveData.activeAlarms.length > 0 && liveData.activeAlarms[0] !== 'OPTIMAL' ? (
        <div className="p-2.5 rounded-xl border border-rose-600/70 bg-rose-950/50 mb-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-rose-300">⚠ SURGICAL ALERTS:</span>
          {liveData.activeAlarms.map(alarm => (
            <span key={alarm} className={`text-[11px] px-2 py-0.5 rounded border font-semibold ${alarmBadgeColor(alarm)}`}>
              {alarm.replace(/_/g, ' ')}
            </span>
          ))}
        </div>
      ) : (
        <div className="p-2.5 rounded-xl border border-emerald-600/70 bg-emerald-950/40 mb-4 text-xs font-bold text-emerald-300">
          ✓ PERFUSION INTACT — Delta P &gt; 30 mmHg Across All Compartments
        </div>
      )}

      {/* Main Grid: Cross-Section Anatomy (Center) + Manometer (Left) + Surgical Deck (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Left Column: Intracompartmental Manometry Controls */}
        <div className="border border-slate-800 rounded-2xl bg-slate-900/70 p-4 space-y-4">
          <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
            Stryker Needle Manometer (ICP)
          </h2>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Diastolic Blood Pressure (DBP):</span>
              <span className="font-bold text-white">{params.dbpMmHg} mmHg</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Worst Intracompartmental Pressure:</span>
              <span className={`font-bold ${liveData.worstAbsoluteIcpMmHg >= 30 ? 'text-rose-400' : 'text-cyan-300'}`}>
                {liveData.worstAbsoluteIcpMmHg} mmHg (Normal 0–8)
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Critical Perfusion Delta P (DBP - ICP):</span>
              <span className={`font-bold ${liveData.worstDeltaPMmHg <= 30 ? 'text-rose-400 font-black' : 'text-emerald-400'}`}>
                {liveData.worstDeltaPMmHg} mmHg {liveData.worstDeltaPMmHg <= 30 && '(CRITICAL &le;30)'}
              </span>
            </div>
          </div>

          {params.region === 'LOWER_LEG_4_COMPARTMENT' ? (
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Anterior Compartment:</span>
                  <span className="font-bold text-cyan-400">{params.anteriorPressureMmHg} mmHg</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="80"
                  value={params.anteriorPressureMmHg}
                  onChange={e => setParams(p => ({ ...p, anteriorPressureMmHg: Number(e.target.value) }))}
                  className="w-full accent-cyan-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Lateral Compartment:</span>
                  <span className="font-bold text-cyan-400">{params.lateralPressureMmHg} mmHg</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="80"
                  value={params.lateralPressureMmHg}
                  onChange={e => setParams(p => ({ ...p, lateralPressureMmHg: Number(e.target.value) }))}
                  className="w-full accent-cyan-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Deep Posterior Compartment:</span>
                  <span className="font-bold text-cyan-400">{params.deepPostPressureMmHg} mmHg</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="80"
                  value={params.deepPostPressureMmHg}
                  onChange={e => setParams(p => ({ ...p, deepPostPressureMmHg: Number(e.target.value) }))}
                  className="w-full accent-cyan-500"
                />
              </div>
            </div>
          ) : (
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Forearm Volar Pressure:</span>
                <span className="font-bold text-cyan-400">{params.forearmVolarPressureMmHg} mmHg</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                value={params.forearmVolarPressureMmHg}
                onChange={e => setParams(p => ({ ...p, forearmVolarPressureMmHg: Number(e.target.value) }))}
                className="w-full accent-cyan-500"
              />
            </div>
          )}

          {/* Pitfall Alert: Limb Elevation */}
          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={toggleLegElevation}
              className={`w-full text-xs p-2 rounded-lg border font-semibold flex justify-between items-center transition ${
                params.legElevatedAboveHeart
                  ? 'bg-rose-950 border-rose-500 text-rose-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Limb Elevated Above Heart (PITFALL)</span>
              <span className="text-[10px]">{params.legElevatedAboveHeart ? '⚠ ELEVATED (-15 DBP)' : 'AT HEART LEVEL'}</span>
            </button>
            <p className="text-[10px] text-slate-500 mt-1">
              Elevating limb decreases arterial hydrostatic head pressure, worsening tissue ischemia. Keep limb strictly at heart level.
            </p>
          </div>
        </div>

        {/* Center Column: Cross-Sectional Compartment Visualizer SVG */}
        <div className="border border-slate-800 rounded-2xl bg-slate-900/70 p-4 flex flex-col items-center justify-between">
          <div className="w-full flex justify-between items-center mb-2 text-xs">
            <span className="text-slate-400 font-mono">ANATOMICAL CROSS-SECTION</span>
            <span className={`font-bold ${liveData.fasciotomyState.completeDecompressionAchieved ? 'text-emerald-400' : liveData.acsDiagnosed ? 'text-rose-400 animate-pulse' : 'text-slate-300'}`}>
              {liveData.fasciotomyState.completeDecompressionAchieved ? 'DECOMPRESSED' : liveData.acsDiagnosed ? 'ISCHEMIC TENSION' : 'NORMAL'}
            </span>
          </div>

          {/* SVG Leg / Forearm Cross Section */}
          <div className="w-64 h-64 sm:w-72 sm:h-72 rounded-full border-2 border-slate-700 bg-slate-950 relative shadow-2xl flex items-center justify-center p-2">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {/* Outer Skin Envelope */}
              <circle cx="100" cy="100" r="92" fill="#1e1b4b" opacity="0.3" stroke="#475569" strokeWidth="3" />

              {/* Tibia Bone (Triangular) */}
              <polygon points="85,60 115,60 100,90" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
              <text x="100" y="75" textAnchor="middle" fill="#0f172a" fontSize="8" fontWeight="bold">TIBIA</text>

              {/* Fibula Bone (Small Circle) */}
              <circle cx="50" cy="115" r="12" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
              <text x="50" y="118" textAnchor="middle" fill="#0f172a" fontSize="7" fontWeight="bold">FIB</text>

              {/* Interosseous Membrane */}
              <line x1="90" y1="80" x2="60" y2="110" stroke="#94a3b8" strokeWidth="2" strokeDasharray="2 2" />

              {/* 1. Anterior Compartment */}
              <path
                d="M 60 55 Q 85 30 115 35 Q 110 60 85 60 Z"
                fill={params.anteriorPressureMmHg >= 30 ? '#ef4444' : '#0284c7'}
                opacity={params.anterolateralIncision ? 0.3 : 0.75}
                stroke="#38bdf8"
                strokeWidth="1.5"
              />
              <text x="90" y="48" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold">
                ANT ({params.anteriorPressureMmHg})
              </text>

              {/* 2. Lateral Compartment */}
              <path
                d="M 40 75 Q 30 110 40 135 Q 55 125 50 95 Z"
                fill={params.lateralPressureMmHg >= 30 ? '#ef4444' : '#0284c7'}
                opacity={params.anterolateralIncision ? 0.3 : 0.75}
                stroke="#38bdf8"
                strokeWidth="1.5"
              />
              <text x="35" y="105" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold">
                LAT
              </text>

              {/* 3. Deep Posterior Compartment */}
              <path
                d="M 65 110 Q 100 95 130 115 Q 110 145 75 140 Z"
                fill={params.deepPostPressureMmHg >= 30 ? '#ef4444' : '#0284c7'}
                opacity={params.posteromedialIncision ? 0.3 : 0.75}
                stroke="#38bdf8"
                strokeWidth="1.5"
              />
              <text x="100" y="125" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold">
                DEEP POST
              </text>

              {/* 4. Superficial Posterior (Calf) */}
              <path
                d="M 45 145 Q 100 185 155 145 Q 130 190 70 190 Z"
                fill={params.superficialPostPressureMmHg >= 30 ? '#ef4444' : '#0284c7'}
                opacity={params.posteromedialIncision ? 0.3 : 0.75}
                stroke="#38bdf8"
                strokeWidth="1.5"
              />
              <text x="100" y="170" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold">
                SUPERFICIAL POST
              </text>

              {/* Surgical Incision Overlays */}
              {params.anterolateralIncision && (
                <line x1="30" y1="50" x2="25" y2="120" stroke="#facc15" strokeWidth="4" strokeLinecap="round" />
              )}
              {params.posteromedialIncision && (
                <line x1="150" y1="90" x2="160" y2="160" stroke="#facc15" strokeWidth="4" strokeLinecap="round" />
              )}
            </svg>
          </div>

          <div className="mt-3 text-center text-xs text-slate-300 font-mono">
            {liveData.clinicalRecommendation}
          </div>
        </div>

        {/* Right Column: Surgical Interventions & Rhabdomyolysis Panel */}
        <div className="border border-slate-800 rounded-2xl bg-slate-900/70 p-4 space-y-4">
          <h2 className="text-xs font-bold text-yellow-400 uppercase tracking-wider">
            Surgical Decompression &amp; Systemic Resuscitation
          </h2>

          <div className="space-y-2">
            <button
              onClick={toggleBivalveCast}
              className={`w-full text-xs p-2 rounded-lg border font-semibold flex justify-between items-center transition ${
                params.castSplitBivalved
                  ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-600 text-slate-300'
              }`}
            >
              <span>1. Bivalve Circumferential Cast &amp; Dressing</span>
              <span className="text-[10px]">{params.castSplitBivalved ? '✓ BIVALVED (-50% ICP)' : 'BIVALVE'}</span>
            </button>

            {params.region === 'LOWER_LEG_4_COMPARTMENT' ? (
              <>
                <button
                  onClick={performAnterolateralFasciotomy}
                  disabled={params.anterolateralIncision}
                  className={`w-full text-xs p-2 rounded-lg border font-semibold flex justify-between items-center transition ${
                    params.anterolateralIncision
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 hover:border-yellow-500 text-slate-200'
                  }`}
                >
                  <span>2. Anterolateral Incision (Ant + Lat)</span>
                  <span className="text-[10px]">{params.anterolateralIncision ? '✓ COMPLETED' : 'INCISION'}</span>
                </button>

                <button
                  onClick={performPosteromedialFasciotomy}
                  disabled={params.posteromedialIncision}
                  className={`w-full text-xs p-2 rounded-lg border font-semibold flex justify-between items-center transition ${
                    params.posteromedialIncision
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 hover:border-yellow-500 text-slate-200'
                  }`}
                >
                  <span>3. Posteromedial Incision (Sup + Deep)</span>
                  <span className="text-[10px]">{params.posteromedialIncision ? '✓ COMPLETED' : 'INCISION'}</span>
                </button>
              </>
            ) : (
              <button
                onClick={performVolarFasciotomy}
                disabled={params.volarIncision}
                className={`w-full text-xs p-2 rounded-lg border font-semibold flex justify-between items-center transition ${
                  params.volarIncision
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 hover:border-yellow-500 text-slate-200'
                }`}
              >
                <span>Volar Curved Incision + Carpal Release</span>
                <span className="text-[10px]">{params.volarIncision ? '✓ COMPLETED' : 'INCISION'}</span>
              </button>
            )}
          </div>

          {/* Rhabdomyolysis & Muscle Viability Monitor */}
          <div className="pt-2 border-t border-slate-800 space-y-2 text-xs">
            <span className="font-bold text-slate-300 block uppercase tracking-wider">
              Post-Ischemia Rhabdomyolysis
            </span>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
              <div className="flex justify-between text-slate-400">
                <span>Creatine Kinase (CK):</span>
                <span className={`font-mono font-bold ${params.serumCreatineKinaseUPerL > 5000 ? 'text-rose-400' : 'text-amber-300'}`}>
                  {params.serumCreatineKinaseUPerL} U/L
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Muscle Viability (Color/Contractility):</span>
                <span className={`font-bold ${liveData.fasciotomyState.muscleViability === 'PINK_CONTRACTILE_BLEEDING' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {liveData.fasciotomyState.muscleViability.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>AKI / Rhabdo Risk:</span>
                <span className={`font-bold ${liveData.rhabdomyolysisSeverity === 'SEVERE_AKI_RISK' ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {liveData.rhabdomyolysisSeverity.replace(/_/g, ' ')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
