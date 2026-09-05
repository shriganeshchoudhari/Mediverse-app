'use client';

import React, { useState, useEffect } from 'react';
import {
  computeFetalMonitoringState,
  CTG_PRESETS,
  FetalMonitoringInputParams,
  FetalMonitoringState,
  PresetId,
  VariabilityType,
  DecelerationType,
  NICHDTier,
} from '@/.gemini/skills/FetalMonitoringEngine';

const DEFAULT_PARAMS: FetalMonitoringInputParams = {
  baselineFhrBpm: 135,
  variability: 'MODERATE',
  decelerationType: 'NONE',
  hasAccelerations: true,
  contractionsPer10Min: 3,
  contractionPeakMmHg: 55,
  fetalScalpPh: 7.32,
  maternalPosition: 'LEFT_LATERAL',
  ivFluidsActive: false,
  maternalO2Active: false,
  oxytocinRateMilliunitsMin: 4,
  tocolysisGiven: false,
  gestationalWeeks: 39,
  bishopDilation: 4,
  bishopEffacement: 60,
  bishopStation: 0,
  bishopConsistency: 'MEDIUM',
  bishopPosition: 'MID',
};

function categoryBadgeColor(cat: NICHDTier) {
  if (cat === 'CATEGORY_I') return 'bg-emerald-950 border-emerald-500 text-emerald-400';
  if (cat === 'CATEGORY_II') return 'bg-amber-950 border-amber-500 text-amber-400';
  return 'bg-rose-950 border-rose-500 text-rose-400 animate-pulse';
}

function alarmBadgeColor(alarm: string) {
  if (alarm === 'OPTIMAL') return 'bg-emerald-900/60 text-emerald-300 border-emerald-500/50';
  if (alarm.includes('CATEGORY_III') || alarm.includes('SINUSOIDAL') || alarm.includes('BRADYCARDIA')) {
    return 'bg-rose-900/70 text-rose-200 border-rose-500 animate-pulse';
  }
  return 'bg-amber-900/60 text-amber-200 border-amber-500/60';
}

