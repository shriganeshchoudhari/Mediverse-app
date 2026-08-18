"use client";

import React, { useState, useMemo } from "react";
import styles from "./InfectiousDiseaseLabViewer.module.css";
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
  Bug,
  Microscope,
  Stethoscope,
  HeartPulse,
} from "lucide-react";

export type InfectiousDiseaseLabMode = "sepsis" | "tropical" | "eskape" | "stewardship";

export interface InfectiousDiseaseLabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  pathogenOrStandard: string;
  diagnosticCriteria: string;
  treatmentProtocol: string;
  highYieldPearl: string;
}

export const INFECTIOUS_DISEASE_NODES: Record<InfectiousDiseaseLabMode, InfectiousDiseaseLabNode[]> = {
  sepsis: [
    {
      id: "id-sepsis3-sofa-scoring",
      name: "Sepsis-3 Diagnostic Criteria & SOFA Score",
      category: "Critical Care Sepsis",
      subType: "Dysregulated Host Response • Acute SOFA Delta >=2 • PaO2/FiO2 • Platelets • Bilirubin • MAP • GCS • Creatinine",
      pathogenOrStandard: "Third International Consensus Definitions for Sepsis and Septic Shock (Sepsis-3).",
      diagnosticCriteria: "Infection + acute change in SOFA score >=2 points. qSOFA bedside screen: RR >=22, GCS <15, SBP <=100 (>=2 points).",
      treatmentProtocol: "Surviving Sepsis Hour-1 Bundle: Lactate, Blood cultures, Broad-spectrum IV antibiotics, 30 mL/kg balanced crystalloids, Norepinephrine.",
      highYieldPearl: "Sepsis is defined as life-threatening organ dysfunction caused by a dysregulated host response to infection, clinically identified by an acute increase in SOFA score >=2."
    },
    {
      id: "id-sepsis-shock-vasopressors",
      name: "Septic Shock & Vasopressor Hierarchy",
      category: "Hemodynamic Resuscitation",
      subType: "MAP >=65 mmHg • Lactate >2.0 mmol/L • Norepinephrine • Vasopressin • Dobutamine • Hydrocortisone",
      pathogenOrStandard: "Surviving Sepsis Campaign 2021 Hemodynamic Management Guidelines.",
      diagnosticCriteria: "Sepsis with persistent hypotension requiring vasopressors for MAP >=65 mmHg AND serum lactate >2.0 mmol/L despite fluid loading.",
      treatmentProtocol: "1st-line: Norepinephrine; 2nd-line: Vasopressin (0.03 U/min); Inotrope: Dobutamine for myocardial dysfunction; Refractory shock: IV Hydrocortisone (200 mg/d).",
      highYieldPearl: "Norepinephrine is the uncontested first-line vasopressor in septic shock; Vasopressin is added at 0.03 units/min to reduce catecholamine requirements."
    }
  ],

  tropical: [
    {
      id: "id-tropical-malaria-artesunate",
      name: "Severe Falciparum Malaria & IV Artesunate",
      category: "Tropical Parasitology",
      subType: "Plasmodium falciparum • Cerebral Malaria • Ring Forms • Banana Gametocytes • IV Artesunate",
      pathogenOrStandard: "WHO Malaria Treatment Guidelines for Severe & Uncomplicated Malaria.",
      diagnosticCriteria: "Thick/thin blood smears showing high parasitemia (>5%), delicate ring forms, banana gametocytes, metabolic acidosis, blackwater fever.",
      treatmentProtocol: "Intravenous Artesunate (2.4 mg/kg IV at 0, 12, 24h, then daily) followed by oral Artemisinin Combination Therapy (ACT).",
      highYieldPearl: "Intravenous Artesunate is superior to IV Quinine, significantly reducing mortality in both adults and children with severe falciparum malaria."
    },
    {
      id: "id-tropical-scrub-typhus-eschar",
      name: "Scrub Typhus & Pathognomonic Eschar",
      category: "Rickettsial Infection",
      subType: "Orientia tsutsugamushi • Chigger Mite • Painless Cigarette-Burn Eschar • Weil-Felix OX-K • Doxycycline",
      pathogenOrStandard: "Clinical Diagnosis & Treatment of Scrub Typhus / Vector-Borne Rickettsiae.",
      diagnosticCriteria: "High fever, lymphadenopathy, and the pathognomonic painless black necrotic crusted 'cigarette-burn' eschar at the chigger bite site. Weil-Felix OX-K positive.",
      treatmentProtocol: "Oral/IV Doxycycline (100 mg bid for 7 days) or Azithromycin (500 mg daily for 5 days in pregnancy/children).",
      highYieldPearl: "Careful physical examination of warm intertriginous skin folds (groin, axillae, waistline) for a painless cigarette-burn eschar confirms Scrub Typhus."
    }
  ],

  eskape: [
    {
      id: "id-eskape-mrsa-vancomycin-daptomycin",
      name: "MRSA Resistance (PBP2a) & Vancomycin Dosing",
      category: "MDR Gram-Positive",
      subType: "mecA Gene • Altered PBP2a • Vancomycin (AUC/MIC 400-600) • Daptomycin Warning in Pneumonia",
      pathogenOrStandard: "IDSA Practice Guidelines for the Management of Methicillin-Resistant Staphylococcus aureus.",
      diagnosticCriteria: "mecA gene PCR or cefoxitin disk screen confirming resistance to all standard beta-lactams.",
      treatmentProtocol: "IV Vancomycin (target AUC/MIC 400-600 or trough 15-20 ug/mL), Linezolid (600 mg q12h), Daptomycin (8-10 mg/kg), Ceftaroline.",
      highYieldPearl: "Daptomycin is strictly contraindicated in pneumonia because pulmonary surfactant in alveolar fluid directly binds and neutralizes daptomycin."
    },
    {
      id: "id-eskape-cre-carbapenemases",
      name: "CRE Carbapenemases & Ceftazidime-Avibactam",
      category: "MDR Gram-Negative",
      subType: "KPC • NDM-1 Metallo-Beta-Lactamase • OXA-48 • Ceftazidime-Avibactam • Cefiderocol • Colistin",
      pathogenOrStandard: "IDSA Guidance on the Treatment of Antimicrobial-Resistant Gram-Negative Infections.",
      diagnosticCriteria: "Carbapenem resistance (MIC >=4 ug/mL for meropenem); PCR detection of blaKPC, blaNDM, blaOXA-48.",
      treatmentProtocol: "Ceftazidime-Avibactam, Meropenem-Vaborbactam, Cefiderocol, Polymyxin B / Colistin. NDM metallo-beta-lactamases require Aztreonam + Ceftazidime-Avibactam.",
      highYieldPearl: "Avibactam inhibits KPC and OXA-48 serines, but does not inhibit NDM metallo-beta-lactamases, requiring the addition of Aztreonam."
    }
  ],

  stewardship: [
    {
      id: "id-stewardship-aware-classification",
      name: "WHO AWaRe Antibiotic Classification System",
      category: "Stewardship Framework",
      subType: "Access Group (>=60% Target) • Watch Group (Priority Stewardship) • Reserve Group (Protected Last-Resort)",
      pathogenOrStandard: "WHO AWaRe (Access, Watch, Reserve) Classification of Antibiotics for Evaluation and Monitoring.",
      diagnosticCriteria: "Institutional surveillance tracking percentage of Access vs Watch vs Reserve antibiotic consumption.",
      treatmentProtocol: "Target: >=60% of total hospital antibiotic use from Access group (Amoxicillin, Cefazolin, Doxycycline); Reserve group strictly locked for ID specialist approval.",
      highYieldPearl: "The WHO AWaRe framework establishes a global benchmark of >=60% total hospital antibiotic consumption derived from the narrow-spectrum Access group."
    },
    {
      id: "id-stewardship-procalcitonin-timeout",
      name: "48-72h Antibiotic Time-Out & Procalcitonin Kinetics",
      category: "Stewardship Protocols",
      subType: "48-72h De-escalation • IV-to-Oral Switch • Serum Procalcitonin (<0.25 ug/L Stop Rule)",
      pathogenOrStandard: "IDSA/SHEA Implementing an Antimicrobial Stewardship Program Core Strategy.",
      diagnosticCriteria: "Review culture AST at 48-72 hours; serum procalcitonin kinetics (PCT <0.25 ug/L or >80% drop from peak).",
      treatmentProtocol: "De-escalate from broad-spectrum Watch agents to targeted Access agents; switch IV to oral when stable; discontinue antibiotics when PCT <0.25 ug/L.",
      highYieldPearl: "Serum Procalcitonin remains suppressed in viral infections by interferon-gamma, enabling safe discontinuation of antibiotics when PCT drops <0.25 ug/L."
    }
  ]
};

