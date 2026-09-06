'use client';

import React, { useState, useEffect } from 'react';
import {
  computeDermoscopyState,
  DERMOSCOPY_PRESETS,
  DermoscopyInputParams,
  DermoscopyState,
  DermoscopyPresetId,
  DermoscopyLighting,
} from '@/.gemini/skills/DermoscopyEngine';

const DEFAULT_PARAMS: DermoscopyInputParams = {
  presetId: 'SUPERFICIAL_SPREADING_MELANOMA',
  lighting: 'POLARIZED_WHITE',
  magnification: '20X',
  caliperReticleVisible: true,
  immersionGelApplied: false,
  biopsyTypePerformed: 'NONE',
  topicalTherapyInitiated: false,
};

function alarmBadgeClass(alarm: string) {
  if (alarm === 'BENIGN_REASSURING' || alarm === 'SEBORRHEIC_KERATOSIS_BENIGN') {
    return 'bg-emerald-900/60 text-emerald-300 border-emerald-500/50';
  }
  if (alarm.includes('MELANOMA') || alarm.includes('BASAL_CELL') || alarm.includes('SUSPICIOUS')) {
    return 'bg-rose-900/70 text-rose-200 border-rose-500 animate-pulse';
  }
  return 'bg-amber-900/60 text-amber-200 border-amber-500/60';
}

