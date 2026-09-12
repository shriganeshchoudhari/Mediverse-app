'use client';

import React, { useState, useMemo } from 'react';
import {
  Brain,
  Activity,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Gauge,
  Heart,
  Thermometer,
  Zap,
  Play,
  RotateCcw,
  Sparkles,
  Stethoscope,
  Eye,
  Wind,
  Layers,
  FileCheck,
  Droplets,
  ShieldAlert,
  Flame,
  ChevronRight,
  Info,
} from 'lucide-react';
import {
  evaluatePrerequisites,
  evaluateBrainstemReflexes,
  initializeApneaTest,
  stepApneaTest,
  evaluateApneaTestResult,
  interpretAncillaryTest,
  calculateDonorOptimization,
  BrainDeathPrerequisites,
  BrainstemReflexAssessment,
  ApneaTestState,
  OxygenationMethod,
  PatientLungCondition,
  AncillaryModality,
  DonorManagementState,
} from '../../.gemini/skills/BrainDeathApneaEngine';

type ActiveTab = 'prerequisites' | 'reflexes' | 'apnea' | 'ancillary' | 'donor';

export default function BrainDeathApneaSimulator() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('prerequisites');

  // Case Selector
  const [selectedCase, setSelectedCase] = useState<'case1' | 'case2' | 'case3' | 'case4'>('case1');

  // Step 1: Prerequisites state
  const [prereqs, setPrereqs] = useState<BrainDeathPrerequisites>({
    coreTempC: 36.6,
    systolicBp: 112,
    meanArterialPressure: 74,
    neuromuscularBlockadeFree: true,
    cnsDepressantsCleared: true,
    severeMetabolicDerangementAbsent: true,
    proximateCauseKnown: true,
  });

  // Step 2: Brainstem Reflexes state
  const [reflexes, setReflexes] = useState<BrainstemReflexAssessment>({
    pupillaryLightReflexRight: false,
    pupillaryLightReflexLeft: false,
    cornealReflexRight: false,
    cornealReflexLeft: false,
    oculocephalicDollEyes: false,
    oculovestibularColdCaloricsRight: false,
    oculovestibularColdCaloricsLeft: false,
    facialNoxiousGrimace: false,
    pharyngealGagReflex: false,
    trachealCoughReflex: false,
    spinalReflexesPresent: false,
  });

  // Step 3: Apnea test state
  const [oxygenMethod, setOxygenMethod] = useState<OxygenationMethod>('apneic_catheter');
  const [lungCondition, setLungCondition] = useState<PatientLungCondition>('normal');
  const [apneaState, setApneaState] = useState<ApneaTestState>(() =>
    initializeApneaTest(40, 250, 7.40, 115)
  );

  // Step 4: Ancillary test selection
  const [selectedModality, setSelectedModality] = useState<AncillaryModality>('spect_perfusion');
  const [ancillaryScenario, setAncillaryScenario] = useState<'brain_death' | 'preserved_flow'>('brain_death');

  // Step 5: Donor Management state
  const [donorState, setDonorState] = useState<DonorManagementState>({
    systolicBP: 108,
    meanArterialPressure: 72,
    urineOutputMlHr: 160,
    serumSodium: 142,
    coreTempC: 36.8,
    paO2: 135,
    vasopressinDoseUnitsHr: 1.2,
    levothyroxineActive: true,
    corticosteroidActive: true,
    insulinActive: true,
    fluidBolusMl: 0,
  });

  // Evaluations
  const prereqEval = useMemo(() => evaluatePrerequisites(prereqs), [prereqs]);
  const reflexEval = useMemo(() => evaluateBrainstemReflexes(reflexes), [reflexes]);
  const apneaEval = useMemo(() => evaluateApneaTestResult(apneaState), [apneaState]);
  const ancillaryResult = useMemo(
    () => interpretAncillaryTest(selectedModality, ancillaryScenario),
    [selectedModality, ancillaryScenario]
  );
  const donorReport = useMemo(() => calculateDonorOptimization(donorState), [donorState]);

  // Handle Preset Case Loading
  const handleLoadCase = (caseId: 'case1' | 'case2' | 'case3' | 'case4') => {
    setSelectedCase(caseId);
    if (caseId === 'case1') {
      // Classic DNC: severe trauma, fully eligible, meets apnea
      setPrereqs({
        coreTempC: 36.8,
        systolicBp: 115,
        meanArterialPressure: 78,
        neuromuscularBlockadeFree: true,
        cnsDepressantsCleared: true,
        severeMetabolicDerangementAbsent: true,
        proximateCauseKnown: true,
      });
      setReflexes({
        pupillaryLightReflexRight: false,
        pupillaryLightReflexLeft: false,
        cornealReflexRight: false,
        cornealReflexLeft: false,
        oculocephalicDollEyes: false,
        oculovestibularColdCaloricsRight: false,
        oculovestibularColdCaloricsLeft: false,
        facialNoxiousGrimace: false,
        pharyngealGagReflex: false,
        trachealCoughReflex: false,
        spinalReflexesPresent: false,
      });
      setOxygenMethod('apneic_catheter');
      setLungCondition('normal');
      setApneaState(initializeApneaTest(40, 260, 7.40, 118));
      setActiveTab('prerequisites');
    } else if (caseId === 'case2') {
      // Confounded: Hypothermic & Residual fentanyl
      setPrereqs({
        coreTempC: 34.2,
        systolicBp: 92,
        meanArterialPressure: 56,
        neuromuscularBlockadeFree: true,
        cnsDepressantsCleared: false,
        severeMetabolicDerangementAbsent: true,
        proximateCauseKnown: true,
      });
      setActiveTab('prerequisites');
    } else if (caseId === 'case3') {
      // Marginal lungs: fails apnea due to desaturation -> needs ancillary
      setPrereqs({
        coreTempC: 36.5,
        systolicBp: 110,
        meanArterialPressure: 72,
        neuromuscularBlockadeFree: true,
        cnsDepressantsCleared: true,
        severeMetabolicDerangementAbsent: true,
        proximateCauseKnown: true,
      });
      setLungCondition('ards');
      setOxygenMethod('apneic_catheter');
      setApneaState(initializeApneaTest(38, 140, 7.42, 105));
      setActiveTab('apnea');
    } else if (caseId === 'case4') {
      // Post-Declaration Organ Donor with DI and vasoplegia
      setDonorState({
        systolicBP: 88,
        meanArterialPressure: 58,
        urineOutputMlHr: 480,
        serumSodium: 154,
        coreTempC: 35.4,
        paO2: 82,
        vasopressinDoseUnitsHr: 0,
        levothyroxineActive: false,
        corticosteroidActive: false,
        insulinActive: false,
        fluidBolusMl: 0,
      });
      setActiveTab('donor');
    }
  };

  // Step Apnea Timer
  const handleStepApnea = (deltaMin: number, triggerBreath: boolean = false) => {
    setApneaState((prev) =>
      stepApneaTest(prev, deltaMin, oxygenMethod, lungCondition, triggerBreath)
    );
  };

  const handleResetApnea = () => {
    setApneaState(initializeApneaTest(40, 250, 7.40, 115));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Clinical Case Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/20">
                <Brain className="w-6 h-6" />
              </span>
              <div>
                <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                  Brain Death Determination &amp; Apnea Testing Workstation
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    AAN 2023 Guidelines
                  </span>
                </h1>
                <p className="text-xs text-slate-400">
                  Comprehensive protocol for Determination of Death by Neurologic Criteria (DNC), Apneic Oxygenation Dynamics, Ancillary Confirmation &amp; Organ Donor Optimization
                </p>
              </div>
            </div>
          </div>

          {/* Preset Cases Selector */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Clinical Scenarios:</span>
            <button
              onClick={() => handleLoadCase('case1')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition border ${
                selectedCase === 'case1'
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                  : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              1. Classic Trauma DNC
            </button>
            <button
              onClick={() => handleLoadCase('case2')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition border ${
                selectedCase === 'case2'
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                  : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              2. Hypothermic Confounder
            </button>
            <button
              onClick={() => handleLoadCase('case3')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition border ${
                selectedCase === 'case3'
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                  : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              3. Marginal Lungs / Ancillary
            </button>
            <button
              onClick={() => handleLoadCase('case4')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition border ${
                selectedCase === 'case4'
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                  : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              4. Donor Resuscitation &amp; DI
            </button>
          </div>
        </div>

        {/* Step Tabs Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-5 pt-4 border-t border-slate-800">
          <button
            onClick={() => setActiveTab('prerequisites')}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl font-bold text-xs transition border ${
              activeTab === 'prerequisites'
                ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-300'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            1. Prerequisites
            {prereqEval.isEligible ? (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-rose-400" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('reflexes')}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl font-bold text-xs transition border ${
              activeTab === 'reflexes'
                ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-300'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-4 h-4" />
            2. Brainstem Reflexes
            {reflexEval.allBrainstemReflexesAbsent ? (
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-amber-400" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('apnea')}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl font-bold text-xs transition border ${
              activeTab === 'apnea'
                ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-300'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Wind className="w-4 h-4" />
            3. Apnea Testing
            {apneaState.targetReached ? (
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-sky-400" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('ancillary')}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl font-bold text-xs transition border ${
              activeTab === 'ancillary'
                ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-300'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4" />
            4. Ancillary Testing
          </button>

          <button
            onClick={() => setActiveTab('donor')}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl font-bold text-xs transition border ${
              activeTab === 'donor'
                ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-300'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Heart className="w-4 h-4" />
            5. Donor Resuscitation
            {donorReport.meetsRuleOf100s ? (
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-amber-400" />
            )}
          </button>
        </div>
      </div>

      {/* TAB 1: PREREQUISITES */}
      {activeTab === 'prerequisites' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-indigo-400" />
                  AAN Mandated Clinical Prerequisites Checklist
                </h3>
                <span
                  className={`px-3 py-1 text-xs font-bold rounded-full ${
                    prereqEval.isEligible
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}
                >
                  {prereqEval.isEligible ? 'ALL PREREQUISITES CLEARED' : 'PREREQUISITE BLOCKED'}
                </span>
              </div>

              <div className="space-y-3">
                {/* 1. Proximate Cause */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-slate-200">
                      1. Established Proximate Cause of Irreversible Coma
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Demonstrated structural brain injury or catastrophic anoxic damage on neuroimaging.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={prereqs.proximateCauseKnown}
                    onChange={(e) =>
                      setPrereqs({ ...prereqs, proximateCauseKnown: e.target.checked })
                    }
                    className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                  />
                </div>

                {/* 2. Core Temperature */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-slate-200">
                        2. Core Body Temperature (&ge; 36.0°C / 96.8°F)
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Hypothermia depresses brainstem reflexes and electrocerebral activity.
                      </div>
                    </div>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                        prereqs.coreTempC >= 36.0
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-rose-500/10 text-rose-400'
                      }`}
                    >
                      {prereqs.coreTempC.toFixed(1)}°C
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={33.0}
                      max={39.0}
                      step={0.1}
                      value={prereqs.coreTempC}
                      onChange={(e) =>
                        setPrereqs({ ...prereqs, coreTempC: parseFloat(e.target.value) })
                      }
                      className="w-full accent-indigo-500"
                    />
                  </div>
                </div>

                {/* 3. Hemodynamics: SBP >= 100 mmHg */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-slate-200">
                        3. Systolic Blood Pressure (&ge; 100 mmHg / MAP &ge; 60 mmHg)
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Adequate perfusion pressure is required to avoid reversible ischemic reflex suppression.
                      </div>
                    </div>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                        prereqs.systolicBp >= 100
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-rose-500/10 text-rose-400'
                      }`}
                    >
                      {prereqs.systolicBp} / {prereqs.meanArterialPressure} mmHg
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={60}
                      max={160}
                      step={1}
                      value={prereqs.systolicBp}
                      onChange={(e) => {
                        const sbp = parseInt(e.target.value);
                        setPrereqs({
                          ...prereqs,
                          systolicBp: sbp,
                          meanArterialPressure: Math.round(sbp * 0.65),
                        });
                      }}
                      className="w-full accent-indigo-500"
                    />
                  </div>
                </div>

                {/* 4. Neuromuscular Blockade */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-slate-200">
                      4. Absence of Neuromuscular Blockade (TOF 4/4 Twitches)
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Paralytics (rocuronium, cisatracurium) must be reversed or eliminated.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={prereqs.neuromuscularBlockadeFree}
                    onChange={(e) =>
                      setPrereqs({ ...prereqs, neuromuscularBlockadeFree: e.target.checked })
                    }
                    className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                  />
                </div>

                {/* 5. CNS Depressant Clearance */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-slate-200">
                      5. Clearance of CNS Depressant Drugs (&ge; 5 Elimination Half-Lives)
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Propofol, fentanyl, benzodiazepines, barbiturates must be cleared or confirmed negative.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={prereqs.cnsDepressantsCleared}
                    onChange={(e) =>
                      setPrereqs({ ...prereqs, cnsDepressantsCleared: e.target.checked })
                    }
                    className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                  />
                </div>

                {/* 6. Severe Metabolic Derangements */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-slate-200">
                      6. Absence of Severe Metabolic, Acid-Base, or Endocrine Crises
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Severe hypoglycemia, severe hyperosmolar states, or profound electrolyte abnormalities ruled out.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={prereqs.severeMetabolicDerangementAbsent}
                    onChange={(e) =>
                      setPrereqs({
                        ...prereqs,
                        severeMetabolicDerangementAbsent: e.target.checked,
                      })
                    }
                    className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Prerequisite Status & Actions */}
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-indigo-400" />
                AAN Prerequisite Audit
              </h3>

              {prereqEval.isEligible ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    ELIGIBLE TO PROCEED
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    All AAN prerequisites are satisfied. You may now perform the formal brainstem reflex examination.
                  </p>
                  <button
                    onClick={() => setActiveTab('reflexes')}
                    className="w-full mt-2 py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    Proceed to Brainstem Reflexes
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-3">
                  <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4" />
                    EXAM PROHIBITED UNTIL RESOLVED
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {prereqEval.blockers.map((blocker, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                        <span>{blocker}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-[11px] text-slate-400 italic">
                    Initiate warming, vasopressors, or drug clearance wait time before proceeding.
                  </p>
                </div>
              )}

              {prereqEval.warnings.length > 0 && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5" />
                    Clinical Caution
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-300">
                    {prereqEval.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-sky-400" />
                Target Warming Protocol
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                If core temperature is below 36.0°C, apply forced-air surface warming (Bair Hugger) and warm IV fluids. Severe hypothermia (&lt; 32°C) can cause total brainstem reflex abolishment that mimics brain death.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BRAINSTEM REFLEXES */}
      {activeTab === 'reflexes' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-indigo-400" />
                  Cranial Nerve Brainstem Reflex Examination
                </h3>
                <span
                  className={`px-3 py-1 text-xs font-bold rounded-full ${
                    reflexEval.allBrainstemReflexesAbsent
                      ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}
                >
                  {reflexEval.allBrainstemReflexesAbsent
                    ? 'ALL BRAINSTEM REFLEXES ABSENT'
                    : 'PERSISTENT REFLEX DETECTED'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Pupillary Reflex Right */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">
                      Right Pupil Light Reflex (CN II/III)
                    </span>
                    <input
                      type="checkbox"
                      checked={reflexes.pupillaryLightReflexRight}
                      onChange={(e) =>
                        setReflexes({ ...reflexes, pupillaryLightReflexRight: e.target.checked })
                      }
                      className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                    />
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Brain death: fixed, dilated (4-9 mm) or mid-position, non-reactive to bright light.
                  </div>
                </div>

                {/* Pupillary Reflex Left */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">
                      Left Pupil Light Reflex (CN II/III)
                    </span>
                    <input
                      type="checkbox"
                      checked={reflexes.pupillaryLightReflexLeft}
                      onChange={(e) =>
                        setReflexes({ ...reflexes, pupillaryLightReflexLeft: e.target.checked })
                      }
                      className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                    />
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Brain death: fixed, non-reactive to light in left eye.
                  </div>
                </div>

                {/* Corneal Reflex Right */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">
                      Right Corneal Reflex (CN V/VII)
                    </span>
                    <input
                      type="checkbox"
                      checked={reflexes.cornealReflexRight}
                      onChange={(e) =>
                        setReflexes({ ...reflexes, cornealReflexRight: e.target.checked })
                      }
                      className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                    />
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Sterile cotton swab touch to cornea; absent blink response.
                  </div>
                </div>

                {/* Corneal Reflex Left */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">
                      Left Corneal Reflex (CN V/VII)
                    </span>
                    <input
                      type="checkbox"
                      checked={reflexes.cornealReflexLeft}
                      onChange={(e) =>
                        setReflexes({ ...reflexes, cornealReflexLeft: e.target.checked })
                      }
                      className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                    />
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Absent direct and consensual blink response to touch.
                  </div>
                </div>

                {/* Oculocephalic (Doll's Eyes) */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">
                      Oculocephalic Reflex (Doll’s Eyes)
                    </span>
                    <input
                      type="checkbox"
                      checked={reflexes.oculocephalicDollEyes}
                      onChange={(e) =>
                        setReflexes({ ...reflexes, oculocephalicDollEyes: e.target.checked })
                      }
                      className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                    />
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Rapid head rotation (cleared C-spine). Brain death: eyes remain fixed in orbit.
                  </div>
                </div>

                {/* Cold Calorics (Oculovestibular) */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">
                      Oculovestibular (Cold Calorics)
                    </span>
                    <input
                      type="checkbox"
                      checked={
                        reflexes.oculovestibularColdCaloricsRight ||
                        reflexes.oculovestibularColdCaloricsLeft
                      }
                      onChange={(e) =>
                        setReflexes({
                          ...reflexes,
                          oculovestibularColdCaloricsRight: e.target.checked,
                          oculovestibularColdCaloricsLeft: e.target.checked,
                        })
                      }
                      className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                    />
                  </div>
                  <div className="text-[11px] text-slate-400">
                    50 mL ice water ear canal irrigation (HOB 30°); zero eye deviation after 1 min.
                  </div>
                </div>

                {/* Facial Grimacing to Noxious */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">
                      Facial Grimace to Noxious Stimulation
                    </span>
                    <input
                      type="checkbox"
                      checked={reflexes.facialNoxiousGrimace}
                      onChange={(e) =>
                        setReflexes({ ...reflexes, facialNoxiousGrimace: e.target.checked })
                      }
                      className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                    />
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Pressure on supraorbital ridge or TMJ condyles; no motor grimace (CN VII).
                  </div>
                </div>

                {/* Pharyngeal Gag Reflex */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">
                      Pharyngeal Gag Reflex (CN IX/X)
                    </span>
                    <input
                      type="checkbox"
                      checked={reflexes.pharyngealGagReflex}
                      onChange={(e) =>
                        setReflexes({ ...reflexes, pharyngealGagReflex: e.target.checked })
                      }
                      className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                    />
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Posterior pharynx stimulation with suction catheter; no pharyngeal contraction.
                  </div>
                </div>

                {/* Tracheal Cough Reflex */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">
                      Tracheal Cough Reflex (CN X)
                    </span>
                    <input
                      type="checkbox"
                      checked={reflexes.trachealCoughReflex}
                      onChange={(e) =>
                        setReflexes({ ...reflexes, trachealCoughReflex: e.target.checked })
                      }
                      className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                    />
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Deep bronchial suctioning through ETT beyond carina; no cough or bucking.
                  </div>
                </div>

                {/* Spinal Reflexes (Allowed!) */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-amber-800/40 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300">
                      Spinal Reflexes Present (e.g. Lazarus sign)
                    </span>
                    <input
                      type="checkbox"
                      checked={reflexes.spinalReflexesPresent}
                      onChange={(e) =>
                        setReflexes({ ...reflexes, spinalReflexesPresent: e.target.checked })
                      }
                      className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                    />
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Triple flexion, plantar response, Lazarus sign originate in the spine and DO NOT invalidate brain death.
                  </div>
                </div>
              </div>

              {/* Quick Set Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() =>
                    setReflexes({
                      pupillaryLightReflexRight: false,
                      pupillaryLightReflexLeft: false,
                      cornealReflexRight: false,
                      cornealReflexLeft: false,
                      oculocephalicDollEyes: false,
                      oculovestibularColdCaloricsRight: false,
                      oculovestibularColdCaloricsLeft: false,
                      facialNoxiousGrimace: false,
                      pharyngealGagReflex: false,
                      trachealCoughReflex: false,
                      spinalReflexesPresent: false,
                    })
                  }
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition"
                >
                  Set All Absent (Brain Death Pattern)
                </button>
                <button
                  onClick={() =>
                    setReflexes({
                      pupillaryLightReflexRight: true,
                      pupillaryLightReflexLeft: true,
                      cornealReflexRight: true,
                      cornealReflexLeft: true,
                      oculocephalicDollEyes: true,
                      oculovestibularColdCaloricsRight: true,
                      oculovestibularColdCaloricsLeft: true,
                      facialNoxiousGrimace: true,
                      pharyngealGagReflex: true,
                      trachealCoughReflex: true,
                      spinalReflexesPresent: false,
                    })
                  }
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition"
                >
                  Set All Intact (Awake / Intact Brainstem)
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel: Reflex Evaluation Summary */}
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-indigo-400" />
                Reflex Adjudication
              </h3>

              {reflexEval.allBrainstemReflexesAbsent ? (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-2">
                  <div className="flex items-center gap-2 text-rose-300 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-rose-400" />
                    ABSENCE OF ALL BRAINSTEM REFLEXES CONFIRMED
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Total loss of all cranial nerve reflexes (CN II, III, V, VII, VIII, IX, X) is documented.
                  </p>
                  <button
                    onClick={() => setActiveTab('apnea')}
                    className="w-full mt-2 py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    Proceed to Apnea Test
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                    <Activity className="w-4 h-4" />
                    BRAINSTEM FUNCTION PERSISTS
                  </div>
                  <p className="text-xs text-slate-300">
                    Brain death cannot be declared because the following brainstem reflexes are intact:
                  </p>
                  <ul className="space-y-1 text-xs text-slate-200">
                    {reflexEval.persistentReflexes.map((ref, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 text-emerald-300 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        {ref}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {reflexes.spinalReflexesPresent && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1 text-xs">
                  <div className="font-bold text-amber-300 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5" />
                    Spinal Cord Reflex Notice
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    {reflexEval.spinalReflexNote}
                  </p>
                </div>
              )}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                The Lazarus Sign
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                The Lazarus sign is a complex spinal reflex involving bilateral arm abduction, flexion across the chest, and brief hand elevation, often seen during apnea testing or extubation. It does NOT represent purposeful movement and does NOT originate from the brainstem.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: APNEA TESTING */}
      {activeTab === 'apnea' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                  <Wind className="w-4 h-4 text-indigo-400" />
                  Real-Time Apnea Testing Console
                </h3>
                <span
                  className={`px-3 py-1 text-xs font-bold rounded-full ${
                    apneaState.targetReached
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : apneaState.aborted
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      : 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                  }`}
                >
                  {apneaState.targetReached
                    ? 'AAN TARGET MET (PaCO2 >= 60 & Delta >= 20)'
                    : apneaState.aborted
                    ? 'APNEA TEST ABORTED'
                    : `IN PROGRESS (${apneaState.elapsedMinutes.toFixed(1)} MIN)`}
                </span>
              </div>

              {/* Patient Vitals & ABG Real-Time Telemetry Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    PaCO2 (Goal &ge; 60)
                  </span>
                  <div className="text-xl font-black text-rose-400 flex items-baseline gap-1">
                    {apneaState.currentPaCO2.toFixed(1)}
                    <span className="text-xs text-slate-400 font-normal">mmHg</span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Baseline: {apneaState.initialPaCO2} | &Delta;: +
                    {(apneaState.currentPaCO2 - apneaState.initialPaCO2).toFixed(1)}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Arterial pH
                  </span>
                  <div className="text-xl font-black text-amber-300 flex items-baseline gap-1">
                    {apneaState.arterialPH.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Acidosis from dissolved CO2
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    PaO2 / SpO2
                  </span>
                  <div className="text-xl font-black text-emerald-400 flex items-baseline gap-1">
                    {apneaState.currentPaO2.toFixed(0)}
                    <span className="text-xs text-slate-400 font-normal">mmHg</span>
                    <span className="text-xs text-emerald-300 ml-1">
                      ({apneaState.spO2}%)
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Abort if SpO2 &lt; 85%
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Systolic BP
                  </span>
                  <div className="text-xl font-black text-sky-400 flex items-baseline gap-1">
                    {apneaState.systolicBP}
                    <span className="text-xs text-slate-400 font-normal">mmHg</span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Abort if SBP &lt; 90
                  </div>
                </div>
              </div>

              {/* Apnea Test Configuration Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-950/50 border border-slate-800">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Apneic Oxygenation Delivery Method:
                  </label>
                  <select
                    value={oxygenMethod}
                    onChange={(e) => setOxygenMethod(e.target.value as OxygenationMethod)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                  >
                    <option value="apneic_catheter">
                      Insufflation Catheter at Carina (100% O2 @ 6 L/min) - Recommended
                    </option>
                    <option value="cpap_valve">
                      T-Piece CPAP Valve (100% O2 @ 10 cmH2O) - Prevents Atelectasis
                    </option>
                    <option value="none">
                      None / Room Air (Hazardous: Rapid Desaturation)
                    </option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Baseline Lung Compliance / Reserve:
                  </label>
                  <select
                    value={lungCondition}
                    onChange={(e) => setLungCondition(e.target.value as PatientLungCondition)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                  >
                    <option value="normal">Normal Lungs (Good FRC Reserve)</option>
                    <option value="copd">COPD / Chronic Hypercapnia</option>
                    <option value="ards">Severe ARDS / High Shunt (High Desaturation Risk)</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons: Advance Time, Trigger Breath, Abort */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  disabled={!apneaState.isTestActive || apneaState.aborted || apneaState.targetReached}
                  onClick={() => handleStepApnea(1.0)}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow"
                >
                  <Play className="w-3.5 h-3.5" />
                  Advance Apnea +1.0 min
                </button>
                <button
                  disabled={!apneaState.isTestActive || apneaState.aborted || apneaState.targetReached}
                  onClick={() => handleStepApnea(3.0)}
                  className="px-4 py-2.5 bg-indigo-700 hover:bg-indigo-600 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow"
                >
                  <Clock className="w-3.5 h-3.5" />
                  Advance Apnea +3.0 min
                </button>
                <button
                  disabled={!apneaState.isTestActive || apneaState.aborted || apneaState.targetReached}
                  onClick={() => handleStepApnea(0.5, true)}
                  className="px-4 py-2.5 bg-rose-600/80 hover:bg-rose-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 border border-rose-500/40"
                >
                  <Wind className="w-3.5 h-3.5" />
                  Simulate Spontaneous Breath
                </button>
                <button
                  onClick={handleResetApnea}
                  className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ml-auto"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Apnea Test
                </button>
              </div>

              {/* Real-time Apnea Event Log */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-2 max-h-48 overflow-y-auto font-mono text-xs">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Test Execution Audit Log:
                </div>
                {apneaState.log.map((entry, idx) => (
                  <div key={idx} className="text-slate-300 text-[11px] leading-relaxed">
                    &bull; {entry}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel: Apnea Interpretation */}
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-indigo-400" />
                Apnea Test Interpretation
              </h3>

              <div
                className={`p-4 rounded-xl border space-y-2 ${
                  apneaEval.status === 'POSITIVE_BRAIN_DEATH'
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                    : apneaEval.status === 'NEGATIVE_SPONTANEOUS_BREATHING'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                    : apneaEval.status === 'ABORTED_INCONCLUSIVE'
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                    : 'bg-slate-950/70 border-slate-800 text-slate-300'
                }`}
              >
                <div className="font-bold text-xs uppercase tracking-wider">
                  Status: {apneaEval.status.replace(/_/g, ' ')}
                </div>
                <p className="text-xs leading-relaxed">{apneaEval.clinicalInterpretation}</p>
                <div className="pt-2 border-t border-slate-800/80 text-[11px] font-semibold text-slate-300">
                  Recommendation: {apneaEval.nextStepRecommendation}
                </div>
              </div>

              {apneaEval.status === 'ABORTED_INCONCLUSIVE' && (
                <button
                  onClick={() => setActiveTab('ancillary')}
                  className="w-full py-2.5 px-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow"
                >
                  Proceed to Mandatory Ancillary Testing
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              {apneaEval.status === 'POSITIVE_BRAIN_DEATH' && (
                <button
                  onClick={() => setActiveTab('donor')}
                  className="w-full py-2.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow"
                >
                  Proceed to Organ Donor Optimization
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Flame className="w-4 h-4 text-rose-400" />
                Apnea Physiology &amp; CO2 Kinetics
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Metabolic CO2 generation is ~200 mL/min. In complete apnea, alveolar CO2 rises at 3.0 mmHg/min. The AAN requires PaCO2 &ge; 60 mmHg AND an increase of &ge; 20 mmHg above baseline to ensure maximum stimulus to the medullary respiratory center.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ANCILLARY TESTING */}
      {activeTab === 'ancillary' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-indigo-400" />
                  AAN-Approved Ancillary Diagnostic Modalities
                </h3>
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  CEREBRAL PERFUSION &amp; BIOELECTRICAL SILENCE
                </span>
              </div>

              {/* Modality Selector Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => setSelectedModality('angiography')}
                  className={`p-3 rounded-xl text-xs font-bold transition border ${
                    selectedModality === 'angiography'
                      ? 'bg-indigo-600 border-indigo-500 text-white'
                      : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  4-Vessel Angiography
                </button>
                <button
                  onClick={() => setSelectedModality('spect_perfusion')}
                  className={`p-3 rounded-xl text-xs font-bold transition border ${
                    selectedModality === 'spect_perfusion'
                      ? 'bg-indigo-600 border-indigo-500 text-white'
                      : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  SPECT Radionuclide
                </button>
                <button
                  onClick={() => setSelectedModality('tcd')}
                  className={`p-3 rounded-xl text-xs font-bold transition border ${
                    selectedModality === 'tcd'
                      ? 'bg-indigo-600 border-indigo-500 text-white'
                      : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Transcranial Doppler
                </button>
                <button
                  onClick={() => setSelectedModality('eeg')}
                  className={`p-3 rounded-xl text-xs font-bold transition border ${
                    selectedModality === 'eeg'
                      ? 'bg-indigo-600 border-indigo-500 text-white'
                      : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  EEG Silence
                </button>
              </div>

              {/* Scenario Toggle (Brain Death Pattern vs Intact Flow) */}
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-xs font-bold text-slate-400 px-2">Simulation Mode:</span>
                <button
                  onClick={() => setAncillaryScenario('brain_death')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    ancillaryScenario === 'brain_death'
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Brain Death Positive Pattern
                </button>
                <button
                  onClick={() => setAncillaryScenario('preserved_flow')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    ancillaryScenario === 'preserved_flow'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Preserved Perfusion Pattern
                </button>
              </div>

              {/* Visual Presentation Bench */}
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider">
                    {ancillaryResult.modalityTitle}
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      ancillaryResult.isConsistentWithBrainDeath
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {ancillaryResult.isConsistentWithBrainDeath
                      ? 'CONSISTENT WITH BRAIN DEATH'
                      : 'BRAIN DEATH NOT CONFIRMED'}
                  </span>
                </div>

                {/* Interactive Graphic / Schematic Representation */}
                <div className="h-44 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-center p-4">
                  {selectedModality === 'spect_perfusion' && (
                    <div className="text-center space-y-2">
                      <div className="w-24 h-24 mx-auto rounded-full border-4 border-dashed border-slate-700 relative flex items-center justify-center">
                        {ancillaryScenario === 'brain_death' ? (
                          <>
                            <div className="w-16 h-16 rounded-full bg-slate-950 flex items-center justify-center text-[10px] text-slate-600 font-mono">
                              COLD CRANIUM
                            </div>
                            <div className="absolute top-2 w-4 h-4 rounded-full bg-rose-500 animate-pulse shadow-lg shadow-rose-500/50" />
                            <span className="absolute -bottom-6 text-[10px] font-bold text-rose-400">
                              HOT NOSE SIGN
                            </span>
                          </>
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500/40 via-sky-500/40 to-indigo-500/40 animate-pulse flex items-center justify-center text-[10px] font-bold text-white">
                            TRACER UPTAKE
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedModality === 'angiography' && (
                    <div className="text-center space-y-2">
                      <div className="font-mono text-xs text-slate-300">
                        {ancillaryScenario === 'brain_death' ? (
                          <div className="space-y-1">
                            <div className="text-rose-400 font-bold">
                              4-VESSEL CONTRAST CUTOFF AT CAROTID SIPHON
                            </div>
                            <div className="text-[11px] text-slate-500">
                              External carotid branches opacified | Zero intracranial branches filled
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <div className="text-emerald-400 font-bold">
                              PATENT CIRCLE OF WILLIS &amp; CORTICAL VESSELS
                            </div>
                            <div className="text-[11px] text-slate-500">
                              Bilateral ACA, MCA, and PCA rapid capillary phase present
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedModality === 'tcd' && (
                    <div className="text-center space-y-2">
                      <div className="font-mono text-xs text-slate-300">
                        {ancillaryScenario === 'brain_death' ? (
                          <div className="space-y-1">
                            <div className="text-rose-400 font-bold">
                              BIPHASIC REVERBERATING FLOW / SYSTOLIC SPIKES
                            </div>
                            <div className="text-[11px] text-slate-500">
                              Equal forward and reverse velocity components (Net zero intracranial forward flow)
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <div className="text-emerald-400 font-bold">
                              NORMAL FORWARD DIASTOLIC FLOW
                            </div>
                            <div className="text-[11px] text-slate-500">
                              Mean velocity 55 cm/s, PI 0.95 (Robust cerebral microvascular flow)
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedModality === 'eeg' && (
                    <div className="text-center space-y-2">
                      <div className="font-mono text-xs text-slate-300">
                        {ancillaryScenario === 'brain_death' ? (
                          <div className="space-y-1">
                            <div className="text-rose-400 font-bold">
                              ELECTROCEREBRAL SILENCE (ISOELECTRIC &lt; 2 &mu;V)
                            </div>
                            <div className="text-[11px] text-slate-500">
                              30 min recording at 2 &mu;V/mm sensitivity with no bioelectrical activity
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <div className="text-emerald-400 font-bold">
                              SYNCHRONOUS CORTICAL RHYTHM DETECTED
                            </div>
                            <div className="text-[11px] text-slate-500">
                              25-35 &mu;V polymorphic background activity across frontoparietal electrodes
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="font-bold text-slate-200">Radiological / Diagnostic Findings:</div>
                  <p className="leading-relaxed text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                    {ancillaryResult.findings}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Ancillary Test Adjudication */}
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-indigo-400" />
                Ancillary Adjudication
              </h3>

              <div
                className={`p-4 rounded-xl border space-y-2 ${
                  ancillaryResult.isConsistentWithBrainDeath
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                }`}
              >
                <div className="font-bold text-xs">
                  Key Hallmark: {ancillaryResult.keyFeature}
                </div>
                <p className="text-xs leading-relaxed">{ancillaryResult.recommendation}</p>
              </div>

              {ancillaryResult.isConsistentWithBrainDeath && (
                <button
                  onClick={() => setActiveTab('donor')}
                  className="w-full py-2.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow"
                >
                  Proceed to Donor Management
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Info className="w-4 h-4 text-sky-400" />
                When is Ancillary Testing Mandatory?
              </h4>
              <ul className="space-y-2 text-xs text-slate-400 leading-relaxed list-disc pl-4">
                <li>Apnea test cannot be completed due to severe hypoxemia or hypotension.</li>
                <li>Baseline severe hypercapnia (COPD with chronic CO2 retention).</li>
                <li>Cervical spinal trauma preventing chest excursion observation.</li>
                <li>Toxicological confounders that cannot be cleared in a timely manner.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ORGAN DONOR MANAGEMENT */}
      {activeTab === 'donor' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-400" />
                  Deceased Donor Resuscitation &amp; "Rule of 100s"
                </h3>
                <span
                  className={`px-3 py-1 text-xs font-bold rounded-full ${
                    donorReport.meetsRuleOf100s
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}
                >
                  {donorReport.meetsRuleOf100s ? 'RULE OF 100s ACHIEVED' : 'RESUSCITATION IN PROGRESS'}
                </span>
              </div>

              {/* Organ Yield Dashboard */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Heart Graft
                  </span>
                  <div
                    className={`text-lg font-black ${
                      donorReport.organViabilityYield.heart === 'Optimal'
                        ? 'text-emerald-400'
                        : donorReport.organViabilityYield.heart === 'Marginal'
                        ? 'text-amber-300'
                        : 'text-rose-400'
                    }`}
                  >
                    {donorReport.organViabilityYield.heart}
                  </div>
                  <div className="text-[10px] text-slate-500">Goal SBP &ge; 100, T4 active</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Lungs Graft
                  </span>
                  <div
                    className={`text-lg font-black ${
                      donorReport.organViabilityYield.lungs === 'Optimal'
                        ? 'text-emerald-400'
                        : donorReport.organViabilityYield.lungs === 'Marginal'
                        ? 'text-amber-300'
                        : 'text-rose-400'
                    }`}
                  >
                    {donorReport.organViabilityYield.lungs}
                  </div>
                  <div className="text-[10px] text-slate-500">Goal PaO2 &ge; 100, steroid</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Liver Graft
                  </span>
                  <div
                    className={`text-lg font-black ${
                      donorReport.organViabilityYield.liver === 'Optimal'
                        ? 'text-emerald-400'
                        : donorReport.organViabilityYield.liver === 'Marginal'
                        ? 'text-amber-300'
                        : 'text-rose-400'
                    }`}
                  >
                    {donorReport.organViabilityYield.liver}
                  </div>
                  <div className="text-[10px] text-slate-500">Na &le; 150, MAP &ge; 65</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Kidneys Graft
                  </span>
                  <div
                    className={`text-lg font-black ${
                      donorReport.organViabilityYield.kidneys === 'Optimal'
                        ? 'text-emerald-400'
                        : donorReport.organViabilityYield.kidneys === 'Marginal'
                        ? 'text-amber-300'
                        : 'text-rose-400'
                    }`}
                  >
                    {donorReport.organViabilityYield.kidneys}
                  </div>
                  <div className="text-[10px] text-slate-500">UOP 100-250 mL/h</div>
                </div>
              </div>

              {/* Resuscitation Titration Sliders */}
              <div className="space-y-4 pt-2">
                {/* SBP Slider */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">
                      Systolic BP (Goal &ge; 100 mmHg / MAP &ge; 65 mmHg)
                    </span>
                    <span className="text-xs font-bold text-indigo-400">
                      {donorState.systolicBP} mmHg (MAP {donorState.meanArterialPressure} mmHg)
                    </span>
                  </div>
                  <input
                    type="range"
                    min={70}
                    max={140}
                    step={1}
                    value={donorState.systolicBP}
                    onChange={(e) => {
                      const sbp = parseInt(e.target.value);
                      setDonorState({
                        ...donorState,
                        systolicBP: sbp,
                        meanArterialPressure: Math.round(sbp * 0.65),
                      });
                    }}
                    className="w-full accent-indigo-500"
                  />
                </div>

                {/* Urine Output / DI Slider */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">
                      Urine Output (Goal 100 - 200 mL/h)
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        donorState.urineOutputMlHr > 250
                          ? 'text-rose-400'
                          : donorState.urineOutputMlHr < 100
                          ? 'text-amber-300'
                          : 'text-emerald-400'
                      }`}
                    >
                      {donorState.urineOutputMlHr} mL/h{' '}
                      {donorState.urineOutputMlHr > 250 && '(Diabetes Insipidus!)'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={600}
                    step={10}
                    value={donorState.urineOutputMlHr}
                    onChange={(e) =>
                      setDonorState({
                        ...donorState,
                        urineOutputMlHr: parseInt(e.target.value),
                      })
                    }
                    className="w-full accent-indigo-500"
                  />
                </div>

                {/* Serum Sodium Slider */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">
                      Serum Sodium (Goal 135 - 150 mEq/L)
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        donorState.serumSodium > 150 ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {donorState.serumSodium} mEq/L
                    </span>
                  </div>
                  <input
                    type="range"
                    min={125}
                    max={165}
                    step={1}
                    value={donorState.serumSodium}
                    onChange={(e) =>
                      setDonorState({
                        ...donorState,
                        serumSodium: parseInt(e.target.value),
                      })
                    }
                    className="w-full accent-indigo-500"
                  />
                </div>

                {/* Vasopressin Titration */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">
                      Vasopressin Infusion (Target 0.5 - 2.4 units/hr)
                    </span>
                    <span className="text-xs font-bold text-indigo-400">
                      {donorState.vasopressinDoseUnitsHr.toFixed(1)} units/hr
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0.0}
                    max={3.0}
                    step={0.1}
                    value={donorState.vasopressinDoseUnitsHr}
                    onChange={(e) =>
                      setDonorState({
                        ...donorState,
                        vasopressinDoseUnitsHr: parseFloat(e.target.value),
                      })
                    }
                    className="w-full accent-indigo-500"
                  />
                </div>

                {/* VIP Hormonal Resuscitation Bundle */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    VIP Hormonal Replacement Bundle
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <label className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={donorState.levothyroxineActive}
                        onChange={(e) =>
                          setDonorState({
                            ...donorState,
                            levothyroxineActive: e.target.checked,
                          })
                        }
                        className="w-4 h-4 accent-indigo-600 rounded"
                      />
                      <div className="text-xs text-slate-200">
                        <div className="font-bold">IV T4 / T3</div>
                        <div className="text-[10px] text-slate-400">Restores contractility</div>
                      </div>
                    </label>

                    <label className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={donorState.corticosteroidActive}
                        onChange={(e) =>
                          setDonorState({
                            ...donorState,
                            corticosteroidActive: e.target.checked,
                          })
                        }
                        className="w-4 h-4 accent-indigo-600 rounded"
                      />
                      <div className="text-xs text-slate-200">
                        <div className="font-bold">Methylprednisolone</div>
                        <div className="text-[10px] text-slate-400">15 mg/kg for lung yield</div>
                      </div>
                    </label>

                    <label className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={donorState.insulinActive}
                        onChange={(e) =>
                          setDonorState({
                            ...donorState,
                            insulinActive: e.target.checked,
                          })
                        }
                        className="w-4 h-4 accent-indigo-600 rounded"
                      />
                      <div className="text-xs text-slate-200">
                        <div className="font-bold">Regular Insulin</div>
                        <div className="text-[10px] text-slate-400">Euglycemia (140-180)</div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Optimization Interventions & Goals */}
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-indigo-400" />
                Optimization Audit ({donorReport.overallScorePercent}% Achieved)
              </h3>

              {donorReport.interventionsNeeded.length === 0 ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2 text-xs text-emerald-300">
                  <div className="font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    DONOR OPTIMALLY RESUSCITATED
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    All physiological goals met. Transplant procurement team can be mobilized with maximum organ yield expected.
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2.5">
                  <div className="font-bold text-xs text-amber-300 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Targeted Interventions Required:
                  </div>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {donorReport.interventionsNeeded.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <ChevronRight className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Gauge className="w-4 h-4 text-emerald-400" />
                The "Rule of 100s" Reference
              </h4>
              <ul className="space-y-2 text-xs text-slate-400 leading-relaxed">
                <li><strong className="text-slate-200">SBP:</strong> &ge; 100 mmHg</li>
                <li><strong className="text-slate-200">Urine Output:</strong> &ge; 100 mL/hr</li>
                <li><strong className="text-slate-200">PaO2:</strong> &ge; 100 mmHg (FiO2 &le; 0.40, PEEP 8-10)</li>
                <li><strong className="text-slate-200">Hemoglobin:</strong> &ge; 100 g/L (10 g/dL)</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
