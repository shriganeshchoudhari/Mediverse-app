'use client';

import React, { useState, useEffect } from 'react';
import {
  computeGIEndoscopyState,
  GI_ENDOSCOPY_PRESETS,
  GIEndoscopyInputParams,
  GIEndoscopyState,
  PresetId,
  EndoscopicZone,
} from '@/.gemini/skills/GIEndoscopyEngine';

const DEFAULT_PARAMS: GIEndoscopyInputParams = {
  presetId: 'BLEEDING_DUODENAL_ULCER_FORREST_IA',
  scopeInsertionDepthCm: 60,
  cameraRetroflexion: false,
  activeTool: 'NONE',
  epinephrineInjected: false,
  clipsDeployedCount: 0,
  bandsDeployedCount: 0,
  octreotideInfusionActive: false,
  ivPpiBolusGiven: true,
  ercpWireEngagement: 'NOT_ENGAGED',
  sphincterotomyApplied: false,
  rectalIndomethacinGiven: false,
  prophylacticPancreaticStent: false,
  balloonTrawlDone: false,
  biliaryStentDeployed: false,
  patientAge: 64,
  sbpMmHg: 92,
  hrBpm: 124,
  hemoglobinGdL: 7.4,
  bloodInStomachMl: 600,
};

function alarmBadgeColor(alarm: string) {
  if (alarm === 'OPTIMAL') return 'bg-emerald-900/60 text-emerald-300 border-emerald-500/50';
  if (alarm.includes('SPURTING') || alarm.includes('EXSANGUINATION') || alarm.includes('FORREST_I')) {
    return 'bg-rose-900/70 text-rose-200 border-rose-500 animate-pulse';
  }
  return 'bg-amber-900/60 text-amber-200 border-amber-500/60';
}

