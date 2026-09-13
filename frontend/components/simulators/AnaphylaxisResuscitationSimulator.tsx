'use client';

import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Flame,
  Droplets,
  Zap,
  Activity,
  Heart,
  Sparkles,
  RefreshCw,
  AlertOctagon,
  Timer,
  Syringe,
  Wind,
  ShieldCheck,
  Stethoscope,
  Info,
  Clock,
  Pill,
  ChevronRight,
} from 'lucide-react';
import {
  evaluateWaoCriteria,
  calculateEpiPharmacokinetics,
  evaluateRefractoryShock,
  calculateBiphasicRisk,
  validateSerumTryptase,
  ANAPHYLAXIS_SCENARIOS,
  AllergenExposureCategory,
  InjectionSite,
  PatientAnaphylaxisState,
} from '../../.gemini/skills/AnaphylaxisResuscitationEngine';

export default function AnaphylaxisResuscitationSimulator() {
  const [selectedScenarioKey, setSelectedScenarioKey] = useState<string>('peanut_stridor_angioedema');
  const scenario = ANAPHYLAXIS_SCENARIOS[selectedScenarioKey] || ANAPHYLAXIS_SCENARIOS.peanut_stridor_angioedema;

  // Patient Core Profile
  const [weightKg, setWeightKg] = useState<number>(scenario.initialState.patientWeightKg);
  const [allergenCategory, setAllergenCategory] = useState<AllergenExposureCategory>(scenario.initialState.allergenCategory);
  const [isKnownAllergen, setIsKnownAllergen] = useState<boolean>(scenario.initialState.isAllergenKnownExposure);
  const [minutesSinceExposure, setMinutesSinceExposure] = useState<number>(scenario.initialState.minutesSinceExposure);
  const [onBetaBlocker, setOnBetaBlocker] = useState<boolean>(scenario.initialState.onBetaBlocker);
  const [onAceInhibitor, setOnAceInhibitor] = useState<boolean>(scenario.initialState.onAceInhibitor);

  // Organ System Manifestations
  const [urticaria, setUrticaria] = useState<boolean>(scenario.initialState.cutaneousSigns.generalizedUrticaria);
  const [pruritus, setPruritus] = useState<boolean>(scenario.initialState.cutaneousSigns.pruritusFlushing);
  const [angioedema, setAngioedema] = useState<boolean>(scenario.initialState.cutaneousSigns.angioedemaLipsTongueUvula);

  const [stridor, setStridor] = useState<boolean>(scenario.initialState.respiratorySigns.stridorLaryngealEdema);
  const [wheezing, setWheezing] = useState<boolean>(scenario.initialState.respiratorySigns.wheezingBronchospasm);
  const [tachypneaRr, setTachypneaRr] = useState<number>(scenario.initialState.respiratorySigns.tachypneaRr);
  const [spo2, setSpo2] = useState<number>(scenario.initialState.respiratorySigns.spo2Percent);

  const [systolicBp, setSystolicBp] = useState<number>(scenario.initialState.cardiovascularSigns.systolicBpMmHg);
  const [diastolicBp, setDiastolicBp] = useState<number>(scenario.initialState.cardiovascularSigns.diastolicBpMmHg);
  const [heartRate, setHeartRate] = useState<number>(scenario.initialState.cardiovascularSigns.heartRateBpm);
  const [syncope, setSyncope] = useState<boolean>(scenario.initialState.cardiovascularSigns.syncopeAlteredSensorium);

  const [abdominalCramping, setAbdominalCramping] = useState<boolean>(scenario.initialState.gastrointestinalSigns.severeAbdominalCramping);
  const [vomitingDiarrhea, setVomitingDiarrhea] = useState<boolean>(scenario.initialState.gastrointestinalSigns.repetitiveVomitingDiarrhea);

  // Resuscitation Interventions
  const [epinephrineDoses, setEpinephrineDoses] = useState(scenario.initialState.epinephrineDosesGiven);
  const [selectedSite, setSelectedSite] = useState<InjectionSite>('im_vastus_lateralis');
  const [selectedDoseMg, setSelectedDoseMg] = useState<number>(0.3);
  const [ivEpiInfusion, setIvEpiInfusion] = useState<number>(scenario.initialState.ivEpinephrineInfusionMcgKgMin);
  const [glucagonGiven, setGlucagonGiven] = useState<number>(scenario.initialState.glucagonGivenMg);
  const [methyleneBlueGiven, setMethyleneBlueGiven] = useState<number>(scenario.initialState.methyleneBlueGivenMgKg);
  const [crystalloidMl, setCrystalloidMl] = useState<number>(scenario.initialState.crystalloidInfusedMl);

  // Biomarkers
  const [acuteTryptase, setAcuteTryptase] = useState<number>(scenario.initialState.acuteSerumTryptaseMcgL);
  const [baselineTryptase, setBaselineTryptase] = useState<number>(scenario.initialState.baselineSerumTryptaseMcgL);

  // Load Scenario Handler
  const handleLoadScenario = (key: string) => {
    setSelectedScenarioKey(key);
    const sc = ANAPHYLAXIS_SCENARIOS[key];
    if (!sc) return;

    setWeightKg(sc.initialState.patientWeightKg);
    setAllergenCategory(sc.initialState.allergenCategory);
    setIsKnownAllergen(sc.initialState.isAllergenKnownExposure);
    setMinutesSinceExposure(sc.initialState.minutesSinceExposure);
    setOnBetaBlocker(sc.initialState.onBetaBlocker);
    setOnAceInhibitor(sc.initialState.onAceInhibitor);

    setUrticaria(sc.initialState.cutaneousSigns.generalizedUrticaria);
    setPruritus(sc.initialState.cutaneousSigns.pruritusFlushing);
    setAngioedema(sc.initialState.cutaneousSigns.angioedemaLipsTongueUvula);

    setStridor(sc.initialState.respiratorySigns.stridorLaryngealEdema);
    setWheezing(sc.initialState.respiratorySigns.wheezingBronchospasm);
    setTachypneaRr(sc.initialState.respiratorySigns.tachypneaRr);
    setSpo2(sc.initialState.respiratorySigns.spo2Percent);

    setSystolicBp(sc.initialState.cardiovascularSigns.systolicBpMmHg);
    setDiastolicBp(sc.initialState.cardiovascularSigns.diastolicBpMmHg);
    setHeartRate(sc.initialState.cardiovascularSigns.heartRateBpm);
    setSyncope(sc.initialState.cardiovascularSigns.syncopeAlteredSensorium);

    setAbdominalCramping(sc.initialState.gastrointestinalSigns.severeAbdominalCramping);
    setVomitingDiarrhea(sc.initialState.gastrointestinalSigns.repetitiveVomitingDiarrhea);

    setEpinephrineDoses(sc.initialState.epinephrineDosesGiven);
    setIvEpiInfusion(sc.initialState.ivEpinephrineInfusionMcgKgMin);
    setGlucagonGiven(sc.initialState.glucagonGivenMg);
    setMethyleneBlueGiven(sc.initialState.methyleneBlueGivenMgKg);
    setCrystalloidMl(sc.initialState.crystalloidInfusedMl);

    setAcuteTryptase(sc.initialState.acuteSerumTryptaseMcgL);
    setBaselineTryptase(sc.initialState.baselineSerumTryptaseMcgL);
  };

  // Compile Current Patient State
  const currentState: PatientAnaphylaxisState = useMemo(
    () => ({
      patientWeightKg: weightKg,
      allergenCategory,
      isAllergenKnownExposure: isKnownAllergen,
      minutesSinceExposure,
      onBetaBlocker,
      onAceInhibitor,
      cutaneousSigns: {
        generalizedUrticaria: urticaria,
        pruritusFlushing: pruritus,
        angioedemaLipsTongueUvula: angioedema,
      },
      respiratorySigns: {
        stridorLaryngealEdema: stridor,
        wheezingBronchospasm: wheezing,
        tachypneaRr,
        spo2Percent: spo2,
      },
      cardiovascularSigns: {
        systolicBpMmHg: systolicBp,
        diastolicBpMmHg: diastolicBp,
        heartRateBpm: heartRate,
        syncopeAlteredSensorium: syncope,
      },
      gastrointestinalSigns: {
        severeAbdominalCramping: abdominalCramping,
        repetitiveVomitingDiarrhea: vomitingDiarrhea,
      },
      epinephrineDosesGiven: epinephrineDoses,
      ivEpinephrineInfusionMcgKgMin: ivEpiInfusion,
      glucagonGivenMg: glucagonGiven,
      methyleneBlueGivenMgKg: methyleneBlueGiven,
      crystalloidInfusedMl: crystalloidMl,
      acuteSerumTryptaseMcgL: acuteTryptase,
      baselineSerumTryptaseMcgL: baselineTryptase,
    }),
    [
      weightKg,
      allergenCategory,
      isKnownAllergen,
      minutesSinceExposure,
      onBetaBlocker,
      onAceInhibitor,
      urticaria,
      pruritus,
      angioedema,
      stridor,
      wheezing,
      tachypneaRr,
      spo2,
      systolicBp,
      diastolicBp,
      heartRate,
      syncope,
      abdominalCramping,
      vomitingDiarrhea,
      epinephrineDoses,
      ivEpiInfusion,
      glucagonGiven,
      methyleneBlueGiven,
      crystalloidMl,
      acuteTryptase,
      baselineTryptase,
    ]
  );

  // Engine Calculations
  const waoReport = useMemo(() => evaluateWaoCriteria(currentState), [currentState]);
  const epiPkReport = useMemo(
    () => calculateEpiPharmacokinetics(epinephrineDoses, ivEpiInfusion, weightKg),
    [epinephrineDoses, ivEpiInfusion, weightKg]
  );
  const refractoryReport = useMemo(() => evaluateRefractoryShock(currentState), [currentState]);
  const biphasicReport = useMemo(() => calculateBiphasicRisk(currentState), [currentState]);
  const tryptaseReport = useMemo(
    () => validateSerumTryptase(acuteTryptase, baselineTryptase),
    [acuteTryptase, baselineTryptase]
  );

  // Action: Administer IM Epinephrine
  const handleAdministerImEpi = () => {
    const newDose = {
      doseMg: selectedDoseMg,
      site: selectedSite,
      minutesAgo: 1,
    };
    setEpinephrineDoses((prev) => [...prev, newDose]);

    // Simulate clinical response:
    // If Vastus Lateralis IM is given, blood pressure improves and stridor/wheezing wanes
    if (selectedSite === 'im_vastus_lateralis') {
      setSystolicBp((prev) => Math.min(130, prev + 22));
      setDiastolicBp((prev) => Math.min(80, prev + 14));
      setHeartRate((prev) => (onBetaBlocker ? prev + 6 : prev + 18));
      setStridor(false);
      setSpo2((prev) => Math.min(99, prev + 6));
    } else {
      // Suboptimal absorption gives delayed and modest response
      setSystolicBp((prev) => Math.min(130, prev + 8));
      setDiastolicBp((prev) => Math.min(80, prev + 5));
    }
  };

  // Action: Glucagon Bolus
  const handleAdministerGlucagon = () => {
    setGlucagonGiven(5);
    // Bypasses beta-blocker: improves MAP and terminates bronchospasm
    setSystolicBp((prev) => Math.min(125, prev + 28));
    setDiastolicBp((prev) => Math.min(78, prev + 18));
    setWheezing(false);
  };

  // Action: Methylene Blue Bolus
  const handleAdministerMethyleneBlue = () => {
    setMethyleneBlueGiven(2.0);
    // Inhibits nitric oxide vasoplegia
    setSystolicBp((prev) => Math.min(135, prev + 30));
    setDiastolicBp((prev) => Math.min(85, prev + 20));
  };

  // Action: Rapid Volume Expansion (1000 mL bolus)
  const handleInfuseCrystalloid = () => {
    setCrystalloidMl((prev) => prev + 1000);
    setSystolicBp((prev) => Math.min(130, prev + 10));
    setDiastolicBp((prev) => Math.min(80, prev + 6));
  };

  // Action: Reset Interventions
  const handleResetResuscitation = () => {
    setEpinephrineDoses([]);
    setIvEpiInfusion(0);
    setGlucagonGiven(0);
    setMethyleneBlueGiven(0);
    setCrystalloidMl(500);
    setSystolicBp(scenario.initialState.cardiovascularSigns.systolicBpMmHg);
    setDiastolicBp(scenario.initialState.cardiovascularSigns.diastolicBpMmHg);
    setHeartRate(scenario.initialState.cardiovascularSigns.heartRateBpm);
    setStridor(scenario.initialState.respiratorySigns.stridorLaryngealEdema);
    setWheezing(scenario.initialState.respiratorySigns.wheezingBronchospasm);
    setSpo2(scenario.initialState.respiratorySigns.spo2Percent);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                <Flame className="w-5 h-5 animate-pulse" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-400">
                Allergy, Immunology &amp; Emergency Critical Care Suite
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Anaphylaxis &amp; Refractory Vasoplegic Shock Workstation
            </h1>
            <p className="text-sm text-slate-400 max-w-3xl">
              Biophysical simulation of WAO/EAACI diagnostic criteria, Vastus Lateralis IM Epinephrine absorption
              kinetics, Refractory Vasoplegic Shock protocols (Continuous IV Epinephrine, Glucagon in Beta-Blocker
              patients, Methylene Blue), Biphasic Reaction scoring, and Serum Tryptase validation.
            </p>
          </div>

          {/* Quick Status Badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 ${
                waoReport.isAnaphylaxisConfirmed
                  ? 'bg-rose-950/70 border-rose-800 text-rose-300'
                  : 'bg-slate-800/70 border-slate-700 text-slate-300'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              {waoReport.isAnaphylaxisConfirmed ? 'WAO Anaphylaxis Confirmed' : 'Sub-Diagnostic Presentation'}
            </div>

            <div
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 ${
                refractoryReport.isRefractoryShock
                  ? 'bg-rose-950/70 border-rose-800 text-rose-300 animate-pulse'
                  : 'bg-emerald-950/70 border-emerald-800 text-emerald-300'
              }`}
            >
              {refractoryReport.isRefractoryShock ? (
                <>
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  REFRACTORY VASOPLEGIC SHOCK
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  MAP: {refractoryReport.meanArterialPressureMmHg} mmHg
                </>
              )}
            </div>
          </div>
        </div>

        {/* Clinical Scenario Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800/80">
          <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            Standard Anaphylaxis Case Scenarios:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2">
            {Object.entries(ANAPHYLAXIS_SCENARIOS).map(([key, sc]) => {
              const isSelected = selectedScenarioKey === key;
              return (
                <button
                  key={key}
                  onClick={() => handleLoadScenario(key)}
                  className={`px-3 py-2 text-left rounded-xl border text-xs transition-all ${
                    isSelected
                      ? 'bg-rose-950/40 border-rose-500/50 text-rose-200 shadow-md ring-1 ring-rose-500/30'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="font-semibold truncate">{sc.name}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                    BP {sc.initialState.cardiovascularSigns.systolicBpMmHg}/{sc.initialState.cardiovascularSigns.diastolicBpMmHg} &bull; {sc.initialState.allergenCategory}
                  </div>
                </button>
              );
            })}
          </div>
          <div className="mt-3 p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/50 text-xs text-slate-300">
            <span className="font-semibold text-amber-300">Case Vignette: </span>
            {scenario.patientSummary}
          </div>
        </div>
      </div>

      {/* Main Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Clinical Presentation & WAO Diagnosis (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Patient Profile & Allergen Trigger */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-cyan-400" />
                Allergen Trigger &amp; Host Factors
              </h2>
              <span className="text-xs text-slate-400 font-mono">Weight: {weightKg} kg</span>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Allergen Class</label>
                  <select
                    value={allergenCategory}
                    onChange={(e) => setAllergenCategory(e.target.value as AllergenExposureCategory)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="food">Food (Peanut / Tree Nut / Shellfish)</option>
                    <option value="venom">Venom (Hymenoptera / Wasp)</option>
                    <option value="medication_beta_lactam">Medication (Penicillin / Cefazolin)</option>
                    <option value="iodinated_contrast">Iodinated Radiocontrast</option>
                    <option value="idiopathic">Idiopathic</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Onset Latency</span>
                    <span className="font-mono text-cyan-300">{minutesSinceExposure} min</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="180"
                    value={minutesSinceExposure}
                    onChange={(e) => setMinutesSinceExposure(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/40 border border-slate-700/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isKnownAllergen}
                    onChange={(e) => setIsKnownAllergen(e.target.checked)}
                    className="w-4 h-4 accent-rose-500 rounded"
                  />
                  <span className="text-slate-300">Prior Known Allergy</span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/40 border border-slate-700/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onBetaBlocker}
                    onChange={(e) => setOnBetaBlocker(e.target.checked)}
                    className="w-4 h-4 accent-rose-500 rounded"
                  />
                  <span className="text-slate-300">On Chronic Beta-Blocker</span>
                </label>
              </div>
            </div>
          </div>

          {/* Organ Systems Checklist */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-rose-400" />
              Multi-Organ System Manifestations
            </h2>

            {/* Cutaneous */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-slate-300 block">1. Cutaneous &amp; Mucosal Signs</span>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={urticaria}
                    onChange={(e) => setUrticaria(e.target.checked)}
                    className="accent-rose-500 rounded"
                  />
                  <span>Hives / Urticaria</span>
                </label>
                <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pruritus}
                    onChange={(e) => setPruritus(e.target.checked)}
                    className="accent-rose-500 rounded"
                  />
                  <span>Pruritus / Flush</span>
                </label>
                <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={angioedema}
                    onChange={(e) => setAngioedema(e.target.checked)}
                    className="accent-rose-500 rounded"
                  />
                  <span>Angioedema</span>
                </label>
              </div>
            </div>

            {/* Respiratory */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-slate-300 block">2. Respiratory &amp; Airway Compromise</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={stridor}
                    onChange={(e) => setStridor(e.target.checked)}
                    className="accent-rose-500 rounded"
                  />
                  <span className={stridor ? 'text-rose-400 font-bold' : ''}>Laryngeal Stridor</span>
                </label>
                <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={wheezing}
                    onChange={(e) => setWheezing(e.target.checked)}
                    className="accent-rose-500 rounded"
                  />
                  <span>Bronchospasm</span>
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400">Resp Rate</span>
                    <span className="font-mono text-slate-200">{tachypneaRr} /min</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    value={tachypneaRr}
                    onChange={(e) => setTachypneaRr(parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400">SpO2</span>
                    <span className={`font-mono ${spo2 < 92 ? 'text-rose-400 font-bold' : 'text-emerald-400'}`}>
                      {spo2}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="70"
                    max="100"
                    value={spo2}
                    onChange={(e) => setSpo2(parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Cardiovascular Vitals */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-slate-300 block">3. Hemodynamics &amp; Perfusion</span>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Systolic BP</span>
                  <input
                    type="number"
                    value={systolicBp}
                    onChange={(e) => setSystolicBp(parseInt(e.target.value) || 40)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 font-mono text-slate-200"
                  />
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Diastolic BP</span>
                  <input
                    type="number"
                    value={diastolicBp}
                    onChange={(e) => setDiastolicBp(parseInt(e.target.value) || 20)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 font-mono text-slate-200"
                  />
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Heart Rate</span>
                  <input
                    type="number"
                    value={heartRate}
                    onChange={(e) => setHeartRate(parseInt(e.target.value) || 40)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 font-mono text-slate-200"
                  />
                </div>
              </div>
              <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={syncope}
                  onChange={(e) => setSyncope(e.target.checked)}
                  className="accent-rose-500 rounded"
                />
                <span className={syncope ? 'text-rose-400 font-bold' : ''}>
                  Syncope, Collapse, or Altered Sensorium
                </span>
              </label>
            </div>

            {/* Gastrointestinal */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-slate-300 block">4. Gastrointestinal Signs</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={abdominalCramping}
                    onChange={(e) => setAbdominalCramping(e.target.checked)}
                    className="accent-rose-500 rounded"
                  />
                  <span>Severe Abdominal Cramps</span>
                </label>
                <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={vomitingDiarrhea}
                    onChange={(e) => setVomitingDiarrhea(e.target.checked)}
                    className="accent-rose-500 rounded"
                  />
                  <span>Repetitive Vomiting / Diarrhea</span>
                </label>
              </div>
            </div>
          </div>

          {/* WAO Criteria Audit Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                WAO / EAACI Diagnostic Verification
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold bg-slate-800 text-rose-300 border border-slate-700">
                {waoReport.severityGrade}
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              {waoReport.fulfilledCriteria.length > 0 ? (
                waoReport.fulfilledCriteria.map((crit, i) => (
                  <div key={i} className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-emerald-200 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{crit}</span>
                  </div>
                ))
              ) : (
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400">
                  No consensus diagnostic criteria fulfilled yet.
                </div>
              )}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed pt-1">{waoReport.diagnosticRationale}</p>
          </div>
        </div>

        {/* Right Column: Resuscitation Protocols & Pharmacokinetics (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* STEP 1: Intramuscular Epinephrine & PK Engine */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Syringe className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-white">Step 1: First-Line Intramuscular Epinephrine</h2>
                  <p className="text-xs text-slate-400">Immediate 1:1,000 (1 mg/mL) IM injection; repeat every 5-15 min</p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-slate-400">Epinephrine Doses</div>
                <div className="text-lg font-mono font-bold text-emerald-400">
                  {epinephrineDoses.length} dose(s)
                </div>
              </div>
            </div>

            {/* Injection Site & Dose Selection Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Anatomical Injection Site</label>
                <div className="space-y-1.5">
                  <button
                    onClick={() => setSelectedSite('im_vastus_lateralis')}
                    className={`w-full p-2.5 rounded-xl border text-left transition ${
                      selectedSite === 'im_vastus_lateralis'
                        ? 'bg-emerald-950/50 border-emerald-500/70 text-emerald-200 ring-1 ring-emerald-500/30'
                        : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <div className="font-bold text-slate-200">Anterolateral Thigh (Vastus Lateralis)</div>
                    <div className="text-[10px] text-emerald-400 mt-0.5">Tmax: ~8 min &bull; Peak: ~2100 pg/mL (Gold Standard)</div>
                  </button>

                  <button
                    onClick={() => setSelectedSite('im_deltoid')}
                    className={`w-full p-2.5 rounded-xl border text-left transition ${
                      selectedSite === 'im_deltoid'
                        ? 'bg-amber-950/50 border-amber-500/70 text-amber-200 ring-1 ring-amber-500/30'
                        : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <div className="font-bold text-slate-200">Upper Arm (Deltoid Muscle)</div>
                    <div className="text-[10px] text-amber-400 mt-0.5">Tmax: ~25 min &bull; Peak: ~1300 pg/mL (Delayed)</div>
                  </button>

                  <button
                    onClick={() => setSelectedSite('subcutaneous')}
                    className={`w-full p-2.5 rounded-xl border text-left transition ${
                      selectedSite === 'subcutaneous'
                        ? 'bg-rose-950/50 border-rose-500/70 text-rose-200 ring-1 ring-rose-500/30'
                        : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <div className="font-bold text-slate-200">Subcutaneous (SC) Injection</div>
                    <div className="text-[10px] text-rose-400 mt-0.5">Tmax: ~34 min &bull; Peak: ~800 pg/mL (Impaired / Slow)</div>
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Dose Selection (1 mg/mL 1:1,000)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSelectedDoseMg(0.3)}
                      className={`p-2 rounded-xl border text-center font-mono font-bold text-xs ${
                        selectedDoseMg === 0.3
                          ? 'bg-cyan-950/60 border-cyan-500/70 text-cyan-200 ring-1 ring-cyan-500/30'
                          : 'bg-slate-800 border-slate-700 text-slate-300'
                      }`}
                    >
                      0.3 mg (Standard Auto-Injector)
                    </button>
                    <button
                      onClick={() => setSelectedDoseMg(0.5)}
                      className={`p-2 rounded-xl border text-center font-mono font-bold text-xs ${
                        selectedDoseMg === 0.5
                          ? 'bg-cyan-950/60 border-cyan-500/70 text-cyan-200 ring-1 ring-cyan-500/30'
                          : 'bg-slate-800 border-slate-700 text-slate-300'
                      }`}
                    >
                      0.5 mg (Severe Shock / Obese)
                    </button>
                  </div>
                </div>

                {/* Plasma Concentration Readout */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Plasma Epinephrine:</span>
                    <span className="text-emerald-400 font-bold text-sm">
                      {epiPkReport.currentPlasmaConcentrationPgMl} pg/mL
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Status: <strong className="text-cyan-300">{epiPkReport.therapeuticAdequacy}</strong>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-300"
                      style={{ width: `${Math.min(100, (epiPkReport.currentPlasmaConcentrationPgMl / 3000) * 100)}%` }}
                    />
                  </div>
                </div>

                <button
                  onClick={handleAdministerImEpi}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-900/30 transition flex items-center justify-center gap-2"
                >
                  <Syringe className="w-4 h-4" />
                  Administer Epinephrine {selectedDoseMg} mg IM ({selectedSite.replace('im_', '').replace('_', ' ')})
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800 leading-relaxed">
              {epiPkReport.clinicalPkComment}
            </p>
          </div>

          {/* STEP 2: Refractory Vasoplegic Shock & Glucagon Protocol */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                  <Flame className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-white">Step 2: Refractory Vasoplegic Shock Escalation</h2>
                  <p className="text-xs text-slate-400">Persistent shock after &ge; 2 IM doses; continuous IV vasopressors</p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-slate-400">MAP</div>
                <div
                  className={`text-lg font-mono font-bold ${
                    refractoryReport.meanArterialPressureMmHg < 65 ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {refractoryReport.meanArterialPressureMmHg} mmHg
                </div>
              </div>
            </div>

            {/* Continuous IV Epinephrine Titration Slider */}
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-200">Continuous IV Epinephrine Infusion:</span>
                <span className="font-mono text-cyan-300 font-bold">{ivEpiInfusion} mcg/kg/min</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={ivEpiInfusion}
                onChange={(e) => setIvEpiInfusion(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Start: 0.05 mcg/kg/min</span>
                <span>Titrate to MAP &ge; 65 mmHg</span>
                <span>Max: 1.0 mcg/kg/min</span>
              </div>
            </div>

            {/* Glucagon & Methylene Blue Rescue Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Glucagon Card */}
              <div
                className={`p-3.5 rounded-xl border space-y-2 ${
                  refractoryReport.glucagonIndicated
                    ? 'bg-amber-950/40 border-amber-500/70 text-amber-200 ring-1 ring-amber-500/30'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-slate-200">Glucagon Protocol (Beta-Blocker)</span>
                  <span className="font-mono text-[10px] uppercase font-bold">
                    {refractoryReport.glucagonIndicated ? 'Indicated' : 'Not Indicated'}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-300">
                  Activates adenylate cyclase via Gs-coupled glucagon receptors, bypassing blocked beta-receptors to
                  generate intracellular cAMP.
                </p>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-mono text-[11px]">Given: {glucagonGiven} mg</span>
                  <button
                    onClick={handleAdministerGlucagon}
                    disabled={!refractoryReport.glucagonIndicated}
                    className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white font-semibold text-[11px] transition shadow"
                  >
                    Give 5 mg IV Push
                  </button>
                </div>
              </div>

              {/* Methylene Blue & Crystalloid */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between font-semibold text-slate-200">
                  <span>Methylene Blue (NO Vasoplegia)</span>
                  <span className="font-mono text-[10px]">Given: {methyleneBlueGiven} mg/kg</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-400">
                  Inhibits inducible nitric oxide synthase (iNOS) and soluble guanylate cyclase (sGC) to restore
                  refractory vascular tone.
                </p>
                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={handleInfuseCrystalloid}
                    className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[10px] font-semibold border border-slate-700"
                  >
                    + 1000 mL Crystalloid ({crystalloidMl} mL total)
                  </button>
                  <button
                    onClick={handleAdministerMethyleneBlue}
                    className="px-2 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-semibold transition"
                  >
                    Give 2 mg/kg IV
                  </button>
                </div>
              </div>
            </div>

            {/* Directive Box */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <span className="font-semibold text-slate-300 block mb-1">Clinical Directive:</span>
              <p className="text-slate-400 leading-relaxed">{refractoryReport.clinicalActionDirective}</p>
            </div>
          </div>

          {/* STEP 3: Biphasic Prediction & Serum Tryptase Validation */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                  <Clock className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="text-base font-bold text-white">
                    Step 3: Biphasic Surveillance &amp; Tryptase Confirmation
                  </h2>
                  <p className="text-xs text-slate-400">Recurrence prediction (4-12h peak) and mast cell degranulation</p>
                </div>
              </div>

              <span
                className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                  biphasicReport.riskCategory.includes('High')
                    ? 'bg-rose-950/70 border-rose-800 text-rose-300'
                    : biphasicReport.riskCategory.includes('Moderate')
                    ? 'bg-amber-950/70 border-amber-800 text-amber-300'
                    : 'bg-emerald-950/70 border-emerald-800 text-emerald-300'
                }`}
              >
                {biphasicReport.riskCategory}
              </span>
            </div>

            {/* Biphasic Risk Factors */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span className="font-semibold">Mandatory Clinical Observation Window:</span>
                <span className="font-mono text-cyan-300 font-bold">
                  {biphasicReport.mandatoryObservationHours} hours
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400">Identified Biphasic Risk Factors:</span>
                <ul className="list-disc pl-4 space-y-0.5 text-slate-300 text-[11px]">
                  {biphasicReport.riskFactorsPresent.length > 0 ? (
                    biphasicReport.riskFactorsPresent.map((rf, i) => <li key={i}>{rf}</li>)
                  ) : (
                    <li className="text-slate-500 italic">No major high-risk triggers detected.</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Serum Tryptase Validation Box */}
            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200">
                  Serum Tryptase Consensus Formula: &ge; (1.2 &times; Baseline) + 2.0
                </span>
                <span
                  className={`font-mono font-bold text-xs ${
                    tryptaseReport.isMastCellActivationConfirmed ? 'text-emerald-400' : 'text-slate-400'
                  }`}
                >
                  {tryptaseReport.isMastCellActivationConfirmed ? 'DEGRANULATION CONFIRMED' : 'NEGATIVE / BASELINE'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400">Acute Tryptase (1-2h)</span>
                    <span className="font-mono text-purple-300">{acuteTryptase} mcg/L</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="80"
                    step="0.5"
                    value={acuteTryptase}
                    onChange={(e) => setAcuteTryptase(parseFloat(e.target.value))}
                    className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400">Baseline Tryptase</span>
                    <span className="font-mono text-slate-300">{baselineTryptase} mcg/L</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    step="0.5"
                    value={baselineTryptase}
                    onChange={(e) => setBaselineTryptase(parseFloat(e.target.value))}
                    className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-slate-500"
                  />
                </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">{tryptaseReport.interpretation}</p>
            </div>

            {/* Teaching Pearls & Reset */}
            <div className="pt-2 flex items-center justify-between">
              <div className="text-[11px] text-slate-500 italic">
                Rule: Epinephrine has NO absolute contraindications in life-threatening anaphylaxis.
              </div>
              <button
                onClick={handleResetResuscitation}
                className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-semibold transition flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset Resuscitation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
