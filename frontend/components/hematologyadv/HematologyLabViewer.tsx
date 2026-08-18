"use client";

import React, { useState, useMemo } from "react";
import styles from "./HematologyLabViewer.module.css";
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
  Flame,
  Dna,
  HeartPulse,
  Radio,
  TestTube,
} from "lucide-react";

export type HematologyLabMode = "coag" | "anemia" | "leukemia" | "plasma";

export interface HematologyLabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  diagnosticProfile: string;
  pathophysiology: string;
  clinicalHallmarks: string;
  highYieldPearls: string;
}

export const HEMATOLOGY_LAB_NODES: Record<HematologyLabMode, HematologyLabNode[]> = {
  coag: [
    {
      id: "hem-coag-ttp-adamts13",
      name: "Thrombotic Thrombocytopenic Purpura (ADAMTS13 & PLEX)",
      category: "Microangiopathy",
      subType: "ADAMTS13 <10% • FAT RN Pentad • Normal PT/PTT • Schistocytes • Emergent PLEX",
      diagnosticProfile: "Severe thrombocytopenia, MAHA with abundant schistocytes, elevated LDH, indirect bilirubin; NORMAL PT/aPTT.",
      pathophysiology: "Deficiency of ADAMTS13 metalloprotease prevents cleavage of ultra-large vWF multimers, inducing microvascular platelet thrombosis.",
      clinicalHallmarks: "Fever, Anemia, Thrombocytopenia, Renal dysfunction, Neurological deficits (FAT RN); treat with Emergent Plasma Exchange + Caplacizumab.",
      highYieldPearls: "Platelet transfusions are STRICTLY CONTRAINDICATED as they exacerbate microvascular thrombosis."
    },
    {
      id: "hem-coag-dic-consumption",
      name: "Disseminated Intravascular Coagulation (Microthrombi & Coagulopathy)",
      category: "Consumption Coagulopathy",
      subType: "Prolonged PT & aPTT • Low Fibrinogen • High D-Dimer • Low Platelets • Sepsis/APL",
      diagnosticProfile: "Elevated PT/INR, elevated aPTT, elevated D-dimer (>20 ug/mL), decreased fibrinogen (<100 mg/dL), thrombocytopenia, schistocytes.",
      pathophysiology: "Systemic activation of coagulation produces widespread microvascular fibrin deposition and massive consumption of clotting factors.",
      clinicalHallmarks: "Oozing from venipuncture sites, petechiae, ecchymoses, multi-organ failure; treat underlying trigger (sepsis, trauma, APL).",
      highYieldPearls: "Distinguished from TTP and ITP by PROLONGED PT and aPTT with low fibrinogen and very high D-dimer."
    }
  ],

  anemia: [
    {
      id: "hem-anemia-iron-deficiency",
      name: "Iron Deficiency Anemia (Low Ferritin & High TIBC)",
      category: "Microcytic Hypochromic",
      subType: "MCV <80 • Low Ferritin (<30) • High TIBC • Low Sat (<15%) • Pencil Cells",
      diagnosticProfile: "Microcytic hypochromic indices, low serum iron, elevated TIBC, ferritin <30 ug/L, transferrin sat <15%, high RDW.",
      pathophysiology: "Depleted total body iron stores impair heme synthesis, producing small pale erythrocytes with high anisocytosis.",
      clinicalHallmarks: "Fatigue, pallor, pica (ice craving), koilonychia (spoon nails), atrophic glossitis; oral ferrous sulfate or IV iron.",
      highYieldPearls: "Ferritin <30 ug/L is the single most specific test for iron deficiency; Mentzer index >13 helps distinguish from thalassemia."
    },
    {
      id: "hem-anemia-b12-deficiency",
      name: "Vitamin B12 Deficiency (High MMA, Homocysteine & Neuropathy)",
      category: "Macrocytic Megaloblastic",
      subType: "MCV >100 • High MMA • High Homocysteine • Hypersegmented PMNs • SCD Neuropathy",
      diagnosticProfile: "Macrocytic anemia, hypersegmented neutrophils (>=5 lobes), elevated serum Methylmalonic Acid (MMA) and Homocysteine.",
      pathophysiology: "Cobalamin deficiency impairs DNA synthesis (megaloblastic changes) and methylmalonyl-CoA mutase, producing toxic myelin accumulation.",
      clinicalHallmarks: "Subacute combined degeneration of spinal cord (loss of vibration/proprioception, ataxia), glossitis, dementia; parenteral B12.",
      highYieldPearls: "Elevated Methylmalonic Acid (MMA) definitively separates B12 deficiency from Folate deficiency (where MMA is normal)."
    }
  ],

  leukemia: [
    {
      id: "hem-leuk-apl-atra",
      name: "Acute Promyelocytic Leukemia (t(15;17) Auer Rods & ATRA)",
      category: "Acute Myeloid Leukemia",
      subType: "t(15;17) PML-RARA • Auer Rods (Faggot Cells) • Severe DIC Risk • Emergency ATRA + ATO",
      diagnosticProfile: ">20% promyelocytes with stacked Auer rods (MPO+), t(15;17) translocation, severe consumption DIC coagulopathy.",
      pathophysiology: "PML-RARA fusion protein blocks promyelocytic differentiation; granule release triggers life-threatening consumptive DIC.",
      clinicalHallmarks: "Gingival bleeding, epistaxis, ecchymoses, fatal intracranial hemorrhage; emergency treatment is All-trans Retinoic Acid (ATRA) + ATO.",
      highYieldPearls: "ATRA must be started immediately upon suspicion of APL without waiting for cytogenetic confirmation to prevent fatal DIC hemorrhage."
    },
    {
      id: "hem-leuk-cml-bcr-abl",
      name: "Chronic Myelogenous Leukemia (t(9;22) BCR-ABL1 & Imatinib)",
      category: "Myeloproliferative Neoplasm",
      subType: "t(9;22) Philadelphia Chromosome • Low LAP Score • Basophilia • Splenomegaly • Imatinib",
      diagnosticProfile: "Marked leukocytosis (>100,000/uL) with entire spectrum of myeloid cells, basophilia, severely low LAP score, t(9;22) translocation.",
      pathophysiology: "BCR-ABL1 fusion gene produces a constitutively active tyrosine kinase driving uncontrolled myeloid proliferation.",
      clinicalHallmarks: "Massive splenomegaly, constitutional symptoms, early satiety; targeted therapy with BCR-ABL1 Tyrosine Kinase Inhibitors (Imatinib).",
      highYieldPearls: "Low Leukocyte Alkaline Phosphatase (LAP) score differentiates CML from a benign leukemoid reaction (where LAP is high)."
    }
  ],

  plasma: [
    {
      id: "hem-plasma-multiple-myeloma",
      name: "Multiple Myeloma (CRAB Criteria & M-Spike)",
      category: "Plasma Cell Dyscrasia",
      subType: "CRAB Criteria • Clonal Plasma Cells >=10% • IgG/IgA M-Spike • Punched-Out Lytic Lesions",
      diagnosticProfile: "Monoclonal M-protein spike on SPEP, clonal bone marrow plasma cells >=10%, hypercalcemia, renal failure, anemia, lytic bone lesions.",
      pathophysiology: "Clonal neoplastic plasma cell expansion secretes monoclonal immunoglobulins and osteoclast-activating factors (RANKL/DKK1).",
      clinicalHallmarks: "Bone pain/pathologic fractures, light chain cast nephropathy, Rouleaux formation; treated with Bortezomib, Lenalidomide, Dexamethasone.",
      highYieldPearls: "CRAB criteria: Calcium >11, Renal Cr >2.0, Anemia Hb <10, Bone lytic lesions (no osteoblastic activity on bone scan!)."
    },
    {
      id: "hem-plasma-burkitt-lymphoma",
      name: "Burkitt Lymphoma (t(8;14) MYC & Starry-Sky Histology)",
      category: "Aggressive Non-Hodgkin Lymphoma",
      subType: "t(8;14) c-MYC • Starry-Sky Macrophages • Endemic Jaw / Sporadic Abdominal • Ki-67 ~100%",
      diagnosticProfile: "High-grade B-cell lymphoma, t(8;14) translocation overexpressing c-MYC, Ki-67 proliferation index approaching 100%.",
      pathophysiology: "Translocation of c-MYC to Ig heavy chain locus drives extremely rapid cellular proliferation and high apoptotic rate.",
      clinicalHallmarks: "Endemic African jaw mass (EBV-associated), sporadic ileocecal abdominal mass; 'starry-sky' histology with tingible-body macrophages.",
      highYieldPearls: "Highest proliferation fraction of any human malignancy; high risk for Tumor Lysis Syndrome requiring Rasburicase/hydration."
    }
  ]
};

