'use client';

import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Droplets,
  Heart,
  Info,
  Layers,
  Scissors,
  ShieldAlert,
  ShieldCheck,
  Stethoscope,
  TrendingDown,
  Zap,
} from 'lucide-react';
import {
  simulateAcuteLimbIschemia,
  ALI_PRESETS,
  ALIPatientParams,
  IschemiaEtiology,
  SensoryDeficit,
  MotorDeficit,
  DopplerSignal,
  RevascularizationStrategy,
} from '../../.gemini/skills/AcuteLimbIschemiaEngine';

export default function AcuteLimbIschemiaSimulator() {
  const [params, setParams] = useState<ALIPatientParams>(ALI_PRESETS.immediatelyThreatenedClassIIb);
  const [activeTab, setActiveTab] = useState<'exam' | 'revasc' | 'compartment' | 'pearls'>('exam');

  const result = simulateAcuteLimbIschemia(params);

  const loadPreset = (key: keyof typeof ALI_PRESETS) => {
    setParams({ ...ALI_PRESETS[key] });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400">
                <Scissors className="w-7 h-7 animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                  Acute Limb Ischemia (ALI) &amp; Revascularization Workstation
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                  Rutherford Classification, The 6 Ps, Fogarty Embolectomy vs CDT, Reperfusion Injury &amp; Compartment Syndrome
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 bg-rose-950/60 border border-rose-600/40 text-rose-300 rounded-full">
              Track B44 • Route #245
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 bg-blue-950/60 border border-blue-600/40 text-blue-300 rounded-full">
              Vascular Surgery &amp; Critical Care
            </span>
          </div>
        </div>

        {/* Presets Bar */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-400 mr-2 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" /> Presets:
          </span>
          <button
            onClick={() => loadPreset('viableClassI')}
            className="px-3 py-1.5 text-xs font-medium bg-slate-900 border border-slate-700 hover:border-emerald-500 hover:bg-emerald-950/20 text-emerald-300 rounded-lg transition"
          >
            Class I Viable (Elective/Urgent)
          </button>
          <button
            onClick={() => loadPreset('immediatelyThreatenedClassIIb')}
            className="px-3 py-1.5 text-xs font-medium bg-slate-900 border border-slate-700 hover:border-blue-500 hover:bg-blue-950/20 text-blue-300 rounded-lg transition"
          >
            Class IIb Immediately Threatened (Fogarty)
          </button>
          <button
            onClick={() => loadPreset('cdtContraindicatedTrap')}
            className="px-3 py-1.5 text-xs font-medium bg-slate-900 border border-slate-700 hover:border-rose-500 hover:bg-rose-950/30 text-rose-400 rounded-lg transition"
          >
            CDT in Class IIb (Lethal Delay Trap)
          </button>
          <button
            onClick={() => loadPreset('lethalReperfusionClassIII')}
            className="px-3 py-1.5 text-xs font-medium bg-slate-900 border border-slate-700 hover:border-red-500 hover:bg-red-950/30 text-red-400 rounded-lg transition"
          >
            Reperfusion of Class III (Washout Catastrophe)
          </button>
          <button
            onClick={() => loadPreset('postReperfusionCompartmentSyndrome')}
            className="px-3 py-1.5 text-xs font-medium bg-slate-900 border border-slate-700 hover:border-amber-500 hover:bg-amber-950/20 text-amber-300 rounded-lg transition"
          >
            Post-Reperfusion Compartment Syndrome
          </button>
        </div>
      </div>

      {/* Hero 4-Panel Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Panel 1: Rutherford Staging */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>RUTHERFORD CLASSIFICATION</span>
              <ShieldAlert className="w-4 h-4 text-rose-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className={`text-xl font-black ${
                result.rutherfordClass === 'CLASS_I_VIABLE'
                  ? 'text-emerald-400'
                  : result.rutherfordClass === 'CLASS_IIA_MARGINALLY_THREATENED'
                  ? 'text-amber-400'
                  : result.rutherfordClass === 'CLASS_IIB_IMMEDIATELY_THREATENED'
                  ? 'text-rose-400'
                  : 'text-purple-400'
              }`}>
                {result.rutherfordClass === 'CLASS_I_VIABLE' ? 'Class I (Viable)' :
                 result.rutherfordClass === 'CLASS_IIA_MARGINALLY_THREATENED' ? 'Class IIa (Marginal)' :
                 result.rutherfordClass === 'CLASS_IIB_IMMEDIATELY_THREATENED' ? 'Class IIb (Threatened)' :
                 'Class III (Irreversible)'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2 line-clamp-2">
              {result.isLimbSalvageable ? 'Limb Salvageable with Prompt Revascularization' : 'Non-Viable: Primary Amputation Mandated'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400">Ischemia Window:</span>
            <span className={`font-bold ${result.goldenHourExceeded ? 'text-rose-400' : 'text-emerald-400'}`}>
              {params.durationOfIschemiaHours}h {result.goldenHourExceeded ? '(>6h Horizon)' : '(<6h Golden Window)'}
            </span>
          </div>
        </div>

        {/* Panel 2: Compartment & Delta Pressure */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>DELTA PERFUSION PRESSURE</span>
              <Layers className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Delta P (DBP - ICP)</span>
                <span className={`text-2xl font-bold ${
                  result.deltaPerfusionPressureMmHg <= 30 ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  {result.deltaPerfusionPressureMmHg} <span className="text-xs font-normal text-slate-400">mmHg</span>
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Compartment ICP</span>
                <span className={`text-2xl font-bold ${params.intracompartmentalPressureMmHg >= 30 ? 'text-rose-400' : 'text-slate-200'}`}>
                  {params.intracompartmentalPressureMmHg} <span className="text-xs font-normal text-slate-400">mmHg</span>
                </span>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                result.compartmentSyndromeRisk === 'ESTABLISHED_COMPARTMENT_SYNDROME'
                  ? 'bg-rose-950/60 border border-rose-600/40 text-rose-300 animate-pulse'
                  : result.compartmentSyndromeRisk === 'HIGH'
                  ? 'bg-amber-950/60 border border-amber-600/40 text-amber-300'
                  : 'bg-emerald-950/60 border border-emerald-600/40 text-emerald-300'
              }`}>
                {result.compartmentSyndromeRisk === 'ESTABLISHED_COMPARTMENT_SYNDROME'
                  ? 'Compartment Syndrome: Fasciotomy Mandated'
                  : result.compartmentSyndromeRisk === 'HIGH'
                  ? 'High Swelling Risk'
                  : 'Normal Perfusion Gradient'}
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400">Fasciotomy Status:</span>
            <span className={`font-bold ${params.fasciotomyPerformed ? 'text-emerald-400' : result.contraindicationFlags.fasciotomyMandatedImmediately ? 'text-rose-400' : 'text-slate-300'}`}>
              {params.fasciotomyPerformed ? '4-Compartment Performed' : result.contraindicationFlags.fasciotomyMandatedImmediately ? 'OMITTED (Critical)' : 'Not Required'}
            </span>
          </div>
        </div>

        {/* Panel 3: Washout & Systemic Toxicity */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>REPERFUSION WASHOUT RISK</span>
              <Activity className="w-4 h-4 text-purple-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Potassium (K+)</span>
                <span className={`text-2xl font-bold ${params.serumPotassiumMeqL >= 6.0 ? 'text-rose-400' : 'text-slate-200'}`}>
                  {params.serumPotassiumMeqL} <span className="text-xs font-normal text-slate-400">mEq/L</span>
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Serum CK</span>
                <span className={`text-2xl font-bold ${params.serumCkUnitsL >= 20000 ? 'text-rose-400' : 'text-slate-200'}`}>
                  {params.serumCkUnitsL} <span className="text-xs font-normal text-slate-400">U/L</span>
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400">Arrest Risk:</span>
            <span className={`font-bold ${
              result.hyperkalemiaCardiacArrestRisk === 'EXTREME_LETHAL_WASHOUT' ? 'text-rose-400' :
              result.hyperkalemiaCardiacArrestRisk === 'MODERATE' ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {result.hyperkalemiaCardiacArrestRisk === 'EXTREME_LETHAL_WASHOUT' ? 'Lethal Hyperkalemic Arrest' :
               result.hyperkalemiaCardiacArrestRisk === 'MODERATE' ? 'Moderate Risk' : 'Low'}
            </span>
          </div>
        </div>

        {/* Panel 4: Surgical Safety & Salvage */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>SURGICAL SAFETY &amp; SALVAGE</span>
              <TrendingDown className="w-4 h-4 text-blue-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Amputation Rate</span>
                <span className={`text-2xl font-bold ${result.predictedAmputationRatePercent >= 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {result.predictedAmputationRatePercent}%
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Safety Score</span>
                <span className={`text-2xl font-bold ${
                  result.revascularizationSafetyScore >= 80 ? 'text-emerald-400' :
                  result.revascularizationSafetyScore >= 50 ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {result.revascularizationSafetyScore}/100
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400">Heparin Status:</span>
            <span className={`font-bold ${params.heparinAdministered ? 'text-emerald-400' : 'text-rose-400'}`}>
              {params.heparinAdministered ? 'Bolus Active' : 'OMITTED'}
            </span>
          </div>
        </div>
      </div>

      {/* Critical Alerts Banner */}
      {result.criticalAlerts.length > 0 && (
        <div className="max-w-7xl mx-auto mb-8 space-y-2">
          {result.criticalAlerts.map((alert, idx) => (
            <div
              key={idx}
              className="p-4 bg-rose-950/80 border border-rose-600/60 rounded-xl flex items-start gap-3 text-rose-200 shadow-lg shadow-rose-950/20"
            >
              <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5 animate-bounce" />
              <div className="text-sm leading-relaxed">{alert}</div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex border-b border-slate-800 space-x-2">
          <button
            onClick={() => setActiveTab('exam')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
              activeTab === 'exam'
                ? 'border-rose-500 text-rose-400 bg-rose-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            1. Physical Exam (6 Ps) &amp; Rutherford Staging
          </button>
          <button
            onClick={() => setActiveTab('revasc')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
              activeTab === 'revasc'
                ? 'border-rose-500 text-rose-400 bg-rose-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            2. Revascularization: Fogarty vs CDT
          </button>
          <button
            onClick={() => setActiveTab('compartment')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
              activeTab === 'compartment'
                ? 'border-rose-500 text-rose-400 bg-rose-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            3. Reperfusion Injury &amp; Compartment Syndrome
          </button>
          <button
            onClick={() => setActiveTab('pearls')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
              activeTab === 'pearls'
                ? 'border-rose-500 text-rose-400 bg-rose-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            4. Clinical Pearls &amp; Guidelines
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="max-w-7xl mx-auto">
        {/* Tab 1: Physical Exam & Rutherford */}
        {activeTab === 'exam' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-5">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-rose-400" /> The 6 Ps &amp; Clinical Parameters
              </h2>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Duration of Ischemia (Hours)</span>
                  <span className={`font-bold ${params.durationOfIschemiaHours > 6 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {params.durationOfIschemiaHours} hrs
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="36"
                  step="0.5"
                  value={params.durationOfIschemiaHours}
                  onChange={e => setParams({ ...params, durationOfIschemiaHours: Number(e.target.value) })}
                  className="w-full accent-rose-500 h-2 bg-slate-800 rounded-lg"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Etiology</label>
                <select
                  value={params.etiology}
                  onChange={e => setParams({ ...params, etiology: e.target.value as IschemiaEtiology })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200"
                >
                  <option value="EMBOLIC_CARDIAC">Embolic (Sudden onset, AFib/Mural thrombus, no prior claudication)</option>
                  <option value="IN_SITU_THROMBOSIS">In Situ Thrombosis (Atherosclerosis, prior claudication, collaterals)</option>
                  <option value="GRAFT_OCCLUSION">Bypass Graft Thrombosis / Occlusion</option>
                  <option value="POPLITEAL_ANEURYSM_THROMBUS">Popliteal Artery Aneurysm Thrombosis</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Paresthesia / Sensory Deficit</label>
                <select
                  value={params.sensoryDeficit}
                  onChange={e => setParams({ ...params, sensoryDeficit: e.target.value as SensoryDeficit })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200"
                >
                  <option value="NONE">None (Class I Viable)</option>
                  <option value="MINIMAL_TOES">Minimal sensory loss limited to toes (Class IIa Marginally Threatened)</option>
                  <option value="EXTENSIVE_FOOT_REST_PAIN">Extensive sensory loss beyond toes / rest pain (Class IIb Threatened)</option>
                  <option value="ANESTHETIC_NUMB">Complete anesthesia / numbness (Class III Irreversible)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Paralysis / Motor Deficit</label>
                <select
                  value={params.motorDeficit}
                  onChange={e => setParams({ ...params, motorDeficit: e.target.value as MotorDeficit })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200"
                >
                  <option value="NONE">None (Normal strength)</option>
                  <option value="MILD_TOE_FLEXION_WEAKNESS">Mild toe flexion / extension weakness (Class IIb Immediately Threatened)</option>
                  <option value="MODERATE_FOOT_DROP">Moderate weakness / Foot drop (Class IIb Immediately Threatened)</option>
                  <option value="COMPLETE_PARALYSIS_RIGOR">Complete paralysis / muscle rigor / woody calf (Class III Irreversible)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Arterial Doppler Signal</label>
                  <select
                    value={params.arterialDoppler}
                    onChange={e => setParams({ ...params, arterialDoppler: e.target.value as DopplerSignal })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200"
                  >
                    <option value="NORMAL_AUDIBLE">Audible (Tri/Biphasic)</option>
                    <option value="MONOPHASIC_DIMINISHED">Audible (Monophasic)</option>
                    <option value="INAUDIBLE">Inaudible (Absent signal)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Venous Doppler Signal</label>
                  <select
                    value={params.venousDoppler}
                    onChange={e => setParams({ ...params, venousDoppler: e.target.value as DopplerSignal })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200"
                  >
                    <option value="NORMAL_AUDIBLE">Audible (Phasic)</option>
                    <option value="MONOPHASIC_DIMINISHED">Continuous / Sluggish</option>
                    <option value="INAUDIBLE">Inaudible (Non-viable sign)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Right: Rutherford Staging Result */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-4">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-rose-400" /> Rutherford Classification Details
              </h2>

              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-lg text-xs space-y-2">
                <span className="font-bold text-rose-400 block text-sm">{result.rutherfordLabel}</span>
                <p className="text-slate-300">
                  SVS/ISCVS Consensus Guidelines state that any degree of motor impairment (even toe flexion weakness) immediately upgrades the patient to <strong>Class IIb</strong>, mandating immediate surgical revascularization within 4-6 hours.
                </p>
              </div>

              <div className="p-4 bg-blue-950/20 border border-blue-600/30 rounded-lg text-xs space-y-2 text-blue-200">
                <span className="font-bold text-blue-400 block">The 6 Ps of Acute Limb Ischemia:</span>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  <li><strong>Pain:</strong> Sudden, severe, constant, distal extremity pain.</li>
                  <li><strong>Pallor:</strong> Cadaveric pale skin, slow capillary refill (&gt; 3s).</li>
                  <li><strong>Poikilothermia:</strong> Inability to regulate temperature; cold to touch.</li>
                  <li><strong>Pulselessness:</strong> Absent pedal (DP/PT) and popliteal pulses.</li>
                  <li><strong>Paresthesia:</strong> Earliest and most sensitive neurological sign of ischemia.</li>
                  <li><strong>Paralysis:</strong> Late sign indicating irreversible deep myonecrosis and nerve infarction.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Revascularization */}
        {activeTab === 'revasc' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-5">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Scissors className="w-5 h-5 text-rose-400" /> Revascularization Strategy
              </h2>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2">Selected Strategy</label>
                <div className="space-y-2">
                  {[
                    { id: 'EMERGENT_FOGARTY_EMBOLECTOMY', label: 'Emergent Open Fogarty Balloon Embolectomy' },
                    { id: 'CATHETER_DIRECTED_THROMBOLYSIS_CDT', label: 'Catheter-Directed Thrombolysis (CDT with tPA)' },
                    { id: 'SURGICAL_BYPASS', label: 'Urgent Surgical Bypass Grafting' },
                    { id: 'PRIMARY_AMPUTATION', label: 'Primary Amputation (Guillotine / Definitive)' },
                    { id: 'CONSERVATIVE_HEPARIN_ONLY', label: 'Conservative Anticoagulation Alone' },
                  ].map((s) => (
                    <label
                      key={s.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer text-xs transition ${
                        params.selectedRevascularization === s.id
                          ? 'bg-rose-950/40 border-rose-500 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="revasc"
                        value={s.id}
                        checked={params.selectedRevascularization === s.id}
                        onChange={() => setParams({ ...params, selectedRevascularization: s.id as RevascularizationStrategy })}
                        className="accent-rose-500"
                      />
                      <span className="font-medium">{s.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-3">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={params.heparinAdministered}
                    onChange={e => setParams({ ...params, heparinAdministered: e.target.checked })}
                    className="accent-emerald-500 rounded"
                  />
                  <span>IV Unfractionated Heparin Bolus (80 units/kg) Administered</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={params.fogartyBalloonOverinflation}
                    onChange={e => setParams({ ...params, fogartyBalloonOverinflation: e.target.checked })}
                    className="accent-rose-500 rounded"
                  />
                  <span>Fogarty Balloon Overinflation (Vessel Shear Hazard)</span>
                </label>
              </div>
            </div>

            {/* Right: Technical Pearls */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-4">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-400" /> The Golden Rules of ALI Revascularization
              </h2>

              <div className="p-4 bg-rose-950/30 border border-rose-600/40 rounded-lg text-xs leading-relaxed space-y-2 text-rose-200">
                <span className="font-bold text-rose-300 block">Why CDT is Contraindicated in Class IIb:</span>
                <p>
                  Catheter-Directed Thrombolysis (CDT) requires 12 to 24 hours of continuous intra-arterial tPA infusion to lyse extensive clot burdens. In an immediately threatened (Class IIb) limb with motor weakness, skeletal muscle undergoes irreversible necrosis after 4 to 6 hours. Delaying revascularization with CDT converts a salvageable limb into an amputation!
                </p>
              </div>

              <div className="p-4 bg-amber-950/30 border border-amber-600/40 rounded-lg text-xs leading-relaxed space-y-2 text-amber-200">
                <span className="font-bold text-amber-300 block">Fogarty Embolectomy Technical Principles:</span>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  <li>Transverse arteriotomy preferred over common femoral artery to avoid stenosis.</li>
                  <li>Pass balloon deflated beyond thrombus, inflate gently with saline until resistance felt.</li>
                  <li>Withdraw with steady traction; overinflation shears intima causing dissection or rupture.</li>
                  <li>Always pass Fogarty into all three runoff branches: anterior tibial, posterior tibial, peroneal.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Reperfusion & Compartment Syndrome */}
        {activeTab === 'compartment' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-5">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-400" /> Compartment Pressures &amp; Reperfusion
              </h2>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Intracompartmental Pressure (ICP)</span>
                  <span className={`font-bold ${params.intracompartmentalPressureMmHg >= 30 ? 'text-rose-400' : 'text-slate-300'}`}>
                    {params.intracompartmentalPressureMmHg} mmHg
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="70"
                  step="1"
                  value={params.intracompartmentalPressureMmHg}
                  onChange={e => setParams({ ...params, intracompartmentalPressureMmHg: Number(e.target.value) })}
                  className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Diastolic Blood Pressure (DBP)</span>
                  <span className="font-bold text-slate-300">{params.diastolicBpMmHg} mmHg</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="120"
                  step="2"
                  value={params.diastolicBpMmHg}
                  onChange={e => setParams({ ...params, diastolicBpMmHg: Number(e.target.value) })}
                  className="w-full accent-blue-500 h-2 bg-slate-800 rounded-lg"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-3">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={params.fasciotomyPerformed}
                    onChange={e => setParams({ ...params, fasciotomyPerformed: e.target.checked })}
                    className="accent-emerald-500 rounded"
                  />
                  <span>Emergent 4-Compartment Fasciotomy Performed</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={params.preReperfusionHydrationActive}
                    onChange={e => setParams({ ...params, preReperfusionHydrationActive: e.target.checked })}
                    className="accent-blue-500 rounded"
                  />
                  <span>Aggressive IV Hydration &amp; Sodium Bicarbonate Alkalinization</span>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Serum Potassium (mEq/L)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={params.serumPotassiumMeqL}
                    onChange={e => setParams({ ...params, serumPotassiumMeqL: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Serum CK (U/L)</label>
                  <input
                    type="number"
                    step="1000"
                    value={params.serumCkUnitsL}
                    onChange={e => setParams({ ...params, serumCkUnitsL: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200"
                  />
                </div>
              </div>
            </div>

            {/* Right: Fasciotomy & Myonecrosis Guidance */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-4">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Scissors className="w-5 h-5 text-amber-400" /> Fasciotomy &amp; Delta Pressure Rules
              </h2>

              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-lg text-xs space-y-2">
                <span className="font-bold text-amber-400 block">The Delta Perfusion Formula:</span>
                <p className="font-mono text-emerald-400 text-sm">
                  Delta P = Diastolic BP - ICP = {params.diastolicBpMmHg} - {params.intracompartmentalPressureMmHg} = {result.deltaPerfusionPressureMmHg} mmHg
                </p>
                <p className="text-slate-300">
                  When Delta P is &lt;= 30 mmHg (or absolute ICP &gt;= 30 mmHg), capillary perfusion gradient collapses, causing severe tissue ischemia. Immediate 4-compartment fasciotomy is mandatory.
                </p>
              </div>

              <div className="p-4 bg-purple-950/20 border border-purple-600/30 rounded-lg text-xs space-y-2 text-purple-200">
                <span className="font-bold text-purple-400 block">The 4 Calf Compartments (Two-Incision Technique):</span>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  <li><strong>Anterolateral Incision:</strong> Decompresses the <em>Anterior</em> (deep peroneal nerve, tibialis anterior) and <em>Lateral</em> (superficial peroneal nerve, peroneus longus/brevis) compartments.</li>
                  <li><strong>Posteromedial Incision:</strong> Decompresses the <em>Superficial Posterior</em> (gastrocnemius, soleus) and <em>Deep Posterior</em> (tibial nerve, posterior tibial vessels, flexor hallucis longus) compartments.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Guidelines & Protocol */}
        {activeTab === 'pearls' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-4">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Step-by-Step Clinical Protocol
              </h2>

              <div className="space-y-2.5">
                {result.stepByStepProtocol.map((step, idx) => (
                  <div key={idx} className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg text-xs text-slate-200">
                    {step}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-4">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" /> The Reperfusion Catastrophe
              </h2>

              <div className="p-4 bg-rose-950/30 border border-rose-600/40 rounded-lg text-xs leading-relaxed space-y-2 text-rose-200">
                <span className="font-bold text-rose-300 block">Why Revascularizing a Dead Leg (Class III) is Lethal:</span>
                <p>
                  When skeletal muscle undergoes necrosis (rigor mortis of the limb, anesthetic foot), dead cell membranes rupture, releasing toxic concentrations of intracellular potassium, free iron, myoglobin, lactate, and inflammatory cytokines.
                </p>
                <p>
                  If blood flow is restored via Fogarty embolectomy, this lethal tidal wave is immediately washed out into systemic circulation, causing:
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  <li>Sudden hyperkalemic cardiac arrest (ventricular fibrillation / asystole within minutes).</li>
                  <li>Refractory lactic acidosis and vasoplegic shock.</li>
                  <li>Acute renal failure due to myoglobin cast nephropathy.</li>
                </ul>
                <p className="font-semibold text-rose-300">
                  Management: Do NOT revascularize. Perform urgent primary amputation.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