interface InfectiousDiseaseLabViewerProps {
  initialMode?: InfectiousDiseaseLabMode;
  height?: string;
  onNodeSelect?: (node: InfectiousDiseaseLabNode) => void;
}

export default function InfectiousDiseaseLabViewer({
  initialMode = "sepsis",
  height = "560px",
  onNodeSelect,
}: InfectiousDiseaseLabViewerProps) {
  const [activeMode, setActiveMode] = useState<InfectiousDiseaseLabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Sepsis Calculator State
  const [qsofaRR, setQsofaRR] = useState<boolean>(true);
  const [qsofaGCS, setQsofaGCS] = useState<boolean>(true);
  const [qsofaBP, setQsofaBP] = useState<boolean>(true);

  // Tropical Disease State
  const [selectedTropical, setSelectedTropical] = useState<"malaria" | "dengue" | "typhoid" | "scrub">("malaria");

  const qsofaScore = useMemo(() => {
    let score = 0;
    if (qsofaRR) score += 1;
    if (qsofaGCS) score += 1;
    if (qsofaBP) score += 1;
    return score;
  }, [qsofaRR, qsofaGCS, qsofaBP]);

  const tropicalDetails = useMemo(() => {
    if (selectedTropical === "malaria") {
      return {
        title: "Severe Falciparum Malaria (Plasmodium falciparum)",
        hallmarks: "Cerebral malaria, delicate ring forms, banana gametocytes, blackwater fever (dark urine), metabolic acidosis",
        treatment: "IV Artesunate (2.4 mg/kg at 0, 12, 24h, then daily) followed by oral ACT",
        pearl: "IV Artesunate has replaced IV Quinine as the global gold standard for severe malaria."
      };
    } else if (selectedTropical === "dengue") {
      return {
        title: "Dengue Fever & Severe Dengue (Flavivirus / Aedes aegypti)",
        hallmarks: "Breakbone fever, retro-orbital pain, positive Tourniquet test, NS1 antigen (Day 1-5), IgM ELISA (Day 5+), Plasma Leakage",
        treatment: "Judicious Isotonic Crystalloid Titration; avoid NSAIDs/Aspirin (bleeding/Reye risk)",
        pearl: "Hematocrit rise >20% indicates critical plasma leakage requiring prompt crystalloid resuscitation."
      };
    } else if (selectedTropical === "typhoid") {
      return {
        title: "Enteric / Typhoid Fever (Salmonella Typhi)",
        hallmarks: "Step-ladder fever, Faget Sign (relative bradycardia), Rose spots on trunk, blood culture (Week 1)",
        treatment: "IV Ceftriaxone or Oral Azithromycin for 7-14 days",
        pearl: "Faget sign represents pulse-temperature dissociation where pulse remains relatively slow despite high fever."
      };
    } else {
      return {
        title: "Scrub Typhus (Orientia tsutsugamushi / Chigger Mite)",
        hallmarks: "High spiking fever, generalized lymphadenopathy, pathognomonic painless black cigarette-burn Eschar, Weil-Felix OX-K",
        treatment: "Oral Doxycycline (100 mg bid for 7 days) or Azithromycin (pregnancy)",
        pearl: "Inspection of groin/axillae for a painless black cigarette-burn eschar confirms the diagnosis."
      };
    }
  }, [selectedTropical]);

  const currentNodes = useMemo(() => {
    return INFECTIOUS_DISEASE_NODES[activeMode] || INFECTIOUS_DISEASE_NODES.sepsis;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: InfectiousDiseaseLabNode) => {
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
            <Bug size={14} /> ID-301
          </span>
          <span className={styles.titleText}>
            {activeMode === "sepsis" && "Sepsis-3 Consensus, SOFA/qSOFA & Surviving Sepsis Hour-1 Bundle"}
            {activeMode === "tropical" && "Fever of Unknown Origin & Tropical Fevers (Malaria, Dengue, Scrub Typhus)"}
            {activeMode === "eskape" && "MDR ESKAPE Superbugs (MRSA, VRE, CRE) & Molecular Diagnostics"}
            {activeMode === "stewardship" && "Antimicrobial Stewardship (ASP), WHO AWaRe & Procalcitonin Kinetics"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Infectious Disease Quiz"}
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
                  Infectious Disease Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Clinical Entity: {quizTargetNode.diagnosticCriteria}
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

          {/* Mode 1: Sepsis-3 & qSOFA Calculator */}
          {activeMode === "sepsis" && (
            <div className={styles.idCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <HeartPulse size={14} /> Sepsis-3 Bedside qSOFA Screener &amp; Hour-1 Bundle
                </span>
                <span className="text-[11px] text-slate-400">RR &ge;22 &bull; GCS &lt;15 &bull; SBP &le;100</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <label className="flex items-center gap-2 p-2 bg-slate-900/80 rounded border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={qsofaRR}
                    onChange={(e) => setQsofaRR(e.target.checked)}
                    className="accent-emerald-500"
                  />
                  <span>Tachypnea (RR &ge; 22/min)</span>
                </label>

                <label className="flex items-center gap-2 p-2 bg-slate-900/80 rounded border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={qsofaGCS}
                    onChange={(e) => setQsofaGCS(e.target.checked)}
                    className="accent-emerald-500"
                  />
                  <span>Altered Mentation (GCS &lt; 15)</span>
                </label>

                <label className="flex items-center gap-2 p-2 bg-slate-900/80 rounded border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={qsofaBP}
                    onChange={(e) => setQsofaBP(e.target.checked)}
                    className="accent-emerald-500"
                  />
                  <span>Hypotension (SBP &le; 100 mmHg)</span>
                </label>
              </div>

              <div className={styles.resultsGrid}>
                <div className={styles.resultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">qSOFA Score</div>
                  <div className={`text-xl font-extrabold ${qsofaScore >= 2 ? "text-red-400" : "text-emerald-400"}`}>
                    {qsofaScore} / 3
                  </div>
                </div>
                <div className={styles.resultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Risk Stratification</div>
                  <div className="text-xs font-bold text-yellow-300 mt-1">
                    {qsofaScore >= 2 ? "High Risk (ICU Alert)" : "Low Risk Bedside"}
                  </div>
                </div>
                <div className={styles.resultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Hour-1 Fluid Bolus</div>
                  <div className="text-xs font-bold text-emerald-300 mt-1">30 mL/kg Crystalloid</div>
                </div>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs text-slate-300">
                <div><strong className="text-emerald-400">Surviving Sepsis Hour-1 Bundle:</strong> 1. Lactate, 2. Blood cultures, 3. Broad-spectrum IV antibiotics, 4. 30 mL/kg balanced crystalloids, 5. Norepinephrine to maintain MAP &ge;65 mmHg.</div>
              </div>
            </div>
          )}

          {/* Mode 2: Tropical Fevers Explorer */}
          {activeMode === "tropical" && (
            <div className={styles.idCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Microscope size={14} /> Tropical &amp; Vector-Borne Fevers Station
                </span>
                <span className="text-[11px] text-slate-400">Malaria &bull; Dengue &bull; Typhoid &bull; Scrub Typhus</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => setSelectedTropical("malaria")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedTropical === "malaria"
                      ? "bg-emerald-600 text-white border-emerald-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🦟 Malaria (Artesunate)
                </button>
                <button
                  onClick={() => setSelectedTropical("dengue")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedTropical === "dengue"
                      ? "bg-emerald-600 text-white border-emerald-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🩸 Dengue (Plasma Leak)
                </button>
                <button
                  onClick={() => setSelectedTropical("typhoid")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedTropical === "typhoid"
                      ? "bg-emerald-600 text-white border-emerald-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🧪 Typhoid (Faget Sign)
                </button>
                <button
                  onClick={() => setSelectedTropical("scrub")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedTropical === "scrub"
                      ? "bg-emerald-600 text-white border-emerald-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🕷️ Scrub Typhus (Eschar)
                </button>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                <div className="text-sm font-bold text-emerald-300">{tropicalDetails.title}</div>
                <div className="text-slate-300 mt-1"><strong className="text-emerald-400">Hallmark Features:</strong> {tropicalDetails.hallmarks}</div>
                <div className="text-emerald-300 font-bold mt-1.5"><strong className="text-emerald-400">Targeted Protocol:</strong> {tropicalDetails.treatment}</div>
                <div className="text-yellow-300 font-semibold mt-1"><strong className="text-yellow-400">Clinical Pearl:</strong> {tropicalDetails.pearl}</div>
              </div>
            </div>
          )}

          {/* Mode 3: MDR ESKAPE Pathogens */}
          {activeMode === "eskape" && (
            <div className={styles.idCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert size={14} /> MDR ESKAPE Superbug Group
                </span>
                <span className="text-[11px] text-slate-400">MRSA &bull; VRE &bull; ESBL &bull; CRE &bull; C. auris</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-emerald-300 font-bold">MRSA (mecA PBP2a) &amp; Vancomycin</div>
                  <div className="text-slate-300 mt-1">Vancomycin (AUC/MIC 400-600) or Linezolid. Daptomycin is STRICTLY CONTRAINDICATED in pneumonia due to pulmonary surfactant binding.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-emerald-300 font-bold">CRE &amp; Novel Beta-Lactamase Inhibitors</div>
                  <div className="text-slate-300 mt-1">KPC/OXA-48 respond to Ceftazidime-Avibactam; NDM-1 metallo-beta-lactamases require Aztreonam + Ceftazidime-Avibactam or Cefiderocol.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 4: Antimicrobial Stewardship & AWaRe */}
          {activeMode === "stewardship" && (
            <div className={styles.idCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Pill size={14} /> WHO AWaRe Classification &amp; Procalcitonin Kinetics
                </span>
                <span className="text-[11px] text-slate-400">Access (&ge;60%) &bull; Watch &bull; Reserve &bull; PCT</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-emerald-300 font-bold">48-to-72-Hour Antibiotic Time-Out</div>
                  <div className="text-slate-300 mt-1">Review culture AST results; de-escalate from broad-spectrum Watch agents to targeted narrow Access agents; perform IV-to-Oral switch.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-emerald-300 font-bold">Serum Procalcitonin (PCT) Kinetics</div>
                  <div className="text-slate-300 mt-1">PCT &lt;0.25 ug/L or &gt;80% decrease confirms resolution of bacterial sepsis and guides safe early antibiotic discontinuation.</div>
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
                    <span className="text-emerald-400 font-bold">Treatment:</span> {node.treatmentProtocol}
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

        {/* Right Side: High-Yield Infectious Disease Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              ID Clinical Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🦠 Pathogen / Syndrome</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🔬 Diagnostic Hallmark</div>
            <div className={styles.inspectorBody}>{activeNode.diagnosticCriteria}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💊 Targeted Treatment Protocol</div>
            <div className={styles.inspectorBody}>{activeNode.treatmentProtocol}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 Gold Standard ID Pearl</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearl}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("sepsis")}
          className={`${styles.modeTab} ${activeMode === "sepsis" ? styles.modeTabActive : ""}`}
        >
          🚨 1. Sepsis &amp; Hour-1
        </button>
        <button
          onClick={() => setActiveMode("tropical")}
          className={`${styles.modeTab} ${activeMode === "tropical" ? styles.modeTabActive : ""}`}
        >
          🦟 2. Tropical Fevers
        </button>
        <button
          onClick={() => setActiveMode("eskape")}
          className={`${styles.modeTab} ${activeMode === "eskape" ? styles.modeTabActive : ""}`}
        >
          🦠 3. MDR ESKAPE
        </button>
        <button
          onClick={() => setActiveMode("stewardship")}
          className={`${styles.modeTab} ${activeMode === "stewardship" ? styles.modeTabActive : ""}`}
        >
          💊 4. Stewardship &amp; AWaRe
        </button>
      </div>
    </div>
  );
}
