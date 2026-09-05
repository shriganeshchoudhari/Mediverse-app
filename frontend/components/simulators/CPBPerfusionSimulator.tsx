'use client';

import React, { useState, useMemo } from 'react';
import {
  Activity,
  Heart,
  Droplets,
  Wind,
  Thermometer,
  ShieldAlert,
  AlertTriangle,
  Sparkles,
  Sliders,
  CheckCircle2,
  Zap,
  RotateCw,
  Gauge,
  Layers,
  ArrowRight,
  Info
} from 'lucide-react';
import {
  PumpType,
  VenousDrainageMode,
  BloodGasStrategy,
  CardioplegiaRegimen,
  CardioplegiaRoute,
  PatientParameters,
  CPBControls,
  computeCPBState,
  CPB_PRESETS,
  CPBPreset
} from '@/.gemini/skills/CPBPerfusionEngine';

export const CPBPerfusionSimulator: React.FC = () => {
  // 1. Preset & State Management
  const [selectedPresetId, setSelectedPresetId] = useState<string>('routine-cabg-normothermia');

  const activePreset = useMemo<CPBPreset>(() => {
    return CPB_PRESETS.find(p => p.id === selectedPresetId) || CPB_PRESETS[0];
  }, [selectedPresetId]);

  // Patient Parameters
  const [patient, setPatient] = useState<PatientParameters>(activePreset.patient);

  // Controls
  const [pumpType, setPumpType] = useState<PumpType>(activePreset.controls.pumpType);
  const [pumpFlowLpm, setPumpFlowLpm] = useState<number>(activePreset.controls.pumpFlowLpm);
  const [sweepGasLpm, setSweepGasLpm] = useState<number>(activePreset.controls.sweepGasLpm);
  const [fio2Fraction, setFio2Fraction] = useState<number>(activePreset.controls.fio2Fraction);
  const [venousDrainageMode, setVenousDrainageMode] = useState<VenousDrainageMode>(activePreset.controls.venousDrainageMode);
  const [vavdVacuumMmHg, setVavdVacuumMmHg] = useState<number>(activePreset.controls.vavdVacuumMmHg);
  const [reservoirLevelMl, setReservoirLevelMl] = useState<number>(activePreset.controls.reservoirLevelMl);
  const [patientCoreTempC, setPatientCoreTempC] = useState<number>(activePreset.controls.patientCoreTempC);
  const [heaterCoolerWaterTempC, setHeaterCoolerWaterTempC] = useState<number>(activePreset.controls.heaterCoolerWaterTempC);
  const [bloodGasStrategy, setBloodGasStrategy] = useState<BloodGasStrategy>(activePreset.controls.bloodGasStrategy);
  const [crossClampApplied, setCrossClampApplied] = useState<boolean>(activePreset.controls.crossClampApplied);
  const [circulatoryArrestActive, setCirculatoryArrestActive] = useState<boolean>(activePreset.controls.circulatoryArrestActive);
  const [acpActive, setAcpActive] = useState<boolean>(activePreset.controls.acpActive);
  const [acpFlowRateMlMin, setAcpFlowRateMlMin] = useState<number>(activePreset.controls.acpFlowRateMlMin);
  const [cardioplegiaRegimen, setCardioplegiaRegimen] = useState<CardioplegiaRegimen>(activePreset.controls.cardioplegiaRegimen);
  const [cardioplegiaRoute, setCardioplegiaRoute] = useState<CardioplegiaRoute>(activePreset.controls.cardioplegiaRoute);
  const [cardioplegiaInfusing, setCardioplegiaInfusing] = useState<boolean>(activePreset.controls.cardioplegiaInfusing);
  const [cardioplegiaLinePressureMmHg, setCardioplegiaLinePressureMmHg] = useState<number>(activePreset.controls.cardioplegiaLinePressureMmHg);
  const [protamineDoseAdministeredMg, setProtamineDoseAdministeredMg] = useState<number>(activePreset.controls.protamineDoseAdministeredMg);
  const [protamineInfusionSpeed, setProtamineInfusionSpeed] = useState<'SLOW_CONTROLLED' | 'RAPID_BOLUS'>(activePreset.controls.protamineInfusionSpeed);
  const [primeVolumeMl, setPrimeVolumeMl] = useState<number>(activePreset.controls.primeVolumeMl);

  // Apply Preset
  const applyPreset = (preset: CPBPreset) => {
    setSelectedPresetId(preset.id);
    setPatient(preset.patient);
    setPumpType(preset.controls.pumpType);
    setPumpFlowLpm(preset.controls.pumpFlowLpm);
    setSweepGasLpm(preset.controls.sweepGasLpm);
    setFio2Fraction(preset.controls.fio2Fraction);
    setVenousDrainageMode(preset.controls.venousDrainageMode);
    setVavdVacuumMmHg(preset.controls.vavdVacuumMmHg);
    setReservoirLevelMl(preset.controls.reservoirLevelMl);
    setPatientCoreTempC(preset.controls.patientCoreTempC);
    setHeaterCoolerWaterTempC(preset.controls.heaterCoolerWaterTempC);
    setBloodGasStrategy(preset.controls.bloodGasStrategy);
    setCrossClampApplied(preset.controls.crossClampApplied);
    setCirculatoryArrestActive(preset.controls.circulatoryArrestActive);
    setAcpActive(preset.controls.acpActive);
    setAcpFlowRateMlMin(preset.controls.acpFlowRateMlMin);
    setCardioplegiaRegimen(preset.controls.cardioplegiaRegimen);
    setCardioplegiaRoute(preset.controls.cardioplegiaRoute);
    setCardioplegiaInfusing(preset.controls.cardioplegiaInfusing);
    setCardioplegiaLinePressureMmHg(preset.controls.cardioplegiaLinePressureMmHg);
    setProtamineDoseAdministeredMg(preset.controls.protamineDoseAdministeredMg);
    setProtamineInfusionSpeed(preset.controls.protamineInfusionSpeed);
    setPrimeVolumeMl(preset.controls.primeVolumeMl);
  };

  // Compile Current Controls
  const currentControls: CPBControls = useMemo(() => ({
    pumpType,
    pumpFlowLpm,
    sweepGasLpm,
    fio2Fraction,
    venousDrainageMode,
    vavdVacuumMmHg,
    reservoirLevelMl,
    patientCoreTempC,
    heaterCoolerWaterTempC,
    bloodGasStrategy,
    crossClampApplied,
    circulatoryArrestActive,
    acpActive,
    acpFlowRateMlMin,
    cardioplegiaRegimen,
    cardioplegiaRoute,
    cardioplegiaInfusing,
    cardioplegiaLinePressureMmHg,
    protamineDoseAdministeredMg,
    protamineInfusionSpeed,
    primeVolumeMl
  }), [
    pumpType, pumpFlowLpm, sweepGasLpm, fio2Fraction, venousDrainageMode,
    vavdVacuumMmHg, reservoirLevelMl, patientCoreTempC, heaterCoolerWaterTempC,
    bloodGasStrategy, crossClampApplied, circulatoryArrestActive, acpActive,
    acpFlowRateMlMin, cardioplegiaRegimen, cardioplegiaRoute, cardioplegiaInfusing,
    cardioplegiaLinePressureMmHg, protamineDoseAdministeredMg, protamineInfusionSpeed,
    primeVolumeMl
  ]);

  // Compute Live Hemodynamics
  const hemodynamics = useMemo(() => {
    return computeCPBState(patient, currentControls);
  }, [patient, currentControls]);

  // Socratic AI Dispatch
  const handleAskAI = () => {
    const context = `
Cardiopulmonary Bypass (CPB) & Extracorporeal Perfusion Case Interrogation:
- Case / Preset: ${activePreset.name} (${activePreset.category})
- Clinical Scenario: ${activePreset.description}
- Patient Profile: Weight ${patient.weightKg}kg, Height ${patient.heightCm}cm, BSA ${hemodynamics.bsaM2} m², Baseline Hct ${patient.baselineHematocritPct}%, AT-III Activity ${patient.antithrombinIiiActivityPct}%
- Circuit Perfusion Metrics:
  * Arterial Pump: ${pumpType} at ${pumpFlowLpm} L/min (Cardiac Index: ${hemodynamics.cardiacIndexLpmM2} L/min/m², Arterial Line Pressure: ${hemodynamics.arterialLinePressureMmHg} mmHg)
  * Oxygen Delivery (DO2): ${hemodynamics.oxygenDeliveryDo2MlMinM2} mL/min/m² (Target >280-300), VO2: ${hemodynamics.oxygenConsumptionVo2MlMinM2} mL/min/m², SvO2: ${hemodynamics.svo2Pct}%
  * Hemodiluted Hct on Bypass: ${hemodynamics.onBypassHematocritPct}% (Hb ${hemodynamics.onBypassHemoglobinGdl} g/dL, Prime ${primeVolumeMl} mL)
  * Venous Drainage: ${venousDrainageMode} (Vacuum: ${vavdVacuumMmHg} mmHg), Reservoir Level: ${reservoirLevelMl} mL
- Temperature & Gas Exchange:
  * Core Temp: ${patientCoreTempC}°C, Water Temp: ${heaterCoolerWaterTempC}°C, Strategy: ${bloodGasStrategy}
  * PaO2: ${hemodynamics.pao2MmHg} mmHg, PaCO2 uncorrected: ${hemodynamics.paco2UncorrectedMmHg} mmHg, PaCO2 temp-corrected: ${hemodynamics.paco2CorrectedMmHg} mmHg, pH: ${hemodynamics.arterialPh}
- Myocardial & Cerebral Protection:
  * Cross-Clamp: ${crossClampApplied ? 'ON' : 'OFF'}, DHCA: ${circulatoryArrestActive ? 'ACTIVE' : 'OFF'}, ACP: ${acpActive ? `ON (${acpFlowRateMlMin} mL/min)` : 'OFF'}
  * Cardioplegia: ${cardioplegiaRegimen} via ${cardioplegiaRoute} (Infusing: ${cardioplegiaInfusing}, Line Pressure: ${cardioplegiaLinePressureMmHg} mmHg)
  * Myocardial State: ${hemodynamics.myocardialArrestStatus}
- Anticoagulation & Protamine:
  * Heparin: ${patient.heparinDoseUnits} U, ACT: ${hemodynamics.currentActSeconds}s (Target >= 480s)
  * Protamine: ${protamineDoseAdministeredMg} mg (${protamineInfusionSpeed})
- Alarms & Warnings: ${hemodynamics.alarmMessages.join(' | ')}
    `.trim();

    window.dispatchEvent(new CustomEvent('mediverse:open-ai-with-context', { detail: { context } }));
  };

  // Rescue Action: Administer AT-III Concentrate
  const handleAdministerATIII = () => {
    setPatient({
      ...patient,
      antithrombinIiiActivityPct: 100,
      heparinDoseUnits: patient.heparinDoseUnits + 5000
    });
  };

  // Rescue Action: Volume Bolus into Reservoir
  const handleAddVolume = (amountMl: number) => {
    setReservoirLevelMl(prev => Math.min(3500, prev + amountMl));
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 text-slate-100">
      {/* Top Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <span className="p-2.5 bg-rose-950 border border-rose-700/50 rounded-xl text-rose-400">
                <Heart className="w-6 h-6 animate-pulse" />
              </span>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  Cardiopulmonary Bypass (CPB) Perfusion Workstation
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-900/60 border border-rose-500/40 text-rose-300 font-mono">
                    AmSECT / STS Standard
                  </span>
                </h1>
                <p className="text-sm text-slate-400 mt-0.5">
                  Heart-lung machine hydraulics, hypothermic gas strategies, myocardial protection, and protamine stoichiometry.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleAskAI}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-rose-900/30 transition border border-rose-400/30"
            >
              <Sparkles className="w-4 h-4" />
              Ask Socratic AI
            </button>
          </div>
        </div>

        {/* Pathology Presets Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5 block">
            Clinical Presets &amp; Emergency Scenarios:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {CPB_PRESETS.map((p) => {
              const isSelected = p.id === selectedPresetId;
              return (
                <button
                  key={p.id}
                  onClick={() => applyPreset(p)}
                  className={`px-3 py-2 rounded-xl text-xs text-left transition flex flex-col justify-between border ${
                    isSelected
                      ? 'bg-rose-950/80 border-rose-500 text-white shadow-md shadow-rose-950/50'
                      : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                  }`}
                >
                  <span className="font-semibold line-clamp-1">{p.name}</span>
                  <span className={`text-[10px] mt-1 font-mono ${isSelected ? 'text-rose-300' : 'text-slate-500'}`}>
                    {p.category}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Grid: Circuit Controls (Left) + Schematic HUD (Center) + Hemodynamics Console (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Perfusion Pump Controls (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-rose-400" />
                Arterial Pump &amp; Gas
              </h2>
              <div className="flex bg-slate-950 border border-slate-800 rounded-lg p-0.5">
                <button
                  onClick={() => setPumpType('ROLLER_OCCLUSIVE')}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    pumpType === 'ROLLER_OCCLUSIVE' ? 'bg-rose-600 text-white' : 'text-slate-400'
                  }`}
                >
                  Roller
                </button>
                <button
                  onClick={() => setPumpType('CENTRIFUGAL_VORTEX')}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    pumpType === 'CENTRIFUGAL_VORTEX' ? 'bg-rose-600 text-white' : 'text-slate-400'
                  }`}
                >
                  Centrifugal
                </button>
              </div>
            </div>

            {/* Pump Flow Dial */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Pump Blood Flow</span>
                <span className="font-mono text-rose-400 font-bold text-sm">
                  {pumpFlowLpm.toFixed(1)} L/min
                  <span className="text-[10px] text-slate-500 ml-1">
                    (CI: {hemodynamics.cardiacIndexLpmM2} L/m/m²)
                  </span>
                </span>
              </div>
              <input
                type="range"
                min={0.0}
                max={7.0}
                step={0.1}
                value={pumpFlowLpm}
                onChange={(e) => setPumpFlowLpm(Number(e.target.value))}
                className="w-full accent-rose-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Sweep Gas & FiO2 */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Sweep Gas</span>
                  <span className="font-mono text-cyan-300">{sweepGasLpm.toFixed(1)} L/m</span>
                </div>
                <input
                  type="range"
                  min={0.5}
                  max={8.0}
                  step={0.1}
                  value={sweepGasLpm}
                  onChange={(e) => setSweepGasLpm(Number(e.target.value))}
                  className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">FiO2</span>
                  <span className="font-mono text-cyan-300">{Math.round(fio2Fraction * 100)}%</span>
                </div>
                <input
                  type="range"
                  min={0.21}
                  max={1.0}
                  step={0.05}
                  value={fio2Fraction}
                  onChange={(e) => setFio2Fraction(Number(e.target.value))}
                  className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Venous Drainage & Reservoir */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Venous Drainage Mode</span>
                <span className="font-mono text-xs text-sky-400">{venousDrainageMode}</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                {(['GRAVITY_SYPHON', 'VAVD', 'KAVD'] as VenousDrainageMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setVenousDrainageMode(mode)}
                    className={`py-1 rounded text-[10px] font-medium transition border ${
                      venousDrainageMode === mode
                        ? 'bg-sky-600 text-white border-sky-400'
                        : 'bg-slate-800/60 text-slate-400 border-slate-700'
                    }`}
                  >
                    {mode.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>

              {venousDrainageMode === 'VAVD' && (
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">VAVD Vacuum</span>
                    <span className="font-mono text-sky-300">{vavdVacuumMmHg} mmHg</span>
                  </div>
                  <input
                    type="range"
                    min={-60}
                    max={0}
                    step={5}
                    value={vavdVacuumMmHg}
                    onChange={(e) => setVavdVacuumMmHg(Number(e.target.value))}
                    className="w-full accent-sky-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                  />
                </div>
              )}

              {/* Reservoir Volume Slider */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Venous Reservoir Level</span>
                  <span className={`font-mono font-bold ${
                    reservoirLevelMl < 800 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'
                  }`}>
                    {reservoirLevelMl} mL
                  </span>
                </div>
                <input
                  type="range"
                  min={400}
                  max={3000}
                  step={50}
                  value={reservoirLevelMl}
                  onChange={(e) => setReservoirLevelMl(Number(e.target.value))}
                  className="w-full accent-emerald-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => handleAddVolume(250)}
                  className="flex-1 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[10px] font-mono border border-slate-700"
                >
                  +250 mL Bolus
                </button>
                <button
                  onClick={() => handleAddVolume(500)}
                  className="flex-1 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[10px] font-mono border border-slate-700"
                >
                  +500 mL Bolus
                </button>
              </div>
            </div>

            {/* Thermoregulation & Strategy */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-blue-400" />
                  Core Temperature
                </span>
                <span className="font-mono text-blue-300 font-bold">{patientCoreTempC.toFixed(1)}°C</span>
              </div>
              <input
                type="range"
                min={18.0}
                max={37.5}
                step={0.5}
                value={patientCoreTempC}
                onChange={(e) => setPatientCoreTempC(Number(e.target.value))}
                className="w-full accent-blue-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
              />

              <div className="flex items-center justify-between text-[11px] pt-1">
                <span className="text-slate-400">Blood Gas Strategy</span>
                <div className="flex bg-slate-950 border border-slate-800 rounded p-0.5">
                  <button
                    onClick={() => setBloodGasStrategy('ALPHA_STAT')}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                      bloodGasStrategy === 'ALPHA_STAT' ? 'bg-blue-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    α-stat
                  </button>
                  <button
                    onClick={() => setBloodGasStrategy('PH_STAT')}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                      bloodGasStrategy === 'PH_STAT' ? 'bg-blue-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    pH-stat
                  </button>
                </div>
              </div>
            </div>

            {/* Myocardial & Cerebral Clamps */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">Surgical Clamping &amp; DHCA</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setCrossClampApplied(!crossClampApplied)}
                  className={`py-1.5 rounded-lg text-xs font-semibold border transition ${
                    crossClampApplied
                      ? 'bg-rose-950/80 border-rose-500 text-rose-300'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300'
                  }`}
                >
                  {crossClampApplied ? 'Aortic Clamp: ON' : 'Aortic Clamp: OFF'}
                </button>
                <button
                  onClick={() => setCirculatoryArrestActive(!circulatoryArrestActive)}
                  className={`py-1.5 rounded-lg text-xs font-semibold border transition ${
                    circulatoryArrestActive
                      ? 'bg-amber-950/80 border-amber-500 text-amber-300'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300'
                  }`}
                >
                  {circulatoryArrestActive ? 'DHCA Arrest: ON' : 'DHCA Arrest: OFF'}
                </button>
              </div>

              {circulatoryArrestActive && (
                <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 space-y-1.5">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">Antegrade Cerebral Perfusion</span>
                    <button
                      onClick={() => setAcpActive(!acpActive)}
                      className={`px-2 py-0.5 rounded font-mono text-[10px] ${
                        acpActive ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {acpActive ? 'ACP ACTIVE' : 'NO ACP'}
                    </button>
                  </div>
                  {acpActive && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-slate-400">ACP Flow Rate</span>
                        <span className="font-mono text-emerald-400">{acpFlowRateMlMin} mL/min</span>
                      </div>
                      <input
                        type="range"
                        min={400}
                        max={1400}
                        step={50}
                        value={acpFlowRateMlMin}
                        onChange={(e) => setAcpFlowRateMlMin(Number(e.target.value))}
                        className="w-full accent-emerald-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Center Column: Interactive Circuit Schematic HUD (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[480px]">
            {/* Schematic Header */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div>
                <div className="text-xs font-mono text-rose-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  Extracorporeal Circuit Flow Map
                </div>
                <div className="text-base font-bold text-white mt-0.5">
                  {pumpType === 'ROLLER_OCCLUSIVE' ? 'Double-Roller Occlusive Head' : 'Centrifugal Constrained Vortex Head'}
                </div>
              </div>

              <div className="text-right">
                <span className={`text-xs px-2.5 py-1 rounded-full font-bold font-mono border ${
                  hemodynamics.circuitAlarmStatus === 'OPTIMAL'
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                    : 'bg-rose-950/80 border-rose-500 text-rose-300 animate-pulse'
                }`}>
                  {hemodynamics.circuitAlarmStatus.replace(/_/g, ' ')}
                </span>
                <div className="text-[10px] text-slate-400 font-mono mt-1">
                  Arterial Line P: {hemodynamics.arterialLinePressureMmHg} mmHg
                </div>
              </div>
            </div>

            {/* SVG Circuit Schematic */}
            <div className="relative w-full h-72 my-2 flex items-center justify-center">
              <svg viewBox="0 0 420 300" className="w-full h-full drop-shadow-[0_0_15px_rgba(244,63,94,0.15)]">
                <defs>
                  <linearGradient id="oxygenatedBlood" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="100%" stopColor="#dc2626" />
                  </linearGradient>
                  <linearGradient id="deoxygenatedBlood" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#1d4ed8" />
                  </linearGradient>
                  <linearGradient id="cardioplegiaFluid" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#047857" />
                  </linearGradient>
                </defs>

                {/* Patient Heart Box (Top Center) */}
                <rect x="150" y="15" width="120" height="70" rx="14" fill="#0f172a" stroke="#e11d48" strokeWidth="2.5" />
                <text x="210" y="38" fill="#fda4af" fontSize="11" fontWeight="bold" textAnchor="middle">Patient Heart</text>
                <text x="210" y="55" fill="#f43f5e" fontSize="9" textAnchor="middle" fontFamily="monospace">
                  {hemodynamics.myocardialArrestStatus.replace(/_/g, ' ')}
                </text>
                {crossClampApplied && (
                  <g>
                    <line x1="140" y1="25" x2="160" y2="40" stroke="#facc15" strokeWidth="3" />
                    <text x="140" y="18" fill="#facc15" fontSize="8" fontWeight="bold">X-Clamp</text>
                  </g>
                )}

                {/* Venous Line from Heart to Reservoir (Blue) */}
                <path d="M 150 50 L 70 50 L 70 120" fill="none" stroke="url(#deoxygenatedBlood)" strokeWidth="6" strokeLinecap="round" />

                {/* Cardiotomy Venous Reservoir (Left) */}
                <rect x="40" y="120" width="60" height="90" rx="8" fill="#020617" stroke="#3b82f6" strokeWidth="2" />
                {/* Reservoir Liquid Level */}
                <rect
                  x="42"
                  y={208 - Math.min(84, (reservoirLevelMl / 3000) * 84)}
                  width="56"
                  height={Math.min(84, (reservoirLevelMl / 3000) * 84)}
                  rx="6"
                  fill="#1e3a8a"
                  opacity="0.85"
                />
                <text x="70" y="165" fill="#93c5fd" fontSize="9" fontWeight="bold" textAnchor="middle">Venous Res</text>
                <text x="70" y="180" fill="#60a5fa" fontSize="8" fontFamily="monospace" textAnchor="middle">{reservoirLevelMl}mL</text>

                {/* Tube to Arterial Pump Head */}
                <path d="M 70 210 L 70 250 L 170 250" fill="none" stroke="url(#deoxygenatedBlood)" strokeWidth="5" />

                {/* Arterial Pump Head (Bottom Center) */}
                <circle cx="200" cy="250" r="30" fill="#0f172a" stroke="#f43f5e" strokeWidth="2.5" />
                <circle cx="200" cy="250" r="16" fill="#1e293b" stroke="#e11d48" strokeWidth="1" />
                <text x="200" y="253" fill="#fda4af" fontSize="9" fontWeight="bold" textAnchor="middle">PUMP</text>
                <text x="200" y="292" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">{pumpFlowLpm} L/min</text>

                {/* Tube from Pump to Oxygenator */}
                <path d="M 230 250 L 310 250 L 310 210" fill="none" stroke="url(#oxygenatedBlood)" strokeWidth="5" />

                {/* Membrane Oxygenator & Heat Exchanger (Right) */}
                <rect x="280" y="120" width="60" height="90" rx="8" fill="#020617" stroke="#ef4444" strokeWidth="2" />
                <text x="310" y="150" fill="#fca5a5" fontSize="9" fontWeight="bold" textAnchor="middle">Oxygenator</text>
                <text x="310" y="165" fill="#f87171" fontSize="8" textAnchor="middle">Heat Exch</text>
                <text x="310" y="185" fill="#38bdf8" fontSize="8" fontFamily="monospace" textAnchor="middle">{patientCoreTempC}°C</text>

                {/* Arterial Return Line from Oxygenator back to Aorta */}
                <path d="M 310 120 L 310 50 L 270 50" fill="none" stroke="url(#oxygenatedBlood)" strokeWidth="6" strokeLinecap="round" />

                {/* Cardioplegia Delivery Line (Green) */}
                {crossClampApplied && (
                  <g>
                    <path d="M 210 120 L 210 85" fill="none" stroke="url(#cardioplegiaFluid)" strokeWidth="3" strokeDasharray="4 2" />
                    <circle cx="210" cy="125" r="10" fill="#065f46" stroke="#10b981" />
                    <text x="210" y="128" fill="#6ee7b7" fontSize="7" fontWeight="bold" textAnchor="middle">CPG</text>
                  </g>
                )}
              </svg>
            </div>

            {/* Cardioplegia Details Banner */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-rose-300 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  Myocardial Protection Delivery:
                </span>
                <span className="font-mono text-emerald-400 text-[11px] font-bold">
                  {cardioplegiaRegimen.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Route: <strong className="text-slate-200">{cardioplegiaRoute.replace(/_/g, ' ')}</strong></span>
                <span>CPG Line P: <strong className={`font-mono ${
                  cardioplegiaRoute === 'RETROGRADE_CORONARY_SINUS' && cardioplegiaLinePressureMmHg > 50
                    ? 'text-rose-400 font-bold animate-pulse'
                    : 'text-cyan-300'
                }`}>{cardioplegiaLinePressureMmHg} mmHg</strong></span>
              </div>
            </div>
          </div>

          {/* Alarm Notifications */}
          <div className="space-y-2">
            {hemodynamics.alarmMessages.map((msg, i) => (
              <div
                key={i}
                className="flex items-start gap-2 p-3 bg-slate-900/90 border border-rose-900/40 rounded-xl text-xs text-slate-200"
              >
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{msg}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Hemodynamics, DO2 & Anticoagulation (3 cols) */}
        <div className="lg:col-span-3 space-y-5">
          {/* Target Perfusion Metrics HUD */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-rose-400" />
              Perfusion Adequacy HUD
            </h3>

            <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Cardiac Index:</span>
                <span className={`font-bold ${
                  hemodynamics.cardiacIndexLpmM2 >= 2.2 ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {hemodynamics.cardiacIndexLpmM2} L/min/m²
                </span>
              </div>

              <div className="flex justify-between border-t border-slate-800/80 pt-1">
                <span className="text-slate-400">Oxygen Delivery (DO2):</span>
                <span className={`font-bold ${
                  hemodynamics.oxygenDeliveryDo2MlMinM2 >= 280 ? 'text-emerald-400' : 'text-rose-400 animate-pulse'
                }`}>
                  {hemodynamics.oxygenDeliveryDo2MlMinM2} mL/min/m²
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Mixed Venous SvO2:</span>
                <span className={`font-bold ${
                  hemodynamics.svo2Pct >= 65 ? 'text-cyan-400' : 'text-amber-400'
                }`}>
                  {hemodynamics.svo2Pct}%
                </span>
              </div>

              <div className="flex justify-between border-t border-slate-800/80 pt-1">
                <span className="text-slate-400">Hematocrit on Bypass:</span>
                <span className="text-white">{hemodynamics.onBypassHematocritPct}% (Hb {hemodynamics.onBypassHemoglobinGdl})</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Mean Arterial P:</span>
                <span className="text-white">{hemodynamics.systemicArterialPressureMeanMmHg} mmHg</span>
              </div>

              <div className="flex justify-between border-t border-slate-800/80 pt-1">
                <span className="text-slate-400">PaO2 / PaCO2:</span>
                <span className="text-white">{hemodynamics.pao2MmHg} / {hemodynamics.paco2CorrectedMmHg} mmHg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Arterial pH ({bloodGasStrategy}):</span>
                <span className="text-white font-bold">{hemodynamics.arterialPh}</span>
              </div>
            </div>
          </div>

          {/* Anticoagulation & Protamine Section */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-rose-400" />
                Anticoagulation &amp; ACT
              </h3>
              <span className={`text-xs px-2 py-0.5 rounded font-mono font-bold ${
                hemodynamics.currentActSeconds >= 480
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-600'
                  : 'bg-rose-950 text-rose-300 border border-rose-600 animate-pulse'
              }`}>
                ACT: {hemodynamics.currentActSeconds}s
              </span>
            </div>

            <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between font-mono">
                <span className="text-slate-400">Heparin Dose:</span>
                <span className="text-white">{patient.heparinDoseUnits} U ({(patient.heparinDoseUnits / patient.weightKg).toFixed(0)} U/kg)</span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-slate-400">AT-III Activity:</span>
                <span className={`font-bold ${patient.antithrombinIiiActivityPct < 60 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {patient.antithrombinIiiActivityPct}%
                </span>
              </div>

              {/* Heparin Resistance Rescue */}
              {patient.antithrombinIiiActivityPct < 60 && (
                <button
                  onClick={handleAdministerATIII}
                  className="w-full mt-1 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold shadow transition"
                >
                  Administer 1000 IU AT-III / FFP
                </button>
              )}
            </div>

            {/* Protamine Reversal Controls */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Protamine Reversal</span>
                <span className="font-mono text-cyan-300 font-bold">{protamineDoseAdministeredMg} mg</span>
              </div>
              <input
                type="range"
                min={0}
                max={400}
                step={25}
                value={protamineDoseAdministeredMg}
                onChange={(e) => setProtamineDoseAdministeredMg(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
              />

              <div className="flex items-center justify-between text-[11px] pt-1">
                <span className="text-slate-400">Infusion Rate:</span>
                <div className="flex bg-slate-950 border border-slate-800 rounded p-0.5">
                  <button
                    onClick={() => setProtamineInfusionSpeed('SLOW_CONTROLLED')}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                      protamineInfusionSpeed === 'SLOW_CONTROLLED' ? 'bg-emerald-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    Controlled
                  </button>
                  <button
                    onClick={() => setProtamineInfusionSpeed('RAPID_BOLUS')}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                      protamineInfusionSpeed === 'RAPID_BOLUS' ? 'bg-rose-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    Rapid Bolus
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* High-Yield Teaching Pearls */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-rose-400" />
              Perfusion Board Pearls
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {activePreset.teachingPoints.map((tp, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>{tp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
