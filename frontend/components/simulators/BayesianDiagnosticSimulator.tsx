'use client';

import React, { useState, useMemo } from 'react';
import {
  Activity,
  Calculator,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sliders,
  DollarSign,
  Clock,
  ShieldAlert,
  Scale,
  Layers,
  BookOpen,
  Info,
} from 'lucide-react';
import {
  DiagnosticTest,
  CascadeStep,
  DiagnosticScenario,
  DIAGNOSTIC_SCENARIOS,
  calculateLikelihoodRatios,
  applyBayesianUpdate,
  computeDiagnosticCascade,
  computeContingencyTable,
  computePaukerKassirerThresholds,
  probabilityToOdds,
} from '../../.gemini/skills/BayesianDiagnosticEngine';

export default function BayesianDiagnosticSimulator() {
  // Scenario state
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(DIAGNOSTIC_SCENARIOS[0].id);
  const currentScenario = useMemo(() => {
    return DIAGNOSTIC_SCENARIOS.find((s) => s.id === selectedScenarioId) || DIAGNOSTIC_SCENARIOS[0];
  }, [selectedScenarioId]);

  // Pre-test probability state
  const [preTestProb, setPreTestProb] = useState<number>(currentScenario.defaultPreTestProb);

  // Active tests selection and results in cascade
  const [testResults, setTestResults] = useState<Record<string, 'positive' | 'negative'>>({
    'wells-pe': 'positive',
    'd-dimer-elisa': 'positive',
    'ctpa': 'positive',
    'lower-extremity-cocus': 'negative',
  });

  // Custom single-test evaluation state (for 2x2 and Fagan)
  const [activeTestId, setActiveTestId] = useState<string>(currentScenario.recommendedTests[0].id);
  const activeTest = useMemo(() => {
    return currentScenario.recommendedTests.find((t) => t.id === activeTestId) || currentScenario.recommendedTests[0];
  }, [currentScenario, activeTestId]);

  // Active tab
  const [activeTab, setActiveTab] = useState<'cascade' | 'fagan' | 'contingency' | 'pauker' | 'evidence'>('cascade');

  // Pauker-Kassirer sliders
  const [treatmentBenefit, setTreatmentBenefit] = useState<number>(75);
  const [treatmentHarm, setTreatmentHarm] = useState<number>(20);
  const [testHarm, setTestHarm] = useState<number>(5);

  // When scenario changes, sync defaults
  const handleScenarioChange = (id: string) => {
    setSelectedScenarioId(id);
    const scen = DIAGNOSTIC_SCENARIOS.find((s) => s.id === id);
    if (scen) {
      setPreTestProb(scen.defaultPreTestProb);
      setActiveTestId(scen.recommendedTests[0].id);
      const initialResults: Record<string, 'positive' | 'negative'> = {};
      scen.recommendedTests.forEach((t, idx) => {
        initialResults[t.id] = idx === 0 ? 'positive' : 'positive';
      });
      setTestResults(initialResults);
    }
  };

  // Toggle test result in cascade
  const toggleResult = (testId: string) => {
    setTestResults((prev) => ({
      ...prev,
      [testId]: prev[testId] === 'positive' ? 'negative' : 'positive',
    }));
  };

  // Compute multi-step cascade
  const cascadeSequence = useMemo(() => {
    return currentScenario.recommendedTests.map((test) => ({
      test,
      result: testResults[test.id] || 'positive',
    }));
  }, [currentScenario, testResults]);

  const cascadeOutput = useMemo(() => {
    return computeDiagnosticCascade(preTestProb, cascadeSequence);
  }, [preTestProb, cascadeSequence]);

  // Compute 2x2 Contingency Table for activeTest
  const contingencyTable = useMemo(() => {
    return computeContingencyTable(preTestProb, activeTest, 1000);
  }, [preTestProb, activeTest]);

  // Single test bayesian update for Fagan
  const singleTestPositive = useMemo(() => {
    return applyBayesianUpdate(preTestProb, activeTest, 'positive');
  }, [preTestProb, activeTest]);

  const singleTestNegative = useMemo(() => {
    return applyBayesianUpdate(preTestProb, activeTest, 'negative');
  }, [preTestProb, activeTest]);

  // Pauker-Kassirer thresholds
  const pkThresholds = useMemo(() => {
    return computePaukerKassirerThresholds(
      treatmentBenefit,
      treatmentHarm,
      testHarm,
      activeTest,
      preTestProb
    );
  }, [treatmentBenefit, treatmentHarm, testHarm, activeTest, preTestProb]);

  // Fagan Nomogram Y-coordinate helper: map probability (0.001 to 0.999) to SVG Y (10 to 390)
  // Using log-odds (logit) scale for linear nomogram ray projection!
  const probToFaganY = (p: number, height: number = 380, topMargin: number = 20): number => {
    const clamped = Math.min(Math.max(p, 0.001), 0.999);
    // logit(p) = ln(p / (1-p)) -> range for [0.001, 0.999] is approx [-6.9, +6.9]
    const logit = Math.log(clamped / (1 - clamped));
    const normalized = (logit + 6.9) / 13.8; // 0 (bottom, 0.1%) to 1 (top, 99.9%)
    // Invert because SVG Y increases downward
    return topMargin + (1 - normalized) * height;
  };

  // Map LR (0.001 to 1000) to SVG Y on middle axis
  const lrToFaganY = (lr: number, height: number = 380, topMargin: number = 20): number => {
    const clamped = Math.min(Math.max(lr, 0.001), 1000);
    // log10(lr) range from -3 to +3
    const logVal = Math.log10(clamped);
    const normalized = (logVal + 3) / 6;
    return topMargin + (1 - normalized) * height;
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 relative overflow-hidden backdrop-blur-sm">
        <div className="absolute -right-10 -top-10 w-56 h-56 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Track C8 • Evidence-Based Medicine &amp; Decision Theory
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <Activity className="w-3 h-3" /> Bayesian Engine Active
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Clinical Diagnostic Reasoning &amp; Bayesian Likelihood Ratio (LR) Workstation
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-3xl leading-relaxed">
              Model sequential diagnostic probability cascades, Fagan nomogram vector ray geometry, 
              2×2 natural frequency contingency matrices, and Pauker-Kassirer testing/treatment frontiers.
            </p>
          </div>

          {/* Quick Scenario Selector */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <label htmlFor="scenario-select" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Clinical Scenario:
            </label>
            <select
              id="scenario-select"
              aria-label="Select Clinical Scenario"
              value={selectedScenarioId}
              onChange={(e) => handleScenarioChange(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
            >
              {DIAGNOSTIC_SCENARIOS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Patient Demographic Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-500 block font-medium">Target Condition</span>
            <span className="text-indigo-400 font-semibold text-sm">{currentScenario.condition}</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 md:col-span-2">
            <span className="text-slate-500 block font-medium">Clinical Presentation</span>
            <span className="text-slate-300 font-medium">{currentScenario.clinicalPresentation}</span>
          </div>
        </div>
      </div>

      {/* Primary KPI & Probability Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Pre-Test Prob Slider */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
              <span>Pre-Test Probability (P)</span>
              <span className="text-indigo-400 font-bold text-sm">{(preTestProb * 100).toFixed(1)}%</span>
            </div>
            <input
              type="range"
              aria-label="Pre-Test Probability Slider"
              min={0.01}
              max={0.99}
              step={0.01}
              value={preTestProb}
              onChange={(e) => setPreTestProb(parseFloat(e.target.value))}
              className="w-full accent-indigo-500 h-2 bg-slate-800 rounded-lg cursor-pointer my-2"
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/60">
            <span>Pre-Test Odds:</span>
            <span className="font-mono text-slate-300">{probabilityToOdds(preTestProb).toFixed(3)} : 1</span>
          </div>
        </div>

        {/* Quick Pre-Test Presets */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-medium mb-2 block">Prevalence / Risk Tiers</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setPreTestProb(0.05)}
              className={`px-2 py-1.5 rounded-lg text-xs font-medium border transition ${
                preTestProb === 0.05
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
              }`}
            >
              Low (5%)
            </button>
            <button
              onClick={() => setPreTestProb(0.25)}
              className={`px-2 py-1.5 rounded-lg text-xs font-medium border transition ${
                preTestProb === 0.25
                  ? 'bg-amber-600 text-white border-amber-500'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
              }`}
            >
              Intermed (25%)
            </button>
            <button
              onClick={() => setPreTestProb(0.60)}
              className={`px-2 py-1.5 rounded-lg text-xs font-medium border transition ${
                preTestProb === 0.60
                  ? 'bg-rose-600 text-white border-rose-500'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
              }`}
            >
              High (60%)
            </button>
            <button
              onClick={() => setPreTestProb(currentScenario.defaultPreTestProb)}
              className="px-2 py-1.5 rounded-lg text-xs font-medium bg-indigo-950/60 text-indigo-300 border border-indigo-800 hover:bg-indigo-900/60 transition"
            >
              Reset Default
            </button>
          </div>
        </div>

        {/* Cascade Final Probability */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium block mb-1">Cascade Post-Test Prob</span>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-black ${
                cascadeOutput.finalProbability >= 0.85
                  ? 'text-rose-400'
                  : cascadeOutput.finalProbability <= 0.05
                  ? 'text-emerald-400'
                  : 'text-amber-400'
              }`}>
                {(cascadeOutput.finalProbability * 100).toFixed(1)}%
              </span>
              <span className="text-xs text-slate-500 font-mono">
                (Δ {((cascadeOutput.finalProbability - preTestProb) * 100).toFixed(1)}%)
              </span>
            </div>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
            <div
              className={`h-full transition-all duration-300 ${
                cascadeOutput.finalProbability >= 0.85
                  ? 'bg-rose-500'
                  : cascadeOutput.finalProbability <= 0.05
                  ? 'bg-emerald-500'
                  : 'bg-amber-500'
              }`}
              style={{ width: `${Math.min(cascadeOutput.finalProbability * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Pauker-Kassirer Decision Badge */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium block mb-1">Pauker-Kassirer Triage</span>
            <div className="flex items-center gap-2 mt-1">
              {pkThresholds.currentAction === 'TREAT_IMMEDIATELY' ? (
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" /> TREAT IMMEDIATELY
                </span>
              ) : pkThresholds.currentAction === 'TEST_INDICATED' ? (
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5">
                  <Calculator className="w-3.5 h-3.5" /> TEST INDICATED
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> NO TEST / WITHHOLD
                </span>
              )}
            </div>
          </div>
          <span className="text-[11px] text-slate-500 leading-tight block mt-2">
            Threshold: [{(pkThresholds.testingThreshold * 100).toFixed(0)}% - {(pkThresholds.treatmentThreshold * 100).toFixed(0)}%]
          </span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-800 space-x-2">
        <button
          onClick={() => setActiveTab('cascade')}
          className={`pb-3 px-4 text-xs font-semibold transition border-b-2 flex items-center gap-2 ${
            activeTab === 'cascade'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" /> Sequential Diagnostic Cascade
        </button>
        <button
          onClick={() => setActiveTab('fagan')}
          className={`pb-3 px-4 text-xs font-semibold transition border-b-2 flex items-center gap-2 ${
            activeTab === 'fagan'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" /> Interactive Fagan Nomogram
        </button>
        <button
          onClick={() => setActiveTab('contingency')}
          className={`pb-3 px-4 text-xs font-semibold transition border-b-2 flex items-center gap-2 ${
            activeTab === 'contingency'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Calculator className="w-4 h-4" /> 2×2 Natural Frequency Matrix
        </button>
        <button
          onClick={() => setActiveTab('pauker')}
          className={`pb-3 px-4 text-xs font-semibold transition border-b-2 flex items-center gap-2 ${
            activeTab === 'pauker'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Scale className="w-4 h-4" /> Pauker-Kassirer Decision Frontiers
        </button>
        <button
          onClick={() => setActiveTab('evidence')}
          className={`pb-3 px-4 text-xs font-semibold transition border-b-2 flex items-center gap-2 ${
            activeTab === 'evidence'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Clinical Evidence &amp; Pitfalls
        </button>
      </div>

      {/* TAB 1: Sequential Diagnostic Cascade */}
      {activeTab === 'cascade' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white">Diagnostic Multi-Step Testing Workflow</h3>
                <p className="text-xs text-slate-400">
                  Toggle test outcomes to observe compound Bayesian updating from initial suspicion to post-test probability.
                </p>
              </div>
              <button
                onClick={() => {
                  const resetObj: Record<string, 'positive' | 'negative'> = {};
                  currentScenario.recommendedTests.forEach((t) => {
                    resetObj[t.id] = 'positive';
                  });
                  setTestResults(resetObj);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset All Positive
              </button>
            </div>

            <div className="space-y-3">
              {cascadeOutput.steps.map((step, idx) => (
                <div
                  key={step.test.id}
                  className={`p-4 rounded-xl border transition ${
                    step.result === 'positive'
                      ? 'bg-slate-950/80 border-rose-500/30'
                      : 'bg-slate-950/80 border-emerald-500/30'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-indigo-400 shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">{step.test.name}</h4>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                            {step.test.turnaroundTime}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{step.test.description}</p>
                        <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                          <span>Sens: <strong className="text-slate-300">{(step.test.sensitivity * 100).toFixed(0)}%</strong></span>
                          <span>Spec: <strong className="text-slate-300">{(step.test.specificity * 100).toFixed(0)}%</strong></span>
                          <span>LR+: <strong className="text-rose-400">+{step.test.lrPositive}</strong></span>
                          <span>LR-: <strong className="text-emerald-400">{step.test.lrNegative}</strong></span>
                          <span>Cost: <strong className="text-slate-300">${step.test.costUsd}</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Result Toggle and Probability update */}
                    <div className="flex items-center gap-4 shrink-0 justify-between md:justify-end">
                      <button
                        onClick={() => toggleResult(step.test.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
                          step.result === 'positive'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 hover:bg-rose-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 hover:bg-emerald-500/30'
                        }`}
                      >
                        {step.result === 'positive' ? (
                          <>
                            <PlusIcon className="w-3.5 h-3.5" /> Positive Result (+LR)
                          </>
                        ) : (
                          <>
                            <MinusIcon className="w-3.5 h-3.5" /> Negative Result (-LR)
                          </>
                        )}
                      </button>

                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400">{(step.preTestProb * 100).toFixed(1)}%</span>
                          <ArrowRight className="w-3 h-3 text-slate-600" />
                          <span className={`text-base font-black ${
                            step.postTestProb >= 0.85
                              ? 'text-rose-400'
                              : step.postTestProb <= 0.05
                              ? 'text-emerald-400'
                              : 'text-amber-400'
                          }`}>
                            {(step.postTestProb * 100).toFixed(1)}%
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">
                          LR applied: {step.appliedLR}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cascade Summary Footer */}
            <div className="mt-5 p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-400">
                <span>Total Cumulative Test Workup Cost: </span>
                <strong className="text-white">
                  ${currentScenario.recommendedTests.reduce((acc, t) => acc + t.costUsd, 0)} USD
                </strong>
                <span className="mx-2">•</span>
                <span>Gold Standard: </span>
                <strong className="text-indigo-400">{currentScenario.clinicalGoldStandard}</strong>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">Final Recommendation:</span>
                <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                  cascadeOutput.finalProbability >= 0.85
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : cascadeOutput.finalProbability <= 0.05
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                }`}>
                  {cascadeOutput.finalProbability >= 0.85
                    ? 'Confirm Diagnosis & Initiate Targeted Protocol'
                    : cascadeOutput.finalProbability <= 0.05
                    ? 'Diagnosis Effectively Ruled Out (Discharge / Alt Dx)'
                    : 'Indeterminate Probability (Proceed to Gold Standard / Monitor)'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Interactive Fagan Nomogram */}
      {activeTab === 'fagan' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white">Interactive Fagan Nomogram Visualizer</h3>
              <p className="text-xs text-slate-400">
                Log-odds representation of Bayes theorem. A linear connecting ray passes from pre-test probability through the Likelihood Ratio to determine post-test probability.
              </p>
            </div>

            {/* Test Selector for Fagan */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Evaluate Test:</span>
              <select
                aria-label="Select Test for Fagan Evaluation"
                value={activeTestId}
                onChange={(e) => setActiveTestId(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none"
              >
                {currentScenario.recommendedTests.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} (LR+ {t.lrPositive}, LR- {t.lrNegative})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Fagan SVG Canvas */}
          <div className="w-full bg-slate-950 rounded-xl p-4 border border-slate-800 flex justify-center">
            <svg
              viewBox="0 0 600 420"
              className="w-full max-w-2xl h-auto select-none"
              style={{ maxHeight: '420px' }}
            >
              <defs>
                <linearGradient id="rayPosGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f43f5e" />
                  <stop offset="100%" stopColor="#e11d48" />
                </linearGradient>
                <linearGradient id="rayNegGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>

              {/* Background Grid Lines */}
              <line x1="80" y1="20" x2="80" y2="400" stroke="#334155" strokeWidth="2" />
              <line x1="300" y1="20" x2="300" y2="400" stroke="#334155" strokeWidth="2" />
              <line x1="520" y1="20" x2="520" y2="400" stroke="#334155" strokeWidth="2" />

              {/* Axis Titles */}
              <text x="80" y="14" fill="#94a3b8" fontSize="11" fontWeight="bold" textAnchor="middle">
                PRE-TEST PROB (%)
              </text>
              <text x="300" y="14" fill="#94a3b8" fontSize="11" fontWeight="bold" textAnchor="middle">
                LIKELIHOOD RATIO (LR)
              </text>
              <text x="520" y="14" fill="#94a3b8" fontSize="11" fontWeight="bold" textAnchor="middle">
                POST-TEST PROB (%)
              </text>

              {/* Pre-Test Probability Axis Ticks */}
              {[0.001, 0.01, 0.05, 0.1, 0.2, 0.3, 0.5, 0.7, 0.8, 0.9, 0.95, 0.99].map((val) => {
                const y = probToFaganY(val);
                return (
                  <g key={`pre-${val}`}>
                    <line x1="75" y1={y} x2="85" y2={y} stroke="#64748b" strokeWidth="1" />
                    <text x="70" y={y + 3} fill="#64748b" fontSize="9" textAnchor="end">
                      {(val * 100).toFixed(val < 0.01 ? 1 : 0)}%
                    </text>
                  </g>
                );
              })}

              {/* Middle Axis LR Ticks */}
              {[1000, 100, 50, 20, 10, 5, 2, 1, 0.5, 0.2, 0.1, 0.05, 0.01, 0.001].map((lrVal) => {
                const y = lrToFaganY(lrVal);
                return (
                  <g key={`lr-${lrVal}`}>
                    <line x1="295" y1={y} x2="305" y2={y} stroke="#64748b" strokeWidth="1" />
                    <text x="312" y={y + 3} fill="#64748b" fontSize="9" textAnchor="start">
                      {lrVal}
                    </text>
                  </g>
                );
              })}

              {/* Post-Test Probability Axis Ticks */}
              {[0.001, 0.01, 0.05, 0.1, 0.2, 0.3, 0.5, 0.7, 0.8, 0.9, 0.95, 0.99].map((val) => {
                const y = probToFaganY(val);
                return (
                  <g key={`post-${val}`}>
                    <line x1="515" y1={y} x2="525" y2={y} stroke="#64748b" strokeWidth="1" />
                    <text x="532" y={y + 3} fill="#64748b" fontSize="9" textAnchor="start">
                      {(val * 100).toFixed(val < 0.01 ? 1 : 0)}%
                    </text>
                  </g>
                );
              })}

              {/* Linear Vector Ray: Positive Test (Red/Rose) */}
              <line
                x1="80"
                y1={probToFaganY(preTestProb)}
                x2="520"
                y2={probToFaganY(singleTestPositive.postTestProb)}
                stroke="url(#rayPosGrad)"
                strokeWidth="3"
                strokeLinecap="round"
                opacity="0.9"
              />

              {/* Linear Vector Ray: Negative Test (Green) */}
              <line
                x1="80"
                y1={probToFaganY(preTestProb)}
                x2="520"
                y2={probToFaganY(singleTestNegative.postTestProb)}
                stroke="url(#rayNegGrad)"
                strokeWidth="3"
                strokeLinecap="round"
                opacity="0.9"
              />

              {/* Pre-Test Point Indicator */}
              <circle cx="80" cy={probToFaganY(preTestProb)} r="6" fill="#6366f1" stroke="#ffffff" strokeWidth="2" />

              {/* Middle Axis Positive LR Point */}
              <circle cx="300" cy={lrToFaganY(activeTest.lrPositive)} r="5" fill="#f43f5e" stroke="#ffffff" strokeWidth="1.5" />

              {/* Middle Axis Negative LR Point */}
              <circle cx="300" cy={lrToFaganY(activeTest.lrNegative)} r="5" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />

              {/* Post-Test Points */}
              <circle cx="520" cy={probToFaganY(singleTestPositive.postTestProb)} r="6" fill="#f43f5e" stroke="#ffffff" strokeWidth="2" />
              <circle cx="520" cy={probToFaganY(singleTestNegative.postTestProb)} r="6" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
            </svg>
          </div>

          {/* Fagan Live Readout Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-rose-500/30">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> If Test Result is POSITIVE (+)
                </span>
                <span className="text-xs font-mono text-rose-300">LR+ = {activeTest.lrPositive}</span>
              </div>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-xs text-slate-400">Post-Test Probability:</span>
                <span className="text-xl font-black text-rose-400">
                  {(singleTestPositive.postTestProb * 100).toFixed(1)}%
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Positive result shifts pre-test odds ({probabilityToOdds(preTestProb).toFixed(2)}) by {activeTest.lrPositive}× to post-test odds ({singleTestPositive.postTestOdds.toFixed(2)}).
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> If Test Result is NEGATIVE (-)
                </span>
                <span className="text-xs font-mono text-emerald-300">LR- = {activeTest.lrNegative}</span>
              </div>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-xs text-slate-400">Post-Test Probability:</span>
                <span className="text-xl font-black text-emerald-400">
                  {(singleTestNegative.postTestProb * 100).toFixed(1)}%
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Negative result shifts pre-test odds ({probabilityToOdds(preTestProb).toFixed(2)}) by {activeTest.lrNegative}× to post-test odds ({singleTestNegative.postTestOdds.toFixed(2)}).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: 2×2 Natural Frequency Matrix */}
      {activeTab === 'contingency' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white">2×2 Natural Frequency Matrix (Cohort: 1,000 Patients)</h3>
              <p className="text-xs text-slate-400">
                Eliminates the cognitive trap of the base-rate fallacy by visualizing concrete patient counts in each diagnostic quad.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Test:</span>
              <select
                aria-label="Select Test for 2x2 Matrix"
                value={activeTestId}
                onChange={(e) => setActiveTestId(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none"
              >
                {currentScenario.recommendedTests.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 2x2 Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Disease Present Column */}
            <div className="space-y-4">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 flex justify-between">
                <span>Disease PRESENT (D+)</span>
                <span className="text-indigo-400">{contingencyTable.truePositives + contingencyTable.falseNegatives} patients</span>
              </div>

              {/* True Positive */}
              <div className="bg-slate-950/80 p-4 rounded-xl border border-cyan-500/40">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-400">True Positives (TP)</span>
                  <span className="text-2xl font-black text-cyan-300">{contingencyTable.truePositives}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Correctly identified as having disease ({((contingencyTable.truePositives / (contingencyTable.truePositives + contingencyTable.falseNegatives)) * 100).toFixed(0)}% of diseased).
                </p>
              </div>

              {/* False Negative */}
              <div className="bg-slate-950/80 p-4 rounded-xl border border-rose-500/40">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-400">False Negatives (FN) — Missed Cases</span>
                  <span className="text-2xl font-black text-rose-300">{contingencyTable.falseNegatives}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Have disease but test was falsely negative. Dangerous clinical misses.
                </p>
              </div>
            </div>

            {/* Disease Absent Column */}
            <div className="space-y-4">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 flex justify-between">
                <span>Disease ABSENT (D-)</span>
                <span className="text-indigo-400">{contingencyTable.falsePositives + contingencyTable.trueNegatives} patients</span>
              </div>

              {/* False Positive */}
              <div className="bg-slate-950/80 p-4 rounded-xl border border-amber-500/40">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400">False Positives (FP) — False Alarms</span>
                  <span className="text-2xl font-black text-amber-300">{contingencyTable.falsePositives}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Healthy but tested positive. Suffer emotional distress, invasive follow-up.
                </p>
              </div>

              {/* True Negative */}
              <div className="bg-slate-950/80 p-4 rounded-xl border border-emerald-500/40">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400">True Negatives (TN)</span>
                  <span className="text-2xl font-black text-emerald-300">{contingencyTable.trueNegatives}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Correctly ruled out as disease-free. Reassurance and standard care.
                </p>
              </div>
            </div>
          </div>

          {/* Predictive Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block font-medium">Positive Pred Value (PPV)</span>
              <span className="text-lg font-bold text-white">{(contingencyTable.ppv * 100).toFixed(1)}%</span>
              <span className="text-[10px] text-slate-500 block">TP / (TP + FP)</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block font-medium">Negative Pred Value (NPV)</span>
              <span className="text-lg font-bold text-white">{(contingencyTable.npv * 100).toFixed(1)}%</span>
              <span className="text-[10px] text-slate-500 block">TN / (TN + FN)</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block font-medium">Overall Accuracy</span>
              <span className="text-lg font-bold text-white">{(contingencyTable.accuracy * 100).toFixed(1)}%</span>
              <span className="text-[10px] text-slate-500 block">(TP + TN) / Total</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block font-medium">Number Needed to Diagnose</span>
              <span className="text-lg font-bold text-indigo-400">{contingencyTable.numberNeededToDiagnose}</span>
              <span className="text-[10px] text-slate-500 block">1 / Youden Index</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Pauker-Kassirer Decision Frontiers */}
      {activeTab === 'pauker' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
          <div>
            <h3 className="text-base font-bold text-white">Pauker-Kassirer Threshold Decision Frontiers</h3>
            <p className="text-xs text-slate-400">
              Formulates clinical action boundaries balancing therapeutic benefit against procedural/treatment harm.
            </p>
          </div>

          {/* Sliders for Utility Parameters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Treatment Benefit (B_tx)</span>
                <span className="font-bold text-indigo-400">{treatmentBenefit}</span>
              </div>
              <input
                type="range"
                aria-label="Treatment Benefit Slider"
                min={10}
                max={100}
                value={treatmentBenefit}
                onChange={(e) => setTreatmentBenefit(parseInt(e.target.value))}
                className="w-full accent-indigo-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 block mt-1">Utility gained by curing true disease</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Treatment Harm/Risk (R_tx)</span>
                <span className="font-bold text-rose-400">{treatmentHarm}</span>
              </div>
              <input
                type="range"
                aria-label="Treatment Harm Slider"
                min={1}
                max={100}
                value={treatmentHarm}
                onChange={(e) => setTreatmentHarm(parseInt(e.target.value))}
                className="w-full accent-rose-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 block mt-1">Morbidity from treating healthy patient</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Test Morbidity/Cost (R_test)</span>
                <span className="font-bold text-amber-400">{testHarm}</span>
              </div>
              <input
                type="range"
                aria-label="Test Morbidity Slider"
                min={0}
                max={30}
                value={testHarm}
                onChange={(e) => setTestHarm(parseInt(e.target.value))}
                className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 block mt-1">Direct burden, radiation, or procedural risk</span>
            </div>
          </div>

          {/* Visual Continuum Bar */}
          <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4">
            <div className="flex justify-between text-xs text-slate-400">
              <span>0% (No Disease)</span>
              <span className="font-bold text-white">Disease Probability Continuum</span>
              <span>100% (Certain Disease)</span>
            </div>

            <div className="relative h-10 w-full bg-slate-800 rounded-xl overflow-hidden flex">
              {/* Zone 1: No Test No Treat */}
              <div
                style={{ width: `${pkThresholds.testingThreshold * 100}%` }}
                className="bg-emerald-900/60 border-r-2 border-emerald-500 h-full flex items-center justify-center text-[11px] font-bold text-emerald-300"
              >
                No Test / Withhold
              </div>

              {/* Zone 2: Test Indicated */}
              <div
                style={{ width: `${(pkThresholds.treatmentThreshold - pkThresholds.testingThreshold) * 100}%` }}
                className="bg-amber-900/50 border-r-2 border-amber-500 h-full flex items-center justify-center text-[11px] font-bold text-amber-300"
              >
                Diagnostic Test Zone
              </div>

              {/* Zone 3: Treat Immediately */}
              <div
                style={{ width: `${(1 - pkThresholds.treatmentThreshold) * 100}%` }}
                className="bg-rose-900/60 h-full flex items-center justify-center text-[11px] font-bold text-rose-300"
              >
                Treat Empirically
              </div>

              {/* Current Patient Marker */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-lg flex items-center justify-center"
                style={{ left: `${preTestProb * 100}%` }}
              >
                <div className="w-3 h-3 rounded-full bg-white border-2 border-slate-900 -mt-10" />
              </div>
            </div>

            <div className="flex justify-between text-xs font-mono">
              <span className="text-emerald-400 font-bold">
                T_test: {(pkThresholds.testingThreshold * 100).toFixed(1)}%
              </span>
              <span className="text-white font-bold">
                Current: {(preTestProb * 100).toFixed(1)}%
              </span>
              <span className="text-rose-400 font-bold">
                T_rx: {(pkThresholds.treatmentThreshold * 100).toFixed(1)}%
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              <strong className="text-white block mb-1">Decision Analysis Rationale:</strong>
              {pkThresholds.actionRationale}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Evidence & Pitfalls */}
      {activeTab === 'evidence' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-base font-bold text-white">Biostatistical Principles &amp; Clinical Pitfalls</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <h4 className="text-sm font-bold text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> The Base-Rate Fallacy in Medicine
              </h4>
              <p className="text-slate-300 leading-relaxed">
                When disease prevalence is very low (e.g. 1%), even a test with 95% sensitivity and 95% specificity will generate more 
                false positives than true positives (PPV ≈ 16%). Ordering tests without an elevated pre-test probability triggers cascades of 
                harmful, expensive workups.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <h4 className="text-sm font-bold text-indigo-400 flex items-center gap-1.5">
                <Info className="w-4 h-4" /> SnNOut vs SpPIn Heuristic
              </h4>
              <p className="text-slate-300 leading-relaxed">
                <strong>SnNOut:</strong> A test with high <strong>S</strong>e<strong>n</strong>sitivity and a <strong>N</strong>egative result rules <strong>Out</strong> disease (near-zero LR-). Example: D-dimer in low-risk PE.
                <br /><br />
                <strong>SpPIn:</strong> A test with high <strong>Sp</strong>ecificity and a <strong>P</strong>ositive result rules <strong>In</strong> disease (high LR+). Example: Temporal artery biopsy in GCA.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 md:col-span-2">
              <h4 className="text-sm font-bold text-slate-200">Scenario-Specific Clinical Pitfalls</h4>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
                {currentScenario.pitfalls.map((pf, i) => (
                  <li key={i}>{pf}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function MinusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
