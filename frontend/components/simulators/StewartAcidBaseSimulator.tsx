'use client';

import React, { useState, useEffect } from 'react';
import {
  computeStewartAcidBase,
  STEWART_PRESETS,
  StewartInputParams,
  StewartState,
  StewartPresetId,
  FluidInfusionType,
} from '@/.gemini/skills/StewartAcidBaseEngine';

const DEFAULT_PARAMS: StewartInputParams = {
  presetId: 'NORMAL_PLASMA_HOMEOSTASIS',
  naMeqL: 140,
  kMeqL: 4.0,
  caMeqL: 2.4,
  mgMeqL: 1.6,
  clMeqL: 102,
  lactateMeqL: 1.0,
  albuminGDL: 4.2,
  phosphateMgDL: 3.5,
  pco2MmHg: 40,
  fluidInfusion: 'NONE',
  fluidVolumeLiters: 0,
};

function alarmBadgeClass(alarm: string) {
  if (alarm === 'OPTIMAL_ACID_BASE') {
    return 'bg-emerald-900/60 text-emerald-300 border-emerald-500/50';
  }
  if (alarm.includes('ACIDOSIS') || alarm.includes('UNMEASURED') || alarm.includes('MASK')) {
    return 'bg-rose-900/70 text-rose-200 border-rose-500 animate-pulse';
  }
  return 'bg-amber-900/60 text-amber-200 border-amber-500/60';
}

