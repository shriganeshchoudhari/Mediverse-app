'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  computeTraumaState,
  TRAUMA_PRESETS,
  TraumaInputParams,
  TraumaState,
  PresetId,
  FASTView,
} from '@/.gemini/skills/TraumaATLSEngine';

// ─── Default Params ──────────────────────────────────────────────────────────

const DEFAULT_PARAMS: TraumaInputParams = {
  estimatedBloodLossML: 400,
  hasTensionPneumothorax: false,
  hasCardiacTamponade: false,
  hasOpenPneumothorax: false,
  hasMassiveHemothorax: false,
  hasFlailChest: false,
  hasPelvicRingDisruption: false,
  gcsPenalty: 0,
  mtpActivated: false,
  permissiveHypotensionEnabled: false,
  fastPositiveViews: [],
  tempCelsius: 37.0,
  tbsaBurnPct: 0,
};

// ─── Colour helpers ──────────────────────────────────────────────────────────

function shockClassColor(sc: string) {
  if (sc === 'CLASS_I')   return 'text-green-400';
  if (sc === 'CLASS_II')  return 'text-yellow-400';
  if (sc === 'CLASS_III') return 'text-orange-400';
  return 'text-red-500';
}

function alarmColor(alarm: string) {
  if (alarm === 'TENSION_PNEUMOTHORAX' || alarm === 'CARDIAC_TAMPONADE' || alarm === 'HEMORRHAGIC_SHOCK_IV') return 'bg-red-600';
  if (alarm === 'HEMORRHAGIC_SHOCK_III' || alarm === 'DAMAGE_CONTROL_INDICATED') return 'bg-orange-600';
  if (alarm === 'MTP_ACTIVATED' || alarm === 'PERMISSIVE_HYPOTENSION_ACTIVE') return 'bg-amber-600';
  if (alarm === 'OPTIMAL') return 'bg-green-700';
  return 'bg-yellow-600';
}

function fastResultColor(result: string) {
  if (result === 'POSITIVE') return 'text-red-400';
  if (result === 'EQUIVOCAL') return 'text-yellow-400';
  return 'text-green-400';
}

// ─── FAST Ultrasound SVG ─────────────────────────────────────────────────────

function FASTUltrasoundView({ view, result, fluidDepthMm }: { view: FASTView; result: string; fluidDepthMm: number }) {
  const isPericardial = view === 'PERICARDIAL_SUBXIPHOID';
  const isPositive = result === 'POSITIVE';

  return (
    <svg viewBox="0 0 80 60" className="w-full h-full">
      {/* Ultrasound background */}
      <rect width="80" height="60" fill="#0a0f1a" rx="2" />
      {/* Speckle noise */}
      {Array.from({ length: 30 }).map((_, i) => (
        <circle key={i} cx={5 + (i % 10) * 7 + Math.sin(i * 2.3) * 3} cy={8 + Math.floor(i / 10) * 18 + Math.cos(i) * 4} r={0.4 + Math.random() * 0.6} fill={`rgba(100,160,200,${0.1 + Math.random() * 0.3})`} />
      ))}

      {isPericardial ? (
        <>
          {/* Heart silhouette */}
          <ellipse cx="40" cy="30" rx="18" ry="14" fill="#1e2a3a" stroke="#3b5068" strokeWidth="0.8" />
          <ellipse cx="40" cy="30" rx="13" ry="9" fill="#0d1520" stroke="#2a4060" strokeWidth="0.5" />
          {/* RV cavity */}
          <ellipse cx="36" cy="28" rx="7" ry="5" fill="#1a2a3a" />
          {/* Pericardial effusion stripe */}
          {isPositive && (
            <ellipse cx="40" cy="30" rx="19" ry="15" fill="none" stroke="rgba(0,180,220,0.6)" strokeWidth="3" />
          )}
          <text x="40" y="56" textAnchor="middle" fill="#7ba0c0" fontSize="5">Pericardial</text>
        </>
      ) : (
        <>
          {/* Organ silhouette */}
          <ellipse cx="35" cy="25" rx="16" ry="12" fill="#1a2535" stroke="#2d4060" strokeWidth="0.8" />
          {/* Kidney */}
          <ellipse cx="52" cy="35" rx="8" ry="11" fill="#162230" stroke="#254055" strokeWidth="0.6" />
          {/* Free fluid anechoic stripe */}
          {isPositive && (
            <rect x="42" y="22" width={Math.min(fluidDepthMm * 0.9, 12)} height="14" rx="1" fill="rgba(0,180,220,0.45)" />
          )}
          <text x="40" y="56" textAnchor="middle" fill="#7ba0c0" fontSize="4.5">
            {view === 'MORISON_POUCH' ? "Morison's" : view === 'SPLENORENAL' ? 'Splenorenal' : view === 'PELVIC_POUCH_OF_DOUGLAS' ? 'Pelvic' : view === 'RIGHT_PLEURAL' ? 'R Pleural' : 'L Pleural'}
          </text>
        </>
      )}

      {/* Positive indicator */}
      {isPositive && (
        <text x="40" y="8" textAnchor="middle" fill="#f87171" fontSize="5" fontWeight="bold">+ FREE FLUID</text>
      )}
    </svg>
  );
}

