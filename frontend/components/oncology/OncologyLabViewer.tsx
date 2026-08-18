"use client";

import React, { useState, useMemo } from "react";
import styles from "./OncologyLabViewer.module.css";
import {
  Activity,
  Layers,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Maximize2,
  Minimize2,
  ShieldAlert,
  Search,
  Droplet,
  Calculator,
  TrendingUp,
  Gauge,
  Thermometer,
  Shield,
  Crosshair,
  Pill,
  Brain,
  Scissors,
  Zap,
  Award,
} from "lucide-react";

export type OncologyLabMode = "tnm" | "chemo" | "radio" | "emergencies";

export interface OncologyLabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  cellularMechanism: string;
  diagnosticCriteria: string;
  therapeuticProtocol: string;
  highYieldPearl: string;
}

export const ONCOLOGY_NODES: Record<OncologyLabMode, OncologyLabNode[]> = {
  tnm: [
    {
      id: "onco-tnm-8th-edition-staging",
      name: "AJCC TNM 8th Edition Staging & Prefixes",
      category: "Cancer Staging",
      subType: "cTNM (Clinical) • pTNM (Pathological) • yTNM (Post-Neoadjuvant) • rTNM (Recurrent)",
      cellularMechanism: "T (Primary size/depth) + N (Regional nodal burden) + M (Distant metastasis). yTNM captures tumor downstaging after neoadjuvant therapy.",
      diagnosticCriteria: "Stage I (Local early) -> Stage II (Locally advanced) -> Stage III (Regional nodal disease) -> Stage IV (Distant metastatic M1).",
      therapeuticProtocol: "Early stages: Curative surgical resection / definitive RT. Stage III: Multimodality neoadjuvant/adjuvant chemo-RT. Stage IV: Palliative systemic targeted/immunotherapy.",
      highYieldPearl: "The 'y' prefix (e.g. ypT0N0M0) specifically designates staging performed following neoadjuvant chemotherapy or radiotherapy to evaluate pathological complete response (pCR)."
    },
    {
      id: "onco-precision-genomic-drivers",
      name: "Precision Drivers: EGFR, ALK, KRAS, BRAF & BRCA",
      category: "Molecular Oncology",
      subType: "EGFR (Osimertinib) • ALK (Alectinib) • KRAS G12C (Sotorasib) • BRAF V600E (Dabrafenib+Trametinib)",
      cellularMechanism: "Oncogenic addiction mutations drive autonomous survival pathways (MAPK, PI3K/AKT). BRCA deficiency enables Synthetic Lethality with PARP inhibitors.",
      diagnosticCriteria: "EGFR Exon 19 del / L858R; ALK rearrangement; KRAS G12C; BRAF V600E; BRCA1/2 homologous recombination repair deficiency.",
      therapeuticProtocol: "EGFR: Osimertinib (overcomes T790M). ALK: Alectinib. BRAF: Dabrafenib + Trametinib. BRCA: Olaparib PARP inhibitor (synthetic lethality).",
      highYieldPearl: "KRAS mutations in colorectal cancer confer intrinsic resistance to anti-EGFR monoclonal antibodies (Cetuximab and Panitumumab)."
    }
  ],

  chemo: [
    {
      id: "onco-chemo-toxicities-and-antidotes",
      name: "Chemotherapy Organ Toxicities & Protective Antidotes",
      category: "Antineoplastic Pharmacology",
      subType: "Cyclophosphamide (Mesna) • Doxorubicin (Dexrazoxane) • Cisplatin (Amifostine) • MTX (Leucovorin)",
      cellularMechanism: "Acrolein urothelial toxicity (Cyclophosphamide). Iron-dependent free radical myocardial damage (Doxorubicin). Tubular platinum deposition (Cisplatin).",
      diagnosticCriteria: "Hemorrhagic cystitis (gross hematuria). Anthracycline cardiomyopathy (drop in LVEF). Cisplatin nephro/ototoxicity. MTX myelosuppression.",
      therapeuticProtocol: "Mesna for acrolein. Dexrazoxane for doxorubicin. Vigorous IV hydration + Amifostine for cisplatin. Leucovorin rescue for methotrexate.",
      highYieldPearl: "Mesna (2-mercaptoethane sulfonate) binds and neutralizes toxic acrolein in the bladder, preventing severe cyclophosphamide-induced hemorrhagic cystitis."
    },
    {
      id: "onco-checkpoint-inhibitors-irae-ladder",
      name: "Immune Checkpoint Blockade & irAE Management",
      category: "Cancer Immunotherapy",
      subType: "Anti-PD-1 (Pembrolizumab) • Anti-PD-L1 (Atezolizumab) • Anti-CTLA-4 (Ipilimumab) • Steroids",
      cellularMechanism: "Releases the molecular brakes on exhausted CD8+ T-cells by disrupting PD-1/PD-L1 or CTLA-4 coinhibitory signals, restoring antineoplastic cytotoxicity.",
      diagnosticCriteria: "Immune-related adverse events (irAEs): Autoimmune colitis, hypophysitis, pneumonitis, hepatitis, thyroiditis.",
      therapeuticProtocol: "Grade 1: Continue ICI. Grade 2: Oral Prednisone (0.5-1 mg/kg). Grade 3-4: Discontinue ICI + High-dose IV Methylprednisolone (1-2 mg/kg) + Infliximab for colitis.",
      highYieldPearl: "High-grade (Grade 3-4) immune-related adverse events from checkpoint inhibitors mandate immediate permanent drug cessation and high-dose systemic corticosteroid therapy."
    }
  ],

  radio: [
    {
      id: "onco-radiobiology-4rs-withers",
      name: "The 4 Rs of Radiobiology & Fractionation Kinetics",
      category: "Radiobiology",
      subType: "Repair (Sublethal) • Reassortment (G2/M) • Reoxygenation (OER 2.5–3.0) • Repopulation",
      cellularMechanism: "Sublethal DNA double-strand break repair. Progression into sensitive G2/M phases. Hypoxic core reoxygenation (chemical radiosensitization). Accelerated clonogen repopulation.",
      diagnosticCriteria: "Oxygen Enhancement Ratio (OER ~ 2.5-3.0). Accelerated repopulation begins at ~28 days (Tdelay).",
      therapeuticProtocol: "Standard fractionation: 1.8 to 2.0 Gy per daily fraction. Strict avoidance of unplanned treatment breaks to prevent clonogen repopulation.",
      highYieldPearl: "Unplanned treatment interruptions allow surviving tumor stem cells to undergo accelerated clonogen repopulation, significantly diminishing local curative tumor control."
    },
    {
      id: "onco-linear-quadratic-alpha-beta",
      name: "Linear-Quadratic Model & Precision Delivery (IMRT/SBRT)",
      category: "Radiation Physics & Delivery",
      subType: "Alpha/Beta Ratio • Early Responding (10 Gy) vs Late Normal Tissue (2 Gy) • IMRT • SBRT • HDR",
      cellularMechanism: "Cell survival S = exp(-alpha*D - beta*D^2). Alpha represents single-hit lethal breaks; Beta represents two-hit chromosome aberrations.",
      diagnosticCriteria: "High alpha/beta (~10 Gy) in squamous cell carcinoma/lymphoma; Low alpha/beta (~2-3 Gy) in spinal cord, lung, brain, and prostate cancer.",
      therapeuticProtocol: "IMRT/VMAT for dose sculpting around critical organs. SBRT (1-5 ablative fractions) for early lung/liver. HDR Brachytherapy (Ir-192) for cervix/prostate.",
      highYieldPearl: "Late-responding normal tissues have a low alpha/beta ratio (2-3 Gy) and are exquisitely sensitive to fraction size, making hypofractionation hazardous unless delivered via stereotactic SBRT."
    }
  ],

  emergencies: [
    {
      id: "onco-emergencies-svc-and-mscc",
      name: "Superior Vena Cava Syndrome & Spinal Cord Compression",
      category: "Structural Oncologic Emergencies",
      subType: "SVC Syndrome (Pemberton Sign) • MSCC (IV Dexamethasone 16 mg + Urgent Whole-Spine MRI)",
      cellularMechanism: "Extrinsic compression of thin-walled SVC by lung cancer/lymphoma. Epidural thecal sac compression by vertebral metastases.",
      diagnosticCriteria: "SVC: Facial edema, plethora, dilated neck/chest collaterals. MSCC: Band-like back pain, lower extremity weakness, sensory level, saddle anesthesia.",
      therapeuticProtocol: "SVC: Endovascular stenting vs RT/Chemo. MSCC: Immediate IV Dexamethasone 16 mg bolus -> Emergent Whole-Spine MRI -> Decompressive surgery / Emergent RT within 24h.",
      highYieldPearl: "In suspected Malignant Spinal Cord Compression, immediate high-dose IV Dexamethasone (16 mg) must be administered prior to emergency whole-spine MRI to halt neurological progression."
    },
    {
      id: "onco-emergencies-tls-and-hypercalcemia",
      name: "Tumor Lysis Syndrome & Hypercalcemia of Malignancy",
      category: "Metabolic Oncologic Emergencies",
      subType: "TLS (Cairo-Bishop: K, PO4, Uric Acid High; Ca Low) • Rasburicase • Hypercalcemia (PTHrP / Zoledronic)",
      cellularMechanism: "Massive intracellular lysis releasing potassium, phosphate, and purines. Humoral secretion of PTHrP by squamous carcinomas.",
      diagnosticCriteria: "TLS: K >=6.0, PO4 >=4.5, Uric Acid >=8.0, Ca <=7.0, Acute Kidney Injury. Hypercalcemia: Corrected Ca >12-14 mg/dL, shortened QTc.",
      therapeuticProtocol: "TLS: Aggressive IV hydration (3 L/m2/day) + Rasburicase (recombinant urate oxidase) + Allopurinol. Hypercalcemia: IV Normal Saline + IV Zoledronic Acid (4 mg) / Denosumab.",
      highYieldPearl: "Rasburicase (recombinant urate oxidase) enzymatically converts insoluble circulating uric acid into highly soluble allantoin, rapidly clearing uric acid in acute Tumor Lysis Syndrome."
    }
  ]
};

