'use client';

import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Brain,
  CheckCircle2,
  Clock,
  Compass,
  Droplets,
  Eye,
  Info,
  Layers,
  Pill,
  ShieldAlert,
  ShieldCheck,
  Stethoscope,
  Syringe,
  TrendingDown,
  Zap,
} from 'lucide-react';
import {
  simulateHeadacheWorkstation,
  HEADACHE_PRESETS,
  HeadachePatientParams,
  OrthostaticPostureResponse,
  MriBrainFindings,
  AbortiveMedicationGiven,
  InterventionStrategy,
} from '../../.gemini/skills/StatusMigrainosusCSFLeakEngine';

export default function StatusMigrainosusCSFLeakSimulator() {
  const [params, setParams] = useState<HeadachePatientParams>(HEADACHE_PRESETS.spontaneousCsfLeakOrthostatic);
  const [activeTab, setActiveTab] = useState<'presentation' | 'imaging' | 'treatment' | 'pearls'>('presentation');

  const result = simulateHeadacheWorkstation(params);

  const loadPreset = (key: keyof typeof HEADACHE_PRESETS) => {
    setParams({ ...HEADACHE_PRESETS[key] });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400">
                <Brain className="w-7 h-7 animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                  Status Migrainosus &amp; Intracranial Hypotension Workstation
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                  Monro-Kellie Doctrine, CSF Volume Depletion, Brain Sagging, DHE-Triptan Vasospasm &amp; Epidural Blood Patch
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 bg-indigo-950/60 border border-indigo-600/40 text-indigo-300 rounded-full">
              Track B45 • Route #246
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 bg-purple-950/60 border border-purple-600/40 text-purple-300 rounded-full">
              Neurology &amp; Neurocritical Care
            </span>
          </div>
        </div>

        {/* Presets Bar */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-400 mr-2 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" /> Presets:
          </span>
          <button
            onClick={() => loadPreset('spontaneousCsfLeakOrthostatic')}
            className="px-3 py-1.5 text-xs font-medium bg-slate-900 border border-slate-700 hover:border-indigo-500 hover:bg-indigo-950/20 text-indigo-300 rounded-lg transition"
          >
            Spontaneous CSF Leak (Orthostatic)
          </button>
          <button
            onClick={() => loadPreset('refractoryMigraineStandard')}
            className="px-3 py-1.5 text-xs font-medium bg-slate-900 border border-slate-700 hover:border-emerald-500 hover:bg-emerald-950/20 text-emerald-300 rounded-lg transition"
          >
            Refractory Migraine (Cocktail)
          </button>
          <button
            onClick={() => loadPreset('dheTriptanVasospasmTrap')}
            className="px-3 py-1.5 text-xs font-medium bg-slate-900 border border-slate-700 hover:border-rose-500 hover:bg-rose-950/30 text-rose-400 rounded-lg transition"
          >
            DHE + Triptan Vasospasm (Trap)
          </button>
          <button
            onClick={() => loadPreset('subduralHygromaBurrHoleTrap')}
            className="px-3 py-1.5 text-xs font-medium bg-slate-900 border border-slate-700 hover:border-red-500 hover:bg-red-950/30 text-red-400 rounded-lg transition"
          >
            Subdural Hygroma Burr Hole (Trap)
          </button>
          <button
            onClick={() => loadPreset('reboundHypertensionPostEbp')}
            className="px-3 py-1.5 text-xs font-medium bg-slate-900 border border-slate-700 hover:border-amber-500 hover:bg-amber-950/20 text-amber-300 rounded-lg transition"
          >
            Rebound High Pressure Post-EBP
          </button>
        </div>
      </div>

      {/* Hero 4-Panel Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Panel 1: Headache Phenotype */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>HEADACHE PHENOTYPE</span>
              <Brain className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className={`text-lg font-black ${
                result.phenotype === 'INTRACRANIAL_HYPOTENSION_CSF_LEAK'
                  ? 'text-indigo-400'
                  : result.phenotype === 'REBOUND_INTRACRANIAL_HYPERTENSION_POST_EBP'
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}>
                {result.phenotype === 'INTRACRANIAL_HYPOTENSION_CSF_LEAK' ? 'CSF Leak (SIH)' :
                 result.phenotype === 'REBOUND_INTRACRANIAL_HYPERTENSION_POST_EBP' ? 'Rebound High ICP' :
                 'Status Migrainosus'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2 line-clamp-2">
              {result.phenotypeLabel}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400">Postural Pattern:</span>
            <span className="font-bold text-white">
              {params.postureResponse === 'WORSE_UPRIGHT_RELIEVED_SUPINE' ? 'Orthostatic (Upright)' :
               params.postureResponse === 'WORSE_SUPINE_RELIEVED_UPRIGHT' ? 'Supine / Morning' : 'Non-Postural'}
            </span>
          </div>
        </div>

        {/* Panel 2: Monro-Kellie CSF Pressure */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>MONRO-KELLIE CSF DYNAMICS</span>
              <Layers className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Opening Pressure</span>
                <span className={`text-2xl font-bold ${
                  params.csfOpeningPressureMmH2O < 60 ? 'text-rose-400' :
                  params.csfOpeningPressureMmH2O > 200 ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {params.csfOpeningPressureMmH2O} <span className="text-xs font-normal text-slate-400">mmH2O</span>
                </span>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                result.monroKellieCompliance === 'BRAIN_SAG_CRANIAL_TRACTION'
                  ? 'bg-rose-950/60 border border-rose-600/40 text-rose-300 animate-pulse'
                  : result.monroKellieCompliance === 'COMPENSATORY_VENOUS_ENGORGEMENT'
                  ? 'bg-indigo-950/60 border border-indigo-600/40 text-indigo-300'
                  : result.monroKellieCompliance === 'REBOUND_HIGH_PRESSURE'
                  ? 'bg-amber-950/60 border border-amber-600/40 text-amber-300'
                  : 'bg-emerald-950/60 border border-emerald-600/40 text-emerald-300'
              }`}>
                {result.monroKellieCompliance === 'BRAIN_SAG_CRANIAL_TRACTION'
                  ? 'Brain Sagging & CN Traction'
                  : result.monroKellieCompliance === 'COMPENSATORY_VENOUS_ENGORGEMENT'
                  ? 'Compensatory Venous Engorgement'
                  : result.monroKellieCompliance === 'REBOUND_HIGH_PRESSURE'
                  ? 'Rebound Intracranial Hypertension'
                  : 'Balanced Monro-Kellie Equilibrium'}
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400">Normal Range:</span>
            <span className="font-bold text-slate-300">100 - 200 mmH2O</span>
          </div>
        </div>

        {/* Panel 3: Brain Sagging & Traction */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>BRAIN SAGGING &amp; TRACTION</span>
              <Eye className="w-4 h-4 text-purple-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Cranial Nerve</span>
                <span className={`text-xl font-bold ${params.cranialNervePalsy !== 'NONE' ? 'text-rose-400' : 'text-slate-200'}`}>
                  {params.cranialNervePalsy === 'CN_VI_DIPLOPIA' ? 'CN VI (Abducens)' :
                   params.cranialNervePalsy === 'CN_VIII_TINNITUS_HYPOACUSIS' ? 'CN VIII (Acoustic)' : 'None intact'}
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-2 line-clamp-2">
              {params.mriBrain.replace(/_/g, ' ')}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400">Blood Patch Status:</span>
            <span className={`font-bold ${params.interventionSelected === 'AUTOLOGOUS_EPIDURAL_BLOOD_PATCH' ? 'text-emerald-400' : 'text-slate-400'}`}>
              {params.interventionSelected === 'AUTOLOGOUS_EPIDURAL_BLOOD_PATCH' ? `${params.bloodPatchVolumeMl} mL Injected` : 'Not Done'}
            </span>
          </div>
        </div>

        {/* Panel 4: Safety & Pain Severity */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>SAFETY &amp; SEVERITY</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Pain Severity</span>
                <span className={`text-2xl font-bold ${result.headacheIntensityScore >= 7 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {result.headacheIntensityScore}/10
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Safety Score</span>
                <span className={`text-2xl font-bold ${
                  result.treatmentSafetyScore >= 80 ? 'text-emerald-400' :
                  result.treatmentSafetyScore >= 50 ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {result.treatmentSafetyScore}/100
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400">Vasospasm Risk:</span>
            <span className={`font-bold ${result.dheTriptanVasospasmHazard ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
              {result.dheTriptanVasospasmHazard ? 'CRITICAL (DHE+Triptan)' : 'Protected'}
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
            onClick={() => setActiveTab('presentation')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
              activeTab === 'presentation'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            1. Clinical Presentation &amp; Posture
          </button>
          <button
            onClick={() => setActiveTab('imaging')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
              activeTab === 'imaging'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            2. Monro-Kellie Dynamics &amp; MRI
          </button>
          <button
            onClick={() => setActiveTab('treatment')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
              activeTab === 'treatment'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            3. Inpatient Cocktail &amp; Blood Patch
          </button>
          <button
            onClick={() => setActiveTab('pearls')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
              activeTab === 'pearls'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            4. Clinical Pearls &amp; Traps
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="max-w-7xl mx-auto">
        {/* Tab 1: Presentation & Posture */}
        {activeTab === 'presentation' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-5">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-indigo-400" /> Postural Headache Characteristics
              </h2>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Attack Duration (Hours)</span>
                  <span className={`font-bold ${params.attackDurationHours >= 72 ? 'text-amber-400' : 'text-slate-300'}`}>
                    {params.attackDurationHours} hrs {params.attackDurationHours >= 72 ? '(Status Migrainosus Criterion)' : ''}
                  </span>
                </div>
                <input aria-label="Attack Duration Hours"
                  type="range"
                  min="12"
                  max="240"
                  step="6"
                  value={params.attackDurationHours}
                  onChange={e => setParams({ ...params, attackDurationHours: Number(e.target.value) })}
                  className="w-full accent-indigo-500 h-2 bg-slate-800 rounded-lg"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Postural Variation</label>
                <select
                  value={params.postureResponse}
                  onChange={e => setParams({ ...params, postureResponse: e.target.value as OrthostaticPostureResponse })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200"
                >
                  <option value="WORSE_UPRIGHT_RELIEVED_SUPINE">Worse Upright / Relieved Supine (Hallmark of CSF Leak / SIH)</option>
                  <option value="WORSE_SUPINE_RELIEVED_UPRIGHT">Worse Supine / Relieved Upright (Rebound High Pressure / ICP elevation)</option>
                  <option value="NO_POSTURAL_VARIATION">No Postural Variation (Typical Migraine / Status Migrainosus)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Cranial Nerve Traction Palsy</label>
                <select
                  value={params.cranialNervePalsy}
                  onChange={e => setParams({ ...params, cranialNervePalsy: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200"
                >
                  <option value="NONE">None (Intact)</option>
                  <option value="CN_VI_DIPLOPIA">CN VI (Abducens) Palsy - Horizontal diplopia (Dorello canal stretch)</option>
                  <option value="CN_VIII_TINNITUS_HYPOACUSIS">CN VIII (Vestibulocochlear) - Tinnitus, autophony, muffled hearing</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={params.triptanTakenWithin24h}
                    onChange={e => setParams({ ...params, triptanTakenWithin24h: e.target.checked })}
                    className="accent-rose-500 rounded"
                  />
                  <span>Triptan taken within the past 24 hours (DHE Vasospasm Contraindication)</span>
                </label>
              </div>
            </div>

            {/* Right: Differential Guide */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-4">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Info className="w-5 h-5 text-indigo-400" /> The Orthostatic Differential
              </h2>

              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-lg text-xs space-y-2">
                <span className="font-bold text-indigo-400 block text-sm">The Classic Diagnostic Trap:</span>
                <p className="text-slate-300">
                  Patients with spontaneous intracranial hypotension (SIH) are frequently misdiagnosed with refractory status migrainosus because both conditions cause severe throbbing headaches with nausea, photophobia, and phonophobia.
                </p>
                <p className="text-slate-300">
                  The pivotal differentiating feature is <strong>orthostatism</strong>: SIH headaches develop or severely intensify within 15-30 minutes of standing and resolve dramatically within 15-30 minutes of lying flat.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Monro-Kellie & MRI */}
        {activeTab === 'imaging' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-5">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-400" /> Monro-Kellie Biophysics
              </h2>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>CSF Opening Pressure (mmH2O)</span>
                  <span className={`font-bold ${params.csfOpeningPressureMmH2O < 60 ? 'text-rose-400' : 'text-slate-300'}`}>
                    {params.csfOpeningPressureMmH2O} mmH2O
                  </span>
                </div>
                <input aria-label="CSF Opening Pressure (mmH2O)"
                  type="range"
                  min="0"
                  max="400"
                  step="5"
                  value={params.csfOpeningPressureMmH2O}
                  onChange={e => setParams({ ...params, csfOpeningPressureMmH2O: Number(e.target.value) })}
                  className="w-full accent-cyan-500 h-2 bg-slate-800 rounded-lg"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">MRI Brain Findings</label>
                <select
                  value={params.mriBrain}
                  onChange={e => setParams({ ...params, mriBrain: e.target.value as MriBrainFindings })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200"
                >
                  <option value="NORMAL">Normal Brain MRI</option>
                  <option value="PACHYMENINGEAL_ENHANCEMENT_BRAIN_SAG">Diffuse Smooth Pachymeningeal Enhancement &amp; Brain Sagging</option>
                  <option value="SUBDURAL_HEMATOMA_HYGROMA">Bilateral Subdural Hygromas / Hematomas</option>
                  <option value="PSEUDO_CHIARI_TONSILLAR_HERNIATION">Pseudo-Chiari I (Cerebellar tonsillar herniation through foramen magnum)</option>
                </select>
              </div>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-4">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Brain className="w-5 h-5 text-cyan-400" /> The Monro-Kellie Doctrine in CSF Depletion
              </h2>

              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-lg text-xs space-y-2">
                <span className="font-bold text-cyan-300 block">V_intracranial = V_brain + V_blood + V_CSF = Constant</span>
                <p className="text-slate-300">
                  When CSF leaks, the volume of CSF plummets. To maintain total intracranial volume, the dural venous plexus engorges with blood, creating diffuse smooth pachymeningeal enhancement (gadolinium pooling) and pituitary hyperemia.
                </p>
                <p className="text-slate-300">
                  Loss of CSF buoyancy causes the brain to sag downward under gravity, stretching pain-sensitive bridging veins, the tentorium cerebelli, and cranial nerves VI and VIII.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Treatment & Blood Patch */}
        {activeTab === 'treatment' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-5">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Syringe className="w-5 h-5 text-indigo-400" /> Inpatient Therapeutics
              </h2>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Abortive Medication Protocol</label>
                <select
                  value={params.medicationAdministered}
                  onChange={e => setParams({ ...params, medicationAdministered: e.target.value as AbortiveMedicationGiven })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200"
                >
                  <option value="NONE">None / Conservative Supportive Only</option>
                  <option value="DOPAMINE_ANTAGONIST_KETOROLAC">Metoclopramide 10mg IV + Ketorolac 30mg IV (First-Line Cocktail)</option>
                  <option value="IV_MAGNESIUM_DEXAMETHASONE">Magnesium Sulfate 2g IV + Dexamethasone 10mg IV (Relapse Prevention)</option>
                  <option value="DHE_PROTOCOL">IV Dihydroergotamine (DHE-45) Protocol (Requires &gt;24h since triptan)</option>
                  <option value="KETAMINE_INFUSION">Subanesthetic IV Ketamine Infusion (Refractory Rescue)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Intervention Strategy</label>
                <select
                  value={params.interventionSelected}
                  onChange={e => setParams({ ...params, interventionSelected: e.target.value as InterventionStrategy })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200"
                >
                  <option value="CONSERVATIVE_FLUIDS_CAFFEINE">Conservative: Strict Flat Bedrest + IV Fluids + Caffeine 500mg</option>
                  <option value="AUTOLOGOUS_EPIDURAL_BLOOD_PATCH">Autologous Epidural Blood Patch (EBP) - Definitive Seal</option>
                  <option value="SURGICAL_DURAL_REPAIR">Surgical / Endovascular Dural Tear Repair</option>
                  <option value="BURR_HOLE_DRAINAGE_HAZARD">Burr Hole Evacuation of Subdural Collection (HAZARD in SIH!)</option>
                  <option value="REPEATED_DIAGNOSTIC_LP_HAZARD">Repeated Diagnostic Lumbar Puncture (HAZARD in active leak!)</option>
                </select>
              </div>

              {params.interventionSelected === 'AUTOLOGOUS_EPIDURAL_BLOOD_PATCH' && (
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Blood Patch Volume (mL)</span>
                    <span className="font-bold text-indigo-400">{params.bloodPatchVolumeMl} mL</span>
                  </div>
                  <input aria-label="Blood Patch Volume (mL)"
                    type="range"
                    min="5"
                    max="30"
                    step="1"
                    value={params.bloodPatchVolumeMl}
                    onChange={e => setParams({ ...params, bloodPatchVolumeMl: Number(e.target.value) })}
                    className="w-full accent-indigo-500 h-2 bg-slate-800 rounded-lg"
                  />
                </div>
              )}

              <div className="pt-4 border-t border-slate-800">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={params.acetazolamideGiven}
                    onChange={e => setParams({ ...params, acetazolamideGiven: e.target.checked })}
                    className="accent-amber-500 rounded"
                  />
                  <span>Acetazolamide (Diamox) 250mg BID Active (For Rebound High Pressure)</span>
                </label>
              </div>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-4">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Syringe className="w-5 h-5 text-indigo-400" /> Epidural Blood Patch Mechanics
              </h2>

              <div className="p-4 bg-indigo-950/20 border border-indigo-600/30 rounded-lg text-xs space-y-2 text-indigo-200">
                <span className="font-bold text-indigo-400 block">Biphasic Action of Epidural Blood Patch:</span>
                <p>
                  <strong>1. Immediate Effect:</strong> Injecting 15-25 mL of autologous blood into the epidural space compresses the thecal sac, abruptly elevating intrathecal pressure and resolving brain sagging and traction headache within minutes.
                </p>
                <p>
                  <strong>2. Delayed Effect:</strong> Fibrin clot adheres to and seals the dural hole, allowing normal CSF volume to regenerate over 24 to 72 hours.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Clinical Pearls */}
        {activeTab === 'pearls' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-4">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Management Pearls
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
                <AlertTriangle className="w-5 h-5 text-rose-400" /> Lethal Traps in Headache Care
              </h2>

              <div className="p-4 bg-rose-950/30 border border-rose-600/40 rounded-lg text-xs leading-relaxed space-y-2 text-rose-200">
                <span className="font-bold text-rose-300 block">1. The DHE-Triptan 24h Contraindication:</span>
                <p>
                  Never administer IV DHE within 24 hours of any triptan. Both are potent agonists at vascular 5-HT1B/1D receptors. Concomitant administration triggers severe prolonged coronary and cerebral vasoconstriction.
                </p>
              </div>

              <div className="p-4 bg-amber-950/30 border border-amber-600/40 rounded-lg text-xs leading-relaxed space-y-2 text-amber-200">
                <span className="font-bold text-amber-300 block">2. Why Burr Holes are Contraindicated for SIH Subdurals:</span>
                <p>
                  Subdural hygromas and hematomas in CSF leaks occur due to low pressure stretching bridging veins. Evacuating them without repairing the leak fails because the brain remains collapsed, causing immediate rebleeding or fatal brainstem distortion. Fix the leak first!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
