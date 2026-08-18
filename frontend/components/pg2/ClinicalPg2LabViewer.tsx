"use client";

import React, { useState, useMemo } from "react";
import styles from "./ClinicalPg2LabViewer.module.css";
import {
  Sparkles,
  Layers,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Maximize2,
  Minimize2,
  ShieldAlert,
  Search,
  Flame,
  Calculator,
  TrendingUp,
  Gauge,
  Thermometer,
  Shield,
  Crosshair,
  Pill,
  Brain,
  Award,
  Dna,
  HeartPulse,
  Radio,
  TestTube,
  UserCheck,
  Users,
  Activity,
  ClipboardList,
  Wind,
  Zap,
  GraduationCap,
  FileCheck,
} from "lucide-react";

export type Pg2LabMode = "mcs" | "rpgn" | "neuro" | "biologics";

export interface Pg2LabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  proceduralProfile: string;
  proceduralMechanism: string;
  clinicalHallmarks: string;
  highYieldPearls: string;
}

export const PG2_LAB_NODES: Record<Pg2LabMode, Pg2LabNode[]> = {
  mcs: [
    {
      id: "pg2-mc-iabp-timing-hemodynamics",
      name: "Intra-Aortic Balloon Pump (IABP) Physiological Timing (Dicrotic Notch Inflation, Presystolic Deflation & Timing Errors)",
      category: "IABP Counterpulsation",
      subType: "Diastolic Augmentation at Dicrotic Notch &bull; Presystolic Deflation (Pre-R wave) &bull; Late Deflation Worst Error",
      proceduralProfile: "Pulsatile mechanical counterpulsation reducing afterload and augmenting coronary artery blood flow.",
      proceduralMechanism: "Rapid inflation at dicrotic notch drives coronary perfusion; presystolic deflation creates a vacuum, decreasing LV stroke work.",
      clinicalHallmarks: "Late deflation causes LV to eject against an inflated balloon (worst error); early deflation provides suboptimal afterload reduction.",
      highYieldPearls: "IABP inflates at the dicrotic notch to augment coronary flow; late deflation is the worst error as it increases LV afterload."
    },
    {
      id: "pg2-mc-impella-transvalvular-unloading",
      name: "Impella Microaxial Transvalvular LV Unloading Pump (Direct Active Venting, LVEDP Reduction & Forward Output 3.5-5.5 L/m)",
      category: "Impella Microaxial",
      subType: "Aortic Valve Crossing &bull; Active LV Aspiration &bull; Forward Flow 3.5-5.5 L/min &bull; Profound LVEDP / PCWP Reduction",
      proceduralProfile: "Continuous microaxial transvalvular pump delivering non-pulsatile forward flow from LV directly into ascending aorta.",
      proceduralMechanism: "Directly unloads left ventricle volume and pressure, reducing myocardial oxygen demand (MVO2) and wall stress.",
      clinicalHallmarks: "Proven in DanGer Shock to reduce 6-month mortality in STEMI cardiogenic shock; requires tracking plasma free hemoglobin for hemolysis.",
      highYieldPearls: "Impella actively unloads the LV and reduces PCWP/LVEDP, providing 3.5-5.5 L/min forward flow across the aortic valve."
    },
    {
      id: "pg2-mc-ecpella-dual-configuration",
      name: "The ECPELLA Dual Mechanical Configuration (VA-ECMO Retrograde Afterload Unloading & Pulmonary Edema Prevention)",
      category: "ECPELLA Rescue",
      subType: "VA-ECMO + Impella &bull; Relieves Retrograde Afterload Obstruction &bull; Prevents Stasis, Thrombosis & Flash Pulmonary Edema",
      proceduralProfile: "Synergistic mechanical life support combining VA-ECMO total systemic support with Impella left ventricular venting.",
      proceduralMechanism: "VA-ECMO provides full oxygenation and perfusion while Impella actively prevents retrograde-induced LV distension.",
      clinicalHallmarks: "Indicated when VA-ECMO causes aortic valve closure, elevated PCWP >25, and pulmonary edema; decompresses LV and prevents thrombus.",
      highYieldPearls: "ECPELLA combines VA-ECMO with Impella to vent the LV, preventing catastrophic afterload distension and pulmonary edema."
    },
    {
      id: "pg2-mc-circulatory-complication-mitigations",
      name: "Mechanical Circulatory Complication Mitigations (Hemolysis Tracking, Purge Fluid Titration & Vascular Limb Ischemia)",
      category: "MCS Complications",
      subType: "Plasma Free Hemoglobin &bull; Dextrose Purge Fluid &bull; Anterograde Distal Perfusion Cannula &bull; Aortic Regurgitation Contraindication",
      proceduralProfile: "Multisystem surveillance preventing vascular, hematologic, and anatomical mechanical device failures.",
      proceduralMechanism: "High shear stress causes mechanical hemolysis; large femoral sheaths cause limb ischemia without anterograde perfusion lines.",
      clinicalHallmarks: "Contraindicated in moderate-to-severe aortic regurgitation and LV thrombus; monitor urine color and lactate dehydrogenase.",
      highYieldPearls: "Severe aortic regurgitation is an absolute contraindication to Impella; monitor plasma free hemoglobin for rotor hemolysis."
    }
  ],

  rpgn: [
    {
      id: "pg2-rp-crescentic-glomerulonephritis-pathology",
      name: "Crescentic Glomerulonephritis Histopathology (>50% Glomerular Crescents, Parietal Cell & Macrophage Proliferation)",
      category: "Crescentic Biopsy",
      subType: "&ge;2 Layers Parietal Cells & Macrophages &bull; Fibrin Leakage Across Ruptured GBM &bull; Bowman's Space Obliteration",
      proceduralProfile: "Renal histopathological hallmark of Rapidly Progressive Glomerulonephritis mandating emergent immunosuppression.",
      proceduralMechanism: "Severe necrotizing glomerular basement membrane ruptures permit fibrin and plasma proteins to trigger epithelial proliferation.",
      clinicalHallmarks: "Presence of crescents in >50% of glomeruli on light microscopy with cellular-to-fibrous transition causing irreversible ESRD.",
      highYieldPearls: "RPGN is defined by >50% glomerular crescents composed of proliferating parietal epithelial cells and macrophages."
    },
    {
      id: "pg2-rp-type-1-anti-gbm-goodpasture",
      name: "Type I Anti-GBM Disease & Goodpasture Syndrome (Linear IgG/C3 Immunofluorescence & Emergency Plasmapheresis)",
      category: "Type I Anti-GBM",
      subType: "Linear IgG & C3 along GBM &bull; Autoantibodies to &alpha;3 NC1 Collagen IV &bull; Plasmapheresis + Pulse Steroids + Cyclophosphamide",
      proceduralProfile: "Autoantibody-mediated RPGN and alveolar hemorrhage syndrome requiring immediate therapeutic plasma exchange.",
      proceduralMechanism: "Autoantibodies bind non-collagenous domain of alpha-3 type IV collagen, activating complement and creating linear immune deposition.",
      clinicalHallmarks: "Linear IgG on immunofluorescence; initiate 14 sessions of plasmapheresis plus IV methylprednisolone and cyclophosphamide immediately.",
      highYieldPearls: "Type I Anti-GBM disease shows linear IgG on IF; treat emergently with daily plasmapheresis, steroids, and cyclophosphamide."
    },
    {
      id: "pg2-rp-type-2-immune-complex-lupus-cryo",
      name: "Type II Immune Complex RPGN & Lupus Nephritis (Granular Immune Deposition, Complement Consumption & Induction)",
      category: "Type II Immune Complex",
      subType: "Granular (\"Lumpy-Bumpy\") IF &bull; Low C3 / C4 &bull; Lupus Nephritis Class IV &bull; Cryoglobulinemic Vasculitis &bull; PSGN",
      proceduralProfile: "Immune complex-driven RPGN accompanied by systemic hypocomplementemia and multi-organ autoimmune disease.",
      proceduralMechanism: "Circulating or in-situ immune complexes deposit in subendothelial/mesangial spaces, triggering complement activation.",
      clinicalHallmarks: "Granular IF with low serum C3/C4; treated with corticosteroids combined with Mycophenolate Mofetil or Cyclophosphamide/Belimumab.",
      highYieldPearls: "Type II RPGN exhibits granular 'lumpy-bumpy' IF and low C3/C4 (Lupus Class IV, Cryoglobulinemia, Post-streptococcal GN)."
    },
    {
      id: "pg2-rp-type-3-pauci-immune-anca-vasculitis",
      name: "Type III Pauci-Immune ANCA Vasculitis (c-ANCA PR3 vs p-ANCA MPO, Negative IF & Rituximab/Avacopan Protocol)",
      category: "Type III Pauci-Immune",
      subType: "Negative / Trace IF &bull; c-ANCA / Anti-PR3 (GPA) &bull; p-ANCA / Anti-MPO (MPA) &bull; Rituximab Induction &bull; Avacopan C5aR1 Antagonist",
      proceduralProfile: "Necrotizing small-vessel vasculitis causing 50% of all RPGN cases, characterized by absent immune complex deposition.",
      proceduralMechanism: "Neutrophil activation by ANCA antibodies releases reactive oxygen species and lytic enzymes, destroying glomerular capillaries.",
      clinicalHallmarks: "Pauci-immune (absent IF); induce remission with Rituximab (375 mg/m2 weekly x 4) plus steroids; Avacopan replaces steroid toxicity.",
      highYieldPearls: "Type III RPGN is pauci-immune (negative IF) with c-ANCA (PR3, GPA) or p-ANCA (MPO, MPA); treat with Rituximab and Avacopan."
    }
  ],

  neuro: [
    {
      id: "pg2-nu-monro-kellie-cpp-physics",
      name: "Monro-Kellie ICP Physics & Cerebral Perfusion Pressure (CPP = MAP - ICP Target 60-70 mmHg & Autoregulation)",
      category: "Monro-Kellie / CPP",
      subType: "Vtotal = Vbrain + Vblood + Vcsf &bull; ICP &gt;20-22 mmHg &bull; Target CPP 60-70 mmHg &bull; Autoregulation Limits",
      proceduralProfile: "Fundamental intracranial dynamics governing cerebral blood flow and intracranial hypertension prevention.",
      proceduralMechanism: "Rigid cranial vault means expansion of one volume component forces expulsion of others or causes precipitous ICP spikes.",
      clinicalHallmarks: "Target CPP 60-70 mmHg; CPP <50 causes cerebral ischemia while CPP >80 causes cerebral hyperperfusion and vasogenic edema.",
      highYieldPearls: "CPP = MAP - ICP (target 60-70 mmHg); maintain ICP <20-22 mmHg to preserve cerebral autoregulation and prevent ischemia."
    },
    {
      id: "pg2-nu-brain-herniation-kernohan-notch",
      name: "Brain Herniation Syndromes & False-Localizing Signs (Uncal Herniation Blown Pupil, Kernohan's Notch & Tonsillar Cushing's)",
      category: "Herniation Syndromes",
      subType: "Uncal (Ipsilateral CN III Blown Pupil) &bull; Kernohan Notch (Ipsilateral Hemiparesis) &bull; Tonsillar (Cushing's Triad)",
      proceduralProfile: "Critical structural shifts of brain parenchyma across rigid dural partitions leading to brainstem compression.",
      proceduralMechanism: "Mass effect forces temporal uncus over tentorium (compressing CN III) or cerebellar tonsils through foramen magnum (compressing medulla).",
      clinicalHallmarks: "Uncal: ipsilateral dilated pupil; Kernohan's notch compresses contralateral peduncle causing ipsilateral hemiparesis; Tonsillar: Cushing's triad.",
      highYieldPearls: "Uncal herniation compresses ipsilateral CN III (blown pupil); Kernohan's notch is a false-localizing ipsilateral hemiparesis."
    },
    {
      id: "pg2-nu-tier-0-1-neuro-icu-protocols",
      name: "Tier 0 & Tier 1 Neuro-ICU Protocol Interventions (30° HOB, EVD Drainage, 3% Hypertonic Saline & 20% Mannitol)",
      category: "Tier 0/1 ICP Protocol",
      subType: "Head of Bed 30° Midline &bull; EVD Drainage 5-10 mL/h &bull; Hypertonic Saline 3% (Na 145-155) &bull; Mannitol 20% (Osm &lt;320)",
      proceduralProfile: "First-line neurocritical care escalation strategies rapidly lowering elevated ICP while preserving perfusion.",
      proceduralMechanism: "3% saline and 20% mannitol establish an osmotic gradient drawing interstitial water from brain parenchyma across intact BBB.",
      clinicalHallmarks: "Target serum sodium 145-155 mEq/L with 3% saline; maintain serum osmolarity <320 mOsm/kg with mannitol; open EVD for CSF drainage.",
      highYieldPearls: "Tier 1 ICP management uses 3% hypertonic saline (target Na 145-155) or 20% mannitol (target Osm <320) plus EVD CSF drainage."
    },
    {
      id: "pg2-nu-tier-2-3-refractory-icp-protocols",
      name: "Tier 2 & Tier 3 Refractory ICP Rescue Protocols (Barbiturate Coma Burst Suppression, Hypothermia & Decompressive Craniectomy)",
      category: "Tier 2/3 Refractory",
      subType: "Mild Hyperventilation Bridge (PaCO2 30-35) &bull; Pentobarbital Burst Suppression &bull; Decompressive Craniectomy",
      proceduralProfile: "Advanced rescue protocols for medically refractory intracranial hypertension failing osmotic therapies.",
      proceduralMechanism: "Barbiturates induce profound metabolic suppression; decompressive craniectomy converts a closed vault into an open system.",
      clinicalHallmarks: "Titrate pentobarbital to continuous EEG burst suppression (1-2 bursts/page); perform urgent hemicraniectomy with duraplasty.",
      highYieldPearls: "Tier 3 refractory ICP requires barbiturate coma titrated to EEG burst suppression or emergent decompressive craniectomy."
    }
  ],

  biologics: [
    {
      id: "pg2-bg-rituximab-anti-cd20-hbv-screening",
      name: "Rituximab Anti-CD20 B-Cell Lysis & Hepatitis B Reactivation (Pre-Treatment HBV Serology & Entecavir Prophylaxis)",
      category: "Rituximab Anti-CD20",
      subType: "B-Cell Depletion via ADCC & CDC &bull; ANCA Vasculitis &bull; Lupus Nephritis &bull; Mandatory HBsAg & anti-HBc Screening",
      proceduralProfile: "Chimeric monoclonal antibody targeting CD20 on pre-B and mature B lymphocytes, sparing plasma cells.",
      proceduralMechanism: "Induces rapid B-cell depletion, terminating pathogenic autoantibody production and antigen presentation.",
      clinicalHallmarks: "Screen for Hepatitis B (HBsAg, anti-HBc) prior to initiation; initiate Entecavir prophylaxis in positive patients to prevent fulminant hepatitis.",
      highYieldPearls: "Rituximab mandates pre-treatment Hepatitis B screening (HBsAg and anti-HBc) due to high risk of fatal HBV reactivation."
    },
    {
      id: "pg2-bg-eculizumab-anti-c5-meningococcal-vaccine",
      name: "Eculizumab Anti-C5 Terminal Complement Inhibition (aHUS Microangiopathy Rescue & Mandatory Meningococcal Vaccination)",
      category: "Eculizumab Anti-C5",
      subType: "Blocks C5 Cleavage & C5b-9 MAC Assembly &bull; aHUS & PNH &bull; Mandatory MenACWY + MenB Vaccines + Oral Antibiotic Prophylaxis",
      proceduralProfile: "Humanized monoclonal antibody targeting C5 complement protein, halting alternative pathway thrombotic microangiopathy.",
      proceduralMechanism: "Prevents terminal complement cascade activation and MAC-mediated endothelial destruction in aHUS and RBC lysis in PNH.",
      clinicalHallmarks: "Black box warning for life-threatening Neisseria meningitidis sepsis (>1,000x risk); administer MenACWY and MenB plus prophylactic penicillin.",
      highYieldPearls: "Eculizumab blocks C5b-9 MAC assembly; requires mandatory MenACWY and MenB vaccination plus daily antibiotic prophylaxis."
    },
    {
      id: "pg2-bg-tocilizumab-anti-il6-receptor",
      name: "Tocilizumab Anti-IL-6 Receptor Antagonism (Giant Cell Arteritis, CAR-T CRS & Artificial CRP/ESR Suppression)",
      category: "Tocilizumab Anti-IL6R",
      subType: "Inhibits Soluble & Membrane IL-6R &bull; Giant Cell Arteritis (GCA) &bull; CAR-T Cytokine Release Syndrome &bull; CRP Suppression",
      proceduralProfile: "Humanized antibody neutralizing IL-6 receptor signaling, halting acute phase reactant production and vascular inflammation.",
      proceduralMechanism: "Blocks IL-6-driven hepatic synthesis of CRP and fibrinogen; prevents transmural arterial destruction in large-vessel vasculitis.",
      clinicalHallmarks: "Artificially normalizes CRP and ESR within hours of infusion (cannot use CRP to detect infection); indicated for steroid-sparing in GCA.",
      highYieldPearls: "Tocilizumab is first-line biologic for Giant Cell Arteritis and CAR-T CRS; artificially suppresses CRP to zero regardless of infection."
    },
    {
      id: "pg2-bg-anakinra-recombinant-il1-antagonist",
      name: "Anakinra Recombinant IL-1 Receptor Antagonist (Macrophage Activation Syndrome & Hyperferritinemic Crisis Rescue)",
      category: "Anakinra Anti-IL1",
      subType: "IL-1Ra Neutralizes IL-1&alpha; & IL-1&beta; &bull; Macrophage Activation Syndrome (MAS / sHLH) &bull; Ferritin &gt;10,000 ng/mL Rescue",
      proceduralProfile: "Short-acting recombinant human IL-1 receptor antagonist providing titratable blockade of macrophage hyperinflammation.",
      proceduralMechanism: "Competitively binds IL-1 type I receptor, preventing IL-1-mediated cytokine storm, hemophagocytosis, and multi-organ necrosis.",
      clinicalHallmarks: "Administer high-dose IV Anakinra (1-2 mg/kg Q6H) for MAS/secondary HLH with extreme ferritin elevation and pancytopenia.",
      highYieldPearls: "Anakinra is the drug of choice for Macrophage Activation Syndrome (MAS / sHLH) with ferritin >10,000 ng/mL and cytokine storm."
    }
  ]
};

