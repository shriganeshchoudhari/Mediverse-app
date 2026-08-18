"use client";

import React, { useState, useMemo } from "react";
import styles from "./DermatologyLabViewer.module.css";
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
  Shield,
  Sun,
  AlertCircle,
  Stethoscope,
} from "lucide-react";

export type DermatologyLabMode = "psoriasis" | "bullous" | "melanoma" | "drugReactions";

export interface DermatologyLabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  clinicalAlgorithm: string;
  diagnosticCriteria: string;
  dermatologicManagement: string;
  highYieldPearl: string;
}

export const DERMATOLOGY_NODES: Record<DermatologyLabMode, DermatologyLabNode[]> = {
  psoriasis: [
    {
      id: "psoriasis-vulgaris-auspitz",
      name: "1. Psoriasis Vulgaris: Auspitz Sign & Koebner Phenomenon",
      category: "Papulosquamous Dermatosis",
      subType: "IL-23 / Th17 / IL-17A Axis • Silvery Scales • Munro Microabscesses",
      clinicalAlgorithm: "Extensor plaques with silvery scale -> Scrape scale: Pinpoint bleeding (Auspitz sign) -> Topical Clobetasol + Calcipotriol -> Methotrexate / Biologics.",
      diagnosticCriteria: "Auspitz sign (suprapapillary thinning over dilated capillary loops); Koebner phenomenon (isomorphic response to trauma); Nail pitting & oil-drop patches.",
      dermatologicManagement: "Mild (<10% BSA): High-potency topical steroids + Calcipotriol. Severe (>10% BSA): Methotrexate, Apremilast, or Anti-IL-17A/Anti-IL-23 biologics.",
      highYieldPearl: "Systemic oral corticosteroids are strictly contraindicated in plaque psoriasis as tapering triggers life-threatening Generalized Pustular Psoriasis of von Zumbusch!"
    },
    {
      id: "psoriatic-arthritis-lichen-planus",
      name: "2. Psoriatic Arthritis (Dactylitis) & Lichen Planus (6 Ps)",
      category: "Autoimmune Dermatoses",
      subType: "PsA (Pencil-in-a-Cup, Dactylitis) • Lichen Planus (6 Ps, Wickham Striae, HCV)",
      clinicalAlgorithm: "PsA: Sausage digits + DIP arthritis -> X-ray: Pencil-in-a-cup -> Anti-TNF / Anti-IL-17A. Lichen Planus: 6 Ps on flexor wrists -> Topical steroids.",
      diagnosticCriteria: "PsA: Asymmetric oligoarthritis, enthesitis, dactylitis, HLA-B27. Lichen Planus: 6 Ps (Pruritic, Polygonal, Planar, Purple, Papules, Plaques) + Wickham striae.",
      dermatologicManagement: "PsA: Methotrexate -> Anti-TNF (Adalimumab) or Anti-IL-17A (Secukinumab). Lichen Planus: High-potency topical steroids; screen for Hepatitis C.",
      highYieldPearl: "Lichen Planus exhibits the 6 Ps on flexor surfaces and is strongly associated with Hepatitis C Virus (HCV) infection."
    }
  ],

  bullous: [
    {
      id: "pemphigus-vulgaris-desmoglein",
      name: "1. Pemphigus Vulgaris: Desmoglein-3 & Positive Nikolsky Sign",
      category: "Intraepidermal Blistering",
      subType: "Anti-Desmoglein-3 • Suprabasal Acantholysis • Flaccid Bullae • Oral Ulcers >90%",
      clinicalAlgorithm: "Painful oral ulcers -> Flaccid blisters that rupture easily -> Nikolsky sign POSITIVE -> Biopsy: Suprabasal acantholysis + Fishnet DIF -> Systemic Steroids + Rituximab.",
      diagnosticCriteria: "Intraepidermal cleavage; tombstoning of basal keratinocytes; Tzanck smear showing acantholytic cells; Direct Immunofluorescence: 'Fishnet' intercellular IgG/C3.",
      dermatologicManagement: "High-dose Oral Prednisone (1-1.5 mg/kg/day) + Rituximab (Anti-CD20) 1st-line or Mycophenolate Mofetil / Azathioprine.",
      highYieldPearl: "Pemphigus vulgaris produces flaccid blisters with a positive Nikolsky sign and severe oral mucosal involvement in over 90% of patients."
    },
    {
      id: "bullous-pemphigoid-dermatitis-herpetiformis",
      name: "2. Bullous Pemphigoid (BP180/BP230) vs Dermatitis Herpetiformis (Celiac IgA)",
      category: "Subepidermal Blistering",
      subType: "BP (Tense Bullae, Nikolsky Negative, Linear DIF) • DH (Celiac Disease, IgA Dermal Papillae)",
      clinicalAlgorithm: "BP: Tense blisters in elderly -> Nikolsky NEGATIVE -> Linear BMZ DIF -> Topical Clobetasol. DH: Pruritic vesicles on elbows/knees -> Granular IgA DIF -> Dapsone + Gluten-Free.",
      diagnosticCriteria: "BP: Subepidermal blister with eosinophils; Linear IgG/C3 at BMZ. DH: Granular IgA in dermal papillae associated with Celiac enteropathy.",
      dermatologicManagement: "BP: High-potency topical Clobetasol cream (20-30 g/d) or oral prednisone. DH: Dapsone (check G6PD first!) + Strict lifelong gluten-free diet.",
      highYieldPearl: "Dermatitis Herpetiformis is pathognomonic for Celiac Disease and presents with granular IgA deposition in dermal papillae, responding rapidly to Dapsone."
    }
  ],

  melanoma: [
    {
      id: "melanoma-abcde-breslow",
      name: "1. Malignant Melanoma: ABCDE Criteria & Breslow Depth",
      category: "Cutaneous Oncology",
      subType: "ABCDE Checklist • Breslow Depth (mm) • BRAF V600E Mutation",
      clinicalAlgorithm: "Suspicious pigmented lesion (ABCDE) -> Full-thickness excisional biopsy (1-3mm margins) -> Measure Breslow depth -> Wide local excision + Sentinel Node Biopsy.",
      diagnosticCriteria: "Asymmetry, Border irregularity, Color variegation, Diameter >6mm, Evolving (Ugly duckling). Breslow thickness is the #1 prognostic indicator.",
      dermatologicManagement: "Thin (<=1.0mm): 1cm margin. Intermediate (1.01-2.0mm): 1-2cm margin + SLNB. BRAF V600E: Dabrafenib + Trametinib; Anti-PD-1 (Pembrolizumab).",
      highYieldPearl: "Breslow depth of invasion measured in millimeters is the single most important independent prognostic factor for localized cutaneous melanoma."
    },
    {
      id: "non-melanoma-bcc-scc",
      name: "2. Non-Melanoma Skin Cancers: Basal Cell (BCC) vs Squamous Cell (SCC)",
      category: "Epidermal Neoplasms",
      subType: "BCC (Pearly Telangiectasia, Rodent Ulcer) • SCC (Actinic Keratosis, Keratin Pearls)",
      clinicalAlgorithm: "BCC: Pearly papule with telangiectasias & rolled borders -> Mohs surgery. SCC: Hyperkeratotic ulcer on sun-exposed ear/lip -> Excision.",
      diagnosticCriteria: "BCC: Palisading nests of basaloid cells with retraction artifact. SCC: Atypical squamous cells with Keratin Pearls invading dermis; Marjolin ulcer.",
      dermatologicManagement: "BCC: Mohs Micrographic Surgery for high-risk facial lesions; Electrodesiccation & curettage. SCC: Surgical wide excision with 4-6mm margins.",
      highYieldPearl: "Basal Cell Carcinoma is the most common human cancer, characterized by pearly translucent papules with arborizing telangiectasias and rolled borders."
    }
  ],

  drugReactions: [
    {
      id: "sjs-ten-scorten-detachment",
      name: "1. Stevens-Johnson Syndrome (SJS) vs Toxic Epidermal Necrolysis (TEN)",
      category: "Severe Drug Reaction (SCAR)",
      subType: "SJS (<10% TBSA) • SJS/TEN (10-30%) • TEN (>30% TBSA) • Nikolsky Positive",
      clinicalAlgorithm: "Culprit drug (Allopurinol, Sulfa, Anticonvulsant) -> Fever + dusky macules + mucosal sloughing -> Calculate SCORTEN -> Immediate Burn Unit transfer.",
      diagnosticCriteria: "Full-thickness epidermal necrosis via Granulysin & FasL; sheet-like sloughing (Nikolsky positive); severe erosive mucositis in >=2 mucosal sites.",
      dermatologicManagement: "Immediate drug withdrawal + Transfer to Burn Unit/ICU + Supportive fluids/wound care + Urgent ophthalmology consult + IVIG / Cyclosporine / Etanercept.",
      highYieldPearl: "Toxic Epidermal Necrolysis is defined by >30% TBSA full-thickness epidermal detachment, with in-hospital mortality predicted by the SCORTEN score."
    },
    {
      id: "dress-syndrome-triad",
      name: "2. DRESS Syndrome: Facial Edema, Eosinophilia & Hepatitis",
      category: "Systemic Drug Reaction",
      subType: "Delayed Onset (2-8 wks) • Eosinophilia >1500/uL • Acute Hepatitis (ALT >80%)",
      clinicalAlgorithm: "Drug exposure 2-8 wks ago -> High fever + diffuse rash with facial edema -> Eosinophilia + Elevated ALT -> Stop drug + Systemic Prednisone (2-3 mo taper).",
      diagnosticCriteria: "Triad: 1. Extensive maculopapular rash with facial edema (>70%), 2. Eosinophilia (>1500/uL), 3. Internal organ involvement (Hepatitis in >80%, Nephritis).",
      dermatologicManagement: "Immediate cessation of offending medication + Systemic Corticosteroids (Prednisone 1 mg/kg/day) with prolonged slow taper over 2-3 months to prevent relapse.",
      highYieldPearl: "DRESS syndrome is characterized by a delayed onset (2-8 weeks post-drug), prominent facial edema, peripheral eosinophilia, and acute hepatitis."
    }
  ]
};