export default function FetalMonitoringSimulator() {
  const [selectedPreset, setSelectedPreset] = useState<PresetId>('NORMAL_CATEGORY_I');
  const [params, setParams] = useState<FetalMonitoringInputParams>(() => ({
    ...DEFAULT_PARAMS,
    ...CTG_PRESETS['NORMAL_CATEGORY_I'].initialState,
  }));
  const [liveData, setLiveData] = useState<FetalMonitoringState>(() =>
    computeFetalMonitoringState({ ...DEFAULT_PARAMS, ...CTG_PRESETS['NORMAL_CATEGORY_I'].initialState })
  );

  useEffect(() => {
    setLiveData(computeFetalMonitoringState(params));
  }, [params]);

  function loadPreset(id: PresetId) {
    setSelectedPreset(id);
    setParams({
      ...DEFAULT_PARAMS,
      ...CTG_PRESETS[id].initialState,
    });
  }

  // 1-Click Resuscitation Actions
  function applyLeftLateral() {
    setParams(p => ({ ...p, maternalPosition: 'LEFT_LATERAL' }));
  }

  function giveIvBolus() {
    setParams(p => ({ ...p, ivFluidsActive: true }));
  }

  function applyMaternalO2() {
    setParams(p => ({ ...p, maternalO2Active: true }));
  }

  function stopOxytocin() {
    setParams(p => ({ ...p, oxytocinRateMilliunitsMin: 0 }));
  }

  function giveTocolysis() {
    setParams(p => ({ ...p, tocolysisGiven: true, contractionsPer10Min: Math.max(2, p.contractionsPer10Min - 3) }));
  }

  // Socratic AI Bridge
  function openSocraticAI() {
    window.dispatchEvent(
      new CustomEvent('mediverse:open-ai-with-context', {
        detail: {
          module: 'Obstetrics & CTG Fetal Monitoring',
          preset: CTG_PRESETS[selectedPreset].title,
          category: liveData.nichdCategory,
          fhrBaseline: `${liveData.baselineFhrBpm} bpm`,
          variability: liveData.variability,
          deceleration: liveData.decelerationType,
          contractions: `${liveData.contractionsPer10Min}/10 min (${liveData.montevideoUnitsMVU} MVU)`,
          fetalScalpPh: liveData.fetalScalpPh,
          bishopScore: `${liveData.bishopScore}/13`,
          activeAlarms: liveData.activeAlarms,
        },
      })
    );
  }

  // SVG CTG Strip Dimensions
  const svgWidth = 800;
  const fhrSvgHeight = 150;
  const tocoSvgHeight = 80;

  // Convert time series into SVG Polyline coordinate strings
  // FHR scale: 60 bpm (y = 140) to 200 bpm (y = 10)
  const fhrPointsString = liveData.timeSeriesData
    .map(pt => {
      const x = (pt.timeSeconds / 600) * svgWidth;
      const y = fhrSvgHeight - ((pt.fhrBpm - 60) / (200 - 60)) * (fhrSvgHeight - 20) - 10;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  // Toco scale: 0 mmHg (y = 70) to 100 mmHg (y = 10)
  const tocoPointsString = liveData.timeSeriesData
    .map(pt => {
      const x = (pt.timeSeconds / 600) * svgWidth;
      const y = tocoSvgHeight - (pt.uterineActivityMmHg / 100) * (tocoSvgHeight - 20) - 10;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen p-4 md:p-6 font-mono">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black text-rose-400 tracking-tight">
              LABOR &amp; DELIVERY — Fetal Monitoring &amp; CTG Workstation
            </h1>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${categoryBadgeColor(liveData.nichdCategory)}`}>
              {liveData.nichdCategory.replace('_', ' ')}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Cardiotocography (CTG) Analysis | Montevideo Units | NICHD 3-Tier Guidelines | Bishop Induction Scoring
          </p>
        </div>

        <button
          onClick={openSocraticAI}
          className="self-start md:self-auto px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white shadow-lg transition border border-rose-400/40 flex items-center gap-2"
        >
          <span>✨</span> Ask Socratic AI Tutor
        </button>
      </div>

      {/* Preset Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-4">
        {Object.values(CTG_PRESETS).map(p => (
          <button
            key={p.id}
            onClick={() => loadPreset(p.id)}
            className={`p-2 rounded-lg border text-left transition ${
              selectedPreset === p.id
                ? 'border-rose-500 bg-rose-950/80 text-white shadow-md'
                : 'border-slate-800 bg-slate-900/60 hover:border-slate-600 text-slate-300'
            }`}
          >
            <span className="text-[10px] block font-mono text-rose-400 font-bold">{p.category.replace('_', ' ')}</span>
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
          ✓ REASSURING FETAL TRACING — Category I Normal Parameters
        </div>
      )}

      {/* Main Simulation Viewport: Dual-Channel Electronic CTG Strip */}
      <div className="border border-slate-800 rounded-2xl bg-slate-900/80 p-4 mb-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Continuous Paper Strip (1 cm/min, 10 min window)</span>
            <span className="text-xs text-rose-400 font-bold">FHR Baseline: {liveData.baselineFhrBpm} bpm</span>
            <span className="text-xs text-cyan-400 font-bold">Variability: {liveData.variability} ({liveData.variabilityBpmRange} bpm)</span>
            <span className="text-xs text-amber-400 font-bold">Decels: {liveData.decelerationType}</span>
          </div>
          <div className="text-xs font-mono text-slate-400">
            Montevideo: <span className="font-bold text-white">{liveData.montevideoUnitsMVU} MVU</span> {liveData.montevideoUnitsMVU >= 200 ? '(Adequate)' : '(Hypocontractile)'}
          </div>
        </div>

        {/* FHR Upper Channel (Top Panel) */}
        <div className="relative border border-slate-800 rounded-xl bg-slate-950/90 p-2 mb-3">
          <div className="absolute top-2 left-3 text-[10px] font-bold text-rose-400/80">FHR (bpm) [Normal 110–160]</div>
          <div className="absolute top-2 right-3 text-[10px] text-slate-500">200 bpm</div>
          <div className="absolute top-1/2 -translate-y-1/2 right-3 text-[10px] text-slate-500">140 bpm</div>
          <div className="absolute bottom-2 right-3 text-[10px] text-slate-500">60 bpm</div>

          <svg viewBox={`0 0 ${svgWidth} ${fhrSvgHeight}`} className="w-full h-36">
            {/* Grid Lines */}
            {[80, 110, 140, 160, 180].map(val => {
              const y = fhrSvgHeight - ((val - 60) / (200 - 60)) * (fhrSvgHeight - 20) - 10;
              return (
                <g key={val}>
                  <line x1="0" y1={y} x2={svgWidth} y2={y} stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
                  {val === 110 || val === 160 ? (
                    <line x1="0" y1={y} x2={svgWidth} y2={y} stroke="#f43f5e" strokeWidth="0.8" strokeOpacity="0.4" />
                  ) : null}
                </g>
              );
            })}

            {/* Time Grid (1 minute vertical bars) */}
            {Array.from({ length: 11 }).map((_, i) => (
              <line key={i} x1={(i / 10) * svgWidth} y1="0" x2={(i / 10) * svgWidth} y2={fhrSvgHeight} stroke="#1e293b" strokeWidth="1" />
            ))}

            {/* FHR Trace Curve */}
            <polyline
              fill="none"
              stroke="#f43f5e"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={fhrPointsString}
            />
          </svg>
        </div>

        {/* TOCO Lower Channel (Uterine Activity Panel) */}
        <div className="relative border border-slate-800 rounded-xl bg-slate-950/90 p-2">
          <div className="absolute top-2 left-3 text-[10px] font-bold text-amber-400/80">TOCO (mmHg) [Resting Tone 10–15]</div>
          <div className="absolute top-2 right-3 text-[10px] text-slate-500">100 mmHg</div>
          <div className="absolute bottom-2 right-3 text-[10px] text-slate-500">0 mmHg</div>

          <svg viewBox={`0 0 ${svgWidth} ${tocoSvgHeight}`} className="w-full h-20">
            {/* Horizontal Grid */}
            {[25, 50, 75].map(val => {
              const y = tocoSvgHeight - (val / 100) * (tocoSvgHeight - 20) - 10;
              return <line key={val} x1="0" y1={y} x2={svgWidth} y2={y} stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />;
            })}

            {/* Time Grid */}
            {Array.from({ length: 11 }).map((_, i) => (
              <line key={i} x1={(i / 10) * svgWidth} y1="0" x2={(i / 10) * svgWidth} y2={tocoSvgHeight} stroke="#1e293b" strokeWidth="1" />
            ))}

            {/* Toco Curve */}
            <polyline
              fill="none"
              stroke="#fbbf24"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={tocoPointsString}
            />
          </svg>
        </div>
      </div>

      {/* Control Console Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column: FHR Controls */}
        <div className="border border-slate-800 rounded-xl p-4 bg-slate-900/60 space-y-4">
          <h2 className="text-xs font-bold text-rose-400 uppercase tracking-wider">FHR &amp; Uterine Controls</h2>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Baseline FHR:</span>
              <span className="font-bold text-rose-400">{params.baselineFhrBpm} bpm</span>
            </div>
            <input
              type="range"
              min="90"
              max="185"
              value={params.baselineFhrBpm}
              onChange={e => setParams(p => ({ ...p, baselineFhrBpm: Number(e.target.value) }))}
              className="w-full accent-rose-500"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">FHR Variability Type:</label>
            <div className="grid grid-cols-2 gap-1.5">
              {(['ABSENT', 'MINIMAL', 'MODERATE', 'MARKED'] as VariabilityType[]).map(v => (
                <button
                  key={v}
                  onClick={() => setParams(p => ({ ...p, variability: v }))}
                  className={`text-xs py-1 px-2 rounded border font-semibold ${
                    params.variability === v
                      ? 'bg-rose-950 border-rose-500 text-white'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Deceleration Pattern:</label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['NONE', 'EARLY', 'LATE', 'VARIABLE', 'PROLONGED', 'SINUSOIDAL'] as DecelerationType[]).map(d => (
                <button
                  key={d}
                  onClick={() => setParams(p => ({ ...p, decelerationType: d }))}
                  className={`text-[11px] py-1 px-1 rounded border font-semibold truncate ${
                    params.decelerationType === d
                      ? 'bg-amber-950 border-amber-500 text-white'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Contractions / 10 min:</span>
              <span className={`font-bold ${params.contractionsPer10Min > 5 ? 'text-rose-400' : 'text-amber-400'}`}>
                {params.contractionsPer10Min} {params.contractionsPer10Min > 5 && '(Tachysystole)'}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="8"
              value={params.contractionsPer10Min}
              onChange={e => setParams(p => ({ ...p, contractionsPer10Min: Number(e.target.value) }))}
              className="w-full accent-amber-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Oxytocin Infusion:</span>
              <span className="font-bold text-cyan-400">{params.oxytocinRateMilliunitsMin} mU/min</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              value={params.oxytocinRateMilliunitsMin}
              onChange={e => setParams(p => ({ ...p, oxytocinRateMilliunitsMin: Number(e.target.value) }))}
              className="w-full accent-cyan-500"
            />
          </div>
        </div>

        {/* Center Column: 1-Click Intrauterine Resuscitation Protocol */}
        <div className="border border-slate-800 rounded-xl p-4 bg-slate-900/60 space-y-4">
          <h2 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            Intrauterine Resuscitation (HELPERR)
          </h2>

          <div className="space-y-2">
            <button
              onClick={applyLeftLateral}
              className={`w-full text-xs py-2 px-3 rounded-lg border font-semibold text-left flex justify-between items-center transition ${
                params.maternalPosition === 'LEFT_LATERAL'
                  ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-600 text-slate-300'
              }`}
            >
              <span>1. Reposition Left Lateral Decubitus</span>
              <span className="text-[10px]">{params.maternalPosition === 'LEFT_LATERAL' ? '✓ ACTIVE' : 'APPLY'}</span>
            </button>

            <button
              onClick={giveIvBolus}
              className={`w-full text-xs py-2 px-3 rounded-lg border font-semibold text-left flex justify-between items-center transition ${
                params.ivFluidsActive
                  ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-600 text-slate-300'
              }`}
            >
              <span>2. Crystalloid IV Fluid Bolus (1000 mL)</span>
              <span className="text-[10px]">{params.ivFluidsActive ? '✓ INFUSING' : 'BOLUS'}</span>
            </button>

            <button
              onClick={applyMaternalO2}
              className={`w-full text-xs py-2 px-3 rounded-lg border font-semibold text-left flex justify-between items-center transition ${
                params.maternalO2Active
                  ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-600 text-slate-300'
              }`}
            >
              <span>3. Supplemental O2 (10L Non-rebreather)</span>
              <span className="text-[10px]">{params.maternalO2Active ? '✓ ON' : 'APPLY'}</span>
            </button>

            <button
              onClick={stopOxytocin}
              className={`w-full text-xs py-2 px-3 rounded-lg border font-semibold text-left flex justify-between items-center transition ${
                params.oxytocinRateMilliunitsMin === 0
                  ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                  : 'bg-rose-950/80 border-rose-600 hover:bg-rose-900 text-rose-200'
              }`}
            >
              <span>4. Stop / Discontinue Oxytocin Pitocin</span>
              <span className="text-[10px]">{params.oxytocinRateMilliunitsMin === 0 ? '✓ STOPPED' : 'STOP NOW'}</span>
            </button>

            <button
              onClick={giveTocolysis}
              className={`w-full text-xs py-2 px-3 rounded-lg border font-semibold text-left flex justify-between items-center transition ${
                params.tocolysisGiven
                  ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-600 text-slate-300'
              }`}
            >
              <span>5. Acute Tocolysis (Terbutaline 0.25mg SC)</span>
              <span className="text-[10px]">{params.tocolysisGiven ? '✓ GIVEN' : 'INJECT'}</span>
            </button>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs space-y-1">
            <div className="flex justify-between text-slate-400">
              <span>Fetal Scalp Blood pH:</span>
              <span className={`font-bold ${liveData.fetalScalpPh < 7.20 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {liveData.fetalScalpPh.toFixed(2)} {liveData.fetalScalpPh < 7.20 ? '(Acidemia)' : '(Normal)'}
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Acidemia Risk:</span>
              <span className="font-bold text-amber-400">{liveData.fetalAcidemiaRisk}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Bishop Score & Cervical Assessment */}
        <div className="border border-slate-800 rounded-xl p-4 bg-slate-900/60 space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Bishop Induction Score</h2>
            <span
              className={`text-xs px-2 py-0.5 rounded font-bold border ${
                liveData.bishopInductionFavorable
                  ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                  : 'bg-slate-900 border-slate-700 text-slate-400'
              }`}
            >
              Score: {liveData.bishopScore} / 13 ({liveData.bishopInductionFavorable ? 'Favorable ≥8' : 'Unfavorable <6'})
            </span>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Dilation (0–10 cm):</span>
              <span className="font-bold text-cyan-400">{params.bishopDilation} cm</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={params.bishopDilation}
              onChange={e => setParams(p => ({ ...p, bishopDilation: Number(e.target.value) }))}
              className="w-full accent-cyan-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Effacement (0–100%):</span>
              <span className="font-bold text-cyan-400">{params.bishopEffacement}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="10"
              value={params.bishopEffacement}
              onChange={e => setParams(p => ({ ...p, bishopEffacement: Number(e.target.value) }))}
              className="w-full accent-cyan-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Station (-3 to +3):</span>
              <span className="font-bold text-cyan-400">{params.bishopStation > 0 ? `+${params.bishopStation}` : params.bishopStation}</span>
            </div>
            <input
              type="range"
              min="-3"
              max="3"
              value={params.bishopStation}
              onChange={e => setParams(p => ({ ...p, bishopStation: Number(e.target.value) }))}
              className="w-full accent-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <div>
              <label className="text-slate-400 block mb-1">Consistency:</label>
              <select
                value={params.bishopConsistency}
                onChange={e => setParams(p => ({ ...p, bishopConsistency: e.target.value as 'FIRM' | 'MEDIUM' | 'SOFT' }))}
                className="w-full bg-slate-950 border border-slate-800 rounded p-1 text-slate-200"
              >
                <option value="FIRM">Firm (0 pt)</option>
                <option value="MEDIUM">Medium (1 pt)</option>
                <option value="SOFT">Soft (2 pts)</option>
              </select>
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Position:</label>
              <select
                value={params.bishopPosition}
                onChange={e => setParams(p => ({ ...p, bishopPosition: e.target.value as 'POSTERIOR' | 'MID' | 'ANTERIOR' }))}
                className="w-full bg-slate-950 border border-slate-800 rounded p-1 text-slate-200"
              >
                <option value="POSTERIOR">Posterior (0 pt)</option>
                <option value="MID">Midposition (1 pt)</option>
                <option value="ANTERIOR">Anterior (2 pts)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