interface HematologyLabViewerProps {
  initialMode?: HematologyLabMode;
  height?: string;
  onNodeSelect?: (node: HematologyLabNode) => void;
}

export default function HematologyLabViewer({
  initialMode = "coag",
  height = "560px",
  onNodeSelect,
}: HematologyLabViewerProps) {
  const [activeMode, setActiveMode] = useState<HematologyLabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Microcytic Selector State
  const [selectedMicro, setSelectedMicro] = useState<"ida" | "acd" | "thal" | "sidero">("ida");

  // Leukemia Selector State
  const [selectedLeuk, setSelectedLeuk] = useState<"aml" | "all" | "cml" | "cll">("aml");

  const microDetails = useMemo(() => {
    if (selectedMicro === "ida") {
      return {
        title: "Iron Deficiency Anemia (IDA)",
        profile: "Low Iron (↓) • High TIBC (↑) • Ferritin <30 (↓↓) • Sat <15% (↓) • High RDW",
        smear: "Microcytic hypochromic red cells with pencil/cigar cells and anisopoikilocytosis",
        pearl: "Ferritin <30 ug/L is pathognomonic; Mentzer Index (MCV/RBC) >13."
      };
    } else if (selectedMicro === "acd") {
      return {
        title: "Anemia of Chronic Disease / Inflammation",
        profile: "Low Iron (↓) • Low TIBC (↓) • Normal/High Ferritin (↑) • Normal/Low Sat",
        smear: "Normocytic or mildly microcytic red cells with inflammatory markers",
        pearl: "Driven by IL-6 and Hepcidin upregulation trapping iron inside macrophages."
      };
    } else if (selectedMicro === "thal") {
      return {
        title: "Thalassemia Trait (Alpha or Beta Minor)",
        profile: "Normal Iron • Normal TIBC • Normal/High Ferritin • Mentzer Index <13",
        smear: "Microcytic red cells with prominent Target cells and basophilic stippling",
        pearl: "Elevated HbA2 >3.5% on hemoglobin electrophoresis in Beta-thalassemia minor."
      };
    } else {
      return {
        title: "Sideroblastic Anemia (ALAS2 / Lead / Alcohol)",
        profile: "High Iron (↑) • Normal/Low TIBC • High Ferritin (↑) • High Sat (>50%)",
        smear: "Dimorphic red cell population; Ringed Sideroblasts on Prussian blue bone marrow stain",
        pearl: "Mitochondrial iron accumulation around the erythroblast nucleus."
      };
    }
  }, [selectedMicro]);

  const leukDetails = useMemo(() => {
    if (selectedLeuk === "aml") {
      return {
        title: "Acute Myeloid Leukemia (AML / APL)",
        profile: ">20% Myeloblasts • Auer Rods (MPO+) • t(15;17) PML-RARA in APL • High DIC Risk",
        management: "Emergency ATRA + Arsenic Trioxide (ATO) for APL; 7+3 Cytarabine + Daunorubicin for AML",
        pearl: "Auer rods are crystalline fused lysosomes containing myeloperoxidase; ATRA cures APL DIC."
      };
    } else if (selectedLeuk === "all") {
      return {
        title: "Acute Lymphoblastic Leukemia (ALL)",
        profile: ">20% Lymphoblasts • TdT+ • CALLA CD10+ • Pediatric Peak (2-5y) • t(12;21) / t(9;22)",
        management: "Multi-agent chemotherapy with CNS prophylaxis + Tyrosine Kinase Inhibitors if Ph+",
        pearl: "TdT (terminal deoxynucleotidyl transferase) is expressed exclusively in lymphoblasts."
      };
    } else if (selectedLeuk === "cml") {
      return {
        title: "Chronic Myelogenous Leukemia (CML)",
        profile: "t(9;22) BCR-ABL1 • Low LAP Score • Full Myeloid Spectrum • Basophilia • Massive Spleen",
        management: "Targeted BCR-ABL1 Tyrosine Kinase Inhibitors (Imatinib, Dasatinib, Nilotinib)",
        pearl: "Low LAP score differentiates CML from leukemoid reaction (where LAP is elevated)."
      };
    } else {
      return {
        title: "Chronic Lymphocytic Leukemia (CLL)",
        profile: "Mature CD5+ CD19+ CD23+ B-cells • Smudge / Basket Cells • Lymphadenopathy • Elderly",
        management: "BTK Inhibitors (Ibrutinib, Acalabrutinib) or BCL-2 Inhibitors (Venetoclax)",
        pearl: "Fragile leukemic lymphocytes rupture during smear preparation, creating 'smudge cells'."
      };
    }
  }, [selectedLeuk]);

  const currentNodes = useMemo(() => {
    return HEMATOLOGY_LAB_NODES[activeMode] || HEMATOLOGY_LAB_NODES.coag;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: HematologyLabNode) => {
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
            <Droplet size={14} /> HEM-301
          </span>
          <span className={styles.titleText}>
            {activeMode === "coag" && "Coagulation Cascades, Platelet Disorders & Hemostasis"}
            {activeMode === "anemia" && "Anemia Algorithmic Diagnostic Profiling (MCV & Reticulocyte Index)"}
            {activeMode === "leukemia" && "Acute & Chronic Leukemias & Myeloproliferative Neoplasms"}
            {activeMode === "plasma" && "Plasma Cell Dyscrasias (Multiple Myeloma) & Malignant Lymphomas"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Hematology Diagnostic Quiz"}
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
                <div className="text-xs font-bold text-red-300 uppercase tracking-wider">
                  Hematology Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Hematological Entity: {quizTargetNode.clinicalHallmarks}
                </div>
                {quizFeedback && (
                  <div className="text-xs text-red-300 font-medium mt-1">{quizFeedback}</div>
                )}
              </div>
              <button
                onClick={nextQuizQuestion}
                className="px-3 py-1 bg-red-950 text-xs rounded border border-red-700 text-red-200"
              >
                Next
              </button>
            </div>
          )}

          {/* Mode 1: Coagulation & Platelet Disorders */}
          {activeMode === "coag" && (
            <div className={styles.hematologyCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={14} /> Primary vs Secondary Hemostasis Profiler
                </span>
                <span className="text-[11px] text-slate-400">ITP &bull; TTP &bull; DIC &bull; vWD &bull; Hemophilia</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-red-300 font-bold">TTP (ADAMTS13 Deficiency)</div>
                  <div className="text-slate-300 mt-1">FAT RN Pentad (Fever, Anemia MAHA, Thrombocytopenia, Renal, Neuro). PT/PTT NORMAL! Emergent PLEX + Caplacizumab. Platelet transfusions strictly CONTRAINDICATED!</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-red-300 font-bold">DIC (Consumption Coagulopathy)</div>
                  <div className="text-slate-300 mt-1">Widespread microthrombi consuming clotting factors. High PT, high PTT, high D-dimer, low fibrinogen, low platelets, schistocytes. Treat underlying trigger.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 2: Anemia Profiler */}
          {activeMode === "anemia" && (
            <div className={styles.hematologyCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                  <TestTube size={14} /> Microcytic Anemia Differential Explorer (MCV &lt;80 fL)
                </span>
                <span className="text-[11px] text-slate-400">Iron &bull; TIBC &bull; Ferritin &bull; Mentzer Index</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => setSelectedMicro("ida")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedMicro === "ida"
                      ? "bg-red-600 text-white border-red-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🩸 Iron Deficiency
                </button>
                <button
                  onClick={() => setSelectedMicro("acd")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedMicro === "acd"
                      ? "bg-red-600 text-white border-red-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🛡️ Chronic Disease
                </button>
                <button
                  onClick={() => setSelectedMicro("thal")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedMicro === "thal"
                      ? "bg-red-600 text-white border-red-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🎯 Thalassemia Minor
                </button>
                <button
                  onClick={() => setSelectedMicro("sidero")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedMicro === "sidero"
                      ? "bg-red-600 text-white border-red-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  💍 Sideroblastic
                </button>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                <div className="text-sm font-bold text-red-300">{microDetails.title}</div>
                <div className="text-emerald-400 font-bold mt-1">{microDetails.profile}</div>
                <div className="text-slate-300 mt-1"><strong className="text-red-400">Smear:</strong> {microDetails.smear}</div>
                <div className="text-yellow-300 font-semibold mt-1"><strong className="text-yellow-400">Diagnostic Pearl:</strong> {microDetails.pearl}</div>
              </div>
            </div>
          )}

          {/* Mode 3: Leukemias & MPNs */}
          {activeMode === "leukemia" && (
            <div className={styles.hematologyCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Dna size={14} /> Leukemia Classification &amp; Targeted Pharmacotherapy
                </span>
                <span className="text-[11px] text-slate-400">AML &bull; ALL &bull; CML &bull; CLL</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => setSelectedLeuk("aml")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedLeuk === "aml"
                      ? "bg-red-600 text-white border-red-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  ⚡ AML / APL
                </button>
                <button
                  onClick={() => setSelectedLeuk("all")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedLeuk === "all"
                      ? "bg-red-600 text-white border-red-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  👶 ALL (TdT+)
                </button>
                <button
                  onClick={() => setSelectedLeuk("cml")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedLeuk === "cml"
                      ? "bg-red-600 text-white border-red-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🧬 CML (t(9;22))
                </button>
                <button
                  onClick={() => setSelectedLeuk("cll")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedLeuk === "cll"
                      ? "bg-red-600 text-white border-red-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🧺 CLL (Smudge)
                </button>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                <div className="text-sm font-bold text-red-300">{leukDetails.title}</div>
                <div className="text-emerald-400 font-bold mt-1">{leukDetails.profile}</div>
                <div className="text-slate-300 mt-1"><strong className="text-red-400">Targeted Therapy:</strong> {leukDetails.management}</div>
                <div className="text-yellow-300 font-semibold mt-1"><strong className="text-yellow-400">High-Yield Pearl:</strong> {leukDetails.pearl}</div>
              </div>
            </div>
          )}

          {/* Mode 4: Plasma Cell Dyscrasias & Lymphomas */}
          {activeMode === "plasma" && (
            <div className={styles.hematologyCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Flame size={14} /> Multiple Myeloma CRAB Criteria &amp; Lymphoma Hallmarks
                </span>
                <span className="text-[11px] text-slate-400">CRAB &bull; M-Spike &bull; Reed-Sternberg &bull; Burkitt</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-red-300 font-bold">Multiple Myeloma CRAB Criteria</div>
                  <div className="text-slate-300 mt-1"><strong>C</strong>alcium &gt;11 &bull; <strong>R</strong>enal Cr &gt;2.0 (cast nephropathy) &bull; <strong>A</strong>nemia &bull; <strong>B</strong>one lytic punched-out lesions. Clonal marrow plasma cells &ge;10% + IgG/IgA M-spike.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-red-300 font-bold">Hodgkin vs Burkitt Lymphoma</div>
                  <div className="text-slate-300 mt-1">Hodgkin: Reed-Sternberg cells (CD15+/CD30+), B-symptoms. Burkitt: t(8;14) c-MYC, starry-sky pattern, Ki-67 ~100%, endemic jaw mass.</div>
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
                    <span className="text-red-400 font-bold">Diagnostic Profile:</span> {node.diagnosticProfile}
                  </div>

                  <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400">
                    <span>Inspect dynamics</span>
                    <ArrowRight size={12} className="text-slate-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: High-Yield Hematology Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
              Hematology Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🩸 Disease Entity / Neoplasm</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🧪 Laboratory &amp; Flow Profile</div>
            <div className="text-xs text-red-300 font-semibold">{activeNode.diagnosticProfile}</div>
            <div className={styles.inspectorBody}>{activeNode.pathophysiology}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🩺 Clinical Features &amp; Targeted Therapy</div>
            <div className={styles.inspectorBody}>{activeNode.clinicalHallmarks}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 Gold Standard Diagnostic Pearls</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearls}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("coag")}
          className={`${styles.modeTab} ${activeMode === "coag" ? styles.modeTabActive : ""}`}
        >
          🩸 1. Coagulation &amp; Platelets
        </button>
        <button
          onClick={() => setActiveMode("anemia")}
          className={`${styles.modeTab} ${activeMode === "anemia" ? styles.modeTabActive : ""}`}
        >
          🧪 2. Anemia Profiler
        </button>
        <button
          onClick={() => setActiveMode("leukemia")}
          className={`${styles.modeTab} ${activeMode === "leukemia" ? styles.modeTabActive : ""}`}
        >
          🧬 3. Leukemias &amp; MPNs
        </button>
        <button
          onClick={() => setActiveMode("plasma")}
          className={`${styles.modeTab} ${activeMode === "plasma" ? styles.modeTabActive : ""}`}
        >
          🔥 4. Myeloma &amp; Lymphomas
        </button>
      </div>
    </div>
  );
}
