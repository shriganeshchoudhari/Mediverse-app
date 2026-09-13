'use client';

import React, { useState, useMemo } from 'react';
import {
  Skull,
  Activity,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  Stethoscope,
  Gauge,
  Heart,
  Sparkles,
  RefreshCw,
  AlertOctagon,
  Timer,
  Syringe,
  ChevronRight,
  Info,
  Scale,
  Zap,
  Flame,
  Layers,
  Sliders,
  FileText,
  Wind,
  Droplets
} from 'lucide-react';
import {
  calculateCellularAsphyxiation,
  auditIrritantPulmonaryInjury,
  evaluateAntidoteSafety,
  TOXIC_GAS_SCENARIOS,
  PatientToxicGasState,
  ToxicGasAgent
} from '../../.gemini/skills/ToxicGasInhalationEngine';

export default function ToxicGasInhalationSimulator() {
  const [selectedScenarioKey, setSelectedScenarioKey] = useState<string>('smoke_inhalation_cyanide');
  const scenario = TOXIC_GAS_SCENARIOS[selectedScenarioKey] || TOXIC_GAS_SCENARIOS.smoke_inhalation_cyanide;

  // Patient Exposure State
  const [agent, setAgent] = useState<ToxicGasAgent>(scenario.initialState.gasAgent);
  const [dosePpm, setDosePpm] = useState<number>(scenario.initialState.exposureDosePpm);
  const [timeSinceExposure, setTimeSinceExposure] = useState<number>(scenario.initialState.timeSinceExposureHours);

  // Blood Co-Oximetry & Labs
  const [concomitantCo, setConcomitantCo] = useState<boolean>(scenario.initialState.concomitantCarbonMonoxidePresent);
  const [coHb, setCoHb] = useState<number>(scenario.initialState.carboxyhemoglobinPercent);
  const [lactate, setLactate] = useState<number>(scenario.initialState.arterialLactateMmolL);
  const [svo2, setSvo2] = useState<number>(scenario.initialState.svo2Percent);
  const [pao2, setPao2] = useState<number>(scenario.initialState.arterialPo2MmHg);

  // Pulmonary & Vitals
  const [edemaIndex, setEdemaIndex] = useState<number>(scenario.initialState.lungWaterEdemaIndex);
  const [sbp, setSbp] = useState<number>(scenario.initialState.systolicBpMmHg);
  const [hr, setHr] = useState<number>(scenario.initialState.heartRateBpm);
  const [stridor, setStridor] = useState<boolean>(scenario.initialState.stridorAndUpperAirwayCompromise);

  // Antidotes State
  const [hydroxoGrams, setHydroxoGrams] = useState<number>(scenario.initialState.activeAntidotes.hydroxocobalaminGrams);
  const [thiosulfate, setThiosulfate] = useState<boolean>(scenario.initialState.activeAntidotes.sodiumThiosulfateGiven);
  const [nitrite, setNitrite] = useState<boolean>(scenario.initialState.activeAntidotes.sodiumNitriteGiven);
  const [bicarbNeb, setBicarbNeb] = useState<boolean>(scenario.initialState.activeAntidotes.nebulizedBicarbonateGiven);
  const [betaAgonists, setBetaAgonists] = useState<boolean>(scenario.initialState.activeAntidotes.inhaledBetaAgonistsGiven);

  // Load Scenario Preset
  const handleLoadScenario = (key: string) => {
    setSelectedScenarioKey(key);
    const sc = TOXIC_GAS_SCENARIOS[key];
    if (!sc) return;

    setAgent(sc.initialState.gasAgent);
    setDosePpm(sc.initialState.exposureDosePpm);
    setTimeSinceExposure(sc.initialState.timeSinceExposureHours);

    setConcomitantCo(sc.initialState.concomitantCarbonMonoxidePresent);
    setCoHb(sc.initialState.carboxyhemoglobinPercent);
    setLactate(sc.initialState.arterialLactateMmolL);
    setSvo2(sc.initialState.svo2Percent);
    setPao2(sc.initialState.arterialPo2MmHg);

    setEdemaIndex(sc.initialState.lungWaterEdemaIndex);
    setSbp(sc.initialState.systolicBpMmHg);
    setHr(sc.initialState.heartRateBpm);
    setStridor(sc.initialState.stridorAndUpperAirwayCompromise);

    setHydroxoGrams(sc.initialState.activeAntidotes.hydroxocobalaminGrams);
    setThiosulfate(sc.initialState.activeAntidotes.sodiumThiosulfateGiven);
    setNitrite(sc.initialState.activeAntidotes.sodiumNitriteGiven);
    setBicarbNeb(sc.initialState.activeAntidotes.nebulizedBicarbonateGiven);
    setBetaAgonists(sc.initialState.activeAntidotes.inhaledBetaAgonistsGiven);
  };

  // Compile Patient State
  const currentState: PatientToxicGasState = useMemo(
    () => ({
      patientAge: scenario.initialState.patientAge,
      gasAgent: agent,
      exposureDosePpm: dosePpm,
      exposureDurationMinutes: scenario.initialState.exposureDurationMinutes,
      timeSinceExposureHours: timeSinceExposure,
      concomitantCarbonMonoxidePresent: concomitantCo,
      carboxyhemoglobinPercent: coHb,
      methemoglobinPercent: scenario.initialState.methemoglobinPercent,
      arterialLactateMmolL: lactate,
      svo2Percent: svo2,
      arterialPo2MmHg: pao2,
      systolicBpMmHg: sbp,
      heartRateBpm: hr,
      lungWaterEdemaIndex: edemaIndex,
      stridorAndUpperAirwayCompromise: stridor,
      activeAntidotes: {
        hydroxocobalaminGrams: hydroxoGrams,
        sodiumThiosulfateGiven: thiosulfate,
        sodiumNitriteGiven: nitrite,
        nebulizedBicarbonateGiven: bicarbNeb,
        inhaledBetaAgonistsGiven: betaAgonists,
      },
    }),
    [
      scenario.initialState.patientAge,
      scenario.initialState.exposureDurationMinutes,
      scenario.initialState.methemoglobinPercent,
      agent,
      dosePpm,
      timeSinceExposure,
      concomitantCo,
      coHb,
      lactate,
      svo2,
      pao2,
      sbp,
      hr,
      edemaIndex,
      stridor,
      hydroxoGrams,
      thiosulfate,
      nitrite,
      bicarbNeb,
      betaAgonists,
    ]
  );

  // Engine Calculations
  const cellAudit = useMemo(() => calculateCellularAsphyxiation(currentState), [currentState]);
  const pulmAudit = useMemo(() => auditIrritantPulmonaryInjury(currentState), [currentState]);
  const antidoteAudit = useMemo(() => evaluateAntidoteSafety(currentState), [currentState]);

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6 lg:p-8">
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
                <Skull className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-400 via-orange-300 to-red-400 bg-clip-text text-transparent">
                  Toxic Gas &amp; Chemical Inhalation Workstation
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                  Cellular Asphyxiants (Cyanide vs H2S) &amp; Irritant Gases (Chlorine vs Phosgene), Cytochrome c Oxidase Inhibition, Hydroxocobalamin, Nitrite Hazards &amp; Latent ARDS
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-amber-950/60 border border-amber-800/50 text-amber-300 text-xs font-semibold rounded-full flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 animate-pulse text-amber-400" />
              Toxicology &amp; Hazmat Emergency Protocol
            </span>
          </div>
        </div>

        {/* Clinical Scenario Selector */}
        <div className="mt-6">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Select Toxic Gas / Chemical Warfare Vignette
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {Object.entries(TOXIC_GAS_SCENARIOS).map(([key, sc]) => {
              const isSelected = selectedScenarioKey === key;
              return (
                <button
                  key={key}
                  onClick={() => handleLoadScenario(key)}
                  className={`text-left p-3 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                    isSelected
                      ? 'bg-amber-950/40 border-amber-500/60 text-amber-200 shadow-md shadow-amber-950/30'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="font-semibold text-slate-200 truncate">{sc.name}</div>
                  <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">{sc.patientSummary}</div>
                </button>
              );
            })}
          </div>

          {/* Active Case Narrative Card */}
          <div className="mt-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
                  Hazmat Vignette ({scenario.name})
                </span>
                <p className="text-xs text-slate-300 mt-0.5">{scenario.patientSummary}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {scenario.clinicalPearls.map((pearl, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-800 text-[11px] text-slate-300 border border-slate-700"
                    >
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      {pearl}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <button
              onClick={() => handleLoadScenario(selectedScenarioKey)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium rounded-lg flex items-center gap-1.5 shrink-0 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Case
            </button>
          </div>
        </div>
      </div>

      {/* Main Workstation Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Parameters (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Panel 1: Inhaled Gas Agent & Exposure Timeline */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-amber-300 flex items-center gap-2">
                <Skull className="w-4 h-4 text-amber-400" />
                Toxic Gas Agent &amp; Timeline
              </h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {timeSinceExposure.toFixed(1)}h Post-Exposure
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1.5 font-medium">Inhaled Toxin Classification</label>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      { id: 'cyanide', label: 'Cyanide (CN-)', sub: 'Complex IV Block' },
                      { id: 'hydrogen_sulfide_h2s', label: 'H2S Knockdown', sub: 'Rotten Egg Sewer Gas' },
                      { id: 'chlorine_gas', label: 'Chlorine Gas', sub: 'HCl/HOCl Acid Burn' },
                      { id: 'phosgene', label: 'Phosgene Gas', sub: 'Latent Alveolar ARDS' },
                    ] as const
                  ).map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setAgent(g.id)}
                      className={`p-2 rounded-lg text-xs font-medium border text-left transition ${
                        agent === g.id
                          ? 'bg-amber-600/30 border-amber-500 text-amber-200 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-bold">{g.label}</div>
                      <div className="text-[10px] opacity-75">{g.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Time Since Inhalation Exposure</span>
                  <span className={`font-bold ${
                    agent === 'phosgene' && timeSinceExposure >= 4 && timeSinceExposure <= 24
                      ? 'text-amber-400 animate-pulse'
                      : 'text-slate-200'
                  }`}>
                    {timeSinceExposure.toFixed(1)} hours {agent === 'phosgene' && '(Phosgene Latent Phase)'}
                  </span>
                </div>
                <input aria-label="Time Since Exposure"
                  type="range"
                  min="0.2"
                  max="24.0"
                  step="0.2"
                  value={timeSinceExposure}
                  onChange={(e) => setTimeSinceExposure(Number(e.target.value))}
                  className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                  <span>0.2h (Immediate)</span>
                  <span>4h (Phosgene Onset)</span>
                  <span>24h (Flash ARDS)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Panel 2: Cellular Energetics & Co-Oximetry */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
            <h3 className="text-sm font-semibold text-amber-300 flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-amber-400" />
              Mitochondrial Energetics &amp; Co-Oximetry
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Arterial Lactate (Mitochondrial Arrest Marker)</span>
                  <span className={`font-bold ${lactate >= 8 ? 'text-rose-400' : lactate >= 4 ? 'text-amber-400' : 'text-slate-200'}`}>
                    {lactate.toFixed(1)} mmol/L
                  </span>
                </div>
                <input aria-label="Arterial Lactate (Mitochondrial Arrest Marker)"
                  type="range"
                  min="0.8"
                  max="18.0"
                  step="0.2"
                  value={lactate}
                  onChange={(e) => setLactate(Number(e.target.value))}
                  className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">Mixed Venous SvO2</span>
                    <span className={`font-bold ${svo2 >= 85 ? 'text-rose-400' : 'text-slate-200'}`}>
                      {svo2}% {svo2 >= 85 && '(Histotoxic!)'}
                    </span>
                  </div>
                  <input aria-label="Mixed Venous SvO2"
                    type="range"
                    min="45"
                    max="98"
                    value={svo2}
                    onChange={(e) => setSvo2(Number(e.target.value))}
                    className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">Carboxyhemoglobin (COHb)</span>
                    <span className={`font-bold ${coHb >= 10 ? 'text-rose-400' : 'text-slate-200'}`}>
                      {coHb}%
                    </span>
                  </div>
                  <input aria-label="Carboxyhemoglobin (COHb)"
                    type="range"
                    min="0"
                    max="50"
                    value={coHb}
                    onChange={(e) => setCoHb(Number(e.target.value))}
                    className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={concomitantCo}
                    onChange={(e) => setConcomitantCo(e.target.checked)}
                    className="rounded border-slate-700 text-amber-500 focus:ring-amber-500 bg-slate-900 w-4 h-4"
                  />
                  <span className="text-xs text-slate-300 font-medium">
                    Smoke inhalation with concomitant Carbon Monoxide (CO)
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Panel 3: Pulmonary Mechanics & Gas Exchange */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
            <h3 className="text-sm font-semibold text-amber-300 flex items-center gap-2 mb-3">
              <Wind className="w-4 h-4 text-amber-400" />
              Pulmonary Mechanics &amp; Alveolar Injury
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Lung Water / Non-Cardiogenic Edema Index</span>
                  <span className={`font-bold ${edemaIndex >= 6 ? 'text-rose-400' : edemaIndex >= 3 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {edemaIndex}/10 (Capillary Permeability Leak)
                  </span>
                </div>
                <input aria-label="Edema Index"
                  type="range"
                  min="0"
                  max="10"
                  value={edemaIndex}
                  onChange={(e) => setEdemaIndex(Number(e.target.value))}
                  className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">Arterial PaO2</span>
                    <span className={`font-bold ${pao2 < 60 ? 'text-rose-400' : 'text-slate-200'}`}>
                      {pao2} mmHg
                    </span>
                  </div>
                  <input aria-label="Arterial PaO2"
                    type="range"
                    min="40"
                    max="220"
                    value={pao2}
                    onChange={(e) => setPao2(Number(e.target.value))}
                    className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">Systolic BP</span>
                    <span className={`font-bold ${sbp < 90 ? 'text-rose-400' : 'text-slate-200'}`}>
                      {sbp} mmHg
                    </span>
                  </div>
                  <input aria-label="Systolic BP"
                    type="range"
                    min="50"
                    max="180"
                    value={sbp}
                    onChange={(e) => setSbp(Number(e.target.value))}
                    className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={stridor}
                    onChange={(e) => setStridor(e.target.checked)}
                    className="rounded border-slate-700 text-amber-500 focus:ring-amber-500 bg-slate-900 w-4 h-4"
                  />
                  <span className="text-xs text-slate-300 font-medium">
                    Upper airway laryngeal edema / stridor / soot deposition
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Panel 4: Antidotal Interventions Bench */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
            <h3 className="text-sm font-semibold text-amber-300 flex items-center gap-2 mb-3">
              <Syringe className="w-4 h-4 text-amber-400" />
              Antidotal Deployments
            </h3>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Hydroxocobalamin (Cyanokit)</span>
                  <span className="text-amber-400 font-bold">{hydroxoGrams} g IV</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[0, 5, 10].map((g) => (
                    <button
                      key={g}
                      onClick={() => setHydroxoGrams(g)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition ${
                        hydroxoGrams === g
                          ? 'bg-amber-600/30 border-amber-500 text-amber-200 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {g === 0 ? 'None' : g === 5 ? '5g (Initial)' : '10g (Repeat)'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={thiosulfate}
                    onChange={(e) => setThiosulfate(e.target.checked)}
                    className="rounded border-slate-700 text-amber-500 focus:ring-amber-500 bg-slate-900 w-4 h-4"
                  />
                  <span className="text-xs text-slate-300 font-medium">Sodium Thiosulfate (12.5g)</span>
                </label>

                <label className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                  concomitantCo || coHb > 10
                    ? 'bg-rose-950/40 border-rose-500 text-rose-300'
                    : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}>
                  <input
                    type="checkbox"
                    checked={nitrite}
                    onChange={(e) => setNitrite(e.target.checked)}
                    className="rounded border-slate-700 text-rose-500 focus:ring-rose-500 bg-slate-900 w-4 h-4"
                  />
                  <span className="text-xs font-medium">
                    Sodium Nitrite (300mg) {concomitantCo && '[CONTRAINDICATED]'}
                  </span>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bicarbNeb}
                    onChange={(e) => setBicarbNeb(e.target.checked)}
                    className="rounded border-slate-700 text-amber-500 focus:ring-amber-500 bg-slate-900 w-4 h-4"
                  />
                  <span className="text-xs text-slate-300 font-medium">Nebulized Bicarbonate</span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={betaAgonists}
                    onChange={(e) => setBetaAgonists(e.target.checked)}
                    className="rounded border-slate-700 text-amber-500 focus:ring-amber-500 bg-slate-900 w-4 h-4"
                  />
                  <span className="text-xs text-slate-300 font-medium">Inhaled Albuterol/Steroids</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Gauges, Antidotal Safety, Protocol (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Critical Hazard Alert Banner */}
          {antidoteAudit.contraindicatedAntidotes.length > 0 && (
            <div className="p-4 rounded-2xl bg-rose-950/60 border-2 border-rose-500 text-rose-200 animate-pulse">
              <div className="flex items-start gap-3">
                <AlertOctagon className="w-8 h-8 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-base font-extrabold text-white">LETHAL ANTIDOTAL CONTRAINDICATION</h3>
                  <ul className="mt-1 space-y-1 text-xs leading-relaxed">
                    {antidoteAudit.contraindicatedAntidotes.map((alert, idx) => (
                      <li key={idx}>• {alert}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Phosgene Latent Phase Alert */}
          {pulmAudit.latentPhaseActive && (
            <div className="p-4 rounded-2xl bg-amber-950/50 border border-amber-500/60 text-amber-200">
              <div className="flex items-start gap-3">
                <Timer className="w-8 h-8 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <h3 className="text-base font-extrabold text-amber-300">DECEPTIVE PHOSGENE LATENT WINDOW</h3>
                  <p className="text-xs mt-1 leading-relaxed">{pulmAudit.pulmonaryEdemaSummary}</p>
                </div>
              </div>
            </div>
          )}

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 1. Mitochondrial Complex IV Inhibition */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Complex IV Inhibition
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded font-bold ${
                    cellAudit.cytochromeInhibitionPercent >= 50
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      : cellAudit.cytochromeInhibitionPercent >= 20
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {cellAudit.cytochromeInhibitionPercent}% Blockade
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-100">{cellAudit.cytochromeInhibitionPercent}%</span>
                <span className="text-xs text-slate-400">Cytochrome c Oxidase</span>
              </div>
              <div className="mt-2 text-xs text-slate-300 font-medium">
                {cellAudit.lactateToxicitySeverity}
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400 truncate">
                {cellAudit.cellularSummary}
              </div>
            </div>

            {/* 2. Projected ARDS & Capillary Leak */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Projected ARDS Risk
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded font-bold ${
                    pulmAudit.projectedArdsRiskPercent >= 70
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      : pulmAudit.projectedArdsRiskPercent >= 30
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {pulmAudit.projectedArdsRiskPercent}% ARDS Risk
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-100">{edemaIndex}/10</span>
                <span className="text-xs text-slate-400">Lung Water Index</span>
              </div>
              <div className="mt-2 text-xs text-slate-300 font-medium">
                {pulmAudit.airwayBurnSeverity}
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400 truncate">
                {pulmAudit.pulmonaryEdemaSummary}
              </div>
            </div>

            {/* 3. Arterial vs Venous O2 Paradox */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Oxygen Extraction Paradox
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded font-bold ${
                    cellAudit.isHistotoxicHypoxia
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {cellAudit.isHistotoxicHypoxia ? 'Histotoxic Uncoupling' : 'Normal Extraction'}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-100">{svo2}%</span>
                <span className="text-xs text-slate-400">SvO2 (Venous Sat)</span>
              </div>
              <div className="mt-2 text-xs text-slate-300">
                PaO2: <strong className="text-white">{pao2} mmHg</strong> | Lactate: <strong className="text-rose-400">{lactate.toFixed(1)} mmol/L</strong>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400 truncate">
                Cells cannot extract O2; venous blood remains bright red.
              </div>
            </div>

            {/* 4. Antidote Efficacy Score */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Antidotal Coverage
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded font-bold ${
                    antidoteAudit.antidoteEfficacyPercent >= 70
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {antidoteAudit.antidoteEfficacyPercent}% Covered
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-100">{antidoteAudit.antidoteEfficacyPercent}%</span>
                <span className="text-xs text-slate-400">Efficacy</span>
              </div>
              <div className="mt-2 text-xs text-slate-300 truncate">
                First-Line: <strong className="text-amber-300">{antidoteAudit.recommendedFirstLineAntidote}</strong>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400 truncate">
                {hydroxoGrams >= 5 || nitrite || bicarbNeb ? 'Targeted antidote active' : 'Awaiting antidote deployment'}
              </div>
            </div>
          </div>

          {/* Actionable Protocol Steps */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <h4 className="text-xs font-semibold text-amber-300 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <FileText className="w-4 h-4 text-amber-400" />
              Actionable Hazmat Protocol Directives
            </h4>
            <div className="space-y-2">
              {antidoteAudit.actionableProtocolSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-200 flex items-start gap-2.5"
                >
                  <ChevronRight className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
