'use client';

import React, { useState, useMemo } from 'react';
import {
  Activity,
  AlertTriangle,
  Heart,
  ShieldAlert,
  Brain,
  Zap,
  Info,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Stethoscope,
  Flame,
  ArrowDownRight,
  TrendingDown,
  Clock,
  Gauge
} from 'lucide-react';
import {
  PatientVitals,
  DrugDosing,
  AntihypertensiveDrug,
  TargetOrganDamageType,
  evaluateHypertensiveCrisis,
  calculateMap,
  CLINICAL_PRESETS
} from '../../.gemini/skills/HypertensiveCrisisTitrationEngine';

export function HypertensiveCrisisSimulator() {
  const [activeTab, setActiveTab] = useState<'patient' | 'titration' | 'autoregulation' | 'protocols' | 'toxicology'>('patient');

  // Patient state
  const [sbp, setSbp] = useState<number>(195);
  const [dbp, setDbp] = useState<number>(115);
  const [heartRate, setHeartRate] = useState<number>(105);
  const [weightKg, setWeightKg] = useState<number>(85);
  const [chronicHypertension, setChronicHypertension] = useState<boolean>(true);
  const [targetOrganDamage, setTargetOrganDamage] = useState<TargetOrganDamageType>('aortic_dissection');
  const [historyOfAsthmaCopd, setHistoryOfAsthmaCopd] = useState<boolean>(false);
  const [heartFailureWithReducedEf, setHeartFailureWithReducedEf] = useState<boolean>(false);
  const [renalImpairment, setRenalImpairment] = useState<boolean>(false);

  // Active IV Drug Titrations
  const [nicardipineRate, setNicardipineRate] = useState<number>(0); // mg/h (0-15)
  const [clevidipineRate, setClevidipineRate] = useState<number>(0); // mg/h (0-32)
  const [clevidipineHours, setClevidipineHours] = useState<number>(1);
  const [labetalolBolus, setLabetalolBolus] = useState<number>(0); // mg (0-80)
  const [labetalolRate, setLabetalolRate] = useState<number>(0); // mg/min (0-4)
  const [esmololBolus, setEsmololBolus] = useState<number>(0); // mg (0-50)
  const [esmololRate, setEsmololRate] = useState<number>(0); // mcg/kg/min (0-300)
  const [nitroprussideRate, setNitroprussideRate] = useState<number>(0); // mcg/kg/min (0-10)
  const [nitroprussideHours, setNitroprussideHours] = useState<number>(1);
  const [nitroglycerinRate, setNitroglycerinRate] = useState<number>(0); // mcg/min (0-400)
  const [hydralazineBolus, setHydralazineBolus] = useState<number>(0); // mg (0-20)

  // Current patient vitals structure
  const patient: PatientVitals = useMemo(() => ({
    sbp,
    dbp,
    heartRate,
    weightKg,
    chronicHypertension,
    targetOrganDamage,
    historyOfAsthmaCopd,
    heartFailureWithReducedEf,
    renalImpairment
  }), [sbp, dbp, heartRate, weightKg, chronicHypertension, targetOrganDamage, historyOfAsthmaCopd, heartFailureWithReducedEf, renalImpairment]);

  // Drug dosings array
  const drugDosings: DrugDosing[] = useMemo(() => {
    const list: DrugDosing[] = [];
    if (nicardipineRate > 0) list.push({ drug: 'nicardipine', infusionRate: nicardipineRate });
    if (clevidipineRate > 0) list.push({ drug: 'clevidipine', infusionRate: clevidipineRate, durationHours: clevidipineHours });
    if (labetalolBolus > 0 || labetalolRate > 0) list.push({ drug: 'labetalol', ivBolusDoseMg: labetalolBolus, infusionRate: labetalolRate });
    if (esmololBolus > 0 || esmololRate > 0) list.push({ drug: 'esmolol', ivBolusDoseMg: esmololBolus, infusionRate: esmololRate });
    if (nitroprussideRate > 0) list.push({ drug: 'nitroprusside', infusionRate: nitroprussideRate, durationHours: nitroprussideHours });
    if (nitroglycerinRate > 0) list.push({ drug: 'nitroglycerin', infusionRate: nitroglycerinRate });
    if (hydralazineBolus > 0) list.push({ drug: 'hydralazine', ivBolusDoseMg: hydralazineBolus, infusionRate: 0 });
    return list;
  }, [nicardipineRate, clevidipineRate, clevidipineHours, labetalolBolus, labetalolRate, esmololBolus, esmololRate, nitroprussideRate, nitroprussideHours, nitroglycerinRate, hydralazineBolus]);

  // Run calculation engine
  const assessment = useMemo(() => evaluateHypertensiveCrisis(patient, drugDosings), [patient, drugDosings]);

  // Load preset handler
  const loadPreset = (presetId: string) => {
    const found = CLINICAL_PRESETS.find(p => p.id === presetId);
    if (!found) return;
    setSbp(found.patient.sbp);
    setDbp(found.patient.dbp);
    setHeartRate(found.patient.heartRate);
    setWeightKg(found.patient.weightKg);
    setChronicHypertension(found.patient.chronicHypertension);
    setTargetOrganDamage(found.patient.targetOrganDamage);
    setHistoryOfAsthmaCopd(!!found.patient.historyOfAsthmaCopd);
    setHeartFailureWithReducedEf(!!found.patient.heartFailureWithReducedEf);
    setRenalImpairment(!!found.patient.renalImpairment);

    // Reset drug titrations
    setNicardipineRate(0);
    setClevidipineRate(0);
    setClevidipineHours(1);
    setLabetalolBolus(0);
    setLabetalolRate(0);
    setEsmololBolus(0);
    setEsmololRate(0);
    setNitroprussideRate(0);
    setNitroprussideHours(1);
    setNitroglycerinRate(0);
    setHydralazineBolus(0);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6 lg:p-8 font-sans">
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Track A66
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Cardiovascular Critical Care & Neuroprotection
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                AHA/ACC & Neurocritical Care Guidelines
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <Activity className="w-8 h-8 text-rose-500 animate-pulse" />
              Hypertensive Crisis & IV Antihypertensive Titration Workstation
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-3xl">
              Emergency vs Urgency triage, acute target organ damage stratification, cerebral autoregulation curve shifts, and precision pharmacotherapy bench (Nicardipine, Clevidipine, Labetalol, Esmolol, Nitroprusside, Nitroglycerin).
            </p>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap gap-2 items-center">
            {CLINICAL_PRESETS.map(preset => (
              <button
                key={preset.id}
                onClick={() => loadPreset(preset.id)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition shadow-sm"
              >
                {preset.name.split(' ')[1] || preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* 5 Executive KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-4">
          {/* Card 1: Blood Pressure & MAP */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Current BP &amp; MAP</span>
              <Gauge className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-bold text-white tracking-tight">
              {assessment.vitals.sbp}/{assessment.vitals.dbp} <span className="text-xs font-normal text-slate-400">mmHg</span>
            </div>
            <div className="flex items-center justify-between mt-1 text-xs">
              <span className="text-slate-400">MAP: <strong className="text-indigo-300 font-semibold">{assessment.vitals.map} mmHg</strong></span>
              <span className={`font-semibold ${assessment.goalsAchieved.sbpInTarget ? 'text-emerald-400' : 'text-amber-400'}`}>
                {assessment.goalsAchieved.sbpInTarget ? 'In Target' : 'Out of Goal'}
              </span>
            </div>
          </div>

          {/* Card 2: 1-Hour MAP Drop Rate */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>1-Hour MAP Drop</span>
              <TrendingDown className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-white tracking-tight flex items-baseline gap-2">
              <span>{assessment.autoregulation.mapDropPercent}%</span>
              <span className="text-xs font-normal text-slate-400">
                (Ceiling: &le;{assessment.targets.maxFirstHourMapDropPercent}%)
              </span>
            </div>
            <div className="flex items-center justify-between mt-1 text-xs">
              <span className="text-slate-400">Baseline MAP: {assessment.startingVitals.map}</span>
              <span className={`font-semibold ${assessment.goalsAchieved.safeRateOfDrop ? 'text-emerald-400' : 'text-rose-400'}`}>
                {assessment.goalsAchieved.safeRateOfDrop ? 'Safe Rate' : 'Precipitous Drop!'}
              </span>
            </div>
          </div>

          {/* Card 3: Heart Rate & Shear Control */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Heart Rate &amp; dP/dt</span>
              <Heart className="w-4 h-4 text-red-400" />
            </div>
            <div className="text-2xl font-bold text-white tracking-tight">
              {assessment.vitals.heartRate} <span className="text-xs font-normal text-slate-400">bpm</span>
            </div>
            <div className="flex items-center justify-between mt-1 text-xs">
              <span className="text-slate-400">Target: {assessment.targets.hrTargetMax ? `< ${assessment.targets.hrTargetMax} bpm` : 'Standard'}</span>
              <span className={`font-semibold ${assessment.goalsAchieved.hrInTarget ? 'text-emerald-400' : 'text-rose-400'}`}>
                {assessment.goalsAchieved.hrInTarget ? 'Target Met' : 'Tachycardia Hazard'}
              </span>
            </div>
          </div>

          {/* Card 4: Cerebral Autoregulation */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Autoregulation Status</span>
              <Brain className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-base font-bold truncate">
              {assessment.autoregulation.isBelowLowerLimit ? (
                <span className="text-rose-400 flex items-center gap-1"><AlertTriangle className="w-4 h-4" /> Watershed Danger</span>
              ) : assessment.autoregulation.isAboveUpperLimit ? (
                <span className="text-amber-400 flex items-center gap-1"><Flame className="w-4 h-4" /> Hyperperfusion</span>
              ) : (
                <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Safe Plateau</span>
              )}
            </div>
            <div className="mt-1 text-xs text-slate-400 truncate">
              Lower limit: {assessment.autoregulation.lowerAutoregulationLimitMap} mmHg
            </div>
          </div>

          {/* Card 5: Overall Crisis Resolution */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Clinical Evaluation</span>
              <ShieldAlert className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-base font-bold truncate">
              {assessment.goalsAchieved.overallSuccess ? (
                <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Protocol Success</span>
              ) : (
                <span className="text-amber-400 flex items-center gap-1"><XCircle className="w-4 h-4" /> Optimization Req.</span>
              )}
            </div>
            <div className="mt-1 text-xs text-slate-400 truncate">
              {assessment.targets.classification}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout with Navigation Tabs */}
      <div className="max-w-7xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 overflow-x-auto bg-slate-950/60 p-1">
          <button
            onClick={() => setActiveTab('patient')}
            className={`flex items-center gap-2 px-4 py-3 text-xs md:text-sm font-semibold rounded-xl transition whitespace-nowrap ${
              activeTab === 'patient'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            1. Patient Presentation &amp; Triage
          </button>
          <button
            onClick={() => setActiveTab('titration')}
            className={`flex items-center gap-2 px-4 py-3 text-xs md:text-sm font-semibold rounded-xl transition whitespace-nowrap ${
              activeTab === 'titration'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Activity className="w-4 h-4" />
            2. IV Antihypertensive Titration
          </button>
          <button
            onClick={() => setActiveTab('autoregulation')}
            className={`flex items-center gap-2 px-4 py-3 text-xs md:text-sm font-semibold rounded-xl transition whitespace-nowrap ${
              activeTab === 'autoregulation'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Brain className="w-4 h-4" />
            3. Cerebral Autoregulation &amp; Watershed
          </button>
          <button
            onClick={() => setActiveTab('protocols')}
            className={`flex items-center gap-2 px-4 py-3 text-xs md:text-sm font-semibold rounded-xl transition whitespace-nowrap ${
              activeTab === 'protocols'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Zap className="w-4 h-4" />
            4. Condition-Specific Guidelines
          </button>
          <button
            onClick={() => setActiveTab('toxicology')}
            className={`flex items-center gap-2 px-4 py-3 text-xs md:text-sm font-semibold rounded-xl transition whitespace-nowrap ${
              activeTab === 'toxicology'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            5. Toxicology &amp; Drug Safety
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-5 md:p-7">
          {/* TAB 1: Patient Presentation & Triage */}
          {activeTab === 'patient' && (
            <div className="space-y-6">
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
                  <Stethoscope className="w-5 h-5 text-rose-400" />
                  Initial Triage &amp; Target Organ Damage (TOD) Phenotype
                </h2>
                <p className="text-sm text-slate-300">
                  Hypertensive Emergency requires the presence of <strong>acute target organ damage</strong>. Hypertensive Urgency features severe BP elevation without acute organ compromise and should never be treated with rapid IV infusions.
                </p>
              </div>

              {/* Target Organ Damage Selector */}
              <div>
                <label htmlFor="tod-select" className="block text-sm font-semibold text-slate-300 mb-2">
                  Target Organ Damage Phenotype
                </label>
                <select
                  id="tod-select"
                  value={targetOrganDamage}
                  onChange={e => setTargetOrganDamage(e.target.value as TargetOrganDamageType)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-rose-500"
                >
                  <option value="aortic_dissection">Acute Aortic Dissection (Stanford Type A / B) - Emergency</option>
                  <option value="flash_pulmonary_edema">Sympathetic Crashing Acute Pulmonary Edema (SCAPE) - Emergency</option>
                  <option value="ischemic_stroke_tpa">Acute Ischemic Stroke (Eligible for Thrombolysis) - Emergency</option>
                  <option value="ischemic_stroke_no_tpa">Acute Ischemic Stroke (NOT Eligible for Thrombolysis - Permissive HTN) - Emergency</option>
                  <option value="intracranial_hemorrhage">Acute Spontaneous Intracerebral Hemorrhage (ICH) - Emergency</option>
                  <option value="hypertensive_encephalopathy">Hypertensive Encephalopathy / Posterior Reversible Encephalopathy (PRES) - Emergency</option>
                  <option value="preeclampsia_severe">Preeclampsia with Severe Features / Eclampsia - Emergency</option>
                  <option value="none">No Acute Target Organ Damage (Hypertensive Urgency)</option>
                </select>
              </div>

              {/* Patient Vitals Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
                  <label htmlFor="sbp-input" className="block text-xs font-semibold text-slate-400 mb-1">
                    Systolic BP (SBP): {sbp} mmHg
                  </label>
                  <input
                    id="sbp-input"
                    type="range"
                    min={140}
                    max={260}
                    step={1}
                    value={sbp}
                    onChange={e => setSbp(Number(e.target.value))}
                    className="w-full accent-rose-500"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                    <span>140</span>
                    <span>200</span>
                    <span>260 mmHg</span>
                  </div>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
                  <label htmlFor="dbp-input" className="block text-xs font-semibold text-slate-400 mb-1">
                    Diastolic BP (DBP): {dbp} mmHg
                  </label>
                  <input
                    id="dbp-input"
                    type="range"
                    min={70}
                    max={160}
                    step={1}
                    value={dbp}
                    onChange={e => setDbp(Number(e.target.value))}
                    className="w-full accent-rose-500"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                    <span>70</span>
                    <span>115</span>
                    <span>160 mmHg</span>
                  </div>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
                  <label htmlFor="hr-input" className="block text-xs font-semibold text-slate-400 mb-1">
                    Heart Rate: {heartRate} bpm
                  </label>
                  <input
                    id="hr-input"
                    type="range"
                    min={40}
                    max={160}
                    step={1}
                    value={heartRate}
                    onChange={e => setHeartRate(Number(e.target.value))}
                    className="w-full accent-rose-500"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                    <span>40</span>
                    <span>100</span>
                    <span>160 bpm</span>
                  </div>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
                  <label htmlFor="weight-input" className="block text-xs font-semibold text-slate-400 mb-1">
                    Patient Weight: {weightKg} kg
                  </label>
                  <input
                    id="weight-input"
                    type="range"
                    min={45}
                    max={140}
                    step={1}
                    value={weightKg}
                    onChange={e => setWeightKg(Number(e.target.value))}
                    className="w-full accent-rose-500"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                    <span>45</span>
                    <span>80</span>
                    <span>140 kg</span>
                  </div>
                </div>
              </div>

              {/* Comorbidities & Flags */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-slate-200 mb-3">Clinical Risk Modifiers &amp; Underlying Pathologies</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label htmlFor="chk-chronic-htn" className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer hover:bg-slate-850">
                    <input
                      id="chk-chronic-htn"
                      type="checkbox"
                      checked={chronicHypertension}
                      onChange={e => setChronicHypertension(e.target.checked)}
                      className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 accent-rose-600"
                    />
                    <div>
                      <span className="text-sm font-medium text-white">Chronic Hypertension</span>
                      <p className="text-xs text-slate-400">Shifts cerebral autoregulation curve rightward (higher lower threshold ~105 mmHg).</p>
                    </div>
                  </label>

                  <label htmlFor="chk-asthma" className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer hover:bg-slate-850">
                    <input
                      id="chk-asthma"
                      type="checkbox"
                      checked={historyOfAsthmaCopd}
                      onChange={e => setHistoryOfAsthmaCopd(e.target.checked)}
                      className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 accent-rose-600"
                    />
                    <div>
                      <span className="text-sm font-medium text-white">Asthma / Severe COPD</span>
                      <p className="text-xs text-slate-400">Relative contraindication to non-selective beta-blockade (Labetalol bronchospasm risk).</p>
                    </div>
                  </label>

                  <label htmlFor="chk-hf" className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer hover:bg-slate-850">
                    <input
                      id="chk-hf"
                      type="checkbox"
                      checked={heartFailureWithReducedEf}
                      onChange={e => setHeartFailureWithReducedEf(e.target.checked)}
                      className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 accent-rose-600"
                    />
                    <div>
                      <span className="text-sm font-medium text-white">HFrEF / Acute Left Ventricular Failure</span>
                      <p className="text-xs text-slate-400">Avoid acute beta-blockade due to negative inotropy; prefer afterload reducers.</p>
                    </div>
                  </label>

                  <label htmlFor="chk-renal" className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer hover:bg-slate-850">
                    <input
                      id="chk-renal"
                      type="checkbox"
                      checked={renalImpairment}
                      onChange={e => setRenalImpairment(e.target.checked)}
                      className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 accent-rose-600"
                    />
                    <div>
                      <span className="text-sm font-medium text-white">Renal Insufficiency (CrCl &lt; 30 mL/min)</span>
                      <p className="text-xs text-slate-400">Severely impairs thiocyanate elimination during nitroprusside infusions.</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Target Goals Summary Box */}
              <div className="bg-indigo-950/30 border border-indigo-800/40 rounded-xl p-4">
                <h3 className="text-sm font-bold text-indigo-300 flex items-center gap-2 mb-1">
                  <Info className="w-4 h-4 text-indigo-400" />
                  Target Goals for {assessment.targets.classification} ({targetOrganDamage.replace(/_/g, ' ').toUpperCase()})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300 mt-2">
                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block mb-0.5">Target SBP Range:</span>
                    <strong className="text-white text-sm">{assessment.targets.sbpTargetMin} - {assessment.targets.sbpTargetMax} mmHg</strong>
                  </div>
                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block mb-0.5">Target DBP Range:</span>
                    <strong className="text-white text-sm">{assessment.targets.dbpTargetMin} - {assessment.targets.dbpTargetMax} mmHg</strong>
                  </div>
                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block mb-0.5">Timeframe:</span>
                    <strong className="text-amber-300">{assessment.targets.timeframe}</strong>
                  </div>
                </div>
                <p className="text-xs text-indigo-200/80 mt-3 italic">
                  Rationale: {assessment.targets.guidelineRationale}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: IV Antihypertensive Titration */}
          {activeTab === 'titration' && (
            <div className="space-y-6">
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
                  <Activity className="w-5 h-5 text-rose-400" />
                  Parenteral Antihypertensive Titration Console
                </h2>
                <p className="text-sm text-slate-300">
                  Select and titrate parenteral agents. Real-time hemodynamic modeling calculates SBP/DBP reduction, heart rate chronotropic impact, and detects critical safety violations.
                </p>
              </div>

              {/* Drug Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Nicardipine Card */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">Nicardipine (Cardene)</h3>
                      <span className="text-xs text-slate-400">Dihydropyridine CCB &bull; 5 - 15 mg/h</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      Preferred 1st Line
                    </span>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1">
                      <span>Infusion Rate</span>
                      <strong className="text-blue-400">{nicardipineRate} mg/h</strong>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={18}
                      step={0.5}
                      value={nicardipineRate}
                      onChange={e => setNicardipineRate(Number(e.target.value))}
                      className="w-full accent-blue-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>0</span>
                      <span>5 (Start)</span>
                      <span>15 (Max)</span>
                      <span>18</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400">
                    Predictable arterial dilation; titrate by 2.5 mg/h every 5-15 min. Preserves coronary and cerebral perfusion.
                  </p>
                </div>

                {/* Clevidipine Card */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">Clevidipine (Cleviprex)</h3>
                      <span className="text-xs text-slate-400">Ultra-short Esterase CCB &bull; 1 - 32 mg/h</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      Ultra-Fast (t&frac12; 1-2m)
                    </span>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1">
                      <span>Infusion Rate</span>
                      <strong className="text-cyan-400">{clevidipineRate} mg/h</strong>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={35}
                      step={1}
                      value={clevidipineRate}
                      onChange={e => setClevidipineRate(Number(e.target.value))}
                      className="w-full accent-cyan-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>0</span>
                      <span>2 (Start)</span>
                      <span>16</span>
                      <span>32 (Max)</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1">
                      <span>Duration of Infusion</span>
                      <span className="text-slate-400">{clevidipineHours} hours</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={72}
                      step={1}
                      value={clevidipineHours}
                      onChange={e => setClevidipineHours(Number(e.target.value))}
                      className="w-full accent-cyan-500"
                    />
                  </div>
                  <p className="text-xs text-slate-400">
                    Rapidly titrated without organ accumulation; lipid formulation (0.2 g fat/mL).
                  </p>
                </div>

                {/* Esmolol Card */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">Esmolol (Brevibloc)</h3>
                      <span className="text-xs text-slate-400">Cardioselective &beta;1 Blocker &bull; 50 - 300 &mu;g/kg/min</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Mandatory in Dissection
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-xs text-slate-300 block mb-1">Load Bolus (mg)</span>
                      <input
                        type="number"
                        min={0}
                        max={50}
                        value={esmololBolus}
                        onChange={e => setEsmololBolus(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <span className="text-xs text-slate-300 block mb-1">Infusion Rate</span>
                      <input
                        type="number"
                        min={0}
                        max={350}
                        step={25}
                        value={esmololRate}
                        onChange={e => setEsmololRate(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs text-white"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-slate-400">
                    Suppresses cardiac contractility and heart rate to decrease dP/dt. Administer BEFORE vasodilators in aortic dissection!
                  </p>
                </div>

                {/* Labetalol Card */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">Labetalol (Trandate)</h3>
                      <span className="text-xs text-slate-400">Combined &alpha;1 / &beta; Blocker &bull; Bolus or Infusion</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      Pregnancy &amp; Stroke Safe
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-xs text-slate-300 block mb-1">IV Push (10-80 mg)</span>
                      <input
                        type="number"
                        min={0}
                        max={80}
                        step={10}
                        value={labetalolBolus}
                        onChange={e => setLabetalolBolus(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <span className="text-xs text-slate-300 block mb-1">Infusion (mg/min)</span>
                      <input
                        type="number"
                        min={0}
                        max={4}
                        step={0.5}
                        value={labetalolRate}
                        onChange={e => setLabetalolRate(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs text-white"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-slate-400">
                    Maintains peripheral resistance while attenuating reflex tachycardia. Caution in asthma and severe bradycardia.
                  </p>
                </div>

                {/* Nitroglycerin Card */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">Nitroglycerin (Tridil)</h3>
                      <span className="text-xs text-slate-400">Venodilator / Arteriodilator &bull; 5 - 400 &mu;g/min</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Drug of Choice in SCAPE
                    </span>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1">
                      <span>Infusion Rate</span>
                      <strong className="text-amber-400">{nitroglycerinRate} &mu;g/min</strong>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={400}
                      step={10}
                      value={nitroglycerinRate}
                      onChange={e => setNitroglycerinRate(Number(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>0</span>
                      <span>50</span>
                      <span>200 (Arterial)</span>
                      <span>400 (Max)</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400">
                    Reduces pulmonary capillary wedge pressure (preload) and systemic vascular resistance (afterload) in acute flash pulmonary edema.
                  </p>
                </div>

                {/* Sodium Nitroprusside Card */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">Sodium Nitroprusside (Nipride)</h3>
                      <span className="text-xs text-slate-400">Direct NO Donor &bull; 0.25 - 10 &mu;g/kg/min</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-red-500/20 text-red-300 border border-red-500/30">
                      Extreme Toxicity Caution
                    </span>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1">
                      <span>Infusion Rate</span>
                      <strong className="text-red-400">{nitroprussideRate} &mu;g/kg/min</strong>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={12}
                      step={0.25}
                      value={nitroprussideRate}
                      onChange={e => setNitroprussideRate(Number(e.target.value))}
                      className="w-full accent-red-500"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1">
                      <span>Cumulative Infusion Duration</span>
                      <span className="text-slate-400">{nitroprussideHours} hours</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={72}
                      step={1}
                      value={nitroprussideHours}
                      onChange={e => setNitroprussideHours(Number(e.target.value))}
                      className="w-full accent-red-500"
                    />
                  </div>
                  <p className="text-xs text-slate-400">
                    High potency arteriovenous dilator. High risk of cyanide accumulation if &gt;2 &mu;g/kg/min or duration &gt;24-48 hours.
                  </p>
                </div>
              </div>

              {/* Active Infusion Feedback */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <h3 className="text-sm font-bold text-white mb-2">Aggregate Hemodynamic Impact</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-400">Expected SBP Drop:</span>
                    <div className="text-lg font-bold text-emerald-400 mt-0.5">
                      -{assessment.startingVitals.sbp - assessment.vitals.sbp} mmHg
                    </div>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-400">Expected DBP Drop:</span>
                    <div className="text-lg font-bold text-emerald-400 mt-0.5">
                      -{assessment.startingVitals.dbp - assessment.vitals.dbp} mmHg
                    </div>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-400">Heart Rate Delta:</span>
                    <div className={`text-lg font-bold mt-0.5 ${assessment.vitals.heartRate > assessment.startingVitals.heartRate ? 'text-amber-400' : 'text-blue-400'}`}>
                      {assessment.vitals.heartRate - assessment.startingVitals.heartRate > 0 ? '+' : ''}
                      {assessment.vitals.heartRate - assessment.startingVitals.heartRate} bpm
                    </div>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-400">Active Infusions:</span>
                    <div className="text-lg font-bold text-indigo-300 mt-0.5">
                      {drugDosings.length} Agents
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Cerebral Autoregulation & Watershed */}
          {activeTab === 'autoregulation' && (
            <div className="space-y-6">
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
                  <Brain className="w-5 h-5 text-cyan-400" />
                  Cerebral Autoregulation Curve &amp; Rightward Plateau Shift
                </h2>
                <p className="text-sm text-slate-300">
                  Normal cerebral autoregulation maintains constant cerebral blood flow (CBF) between MAP 60 to 120 mmHg. In chronic hypertension, arteriolar remodeling shifts the plateau rightward (MAP 105 to 175 mmHg). Normalizing BP rapidly below this threshold starves brain tissue.
                </p>
              </div>

              {/* Autoregulation Curve Visualization */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-white mb-3">Autoregulatory Plateau Map</h3>
                <div className="relative w-full h-16 bg-slate-900 rounded-xl border border-slate-800 overflow-hidden flex items-center p-2">
                  {/* Normal plateau background */}
                  <div className="absolute left-[25%] w-[25%] h-full bg-blue-500/10 border-x border-blue-500/30 flex items-center justify-center text-[10px] text-blue-300">
                    Normotensive Plateau (60-120)
                  </div>
                  {/* Chronic HTN shifted plateau */}
                  <div className="absolute left-[45%] w-[35%] h-full bg-emerald-500/15 border-x border-emerald-500/40 flex items-center justify-center text-[10px] text-emerald-300">
                    Chronic HTN Plateau (105-175)
                  </div>
                  {/* Patient current MAP marker */}
                  <div
                    className="absolute h-full w-1.5 bg-rose-500 z-10 shadow-lg shadow-rose-500/50"
                    style={{ left: `${Math.min(95, Math.max(5, (assessment.vitals.map / 240) * 100))}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-2 px-1">
                  <span>MAP 40</span>
                  <span>MAP 80</span>
                  <span>MAP 120</span>
                  <span>MAP 160</span>
                  <span>MAP 200</span>
                  <span>MAP 240 mmHg</span>
                </div>

                <div className="mt-4 p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                  <strong className="text-white">Current MAP: {assessment.vitals.map} mmHg. </strong>
                  <span className={assessment.autoregulation.isBelowLowerLimit ? 'text-rose-400 font-semibold' : 'text-slate-300'}>
                    {assessment.autoregulation.explanation}
                  </span>
                </div>
              </div>

              {/* Autoregulation Rules of Thumb */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                  <h4 className="text-sm font-bold text-rose-400 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    The 20-25% MAP Rule in Hour 1
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Unless treating acute aortic dissection, blood pressure must NEVER be normalized rapidly. Reduce MAP by no more than <strong>15% to 25% within the first 1-2 hours</strong>. Further reduction toward ~160/100 mmHg should occur gradually over the next 2-6 hours.
                  </p>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                  <h4 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    Watershed Infarction (Border-Zone Ischemia)
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Watershed infarcts occur between the ACA-MCA and MCA-PCA arterial territories during systemic hypoperfusion. Patients present with "man-in-the-barrel" syndrome (proximal limb weakness) or cortical visual loss after overly aggressive antihypertensive therapy.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Condition-Specific Guidelines */}
          {activeTab === 'protocols' && (
            <div className="space-y-5">
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
                  <Zap className="w-5 h-5 text-rose-400" />
                  Target Organ Damage Clinical Protocols &amp; Target Matrix
                </h2>
                <p className="text-sm text-slate-300">
                  Target thresholds and preferred pharmacology vary dramatically depending on the organ at risk.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-sm">Acute Aortic Dissection</h3>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-500/20 text-rose-300">Target SBP &lt; 120, HR &lt; 60</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    <strong>Exception to the 25% rule:</strong> Immediate rapid reduction within 15-20 min. Shear stress on the intimal flap is governed by dP/dt. <strong>Beta-blocker (Esmolol/Labetalol) MUST precede vasodilators</strong> to prevent reflex sympathetic surge that extends the dissection flap.
                  </p>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-sm">Flash Pulmonary Edema (SCAPE)</h3>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-500/20 text-blue-300">High-Dose Nitrates + BiPAP</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    Driven by massive afterload mismatch. High-dose IV Nitroglycerin (100-400 &mu;g/min) and IV Nicardipine reduce LV afterload and venous congestion. Pure beta-blockers are contraindicated due to acute inotropic suppression.
                  </p>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-sm">Acute Ischemic Stroke (Permissive HTN)</h3>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-500/20 text-purple-300">Permissive up to 220/120</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    If not eligible for thrombolysis, <strong>DO NOT TREAT</strong> unless SBP &gt; 220 or DBP &gt; 120 mmHg. If eligible for IV thrombolytic (Alteplase/Tenecteplase), reduce BP to &lt; 185/110 mmHg prior to infusion and maintain &lt; 180/105 mmHg for 24 hours.
                  </p>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-sm">Acute Intracerebral Hemorrhage (ICH)</h3>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/20 text-amber-300">Target SBP 130 - 140</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    AHA/ASA 2022 Guidelines recommend lowering SBP to 130-140 mmHg within 1-2 hours for presentation SBP 150-220 mmHg. Prevents ongoing hematoma expansion while avoiding hypoperfusion (avoid SBP &lt; 130 mmHg).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Toxicology & Drug Safety */}
          {activeTab === 'toxicology' && (
            <div className="space-y-6">
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                  Toxicology &amp; Critical Care Pharmacovigilance Bench
                </h2>
                <p className="text-sm text-slate-300">
                  Critical drug-drug interactions, toxic metabolite generation, and guideline-mandated safety boundaries.
                </p>
              </div>

              {/* Toxicology Alerts Display */}
              {assessment.toxicology.alerts.length > 0 && (
                <div className="space-y-2">
                  {assessment.toxicology.alerts.map((alert, idx) => (
                    <div key={idx} className="bg-rose-950/30 border border-rose-800/60 rounded-xl p-3.5 flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-rose-200 font-medium leading-relaxed">{alert}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Drug Toxicity Deep Dives */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <Flame className="w-4 h-4 text-red-400" />
                    Sodium Nitroprusside: Cyanide &amp; Thiocyanate
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    Each SNP molecule contains 5 cyanide moieties. Red blood cells metabolize SNP releasing free CN&minus;. Hepatic rhodanese converts CN&minus; to thiocyanate (excreted renally).
                  </p>
                  <ul className="list-disc list-inside text-slate-400 space-y-1 mt-1">
                    <li><strong>Cyanide Toxicity:</strong> Unexplained lactic acidosis, elevated central venous oxygen saturation (SvO2), altered mental status. Co-infuse Sodium Thiosulfate 1g per 100mg SNP.</li>
                    <li><strong>Thiocyanate Toxicity:</strong> Accumulates in renal impairment (t&frac12; 7-14 days). Presents as delirium, hyperreflexia, psychosis, and seizures.</li>
                  </ul>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-400" />
                    Reflex Tachycardia in Aortic Dissection
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    Administration of pure arteriolar vasodilators (Hydralazine, Nicardipine, Nitroprusside) triggers arterial baroreceptor deactivation, unleashing reflex sympathetic adrenergic surge.
                  </p>
                  <p className="text-slate-400 mt-1">
                    This accelerates heart rate and cardiac inotropy, driving a massive spike in aortic shear stress (dP/dt) that can propagate dissection and cause instant fatal aortic rupture.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
