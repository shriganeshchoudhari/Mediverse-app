"use client";

import React, { useState, useMemo } from "react";
import styles from "./CommunityLabViewer.module.css";
import {
  Activity,
  Flame,
  Zap,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Maximize2,
  Minimize2,
  ShieldAlert,
  Search,
  Globe,
  BarChart3,
  TrendingUp,
  Percent,
  Calculator,
  ShieldCheck,
} from "lucide-react";

export type CommunityLabMode = "screening" | "studyDesigns" | "infectiousDynamics" | "preventionDemography";

export interface CommunityLabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  formulaOrDefinition: string;
  epidemiologicalSignificance: string;
  clinicalExampleOrBias: string;
  highYieldPearl: string;
}

export const COMMUNITY_NODES: Record<CommunityLabMode, CommunityLabNode[]> = {
  screening: [
    {
      id: "sensitivity-specificity",
      name: "1. Sensitivity (SnNOut) vs Specificity (SpPIn)",
      category: "Diagnostic Accuracy",
      subType: "True Positive Rate vs True Negative Rate",
      formulaOrDefinition: "Sensitivity = TP / (TP + FN); Specificity = TN / (TN + FP).",
      epidemiologicalSignificance: "Sensitivity is critical for initial mass screening (ELISA, Pap smear); Specificity is critical for confirmation (Western Blot, Biopsy).",
      clinicalExampleOrBias: "A high-sensitivity test has few false negatives (SnNOut: negative result rules OUT disease). A high-specificity test has few false positives (SpPIn: positive result rules IN disease).",
      highYieldPearl: "Sensitivity and Specificity are intrinsic properties of a diagnostic test and do NOT change with disease prevalence."
    },
    {
      id: "ppv-npv-prevalence",
      name: "2. Positive (PPV) & Negative (NPV) Predictive Values",
      category: "Predictive Probability",
      subType: "Prevalence-Dependent Clinical Utility",
      formulaOrDefinition: "PPV = TP / (TP + FP); NPV = TN / (TN + FN).",
      epidemiologicalSignificance: "PPV rises when disease prevalence increases in the tested population. NPV falls when disease prevalence increases.",
      clinicalExampleOrBias: "Screening a high-risk STD clinic population yields higher PPV than screening the general healthy population with the exact same test.",
      highYieldPearl: "As disease prevalence increases: PPV increases and NPV decreases. When prevalence drops to near-zero, most positive tests are false positives."
    },
    {
      id: "roc-curves-auc",
      name: "3. Receiver Operating Characteristic (ROC) Curves",
      category: "Test Performance Optimization",
      subType: "Sensitivity vs (1 - Specificity) Plot",
      formulaOrDefinition: "Y-axis = Sensitivity (True Positive Rate); X-axis = 1 - Specificity (False Positive Rate).",
      epidemiologicalSignificance: "Area Under the Curve (AUC) reflects global diagnostic accuracy (1.0 = perfect test, 0.50 = random chance/useless).",
      clinicalExampleOrBias: "Shifting the diagnostic cutoff threshold to the left increases Sensitivity at the expense of Specificity.",
      highYieldPearl: "The closer the ROC curve bows toward the upper-left corner of the plot, the higher its diagnostic discriminatory power."
    }
  ],

  studyDesigns: [
    {
      id: "case-control-odds",
      name: "1. Case-Control Studies & Odds Ratio (OR)",
      category: "Observational Epidemiology",
      subType: "Retrospective • Disease Status Grouping",
      formulaOrDefinition: "Odds Ratio (OR) = (a * d) / (b * c). Grouped by presence vs absence of disease.",
      epidemiologicalSignificance: "Ideal design for studying rare diseases or conditions with long latency periods; calculates Odds Ratio, NOT Relative Risk.",
      clinicalExampleOrBias: "Highly prone to Recall Bias (cases remember prior exposures more meticulously than controls) and Berkson Selection Bias.",
      highYieldPearl: "Case-control studies select patients based on Disease outcome and look backwards for Exposure; they can never directly calculate disease incidence."
    },
    {
      id: "cohort-relative-risk",
      name: "2. Cohort Studies & Relative Risk (RR)",
      category: "Observational Epidemiology",
      subType: "Longitudinal • Exposure Status Grouping",
      formulaOrDefinition: "Relative Risk (RR) = [a / (a+b)] / [c / (c+d)]; Attributable Risk (AR) = Ie - Iu.",
      epidemiologicalSignificance: "Gold-standard observational design for rare exposures; directly measures true disease Incidence and temporal causality.",
      clinicalExampleOrBias: "Prone to Loss to Follow-up Bias (attrition bias) and is inefficient for evaluating extremely rare disease outcomes.",
      highYieldPearl: "Cohort studies select disease-free individuals based on Exposure status and follow them forward in time to measure incident disease."
    },
    {
      id: "rct-nnt-arr",
      name: "3. Randomized Controlled Trials (RCTs) & NNT",
      category: "Experimental Epidemiology",
      subType: "Interventional • Random Allocation & Blinding",
      formulaOrDefinition: "ARR = |I_control - I_treatment|; NNT = 1 / ARR; NNH = 1 / AR.",
      epidemiologicalSignificance: "Gold standard for evaluating therapeutic efficacy; eliminates confounding through random assignment and double-blinding.",
      clinicalExampleOrBias: "If drug reduces 5-year mortality from 20% to 15%: ARR = 5% (0.05); NNT = 1 / 0.05 = 20 patients treated to prevent 1 death.",
      highYieldPearl: "Number Needed to Treat (NNT) is always rounded UP to the nearest whole integer; a lower NNT signifies a more potent clinical intervention."
    }
  ],

  infectiousDynamics: [
    {
      id: "r0-herd-immunity",
      name: "1. Basic Reproduction Number (R0) & Herd Immunity",
      category: "Transmission Dynamics",
      subType: "Epidemic Potential • Critical Vaccination Coverage",
      formulaOrDefinition: "Herd Immunity Threshold (HIT) = 1 - (1 / R0).",
      epidemiologicalSignificance: "Quantifies the proportion of a population that must be immune to prevent sustained pathogen transmission in a community.",
      clinicalExampleOrBias: "Measles (R0 = 12-18) requires 94-95% immunity; COVID-19 Delta/Omicron (R0 = 5-8) requires 80-87% immunity.",
      highYieldPearl: "When the proportion of immune individuals exceeds the Herd Immunity Threshold, the effective reproduction number (Rt) drops below 1.0."
    },
    {
      id: "attack-rate-sar",
      name: "2. Attack Rate & Secondary Attack Rate (SAR)",
      category: "Outbreak Epidemiology",
      subType: "Incidence in Epidemics • Communicability Index",
      formulaOrDefinition: "SAR = (New cases among contacts / Total susceptible contacts) * 100.",
      epidemiologicalSignificance: "Secondary Attack Rate is the primary metric used by epidemiologists to measure the communicability / infectiousness of a disease.",
      clinicalExampleOrBias: "Food poisoning outbreak attack rate determines the culprit food item; Household SAR measures close contact transmission.",
      highYieldPearl: "The secondary attack rate excludes the primary index case from both the numerator and denominator."
    }
  ],

  preventionDemography: [
    {
      id: "levels-of-prevention",
      name: "1. The 5 Classical Levels of Prevention",
      category: "Preventive Medicine",
      subType: "Primordial • Primary • Secondary • Tertiary • Quaternary",
      formulaOrDefinition: "Primordial (social policies) -> Primary (vaccines) -> Secondary (screening) -> Tertiary (rehab) -> Quaternary (deprescribing).",
      epidemiologicalSignificance: "Categorizes interventions across the natural history of disease from pre-pathogenesis to rehabilitation.",
      clinicalExampleOrBias: "Childhood vaccination is Primary Prevention; Mammography / Pap smear is Secondary Prevention; Stroke PT is Tertiary Prevention.",
      highYieldPearl: "Secondary prevention involves early detection and prompt treatment of subclinical disease in asymptomatic individuals."
    },
    {
      id: "vital-demographics",
      name: "2. Vital Health Indicators (IMR, MMR & DALYs)",
      category: "Demography & Global Health",
      subType: "Population Health Metrics • Burden of Disease",
      formulaOrDefinition: "IMR = (Infant deaths <1 yr / Live births) * 1,000; DALY = YLL + YLD.",
      epidemiologicalSignificance: "Infant Mortality Rate (IMR) is the single most sensitive indicator of a nation's socioeconomic development and healthcare quality.",
      clinicalExampleOrBias: "Replacement-level Total Fertility Rate (TFR) is 2.1 children per woman; DALY combines premature mortality (YLL) with disability (YLD).",
      highYieldPearl: "One DALY represents the loss of the equivalent of one year of full health."
    }
  ]
};

