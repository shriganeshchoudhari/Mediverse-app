'use client';

import React, { useState, useMemo } from 'react';
import {
  Activity,
  AlertTriangle,
  HeartPulse,
  Flame,
  ShieldAlert,
  Pill,
  Droplets,
  Layers,
  Sparkles,
  Zap,
} from 'lucide-react';
import {
  calculateSteroidEquivalency,
  evaluateCosyntropinTest,
  getRequiredStressDoseHydrocortisoneMg,
  simulateAdrenalCrisisResuscitation,
  AdrenalPathologyType,
  StressSeverityLevel,
  SyntheticCorticosteroidType,
  PatientAdrenalParameters,
  AdrenalEmergencyTreatmentPlan,
  CORTICOSTEROID_PROPERTIES,
} from '../../.gemini/skills/AdrenalCrisisSteroidEngine';

interface PresetCase {
  id: string;
  name: string;
  description: string;
  patient: PatientAdrenalParameters;
  recommendedTreatment: AdrenalEmergencyTreatmentPlan;
}

const PRESET_CASES: PresetCase[] = [
  {
    id: 'acute-addisonian-crisis',
    name: 'Acute Addisonian Crisis (Primary Autoimmune)',
    description: '38yo female with hyperpigmentation presenting with refractory hypotension, hyponatremia (122), hyperkalemia (6.2), and hypoglycemia (52 mg/dL) triggered by gastroenteritis.',
    patient: {
      pathology: 'PRIMARY_ADDISONS_AUTOIMMUNE',
      stressLevel: 'MAJOR_SURGICAL_OR_SEPTIC_SHOCK',
      systolicBpMmHg: 78,
      diastolicBpMmHg: 46,
      heartRateBpm: 122,
      serumSodiumMeqL: 122,
      serumPotassiumMeqL: 6.2,
      serumGlucoseMgDl: 52,
      baselineSerumCortisolMcgDl: 2.3,
      plasmaActhPgMl: 380,
    },
    recommendedTreatment: {
      ivBolusHydrocortisoneMg: 100,
      continuousInfusionHydrocortisoneMgDay: 200,
      dexamethasoneUsedAsInitialBolus: false,
      isotonicSalineLitersFirst24Hours: 3.0,
      dextroseGivenForHypoglycemia: true,
      fludrocortisoneDoseMgDaily: 0,
    },
  },
  {
    id: 'steroid-withdrawal-perioperative',
    name: 'Perioperative HPA Suppression (Tertiary Adrenal)',
    description: '56yo male on chronic Prednisone 20 mg/day for rheumatoid arthritis undergoing emergent exploratory laparotomy without perioperative stress coverage.',
    patient: {
      pathology: 'TERTIARY_EXOGENOUS_STEROID_WITHDRAWAL',
      stressLevel: 'MAJOR_SURGICAL_OR_SEPTIC_SHOCK',
      systolicBpMmHg: 84,
      diastolicBpMmHg: 52,
      heartRateBpm: 110,
      serumSodiumMeqL: 131,
      serumPotassiumMeqL: 4.8,
      serumGlucoseMgDl: 68,
      baselineSerumCortisolMcgDl: 3.8,
      plasmaActhPgMl: 8,
    },
    recommendedTreatment: {
      ivBolusHydrocortisoneMg: 100,
      continuousInfusionHydrocortisoneMgDay: 200,
      dexamethasoneUsedAsInitialBolus: false,
      isotonicSalineLitersFirst24Hours: 2.5,
      dextroseGivenForHypoglycemia: true,
      fludrocortisoneDoseMgDaily: 0,
    },
  },
  {
    id: 'diagnostic-cosyntropin-workup',
    name: 'Undifferentiated Crisis (Cosyntropin Assay Protocol)',
    description: '45yo female with suspected new-onset crisis requiring immediate life-saving steroid resuscitation without confounding baseline/peak cortisol immunoassay.',
    patient: {
      pathology: 'PRIMARY_ADDISONS_AUTOIMMUNE',
      stressLevel: 'MAJOR_SURGICAL_OR_SEPTIC_SHOCK',
      systolicBpMmHg: 82,
      diastolicBpMmHg: 48,
      heartRateBpm: 116,
      serumSodiumMeqL: 125,
      serumPotassiumMeqL: 5.8,
      serumGlucoseMgDl: 60,
      baselineSerumCortisolMcgDl: 3.0,
      plasmaActhPgMl: 290,
    },
    recommendedTreatment: {
      ivBolusHydrocortisoneMg: 0,
      continuousInfusionHydrocortisoneMgDay: 0,
      dexamethasoneUsedAsInitialBolus: true, // 4 mg Dexamethasone does NOT cross-react
      isotonicSalineLitersFirst24Hours: 3.0,
      dextroseGivenForHypoglycemia: true,
      fludrocortisoneDoseMgDaily: 0,
    },
  },
];