interface DermatologyLabViewerProps {
  initialMode?: DermatologyLabMode;
  height?: string;
  onNodeSelect?: (node: DermatologyLabNode) => void;
}

export default function DermatologyLabViewer({
  initialMode = "psoriasis",
  height = "560px",
  onNodeSelect,
}: DermatologyLabViewerProps) {
  const [activeMode, setActiveMode] = useState<DermatologyLabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Psoriasis State
  const [pasiScore, setPasiScore] = useState<number>(14); // Psoriasis Area and Severity Index (0-72)
  const [papulosquamousType, setPapulosquamousType] = useState<"psoriasis" | "psa" | "lichen" | "pityriasis">("psoriasis");

  // Bullous State
  const [bullousType, setBullousType] = useState<"pv" | "bp" | "dh">("pv");
  const [nikolskyApplied, setNikolskyApplied] = useState<boolean>(true);

  // Melanoma Breslow State
  const [breslowDepthMm, setBreslowDepthMm] = useState<number>(1.6); // mm

  // SJS/TEN Detachment State
  const [tbsaDetachment, setTbsaDetachment] = useState<number>(35); // %
  const [scortenAge40, setScortenAge40] = useState<boolean>(true);
  const [scortenHr120, setScortenHr120] = useState<boolean>(true);
  const [scortenUrea10, setScortenUrea10] = useState<boolean>(true);

  // SJS/TEN Triage Calculation
  const scarTriage = useMemo(() => {
    let dx = "Stevens-Johnson Syndrome (SJS)";
    let color = "text-amber-300 font-bold";
    if (tbsaDetachment > 30) {
      dx = "Toxic Epidermal Necrolysis (TEN / Lyell Syndrome)";
      color = "text-rose-400 font-extrabold";
    } else if (tbsaDetachment >= 10) {
      dx = "SJS / TEN Overlap";
      color = "text-orange-400 font-bold";
    }

    let score = 0;
    if (scortenAge40) score += 1;
    if (scortenHr120) score += 1;
    if (scortenUrea10) score += 1;
    if (tbsaDetachment > 10) score += 1;

    let mortality = "~3.2%";
    if (score === 2) mortality = "~12.1%";
    if (score === 3) mortality = "~35.3%";
    if (score >= 4) mortality = ">58.3% to >90%";

    return { dx, color, score, mortality };
  }, [tbsaDetachment, scortenAge40, scortenHr120, scortenUrea10]);

  // Breslow Margins Calculation
  const breslowTriage = useMemo(() => {
    if (breslowDepthMm <= 1.0) {
      return {
        stage: "T1 (Thin Melanoma)",
        margin: "1.0 cm Surgical Margin",
        slnb: breslowDepthMm >= 0.8 ? "Consider SLNB if ulcerated" : "SLNB not required"
      };
    } else if (breslowDepthMm <= 2.0) {
      return {
        stage: "T2 (Intermediate Melanoma)",
        margin: "1.0 – 2.0 cm Surgical Margin",
        slnb: "Sentinel Lymph Node Biopsy (SLNB) Routinely Indicated"
      };
    }
    return {
      stage: "T3 / T4 (Thick Melanoma)",
      margin: "2.0 cm Surgical Margin",
      slnb: "Sentinel Lymph Node Biopsy (SLNB) Routinely Indicated"
    };
  }, [breslowDepthMm]);

  const currentNodes = useMemo(() => {
    return DERMATOLOGY_NODES[activeMode] || DERMATOLOGY_NODES.psoriasis;
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
            <Shield size={14} /> DERM-301
          </span>
          <span className={styles.titleText}>
            {activeMode === "psoriasis" && "Psoriasis Vulgaris (Auspitz & Koebner) & Papulosquamous Simulator"}
            {activeMode === "bullous" && "Bullous Dermatoses (Pemphigus vs Pemphigoid) & Nikolsky Matrix"}
            {activeMode === "melanoma" && "Malignant Melanoma ABCDE Criteria & Breslow Depth Stratifier"}
            {activeMode === "drugReactions" && "SJS / TEN Epidermal Detachment & SCORTEN Mortality Engine"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Dermatology Quiz"}
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
                  Dermatology Clinical Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Dermatologic Entity: {quizTargetNode.diagnosticCriteria}
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

          {/* Mode 1: Psoriasis & Papulosquamous Simulator */}
          {activeMode === "psoriasis" && (
            <div className={styles.dermSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-pink-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={14} /> Psoriasis Area &amp; Severity Index (PASI) &amp; Biologic Selection
                </span>
                <span className="text-[11px] text-slate-400">IL-23 / IL-17A Axis</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => setPapulosquamousType("psoriasis")}
                  className={`p-2 rounded font-bold border transition ${
                    papulosquamousType === "psoriasis"
                      ? "bg-pink-600 text-white border-pink-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Psoriasis Vulgaris
                </button>
                <button
                  onClick={() => setPapulosquamousType("psa")}
                  className={`p-2 rounded font-bold border transition ${
                    papulosquamousType === "psa"
                      ? "bg-pink-600 text-white border-pink-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Psoriatic Arthritis
                </button>
                <button
                  onClick={() => setPapulosquamousType("lichen")}
                  className={`p-2 rounded font-bold border transition ${
                    papulosquamousType === "lichen"
                      ? "bg-pink-600 text-white border-pink-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Lichen Planus (6 Ps)
                </button>
                <button
                  onClick={() => setPapulosquamousType("pityriasis")}
                  className={`p-2 rounded font-bold border transition ${
                    papulosquamousType === "pityriasis"
                      ? "bg-pink-600 text-white border-pink-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Pityriasis Rosea
                </button>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Psoriasis Severity (PASI Score):</span>{" "}
                  <strong className="text-pink-400">{pasiScore} ({pasiScore >= 10 ? "Moderate-to-Severe" : "Mild"})</strong>
                </div>
                <input
                  type="range"
                  min="2"
                  max="40"
                  step="1"
                  value={pasiScore}
                  onChange={(e) => setPasiScore(parseInt(e.target.value))}
                  className="w-full accent-pink-500"
                />
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                {papulosquamousType === "psoriasis" && (
                  <div>
                    <div className="text-pink-300 font-bold">Psoriasis Vulgaris (Silvery Scales &amp; Auspitz Sign)</div>
                    <div className="text-slate-300 mt-1">Munro microabscesses in parakeratotic stratum corneum; Koebner isomorphic response to trauma.</div>
                    <div className="text-rose-400 font-bold mt-1">WARNING: Oral systemic steroids strictly CONTRAINDICATED (triggers von Zumbusch pustular psoriasis).</div>
                  </div>
                )}
                {papulosquamousType === "psa" && (
                  <div>
                    <div className="text-pink-300 font-bold">Psoriatic Arthritis (PsA)</div>
                    <div className="text-slate-300 mt-1">Dactylitis (sausage digits), nail pitting/oil drops, and pencil-in-a-cup deformity on DIP radiographs. Treat with Anti-TNF / Anti-IL-17A.</div>
                  </div>
                )}
                {papulosquamousType === "lichen" && (
                  <div>
                    <div className="text-pink-300 font-bold">Lichen Planus (6 Ps &amp; Wickham Striae)</div>
                    <div className="text-slate-300 mt-1">Pruritic, Polygonal, Planar, Purple, Papules &amp; Plaques on flexor wrists; reticular white Wickham striae on oral mucosa; associated with Hepatitis C.</div>
                  </div>
                )}
                {papulosquamousType === "pityriasis" && (
                  <div>
                    <div className="text-pink-300 font-bold">Pityriasis Rosea (Herald Patch)</div>
                    <div className="text-slate-300 mt-1">Solitary 2-5cm oval herald patch followed by secondary Christmas-tree eruption along Langer cleavage lines (HHV-6/7). Self-limiting.</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mode 2: Bullous Dermatoses & Nikolsky Matrix */}
          {activeMode === "bullous" && (
            <div className={styles.dermSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-pink-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield size={14} /> Autoimmune Bullous Cleavage &amp; Nikolsky Sign Matrix
                </span>
                <span className="text-[11px] text-slate-400">Intraepidermal vs Subepidermal</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <button
                  onClick={() => {
                    setBullousType("pv");
                    setNikolskyApplied(true);
                  }}
                  className={`p-2 rounded font-bold border transition ${
                    bullousType === "pv"
                      ? "bg-pink-600 text-white border-pink-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Pemphigus Vulgaris
                </button>
                <button
                  onClick={() => {
                    setBullousType("bp");
                    setNikolskyApplied(false);
                  }}
                  className={`p-2 rounded font-bold border transition ${
                    bullousType === "bp"
                      ? "bg-pink-600 text-white border-pink-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Bullous Pemphigoid
                </button>
                <button
                  onClick={() => {
                    setBullousType("dh");
                    setNikolskyApplied(false);
                  }}
                  className={`p-2 rounded font-bold border transition ${
                    bullousType === "dh"
                      ? "bg-pink-600 text-white border-pink-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Dermatitis Herpetiformis
                </button>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                {bullousType === "pv" && (
                  <div>
                    <div className="text-pink-300 font-bold">Pemphigus Vulgaris (Anti-Desmoglein-3)</div>
                    <div className="text-slate-300 mt-1">Intraepidermal suprabasal acantholysis with tombstone basal layer. Flaccid fragile bullae and painful oral mucosal ulcers in &gt;90%.</div>
                    <div className="text-rose-400 font-bold mt-1">Nikolsky Sign: POSITIVE (Epidermal sloughing on shearing force); DIF: 'Fishnet' intercellular IgG.</div>
                    <div className="text-emerald-300 font-bold mt-1">Management: High-dose Prednisone + Rituximab (Anti-CD20).</div>
                  </div>
                )}
                {bullousType === "bp" && (
                  <div>
                    <div className="text-pink-300 font-bold">Bullous Pemphigoid (Anti-Hemidesmosome BP180/BP230)</div>
                    <div className="text-slate-300 mt-1">Subepidermal cleavage with intact thick epidermal roof and eosinophil infiltrate. Tense firm bullae in elderly; oral ulcers rare (&lt;15%).</div>
                    <div className="text-emerald-400 font-bold mt-1">Nikolsky Sign: NEGATIVE; DIF: Linear ribbon of IgG/C3 along Basement Membrane Zone.</div>
                    <div className="text-pink-300 font-bold mt-1">Management: High-potency topical Clobetasol cream (20-30 g/d).</div>
                  </div>
                )}
                {bullousType === "dh" && (
                  <div>
                    <div className="text-pink-300 font-bold">Dermatitis Herpetiformis (Celiac Disease &amp; IgA)</div>
                    <div className="text-slate-300 mt-1">Intensely pruritic papulovesicles on elbows/knees/buttocks; granular IgA deposition in dermal papillae.</div>
                    <div className="text-emerald-300 font-bold mt-1">Management: Dapsone (check G6PD first!) + Strict Lifelong Gluten-Free Diet.</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mode 3: Melanoma ABCDE & Breslow Depth */}
          {activeMode === "melanoma" && (
            <div className={styles.dermSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-pink-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sun size={14} /> Malignant Melanoma Breslow Depth &amp; Excision Margin Stratifier
                </span>
                <span className="text-[11px] text-slate-400">ABCDE Checklist</span>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Breslow Depth of Invasion:</span>{" "}
                  <strong className="text-pink-400">{breslowDepthMm.toFixed(2)} mm</strong>
                </div>
                <input
                  type="range"
                  min="0.4"
                  max="4.5"
                  step="0.1"
                  value={breslowDepthMm}
                  onChange={(e) => setBreslowDepthMm(parseFloat(e.target.value))}
                  className="w-full accent-pink-500"
                />
              </div>

              <div className={styles.dermResultsGrid}>
                <div className={styles.dermResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">T-Stage</div>
                  <div className="text-xs font-bold text-pink-300 mt-1">{breslowTriage.stage}</div>
                </div>
                <div className={styles.dermResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Surgical Margin</div>
                  <div className="text-xs font-bold text-white mt-1">{breslowTriage.margin}</div>
                </div>
                <div className={styles.dermResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Sentinel Node (SLNB)</div>
                  <div className="text-xs font-bold text-slate-200 mt-1">{breslowTriage.slnb}</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 4: SJS/TEN Epidermal Detachment & SCORTEN */}
          {activeMode === "drugReactions" && (
            <div className={styles.dermSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-pink-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertCircle size={14} /> SJS / TEN Epidermal Detachment &amp; SCORTEN Mortality Engine
                </span>
                <span className="text-[11px] text-slate-400">Nikolsky Positive Sloughing</span>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>TBSA Epidermal Detachment:</span>{" "}
                  <strong className="text-pink-400">{tbsaDetachment}% ({scarTriage.dx})</strong>
                </div>
                <input
                  type="range"
                  min="2"
                  max="80"
                  step="1"
                  value={tbsaDetachment}
                  onChange={(e) => setTbsaDetachment(parseInt(e.target.value))}
                  className="w-full accent-pink-500"
                />
              </div>

              <div className={styles.dermResultsGrid}>
                <div className={styles.dermResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Classification</div>
                  <div className={`text-xs font-bold mt-1 ${scarTriage.color}`}>{scarTriage.dx}</div>
                </div>
                <div className={styles.dermResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">SCORTEN Score</div>
                  <div className="text-xs font-bold text-pink-300 mt-1">{scarTriage.score} Points</div>
                </div>
                <div className={styles.dermResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">In-Hospital Mortality</div>
                  <div className="text-xs font-bold text-rose-400 mt-1">{scarTriage.mortality}</div>
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
                    <span className="text-pink-400 font-bold">Algorithm:</span> {node.clinicalAlgorithm}
                  </div>

                  <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400">
                    <span>Inspect dermatology protocol</span>
                    <ArrowRight size={12} className="text-slate-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: High-Yield Dermatology Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">
              Dermatology Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🎯 Disease / Clinical Entity</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>⚡ Diagnostic Criteria &amp; Algorithm</div>
            <div className={styles.inspectorBody}>{activeNode.diagnosticCriteria}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🛠️ Guideline-Directed Management</div>
            <div className={styles.inspectorBody}>{activeNode.dermatologicManagement}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 Fitzpatrick / Bolognia High-Yield Pearl</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearl}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("psoriasis")}
          className={`${styles.modeTab} ${activeMode === "psoriasis" ? styles.modeTabActive : ""}`}
        >
          🧴 1. Psoriasis &amp; Auspitz
        </button>
        <button
          onClick={() => setActiveMode("bullous")}
          className={`${styles.modeTab} ${activeMode === "bullous" ? styles.modeTabActive : ""}`}
        >
          🫧 2. Bullous &amp; Nikolsky
        </button>
        <button
          onClick={() => setActiveMode("melanoma")}
          className={`${styles.modeTab} ${activeMode === "melanoma" ? styles.modeTabActive : ""}`}
        >
          ☀️ 3. Melanoma &amp; Breslow
        </button>
        <button
          onClick={() => setActiveMode("drugReactions")}
          className={`${styles.modeTab} ${activeMode === "drugReactions" ? styles.modeTabActive : ""}`}
        >
          ⚠️ 4. SJS / TEN &amp; SCORTEN
        </button>
      </div>
    </div>
  );
}