interface ClinicalPg2LabViewerProps {
  initialMode?: Pg2LabMode;
  height?: string;
  onNodeSelect?: (node: Pg2LabNode) => void;
}

export default function ClinicalPg2LabViewer({
  initialMode = "mcs",
  height = "560px",
  onNodeSelect,
}: ClinicalPg2LabViewerProps) {
  const [activeMode, setActiveMode] = useState<Pg2LabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const currentNodes = useMemo(() => {
    return PG2_LAB_NODES[activeMode] || PG2_LAB_NODES.mcs;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: Pg2LabNode) => {
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
            <Sparkles size={14} /> PG-602
          </span>
          <span className={styles.titleText}>
            {activeMode === "mcs" && "Advanced Mechanical Circulatory Support: IABP Timing, Impella LV Unloading & ECPELLA"}
            {activeMode === "rpgn" && "Rapidly Progressive Glomerulonephritis: Biopsy Crescents, Immunofluorescence & ANCA"}
            {activeMode === "neuro" && "Neuro-ICU Tiered ICP Protocols: Monro-Kellie Physics, CPP Targets & Brain Herniations"}
            {activeMode === "biologics" && "Targeted Biologic Immunomodulation: Rituximab, Eculizumab, Tocilizumab & Cytokines"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Subspecialty Consult Quiz"}
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
                  Fellowship Consult Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Subspecialty Protocol: {quizTargetNode.clinicalHallmarks}
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

          {/* Mode 1: MCS */}
          {activeMode === "mcs" && (
            <div className={styles.proceduralCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <HeartPulse size={14} /> Advanced Mechanical Circulatory Support
                </span>
                <span className="text-[11px] text-slate-400">IABP Timing &bull; Impella Microaxial Unloading &bull; ECPELLA LV Venting &bull; Hemolysis</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">IABP Physiological Timing &amp; Errors</div>
                  <div className="text-slate-300 mt-1">Inflates at Dicrotic Notch to augment coronary perfusion; deflates presystolically before R-wave to reduce afterload. Late deflation is the worst error (forces LV to eject against inflated balloon).</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">Impella &amp; ECPELLA LV Unloading</div>
                  <div className="text-slate-300 mt-1">Impella provides 3.5-5.5 L/min forward flow across aortic valve, directly reducing LVEDP and PCWP. ECPELLA vents LV during VA-ECMO to prevent retrograde-induced LV distension and pulmonary edema.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 2: RPGN */}
          {activeMode === "rpgn" && (
            <div className={styles.proceduralCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <TestTube size={14} /> Rapidly Progressive Glomerulonephritis (RPGN)
                </span>
                <span className="text-[11px] text-slate-400">&gt;50% Crescents &bull; Type I Linear IF &bull; Type II Granular IF &bull; Type III Pauci-Immune ANCA</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">RPGN Biopsy &amp; Type I Anti-GBM</div>
                  <div className="text-slate-300 mt-1">&gt;50% glomerular crescents (parietal cells + macrophages). Type I Anti-GBM (Goodpasture): Linear IgG/C3 on IF; treat with immediate 14-session plasmapheresis + pulse steroids + cyclophosphamide.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">Type II &amp; Type III ANCA Vasculitis</div>
                  <div className="text-slate-300 mt-1">Type II: Granular IF (Lupus IV, low C3/C4). Type III: Pauci-immune (negative IF) with c-ANCA/PR3 (GPA) or p-ANCA/MPO (MPA); treat with Rituximab (375 mg/m2/wk x 4) and Avacopan C5aR1 antagonist.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 3: Neuro */}
          {activeMode === "neuro" && (
            <div className={styles.proceduralCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Brain size={14} /> Neuro-ICU Tiered ICP Protocols &amp; Herniation
                </span>
                <span className="text-[11px] text-slate-400">CPP = MAP - ICP (60-70) &bull; Uncal CN III &bull; Kernohan Notch &bull; Tier 1-3 Escalations</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">Monro-Kellie &amp; Brain Herniation</div>
                  <div className="text-slate-300 mt-1">Target CPP 60-70 mmHg, ICP &lt;20-22 mmHg. Uncal herniation compresses ipsilateral CN III (blown pupil); Kernohan's notch causes false-localizing ipsilateral hemiparesis. Tonsillar: Cushing's triad.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">Tiered ICP Escalation Protocol</div>
                  <div className="text-slate-300 mt-1">Tier 1: 3% Hypertonic Saline (Na 145-155) / 20% Mannitol + EVD drainage. Tier 2: Neuromuscular blockade, mild hyperventilation bridge (PaCO2 30-35). Tier 3: Pentobarbital burst suppression, craniectomy.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 4: Biologics */}
          {activeMode === "biologics" && (
            <div className={styles.proceduralCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Pill size={14} /> Targeted Biologics in Autoimmune Crises
                </span>
                <span className="text-[11px] text-slate-400">Rituximab (HBV) &bull; Eculizumab (MenACWY/MenB) &bull; Tocilizumab (GCA) &bull; Anakinra (MAS)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">Rituximab &amp; Eculizumab Mandates</div>
                  <div className="text-slate-300 mt-1">Rituximab (Anti-CD20) mandates HBV screening (HBsAg, anti-HBc) to prevent fatal reactivation. Eculizumab (Anti-C5 in aHUS/PNH) mandates MenACWY + MenB vaccines and prophylactic antibiotics.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">Tocilizumab &amp; Anakinra in Cytokine Storm</div>
                  <div className="text-slate-300 mt-1">Tocilizumab (Anti-IL-6R in GCA/CAR-T CRS) artificially suppresses CRP to zero. Anakinra (IL-1Ra in Macrophage Activation Syndrome / sHLH) halts hyperferritinemic multi-organ cytokine storm.</div>
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
                    <span className="text-indigo-400 font-bold">Protocol:</span> {node.proceduralProfile}
                  </div>

                  <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400">
                    <span>Inspect Consult Protocol</span>
                    <ArrowRight size={12} className="text-slate-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: High-Yield Consult Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              Subspecialty Fellow Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>📋 Clinical Protocol</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🧬 Pathophysiological Mechanism</div>
            <div className="text-xs text-indigo-300 font-semibold">{activeNode.proceduralProfile}</div>
            <div className={styles.inspectorBody}>{activeNode.proceduralMechanism}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>📋 Clinical Hallmarks &amp; Actions</div>
            <div className={styles.inspectorBody}>{activeNode.clinicalHallmarks}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 Gold Standard Consult Pearls</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearls}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("mcs")}
          className={`${styles.modeTab} ${activeMode === "mcs" ? styles.modeTabActive : ""}`}
        >
          🫀 1. MCS: IABP &amp; Impella
        </button>
        <button
          onClick={() => setActiveMode("rpgn")}
          className={`${styles.modeTab} ${activeMode === "rpgn" ? styles.modeTabActive : ""}`}
        >
          🧪 2. RPGN &amp; ANCA Biopsy
        </button>
        <button
          onClick={() => setActiveMode("neuro")}
          className={`${styles.modeTab} ${activeMode === "neuro" ? styles.modeTabActive : ""}`}
        >
          🧠 3. Neuro-ICU &amp; ICP
        </button>
        <button
          onClick={() => setActiveMode("biologics")}
          className={`${styles.modeTab} ${activeMode === "biologics" ? styles.modeTabActive : ""}`}
        >
          💊 4. Targeted Biologics
        </button>
      </div>
    </div>
  );
}
