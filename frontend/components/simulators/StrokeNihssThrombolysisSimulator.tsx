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
  ShieldAlert,
  Zap,
  Info,
  Layers,
  HeartPulse,
  Syringe,
  Pill,
  Flame,
  Stethoscope
} from 'lucide-react';
import {
  NihssItemScores,
  AspectsRegion,
  PatientPresentation,
  evaluateAcuteStroke,
  calculateAlteplaseDose,
  calculateTenecteplaseDose,
  CLINICAL_STROKE_PRESETS
} from '../../.gemini/skills/StrokeNihssThrombolysisEngine';

export function StrokeNihssThrombolysisSimulator() {
  const [activeTab, setActiveTab] = useState<'triage' | 'nihss' | 'aspects' | 'protocol' | 'guardrails'>('triage');

  // Patient timeline & vitals state
  const [hoursFromLastKnownWell, setHoursFromLastKnownWell] = useState<number>(1.5);
  const [isWakeUpStroke, setIsWakeUpStroke] = useState<boolean>(false);
  const [mriDwiFlairMismatch, setMriDwiFlairMismatch] = useState<boolean>(false);
  const [age, setAge] = useState<number>(64);
  const [weightKg, setWeightKg] = useState<number>(70);
  const [sbp, setSbp] = useState<number>(168);
  const [dbp, setDbp] = useState<number>(94);
  const [bloodGlucoseMgDl, setBloodGlucoseMgDl] = useState<number>(124);
  const [plateletCount, setPlateletCount] = useState<number>(245000);
  const [inr, setInr] = useState<number>(1.0);
  const [aptt, setAptt] = useState<number>(28);
  const [onTherapeuticDoac, setOnTherapeuticDoac] = useState<boolean>(false);
  const [doacTakenWithin48h, setDoacTakenWithin48h] = useState<boolean>(false);
  const [hasLargeVesselOcclusion, setHasLargeVesselOcclusion] = useState<boolean>(true);
  const [lvoLocation, setLvoLocation] = useState<'ICA' | 'M1' | 'M2' | 'Basilar' | 'None'>('M1');
  const [preStrokeMrs, setPreStrokeMrs] = useState<number>(0);

  // Contraindication Flags
  const [ctEvidenceOfBleed, setCtEvidenceOfBleed] = useState<boolean>(false);
  const [ctHypoattenuationGreaterThanThirdMca, setCtHypoattenuationGreaterThanThirdMca] = useState<boolean>(false);
  const [severeHeadTraumaWithin3Months, setSevereHeadTraumaWithin3Months] = useState<boolean>(false);
  const [intracranialSurgeryWithin3Months, setIntracranialSurgeryWithin3Months] = useState<boolean>(false);
  const [activeInternalBleeding, setActiveInternalBleeding] = useState<boolean>(false);
  const [giMalignancyOrBleedWithin21Days, setGiMalignancyOrBleedWithin21Days] = useState<boolean>(false);
  const [historyOfPriorIch, setHistoryOfPriorIch] = useState<boolean>(false);
  const [recentIntracranialNeoplasmOrAvm, setRecentIntracranialNeoplasmOrAvm] = useState<boolean>(false);

  // Preferred Thrombolytic Agent
  const [preferredAgent, setPreferredAgent] = useState<'tenecteplase' | 'alteplase'>('tenecteplase');

  // NIHSS Items State
  const [nihss, setNihss] = useState<NihssItemScores>({
    loc1a: 0,
    loc1b: 2,
    loc1c: 1,
    bestGaze2: 1,
    visualFields3: 2,
    facialPalsy4: 2,
    motorArmLeft5a: 0,
    motorArmRight5b: 4,
    motorLegLeft6a: 0,
    motorLegRight6b: 3,
    limbAtaxia7: 0,
    sensory8: 1,
    bestLanguage9: 3,
    dysarthria10: 0,
    extinction11: 1
  });

  // ASPECTS Affected Regions State
  const [affectedAspects, setAffectedAspects] = useState<AspectsRegion[]>(['insularRibbon']);

  // Toggle ASPECTS region
  const toggleAspectsRegion = (region: AspectsRegion) => {
    setAffectedAspects(prev =>
      prev.includes(region) ? prev.filter(r => r !== region) : [...prev, region]
    );
  };

  // Compile patient presentation object
  const patient: PatientPresentation = useMemo(() => ({
    hoursFromLastKnownWell: isWakeUpStroke ? -1 : hoursFromLastKnownWell,
    isWakeUpStroke,
    mriDwiFlairMismatch,
    age,
    weightKg,
    sbp,
    dbp,
    bloodGlucoseMgDl,
    plateletCount,
    inr,
    aptt,
    onTherapeuticDoac,
    doacTakenWithin48h,
    hasLargeVesselOcclusion,
    lvoLocation,
    preStrokeMrs,
    ctEvidenceOfBleed,
    ctHypoattenuationGreaterThanThirdMca,
    severeHeadTraumaWithin3Months,
    intracranialSurgeryWithin3Months,
    activeInternalBleeding,
    giMalignancyOrBleedWithin21Days,
    historyOfPriorIch,
    recentIntracranialNeoplasmOrAvm
  }), [
    hoursFromLastKnownWell, isWakeUpStroke, mriDwiFlairMismatch, age, weightKg, sbp, dbp,
    bloodGlucoseMgDl, plateletCount, inr, aptt, onTherapeuticDoac, doacTakenWithin48h,
    hasLargeVesselOcclusion, lvoLocation, preStrokeMrs, ctEvidenceOfBleed,
    ctHypoattenuationGreaterThanThirdMca, severeHeadTraumaWithin3Months,
    intracranialSurgeryWithin3Months, activeInternalBleeding, giMalignancyOrBleedWithin21Days,
    historyOfPriorIch, recentIntracranialNeoplasmOrAvm
  ]);

  // Master stroke assessment
  const assessment = useMemo(() => {
    return evaluateAcuteStroke(patient, nihss, affectedAspects, preferredAgent);
  }, [patient, nihss, affectedAspects, preferredAgent]);

  // Preset loader
  const loadPreset = (presetId: string) => {
    const preset = CLINICAL_STROKE_PRESETS.find(p => p.id === presetId);
    if (!preset) return;

    setHoursFromLastKnownWell(preset.patient.hoursFromLastKnownWell < 0 ? 1 : preset.patient.hoursFromLastKnownWell);
    setIsWakeUpStroke(preset.patient.isWakeUpStroke);
    setMriDwiFlairMismatch(!!preset.patient.mriDwiFlairMismatch);
    setAge(preset.patient.age);
    setWeightKg(preset.patient.weightKg);
    setSbp(preset.patient.sbp);
    setDbp(preset.patient.dbp);
    setBloodGlucoseMgDl(preset.patient.bloodGlucoseMgDl);
    setPlateletCount(preset.patient.plateletCount);
    setInr(preset.patient.inr);
    setAptt(preset.patient.aptt);
    setOnTherapeuticDoac(preset.patient.onTherapeuticDoac);
    setDoacTakenWithin48h(preset.patient.doacTakenWithin48h);
    setHasLargeVesselOcclusion(preset.patient.hasLargeVesselOcclusion);
    setLvoLocation(preset.patient.lvoLocation || 'None');
    setPreStrokeMrs(preset.patient.preStrokeMrs);

    setCtEvidenceOfBleed(preset.patient.ctEvidenceOfBleed);
    setCtHypoattenuationGreaterThanThirdMca(preset.patient.ctHypoattenuationGreaterThanThirdMca);
    setSevereHeadTraumaWithin3Months(preset.patient.severeHeadTraumaWithin3Months);
    setIntracranialSurgeryWithin3Months(preset.patient.intracranialSurgeryWithin3Months);
    setActiveInternalBleeding(preset.patient.activeInternalBleeding);
    setGiMalignancyOrBleedWithin21Days(preset.patient.giMalignancyOrBleedWithin21Days);
    setHistoryOfPriorIch(preset.patient.historyOfPriorIch);
    setRecentIntracranialNeoplasmOrAvm(preset.patient.recentIntracranialNeoplasmOrAvm);

    setNihss({ ...preset.nihss });
    setAffectedAspects([...preset.aspectsRegions]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6 lg:p-8 font-sans">
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Track A67 &bull; 200th Milestone!
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                AHA/ASA 2021 Stroke Guidelines
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Neurovascular ICU &amp; Angio Suite
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <Brain className="w-8 h-8 text-cyan-400 animate-pulse" />
              Acute Ischemic Stroke (AIS), NIHSS, ASPECTS &amp; Thrombolysis Protocol Workstation
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-3xl">
              Complete 11-item NIHSS examination scoring, 10-region ASPECTS neuroimaging, AHA/ASA IV Thrombolysis (Tenecteplase / Alteplase) eligibility &amp; weight-adjusted dosing, LVO Endovascular Thrombectomy (EVT) triage, and permissive hemodynamic guardrails.
            </p>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap gap-2 items-center">
            {CLINICAL_STROKE_PRESETS.map(preset => (
              <button
                key={preset.id}
                onClick={() => loadPreset(preset.id)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition shadow-sm"
              >
                {preset.name.split(':')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* 5 Executive KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-4">
          {/* Card 1: Total NIHSS */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Total NIHSS Score</span>
              <Activity className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-white tracking-tight">
              {assessment.totalNihss} <span className="text-xs font-normal text-slate-400">/ 42</span>
            </div>
            <div className="flex items-center justify-between mt-1 text-xs">
              <span className="text-slate-400">Severity:</span>
              <strong className={`font-semibold ${
                assessment.totalNihss >= 21 ? 'text-red-400' :
                assessment.totalNihss >= 16 ? 'text-rose-400' :
                assessment.totalNihss >= 5 ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {assessment.nihssCategory}
              </strong>
            </div>
          </div>

          {/* Card 2: ASPECTS Score */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>ASPECTS Score</span>
              <Layers className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-bold text-white tracking-tight">
              {assessment.totalAspects} <span className="text-xs font-normal text-slate-400">/ 10</span>
            </div>
            <div className="flex items-center justify-between mt-1 text-xs">
              <span className="text-slate-400">Core Volume:</span>
              <strong className={`font-semibold ${
                assessment.totalAspects >= 8 ? 'text-emerald-400' :
                assessment.totalAspects >= 6 ? 'text-amber-400' : 'text-red-400'
              }`}>
                {assessment.aspectsStatus.split(' ')[0]}
              </strong>
            </div>
          </div>

          {/* Card 3: IV Thrombolysis */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>IV Thrombolysis</span>
              <Syringe className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-base font-bold truncate">
              {assessment.thrombolysis.isEligible ? (
                <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Eligible</span>
              ) : (
                <span className="text-rose-400 flex items-center gap-1"><XCircle className="w-4 h-4" /> Ineligible</span>
              )}
            </div>
            <div className="mt-1 text-xs text-slate-400 truncate">
              {assessment.thrombolysis.isEligible && assessment.thrombolysis.dosing ? (
                <span>{assessment.thrombolysis.dosing.agent.toUpperCase()}: {assessment.thrombolysis.dosing.totalDoseMg} mg</span>
              ) : (
                <span>{assessment.thrombolysis.contraindications.length} Contraindications</span>
              )}
            </div>
          </div>

          {/* Card 4: EVT Mechanical Thrombectomy */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>EVT / Thrombectomy</span>
              <Zap className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-base font-bold truncate">
              {assessment.evt.isEligible ? (
                <span className="text-purple-400 flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> EVT Candidate</span>
              ) : (
                <span className="text-slate-400 flex items-center gap-1"><XCircle className="w-4 h-4" /> Non-Candidate</span>
              )}
            </div>
            <div className="mt-1 text-xs text-slate-400 truncate">
              Vessel: {assessment.evt.targetVessel} &bull; {assessment.evt.timeWindow.replace(/_/g, ' ')}
            </div>
          </div>

          {/* Card 5: Blood Pressure Guardrail */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Hemodynamic Guardrail</span>
              <Gauge className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-xl font-bold text-white tracking-tight">
              {sbp}/{dbp} <span className="text-xs font-normal text-slate-400">mmHg</span>
            </div>
            <div className="mt-1 text-xs truncate">
              {assessment.bloodPressureGuardrails.requiresImmediateBpReduction ? (
                <span className="text-rose-400 font-semibold flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> Lower BP Pre-Lytic</span>
              ) : (
                <span className="text-emerald-400 font-semibold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> BP Safe for Lytics</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Console with Navigation Tabs */}
      <div className="max-w-7xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {/* Tab Headers */}
        <div className="flex border-b border-slate-800 overflow-x-auto bg-slate-950/60 p-1">
          <button
            onClick={() => setActiveTab('triage')}
            className={`flex items-center gap-2 px-4 py-3 text-xs md:text-sm font-semibold rounded-xl transition whitespace-nowrap ${
              activeTab === 'triage' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Clock className="w-4 h-4" />
            1. Patient Triage &amp; Timeline
          </button>
          <button
            onClick={() => setActiveTab('nihss')}
            className={`flex items-center gap-2 px-4 py-3 text-xs md:text-sm font-semibold rounded-xl transition whitespace-nowrap ${
              activeTab === 'nihss' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Activity className="w-4 h-4" />
            2. NIHSS 11-Item Exam ({assessment.totalNihss})
          </button>
          <button
            onClick={() => setActiveTab('aspects')}
            className={`flex items-center gap-2 px-4 py-3 text-xs md:text-sm font-semibold rounded-xl transition whitespace-nowrap ${
              activeTab === 'aspects' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            3. ASPECTS CT Map ({assessment.totalAspects}/10)
          </button>
          <button
            onClick={() => setActiveTab('protocol')}
            className={`flex items-center gap-2 px-4 py-3 text-xs md:text-sm font-semibold rounded-xl transition whitespace-nowrap ${
              activeTab === 'protocol' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Syringe className="w-4 h-4" />
            4. Thrombolytic &amp; EVT Bench
          </button>
          <button
            onClick={() => setActiveTab('guardrails')}
            className={`flex items-center gap-2 px-4 py-3 text-xs md:text-sm font-semibold rounded-xl transition whitespace-nowrap ${
              activeTab === 'guardrails' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            5. Hemodynamics &amp; Complications
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-5 md:p-7">
          {/* TAB 1: Patient Triage & Timeline */}
          {activeTab === 'triage' && (
            <div className="space-y-6">
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
                  <Clock className="w-5 h-5 text-cyan-400" />
                  Hyperacute Stroke Timeline &amp; Presenting Parameters
                </h2>
                <p className="text-sm text-slate-300">
                  Time is Brain: 1.9 million neurons are lost every minute an ischemic stroke remains untreated. Evaluate Last Known Well (LKW), wake-up stroke imaging, and critical contraindications.
                </p>
              </div>

              {/* Time from LKW & Wake-Up Toggle */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="hours-lkw-slider" className="text-sm font-semibold text-slate-200">
                      Hours from Last Known Well (LKW): {isWakeUpStroke ? 'Unknown (Wake-up)' : `${hoursFromLastKnownWell} hours`}
                    </label>
                    <label htmlFor="chk-wake-up" className="flex items-center gap-2 text-xs text-amber-300 cursor-pointer">
                      <input
                        id="chk-wake-up"
                        type="checkbox"
                        checked={isWakeUpStroke}
                        onChange={e => setIsWakeUpStroke(e.target.checked)}
                        className="w-4 h-4 rounded text-cyan-600 accent-cyan-600"
                      />
                      Wake-Up / Unknown Onset
                    </label>
                  </div>
                  {!isWakeUpStroke ? (
                    <div>
                      <input
                        id="hours-lkw-slider"
                        type="range"
                        min={0.5}
                        max={12}
                        step={0.5}
                        value={hoursFromLastKnownWell}
                        onChange={e => setHoursFromLastKnownWell(Number(e.target.value))}
                        className="w-full accent-cyan-500"
                      />
                      <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                        <span>0.5h</span>
                        <span className="text-emerald-400 font-semibold">3.0h (Standard Window)</span>
                        <span className="text-amber-400 font-semibold">4.5h (Extended Window)</span>
                        <span>6.0h (Early EVT)</span>
                        <span>12h</span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-2 mt-2">
                      <span className="text-xs text-slate-300 block">WAKE-UP Trial Protocol Neuroimaging:</span>
                      <label htmlFor="chk-dwi-flair" className="flex items-center gap-2 text-xs text-white cursor-pointer">
                        <input
                          id="chk-dwi-flair"
                          type="checkbox"
                          checked={mriDwiFlairMismatch}
                          onChange={e => setMriDwiFlairMismatch(e.target.checked)}
                          className="w-4 h-4 rounded text-cyan-600 accent-cyan-600"
                        />
                        <span>Confirmed MRI DWI-FLAIR Mismatch (DWI Positive, FLAIR Negative &rarr; Stroke &lt; 4.5h)</span>
                      </label>
                    </div>
                  )}
                </div>

                {/* Patient Demographics & LVO */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label htmlFor="age-input" className="block text-slate-400 mb-1">Age: {age} yrs</label>
                    <input
                      id="age-input"
                      type="number"
                      value={age}
                      onChange={e => setAge(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="weight-input" className="block text-slate-400 mb-1">Weight: {weightKg} kg</label>
                    <input
                      id="weight-input"
                      type="number"
                      value={weightKg}
                      onChange={e => setWeightKg(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="lvo-select" className="block text-slate-400 mb-1">LVO Location</label>
                    <select
                      id="lvo-select"
                      value={lvoLocation}
                      onChange={e => {
                        const val = e.target.value as 'ICA' | 'M1' | 'M2' | 'Basilar' | 'None';
                        setLvoLocation(val);
                        setHasLargeVesselOcclusion(val !== 'None');
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                    >
                      <option value="M1">MCA M1 Segment (LVO)</option>
                      <option value="ICA">Internal Carotid Artery (ICA) Terminus</option>
                      <option value="M2">MCA M2 Branch (Proximal)</option>
                      <option value="Basilar">Basilar Artery</option>
                      <option value="None">None / Distal Small Vessel</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="mrs-select" className="block text-slate-400 mb-1">Pre-Stroke mRS</label>
                    <select
                      id="mrs-select"
                      value={preStrokeMrs}
                      onChange={e => setPreStrokeMrs(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                    >
                      <option value={0}>0 - No symptoms at all</option>
                      <option value={1}>1 - No significant disability</option>
                      <option value={2}>2 - Slight disability (independent)</option>
                      <option value={3}>3 - Moderate disability (requires help)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Vitals and Labs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                  <label htmlFor="sbp-slider" className="block text-xs font-semibold text-slate-400 mb-1">
                    Systolic BP: {sbp} mmHg
                  </label>
                  <input
                    id="sbp-slider"
                    type="range"
                    min={110}
                    max={240}
                    step={2}
                    value={sbp}
                    onChange={e => setSbp(Number(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                  <span className="text-[11px] text-slate-500">Threshold: &lt; 185 mmHg</span>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                  <label htmlFor="dbp-slider" className="block text-xs font-semibold text-slate-400 mb-1">
                    Diastolic BP: {dbp} mmHg
                  </label>
                  <input
                    id="dbp-slider"
                    type="range"
                    min={60}
                    max={140}
                    step={2}
                    value={dbp}
                    onChange={e => setDbp(Number(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                  <span className="text-[11px] text-slate-500">Threshold: &lt; 110 mmHg</span>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                  <label htmlFor="glucose-input" className="block text-xs font-semibold text-slate-400 mb-1">
                    Blood Glucose: {bloodGlucoseMgDl} mg/dL
                  </label>
                  <input
                    id="glucose-input"
                    type="range"
                    min={30}
                    max={350}
                    step={5}
                    value={bloodGlucoseMgDl}
                    onChange={e => setBloodGlucoseMgDl(Number(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                  <span className="text-[11px] text-slate-500">Exclusion: &lt; 50 mg/dL (Mimic)</span>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                  <label htmlFor="inr-input" className="block text-xs font-semibold text-slate-400 mb-1">
                    INR: {inr} (Plt: {(plateletCount/1000).toFixed(0)}k)
                  </label>
                  <input
                    id="inr-input"
                    type="range"
                    min={0.9}
                    max={3.5}
                    step={0.1}
                    value={inr}
                    onChange={e => setInr(Number(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                  <span className="text-[11px] text-slate-500">Exclusion: &gt; 1.7</span>
                </div>
              </div>

              {/* Exclusion Criteria Checklist */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Absolute Contraindications &amp; High-Risk Bleeding Flags
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <label htmlFor="chk-bleed" className="flex items-center gap-2.5 p-2 rounded bg-slate-900 border border-slate-800 cursor-pointer">
                    <input
                      id="chk-bleed"
                      type="checkbox"
                      checked={ctEvidenceOfBleed}
                      onChange={e => setCtEvidenceOfBleed(e.target.checked)}
                      className="w-4 h-4 rounded text-red-600 accent-red-600"
                    />
                    <span className="text-white">Evidence of Intracranial Hemorrhage on CT</span>
                  </label>

                  <label htmlFor="chk-hypoattenuation" className="flex items-center gap-2.5 p-2 rounded bg-slate-900 border border-slate-800 cursor-pointer">
                    <input
                      id="chk-hypoattenuation"
                      type="checkbox"
                      checked={ctHypoattenuationGreaterThanThirdMca}
                      onChange={e => setCtHypoattenuationGreaterThanThirdMca(e.target.checked)}
                      className="w-4 h-4 rounded text-red-600 accent-red-600"
                    />
                    <span className="text-white">Frank Hypoattenuation &gt; 1/3 MCA Territory</span>
                  </label>

                  <label htmlFor="chk-doac" className="flex items-center gap-2.5 p-2 rounded bg-slate-900 border border-slate-800 cursor-pointer">
                    <input
                      id="chk-doac"
                      type="checkbox"
                      checked={onTherapeuticDoac && doacTakenWithin48h}
                      onChange={e => {
                        setOnTherapeuticDoac(e.target.checked);
                        setDoacTakenWithin48h(e.target.checked);
                      }}
                      className="w-4 h-4 rounded text-red-600 accent-red-600"
                    />
                    <span className="text-white">Therapeutic DOAC (Apixaban/Rivaroxaban) within 48h</span>
                  </label>

                  <label htmlFor="chk-trauma" className="flex items-center gap-2.5 p-2 rounded bg-slate-900 border border-slate-800 cursor-pointer">
                    <input
                      id="chk-trauma"
                      type="checkbox"
                      checked={severeHeadTraumaWithin3Months}
                      onChange={e => setSevereHeadTraumaWithin3Months(e.target.checked)}
                      className="w-4 h-4 rounded text-red-600 accent-red-600"
                    />
                    <span className="text-white">Severe Head Trauma or Neurosurgery within 3 Months</span>
                  </label>

                  <label htmlFor="chk-gi-bleed" className="flex items-center gap-2.5 p-2 rounded bg-slate-900 border border-slate-800 cursor-pointer">
                    <input
                      id="chk-gi-bleed"
                      type="checkbox"
                      checked={giMalignancyOrBleedWithin21Days}
                      onChange={e => setGiMalignancyOrBleedWithin21Days(e.target.checked)}
                      className="w-4 h-4 rounded text-red-600 accent-red-600"
                    />
                    <span className="text-white">GI Bleeding or Malignancy within 21 Days</span>
                  </label>

                  <label htmlFor="chk-prior-ich" className="flex items-center gap-2.5 p-2 rounded bg-slate-900 border border-slate-800 cursor-pointer">
                    <input
                      id="chk-prior-ich"
                      type="checkbox"
                      checked={historyOfPriorIch}
                      onChange={e => setHistoryOfPriorIch(e.target.checked)}
                      className="w-4 h-4 rounded text-red-600 accent-red-600"
                    />
                    <span className="text-white">History of Prior Spontaneous Intracranial Hemorrhage</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: NIHSS 11-Item Complete Examination */}
          {activeTab === 'nihss' && (
            <div className="space-y-6">
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
                    <Activity className="w-5 h-5 text-cyan-400" />
                    National Institutes of Health Stroke Scale (NIHSS)
                  </h2>
                  <p className="text-sm text-slate-300">
                    Standardized neurological examination quantifying stroke deficit severity (0 to 42 points).
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-cyan-400">{assessment.totalNihss}</div>
                  <span className="text-xs font-semibold text-slate-400">{assessment.nihssCategory}</span>
                </div>
              </div>

              {/* 11 Items Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                {/* 1a. LOC */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-1.5">
                  <label htmlFor="nihss-loc1a" className="font-bold text-white block">1a. Level of Consciousness</label>
                  <select
                    id="nihss-loc1a"
                    value={nihss.loc1a}
                    onChange={e => setNihss({ ...nihss, loc1a: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200"
                  >
                    <option value={0}>0 - Alert; keenly responsive</option>
                    <option value={1}>1 - Not alert; arousable by minor stimulation</option>
                    <option value={2}>2 - Not alert; requires repeated stimulation</option>
                    <option value={3}>3 - Coma / unarousable / reflexive only</option>
                  </select>
                </div>

                {/* 1b. LOC Questions */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-1.5">
                  <label htmlFor="nihss-loc1b" className="font-bold text-white block">1b. LOC Questions (Month, Age)</label>
                  <select
                    id="nihss-loc1b"
                    value={nihss.loc1b}
                    onChange={e => setNihss({ ...nihss, loc1b: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200"
                  >
                    <option value={0}>0 - Answers both correctly</option>
                    <option value={1}>1 - Answers one correctly</option>
                    <option value={2}>2 - Answers neither correctly / aphasic</option>
                  </select>
                </div>

                {/* 1c. LOC Commands */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-1.5">
                  <label htmlFor="nihss-loc1c" className="font-bold text-white block">1c. LOC Commands (Eyes, Grip)</label>
                  <select
                    id="nihss-loc1c"
                    value={nihss.loc1c}
                    onChange={e => setNihss({ ...nihss, loc1c: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200"
                  >
                    <option value={0}>0 - Performs both tasks correctly</option>
                    <option value={1}>1 - Performs one task correctly</option>
                    <option value={2}>2 - Performs neither task</option>
                  </select>
                </div>

                {/* 2. Best Gaze */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-1.5">
                  <label htmlFor="nihss-gaze2" className="font-bold text-white block">2. Horizontal Gaze</label>
                  <select
                    id="nihss-gaze2"
                    value={nihss.bestGaze2}
                    onChange={e => setNihss({ ...nihss, bestGaze2: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200"
                  >
                    <option value={0}>0 - Normal</option>
                    <option value={1}>1 - Partial gaze palsy (overcome by oculocephalic)</option>
                    <option value={2}>2 - Forced deviation / total gaze paresis</option>
                  </select>
                </div>

                {/* 3. Visual Fields */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-1.5">
                  <label htmlFor="nihss-vis3" className="font-bold text-white block">3. Visual Fields</label>
                  <select
                    id="nihss-vis3"
                    value={nihss.visualFields3}
                    onChange={e => setNihss({ ...nihss, visualFields3: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200"
                  >
                    <option value={0}>0 - No visual loss</option>
                    <option value={1}>1 - Partial hemianopia</option>
                    <option value={2}>2 - Complete hemianopia</option>
                    <option value={3}>3 - Bilateral hemianopia / cortical blindness</option>
                  </select>
                </div>

                {/* 4. Facial Palsy */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-1.5">
                  <label htmlFor="nihss-face4" className="font-bold text-white block">4. Facial Symmetry</label>
                  <select
                    id="nihss-face4"
                    value={nihss.facialPalsy4}
                    onChange={e => setNihss({ ...nihss, facialPalsy4: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200"
                  >
                    <option value={0}>0 - Normal symmetrical movements</option>
                    <option value={1}>1 - Minor paralysis (flattened nasolabial fold)</option>
                    <option value={2}>2 - Partial paralysis (lower face complete)</option>
                    <option value={3}>3 - Complete paralysis (one or both sides)</option>
                  </select>
                </div>

                {/* 5a. Motor Arm Left */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-1.5">
                  <label htmlFor="nihss-arm-l" className="font-bold text-white block">5a. Left Arm Motor Drift (10s)</label>
                  <select
                    id="nihss-arm-l"
                    value={nihss.motorArmLeft5a}
                    onChange={e => setNihss({ ...nihss, motorArmLeft5a: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200"
                  >
                    <option value={0}>0 - No drift for 10 seconds</option>
                    <option value={1}>1 - Drift before 10s; does not hit bed</option>
                    <option value={2}>2 - Falls to bed before 10s; some effort against gravity</option>
                    <option value={3}>3 - No effort against gravity; falls immediately</option>
                    <option value={4}>4 - No movement</option>
                  </select>
                </div>

                {/* 5b. Motor Arm Right */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-1.5">
                  <label htmlFor="nihss-arm-r" className="font-bold text-white block">5b. Right Arm Motor Drift (10s)</label>
                  <select
                    id="nihss-arm-r"
                    value={nihss.motorArmRight5b}
                    onChange={e => setNihss({ ...nihss, motorArmRight5b: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200"
                  >
                    <option value={0}>0 - No drift for 10 seconds</option>
                    <option value={1}>1 - Drift before 10s; does not hit bed</option>
                    <option value={2}>2 - Falls to bed before 10s; some effort against gravity</option>
                    <option value={3}>3 - No effort against gravity; falls immediately</option>
                    <option value={4}>4 - No movement</option>
                  </select>
                </div>

                {/* 6a. Motor Leg Left */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-1.5">
                  <label htmlFor="nihss-leg-l" className="font-bold text-white block">6a. Left Leg Motor Drift (5s)</label>
                  <select
                    id="nihss-leg-l"
                    value={nihss.motorLegLeft6a}
                    onChange={e => setNihss({ ...nihss, motorLegLeft6a: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200"
                  >
                    <option value={0}>0 - No drift for 5 seconds</option>
                    <option value={1}>1 - Drift before 5s; does not hit bed</option>
                    <option value={2}>2 - Falls to bed before 5s; some effort against gravity</option>
                    <option value={3}>3 - No effort against gravity; falls immediately</option>
                    <option value={4}>4 - No movement</option>
                  </select>
                </div>

                {/* 6b. Motor Leg Right */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-1.5">
                  <label htmlFor="nihss-leg-r" className="font-bold text-white block">6b. Right Leg Motor Drift (5s)</label>
                  <select
                    id="nihss-leg-r"
                    value={nihss.motorLegRight6b}
                    onChange={e => setNihss({ ...nihss, motorLegRight6b: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200"
                  >
                    <option value={0}>0 - No drift for 5 seconds</option>
                    <option value={1}>1 - Drift before 5s; does not hit bed</option>
                    <option value={2}>2 - Falls to bed before 5s; some effort against gravity</option>
                    <option value={3}>3 - No effort against gravity; falls immediately</option>
                    <option value={4}>4 - No movement</option>
                  </select>
                </div>

                {/* 7. Limb Ataxia */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-1.5">
                  <label htmlFor="nihss-ataxia7" className="font-bold text-white block">7. Limb Ataxia (Finger/Heel)</label>
                  <select
                    id="nihss-ataxia7"
                    value={nihss.limbAtaxia7}
                    onChange={e => setNihss({ ...nihss, limbAtaxia7: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200"
                  >
                    <option value={0}>0 - Absent (normal or paralyzed)</option>
                    <option value={1}>1 - Present in one limb</option>
                    <option value={2}>2 - Present in two or more limbs</option>
                  </select>
                </div>

                {/* 8. Sensory */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-1.5">
                  <label htmlFor="nihss-sensory8" className="font-bold text-white block">8. Sensory (Pinprick)</label>
                  <select
                    id="nihss-sensory8"
                    value={nihss.sensory8}
                    onChange={e => setNihss({ ...nihss, sensory8: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200"
                  >
                    <option value={0}>0 - Normal; no sensory loss</option>
                    <option value={1}>1 - Mild-to-moderate loss (less sharp/dull)</option>
                    <option value={2}>2 - Severe or total sensory loss</option>
                  </select>
                </div>

                {/* 9. Best Language */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-1.5">
                  <label htmlFor="nihss-lang9" className="font-bold text-white block">9. Best Language (Aphasia)</label>
                  <select
                    id="nihss-lang9"
                    value={nihss.bestLanguage9}
                    onChange={e => setNihss({ ...nihss, bestLanguage9: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200"
                  >
                    <option value={0}>0 - No aphasia; normal fluency</option>
                    <option value={1}>1 - Mild-to-moderate aphasia</option>
                    <option value={2}>2 - Severe aphasia (fragmentary speech)</option>
                    <option value={3}>3 - Mute / global aphasia</option>
                  </select>
                </div>

                {/* 10. Dysarthria */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-1.5">
                  <label htmlFor="nihss-dys10" className="font-bold text-white block">10. Dysarthria (Articulation)</label>
                  <select
                    id="nihss-dys10"
                    value={nihss.dysarthria10}
                    onChange={e => setNihss({ ...nihss, dysarthria10: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200"
                  >
                    <option value={0}>0 - Normal articulation</option>
                    <option value={1}>1 - Mild-to-moderate slurring</option>
                    <option value={2}>2 - Severe dysarthria / anarthric</option>
                  </select>
                </div>

                {/* 11. Extinction */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-1.5">
                  <label htmlFor="nihss-ext11" className="font-bold text-white block">11. Extinction &amp; Inattention (Neglect)</label>
                  <select
                    id="nihss-ext11"
                    value={nihss.extinction11}
                    onChange={e => setNihss({ ...nihss, extinction11: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200"
                  >
                    <option value={0}>0 - No abnormality</option>
                    <option value={1}>1 - Visual, tactile, or auditory extinction in 1 modality</option>
                    <option value={2}>2 - Profound hemi-inattention or extinction in &gt; 1 modality</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ASPECTS CT Neuroimaging Interactive Map */}
          {activeTab === 'aspects' && (
            <div className="space-y-6">
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
                    <Layers className="w-5 h-5 text-indigo-400" />
                    ASPECTS (Alberta Stroke Program Early CT Score)
                  </h2>
                  <p className="text-sm text-slate-300">
                    10-point topographic non-contrast CT assessment of early ischemic changes in the Middle Cerebral Artery (MCA) territory.
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-indigo-400">{assessment.totalAspects} / 10</div>
                  <span className={`text-xs font-semibold ${
                    assessment.totalAspects >= 8 ? 'text-emerald-400' :
                    assessment.totalAspects >= 6 ? 'text-amber-400' : 'text-red-400'
                  }`}>
                    {assessment.aspectsStatus}
                  </span>
                </div>
              </div>

              {/* Interactive 10 Regions Grid */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-white">Select Regions with Early Hypoattenuation / Sulcal Effacement (&minus;1 Point Each):</h3>
                  <button
                    onClick={() => setAffectedAspects([])}
                    className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                  >
                    Clear All (Normal CT: 10/10)
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Subcortical Ganglionic Structures */}
                  <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2.5">
                    <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider block">
                      Subcortical Ganglionic Structures (4 Regions)
                    </span>
                    {(['caudate', 'lentiform', 'internalCapsule', 'insularRibbon'] as AspectsRegion[]).map(r => (
                      <label htmlFor={`aspects-${r}`} key={r} className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800 cursor-pointer hover:bg-slate-900">
                        <span className="text-xs text-white capitalize font-medium">
                          {r.replace(/([A-Z])/g, ' $1')}
                        </span>
                        <input
                          id={`aspects-${r}`}
                          type="checkbox"
                          checked={affectedAspects.includes(r)}
                          onChange={() => toggleAspectsRegion(r)}
                          className="w-4 h-4 rounded text-red-600 accent-red-600"
                        />
                      </label>
                    ))}
                  </div>

                  {/* Cortical MCA Regions */}
                  <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2.5">
                    <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider block">
                      Cortical MCA Cortex (M1 - M6)
                    </span>
                    {(['m1', 'm2', 'm3', 'm4', 'm5', 'm6'] as AspectsRegion[]).map(r => (
                      <label htmlFor={`aspects-${r}`} key={r} className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800 cursor-pointer hover:bg-slate-900">
                        <span className="text-xs text-white font-medium uppercase">
                          {r}: {r === 'm1' ? 'Anterior MCA Cortex' : r === 'm2' ? 'Insular Lateral Cortex' : r === 'm3' ? 'Posterior MCA Cortex' : `Supraganglionic ${r.toUpperCase()}`}
                        </span>
                        <input
                          id={`aspects-${r}`}
                          type="checkbox"
                          checked={affectedAspects.includes(r)}
                          onChange={() => toggleAspectsRegion(r)}
                          className="w-4 h-4 rounded text-red-600 accent-red-600"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                {/* Clinical Implications of Score */}
                <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1">
                  <strong className="text-white">ASPECTS &ge; 6:</strong> Favorable small-to-moderate core infarct volume. Favorable candidate for Endovascular Thrombectomy (EVT) with low risk of futile recanalization.<br />
                  <strong className="text-amber-300">ASPECTS &lt; 6:</strong> Large established core. Higher risk of reperfusion hemorrhagic transformation; requires individualized multidisciplinary decision.
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Thrombolytic & EVT Protocol Engine */}
          {activeTab === 'protocol' && (
            <div className="space-y-6">
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
                  <Syringe className="w-5 h-5 text-emerald-400" />
                  Parenteral Thrombolytic Dosing &amp; EVT Decision Engine
                </h2>
                <p className="text-sm text-slate-300">
                  Weight-based dosing algorithms and randomized trial qualification (AHA/ASA 2021, EXTEND-IA TNK, WAKE-UP, DAWN).
                </p>
              </div>

              {/* Agent Selection */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">Thrombolytic Agent Selection</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPreferredAgent('tenecteplase')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                        preferredAgent === 'tenecteplase'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Tenecteplase (TNK-tPA)
                    </button>
                    <button
                      onClick={() => setPreferredAgent('alteplase')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                        preferredAgent === 'alteplase'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Alteplase (rt-PA)
                    </button>
                  </div>
                </div>

                {/* Eligibility Decision Card */}
                {assessment.thrombolysis.isEligible ? (
                  <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/60 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                      <CheckCircle2 className="w-5 h-5" />
                      Patient is ELIGIBLE for IV Thrombolysis ({assessment.thrombolysis.timeWindow.replace(/_/g, ' ').toUpperCase()})
                    </div>
                    {assessment.thrombolysis.dosing && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs mt-3">
                        <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                          <span className="text-slate-400">Total Dose (Weight: {weightKg} kg)</span>
                          <div className="text-lg font-bold text-emerald-400 mt-0.5">
                            {assessment.thrombolysis.dosing.totalDoseMg} mg
                          </div>
                        </div>
                        <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                          <span className="text-slate-400">IV Push Bolus</span>
                          <div className="text-lg font-bold text-cyan-400 mt-0.5">
                            {assessment.thrombolysis.dosing.bolusDoseMg} mg
                          </div>
                        </div>
                        <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                          <span className="text-slate-400">60-Min Continuous Infusion</span>
                          <div className="text-lg font-bold text-indigo-300 mt-0.5">
                            {assessment.thrombolysis.dosing.infusionDoseMg ? `${assessment.thrombolysis.dosing.infusionDoseMg} mg` : 'None (Single Bolus)'}
                          </div>
                        </div>
                      </div>
                    )}
                    <p className="text-xs text-emerald-200 mt-2 font-medium">
                      {assessment.thrombolysis.dosing?.administrationInstructions}
                    </p>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-800/60 space-y-2">
                    <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                      <XCircle className="w-5 h-5" />
                      IV Thrombolysis is CONTRAINDICATED ({assessment.thrombolysis.contraindications.length} Disqualifying Factors)
                    </div>
                    <ul className="list-disc list-inside text-xs text-rose-200 space-y-1 mt-2">
                      {assessment.thrombolysis.contraindications.map((contra, idx) => (
                        <li key={idx}>{contra}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* EVT Mechanical Thrombectomy Decision Card */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-purple-400" />
                    Endovascular Thrombectomy (EVT) Decision
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded text-xs font-bold border ${
                    assessment.evt.isEligible
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {assessment.evt.isEligible ? 'EVT RECOMMENDED' : 'EVT INELIGIBLE'}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {assessment.evt.rationale}
                </p>
              </div>
            </div>
          )}

          {/* TAB 5: Hemodynamics & Complications */}
          {activeTab === 'guardrails' && (
            <div className="space-y-6">
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
                  <ShieldAlert className="w-5 h-5 text-rose-400" />
                  Post-Reperfusion Hemodynamics &amp; Complication Protocols
                </h2>
                <p className="text-sm text-slate-300">
                  Critical safety boundaries: strict post-lytic BP maintenance, permissive hypertension rules, symptomatic ICH rescue, and orolingual angioedema management.
                </p>
              </div>

              {/* Blood Pressure Protocol Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-emerald-400" />
                    Thrombolysis Blood Pressure Targets
                  </h3>
                  <div className="space-y-1.5 text-slate-300">
                    <p><strong>Pre-Lytic Target:</strong> &lt; 185/110 mmHg. If above, administer IV Nicardipine 5-15 mg/h or Labetalol 10-20 mg IV.</p>
                    <p><strong>Post-Lytic Maintenance:</strong> Maintain strictly <strong>&lt; 180/105 mmHg</strong> for at least 24 hours. Monitor q15min for 2 hours, then q30min for 6 hours, then q1h for 16 hours.</p>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <Activity className="w-4 h-4 text-amber-400" />
                    Permissive Hypertension (Non-Thrombolysis)
                  </h3>
                  <div className="space-y-1.5 text-slate-300">
                    <p>In acute ischemic stroke patients who do NOT receive thrombolysis or EVT, maintain <strong>permissive hypertension up to 220/120 mmHg</strong>.</p>
                    <p>Permits collateral cerebral blood flow through leptomeningeal anastomoses to the ischemic penumbra. Do not treat unless &gt; 220/120 mmHg (then lower MAP by only 15% in 24 hours).</p>
                  </div>
                </div>
              </div>

              {/* Complications Alerts */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white">Emergency Post-Thrombolysis Complication Protocols:</h3>
                {assessment.complicationsToMonitor.map((comp, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      {comp.split(':')[0]}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {comp.split(':')[1]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