export default function AdrenalCrisisSimulator() {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(PRESET_CASES[0].id);

  // Patient parameters
  const [pathology, setPathology] = useState<AdrenalPathologyType>(PRESET_CASES[0].patient.pathology);
  const [stressLevel, setStressLevel] = useState<StressSeverityLevel>(PRESET_CASES[0].patient.stressLevel);
  const [systolicBp, setSystolicBp] = useState<number>(PRESET_CASES[0].patient.systolicBpMmHg);
  const [diastolicBp, setDiastolicBp] = useState<number>(PRESET_CASES[0].patient.diastolicBpMmHg);
  const [heartRate, setHeartRate] = useState<number>(PRESET_CASES[0].patient.heartRateBpm);
  const [sodium, setSodium] = useState<number>(PRESET_CASES[0].patient.serumSodiumMeqL);
  const [potassium, setPotassium] = useState<number>(PRESET_CASES[0].patient.serumPotassiumMeqL);
  const [glucose, setGlucose] = useState<number>(PRESET_CASES[0].patient.serumGlucoseMgDl);
  const [cortisol, setCortisol] = useState<number>(PRESET_CASES[0].patient.baselineSerumCortisolMcgDl);
  const [acth, setActh] = useState<number>(PRESET_CASES[0].patient.plasmaActhPgMl);

  // Emergency Treatment Plan
  const [ivBolusHydrocortisone, setIvBolusHydrocortisone] = useState<number>(PRESET_CASES[0].recommendedTreatment.ivBolusHydrocortisoneMg);
  const [infusionHydrocortisone, setInfusionHydrocortisone] = useState<number>(PRESET_CASES[0].recommendedTreatment.continuousInfusionHydrocortisoneMgDay);
  const [useDexamethasoneInitial, setUseDexamethasoneInitial] = useState<boolean>(PRESET_CASES[0].recommendedTreatment.dexamethasoneUsedAsInitialBolus);
  const [salineLiters, setSalineLiters] = useState<number>(PRESET_CASES[0].recommendedTreatment.isotonicSalineLitersFirst24Hours);
  const [dextroseGiven, setDextroseGiven] = useState<boolean>(PRESET_CASES[0].recommendedTreatment.dextroseGivenForHypoglycemia);
  const [fludrocortisoneDose, setFludrocortisoneDose] = useState<number>(PRESET_CASES[0].recommendedTreatment.fludrocortisoneDoseMgDaily);

  // Equivalency Calculator State
  const [equivSourceDrug, setEquivSourceDrug] = useState<SyntheticCorticosteroidType>('PREDNISONE');
  const [equivSourceDose, setEquivSourceDose] = useState<number>(20);
  const [equivTargetDrug, setEquivTargetDrug] = useState<SyntheticCorticosteroidType>('HYDROCORTISONE');

  const handleLoadCase = (caseId: string) => {
    const c = PRESET_CASES.find((p) => p.id === caseId);
    if (!c) return;
    setSelectedCaseId(c.id);
    setPathology(c.patient.pathology);
    setStressLevel(c.patient.stressLevel);
    setSystolicBp(c.patient.systolicBpMmHg);
    setDiastolicBp(c.patient.diastolicBpMmHg);
    setHeartRate(c.patient.heartRateBpm);
    setSodium(c.patient.serumSodiumMeqL);
    setPotassium(c.patient.serumPotassiumMeqL);
    setGlucose(c.patient.serumGlucoseMgDl);
    setCortisol(c.patient.baselineSerumCortisolMcgDl);
    setActh(c.patient.plasmaActhPgMl);

    setIvBolusHydrocortisone(c.recommendedTreatment.ivBolusHydrocortisoneMg);
    setInfusionHydrocortisone(c.recommendedTreatment.continuousInfusionHydrocortisoneMgDay);
    setUseDexamethasoneInitial(c.recommendedTreatment.dexamethasoneUsedAsInitialBolus);
    setSalineLiters(c.recommendedTreatment.isotonicSalineLitersFirst24Hours);
    setDextroseGiven(c.recommendedTreatment.dextroseGivenForHypoglycemia);
    setFludrocortisoneDose(c.recommendedTreatment.fludrocortisoneDoseMgDaily);
  };

  const currentPatient: PatientAdrenalParameters = useMemo(() => ({
    pathology,
    stressLevel,
    systolicBpMmHg: systolicBp,
    diastolicBpMmHg: diastolicBp,
    heartRateBpm: heartRate,
    serumSodiumMeqL: sodium,
    serumPotassiumMeqL: potassium,
    serumGlucoseMgDl: glucose,
    baselineSerumCortisolMcgDl: cortisol,
    plasmaActhPgMl: acth,
  }), [pathology, stressLevel, systolicBp, diastolicBp, heartRate, sodium, potassium, glucose, cortisol, acth]);

  const currentTreatment: AdrenalEmergencyTreatmentPlan = useMemo(() => ({
    ivBolusHydrocortisoneMg: ivBolusHydrocortisone,
    continuousInfusionHydrocortisoneMgDay: infusionHydrocortisone,
    dexamethasoneUsedAsInitialBolus: useDexamethasoneInitial,
    isotonicSalineLitersFirst24Hours: salineLiters,
    dextroseGivenForHypoglycemia: dextroseGiven,
    fludrocortisoneDoseMgDaily: fludrocortisoneDose,
  }), [ivBolusHydrocortisone, infusionHydrocortisone, useDexamethasoneInitial, salineLiters, dextroseGiven, fludrocortisoneDose]);

  const requiredStressDose = useMemo(() => getRequiredStressDoseHydrocortisoneMg(stressLevel), [stressLevel]);
  const equivalencyResult = useMemo(() => calculateSteroidEquivalency(equivSourceDrug, equivSourceDose, equivTargetDrug), [equivSourceDrug, equivSourceDose, equivTargetDrug]);
  const cosyntropinResult = useMemo(() => {
    const recentDrug = useDexamethasoneInitial ? 'DEXAMETHASONE' : ivBolusHydrocortisone > 0 ? 'HYDROCORTISONE' : 'NONE';
    return evaluateCosyntropinTest(cortisol, pathology, recentDrug);
  }, [cortisol, pathology, useDexamethasoneInitial, ivBolusHydrocortisone]);

  const outcome = useMemo(() => simulateAdrenalCrisisResuscitation(currentPatient, currentTreatment), [currentPatient, currentTreatment]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6 lg:p-8 font-sans">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
                <Flame className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                  Acute Adrenal Crisis & Steroid Equivalency Workstation
                </h1>
                <p className="text-sm text-slate-400">
                  Addisonian crisis resuscitation, Cosyntropin (ACTH) testing, stress-dose protocols, and glucocorticoid/mineralocorticoid pharmacokinetics.
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Preset:</span>
            <select
              value={selectedCaseId}
              onChange={(e) => handleLoadCase(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-xs text-amber-300 rounded-lg px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {PRESET_CASES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Patient Parameters & Labs (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg">
            <h2 className="text-sm font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4" /> 1. Pathology & Vitals
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Adrenal Insufficiency Etiology</label>
                <select
                  value={pathology}
                  onChange={(e) => setPathology(e.target.value as AdrenalPathologyType)}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-white"
                >
                  <option value="PRIMARY_ADDISONS_AUTOIMMUNE">Primary: Addison&apos;s (Autoimmune 21-OH Ab+)</option>
                  <option value="PRIMARY_BILATERAL_ADRENAL_HEMORRHAGE">Primary: Bilateral Adrenal Hemorrhage</option>
                  <option value="SECONDARY_PITUITARY_PANHYPOPITUITARISM">Secondary: Pituitary ACTH Deficiency</option>
                  <option value="TERTIARY_EXOGENOUS_STEROID_WITHDRAWAL">Tertiary: Chronic Steroid HPA Suppression</option>
                  <option value="CRITICALLY_ILL_CIRCI">CIRCI: Critical Illness Corticosteroid Insufficiency</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Physiologic Stress Tier</label>
                <select
                  value={stressLevel}
                  onChange={(e) => setStressLevel(e.target.value as StressSeverityLevel)}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-white"
                >
                  <option value="BASAL_PHYSIOLOGIC">Basal Physiologic State (No Stress)</option>
                  <option value="MINOR_STRESS_FEVER">Minor Stress (URI, Gastroenteritis, Fever)</option>
                  <option value="MODERATE_SURGICAL_STRESS">Moderate Stress (Cholecystectomy, Joint Replacement)</option>
                  <option value="MAJOR_SURGICAL_OR_SEPTIC_SHOCK">Major Stress (Septic Shock, CABG, Trauma)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800">
                <div>
                  <label className="text-slate-400">Systolic BP: {systolicBp} mmHg</label>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={systolicBp}
                    onChange={(e) => setSystolicBp(Number(e.target.value))}
                    className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded"
                  />
                </div>
                <div>
                  <label className="text-slate-400">Heart Rate: {heartRate} bpm</label>
                  <input
                    type="range"
                    min="45"
                    max="160"
                    value={heartRate}
                    onChange={(e) => setHeartRate(Number(e.target.value))}
                    className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-slate-400">Na: {sodium}</label>
                  <input
                    type="range"
                    min="110"
                    max="145"
                    value={sodium}
                    onChange={(e) => setSodium(Number(e.target.value))}
                    className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded"
                  />
                </div>
                <div>
                  <label className="text-slate-400">K+: {potassium}</label>
                  <input
                    type="range"
                    min="3.0"
                    max="7.5"
                    step="0.1"
                    value={potassium}
                    onChange={(e) => setPotassium(Number(e.target.value))}
                    className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded"
                  />
                </div>
                <div>
                  <label className="text-slate-400">Glucose: {glucose}</label>
                  <input
                    type="range"
                    min="30"
                    max="140"
                    value={glucose}
                    onChange={(e) => setGlucose(Number(e.target.value))}
                    className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800">
                <div>
                  <label className="text-slate-400">Cortisol: {cortisol} mcg/dL</label>
                  <input
                    type="range"
                    min="0.5"
                    max="25.0"
                    step="0.5"
                    value={cortisol}
                    onChange={(e) => setCortisol(Number(e.target.value))}
                    className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded"
                  />
                </div>
                <div>
                  <label className="text-slate-400">ACTH: {acth} pg/mL</label>
                  <input
                    type="range"
                    min="2"
                    max="500"
                    value={acth}
                    onChange={(e) => setActh(Number(e.target.value))}
                    className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Diagnostic Cosyntropin Stimulation Test Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> 250 mcg ACTH Stim Test
              </h2>
              <span className={'px-2 py-0.5 rounded text-xs font-bold ' + (cosyntropinResult.passedStimulationTest ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40')}>
                Peak: {cosyntropinResult.cortisolAt60MinMcgDl} mcg/dL
              </span>
            </div>

            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-300">
                <span>0-min Baseline:</span>
                <span className="font-bold text-white">{cosyntropinResult.baselineSerumCortisolMcgDl} mcg/dL</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>30-min Level:</span>
                <span className="font-bold text-amber-300">{cosyntropinResult.cortisolAt30MinMcgDl} mcg/dL</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>60-min Peak (Cutoff &ge; 18):</span>
                <span className={'font-bold ' + (cosyntropinResult.passedStimulationTest ? 'text-emerald-400' : 'text-rose-400')}>
                  {cosyntropinResult.cortisolAt60MinMcgDl} mcg/dL ({cosyntropinResult.passedStimulationTest ? 'PASS' : 'FAIL'})
                </span>
              </div>
              <p className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-800">
                {cosyntropinResult.interpretation}
              </p>
            </div>
          </div>
        </div>

        {/* Center Column: Steroid Potency Equivalency & Stress Coverage (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Synthetic Corticosteroid Equivalency Calculator */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg">
            <h2 className="text-sm font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-2 mb-3">
              <Pill className="w-4 h-4" /> Steroid Equivalency Solver
            </h2>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Source Steroid</label>
                  <select
                    value={equivSourceDrug}
                    onChange={(e) => setEquivSourceDrug(e.target.value as SyntheticCorticosteroidType)}
                    className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white"
                  >
                    <option value="HYDROCORTISONE">Hydrocortisone</option>
                    <option value="PREDNISONE">Prednisone</option>
                    <option value="PREDNISOLONE">Prednisolone</option>
                    <option value="METHYLPREDNISOLONE">Methylprednisolone</option>
                    <option value="DEXAMETHASONE">Dexamethasone</option>
                    <option value="FLUDROCORTISONE">Fludrocortisone</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Dose (mg)</label>
                  <input
                    type="number"
                    min="0.1"
                    max="500"
                    step="0.5"
                    value={equivSourceDose}
                    onChange={(e) => setEquivSourceDose(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Target Equivalent Steroid</label>
                <select
                  value={equivTargetDrug}
                  onChange={(e) => setEquivTargetDrug(e.target.value as SyntheticCorticosteroidType)}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white"
                >
                  <option value="HYDROCORTISONE">Hydrocortisone (Reference)</option>
                  <option value="PREDNISONE">Prednisone</option>
                  <option value="PREDNISOLONE">Prednisolone</option>
                  <option value="METHYLPREDNISOLONE">Methylprednisolone</option>
                  <option value="DEXAMETHASONE">Dexamethasone</option>
                  <option value="FLUDROCORTISONE">Fludrocortisone</option>
                </select>
              </div>

              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg text-center space-y-1">
                <div className="text-[10px] uppercase tracking-wider text-slate-400">Equivalent Dose</div>
                <div className="text-2xl font-black text-amber-400">
                  {equivalencyResult.equivalentTargetDoseMg} mg {CORTICOSTEROID_PROPERTIES[equivTargetDrug].name.split(' ')[0]}
                </div>
                <div className="text-[11px] text-slate-400">
                  = {equivalencyResult.glucocorticoidEquivalentHydrocortisoneMg} mg Hydrocortisone Glucocorticoid Activity
                </div>
              </div>
            </div>
          </div>

          {/* Stress-Dose Protocol Guide */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg">
            <h2 className="text-sm font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-2 mb-2">
              <ShieldAlert className="w-4 h-4" /> Required Stress Coverage
            </h2>

            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80 text-xs space-y-2">
              <div className="flex justify-between text-slate-300">
                <span>Target Daily Dose:</span>
                <span className="font-bold text-amber-300">{requiredStressDose.requiredDailyHydrocortisoneMg} mg Hydrocortisone/day</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Fludrocortisone Needed:</span>
                <span className={'font-semibold ' + (requiredStressDose.fludrocortisoneRequired ? 'text-amber-400' : 'text-slate-400')}>
                  {requiredStressDose.fludrocortisoneRequired ? 'YES (0.05-0.1 mg PO)' : 'NO (Saturated by HC &ge; 50mg)'}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 bg-slate-900/80 p-2 rounded border border-slate-800">
                <strong>Schedule:</strong> {requiredStressDose.dosingSchedule}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Crisis Resuscitation Plan & Scoreboard (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Emergency Treatment Controls */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg">
            <h2 className="text-sm font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4" /> 2. Emergency Resuscitation Plan
            </h2>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400">IV Bolus Hydrocortisone: {ivBolusHydrocortisone} mg</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="25"
                    value={ivBolusHydrocortisone}
                    onChange={(e) => setIvBolusHydrocortisone(Number(e.target.value))}
                    className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded"
                  />
                </div>
                <div>
                  <label className="text-slate-400">24h Infusion: {infusionHydrocortisone} mg/d</label>
                  <input
                    type="range"
                    min="0"
                    max="300"
                    step="25"
                    value={infusionHydrocortisone}
                    onChange={(e) => setInfusionHydrocortisone(Number(e.target.value))}
                    className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400">0.9% Normal Saline (First 24h): {salineLiters} L</label>
                <input
                  type="range"
                  min="0.5"
                  max="5.0"
                  step="0.5"
                  value={salineLiters}
                  onChange={(e) => setSalineLiters(Number(e.target.value))}
                  className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded"
                />
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-2">
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useDexamethasoneInitial}
                    onChange={(e) => setUseDexamethasoneInitial(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-amber-500"
                  />
                  Use Dexamethasone 4mg IV Bolus (Preserves ACTH test)
                </label>

                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dextroseGiven}
                    onChange={(e) => setDextroseGiven(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-amber-500"
                  />
                  Administer 5-10% Dextrose (Hypoglycemia Defense)
                </label>
              </div>
            </div>
          </div>

          {/* Outcome Scoreboard */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg">
            <h2 className="text-sm font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-2 mb-3">
              <HeartPulse className="w-4 h-4" /> 3. 24h Resuscitation Scoreboard
            </h2>

            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              <div className="p-2 bg-slate-950/70 border border-slate-800 rounded">
                <div className="text-[10px] text-slate-400">Predicted 24h SBP</div>
                <div className={'text-base font-bold ' + (outcome.predicted24HrSystolicBp >= 95 ? 'text-emerald-400' : 'text-rose-400')}>
                  {outcome.predicted24HrSystolicBp} mmHg
                </div>
              </div>

              <div className="p-2 bg-slate-950/70 border border-slate-800 rounded">
                <div className="text-[10px] text-slate-400">Stress Sufficiency</div>
                <div className={'text-base font-bold ' + (outcome.stressDoseSufficiencyPercent >= 85 ? 'text-emerald-400' : 'text-amber-400')}>
                  {outcome.stressDoseSufficiencyPercent}%
                </div>
              </div>

              <div className="p-2 bg-slate-950/70 border border-slate-800 rounded">
                <div className="text-[10px] text-slate-400">Predicted Serum Na</div>
                <div className="text-base font-bold text-slate-200">
                  {outcome.predicted24HrSerumSodium} mEq/L
                </div>
              </div>

              <div className="p-2 bg-slate-950/70 border border-slate-800 rounded">
                <div className="text-[10px] text-slate-400">Predicted Serum K+</div>
                <div className={'text-base font-bold ' + (outcome.predicted24HrSerumPotassium <= 5.2 ? 'text-emerald-400' : 'text-rose-400')}>
                  {outcome.predicted24HrSerumPotassium} mEq/L
                </div>
              </div>
            </div>

            <div className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-lg space-y-1 text-[11px] text-slate-300 max-h-36 overflow-y-auto">
              <div className="font-semibold text-amber-400">
                Crisis Status: {outcome.crisisAvertedOrControlled ? 'AVERTED / STABILIZED' : 'UNRESOLVED SHOCK'}
              </div>
              {outcome.clinicalSafetyAlerts.map((msg, i) => (
                <div key={i} className="flex items-start gap-1.5 text-rose-300">
                  <span>&bull;</span>
                  <span>{msg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