export default function GIEndoscopySimulator() {
  const [selectedPreset, setSelectedPreset] = useState<PresetId>('BLEEDING_DUODENAL_ULCER_FORREST_IA');
  const [params, setParams] = useState<GIEndoscopyInputParams>(() => ({
    ...DEFAULT_PARAMS,
    ...GI_ENDOSCOPY_PRESETS['BLEEDING_DUODENAL_ULCER_FORREST_IA'].initialState,
  }));
  const [liveData, setLiveData] = useState<GIEndoscopyState>(() =>
    computeGIEndoscopyState({ ...DEFAULT_PARAMS, ...GI_ENDOSCOPY_PRESETS['BLEEDING_DUODENAL_ULCER_FORREST_IA'].initialState })
  );

  useEffect(() => {
    setLiveData(computeGIEndoscopyState(params));
  }, [params]);

  function loadPreset(id: PresetId) {
    setSelectedPreset(id);
    setParams({
      ...DEFAULT_PARAMS,
      ...GI_ENDOSCOPY_PRESETS[id].initialState,
      presetId: id,
    });
  }

  // Hemostasis Actions
  function injectEpinephrine() {
    setParams(p => ({ ...p, epinephrineInjected: true }));
  }

  function deployClip() {
    setParams(p => ({ ...p, clipsDeployedCount: p.clipsDeployedCount + 1, activeTool: 'HEMOCLIP' }));
  }

  function deployBand() {
    setParams(p => ({ ...p, bandsDeployedCount: p.bandsDeployedCount + 1, activeTool: 'BAND_LIGATOR' }));
  }

  function toggleOctreotide() {
    setParams(p => ({ ...p, octreotideInfusionActive: !p.octreotideInfusionActive }));
  }

  // ERCP Actions
  function engageBileDuct() {
    setParams(p => ({ ...p, ercpWireEngagement: 'COMMON_BILE_DUCT' }));
  }

  function engagePancreaticDuct() {
    setParams(p => ({ ...p, ercpWireEngagement: 'PANCREATIC_DUCT' }));
  }

  function performSphincterotomy() {
    setParams(p => ({ ...p, sphincterotomyApplied: true }));
  }

  function performBalloonExtraction() {
    setParams(p => ({ ...p, balloonTrawlDone: true }));
  }

  function giveRectalIndomethacin() {
    setParams(p => ({ ...p, rectalIndomethacinGiven: true }));
  }

  function deployBiliaryStent() {
    setParams(p => ({ ...p, biliaryStentDeployed: true }));
  }

  function openSocraticAI() {
    window.dispatchEvent(
      new CustomEvent('mediverse:open-ai-with-context', {
        detail: {
          module: 'Upper GI Endoscopy (EGD) & ERCP',
          preset: GI_ENDOSCOPY_PRESETS[selectedPreset].title,
          currentZone: liveData.currentZone,
          depthCm: `${params.scopeInsertionDepthCm} cm`,
          forrestGrade: liveData.forrestGrade,
          varicealGrade: liveData.varicealGrade,
          rebleedingRisk: `${liveData.rebleedingRiskPct}%`,
          hemostasisAchieved: liveData.hemostasisAchieved,
          rockallScore: `${liveData.rockall.totalScore}/11`,
          gbsScore: liveData.gbsScore,
          ercpStatus: liveData.ercp,
          activeAlarms: liveData.activeAlarms,
        },
      })
    );
  }

  // Endoscopic Viewport SVG Rendering Helpers
  const isBleedingUlcer = selectedPreset === 'BLEEDING_DUODENAL_ULCER_FORREST_IA' || selectedPreset === 'GASTRIC_ANTRAL_ULCER_FORREST_IIA';
  const isVarices = selectedPreset === 'ESOPHAGEAL_VARICEAL_HEMORRHAGE';
  const isERCP = selectedPreset === 'CHOLEDOCHOLITHIASIS_ERCP_SPHINCTEROTOMY' || selectedPreset === 'MALIGNANT_BILIARY_OBSTRUCTION_STENTING';

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen p-4 md:p-6 font-mono">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black text-amber-400 tracking-tight">
              INTERVENTIONAL ENDOSCOPY &amp; ERCP WORKSTATION
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold border border-amber-500/50 bg-amber-950/60 text-amber-300">
              {liveData.currentZone.replace(/_/g, ' ')} ({params.scopeInsertionDepthCm} cm)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Peptic Ulcer Forrest Classification | Dual Hemostasis | Variceal Band Ligation | ERCP Biliary Cannulation &amp; Sphincterotomy
          </p>
        </div>

        <button
          onClick={openSocraticAI}
          className="self-start md:self-auto px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white shadow-lg transition border border-amber-400/40 flex items-center gap-2"
        >
          <span>✨</span> Ask Socratic AI Tutor
        </button>
      </div>

      {/* Preset Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-4">
        {Object.values(GI_ENDOSCOPY_PRESETS).map(p => (
          <button
            key={p.id}
            onClick={() => loadPreset(p.id)}
            className={`p-2.5 rounded-lg border text-left transition ${
              selectedPreset === p.id
                ? 'border-amber-500 bg-amber-950/80 text-white shadow-md'
                : 'border-slate-800 bg-slate-900/60 hover:border-slate-600 text-slate-300'
            }`}
          >
            <span className="text-[10px] block font-mono text-amber-400 font-bold truncate">{p.forrestOrVarices}</span>
            <p className="text-xs font-semibold mt-0.5 line-clamp-1">{p.title}</p>
          </button>
        ))}
      </div>

      {/* Active Alarm Banner */}
      {liveData.activeAlarms.length > 0 && liveData.activeAlarms[0] !== 'OPTIMAL' ? (
        <div className="p-2.5 rounded-xl border border-rose-600/70 bg-rose-950/50 mb-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-rose-300">⚠ ACTIVE CLINICAL ALERTS:</span>
          {liveData.activeAlarms.map(alarm => (
            <span key={alarm} className={`text-[11px] px-2 py-0.5 rounded border font-semibold ${alarmBadgeColor(alarm)}`}>
              {alarm.replace(/_/g, ' ')}
            </span>
          ))}
        </div>
      ) : (
        <div className="p-2.5 rounded-xl border border-emerald-600/70 bg-emerald-950/40 mb-4 text-xs font-bold text-emerald-300">
          ✓ ENDOSCOPIC HEMOSTASIS &amp; DUCT CLEARANCE VERIFIED — Low Rebleeding / Stable Flow
        </div>
      )}

      {/* Main Grid: Endoscopy Viewport (Center) & Procedural Decks (Left & Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Left Column: Scope Navigation & Kinematics */}
        <div className="border border-slate-800 rounded-2xl bg-slate-900/70 p-4 space-y-4">
          <h2 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Endoscope Kinematics &amp; Depth</h2>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Insertion Depth:</span>
              <span className="font-bold text-cyan-400">{params.scopeInsertionDepthCm} cm</span>
            </div>
            <input
              type="range"
              min="15"
              max="75"
              value={params.scopeInsertionDepthCm}
              onChange={e => setParams(p => ({ ...p, scopeInsertionDepthCm: Number(e.target.value) }))}
              className="w-full accent-cyan-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
              <span>UES (15 cm)</span>
              <span>GEJ (40 cm)</span>
              <span>Pylorus (55 cm)</span>
              <span>D2 Papilla (70 cm)</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={() => setParams(p => ({ ...p, cameraRetroflexion: !p.cameraRetroflexion }))}
              className={`w-full text-xs py-2 px-3 rounded-lg border font-semibold flex justify-between items-center transition ${
                params.cameraRetroflexion
                  ? 'bg-cyan-950 border-cyan-500 text-cyan-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>J-Maneuver (Gastric Retroflexion)</span>
              <span className="text-[10px]">{params.cameraRetroflexion ? '✓ RETROFLEXED' : 'STANDARD'}</span>
            </button>
          </div>

          {/* Clinical Risk Scores Panel */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-300 block uppercase tracking-wider">
              Upper GI Bleeding Stratification
            </span>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Rockall Score (0–11):</span>
                <span className={`font-bold ${liveData.rockall.totalScore >= 5 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {liveData.rockall.totalScore} / 11 {liveData.rockall.totalScore >= 5 ? '(High Risk >5)' : '(Low Risk)'}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Glasgow-Blatchford Score (GBS):</span>
                <span className={`font-bold ${liveData.gbsScore >= 6 ? 'text-rose-400' : 'text-amber-400'}`}>
                  {liveData.gbsScore} / 23 {liveData.gbsScore >= 6 ? '(Endoscopic Rx Indicated)' : ''}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Predicted Rebleeding Rate:</span>
                <span className={`font-bold ${liveData.rebleedingRiskPct > 30 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {liveData.rebleedingRiskPct}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Column: High-Definition Endoscopic Viewport SVG */}
        <div className="border border-slate-800 rounded-2xl bg-slate-900/70 p-4 flex flex-col items-center justify-between">
          <div className="w-full flex justify-between items-center mb-2 text-xs">
            <span className="text-slate-400 font-mono">OPTICAL ENDOCAM 4K</span>
            <span className={`font-bold ${liveData.hemostasisAchieved ? 'text-emerald-400' : liveData.activeHemorrhage ? 'text-rose-500 animate-pulse' : 'text-slate-300'}`}>
              {liveData.hemostasisAchieved ? '● HEMOSTASIS VERIFIED' : liveData.activeHemorrhage ? '● ACTIVE HEMORRHAGE' : '● STABLE VIEW'}
            </span>
          </div>

          {/* Circular Endoscopic Aperture */}
          <div className="w-64 h-64 sm:w-72 sm:h-72 rounded-full overflow-hidden border-4 border-slate-700 bg-black relative shadow-2xl flex items-center justify-center">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {/* Circular Mucosal Cavity Gradient */}
              <defs>
                <radialGradient id="mucosaGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#881337" stopOpacity="0.4" />
                  <stop offset="70%" stopColor="#4c0519" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#1e0208" stopOpacity="1" />
                </radialGradient>
              </defs>
              <circle cx="100" cy="100" r="100" fill="url(#mucosaGlow)" />

              {/* Mucosal Folds */}
              <path d="M 20 60 Q 100 110 180 60" fill="none" stroke="#be123c" strokeWidth="6" opacity="0.6" strokeLinecap="round" />
              <path d="M 10 120 Q 100 160 190 120" fill="none" stroke="#be123c" strokeWidth="7" opacity="0.6" strokeLinecap="round" />
              <path d="M 40 160 Q 100 180 160 160" fill="none" stroke="#9f1239" strokeWidth="5" opacity="0.5" strokeLinecap="round" />

              {/* Pathology Overlay: Bleeding Ulcer */}
              {isBleedingUlcer && (
                <g>
                  {/* Ulcer crater */}
                  <ellipse cx="100" cy="95" rx="32" ry="24" fill="#450a0a" stroke="#fca5a5" strokeWidth="2" />
                  <ellipse cx="100" cy="95" rx="26" ry="18" fill="#7f1d1d" opacity="0.8" />

                  {/* Visible vessel mound */}
                  <circle cx="100" cy="95" r="7" fill="#b91c1c" stroke="#f87171" strokeWidth="1.5" />

                  {/* Active arterial spurt animation if not clipped */}
                  {liveData.activeHemorrhage && (
                    <g>
                      <path d="M 100 95 Q 85 45 65 30" fill="none" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" opacity="0.9" />
                      <circle cx="65" cy="30" r="4" fill="#dc2626" />
                      <path d="M 100 95 Q 115 50 135 35" fill="none" stroke="#dc2626" strokeWidth="3" opacity="0.8" />
                    </g>
                  )}

                  {/* Deployed Hemoclips */}
                  {params.clipsDeployedCount > 0 && (
                    <g>
                      <line x1="90" y1="88" x2="110" y2="102" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" />
                      <circle cx="100" cy="95" r="3" fill="#38bdf8" />
                      {params.clipsDeployedCount >= 2 && (
                        <line x1="108" y1="88" x2="92" y2="102" stroke="#cbd5e1" strokeWidth="3.5" strokeLinecap="round" />
                      )}
                    </g>
                  )}
                </g>
              )}

              {/* Pathology Overlay: Esophageal Varices */}
              {isVarices && (
                <g>
                  {/* Serpentine Columnar Blue Varices */}
                  <path d="M 60 10 Q 50 100 70 190" fill="none" stroke="#1d4ed8" strokeWidth="22" opacity="0.85" strokeLinecap="round" />
                  <path d="M 140 10 Q 150 100 130 190" fill="none" stroke="#1e40af" strokeWidth="24" opacity="0.85" strokeLinecap="round" />

                  {/* Red wale sign / White nipple active tear */}
                  <circle cx="68" cy="110" r="6" fill="#ef4444" />
                  {liveData.activeHemorrhage && (
                    <path d="M 68 110 Q 90 125 110 170" fill="none" stroke="#dc2626" strokeWidth="5" strokeLinecap="round" opacity="0.9" />
                  )}

                  {/* Rubber Bands Deployed */}
                  {params.bandsDeployedCount > 0 && (
                    <ellipse cx="68" cy="110" rx="14" ry="8" fill="none" stroke="#f59e0b" strokeWidth="4" />
                  )}
                </g>
              )}

              {/* Pathology Overlay: Ampulla of Vater & ERCP Duodenoscope */}
              {isERCP && (
                <g>
                  {/* Duodenal mucosal plicae circularis */}
                  <path d="M 20 40 Q 100 70 180 40" fill="none" stroke="#e11d48" strokeWidth="5" opacity="0.4" />
                  {/* Major Duodenal Papilla (Ampulla of Vater) */}
                  <ellipse cx="105" cy="100" rx="24" ry="32" fill="#be123c" stroke="#f43f5e" strokeWidth="2" />
                  <circle cx="105" cy="100" r="7" fill="#881337" stroke="#fbbf24" strokeWidth="1.5" />

                  {/* Sphincterotome wire engagement */}
                  {params.ercpWireEngagement !== 'NOT_ENGAGED' && (
                    <path
                      d="M 50 160 Q 80 130 105 100"
                      fill="none"
                      stroke={params.ercpWireEngagement === 'COMMON_BILE_DUCT' ? '#10b981' : '#f59e0b'}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  )}

                  {/* Sphincterotomy incision mark */}
                  {params.sphincterotomyApplied && (
                    <line x1="105" y1="100" x2="105" y2="82" stroke="#fbbf24" strokeWidth="3" strokeDasharray="2 1" />
                  )}

                  {/* Extracted stone */}
                  {params.balloonTrawlDone && (
                    <circle cx="125" cy="120" r="9" fill="#78350f" stroke="#d97706" strokeWidth="2" />
                  )}
                </g>
              )}
            </svg>
          </div>

          <div className="mt-3 text-center text-xs text-slate-300 font-mono">
            {liveData.viewFinderOverlay}
          </div>
        </div>

        {/* Right Column: Procedural Intervention Deck (Hemostasis & ERCP) */}
        <div className="border border-slate-800 rounded-2xl bg-slate-900/70 p-4 space-y-4">
          <h2 className="text-xs font-bold text-rose-400 uppercase tracking-wider">
            Interventional Action Deck
          </h2>

          {/* Peptic Ulcer Hemostasis Deck */}
          {isBleedingUlcer && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 block uppercase">Dual Therapy Protocols</span>
              <button
                onClick={injectEpinephrine}
                className={`w-full text-xs p-2 rounded-lg border font-semibold flex justify-between items-center transition ${
                  params.epinephrineInjected
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-600 text-slate-300'
                }`}
              >
                <span>1. Dilute Epinephrine Injection (1:10,000)</span>
                <span className="text-[10px]">{params.epinephrineInjected ? '✓ INJECTED' : 'INJECT'}</span>
              </button>

              <button
                onClick={deployClip}
                className="w-full text-xs p-2 rounded-lg border border-slate-800 bg-slate-950 hover:border-cyan-500 text-slate-200 font-semibold flex justify-between items-center transition"
              >
                <span>2. Deploy Through-the-Scope Hemoclip</span>
                <span className="text-[10px] text-cyan-400 font-bold">{params.clipsDeployedCount} Deployed</span>
              </button>

              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Forrest Classification:</span>
                  <span className="font-bold text-amber-300">{liveData.forrestGrade || 'None'}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Dual Therapy Met:</span>
                  <span className={`font-bold ${liveData.dualTherapyAchieved ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {liveData.dualTherapyAchieved ? 'YES (Epi + Clip)' : 'NO (Mono-therapy insufficient)'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Variceal Band Ligation Deck */}
          {isVarices && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 block uppercase">Variceal Hemostasis</span>
              <button
                onClick={deployBand}
                className="w-full text-xs p-2 rounded-lg border border-slate-800 bg-slate-950 hover:border-amber-500 text-slate-200 font-semibold flex justify-between items-center transition"
              >
                <span>Deploy Elastic Ligation Band</span>
                <span className="text-[10px] text-amber-400 font-bold">{params.bandsDeployedCount} Bands</span>
              </button>

              <button
                onClick={toggleOctreotide}
                className={`w-full text-xs p-2 rounded-lg border font-semibold flex justify-between items-center transition ${
                  params.octreotideInfusionActive
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-600 text-slate-300'
                }`}
              >
                <span>IV Octreotide (50 mcg + 50 mcg/hr)</span>
                <span className="text-[10px]">{params.octreotideInfusionActive ? '✓ INFUSING' : 'START'}</span>
              </button>
            </div>
          )}

          {/* ERCP Biliary Intervention Deck */}
          {isERCP && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 block uppercase">ERCP Cannulation &amp; Extraction</span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={engageBileDuct}
                  className={`text-xs p-2 rounded-lg border font-semibold truncate ${
                    params.ercpWireEngagement === 'COMMON_BILE_DUCT'
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  CBD Wire (11 o&apos;clock)
                </button>
                <button
                  onClick={engagePancreaticDuct}
                  className={`text-xs p-2 rounded-lg border font-semibold truncate ${
                    params.ercpWireEngagement === 'PANCREATIC_DUCT'
                      ? 'bg-amber-950 border-amber-500 text-amber-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  PD Wire (Inadvertent)
                </button>
              </div>

              <button
                onClick={performSphincterotomy}
                disabled={params.ercpWireEngagement !== 'COMMON_BILE_DUCT'}
                className="w-full text-xs p-2 rounded-lg border border-slate-800 bg-slate-950 hover:border-amber-500 disabled:opacity-40 text-slate-200 font-semibold flex justify-between items-center transition"
              >
                <span>Electrosurgical Sphincterotomy</span>
                <span className="text-[10px]">{params.sphincterotomyApplied ? '✓ CUT DONE' : 'APPLY'}</span>
              </button>

              <button
                onClick={performBalloonExtraction}
                disabled={!params.sphincterotomyApplied}
                className="w-full text-xs p-2 rounded-lg border border-slate-800 bg-slate-950 hover:border-amber-500 disabled:opacity-40 text-slate-200 font-semibold flex justify-between items-center transition"
              >
                <span>Balloon Trawl Stone Extraction</span>
                <span className="text-[10px]">{params.balloonTrawlDone ? '✓ CLEARED' : 'SWEEP'}</span>
              </button>

              <button
                onClick={giveRectalIndomethacin}
                className={`w-full text-xs p-2 rounded-lg border font-semibold flex justify-between items-center transition ${
                  params.rectalIndomethacinGiven
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-600 text-slate-300'
                }`}
              >
                <span>Rectal Indomethacin 100 mg (PEP)</span>
                <span className="text-[10px]">{params.rectalIndomethacinGiven ? '✓ GIVEN (-50% PEP)' : 'ADMINISTER'}</span>
              </button>

              <button
                onClick={deployBiliaryStent}
                className={`w-full text-xs p-2 rounded-lg border font-semibold flex justify-between items-center transition ${
                  params.biliaryStentDeployed
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-600 text-slate-300'
                }`}
              >
                <span>Deploy 10 Fr Plastic Biliary Stent</span>
                <span className="text-[10px]">{params.biliaryStentDeployed ? '✓ STENT IN SITU' : 'DEPLOY'}</span>
              </button>

              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Pancreatitis (PEP) Risk:</span>
                  <span className={`font-bold ${liveData.ercp.pepRiskPct >= 15 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {liveData.ercp.pepRiskPct}% {liveData.ercp.pepRiskPct >= 15 && '(Elevated Risk)'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
