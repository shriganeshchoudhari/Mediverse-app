'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Stethoscope,
  Activity,
  Flame,
  Clock,
  Layers,
  RotateCcw,
} from 'lucide-react';
import {
  AirwayAnatomyExam,
  StopBangQuestionnaire,
  DasAlgorithmState,
  MallampatiClass,
  UlbtClass,
  evaluateDifficultAirway,
  DIFFICULT_AIRWAY_PRESETS,
} from '../../.gemini/skills/DifficultAirwayEngine';

export default function DifficultAirwaySimulator() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('NORMAL_AIRWAY_ROUTINE');

  const [anatomy, setAnatomy] = useState<AirwayAnatomyExam>(
    DIFFICULT_AIRWAY_PRESETS[0].anatomy
  );

  const [stopBang, setStopBang] = useState<StopBangQuestionnaire>(
    DIFFICULT_AIRWAY_PRESETS[0].stopBang
  );

  const [dasState, setDasState] = useState<DasAlgorithmState>(
    DIFFICULT_AIRWAY_PRESETS[0].dasState
  );

  const [activeTab, setActiveTab] = useState<'assessment' | 'stopbang' | 'das_algorithm' | 'ati_protocol'>('assessment');

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (dasState.planDDeclared || dasState.currentPlan === 'PLAN_D_CICO') {
      interval = setInterval(() => {
        setDasState((prev) => ({
          ...prev,
          cicoTimeElapsedSeconds: Math.min(60, prev.cicoTimeElapsedSeconds + 1),
          currentSpo2Pct: Math.max(65, prev.currentSpo2Pct - 0.5),
        }));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [dasState.planDDeclared, dasState.currentPlan]);

  const evaluation = useMemo(() => {
    return evaluateDifficultAirway(anatomy, stopBang, dasState);
  }, [anatomy, stopBang, dasState]);

  const handleSelectPreset = (presetId: string) => {
    const preset = DIFFICULT_AIRWAY_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setSelectedPresetId(presetId);
    setAnatomy({ ...preset.anatomy });
    setStopBang({ ...preset.stopBang });
    setDasState({ ...preset.dasState });
  };

  const handleResetAlgorithm = () => {
    setDasState({
      currentPlan: 'PLAN_A',
      planAAttempts: 0,
      planBAttempts: 0,
      planCVentilationSuccessful: true,
      planDDeclared: false,
      usedVideoLaryngoscope: false,
      usedBougieOrStylet: false,
      usedSecondGenSad: false,
      sugammadexAdministered: false,
      currentSpo2Pct: 99,
      cicoTimeElapsedSeconds: 0,
    });
  };

  const handleFailPlanA = () => {
    setDasState((prev) => {
      const attempts = prev.planAAttempts + 1;
      const nextPlan = attempts >= 3 ? 'PLAN_B' : 'PLAN_A';
      return {
        ...prev,
        planAAttempts: attempts,
        currentPlan: nextPlan,
        currentSpo2Pct: Math.max(88, prev.currentSpo2Pct - 3),
      };
    });
  };

  const handleFailPlanB = () => {
    setDasState((prev) => {
      const attempts = prev.planBAttempts + 1;
      const nextPlan = attempts >= 2 ? 'PLAN_C' : 'PLAN_B';
      return {
        ...prev,
        planBAttempts: attempts,
        currentPlan: nextPlan,
        planCVentilationSuccessful: nextPlan === 'PLAN_C' ? false : prev.planCVentilationSuccessful,
        currentSpo2Pct: Math.max(80, prev.currentSpo2Pct - 4),
      };
    });
  };

  const handleDeclareCico = () => {
    setDasState((prev) => ({
      ...prev,
      currentPlan: 'PLAN_D_CICO',
      planDDeclared: true,
      currentSpo2Pct: 75,
      cicoTimeElapsedSeconds: 0,
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <header className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-md bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                Anesthesiology & Critical Care
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                DAS 2015 Verified
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mt-2 text-white">
              Difficult Airway & Awake Fiberoptic Intubation Workstation
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Bedside Mallampati & Cormack-Lehane scoring, STOP-BANG screening, DAS 2015 Plan A&ndash;D algorithm, and CICO emergency scalpel-bougie cricothyroidotomy protocol.
            </p>
          </div>

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
              {DIFFICULT_AIRWAY_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {evaluation.isCicoActive && (
          <div className="mt-4 p-4 rounded-xl bg-rose-950/80 border-2 border-rose-500 flex flex-col md:flex-row items-center justify-between gap-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-rose-600 rounded-full text-white">
                <Flame className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-rose-400 font-black tracking-wider text-sm uppercase">
                    CANNOT INTUBATE &bull; CANNOT OXYGENATE (CICO) EMERGENCY
                  </span>
                  <span className="px-2 py-0.5 bg-rose-500/30 text-rose-200 text-xs font-mono rounded">
                    PLAN D ACTIVE
                  </span>
                </div>
                <p className="text-rose-200 text-xs mt-1">
                  100% O2 &bull; Call for Help &bull; Perform Laryngeal Handshake &bull; Execute Scalpel-Bougie-Tube Cricothyroidotomy immediately!
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs text-rose-300 font-mono">COUNTDOWN TO HYPOXIC ARREST</div>
                <div className="text-2xl font-black font-mono text-rose-100">
                  {evaluation.cicoCriticalCountdownSec}s
                </div>
              </div>
              <button
                onClick={() => {
                  setDasState((prev) => ({
                    ...prev,
                    currentPlan: 'PLAN_A',
                    planDDeclared: false,
                    currentSpo2Pct: 98,
                    cicoTimeElapsedSeconds: 0,
                  }));
                }}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition"
              >
                Cricothyroidotomy Placed (Resolve)
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
            <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              Primary Airway Strategy
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span
                className={`px-2 py-0.5 text-xs font-bold rounded ${
                  evaluation.primaryStrategy === 'AWAKE_TRACHEAL_INTUBATION'
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : evaluation.primaryStrategy === 'VIDEO_LARYNGOSCOPY_FIRST_LINE'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                {evaluation.primaryStrategy.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
              {evaluation.primaryStrategyRationale}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
            <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              Glottic View & POGO %
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-lg font-bold text-indigo-400">
                {evaluation.cormackLehaneEstimate.replace('_', ' ')}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                POGO: {evaluation.pogoScorePct}%
              </span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  evaluation.pogoScorePct > 60
                    ? 'bg-emerald-500'
                    : evaluation.pogoScorePct > 30
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${evaluation.pogoScorePct}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
            <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              STOP-BANG OSA Score
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-lg font-bold text-white">
                {evaluation.stopBangScore} / 8
              </span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  evaluation.stopBangRisk === 'HIGH'
                    ? 'bg-rose-500/20 text-rose-400'
                    : evaluation.stopBangRisk === 'INTERMEDIATE'
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-emerald-500/20 text-emerald-400'
                }`}
              >
                {evaluation.stopBangRisk} RISK
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Desaturation risk under anesthesia
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                DAS 2015 Status
              </div>
              <span className="text-xs font-mono text-cyan-400">
                SpO2: {dasState.currentSpo2Pct.toFixed(0)}%
              </span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span
                className={`px-2 py-0.5 text-xs font-bold rounded ${
                  evaluation.dasAlgorithmStep === 'PLAN_D_CICO'
                    ? 'bg-rose-500/30 text-rose-300'
                    : evaluation.dasAlgorithmStep === 'PLAN_C'
                    ? 'bg-amber-500/30 text-amber-300'
                    : evaluation.dasAlgorithmStep === 'PLAN_B'
                    ? 'bg-blue-500/30 text-blue-300'
                    : evaluation.dasAlgorithmStep === 'WAKE_PATIENT'
                    ? 'bg-purple-500/30 text-purple-300'
                    : 'bg-emerald-500/30 text-emerald-300'
                }`}
              >
                {evaluation.dasAlgorithmStep.replace(/_/g, ' ')}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1 truncate">
              {evaluation.dasActionPrompt}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        <div className="flex border-b border-slate-800 mb-6 gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('assessment')}
            className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-t-lg transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'assessment'
                ? 'bg-slate-900 text-indigo-400 border-t-2 border-indigo-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            1. Bedside Airway Exam & Predictors
          </button>
          <button
            onClick={() => setActiveTab('stopbang')}
            className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-t-lg transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'stopbang'
                ? 'bg-slate-900 text-indigo-400 border-t-2 border-indigo-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            2. STOP-BANG & Risk Matrices
          </button>
          <button
            onClick={() => setActiveTab('das_algorithm')}
            className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-t-lg transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'das_algorithm'
                ? 'bg-slate-900 text-indigo-400 border-t-2 border-indigo-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            3. DAS 2015 Algorithm & CICO Sim
          </button>
          <button
            onClick={() => setActiveTab('ati_protocol')}
            className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-t-lg transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'ati_protocol'
                ? 'bg-slate-900 text-indigo-400 border-t-2 border-indigo-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            4. Awake Tracheal Intubation (ATI)
          </button>
        </div>

        {activeTab === 'assessment' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4 bg-slate-900/60 border border-slate-800 p-5 rounded-xl">
              <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-indigo-400" />
                Airway Physical Examination & Anthropometrics
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Mallampati Classification
                  </label>
                  <select
                    value={anatomy.mallampati}
                    onChange={(e) =>
                      setAnatomy({ ...anatomy, mallampati: e.target.value as MallampatiClass })
                    }
                    className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2"
                  >
                    <option value="CLASS_I">Class I (Soft palate, fauces, uvula, pillars visible)</option>
                    <option value="CLASS_II">Class II (Soft palate, fauces, uvula visible)</option>
                    <option value="CLASS_III">Class III (Soft palate and base of uvula visible)</option>
                    <option value="CLASS_IV">Class IV (Hard palate only visible)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Upper Lip Bite Test (ULBT)
                  </label>
                  <select
                    value={anatomy.ulbt}
                    onChange={(e) =>
                      setAnatomy({ ...anatomy, ulbt: e.target.value as UlbtClass })
                    }
                    className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2"
                  >
                    <option value="CLASS_1">Class 1 (Lower incisors bite upper lip above vermilion line)</option>
                    <option value="CLASS_2">Class 2 (Lower incisors bite upper lip below vermilion line)</option>
                    <option value="CLASS_3">Class 3 (Lower incisors cannot bite upper lip)</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Thyromental Distance (TMD)</span>
                    <span className={`font-mono font-bold ${anatomy.thyromentalDistanceCm < 6.0 ? 'text-rose-400' : 'text-slate-200'}`}>
                      {anatomy.thyromentalDistanceCm.toFixed(1)} cm
                    </span>
                  </div>
                  <input
                    type="range"
                    min="3.0"
                    max="9.0"
                    step="0.1"
                    value={anatomy.thyromentalDistanceCm}
                    onChange={(e) =>
                      setAnatomy({ ...anatomy, thyromentalDistanceCm: parseFloat(e.target.value) })
                    }
                    className="w-full accent-indigo-500"
                  />
                  <span className="text-[10px] text-slate-400">High risk if &lt; 6.0 cm (receding mandible)</span>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Inter-incisor Gap (Mouth Opening)</span>
                    <span className={`font-mono font-bold ${anatomy.interIncisorGapCm < 3.0 ? 'text-rose-400' : 'text-slate-200'}`}>
                      {anatomy.interIncisorGapCm.toFixed(1)} cm
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="6.0"
                    step="0.1"
                    value={anatomy.interIncisorGapCm}
                    onChange={(e) =>
                      setAnatomy({ ...anatomy, interIncisorGapCm: parseFloat(e.target.value) })
                    }
                    className="w-full accent-indigo-500"
                  />
                  <span className="text-[10px] text-slate-400">High risk if &lt; 3.0 cm (or &lt; 2 finger breadths)</span>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Atlanto-Occipital Extension</span>
                    <span className={`font-mono font-bold ${anatomy.cervicalMobilityDeg < 35 ? 'text-rose-400' : 'text-slate-200'}`}>
                      {anatomy.cervicalMobilityDeg}&deg;
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="60"
                    step="1"
                    value={anatomy.cervicalMobilityDeg}
                    onChange={(e) =>
                      setAnatomy({ ...anatomy, cervicalMobilityDeg: parseInt(e.target.value, 10) })
                    }
                    className="w-full accent-indigo-500"
                  />
                  <span className="text-[10px] text-slate-400">Impaired if &lt; 35&deg; (ankylosing spondylitis / halo)</span>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Neck Circumference</span>
                    <span className={`font-mono font-bold ${anatomy.neckCircumferenceCm > 40 ? 'text-amber-400' : 'text-slate-200'}`}>
                      {anatomy.neckCircumferenceCm} cm
                    </span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="55"
                    step="1"
                    value={anatomy.neckCircumferenceCm}
                    onChange={(e) =>
                      setAnatomy({ ...anatomy, neckCircumferenceCm: parseInt(e.target.value, 10) })
                    }
                    className="w-full accent-indigo-500"
                  />
                  <span className="text-[10px] text-slate-400">Predictor of difficult laryngoscopy if &gt; 40 cm</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800">
                <div className="text-xs font-semibold text-slate-300 mb-2">
                  High-Yield Red Flag Checkboxes
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                  <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-lg border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={anatomy.hasTrismusOrLudwigPhlegmon}
                      onChange={(e) =>
                        setAnatomy({ ...anatomy, hasTrismusOrLudwigPhlegmon: e.target.checked })
                      }
                      className="rounded accent-rose-500"
                    />
                    <span className="text-rose-300 font-medium">Ludwig&apos;s / Severe Trismus</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-lg border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={anatomy.hasStridorOrAirwayTumor}
                      onChange={(e) =>
                        setAnatomy({ ...anatomy, hasStridorOrAirwayTumor: e.target.checked })
                      }
                      className="rounded accent-rose-500"
                    />
                    <span className="text-rose-300 font-medium">Stridor / Airway Tumor</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-lg border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={anatomy.hasCervicalSpineInstability}
                      onChange={(e) =>
                        setAnatomy({ ...anatomy, hasCervicalSpineInstability: e.target.checked })
                      }
                      className="rounded accent-amber-500"
                    />
                    <span className="text-amber-300 font-medium">C-Spine Trauma (MILS)</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-lg border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={anatomy.hasBeard}
                      onChange={(e) => setAnatomy({ ...anatomy, hasBeard: e.target.checked })}
                      className="rounded accent-indigo-500"
                    />
                    <span className="text-slate-300">Prominent Facial Beard</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-lg border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={anatomy.isEdentulous}
                      onChange={(e) => setAnatomy({ ...anatomy, isEdentulous: e.target.checked })}
                      className="rounded accent-indigo-500"
                    />
                    <span className="text-slate-300">Edentulous (No Teeth)</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-300 uppercase">
                    Difficult Intubation Risk
                  </span>
                  <span
                    className={`text-xs font-extrabold px-2 py-0.5 rounded ${
                      evaluation.difficultIntubationRisk === 'CRITICAL'
                        ? 'bg-rose-500/30 text-rose-300 border border-rose-500'
                        : evaluation.difficultIntubationRisk === 'HIGH'
                        ? 'bg-rose-500/20 text-rose-400'
                        : evaluation.difficultIntubationRisk === 'MODERATE'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}
                  >
                    {evaluation.difficultIntubationRisk}
                  </span>
                </div>
                {evaluation.difficultIntubationFactors.length > 0 ? (
                  <ul className="space-y-1 text-xs text-slate-300">
                    {evaluation.difficultIntubationFactors.map((f, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-[11px]">
                        <span className="text-rose-400">&bull;</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-400">No major anatomical predictors identified.</p>
                )}
              </div>

              <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-300 uppercase">
                    Difficult Mask (MOANS)
                  </span>
                  <span
                    className={`text-xs font-extrabold px-2 py-0.5 rounded ${
                      evaluation.difficultMaskVentilationRisk === 'HIGH'
                        ? 'bg-rose-500/20 text-rose-400'
                        : evaluation.difficultMaskVentilationRisk === 'MODERATE'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}
                  >
                    {evaluation.difficultMaskVentilationRisk}
                  </span>
                </div>
                {evaluation.difficultMaskFactors.length > 0 ? (
                  <ul className="space-y-1 text-xs text-slate-300">
                    {evaluation.difficultMaskFactors.map((f, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-[11px]">
                        <span className="text-amber-400">&bull;</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-400">No MOANS criteria triggered.</p>
                )}
              </div>

              <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-300 uppercase">
                    Difficult eFONA (SHORT)
                  </span>
                  <span
                    className={`text-xs font-extrabold px-2 py-0.5 rounded ${
                      evaluation.difficultCricothyroidotomyRisk === 'HIGH'
                        ? 'bg-rose-500/20 text-rose-400'
                        : evaluation.difficultCricothyroidotomyRisk === 'MODERATE'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}
                  >
                    {evaluation.difficultCricothyroidotomyRisk}
                  </span>
                </div>
                {evaluation.difficultCricFactors.length > 0 ? (
                  <ul className="space-y-1 text-xs text-slate-300">
                    {evaluation.difficultCricFactors.map((f, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-[11px]">
                        <span className="text-rose-400">&bull;</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-400">Cricothyroid membrane easily palpable.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stopbang' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 p-5 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-semibold text-slate-200">
                    STOP-BANG Obstructive Sleep Apnea (OSA) Screening
                  </h2>
                  <p className="text-xs text-slate-400">
                    Validated 8-item questionnaire for preoperative OSA stratification and airway collapse risk.
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-indigo-400">
                    {evaluation.stopBangScore} / 8
                  </div>
                  <div className="text-xs font-bold text-slate-300">
                    {evaluation.stopBangRisk} Risk
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  {
                    key: 'snoring',
                    title: 'S: Snoring Loudly',
                    desc: 'Loud enough to be heard through closed doors or partner elbows you',
                  },
                  {
                    key: 'tiredness',
                    title: 'T: Tired / Daytime Fatigue',
                    desc: 'Frequently tired, fatigued, or sleepy during the daytime',
                  },
                  {
                    key: 'observedApnea',
                    title: 'O: Observed Apnea',
                    desc: 'Has anyone observed you stop breathing or gasping in your sleep?',
                  },
                  {
                    key: 'highBloodPressure',
                    title: 'P: Blood Pressure',
                    desc: 'Treated for high blood pressure or taking anti-hypertensive meds',
                  },
                  {
                    key: 'bmiOver35',
                    title: 'B: BMI > 35 kg/m²',
                    desc: 'Morbid obesity causing pharyngeal fat deposition',
                  },
                  {
                    key: 'ageOver50',
                    title: 'A: Age > 50 Years',
                    desc: 'Pharyngeal muscular tone laxity increases with age',
                  },
                  {
                    key: 'neckCircumferenceOver40',
                    title: 'N: Neck Circumference > 40 cm',
                    desc: 'Greater than 16 inches (collar size) causing external compression',
                  },
                  {
                    key: 'genderMale',
                    title: 'G: Gender: Male',
                    desc: 'Male sex exhibits higher anatomical airway collapsibility',
                  },
                ].map((item) => (
                  <label
                    key={item.key}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                      stopBang[item.key as keyof StopBangQuestionnaire]
                        ? 'bg-indigo-950/40 border-indigo-500/60'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={Boolean(stopBang[item.key as keyof StopBangQuestionnaire])}
                      onChange={(e) =>
                        setStopBang({ ...stopBang, [item.key]: e.target.checked })
                      }
                      className="mt-1 rounded accent-indigo-500"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-200">{item.title}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{item.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-4">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                Perioperative OSA Pearls
              </h3>
              <div className="space-y-3 text-xs text-slate-300">
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="font-bold text-indigo-400 mb-1">Ramped Positioning (HELP)</div>
                  <p className="text-[11px] text-slate-400">
                    Align external auditory meatus with the sternal notch horizontally using ramps or troop pillows. Prevents rapid FRC collapse during induction.
                  </p>
                </div>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="font-bold text-indigo-400 mb-1">Pre-Oxygenation with CPAP/PEEP</div>
                  <p className="text-[11px] text-slate-400">
                    Apply 5&ndash;10 cmH2O CPAP during 3 minutes of tidal breathing (or 8 vital capacity breaths) to recruit atelectatic alveoli and prolong safe apnea time.
                  </p>
                </div>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="font-bold text-indigo-400 mb-1">Post-Extubation CPAP</div>
                  <p className="text-[11px] text-slate-400">
                    High risk of airway re-obstruction in PACU. Extubate fully awake, upright (45&deg;), and reinstate patient&apos;s home CPAP immediately.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'das_algorithm' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div
                className={`p-4 rounded-xl border transition ${
                  dasState.currentPlan === 'PLAN_A'
                    ? 'bg-indigo-950/40 border-indigo-500 shadow-lg shadow-indigo-950/50'
                    : 'bg-slate-900/60 border-slate-800 opacity-80'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-indigo-400 uppercase">
                    Plan A: Facemask & ETT
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-300">
                    Attempts: {dasState.planAAttempts}/3
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mb-3">
                  Direct/Video laryngoscopy. Max 3 attempts (+1 by experienced colleague). Optimize position & bougie.
                </p>
                <div className="space-y-2">
                  <button
                    disabled={dasState.currentPlan !== 'PLAN_A'}
                    onClick={handleFailPlanA}
                    className="w-full py-1.5 px-3 bg-rose-600/80 hover:bg-rose-600 disabled:opacity-30 text-white text-xs font-bold rounded-lg transition"
                  >
                    Fail Laryngoscopy Attempt
                  </button>
                  <button
                    disabled={dasState.currentPlan !== 'PLAN_A'}
                    onClick={() => {
                      setDasState((prev) => ({
                        ...prev,
                        currentPlan: 'PLAN_A',
                        currentSpo2Pct: 100,
                      }));
                      alert('Intubation successful! Trachea secured, confirmed with capnography.');
                    }}
                    className="w-full py-1.5 px-3 bg-emerald-600/80 hover:bg-emerald-600 disabled:opacity-30 text-white text-xs font-bold rounded-lg transition"
                  >
                    Intubation Succeeded
                  </button>
                </div>
              </div>

              <div
                className={`p-4 rounded-xl border transition ${
                  dasState.currentPlan === 'PLAN_B'
                    ? 'bg-blue-950/40 border-blue-500 shadow-lg shadow-blue-950/50'
                    : 'bg-slate-900/60 border-slate-800 opacity-80'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-blue-400 uppercase">
                    Plan B: SAD Rescue
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-300">
                    Attempts: {dasState.planBAttempts}/2
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mb-3">
                  Insert 2nd-generation Supraglottic Airway Device (i-gel / ProSeal). Max 2 attempts. Confirm ventilation.
                </p>
                <div className="space-y-2">
                  <button
                    disabled={dasState.currentPlan !== 'PLAN_B'}
                    onClick={handleFailPlanB}
                    className="w-full py-1.5 px-3 bg-rose-600/80 hover:bg-rose-600 disabled:opacity-30 text-white text-xs font-bold rounded-lg transition"
                  >
                    Fail SAD Insertion
                  </button>
                  <button
                    disabled={dasState.currentPlan !== 'PLAN_B'}
                    onClick={() => {
                      alert('Plan B SAD Successful! Oxygenation maintained. Consider waking patient or intubating through SAD.');
                    }}
                    className="w-full py-1.5 px-3 bg-emerald-600/80 hover:bg-emerald-600 disabled:opacity-30 text-white text-xs font-bold rounded-lg transition"
                  >
                    SAD Ventilation Success
                  </button>
                </div>
              </div>

              <div
                className={`p-4 rounded-xl border transition ${
                  dasState.currentPlan === 'PLAN_C'
                    ? 'bg-amber-950/40 border-amber-500 shadow-lg shadow-amber-950/50'
                    : 'bg-slate-900/60 border-slate-800 opacity-80'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-amber-400 uppercase">
                    Plan C: Mask Bailout
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-300">
                    2-Person Mask
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mb-3">
                  Final attempt at oxygenation. 2-person mask with oropharyngeal airway. Reverse relaxant (Sugammadex).
                </p>
                <div className="space-y-2">
                  <button
                    disabled={dasState.currentPlan !== 'PLAN_C'}
                    onClick={() => {
                      setDasState((prev) => ({
                        ...prev,
                        planCVentilationSuccessful: true,
                        sugammadexAdministered: true,
                        currentSpo2Pct: 96,
                      }));
                      alert('Plan C Mask Ventilation Successful! Sugammadex 16 mg/kg given. Patient awakening.');
                    }}
                    className="w-full py-1.5 px-3 bg-emerald-600/80 hover:bg-emerald-600 disabled:opacity-30 text-white text-xs font-bold rounded-lg transition"
                  >
                    Mask Oxygenates (Wake Up)
                  </button>
                  <button
                    disabled={dasState.currentPlan !== 'PLAN_C'}
                    onClick={handleDeclareCico}
                    className="w-full py-1.5 px-3 bg-rose-600 hover:bg-rose-500 disabled:opacity-30 text-white text-xs font-black rounded-lg transition animate-pulse"
                  >
                    DECLARE CICO (Plan D)
                  </button>
                </div>
              </div>

              <div
                className={`p-4 rounded-xl border transition ${
                  dasState.currentPlan === 'PLAN_D_CICO'
                    ? 'bg-rose-950/60 border-rose-500 shadow-lg shadow-rose-950/80'
                    : 'bg-slate-900/60 border-slate-800 opacity-80'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-rose-400 uppercase">
                    Plan D: eFONA CICO
                  </span>
                  <span className="text-xs font-mono font-bold text-rose-300">
                    Emergency
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mb-3">
                  Emergency Front-of-Neck Access. Scalpel-Bougie-Tube 6.0 mm cricothyroidotomy. Do not delay!
                </p>
                <div className="space-y-2">
                  <button
                    onClick={handleDeclareCico}
                    className="w-full py-1.5 px-3 bg-rose-600 hover:bg-rose-500 text-white text-xs font-black rounded-lg transition"
                  >
                    Trigger Emergency eFONA
                  </button>
                  <button
                    onClick={handleResetAlgorithm}
                    className="w-full py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg transition flex items-center justify-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset Algorithm
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl">
              <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
                <Flame className="w-4 h-4 text-rose-400" />
                DAS 2015 Plan D: Scalpel-Bougie-Tube Cricothyroidotomy Sequence
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="font-bold text-rose-400 mb-1">1. Laryngeal Handshake</div>
                  <p className="text-[11px] text-slate-400">
                    Index finger & thumb grasp thyroid lamina, slide down over cricoid cartilage to stabilize the larynx and palpate the cricothyroid membrane depression.
                  </p>
                </div>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="font-bold text-rose-400 mb-1">2. Stab & 90&deg; Rotation</div>
                  <p className="text-[11px] text-slate-400">
                    Transverse stab incision through skin & membrane using #10 scalpel. Rotate blade 90&deg; with sharp cutting edge pointing caudally toward the feet.
                  </p>
                </div>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="font-bold text-rose-400 mb-1">3. Bougie & Rail-Road Tube</div>
                  <p className="text-[11px] text-slate-400">
                    Slide coud&eacute;-tipped bougie (15 Fr) along blade flat into trachea (feel tracheal ring clicks). Rail-road cuffed size 6.0 mm ETT over bougie. Inflate cuff and ventilate.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ati_protocol' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    Awake Tracheal Intubation (ATI / AFIO) 5-Step Protocol
                  </h2>
                  <p className="text-xs text-slate-400">
                    Mandatory gold standard for anticipated simultaneous intubation and mask failure (Ludwig&apos;s angina, severe retrognathia, critical airway stenosis).
                  </p>
                </div>
                <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold rounded-lg">
                  Spontaneous Breathing Maintained
                </span>
              </div>

              <div className="space-y-3 pt-2">
                {[
                  {
                    step: 'Step 1: Anti-sialagogue Preparation',
                    desc: 'Glycopyrrolate 0.2 mg IV given 15-20 min prior to dry secretions. Essential for topical local anesthetic contact and clear fiberoptic lens vision.',
                  },
                  {
                    step: 'Step 2: Upper Airway Topical Anesthesia',
                    desc: 'Co-phenylcaine nasal spray (5% lignocaine + 0.5% phenylephrine) or 4% Lidocaine nebulization (4 mL over 15 min). Maximum safe lidocaine dose: 9 mg/kg.',
                  },
                  {
                    step: 'Step 3: Laryngeal Topicalization (Spray-as-you-go)',
                    desc: 'Advance flexible videoscope (3.8 - 4.2 mm). Spray 2 mL of 2% Lidocaine directly onto vocal cords via working channel; wait 60 seconds before passing into trachea.',
                  },
                  {
                    step: 'Step 4: Cord Abduction Confirmation',
                    desc: 'Verify vocal cord opening during inspiration. Gently advance scope past cords until cartilaginous tracheal rings and carina are visualized.',
                  },
                  {
                    step: 'Step 5: Rail-road Endotracheal Tube',
                    desc: 'Rail-road pre-warmed flexometallic/reinforced ETT (size 6.5 - 7.0 mm) over scope with gentle 90° counter-clockwise rotation to avoid arytenoid cartilage snagging.',
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-start gap-3"
                  >
                    <div className="p-2 bg-indigo-950 rounded-md text-indigo-400 font-mono font-bold text-xs">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-200">{item.step}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-3">
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                  Target-Controlled Infusion (TCI) Sedation
                </h3>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <div className="font-bold text-indigo-400">Remifentanil TCI (Minto)</div>
                    <p className="text-[11px] text-slate-400">
                      Target effect-site concentration 1.0 &ndash; 2.5 ng/mL. Provides potent antitussive and analgesic suppression while maintaining spontaneous respiration.
                    </p>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <div className="font-bold text-indigo-400">Dexmedetomidine Loading</div>
                    <p className="text-[11px] text-slate-400">
                      0.5 &ndash; 1.0 &mu;g/kg over 10 min, followed by 0.2 &ndash; 0.7 &mu;g/kg/h. Pure alpha-2 agonist: minimal respiratory depression and easily rousable.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl">
                <div className="text-xs font-bold text-slate-300 uppercase mb-2">
                  Airway Equipment Kit
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {evaluation.recommendedEquipment.map((eq, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{eq}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

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
