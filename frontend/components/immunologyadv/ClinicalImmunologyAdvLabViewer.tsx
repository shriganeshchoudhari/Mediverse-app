"use client";

import React, { useState, useMemo } from "react";
import styles from "./ClinicalImmunologyAdvLabViewer.module.css";
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

export type ImmunologyLabMode = "hypersensitivity" | "biologics" | "checkpoints" | "cart";

export interface ImmunologyLabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  immunologyProfile: string;
  effectorMechanism: string;
  clinicalHallmarks: string;
  highYieldPearls: string;
}

export const IMMUNOLOGY_LAB_NODES: Record<ImmunologyLabMode, ImmunologyLabNode[]> = {
  hypersensitivity: [
    {
      id: "imm-hs-type1-ige",
      name: "Type I Immediate IgE & Mast Cell Degranulation (Anaphylaxis)",
      category: "Type I IgE-Mediated",
      subType: "Fc-epsilon-RI Cross-Linking • Histamine, LTC4/D4/E4, PGD2 • Eosinophil Infiltration (IL-5) • Minutes to Hours",
      immunologyProfile: "Allergen-specific IgE bound to high-affinity Fc-epsilon-RI receptors on mast cells and basophils.",
      effectorMechanism: "Multivalent antigen cross-linking triggers rapid exocytosis of preformed granules (histamine) and synthesis of lipid mediators.",
      clinicalHallmarks: "Anaphylaxis, bronchospasm, urticaria, angioedema, allergic rhinitis, atopic dermatitis; treated with Epinephrine IM.",
      highYieldPearls: "Type I hypersensitivity is immediate and IgE-mediated; Intramuscular Epinephrine is the uncontested first-line lifesaving drug."
    },
    {
      id: "imm-hs-type2-cytotoxic",
      name: "Type II Cytotoxic Autoantibody CDC & ADCC (Anti-GBM Goodpasture)",
      category: "Type II Antibody Cytotoxic",
      subType: "IgG/IgM Binding Cell Surface Ag • Complement CDC (MAC C5b-9) & ADCC (NK Cells CD16) • Linear IF Pattern",
      immunologyProfile: "Autoantibodies targeting intrinsic cell-surface or extracellular matrix basement membrane proteins.",
      effectorMechanism: "Classical complement fixation causing membrane attack complex lysis (CDC) and Fc-gamma-RIII NK cell degranulation (ADCC).",
      clinicalHallmarks: "Goodpasture (linear anti-GBM alpha-3 type IV collagen), Autoimmune Hemolytic Anemia, Pemphigus Vulgaris (Desmoglein-3), Graves.",
      highYieldPearls: "Type II hypersensitivity features tissue-specific antibodies producing a smooth, linear immunofluorescence pattern (Goodpasture)."
    },
    {
      id: "imm-hs-type3-immune-complex",
      name: "Type III Immune Complex Classical Complement Vasculitis (Lupus)",
      category: "Type III Immune Complex",
      subType: "Circulating Ag-Ab Complexes • Microvascular Deposition • C3a/C5a Neutrophil Chemotaxis • Lumpy-Bumpy IF",
      immunologyProfile: "Soluble antigen-antibody complexes depositing in renal glomeruli, synovial joints, and cutaneous post-capillary venules.",
      effectorMechanism: "Complement activation generates C3a and C5a anaphylatoxins, recruiting neutrophils that release lysosomal enzymes causing fibrinoid necrosis.",
      clinicalHallmarks: "Lupus nephritis (anti-dsDNA), Post-Streptococcal GN (PSGN), Serum Sickness (fever, rash, arthritis 7-14 days post-exposure, low C3/C4).",
      highYieldPearls: "Type III hypersensitivity is mediated by circulating immune complexes producing granular 'lumpy-bumpy' IF and hypocomplementemia."
    },
    {
      id: "imm-hs-type4-delayed-tcell",
      name: "Type IV Delayed Cell-Mediated T-Cell Cytotoxicity (PPD & Contact)",
      category: "Type IV Delayed T-Cell",
      subType: "CD4+ Th1 (IFN-gamma Macrophages) & CD8+ CTLs • NO Antibodies Involved • 24-72 Hours Delayed Kinetics",
      immunologyProfile: "Sensitized T lymphocytes recognizing antigen presented on MHC molecules without antibody involvement.",
      effectorMechanism: "Th1 cells release IFN-gamma activating macrophages into epithelioid granulomas; CD8+ CTLs release perforin/granzymes for apoptosis.",
      clinicalHallmarks: "Tuberculin PPD skin test, contact dermatitis (nickel, poison ivy urushiol), Type 1 Diabetes, Multiple Sclerosis, GVHD, SJS/TEN.",
      highYieldPearls: "Type IV hypersensitivity is antibody-independent and delayed (24-72h), mediated purely by sensitized CD4+ Th1 and CD8+ T cells."
    }
  ],

  biologics: [
    {
      id: "imm-bio-tnf-infliximab",
      name: "TNF-Alpha Inhibitors & Latent TB Reactivation (Infliximab)",
      category: "Anti-Cytokine Biologics",
      subType: "Infliximab / Adalimumab / Etanercept • Disruption of Macrophage Granulomas • Mandatory PPD / QuantiFERON Screening",
      immunologyProfile: "Monoclonal antibodies or decoy fusion receptors neutralizing soluble and membrane-bound TNF-alpha.",
      effectorMechanism: "Inhibits downstream NF-kB pro-inflammatory signaling; however, TNF-alpha is mandatory for maintaining tuberculosis granulomas.",
      clinicalHallmarks: "Rheumatoid arthritis, Crohn's, Ulcerative Colitis, Psoriasis; Black box warning: disseminated TB reactivation and fungal infections.",
      highYieldPearls: "TNF-alpha is essential for granuloma maintenance; all patients MUST be screened for latent TB prior to starting anti-TNF therapy."
    },
    {
      id: "imm-bio-rituximab-cd20",
      name: "CD20 B-Cell Lysis & JC Virus PML (Rituximab)",
      category: "B-Cell Depleting mAb",
      subType: "Chimeric Anti-CD20 IgG1 • Induces CDC, ADCC & Apoptosis of Pre-B and Mature B Cells • Spares Plasma Cells",
      immunologyProfile: "Targets CD20 surface phosphoprotein expressed on B lymphocytes from pre-B stage through mature B cells.",
      effectorMechanism: "Complete elimination of circulating B cells; plasma cells lack CD20 and continue basic immunoglobulin production.",
      clinicalHallmarks: "Non-Hodgkin Lymphoma, CLL, Granulomatosis with Polyangiitis (GPA), Pemphigus; Black box warning: JC Virus PML and HBV reactivation.",
      highYieldPearls: "Rituximab depletes CD20+ B cells but spares plasma cells; monitor for Progressive Multifocal Leukoencephalopathy (PML)."
    },
    {
      id: "imm-bio-tocilizumab-il6r",
      name: "IL-6 Receptor Antagonism & CRS Rescue (Tocilizumab)",
      category: "Anti-IL-6R Biologic",
      subType: "Humanized Anti-IL-6R mAb • Blocks Classic & Trans-Signaling • Giant Cell Arteritis & CAR-T Cytokine Release Syndrome",
      immunologyProfile: "Competitive antagonist of both soluble and membrane-bound interleukin-6 receptors (sIL-6R and mIL-6R).",
      effectorMechanism: "Halts JAK-STAT3 inflammatory signaling, suppressing acute-phase reactant synthesis (CRP) and hyperinflammatory cytokine cascades.",
      clinicalHallmarks: "Giant Cell Arteritis (GCA), Systemic JIA, Rheumatoid Arthritis, and definitive antidote for CAR-T cell Cytokine Release Syndrome (CRS).",
      highYieldPearls: "Tocilizumab (anti-IL-6R) is the definitive targeted first-line antidote for CAR-T cell-induced Cytokine Release Syndrome (CRS)."
    },
    {
      id: "imm-bio-eculizumab-c5",
      name: "Complement C5 Inhibition & Neisseria Risk (Eculizumab)",
      category: "Complement Inhibitor",
      subType: "Humanized Anti-C5 mAb • Blocks MAC (C5b-9) Assembly • PNH & Atypical HUS • Mandatory Meningococcal Vaccine",
      immunologyProfile: "High-affinity monoclonal antibody binding complement protein C5, preventing cleavage into C5a and C5b.",
      effectorMechanism: "Completely halts assembly of the terminal Membrane Attack Complex (MAC, C5b-9), stopping intravascular hemolysis in PNH.",
      clinicalHallmarks: "Paroxysmal Nocturnal Hemoglobinuria (PNH), atypical HUS; Black box warning: >1,000-fold risk of fatal Neisseria meningitidis sepsis.",
      highYieldPearls: "Terminal complement (C5-C9 MAC) blockade by Eculizumab requires mandatory pre-treatment vaccination against Neisseria meningitidis."
    }
  ],

  checkpoints: [
    {
      id: "imm-ici-ctla4-ipilimumab",
      name: "CTLA-4 Co-Inhibitory Priming Blockade (Ipilimumab)",
      category: "Central Checkpoint",
      subType: "Ipilimumab (Yervoy) • Competitively Blocks B7-1/B7-2 on APCs • Unleashes CD28 Costimulation in Lymph Nodes",
      immunologyProfile: "Recombinant human IgG1 monoclonal antibody targeting Cytotoxic T-Lymphocyte Antigen 4 (CTLA-4 / CD152).",
      effectorMechanism: "Prevents CTLA-4 from outcompeting CD28 for B7 costimulatory molecules on dendritic cells, lowering T-cell activation threshold.",
      clinicalHallmarks: "Metastatic melanoma, renal cell carcinoma; high incidence of severe immune-related colitis and hypophysitis.",
      highYieldPearls: "CTLA-4 acts centrally in secondary lymphoid tissues during T-cell priming; Ipilimumab blocks CTLA-4 to unleash broad T-cell immunity."
    },
    {
      id: "imm-ici-pd1-pembrolizumab",
      name: "PD-1 / PD-L1 Exhaustion Reversal (Pembrolizumab)",
      category: "Peripheral Checkpoint",
      subType: "Pembrolizumab (Keytruda) / Nivolumab (Opdivo) • Reverses SHP-2 Phosphatase T-Cell Exhaustion in Tumor Stroma",
      immunologyProfile: "Monoclonal antibodies blocking Programmed Cell Death Protein 1 (PD-1 / CD279) on tumor-infiltrating lymphocytes.",
      effectorMechanism: "Inhibits PD-1 recruitment of SHP-2 phosphatase, restoring T-cell receptor (TCR) kinase phosphorylation and antitumor cytotoxicity.",
      clinicalHallmarks: "NSCLC, melanoma, MSI-High colorectal cancer, Hodgkin lymphoma; high response rate in tumors with high tumor mutational burden (TMB).",
      highYieldPearls: "PD-1/PD-L1 inhibitors act peripherally in the tumor microenvironment to reinvigorate exhausted CD8+ cytotoxic T lymphocytes."
    },
    {
      id: "imm-ici-immune-colitis",
      name: "Checkpoint-Induced Immune Colitis (Watery Diarrhea & Steroids)",
      category: "Gastrointestinal irAE",
      subType: "Severe Watery Diarrhea & Mucosal Ulceration • Hold ICI • High-Dose Prednisone (1-2 mg/kg) • Infliximab Rescue",
      immunologyProfile: "Break in mucosal immune tolerance leading to massive autoreactive T-cell infiltration into colonic lamina propria.",
      effectorMechanism: "Unchecked cytotoxic T cells attack enteric enterocytes, causing crypt abscesses, mucosal ulceration, and severe exudative diarrhea.",
      clinicalHallmarks: "Watery diarrhea (8-10x/day), abdominal pain, fever; Grade 3/4 requires immediate ICI cessation, IV steroids, and Infliximab if refractory.",
      highYieldPearls: "Grade 3/4 immune-mediated colitis from checkpoint inhibitors requires holding ICI and administering high-dose IV corticosteroids."
    },
    {
      id: "imm-ici-fulminant-myocarditis",
      name: "Fulminant Immune Checkpoint Myocarditis (Troponin Surge & High Mortality)",
      category: "Cardiovascular irAE",
      subType: "Troponin Elevation & Conduction Block / VT • Rare (<1%) but >40% Mortality • Pulse Methylprednisolone (1 g/day) + Abatacept",
      immunologyProfile: "Cytotoxic T-cell infiltration directly targeting myocardial contractile tissue with shared clonal antigens.",
      effectorMechanism: "T-cell mediated cardiomyocyte necrosis causing acute pump failure, complete heart block, and fatal ventricular arrhythmias.",
      clinicalHallmarks: "Dyspnea, chest pain, elevated troponin, conduction delays on ECG, myocardial edema on cardiac MRI; permanent ICI discontinuation.",
      highYieldPearls: "Immune checkpoint myocarditis carries >40% mortality; permanently discontinue ICI and give pulse Methylprednisolone (1 g/day) + Abatacept."
    }
  ],

  cart: [
    {
      id: "imm-cart-construct-scfv",
      name: "Chimeric Antigen Receptor Molecular Construct (scFv + CD3-zeta + 4-1BB)",
      category: "Cellular Engineering",
      subType: "Extracellular scFv (CD19 / BCMA) + Transmembrane + Costimulatory (4-1BB / CD28) + CD3-zeta ITAM Activation",
      immunologyProfile: "Synthetic modular receptor combining antibody specificity with cytotoxic T-cell signaling machinery.",
      effectorMechanism: "scFv recognizes native cell-surface antigen without MHC restriction; CD3-zeta transmits Signal 1 and 4-1BB provides Signal 2 persistence.",
      clinicalHallmarks: "Tisagenlecleucel and Axicabtagene ciloleucel for B-cell ALL and DLBCL; Idecabtagene vicleucel for Multiple Myeloma.",
      highYieldPearls: "CAR-T cells recognize intact cell surface antigens (like CD19) completely independently of MHC presentation."
    },
    {
      id: "imm-cart-crs-grading-toci",
      name: "ASTCT Cytokine Release Syndrome (CRS) Grading & Tocilizumab",
      category: "CAR-T Toxicity",
      subType: "Grade 1 (Fever) -> Grade 2 (Hypotension/Hypoxia) -> Grade 3 (Vasopressor) -> Grade 4 (Mechanical Ventilation) • Tocilizumab DOC",
      immunologyProfile: "Explosive systemic hyperinflammatory cytokine cascade driven by massive T-cell expansion and macrophage activation.",
      effectorMechanism: "Surging levels of IL-6, IL-1, IFN-gamma, and TNF-alpha cause endothelial leakage, vasoplegic shock, and multi-organ failure.",
      clinicalHallmarks: "High fever (>=38.0C), tachycardia, hypotension, hypoxemia, hyperferritinemia; Tocilizumab (anti-IL-6R) is first-line targeted antidote.",
      highYieldPearls: "Tocilizumab (anti-IL-6R mAb) is the first-line targeted rescue for Cytokine Release Syndrome (CRS), preserving CAR-T cells."
    },
    {
      id: "imm-cart-icans-neurotoxicity",
      name: "Immune Effector Cell-Associated Neurotoxicity (ICANS & Dexamethasone)",
      category: "Neurotoxicity",
      subType: "Expressive Aphasia (Early Hallmark) • Dysgraphia • Blood-Brain Barrier Leakage • Dexamethasone First-Line (NOT Tocilizumab)",
      immunologyProfile: "Central nervous system neuroinflammation triggered by cytokine leakage across disrupted blood-brain barrier.",
      effectorMechanism: "Microglial activation and endothelial inflammation in cerebral vasculature producing global encephalopathy and cerebral edema.",
      clinicalHallmarks: "Expressive aphasia, impaired handwriting, tremor, seizures; Dexamethasone is drug of choice; Tocilizumab does not cross BBB.",
      highYieldPearls: "Dexamethasone is the drug of choice for ICANS; Tocilizumab does NOT cross the blood-brain barrier and is ineffective for isolated ICANS."
    },
    {
      id: "imm-cart-macrophage-activation",
      name: "Bystander Macrophage Hyperactivation (Ferritin, IFN-gamma & IL-1)",
      category: "Hyperinflammation",
      subType: "Monocyte-Macrophage Axis • Surging IL-1 and IL-6 • Extreme Hyperferritinemia • Anakinra (IL-1Ra) for Refractory CRS",
      immunologyProfile: "CAR-T cell secretion of IFN-gamma and GM-CSF recruits and hyperactivates host bystander monocytes and macrophages.",
      effectorMechanism: "Activated macrophages produce the overwhelming majority of systemic IL-6 and IL-1 responsible for CRS and endothelial injury.",
      clinicalHallmarks: "Ferritin >10,000 ng/mL, coagulopathy, elevated CRP, cytopenias; Anakinra (IL-1 receptor antagonist) is used for steroid-refractory CRS.",
      highYieldPearls: "Bystander host macrophages (not the CAR-T cells themselves) produce the massive wave of IL-6 and IL-1 driving severe CRS."
    }
  ]
};

