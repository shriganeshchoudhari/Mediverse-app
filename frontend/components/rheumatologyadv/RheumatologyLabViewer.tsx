"use client";

import React, { useState, useMemo } from "react";
import styles from "./RheumatologyLabViewer.module.css";
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

export type RheumatologyLabMode = "sle" | "ra" | "sclerosis" | "crystals";

export interface RheumatologyLabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  immunopathologyProfile: string;
  pathophysiology: string;
  clinicalHallmarks: string;
  highYieldPearls: string;
}

export const RHEUMATOLOGY_LAB_NODES: Record<RheumatologyLabMode, RheumatologyLabNode[]> = {
  sle: [
    {
      id: "rheum-sle-dsdna-nephritis",
      name: "Anti-dsDNA Lupus Nephritis (Class IV Wire-Loop)",
      category: "Autoantibody & Renal Disease",
      subType: "Anti-dsDNA+ • Titers Correlate with Disease Activity • Class IV Diffuse Proliferative • Wire-Loop Deposits",
      immunopathologyProfile: "Deposition of circulating double-stranded DNA immune complexes in the subendothelial space of glomeruli.",
      pathophysiology: "Complement activation (low C3/C4) recruits neutrophils and macrophages, causing necrotizing crescentic glomerulonephritis.",
      clinicalHallmarks: "Hematuria, heavy proteinuria, hypertension, azotemia; induction with Mycophenolate Mofetil or IV Cyclophosphamide + Steroids.",
      highYieldPearls: "Anti-dsDNA titers rise and serum C3/C4 fall during acute Lupus Nephritis flares; excellent biomarker for monitoring therapy."
    },
    {
      id: "rheum-sle-antiphospholipid",
      name: "Antiphospholipid Syndrome (Prolonged PTT & Thrombosis)",
      category: "Hypercoagulable State",
      subType: "Lupus Anticoagulant • Anti-Beta2-Glycoprotein I • In Vitro High PTT • In Vivo Arterial/Venous Thrombosis",
      immunopathologyProfile: "Antibodies against phospholipid-binding plasma proteins induce platelet aggregation and endothelial activation.",
      pathophysiology: "In vitro binding to reagent phospholipids prolongs the PTT (fails 1:1 mixing study), but in vivo triggers severe thrombosis.",
      clinicalHallmarks: "Recurrent DVTs, pulmonary emboli, ischemic strokes, and recurrent miscarriages (<10 weeks); lifelong Warfarin anticoagulation.",
      highYieldPearls: "The PTT Paradox: PTT is prolonged in vitro, but patient suffers life-threatening hypercoagulable thrombosis in vivo."
    },
    {
      id: "rheum-sle-anti-smith",
      name: "Anti-Smith Autoantibody (snRNP Core Specificity)",
      category: "Autoantibody Profile",
      subType: "Targets snRNPs (U1, U2, U4/U6, U5) • Sensitivity 25-30% • Specificity >99% for SLE",
      immunopathologyProfile: "Autoantibodies directed against common core proteins of small nuclear ribonucleoprotein splicing machinery.",
      pathophysiology: "Highly conserved molecular mimicry triggers selective B-cell receptor hypermutation and autoantibody production.",
      clinicalHallmarks: "Diagnostic confirmation of SLE; remains positive indefinitely even during clinical disease remission.",
      highYieldPearls: "Anti-Smith is the MOST SPECIFIC autoantibody for SLE (>99% specificity), whereas ANA is the most SENSITIVE (>95%)."
    },
    {
      id: "rheum-sle-anti-ro-neonatal",
      name: "Anti-Ro / SSA Neonatal Lupus (Complete Heart Block)",
      category: "Transplacental Autoimmunity",
      subType: "Anti-Ro52/Ro60 IgG • Transplacental Transfer • Subacute Cutaneous Lupus • Congenital 3rd-Degree AV Block",
      immunopathologyProfile: "Maternal IgG anti-Ro antibodies cross the placenta and bind fetal cardiac conduction myocytes.",
      pathophysiology: "Immune complex deposition in the fetal AV node induces autoimmune myocarditis and permanent calcific fibrosis.",
      clinicalHallmarks: "Fetal bradycardia (HR 40-60 bpm) at 18-24 weeks gestation; irreversible 3rd-degree heart block requiring neonatal pacemaker.",
      highYieldPearls: "Pregnant mothers with Anti-Ro/SSA require serial fetal echocardiography to detect and treat early conduction inflammation."
    }
  ],

  ra: [
    {
      id: "rheum-ra-synovial-pannus",
      name: "Invasive Synovial Pannus (TNF-alpha & Bone Erosions)",
      category: "Synovial Immunopathology",
      subType: "Synovial Hyperplasia • Granulation Tissue • Secretes TNF-alpha, IL-1, IL-6, MMPs • Marginal Erosions",
      immunopathologyProfile: "CD4+ Th1/Th17 cell-driven synovial microvascular proliferation and fibroblast activation forming an invasive tumor-like pannus.",
      pathophysiology: "Pannus releases matrix metalloproteinases and RANK-ligand, activating osteoclasts to bore marginal bone erosions.",
      clinicalHallmarks: "Symmetrical MCP/PIP swelling, morning stiffness >1 hour, Swan-neck and Boutonnière deformities; DIP joints spared!",
      highYieldPearls: "Pannus destroys articular cartilage and bone; C1-C2 atlantoaxial subluxation requires pre-op cervical X-rays before intubation."
    },
    {
      id: "rheum-ra-anti-ccp-serology",
      name: "Anti-CCP / ACPA Serology (Citrullinated Antigens)",
      category: "Diagnostic Biomarker",
      subType: "Anti-Cyclic Citrullinated Peptide • Peptidylarginine Deiminase (PAD) • Specificity >95% • Erosive Phenotype",
      immunopathologyProfile: "Antibodies against post-translationally citrullinated filaggrin, vimentin, and type II collagen peptides.",
      pathophysiology: "Tobacco smoking and mucosal inflammation activate PAD enzymes, generating citrullinated neoantigens presented via HLA-DRB1.",
      clinicalHallmarks: "Highly predictive of aggressive, rapidly progressive, erosive polyarthritis; superior specificity compared to Rheumatoid Factor.",
      highYieldPearls: "Anti-CCP antibody has >95% specificity for RA and can precede clinical joint inflammation by up to 10 years."
    },
    {
      id: "rheum-ra-methotrexate-dmard",
      name: "Methotrexate DMARD & Biologic Latent TB Protocol",
      category: "Pharmacotherapy Protocol",
      subType: "Anchor DMARD Methotrexate + Daily Folic Acid • Anti-TNF Biologics • Mandatory Pre-TNF IGRA / PPD Screening",
      immunopathologyProfile: "Methotrexate inhibits dihydrofolate reductase and promotes extracellular adenosine release, suppressing synovial inflammation.",
      pathophysiology: "TNF-alpha blockade (Infliximab, Adalimumab) risks massive granuloma breakdown and disseminated tuberculosis reactivation.",
      clinicalHallmarks: "Methotrexate initiated immediately at diagnosis; daily folate prevents stomatitis; IGRA/PPD screening mandatory before anti-TNF.",
      highYieldPearls: "Never start a TNF-alpha inhibitor without first ruling out latent tuberculosis with IGRA or tuberculin skin test!"
    },
    {
      id: "rheum-ra-felty-syndrome",
      name: "Felty Syndrome Triad (RA + Splenomegaly + Neutropenia)",
      category: "Severe RA Extra-Articular Triad",
      subType: "Seropositive Erosive RA • Splenomegaly • Severe Neutropenia (ANC <1500) • Recurrent Pyogenic Infections",
      immunopathologyProfile: "Immune complex-mediated splenic sequestration and autoantibody-driven granulocyte apoptosis.",
      pathophysiology: "Severe peripheral neutrophil destruction predisposes to refractory cutaneous bacterial ulcers and life-threatening sepsis.",
      clinicalHallmarks: "Longstanding deforming RA, palpable splenomegaly, recurrent leg ulcers, severe neutropenia; treated with Methotrexate and G-CSF.",
      highYieldPearls: "Triad of Rheumatoid Arthritis + Splenomegaly + Neutropenia = Felty Syndrome."
    }
  ],

  sclerosis: [
    {
      id: "rheum-scl-crest-limited",
      name: "CREST Syndrome (Anti-Centromere & Isolated PAH)",
      category: "Limited Cutaneous SSc",
      subType: "Calcinosis • Raynaud • Esophagus • Sclerodactyly • Telangiectasia • Anti-Centromere+ • Pulmonary Hypertension",
      immunopathologyProfile: "Microvascular endothelial damage with localized collagen deposition restricted to hands, face, and distal forearms.",
      pathophysiology: "Proliferative obliterative pulmonary arteriopathy leads to isolated precapillary Pulmonary Arterial Hypertension (PAH).",
      clinicalHallmarks: "Subcutaneous calcinosis nodules, severe acid reflux/dysphagia, telangiectasias, exertional dyspnea with loud P2; ACA+ (80%).",
      highYieldPearls: "Limited SSc is associated with Anti-Centromere antibodies and isolated PAH without severe pulmonary fibrosis."
    },
    {
      id: "rheum-scl-diffuse-scl70",
      name: "Diffuse Cutaneous SSc (Anti-Scl-70 & Pulmonary Fibrosis)",
      category: "Diffuse Cutaneous SSc",
      subType: "Proximal Skin Thickening • Anti-Scl-70 (Topoisomerase I+) • Interstitial Lung Disease • Scleroderma Renal Crisis",
      immunopathologyProfile: "Extensive platelet-derived growth factor (PDGF) and TGF-beta overproduction driving systemic myofibroblast activation.",
      pathophysiology: "Widespread fibrotic replacement of alveolar interstitium and visceral organs with early mortality.",
      clinicalHallmarks: "Rapidly progressive skin tightness proximal to elbows and knees, bibasilar dry crackles, restrictive PFTs; Anti-Scl-70+.",
      highYieldPearls: "Diffuse SSc is associated with Anti-Scl-70 (anti-topoisomerase I) antibodies and severe Interstitial Lung Disease (pulmonary fibrosis)."
    },
    {
      id: "rheum-scl-renal-crisis",
      name: "Scleroderma Renal Crisis (Malignant HTN & Captopril)",
      category: "Vascular Emergency",
      subType: "Anti-RNA Polymerase III • Malignant Hypertension • Oliguric AKI • MAHA Schistocytes • Drug of Choice: ACEi",
      immunopathologyProfile: "Onion-skin hyperplastic arteriolosclerosis of renal interlobular arteries causing acute cortical ischemia.",
      pathophysiology: "Intrarenal ischemia triggers massive renin hypersecretion, driving malignant hypertension; exacerbated by high-dose steroids.",
      clinicalHallmarks: "BP >200/120 mmHg, headache, encephalopathy, acute renal failure, schistocytes on smear; immediate oral Captopril titration.",
      highYieldPearls: "ACE Inhibitors (Captopril) are life-saving in Scleroderma Renal Crisis; Corticosteroids are strictly CONTRAINDICATED."
    },
    {
      id: "rheum-scl-raynaud-vasospasm",
      name: "Raynaud Vasospasm (Triphasic Ischemia & CCBs)",
      category: "Microvascular Vasospasm",
      subType: "White (Pallor) -> Blue (Cyanosis) -> Red (Hyperemia) • Cold/Stress Trigger • Dihydropyridine CCBs",
      immunopathologyProfile: "Hyperreactivity of digital alpha-2 adrenergic receptors combined with endothelial nitric oxide deficiency.",
      pathophysiology: "Reversible intense vasoconstriction of digital arteries followed by deoxygenation and reactive hyperemic reperfusion.",
      clinicalHallmarks: "Painful, cold-induced blanching of digits; treated with avoidance of cold, smoking cessation, and oral Nifedipine/Amlodipine.",
      highYieldPearls: "Secondary Raynaud in scleroderma has abnormal nailfold capillaroscopy (dilated loops and dropouts) and risk of digital ulcers."
    }
  ],

  crystals: [
    {
      id: "rheum-cryst-gout-msu",
      name: "Monosodium Urate Gout (Needle Negative Birefringence)",
      category: "Urate Microcrystalline Arthritis",
      subType: "MSU Crystals • Needle-Shaped • Strongly Negatively Birefringent (Yellow Parallel) • 1st MTP Podagra",
      immunopathologyProfile: "Precipitation of monosodium urate crystals in supersaturated synovial fluid (serum uric acid >6.8 mg/dL).",
      pathophysiology: "Crystals activate the NLRP3 inflammasome in macrophages, releasing massive bursts of active Interleukin-1beta (IL-1beta).",
      clinicalHallmarks: "Excruciating acute nocturnal pain, erythema, and swelling of 1st MTP joint (Podagra); tophi; NSAIDs/Colchicine -> Allopurinol.",
      highYieldPearls: "Polarized microscopy shows bright needle-shaped crystals with NEGATIVE birefringence (YELLOW when parallel to compensator axis)."
    },
    {
      id: "rheum-cryst-pseudogout-cppd",
      name: "CPPD Pseudogout (Rhomboid Positive Birefringence)",
      category: "Pyrophosphate Arthropathy",
      subType: "Calcium Pyrophosphate Dihydrate • Rhomboid-Shaped • Weakly Positively Birefringent (Blue Parallel) • Chondrocalcinosis",
      immunopathologyProfile: "Overproduction of extracellular inorganic pyrophosphate by articular chondrocytes forming CPPD crystal deposits.",
      pathophysiology: "Crystal shed into synovial fluid triggers neutrophil recruitment and acute monoarticular or oligoarticular synovitis.",
      clinicalHallmarks: "Acute inflammatory arthritis of the knee (50%) or wrist in an elderly patient; linear chondrocalcinosis on radiographs; Hemochromatosis link.",
      highYieldPearls: "Rhomboid-shaped crystals with WEAK POSITIVE birefringence (BLUE when parallel to compensator axis) + Chondrocalcinosis = Pseudogout."
    },
    {
      id: "rheum-cryst-ankylosing-spondylitis",
      name: "Ankylosing Spondylitis (HLA-B27 & Bamboo Spine)",
      category: "Axial Spondyloarthritis",
      subType: "HLA-B27 (90%) • Inflammatory Back Pain Improves with Exercise • Symmetrical Sacroiliitis • Bamboo Spine",
      immunopathologyProfile: "Misfolding of HLA-B27 heavy chains and IL-23/IL-17 axis activation driving entheseal fibrocartilage ossification.",
      pathophysiology: "Chronic enthesitis at annulus fibrosus insertions undergoes progressive syndesmophyte bridging and ankylosis.",
      clinicalHallmarks: "Young male with chronic morning back stiffness improving with exercise; restrictive chest expansion; NSAIDs + anti-TNF.",
      highYieldPearls: "Radiographic 'Bamboo Spine' with continuous syndesmophytes; inflammatory back pain IMPROVES with exercise (worsens with rest)."
    },
    {
      id: "rheum-cryst-giant-cell-arteritis",
      name: "Giant Cell Arteritis Emergency (Steroids Before Biopsy!)",
      category: "Large Vessel Granulomatous Vasculitis",
      subType: "Age >50 • Jaw Claudication • Scalp Tenderness • ESR >100 mm/h • Immediate High-Dose Corticosteroids",
      immunopathologyProfile: "Dendritic cell activation in arterial adventitia recruits CD4+ T cells and macrophages, forming multinucleated giant cells.",
      pathophysiology: "Granulomatous internal elastic lamina disruption and intimal hyperplasia occlude posterior ciliary and temporal branches.",
      clinicalHallmarks: "Throbbing headache, jaw claudication, amaurosis fugax, risk of irreversible anterior ischemic optic neuropathy blindness.",
      highYieldPearls: "NEVER delay high-dose Corticosteroids for temporal artery biopsy or imaging when Giant Cell Arteritis is suspected!"
    }
  ]
};

