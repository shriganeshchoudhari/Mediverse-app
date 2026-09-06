'use client';

import React, { useState, useMemo } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Zap,
  RotateCcw,
  Sparkles,
  Info,
  Layers,
  ArrowRight,
  Droplets,
  Heart,
  ShieldAlert,
  Flame,
} from 'lucide-react';
import {
  NeuraxialTechnique,
  NeuraxialPatientVitals,
  NeuraxialBlockStatus,
  EpiduralTestDoseEvaluation,
  LastToxicityEvaluation,
  PdphEvaluation,
  DermatomeLevel,
  BromageGrade,
  DERMATOME_ORDER,
  evaluateNeuraxialWorkstation,
  evaluateEpiduralTestDose,
  calculateLastLipidRescue,
  NEURAXIAL_PRESETS,
} from '../../.gemini/skills/NeuraxialAnesthesiaEngine';

export default function NeuraxialAnesthesiaSimulator() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('IDEAL_LABOR_EPIDURAL');

  const [technique, setTechnique] = useState<NeuraxialTechnique>(
    NEURAXIAL_PRESETS[0].technique
  );

  const [patient, setPatient] = useState<NeuraxialPatientVitals>(
    NEURAXIAL_PRESETS[0].patient
  );

  const [block, setBlock] = useState<NeuraxialBlockStatus>(
    NEURAXIAL_PRESETS[0].block
  );

  const [testDose, setTestDose] = useState<EpiduralTestDoseEvaluation>(
    NEURAXIAL_PRESETS[0].testDose
  );

  const [lastState, setLastState] = useState<LastToxicityEvaluation>(
    NEURAXIAL_PRESETS[0].lastState
  );

  const [pdphState, setPdphState] = useState<PdphEvaluation>(
    NEURAXIAL_PRESETS[0].pdphState
  );

  const [activeTab, setActiveTab] = useState<'dermatomes' | 'test_dose' | 'high_spinal' | 'last_rescue' | 'pdph'>('dermatomes');

  // Master Evaluation
  const evaluation = useMemo(() => {
    return evaluateNeuraxialWorkstation(technique, patient, block, testDose, lastState, pdphState);
  }, [technique, patient, block, testDose, lastState, pdphState]);

  // Preset Handler
  const handleSelectPreset = (presetId: string) => {
    const preset = NEURAXIAL_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setSelectedPresetId(presetId);
    setTechnique({ ...preset.technique });
    setPatient({ ...preset.patient });
    setBlock({ ...preset.block });
    setTestDose({ ...preset.testDose });
    setLastState({ ...preset.lastState });
    setPdphState({ ...preset.pdphState });
  };

  // Epidural Blood Patch trigger
  const handlePerformBloodPatch = () => {
    setPdphState((prev) => ({
      ...prev,
      hasPosturalHeadache: false,
      severity: 'NONE',
    }));
    alert(
      'EPIDURAL BLOOD PATCH PERFORMED: 20 mL of aseptic autologous blood injected into epidural space at L3-L4. Dural hole tamponaded! Headache relief achieved in > 90% of patients.'
    );
  };

  // Lipid Rescue trigger
  const handleAdministerLipid = () => {
    setLastState((prev) => ({
      ...prev,
      lipidEmulsionBolusGiven: true,
      lipidEmulsionInfusionStarted: true,
    }));
    setPatient((prev) => ({
      ...prev,
      systolicBpMmHg: 95,
      diastolicBpMmHg: 55,
      heartRateBpm: 92,
      oxygenSaturationPct: 98,
    }));
    alert(
      `20% LIPID EMULSION BOLUS GIVEN (${evaluation.lastEval.recommendedLipidBolusMl} mL IV) & INFUSION STARTED (${evaluation.lastEval.recommendedLipidInfusionMlHr} mL/hr). Lipid sink effect pulling local anesthetic from myocardium!`
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-md bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                Anesthesiology &amp; Obstetrics
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                ASRA &amp; SOAP Protocols
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mt-2 text-white">
              Neuraxial Anesthesia, Spinal/Epidural Level &amp; LAST Rescue Workstation
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Dermatome sensory level mapping, Bromage motor blockade, high spinal Bezold-Jarisch resuscitation, epidural test dose, and ASRA 20% Lipid Emulsion rescue.
            </p>
          </div>

          {/* Preset Selector */}
          <div className="flex items-center gap-2">
            <label htmlFor="preset-select" className="text-xs text-slate-400 font-medium whitespace-nowrap">
              Clinical Preset:
            </label>
            <select
              id="preset-select"
              aria-label="Clinical Preset"
              value={selectedPresetId}
              onChange={(e) => handleSelectPreset(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              {NEURAXIAL_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Emergency High / Total Spinal Alert Banner */}
        {evaluation.highSpinalState !== 'NORMAL' && (
          <div className="mt-4 p-4 rounded-xl bg-rose-950/80 border-2 border-rose-500 flex flex-col md:flex-row items-center justify-between gap-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-rose-600 rounded-full text-white">
                <Flame className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-rose-400 font-black tracking-wider text-sm uppercase">
                    CRITICAL NEURAXIAL EMERGENCY: {evaluation.highSpinalState.replace(/_/g, ' ')}
                  </span>
                  <span className="px-2 py-0.5 bg-rose-500/30 text-rose-200 text-xs font-mono rounded">
                    SENSORY: {block.sensoryDermatomeLevel}
                  </span>
                </div>
                <p className="text-rose-200 text-xs mt-1">
                  Profound sympathectomy &bull; Bradycardia (HR {patient.heartRateBpm}) &bull; Blood Pressure {patient.systolicBpMmHg}/{patient.diastolicBpMmHg} &bull; Execute ABC Resuscitation Sequence!
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setBlock((prev) => ({
                    ...prev,
                    sensoryDermatomeLevel: 'T4',
                    hasDifficultyBreathingOrInabilityToCough: false,
                    hasNumbnessInHandsOrFingers: false,
                    hasPhrenicArrest: false,
                    hasTotalSpinalBrainstemSpread: false,
                  }));
                  setPatient((prev) => ({
                    ...prev,
                    heartRateBpm: 76,
                    systolicBpMmHg: 110,
                    diastolicBpMmHg: 65,
                    respiratoryRateBpm: 15,
                    oxygenSaturationPct: 99,
                  }));
                }}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition"
              >
                Resuscitate &amp; Regress Level
              </button>
            </div>
          </div>
        )}

        {/* Emergency LAST Toxicity Alert Banner */}
        {evaluation.lastEval.isActive && (
          <div className="mt-4 p-4 rounded-xl bg-purple-950/80 border-2 border-purple-500 flex flex-col md:flex-row items-center justify-between gap-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-600 rounded-full text-white">
                <ShieldAlert className="w-6 h-6 animate-spin" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-300 font-black tracking-wider text-sm uppercase">
                    LOCAL ANESTHETIC SYSTEMIC TOXICITY (LAST) ACTIVE
                  </span>
                  <span className="px-2 py-0.5 bg-purple-500/30 text-purple-200 text-xs font-mono rounded">
                    ASRA 20% LIPID PROTOCOL
                  </span>
                </div>
                <p className="text-purple-200 text-xs mt-1">
                  Cardiovascular collapse &bull; Bolus: {evaluation.lastEval.recommendedLipidBolusMl} mL 20% Intralipid &bull; Infusion: {evaluation.lastEval.recommendedLipidInfusionMlHr} mL/hr. Avoid Vasopressin &amp; high-dose Epinephrine!
                </p>
              </div>
            </div>
            <button
              onClick={handleAdministerLipid}
              className="px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-black rounded-lg transition"
            >
              Push 20% Lipid Emulsion Bolus
            </button>
          </div>
        )}

        {/* Scoreboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          {/* Sensory Dermatome Level */}
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
            <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              Sensory Dermatome Level
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-black text-indigo-400 font-mono">
                {block.sensoryDermatomeLevel}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                (Sympathetic: {block.autonomicSympatheticLevel})
              </span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              T4 Nipple (C-Section) &bull; T10 Umbilicus (Labor)
            </div>
          </div>

          {/* Bromage Motor Blockade */}
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
            <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              Modified Bromage Motor Score
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-black text-cyan-400 font-mono">
                Grade {block.motorBlockBromage}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                ({block.motorBlockBromage === 0 ? '0% Nil' : block.motorBlockBromage === 1 ? '33% Partial' : block.motorBlockBromage === 2 ? '66% Almost Complete' : '100% Complete'})
              </span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-cyan-400 transition-all duration-300"
                style={{ width: `${(block.motorBlockBromage / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* Vitals & Mean Arterial Pressure */}
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
            <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              Hemodynamics (MAP)
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-xl font-black text-white">
                {patient.systolicBpMmHg} / {patient.diastolicBpMmHg}
              </span>
              <span className="text-xs font-mono font-bold text-rose-400">
                ({evaluation.meanArterialPressureMmHg} MAP)
              </span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Heart Rate: {patient.heartRateBpm} bpm &bull; SpO2: {patient.oxygenSaturationPct}%
            </div>
          </div>

          {/* Surgical Adequacy Verdict */}
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
            <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              Block Clinical Status
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span
                className={`px-2 py-0.5 text-xs font-extrabold rounded ${
                  evaluation.blockAdequacyForSurgery === 'ADEQUATE_CESAREAN_T4'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : evaluation.blockAdequacyForSurgery === 'ADEQUATE_LABOR_T10'
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : evaluation.blockAdequacyForSurgery === 'DANGEROUSLY_HIGH'
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}
              >
                {evaluation.blockAdequacyForSurgery.replace(/_/g, ' ')}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1 truncate">
              {evaluation.highSpinalState !== 'NORMAL'
                ? evaluation.highSpinalState.replace(/_/g, ' ')
                : 'Sensory level stable for procedure'}
            </div>
          </div>
        </div>
      </header>

      {/* Main Tabs Navigation */}
      <main className="max-w-7xl mx-auto">
        <div className="flex border-b border-slate-800 mb-6 gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('dermatomes')}
            className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-t-lg transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'dermatomes'
                ? 'bg-slate-900 text-indigo-400 border-t-2 border-indigo-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            1. Dermatome Sensory &amp; Bromage Block
          </button>
          <button
            onClick={() => setActiveTab('test_dose')}
            className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-t-lg transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'test_dose'
                ? 'bg-slate-900 text-indigo-400 border-t-2 border-indigo-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            2. Epidural Test Dose Simulator
          </button>
          <button
            onClick={() => setActiveTab('high_spinal')}
            className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-t-lg transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'high_spinal'
                ? 'bg-slate-900 text-indigo-400 border-t-2 border-indigo-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            3. High &amp; Total Spinal Crisis
          </button>
          <button
            onClick={() => setActiveTab('last_rescue')}
            className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-t-lg transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'last_rescue'
                ? 'bg-slate-900 text-indigo-400 border-t-2 border-indigo-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            4. ASRA LAST 20% Lipid Rescue
          </button>
          <button
            onClick={() => setActiveTab('pdph')}
            className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-t-lg transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'pdph'
                ? 'bg-slate-900 text-indigo-400 border-t-2 border-indigo-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Droplets className="w-4 h-4" />
            5. PDPH &amp; Epidural Blood Patch
          </button>
        </div>

        {/* TAB 1: DERMATOMES & BROMAGE */}
        {activeTab === 'dermatomes' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4 bg-slate-900/60 border border-slate-800 p-5 rounded-xl">
              <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                Dermatome Sensory Mapping &amp; Motor Block Assessment
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Sensory Dermatome Selection */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Pinprick Sensory Dermatome Level
                  </label>
                  <select
                    value={block.sensoryDermatomeLevel}
                    onChange={(e) => {
                      const lvl = e.target.value as DermatomeLevel;
                      // Autonomic block is usually 2 segments higher
                      const currIdx = DERMATOME_ORDER.indexOf(lvl);
                      const autoLevel = currIdx > 2 ? DERMATOME_ORDER[currIdx - 2] : 'C2';
                      setBlock({
                        ...block,
                        sensoryDermatomeLevel: lvl,
                        autonomicSympatheticLevel: autoLevel,
                      });
                    }}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2"
                  >
                    {DERMATOME_ORDER.map((d) => (
                      <option key={d} value={d}>
                        {d === 'C2' && 'C2 (Occiput / High Spinal)'}
                        {d === 'C4' && 'C4 (Clavicle / Phrenic Nerve C3-C5)'}
                        {d === 'T4' && 'T4 (Nipple Line / C-Section Target)'}
                        {d === 'T6' && 'T6 (Xiphoid Process)'}
                        {d === 'T10' && 'T10 (Umbilicus / Labor Analgesia Target)'}
                        {d === 'L1' && 'L1 (Inguinal Ligament)'}
                        {d === 'S1' && 'S1 (Lateral Foot / Ankle)'}
                        {!['C2', 'C4', 'T4', 'T6', 'T10', 'L1', 'S1'].includes(d) && d}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Modified Bromage Scale */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Modified Bromage Scale (Motor Block)
                  </label>
                  <select
                    value={block.motorBlockBromage}
                    onChange={(e) =>
                      setBlock({
                        ...block,
                        motorBlockBromage: parseInt(e.target.value, 10) as BromageGrade,
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2"
                  >
                    <option value={0}>Grade 0 (Nil: Full flexion of hips, knees, and ankles - 0%)</option>
                    <option value={1}>Grade 1 (Partial: Just able to flex knees, full ankle movement - 33%)</option>
                    <option value={2}>Grade 2 (Almost Complete: Unable to flex knees, can flex feet/toes - 66%)</option>
                    <option value={3}>Grade 3 (Complete: Complete lower extremity motor paralysis - 100%)</option>
                  </select>
                </div>
              </div>

              {/* Dermatome Strip Visual Guide */}
              <div className="pt-4 border-t border-slate-800">
                <div className="text-xs font-semibold text-slate-300 mb-3">
                  Anatomical Landmarks &amp; Surgical Targets
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <strong className="text-emerald-400 block">T4 (Nipples)</strong>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Target for Cesarean delivery to block peritoneal traction &amp; exteriorized uterus.
                    </p>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <strong className="text-cyan-400 block">T10 (Umbilicus)</strong>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Target for Stage 1 labor uterine contraction analgesia &amp; hip surgery.
                    </p>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <strong className="text-amber-400 block">T1 &ndash; T4 Cardio</strong>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Cardioaccelerator fibers. Block causes profound Bezold-Jarisch bradycardia.
                    </p>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <strong className="text-rose-400 block">C3 &ndash; C5 Phrenic</strong>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Diaphragm innervation. Block results in acute respiratory arrest.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Block Triad Principles Card */}
            <div className="space-y-4">
              <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  The Neuraxial Differential Block Triad
                </h3>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs space-y-2 text-slate-300">
                  <div>
                    <strong className="text-purple-400 block">1. Sympathetic Block (Highest)</strong>
                    <span className="text-[11px] text-slate-400">
                      Small unmyelinated B-fibers blocked 2 &ndash; 4 dermatomes higher than sensory level. Drives peripheral vasodilation and hypotension.
                    </span>
                  </div>
                  <div>
                    <strong className="text-indigo-400 block">2. Sensory Pinprick (Intermediate)</strong>
                    <span className="text-[11px] text-slate-400">
                      Myelinated A-delta and unmyelinated C-fibers. Tested using blunt pinprick or cold alcohol swab.
                    </span>
                  </div>
                  <div>
                    <strong className="text-cyan-400 block">3. Motor Blockade (Lowest)</strong>
                    <span className="text-[11px] text-slate-400">
                      Heavy myelinated A-alpha motor fibers. Blocked ~2 segments lower than sensory pinprick.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: EPIDURAL TEST DOSE */}
        {activeTab === 'test_dose' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-slate-200">
                    Epidural Test Dose Simulator (3 mL 1.5% Lidocaine with 1:200,000 Epinephrine)
                  </h2>
                  <p className="text-xs text-slate-400">
                    Essential safety check to exclude accidental intravascular entry into an epidural vein or subarachnoid puncture.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Heart Rate Change */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Heart Rate Increase (&Delta;HR)</span>
                    <span className={`font-mono font-bold ${testDose.heartRateIncreaseBpm >= 20 ? 'text-rose-400' : 'text-slate-200'}`}>
                      +{testDose.heartRateIncreaseBpm} bpm
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="45"
                    step="1"
                    value={testDose.heartRateIncreaseBpm}
                    onChange={(e) => {
                      const deltaHr = parseInt(e.target.value, 10);
                      setTestDose(
                        evaluateEpiduralTestDose(
                          true,
                          deltaHr,
                          testDose.systolicBpIncreaseMmHg,
                          testDose.hasPerioralTinglingOrTinnitus,
                          testDose.hasRapidMotorWeaknessUnder5Min
                        )
                      );
                    }}
                    className="w-full accent-indigo-500"
                  />
                  <span className="text-[10px] text-slate-400">&ge; 20 bpm increase within 45 sec is positive</span>
                </div>

                {/* Systolic BP Change */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Systolic BP Increase (&Delta;SBP)</span>
                    <span className={`font-mono font-bold ${testDose.systolicBpIncreaseMmHg >= 15 ? 'text-rose-400' : 'text-slate-200'}`}>
                      +{testDose.systolicBpIncreaseMmHg} mmHg
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="40"
                    step="1"
                    value={testDose.systolicBpIncreaseMmHg}
                    onChange={(e) => {
                      const deltaSbp = parseInt(e.target.value, 10);
                      setTestDose(
                        evaluateEpiduralTestDose(
                          true,
                          testDose.heartRateIncreaseBpm,
                          deltaSbp,
                          testDose.hasPerioralTinglingOrTinnitus,
                          testDose.hasRapidMotorWeaknessUnder5Min
                        )
                      );
                    }}
                    className="w-full accent-indigo-500"
                  />
                  <span className="text-[10px] text-slate-400">&ge; 15 mmHg rise is positive</span>
                </div>
              </div>

              {/* Symptoms Checkboxes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                <label className="flex items-center gap-2 p-3 bg-slate-900 rounded-lg border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={testDose.hasPerioralTinglingOrTinnitus}
                    onChange={(e) => {
                      setTestDose(
                        evaluateEpiduralTestDose(
                          true,
                          testDose.heartRateIncreaseBpm,
                          testDose.systolicBpIncreaseMmHg,
                          e.target.checked,
                          testDose.hasRapidMotorWeaknessUnder5Min
                        )
                      );
                    }}
                    className="rounded accent-rose-500"
                  />
                  <div>
                    <strong className="text-slate-200">Perioral Numbness, Tinnitus, or Metallic Taste</strong>
                    <p className="text-[11px] text-slate-400">Direct CNS sign of intravascular local anesthetic entry</p>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-3 bg-slate-900 rounded-lg border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={testDose.hasRapidMotorWeaknessUnder5Min}
                    onChange={(e) => {
                      setTestDose(
                        evaluateEpiduralTestDose(
                          true,
                          testDose.heartRateIncreaseBpm,
                          testDose.systolicBpIncreaseMmHg,
                          testDose.hasPerioralTinglingOrTinnitus,
                          e.target.checked
                        )
                      );
                    }}
                    className="rounded accent-rose-500"
                  />
                  <div>
                    <strong className="text-slate-200">Rapid Motor Weakness (Bromage &ge; 1 within 5 min)</strong>
                    <p className="text-[11px] text-slate-400">Confirms subarachnoid intrathecal catheter migration</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Test Dose Verdict */}
            <div className="space-y-4">
              <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 uppercase">Test Dose Verdict</span>
                  <span
                    className={`text-xs font-black px-2.5 py-0.5 rounded ${
                      testDose.interpretationVerdict === 'NEGATIVE_SAFE'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {testDose.interpretationVerdict.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs text-slate-300">
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {testDose.recommendation}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: HIGH & TOTAL SPINAL */}
        {activeTab === 'high_spinal' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-4">
              <h2 className="text-base font-semibold text-slate-200">
                High &amp; Total Spinal Anesthesia Emergency Resuscitation
              </h2>
              <p className="text-xs text-slate-400">
                Cephalad local anesthetic spread beyond T1 blocks cardioaccelerator fibers and can ascend into cervical and brainstem cisterns.
              </p>

              {/* Resuscitation Checklist */}
              <div className="space-y-2.5 pt-2">
                {[
                  {
                    step: '1. Airway & 100% Oxygenation',
                    desc: 'Immediately deliver 100% FiO2 via non-rebreather or bag-valve-mask. If patient cannot speak above a whisper or loses consciousness, intubate endotracheally without delay.',
                  },
                  {
                    step: '2. Epinephrine for Sympathectomy & Inotropy',
                    desc: 'Administer Epinephrine 10 - 50 mcg IV boluses (or Norepinephrine infusion). Restores arteriolar tone, cardiac inotropy, and coronary perfusion.',
                  },
                  {
                    step: '3. Atropine for Cardioaccelerator Denervation',
                    desc: 'Give Atropine 0.5 - 1.0 mg IV if severe bradycardia (HR < 45 bpm) persists from unopposed vagal tone and the Bezold-Jarisch reflex.',
                  },
                  {
                    step: '4. Left Uterine Displacement (LUD)',
                    desc: 'If patient is pregnant, maintain vigorous manual left uterine displacement (or 15° wedge) to eliminate inferior vena cava aortocaval compression.',
                  },
                  {
                    step: '5. Rapid Intravenous Volume Co-load',
                    desc: 'Infuse 1000 - 1500 mL warm balanced crystalloid to fill the suddenly dilated venous capacitance bed.',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs">
                    <div className="font-bold text-rose-400 mb-0.5">{item.step}</div>
                    <p className="text-[11px] text-slate-400">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bezold-Jarisch Callout */}
            <div className="space-y-4">
              <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  The Bezold-Jarisch Paradox
                </h3>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs text-slate-300">
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Under profound central hypovolemia from venous pooling, the underfilled left ventricle contracts vigorously on an empty chamber. Mechanoreceptors in the inferoposterior LV wall trigger paradoxically intense vagal efferent discharge, causing <strong>severe bradycardia, peripheral vasodilation, and asystole</strong>. Epinephrine and rapid volume infusion are life-saving.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ASRA LAST RESCUE */}
        {activeTab === 'last_rescue' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-slate-200">
                    ASRA 20% Lipid Emulsion Protocol for LAST
                  </h2>
                  <p className="text-xs text-slate-400">
                    Weight-based dosing of 20% Intralipid to create a intravascular &ldquo;lipid sink&rdquo; and overcome bupivacaine-induced Nav1.5 cardiac channel blockade.
                  </p>
                </div>
                <button
                  onClick={handleAdministerLipid}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg transition"
                >
                  Administer 20% Lipid
                </button>
              </div>

              {/* Weight & Dosing Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <div className="text-[11px] text-slate-400 font-bold uppercase">Patient Weight</div>
                  <div className="text-xl font-black text-white font-mono mt-1">
                    {patient.patientWeightKg} kg
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="130"
                    step="1"
                    value={patient.patientWeightKg}
                    onChange={(e) =>
                      setPatient({ ...patient, patientWeightKg: parseInt(e.target.value, 10) })
                    }
                    className="w-full accent-purple-500 mt-2"
                  />
                </div>

                <div className="p-3 bg-purple-950/40 rounded-xl border border-purple-500/50">
                  <div className="text-[11px] text-purple-300 font-bold uppercase">20% Lipid Bolus (1.5 mL/kg)</div>
                  <div className="text-2xl font-black text-purple-200 font-mono mt-1">
                    {evaluation.lastEval.recommendedLipidBolusMl} mL
                  </div>
                  <div className="text-[10px] text-purple-300/80 mt-1">Over 2 &ndash; 3 minutes IV</div>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <div className="text-[11px] text-slate-400 font-bold uppercase">Continuous Infusion</div>
                  <div className="text-2xl font-black text-white font-mono mt-1">
                    {evaluation.lastEval.recommendedLipidInfusionMlHr} mL/hr
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">0.25 mL/kg/min</div>
                </div>
              </div>

              {/* ASRA Contraindicated Drugs Callout */}
              <div className="p-4 bg-rose-950/30 border border-rose-500/40 rounded-xl text-xs space-y-2">
                <div className="font-bold text-rose-300 uppercase flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  ASRA Critical Drug Warnings in LAST
                </div>
                <ul className="space-y-1 text-[11px] text-rose-200">
                  <li>&bull; <strong>AVOID Vasopressin:</strong> Causes severe pulmonary vasoconstriction and reduces resuscitation success.</li>
                  <li>&bull; <strong>AVOID Calcium Channel Blockers &amp; Beta-Blockers:</strong> Compound myocardial depression.</li>
                  <li>&bull; <strong>REDUCE Epinephrine:</strong> Use low doses (&lt; 1 mcg/kg boluses, e.g. 10&ndash;20 mcg) to avoid impairing lipid resuscitation.</li>
                  <li>&bull; <strong>Avoid large Propofol doses:</strong> Depresses cardiac function further; use Midazolam for seizure termination.</li>
                </ul>
              </div>
            </div>

            {/* LAST Toxicity Stages */}
            <div className="space-y-4">
              <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Clinical Stages of LAST
                </h3>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <strong className="text-amber-400">1. Premonitory CNS Symptoms:</strong>
                    <p className="text-[11px] text-slate-400">Metallic taste, circumoral numbness, tinnitus, lightheadedness, visual disturbances.</p>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <strong className="text-rose-400">2. CNS Excitation / Seizures:</strong>
                    <p className="text-[11px] text-slate-400">Tonic-clonic seizures, coma, respiratory depression, metabolic acidosis.</p>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <strong className="text-purple-400">3. Cardiovascular Collapse:</strong>
                    <p className="text-[11px] text-slate-400">PR/QRS prolongation, ventricular arrhythmias, profound myocardial depression, asystole.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: PDPH & BLOOD PATCH */}
        {activeTab === 'pdph' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-slate-200">
                    Post-Dural Puncture Headache (PDPH) &amp; Epidural Blood Patch
                  </h2>
                  <p className="text-xs text-slate-400">
                    Persistent CSF leak through dural hole leads to intracranial hypotension and gravitational traction on pain-sensitive meninges upon standing.
                  </p>
                </div>
                {pdphState.epiduralBloodPatchIndicated && (
                  <button
                    onClick={handlePerformBloodPatch}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5"
                  >
                    <Droplets className="w-3.5 h-3.5" />
                    Perform Epidural Blood Patch
                  </button>
                )}
              </div>

              {/* PDPH Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                  <strong className="text-cyan-400">Classic Postural Presentation</strong>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Severe fronto-occipital throbbing headache that develops within 15 minutes of standing or sitting upright, and is substantially relieved by lying flat supine.
                  </p>
                </div>
                <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                  <strong className="text-purple-400">Associated Cranial Nerve Signs</strong>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Photophobia, diplopia (CN VI abducens traction), tinnitus, auditory muffling (vestibulocochlear traction), and neck stiffness.
                  </p>
                </div>
              </div>

              {/* Blood Patch Sequence */}
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-slate-300 uppercase">
                  Epidural Blood Patch (EBP) Protocol
                </div>
                <div className="space-y-1.5 text-xs text-slate-300">
                  <p className="text-[11px] text-slate-400">
                    1. Aseptic venipuncture to collect <strong>15 &ndash; 20 mL</strong> of autologous blood under sterile precautions.
                  </p>
                  <p className="text-[11px] text-slate-400">
                    2. Tuohy needle placed into epidural space at or one interspace below the prior dural puncture.
                  </p>
                  <p className="text-[11px] text-slate-400">
                    3. Slow injection of blood until patient feels moderate pressure or fullness in back/buttocks.
                  </p>
                  <p className="text-[11px] text-slate-400">
                    4. Post-procedure bed rest supine for 1 to 2 hours. Provides immediate relief in &gt; 85% of cases.
                  </p>
                </div>
              </div>
            </div>

            {/* PDPH Summary Card */}
            <div className="space-y-4">
              <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  PDPH Risk Predictors
                </h3>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs text-slate-300 space-y-1">
                  <div>&bull; <strong>Needle Tip:</strong> Cutting Quincke needle &gt;&gt; Pencil-point Whitacre/Sprotte.</div>
                  <div>&bull; <strong>Gauge:</strong> 17G/18G Tuohy wet tap (~70% PDPH risk) vs 25G/27G spinal (~1%).</div>
                  <div>&bull; <strong>Demographics:</strong> Young age (20&ndash;40), female sex, obstetric laboring population.</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Clinical Alerts Box */}
        {evaluation.clinicalAlerts.length > 0 && (
          <div className="mt-6 p-4 rounded-xl bg-amber-950/30 border border-amber-500/40">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase mb-2">
              <AlertTriangle className="w-4 h-4" />
              Active Clinical Safety Alerts
            </div>
            <ul className="space-y-1 text-xs text-amber-200">
              {evaluation.clinicalAlerts.map((alert, i) => (
                <li key={i} className="flex items-start gap-1.5 text-[11px]">
                  <span>&bull;</span>
                  <span>{alert}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}
