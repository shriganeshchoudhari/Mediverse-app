'use client';

import React, { useState, useMemo } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Droplets,
  Flame,
  Heart,
  Info,
  Layers,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Zap,
  TrendingUp,
  Stethoscope,
  Radio,
  Compass,
} from 'lucide-react';
import {
  PePatientHemodynamics,
  PePatientDemographicsAndHistory,
  PeRvStrainAndBiomarkers,
  PeReperfusionPlan,
  PE_PRESETS,
  ReperfusionStrategy,
  evaluatePulmonaryEmbolismWorkstation,
} from '../../.gemini/skills/PulmonaryEmbolismEngine';

export default function PulmonaryEmbolismSimulator() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(
    'MASSIVE_PE_CARDIOGENIC_SHOCK'
  );

  const [hemo, setHemo] = useState<PePatientHemodynamics>(
    PE_PRESETS[0].hemo
  );

  const [history, setHistory] = useState<PePatientDemographicsAndHistory>(
    PE_PRESETS[0].history
  );

  const [strain, setStrain] = useState<PeRvStrainAndBiomarkers>(
    PE_PRESETS[0].strain
  );

  const [plan, setPlan] = useState<PeReperfusionPlan>(
    PE_PRESETS[0].plan
  );

  const [activeTab, setActiveTab] = useState<
    'hemodynamics' | 'rv_strain' | 'systemic_tpa' | 'catheter_interventions' | 'anticoagulation'
  >('hemodynamics');

  // Master Evaluation
  const evaluation = useMemo(() => {
    return evaluatePulmonaryEmbolismWorkstation(hemo, history, strain, plan);
  }, [hemo, history, strain, plan]);

  // Preset Switcher
  const handleSelectPreset = (presetId: string) => {
    const preset = PE_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setSelectedPresetId(presetId);
    setHemo({ ...preset.hemo });
    setHistory({ ...preset.history });
    setStrain({ ...preset.strain });
    setPlan({ ...preset.plan });
  };

  // Push Full-Dose tPA
  const handleAdministerFullDoseTpa = () => {
    setPlan((prev) => ({
      ...prev,
      selectedStrategy: 'SYSTEMIC_THROMBOLYSIS_FULL_DOSE',
      thrombolysisAdministered: true,
    }));
    setHemo((prev) => ({
      ...prev,
      systolicBpMmHg: Math.max(98, prev.systolicBpMmHg + 24),
      diastolicBpMmHg: Math.max(62, prev.diastolicBpMmHg + 14),
      requiresVasopressors: false,
    }));
    setStrain((prev) => ({
      ...prev,
      rvToLvDiameterRatio: Math.max(0.9, prev.rvToLvDiameterRatio - 0.4),
      tapseMm: Math.min(18, prev.tapseMm + 5),
    }));
    alert(
      'SYSTEMIC THROMBOLYSIS INITIATED: Alteplase 100 mg IV infusion running over 2 hours. Discontinued therapeutic heparin. Right ventricular afterload reducing as pulmonary vascular obstruction lyses.'
    );
  };

  // Deploy EKOS Catheter Thrombolysis
  const handleDeployEkos = () => {
    setPlan((prev) => ({
      ...prev,
      selectedStrategy: 'CATHETER_DIRECTED_THROMBOLYSIS_EKOS',
      thrombolysisAdministered: true,
      catheterPositionedBilateral: true,
    }));
    setStrain((prev) => ({
      ...prev,
      rvToLvDiameterRatio: Math.max(0.85, prev.rvToLvDiameterRatio - 0.35),
      tapseMm: Math.min(19, prev.tapseMm + 4),
    }));
    alert(
      'EKOS CATHETER-DIRECTED THROMBOLYSIS DEPLOYED: Bilateral pulmonary artery acoustic infusion catheters activated with 2.2 MHz ultrasound. Low-dose Alteplase running at 1.0 mg/hr/catheter with low systemic bleeding risk.'
    );
  };

  // Mobilize Mechanical Thrombectomy
  const handleMobilizeMechanicalThrombectomy = () => {
    setPlan((prev) => ({
      ...prev,
      selectedStrategy: 'PERCUTANEOUS_MECHANICAL_THROMBECTOMY',
      thrombolysisAdministered: false,
    }));
    setHemo((prev) => ({
      ...prev,
      systolicBpMmHg: Math.max(95, prev.systolicBpMmHg + 20),
      diastolicBpMmHg: Math.max(60, prev.diastolicBpMmHg + 12),
      requiresVasopressors: false,
    }));
    alert(
      'PERCUTANEOUS MECHANICAL THROMBECTOMY PERFORMED: Inari FlowTriever 24 Fr aspiration deployed. Large saddle and lobar emboli aspirated without thrombolytic exposure, safely circumventing bleeding contraindications.'
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-md bg-rose-500/20 text-rose-400 border border-rose-500/30">
                Interventional Cardiology &amp; Critical Care
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-md bg-sky-500/20 text-sky-400 border border-sky-500/30">
                ESC &amp; AHA Guidelines
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mt-2 text-white">
              Pulmonary Embolism Severity, RV Strain &amp; Thrombolysis (CDT) Workstation
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              ESC/AHA risk stratification, sPESI prognostic scoring, echocardiographic RV strain, systemic Alteplase, and EKOS catheter-directed thrombolysis.
            </p>
          </div>

          {/* Preset Selector */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="preset-select"
              className="text-xs text-slate-400 font-medium whitespace-nowrap"
            >
              Clinical Preset:
            </label>
            <select
              id="preset-select"
              aria-label="Clinical Preset"
              value={selectedPresetId}
              onChange={(e) => handleSelectPreset(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:outline-none"
            >
              {PE_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Emergency Massive PE Shock Alert Banner */}
        {evaluation.hasHemodynamicInstability && (
          <div className="mt-4 p-4 rounded-xl bg-rose-950/80 border-2 border-rose-500 flex flex-col md:flex-row items-center justify-between gap-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-rose-600 rounded-full text-white">
                <Flame className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-rose-400 font-black tracking-wider text-sm uppercase">
                    CRITICAL EMERGENCY: HIGH-RISK MASSIVE PULMONARY EMBOLISM
                  </span>
                  <span className="px-2 py-0.5 bg-rose-500/30 text-rose-200 text-xs font-mono rounded">
                    BP {hemo.systolicBpMmHg}/{hemo.diastolicBpMmHg} &bull; RV/LV {strain.rvToLvDiameterRatio}
                  </span>
                </div>
                <p className="text-rose-200 text-xs mt-1">
                  Obstructive cardiogenic shock &bull; Acute cor pulmonale &bull; Administer immediate systemic Alteplase 100 mg IV (or mechanical thrombectomy if contraindicated)!
                </p>
              </div>
            </div>
            <button
              onClick={
                history.hasMajorBleedingContraindicationToTpa
                  ? handleMobilizeMechanicalThrombectomy
                  : handleAdministerFullDoseTpa
              }
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-black rounded-lg transition whitespace-nowrap shadow-lg shadow-rose-900/50"
            >
              {history.hasMajorBleedingContraindicationToTpa
                ? 'Mobilize Inari FlowTriever Thrombectomy'
                : 'Infuse Full-Dose tPA (100 mg / 2h)'}
            </button>
          </div>
        )}

        {/* Absolute Bleeding Contraindication Warning Banner */}
        {history.hasMajorBleedingContraindicationToTpa && (
          <div className="mt-4 p-3.5 rounded-xl bg-purple-950/60 border border-purple-500 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-purple-400 shrink-0" />
              <div className="text-xs text-purple-200">
                <strong className="text-purple-300">Absolute Thrombolytic Contraindication Present:</strong> Recent major surgery, CNS bleed, or active hemorrhage. Systemic tPA is contraindicated. Mechanical aspiration or surgical embolectomy required.
              </div>
            </div>
            <button
              onClick={handleMobilizeMechanicalThrombectomy}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg transition whitespace-nowrap"
            >
              Mechanical Thrombectomy
            </button>
          </div>
        )}

        {/* Scoreboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          {/* Card 1: ESC/AHA Risk Category */}
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
            <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              ESC Risk Stratification
            </div>
            <div className="mt-1">
              <span
                className={`px-2 py-0.5 text-xs font-extrabold rounded inline-block truncate max-w-full ${
                  evaluation.riskCategory === 'HIGH_RISK_MASSIVE'
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : evaluation.riskCategory === 'INTERMEDIATE_HIGH_RISK'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : evaluation.riskCategory === 'INTERMEDIATE_LOW_RISK'
                    ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                {evaluation.riskCategory.replace(/_/g, ' ')}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1 truncate">
              {evaluation.hasHemodynamicInstability
                ? 'Obstructive Shock / Arrest'
                : evaluation.hasRvDysfunction && evaluation.hasMyocardialInjury
                ? 'RV Strain + Biomarkers (+)'
                : 'Hemodynamically Stable'}
            </div>
          </div>

          {/* Card 2: sPESI Prognostic Score */}
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
            <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              sPESI Prognostic Score
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span
                className={`text-2xl font-black font-mono ${
                  evaluation.spesiScore === 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {evaluation.spesiScore} pt{evaluation.spesiScore !== 1 ? 's' : ''}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                ({evaluation.estimated30DayMortalityPct}% 30-day mortality)
              </span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              {evaluation.spesiScore === 0 ? 'Low Risk (Outpatient DOAC candidate)' : 'High Risk (Inpatient care required)'}
            </div>
          </div>

          {/* Card 3: RV Strain Fingerprint */}
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
            <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              RV Strain Fingerprint
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span
                className={`text-2xl font-black font-mono ${
                  strain.rvToLvDiameterRatio >= 0.9 ? 'text-rose-400' : 'text-slate-200'
                }`}
              >
                RV/LV {strain.rvToLvDiameterRatio}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                &bull; TAPSE {strain.tapseMm}mm
              </span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1 truncate">
              {strain.hasMcConnellSign ? "McConnell's (+)" : 'No McConnell'} &bull; {strain.hasParadoxicalSeptalShiftDsign ? 'D-Sign (+)' : 'Normal Septum'}
            </div>
          </div>

          {/* Card 4: Cardiac Biomarkers */}
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
            <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              Cardiac Biomarkers
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span
                className={`text-2xl font-black font-mono ${
                  strain.troponinIngMl >= 0.04 ? 'text-amber-400' : 'text-slate-200'
                }`}
              >
                cTnI {strain.troponinIngMl}
              </span>
              <span className="text-xs text-slate-400 font-mono">ng/mL</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1 truncate">
              BNP: {strain.bnpPgMl} pg/mL {strain.troponinIngMl >= 0.04 ? '(Myocardial Necrosis)' : '(Normal)'}
            </div>
          </div>
        </div>
      </header>

      {/* Main Tabs Navigation */}
      <main className="max-w-7xl mx-auto">
        <div className="flex border-b border-slate-800 mb-6 gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('hemodynamics')}
            className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-t-lg transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'hemodynamics'
                ? 'bg-slate-900 text-rose-400 border-t-2 border-rose-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            1. Hemodynamics &amp; sPESI Scoring
          </button>
          <button
            onClick={() => setActiveTab('rv_strain')}
            className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-t-lg transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'rv_strain'
                ? 'bg-slate-900 text-rose-400 border-t-2 border-rose-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Heart className="w-4 h-4" />
            2. RV Strain &amp; Echocardiography
          </button>
          <button
            onClick={() => setActiveTab('systemic_tpa')}
            className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-t-lg transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'systemic_tpa'
                ? 'bg-slate-900 text-rose-400 border-t-2 border-rose-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-4 h-4" />
            3. Systemic Thrombolysis (Alteplase)
          </button>
          <button
            onClick={() => setActiveTab('catheter_interventions')}
            className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-t-lg transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'catheter_interventions'
                ? 'bg-slate-900 text-rose-400 border-t-2 border-rose-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="w-4 h-4" />
            4. Catheter Interventions (EKOS &amp; FlowTriever)
          </button>
          <button
            onClick={() => setActiveTab('anticoagulation')}
            className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-t-lg transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'anticoagulation'
                ? 'bg-slate-900 text-rose-400 border-t-2 border-rose-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Droplets className="w-4 h-4" />
            5. Anticoagulation &amp; DOAC Pathways
          </button>
        </div>

        {/* TAB 1: HEMODYNAMICS & SPESI SCORING */}
        {activeTab === 'hemodynamics' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4 bg-slate-900/60 border border-slate-800 p-5 rounded-xl">
              <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2">
                <Activity className="w-4 h-4 text-rose-400" />
                Maternal / Patient Hemodynamics &amp; sPESI Parameters
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {/* Systolic BP */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Systolic Blood Pressure</span>
                    <span className={`font-mono font-bold ${hemo.systolicBpMmHg < 90 ? 'text-rose-400' : 'text-slate-200'}`}>
                      {hemo.systolicBpMmHg} mmHg
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="180"
                    step="2"
                    value={hemo.systolicBpMmHg}
                    onChange={(e) =>
                      setHemo({ ...hemo, systolicBpMmHg: parseInt(e.target.value, 10) })
                    }
                    className="w-full accent-rose-500"
                  />
                  <span className="text-[10px] text-slate-400">&lt; 90 mmHg = Shock threshold | &lt; 100 = sPESI</span>
                </div>

                {/* Heart Rate */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Heart Rate</span>
                    <span className={`font-mono font-bold ${hemo.heartRateBpm >= 110 ? 'text-rose-400' : 'text-slate-200'}`}>
                      {hemo.heartRateBpm} bpm
                    </span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="180"
                    step="2"
                    value={hemo.heartRateBpm}
                    onChange={(e) =>
                      setHemo({ ...hemo, heartRateBpm: parseInt(e.target.value, 10) })
                    }
                    className="w-full accent-rose-500"
                  />
                  <span className="text-[10px] text-slate-400">&ge; 110 bpm adds +1 to sPESI</span>
                </div>

                {/* Oxygen Saturation */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Arterial Oxygen Saturation</span>
                    <span className={`font-mono font-bold ${hemo.oxygenSaturationPct < 90 ? 'text-rose-400' : 'text-slate-200'}`}>
                      {hemo.oxygenSaturationPct}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="100"
                    step="1"
                    value={hemo.oxygenSaturationPct}
                    onChange={(e) =>
                      setHemo({ ...hemo, oxygenSaturationPct: parseInt(e.target.value, 10) })
                    }
                    className="w-full accent-cyan-500"
                  />
                  <span className="text-[10px] text-slate-400">&lt; 90% adds +1 to sPESI</span>
                </div>
              </div>

              {/* Patient History Checkboxes */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t border-slate-800 text-xs">
                <label className="flex items-center gap-2 p-3 bg-slate-900 rounded-lg border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={history.ageYears > 80}
                    onChange={(e) =>
                      setHistory({ ...history, ageYears: e.target.checked ? 82 : 60 })
                    }
                    className="rounded accent-rose-500"
                  />
                  <div>
                    <strong className="text-slate-200">Age &gt; 80 Years ({history.ageYears})</strong>
                    <p className="text-[11px] text-slate-400">+1 Point in sPESI</p>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-3 bg-slate-900 rounded-lg border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={history.hasActiveCancer}
                    onChange={(e) =>
                      setHistory({ ...history, hasActiveCancer: e.target.checked })
                    }
                    className="rounded accent-rose-500"
                  />
                  <div>
                    <strong className="text-slate-200">Active Malignancy / Cancer</strong>
                    <p className="text-[11px] text-slate-400">+1 Point in sPESI</p>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-3 bg-slate-900 rounded-lg border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={history.hasChronicCardiopulmonaryDisease}
                    onChange={(e) =>
                      setHistory({
                        ...history,
                        hasChronicCardiopulmonaryDisease: e.target.checked,
                      })
                    }
                    className="rounded accent-rose-500"
                  />
                  <div>
                    <strong className="text-slate-200">Chronic Heart / Lung Disease</strong>
                    <p className="text-[11px] text-slate-400">+1 Point in sPESI</p>
                  </div>
                </label>
              </div>

              {/* Shock & Arrest Toggles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                <label className="flex items-center gap-2 p-3 bg-slate-900 rounded-lg border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hemo.requiresVasopressors}
                    onChange={(e) =>
                      setHemo({ ...hemo, requiresVasopressors: e.target.checked })
                    }
                    className="rounded accent-rose-500"
                  />
                  <div>
                    <strong className="text-rose-400">Vasopressor Infusion Required</strong>
                    <p className="text-[11px] text-slate-400">Defines Obstructive Shock regardless of SBP</p>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-3 bg-slate-900 rounded-lg border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hemo.hasCardiacArrestOrPea}
                    onChange={(e) =>
                      setHemo({ ...hemo, hasCardiacArrestOrPea: e.target.checked })
                    }
                    className="rounded accent-rose-500"
                  />
                  <div>
                    <strong className="text-rose-400">Cardiac Arrest (PEA / Asystole)</strong>
                    <p className="text-[11px] text-slate-400">Requires emergency bolus thrombolysis</p>
                  </div>
                </label>
              </div>
            </div>

            {/* sPESI Risk Breakdown Card */}
            <div className="space-y-4">
              <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  sPESI Score Breakdown ({evaluation.spesiScore} Points)
                </h3>
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between p-2 bg-slate-900 rounded">
                    <span>Age &gt; 80 Years:</span>
                    <span className="font-mono font-bold text-slate-200">{history.ageYears > 80 ? '+1' : '0'}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-900 rounded">
                    <span>History of Cancer:</span>
                    <span className="font-mono font-bold text-slate-200">{history.hasActiveCancer ? '+1' : '0'}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-900 rounded">
                    <span>Chronic Cardiopulmonary:</span>
                    <span className="font-mono font-bold text-slate-200">{history.hasChronicCardiopulmonaryDisease ? '+1' : '0'}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-900 rounded">
                    <span>Heart Rate &ge; 110 bpm:</span>
                    <span className="font-mono font-bold text-slate-200">{hemo.heartRateBpm >= 110 ? '+1' : '0'}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-900 rounded">
                    <span>Systolic BP &lt; 100 mmHg:</span>
                    <span className="font-mono font-bold text-slate-200">{hemo.systolicBpMmHg < 100 ? '+1' : '0'}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-900 rounded">
                    <span>O2 Saturation &lt; 90%:</span>
                    <span className="font-mono font-bold text-slate-200">{hemo.oxygenSaturationPct < 90 ? '+1' : '0'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: RV STRAIN & ECHOCARDIOGRAPHY */}
        {activeTab === 'rv_strain' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4 bg-slate-900/60 border border-slate-800 p-5 rounded-xl">
              <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400" />
                Echocardiographic RV Strain &amp; Myocardial Injury Markers
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* RV/LV Ratio */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">RV to LV End-Diastolic Ratio</span>
                    <span className={`font-mono font-bold ${strain.rvToLvDiameterRatio >= 0.9 ? 'text-rose-400' : 'text-slate-200'}`}>
                      {strain.rvToLvDiameterRatio.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.05"
                    value={strain.rvToLvDiameterRatio}
                    onChange={(e) =>
                      setStrain({ ...strain, rvToLvDiameterRatio: parseFloat(e.target.value) })
                    }
                    className="w-full accent-rose-500"
                  />
                  <span className="text-[10px] text-slate-400">&ge; 0.9 defines acute right ventricular enlargement</span>
                </div>

                {/* TAPSE */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">TAPSE (Tricuspid Annular Excursion)</span>
                    <span className={`font-mono font-bold ${strain.tapseMm < 16 ? 'text-rose-400' : 'text-slate-200'}`}>
                      {strain.tapseMm} mm
                    </span>
                  </div>
                  <input
                    type="range"
                    min="6"
                    max="28"
                    step="1"
                    value={strain.tapseMm}
                    onChange={(e) =>
                      setStrain({ ...strain, tapseMm: parseInt(e.target.value, 10) })
                    }
                    className="w-full accent-rose-500"
                  />
                  <span className="text-[10px] text-slate-400">&lt; 16 mm denotes severe RV systolic impairment</span>
                </div>
              </div>

              {/* Biomarkers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Cardiac Troponin I (cTnI)</span>
                    <span className={`font-mono font-bold ${strain.troponinIngMl >= 0.04 ? 'text-amber-400' : 'text-slate-200'}`}>
                      {strain.troponinIngMl} ng/mL
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.01"
                    max="1.50"
                    step="0.02"
                    value={strain.troponinIngMl}
                    onChange={(e) =>
                      setStrain({ ...strain, troponinIngMl: parseFloat(e.target.value) })
                    }
                    className="w-full accent-amber-500"
                  />
                  <span className="text-[10px] text-slate-400">&ge; 0.04 ng/mL indicates RV micro-infarction</span>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">B-Type Natriuretic Peptide (BNP)</span>
                    <span className={`font-mono font-bold ${strain.bnpPgMl >= 100 ? 'text-amber-400' : 'text-slate-200'}`}>
                      {strain.bnpPgMl} pg/mL
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="1500"
                    step="20"
                    value={strain.bnpPgMl}
                    onChange={(e) =>
                      setStrain({ ...strain, bnpPgMl: parseInt(e.target.value, 10) })
                    }
                    className="w-full accent-amber-500"
                  />
                  <span className="text-[10px] text-slate-400">&ge; 100 pg/mL indicates severe RV wall stress</span>
                </div>
              </div>

              {/* Echo Signs Checkboxes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4 border-t border-slate-800 text-xs">
                <label className="flex items-center gap-2 p-3 bg-slate-900 rounded-lg border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={strain.hasMcConnellSign}
                    onChange={(e) =>
                      setStrain({ ...strain, hasMcConnellSign: e.target.checked })
                    }
                    className="rounded accent-rose-500"
                  />
                  <div>
                    <strong className="text-slate-200">McConnell's Sign</strong>
                    <p className="text-[11px] text-slate-400">Mid-free wall akinesia with preserved apical contractility</p>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-3 bg-slate-900 rounded-lg border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={strain.hasParadoxicalSeptalShiftDsign}
                    onChange={(e) =>
                      setStrain({
                        ...strain,
                        hasParadoxicalSeptalShiftDsign: e.target.checked,
                      })
                    }
                    className="rounded accent-rose-500"
                  />
                  <div>
                    <strong className="text-slate-200">Septal D-Sign (Flattening)</strong>
                    <p className="text-[11px] text-slate-400">Interventricular septal shift compressing LV diastolic filling</p>
                  </div>
                </label>
              </div>
            </div>

            {/* RV Pathophysiology Card */}
            <div className="space-y-4">
              <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  The Spiral of RV Failure
                </h3>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="p-2.5 bg-slate-900 rounded border border-slate-800">
                    <strong className="text-rose-400">1. Afterload Mismatch:</strong>
                    <p className="text-[11px] text-slate-400">Thrombus obstructs pulmonary vascular bed &rarr; Acute elevation in pulmonary vascular resistance (PVR).</p>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded border border-slate-800">
                    <strong className="text-amber-400">2. RV Ischemia:</strong>
                    <p className="text-[11px] text-slate-400">RV dilatation increases wall tension, reducing right coronary artery perfusion gradient during systole.</p>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded border border-slate-800">
                    <strong className="text-purple-400">3. LV Underfilling:</strong>
                    <p className="text-[11px] text-slate-400">Interventricular septal bowing into LV cavity decreases LV preload, triggering catastrophic cardiogenic shock.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SYSTEMIC THROMBOLYSIS */}
        {activeTab === 'systemic_tpa' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4 bg-slate-900/60 border border-slate-800 p-5 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-slate-200">
                    Systemic Thrombolysis (Alteplase tPA Protocols)
                  </h2>
                  <p className="text-xs text-slate-400">
                    Accelerated fibrinolysis converts plasminogen to plasmin, dissolving pulmonary arterial obstruction within hours.
                  </p>
                </div>
                {!history.hasMajorBleedingContraindicationToTpa && (
                  <button
                    onClick={handleAdministerFullDoseTpa}
                    className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    Infuse 100 mg tPA
                  </button>
                )}
              </div>

              {/* Protocol Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div
                  onClick={() =>
                    setPlan({ ...plan, selectedStrategy: 'SYSTEMIC_THROMBOLYSIS_FULL_DOSE' })
                  }
                  className={`p-4 rounded-xl border cursor-pointer transition ${
                    plan.selectedStrategy === 'SYSTEMIC_THROMBOLYSIS_FULL_DOSE'
                      ? 'bg-rose-950/40 border-rose-500 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  <strong className="text-rose-400 block text-xs">Standard Full-Dose Alteplase (100 mg)</strong>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    100 mg IV infusion continuously over 2 hours. Mandatory first-line therapy in massive PE with cardiogenic shock. Intracranial hemorrhage risk ~2&ndash;3%.
                  </p>
                </div>

                <div
                  onClick={() =>
                    setPlan({ ...plan, selectedStrategy: 'SYSTEMIC_THROMBOLYSIS_HALF_DOSE' })
                  }
                  className={`p-4 rounded-xl border cursor-pointer transition ${
                    plan.selectedStrategy === 'SYSTEMIC_THROMBOLYSIS_HALF_DOSE'
                      ? 'bg-amber-950/40 border-amber-500 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  <strong className="text-amber-400 block text-xs">Half-Dose Alteplase (MOPETT 50 mg)</strong>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    10 mg IV bolus over 1 min + 40 mg infusion over 2 hours. Proven in MOPETT trial to reduce pulmonary hypertension with near-zero ICH (&lt; 0.5%).
                  </p>
                </div>
              </div>

              {/* Bleeding Contraindication Toggle */}
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <strong className="text-slate-200 text-sm">
                    Major Bleeding Contraindication to Systemic Thrombolysis
                  </strong>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Recent surgery (&lt; 3 wks), prior hemorrhagic stroke, active bleeding, ischemic stroke within 6 months
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={history.hasMajorBleedingContraindicationToTpa}
                  onChange={(e) =>
                    setHistory({
                      ...history,
                      hasMajorBleedingContraindicationToTpa: e.target.checked,
                    })
                  }
                  className="w-5 h-5 rounded accent-rose-500 cursor-pointer"
                />
              </div>

              {/* Protocol Guidance Box */}
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase">
                  Reperfusion Protocol Guidance
                </span>
                <p className="text-xs text-rose-200 leading-relaxed">
                  {evaluation.tpaDosingProtocol}
                </p>
              </div>
            </div>

            {/* Contraindications Card */}
            <div className="space-y-4">
              <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Thrombolysis Contraindications
                </h3>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="p-2 bg-rose-950/40 rounded border border-rose-900/50">
                    <strong className="text-rose-400">Absolute:</strong>
                    <ul className="list-disc pl-4 text-[11px] text-slate-300 space-y-0.5 mt-1">
                      <li>Prior intracranial hemorrhage</li>
                      <li>Ischemic stroke within 6 months</li>
                      <li>CNS neoplasm or vascular malformation</li>
                      <li>Major trauma or surgery &lt; 3 weeks</li>
                      <li>Active internal bleeding</li>
                    </ul>
                  </div>
                  <div className="p-2 bg-slate-900 rounded border border-slate-800">
                    <strong className="text-amber-400">Relative:</strong>
                    <ul className="list-disc pl-4 text-[11px] text-slate-400 space-y-0.5 mt-1">
                      <li>Oral anticoagulant therapy (INR &gt; 1.7)</li>
                      <li>Traumatic or prolonged CPR (&gt; 10 min)</li>
                      <li>Non-compressible vascular puncture</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CATHETER INTERVENTIONS */}
        {activeTab === 'catheter_interventions' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4 bg-slate-900/60 border border-slate-800 p-5 rounded-xl">
              <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2">
                <Radio className="w-4 h-4 text-sky-400" />
                Catheter-Directed Interventions (EKOS &amp; FlowTriever)
              </h2>
              <p className="text-xs text-slate-400">
                Percutaneous endovascular approaches deliver localized therapy directly into pulmonary artery thrombi, minimizing systemic drug exposure.
              </p>

              {/* Strategy Selector */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div
                  onClick={handleDeployEkos}
                  className={`p-4 rounded-xl border cursor-pointer transition ${
                    plan.selectedStrategy === 'CATHETER_DIRECTED_THROMBOLYSIS_EKOS'
                      ? 'bg-sky-950/40 border-sky-500 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  <strong className="text-sky-400 block text-xs">EKOS Ultrasound-Accelerated Thrombolysis</strong>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    2.2 MHz acoustic ultrasound unbundles fibrin cross-links, enabling rapid penetration of very low-dose Alteplase (0.5&ndash;1.0 mg/hr per PA catheter). Reduces RV/LV ratio rapidly with &lt; 1.5% major bleeding.
                  </p>
                </div>

                <div
                  onClick={handleMobilizeMechanicalThrombectomy}
                  className={`p-4 rounded-xl border cursor-pointer transition ${
                    plan.selectedStrategy === 'PERCUTANEOUS_MECHANICAL_THROMBECTOMY'
                      ? 'bg-purple-950/40 border-purple-500 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  <strong className="text-purple-400 block text-xs">Inari FlowTriever Mechanical Aspiration</strong>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Large-bore 24 Fr catheter mechanically aspirates saddle and lobar thrombi using dual-aspiration syringes. Zero thrombolytic exposure &mdash; drug of choice in surgical or post-op patients.
                  </p>
                </div>
              </div>

              {/* EKOS Details Box */}
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase">
                  Catheter-Directed Procedure Specifics
                </span>
                <p className="text-xs text-sky-300 leading-relaxed">
                  {evaluation.recommendedReperfusionStrategy}
                </p>
              </div>
            </div>

            {/* Trial Evidence Card */}
            <div className="space-y-4">
              <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Landmark Trial Evidence
                </h3>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="p-2.5 bg-slate-900 rounded border border-slate-800">
                    <strong className="text-sky-400">ULTIMA Trial:</strong>
                    <p className="text-[11px] text-slate-400">EKOS + UFH reversed RV/LV ratio significantly faster than UFH alone at 24 hours with zero intracranial hemorrhages.</p>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded border border-slate-800">
                    <strong className="text-purple-400">FLARE Trial (FlowTriever):</strong>
                    <p className="text-[11px] text-slate-400">Demonstrated mean RV/LV ratio reduction of 0.38 at 48 hours without thrombolytics, with 1-night ICU median stay.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: ANTICOAGULATION & OUTPATIENT */}
        {activeTab === 'anticoagulation' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4 bg-slate-900/60 border border-slate-800 p-5 rounded-xl">
              <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2">
                <Droplets className="w-4 h-4 text-emerald-400" />
                Anticoagulation Regimens &amp; Outpatient Pathways
              </h2>

              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase">
                  Anticoagulation Strategy Recommendation
                </span>
                <p className="text-xs text-emerald-300 leading-relaxed">
                  {evaluation.anticoagulationRecommendation}
                </p>
              </div>

              {/* Outpatient DOAC Protocol */}
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase">
                  Direct Oral Anticoagulant (DOAC) Dosing (Low-Risk Patients)
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
                  <div className="p-3 bg-slate-950 rounded border border-slate-800">
                    <strong className="text-indigo-400">Apixaban (Eliquis):</strong>
                    <p className="text-[11px] text-slate-400 mt-1">10 mg PO twice daily for 7 days, then 5 mg PO twice daily. No initial heparin lead-in required.</p>
                  </div>
                  <div className="p-3 bg-slate-950 rounded border border-slate-800">
                    <strong className="text-indigo-400">Rivaroxaban (Xarelto):</strong>
                    <p className="text-[11px] text-slate-400 mt-1">15 mg PO twice daily with food for 21 days, then 20 mg PO once daily. No heparin lead-in required.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hestia Criteria Card */}
            <div className="space-y-4">
              <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Hestia Outpatient Criteria
                </h3>
                <div className="space-y-1.5 text-xs text-slate-400">
                  <p>&bull; Hemodynamically stable (SBP &ge; 100, HR &lt; 110)</p>
                  <p>&bull; No oxygen requirement to maintain SpO2 &ge; 90%</p>
                  <p>&bull; No active bleeding or high bleeding risk</p>
                  <p>&bull; Normal renal function (CrCl &gt; 30 mL/min)</p>
                  <p>&bull; Stable social support and reliable medication access</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Clinical Safety Alerts Box */}
        {evaluation.clinicalSafetyAlerts.length > 0 && (
          <div className="mt-6 p-4 rounded-xl bg-amber-950/30 border border-amber-500/40">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase mb-2">
              <AlertTriangle className="w-4 h-4" />
              Active Clinical Safety Alerts
            </div>
            <ul className="space-y-1 text-xs text-amber-200">
              {evaluation.clinicalSafetyAlerts.map((alert, i) => (
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
