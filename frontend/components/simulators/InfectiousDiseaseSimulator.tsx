'use client';

import React, { useState, useEffect } from 'react';
import {
  computeInfectiousDiseaseState,
  ID_PRESETS,
  InfectiousDiseaseInputParams,
  InfectiousDiseaseState,
  PresetId,
  AntibioticDrug,
  SusceptibilityCategory,
} from '@/.gemini/skills/InfectiousDiseaseEngine';

const ALL_ANTIBIOTICS: { id: AntibioticDrug; label: string; class: string }[] = [
  { id: 'OXACILLIN', label: 'Oxacillin', class: 'Penicillinase-Resistant' },
  { id: 'CEFAZOLIN', label: 'Cefazolin (1st Gen)', class: 'Cephalosporin' },
  { id: 'CEFTRIAXONE', label: 'Ceftriaxone (3rd Gen)', class: 'Cephalosporin' },
  { id: 'CEFEPIME', label: 'Cefepime (4th Gen)', class: 'Antipseudomonal Ceph' },
  { id: 'PIPERACILLIN_TAZOBACTAM', label: 'Piperacillin-Tazobactam', class: 'BL/BLI' },
  { id: 'MEROPENEM', label: 'Meropenem', class: 'Carbapenem' },
  { id: 'VANCOMYCIN', label: 'Vancomycin', class: 'Glycopeptide' },
  { id: 'DAPTOMYCIN', label: 'Daptomycin', class: 'Lipopeptide' },
  { id: 'LINEZOLID', label: 'Linezolid', class: 'Oxazolidinone' },
  { id: 'CIPROFLOXACIN', label: 'Ciprofloxacin', class: 'Fluoroquinolone' },
  { id: 'AMIKACIN', label: 'Amikacin', class: 'Aminoglycoside' },
  { id: 'COLISTIN', label: 'Colistin', class: 'Polymyxin' },
];

const DEFAULT_PARAMS: InfectiousDiseaseInputParams = {
  presetId: 'MRSA_BACTEREMIA_ENDOCARDITIS',
  patientAge: 62,
  serumCreatinineMgDl: 1.2,
  weightKg: 75,
  infectionSite: 'BLOODSTREAM_SEPSIS',
  selectedAntibiotics: ['VANCOMYCIN'],
  bundleCulturesDrawn: true,
  bundleAntibioticsGiven: true,
  bundleFluidsGiven: true,
  bundleVasopressorsGiven: false,
  sbpMmHg: 96,
  rrPerMin: 24,
  gcsScore: 14,
  baselineLactateMmolL: 2.8,
};

function susceptibilityBadge(cat: SusceptibilityCategory) {
  if (cat === 'SUSCEPTIBLE') return 'bg-emerald-950 border-emerald-500 text-emerald-300 font-bold';
  if (cat === 'INTERMEDIATE') return 'bg-amber-950 border-amber-500 text-amber-300 font-bold';
  return 'bg-rose-950 border-rose-500 text-rose-300 font-bold';
}

function sepsisSeverityColor(sev: string) {
  if (sev === 'UNCOMPLICATED_INFECTION') return 'border-emerald-500 bg-emerald-950/60 text-emerald-300';
  if (sev === 'SEPSIS') return 'border-amber-500 bg-amber-950/60 text-amber-300';
  return 'border-rose-500 bg-rose-950/70 text-rose-300 animate-pulse';
}