interface OncologyLabViewerProps {
  initialMode?: OncologyLabMode;
  height?: string;
  onNodeSelect?: (node: OncologyLabNode) => void;
}

export default function OncologyLabViewer({
  initialMode = "tnm",
  height = "560px",
  onNodeSelect,
}: OncologyLabViewerProps) {
  const [activeMode, setActiveMode] = useState<OncologyLabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // TNM Staging State
  const [selectedTnmStage, setSelectedTnmStage] = useState<"1" | "2" | "3" | "4">("3");

  // Radiobiology 4 Rs State
  const [selectedR, setSelectedR] = useState<"repair" | "reassort" | "reoxygenate" | "repopulate">("reoxygenate");

  // TNM Details Calculator
  const tnmDetails = useMemo(() => {
    if (selectedTnmStage === "1") {
      return {
        stage: "Stage I (cT1 N0 M0 / cT2a N0 M0)",
        anatomicalExtent: "Localized early primary tumor without regional lymph node involvement or distant metastasis.",
        treatmentIntent: "Definitive Curative Surgical Resection (e.g. Lobectomy) or Stereotactic Ablative Radiotherapy (SABR/SBRT).",
        fiveYearSurvival: "85% to 95%",
        color: "text-emerald-400 font-bold"
      };
    } else if (selectedTnmStage === "2") {
      return {
        stage: "Stage II (cT2b-T3 N0 M0 / cT1-T2 N1 M0)",
        anatomicalExtent: "Locally advanced primary tumor with or without ipsilateral hilar/peribronchial lymph node metastasis.",
        treatmentIntent: "Curative Surgical Resection + Adjuvant Systemic Chemotherapy / Targeted Therapy.",
        fiveYearSurvival: "60% to 75%",
        color: "text-blue-400 font-bold"
      };
    } else if (selectedTnmStage === "3") {
      return {
        stage: "Stage III (cT1-T4 N2-N3 M0)",
        anatomicalExtent: "Locally advanced tumor with ipsilateral/contralateral mediastinal, subcarinal, or supraclavicular lymph node involvement.",
        treatmentIntent: "Multimodality: Concurrent Definitive Chemo-Radiotherapy followed by Consolidation Immunotherapy (Durvalumab).",
        fiveYearSurvival: "30% to 50%",
        color: "text-amber-400 font-bold"
      };
    } else {
      return {
        stage: "Stage IV (Any T Any N M1a/M1b/M1c)",
        anatomicalExtent: "Distant metastatic disease (pleural effusion, contralateral lung, brain, liver, bone, adrenal metastases).",
        treatmentIntent: "Palliative Systemic Precision Targeted Therapy (Osimertinib/Alectinib) or Immunotherapy +/- Chemotherapy.",
        fiveYearSurvival: "<15% to 25%",
        color: "text-rose-400 font-extrabold"
      };
    }
  }, [selectedTnmStage]);

  const rDetails = useMemo(() => {
    if (selectedR === "repair") {
      return {
        title: "1. Repair of Sublethal Damage",
        mechanism: "Normal tissues repair DNA double-strand breaks faster and more completely than tumor cells during the 24-hour inter-fraction interval.",
        clinicalRule: "Fraction interval must be >=6 hours; spares late-responding normal tissues."
      };
    } else if (selectedR === "reassort") {
      return {
        title: "2. Reassortment / Redistribution",
        mechanism: "Surviving cells in radioresistant S-phase progress into radiosensitive G2 and M phases of the cell cycle.",
        clinicalRule: "Fractionation catches tumor cells as they enter mitosis, increasing radiotherapeutic lethality."
      };
    } else if (selectedR === "reoxygenate") {
      return {
        title: "3. Reoxygenation (Oxygen Fixation)",
        mechanism: "Hypoxic core cells (OER 2.5-3.0) become revascularized as outer aerobic cells die, restoring oxygen-dependent permanent peroxy-radical damage.",
        clinicalRule: "Oxygen acts as a permanent chemical radiosensitizer via the Oxygen Fixation Hypothesis."
      };
    } else {
      return {
        title: "4. Accelerated Clonogen Repopulation",
        mechanism: "Surviving tumor stem cells accelerate their division rate starting ~28 days into fractionated therapy.",
        clinicalRule: "CRITICAL: Strictly avoid treatment interruptions to prevent clonogen repopulation from destroying local cure rate."
      };
    }
  }, [selectedR]);

  const currentNodes = useMemo(() => {
    return ONCOLOGY_NODES[activeMode] || ONCOLOGY_NODES.tnm;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: OncologyLabNode) => {
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
            <Award size={14} /> ONCO-401
          </span>
          <span className={styles.titleText}>
            {activeMode === "tnm" && "AJCC TNM 8th Edition Staging & Precision Molecular Drivers"}
            {activeMode === "chemo" && "Chemotherapy Organ Toxicities, Protective Antidotes & irAEs"}
            {activeMode === "radio" && "Radiation Biology (The 4 Rs), Linear-Quadratic Model & SBRT"}
            {activeMode === "emergencies" && "Oncologic Emergencies (SVC, MSCC, TLS) & WHO Pain Ladder"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Oncology Quiz"}
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
                <div className="text-xs font-bold text-pink-300 uppercase tracking-wider">
                  Oncology Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Clinical Scenario: {quizTargetNode.diagnosticCriteria}
                </div>
                {quizFeedback && (
                  <div className="text-xs text-pink-300 font-medium mt-1">{quizFeedback}</div>
                )}
              </div>
              <button
                onClick={nextQuizQuestion}
                className="px-3 py-1 bg-pink-950 text-xs rounded border border-pink-700 text-pink-200"
              >
                Next
              </button>
            </div>
          )}

          {/* Mode 1: TNM Staging Selector */}
          {activeMode === "tnm" && (
            <div className={styles.oncoSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-pink-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={14} /> AJCC TNM 8th Edition Stage Grouping
                </span>
                <span className="text-[11px] text-slate-400">cTNM vs pTNM vs yTNM</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => setSelectedTnmStage("1")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedTnmStage === "1"
                      ? "bg-pink-600 text-white border-pink-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Stage I (Local)
                </button>
                <button
                  onClick={() => setSelectedTnmStage("2")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedTnmStage === "2"
                      ? "bg-pink-600 text-white border-pink-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Stage II (Adv Local)
                </button>
                <button
                  onClick={() => setSelectedTnmStage("3")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedTnmStage === "3"
                      ? "bg-pink-600 text-white border-pink-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Stage III (Nodal N2)
                </button>
                <button
                  onClick={() => setSelectedTnmStage("4")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedTnmStage === "4"
                      ? "bg-pink-600 text-white border-pink-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Stage IV (Metastatic M1)
                </button>
              </div>

              <div className={styles.oncoResultsGrid}>
                <div className={styles.oncoResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">TNM Category</div>
                  <div className={`text-xs font-bold mt-1 ${tnmDetails.color}`}>{tnmDetails.stage}</div>
                </div>
                <div className={styles.oncoResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">5-Year Survival</div>
                  <div className="text-xs font-bold text-emerald-400 mt-1">{tnmDetails.fiveYearSurvival}</div>
                </div>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs text-slate-300">
                <div><strong className="text-pink-400">Anatomical Extent:</strong> {tnmDetails.anatomicalExtent}</div>
                <div className="mt-1"><strong className="text-pink-400">Multimodal Treatment Strategy:</strong> {tnmDetails.treatmentIntent}</div>
              </div>
            </div>
          )}

          {/* Mode 2: Chemo Toxicities & irAEs */}
          {activeMode === "chemo" && (
            <div className={styles.oncoSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-pink-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Pill size={14} /> Signature Toxicities, Antidotes &amp; irAE Ladder
                </span>
                <span className="text-[11px] text-slate-400">Mesna • Dexrazoxane • Leucovorin</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-pink-300 font-bold">Cyclophosphamide &amp; Acrolein</div>
                  <div className="text-slate-300 mt-1">Acrolein causes hemorrhagic cystitis. Prevented with MESNA (2-mercaptoethane sulfonate) and vigorous IV hydration.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-pink-300 font-bold">Checkpoint irAE Grade 3–4 Ladder</div>
                  <div className="text-slate-300 mt-1">Permanently discontinue ICI + Immediate high-dose IV Methylprednisolone (1-2 mg/kg) + Infliximab for steroid-refractory colitis.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 3: Radiobiology 4 Rs */}
          {activeMode === "radio" && (
            <div className={styles.oncoSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-pink-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap size={14} /> The 4 Rs of Radiobiology (Withers)
                </span>
                <span className="text-[11px] text-slate-400">OER 2.5–3.0</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => setSelectedR("repair")}
                  className={`p-2 rounded font-semibold border ${
                    selectedR === "repair"
                      ? "bg-pink-700 text-white border-pink-400"
                      : "bg-slate-950 text-slate-400 border-slate-800"
                  }`}
                >
                  1. Repair (Sublethal)
                </button>
                <button
                  onClick={() => setSelectedR("reassort")}
                  className={`p-2 rounded font-semibold border ${
                    selectedR === "reassort"
                      ? "bg-pink-700 text-white border-pink-400"
                      : "bg-slate-950 text-slate-400 border-slate-800"
                  }`}
                >
                  2. Reassortment (G2/M)
                </button>
                <button
                  onClick={() => setSelectedR("reoxygenate")}
                  className={`p-2 rounded font-semibold border ${
                    selectedR === "reoxygenate"
                      ? "bg-pink-700 text-white border-pink-400"
                      : "bg-slate-950 text-slate-400 border-slate-800"
                  }`}
                >
                  3. Reoxygenation (OER)
                </button>
                <button
                  onClick={() => setSelectedR("repopulate")}
                  className={`p-2 rounded font-semibold border ${
                    selectedR === "repopulate"
                      ? "bg-pink-700 text-white border-pink-400"
                      : "bg-slate-950 text-slate-400 border-slate-800"
                  }`}
                >
                  4. Repopulation (28d)
                </button>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                <div className="text-sm font-bold text-pink-300">{rDetails.title}</div>
                <div className="text-slate-300 mt-1 font-medium">{rDetails.mechanism}</div>
                <div className="text-amber-300 font-bold mt-1.5">{rDetails.clinicalRule}</div>
              </div>
            </div>
          )}

          {/* Mode 4: Oncologic Emergencies */}
          {activeMode === "emergencies" && (
            <div className={styles.oncoSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-pink-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert size={14} /> Oncologic Emergencies &amp; WHO Analgesic Ladder
                </span>
                <span className="text-[11px] text-slate-400">MSCC • TLS • SVC</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-pink-300 font-bold">Malignant Spinal Cord Compression</div>
                  <div className="text-slate-300 mt-1">Immediate IV Dexamethasone 16 mg bolus &rarr; Emergent Whole-Spine MRI within 24 hours &rarr; Surgical decompression / Radiotherapy.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-pink-300 font-bold">Tumor Lysis Syndrome (Cairo-Bishop)</div>
                  <div className="text-slate-300 mt-1">High K, High PO4, High Uric Acid, Low Ca. Administer aggressive IV hydration + Rasburicase (recombinant urate oxidase).</div>
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
                    <span className="text-pink-400 font-bold">Therapeutic Action:</span> {node.therapeuticProtocol}
                  </div>

                  <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400">
                    <span>Inspect protocol</span>
                    <ArrowRight size={12} className="text-slate-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: High-Yield Oncology Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">
              Oncology Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🔬 Topic &amp; Focus</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🧬 Cellular &amp; Molecular Mechanism</div>
            <div className={styles.inspectorBody}>{activeNode.cellularMechanism}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>⚡ Diagnostic Criteria &amp; Presentation</div>
            <div className={styles.inspectorBody}>{activeNode.diagnosticCriteria}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 Gold Standard Oncologic Pearl</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearl}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("tnm")}
          className={`${styles.modeTab} ${activeMode === "tnm" ? styles.modeTabActive : ""}`}
        >
          🧬 1. TNM Staging &amp; Drivers
        </button>
        <button
          onClick={() => setActiveMode("chemo")}
          className={`${styles.modeTab} ${activeMode === "chemo" ? styles.modeTabActive : ""}`}
        >
          💊 2. Chemo Toxicities &amp; irAEs
        </button>
        <button
          onClick={() => setActiveMode("radio")}
          className={`${styles.modeTab} ${activeMode === "radio" ? styles.modeTabActive : ""}`}
        >
          ⚡ 3. Radiobiology 4 Rs &amp; SBRT
        </button>
        <button
          onClick={() => setActiveMode("emergencies")}
          className={`${styles.modeTab} ${activeMode === "emergencies" ? styles.modeTabActive : ""}`}
        >
          🚨 4. Oncologic Emergencies
        </button>
      </div>
    </div>
  );
}
