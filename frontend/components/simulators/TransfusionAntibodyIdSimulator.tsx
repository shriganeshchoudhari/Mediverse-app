'use client';

import React, { useState, useMemo } from 'react';
import {
  IMMUNOHEMATOLOGY_SCENARIOS,
  ScenarioPresetId,
  AntigenName,
  AgglutinationGrade,
  DOSAGE_SENSITIVE_ANTIGENS,
  ENZYME_DESTROYED_ANTIGENS,
  ENZYME_ENHANCED_ANTIGENS,
  ENZYME_UNAFFECTED_ANTIGENS,
  POPULATION_ANTIGEN_FREQUENCIES,
  getAntigenZygosity,
  evaluateRuleOuts,
  evaluateRuleOfThree,
  calculateDonorScreening,
  generateImmunohematologyDebrief,
  DebriefResult,
} from '../../.gemini/skills/TransfusionAntibodyIdEngine';
import {
  Droplets,
  FlaskConical,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Calculator,
  RotateCcw,
  Sparkles,
  Search,
  ShieldAlert,
  ArrowRight,
  TestTube,
  BookOpen,
  Award,
} from 'lucide-react';

const ANTIGEN_COLUMNS: { name: AntigenName; group: string; dosage: boolean }[] = [
  // Rh
  { name: 'D', group: 'Rh', dosage: false },
  { name: 'C', group: 'Rh', dosage: true },
  { name: 'E', group: 'Rh', dosage: true },
  { name: 'c', group: 'Rh', dosage: true },
  { name: 'e', group: 'Rh', dosage: true },
  { name: 'f', group: 'Rh', dosage: false },
  { name: 'V', group: 'Rh', dosage: false },
  { name: 'Cw', group: 'Rh', dosage: false },
  // Kell
  { name: 'K', group: 'Kell', dosage: false },
  { name: 'k', group: 'Kell', dosage: false },
  { name: 'Kpa', group: 'Kell', dosage: false },
  { name: 'Kpb', group: 'Kell', dosage: false },
  // Duffy
  { name: 'Fya', group: 'Duffy', dosage: true },
  { name: 'Fyb', group: 'Duffy', dosage: true },
  // Kidd
  { name: 'Jka', group: 'Kidd', dosage: true },
  { name: 'Jkb', group: 'Kidd', dosage: true },
  // MNS
  { name: 'M', group: 'MNS', dosage: true },
  { name: 'N', group: 'MNS', dosage: true },
  { name: 'S', group: 'MNS', dosage: true },
  { name: 's', group: 'MNS', dosage: true },
  // Other
  { name: 'Lua', group: 'Luth', dosage: false },
  { name: 'Lub', group: 'Luth', dosage: false },
  { name: 'Lea', group: 'Lewis', dosage: false },
  { name: 'Leb', group: 'Lewis', dosage: false },
  { name: 'P1', group: 'P1', dosage: false },
];