interface ClinicalImmunologyAdvLabViewerProps {
  initialMode?: ImmunologyLabMode;
  height?: string;
  onNodeSelect?: (node: ImmunologyLabNode) => void;
}

export default function ClinicalImmunologyAdvLabViewer({
  initialMode = "hypersensitivity",
  height = "560px",
  onNodeSelect,
}: ClinicalImmunologyAdvLabViewerProps) {
  const [activeMode, setActiveMode] = useState<ImmunologyLabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Hypersensitivity Profiler State
  const [selectedHs, setSelectedHs] = useState<"type1" | "type2" | "type3" | "type4">("type1");

  // CRS Profiler State
  const [selectedCrs, setSelectedCrs] = useState<"grade1" | "grade2" | "grade3" | "grade4">("grade2");

  const hsDetails = useMemo(() => {
    if (selectedHs === "type1") {
      return {
        title: "Type I Immediate Hypersensitivity (IgE-Mediated)",
        indices: "Fc-epsilon-RI Cross-Linking • Histamine, Leukotrienes C4/D4/E4 • Immediate Degranulation",
        rx: "Intramuscular Epinephrine (1:1,000) 0.3-0.5 mg IM into anterolateral thigh + IV Fluids + Antihistamines",
        pearl: "Epinephrine is the only first-line medication that halts mast cell degranulation and reverses shock."
      };
    } else if (selectedHs === "type2") {
      return {
        title: "Type II Cytotoxic Hypersensitivity (Antibody-Mediated)",
        indices: "IgG / IgM Surface Binding • CDC (MAC C5b-9) & ADCC (NK Cells CD16) • Linear IF Pattern",
        rx: "High-dose Corticosteroids + Plasmapheresis (anti-GBM) + Rituximab / IVIG for antibody suppression",
        pearl: "Anti-GBM (Goodpasture) produces a smooth, linear ribbon-like pattern on immunofluorescence."
      };
    } else if (selectedHs === "type3") {
      return {
        title: "Type III Immune Complex Hypersensitivity",
        indices: "Circulating Ag-Ab Deposition • Classical Complement (C3a/C5a) • Lumpy-Bumpy Granular IF",
        rx: "Corticosteroids + Cyclophosphamide/Mycophenolate (Lupus Nephritis) + Supportive care (Serum Sickness)",
        pearl: "Type III immune complex deposition characteristically causes systemic hypocomplementemia (low C3/C4)."
      };
    } else {
      return {
        title: "Type IV Delayed Cell-Mediated Hypersensitivity",
        indices: "CD4+ Th1 (IFN-gamma Macrophages) & CD8+ CTLs • NO Antibodies • 24-72h Delayed Kinetics",
        rx: "Topical / Systemic Corticosteroids (Contact Dermatitis) + Immunosuppression + Calcineurin inhibitors",
        pearl: "Type IV reactions are purely cellular and antibody-independent (PPD tuberculin test, Poison Ivy)."
      };
    }
  }, [selectedHs]);

  const crsDetails = useMemo(() => {
    if (selectedCrs === "grade1") {
      return {
        title: "ASTCT Grade 1 Cytokine Release Syndrome",
        indices: "Fever (>= 38.0°C) Alone • NO Hypotension • NO Hypoxia • Outpatient Vigilance",
        rx: "Supportive antipyretics (Acetaminophen), IV hydration, frequent vital sign checks",
        pearl: "Grade 1 CRS does not require Tocilizumab unless high-risk features are present."
      };
    } else if (selectedCrs === "grade2") {
      return {
        title: "ASTCT Grade 2 Cytokine Release Syndrome",
        indices: "Fever + Hypotension Responsive to Fluid Bolus OR Hypoxia requiring Low-Flow NC (<= 40% FiO2)",
        rx: "Tocilizumab (anti-IL-6R, 8 mg/kg IV) +/- Intravenous Dexamethasone 10 mg",
        pearl: "Tocilizumab is the targeted first-line antidote that rapidly resolves Grade 2+ CRS."
      };
    } else if (selectedCrs === "grade3") {
      return {
        title: "ASTCT Grade 3 Cytokine Release Syndrome",
        indices: "Fever + Hypotension requiring 1 Vasopressor OR Hypoxia requiring High-Flow Cannula / Mask",
        rx: "Tocilizumab (repeat dose) + Intravenous Dexamethasone 10-20 mg q6h + ICU Admission",
        pearl: "Grade 3 CRS mandates ICU transfer, vasopressor support, and combined Tocilizumab + Steroids."
      };
    } else {
      return {
        title: "ASTCT Grade 4 Cytokine Release Syndrome",
        indices: "Fever + Hypotension requiring Multiple Vasopressors OR Hypoxia requiring Mechanical Ventilation",
        rx: "Pulse Methylprednisolone (1 g/day IV) + Tocilizumab + Consider Anakinra (anti-IL-1)",
        pearl: "Grade 4 CRS is life-threatening; high-dose pulse methylprednisolone is required to halt hyperinflammation."
      };
    }
  }, [selectedCrs]);

  const currentNodes = useMemo(() => {
    return IMMUNOLOGY_LAB_NODES[activeMode] || IMMUNOLOGY_LAB_NODES.hypersensitivity;
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
            <Dna size={14} /> IMM-301
          </span>
          <span className={styles.titleText}>
            {activeMode === "hypersensitivity" && "Gell-Coombs Hypersensitivity Pathways: Types I-IV, CDC, ADCC & T-Cell Lysis"}
            {activeMode === "biologics" && "Targeted Biologics: Anti-TNF (Infliximab), Anti-CD20 (Rituximab) & Anti-C5 (Eculizumab)"}
            {activeMode === "checkpoints" && "Immune Checkpoint Blockade (CTLA-4, PD-1, PD-L1) & Immune-Related Adverse Events (irAEs)"}
            {activeMode === "cart" && "CAR-T Cell Immunotherapy: Synthetic scFv Construct, CRS Grading & ICANS Management"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Immunology Diagnostic Quiz"}
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
                  Clinical Immunology Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Immunological Mechanism: {quizTargetNode.clinicalHallmarks}
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

          {/* Mode 1: Hypersensitivity Matrix */}
          {activeMode === "hypersensitivity" && (
            <div className={styles.immCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-pink-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={14} /> Gell-Coombs Hypersensitivity Classification Matrix
                </span>
                <span className="text-[11px] text-slate-400">Type I (IgE) &bull; Type II (Ab) &bull; Type III (Complex) &bull; Type IV (Cellular)</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => setSelectedHs("type1")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedHs === "type1"
                      ? "bg-pink-600 text-white border-pink-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  ⚡ Type I (IgE Anaphylaxis)
                </button>
                <button
                  onClick={() => setSelectedHs("type2")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedHs === "type2"
                      ? "bg-pink-600 text-white border-pink-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🎯 Type II (Cytotoxic Ab)
                </button>
                <button
                  onClick={() => setSelectedHs("type3")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedHs === "type3"
                      ? "bg-pink-600 text-white border-pink-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🧱 Type III (Immune Complex)
                </button>
                <button
                  onClick={() => setSelectedHs("type4")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedHs === "type4"
                      ? "bg-pink-600 text-white border-pink-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🛡️ Type IV (Delayed T-Cell)
                </button>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                <div className="text-sm font-bold text-pink-300">{hsDetails.title}</div>
                <div className="text-fuchsia-400 font-bold mt-1">{hsDetails.indices}</div>
                <div className="text-slate-300 mt-1"><strong className="text-pink-400">Therapeutic Management:</strong> {hsDetails.rx}</div>
                <div className="text-yellow-300 font-semibold mt-1"><strong className="text-yellow-400">Immunological Pearl:</strong> {hsDetails.pearl}</div>
              </div>
            </div>
          )}

          {/* Mode 2: Biologics & Monoclonal Antibodies */}
          {activeMode === "biologics" && (
            <div className={styles.immCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-pink-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert size={14} /> Targeted Monoclonal Antibodies &amp; Black Box Warnings
                </span>
                <span className="text-[11px] text-slate-400">Anti-TNF &bull; Anti-CD20 &bull; Anti-IL-6R &bull; Anti-C5</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-pink-300 font-bold">Anti-TNF (Infliximab) &amp; Latent TB Reactivation</div>
                  <div className="text-slate-300 mt-1">TNF-alpha is strictly required for macrophage activation and maintenance of granulomas. Neutralizing TNF causes breakdown of tuberculous granulomas and disseminated TB reactivation. Mandatory PPD / QuantiFERON screening prior to starting therapy.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-pink-300 font-bold">Anti-CD20 (Rituximab) &amp; Anti-C5 (Eculizumab)</div>
                  <div className="text-slate-300 mt-1">Rituximab depletes CD20+ B cells (sparing plasma cells); risk of JC Virus Progressive Multifocal Leukoencephalopathy (PML). Eculizumab blocks C5 cleavage and MAC (C5b-9) assembly; mandatory vaccination against Neisseria meningitidis.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 3: Checkpoint Inhibitors & irAEs */}
          {activeMode === "checkpoints" && (
            <div className={styles.immCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-pink-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield size={14} /> Immune Checkpoint Inhibitors &amp; irAE Toxicities
                </span>
                <span className="text-[11px] text-slate-400">CTLA-4 &bull; PD-1/PD-L1 &bull; Colitis &bull; Myocarditis</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-pink-300 font-bold">CTLA-4 (Central Priming) vs PD-1 (Peripheral Stroma)</div>
                  <div className="text-slate-300 mt-1">Ipilimumab (anti-CTLA-4) blocks B7-1/B7-2 competitive inhibition in secondary lymphoid tissues. Pembrolizumab (anti-PD-1) blocks SHP-2 phosphatase recruitment in peripheral tumor microenvironments, reinvigorating exhausted cytotoxic T cells.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-pink-300 font-bold">High-Yield irAEs: Colitis, Hypophysitis &amp; Myocarditis</div>
                  <div className="text-slate-300 mt-1">Immune-mediated colitis requires high-dose Prednisone (1-2 mg/kg) and Infliximab if refractory. Hypophysitis causes central ACTH/TSH deficiency requiring hormone replacement. Fulminant myocarditis has &gt;40% mortality; permanently discontinue ICI and give pulse Methylprednisolone (1 g/day) + Abatacept.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 4: CAR-T Cell Therapy, CRS & ICANS */}
          {activeMode === "cart" && (
            <div className={styles.immCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-pink-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap size={14} /> CAR-T Cell Therapy: CRS ASTCT Grading &amp; ICANS
                </span>
                <span className="text-[11px] text-slate-400">scFv-CD3z-4-1BB &bull; CRS Grade 1-4 &bull; Tocilizumab &bull; Dexamethasone</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => setSelectedCrs("grade1")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedCrs === "grade1"
                      ? "bg-pink-600 text-white border-pink-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🟡 CRS Grade 1 (Fever)
                </button>
                <button
                  onClick={() => setSelectedCrs("grade2")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedCrs === "grade2"
                      ? "bg-pink-600 text-white border-pink-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🟠 CRS Grade 2 (Fluid / NC)
                </button>
                <button
                  onClick={() => setSelectedCrs("grade3")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedCrs === "grade3"
                      ? "bg-pink-600 text-white border-pink-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🔴 CRS Grade 3 (Vasopressor)
                </button>
                <button
                  onClick={() => setSelectedCrs("grade4")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedCrs === "grade4"
                      ? "bg-pink-600 text-white border-pink-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  ⚠️ CRS Grade 4 (Intubation)
                </button>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                <div className="text-sm font-bold text-pink-300">{crsDetails.title}</div>
                <div className="text-fuchsia-400 font-bold mt-1">{crsDetails.indices}</div>
                <div className="text-slate-300 mt-1"><strong className="text-pink-400">Targeted Management:</strong> {crsDetails.rx}</div>
                <div className="text-yellow-300 font-semibold mt-1"><strong className="text-yellow-400">Toxicity Rule:</strong> {crsDetails.pearl}</div>
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
                    <span className="text-pink-400 font-bold">Immunology:</span> {node.immunologyProfile}
                  </div>

                  <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400">
                    <span>Inspect pathway</span>
                    <ArrowRight size={12} className="text-slate-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: High-Yield Clinical Immunology Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">
              Immunology Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🔬 Immune Mechanism / Biologic</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🧬 Cellular Pathway &amp; Target</div>
            <div className="text-xs text-pink-300 font-semibold">{activeNode.immunologyProfile}</div>
            <div className={styles.inspectorBody}>{activeNode.effectorMechanism}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🩺 Clinical Hallmarks &amp; Diagnostics</div>
            <div className={styles.inspectorBody}>{activeNode.clinicalHallmarks}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 Gold Standard Immunology Pearls</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearls}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("hypersensitivity")}
          className={`${styles.modeTab} ${activeMode === "hypersensitivity" ? styles.modeTabActive : ""}`}
        >
          ⚡ 1. Hypersensitivity (I-IV)
        </button>
        <button
          onClick={() => setActiveMode("biologics")}
          className={`${styles.modeTab} ${activeMode === "biologics" ? styles.modeTabActive : ""}`}
        >
          🛡️ 2. Targeted Biologics
        </button>
        <button
          onClick={() => setActiveMode("checkpoints")}
          className={`${styles.modeTab} ${activeMode === "checkpoints" ? styles.modeTabActive : ""}`}
        >
          🎯 3. Checkpoint Blockade
        </button>
        <button
          onClick={() => setActiveMode("cart")}
          className={`${styles.modeTab} ${activeMode === "cart" ? styles.modeTabActive : ""}`}
        >
          🧬 4. CAR-T &amp; CRS
        </button>
      </div>
    </div>
  );
}