// ─── Primary Survey ABCDE Panel ───────────────────────────────────────────────

function ABCDEPanel({ state }: { state: TraumaState }) {
  const steps = [
    {
      letter: 'A', label: 'Airway', status: state.airway,
      detail: state.airway === 'PATENT' ? 'Clear — vocal cord visualized' : state.airway === 'AT_RISK' ? 'At Risk — GCS 9–11 — jaw-thrust / NPA' : 'COMPROMISED — GCS ≤8 — Definitive airway (RSI)',
      color: state.airway === 'PATENT' ? 'border-green-500 bg-green-950' : state.airway === 'AT_RISK' ? 'border-yellow-500 bg-yellow-950' : 'border-red-500 bg-red-950',
    },
    {
      letter: 'B', label: 'Breathing', status: state.breathing,
      detail: state.breathing === 'ADEQUATE' ? 'Bilateral breath sounds — adequate tidal volume' : state.breathing === 'TENSION_PTX' ? 'TENSION PTX — absent breath sounds + tracheal deviation — needle decompression 2nd ICS MCL NOW' : state.breathing === 'OPEN_PTX' ? 'Open PTX — sucking chest wound — 3-sided occlusive dressing' : state.breathing === 'MASSIVE_HEMOTHORAX' ? 'MASSIVE HEMOTHORAX — dull percussion R — chest tube 5th ICS MAL' : 'Flail Chest — paradoxical motion — PPV + analgesia',
      color: state.breathing === 'ADEQUATE' ? 'border-green-500 bg-green-950' : 'border-red-500 bg-red-950',
    },
    {
      letter: 'C', label: 'Circulation', status: state.circulation,
      detail: state.circulation === 'STABLE' ? `HR ${state.hrBpm} — BP ${state.sbpMmHg}/${state.dbpMmHg} — Hemorrhage controlled` : state.circulation === 'TAMPONADE' ? `TAMPONADE — Beck's Triad — Pericardiocentesis or ER thoracotomy` : state.circulation === 'EXSANGUINATING' ? `EXSANGUINATING — HR ${state.hrBpm} BP ${state.sbpMmHg}/${state.dbpMmHg} — MTP 1:1:1 — OR NOW` : `Class ${state.shockClass.replace('_',' ')} Shock — HR ${state.hrBpm} BP ${state.sbpMmHg}/${state.dbpMmHg} — 2 large-bore IVs + blood`,
      color: state.circulation === 'STABLE' ? 'border-green-500 bg-green-950' : state.circulation === 'HEMORRHAGIC_SHOCK' ? 'border-orange-500 bg-orange-950' : 'border-red-500 bg-red-950',
    },
    {
      letter: 'D', label: 'Disability', status: `GCS ${state.gcs}`,
      detail: `GCS ${state.gcs} — ${state.neurology} — Pupils: ${state.gcs <= 8 ? 'Fixed/dilated — herniation risk' : 'Equal and reactive'}`,
      color: state.gcs <= 8 ? 'border-red-500 bg-red-950' : state.gcs <= 12 ? 'border-yellow-500 bg-yellow-950' : 'border-green-500 bg-green-950',
    },
    {
      letter: 'E', label: 'Exposure', status: state.exposureHypothermia ? 'HYPOTHERMIA' : 'Controlled',
      detail: `Temp ${state.tempCelsius.toFixed(1)}°C — ${state.exposureHypothermia ? 'Hypothermia — warm blankets, warm IV fluids, bair hugger' : 'Normothermic — log-roll, assess back and flanks'}`,
      color: state.exposureHypothermia ? 'border-blue-400 bg-blue-950' : 'border-green-500 bg-green-950',
    },
  ];

  return (
    <div className="space-y-2">
      {steps.map(step => (
        <div key={step.letter} className={`border rounded-lg p-2.5 ${step.color}`}>
          <div className="flex items-start gap-2">
            <span className="text-lg font-black text-white w-6 shrink-0">{step.letter}</span>
            <div>
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">{step.label}</span>
              <p className="text-xs text-slate-200 mt-0.5 leading-snug">{step.detail}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Simulator ───────────────────────────────────────────────────────────

export default function TraumaATLSSimulator() {
  const [selectedPreset, setSelectedPreset] = useState<PresetId>('PENETRATING_ABDOMINAL');
  const [params, setParams] = useState<TraumaInputParams>(() => ({
    ...DEFAULT_PARAMS,
    ...TRAUMA_PRESETS['PENETRATING_ABDOMINAL'].initialState,
  }));
  const [liveData, setLiveData] = useState<TraumaState>(() =>
    computeTraumaState({ ...DEFAULT_PARAMS, ...TRAUMA_PRESETS['PENETRATING_ABDOMINAL'].initialState })
  );
  const rafRef = useRef<number | null>(null);

  // Recompute on param changes
  useEffect(() => {
    setLiveData(computeTraumaState(params));
  }, [params]);

  // Heartbeat flicker for live vitals
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // Preset selection
  function loadPreset(id: PresetId) {
    setSelectedPreset(id);
    setParams({ ...DEFAULT_PARAMS, ...TRAUMA_PRESETS[id].initialState });
  }

  // Interventions
  function activateMTP() { setParams(p => ({ ...p, mtpActivated: true })); }
  function enablePermissiveHypotension() { setParams(p => ({ ...p, permissiveHypotensionEnabled: true })); }
  function needleDecompress() { setParams(p => ({ ...p, hasTensionPneumothorax: false })); }
  function pericardiocentesis() { setParams(p => ({ ...p, hasCardiacTamponade: false })); }
  function placeChestTube() { setParams(p => ({ ...p, hasMassiveHemothorax: false })); }
  function warmPatient() { setParams(p => ({ ...p, tempCelsius: 37.0 })); }
  function applyPelvicBinder() { setParams(p => ({ ...p, estimatedBloodLossML: Math.max(500, p.estimatedBloodLossML - 600) })); }

  const nonOptimalAlarms = liveData.activeAlarms.filter(a => a !== 'OPTIMAL');

  // AI context dispatch
  function openSocraticAI() {
    window.dispatchEvent(new CustomEvent('mediverse:open-ai-with-context', {
      detail: {
        module: 'Trauma & ATLS Primary Survey',
        preset: TRAUMA_PRESETS[selectedPreset].title,
        mechanism: TRAUMA_PRESETS[selectedPreset].mechanism,
        vitals: { hr: liveData.hrBpm, bp: `${liveData.sbpMmHg}/${liveData.dbpMmHg}`, gcs: liveData.gcs, spo2: liveData.spo2Pct, temp: liveData.tempCelsius },
        shockClass: liveData.shockClass,
        fastPositive: liveData.fastPositive,
        mtp: liveData.mtp,
        alarms: liveData.activeAlarms,
        labs: { hgb: liveData.hemoglobinGdL, lactate: liveData.lactateMmolL, baseDeficit: liveData.baseDeficitMeqL, inr: liveData.inrCoag },
      }
    }));
  }

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen p-4 font-mono">
      <h1 className="text-lg font-bold text-red-400 mb-1">TRAUMA BAY — ATLS Primary Survey Workstation</h1>
      <p className="text-xs text-slate-500 mb-4">Advanced Trauma Life Support | FAST | Massive Transfusion Protocol | Damage Control Surgery</p>

      {/* Preset Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
        {(Object.values(TRAUMA_PRESETS)).map(p => (
          <button
            key={p.id}
            onClick={() => loadPreset(p.id)}
            className={`text-left p-2.5 rounded-lg border transition-all ${selectedPreset === p.id ? 'border-red-500 bg-red-950' : 'border-slate-700 bg-slate-900 hover:border-slate-500'}`}
          >
            <p className="text-xs font-bold text-slate-200 leading-tight">{p.title}</p>
            <p className="text-xs text-slate-500 mt-0.5 truncate">{p.mechanism}</p>
          </button>
        ))}
      </div>

      {/* Alarm Banner */}
      {nonOptimalAlarms.length > 0 && (
        <div className="mb-4 p-3 rounded-lg border border-red-600 bg-red-950 animate-pulse">
          <p className="text-xs font-bold text-red-300 mb-2">⚠ ACTIVE ALARMS</p>
          <div className="flex flex-wrap gap-1.5">
            {nonOptimalAlarms.map(a => (
              <span key={a} className={`text-xs px-2 py-0.5 rounded font-bold text-white ${alarmColor(a)}`}>
                {a.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        </div>
      )}
      {nonOptimalAlarms.length === 0 && (
        <div className="mb-4 p-2 rounded-lg border border-green-700 bg-green-950">
          <span className="text-xs text-green-400 font-bold">✓ STABLE — All ATLS parameters within acceptable range</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* LEFT: Controls */}
        <div className="space-y-4">
          {/* Hemorrhage Control */}
          <div className="border border-slate-700 rounded-lg p-3 bg-slate-900">
            <p className="text-xs font-bold text-red-300 mb-2 uppercase tracking-wide">Hemorrhage Quantification</p>
            <label className="text-xs text-slate-400">Estimated Blood Loss (mL)</label>
            <input type="range" min={0} max={4000} step={50}
              value={params.estimatedBloodLossML}
              onChange={e => setParams(p => ({ ...p, estimatedBloodLossML: Number(e.target.value) }))}
              className="w-full mt-1"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-0.5">
              <span>0 mL</span>
              <span className={`font-bold ${shockClassColor(liveData.shockClass)}`}>{params.estimatedBloodLossML} mL ({liveData.bloodLossPct.toFixed(0)}% EBV)</span>
              <span>4000 mL</span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-1.5">
              <div className={`col-span-2 text-center p-1.5 rounded border ${shockClassColor(liveData.shockClass)} border-current`}>
                <p className="text-xs font-black">{liveData.shockClass.replace('_', ' ')}</p>
                <p className="text-xs">Shock Index: {liveData.shockIndex.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Mechanism / Injury Toggles */}
          <div className="border border-slate-700 rounded-lg p-3 bg-slate-900">
            <p className="text-xs font-bold text-amber-300 mb-2 uppercase tracking-wide">Injury Toggles</p>
            {[
              { key: 'hasTensionPneumothorax', label: 'Tension Pneumothorax' },
              { key: 'hasCardiacTamponade',    label: 'Cardiac Tamponade' },
              { key: 'hasOpenPneumothorax',    label: 'Open Pneumothorax' },
              { key: 'hasMassiveHemothorax',   label: 'Massive Hemothorax' },
              { key: 'hasFlailChest',          label: 'Flail Chest' },
              { key: 'hasPelvicRingDisruption',label: 'Pelvic Ring Disruption' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer mb-1">
                <input type="checkbox"
                  checked={Boolean((params as unknown as Record<string, boolean>)[key])}
                  onChange={e => setParams(p => ({ ...p, [key]: e.target.checked }))}
                  className="accent-red-500"
                />
                {label}
              </label>
            ))}
          </div>

          {/* Temperature & GCS */}
          <div className="border border-slate-700 rounded-lg p-3 bg-slate-900">
            <p className="text-xs font-bold text-blue-300 mb-2 uppercase tracking-wide">Environment & Neuro</p>
            <label className="text-xs text-slate-400">Temperature (°C)</label>
            <input type="range" min={32} max={37.5} step={0.1}
              value={params.tempCelsius}
              onChange={e => setParams(p => ({ ...p, tempCelsius: parseFloat(e.target.value) }))}
              className="w-full mt-1"
            />
            <div className="flex justify-between text-xs text-slate-500">
              <span>32°C</span>
              <span className={params.tempCelsius < 35 ? 'text-blue-400 font-bold' : 'text-slate-300'}>{params.tempCelsius.toFixed(1)}°C</span>
              <span>37.5°C</span>
            </div>

            <label className="text-xs text-slate-400 mt-2 block">GCS Penalty (0 = baseline)</label>
            <input type="range" min={0} max={12} step={1}
              value={params.gcsPenalty}
              onChange={e => setParams(p => ({ ...p, gcsPenalty: Number(e.target.value) }))}
              className="w-full mt-1"
            />
            <div className="flex justify-between text-xs text-slate-500">
              <span>0</span>
              <span className={liveData.gcs <= 8 ? 'text-red-400 font-bold' : 'text-slate-300'}>GCS {liveData.gcs}</span>
              <span>12</span>
            </div>
          </div>

          {/* Interventions */}
          <div className="border border-slate-700 rounded-lg p-3 bg-slate-900">
            <p className="text-xs font-bold text-green-300 mb-2 uppercase tracking-wide">1-Click Interventions</p>
            <div className="grid grid-cols-1 gap-1.5">
              <button onClick={activateMTP} disabled={params.mtpActivated}
                className="text-xs px-2 py-1.5 rounded bg-red-800 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white">
                Activate MTP (1:1:1 pRBC:FFP:PLT)
              </button>
              <button onClick={enablePermissiveHypotension} disabled={params.permissiveHypotensionEnabled}
                className="text-xs px-2 py-1.5 rounded bg-amber-800 hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed text-white">
                Permissive Hypotension (MAP 50)
              </button>
              <button onClick={needleDecompress} disabled={!params.hasTensionPneumothorax}
                className="text-xs px-2 py-1.5 rounded bg-cyan-800 hover:bg-cyan-700 disabled:opacity-40 disabled:cursor-not-allowed text-white">
                Needle Decompression (2nd ICS MCL)
              </button>
              <button onClick={pericardiocentesis} disabled={!params.hasCardiacTamponade}
                className="text-xs px-2 py-1.5 rounded bg-purple-800 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white">
                Pericardiocentesis / ER Thoracotomy
              </button>
              <button onClick={placeChestTube} disabled={!params.hasMassiveHemothorax}
                className="text-xs px-2 py-1.5 rounded bg-teal-800 hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed text-white">
                Chest Tube (5th ICS MAL)
              </button>
              <button onClick={applyPelvicBinder} disabled={!params.hasPelvicRingDisruption}
                className="text-xs px-2 py-1.5 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed text-white">
                Apply Pelvic Binder + REBOA Zone III
              </button>
              <button onClick={warmPatient} disabled={params.tempCelsius >= 37.0}
                className="text-xs px-2 py-1.5 rounded bg-orange-800 hover:bg-orange-700 disabled:opacity-40 disabled:cursor-not-allowed text-white">
                Warm Blankets + Warm IV Fluids
              </button>
            </div>
          </div>
        </div>

        {/* CENTRE: Vitals + ABCDE */}
        <div className="space-y-4">
          {/* Trauma Bay Monitor */}
          <div className="border border-slate-600 rounded-lg p-3 bg-slate-900">
            <p className="text-xs font-bold text-slate-300 mb-2 uppercase tracking-wide">Trauma Bay Monitor</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'HR', value: `${liveData.hrBpm}`, unit: 'bpm', alarm: liveData.hrBpm > 130 || liveData.hrBpm < 40 },
                { label: 'SBP', value: `${liveData.sbpMmHg}`, unit: 'mmHg', alarm: liveData.sbpMmHg < 90 },
                { label: 'DBP', value: `${liveData.dbpMmHg}`, unit: 'mmHg', alarm: false },
                { label: 'MAP', value: `${liveData.mapMmHg}`, unit: 'mmHg', alarm: liveData.mapMmHg < 65 },
                { label: 'RR',  value: `${liveData.rrPerMin}`, unit: '/min', alarm: liveData.rrPerMin > 29 },
                { label: 'SpO2',value: `${liveData.spo2Pct}`, unit: '%', alarm: liveData.spo2Pct < 94 },
                { label: 'GCS', value: `${liveData.gcs}`, unit: '/15', alarm: liveData.gcs <= 8 },
                { label: 'Temp',value: `${liveData.tempCelsius.toFixed(1)}`, unit: '°C', alarm: liveData.tempCelsius < 35 },
                { label: 'SI',  value: `${liveData.shockIndex.toFixed(2)}`, unit: '', alarm: liveData.shockIndex > 1.0 },
              ].map(v => (
                <div key={v.label} className={`text-center p-1.5 rounded border ${v.alarm ? 'border-red-500 bg-red-950 animate-pulse' : 'border-slate-700 bg-slate-800'}`}>
                  <p className="text-xs text-slate-400">{v.label}</p>
                  <p className={`text-lg font-black leading-none ${v.alarm ? 'text-red-400' : 'text-white'}`}>{v.value}</p>
                  <p className="text-xs text-slate-500">{v.unit}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ABCDE Primary Survey */}
          <div className="border border-slate-700 rounded-lg p-3 bg-slate-900">
            <p className="text-xs font-bold text-slate-300 mb-2 uppercase tracking-wide">Primary Survey — ABCDE</p>
            <ABCDEPanel state={liveData} />
          </div>

          {/* Damage Control */}
          {liveData.damageControlIndicated && (
            <div className="border-2 border-red-500 rounded-lg p-3 bg-red-950">
              <p className="text-xs font-black text-red-300 mb-1">DAMAGE CONTROL SURGERY INDICATED</p>
              <p className="text-xs text-red-200">Lethal triad criteria met:</p>
              <ul className="text-xs text-red-300 mt-1 space-y-0.5">
                <li>• Temp {liveData.tempCelsius.toFixed(1)}°C &lt; 35°C — Hypothermia</li>
                <li>• Base Deficit {liveData.baseDeficitMeqL} — Acidosis</li>
                <li>• INR {liveData.inrCoag.toFixed(2)} — Coagulopathy</li>
              </ul>
              <p className="text-xs text-red-300 mt-1.5 font-bold">Protocol: Abbreviated laparotomy → ICU resuscitation → planned re-look 24–48h</p>
            </div>
          )}
        </div>

        {/* RIGHT: FAST + Labs + MTP */}
        <div className="space-y-4">
          {/* FAST eFAST Grid */}
          <div className="border border-slate-700 rounded-lg p-3 bg-slate-900">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-slate-300 uppercase tracking-wide">FAST / eFAST Exam</p>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${liveData.fastPositive ? 'bg-red-700 text-red-100' : 'bg-green-800 text-green-100'}`}>
                {liveData.fastPositive ? 'POSITIVE' : 'NEGATIVE'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {liveData.fastFindings.map(f => (
                <div key={f.view} className="space-y-1">
                  <div className="h-16 rounded overflow-hidden border border-slate-700">
                    <FASTUltrasoundView view={f.view} result={f.result} fluidDepthMm={f.fluidDepthMm} />
                  </div>
                  <p className={`text-xs text-center font-bold ${fastResultColor(f.result)}`}>{f.result}</p>
                  <p className="text-xs text-slate-500 text-center leading-tight">
                    {f.view === 'MORISON_POUCH' ? "Morison's" : f.view === 'SPLENORENAL' ? 'Splenorenal' : f.view === 'PELVIC_POUCH_OF_DOUGLAS' ? 'Pelvis' : f.view === 'PERICARDIAL_SUBXIPHOID' ? 'Pericardial' : f.view === 'RIGHT_PLEURAL' ? 'R Pleural' : 'L Pleural'}
                  </p>
                </div>
              ))}
            </div>
            {/* FAST toggle controls */}
            <div className="mt-2 flex flex-wrap gap-1">
              {(['MORISON_POUCH','SPLENORENAL','PELVIC_POUCH_OF_DOUGLAS','PERICARDIAL_SUBXIPHOID','RIGHT_PLEURAL','LEFT_PLEURAL'] as FASTView[]).map(v => {
                const isActive = params.fastPositiveViews.includes(v);
                return (
                  <button key={v} onClick={() => setParams(p => ({
                    ...p,
                    fastPositiveViews: isActive ? p.fastPositiveViews.filter(x => x !== v) : [...p.fastPositiveViews, v]
                  }))}
                    className={`text-xs px-1.5 py-0.5 rounded border ${isActive ? 'border-red-500 bg-red-900 text-red-200' : 'border-slate-600 text-slate-400 hover:border-slate-400'}`}>
                    {v === 'MORISON_POUCH' ? "M's" : v === 'SPLENORENAL' ? 'SR' : v === 'PELVIC_POUCH_OF_DOUGLAS' ? 'Pelv' : v === 'PERICARDIAL_SUBXIPHOID' ? 'Peri' : v === 'RIGHT_PLEURAL' ? 'R Pl' : 'L Pl'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Labs */}
          <div className="border border-slate-700 rounded-lg p-3 bg-slate-900">
            <p className="text-xs font-bold text-slate-300 mb-2 uppercase tracking-wide">Trauma Labs</p>
            <div className="space-y-1">
              {[
                { label: 'Hemoglobin', value: `${liveData.hemoglobinGdL.toFixed(1)} g/dL`, alarm: liveData.hemoglobinGdL < 7 },
                { label: 'Lactate',    value: `${liveData.lactateMmolL.toFixed(1)} mmol/L`, alarm: liveData.lactateMmolL > 2 },
                { label: 'Base Deficit', value: `${liveData.baseDeficitMeqL} mEq/L`, alarm: liveData.baseDeficitMeqL < -6 },
                { label: 'INR',        value: `${liveData.inrCoag.toFixed(2)}`, alarm: liveData.inrCoag > 1.5 },
                { label: 'Fibrinogen', value: `${liveData.fibrinogenMgDl} mg/dL`, alarm: liveData.fibrinogenMgDl < 200 },
                { label: 'iCa²⁺',     value: `${liveData.ionizedCalciumMmolL.toFixed(2)} mmol/L`, alarm: liveData.ionizedCalciumMmolL < 1.0 },
              ].map(lab => (
                <div key={lab.label} className={`flex justify-between text-xs px-2 py-1 rounded ${lab.alarm ? 'bg-red-950 text-red-300' : 'bg-slate-800 text-slate-300'}`}>
                  <span>{lab.label}</span>
                  <span className={`font-bold ${lab.alarm ? 'text-red-400' : ''}`}>{lab.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* MTP Dashboard */}
          <div className={`border rounded-lg p-3 ${liveData.mtp.activated ? 'border-red-600 bg-red-950' : 'border-slate-700 bg-slate-900'}`}>
            <p className="text-xs font-bold text-slate-300 mb-2 uppercase tracking-wide">
              Massive Transfusion Protocol {liveData.mtp.activated ? '— ACTIVE' : '— STANDBY'}
            </p>
            {[
              { label: 'pRBC', value: liveData.mtp.prbcUnitsGiven, unit: 'units', target: '6 units initial pack' },
              { label: 'FFP',  value: liveData.mtp.ffpUnitsGiven,  unit: 'units', target: '1:1 ratio with pRBC' },
              { label: 'Platelets', value: liveData.mtp.plateletsUnitsGiven, unit: 'apheresis', target: '1:1 per 6 pRBC' },
              { label: 'Cryo', value: liveData.mtp.cryoprecipitateUnitsGiven, unit: 'units', target: 'if Fib <200 mg/dL' },
            ].map(item => (
              <div key={item.label} className="flex justify-between text-xs py-0.5">
                <span className="text-slate-400">{item.label}</span>
                <span className={`font-bold ${item.value > 0 ? 'text-red-300' : 'text-slate-500'}`}>{item.value} {item.unit}</span>
              </div>
            ))}
            <div className="mt-1.5 space-y-0.5">
              <div className={`text-xs px-2 py-0.5 rounded ${liveData.mtp.txa1gGiven ? 'bg-green-900 text-green-300' : 'bg-slate-800 text-slate-500'}`}>
                TXA 1g IV: {liveData.mtp.txa1gGiven ? 'GIVEN (&lt;3h from injury)' : 'Not given'}
              </div>
            </div>
          </div>

          {/* AI Tutor */}
          <button onClick={openSocraticAI}
            className="w-full text-xs px-3 py-2 rounded border border-red-700 bg-red-900 hover:bg-red-800 text-red-100 font-bold">
            Ask Socratic AI Tutor — ATLS Teaching Points
          </button>
        </div>
      </div>
    </div>
  );
}