interface CommunityLabViewerProps {
  initialMode?: CommunityLabMode;
  height?: string;
  onNodeSelect?: (node: CommunityLabNode) => void;
}

export default function CommunityLabViewer({
  initialMode = "screening",
  height = "560px",
  onNodeSelect,
}: CommunityLabViewerProps) {
  const [activeMode, setActiveMode] = useState<CommunityLabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Screening 2x2 State Sliders
  const [tp, setTp] = useState<number>(180);
  const [fp, setFp] = useState<number>(40);
  const [fn, setFn] = useState<number>(20);
  const [tn, setTn] = useState<number>(760);

  // Infectious R0 Slider
  const [rZero, setRZero] = useState<number>(4.0);

  // Calculations
  const sensitivity = useMemo(() => {
    const denom = tp + fn;
    return denom > 0 ? (tp / denom) * 100 : 0;
  }, [tp, fn]);

  const specificity = useMemo(() => {
    const denom = tn + fp;
    return denom > 0 ? (tn / denom) * 100 : 0;
  }, [tn, fp]);

  const ppv = useMemo(() => {
    const denom = tp + fp;
    return denom > 0 ? (tp / denom) * 100 : 0;
  }, [tp, fp]);

  const npv = useMemo(() => {
    const denom = tn + fn;
    return denom > 0 ? (tn / denom) * 100 : 0;
  }, [tn, fn]);

  const lrPlus = useMemo(() => {
    const sens = sensitivity / 100;
    const spec = specificity / 100;
    const denom = 1 - spec;
    return denom > 0 ? (sens / denom).toFixed(2) : "N/A";
  }, [sensitivity, specificity]);

  const lrMinus = useMemo(() => {
    const sens = sensitivity / 100;
    const spec = specificity / 100;
    return spec > 0 ? ((1 - sens) / spec).toFixed(2) : "N/A";
  }, [sensitivity, specificity]);

  const hitPercent = useMemo(() => {
    if (rZero <= 1.0) return 0;
    return ((1 - 1 / rZero) * 100).toFixed(1);
  }, [rZero]);

  // Dynamic SVG ROC Curve coordinates
  const rocOperatingPoint = useMemo(() => {
    const fpr = (100 - specificity) / 100; // 0 to 1
    const tpr = sensitivity / 100; // 0 to 1
    const width = 280;
    const height = 100;
    const x = fpr * width;
    const y = height - tpr * (height - 15) - 10;
    return { x: x.toFixed(1), y: y.toFixed(1) };
  }, [sensitivity, specificity]);

  const currentNodes = useMemo(() => {
    return COMMUNITY_NODES[activeMode] || COMMUNITY_NODES.screening;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: CommunityLabNode) => {
    if (isQuizMode && quizTargetNodeId) {
      if (node.id === quizTargetNodeId) {
        setQuizScore((prev) => ({ correct: prev.correct + 1, total: prev.total + 1 }));
        setQuizFeedback(`Correct! You identified ${node.name}.`);
        setTimeout(() => nextQuizQuestion(), 1500);
      } else {
        setQuizScore((prev) => ({ correct: prev.correct, total: prev.total + 1 }));
        setQuizFeedback(`Incorrect. Find ${currentNodes.find((n) => n.id === quizTargetNodeId)?.name}.`);
      }
    } else {
      setActiveNodeId(node.id);
      if (onNodeSelect) {
        onNodeSelect(node);
      }
    }
  };

  const startQuiz = () => {
    setIsQuizMode(true);
    const randomNode = currentNodes[Math.floor(Math.random() * currentNodes.length)];
    setQuizTargetNodeId(randomNode.id);
    setQuizFeedback(null);
  };

  const nextQuizQuestion = () => {
    const randomNode = currentNodes[Math.floor(Math.random() * currentNodes.length)];
    setQuizTargetNodeId(randomNode.id);
    setQuizFeedback(null);
  };

  const toggleQuizMode = () => {
    if (!isQuizMode) {
      startQuiz();
    } else {
      setIsQuizMode(false);
      setQuizTargetNodeId(null);
      setQuizFeedback(null);
    }
  };

  const quizTargetNode = useMemo(() => {
    return currentNodes.find((n) => n.id === quizTargetNodeId) || null;
  }, [currentNodes, quizTargetNodeId]);

  return (
    <div
      className={styles.container}
      style={{ height: isFullscreen ? "100vh" : "auto" }}
    >
      {/* Top Header Bar */}
      <div className={styles.headerBar}>
        <div className={styles.titleArea}>
          <span className={styles.modeBadge}>
            <Globe size={14} /> COMM-201
          </span>
          <span className={styles.titleText}>
            {activeMode === "screening" && "Diagnostic Screening, 2x2 Matrix & Dynamic ROC Curve"}
            {activeMode === "studyDesigns" && "Epidemiological Study Designs (Cohort, Case-Control, RCTs)"}
            {activeMode === "infectiousDynamics" && "Infectious Disease Transmission & Herd Immunity Threshold"}
            {activeMode === "preventionDemography" && "Levels of Prevention, Demography & Biases"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Public Health Quiz"}
          </button>

          <button
            className={styles.btn}
            onClick={() => setIsFullscreen(!isFullscreen)}
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className={styles.mainLayout}>
        {/* Left Side: Interactive Lab Workspaces */}
        <div className={styles.labCanvas}>
          {/* Quiz Prompt Banner */}
          {isQuizMode && quizTargetNode && (
            <div className={styles.quizBanner}>
              <div>
                <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                  Public Health Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Concept / Metric: {quizTargetNode.epidemiologicalSignificance}
                </div>
                {quizFeedback && (
                  <div className="text-xs text-emerald-300 font-medium mt-1">{quizFeedback}</div>
                )}
              </div>
              <button
                onClick={nextQuizQuestion}
                className="px-3 py-1 bg-emerald-950 text-xs rounded border border-emerald-700 text-emerald-200"
              >
                Next
              </button>
            </div>
          )}

          {/* Interactive Screening 2x2 & ROC Simulator */}
          {activeMode === "screening" && (
            <div className={styles.screenSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Calculator size={14} /> Interactive 2x2 Contingency Matrix & Screening Calculator
                </span>
                <span className="text-[11px] text-slate-400">Total Sample: {tp + fp + fn + tn}</span>
              </div>

              {/* Sliders Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>True Pos (TP):</span> <strong className="text-emerald-400">{tp}</strong>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="500"
                    step="5"
                    value={tp}
                    onChange={(e) => setTp(parseInt(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>False Pos (FP):</span> <strong className="text-emerald-400">{fp}</strong>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="200"
                    step="5"
                    value={fp}
                    onChange={(e) => setFp(parseInt(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>False Neg (FN):</span> <strong className="text-emerald-400">{fn}</strong>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    step="5"
                    value={fn}
                    onChange={(e) => setFn(parseInt(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>True Neg (TN):</span> <strong className="text-emerald-400">{tn}</strong>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="1000"
                    step="10"
                    value={tn}
                    onChange={(e) => setTn(parseInt(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>
              </div>

              {/* Real-time Diagnostic Outputs */}
              <div className={styles.screenResultsGrid}>
                <div className={styles.screenResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Sensitivity (SnNOut)</div>
                  <div className={styles.screenResultVal}>{sensitivity.toFixed(1)}%</div>
                </div>
                <div className={styles.screenResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Specificity (SpPIn)</div>
                  <div className={styles.screenResultVal}>{specificity.toFixed(1)}%</div>
                </div>
                <div className={styles.screenResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Positive Pred. (PPV)</div>
                  <div className={styles.screenResultVal}>{ppv.toFixed(1)}%</div>
                </div>
                <div className={styles.screenResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Negative Pred. (NPV)</div>
                  <div className={styles.screenResultVal}>{npv.toFixed(1)}%</div>
                </div>
                <div className={styles.screenResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Likelihood Ratio (LR+)</div>
                  <div className={styles.screenResultVal}>{lrPlus}</div>
                </div>
              </div>

              {/* Dynamic ROC Curve Visualizer */}
              <div className="mt-2 p-3 bg-emerald-950/80 rounded-lg border border-emerald-800">
                <div className="flex justify-between items-center text-[11px] text-emerald-300 mb-1">
                  <span className="font-bold flex items-center gap-1">
                    <TrendingUp size={12} /> Receiver Operating Characteristic (ROC) Performance Plot
                  </span>
                  <span>TPR: {sensitivity.toFixed(1)}% • FPR: {(100 - specificity).toFixed(1)}%</span>
                </div>
                <svg viewBox="0 0 280 100" className="w-full h-24 stroke-emerald-400 fill-none">
                  {/* Chance 45 deg line */}
                  <line x1="0" y1="90" x2="280" y2="10" stroke="rgba(148, 163, 184, 0.3)" strokeDasharray="4 4" />
                  {/* Typical Diagnostic ROC Arc */}
                  <path d="M 0,90 Q 30,15 280,10" stroke="#34d399" strokeWidth="2.5" />
                  {/* Operating Point Marker */}
                  <circle cx={rocOperatingPoint.x} cy={rocOperatingPoint.y} r="5" fill="#f43f5e" stroke="#ffffff" strokeWidth="1.5" />
                </svg>
                <div className="flex justify-between text-[10px] text-emerald-400 mt-1">
                  <span>0.0 (High Specificity)</span>
                  <span className="text-rose-400 font-bold">🔴 Current Test Cutoff</span>
                  <span>1.0 (High Sensitivity)</span>
                </div>
              </div>
            </div>
          )}

          {/* Interactive R0 Herd Immunity Simulator */}
          {activeMode === "infectiousDynamics" && (
            <div className={styles.screenSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck size={14} /> Basic Reproduction Number (R0) & Herd Immunity Threshold Simulator
                </span>
                <span className="text-[11px] text-slate-400">Equation: HIT = 1 - (1 / R0)</span>
              </div>

              <div className="text-xs">
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Basic Reproduction Number (R0):</span>{" "}
                  <strong className="text-emerald-400 text-sm">R0 = {rZero.toFixed(1)}</strong>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="18.0"
                  step="0.5"
                  value={rZero}
                  onChange={(e) => setRZero(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div className={styles.screenResultsGrid}>
                <div className={styles.screenResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Herd Immunity Threshold (HIT)</div>
                  <div className={styles.screenResultVal}>{hitPercent}%</div>
                </div>
                <div className={styles.screenResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Epidemic Dynamics</div>
                  <div className="text-sm font-bold text-emerald-300 mt-1">
                    {rZero <= 1.0 ? "Self-Limiting / Dies Out" : rZero < 3.0 ? "Moderate Outbreak" : "High Epidemic Potential"}
                  </div>
                </div>
                <div className={styles.screenResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Pathogen Benchmark</div>
                  <div className="text-xs font-bold text-emerald-300 mt-1">
                    {rZero >= 12 ? "Measles (R0~12-18)" : rZero >= 5 ? "COVID Omicron / Polio" : rZero >= 3 ? "SARS / Smallpox" : "Seasonal Flu (R0~1.5)"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Node Selection Grid */}
          <div className={styles.nodeGrid}>
            {currentNodes.map((node) => {
              const isSelected = activeNode.id === node.id;

              return (
                <div
                  key={node.id}
                  onClick={() => handleNodeClick(node)}
                  className={`${styles.nodeCard} ${isSelected ? styles.nodeCardSelected : ""}`}
                >
                  <div className={styles.nodeHeader}>
                    <span className={styles.categoryBadge}>{node.category}</span>
                  </div>

                  <div>
                    <div className={styles.nodeTitle}>{node.name}</div>
                    <div className={styles.nodeSub}>{node.subType}</div>
                  </div>

                  <div className="text-[11px] text-slate-300 font-medium bg-emerald-950/60 p-2 rounded border border-emerald-800">
                    <span className="text-emerald-400 font-bold">Key Formula:</span> {node.formulaOrDefinition}
                  </div>

                  <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400">
                    <span>Inspect epidemiological principles</span>
                    <ArrowRight size={12} className="text-slate-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: High-Yield Public Health Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Public Health Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🎯 Concept Identity & Subtype</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>📐 Formula / Definition</div>
            <div className={styles.inspectorBody}>{activeNode.formulaOrDefinition}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🌐 Epidemiological Significance</div>
            <div className={styles.inspectorBody}>{activeNode.epidemiologicalSignificance}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🏥 Clinical Example / Bias Hazard</div>
            <div className={styles.inspectorBody}>{activeNode.clinicalExampleOrBias}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 USMLE / NMC High-Yield Pearl</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearl}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("screening")}
          className={`${styles.modeTab} ${activeMode === "screening" ? styles.modeTabActive : ""}`}
        >
          📊 1. Screening 2x2 & ROC
        </button>
        <button
          onClick={() => setActiveMode("studyDesigns")}
          className={`${styles.modeTab} ${activeMode === "studyDesigns" ? styles.modeTabActive : ""}`}
        >
          🔬 2. Study Designs (OR/RR)
        </button>
        <button
          onClick={() => setActiveMode("infectiousDynamics")}
          className={`${styles.modeTab} ${activeMode === "infectiousDynamics" ? styles.modeTabActive : ""}`}
        >
          🛡️ 3. R0 & Herd Immunity
        </button>
        <button
          onClick={() => setActiveMode("preventionDemography")}
          className={`${styles.modeTab} ${activeMode === "preventionDemography" ? styles.modeTabActive : ""}`}
        >
          🌍 4. Prevention & Demography
        </button>
      </div>
    </div>
  );
}
