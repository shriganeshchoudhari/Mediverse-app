'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  estimatePediatricWeightKg,
  getBroselowZone,
  calculateAirwayEquipment,
  calculatePalsMedications,
  calculateDefibrillation,
  getVitalSignReferences,
  calculateApgarScore,
  RESUSCITATION_CASE_SCENARIOS,
  MR_SOPA_STEPS,
  NRP_PREDUCTAL_TARGETS,
  BroselowColor,
  ResuscitationCaseScenario,
  ApgarEvaluationInput,
} from '@/.gemini/skills/PediatricResuscitationEngine';
import {
  Heart,
  Activity,
  Zap,
  ShieldAlert,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Baby,
  Stethoscope,
  BookOpen,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export default function PediatricResuscitationSimulator() {
  // Main Tab: PALS vs NRP
  const [activeTab, setActiveTab] = useState<'PALS' | 'NRP'>('PALS');

  // Patient Profile State
  const [ageMonths, setAgeMonths] = useState<number>(36); // Default 3 years (36 mo)
  const [isManualWeight, setIsManualWeight] = useState<boolean>(false);
  const [manualWeightKg, setManualWeightKg] = useState<number>(16.0);
  const [gender, setGender] = useState<'MALE' | 'FEMALE'>('MALE');

  // Selected Preset
  const [selectedPresetId, setSelectedPresetId] = useState<string>('pals-septic-shock');
  const [showVignette, setShowVignette] = useState<boolean>(true);
  const [revealedTeaching, setRevealedTeaching] = useState<boolean>(false);

  // APGAR State
  const [apgar, setApgar] = useState<ApgarEvaluationInput>({
    appearance: 2,
    pulse: 2,
    grimace: 2,
    activity: 2,
    respiration: 2,
  });

  // Effective Weight
  const effectiveWeightKg = useMemo(() => {
    if (isManualWeight) return manualWeightKg;
    return estimatePediatricWeightKg(ageMonths);
  }, [isManualWeight, manualWeightKg, ageMonths]);

  // Derived Calculations
  const broselowZone = useMemo(() => getBroselowZone(effectiveWeightKg), [effectiveWeightKg]);
  const airway = useMemo(() => calculateAirwayEquipment(ageMonths), [ageMonths]);
  const medications = useMemo(() => calculatePalsMedications(effectiveWeightKg), [effectiveWeightKg]);
  const defibrillation = useMemo(() => calculateDefibrillation(effectiveWeightKg), [effectiveWeightKg]);
  const vitals = useMemo(() => getVitalSignReferences(ageMonths), [ageMonths]);
  const apgarResult = useMemo(() => calculateApgarScore(apgar), [apgar]);

  const activePreset = useMemo(
    () => RESUSCITATION_CASE_SCENARIOS.find((p) => p.id === selectedPresetId) || RESUSCITATION_CASE_SCENARIOS[0],
    [selectedPresetId]
  );

  // Load Preset
  const handleSelectPreset = useCallback((preset: ResuscitationCaseScenario) => {
    setSelectedPresetId(preset.id);
    setActiveTab(preset.category);
    setAgeMonths(preset.ageMonths);
    setIsManualWeight(true);
    setManualWeightKg(preset.weightKg);
    setRevealedTeaching(false);
  }, []);

  // Consult Socratic AI
  const handleConsultAI = useCallback(() => {
    let summary = '';
    if (activeTab === 'PALS') {
      summary = `Patient: ${ageMonths} mo (${(ageMonths / 12).toFixed(1)} yrs), Weight: ${effectiveWeightKg} kg (Broselow: ${broselowZone.color}). Airway: ETT ${airway.cuffedEttIdMm} mm cuffed, Depth ${airway.ettDepthAtLipCm} cm. Arrest Epi: ${medications[0].calculatedDoseMg} mg (${medications[0].volumeMl} mL), Defib: ${defibrillation.initialDefibJoules} J (2 J/kg) -> ${defibrillation.subsequentDefibJoules} J (4 J/kg). Normal HR: ${vitals.normalHeartRateBpm.min}-${vitals.normalHeartRateBpm.max}, Hypotension SBP floor: ${vitals.hypotensionThresholdMmHg} mmHg.`;
    } else {
      summary = `Neonate Resuscitation: Weight ${effectiveWeightKg} kg. APGAR Score: ${apgarResult.totalScore}/10 (${apgarResult.clinicalCategory}). Pre-ductal SpO2 target at 1 min: 60-65%, 5 min: 80-85%. Action: ${apgarResult.actionRequired}.`;
    }

    const context = `[Pediatric & Neonatal Resuscitation Workstation - Mode: ${activeTab}]\nScenario: ${activePreset.title}\nVignette: ${activePreset.vignette}\nInitial Vitals: ${activePreset.initialVitals}\nCalculated Resuscitation State: ${summary}\nPlease explain the emergency clinical algorithm, drug rationale, and airway considerations.`;

    window.dispatchEvent(
      new CustomEvent('mediverse:open-ai-with-context', {
        detail: { context },
      })
    );
  }, [activeTab, ageMonths, effectiveWeightKg, broselowZone, airway, medications, defibrillation, vitals, apgarResult, activePreset]);

  // Reset to default
  const handleReset = useCallback(() => {
    setAgeMonths(36);
    setIsManualWeight(false);
    setManualWeightKg(16.0);
    setGender('MALE');
    setApgar({
      appearance: 2,
      pulse: 2,
      grimace: 2,
      activity: 2,
      respiration: 2,
    });
    setRevealedTeaching(false);
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 text-slate-100">
      {/* ----------------- Header & Tabs ----------------- */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400">
                <Baby className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                  Pediatric &amp; Neonatal Resuscitation Workstation
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 font-mono">
                    PALS / NRP 8th Ed
                  </span>
                </h1>
                <p className="text-sm text-slate-400">
                  Broselow color tape, age-adjusted weight estimation, endotracheal sizing, PALS emergency drug calculator, and NRP Golden Minute APGAR scoring.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleConsultAI}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold rounded-xl shadow-lg transition"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              Consult Socratic AI
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium rounded-xl transition"
              title="Reset parameters to 3-year-old baseline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-3 mt-6 pt-5 border-t border-slate-800">
          <button
            onClick={() => setActiveTab('PALS')}
            className={`py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              activeTab === 'PALS'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20'
                : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-700/50'
            }`}
          >
            <Heart className="w-4 h-4" />
            PALS Resuscitation &amp; Weight-Based Drug Calculator
          </button>
          <button
            onClick={() => setActiveTab('NRP')}
            className={`py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              activeTab === 'NRP'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20'
                : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-700/50'
            }`}
          >
            <Baby className="w-4 h-4" />
            NRP Neonatal Golden-Minute &amp; APGAR Suite
          </button>
        </div>
      </div>

      {/* ----------------- Broselow Color Ribbon & Patient Profile ----------------- */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Patient Age & Weight Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-300">Patient Age</span>
                <span className="font-mono font-bold text-rose-400">
                  {ageMonths < 12 ? `${ageMonths} months` : `${(ageMonths / 12).toFixed(1)} years`}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="144"
                step="1"
                value={ageMonths}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setAgeMonths(val);
                  setIsManualWeight(false);
                }}
                className="w-full accent-rose-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>Neonate (0m)</span>
                <span>5 yrs (60m)</span>
                <span>12 yrs (144m)</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-300">
                  Weight: <strong className="text-white">{effectiveWeightKg} kg</strong>
                </span>
                <button
                  onClick={() => setIsManualWeight(!isManualWeight)}
                  className="text-[10px] text-rose-400 hover:text-rose-300"
                >
                  {isManualWeight ? 'Use Estimated' : 'Manual Override'}
                </button>
              </div>
              <input
                type="range"
                min="2.5"
                max="50.0"
                step="0.5"
                value={effectiveWeightKg}
                onChange={(e) => {
                  setIsManualWeight(true);
                  setManualWeightKg(parseFloat(e.target.value));
                }}
                className="w-full accent-rose-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>3 kg</span>
                <span>20 kg</span>
                <span>50 kg</span>
              </div>
            </div>

            <div className="flex flex-col justify-center gap-1.5">
              <span className="text-xs text-slate-300 font-semibold">Gender</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setGender('MALE')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold ${
                    gender === 'MALE' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  Male
                </button>
                <button
                  onClick={() => setGender('FEMALE')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold ${
                    gender === 'FEMALE' ? 'bg-pink-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  Female
                </button>
              </div>
            </div>
          </div>

          {/* Broselow Badge */}
          <div
            className="p-4 rounded-xl border flex items-center gap-3 self-stretch sm:self-auto min-w-[220px]"
            style={{
              backgroundColor: `${broselowZone.hexCode}20`,
              borderColor: `${broselowZone.hexCode}60`,
            }}
          >
            <div
              className="w-4 h-12 rounded-full flex-shrink-0"
              style={{ backgroundColor: broselowZone.hexCode }}
            />
            <div>
              <span
                className="text-[10px] font-bold uppercase tracking-wider font-mono block"
                style={{ color: broselowZone.hexCode }}
              >
                Broselow Zone
              </span>
              <p className="text-base font-bold text-white uppercase">{broselowZone.color}</p>
              <p className="text-[11px] text-slate-300">
                {broselowZone.weightRangeKg.min} - {broselowZone.weightRangeKg.max} kg ({broselowZone.lengthRangeCm.min} - {broselowZone.lengthRangeCm.max} cm)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ----------------- Presets Drawer ----------------- */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-rose-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              High-Yield Resuscitation Case Scenarios
            </span>
          </div>
          <button
            onClick={() => setShowVignette(!showVignette)}
            className="text-xs text-rose-400 hover:text-rose-300 font-medium"
          >
            {showVignette ? 'Hide Case Details' : 'Show Case Details'}
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700">
          {RESUSCITATION_CASE_SCENARIOS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition border ${
                selectedPresetId === preset.id
                  ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 font-semibold'
                  : 'bg-slate-800/70 hover:bg-slate-800 border-slate-700/60 text-slate-400'
              }`}
            >
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950/80 mr-1.5 font-mono text-slate-400">
                {preset.category}
              </span>
              {preset.title}
            </button>
          ))}
        </div>

        {showVignette && activePreset && (
          <div className="mt-3.5 p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                Case: {activePreset.title}
              </h3>
              <button
                onClick={() => setRevealedTeaching(!revealedTeaching)}
                className="text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-rose-300 border border-rose-500/30 rounded-lg transition self-start sm:self-auto"
              >
                {revealedTeaching ? 'Hide Teaching Pearls' : 'Reveal Expected Management'}
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{activePreset.vignette}</p>
            <p className="text-xs text-rose-300 font-mono bg-rose-950/30 p-2 rounded-lg border border-rose-900/50">
              Initial Vitals: {activePreset.initialVitals}
            </p>

            {revealedTeaching && (
              <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/30 space-y-2 text-xs">
                <p className="font-semibold text-rose-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  PALS / NRP Management &amp; Board Pearls:
                </p>
                <ul className="space-y-1.5 pl-4 list-disc text-slate-300">
                  {activePreset.expectedActions.map((act, idx) => (
                    <li key={idx}>{act}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ----------------- TAB 1: PALS Emergency Workstation ----------------- */}
      {activeTab === 'PALS' && (
        <div className="space-y-6">
          {/* Top Row: Airway Equipment & Defibrillation Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Airway Equipment Card (6 Cols) */}
            <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
                <Stethoscope className="w-4 h-4 text-rose-400" />
                Airway &amp; Endotracheal Equipment Sizing
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Cuffed ETT ID</span>
                  <p className="text-base font-bold text-rose-400 mt-0.5">{airway.cuffedEttIdMm} mm</p>
                  <span className="text-[10px] text-slate-400">Formula: Age/4 + 3.5</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Uncuffed ETT ID</span>
                  <p className="text-base font-bold text-rose-400 mt-0.5">{airway.uncuffedEttIdMm} mm</p>
                  <span className="text-[10px] text-slate-400">Formula: Age/4 + 4</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Depth at Lip</span>
                  <p className="text-base font-bold text-rose-400 mt-0.5">{airway.ettDepthAtLipCm} cm</p>
                  <span className="text-[10px] text-slate-400">3 × ETT ID</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Laryngoscope</span>
                  <p className="text-xs font-bold text-rose-400 mt-0.5">{airway.laryngoscopeBlade}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Suction Catheter</span>
                  <p className="text-base font-bold text-rose-400 mt-0.5">{airway.suctionCatheterFr} Fr</p>
                  <span className="text-[10px] text-slate-400">2 × ETT ID</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Chest Tube</span>
                  <p className="text-base font-bold text-rose-400 mt-0.5">{airway.chestTubeFr} Fr</p>
                  <span className="text-[10px] text-slate-400">4 × ETT ID</span>
                </div>
              </div>
            </div>

            {/* Electrical Defibrillation & Vitals (6 Cols) */}
            <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
                <Zap className="w-4 h-4 text-amber-400" />
                Electrical Therapy &amp; Vital Sign Targets
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">1st Defib Shock</span>
                  <p className="text-base font-bold text-amber-400 mt-0.5">{defibrillation.initialDefibJoules} Joules</p>
                  <span className="text-[10px] text-slate-400">2 J/kg</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">2nd+ Defib Shock</span>
                  <p className="text-base font-bold text-amber-400 mt-0.5">{defibrillation.subsequentDefibJoules} Joules</p>
                  <span className="text-[10px] text-slate-400">4 J/kg (max 10 J/kg)</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Sync Cardioversion</span>
                  <p className="text-base font-bold text-amber-400 mt-0.5">{defibrillation.synchronizedCardioversionJoules} Joules</p>
                  <span className="text-[10px] text-slate-400">0.5 - 1.0 J/kg</span>
                </div>
              </div>

              {/* Vitals reference box */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-slate-300">
                  <span>Age Group:</span>
                  <strong className="text-white">{vitals.ageGroup}</strong>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Normal Heart Rate:</span>
                  <strong className="text-emerald-400">{vitals.normalHeartRateBpm.min} - {vitals.normalHeartRateBpm.max} bpm</strong>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Normal Respiratory Rate:</span>
                  <strong className="text-emerald-400">{vitals.normalRespiratoryRate.min} - {vitals.normalRespiratoryRate.max} /min</strong>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Hypotension Threshold (SBP):</span>
                  <strong className="text-rose-400">&lt; {vitals.hypotensionThresholdMmHg} mmHg</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row: PALS Emergency Resuscitation Medication Table */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-rose-400" />
              Weight-Based Emergency Drug Formulary ({effectiveWeightKg} kg)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                    <th className="py-2.5 px-3">Medication</th>
                    <th className="py-2.5 px-3">Calculated Dose</th>
                    <th className="py-2.5 px-3">Volume to Draw</th>
                    <th className="py-2.5 px-3">Route</th>
                    <th className="py-2.5 px-3">Dose Rule &amp; Clinical Context</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {medications.map((med, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition">
                      <td className="py-2.5 px-3 font-semibold text-white font-sans">{med.name}</td>
                      <td className="py-2.5 px-3 text-rose-400 font-bold">
                        {med.calculatedDoseMg} {med.unit}
                      </td>
                      <td className="py-2.5 px-3 text-amber-300">
                        {med.volumeMl !== null ? `${med.volumeMl} mL` : '--'}
                      </td>
                      <td className="py-2.5 px-3 text-slate-300">{med.route}</td>
                      <td className="py-2.5 px-3 text-[11px] text-slate-400 font-sans">{med.clinicalNote}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- TAB 2: NRP Neonatal Golden-Minute Suite ----------------- */}
      {activeTab === 'NRP' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Interactive APGAR Calculator (7 Cols) */}
            <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Baby className="w-4 h-4 text-rose-400" />
                  APGAR Scoring Engine (0 - 10 Scale)
                </h3>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold font-mono ${
                  apgarResult.clinicalCategory === 'NORMAL_REASSURING'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : apgarResult.clinicalCategory === 'MODERATELY_ABNORMAL'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}>
                  Score: {apgarResult.totalScore} / 10 ({apgarResult.clinicalCategory.replace('_', ' ')})
                </span>
              </div>

              {/* 5 APGAR Fields */}
              <div className="space-y-3 text-xs">
                {/* 1. Appearance */}
                <div className="space-y-1">
                  <span className="font-semibold text-slate-300 block">1. Appearance (Skin Color)</span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { val: 0, label: '0: Blue / Pale all over' },
                      { val: 1, label: '1: Acrocyanosis (pink body, blue hands/feet)' },
                      { val: 2, label: '2: Completely Pink' },
                    ].map((opt) => (
                      <button
                        key={opt.val}
                        onClick={() => setApgar({ ...apgar, appearance: opt.val as 0 | 1 | 2 })}
                        className={`p-2 rounded-lg text-left transition border ${
                          apgar.appearance === opt.val
                            ? 'bg-rose-600/30 border-rose-500 text-white font-semibold'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Pulse */}
                <div className="space-y-1">
                  <span className="font-semibold text-slate-300 block">2. Pulse (Heart Rate)</span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { val: 0, label: '0: Absent' },
                      { val: 1, label: '1: < 100 bpm' },
                      { val: 2, label: '2: ≥ 100 bpm' },
                    ].map((opt) => (
                      <button
                        key={opt.val}
                        onClick={() => setApgar({ ...apgar, pulse: opt.val as 0 | 1 | 2 })}
                        className={`p-2 rounded-lg text-left transition border ${
                          apgar.pulse === opt.val
                            ? 'bg-rose-600/30 border-rose-500 text-white font-semibold'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Grimace */}
                <div className="space-y-1">
                  <span className="font-semibold text-slate-300 block">3. Grimace (Reflex Irritability)</span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { val: 0, label: '0: Flaccid / No response' },
                      { val: 1, label: '1: Grimace / Feeble cry' },
                      { val: 2, label: '2: Vigorous Cry / Cough / Sneeze' },
                    ].map((opt) => (
                      <button
                        key={opt.val}
                        onClick={() => setApgar({ ...apgar, grimace: opt.val as 0 | 1 | 2 })}
                        className={`p-2 rounded-lg text-left transition border ${
                          apgar.grimace === opt.val
                            ? 'bg-rose-600/30 border-rose-500 text-white font-semibold'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Activity */}
                <div className="space-y-1">
                  <span className="font-semibold text-slate-300 block">4. Activity (Muscle Tone)</span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { val: 0, label: '0: Limp / Absent' },
                      { val: 1, label: '1: Some flexion of arms/legs' },
                      { val: 2, label: '2: Active motion' },
                    ].map((opt) => (
                      <button
                        key={opt.val}
                        onClick={() => setApgar({ ...apgar, activity: opt.val as 0 | 1 | 2 })}
                        className={`p-2 rounded-lg text-left transition border ${
                          apgar.activity === opt.val
                            ? 'bg-rose-600/30 border-rose-500 text-white font-semibold'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. Respiration */}
                <div className="space-y-1">
                  <span className="font-semibold text-slate-300 block">5. Respiration (Respiratory Effort)</span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { val: 0, label: '0: Absent' },
                      { val: 1, label: '1: Slow / Irregular / Weak' },
                      { val: 2, label: '2: Good / Strong Cry' },
                    ].map((opt) => (
                      <button
                        key={opt.val}
                        onClick={() => setApgar({ ...apgar, respiration: opt.val as 0 | 1 | 2 })}
                        className={`p-2 rounded-lg text-left transition border ${
                          apgar.respiration === opt.val
                            ? 'bg-rose-600/30 border-rose-500 text-white font-semibold'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action guidance */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                <p className="font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
                  {apgarResult.clinicalInterpretation}
                </p>
                <p className="text-slate-300 leading-relaxed">{apgarResult.actionRequired}</p>
              </div>
            </div>

            {/* NRP Pre-Ductal SpO2 & MR. SOPA (5 Cols) */}
            <div className="lg:col-span-5 space-y-5">
              {/* Pre-Ductal SpO2 Card */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  NRP Pre-Ductal SpO2 Targets (Right Wrist)
                </h3>
                <div className="space-y-1.5">
                  {NRP_PREDUCTAL_TARGETS.map((target) => (
                    <div
                      key={target.minuteOfLife}
                      className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs font-mono"
                    >
                      <span className="text-slate-300">{target.minuteOfLife} min of life</span>
                      <strong className="text-emerald-400">
                        {target.targetSpO2RangePercent.min}% - {target.targetSpO2RangePercent.max}%
                      </strong>
                    </div>
                  ))}
                </div>
              </div>

              {/* MR. SOPA Corrective Steps */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  MR. SOPA Ventilation Troubleshooter
                </h3>
                <div className="space-y-1.5 text-xs">
                  {MR_SOPA_STEPS.map((step) => (
                    <div key={step.letter} className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center font-mono">
                          {step.letter}
                        </span>
                        <strong className="text-white">{step.action}</strong>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 pl-7">{step.technique}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
