"use client";

import React, { useState, useMemo } from "react";
import styles from "./ClinicalDermatologyAdvLabViewer.module.css";
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

export type DermatologyLabMode = "emergencies" | "bullous" | "oncology" | "inflammatory";

export interface DermatologyLabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  dermProfile: string;
  pathophysiologyMechanism: string;
  clinicalHallmarks: string;
  highYieldPearls: string;
}

export const DERMATOLOGY_LAB_NODES: Record<DermatologyLabMode, DermatologyLabNode[]> = {
  emergencies: [
    {
      id: "derm-em-sjs-ten-scorten",
      name: "Toxic Epidermal Necrolysis TEN (Full-Thickness Epidermal Detachment & BICU Management)",
      category: "Severe Cutaneous Adverse Reaction",
      subType: "BSA >30% Detached • Full-Thickness Keratinocyte Apoptosis • Nikolsky POSITIVE • SCORTEN Scoring",
      dermProfile: "Life-threatening drug-induced epidermal necrolysis with extensive mucosal destruction and skin failure.",
      pathophysiologyMechanism: "Granulysin and Fas-FasL mediated CD8+ cytotoxic T-cell lysis of full-thickness basal and spinous keratinocytes.",
      clinicalHallmarks: "Positive Nikolsky sign, severe oral/ocular/genital mucosal ulcerations, SCORTEN prognostic scoring; Burn ICU care.",
      highYieldPearls: "TEN involves >30% BSA detachment with full-thickness epidermal necrosis and positive Nikolsky; managed in a Burn ICU."
    },
    {
      id: "derm-em-ssss-desmoglein",
      name: "Staphylococcal Scalded Skin SSSS (Exfoliative Toxin Desmoglein-1 Cleavage & Mucosal Sparing)",
      category: "Toxin Dermatosis",
      subType: "Staphylococcus aureus (ETA/ETB) • Cleaves Desmoglein-1 • Superficial Subcorneal Split • MUCOSA SPARED",
      dermProfile: "Toxin-mediated blistering disorder affecting neonates and young children with superficial epidermal shedding.",
      pathophysiologyMechanism: "Exfoliative toxins ETA and ETB target and cleave extracellular domain of Desmoglein-1 in stratum granulosum.",
      clinicalHallmarks: "Perioral radial sunburst crusting, widespread tender erythroderma, positive Nikolsky sign, normal mucous membranes; IV Nafcillin.",
      highYieldPearls: "SSSS cleaves Desmoglein-1 causing superficial subcorneal split with strictly SPARED mucous membranes (unlike SJS/TEN)."
    },
    {
      id: "derm-em-dress-hhv6-eosinophilia",
      name: "DRESS Syndrome (HHV-6 Reactivation, Eosinophilia & Systemic Corticosteroids)",
      category: "Drug Hypersensitivity",
      subType: "Delayed 2-8 Weeks • Severe Facial Edema • Eosinophilia >700/uL • Visceral Hepatitis (AST/ALT)",
      dermProfile: "Severe multiorgan drug reaction with high eosinophilia, lymphadenopathy, and internal organ failure.",
      pathophysiologyMechanism: "Type IVb drug-specific T-cell activation triggered by drugs (antiepileptics, allopurinol) with concurrent HHV-6 reactivation.",
      clinicalHallmarks: "Morbilliform rash with marked facial edema, fever >38.5°C, absolute eosinophilia, acute hepatitis (elevated LFTs); systemic steroids.",
      highYieldPearls: "DRESS presents 2-8 weeks post-drug with facial edema, eosinophilia, and hepatitis; treated with systemic corticosteroids."
    },
    {
      id: "derm-em-sjs-minor-overlap",
      name: "Stevens-Johnson Syndrome SJS (<10% BSA Detachment & Mucosal Sloughing)",
      category: "Epidermal Necrolysis",
      subType: "BSA <10% Detached • Dusky Purpuric Targetoid Macules • Oral/Ocular Ulcers • Drug Cessation",
      dermProfile: "Acute mucocutaneous reaction characterized by epidermal detachment limited to under 10% of body surface area.",
      pathophysiologyMechanism: "Immune-mediated apoptosis of basal keratinocytes with early subepidermal separation and mucosal sloughing.",
      clinicalHallmarks: "Atypical targetoid macules coalescing into flaccid bullae on face/trunk, painful mucosal erosions (>=2 sites); drug cessation.",
      highYieldPearls: "SJS involves <10% BSA epidermal detachment, SJS/TEN overlap is 10-30%, and TEN is >30% BSA."
    }
  ],

  bullous: [
    {
      id: "derm-bul-pemphigus-vulgaris",
      name: "Pemphigus Vulgaris Acantholysis (Desmoglein-3/1 IgG Intercellular Fishnet & Flaccid Bullae)",
      category: "Intraepidermal Blister",
      subType: "Anti-Desmoglein 3 & 1 • Suprabasal Acantholysis • 'Tombstone' Basal Layer • FLACCID Bullae • Nikolsky +",
      dermProfile: "Potentially lethal autoimmune blistering dermatosis characterized by loss of cell-to-cell adhesion (acantholysis).",
      pathophysiologyMechanism: "IgG autoantibodies bind Desmoglein-3/1 cadherins, disrupting desmosomes and causing suprabasal intraepidermal clefting.",
      clinicalHallmarks: "Painful unroofed oral mucosal ulcers preceding skin lesions, fragile flaccid bullae, positive Nikolsky sign; Steroids + Rituximab.",
      highYieldPearls: "Pemphigus vulgaris features flaccid bullae, oral ulcers, positive Nikolsky, suprabasal acantholysis, and fishnet IgG on DIF."
    },
    {
      id: "derm-bul-bullous-pemphigoid",
      name: "Bullous Pemphigoid Hemidesmosomes (BP180 Collagen XVII Subepidermal Tense Bullae & Linear BMZ)",
      category: "Subepidermal Blister",
      subType: "Anti-BP180 (Col XVII) & BP230 • Hemidesmosomes • TENSE Bullae • Nikolsky NEGATIVE • Eosinophils",
      dermProfile: "Chronic autoimmune subepidermal blistering disease of the elderly with durable, firm fluid-filled blisters.",
      pathophysiologyMechanism: "Autoantibodies against hemidesmosomal BP180/BP230 activate complement and recruit eosinophils to degrade the basement membrane.",
      clinicalHallmarks: "Intensely pruritic urticarial plaques followed by large tense bullae on extremities/trunk, negative Nikolsky; topical Clobetasol.",
      highYieldPearls: "Bullous pemphigoid features tense firm bullae in the elderly, negative Nikolsky, subepidermal cleft with eosinophils, and linear BMZ DIF."
    },
    {
      id: "derm-bul-dermatitis-herpetiformis",
      name: "Dermatitis Herpetiformis (eTG-3 IgA Papillary Granules, Celiac Enteropathy & Dapsone)",
      category: "Gluten Enteropathy",
      subType: "Epidermal Transglutaminase (eTG-3) • Associated with Celiac Disease • Grouped Vesicles on Extensors • Dapsone",
      dermProfile: "Intensely itchy cutaneous manifestation of gluten sensitivity featuring grouped polymorphic papulovesicles.",
      pathophysiologyMechanism: "Circulating IgA complexes against epidermal transglutaminase deposit in dermal papillae, recruiting neutrophilic microabscesses.",
      clinicalHallmarks: "Severe symmetric pruritus on extensor elbows/knees/buttocks; DIF shows granular IgA in dermal papillae; Dapsone + Gluten-Free Diet.",
      highYieldPearls: "Dermatitis herpetiformis is linked to Celiac disease with granular IgA in dermal papillae; treated with Dapsone and gluten-free diet."
    },
    {
      id: "derm-bul-epidermolysis-bullosa",
      name: "Epidermolysis Bullosa Complex (Basement Membrane Anchoring Fibril Genetic Fragility)",
      category: "Genetic Mechanobullous",
      subType: "Simplex (Keratin 5/14) • Junctional (Laminin-332) • Dystrophic (Type VII Collagen COL7A1)",
      dermProfile: "Group of inherited genetic mechanobullous disorders characterized by extreme skin and mucosal fragility upon minor friction.",
      pathophysiologyMechanism: "Mutations in keratin, laminin, or collagen VII compromise structural adhesion between epidermis and papillary dermis.",
      clinicalHallmarks: "Blistering triggered by mechanical friction from birth, mitten deformities in recessive dystrophic EB; supportive wound care.",
      highYieldPearls: "Dystrophic EB is caused by COL7A1 (type VII collagen anchoring fibrils) mutations, predisposing to aggressive SCC."
    }
  ],

  oncology: [
    {
      id: "derm-onc-melanoma-breslow-braf",
      name: "Malignant Melanoma Microstaging (Breslow Thickness, SLNB Staging & BRAF V600E Targeted Therapy)",
      category: "Cutaneous Malignancy",
      subType: "ABCDE Positive • Breslow Depth Staging • Sentinel Lymph Node Biopsy • BRAF V600E (Dabrafenib/Trametinib)",
      dermProfile: "Malignant neoplasm of melanocytes with high metastatic potential driven by UV exposure and genetic alterations.",
      pathophysiologyMechanism: "Oncogenic BRAF V600E or NRAS mutations hyperactivate the MAPK/ERK kinase proliferation pathway.",
      clinicalHallmarks: "Breslow >1mm requires SLNB; Wide Local Excision margins (1cm for <=1mm, 1-2cm for >1mm); Anti-PD-1 (Pembrolizumab) + BRAF/MEK inhibitors.",
      highYieldPearls: "Breslow thickness is the single most important prognostic factor in melanoma; BRAF V600E treated with Dabrafenib + Trametinib."
    },
    {
      id: "derm-onc-bcc-mohs-surgery",
      name: "Basal Cell Carcinoma BCC (PTCH1 Sonic Hedgehog, Arborizing Telangiectasias & Mohs Surgery)",
      category: "Non-Melanoma Carcinoma",
      subType: "PTCH1 Mutation • Pearly Translucent Papule • Arborizing Telangiectasias • Peripheral Palisading • Mohs",
      dermProfile: "Most common cutaneous cancer, characterized by slow local tissue invasion and negligible metastatic rate.",
      pathophysiologyMechanism: "Loss of function in PTCH1 tumor suppressor relieves smoothened (SMO) inhibition, driving Sonic Hedgehog gene transcription.",
      clinicalHallmarks: "Pearly pink nodule with rolled borders and telangiectasias on sun-exposed face; Mohs micrographic surgery gives 100% margin control.",
      highYieldPearls: "BCC presents as a pearly papule with arborizing telangiectasias; Mohs micrographic surgery is gold standard for facial lesions."
    },
    {
      id: "derm-onc-scc-marjolin-ulcer",
      name: "Squamous Cell Carcinoma SCC (Actinic Keratosis, Keratin Pearls & Marjolin Ulceration)",
      category: "Epidermal Malignancy",
      subType: "Actinic Keratosis Precursor • Keratin Pearls • Marjolin Ulcer in Chronic Burn Scars • Mohs Surgery",
      dermProfile: "Malignant proliferation of epidermal keratinocytes with significant risk of regional lymph node metastasis.",
      pathophysiologyMechanism: "Cumulative UV-induced TP53 mutations lead to atypical squamous proliferation with dermal stromal invasion.",
      clinicalHallmarks: "Indurated hyperkeratotic plaque or non-healing ulcer; Marjolin ulcer arising in chronic burn scars carries high metastatic rate.",
      highYieldPearls: "Marjolin ulcer is an aggressive squamous cell carcinoma arising in chronic non-healing burn scars or sinus tracts."
    },
    {
      id: "derm-onc-ctcl-mycosis-fungoides",
      name: "Cutaneous T-Cell Lymphoma MF (Pautrier Microabscesses & Sézary Syndrome)",
      category: "Cutaneous Lymphoma",
      subType: "CD4+ T-Cell Neoplasm • Patch/Plaque/Tumor Stages • Pautrier Microabscesses • Sézary Triad",
      dermProfile: "Extranodal non-Hodgkin T-cell lymphoma presenting primarily in the skin with epidermotropic atypical lymphocytes.",
      pathophysiologyMechanism: "Clonal proliferation of skin-homing CLA+ CD4+ memory T cells invading the epidermis (epidermotropism).",
      clinicalHallmarks: "Cigarette-paper wrinkled patches on bathing-trunk areas; Sézary syndrome triad: erythroderma, lymphadenopathy, and Sézary cells; PUVA.",
      highYieldPearls: "Mycosis fungoides features Pautrier microabscesses in epidermis; leukemic variant with erythroderma is Sézary syndrome."
    }
  ],

  inflammatory: [
    {
      id: "derm-inf-psoriasis-biologics",
      name: "Plaque Psoriasis Biologic Axis (IL-23/IL-17A Cytokine Cascade, Auspitz Sign & Secukinumab)",
      category: "Th17 Inflammatory",
      subType: "IL-23 / IL-17A Axis • Auspitz Sign (Punctate Bleeding) • Koebner Phenomenon • Munro Microabscesses",
      dermProfile: "Chronic immune-mediated papulosquamous disease driven by hyperactive dendritic cell and Th17/Th22 signaling.",
      pathophysiologyMechanism: "IL-23 stimulates Th17 cells to secrete IL-17A and IL-22, driving profound epidermal hyperkeratosis, parakeratosis, and acanthosis.",
      clinicalHallmarks: "Well-demarcated erythematous plaques with silvery scales on extensor surfaces; Auspitz sign; Secukinumab / Guselkumab / Adalimumab.",
      highYieldPearls: "Psoriasis features the Auspitz sign, Koebner phenomenon, and Munro microabscesses; treated with IL-17A/IL-23 targeted biologics."
    },
    {
      id: "derm-inf-necrotizing-fasciitis",
      name: "Necrotizing Fasciitis Emergency (LRINEC Score, Pain Out of Proportion & Emergent Debridement)",
      category: "Surgical Infection",
      subType: "Type I (Polymicrobial) vs Type II (GAS) • PAIN OUT OF PROPORTION • Crepitus • LRINEC >=6 • Clindamycin",
      dermProfile: "Fulminant, rapidly spreading bacterial infection causing extensive necrosis of subcutaneous tissue and muscle fascia.",
      pathophysiologyMechanism: "Bacterial gas production and microvascular thrombosis lead to rapid ischemic liquefactive necrosis of fascia and nerves.",
      clinicalHallmarks: "Pain vastly out of proportion to skin changes, crepitus, skin anesthesia; LRINEC >=6; immediate radical surgical debridement + Clindamycin.",
      highYieldPearls: "Necrotizing fasciitis requires immediate radical operative debridement (do not delay for imaging) + Clindamycin for toxin suppression."
    },
    {
      id: "derm-inf-atopic-dermatitis-dupilumab",
      name: "Atopic Dermatitis Barrier Loss (Filaggrin Mutations, Type 2 Cytokines & Dupilumab IL-4Ra)",
      category: "Th2 Barrier Defect",
      subType: "Filaggrin (FLG) Loss-of-Function • Elevated IgE • Flexural Lichenification • Dupilumab (anti-IL-4Ra)",
      dermProfile: "Chronic, highly pruritic inflammatory skin disorder characterized by skin barrier disruption and Th2-skewed inflammation.",
      pathophysiologyMechanism: "Defective stratum corneum barrier allows allergen entry, triggering IL-4 and IL-13 production and intense pruritus.",
      clinicalHallmarks: "Intense itching, flexural lichenification, Dennie-Morgan infraorbital folds; Dupilumab (anti-IL-4R-alpha) and topical Tacrolimus.",
      highYieldPearls: "Atopic dermatitis involves filaggrin mutations and Th2 cytokines (IL-4/IL-13); targeted with Dupilumab."
    },
    {
      id: "derm-inf-pyoderma-gangrenosum",
      name: "Pyoderma Gangrenosum Pathergy (Neutrophilic Infiltration & Inflammatory Bowel Disease)",
      category: "Neutrophilic Dermatosis",
      subType: "Associated with IBD (Ulcerative Colitis) • Pathergy Phenomenon • Violaceous Undermined Gunmetal Border",
      dermProfile: "Non-infectious, destructive, autoinflammatory ulcerative neutrophilic dermatosis commonly associated with systemic inflammatory disease.",
      pathophysiologyMechanism: "Unchecked neutrophil activation and aberrant IL-1beta / TNF-alpha signaling cause sterile liquefactive tissue necrosis.",
      clinicalHallmarks: "Rapidly expanding painful ulcer with violaceous undermined borders; pathergy (worsening with debridement); Systemic Corticosteroids/Infliximab.",
      highYieldPearls: "Pyoderma gangrenosum presents with violaceous undermined borders and pathergy; SURGICAL DEBRIDEMENT IS CONTRAINDICATED."
    }
  ]
};