export default function StewartAcidBaseSimulator() {
  const [selectedPreset, setSelectedPreset] = useState<StewartPresetId>('NORMAL_PLASMA_HOMEOSTASIS');
  const [params, setParams] = useState<StewartInputParams>(() => ({
    ...DEFAULT_PARAMS,
    ...STEWART_PRESETS['NORMAL_PLASMA_HOMEOSTASIS'].initialState,
  }));
  const [liveData, setLiveData] = useState<StewartState>(() =>
    computeStewartAcidBase({ ...DEFAULT_PARAMS, ...STEWART_PRESETS['NORMAL_PLASMA_HOMEOSTASIS'].initialState })
  );

  useEffect(() => {
    setLiveData(computeStewartAcidBase(params));
  }, [params]);

  function loadPreset(id: StewartPresetId) {
    setSelectedPreset(id);
    setParams({
      ...DEFAULT_PARAMS,
      ...STEWART_PRESETS[id].initialState,
      presetId: id,
    });
  }

  function setFluid(type: FluidInfusionType) {
    setParams(p => ({
      ...p,
      fluidInfusion: type,
      fluidVolumeLiters: type === 'NONE' ? 0 : Math.max(1, p.fluidVolumeLiters),
    }));
  }

  function openSocraticAI() {
    window.dispatchEvent(
      new CustomEvent('mediverse:open-ai-with-context', {
        detail: {
          module: 'Stewart Physico-Chemical Acid-Base & SID',
          preset: STEWART_PRESETS[selectedPreset].title,
          ph: liveData.ph,
          hco3: `${liveData.hco3MeqL} mEq/L`,
          pco2: `${params.pco2MmHg} mmHg`,
          sidApparent: `${liveData.sidApparentMeqL} mEq/L`,
          sidEffective: `${liveData.sidEffectiveMeqL} mEq/L`,
          sig: `${liveData.sigMeqL} mEq/L`,
          atot: `${liveData.atotMmolL} mmol/L`,
          albumin: `${params.albuminGDL} g/dL`,
          chloride: `${params.clMeqL} mEq/L`,
          classicalAG: `${liveData.classicalAnionGapMeqL} mEq/L`,
          correctedAG: `${liveData.correctedAnionGapMeqL} mEq/L`,
          fluidInfusion: `${params.fluidInfusion} (${params.fluidVolumeLiters}L)`,
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
            <h1 className="text-xl md:text-2xl font-black text-teal-400 tracking-tight">
              NEPHROLOGY &amp; ICU — Stewart Physico-Chemical Acid-Base Solver
            </h1>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                liveData.ph < 7.35 || liveData.ph > 7.45
                  ? 'border-rose-500 bg-rose-950/70 text-rose-300 animate-pulse'
                  : 'border-emerald-500 bg-emerald-950/60 text-emerald-300'
              }`}
            >
              pH: {liveData.ph} | SID: {liveData.sidApparentMeqL} mEq/L | SIG: {liveData.sigMeqL} mEq/L
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Strong Ion Difference (SID) | Total Weak Acids (Atot) | Strong Ion Gap (SIG) | Dilutional Saline Acidosis
          </p>
        </div>

        <button
          onClick={openSocraticAI}
          className="self-start md:self-auto px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white shadow-lg transition border border-teal-400/40 flex items-center gap-2"
        >
          <span>✨</span> Ask Socratic AI Tutor
        </button>
      </div>

      {/* Preset Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-4">
        {Object.values(STEWART_PRESETS).map(p => (
          <button
            key={p.id}
            onClick={() => loadPreset(p.id)}
            className={`p-2.5 rounded-lg border text-left transition ${
              selectedPreset === p.id
                ? 'border-teal-500 bg-teal-950/80 text-white shadow-md'
                : 'border-slate-800 bg-slate-900/60 hover:border-slate-600 text-slate-300'
            }`}
          >
            <span className="text-[10px] block font-mono text-teal-400 font-bold truncate">
              {p.id === 'NORMAL_PLASMA_HOMEOSTASIS'
                ? 'Normal Homeostasis'
                : p.id === 'SALINE_RESUSCITATION_HYPERCHLOREMIC'
                ? 'Saline Resuscitation'
                : p.id === 'SEPTIC_SHOCK_HYPOALBUMINEMIA_MASK'
                ? 'Septic Hypoalbuminemia'
                : p.id === 'DKA_UNMEASURED_ANIONS'
                ? 'Diabetic Ketoacidosis'
                : p.id === 'UREMIC_ACIDOSIS_ESRD'
                ? 'ESRD Uremic Acidosis'
                : 'Contraction Alkalosis'}
            </span>
            <p className="text-xs font-semibold mt-0.5 line-clamp-1">{p.title}</p>
          </button>
        ))}
      </div>

      {/* Active Alarm Banner */}
      {liveData.activeAlarms.length > 0 && liveData.activeAlarms[0] !== 'OPTIMAL_ACID_BASE' ? (
        <div className="p-2.5 rounded-xl border border-rose-600/70 bg-rose-950/50 mb-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-rose-300">⚠ ACID-BASE ALERTS:</span>
          {liveData.activeAlarms.map(alarm => (
            <span key={alarm} className={`text-[11px] px-2 py-0.5 rounded border font-semibold ${alarmBadgeClass(alarm)}`}>
              {alarm.replace(/_/g, ' ')}
            </span>
          ))}
        </div>
      ) : (
        <div className="p-2.5 rounded-xl border border-emerald-600/70 bg-emerald-950/40 mb-4 text-xs font-bold text-emerald-300">
          ✓ OPTIMAL ACID-BASE EQUILIBRIUM — SID 40–42 mEq/L, SIG ~0 mEq/L, pH 7.38–7.42
        </div>
      )}

      {/* Main Simulation Viewport: 3-Column Console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Left Column: Independent Variables & Electrolyte Controls */}
        <div className="border border-slate-800 rounded-2xl bg-slate-900/70 p-4 space-y-3">
          <h2 className="text-xs font-bold text-teal-400 uppercase tracking-wider">
            Stewart Independent Variables
          </h2>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Sodium (Na+):</span>
              <span className="font-bold text-teal-300">{params.naMeqL} mEq/L</span>
            </div>
            <input
              type="range"
              min="120"
              max="160"
              value={params.naMeqL}
              onChange={e => setParams(p => ({ ...p, naMeqL: Number(e.target.value) }))}
              className="w-full accent-teal-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Chloride (Cl-):</span>
              <span className="font-bold text-teal-300">{params.clMeqL} mEq/L</span>
            </div>
            <input
              type="range"
              min="70"
              max="130"
              value={params.clMeqL}
              onChange={e => setParams(p => ({ ...p, clMeqL: Number(e.target.value) }))}
              className="w-full accent-teal-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
              <span>Hypochloremic Alkalosis</span>
              <span>100–106 Normal</span>
              <span>Hyperchloremic Acidosis</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Arterial pCO2:</span>
              <span className="font-bold text-teal-300">{params.pco2MmHg} mmHg</span>
            </div>
            <input
              type="range"
              min="15"
              max="80"
              value={params.pco2MmHg}
              onChange={e => setParams(p => ({ ...p, pco2MmHg: Number(e.target.value) }))}
              className="w-full accent-teal-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Serum Albumin:</span>
              <span className="font-bold text-teal-300">{params.albuminGDL} g/dL (Atot Buffer)</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="5.5"
              step="0.1"
              value={params.albuminGDL}
              onChange={e => setParams(p => ({ ...p, albuminGDL: Number(e.target.value) }))}
              className="w-full accent-teal-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Lactate:</span>
              <span className="font-bold text-teal-300">{params.lactateMeqL} mEq/L</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="15.0"
              step="0.5"
              value={params.lactateMeqL}
              onChange={e => setParams(p => ({ ...p, lactateMeqL: Number(e.target.value) }))}
              className="w-full accent-teal-500"
            />
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1 text-xs">
            <span className="text-slate-400 font-bold block">Clinical Vignette:</span>
            <p className="text-slate-300 text-[11px]">{STEWART_PRESETS[selectedPreset].clinicalScenario}</p>
          </div>
        </div>

        {/* Center Column: Gamblegram Ion Stack & Stewart Equilibria SVG */}
        <div className="border border-slate-800 rounded-2xl bg-slate-900/70 p-4 flex flex-col items-center justify-between">
          <div className="w-full flex justify-between items-center mb-2 text-xs">
            <span className="text-slate-400 font-mono">STEWART GAMBLEGRAM</span>
            <span className="text-teal-400 font-bold">
              ELECTRICAL NEUTRALITY
            </span>
          </div>

          {/* SVG Gamblegram Graphic */}
          <div className="w-full h-72 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 relative flex items-center justify-center">
            <svg viewBox="0 0 300 220" className="w-full h-full">
              {/* Cations Column (Left) */}
              <text x="75" y="20" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">
                CATIONS
              </text>
              {/* Na+ block */}
              <rect x="35" y="30" width="80" height="140" fill="#0284c7" rx="3" />
              <text x="75" y="105" fill="#fff" fontSize="11" fontWeight="bold" textAnchor="middle">
                Na+ {params.naMeqL}
              </text>
              {/* K+, Ca2+, Mg2+ block */}
              <rect x="35" y="172" width="80" height="30" fill="#0369a1" rx="3" />
              <text x="75" y="190" fill="#bae6fd" fontSize="9" textAnchor="middle">
                K+ / Ca / Mg
              </text>

              {/* Anions Column (Right) */}
              <text x="215" y="20" fill="#f43f5e" fontSize="10" fontWeight="bold" textAnchor="middle">
                ANIONS &amp; BUFFERS
              </text>
              {/* Cl- block */}
              <rect
                x="175"
                y="30"
                width="80"
                height={Math.min(130, Math.round(params.clMeqL * 1.05))}
                fill="#e11d48"
                rx="3"
              />
              <text x="215" y="75" fill="#fff" fontSize="11" fontWeight="bold" textAnchor="middle">
                Cl- {params.clMeqL}
              </text>

              {/* HCO3- dependent block */}
              <rect
                x="175"
                y={30 + Math.min(130, Math.round(params.clMeqL * 1.05))}
                width="80"
                height={Math.max(15, Math.min(45, Math.round(liveData.hco3MeqL * 1.1)))}
                fill="#10b981"
                rx="3"
              />
              <text
                x="215"
                y={45 + Math.min(130, Math.round(params.clMeqL * 1.05))}
                fill="#fff"
                fontSize="9"
                fontWeight="bold"
                textAnchor="middle"
              >
                HCO3- {liveData.hco3MeqL}
              </text>

              {/* Albumin- & Pi- (Atot) block */}
              <rect
                x="175"
                y={30 + Math.min(130, Math.round(params.clMeqL * 1.05)) + Math.max(15, Math.min(45, Math.round(liveData.hco3MeqL * 1.1)))}
                width="80"
                height={Math.max(12, Math.round(liveData.albuminChargeMeqL * 2.5))}
                fill="#d97706"
                rx="3"
              />
              <text
                x="215"
                y={42 + Math.min(130, Math.round(params.clMeqL * 1.05)) + Math.max(15, Math.min(45, Math.round(liveData.hco3MeqL * 1.1)))}
                fill="#fff"
                fontSize="8"
                textAnchor="middle"
              >
                Alb- &amp; Pi-
              </text>

              {/* SIG Unmeasured Anions if > 2 */}
              {liveData.sigMeqL > 2 && (
                <rect
                  x="175"
                  y="188"
                  width="80"
                  height="16"
                  fill="#7c3aed"
                  className="animate-pulse"
                  rx="3"
                />
              )}
              {liveData.sigMeqL > 2 && (
                <text x="215" y="200" fill="#fff" fontSize="8" fontWeight="bold" textAnchor="middle">
                  SIG {liveData.sigMeqL} mEq/L
                </text>
              )}

              {/* Bracket showing SID span */}
              <line x1="125" y1="30" x2="165" y2="30" stroke="#2dd4bf" strokeWidth="1" strokeDasharray="3 2" />
              <line x1="145" y1="30" x2="145" y2="170" stroke="#2dd4bf" strokeWidth="1.5" />
              <text x="145" y="100" fill="#2dd4bf" fontSize="8" textAnchor="middle" transform="rotate(-90, 145, 100)">
                SID {liveData.sidApparentMeqL}
              </text>
            </svg>
          </div>

          <div className="mt-3 text-center text-xs text-slate-300 font-mono">
            {STEWART_PRESETS[selectedPreset].primaryDisorder}
          </div>
        </div>

        {/* Right Column: Fluid Resuscitation & Comparative Table */}
        <div className="border border-slate-800 rounded-2xl bg-slate-900/70 p-4 space-y-4">
          <h2 className="text-xs font-bold text-teal-400 uppercase tracking-wider">
            Resuscitation Fluids &amp; Diagnostics
          </h2>

          {/* Fluid Infusion Simulator */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
            <span className="text-[11px] font-bold text-cyan-400 block uppercase">
              IV Fluid Infusion Simulator
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {(
                [
                  { id: 'NONE', label: 'None' },
                  { id: 'NORMAL_SALINE_09', label: '0.9% Saline (SID=0)' },
                  { id: 'BALANCED_CRYSTALLOID', label: 'Plasma-Lyte (SID=50)' },
                  { id: 'SODIUM_BICARBONATE_84', label: '8.4% NaHCO3' },
                ] as { id: FluidInfusionType; label: string }[]
              ).map(f => (
                <button
                  key={f.id}
                  onClick={() => setFluid(f.id)}
                  className={`text-[11px] p-1.5 rounded-lg border font-semibold truncate ${
                    params.fluidInfusion === f.id
                      ? 'bg-teal-950 border-teal-500 text-teal-200'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {params.fluidInfusion !== 'NONE' && (
              <div>
                <div className="flex justify-between text-xs mb-1 mt-2">
                  <span className="text-slate-400">Volume Infused:</span>
                  <span className="font-bold text-teal-300">{params.fluidVolumeLiters} Liters</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={params.fluidVolumeLiters}
                  onChange={e => setParams(p => ({ ...p, fluidVolumeLiters: Number(e.target.value) }))}
                  className="w-full accent-teal-500"
                />
              </div>
            )}
          </div>

          {/* Comparative Metrics Table */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5 text-xs font-mono">
            <span className="text-slate-400 font-bold block mb-1">Classical vs. Stewart Comparison:</span>
            <div className="flex justify-between py-0.5 border-b border-slate-900">
              <span className="text-slate-400">Apparent SID (SIDa):</span>
              <span className="font-bold text-teal-300">{liveData.sidApparentMeqL} mEq/L</span>
            </div>
            <div className="flex justify-between py-0.5 border-b border-slate-900">
              <span className="text-slate-400">Effective SID (SIDe):</span>
              <span className="font-bold text-cyan-300">{liveData.sidEffectiveMeqL} mEq/L</span>
            </div>
            <div className="flex justify-between py-0.5 border-b border-slate-900">
              <span className="text-slate-400">Strong Ion Gap (SIG):</span>
              <span className={`font-bold ${liveData.sigMeqL > 2 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {liveData.sigMeqL} mEq/L
              </span>
            </div>
            <div className="flex justify-between py-0.5 border-b border-slate-900">
              <span className="text-slate-400">Total Weak Acids (Atot):</span>
              <span className="text-slate-200">{liveData.atotMmolL} mmol/L</span>
            </div>
            <div className="flex justify-between py-0.5 border-b border-slate-900">
              <span className="text-slate-400">Classical Anion Gap:</span>
              <span className="text-slate-200">{liveData.classicalAnionGapMeqL} mEq/L</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-slate-400">Albumin-Corrected AG:</span>
              <span className="text-amber-300 font-bold">{liveData.correctedAnionGapMeqL} mEq/L</span>
            </div>
          </div>

          {/* Clinical Guidance */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1 text-xs">
            <span className="text-slate-400 font-bold block">Stewart Treatment Rationale:</span>
            <p className="text-slate-300 text-[11px] leading-relaxed">{liveData.clinicalRecommendation}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