interface RheumatologyLabViewerProps {
  initialMode?: RheumatologyLabMode;
  height?: string;
  onNodeSelect?: (node: RheumatologyLabNode) => void;
}

export default function RheumatologyLabViewer({
  initialMode = "sle",
  height = "560px",
  onNodeSelect,
}: RheumatologyLabViewerProps) {
  const [activeMode, setActiveMode] = useState<RheumatologyLabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // SLE Selector State
  const [selectedSle, setSelectedSle] = useState<"dsdna" | "aps" | "smith" | "ro">("dsdna");

  // Crystals Profiler State
  const [selectedCryst, setSelectedCryst] = useState<"gout" | "cppd" | "as" | "gca">("gout");

  const sleDetails = useMemo(() => {
    if (selectedSle === "dsdna") {
      return {
        title: "Anti-dsDNA Lupus Nephritis (Class IV)",
        profile: "Double-Stranded DNA Autoantibodies • Correlates with Renal Activity • Wire-Loop Glomerulonephritis",
        rx: "Induction with High-Dose Corticosteroids + Mycophenolate Mofetil or IV Cyclophosphamide",
        pearl: "Rising anti-dsDNA and falling C3/C4 levels predict an imminent lupus nephritis flare."
      };
    } else if (selectedSle === "aps") {
      return {
        title: "Antiphospholipid Syndrome (The PTT Paradox)",
        profile: "Lupus Anticoagulant • Anticardiolipin • Prolonged PTT In Vitro • Severe Thrombosis In Vivo",
        rx: "Lifelong oral anticoagulation (Warfarin, target INR 2.0-3.0) for confirmed thrombotic events",
        pearl: "PTT fails to correct on 1:1 mixing study; in vivo promotes venous/arterial thrombosis and fetal loss."
      };
    } else if (selectedSle === "smith") {
      return {
        title: "Anti-Smith Autoantibody (snRNP Core)",
        profile: "Targets Splicing snRNPs • Specificity >99% for SLE • Remains Positive in Remission",
        rx: "Standard SLE maintenance with Hydroxychloroquine (reduces flare frequency and mortality)",
        pearl: "Most specific autoantibody for SLE; does not fluctuate with disease activity."
      };
    } else {
      return {
        title: "Anti-Ro / SSA & Neonatal Lupus",
        profile: "Transplacental Transfer of Maternal Anti-Ro IgG • Subacute Cutaneous Lupus • Congenital Complete Heart Block",
        rx: "Serial fetal echocardiography from 16-26 weeks gestation; permanent neonatal pacemaker if complete block",
        pearl: "Congenital complete AV block is irreversible once formed; caused by maternal anti-Ro52/Ro60."
      };
    }
  }, [selectedSle]);

  const crystDetails = useMemo(() => {
    if (selectedCryst === "gout") {
      return {
        title: "Monosodium Urate (MSU) Gout",
        indices: "Needle-Shaped • Strongly Negatively Birefringent (Yellow Parallel to Axis) • 1st MTP Podagra",
        rx: "Acute: NSAIDs (Indomethacin), Colchicine, Corticosteroids. Chronic: Allopurinol / Febuxostat.",
        pearl: "NLRP3 inflammasome activation releases IL-1beta; yellow under parallel polarized light."
      };
    } else if (selectedCryst === "cppd") {
      return {
        title: "CPPD Pseudogout (Chondrocalcinosis)",
        indices: "Rhomboid-Shaped • Weakly Positively Birefringent (Blue Parallel to Axis) • Knee Joint (50%)",
        rx: "Intra-articular steroid injection, oral NSAIDs, Colchicine; screen for Hemochromatosis/Hyperparathyroidism",
        pearl: "Linear calcification of articular cartilage (Chondrocalcinosis) on radiographs; blue when parallel."
      };
    } else if (selectedCryst === "as") {
      return {
        title: "Ankylosing Spondylitis (HLA-B27)",
        indices: "Inflammatory Back Pain Improves with Exercise • Symmetrical Sacroiliitis • 'Bamboo Spine'",
        rx: "First-line NSAIDs + Physiotherapy; Second-line TNF-alpha inhibitors (Infliximab/Adalimumab)",
        pearl: "Enthesitis at tendon insertions; rigid chest wall causes restrictive pulmonary defect."
      };
    } else {
      return {
        title: "Giant Cell (Temporal) Arteritis Emergency",
        indices: "Age >50 • Jaw Claudication • Scalp Tenderness • ESR >100 mm/h • Risk of AION Blindness",
        rx: "IMMEDIATE High-Dose Systemic Corticosteroids (Prednisone 60 mg/day or IV Methylprednisolone) BEFORE Biopsy!",
        pearl: "Never withhold or delay corticosteroids while waiting for a temporal artery biopsy in suspected GCA."
      };
    }
  }, [selectedCryst]);

  const currentNodes = useMemo(() => {
    return RHEUMATOLOGY_LAB_NODES[activeMode] || RHEUMATOLOGY_LAB_NODES.sle;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: RheumatologyLabNode) => {
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
            <Shield size={14} /> RHEUM-301
          </span>
          <span className={styles.titleText}>
            {activeMode === "sle" && "Systemic Lupus Erythematosus (SLE), Lupus Nephritis & Antiphospholipid Syndrome"}
            {activeMode === "ra" && "Rheumatoid Arthritis: Synovial Pannus, Anti-CCP (ACPA) & Methotrexate"}
            {activeMode === "sclerosis" && "Systemic Sclerosis (Scleroderma), Scleroderma Renal Crisis & Raynaud"}
            {activeMode === "crystals" && "Spondyloarthropathies, Crystal Arthropathies (Gout vs CPPD) & GCA"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Rheumatology Diagnostic Quiz"}
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
                  Rheumatology Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Autoimmune / Rheumatic Disorder: {quizTargetNode.clinicalHallmarks}
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

          {/* Mode 1: SLE & Lupus Nephritis */}
          {activeMode === "sle" && (
            <div className={styles.rheumCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={14} /> SLE Autoantibody &amp; Lupus Nephritis Profiler
                </span>
                <span className="text-[11px] text-slate-400">Anti-dsDNA &bull; Anti-Smith &bull; aPL &bull; Anti-Ro</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => setSelectedSle("dsdna")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedSle === "dsdna"
                      ? "bg-rose-600 text-white border-rose-400"
                      : "bg-indigo-950 text-slate-300 border-indigo-800"
                  }`}
                >
                  🧬 Anti-dsDNA (Renal)
                </button>
                <button
                  onClick={() => setSelectedSle("aps")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedSle === "aps"
                      ? "bg-rose-600 text-white border-rose-400"
                      : "bg-indigo-950 text-slate-300 border-indigo-800"
                  }`}
                >
                  🩸 Antiphospholipid (aPL)
                </button>
                <button
                  onClick={() => setSelectedSle("smith")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedSle === "smith"
                      ? "bg-rose-600 text-white border-rose-400"
                      : "bg-indigo-950 text-slate-300 border-indigo-800"
                  }`}
                >
                  🎯 Anti-Smith (Specific)
                </button>
                <button
                  onClick={() => setSelectedSle("ro")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedSle === "ro"
                      ? "bg-rose-600 text-white border-rose-400"
                      : "bg-indigo-950 text-slate-300 border-indigo-800"
                  }`}
                >
                  👶 Anti-Ro (Heart Block)
                </button>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                <div className="text-sm font-bold text-rose-300">{sleDetails.title}</div>
                <div className="text-emerald-400 font-bold mt-1">{sleDetails.profile}</div>
                <div className="text-slate-300 mt-1"><strong className="text-rose-400">Therapeutic Strategy:</strong> {sleDetails.rx}</div>
                <div className="text-yellow-300 font-semibold mt-1"><strong className="text-yellow-400">High-Yield Pearl:</strong> {sleDetails.pearl}</div>
              </div>
            </div>
          )}

          {/* Mode 2: Rheumatoid Arthritis */}
          {activeMode === "ra" && (
            <div className={styles.rheumCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Flame size={14} /> Rheumatoid Arthritis Synovial Immunopathology
                </span>
                <span className="text-[11px] text-slate-400">Invasive Pannus &bull; Anti-CCP &bull; Methotrexate &bull; Felty</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-rose-300 font-bold">Invasive Synovial Pannus &amp; Anti-CCP</div>
                  <div className="text-slate-300 mt-1">Granulation tissue secreting TNF-alpha, IL-1, and MMPs causes marginal bone erosions. Symmetrical MCP/PIP polyarthritis with morning stiffness &gt;1h (DIP joints strictly spared). Anti-CCP antibody has &gt;95% specificity.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-rose-300 font-bold">DMARDs &amp; Latent TB Protocol</div>
                  <div className="text-slate-300 mt-1">Methotrexate is the first-line anchor DMARD (co-prescribe daily Folic Acid). Biologic TNF-alpha inhibitors (Infliximab, Adalimumab) require mandatory pre-treatment screening for Latent Tuberculosis with IGRA/PPD.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 3: Systemic Sclerosis & Renal Crisis */}
          {activeMode === "sclerosis" && (
            <div className={styles.rheumCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield size={14} /> Systemic Sclerosis &amp; Renal Crisis Emergency
                </span>
                <span className="text-[11px] text-slate-400">CREST (ACA+) vs Diffuse (Anti-Scl-70+) &bull; Captopril Protocol</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-rose-300 font-bold">CREST vs Diffuse Cutaneous SSc</div>
                  <div className="text-slate-300 mt-1">CREST (Calcinosis, Raynaud, Esophagus, Sclerodactyly, Telangiectasia) has Anti-Centromere+ and isolated PAH. Diffuse SSc has Anti-Scl-70+ (topoisomerase I), Interstitial Lung Disease (fibrosis), and Scleroderma Renal Crisis.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-rose-300 font-bold">Scleroderma Renal Crisis Protocol</div>
                  <div className="text-slate-300 mt-1">Malignant hypertension and oliguric renal failure with anti-RNA Polymerase III. Drug of choice is immediate oral ACE Inhibitors (Captopril). Corticosteroids are strictly CONTRAINDICATED as they precipitate crisis!</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 4: Crystals, SpA & GCA */}
          {activeMode === "crystals" && (
            <div className={styles.rheumCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap size={14} /> Crystal Arthropathies, Ankylosing Spondylitis &amp; GCA
                </span>
                <span className="text-[11px] text-slate-400">Gout (Negative) vs CPPD (Positive) &bull; HLA-B27 &bull; Temporal Arteritis</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => setSelectedCryst("gout")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedCryst === "gout"
                      ? "bg-rose-600 text-white border-rose-400"
                      : "bg-indigo-950 text-slate-300 border-indigo-800"
                  }`}
                >
                  🦶 Gout (MSU Yellow)
                </button>
                <button
                  onClick={() => setSelectedCryst("cppd")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedCryst === "cppd"
                      ? "bg-rose-600 text-white border-rose-400"
                      : "bg-indigo-950 text-slate-300 border-indigo-800"
                  }`}
                >
                  💎 CPPD (Blue Rhomboid)
                </button>
                <button
                  onClick={() => setSelectedCryst("as")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedCryst === "as"
                      ? "bg-rose-600 text-white border-rose-400"
                      : "bg-indigo-950 text-slate-300 border-indigo-800"
                  }`}
                >
                  🎋 Bamboo Spine (AS)
                </button>
                <button
                  onClick={() => setSelectedCryst("gca")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedCryst === "gca"
                      ? "bg-rose-600 text-white border-rose-400"
                      : "bg-indigo-950 text-slate-300 border-indigo-800"
                  }`}
                >
                  ⚡ Temporal Arteritis (GCA)
                </button>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                <div className="text-sm font-bold text-rose-300">{crystDetails.title}</div>
                <div className="text-emerald-400 font-bold mt-1">{crystDetails.indices}</div>
                <div className="text-slate-300 mt-1"><strong className="text-rose-400">Clinical Protocol:</strong> {crystDetails.rx}</div>
                <div className="text-yellow-300 font-semibold mt-1"><strong className="text-yellow-400">Diagnostic Rule:</strong> {crystDetails.pearl}</div>
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
                    <span className="text-rose-400 font-bold">Immunopathology:</span> {node.immunopathologyProfile}
                  </div>

                  <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400">
                    <span>Inspect profile</span>
                    <ArrowRight size={12} className="text-slate-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: High-Yield Rheumatology Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
              Rheumatology Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🦴 Autoimmune Entity / Syndrome</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🔬 Immunopathology &amp; Biomarkers</div>
            <div className="text-xs text-rose-300 font-semibold">{activeNode.immunopathologyProfile}</div>
            <div className={styles.inspectorBody}>{activeNode.pathophysiology}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🩺 Clinical Hallmarks &amp; Pharmacotherapy</div>
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
          onClick={() => setActiveMode("sle")}
          className={`${styles.modeTab} ${activeMode === "sle" ? styles.modeTabActive : ""}`}
        >
          🩸 1. SLE &amp; aPL
        </button>
        <button
          onClick={() => setActiveMode("ra")}
          className={`${styles.modeTab} ${activeMode === "ra" ? styles.modeTabActive : ""}`}
        >
          🔥 2. Rheumatoid Arthritis
        </button>
        <button
          onClick={() => setActiveMode("sclerosis")}
          className={`${styles.modeTab} ${activeMode === "sclerosis" ? styles.modeTabActive : ""}`}
        >
          🛡️ 3. Scleroderma &amp; SRC
        </button>
        <button
          onClick={() => setActiveMode("crystals")}
          className={`${styles.modeTab} ${activeMode === "crystals" ? styles.modeTabActive : ""}`}
        >
          ⚡ 4. Crystals, SpA &amp; GCA
        </button>
      </div>
    </div>
  );
}
