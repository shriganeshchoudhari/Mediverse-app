'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Baby,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Droplets,
  Microscope,
  ShieldAlert,
  ChevronRight,
  Clock,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import {
  HdfnPatientInput,
  evaluateHdfnCase,
  HDFN_PRESETS,
} from '../../.gemini/skills/HdfnRhogamKleihauerEngine';

export default function HdfnRhogamSimulator() {
  const [maternalRh, setMaternalRh] = useState<'RH_NEGATIVE' | 'RH_POSITIVE'>('RH_NEGATIVE');
  const [fetalRh, setFetalRh] = useState<'RH_POSITIVE' | 'RH_NEGATIVE' | 'UNKNOWN'>('RH_POSITIVE');
  const [gestationalWeeks, setGestationalWeeks] = useState<number>(34);
  const [antiDTiter, setAntiDTiter] = useState<number>(0);
  const [rosettePositive, setRosettePositive] = useState<boolean>(true);
  const [kbFetalCells, setKbFetalCells] = useState<number>(36);
  const [mcaPsv, setMcaPsv] = useState<number>(58);
  const [hydropsSigns, setHydropsSigns] = useState<boolean>(false);
  const [hoursPostEvent, setHoursPostEvent] = useState<number>(6);

  const currentInput: HdfnPatientInput = useMemo(
    () => ({
      maternalRhType: maternalRh,
      fetalRhType: fetalRh,
      gestationalWeeks,
      maternalAntiDTiter: antiDTiter,
      rosetteScreenPositive: rosettePositive,
      kbFetalCellsCounted: kbFetalCells,
      kbTotalCellsCounted: 2000,
      fetalMcaPsvCmSec: mcaPsv,
      fetalAscitesOrEffusion: hydropsSigns,
      hoursPostDeliveryOrEvent: hoursPostEvent,
    }),
    [
      maternalRh,
      fetalRh,
      gestationalWeeks,
      antiDTiter,
      rosettePositive,
      kbFetalCells,
      mcaPsv,
      hydropsSigns,
      hoursPostEvent,
    ]
  );

  const metrics = useMemo(() => evaluateHdfnCase(currentInput), [currentInput]);

  const applyPreset = (presetId: string) => {
    const p = HDFN_PRESETS.find((item) => item.id === presetId);
    if (!p) return;
    setMaternalRh(p.input.maternalRhType);
    setFetalRh(p.input.fetalRhType);
    setGestationalWeeks(p.input.gestationalWeeks);
    setAntiDTiter(p.input.maternalAntiDTiter);
    setRosettePositive(p.input.rosetteScreenPositive);
    setKbFetalCells(p.input.kbFetalCellsCounted);
    setMcaPsv(p.input.fetalMcaPsvCmSec);
    setHydropsSigns(p.input.fetalAscitesOrEffusion);
    setHoursPostEvent(p.input.hoursPostDeliveryOrEvent);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 tracking-wider uppercase mb-1">
              <Baby className="w-4 h-4 text-rose-400" />
              Maternal-Fetal Medicine &amp; Transfusion Immunohematology
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Hemolytic Disease of the Fetus &amp; Newborn (HDFN) &amp; RhIg Workstation
            </h1>
            <p className="text-slate-400 text-xs md:text-sm mt-1 max-w-3xl">
              Model RhD alloimmunization, Kleihauer-Betke acid-elution fetomaternal hemorrhage (FMH) quantification,
              AABB precision RhoGAM dosing, and Fetal Middle Cerebral Artery (MCA) Doppler PSV screening for severe anemia.
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
            <Activity className="w-3.5 h-3.5 text-rose-400" />
            Obstetric &amp; Immunohematology Clinical Presets
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
            {HDFN_PRESETS.map((p) => {
              const isActive =
                maternalRh === p.input.maternalRhType &&
                antiDTiter === p.input.maternalAntiDTiter &&
                kbFetalCells === p.input.kbFetalCellsCounted;
              return (
                <button
                  key={p.id}
                  onClick={() => applyPreset(p.id)}
                  className={`flex flex-col text-left p-2.5 rounded-xl border text-xs transition duration-150 ${
                    isActive
                      ? 'bg-rose-950/50 border-rose-500/80 text-white shadow-lg shadow-rose-950/50'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <span className="font-bold truncate text-[11px] text-rose-300">{p.name}</span>
                  <span className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-tight">
                    {p.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Workstation 3-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Column 1: Maternal-Fetal Serology & Immunohematology (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Droplets className="w-4 h-4 text-rose-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Maternal-Fetal Serology Profile
                </h2>
              </div>

              {/* Maternal Rh Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Maternal RhD Type:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setMaternalRh('RH_NEGATIVE')}
                    className={`py-1.5 rounded-lg border text-xs font-bold transition ${
                      maternalRh === 'RH_NEGATIVE'
                        ? 'bg-rose-600 border-rose-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    RhD-Negative (dd)
                  </button>
                  <button
                    onClick={() => setMaternalRh('RH_POSITIVE')}
                    className={`py-1.5 rounded-lg border text-xs font-bold transition ${
                      maternalRh === 'RH_POSITIVE'
                        ? 'bg-emerald-600 border-emerald-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    RhD-Positive (D+)
                  </button>
                </div>
              </div>

              {/* Fetal Rh Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Fetal / Neonatal RhD:</label>
                <div className="grid grid-cols-3 gap-1.5 text-xs">
                  {(['RH_POSITIVE', 'RH_NEGATIVE', 'UNKNOWN'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setFetalRh(type)}
                      className={`py-1 rounded-lg border font-semibold ${
                        fetalRh === type
                          ? 'bg-indigo-600 border-indigo-500 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {type.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gestational Weeks */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Gestational Age:</span>
                  <strong className="text-white font-mono">{gestationalWeeks} weeks</strong>
                </div>
                <input
                  type="range"
                  min="20"
                  max="41"
                  step="1"
                  value={gestationalWeeks}
                  onChange={(e) => setGestationalWeeks(Number(e.target.value))}
                  className="w-full accent-rose-400 cursor-pointer"
                />
              </div>

              {/* Anti-D Indirect Coombs Titer */}
              <div className="space-y-1 pt-1 border-t border-slate-800">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Maternal Anti-D Titer:</span>
                  <strong
                    className={`font-mono ${
                      antiDTiter >= 16 ? 'text-rose-400 font-bold' : 'text-emerald-400'
                    }`}
                  >
                    {antiDTiter === 0 ? 'Negative (0)' : `1:${antiDTiter}`}
                  </strong>
                </div>
                <div className="grid grid-cols-5 gap-1 text-xs">
                  {[0, 4, 8, 16, 64].map((val) => (
                    <button
                      key={val}
                      onClick={() => setAntiDTiter(val)}
                      className={`py-1 rounded border font-mono ${
                        antiDTiter === val
                          ? 'bg-rose-700 border-rose-600 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {val === 0 ? '0' : `1:${val}`}
                    </button>
                  ))}
                </div>
                {antiDTiter >= 16 && (
                  <div className="text-[10px] text-rose-300 font-semibold mt-1">
                    CRITICAL TITER (&gt;= 1:16): Patient is sensitized. RhIg will be ineffective!
                  </div>
                )}
              </div>

              {/* Timing Post-Delivery / Event */}
              <div className="space-y-1 pt-1 border-t border-slate-800">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Time Post-Delivery/Bleed:</span>
                  <strong
                    className={`font-mono ${
                      hoursPostEvent > 72 ? 'text-amber-400 font-bold' : 'text-white'
                    }`}
                  >
                    {hoursPostEvent} hours {hoursPostEvent > 72 ? '(Delayed &gt; 72h)' : ''}
                  </strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max="96"
                  step="6"
                  value={hoursPostEvent}
                  onChange={(e) => setHoursPostEvent(Number(e.target.value))}
                  className="w-full accent-rose-400 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Column 2: Kleihauer-Betke Microscopy & Fetal MCA Doppler (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            {/* Kleihauer-Betke Microscopy Panel */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Microscope className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Kleihauer-Betke Acid-Elution Smear
                  </span>
                </div>
                <span className="text-xs font-mono text-cyan-300">
                  {metrics.fetalCellsPercentage}% Fetal
                </span>
              </div>

              {/* Simulated Oil Immersion Field SVG */}
              <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 flex flex-col items-center">
                <div className="text-[10px] text-slate-400 mb-1.5 flex justify-between w-full">
                  <span>Ghost cells: Adult HbA (Eluted)</span>
                  <span className="text-pink-400 font-bold">Dark Pink: Fetal HbF (Acid-Resistant)</span>
                </div>
                <svg viewBox="0 0 240 110" className="w-full h-28 border border-slate-800/80 rounded-lg bg-slate-950">
                  {/* Maternal Ghost Cells (faint gray outlines) */}
                  {[
                    [20, 20], [50, 30], [80, 25], [110, 35], [140, 20], [170, 30], [200, 25],
                    [30, 60], [60, 70], [90, 65], [120, 80], [150, 60], [180, 75], [210, 60],
                    [40, 95], [75, 95], [105, 98], [135, 95], [165, 98], [195, 95]
                  ].map(([x, y], idx) => (
                    <circle key={`ghost-${idx}`} cx={x} cy={y} r="8" fill="none" stroke="#64748b" strokeWidth="1.2" opacity="0.6" />
                  ))}

                  {/* Fetal HbF Cells (dense dark pink) */}
                  {Array.from({ length: Math.min(12, Math.round(kbFetalCells / 3)) }).map((_, i) => {
                    const cx = 35 + (i * 18) % 190;
                    const cy = 25 + Math.floor(i / 5) * 35;
                    return (
                      <circle
                        key={`fetal-${i}`}
                        cx={cx}
                        cy={cy}
                        r="8.5"
                        fill="#ec4899"
                        stroke="#be185d"
                        strokeWidth="1.5"
                      />
                    );
                  })}
                </svg>

                {/* Fetal Cell Count Slider */}
                <div className="w-full mt-3 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Fetal Cells (per 2000 total):</span>
                    <strong className="text-pink-400 font-mono">{kbFetalCells} / 2000</strong>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="60"
                    step="2"
                    value={kbFetalCells}
                    onChange={(e) => setKbFetalCells(Number(e.target.value))}
                    className="w-full accent-pink-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>FMH Volume:</span>
                    <strong className="text-white font-mono">{metrics.fetomaternalHemorrhageVolumeMl} mL whole blood</strong>
                  </div>
                </div>
              </div>

              {/* Fetal MCA Doppler Waveform & MoM Calculation */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Fetal MCA Doppler Peak Velocity
                  </span>
                  <span
                    className={`text-xs font-mono font-bold ${
                      metrics.fetalMcaMom >= 1.50 ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    {metrics.fetalMcaMom} MoM
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">MCA PSV:</span>
                    <strong className="text-white font-mono">{mcaPsv} cm/s</strong>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="90"
                    step="2"
                    value={mcaPsv}
                    onChange={(e) => setMcaPsv(Number(e.target.value))}
                    className="w-full accent-rose-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Median for {gestationalWeeks}w:</span>
                    <span>{metrics.fetalMcaMedianCmSec} cm/s (1.50 MoM = {Math.round(metrics.fetalMcaMedianCmSec * 1.5)} cm/s)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-slate-400">Hydrops Fetalis Signs (Ascites/Effusion):</span>
                  <button
                    onClick={() => setHydropsSigns(!hydropsSigns)}
                    className={`px-2 py-0.5 rounded border text-xs font-semibold ${
                      hydropsSigns
                        ? 'bg-rose-600 border-rose-500 text-white animate-pulse'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    {hydropsSigns ? 'HYDROPS PRESENT' : 'NONE'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: AABB Dosing Solver & Clinical Management (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  AABB Precision Dosing
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    metrics.urgencyStatus === 'FETAL_EMERGENCY_IUT'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                      : metrics.isCandidateForRhIg
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {metrics.urgencyStatus.replace(/_/g, ' ')}
                </span>
              </div>

              {/* Dosing Display Card */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Recommended RhIg Dose:</span>
                  <strong className="text-2xl font-black text-rose-400">
                    {metrics.recommendedRhIgVials} {metrics.recommendedRhIgVials === 1 ? 'Vial' : 'Vials'}
                  </strong>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800/80">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Micrograms:</span>
                    <strong className="text-white font-mono">{metrics.recommendedRhIgMicrograms} µg</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">International Units:</span>
                    <strong className="text-white font-mono">{metrics.recommendedRhIgIu} IU</strong>
                  </div>
                </div>

                {/* Mathematical Steps Box */}
                <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 text-[11px] space-y-1 font-mono text-slate-300">
                  <div className="text-cyan-400 font-bold">AABB Dosing Math:</div>
                  <div>FMH = {metrics.fetalCellsPercentage}% × 50 = {metrics.fetomaternalHemorrhageVolumeMl} mL</div>
                  <div>Raw Vials = {metrics.fetomaternalHemorrhageVolumeMl} / 30 = {metrics.calculatedRhIgVialsRaw}</div>
                  <div>Rule: Round + 1 Safety Vial = {metrics.recommendedRhIgVials} vials</div>
                </div>
              </div>

              {/* Fetal Status & Anemia Alert */}
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  Fetal Anemia Assessment
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">MCA Doppler MoM:</span>
                    <strong className={metrics.fetalMcaMom >= 1.50 ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                      {metrics.fetalMcaMom} MoM
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Severity:</span>
                    <strong className="text-white font-bold">{metrics.fetalAnemiaSeverity.replace(/_/g, ' ')}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Intrauterine Transfusion:</span>
                    <strong className={metrics.intrauterineTransfusionIndicated ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                      {metrics.intrauterineTransfusionIndicated ? 'STAT IUT INDICATED' : 'Not Required'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Clinical Action Checklist */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  Clinical Action Protocol
                </div>

                <div className="space-y-1">
                  {metrics.clinicalActionChecklist.map((act, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-200"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-rose-400 mt-0.5 shrink-0" />
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