export const TransfusionAntibodyIdSimulator: React.FC = () => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<ScenarioPresetId>('ANTI_K_ALLOIMMUNIZATION');
  const [ruledOutAntigens, setRuledOutAntigens] = useState<AntigenName[]>([]);
  const [selectedAntibodies, setSelectedAntibodies] = useState<AntigenName[]>([]);
  const [showEnzymeColumn, setShowEnzymeColumn] = useState<boolean>(false);
  const [unitsRequested, setUnitsRequested] = useState<number>(2);
  const [crossmatchExecuted, setCrossmatchExecuted] = useState<boolean>(false);
  const [showDebriefModal, setShowDebriefModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'panel' | 'enzymes' | 'crossmatch'>('panel');

  const scenario = useMemo(() => {
    return IMMUNOHEMATOLOGY_SCENARIOS[selectedScenarioId];
  }, [selectedScenarioId]);

  // Automated rule-out evaluation
  const autoRuleOuts = useMemo(() => {
    return evaluateRuleOuts(scenario.panelCells, true);
  }, [scenario]);

  // Donor screening calculation
  const donorScreening = useMemo(() => {
    return calculateDonorScreening(selectedAntibodies, unitsRequested);
  }, [selectedAntibodies, unitsRequested]);

  // Debrief
  const debrief = useMemo<DebriefResult>(() => {
    return generateImmunohematologyDebrief(scenario, selectedAntibodies, ruledOutAntigens);
  }, [scenario, selectedAntibodies, ruledOutAntigens]);

  const handleScenarioChange = (id: ScenarioPresetId) => {
    setSelectedScenarioId(id);
    setRuledOutAntigens([]);
    setSelectedAntibodies([]);
    setCrossmatchExecuted(false);
    setShowDebriefModal(false);
  };

  const toggleRuleOut = (antigen: AntigenName) => {
    setRuledOutAntigens((prev) =>
      prev.includes(antigen) ? prev.filter((a) => a !== antigen) : [...prev, antigen]
    );
  };

  const handleApplyAutoRuleOuts = () => {
    const safeRuledOut = Object.values(autoRuleOuts)
      .filter((r) => r.safeToExclude)
      .map((r) => r.antigen);
    setRuledOutAntigens(safeRuledOut);
  };

  const toggleSelectAntibody = (antigen: AntigenName) => {
    setSelectedAntibodies((prev) =>
      prev.includes(antigen) ? prev.filter((a) => a !== antigen) : [...prev, antigen]
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6 lg:p-8 font-sans">
      {/* Header Banner */}
      <header className="mb-6 bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-600/20 border border-red-500/40 rounded-xl text-red-400">
              <Droplets className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-white">
                  Immunohematology & Antibody Identification Panel
                </h1>
                <span className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wider bg-red-500/20 text-red-300 border border-red-500/30 rounded-full">
                  11-Cell Reagent RBC Engine
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                AABB Standard 11-Cell Antibody Exclusion, Dosage Effect Resolution, Enzyme Proteolysis & AHG Crossmatch Stoichiometry
              </p>
            </div>
          </div>

          {/* Scenario Picker */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Clinical Case:</label>
            <select
              value={selectedScenarioId}
              onChange={(e) => handleScenarioChange(e.target.value as ScenarioPresetId)}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2 font-medium focus:ring-2 focus:ring-red-500 focus:outline-none"
            >
              {Object.values(IMMUNOHEMATOLOGY_SCENARIOS).map((sc) => (
                <option key={sc.id} value={sc.id}>
                  {sc.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Clinical Patient Context */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800">
            <span className="text-slate-400 block font-semibold">Patient & Demographics</span>
            <span className="text-slate-200 font-medium">
              {scenario.patientProfile.age} yo {scenario.patientProfile.gender} • <strong className="text-red-400">{scenario.patientProfile.aboRh}</strong>
            </span>
          </div>
          <div className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800">
            <span className="text-slate-400 block font-semibold">Diagnosis & Presentation</span>
            <span className="text-slate-200 font-medium truncate block">{scenario.patientProfile.diagnosis}</span>
          </div>
          <div className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800">
            <span className="text-slate-400 block font-semibold">Transfusion & Obstetric History</span>
            <span className="text-slate-200 font-medium">{scenario.patientProfile.transfusionHistory}</span>
          </div>
          <div className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800">
            <span className="text-slate-400 block font-semibold">Hemolytic Labs</span>
            <span className="text-slate-200 font-medium">
              Hb: {scenario.patientProfile.hemoglobinGdl} g/dL • Bili: {scenario.patientProfile.bilirubinTotalMgDl} mg/dL • LDH: {scenario.patientProfile.ldhUL} U/L
            </span>
          </div>
        </div>
      </header>

      {/* Main Tab Navigation */}
      <div className="flex items-center justify-between mb-4 border-b border-slate-800">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('panel')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
              activeTab === 'panel'
                ? 'border-red-500 text-red-400 bg-slate-900/50'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/20'
            }`}
          >
            <TestTube className="w-4 h-4" />
            11-Cell Reagent RBC Panel & Strikethrough
          </button>
          <button
            onClick={() => setActiveTab('enzymes')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
              activeTab === 'enzymes'
                ? 'border-red-500 text-red-400 bg-slate-900/50'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/20'
            }`}
          >
            <FlaskConical className="w-4 h-4" />
            Ficin Enzyme Treatment Differential
          </button>
          <button
            onClick={() => setActiveTab('crossmatch')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
              activeTab === 'crossmatch'
                ? 'border-red-500 text-red-400 bg-slate-900/50'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/20'
            }`}
          >
            <Calculator className="w-4 h-4" />
            Antigen-Negative Screening & Crossmatch
          </button>
        </div>

        <button
          onClick={() => setShowDebriefModal(true)}
          className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600/30 rounded-lg text-xs font-semibold transition"
        >
          <Award className="w-4 h-4" />
          Submit Case & View Debrief Report
        </button>
      </div>

      {/* Tab 1: 11-Cell Panel & Strikethrough Table */}
      {activeTab === 'panel' && (
        <div className="space-y-6">
          {/* Action Toolbar & Rule-Out Assistance */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleApplyAutoRuleOuts}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Auto Rule-Out (Safe Non-Dosage & Homozygous Only)
              </button>
              <button
                onClick={() => setRuledOutAntigens([])}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Rule-Outs
              </button>
              <label className="flex items-center gap-2 text-xs font-medium text-slate-300 ml-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showEnzymeColumn}
                  onChange={(e) => setShowEnzymeColumn(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-red-600 focus:ring-red-500"
                />
                Include Ficin AHG Reaction Column
              </label>
            </div>

            <div className="text-xs text-slate-400 flex items-center gap-4">
              <span>
                Ruled Out: <strong className="text-slate-200">{ruledOutAntigens.length}</strong> / 25
              </span>
              <span>
                Potential Remaining: <strong className="text-amber-400">{25 - ruledOutAntigens.length}</strong>
              </span>
            </div>
          </div>

          {/* Autocontrol & DAT Strip */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  Autocontrol (Patient Serum + Patient RBCs)
                </h3>
                <span
                  className={`text-xs px-2 py-0.5 rounded font-semibold ${
                    scenario.autocontrolAndDat.autocontrolAHG === '0'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {scenario.autocontrolAndDat.autocontrolAHG === '0' ? 'Negative (Pure Allo)' : 'Positive (Auto / DHTR)'}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2 bg-slate-950 rounded border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">IS (22°C)</span>
                  <span className="font-bold text-slate-200">{scenario.autocontrolAndDat.autocontrolIS}</span>
                </div>
                <div className="p-2 bg-slate-950 rounded border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">37°C</span>
                  <span className="font-bold text-slate-200">{scenario.autocontrolAndDat.autocontrol37}</span>
                </div>
                <div className="p-2 bg-slate-950 rounded border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">AHG</span>
                  <span className="font-bold text-slate-200">{scenario.autocontrolAndDat.autocontrolAHG}</span>
                </div>
                <div className="p-2 bg-slate-950 rounded border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Check Cells</span>
                  <span className="font-bold text-slate-200">{scenario.autocontrolAndDat.autocontrolCheckCells}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <TestTube className="w-4 h-4 text-cyan-400" />
                  Direct Antiglobulin Test (DAT) Differential
                </h3>
                <span className="text-xs text-slate-400 font-mono">In Vivo Sensitization</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 bg-slate-950 rounded border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Polyspecific</span>
                  <span className="font-bold text-slate-200">{scenario.autocontrolAndDat.datPolyspecific}</span>
                </div>
                <div className="p-2 bg-slate-950 rounded border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Anti-IgG</span>
                  <span className="font-bold text-slate-200">{scenario.autocontrolAndDat.datAntiIgG}</span>
                </div>
                <div className="p-2 bg-slate-950 rounded border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Anti-C3d</span>
                  <span className="font-bold text-slate-200">{scenario.autocontrolAndDat.datAntiC3d}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 11-Cell Reagent RBC Table */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
            <div className="p-3 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Commercial 11-Cell Identification Panel Sheet
                </h3>
                <span className="text-[11px] text-slate-400">
                  (Click any antigen column header to toggle Strikethrough Rule-Out)
                </span>
              </div>
              <span className="text-xs text-slate-400">Lot: MED-2026-XP11</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-800/80 border-b border-slate-700 text-slate-300 text-[11px]">
                    <th className="p-2 border-r border-slate-700 font-semibold text-center sticky left-0 bg-slate-800 z-10 w-12">
                      Cell #
                    </th>
                    <th className="p-2 border-r border-slate-700 font-semibold text-left sticky left-12 bg-slate-800 z-10 w-36">
                      Donor Phenotype
                    </th>

                    {/* Antigen Columns */}
                    {ANTIGEN_COLUMNS.map((col) => {
                      const isRuledOut = ruledOutAntigens.includes(col.name);
                      return (
                        <th
                          key={col.name}
                          onClick={() => toggleRuleOut(col.name)}
                          className={`p-1.5 border-r border-slate-700 text-center font-bold cursor-pointer transition select-none hover:bg-slate-700/60 ${
                            isRuledOut
                              ? 'bg-red-950/40 text-slate-500 line-through'
                              : col.dosage
                              ? 'text-amber-300'
                              : 'text-slate-200'
                          }`}
                          title={`Click to toggle rule-out for ${col.name} (${col.group})${col.dosage ? ' - Dosage Sensitive' : ''}`}
                        >
                          <div className="flex flex-col items-center">
                            <span className="text-[9px] text-slate-500 font-normal uppercase">{col.group}</span>
                            <span>{col.name}</span>
                          </div>
                        </th>
                      );
                    })}

                    {/* Reaction Columns */}
                    <th className="p-2 border-r border-slate-700 font-bold text-center bg-indigo-950/40 text-indigo-300">
                      IS (22°C)
                    </th>
                    <th className="p-2 border-r border-slate-700 font-bold text-center bg-blue-950/40 text-blue-300">
                      37°C
                    </th>
                    <th className="p-2 border-r border-slate-700 font-bold text-center bg-red-950/40 text-red-300">
                      AHG
                    </th>
                    <th className="p-2 border-r border-slate-700 font-bold text-center bg-slate-800 text-slate-300">
                      CC
                    </th>
                    {showEnzymeColumn && (
                      <th className="p-2 font-bold text-center bg-purple-950/40 text-purple-300">
                        Ficin AHG
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {scenario.panelCells.map((cell) => {
                    const isReactive = cell.ahgReaction !== '0' && !cell.ahgReaction.includes('0');

                    return (
                      <tr
                        key={cell.cellNumber}
                        className={`hover:bg-slate-800/50 transition ${
                          isReactive ? 'bg-red-950/10' : 'bg-transparent'
                        }`}
                      >
                        <td className="p-2 border-r border-slate-800 text-center font-bold text-slate-300 sticky left-0 bg-slate-900/95 z-10">
                          {cell.cellNumber}
                        </td>
                        <td className="p-2 border-r border-slate-800 text-slate-300 font-mono text-[11px] sticky left-12 bg-slate-900/95 z-10">
                          {cell.donorLot}
                        </td>

                        {/* Antigen Cells */}
                        {ANTIGEN_COLUMNS.map((col) => {
                          const hasAg = cell.antigens[col.name];
                          const zygosity = getAntigenZygosity(col.name, cell.antigens);
                          const isRuledOut = ruledOutAntigens.includes(col.name);

                          return (
                            <td
                              key={col.name}
                              className={`p-1.5 border-r border-slate-800 text-center font-mono text-[11px] ${
                                isRuledOut ? 'text-slate-600 line-through bg-slate-950/30' : ''
                              } ${
                                hasAg && zygosity === 'Homozygous' && col.dosage
                                  ? 'text-amber-300 font-bold'
                                  : hasAg
                                  ? 'text-slate-200'
                                  : 'text-slate-600'
                              }`}
                            >
                              {hasAg ? '+' : '0'}
                            </td>
                          );
                        })}

                        {/* Reactions */}
                        <td className="p-2 border-r border-slate-800 text-center font-bold text-indigo-300">
                          {cell.isReaction}
                        </td>
                        <td className="p-2 border-r border-slate-800 text-center font-bold text-blue-300">
                          {cell.phase37Reaction}
                        </td>
                        <td
                          className={`p-2 border-r border-slate-800 text-center font-bold ${
                            isReactive ? 'text-red-400 bg-red-950/30' : 'text-slate-400'
                          }`}
                        >
                          {cell.ahgReaction}
                        </td>
                        <td className="p-2 border-r border-slate-800 text-center font-bold text-emerald-400">
                          {cell.checkCells}
                        </td>
                        {showEnzymeColumn && (
                          <td className="p-2 text-center font-bold text-purple-300 bg-purple-950/20">
                            {cell.ficinAhgReaction || '—'}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Candidate Identification & Rule of Three Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Rule-Out Checklist & Strikethrough Staging */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 lg:col-span-2">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                  <Search className="w-4 h-4 text-red-400" />
                  Candidate Alloantibody Identification Bench
                </h3>
                <span className="text-[11px] text-slate-400">Select antibodies consistent with panel pattern</span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {ANTIGEN_COLUMNS.map((col) => {
                  const isSelected = selectedAntibodies.includes(col.name);
                  const isRuledOut = ruledOutAntigens.includes(col.name);
                  const isTarget = scenario.targetAntibodies.includes(col.name);

                  return (
                    <button
                      key={col.name}
                      onClick={() => toggleSelectAntibody(col.name)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-900/30'
                          : isRuledOut
                          ? 'bg-slate-900 text-slate-500 border-slate-800 line-through opacity-60'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                      }`}
                    >
                      Anti-{col.name}
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    </button>
                  );
                })}
              </div>

              {/* Dosage Warnings Alert Box */}
              {ruledOutAntigens.some((ag) => autoRuleOuts[ag]?.dosageWarning) && (
                <div className="p-3 bg-amber-950/30 border border-amber-500/40 rounded-lg flex items-start gap-3 text-xs text-amber-200">
                  <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-semibold">Dosage Rule Warning:</strong>
                    One or more dosage-dependent antigens (
                    {ruledOutAntigens.filter((ag) => autoRuleOuts[ag]?.dosageWarning).join(', ')}
                    ) were ruled out using heterozygous cells only without homozygous confirmation. Weak dosage-dependent antibodies may be falsely eliminated!
                  </div>
                </div>
              )}
            </div>

            {/* Rule of Three (3+ / 3-) Statistical Gauge */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-emerald-400" />
                Rule of Three (p &lt; 0.05) Verification
              </h3>

              {selectedAntibodies.length === 0 ? (
                <p className="text-xs text-slate-400 italic">
                  Select candidate antibodies from the bench to verify Fisher's exact 3+ and 3- statistical criteria.
                </p>
              ) : (
                <div className="space-y-3">
                  {selectedAntibodies.map((ag) => {
                    const stat = evaluateRuleOfThree(ag, scenario.panelCells);

                    return (
                      <div key={ag} className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-xs">
                        <div className="flex items-center justify-between mb-1.5">
                          <strong className="text-slate-200">Anti-{ag}</strong>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              stat.isConfirmedRuleOfThree
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-red-500/20 text-red-300 border border-red-500/30'
                            }`}
                          >
                            {stat.isConfirmedRuleOfThree ? 'Rule of 3 Met (p ≤ 0.05)' : 'Rule of 3 Not Met'}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                          <div>
                            Positive Reactive: <span className="text-slate-200 font-bold">{stat.positiveReactiveCount} / 3</span>
                          </div>
                          <div>
                            Negative Non-Reactive: <span className="text-slate-200 font-bold">{stat.negativeNonReactiveCount} / 3</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Ficin Enzyme Treatment Differential */}
      {activeTab === 'enzymes' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
            <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-purple-400" />
              Proteolytic Enzyme (Ficin / Papain) Digestion Reference
            </h2>
            <p className="text-sm text-slate-400 mb-4">
              Enzymes cleave sialic acid-rich glycoprotein residues from the RBC membrane, destroying specific antigen structures while unmasking and enhancing others.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-red-950/20 border border-red-500/30 rounded-xl">
                <span className="text-red-300 font-bold uppercase tracking-wider block mb-2">
                  ❌ Destroyed / Cleaved
                </span>
                <p className="text-slate-300 mb-2">
                  Duffy (Fya, Fyb), MNS (M, N, S). Reactions are completely abolished following enzyme treatment.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {ENZYME_DESTROYED_ANTIGENS.map((ag) => (
                    <span key={ag} className="px-2 py-0.5 bg-red-500/20 text-red-300 rounded font-mono text-[11px]">
                      {ag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl">
                <span className="text-emerald-300 font-bold uppercase tracking-wider block mb-2">
                  ⚡ Enhanced / Unmasked
                </span>
                <p className="text-slate-300 mb-2">
                  Rh (D, C, E, c, e), Kidd (Jka, Jkb), Lewis (Lea, Leb), P1, I. Reactions increase in avidity and grade (e.g. 1+ → 3+/4+).
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {ENZYME_ENHANCED_ANTIGENS.map((ag) => (
                    <span key={ag} className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-mono text-[11px]">
                      {ag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-blue-950/20 border border-blue-500/30 rounded-xl">
                <span className="text-blue-300 font-bold uppercase tracking-wider block mb-2">
                  🛡️ Unaffected / Resistant
                </span>
                <p className="text-slate-300 mb-2">
                  Kell (K, k, Kpa, Kpb). Agglutination strength remains unaltered between untreated and enzyme panels.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {ENZYME_UNAFFECTED_ANTIGENS.map((ag) => (
                    <span key={ag} className="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded font-mono text-[11px]">
                      {ag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Case Specific Note */}
            <div className="mt-5 p-4 bg-slate-950 rounded-xl border border-slate-800">
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">
                Case Scenario Enzyme Differential Note
              </h4>
              <p className="text-xs text-slate-300">{scenario.enzymeUtilityNote}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Donor Blood Screening & Crossmatch */}
      {activeTab === 'crossmatch' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input & Unit Calculation */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-3 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-cyan-400" />
                Antigen-Negative Unit Screening Formula
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Calculate the number of donor units that must be screened to find compatible antigen-negative units:
                <br />
                <code className="text-cyan-300 font-mono">
                  N_screen = Units Requested / [Product of Antigen-Negative Frequencies]
                </code>
              </p>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Units of Packed Red Blood Cells (PRBCs) Requested:
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={unitsRequested}
                    onChange={(e) => setUnitsRequested(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-32 bg-slate-800 border border-slate-700 text-slate-100 rounded-lg px-3 py-1.5 text-sm font-bold focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400 block font-semibold mb-2">Target Antibody Antigen Frequencies:</span>
                  {donorScreening.antigenFrequencies.length === 0 ? (
                    <span className="text-xs text-slate-500 italic">No antibodies selected yet.</span>
                  ) : (
                    <div className="space-y-1.5">
                      {donorScreening.antigenFrequencies.map((af) => (
                        <div key={af.antigen} className="flex items-center justify-between text-xs">
                          <span className="text-slate-300 font-medium">Anti-{af.antigen}</span>
                          <span className="text-slate-400 font-mono">
                            {(af.frequencyPositive * 100).toFixed(1)}% pos •{' '}
                            <strong className="text-emerald-400">{(af.frequencyNegative * 100).toFixed(1)}% neg</strong>
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Probability Compatible</span>
                    <span className="text-xl font-bold text-cyan-400">
                      {(donorScreening.probabilityCompatible * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Units to Screen</span>
                    <span className="text-xl font-bold text-red-400">{donorScreening.unitsToScreen} Units</span>
                  </div>
                </div>

                <button
                  onClick={() => setCrossmatchExecuted(true)}
                  className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold text-xs shadow-lg shadow-red-900/30 transition flex items-center justify-center gap-2"
                >
                  <TestTube className="w-4 h-4" />
                  Execute Full Serological AHG Crossmatch
                </button>
              </div>
            </div>

            {/* Crossmatch Results */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Crossmatch Testing Verification
              </h3>

              {!crossmatchExecuted ? (
                <div className="h-64 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-800 rounded-xl">
                  <TestTube className="w-10 h-10 text-slate-600 mb-2" />
                  <p className="text-xs text-slate-400">
                    Click "Execute Full Serological AHG Crossmatch" to simulate unit screening and Coombs crossmatching.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 text-xs">
                  <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-xl text-emerald-300">
                    <span className="font-bold block mb-1">Crossmatch Protocol Selected:</span>
                    <span className="text-xs text-slate-300">{donorScreening.rationale}</span>
                  </div>

                  <div className="space-y-2">
                    <span className="font-semibold text-slate-300 block">Screened & Selected PRBC Units:</span>
                    {Array.from({ length: unitsRequested }).map((_, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-slate-400">Unit #{idx + 10452}</span>
                          <span className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded font-semibold text-[10px]">
                            {scenario.patientProfile.aboRh} Compatible
                          </span>
                        </div>
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          COMPATIBLE (AHG 0)
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400">
                    <strong className="text-slate-200 block mb-1">AABB Standard 5.16 Compliance:</strong>
                    Antigen-negative confirmation by licensed commercial antisera verified. Patient serum incubated with donor segment RBCs through AHG phase with zero agglutination (0). Check cells validated (2+).
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Debrief Modal */}
      {showDebriefModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-6 h-6 text-amber-400" />
                <h3 className="text-lg font-bold text-white">Transfusion Medicine Faculty Debrief</h3>
              </div>
              <button
                onClick={() => setShowDebriefModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
              <div>
                <span className="text-xs text-slate-400 block font-semibold">Competency Evaluation</span>
                <span className="text-2xl font-bold text-white">{debrief.scorePercentage}%</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block font-semibold">Grade</span>
                <span
                  className={`text-2xl font-black ${
                    debrief.letterGrade === 'A+' || debrief.letterGrade === 'A'
                      ? 'text-emerald-400'
                      : debrief.letterGrade === 'B'
                      ? 'text-blue-400'
                      : debrief.letterGrade === 'C'
                      ? 'text-amber-400'
                      : 'text-red-500'
                  }`}
                >
                  {debrief.letterGrade}
                </span>
              </div>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Itemized Faculty Feedback:</h4>
              {debrief.facultyFeedback.map((fb, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg text-xs border ${
                    fb.startsWith('Critical') || fb.startsWith('Fatal')
                      ? 'bg-red-950/30 border-red-500/40 text-red-200'
                      : fb.startsWith('Excellent')
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                      : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  {fb}
                </div>
              ))}
            </div>

            <div className="border-t border-slate-800 pt-4 flex justify-end">
              <button
                onClick={() => setShowDebriefModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
