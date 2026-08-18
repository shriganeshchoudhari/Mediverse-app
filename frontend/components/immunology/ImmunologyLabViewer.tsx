"use client";

import React, { useState, useMemo } from "react";
import styles from "./ImmunologyLabViewer.module.css";
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

export type ImmunologyLabMode = "pid" | "hypersensitivity" | "autoimmunity" | "biologics";

export interface ImmunologyLabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  immunologicMechanism: string;
  diagnosticCriteria: string;
  clinicalProtocol: string;
  highYieldPearl: string;
}

export const IMMUNOLOGY_NODES: Record<ImmunologyLabMode, ImmunologyLabNode[]> = {
  pid: [
    {
      id: "imm-scid-ada-il2rg",
      name: "Severe Combined Immunodeficiency (SCID)",
      category: "Primary Immunodeficiency",
      subType: "IL2RG Common Gamma Chain / ADA Deficiency • Absent T & B Cells • Absent Thymic Shadow",
      immunologicMechanism: "Defect in common gamma chain of IL-2, 4, 7, 9, 15, 21 receptors (X-linked) or ADA deficiency (toxic dATP buildup).",
      diagnosticCriteria: "Onset <3 months with recurrent severe viral/fungal/bacterial infections, chronic diarrhea, failure to thrive, absent tonsils/thymic shadow.",
      clinicalProtocol: "Definitive curative therapy: Emergent Allogeneic Hematopoietic Stem Cell Transplant (HSCT). Strict isolation in positive-pressure laminar airflow room.",
      highYieldPearl: "SCID is characterized by early infant failure to thrive, chronic diarrhea, absent thymic shadow on chest radiograph, and absent T cells; definitive cure is HSCT."
    },
    {
      id: "imm-cgd-dhr-respiratory-burst",
      name: "Chronic Granulomatous Disease (CGD)",
      category: "Phagocyte Defect",
      subType: "NADPH Oxidase (gp91phox) Mutation • Catalase-Positive Organisms • DHR 123 Flow Assay",
      immunologicMechanism: "Inability of neutrophils and macrophages to generate reactive oxygen species (superoxide / H2O2) during respiratory burst.",
      diagnosticCriteria: "Recurrent lymphadenitis, liver/skin abscesses from Catalase-Positive bugs (S. aureus, Burkholderia, Serratia, Nocardia, Aspergillus). Abnormal DHR 123 flow cytometry.",
      clinicalProtocol: "Lifelong antimicrobial prophylaxis with TMP-SMX + Itraconazole; subcutaneous Interferon-gamma (IFN-gamma) therapy.",
      highYieldPearl: "Dihydrorhodamine 123 (DHR) flow cytometry assay demonstrating absence of green fluorescence oxidation confirms Chronic Granulomatous Disease."
    }
  ],

  hypersensitivity: [
    {
      id: "imm-type-i-anaphylaxis-epinephrine",
      name: "Type I: IgE Anaphylaxis & Mast Cell Mediators",
      category: "Immediate Hypersensitivity",
      subType: "IgE / FceRI Cross-Linking • Histamine, LTC4/D4/E4, Tryptase • IM Epinephrine 1:1000",
      immunologicMechanism: "Antigen cross-links pre-formed IgE on mast cells/basophils, triggering immediate degranulation of histamine, cysteinyl leukotrienes, and tryptase.",
      diagnosticCriteria: "Rapid onset (minutes) acute urticaria, angioedema, bronchospasm/wheezing, and hypotension/shock following allergen exposure.",
      clinicalProtocol: "Immediate intramuscular (IM) Epinephrine 1:1000 (0.3-0.5 mg) into anterolateral thigh. High-flow oxygen, IV fluid resuscitation, H1/H2 blockers.",
      highYieldPearl: "Intramuscular epinephrine into the anterolateral thigh is the first-line treatment of choice for anaphylaxis, activating alpha-1 vasoconstriction and beta-2 bronchodilation."
    },
    {
      id: "imm-type-iii-serum-sickness-complexes",
      name: "Type III: Immune Complex Serum Sickness",
      category: "Immune Complex Disease",
      subType: "Circulating IgG/IgM Complexes • 7-14 Days Onset • Low C3/C4 • Triad: Fever, Rash, Arthralgia",
      immunologicMechanism: "Soluble antigen-antibody complexes deposit in small blood vessel walls, activating classical complement and recruiting neutrophils (fibrinoid necrosis).",
      diagnosticCriteria: "Presents 7-14 days post-foreign protein/drug exposure with triad of fever, urticarial rash, and polyarthralgias with marked hypocomplementemia (low C3/C4).",
      clinicalProtocol: "Discontinuation of offending agent; oral corticosteroids (Prednisone 0.5-1 mg/kg/day) for severe symptoms; supportive antihistamines.",
      highYieldPearl: "Serum sickness is a Type III hypersensitivity reaction presenting 7-14 days post-exposure with fever, urticaria, polyarthralgias, and profound complement (C3/C4) consumption."
    }
  ],

  autoimmunity: [
    {
      id: "imm-hla-b27-spondyloarthropathies",
      name: "HLA-B27 & Seronegative Spondyloarthropathies",
      category: "MHC-I Autoimmune Association",
      subType: "HLA-B27 Class I Allele • 'PAIR' Diseases • Sacroiliitis & Bamboo Spine",
      immunologicMechanism: "HLA-B27 presents arthritogenic self or microbial peptides to CD8+ cytotoxic T cells, promoting enthesitis and osteoproliferative joint remodeling.",
      diagnosticCriteria: "Bilateral sacroiliitis, inflammatory back pain (improves with exercise), anterior uveitis, dactylitis ('sausage digits'), and positive HLA-B27.",
      clinicalProtocol: "First-line: Scheduled high-dose NSAIDs; Refractory disease: Anti-TNF-alpha (Infliximab/Adalimumab) or Anti-IL-17A (Secukinumab).",
      highYieldPearl: "HLA-B27 is strongly linked to the 'PAIR' seronegative spondyloarthropathies: Psoriatic arthritis, Ankylosing spondylitis, IBD spondylitis, and Reactive arthritis."
    },
    {
      id: "imm-sle-dsdna-smith-nephritis",
      name: "SLE Autoantibodies: Anti-dsDNA & Anti-Smith",
      category: "Systemic Autoimmunity",
      subType: "Anti-dsDNA (Lupus Nephritis Activity) • Anti-Smith (Most Specific >99%) • Hypocomplementemia",
      immunologicMechanism: "Loss of B-cell tolerance leads to autoantibodies against nuclear antigens, forming immune complexes that deposit in glomeruli, skin, and joints.",
      diagnosticCriteria: "EULAR/ACR Criteria: Positive ANA plus criterion scores (malar rash, photosensitivity, lupus nephritis, cytopenias, serositis, anti-dsDNA/anti-Smith).",
      clinicalProtocol: "Hydroxychloroquine for all SLE patients; high-dose pulse steroids + Mycophenolate Mofetil or Cyclophosphamide for proliferative lupus nephritis.",
      highYieldPearl: "Anti-Smith is the most specific autoantibody for SLE (>99%), whereas Anti-dsDNA titers correlate directly with active lupus nephritis and hypocomplementemia."
    }
  ],

  biologics: [
    {
      id: "imm-anti-tnf-latent-tb-screening",
      name: "Anti-TNF Biologics & Latent TB Screening",
      category: "Targeted Monoclonal Therapy",
      subType: "Infliximab / Adalimumab • Granuloma Dissolution • Mandatory Baseline IGRA/PPD Screening",
      immunologicMechanism: "Neutralizes soluble and membrane-bound TNF-alpha, reducing proinflammatory cytokines but disrupting macrophage granulomas.",
      diagnosticCriteria: "Approved for severe RA, Crohn disease, ulcerative colitis, ankylosing spondylitis, and plaque psoriasis.",
      clinicalProtocol: "Mandatory baseline screening for Latent Tuberculosis with IGRA or PPD. If positive, initiate isoniazid/rifampin prophylaxis >=1 month before starting anti-TNF.",
      highYieldPearl: "Anti-TNF-alpha therapy disrupts the granulomas that sequester Mycobacterium tuberculosis; all patients must undergo mandatory latent TB screening before initiation."
    },
    {
      id: "imm-cd4-hiv-staging-prophylaxis",
      name: "CD4+ T-Cell Staging & HIV Prophylaxis",
      category: "Immunophenotyping & Prophylaxis",
      subType: "CD4 <200 (PCP TMP-SMX) • CD4 <100 (Toxo TMP-SMX) • CD4 <50 (MAC Azithromycin)",
      immunologicMechanism: "Flow cytometric enumeration of CD3+ CD4+ helper T cells quantifies cellular immune exhaustion and predicts opportunistic pathogen risks.",
      diagnosticCriteria: "CD4 <200/uL defines Stage 3 AIDS and triggers mandatory primary prophylaxis against Pneumocystis jirovecii pneumonia.",
      clinicalProtocol: "First-line PCP and Toxoplasma prophylaxis: daily double-strength TMP-SMX. Discontinue when CD4 count remains >200/uL on ART for >=3 months.",
      highYieldPearl: "A CD4+ T-cell count <200/uL mandates immediate initiation of TMP-SMX for Pneumocystis jirovecii pneumonia (PCP) prophylaxis."
    }
  ]
};

