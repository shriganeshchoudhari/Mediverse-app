'use client';

import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Compass,
  Droplets,
  Eye,
  Heart,
  Info,
  Layers,
  ShieldAlert,
  ShieldCheck,
  Stethoscope,
  TrendingDown,
  Wind,
  Zap,
} from 'lucide-react';
import {
  simulateEcmoWorkstation,
  ECMO_PRESETS,
  EcmoPatientParams,
  EcmoModality,
  CannulationGeometry,
  LvVentingStrategy,
  ArterialLineMonitoringSite,
} from '../../.gemini/skills/EcmoCannulationEngine';

export default function EcmoCannulationSimulator() {
  const [params, setParams] = useState<EcmoPatientParams>(ECMO_PRESETS.harlequinNorthSouthCrisis);
  const [activeTab, setActiveTab] = useState<'cannulation' | 'harlequin' | 'venting' | 'pearls'>('cannulation');

  const result = simulateEcmoWorkstation(params);

  const loadPreset = (key: keyof typeof ECMO_PRESETS) => {
    setParams({ ...ECMO_PRESETS[key] });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400">
                <Heart className="w-7 h-7 animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                  ECMO Cannulation &amp; Harlequin Syndrome Workstation
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                  VV vs VA vs VAV Hybrid Configurations, Dual-Circulation Mixing Zones, Right Radial Arterial Line &amp; ECPELLA LV Venting
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 bg-rose-950/60 border border-rose-600/40 text-rose-300 rounded-full">
              Track B46 • Route #247
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 bg-blue-950/60 border border-blue-600/40 text-blue-300 rounded-full">
              Cardiothoracic &amp; Critical Care
            </span>
          </div>
        </div>

        {/* Presets Bar */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-400 mr-2 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" /> Presets:
          </span>
          <button
            onClick={() => loadPreset('vvArdsProtective')}
            className="px-3 py-1.5 text-xs font-medium bg-slate-900 border border-slate-700 hover:border-cyan-500 hover:bg-cyan-950/20 text-cyan-300 rounded-lg transition"
          >
            VV-ARDS Lung Rest
          </button>
          <button
            onClick={() => loadPreset('harlequinNorthSouthCrisis')}
            className="px-3 py-1.5 text-xs font-medium bg-slate-900 border border-slate-700 hover:border-rose-500 hover:bg-rose-950/30 text-rose-400 rounded-lg transition"
          >
            Harlequin North-South Crisis
          </button>
          <button
            onClick={() => loadPreset('harlequinLeftRadialTrap')}
            className="px-3 py-1.5 text-xs font-medium bg-slate-900 border border-slate-700 hover:border-amber-500 hover:bg-amber-950/20 text-amber-300 rounded-lg transition"
          >
            Left Radial Monitoring Trap
          </button>
          <button
            onClick={() => loadPreset('unventedLvOverdistension')}
            className="px-3 py-1.5 text-xs font-medium bg-slate-900 border border-slate-700 hover:border-purple-500 hover:bg-purple-950/20 text-purple-300 rounded-lg transition"
          >
            Unvented LV Overdistension
          </button>
          <button
            onClick={() => loadPreset('vavHybridRescued')}
            className="px-3 py-1.5 text-xs font-medium bg-slate-900 border border-slate-700 hover:border-emerald-500 hover:bg-emerald-950/20 text-emerald-300 rounded-lg transition"
          >
            VAV Hybrid Rescue (Dual Oxygenation)
          </button>
        </div>
      </div>

      {/* Hero 4-Panel Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Panel 1: ECMO Modality & Flow */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>ECMO CONFIGURATION &amp; FLOW</span>
              <Activity className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className={`text-xl font-black ${
                params.modality === 'VV_RESPIRATORY' ? 'text-cyan-400' :
                params.modality === 'VAV_HYBRID_TRIPLE' ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {params.modality === 'VV_RESPIRATORY' ? 'VV-ECMO' :
                 params.modality === 'VAV_HYBRID_TRIPLE' ? 'VAV Hybrid' : 'VA-ECMO'}
              </span>
            </div>
            <div className="mt-2 text-xs text-slate-400 flex justify-between">
              <span>Circuit Blood Flow:</span>
              <span className="font-bold text-white">{params.ecmoBloodFlowLpm} L/min</span>
            </div>
            <div className="mt-1 text-xs text-slate-400 flex justify-between">
              <span>Sweep Gas Flow:</span>
              <span className="font-bold text-white">{params.sweepGasFlowLpm} L/min</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400">Total DO2 Delivery:</span>
            <span className="font-bold text-emerald-400">{result.systemicOxygenDeliveryDo2MlMin} mL/min</span>
          </div>
        </div>

        {/* Panel 2: Harlequin Dual Circulation */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>HARLEQUIN DUAL CIRCULATION</span>
              <Wind className="w-4 h-4 text-rose-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Coronary/Cerebral PaO2</span>
                <span className={`text-2xl font-bold ${
                  result.coronaryCerebralPaO2MmHg < 60 ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  {result.coronaryCerebralPaO2MmHg} <span className="text-xs font-normal text-slate-400">mmHg</span>
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Subdiaphragmatic PaO2</span>
                <span className="text-2xl font-bold text-cyan-400">
                  {result.subdiaphragmaticPaO2MmHg} <span className="text-xs font-normal text-slate-400">mmHg</span>
                </span>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                result.harlequinSeverity === 'CRITICAL_CEREBRAL_CORONARY_HYPOXIA'
                  ? 'bg-rose-950/60 border border-rose-600/40 text-rose-300 animate-pulse'
                  : result.harlequinSyndromeActive
                  ? 'bg-amber-950/60 border border-amber-600/40 text-amber-300'
                  : 'bg-emerald-950/60 border border-emerald-600/40 text-emerald-300'
              }`}>
                {result.harlequinSeverity === 'CRITICAL_CEREBRAL_CORONARY_HYPOXIA'
                  ? 'Critical Harlequin Syndrome: Brain Hypoxia'
                  : result.harlequinSyndromeActive
                  ? 'Mild Mixing Zone Transition'
                  : 'Single Circulation Normoxia'}
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400">Mixing Zone:</span>
            <span className="font-bold text-white text-[11px] truncate max-w-[140px]" title={result.mixingZoneLocation}>
              {result.mixingZoneLocation.split('(')[0]}
            </span>
          </div>
        </div>

        {/* Panel 3: LV Afterload & Venting */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>LV AFTERLOAD &amp; VENTING</span>
              <Heart className="w-4 h-4 text-purple-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Aortic Valve State</span>
                <span className={`text-xl font-bold ${params.aorticValveOpening ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {params.aorticValveOpening ? 'Opening (Ejecting)' : 'CLOSED (Stagnant)'}
                </span>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                result.lvDistensionRisk === 'CRITICAL_PULMONARY_EDEMA'
                  ? 'bg-rose-950/60 border border-rose-600/40 text-rose-300 animate-pulse'
                  : result.lvDistensionRisk === 'MODERATE'
                  ? 'bg-amber-950/60 border border-amber-600/40 text-amber-300'
                  : 'bg-emerald-950/60 border border-emerald-600/40 text-emerald-300'
              }`}>
                {result.lvDistensionRisk === 'CRITICAL_PULMONARY_EDEMA'
                  ? 'Critical Overdistension: Alveolar Flooding'
                  : result.lvDistensionRisk === 'MODERATE'
                  ? 'Elevated Afterload'
                  : 'LV Unloaded / Venting Active'}
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400">Venting Mode:</span>
            <span className="font-bold text-white">
              {params.lvVenting === 'IMPELLA_ECPELLA' ? 'ECPELLA (Impella)' :
               params.lvVenting === 'SURGICAL_LV_VENT' ? 'Surgical Vent' :
               params.lvVenting === 'ATRIAL_SEPTOSTOMY' ? 'Atrial Septostomy' : 'None (Unvented)'}
            </span>
          </div>
        </div>

        {/* Panel 4: Limb Perfusion & Safety */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>LIMB PERFUSION &amp; SAFETY</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Distal Limb Catheter</span>
                <span className={`text-xl font-bold ${params.distalPerfusionCatheterInPlace ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {params.distalPerfusionCatheterInPlace ? 'DPC In Place' : 'OMITTED (Threat)'}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Safety Score</span>
                <span className={`text-2xl font-bold ${
                  result.safetyScore >= 80 ? 'text-emerald-400' :
                  result.safetyScore >= 50 ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {result.safetyScore}/100
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400">Arterial Line Site:</span>
            <span className={`font-bold ${params.artLineSite === 'RIGHT_RADIAL_MANDATORY' ? 'text-emerald-400' : 'text-rose-400'}`}>
              {params.artLineSite === 'RIGHT_RADIAL_MANDATORY' ? 'Right Radial (Correct)' : 'Left/Femoral (Trap)'}
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
            onClick={() => setActiveTab('cannulation')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
              activeTab === 'cannulation'
                ? 'border-rose-500 text-rose-400 bg-rose-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            1. Cannulation Geometries &amp; Flow
          </button>
          <button
            onClick={() => setActiveTab('harlequin')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
              activeTab === 'harlequin'
                ? 'border-rose-500 text-rose-400 bg-rose-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            2. Harlequin (North-South) Dual Circulation
          </button>
          <button
            onClick={() => setActiveTab('venting')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
              activeTab === 'venting'
                ? 'border-rose-500 text-rose-400 bg-rose-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            3. LV Venting (ECPELLA) &amp; Limb Perfusion
          </button>
          <button
            onClick={() => setActiveTab('pearls')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
              activeTab === 'pearls'
                ? 'border-rose-500 text-rose-400 bg-rose-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            4. Clinical Pearls &amp; ELSO Guidelines
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="max-w-7xl mx-auto">
        {/* Tab 1: Cannulation & Flow */}
        {activeTab === 'cannulation' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-5">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-400" /> Circuit Parameters &amp; Modality
              </h2>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">ECMO Modality</label>
                <select
                  value={params.modality}
                  onChange={e => setParams({ ...params, modality: e.target.value as EcmoModality })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200"
                >
                  <option value="VA_CARDIOCIRCULATORY">Veno-Arterial (VA) - Circulatory &amp; Respiratory Support</option>
                  <option value="VV_RESPIRATORY">Veno-Venous (VV) - Isolated Respiratory Support (ARDS)</option>
                  <option value="VAV_HYBRID_TRIPLE">Veno-Arterio-Venous (VAV) Hybrid - Harlequin Cure</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Cannulation Geometry</label>
                <select
                  value={params.cannulation}
                  onChange={e => setParams({ ...params, cannulation: e.target.value as CannulationGeometry })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200"
                >
                  <option value="FEM_FEM_PERIPHERAL">Femoral Vein - Femoral Artery (Peripheral VA)</option>
                  <option value="FEM_FEM_WITH_DPC">Femoral-Femoral with Distal Perfusion Catheter (DPC)</option>
                  <option value="FEM_IJ_BIFEMORAL">Femoral Vein (Drainage) - Internal Jugular (Re-infusion) (VV)</option>
                  <option value="AVALON_DUAL_LUMEN_IJ">Avalon Dual-Lumen Bicaval IJ Cannula (Single Site VV)</option>
                  <option value="CENTRAL_AORTIC_RIGHT_ATRIAL">Central Cannulation (Right Atrium - Ascending Aorta)</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>ECMO Pump Blood Flow (L/min)</span>
                  <span className="font-bold text-cyan-400">{params.ecmoBloodFlowLpm} L/min</span>
                </div>
                <input aria-label="ECMO Pump Blood Flow (L/min)"
                  type="range"
                  min="1.5"
                  max="7.0"
                  step="0.1"
                  value={params.ecmoBloodFlowLpm}
                  onChange={e => setParams({ ...params, ecmoBloodFlowLpm: Number(e.target.value) })}
                  className="w-full accent-cyan-500 h-2 bg-slate-800 rounded-lg"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Sweep Gas Flow (L/min) - Controls PaCO2</span>
                  <span className="font-bold text-slate-200">{params.sweepGasFlowLpm} L/min</span>
                </div>
                <input aria-label="Sweep Gas Flow (L/min) - Controls PaCO2"
                  type="range"
                  min="1.0"
                  max="15.0"
                  step="0.5"
                  value={params.sweepGasFlowLpm}
                  onChange={e => setParams({ ...params, sweepGasFlowLpm: Number(e.target.value) })}
                  className="w-full accent-blue-500 h-2 bg-slate-800 rounded-lg"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Membrane Oxygenator FiO2</span>
                  <span className="font-bold text-emerald-400">{Math.round(params.membraneFio2 * 100)}%</span>
                </div>
                <input aria-label="Membrane Oxygenator FiO2"
                  type="range"
                  min="0.21"
                  max="1.0"
                  step="0.05"
                  value={params.membraneFio2}
                  onChange={e => setParams({ ...params, membraneFio2: Number(e.target.value) })}
                  className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg"
                />
              </div>
            </div>

            {/* Right: Modality Comparison */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-4">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Info className="w-5 h-5 text-cyan-400" /> VV vs VA ECMO Principles
              </h2>

              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-lg text-xs space-y-2">
                <span className="font-bold text-cyan-300 block text-sm">Veno-Venous (VV-ECMO):</span>
                <p className="text-slate-300">
                  Drainage from IVC, re-infusion into SVC/right atrium. Provides <strong>gas exchange only</strong>. Native heart provides 100% of circulatory hemodynamics. Lungs are rested with ultra-protective ventilator settings.
                </p>
              </div>

              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-lg text-xs space-y-2">
                <span className="font-bold text-rose-300 block text-sm">Veno-Arterial (VA-ECMO):</span>
                <p className="text-slate-300">
                  Drainage from venous system, retrograde re-infusion into arterial system. Provides <strong>circulatory hemodynamics + gas exchange</strong>. Relieves RV preload while increasing LV afterload.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Harlequin Syndrome */}
        {activeTab === 'harlequin' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-5">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Wind className="w-5 h-5 text-rose-400" /> Dual-Circulation Mechanics
              </h2>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Native Left Ventricle Output (L/min)</span>
                  <span className={`font-bold ${params.nativeCardiacOutputLpm >= 3.0 ? 'text-amber-400' : 'text-slate-300'}`}>
                    {params.nativeCardiacOutputLpm} L/min
                  </span>
                </div>
                <input aria-label="Native Left Ventricle Output (L/min)"
                  type="range"
                  min="0.5"
                  max="6.5"
                  step="0.1"
                  value={params.nativeCardiacOutputLpm}
                  onChange={e => setParams({ ...params, nativeCardiacOutputLpm: Number(e.target.value) })}
                  className="w-full accent-rose-500 h-2 bg-slate-800 rounded-lg"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Native Lung Effluent PaO2 (mmHg)</span>
                  <span className={`font-bold ${params.nativeLungPaO2MmHg < 60 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {params.nativeLungPaO2MmHg} mmHg
                  </span>
                </div>
                <input aria-label="Native Lung Effluent PaO2 (mmHg)"
                  type="range"
                  min="35"
                  max="200"
                  step="5"
                  value={params.nativeLungPaO2MmHg}
                  onChange={e => setParams({ ...params, nativeLungPaO2MmHg: Number(e.target.value) })}
                  className="w-full accent-rose-500 h-2 bg-slate-800 rounded-lg"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Arterial Line Monitoring Location</label>
                <select
                  value={params.artLineSite}
                  onChange={e => setParams({ ...params, artLineSite: e.target.value as ArterialLineMonitoringSite })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200"
                >
                  <option value="RIGHT_RADIAL_MANDATORY">Right Radial Artery (Pre-Ductal / Innominate - MANDATORY)</option>
                  <option value="LEFT_RADIAL">Left Radial Artery (Post-Ductal - HAZARD / False High SpO2)</option>
                  <option value="FEMORAL_ARTERY">Femoral Artery (Post-Membrane ECMO Flow - Severe Blindspot)</option>
                </select>
              </div>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-4">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" /> The North-South Watershed Dilemma
              </h2>

              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-lg text-xs space-y-2">
                <span className="font-bold text-amber-300 block text-sm">Two Opposing Circulations:</span>
                <p className="text-slate-300">
                  <strong>North (Native Heart):</strong> Ejects deoxygenated blood from poorly functioning lungs into the ascending aorta and innominate artery &rarr; supplying the right arm, carotid arteries, brain, and coronaries.
                </p>
                <p className="text-slate-300">
                  <strong>South (ECMO Pump):</strong> Injects hyperoxygenated blood retrogradely up the femoral artery and descending aorta &rarr; supplying the kidneys, gut, and lower extremities.
                </p>
                <p className="font-semibold text-rose-400">
                  The patient will appear cyanotic in the face and right hand, but pink in the feet!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: LV Venting & Limb Perfusion */}
        {activeTab === 'venting' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-5">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-purple-400" /> LV Unloading &amp; Limb Protection
              </h2>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Mechanical LV Venting Strategy</label>
                <select
                  value={params.lvVenting}
                  onChange={e => setParams({ ...params, lvVenting: e.target.value as LvVentingStrategy })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200"
                >
                  <option value="NONE_UNVENTED">None / Unvented (High Risk of LV Stasis &amp; Edema)</option>
                  <option value="IMPELLA_ECPELLA">Impella Transvalvular Pump (ECPELLA - Gold Standard)</option>
                  <option value="SURGICAL_LV_VENT">Surgical LV Apical Vent</option>
                  <option value="ATRIAL_SEPTOSTOMY">Percutaneous Balloon Atrial Septostomy</option>
                </select>
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={params.aorticValveOpening}
                    onChange={e => setParams({ ...params, aorticValveOpening: e.target.checked })}
                    className="accent-emerald-500 rounded"
                  />
                  <span>Aortic Valve Opening on Echocardiography / Arterial Pulsatility Present</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={params.distalPerfusionCatheterInPlace}
                    onChange={e => setParams({ ...params, distalPerfusionCatheterInPlace: e.target.checked })}
                    className="accent-emerald-500 rounded"
                  />
                  <span>Distal Perfusion Catheter (6-8 Fr DPC) in Superficial Femoral Artery</span>
                </label>
              </div>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-4">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-400" /> The ECPELLA Mechanical Synergy
              </h2>

              <div className="p-4 bg-purple-950/20 border border-purple-600/30 rounded-lg text-xs space-y-2 text-purple-200">
                <span className="font-bold text-purple-400 block">Why Unloading the LV is Vital:</span>
                <p>
                  Retrograde arterial flow from VA-ECMO dramatically increases LV afterload. If the stunned LV cannot overcome this pressure, the aortic valve stays closed. Blood pools in the LV, raising end-diastolic pressure above 30 mmHg and causing fulminant pulmonary edema (hydrostatic alveolar hemorrhage) and ventricular stasis thrombus.
                </p>
                <p>
                  The addition of an Impella microaxial pump (ECPELLA) drains blood from the LV lumen directly into the aorta, maintaining microvascular coronary perfusion and protecting the pulmonary capillary bed.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Pearls & Guidelines */}
        {activeTab === 'pearls' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-4">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" /> ELSO Management Protocol
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
                <AlertTriangle className="w-5 h-5 text-rose-400" /> Critical Practice Pitfalls
              </h2>

              <div className="p-4 bg-rose-950/30 border border-rose-600/40 rounded-lg text-xs leading-relaxed space-y-2 text-rose-200">
                <span className="font-bold text-rose-300 block">1. The Right Radial Arterial Line Rule:</span>
                <p>
                  Never monitor a femoral VA-ECMO patient solely from the left radial or femoral arterial lines. Only the RIGHT radial line measures pre-ductal blood originating from the innominate artery, directly detecting cerebral and coronary hypoxemia.
                </p>
              </div>

              <div className="p-4 bg-amber-950/30 border border-amber-600/40 rounded-lg text-xs leading-relaxed space-y-2 text-amber-200">
                <span className="font-bold text-amber-300 block">2. Mandatory Distal Limb Cannulation:</span>
                <p>
                  An anterograde 6-8 Fr catheter in the superficial femoral artery (SFA) is mandatory for all femoral VA-ECMO cannulations to prevent acute limb ischemia, compartment syndrome, and amputation.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
