'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Wind,
  ShieldAlert,
  Sparkles,
  Zap,
  Flame,
  Gauge,
  ArrowRight,
  TrendingDown,
  Compass,
} from 'lucide-react';
import {
  ArdsPatientInput,
  PatientGender,
  computeArdsMechanics,
  ARDS_PRESETS,
} from '../../.gemini/skills/ArdsMechanicsEngine';

export default function ArdsSimulator() {
  const [gender, setGender] = useState<PatientGender>('MALE');
  const [heightCm, setHeightCm] = useState<number>(178);
  const [weightKg, setWeightKg] = useState<number>(82);

  // Oxygenation & ABG
  const [pao2, setPao2] = useState<number>(62);
  const [fio2, setFio2] = useState<number>(80);
  const [ph, setPh] = useState<number>(7.28);
  const [bicarbonate, setBicarbonate] = useState<number>(19);

  // Ventilator Settings & Pressures
  const [vt, setVt] = useState<number>(520);
  const [rr, setRr] = useState<number>(28);
  const [peep, setPeep] = useState<number>(14);
  const [pplat, setPplat] = useState<number>(34);
  const [ppeak, setPpeak] = useState<number>(42);

  // Clinical Context
  const [timingValid, setTimingValid] = useState<boolean>(true);
  const [bilateralInfiltrates, setBilateralInfiltrates] = useState<boolean>(true);
  const [vasopressor, setVasopressor] = useState<boolean>(true);
  const [proneActive, setProneActive] = useState<boolean>(false);

  const currentInput: ArdsPatientInput = useMemo(
    () => ({
      gender,
      heightCm,
      actualWeightKg: weightKg,
      pao2MmHg: pao2,
      fio2Percent: fio2,
      arterialBloodPh: ph,
      serumBicarbonateMeqL: bicarbonate,
      tidalVolumeMl: vt,
      respiratoryRateBpm: rr,
      peepCmH2o: peep,
      plateauPressureCmH2o: pplat,
      peakInspiratoryPressureCmH2o: ppeak,
      timingWithinOneWeek: timingValid,
      bilateralInfiltratesNotCardiac: bilateralInfiltrates,
      vasopressorRequired: vasopressor,
      pronePositioningActive: proneActive,
    }),
    [
      gender,
      heightCm,
      weightKg,
      pao2,
      fio2,
      ph,
      bicarbonate,
      vt,
      rr,
      peep,
      pplat,
      ppeak,
      timingValid,
      bilateralInfiltrates,
      vasopressor,
      proneActive,
    ]
  );

  const metrics = useMemo(() => computeArdsMechanics(currentInput), [currentInput]);

  const applyPreset = (presetId: string) => {
    const p = ARDS_PRESETS.find((item) => item.id === presetId);
    if (!p) return;
    setGender(p.input.gender);
    setHeightCm(p.input.heightCm);
    setWeightKg(p.input.actualWeightKg);
    setPao2(p.input.pao2MmHg);
    setFio2(p.input.fio2Percent);
    setPh(p.input.arterialBloodPh);
    setBicarbonate(p.input.serumBicarbonateMeqL);
    setVt(p.input.tidalVolumeMl);
    setRr(p.input.respiratoryRateBpm);
    setPeep(p.input.peepCmH2o);
    setPplat(p.input.plateauPressureCmH2o);
    setPpeak(p.input.peakInspiratoryPressureCmH2o);
    setTimingValid(p.input.timingWithinOneWeek);
    setBilateralInfiltrates(p.input.bilateralInfiltratesNotCardiac);
    setVasopressor(p.input.vasopressorRequired);
    setProneActive(p.input.pronePositioningActive);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Breadcrumbs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 uppercase tracking-wider mb-1">
              <Link href="/simulators" className="hover:underline">
                Simulators
              </Link>
              <span>/</span>
              <span>Pulmonology &amp; Critical Care</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              <Wind className="w-8 h-8 text-cyan-400 animate-pulse" />
              ARDS Berlin Phenotyping, Driving Pressure &amp; Mechanical Power Workstation
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              Precision lung-protective mechanical ventilation, Amato driving pressure solver, Gattinoni mechanical power ergotrauma calculator, and PROSEVA prone positioning titration.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 rounded-full text-xs font-semibold">
              Berlin Definition (2012/2023)
            </span>
            <span className="px-3 py-1 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 rounded-full text-xs font-semibold">
              NEJM Amato Driving Pressure
            </span>
            <span className="px-3 py-1 bg-amber-950/80 border border-amber-500/40 text-amber-300 rounded-full text-xs font-semibold">
              Track A54
            </span>
          </div>
        </div>

        {/* Clinical Presets */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Standard Clinical Cases &amp; Ventilator Scenarios
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {ARDS_PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => applyPreset(p.id)}
                className="text-left p-3 rounded-lg border border-slate-800 bg-slate-950/60 hover:border-cyan-500/50 hover:bg-slate-800/60 transition group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-400">
                    {p.name}
                  </span>
                </div>
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 mb-1 border border-slate-700">
                  {p.badge}
                </span>
                <p className="text-[11px] text-slate-400 line-clamp-2">
                  {p.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Controls (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Patient Demographics & PBW Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-sky-400" />
                  Demographics &amp; Predicted Body Weight
                </span>
                <span className="font-mono text-xs font-bold text-emerald-400">
                  PBW: {metrics.predictedBodyWeightKg} kg
                </span>
              </h2>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-xs text-slate-300 block mb-1 font-semibold">Biological Sex:</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setGender('MALE')}
                      className={`p-2 rounded text-xs font-bold border transition ${
                        gender === 'MALE'
                          ? 'bg-sky-950 border-sky-500 text-sky-200'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      Male
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender('FEMALE')}
                      className={`p-2 rounded text-xs font-bold border transition ${
                        gender === 'FEMALE'
                          ? 'bg-pink-950 border-pink-500 text-pink-200'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      Female
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                    <span>Height:</span>
                    <span className="font-mono text-slate-200 font-bold">{heightCm} cm</span>
                  </div>
                  <input
                    type="range"
                    min="140"
                    max="205"
                    step="1"
                    value={heightCm}
                    onChange={(e) => setHeightCm(Number(e.target.value))}
                    className="w-full accent-sky-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                  <span>Actual Body Weight:</span>
                  <span className="font-mono text-slate-300">{weightKg} kg (Do NOT use for Vt!)</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="140"
                  step="1"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full accent-slate-400"
                />
              </div>
            </div>

            {/* Ventilator Settings & Pressures Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-cyan-400" />
                  Ventilator Settings &amp; Pressures
                </span>
                <span className={`text-xs font-mono font-bold ${
                  metrics.tidalVolumeMlPerKgPbw > 6.5 ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  {metrics.tidalVolumeMlPerKgPbw} mL/kg PBW
                </span>
              </h2>

              {/* Tidal Volume */}
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                  <span>Tidal Volume (Vt):</span>
                  <span className="font-mono text-cyan-400 font-bold">
                    {vt} mL ({metrics.tidalVolumeMlPerKgPbw} mL/kg PBW)
                  </span>
                </div>
                <input
                  type="range"
                  min="240"
                  max="700"
                  step="10"
                  value={vt}
                  onChange={(e) => setVt(Number(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>

              {/* Respiratory Rate */}
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                  <span>Respiratory Rate:</span>
                  <span className="font-mono text-slate-200 font-bold">{rr} breaths/min</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="38"
                  step="1"
                  value={rr}
                  onChange={(e) => setRr(Number(e.target.value))}
                  className="w-full accent-slate-400"
                />
              </div>

              {/* PEEP & Plateau Pressure */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                    <span>PEEP:</span>
                    <span className="font-mono text-cyan-400 font-bold">{peep} cmH2O</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="24"
                    step="1"
                    value={peep}
                    onChange={(e) => setPeep(Number(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                    <span>Plateau Pressure (Pplat):</span>
                    <span className={`font-mono font-bold ${pplat > 30 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {pplat} cmH2O
                    </span>
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="45"
                    step="1"
                    value={pplat}
                    onChange={(e) => setPplat(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>
              </div>

              {/* Peak Pressure & FiO2 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                    <span>Peak Pressure (Ppeak):</span>
                    <span className="font-mono text-slate-300 font-bold">{ppeak} cmH2O</span>
                  </div>
                  <input
                    type="range"
                    min="16"
                    max="55"
                    step="1"
                    value={ppeak}
                    onChange={(e) => setPpeak(Number(e.target.value))}
                    className="w-full accent-slate-400"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                    <span>FiO2:</span>
                    <span className="font-mono text-amber-400 font-bold">{fio2}%</span>
                  </div>
                  <input
                    type="range"
                    min="21"
                    max="100"
                    step="5"
                    value={fio2}
                    onChange={(e) => setFio2(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Oxygenation & Blood Gas Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  Gas Exchange &amp; Clinical Criteria
                </span>
                <span className="font-mono text-xs font-bold text-cyan-400">
                  P/F: {metrics.pao2Fio2Ratio}
                </span>
              </h2>

              {/* PaO2 */}
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                  <span>Arterial PaO2:</span>
                  <span className="font-mono text-cyan-400 font-bold">{pao2} mmHg</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="220"
                  step="2"
                  value={pao2}
                  onChange={(e) => setPao2(Number(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>

              {/* pH & Bicarbonate */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                    <span>pH:</span>
                    <span className="font-mono text-purple-400 font-bold">{ph.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="7.08"
                    max="7.48"
                    step="0.01"
                    value={ph}
                    onChange={(e) => setPh(Number(e.target.value))}
                    className="w-full accent-purple-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                    <span>HCO3-:</span>
                    <span className="font-mono text-slate-300 font-bold">{bicarbonate} mEq/L</span>
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="32"
                    step="1"
                    value={bicarbonate}
                    onChange={(e) => setBicarbonate(Number(e.target.value))}
                    className="w-full accent-slate-400"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="pt-2 border-t border-slate-800 space-y-2 text-xs">
                <label className="flex items-center justify-between p-2 rounded bg-slate-950/50 border border-slate-800 cursor-pointer">
                  <span className="text-slate-300">Timing &le; 1 Week of Clinical Insult</span>
                  <input
                    type="checkbox"
                    checked={timingValid}
                    onChange={(e) => setTimingValid(e.target.checked)}
                    className="w-4 h-4 accent-cyan-500 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded bg-slate-950/50 border border-slate-800 cursor-pointer">
                  <span className="text-slate-300">Bilateral Infiltrates (Not Cardiogenic)</span>
                  <input
                    type="checkbox"
                    checked={bilateralInfiltrates}
                    onChange={(e) => setBilateralInfiltrates(e.target.checked)}
                    className="w-4 h-4 accent-cyan-500 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded bg-slate-950/50 border border-slate-800 cursor-pointer">
                  <span className="text-slate-300">Vasopressor Infusion Active (Sepsis/Shock)</span>
                  <input
                    type="checkbox"
                    checked={vasopressor}
                    onChange={(e) => setVasopressor(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded bg-slate-950/50 border border-slate-800 cursor-pointer">
                  <span className="text-emerald-300 font-semibold">Prone Positioning Currently Active</span>
                  <input
                    type="checkbox"
                    checked={proneActive}
                    onChange={(e) => setProneActive(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 rounded"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Output Metrics & Guidelines (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Berlin Severity */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
                <div className="text-[11px] text-slate-400 uppercase font-semibold">Berlin ARDS Tier</div>
                <div className={`text-lg font-black mt-1 ${
                  metrics.berlinSeverity === 'SEVERE_ARDS'
                    ? 'text-rose-400'
                    : metrics.berlinSeverity === 'MODERATE_ARDS'
                    ? 'text-amber-400'
                    : metrics.berlinSeverity === 'MILD_ARDS'
                    ? 'text-cyan-400'
                    : 'text-slate-400'
                }`}>
                  {metrics.berlinSeverity.replace(/_/g, ' ')}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  P/F Ratio: {metrics.pao2Fio2Ratio}
                </div>
              </div>

              {/* Driving Pressure */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
                <div className="text-[11px] text-slate-400 uppercase font-semibold">Driving Pressure (ΔP)</div>
                <div className={`text-2xl font-black font-mono mt-1 ${
                  metrics.drivingPressureRisk === 'CRITICAL_LUNG_STRESS'
                    ? 'text-rose-400 animate-pulse'
                    : metrics.drivingPressureRisk === 'ELEVATED_VILI_RISK'
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}>
                  {metrics.drivingPressureCmH2o} <span className="text-xs font-normal">cmH2O</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  Safe Target: &le; 14 cmH2O
                </div>
              </div>

              {/* Respiratory Compliance */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
                <div className="text-[11px] text-slate-400 uppercase font-semibold">Compliance (Crs)</div>
                <div className={`text-xl font-bold font-mono mt-1 ${
                  metrics.complianceRespiratorySystemMlCmH2o < 30 ? 'text-rose-400' : 'text-cyan-400'
                }`}>
                  {metrics.complianceRespiratorySystemMlCmH2o} <span className="text-xs font-normal">mL/cmH2O</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  Normal: 50-80 mL/cmH2O
                </div>
              </div>

              {/* Mechanical Power */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
                <div className="text-[11px] text-slate-400 uppercase font-semibold">Mechanical Power</div>
                <div className={`text-xl font-bold font-mono mt-1 ${
                  metrics.mechanicalPowerRisk === 'ERGOTRAUMA_HIGH_VILI'
                    ? 'text-rose-400'
                    : metrics.mechanicalPowerRisk === 'BORDERLINE'
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}>
                  {metrics.mechanicalPowerJoulesMin} <span className="text-xs font-normal">J/min</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  Threshold: &le; 17 J/min
                </div>
              </div>
            </div>

            {/* Driving Pressure & Ventilator Stress Meter */}
            <div className={`border rounded-xl p-5 space-y-3 ${
              metrics.drivingPressureRisk === 'CRITICAL_LUNG_STRESS'
                ? 'bg-rose-950/40 border-rose-500'
                : metrics.drivingPressureRisk === 'ELEVATED_VILI_RISK'
                ? 'bg-amber-950/30 border-amber-600/50'
                : 'bg-emerald-950/20 border-emerald-500/40'
            }`}>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Gauge className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                    Driving Pressure (ΔP) &amp; Lung Stress Biomechanics
                  </h3>
                </div>
                <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                  metrics.drivingPressureRisk === 'CRITICAL_LUNG_STRESS'
                    ? 'bg-rose-600 text-white animate-bounce'
                    : metrics.drivingPressureRisk === 'ELEVATED_VILI_RISK'
                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}>
                  {metrics.drivingPressureRisk.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Low Stress (&le; 14 cmH2O)</span>
                  <span>Elevated (15-18 cmH2O)</span>
                  <span>Critical Stress (&gt; 18 cmH2O)</span>
                </div>
                <div className="h-3.5 w-full bg-slate-800 rounded-full overflow-hidden relative">
                  <div
                    style={{ width: `${Math.min(100, (metrics.drivingPressureCmH2o / 25) * 100)}%` }}
                    className={`h-full transition-all duration-300 ${
                      metrics.drivingPressureCmH2o > 18
                        ? 'bg-rose-500'
                        : metrics.drivingPressureCmH2o > 14
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                  />
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                Amato et al. (NEJM 2015) multi-trial mediation analysis established that <strong>driving pressure (Pplat &minus; PEEP = Vt / Crs)</strong> is the primary physiological determinant of mortality in ARDS. Reductions in driving pressure associate with significantly improved survival, even when tidal volume is already reduced.
              </p>
            </div>

            {/* Evidence-Based Escalation Matrix (PROSEVA & EOLIA) */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-400" />
                  <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                    Evidence-Based Advanced ARDS Escalation Matrix
                  </h3>
                </div>
                <span className="text-xs text-slate-400">Trial Validated Protocols</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {/* Prone Positioning (PROSEVA) */}
                <div className={`p-3 rounded-lg border ${
                  metrics.pronePositioningIndicated
                    ? 'bg-emerald-950/40 border-emerald-600 text-emerald-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400'
                }`}>
                  <div className="font-bold flex items-center justify-between">
                    <span>Prone Positioning:</span>
                    <span className="text-[10px] uppercase font-bold">
                      {metrics.pronePositioningIndicated ? 'INDICATED' : 'NOT INDICATED'}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] leading-tight">
                    PROSEVA Protocol: &ge; 16h/day for P/F &lt; 150 (PEEP &ge; 10, FiO2 &ge; 0.60). Decreases 28-day mortality from 32.8% to 16.0%.
                  </p>
                </div>

                {/* Neuromuscular Blockade (ACURASYS) */}
                <div className={`p-3 rounded-lg border ${
                  metrics.paralyticInfusionIndicated
                    ? 'bg-amber-950/40 border-amber-600 text-amber-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400'
                }`}>
                  <div className="font-bold flex items-center justify-between">
                    <span>Neuromuscular Block:</span>
                    <span className="text-[10px] uppercase font-bold">
                      {metrics.paralyticInfusionIndicated ? 'RECOMMENDED' : 'NOT INDICATED'}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] leading-tight">
                    ACURASYS Trial: 48h cisatracurium infusion to eliminate pendelluft, abolish dyssynchrony, and reduce barotrauma.
                  </p>
                </div>

                {/* VV-ECMO Referral (EOLIA) */}
                <div className={`p-3 rounded-lg border ${
                  metrics.vvEcmoConsiderationIndicated
                    ? 'bg-rose-950/50 border-rose-500 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400'
                }`}>
                  <div className="font-bold flex items-center justify-between">
                    <span>VV-ECMO Referral:</span>
                    <span className="text-[10px] uppercase font-bold">
                      {metrics.vvEcmoConsiderationIndicated ? 'CONSULT ECMO' : 'RESERVE'}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] leading-tight">
                    EOLIA Criteria: P/F &lt; 50 for &gt; 3h, P/F &lt; 80 for &gt; 6h, or severe acidosis pH &lt; 7.15 despite lung-protective ventilatory efforts.
                  </p>
                </div>
              </div>
            </div>

            {/* Inflammatory Subphenotype & Ventilator Directives */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-400" />
                  <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                    Inflammatory Phenotype &amp; Optimization Checklist
                  </h3>
                </div>
                <span className={`px-2.5 py-0.5 rounded text-xs font-extrabold ${
                  metrics.estimatedSubphenotype === 'HYPER_INFLAMMATORY_PHENOTYPE_2'
                    ? 'bg-purple-950 text-purple-300 border border-purple-700'
                    : 'bg-blue-950 text-blue-300 border border-blue-700'
                }`}>
                  {metrics.estimatedSubphenotype.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="space-y-2">
                {metrics.ventilatorOptimizationRecommendations.map((rec, idx) => (
                  <div
                    key={idx}
                    className="text-xs text-slate-300 bg-slate-950/70 p-2.5 rounded border border-slate-800 flex items-start gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Clinical Teaching Pearls */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Mechanical Ventilation &amp; ARDS Critical Care Essentials
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-400 leading-relaxed">
            <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/80">
              <h4 className="font-bold text-slate-200 mb-1">1. Predicted Body Weight (PBW) Rule</h4>
              <p>
                Lung size is determined by biological height and sex, not actual body weight. Ventilating an obese patient at 6 mL/kg based on actual weight causes severe volutrauma and barotrauma because the functional aerated "baby lung" volume is determined strictly by predicted body weight.
              </p>
            </div>
            <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/80">
              <h4 className="font-bold text-slate-200 mb-1">2. Gattinoni Mechanical Power</h4>
              <p>
                Mechanical power combines pressure, volume, flow, and respiratory rate into a single thermodynamic metric of energy dissipation (Joules/min). High respiratory rates can cause lung injury even with small tidal volumes through cumulative mechanical fatigue ("ergotrauma").
              </p>
            </div>
            <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/80">
              <h4 className="font-bold text-slate-200 mb-1">3. The PROSEVA Prone Physiology</h4>
              <p>
                Prone positioning homogenizes transpulmonary pressure gradients across dorsal-ventral lung axes. Dorsal lung units are recruited while ventral units remain ventilated, drastically reducing regional stress and strain and decreasing dead space ventilation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