export default function InfectiousDiseaseSimulator() {
  const [selectedPreset, setSelectedPreset] = useState<PresetId>('MRSA_BACTEREMIA_ENDOCARDITIS');
  const [params, setParams] = useState<InfectiousDiseaseInputParams>(() => ({
    ...DEFAULT_PARAMS,
    ...ID_PRESETS['MRSA_BACTEREMIA_ENDOCARDITIS'].initialState,
  }));
  const [liveData, setLiveData] = useState<InfectiousDiseaseState>(() =>
    computeInfectiousDiseaseState({ ...DEFAULT_PARAMS, ...ID_PRESETS['MRSA_BACTEREMIA_ENDOCARDITIS'].initialState })
  );

  useEffect(() => {
    setLiveData(computeInfectiousDiseaseState(params));
  }, [params]);

  function loadPreset(id: PresetId) {
    setSelectedPreset(id);
    setParams({
      ...DEFAULT_PARAMS,
      ...ID_PRESETS[id].initialState,
      presetId: id,
    });
  }

  function toggleAntibiotic(abx: AntibioticDrug) {
    setParams(p => {
      const exists = p.selectedAntibiotics.includes(abx);
      return {
        ...p,
        selectedAntibiotics: exists
          ? p.selectedAntibiotics.filter(x => x !== abx)
          : [...p.selectedAntibiotics, abx],
      };
    });
  }

  // 1-Click Sepsis Bundle Resuscitation Actions
  function toggleBloodCultures() {
    setParams(p => ({ ...p, bundleCulturesDrawn: !p.bundleCulturesDrawn }));
  }

  function toggleGiveAntibiotics() {
    setParams(p => ({ ...p, bundleAntibioticsGiven: !p.bundleAntibioticsGiven }));
  }

  function toggleGiveFluids() {
    setParams(p => ({ ...p, bundleFluidsGiven: !p.bundleFluidsGiven }));
  }

  function toggleVasopressors() {
    setParams(p => ({ ...p, bundleVasopressorsGiven: !p.bundleVasopressorsGiven }));
  }

  function openSocraticAI() {
    window.dispatchEvent(
      new CustomEvent('mediverse:open-ai-with-context', {
        detail: {
          module: 'Infectious Disease & Clinical Antibiogram',
          preset: ID_PRESETS[selectedPreset].title,
          pathogen: liveData.pathogen.species,
          resistanceMechanism: liveData.pathogen.resistanceMechanism,
          activeRegimen: liveData.activeRegimen,
          effectiveCoverage: liveData.effectiveCoverage,
          qsofa: `${liveData.qsofa.totalScore}/3`,
          sepsisSeverity: liveData.sepsisSeverity,
          crcl: `${liveData.crClMlMin} mL/min`,
          stewardshipRecommendation: liveData.stewardshipRecommendation,
          activeAlarms: liveData.activeAlarms,
        },
      })
    );
  }

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen p-4 md:p-6 font-mono">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black text-emerald-400 tracking-tight">
              ANTIMICROBIAL STEWARDSHIP &amp; ANTIBIOGRAM WORKSTATION
            </h1>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${sepsisSeverityColor(liveData.sepsisSeverity)}`}>
              {liveData.sepsisSeverity.replace('_', ' ')}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            CLSI / EUCAST Breakpoints | PK/PD Target Attainment | Surviving Sepsis 1-Hour Bundle | Cockcroft-Gault CrCl
          </p>
        </div>

        <button
          onClick={openSocraticAI}
          className="self-start md:self-auto px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg transition border border-emerald-400/40 flex items-center gap-2"
        >
          <span>✨</span> Ask Socratic AI Tutor
        </button>
      </div>

      {/* Preset Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-4">
        {Object.values(ID_PRESETS).map(p => (
          <button
            key={p.id}
            onClick={() => loadPreset(p.id)}
            className={`p-2.5 rounded-lg border text-left transition ${
              selectedPreset === p.id
                ? 'border-emerald-500 bg-emerald-950/80 text-white shadow-md'
                : 'border-slate-800 bg-slate-900/60 hover:border-slate-600 text-slate-300'
            }`}
          >
            <span className="text-[10px] block font-mono text-emerald-400 font-bold truncate">{p.resistanceMechanism}</span>
            <p className="text-xs font-semibold mt-0.5 line-clamp-1">{p.title}</p>
          </button>
        ))}
      </div>

      {/* Active Alarm Banner */}
      {liveData.activeAlarms.length > 0 && liveData.activeAlarms[0] !== 'OPTIMAL' ? (
        <div className="p-2.5 rounded-xl border border-rose-600/70 bg-rose-950/50 mb-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-rose-300">⚠ ACTIVE CLINICAL ALERTS:</span>
          {liveData.activeAlarms.map(alarm => (
            <span key={alarm} className="text-[11px] px-2 py-0.5 rounded border border-rose-500/70 bg-rose-900/70 text-rose-200 font-semibold">
              {alarm.replace(/_/g, ' ')}
            </span>
          ))}
        </div>
      ) : (
        <div className="p-2.5 rounded-xl border border-emerald-600/70 bg-emerald-950/40 mb-4 text-xs font-bold text-emerald-300">
          ✓ OPTIMAL ANTIMICROBIAL COVERAGE — Susceptibility and PK/PD Targets Met
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Left Column: Pathogen Susceptibility Matrix & Antibiogram */}
        <div className="lg:col-span-2 border border-slate-800 rounded-2xl bg-slate-900/70 p-4 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase text-emerald-400">Microbiology Culture &amp; Susceptibility</span>
              <h2 className="text-base font-bold text-white">
                {liveData.pathogen.species.replace(/_/g, ' ')} ({liveData.pathogen.gramStain.replace(/_/g, ' ')})
              </h2>
              <span className="text-xs text-amber-300 font-semibold">Mechanism: {liveData.pathogen.resistanceMechanism}</span>
            </div>
            <div className="text-right">
              <span className={`text-xs px-2 py-1 rounded-lg border ${liveData.effectiveCoverage ? 'bg-emerald-950 border-emerald-500 text-emerald-300' : 'bg-rose-950 border-rose-500 text-rose-300 animate-pulse'}`}>
                {liveData.effectiveCoverage ? '✓ EFFECTIVE ANTIMICROBIAL COVERAGE' : '✗ CRITICAL SPECTRUM GAP'}
              </span>
            </div>
          </div>

          {/* Patient-Specific MIC Breakpoint Table */}
          <div>
            <span className="text-xs font-bold text-slate-300 mb-2 block uppercase tracking-wider">
              Patient Isolate MIC Breakpoint Table (CLSI M100 Standard)
            </span>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-2">Antibiotic</th>
                    <th className="p-2">Patient MIC (μg/mL)</th>
                    <th className="p-2">CLSI Breakpoint (S / R)</th>
                    <th className="p-2">Interpretation</th>
                    <th className="p-2">PK/PD Target Attainment</th>
                    <th className="p-2">In Regimen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {liveData.pathogen.antibiogram.map(entry => {
                    const isSelected = liveData.activeRegimen.includes(entry.antibiotic);
                    return (
                      <tr key={entry.antibiotic} className={isSelected ? 'bg-emerald-950/30' : 'hover:bg-slate-800/40'}>
                        <td className="p-2 font-semibold text-white">{entry.antibiotic.replace(/_/g, ' ')}</td>
                        <td className="p-2 font-mono text-cyan-300">{entry.patientMicUgMl} μg/mL</td>
                        <td className="p-2 font-mono text-slate-400">
                          &le;{entry.susceptibleThreshold} / &ge;{entry.resistantThreshold}
                        </td>
                        <td className="p-2">
                          <span className={`text-[10px] px-2 py-0.5 rounded border ${susceptibilityBadge(entry.category)}`}>
                            {entry.category}
                          </span>
                        </td>
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`h-full ${entry.pkPdAttainmentPct >= 80 ? 'bg-emerald-400' : entry.pkPdAttainmentPct >= 40 ? 'bg-amber-400' : 'bg-rose-400'}`}
                                style={{ width: `${entry.pkPdAttainmentPct}%` }}
                              />
                            </div>
                            <span className="text-[10px] font-mono text-slate-300">{entry.pkPdAttainmentPct}%</span>
                          </div>
                        </td>
                        <td className="p-2">
                          {isSelected ? (
                            <span className="text-emerald-400 font-bold">✓ Active</span>
                          ) : (
                            <span className="text-slate-600">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Antibiotic Selector Pill Grid */}
          <div className="pt-3 border-t border-slate-800">
            <span className="text-xs font-bold text-slate-300 mb-2 block uppercase tracking-wider">
              Formulate Antimicrobial Regimen (Click to Prescribe / De-escalate)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5">
              {ALL_ANTIBIOTICS.map(abx => {
                const active = liveData.activeRegimen.includes(abx.id);
                return (
                  <button
                    key={abx.id}
                    onClick={() => toggleAntibiotic(abx.id)}
                    className={`p-2 rounded-lg border text-left transition text-xs font-semibold ${
                      active
                        ? 'bg-emerald-950 border-emerald-500 text-emerald-200 shadow'
                        : 'border-slate-800 bg-slate-950/70 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                    }`}
                  >
                    <div className="truncate">{abx.label}</div>
                    <span className="text-[9px] text-slate-500 block truncate">{abx.class}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stewardship Action Box */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
              Antimicrobial Stewardship Decision Support
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{liveData.stewardshipRecommendation}</p>
          </div>
        </div>

        {/* Right Column: Surviving Sepsis 1-Hour Bundle & qSOFA */}
        <div className="space-y-4">
          {/* Sepsis 1-Hour Resuscitation Bundle Panel */}
          <div className="border border-slate-800 rounded-2xl bg-slate-900/70 p-4 space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h2 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Surviving Sepsis 1-Hour Bundle
              </h2>
              <span
                className={`text-[10px] px-2 py-0.5 rounded border font-bold ${
                  liveData.oneHourBundle.bundleCompletedWithin60Min
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                    : 'bg-rose-950 border-rose-500 text-rose-300'
                }`}
              >
                {liveData.oneHourBundle.bundleCompletedWithin60Min ? 'COMPLETE' : 'INCOMPLETE'}
              </span>
            </div>

            <div className="space-y-2">
              <button
                onClick={toggleBloodCultures}
                className={`w-full text-xs p-2 rounded-lg border font-semibold flex justify-between items-center transition ${
                  params.bundleCulturesDrawn
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-600 text-slate-300'
                }`}
              >
                <span>1. Blood Cultures Before Antibiotics</span>
                <span className="text-[10px]">{params.bundleCulturesDrawn ? '✓ DRAWN' : 'DRAW'}</span>
              </button>

              <button
                onClick={toggleGiveAntibiotics}
                className={`w-full text-xs p-2 rounded-lg border font-semibold flex justify-between items-center transition ${
                  params.bundleAntibioticsGiven
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-600 text-slate-300'
                }`}
              >
                <span>2. Administer Broad-Spectrum IV Abx</span>
                <span className="text-[10px]">{params.bundleAntibioticsGiven ? '✓ GIVEN' : 'INFUSE'}</span>
              </button>

              <button
                onClick={toggleGiveFluids}
                className={`w-full text-xs p-2 rounded-lg border font-semibold flex justify-between items-center transition ${
                  params.bundleFluidsGiven
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-600 text-slate-300'
                }`}
              >
                <span>3. Rapid Crystalloid 30 mL/kg</span>
                <span className="text-[10px]">{params.bundleFluidsGiven ? '✓ INFUSING' : 'START BOLUS'}</span>
              </button>

              <button
                onClick={toggleVasopressors}
                className={`w-full text-xs p-2 rounded-lg border font-semibold flex justify-between items-center transition ${
                  params.bundleVasopressorsGiven
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-600 text-slate-300'
                }`}
              >
                <span>4. Vasopressors if MAP &lt; 65 mmHg</span>
                <span className="text-[10px]">{params.bundleVasopressorsGiven ? '✓ NOREPINEPHRINE' : 'TITRATE'}</span>
              </button>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Serum Lactate:</span>
                <span className={`font-bold ${liveData.serumLactateMmolL >= 2.0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {liveData.serumLactateMmolL} mmol/L {liveData.serumLactateMmolL >= 2.0 && '(Elevated)'}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Mean Arterial Pressure (MAP):</span>
                <span className={`font-bold ${liveData.mapMmHg < 65 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {liveData.mapMmHg} mmHg {liveData.mapMmHg < 65 ? '(<65 Target)' : '(Optimal)'}
                </span>
              </div>
            </div>
          </div>

          {/* qSOFA Score Card */}
          <div className="border border-slate-800 rounded-2xl bg-slate-900/70 p-4 space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">qSOFA Clinical Score</h2>
              <span
                className={`text-xs px-2 py-0.5 rounded font-bold border ${
                  liveData.qsofa.totalScore >= 2
                    ? 'bg-rose-950 border-rose-500 text-rose-300 animate-pulse'
                    : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}
              >
                Score: {liveData.qsofa.totalScore} / 3 ({liveData.qsofa.totalScore >= 2 ? 'High Mortality Risk' : 'Low Risk'})
              </span>
            </div>

            <div className="space-y-1 text-xs">
              <div className={`p-1.5 rounded flex justify-between ${liveData.qsofa.respiratoryRateGe22 ? 'bg-rose-950/40 text-rose-300' : 'bg-slate-950 text-slate-400'}`}>
                <span>Respiratory Rate &ge; 22 /min</span>
                <span className="font-bold">{params.rrPerMin} /min ({liveData.qsofa.respiratoryRateGe22 ? '+1 pt' : '0 pt'})</span>
              </div>
              <div className={`p-1.5 rounded flex justify-between ${liveData.qsofa.alteredMentationGcsLt15 ? 'bg-rose-950/40 text-rose-300' : 'bg-slate-950 text-slate-400'}`}>
                <span>Altered Mentation (GCS &lt; 15)</span>
                <span className="font-bold">GCS {params.gcsScore} ({liveData.qsofa.alteredMentationGcsLt15 ? '+1 pt' : '0 pt'})</span>
              </div>
              <div className={`p-1.5 rounded flex justify-between ${liveData.qsofa.systolicBpLe100 ? 'bg-rose-950/40 text-rose-300' : 'bg-slate-950 text-slate-400'}`}>
                <span>Systolic BP &le; 100 mmHg</span>
                <span className="font-bold">{params.sbpMmHg} mmHg ({liveData.qsofa.systolicBpLe100 ? '+1 pt' : '0 pt'})</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-between text-xs text-slate-400">
              <span>Creatinine Clearance (CrCl):</span>
              <span className="font-mono font-bold text-cyan-300">{liveData.crClMlMin} mL/min</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
