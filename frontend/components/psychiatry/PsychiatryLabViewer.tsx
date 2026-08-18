"use client";

import React, { useState, useMemo } from "react";
import styles from "./PsychiatryLabViewer.module.css";
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
  Heart,
  Droplet,
  Calculator,
  TrendingUp,
  Brain,
  Smile,
  Frown,
  Meh,
  Shield,
  Stethoscope,
} from "lucide-react";

export type PsychiatryLabMode = "mseAffective" | "bipolar" | "psychosis" | "anxietyTrauma";

export interface PsychiatryLabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  clinicalAlgorithm: string;
  diagnosticCriteria: string;
  psychManagement: string;
  highYieldPearl: string;
}

export const PSYCHIATRY_NODES: Record<PsychiatryLabMode, PsychiatryLabNode[]> = {
  mseAffective: [
    {
      id: "mse-thought-process-content",
      name: "1. Mental Status Exam: Thought Process vs Content & Delusions",
      category: "Psychiatric Evaluation",
      subType: "Circumstantial vs Tangential • Flight of Ideas • Delusions of Reference",
      clinicalAlgorithm: "Circumstantiality (returns to goal) vs Tangentiality (never returns) vs Flight of Ideas (rapid puns in mania). Delusions: Fixed false beliefs (Cotard, Capgras).",
      diagnosticCriteria: "Perception: Hallucinations (Auditory 2nd/3rd person in Schizophrenia; Visual in Lewy Body/Delirium; Olfactory in temporal lobe epilepsy).",
      psychManagement: "Perform structured MSE including MMSE/MoCA cognitive screening, assess suicidal/homicidal ideation, and evaluate grade 1-6 insight.",
      highYieldPearl: "Delusions of reference occur when a patient falsely believes that innocuous external events or media broadcasts have direct personal significance."
    },
    {
      id: "mdd-sigecaps-subtypes",
      name: "2. Major Depressive Disorder (SIGECAPS) & Clinical Subtypes",
      category: "Depressive Disorders",
      subType: "SIGECAPS (>=5/9 for >=2 wks) • Melancholic vs Atypical (Leaden Paralysis)",
      clinicalAlgorithm: "Depressed mood / Anhedonia + >=5 SIGECAPS for >=2 weeks -> Assess for Atypical (leaden paralysis, overeating) vs Melancholic vs Psychotic -> SSRI + CBT.",
      diagnosticCriteria: "Atypical: Mood reactivity + leaden paralysis + hypersomnia + hyperphagia + rejection sensitivity. Melancholic: Severe anhedonia, early awakening, anorexia.",
      psychManagement: "1st-line SSRIs (Sertraline, Escitalopram) / SNRIs + CBT. Psychotic depression / severe melancholia with starvation -> Electroconvulsive Therapy (ECT).",
      highYieldPearl: "Atypical depression is characterized by mood reactivity (mood brightens to positive events) and leaden paralysis, responding well to SSRIs and MAOIs."
    }
  ],

  bipolar: [
    {
      id: "bipolar-digfast-classification",
      name: "1. Bipolar I vs Bipolar II Disorder & DIGFAST Mania",
      category: "Bipolar Spectrum",
      subType: "Bipolar I (Mania >=1 wk) • Bipolar II (Hypomania >=4 days + MDD) • DIGFAST",
      clinicalAlgorithm: "Bipolar I requires >=1 manic episode (severe impairment / hospitalization). Bipolar II requires hypomania (no psychosis/hospitalization) + MDD.",
      diagnosticCriteria: "DIGFAST: Distractibility, Irresponsibility/Impulsivity, Grandiosity, Flight of ideas, Activity increased, Sleep need decreased, Talkativeness (pressured speech).",
      psychManagement: "Acute Mania: Lithium / Valproate + Atypical Antipsychotic (Quetiapine, Olanzapine, Aripiprazole). Avoid antidepressant monotherapy (triggers mania switch).",
      highYieldPearl: "Bipolar I disorder requires only a single lifetime manic episode for diagnosis; a major depressive episode is NOT required."
    },
    {
      id: "lithium-toxicity-hemodialysis",
      name: "2. Lithium Pharmacokinetics, Nephrogenic DI & Toxicity (>1.5 mEq/L)",
      category: "Mood Stabilizers",
      subType: "Therapeutic (0.6–1.2 mEq/L) • Toxicity (>1.5 mEq/L) • Hemodialysis (>2.5 mEq/L)",
      clinicalAlgorithm: "Lithium + NSAIDs/Thiazides/Dehydration -> Serum level >1.5 mEq/L -> Coarse tremor, ataxia, confusion -> Level >2.5 or >4.0 -> Emergency Hemodialysis.",
      diagnosticCriteria: "Adverse effects: Nephrogenic Diabetes Insipidus (treat with Amiloride), Hypothyroidism (TSH monitoring), Ebstein anomaly in pregnancy.",
      psychManagement: "Stop Lithium + IV Isotonic Saline hydration. Emergency Hemodialysis if Lithium >4.0 mEq/L (or >2.5 mEq/L with severe neurotoxicity/renal failure).",
      highYieldPearl: "NSAIDs, Thiazide diuretics, and ACE inhibitors drastically reduce renal lithium clearance, rapidly precipitating life-threatening lithium toxicity."
    }
  ],

  psychosis: [
    {
      id: "schizophrenia-timeline-schizoaffective",
      name: "1. Schizophrenia Spectrum Timeline & Schizoaffective Disorder",
      category: "Psychotic Disorders",
      subType: "Brief Psychotic (<1 mo) • Schizophreniform (1-6 mo) • Schizophrenia (>=6 mo)",
      clinicalAlgorithm: "Psychosis timeline: <1 month (Brief Psychotic) -> 1-6 months (Schizophreniform) -> >=6 months (Schizophrenia). Schizoaffective: >=2 wks pure psychosis.",
      diagnosticCriteria: "Core criteria: >=2 of Delusions, Hallucinations, Disorganized speech, Grossly disorganized/catatonic behavior, Negative symptoms (5 As: Avolition, Alogia, etc.).",
      psychManagement: "Atypical Antipsychotics (Risperidone, Olanzapine, Aripiprazole). Treatment-Resistant Schizophrenia (failed >=2 trials) -> Clozapine (monitor ANC weekly).",
      highYieldPearl: "Schizoaffective disorder requires at least 2 weeks of delusions or hallucinations in the ABSENCE of prominent mood symptoms."
    },
    {
      id: "antipsychotic-eps-nms-emergency",
      name: "2. Antipsychotic Movement Complications: EPS & Neuroleptic Malignant Syndrome",
      category: "Neuroleptic Emergencies",
      subType: "Acute Dystonia (Diphenhydramine) • Akathisia (Propranolol) • NMS (Dantrolene)",
      clinicalAlgorithm: "Acute Dystonia (<4d) -> IM Diphenhydramine / Benztropine. Akathisia (<4wks) -> Propranolol. NMS (lead-pipe rigidity, fever, high CK) -> Dantrolene.",
      diagnosticCriteria: "Tardive Dyskinesia (>6mo): Orofacial choreoathetosis -> Valbenazine. NMS: Lead-pipe rigidity + hyperthermia (>40C) + autonomic instability + elevated CK.",
      psychManagement: "NMS: Stop neuroleptic immediately + ICU cooling + IV Dantrolene or Bromocriptine. Clozapine: Discontinue if ANC < 1000/uL.",
      highYieldPearl: "Acute dystonic reactions occur within hours to days of starting high-potency typical antipsychotics and respond immediately to IV/IM Diphenhydramine or Benztropine."
    }
  ],

  anxietyTrauma: [
    {
      id: "panic-gad-ocd-erp",
      name: "1. Anxiety Spectrum: Panic Disorder, GAD & OCD (ERP Protocol)",
      category: "Anxiety & Obsessive Disorders",
      subType: "Panic (Agoraphobia) • GAD (Buspirone) • OCD (High-Dose SSRI + ERP CBT)",
      clinicalAlgorithm: "Panic: Recurrent unexpected attacks -> SSRI + CBT. GAD: Worry >=6 months -> SSRI + Buspirone. OCD: Obsessions/Compulsions -> High-dose SSRI + ERP.",
      diagnosticCriteria: "Panic attack: Abrupt surge peaking in minutes (chest pain, palpitation, fear of dying). OCD: Ego-dystonic intrusive thoughts neutralized by rituals.",
      psychManagement: "Panic: SSRI + CBT (short-term benzodiazepine abortive). OCD: High-dose SSRIs (Fluoxetine 80mg) or Clomipramine + Exposure & Response Prevention (ERP).",
      highYieldPearl: "Exposure and Response Prevention (ERP) Cognitive Behavioral Therapy is the gold-standard first-line psychotherapeutic treatment for OCD."
    },
    {
      id: "ptsd-nightmares-prazosin",
      name: "2. Trauma Disorders: Acute Stress Disorder (<1 mo) vs PTSD & Prazosin",
      category: "Trauma-Related Disorders",
      subType: "ASD (3d to 1 mo) • PTSD (>1 mo) • Flashbacks • Prazosin for Nightmares",
      clinicalAlgorithm: "Trauma exposure -> 3 days to 1 month = Acute Stress Disorder; >1 month = PTSD. Core: Intrusion, Avoidance, Negative mood, Hyperarousal -> SSRI + Prazosin.",
      diagnosticCriteria: "Intrusive flashbacks/nightmares, emotional detachment, exaggerated startle response, hypervigilance lasting >1 month.",
      psychManagement: "1st-line SSRIs (Sertraline, Paroxetine) / SNRIs + Trauma-Focused CBT (EMDR) + Prazosin (Alpha-1 antagonist) specifically for PTSD nightmares.",
      highYieldPearl: "Prazosin is a centrally acting alpha-1 adrenergic antagonist specifically indicated for reducing trauma-related nightmares and sleep disruption in PTSD."
    }
  ]
};