interface ImmunologyLabViewerProps {
  initialMode?: ImmunologyLabMode;
  height?: string;
  onNodeSelect?: (node: ImmunologyLabNode) => void;
}

export default function ImmunologyLabViewer({
  initialMode = "pid",
  height = "560px",
  onNodeSelect,
}: ImmunologyLabViewerProps) {
  const [activeMode, setActiveMode] = useState<ImmunologyLabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // PID State
  const [selectedPid, setSelectedPid] = useState<"scid" | "xla" | "cvid" | "cgd" | "hae">("scid");

  // Hypersensitivity State
  const [selectedHyper, setSelectedHyper] = useState<"type1" | "type2" | "type3" | "type4">("type1");

  // PID Details
  const pidDetails = useMemo(() => {
    if (selectedPid === "scid") {
      return {
        name: "Severe Combined Immunodeficiency (SCID)",
        defect: "IL2RG Common Gamma Chain (50%) or ADA Deficiency",
        cells: "Absent T cells (CD3+) & B cells; Absent thymic shadow",
        clinical: "Severe infections <3m; Chronic diarrhea; FTT",
        rx: "Emergent Allogeneic HSCT (Bone Marrow Transplant)",
        color: "text-indigo-400 font-bold"
      };
    } else if (selectedPid === "xla") {
      return {
        name: "X-Linked (Bruton) Agammaglobulinemia (XLA)",
        defect: "Bruton Tyrosine Kinase (BTK) Mutation",
        cells: "Absent mature B cells (CD19+ <1%); Pan-hypogammaglobulinemia",
        clinical: "Onset >6m with recurrent sinopulmonary pyogenic bacterial infections",
        rx: "Lifelong IVIG / SCIG replacement therapy; Avoid live vaccines",
        color: "text-purple-400 font-bold"
      };
    } else if (selectedPid === "cvid") {
      return {
        name: "Common Variable Immunodeficiency (CVID)",
        defect: "Defect in B-cell differentiation into antibody-secreting plasma cells",
        cells: "Normal B-cell count (CD19+); Severely reduced IgG, IgA, IgM",
        clinical: "Presents in young adulthood (20-40y); Bronchiectasis; Lymphoma risk",
        rx: "Lifelong regular IVIG / SCIG immunoglobulin replacement",
        color: "text-sky-400 font-bold"
      };
    } else if (selectedPid === "cgd") {
      return {
        name: "Chronic Granulomatous Disease (CGD)",
        defect: "NADPH Oxidase complex (gp91phox) Mutation",
        cells: "Normal lymphocyte counts; Phagocytes fail to produce superoxide ROS",
        clinical: "Recurrent catalase-positive abscesses (S. aureus, Burkholderia, Serratia, Aspergillus)",
        rx: "Daily TMP-SMX + Itraconazole prophylaxis; Subcutaneous IFN-gamma",
        color: "text-amber-400 font-bold"
      };
    } else {
      return {
        name: "C1 Esterase Inhibitor Deficiency (Hereditary Angioedema)",
        defect: "SERPING1 gene mutation -> Uncontrolled Kallikrein-Kinin activation",
        cells: "Elevated Bradykinin; Markedly low serum C4 levels",
        clinical: "Recurrent subcutaneous/submucosal edema (larynx/GI); NO urticaria or pruritus",
        rx: "C1-INH concentrate, Icatibant (Bradykinin B2 blocker), or Ecallantide",
        color: "text-rose-400 font-bold"
      };
    }
  }, [selectedPid]);

  const hyperDetails = useMemo(() => {
    if (selectedHyper === "type1") {
      return {
        title: "Type I Hypersensitivity (Immediate / IgE)",
        mediator: "IgE antibodies bound to FceRI on mast cells and basophils",
        mechanism: "Allergen cross-linking -> Degranulation of Histamine, LTC4/D4/E4, Tryptase",
        onset: "15 to 30 minutes (Immediate)",
        examples: "Anaphylaxis, Allergic asthma, Allergic rhinitis, Urticaria",
        firstLine: "Intramuscular Epinephrine 1:1000 (0.3 - 0.5 mg) into anterolateral thigh"
      };
    } else if (selectedHyper === "type2") {
      return {
        title: "Type II Hypersensitivity (Antibody-Mediated Cytotoxic)",
        mediator: "IgG or IgM against fixed cell-surface or extracellular matrix antigens",
        mechanism: "Complement MAC lysis, C3b opsonization, ADCC via NK cells, or receptor stimulation/blockade",
        onset: "Hours to days",
        examples: "Goodpasture (anti-GBM), Myasthenia gravis (anti-AChR), Graves (anti-TSHR), ITP, Pemphigus",
        firstLine: "High-dose corticosteroids, IVIG, Therapeutic Plasma Exchange (TPE)"
      };
    } else if (selectedHyper === "type3") {
      return {
        title: "Type III Hypersensitivity (Immune Complex Disease)",
        mediator: "Circulating soluble IgG/IgM Antigen-Antibody complexes",
        mechanism: "Vascular complex deposition -> Classical complement activation (low C3/C4) -> Neutrophil vasculitis",
        onset: "7 to 14 days (1-2 weeks)",
        examples: "Acute Serum Sickness, SLE lupus nephritis, PSGN, Polyarteritis nodosa",
        firstLine: "Removal of offending agent, systemic corticosteroids, immunosuppression"
      };
    } else {
      return {
        title: "Type IV Hypersensitivity (Delayed-Type Cell-Mediated)",
        mediator: "Sensitized CD4+ (Th1/Th17) and CD8+ cytotoxic T lymphocytes (NO antibodies!)",
        mechanism: "Th1 release of IFN-gamma -> Macrophage activation & granulomas; CD8+ perforin/granzyme lysis",
        onset: "24 to 72 hours (Peak 48 hours)",
        examples: "Tuberculin (PPD) skin test, Contact dermatitis (Poison ivy / Nickel), GvHD, Multiple Sclerosis",
        firstLine: "Topical or systemic corticosteroids, calcineurin inhibitors (Tacrolimus)"
      };
    }
  }, [selectedHyper]);

  const currentNodes = useMemo(() => {
    return IMMUNOLOGY_NODES[activeMode] || IMMUNOLOGY_NODES.pid;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: ImmunologyLabNode) => {
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
            <Award size={14} /> IMM-201
          </span>
          <span className={styles.titleText}>
            {activeMode === "pid" && "Primary Immunodeficiencies (SCID, XLA, CVID, CGD & HAE)"}
            {activeMode === "hypersensitivity" && "Gell & Coombs Hypersensitivity Matrix (Types I, II, III & IV)"}
            {activeMode === "autoimmunity" && "Autoimmunity, HLA Associations & Serologic Autoantibodies"}
            {activeMode === "biologics" && "Flow Cytometry CD Gating & Targeted Monoclonal Biologics"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Immunology Quiz"}
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
                  Clinical Immunology Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Disorder / Mechanism: {quizTargetNode.diagnosticCriteria}
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

          {/* Mode 1: Primary Immunodeficiency Simulator */}
          {activeMode === "pid" && (
            <div className={styles.immSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert size={14} /> Primary Immunodeficiency Explorer
                </span>
                <span className="text-[11px] text-slate-400">Genetic Defects &bull; Cell Counts &bull; Rx</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                <button
                  onClick={() => setSelectedPid("scid")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedPid === "scid"
                      ? "bg-indigo-600 text-white border-indigo-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  SCID
                </button>
                <button
                  onClick={() => setSelectedPid("xla")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedPid === "xla"
                      ? "bg-indigo-600 text-white border-indigo-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  XLA (Bruton)
                </button>
                <button
                  onClick={() => setSelectedPid("cvid")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedPid === "cvid"
                      ? "bg-indigo-600 text-white border-indigo-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  CVID
                </button>
                <button
                  onClick={() => setSelectedPid("cgd")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedPid === "cgd"
                      ? "bg-indigo-600 text-white border-indigo-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  CGD
                </button>
                <button
                  onClick={() => setSelectedPid("hae")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedPid === "hae"
                      ? "bg-indigo-600 text-white border-indigo-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  HAE (C1-INH)
                </button>
              </div>

              <div className={styles.immResultsGrid}>
                <div className={styles.immResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Genetic Defect</div>
                  <div className={`text-xs font-bold mt-1 ${pidDetails.color}`}>{pidDetails.defect}</div>
                </div>
                <div className={styles.immResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Cell Phenotype</div>
                  <div className="text-xs font-bold text-indigo-300 mt-1">{pidDetails.cells}</div>
                </div>
                <div className={styles.immResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Definitive Therapy</div>
                  <div className="text-xs font-bold text-emerald-400 mt-1">{pidDetails.rx}</div>
                </div>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs text-slate-300">
                <div><strong className="text-indigo-400">Clinical Hallmark:</strong> {pidDetails.clinical}</div>
              </div>
            </div>
          )}

          {/* Mode 2: Hypersensitivity Matrix */}
          {activeMode === "hypersensitivity" && (
            <div className={styles.immSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={14} /> Gell &amp; Coombs Hypersensitivity Matrix
                </span>
                <span className="text-[11px] text-slate-400">Types I &ndash; IV</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => setSelectedHyper("type1")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedHyper === "type1"
                      ? "bg-indigo-600 text-white border-indigo-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Type I (Immediate)
                </button>
                <button
                  onClick={() => setSelectedHyper("type2")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedHyper === "type2"
                      ? "bg-indigo-600 text-white border-indigo-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Type II (Cytotoxic)
                </button>
                <button
                  onClick={() => setSelectedHyper("type3")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedHyper === "type3"
                      ? "bg-indigo-600 text-white border-indigo-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Type III (Immune Complex)
                </button>
                <button
                  onClick={() => setSelectedHyper("type4")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedHyper === "type4"
                      ? "bg-indigo-600 text-white border-indigo-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Type IV (Delayed / T-Cell)
                </button>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                <div className="text-sm font-bold text-indigo-300">{hyperDetails.title}</div>
                <div className="text-slate-300 mt-1"><strong className="text-indigo-400">Immune Mediator:</strong> {hyperDetails.mediator}</div>
                <div className="text-slate-300 mt-1"><strong className="text-indigo-400">Pathophysiology:</strong> {hyperDetails.mechanism}</div>
                <div className="text-slate-300 mt-1"><strong className="text-indigo-400">Classic Examples:</strong> {hyperDetails.examples}</div>
                <div className="text-emerald-300 font-bold mt-1.5"><strong className="text-emerald-400">First-Line Protocol:</strong> {hyperDetails.firstLine}</div>
              </div>
            </div>
          )}

          {/* Mode 3: Autoimmunity & HLA */}
          {activeMode === "autoimmunity" && (
            <div className={styles.immSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={14} /> HLA Alleles &amp; Autoantibody Diagnostic Matrix
                </span>
                <span className="text-[11px] text-slate-400">HLA-B27 &bull; SLE &bull; RA &bull; Sclerosis</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">HLA-B27 Seronegative Spondylitis ("PAIR")</div>
                  <div className="text-slate-300 mt-1">Psoriatic arthritis, Ankylosing spondylitis (sacroiliitis/bamboo spine), IBD arthritis, and Reactive arthritis.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">SLE Autoantibody Stratification</div>
                  <div className="text-slate-300 mt-1">Anti-Smith is most specific (&gt;99%); Anti-dsDNA fluctuates directly with active lupus nephritis and hypocomplementemia.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 4: Flow Cytometry & Biologics */}
          {activeMode === "biologics" && (
            <div className={styles.immSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Crosshair size={14} /> Targeted Monoclonal Biologics &amp; HIV Staging
                </span>
                <span className="text-[11px] text-slate-400">Anti-TNF &bull; Anti-CD20 &bull; CD4 Counts</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">Anti-TNF-Alpha (Infliximab) &amp; Latent TB</div>
                  <div className="text-slate-300 mt-1">Disrupts mycobacterial granulomas. Mandatory baseline screening with IGRA or PPD before therapy initiation.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">HIV CD4 Staging &amp; Opportunistic Prophylaxis</div>
                  <div className="text-slate-300 mt-1">CD4 &lt;200/uL requires TMP-SMX for PCP; CD4 &lt;100/uL requires TMP-SMX for Toxoplasma; CD4 &lt;50/uL requires weekly Azithromycin for MAC.</div>
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
                    <span className="text-indigo-400 font-bold">Protocol:</span> {node.clinicalProtocol}
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

        {/* Right Side: High-Yield Immunology Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              Immunology Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🛡️ Topic &amp; Focus</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🔬 Molecular &amp; Cellular Mechanism</div>
            <div className={styles.inspectorBody}>{activeNode.immunologicMechanism}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>⚡ Diagnostic Criteria &amp; Presentation</div>
            <div className={styles.inspectorBody}>{activeNode.diagnosticCriteria}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 Gold Standard Immunology Pearl</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearl}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("pid")}
          className={`${styles.modeTab} ${activeMode === "pid" ? styles.modeTabActive : ""}`}
        >
          🧬 1. Primary Immunodeficiencies
        </button>
        <button
          onClick={() => setActiveMode("hypersensitivity")}
          className={`${styles.modeTab} ${activeMode === "hypersensitivity" ? styles.modeTabActive : ""}`}
        >
          ⚡ 2. Hypersensitivity (I-IV)
        </button>
        <button
          onClick={() => setActiveMode("autoimmunity")}
          className={`${styles.modeTab} ${activeMode === "autoimmunity" ? styles.modeTabActive : ""}`}
        >
          ✨ 3. Autoimmunity &amp; HLA
        </button>
        <button
          onClick={() => setActiveMode("biologics")}
          className={`${styles.modeTab} ${activeMode === "biologics" ? styles.modeTabActive : ""}`}
        >
          🎯 4. Biologics &amp; Flow Cytometry
        </button>
      </div>
    </div>
  );
}
