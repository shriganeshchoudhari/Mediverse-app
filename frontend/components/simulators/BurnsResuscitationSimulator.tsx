'use client';

import React, { useState, useMemo } from 'react';
import {
  BurnPatientProfile,
  AnatomicalBurnRegion,
  calculateBurnResuscitation,
  BURN_PRESETS,
  DEFAULT_ADULT_REGIONS,
} from '../../.gemini/skills/BurnsResuscitationEngine';
import {
  Flame,
  Droplets,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Wind,
  Scissors,
  Sparkles,
  RefreshCw,
  Sliders,
  Scale,
  Zap,
} from 'lucide-react';

export default function BurnsResuscitationSimulator() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('adult-40pct-flame');

  // Patient profile state
  const [ageYears, setAgeYears] = useState<number>(38);
  const [weightKg, setWeightKg] = useState<number>(70);
  const [mechanism, setMechanism] = useState<BurnPatientProfile['mechanism']>('FLAME');
  const [hoursPostInjury, setHoursPostInjury] = useState<number>(2);
  const [inhalationInjury, setInhalationInjury] = useState<boolean>(false);
  const [carboxyhemoglobinPct, setCarboxyhemoglobinPct] = useState<number>(4.2);
  const [fiO2, setFiO2] = useState<0.21 | 1.0 | 2.5>(1.0);
  const [measuredUopMlh, setMeasuredUopMlh] = useState<number>(38);
  const [bladderPressure, setBladderPressure] = useState<number>(9);

  // Anatomical regions state
  const [regions, setRegions] = useState<AnatomicalBurnRegion[]>(
    BURN_PRESETS[0].profile.regions
  );

  // Active formula toggle: Parkland vs ABA Consensus
  const [activeFormula, setActiveFormula] = useState<'PARKLAND' | 'ABA_CONSENSUS'>('PARKLAND');

  // Master resuscitation calculation
  const resuscitationPlan = useMemo(() => {
    return calculateBurnResuscitation({
      ageYears,
      weightKg,
      heightCm: 175,
      mechanism,
      hoursPostInjury,
      inhalationInjuryPresent: inhalationInjury,
      carboxyhemoglobinPct,
      fiO2Delivered: fiO2,
      regions,
      measuredUrineOutputMlh: measuredUopMlh,
      bladderPressureMmHg: bladderPressure,
    });
  }, [ageYears, weightKg, mechanism, hoursPostInjury, inhalationInjury, carboxyhemoglobinPct, fiO2, regions, measuredUopMlh, bladderPressure]);

  // Handle preset selection
  const handlePresetSelect = (id: string) => {
    setSelectedPresetId(id);
    const p = BURN_PRESETS.find(preset => preset.id === id);
    if (p) {
      setAgeYears(p.profile.ageYears);
      setWeightKg(p.profile.weightKg);
      setMechanism(p.profile.mechanism);
      setHoursPostInjury(p.profile.hoursPostInjury);
      setInhalationInjury(p.profile.inhalationInjuryPresent);
      setCarboxyhemoglobinPct(p.profile.carboxyhemoglobinPct);
      setFiO2(p.profile.fiO2Delivered);
      setMeasuredUopMlh(p.profile.measuredUrineOutputMlh);
      setBladderPressure(p.profile.bladderPressureMmHg);
      setRegions(p.profile.regions);
    }
  };

  // Region updater
  const updateRegionBurn = (
    regionId: string,
    field: 'partialThicknessPct' | 'fullThicknessPct' | 'isCircumferential',
    val: number | boolean
  ) => {
    setRegions(prev =>
      prev.map(r => (r.id === regionId ? { ...r, [field]: val } : r))
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 text-zinc-100 p-2 sm:p-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-950 via-slate-900 to-rose-950 border border-orange-600/40 rounded-2xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-orange-500/20 border border-orange-500/40 rounded-xl text-orange-400">
                <Flame className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                  Emergency Burns Resuscitation &amp; Fluid Shift Workstation
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/40 font-mono">
                    Parkland &amp; ABA Consensus
                  </span>
                </h1>
                <p className="text-sm text-zinc-400 mt-1">
                  Wallace Rule of Nines TBSA mapping, Parkland/ABA rate titration, carboxyhemoglobin half-life solver, and Ivy index fluid creep surveillance.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-slate-900/80 border border-slate-700/80 px-3 py-1.5 rounded-lg text-xs font-mono">
              <span className="text-zinc-400">TBSA:</span>{' '}
              <span className="text-orange-400 font-bold text-sm">
                {resuscitationPlan.totalTbsaPct}%
              </span>
            </div>
            <div className="bg-slate-900/80 border border-slate-700/80 px-3 py-1.5 rounded-lg text-xs font-mono">
              <span className="text-zinc-400">Weight:</span>{' '}
              <span className="text-cyan-300 font-bold">{weightKg} kg</span>
            </div>
            <div className="bg-slate-900/80 border border-slate-700/80 px-3 py-1.5 rounded-lg text-xs font-mono">
              <span className="text-zinc-400">Elapsed:</span>{' '}
              <span className="text-amber-300 font-bold">{hoursPostInjury}h</span>
            </div>
          </div>
        </div>

        {/* Preset Selector Bar */}
        <div className="mt-5 pt-4 border-t border-orange-900/40 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-orange-300 flex items-center gap-1.5 mr-2">
            <Sparkles className="w-3.5 h-3.5" /> Clinical Presets:
          </span>
          {BURN_PRESETS.map(preset => (
            <button
              key={preset.id}
              onClick={() => handlePresetSelect(preset.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedPresetId === preset.id
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30 ring-1 ring-orange-400'
                  : 'bg-slate-800/80 text-zinc-300 hover:bg-slate-750 hover:text-white border border-slate-700/60'
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Anatomical Burn Mapping (Left 7 cols) & Resuscitation Solver (Right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Anatomical Burn Region Mapper (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                <Scale className="w-4 h-4 text-orange-400" /> Wallace Rule of Nines &amp; Burn Depth Mapper
              </h2>
              <span className="text-xs font-mono text-orange-400 font-bold">
                Total 2nd/3rd Deg: {resuscitationPlan.totalTbsaPct}% TBSA
              </span>
            </div>

            {/* Region Table with partial/full thickness inputs */}
            <div className="space-y-2.5">
              {regions.map(reg => (
                <div
                  key={reg.id}
                  className={`p-3 rounded-xl border transition-all ${
                    reg.partialThicknessPct + reg.fullThicknessPct > 0
                      ? 'bg-slate-950/90 border-orange-700/50'
                      : 'bg-slate-950/40 border-slate-800/80'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{reg.name}</span>
                      <span className="text-[11px] text-zinc-500 font-mono">({reg.adultNinesPct}%)</span>
                      {reg.isCircumferential && (
                        <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                          <Scissors className="w-3 h-3" /> Circumferential
                        </span>
                      )}
                    </div>
                    <label className="flex items-center gap-1 text-[11px] text-zinc-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={reg.isCircumferential}
                        onChange={e => updateRegionBurn(reg.id, 'isCircumferential', e.target.checked)}
                        className="w-3.5 h-3.5 rounded text-rose-500"
                      />
                      <span>Circumferential</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-2 text-xs">
                    <div>
                      <div className="flex justify-between text-[11px] text-zinc-400 mb-0.5">
                        <span>Partial Thickness (2nd Deg):</span>
                        <span className="text-amber-300 font-mono font-semibold">{reg.partialThicknessPct}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max={reg.adultNinesPct}
                        value={reg.partialThicknessPct}
                        onChange={e => updateRegionBurn(reg.id, 'partialThicknessPct', Number(e.target.value))}
                        className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-amber-500"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] text-zinc-400 mb-0.5">
                        <span>Full Thickness (3rd Deg):</span>
                        <span className="text-rose-400 font-mono font-semibold">{reg.fullThicknessPct}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max={reg.adultNinesPct}
                        value={reg.fullThicknessPct}
                        onChange={e => updateRegionBurn(reg.id, 'fullThicknessPct', Number(e.target.value))}
                        className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-rose-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Patient Physical Profile Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800 text-xs">
              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                <span className="text-zinc-400">Patient Weight:</span>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="number"
                    min="5"
                    max="180"
                    value={weightKg}
                    onChange={e => setWeightKg(Number(e.target.value))}
                    className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-1 font-mono text-cyan-300 font-bold"
                  />
                  <span className="text-zinc-500">kg</span>
                </div>
              </div>

              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                <span className="text-zinc-400">Hours Since Injury:</span>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="number"
                    min="0"
                    max="24"
                    value={hoursPostInjury}
                    onChange={e => setHoursPostInjury(Number(e.target.value))}
                    className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-1 font-mono text-amber-300 font-bold"
                  />
                  <span className="text-zinc-500">hours</span>
                </div>
              </div>

              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                <span className="text-zinc-400">Burn Mechanism:</span>
                <select
                  value={mechanism}
                  onChange={e => setMechanism(e.target.value as BurnPatientProfile['mechanism'])}
                  className="w-full mt-1 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-zinc-200 font-semibold"
                >
                  <option value="FLAME">Flame / Thermal</option>
                  <option value="SCALD">Scald / Liquid</option>
                  <option value="ELECTRICAL_HIGH_VOLTAGE">High-Voltage Electrical</option>
                  <option value="CHEMICAL">Chemical Burn</option>
                </select>
              </div>
            </div>
          </div>

          {/* Inhalation Injury & Carboxyhemoglobin Kinetics */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-cyan-400" /> Inhalation Injury &amp; Carboxyhemoglobin Kinetics
              </span>
              <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-rose-300">
                <input
                  type="checkbox"
                  checked={inhalationInjury}
                  onChange={e => setInhalationInjury(e.target.checked)}
                  className="w-4 h-4 rounded text-rose-500"
                />
                <span>Confirmed Inhalation Injury</span>
              </label>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Carboxyhemoglobin (COHb):</span>
                  <span className="font-mono font-bold text-rose-400">{carboxyhemoglobinPct}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="60"
                  value={carboxyhemoglobinPct}
                  onChange={e => setCarboxyhemoglobinPct(Number(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-rose-500"
                />
                <div className="text-[10px] text-zinc-500">Normal &lt;2% non-smoker, &gt;15% toxic</div>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <span className="text-zinc-400">Delivered Oxygen (FiO2):</span>
                <div className="grid grid-cols-3 gap-1 mt-1">
                  {[
                    { val: 0.21, label: 'Room Air (t½ 320m)' },
                    { val: 1.0, label: '100% NRB (t½ 80m)' },
                    { val: 2.5, label: 'HBO 3 ATA (t½ 23m)' },
                  ].map(item => (
                    <button
                      key={item.val}
                      onClick={() => setFiO2(item.val as 0.21 | 1.0 | 2.5)}
                      className={`p-1.5 rounded text-[10px] text-center border transition-all ${
                        fiO2 === item.val
                          ? 'bg-cyan-900/60 text-cyan-200 border-cyan-500 font-bold'
                          : 'bg-slate-900 text-zinc-400 border-slate-800'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {carboxyhemoglobinPct > 5 && (
              <div className="p-3 bg-slate-950/80 rounded-xl border border-cyan-800/40 flex items-center justify-between text-xs">
                <span className="text-zinc-400">Time to clear COHb below 5%:</span>
                <span className="font-mono font-bold text-cyan-300">
                  ~{resuscitationPlan.timeToSafeCoUnder5PctMinutes} minutes ({ (resuscitationPlan.timeToSafeCoUnder5PctMinutes / 60).toFixed(1) } hours)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Resuscitation Solver & Rate Scheduler (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Formula Results Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-cyan-400" /> 24-Hour Resuscitation Volumes
              </h3>
              <div className="inline-flex rounded-lg p-0.5 bg-slate-800 border border-slate-700 text-xs">
                <button
                  onClick={() => setActiveFormula('PARKLAND')}
                  className={`px-2 py-0.5 rounded transition ${
                    activeFormula === 'PARKLAND' ? 'bg-orange-600 text-white font-bold' : 'text-zinc-400'
                  }`}
                >
                  Parkland (4mL)
                </button>
                <button
                  onClick={() => setActiveFormula('ABA_CONSENSUS')}
                  className={`px-2 py-0.5 rounded transition ${
                    activeFormula === 'ABA_CONSENSUS' ? 'bg-orange-600 text-white font-bold' : 'text-zinc-400'
                  }`}
                >
                  ABA (2-4mL)
                </button>
              </div>
            </div>

            {/* Total Volume Metric */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="text-xs text-zinc-400">Total 24-Hour Lactated Ringer&apos;s:</div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black font-mono text-cyan-300">
                  {activeFormula === 'PARKLAND'
                    ? resuscitationPlan.parklandTotal24hMl.toLocaleString()
                    : resuscitationPlan.abaConsensusTotal24hMl.toLocaleString()}
                </span>
                <span className="text-sm font-semibold text-zinc-400">mL LR</span>
              </div>
              <div className="text-[11px] text-zinc-500 mt-1">
                {activeFormula === 'PARKLAND'
                  ? `4 mL × ${weightKg} kg × ${resuscitationPlan.totalTbsaPct}% TBSA`
                  : `ABA Consensus: ${mechanism === 'ELECTRICAL_HIGH_VOLTAGE' ? '4 mL' : '2 mL'} × ${weightKg} kg × ${resuscitationPlan.totalTbsaPct}% TBSA`}
              </div>
            </div>

            {/* Timing Division (First 8h vs Next 16h) */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-950/60 rounded-xl border border-orange-900/50">
                <div className="text-[11px] text-orange-300 font-semibold flex items-center gap-1">
                  <Clock className="w-3 h-3" /> First 8 Hours Rate:
                </div>
                <div className="text-xl font-bold font-mono text-white mt-1">
                  {resuscitationPlan.first8hRateMlh} mL/h
                </div>
                <div className="text-[10px] text-zinc-400 mt-0.5">
                  Catch-up over remaining {resuscitationPlan.first8hRemainingHours}h
                </div>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <div className="text-[11px] text-cyan-300 font-semibold flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Second 16 Hours Rate:
                </div>
                <div className="text-xl font-bold font-mono text-white mt-1">
                  {resuscitationPlan.second16hRateMlh} mL/h
                </div>
                <div className="text-[10px] text-zinc-400 mt-0.5">Over next 16 hours</div>
              </div>
            </div>
          </div>

          {/* Urine Output Titration Console */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" /> Urine Output (UOP) Goal &amp; Titration
              </span>
              <span
                className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold border ${
                  resuscitationPlan.currentUopStatus === 'TARGET_ACHIEVED'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : resuscitationPlan.currentUopStatus === 'INADEQUATE_OLIGURIA'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                }`}
              >
                {resuscitationPlan.currentUopStatus.replace(/_/g, ' ')}
              </span>
            </h3>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400">Current Measured Hourly UOP:</span>
                <span className="font-mono font-bold text-white text-sm">
                  {measuredUopMlh} mL/h ({(measuredUopMlh / weightKg).toFixed(2)} mL/kg/h)
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="160"
                value={measuredUopMlh}
                onChange={e => setMeasuredUopMlh(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                <span>Target: {resuscitationPlan.hourlyUopTargetRangeMlh[0]} – {resuscitationPlan.hourlyUopTargetRangeMlh[1]} mL/h</span>
                <span>{mechanism === 'ELECTRICAL_HIGH_VOLTAGE' ? '1.5-2.0 mL/kg/h' : '0.5-1.0 mL/kg/h'}</span>
              </div>

              <p className="text-xs text-zinc-300 pt-2 border-t border-slate-800 leading-relaxed">
                {resuscitationPlan.fluidRateAdjustmentRecommendation}
              </p>
            </div>
          </div>

          {/* Fluid Creep & Escharotomy Risk Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" /> Fluid Creep &amp; Compartment Syndrome
              </span>
              <span className="font-mono text-xs text-zinc-400">
                Ivy Index: {resuscitationPlan.ivyIndexMlPerKg} mL/kg
              </span>
            </h3>

            {/* Fluid creep alert */}
            {resuscitationPlan.fluidCreepWarning && (
              <div className="p-3 bg-rose-950/50 border border-rose-800/80 rounded-xl flex items-start gap-2 text-xs text-rose-200">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <span>{resuscitationPlan.fluidCreepWarning}</span>
              </div>
            )}

            {/* Bladder Pressure Slider */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-400">Intra-Abdominal Pressure (Bladder):</span>
                <span className={`font-mono font-bold ${bladderPressure >= 20 ? 'text-rose-400' : 'text-zinc-200'}`}>
                  {bladderPressure} mmHg ({resuscitationPlan.intraAbdominalHypertensionGrade.replace(/_/g, ' ')})
                </span>
              </div>
              <input
                type="range"
                min="4"
                max="32"
                value={bladderPressure}
                onChange={e => setBladderPressure(Number(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-rose-500"
              />
              <div className="text-[10px] text-zinc-500">
                Normal &lt;12 mmHg | IAH &gt;=12 mmHg | ACS &gt;20-25 mmHg with organ failure
              </div>
            </div>

            {/* Escharotomy Required Alert */}
            {resuscitationPlan.escharotomyRequired && (
              <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-xl space-y-1 text-xs">
                <div className="font-bold text-amber-300 flex items-center gap-1.5">
                  <Scissors className="w-4 h-4 text-amber-400" /> Emergency Escharotomy Indicated:
                </div>
                <p className="text-zinc-300">
                  Circumferential full-thickness burn in:{' '}
                  <strong className="text-amber-200">{resuscitationPlan.escharotomyRegions.join(', ')}</strong>.
                  Monitor for respiratory compromise or loss of distal arterial Doppler signals.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Curriculum Clinical Pearls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-orange-400 font-semibold text-xs uppercase tracking-wider">
            <Flame className="w-4 h-4" /> 1. Timing from Injury, Not Arrival
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            The Parkland formula divides resuscitation volume into the first 8 hours and subsequent 16 hours. The 8-hour clock begins at the exact time the burn occurred, NOT upon presentation to the emergency department. Delayed patients require rapid catch-up over the remaining fraction of the first 8 hours.
          </p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" /> 2. Fluid Creep &amp; The Ivy Index
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Over-resuscitation (&quot;fluid creep&quot;) driven by chasing arbitrary vital signs causes abdominal compartment syndrome (ACS), orbital compartment syndrome, and acute lung injury. An Ivy index &gt;250 mL/kg in 24 hours warrants routine bladder pressure transduction and titration strictly to target UOP.
          </p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs uppercase tracking-wider">
            <Wind className="w-4 h-4" /> 3. Carbon Monoxide &amp; Cyanide in Smoke
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Pulse oximetry falsely overstates oxygenation in CO poisoning because standard SpO2 cannot distinguish carboxyhemoglobin from oxyhemoglobin. Closed-space smoke inhalation with severe lactic acidosis (&gt;8 mmol/L) warrants empiric IV Hydroxocobalamin (Cyanokit 5g) for concurrent hydrogen cyanide toxicity.
          </p>
        </div>
      </div>
    </div>
  );
}