interface PsychiatryLabViewerProps {
  initialMode?: PsychiatryLabMode;
  height?: string;
  onNodeSelect?: (node: PsychiatryLabNode) => void;
}

export default function PsychiatryLabViewer({
  initialMode = "mseAffective",
  height = "560px",
  onNodeSelect,
}: PsychiatryLabViewerProps) {
  const [activeMode, setActiveMode] = useState<PsychiatryLabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // MSE & SIGECAPS State
  const [sigecapsCount, setSigecapsCount] = useState<number>(7); // out of 9
  const [mddSubtype, setMddSubtype] = useState<"typical" | "atypical" | "melancholic" | "psychotic">("atypical");

  // Bipolar & Lithium State
  const [bipolarEpisode, setBipolarEpisode] = useState<"mania" | "hypomania" | "depression" | "euthymic">("mania");
  const [lithiumLevel, setLithiumLevel] = useState<number>(0.9); // mEq/L

  // Psychosis Timeline State
  const [psychosisDurationWeeks, setPsychosisDurationWeeks] = useState<number>(32); // weeks

  // Lithium Triage Calculation
  const lithiumTriage = useMemo(() => {
    if (lithiumLevel >= 4.0) {
      return {
        level: "CRITICAL SEVERE TOXICITY (>4.0 mEq/L)",
        color: "text-rose-400 font-extrabold",
        action: "MANDATORY EMERGENCY HEMODIALYSIS + Stop Lithium + IV Saline"
      };
    } else if (lithiumLevel >= 2.5) {
      return {
        level: "SEVERE TOXICITY (2.5–4.0 mEq/L)",
        color: "text-rose-400 font-bold",
        action: "Emergency Hemodialysis if neurotoxicity/renal impairment present + IV Saline"
      };
    } else if (lithiumLevel > 1.2) {
      return {
        level: "MILD-TO-MODERATE TOXICITY (1.3–2.4 mEq/L)",
        color: "text-amber-300 font-bold",
        action: "Hold Lithium, check renal/electrolytes, administer IV 0.9% Normal Saline"
      };
    } else if (lithiumLevel >= 0.6) {
      return {
        level: "THERAPEUTIC WINDOW (0.6–1.2 mEq/L)",
        color: "text-emerald-400 font-bold",
        action: "Euthymic maintenance / acute mania target; monitor TSH & Creatinine q6mo"
      };
    }
    return {
      level: "SUBTHERAPEUTIC (<0.6 mEq/L)",
      color: "text-indigo-300 font-medium",
      action: "Subtherapeutic level; titrate lithium dosage to achieve 0.6–1.2 mEq/L"
    };
  }, [lithiumLevel]);

  // Psychosis Timeline Calculation
  const psychosisDiagnosis = useMemo(() => {
    if (psychosisDurationWeeks < 4) {
      return {
        dx: "Brief Psychotic Disorder (<1 Month)",
        color: "text-indigo-300 font-bold",
        prognosis: "Excellent prognosis; 100% full return to baseline functioning"
      };
    } else if (psychosisDurationWeeks < 24) {
      return {
        dx: "Schizophreniform Disorder (1–6 Months)",
        color: "text-amber-300 font-bold",
        prognosis: "Provisional diagnosis; ~60–80% progress to full Schizophrenia"
      };
    }
    return {
      dx: "Schizophrenia (>=6 Months Continuous Disturbance)",
      color: "text-rose-400 font-extrabold",
      prognosis: "Chronic illness; requires maintenance antipsychotic therapy + psychosocial support"
    };
  }, [psychosisDurationWeeks]);

  const currentNodes = useMemo(() => {
    return PSYCHIATRY_NODES[activeMode] || PSYCHIATRY_NODES.mseAffective;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: PsychiatryLabNode) => {
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
            <Brain size={14} /> PSYCH-301
          </span>
          <span className={styles.titleText}>
            {activeMode === "mseAffective" && "Mental Status Examination (MSE) & Major Depression (SIGECAPS) Evaluator"}
            {activeMode === "bipolar" && "Bipolar DIGFAST Mania & Lithium Toxicity Hemodialysis Engine"}
            {activeMode === "psychosis" && "Schizophrenia Spectrum Timeline & Antipsychotic EPS / NMS Explorer"}
            {activeMode === "anxietyTrauma" && "Anxiety Spectrum (Panic, GAD, OCD ERP) & PTSD Prazosin Workspace"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Psychiatry Quiz"}
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
                <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                  Psychiatry Clinical Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Psychiatric Entity: {quizTargetNode.diagnosticCriteria}
                </div>
                {quizFeedback && (
                  <div className="text-xs text-indigo-300 font-medium mt-1">{quizFeedback}</div>
                )}
              </div>
              <button
                onClick={nextQuizQuestion}
                className="px-3 py-1 bg-indigo-950 text-xs rounded border border-indigo-700 text-indigo-200"
              >
                Next
              </button>
            </div>
          )}

          {/* Mode 1: MSE & SIGECAPS Depression */}
          {activeMode === "mseAffective" && (
            <div className={styles.psychSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={14} /> Major Depressive Disorder SIGECAPS &amp; Subtype Matrix
                </span>
                <span className="text-[11px] text-slate-400">DSM-5-TR: &ge;5/9 for &ge;2 weeks</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => setMddSubtype("typical")}
                  className={`p-2 rounded font-bold border transition ${
                    mddSubtype === "typical"
                      ? "bg-indigo-600 text-white border-indigo-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Uncomplicated MDD
                </button>
                <button
                  onClick={() => setMddSubtype("atypical")}
                  className={`p-2 rounded font-bold border transition ${
                    mddSubtype === "atypical"
                      ? "bg-indigo-600 text-white border-indigo-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Atypical Depression
                </button>
                <button
                  onClick={() => setMddSubtype("melancholic")}
                  className={`p-2 rounded font-bold border transition ${
                    mddSubtype === "melancholic"
                      ? "bg-indigo-600 text-white border-indigo-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Melancholic MDD
                </button>
                <button
                  onClick={() => setMddSubtype("psychotic")}
                  className={`p-2 rounded font-bold border transition ${
                    mddSubtype === "psychotic"
                      ? "bg-indigo-600 text-white border-indigo-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Psychotic MDD
                </button>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>SIGECAPS Criteria Met:</span>{" "}
                  <strong className="text-indigo-400">{sigecapsCount} / 9 ({sigecapsCount >= 5 ? "Meets Full MDD Criteria" : "Subthreshold"})</strong>
                </div>
                <input
                  type="range"
                  min="1"
                  max="9"
                  step="1"
                  value={sigecapsCount}
                  onChange={(e) => setSigecapsCount(parseInt(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                {mddSubtype === "atypical" && (
                  <div>
                    <div className="text-indigo-300 font-bold">Atypical Depression (Mood Reactivity &amp; Leaden Paralysis)</div>
                    <div className="text-slate-300 mt-1">Mood brightens to positive events; heavy lead-like limbs (leaden paralysis), hypersomnia, hyperphagia, and interpersonal rejection sensitivity.</div>
                    <div className="text-emerald-300 font-bold mt-1">1st-Line: SSRIs (Sertraline/Escitalopram) / MAOIs.</div>
                  </div>
                )}
                {mddSubtype === "melancholic" && (
                  <div>
                    <div className="text-indigo-300 font-bold">Melancholic Depression (Profound Anhedonia)</div>
                    <div className="text-slate-300 mt-1">Non-reactive mood, early morning awakening (terminal insomnia), anorexia with weight loss, and marked psychomotor retardation. Highly responsive to ECT.</div>
                  </div>
                )}
                {mddSubtype === "psychotic" && (
                  <div>
                    <div className="text-indigo-300 font-bold">Major Depression with Psychotic Features</div>
                    <div className="text-slate-300 mt-1">Mood-congruent delusions of severe guilt, nihilism (Cotard syndrome), or somatic ruin. Treat with Antidepressant + Atypical Antipsychotic or emergency ECT.</div>
                  </div>
                )}
                {mddSubtype === "typical" && (
                  <div>
                    <div className="text-indigo-300 font-bold">Uncomplicated Major Depressive Disorder</div>
                    <div className="text-slate-300 mt-1">Pervasive depressed mood and anhedonia lasting &ge;2 weeks; managed with 1st-line SSRIs/SNRIs combined with Cognitive Behavioral Therapy (CBT).</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mode 2: Bipolar DIGFAST & Lithium Toxicity */}
          {activeMode === "bipolar" && (
            <div className={styles.psychSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Flame size={14} /> Lithium Carbonate Serum Concentration &amp; Toxicity Engine
                </span>
                <span className="text-[11px] text-slate-400">Target: 0.6–1.2 mEq/L</span>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Serum Lithium Concentration:</span>{" "}
                  <strong className="text-indigo-400">{lithiumLevel.toFixed(1)} mEq/L</strong>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="5.0"
                  step="0.1"
                  value={lithiumLevel}
                  onChange={(e) => setLithiumLevel(parseFloat(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div className={styles.psychResultsGrid}>
                <div className={styles.psychResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Toxicity State</div>
                  <div className={`text-xs font-bold mt-1 ${lithiumTriage.color}`}>{lithiumTriage.level}</div>
                </div>
                <div className={styles.psychResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Clinical Action</div>
                  <div className="text-xs font-bold text-slate-200 mt-1">{lithiumTriage.action}</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 3: Schizophrenia Timeline & NMS */}
          {activeMode === "psychosis" && (
            <div className={styles.psychSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Brain size={14} /> Psychosis Spectrum Timeline &amp; Antipsychotic EPS / NMS
                </span>
                <span className="text-[11px] text-slate-400">Continuous Disturbance</span>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Duration of Psychosis:</span>{" "}
                  <strong className="text-indigo-400">{psychosisDurationWeeks} Weeks ({(psychosisDurationWeeks / 4.3).toFixed(1)} Months)</strong>
                </div>
                <input
                  type="range"
                  min="1"
                  max="52"
                  step="1"
                  value={psychosisDurationWeeks}
                  onChange={(e) => setPsychosisDurationWeeks(parseInt(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div className={styles.psychResultsGrid}>
                <div className={styles.psychResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Diagnosis</div>
                  <div className={`text-xs font-bold mt-1 ${psychosisDiagnosis.color}`}>{psychosisDiagnosis.dx}</div>
                </div>
                <div className={styles.psychResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Prognosis &amp; Course</div>
                  <div className="text-xs font-bold text-slate-200 mt-1">{psychosisDiagnosis.prognosis}</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 4: Anxiety, OCD & PTSD Workspace */}
          {activeMode === "anxietyTrauma" && (
            <div className={styles.psychSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield size={14} /> Anxiety Disorders, OCD (ERP Protocol) &amp; PTSD Prazosin
                </span>
                <span className="text-[11px] text-slate-400">CSTC &amp; Amygdala Circuits</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">Obsessive-Compulsive Disorder (OCD)</div>
                  <div className="text-slate-300 mt-1">Ego-dystonic intrusive obsessions driving repetitive compulsions.</div>
                  <div className="text-emerald-300 font-bold mt-1">Management: High-Dose SSRIs (Fluoxetine 80mg) + Exposure &amp; Response Prevention (ERP) CBT.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">PTSD &amp; Combat Nightmares</div>
                  <div className="text-slate-300 mt-1">Flashbacks, emotional detachment, hyperarousal lasting &gt;1 month post-trauma.</div>
                  <div className="text-pink-300 font-bold mt-1">Management: SSRIs + Trauma-CBT + Prazosin (Alpha-1 antagonist) for nightmares.</div>
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

                  <div className="text-[11px] text-slate-300 font-medium bg-slate-950/60 p-2 rounded border border-slate-800">
                    <span className="text-indigo-400 font-bold">Algorithm:</span> {node.clinicalAlgorithm}
                  </div>

                  <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400">
                    <span>Inspect psychiatry protocol</span>
                    <ArrowRight size={12} className="text-slate-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: High-Yield Psychiatry Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              Psychiatry Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🎯 Disorder / Clinical Entity</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>⚡ Diagnostic Criteria &amp; Algorithm</div>
            <div className={styles.inspectorBody}>{activeNode.diagnosticCriteria}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🛠️ Guideline-Directed Management</div>
            <div className={styles.inspectorBody}>{activeNode.psychManagement}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 Kaplan &amp; Sadock / Stahl Pearl</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearl}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("mseAffective")}
          className={`${styles.modeTab} ${activeMode === "mseAffective" ? styles.modeTabActive : ""}`}
        >
          🧠 1. MSE &amp; Depression
        </button>
        <button
          onClick={() => setActiveMode("bipolar")}
          className={`${styles.modeTab} ${activeMode === "bipolar" ? styles.modeTabActive : ""}`}
        >
          ⚡ 2. Bipolar &amp; Lithium
        </button>
        <button
          onClick={() => setActiveMode("psychosis")}
          className={`${styles.modeTab} ${activeMode === "psychosis" ? styles.modeTabActive : ""}`}
        >
          👥 3. Psychosis &amp; NMS
        </button>
        <button
          onClick={() => setActiveMode("anxietyTrauma")}
          className={`${styles.modeTab} ${activeMode === "anxietyTrauma" ? styles.modeTabActive : ""}`}
        >
          🛡️ 4. Anxiety, OCD &amp; PTSD
        </button>
      </div>
    </div>
  );
}