export default function DermoscopySimulator() {
  const [selectedPreset, setSelectedPreset] = useState<DermoscopyPresetId>('SUPERFICIAL_SPREADING_MELANOMA');
  const [params, setParams] = useState<DermoscopyInputParams>(() => ({
    ...DEFAULT_PARAMS,
    ...DERMOSCOPY_PRESETS['SUPERFICIAL_SPREADING_MELANOMA'].initialState,
  }));
  const [liveData, setLiveData] = useState<DermoscopyState>(() =>
    computeDermoscopyState({ ...DEFAULT_PARAMS, ...DERMOSCOPY_PRESETS['SUPERFICIAL_SPREADING_MELANOMA'].initialState })
  );

  useEffect(() => {
    setLiveData(computeDermoscopyState(params));
  }, [params]);

  function loadPreset(id: DermoscopyPresetId) {
    setSelectedPreset(id);
    setParams({
      ...DEFAULT_PARAMS,
      ...DERMOSCOPY_PRESETS[id].initialState,
      presetId: id,
    });
  }

  function setLighting(mode: DermoscopyLighting) {
    setParams(p => ({ ...p, lighting: mode }));
  }

  function toggleReticle() {
    setParams(p => ({ ...p, caliperReticleVisible: !p.caliperReticleVisible }));
  }

  function toggleGel() {
    setParams(p => ({ ...p, immersionGelApplied: !p.immersionGelApplied }));
  }

  function performBiopsy(type: 'SHAVE' | 'PUNCH_4MM' | 'EXCISIONAL_2MM') {
    setParams(p => ({ ...p, biopsyTypePerformed: type }));
  }

  function initiateTopical() {
    setParams(p => ({ ...p, topicalTherapyInitiated: true }));
  }

  function openSocraticAI() {
    window.dispatchEvent(
      new CustomEvent('mediverse:open-ai-with-context', {
        detail: {
          module: 'Dermatology Dermoscopy & Wood\'s Lamp Examination',
          preset: DERMOSCOPY_PRESETS[selectedPreset].title,
          location: DERMOSCOPY_PRESETS[selectedPreset].lesionLocation,
          lighting: params.lighting,
          magnification: params.magnification,
          sevenPointScore: liveData.sevenPointScore,
          melanomaRisk: `${liveData.melanomaProbabilityPercent}%`,
          fluorescence: liveData.fluorescenceColorDescription,
          dominantStructures: liveData.dominantStructures,
          biopsyStatus: params.biopsyTypePerformed,
          activeAlarms: liveData.activeAlarms,
          recommendation: liveData.clinicalRecommendation,
        },
      })
    );
  }

  const isMelanoma = selectedPreset === 'SUPERFICIAL_SPREADING_MELANOMA';
  const isBcc = selectedPreset === 'NODULAR_BASAL_CELL_CARCINOMA';
  const isSebK = selectedPreset === 'SEBORRHEIC_KERATOSIS_BENIGN';
  const isErythrasma = selectedPreset === 'ERYTHRASMA_CORYNEBACTERIUM';
  const isVitiligo = selectedPreset === 'VITILIGO_DEPIGMENTATION';
  const isDysplastic = selectedPreset === 'DYSPLASTIC_NEVUS_ATYPICAL';
  const isWoodsLamp = params.lighting === 'WOODS_LAMP_365NM';

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen p-4 md:p-6 font-mono">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black text-amber-400 tracking-tight">
              DERMATOLOGY — Dermoscopy &amp; Wood&apos;s Lamp Workstation
            </h1>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                liveData.sevenPointScore >= 5
                  ? 'border-rose-500 bg-rose-950/70 text-rose-300 animate-pulse'
                  : liveData.activeAlarms.includes('BASAL_CELL_CARCINOMA_SUSPECTED')
                  ? 'border-amber-500 bg-amber-950/70 text-amber-300'
                  : 'border-emerald-500 bg-emerald-950/60 text-emerald-300'
              }`}
            >
              {isMelanoma
                ? `7-Point: ${liveData.sevenPointScore} (Melanoma Risk: ${liveData.melanomaProbabilityPercent}%)`
                : isBcc
                ? 'BCC: Arborizing Telangiectasia'
                : isErythrasma
                ? 'Wood\'s: Coral-Pink Coproporphyrin III'
                : isVitiligo
                ? 'Wood\'s: Chalky-White Amelanosis'
                : 'Benign Seborrheic Keratosis'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Polarized &amp; Non-Polarized Optical Cross-Polarization | 365 nm UVA Wood&apos;s Fluorescence | Argenziano 7-Point Scoring
          </p>
        </div>

        <button
          onClick={openSocraticAI}
          className="self-start md:self-auto px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-lg transition border border-amber-400/40 flex items-center gap-2"
        >
          <span>✨</span> Ask Socratic AI Tutor
        </button>
      </div>

      {/* Preset Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-4">
        {Object.values(DERMOSCOPY_PRESETS).map(p => (
          <button
            key={p.id}
            onClick={() => loadPreset(p.id)}
            className={`p-2.5 rounded-lg border text-left transition ${
              selectedPreset === p.id
                ? 'border-amber-500 bg-amber-950/80 text-white shadow-md'
                : 'border-slate-800 bg-slate-900/60 hover:border-slate-600 text-slate-300'
            }`}
          >
            <span className="text-[10px] block font-mono text-amber-400 font-bold truncate">
              {p.id === 'SUPERFICIAL_SPREADING_MELANOMA'
                ? 'Malignant Melanoma'
                : p.id === 'NODULAR_BASAL_CELL_CARCINOMA'
                ? 'Basal Cell Carcinoma'
                : p.id === 'SEBORRHEIC_KERATOSIS_BENIGN'
                ? 'Seborrheic Keratosis'
                : p.id === 'ERYTHRASMA_CORYNEBACTERIUM'
                ? 'Erythrasma (Corynebacterium)'
                : p.id === 'VITILIGO_DEPIGMENTATION'
                ? 'Vitiligo (Autoimmune)'
                : 'Dysplastic Nevus'}
            </span>
            <p className="text-xs font-semibold mt-0.5 line-clamp-1">{p.title}</p>
          </button>
        ))}
      </div>

      {/* Active Alarm Banner */}
      {liveData.activeAlarms.length > 0 && liveData.activeAlarms[0] !== 'BENIGN_REASSURING' ? (
        <div className="p-2.5 rounded-xl border border-rose-600/70 bg-rose-950/50 mb-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-rose-300">⚠ DERMATOLOGICAL ALERTS:</span>
          {liveData.activeAlarms.map(alarm => (
            <span key={alarm} className={`text-[11px] px-2 py-0.5 rounded border font-semibold ${alarmBadgeClass(alarm)}`}>
              {alarm.replace(/_/g, ' ')}
            </span>
          ))}
        </div>
      ) : (
        <div className="p-2.5 rounded-xl border border-emerald-600/70 bg-emerald-950/40 mb-4 text-xs font-bold text-emerald-300">
          ✓ BENIGN LESION — Classic Seborrheic Keratosis (Milia Cysts &amp; Comedo Openings)
        </div>
      )}

      {/* Main Simulation Viewport: 3-Column Console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Left Column: Dermatoscope Optical & Filter Controls */}
        <div className="border border-slate-800 rounded-2xl bg-slate-900/70 p-4 space-y-4">
          <h2 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            Dermatoscope Optical Controls
          </h2>

          {/* Illumination Light Mode */}
          <div>
            <span className="text-xs text-slate-400 block mb-1">Illumination Lighting Mode:</span>
            <div className="grid grid-cols-3 gap-1.5">
              {(
                [
                  { id: 'POLARIZED_WHITE', label: 'Polarized' },
                  { id: 'NON_POLARIZED_IMMERSION', label: 'Contact Oil' },
                  { id: 'WOODS_LAMP_365NM', label: 'Wood\'s 365nm' },
                ] as { id: DermoscopyLighting; label: string }[]
              ).map(mode => (
                <button
                  key={mode.id}
                  onClick={() => setLighting(mode.id)}
                  className={`text-[11px] py-1.5 px-2 rounded-lg border font-semibold truncate ${
                    params.lighting === mode.id
                      ? 'bg-amber-950 border-amber-500 text-amber-200'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          {/* Magnification */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Optical Magnification:</span>
              <span className="font-bold text-amber-300">{params.magnification}</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {(['10X', '20X', '30X', '40X'] as const).map(mag => (
                <button
                  key={mag}
                  onClick={() => setParams(p => ({ ...p, magnification: mag }))}
                  className={`text-xs py-1 rounded border font-semibold ${
                    params.magnification === mag
                      ? 'bg-amber-950 border-amber-500 text-amber-300'
                      : 'border-slate-800 bg-slate-950 text-slate-400'
                  }`}
                >
                  {mag}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300">Caliper Reticle (0.1 mm):</span>
              <button
                onClick={toggleReticle}
                className={`text-xs px-2.5 py-1 rounded border font-semibold ${
                  params.caliperReticleVisible
                    ? 'bg-amber-950 border-amber-500 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                {params.caliperReticleVisible ? '✓ RETICLE ON' : 'OFF'}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300">Immersion Interface Gel:</span>
              <button
                onClick={toggleGel}
                className={`text-xs px-2.5 py-1 rounded border font-semibold ${
                  params.immersionGelApplied
                    ? 'bg-cyan-950 border-cyan-500 text-cyan-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                {params.immersionGelApplied ? '✓ GEL APPLIED' : 'APPLY GEL'}
              </button>
            </div>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1 text-xs">
            <span className="text-slate-400 font-bold block">Clinical Lesion Context:</span>
            <p className="text-slate-300 text-[11px]">{DERMOSCOPY_PRESETS[selectedPreset].clinicalDescription}</p>
            <p className="text-amber-400/80 text-[10px] mt-1">{DERMOSCOPY_PRESETS[selectedPreset].lesionLocation}</p>
          </div>
        </div>

        {/* Center Column: Dermatoscope Circular Eyepiece Viewport (SVG) */}
        <div className="border border-slate-800 rounded-2xl bg-slate-900/70 p-4 flex flex-col items-center justify-between">
          <div className="w-full flex justify-between items-center mb-2 text-xs">
            <span className="text-slate-400 font-mono">OPTICAL DERMATOSCOPE VIEW</span>
            <span className="text-amber-400 font-bold">
              {params.lighting === 'WOODS_LAMP_365NM'
                ? 'WOOD\'S LAMP (365 nm UVA)'
                : params.lighting === 'POLARIZED_WHITE'
                ? 'POLARIZED NON-CONTACT'
                : 'NON-POLARIZED IMMERSION'}
            </span>
          </div>

          {/* Circular Bezel Viewport */}
          <div
            className={`w-64 h-64 sm:w-72 sm:h-72 rounded-full overflow-hidden border-4 border-slate-700 relative shadow-2xl flex items-center justify-center ${
              isWoodsLamp ? 'bg-indigo-950' : 'bg-amber-100/10'
            }`}
          >
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {/* Normal Skin Background Tone */}
              <circle cx="100" cy="100" r="95" fill={isWoodsLamp ? '#1e1b4b' : '#f5d0b5'} opacity="0.9" />

              {/* 1. Malignant Melanoma Pattern */}
              {isMelanoma && !isWoodsLamp && (
                <g>
                  {/* Asymmetric Pigmented Island */}
                  <path
                    d="M 60 70 Q 110 50 145 75 Q 165 110 135 145 Q 95 155 65 130 Q 45 100 60 70 Z"
                    fill="#3b2219"
                    opacity="0.9"
                  />
                  {/* Blue-white veil center */}
                  <ellipse cx="105" cy="100" rx="30" ry="22" fill="#64748b" opacity="0.75" />
                  {/* Atypical Network (irregular cross-hatches) */}
                  <path
                    d="M 70 85 L 140 85 M 65 115 L 145 115 M 85 65 L 85 140 M 120 70 L 120 145"
                    stroke="#1c120c"
                    strokeWidth="1.8"
                    strokeDasharray="4 2"
                  />
                  {/* Peripheral Radial Streaming & Pseudopods at 2 and 5 o'clock */}
                  <circle cx="145" cy="72" r="4" fill="#1c120c" />
                  <circle cx="155" cy="80" r="3.5" fill="#1c120c" />
                  <circle cx="140" cy="148" r="4" fill="#1c120c" />
                  <circle cx="128" cy="155" r="3" fill="#1c120c" />
                  {/* Polymorphic vessels (dotted & corkscrew red) */}
                  <circle cx="95" cy="92" r="1.5" fill="#dc2626" />
                  <circle cx="105" cy="112" r="1.5" fill="#dc2626" />
                  <path d="M 115 95 Q 120 100 118 105 T 122 110" fill="none" stroke="#dc2626" strokeWidth="1.2" />
                </g>
              )}

              {/* 2. Basal Cell Carcinoma (BCC) Pattern */}
              {isBcc && !isWoodsLamp && (
                <g>
                  {/* Pearly Translucent Papule */}
                  <ellipse cx="100" cy="100" rx="65" ry="55" fill="#fde68a" opacity="0.3" stroke="#fcd34d" strokeWidth="1.5" />
                  {/* Blue-gray ovoid nests */}
                  <ellipse cx="75" cy="85" rx="14" ry="10" fill="#475569" opacity="0.85" />
                  <circle cx="130" cy="120" r="9" fill="#475569" opacity="0.85" />
                  <circle cx="138" cy="85" r="7" fill="#475569" opacity="0.85" />
                  {/* Central Ulceration / Crusting */}
                  <ellipse cx="100" cy="102" rx="15" ry="10" fill="#7f1d1d" opacity="0.9" />
                  {/* Branching Arborizing Telangiectasias */}
                  <path
                    d="M 60 135 Q 80 115 95 105 T 125 75 M 95 105 Q 105 125 115 140 M 80 115 Q 75 95 85 85"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                  {/* Shiny white crystalline lines under polarized light */}
                  {params.lighting === 'POLARIZED_WHITE' && (
                    <path
                      d="M 85 95 L 115 95 M 90 110 L 110 110 M 100 85 L 100 115"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                      opacity="0.8"
                    />
                  )}
                </g>
              )}

              {/* 3. Seborrheic Keratosis Pattern */}
              {isSebK && !isWoodsLamp && (
                <g>
                  {/* Stuck-on Verrucous Plaque with Cerebriform Fissures */}
                  <ellipse cx="100" cy="100" rx="68" ry="60" fill="#78350f" opacity="0.85" />
                  {/* Cerebriform Sulci (Gyri and Sulci) */}
                  <path
                    d="M 65 80 Q 85 100 65 120 M 135 80 Q 115 100 135 120 M 90 60 Q 100 90 90 140 M 110 60 Q 100 90 110 140"
                    fill="none"
                    stroke="#451a03"
                    strokeWidth="3"
                  />
                  {/* Milia-like cysts (Starry sky) */}
                  <circle cx="85" cy="85" r="3.5" fill="#fef08a" opacity="0.9" stroke="#fff" strokeWidth="0.5" />
                  <circle cx="115" cy="80" r="3" fill="#fef08a" opacity="0.9" stroke="#fff" strokeWidth="0.5" />
                  <circle cx="100" cy="125" r="4" fill="#fef08a" opacity="0.9" stroke="#fff" strokeWidth="0.5" />
                  <circle cx="75" cy="110" r="2.5" fill="#fef08a" opacity="0.9" stroke="#fff" strokeWidth="0.5" />
                  {/* Comedo-like crypt openings */}
                  <circle cx="95" cy="72" r="3.5" fill="#1c1917" />
                  <circle cx="120" cy="110" r="3.5" fill="#1c1917" />
                  <circle cx="80" cy="130" r="3" fill="#1c1917" />
                </g>
              )}

              {/* 4. Erythrasma under Wood's Lamp (Coral-Pink Coproporphyrin III) */}
              {isErythrasma && (
                <g>
                  {isWoodsLamp ? (
                    <ellipse
                      cx="100"
                      cy="100"
                      rx="65"
                      ry="55"
                      fill="#f43f5e"
                      opacity="0.85"
                      stroke="#fb7185"
                      strokeWidth="3"
                      className="animate-pulse"
                    />
                  ) : (
                    <ellipse cx="100" cy="100" rx="65" ry="55" fill="#b45309" opacity="0.4" stroke="#92400e" strokeWidth="1" />
                  )}
                  {isWoodsLamp && (
                    <text x="100" y="105" fill="#fff" fontSize="10" textAnchor="middle" fontWeight="bold">
                      CORAL-PINK FLUORESCENCE
                    </text>
                  )}
                </g>
              )}

              {/* 5. Vitiligo under Wood's Lamp (Chalky-White Amelanosis) */}
              {isVitiligo && (
                <g>
                  {isWoodsLamp ? (
                    <path
                      d="M 50 90 Q 75 60 115 65 Q 155 75 145 120 Q 120 150 75 140 Q 40 125 50 90 Z"
                      fill="#ffffff"
                      opacity="0.95"
                      stroke="#38bdf8"
                      strokeWidth="2.5"
                    />
                  ) : (
                    <path
                      d="M 50 90 Q 75 60 115 65 Q 155 75 145 120 Q 120 150 75 140 Q 40 125 50 90 Z"
                      fill="#f8fafc"
                      opacity="0.6"
                      stroke="#e2e8f0"
                      strokeWidth="1.5"
                    />
                  )}
                  {/* Leukotrichia: white hair follicles */}
                  <line x1="85" y1="80" x2="75" y2="65" stroke="#fff" strokeWidth="1.5" />
                  <line x1="120" y1="95" x2="135" y2="85" stroke="#fff" strokeWidth="1.5" />
                  <line x1="95" y1="125" x2="90" y2="145" stroke="#fff" strokeWidth="1.5" />
                  {isWoodsLamp && (
                    <text x="100" y="105" fill="#0f172a" fontSize="10" textAnchor="middle" fontWeight="bold">
                      CHALKY-WHITE
                    </text>
                  )}
                </g>
              )}

              {/* 6. Dysplastic Nevus Pattern */}
              {isDysplastic && !isWoodsLamp && (
                <g>
                  {/* Central Fried-Egg Elevated Island */}
                  <ellipse cx="100" cy="100" rx="55" ry="48" fill="#a16207" opacity="0.75" />
                  <ellipse cx="98" cy="98" rx="28" ry="24" fill="#451a03" opacity="0.9" />
                  {/* Delicate Peripheral Reticular Network */}
                  <ellipse
                    cx="100"
                    cy="100"
                    rx="62"
                    ry="54"
                    fill="none"
                    stroke="#78350f"
                    strokeWidth="1.5"
                    strokeDasharray="3 2"
                  />
                </g>
              )}

              {/* Caliper Reticle Overlay */}
              {params.caliperReticleVisible && (
                <g opacity="0.75">
                  <line x1="20" y1="100" x2="180" y2="100" stroke="#38bdf8" strokeWidth="0.8" />
                  <line x1="100" y1="20" x2="100" y2="180" stroke="#38bdf8" strokeWidth="0.8" />
                  {/* Metric tick marks along horizontal diameter */}
                  {[40, 60, 80, 100, 120, 140, 160].map(x => (
                    <line key={x} x1={x} y1="96" x2={x} y2="104" stroke="#38bdf8" strokeWidth="1" />
                  ))}
                  <text x="175" y="95" fill="#38bdf8" fontSize="7">mm</text>
                </g>
              )}
            </svg>
          </div>

          <div className="mt-3 text-center text-xs text-slate-300 font-mono">
            {isWoodsLamp
              ? DERMOSCOPY_PRESETS[selectedPreset].woodsLampAppearance
              : DERMOSCOPY_PRESETS[selectedPreset].dermoscopicHallmarks}
          </div>
        </div>

        {/* Right Column: 7-Point Scoring & Diagnostic Biopsy Deck */}
        <div className="border border-slate-800 rounded-2xl bg-slate-900/70 p-4 space-y-4">
          <h2 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            Diagnostic Scoring &amp; Biopsy Action Deck
          </h2>

          {/* Argenziano 7-Point Score Display */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Argenziano 7-Point Score:</span>
              <span
                className={`font-mono font-bold text-sm ${
                  liveData.sevenPointScore >= 5
                    ? 'text-rose-400'
                    : liveData.sevenPointScore >= 3
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {liveData.sevenPointScore} / 10
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Calculated Melanoma Risk:</span>
              <span className="font-bold text-slate-200">{liveData.melanomaProbabilityPercent}%</span>
            </div>
          </div>

          {/* Dominant Dermoscopic Structures */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1 text-xs">
            <span className="text-slate-400 font-bold block mb-1">Key Dermoscopic Structures:</span>
            {liveData.dominantStructures.map((struct, idx) => (
              <div key={idx} className="text-slate-300 text-[11px] flex items-center gap-1.5">
                <span className="text-amber-400">&bull;</span>
                <span>{struct}</span>
              </div>
            ))}
          </div>

          {/* Wood's Lamp Fluorescence Box */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1 text-xs">
            <span className="text-slate-400 font-bold block">Wood&apos;s Lamp (365 nm) Fluorescence:</span>
            <p className="text-cyan-300 text-[11px] font-semibold">{liveData.fluorescenceColorDescription}</p>
          </div>

          {/* Biopsy & Therapeutic Actions */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <span className="text-[11px] font-bold text-amber-400 block uppercase">
              Clinical Procedures &amp; Management
            </span>

            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => performBiopsy('EXCISIONAL_2MM')}
                className={`text-xs p-2 rounded-lg border font-semibold truncate ${
                  params.biopsyTypePerformed === 'EXCISIONAL_2MM'
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-600'
                }`}
              >
                Excisional Biopsy (2mm)
              </button>
              <button
                onClick={() => performBiopsy('PUNCH_4MM')}
                className={`text-xs p-2 rounded-lg border font-semibold truncate ${
                  params.biopsyTypePerformed === 'PUNCH_4MM'
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-600'
                }`}
              >
                4 mm Punch Biopsy
              </button>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => performBiopsy('SHAVE')}
                className={`text-xs p-2 rounded-lg border font-semibold truncate ${
                  params.biopsyTypePerformed === 'SHAVE'
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-600'
                }`}
              >
                Saucerization Shave
              </button>
              <button
                onClick={initiateTopical}
                className={`text-xs p-2 rounded-lg border font-semibold truncate ${
                  params.topicalTherapyInitiated
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-600'
                }`}
              >
                Topical Therapy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