interface ClinicalDermatologyAdvLabViewerProps {
  initialMode?: DermatologyLabMode;
  height?: string;
  onNodeSelect?: (node: DermatologyLabNode) => void;
}

export default function ClinicalDermatologyAdvLabViewer({
  initialMode = "emergencies",
  height = "560px",
  onNodeSelect,
}: ClinicalDermatologyAdvLabViewerProps) {
  const [activeMode, setActiveMode] = useState<DermatologyLabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // SCORTEN Simulator State
  const [scortenCriteria, setScortenCriteria] = useState({
    age40: true,
    hr120: true,
    malignancy: false,
    bsa10: true,
    bun28: true,
    glucose252: true,
    bicarb20: false,
  });

  const scortenScore = useMemo(() => {
    return Object.values(scortenCriteria).filter(Boolean).length;
  }, [scortenCriteria]);

  const scortenMortality = useMemo(() => {
    if (scortenScore <= 1) return { percent: "3.2%", risk: "Low Mortality Risk" };
    if (scortenScore === 2) return { percent: "12.1%", risk: "Moderate Mortality Risk" };
    if (scortenScore === 3) return { percent: "35.3%", risk: "Substantial Mortality Risk" };
    if (scortenScore === 4) return { percent: "58.3%", risk: "High Mortality Risk" };
    return { percent: "90.0%", risk: "Extremely High Mortality (>90%)" };
  }, [scortenScore]);

  // Breslow Microstaging Calculator State
  const [breslowDepth, setBreslowDepth] = useState<number>(1.5);

  const breslowStaging = useMemo(() => {
    if (breslowDepth <= 0.0) {
      return {
        stage: "Melanoma In Situ",
        margin: "0.5 cm wide local excision",
        slnb: "SLNB not indicated",
        action: "Perform 0.5 cm wide margin excision to subcutaneous fat."
      };
    } else if (breslowDepth <= 1.0) {
      return {
        stage: "Thin Melanoma (<= 1.0 mm)",
        margin: "1.0 cm wide local excision",
        slnb: "SLNB generally not indicated (consider if ulcerated or high mitoses)",
        action: "Wide local excision with 1.0 cm radial margin down to deep fascia."
      };
    } else if (breslowDepth <= 2.0) {
      return {
        stage: "Intermediate Melanoma (1.01 - 2.0 mm)",
        margin: "1.0 - 2.0 cm wide local excision",
        slnb: "Sentinel Lymph Node Biopsy (SLNB) MANDATORY",
        action: "Wide local excision with 1-2 cm margin PLUS Sentinel Lymph Node Biopsy."
      };
    } else {
      return {
        stage: "Thick Melanoma (> 2.0 mm)",
        margin: "2.0 cm wide local excision",
        slnb: "Sentinel Lymph Node Biopsy (SLNB) MANDATORY",
        action: "Wide local excision with 2.0 cm margin PLUS Sentinel Lymph Node Biopsy + Brain/Chest CT Staging."
      };
    }
  }, [breslowDepth]);

  const currentNodes = useMemo(() => {
    return DERMATOLOGY_LAB_NODES[activeMode] || DERMATOLOGY_LAB_NODES.emergencies;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: DermatologyLabNode) => {
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
            <ShieldAlert size={14} /> DER-301
          </span>
          <span className={styles.titleText}>
            {activeMode === "emergencies" && "Cutaneous Emergencies: SJS/TEN (SCORTEN / Nikolsky), SSSS & DRESS Syndrome"}
            {activeMode === "bullous" && "Autoimmune Bullous Diseases: Pemphigus Vulgaris (Desmoglein-3/1) & Pemphigoid (BP180)"}
            {activeMode === "oncology" && "Cutaneous Oncology: Malignant Melanoma (Breslow Depth / BRAF V600E) & Mohs Surgery"}
            {activeMode === "inflammatory" && "Inflammatory & Infectious Dermatoses: Psoriasis Biologics & Necrotizing Fasciitis"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Dermatology Diagnostic Quiz"}
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
                <div className="text-xs font-bold text-rose-300 uppercase tracking-wider">
                  Dermatology Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Cutaneous Entity / Pathology: {quizTargetNode.clinicalHallmarks}
                </div>
                {quizFeedback && (
                  <div className="text-xs text-rose-300 font-medium mt-1">{quizFeedback}</div>
                )}
              </div>
              <button
                onClick={nextQuizQuestion}
                className="px-3 py-1 bg-rose-950 text-xs rounded border border-rose-700 text-rose-200"
              >
                Next
              </button>
            </div>
          )}

          {/* Mode 1: Cutaneous Emergencies & SCORTEN Calculator */}
          {activeMode === "emergencies" && (
            <div className={styles.dermCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Calculator size={14} /> SCORTEN Prognostic Score Calculator (SJS / TEN)
                </span>
                <span className="text-[11px] text-slate-400">Score: {scortenScore} / 7 &bull; Predicted Mortality: {scortenMortality.percent}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => setScortenCriteria(p => ({ ...p, age40: !p.age40 }))}
                  className={`p-1.5 rounded font-semibold border transition ${
                    scortenCriteria.age40 ? "bg-rose-950 border-rose-500 text-rose-200" : "bg-slate-900 border-slate-700 text-slate-400"
                  }`}
                >
                  Age &ge; 40 yo {scortenCriteria.age40 ? "✓" : ""}
                </button>
                <button
                  onClick={() => setScortenCriteria(p => ({ ...p, hr120: !p.hr120 }))}
                  className={`p-1.5 rounded font-semibold border transition ${
                    scortenCriteria.hr120 ? "bg-rose-950 border-rose-500 text-rose-200" : "bg-slate-900 border-slate-700 text-slate-400"
                  }`}
                >
                  HR &ge; 120 bpm {scortenCriteria.hr120 ? "✓" : ""}
                </button>
                <button
                  onClick={() => setScortenCriteria(p => ({ ...p, malignancy: !p.malignancy }))}
                  className={`p-1.5 rounded font-semibold border transition ${
                    scortenCriteria.malignancy ? "bg-rose-950 border-rose-500 text-rose-200" : "bg-slate-900 border-slate-700 text-slate-400"
                  }`}
                >
                  Malignancy {scortenCriteria.malignancy ? "✓" : ""}
                </button>
                <button
                  onClick={() => setScortenCriteria(p => ({ ...p, bsa10: !p.bsa10 }))}
                  className={`p-1.5 rounded font-semibold border transition ${
                    scortenCriteria.bsa10 ? "bg-rose-950 border-rose-500 text-rose-200" : "bg-slate-900 border-slate-700 text-slate-400"
                  }`}
                >
                  BSA &ge; 10% {scortenCriteria.bsa10 ? "✓" : ""}
                </button>
                <button
                  onClick={() => setScortenCriteria(p => ({ ...p, bun28: !p.bun28 }))}
                  className={`p-1.5 rounded font-semibold border transition ${
                    scortenCriteria.bun28 ? "bg-rose-950 border-rose-500 text-rose-200" : "bg-slate-900 border-slate-700 text-slate-400"
                  }`}
                >
                  BUN &gt; 28 mg/dL {scortenCriteria.bun28 ? "✓" : ""}
                </button>
                <button
                  onClick={() => setScortenCriteria(p => ({ ...p, glucose252: !p.glucose252 }))}
                  className={`p-1.5 rounded font-semibold border transition ${
                    scortenCriteria.glucose252 ? "bg-rose-950 border-rose-500 text-rose-200" : "bg-slate-900 border-slate-700 text-slate-400"
                  }`}
                >
                  Glucose &gt; 252 {scortenCriteria.glucose252 ? "✓" : ""}
                </button>
                <button
                  onClick={() => setScortenCriteria(p => ({ ...p, bicarb20: !p.bicarb20 }))}
                  className={`p-1.5 rounded font-semibold border transition ${
                    scortenCriteria.bicarb20 ? "bg-rose-950 border-rose-500 text-rose-200" : "bg-slate-900 border-slate-700 text-slate-400"
                  }`}
                >
                  HCO3 &lt; 20 mEq/L {scortenCriteria.bicarb20 ? "✓" : ""}
                </button>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                <div className="text-sm font-bold text-rose-300">SCORTEN Prognostic Status: {scortenMortality.risk}</div>
                <div className="text-rose-400 font-bold mt-1">Predicted Mortality Rate: {scortenMortality.percent}</div>
                <div className="text-slate-300 mt-1">Mandate: Immediate cessation of offending drug, transfer to Burn ICU, protective fluid resuscitation, ocular lubrication to prevent symblepharon, and sterile barrier dressing.</div>
              </div>
            </div>
          )}

          {/* Mode 2: Autoimmune Bullous Disorders */}
          {activeMode === "bullous" && (
            <div className={styles.dermCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers size={14} /> Acantholysis vs Subepidermal Blistering Matrix
                </span>
                <span className="text-[11px] text-slate-400">Pemphigus (Desmoglein-3/1) &bull; Pemphigoid (BP180) &bull; Duhring (eTG-3)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-rose-300 font-bold">Pemphigus Vulgaris (Intraepidermal)</div>
                  <div className="text-slate-300 mt-1">IgG against Desmoglein-3 &amp; 1 cadherins. Suprabasal acantholysis with &apos;tombstone&apos; basal layer. Fragile flaccid bullae, severe oral mucosal ulcerations, positive Nikolsky sign. DIF shows intercellular chicken-wire net. Treated with Systemic Steroids + Rituximab.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-rose-300 font-bold">Bullous Pemphigoid (Subepidermal)</div>
                  <div className="text-slate-300 mt-1">IgG against hemidesmosomal BP180 (Col XVII) &amp; BP230. Subepidermal cleft with eosinophilic infiltrate. Tense firm bullae on urticarial base, negative Nikolsky sign, mucosal sparing. DIF shows linear basement membrane band. Treated with topical Clobetasol.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 3: Cutaneous Malignancies & Breslow Calculator */}
          {activeMode === "oncology" && (
            <div className={styles.dermCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Calculator size={14} /> Melanoma Breslow Thickness Microstaging Simulator
                </span>
                <span className="text-[11px] text-slate-400">Breslow Depth: {breslowDepth.toFixed(2)} mm</span>
              </div>

              <div className="space-y-3">
                <input
                  type="range"
                  min="0.0"
                  max="4.0"
                  step="0.05"
                  value={breslowDepth}
                  onChange={(e) => setBreslowDepth(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                  <div className="text-sm font-bold text-rose-300">{breslowStaging.stage}</div>
                  <div className="text-rose-400 font-bold mt-1">Required Margin: {breslowStaging.margin}</div>
                  <div className="text-amber-300 font-semibold mt-1">Nodal Staging: {breslowStaging.slnb}</div>
                  <div className="text-slate-300 mt-1"><strong className="text-rose-400">Action:</strong> {breslowStaging.action}</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 4: Inflammatory Dermatoses & Necrotizing Fasciitis */}
          {activeMode === "inflammatory" && (
            <div className={styles.dermCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert size={14} /> Psoriasis Biologics vs Necrotizing Soft Tissue Emergency
                </span>
                <span className="text-[11px] text-slate-400">IL-17A / IL-23 Axis &bull; LRINEC Score &bull; Clindamycin Antitoxin</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-rose-300 font-bold">Psoriasis Biologic Axis (IL-17A / IL-23)</div>
                  <div className="text-slate-300 mt-1">Driven by IL-23/Th17/IL-17A cascade. Features Auspitz sign (punctate bleeding) and Munro microabscesses. Highly targeted with Secukinumab/Ixekizumab (anti-IL-17A) and Guselkumab/Risankizumab (anti-IL-23 p19).</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-rose-300 font-bold">Necrotizing Fasciitis Surgical Mandate</div>
                  <div className="text-slate-300 mt-1">Severe pain out of all proportion to exam, crepitus, skin necrosis. LRINEC score &ge; 6 predicts disease. Mandatory immediate operative surgical debridement (do not delay for MRI) + Vancomycin + Zosyn + Clindamycin (halts exotoxin synthesis).</div>
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
                    <span className="text-rose-400 font-bold">Derm:</span> {node.dermProfile}
                  </div>

                  <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400">
                    <span>Inspect Derm protocol</span>
                    <ArrowRight size={12} className="text-slate-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: High-Yield Clinical Dermatology Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
              Dermatology Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🔬 Dermatologic Entity / Pathology</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🧬 Histopathology &amp; Cleavage Plane</div>
            <div className="text-xs text-rose-300 font-semibold">{activeNode.dermProfile}</div>
            <div className={styles.inspectorBody}>{activeNode.pathophysiologyMechanism}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>📋 Clinical Hallmarks &amp; Diagnostics</div>
            <div className={styles.inspectorBody}>{activeNode.clinicalHallmarks}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 Gold Standard Derm Pearls</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearls}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("emergencies")}
          className={`${styles.modeTab} ${activeMode === "emergencies" ? styles.modeTabActive : ""}`}
        >
          ⚡ 1. SJS/TEN &amp; SCORTEN
        </button>
        <button
          onClick={() => setActiveMode("bullous")}
          className={`${styles.modeTab} ${activeMode === "bullous" ? styles.modeTabActive : ""}`}
        >
          🔄 2. Autoimmune Bullous
        </button>
        <button
          onClick={() => setActiveMode("oncology")}
          className={`${styles.modeTab} ${activeMode === "oncology" ? styles.modeTabActive : ""}`}
        >
          🛡️ 3. Melanoma &amp; Breslow
        </button>
        <button
          onClick={() => setActiveMode("inflammatory")}
          className={`${styles.modeTab} ${activeMode === "inflammatory" ? styles.modeTabActive : ""}`}
        >
          🔥 4. Psoriasis &amp; Nec Fasciitis
        </button>
      </div>
    </div>
  );
}
