"use client";

import React, { useState, useMemo } from "react";
import styles from "./ClinicalPharmacologyLabViewer.module.css";
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

export type PharmacologyLabMode = "tdm" | "antimicrobial" | "anticoagulation" | "chemotherapy";

export interface PharmacologyLabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  pharmacologyProfile: string;
  mechanism: string;
  clinicalHallmarks: string;
  highYieldPearls: string;
}

export const PHARMACOLOGY_LAB_NODES: Record<PharmacologyLabMode, PharmacologyLabNode[]> = {
  tdm: [
    {
      id: "pharm-tdm-vancomycin",
      name: "Vancomycin AUC24/MIC Bayesian TDM (Target >=400-600)",
      category: "Glycopeptide TDM",
      subType: "AUC24/MIC >= 400-600 mg*h/L • Reduces AKI Risk vs Static Troughs (15-20 mcg/mL) • D-Ala-D-Ala Cell Wall Target",
      pharmacologyProfile: "Glycopeptide antibiotic inhibiting peptidoglycan synthesis by binding D-Ala-D-Ala terminus of cell wall precursors.",
      mechanism: "Bayesian-derived AUC-guided dosing maintains bactericidal efficacy against MRSA while preventing proximal tubular nephrotoxicity.",
      clinicalHallmarks: "Nephrotoxicity (ATN), ototoxicity, Red Man Syndrome (non-IgE histamine release prevented by slow 60-min infusion).",
      highYieldPearls: "Target Vancomycin AUC24/MIC >= 400-600 is superior to static troughs for maximizing MRSA kill and minimizing renal toxicity."
    },
    {
      id: "pharm-tdm-aminoglycosides",
      name: "Aminoglycoside Extended-Interval Dosing (Peak/MIC & Trough <1)",
      category: "Aminoglycoside TDM",
      subType: "Gentamicin / Tobramycin / Amikacin • High-Dose Once-Daily (5-7 mg/kg) • Cmax/MIC >= 8-10 • Trough < 1 mcg/mL",
      pharmacologyProfile: "Concentration-dependent bactericidal 30S ribosomal inhibitors causing misreading of bacterial mRNA.",
      mechanism: "High once-daily peak maximizes bacterial killing and post-antibiotic effect (PAE); low trough allows renal tubular clearance.",
      clinicalHallmarks: "Acute tubular necrosis (ATN), irreversible vestibular/cochlear ototoxicity, neuromuscular blockade (treat with calcium).",
      highYieldPearls: "Extended-interval once-daily aminoglycoside dosing exploits concentration-dependent killing and minimizes nephro/ototoxicity."
    },
    {
      id: "pharm-tdm-digoxin",
      name: "Digoxin Cardiotoxicity & DigiFab (Na+/K+ ATPase Inhibition)",
      category: "Cardiac Glycoside",
      subType: "Target 0.5-0.9 ng/mL (CHF) • Exacerbated by Hypokalemia & Hypomagnesemia • Digoxin Immune Fab (DigiFab) Antidote",
      pharmacologyProfile: "Inhibits myocardial Na+/K+ ATPase, increasing intracellular Na+ and secondary Ca2+ via NCX exchanger (positive inotropy).",
      mechanism: "Narrow therapeutic index; hypokalemia allows greater digoxin binding to ATPase, triggering life-threatening ventricular ectopy.",
      clinicalHallmarks: "PVCs, bidirectional VT, visual xanthopsia (yellow-green halos), nausea, vomiting, hyperkalemia in acute overdose; DigiFab reversal.",
      highYieldPearls: "Hypokalemia dramatically worsens digoxin toxicity; treat severe digoxin toxicity with Digoxin-specific Fab fragments (DigiFab)."
    },
    {
      id: "pharm-tdm-phenytoin",
      name: "Phenytoin Non-Linear Saturation (Michaelis-Menten Kinetics)",
      category: "Anti-Epileptic Kinetics",
      subType: "Zero-Order Elimination at Therapeutic Levels (10-20 mcg/mL) • CYP2C9 Saturation • Small Dose -> Exponential Surge",
      pharmacologyProfile: "Voltage-gated neuronal fast sodium channel blocker stabilizing inactive channel conformation.",
      mechanism: "Michaelis constant Km (~4 mcg/mL) is exceeded at therapeutic range (10-20 mcg/mL), causing zero-order capacity-limited clearance.",
      clinicalHallmarks: "Horizontal nystagmus (early sign), cerebellar ataxia, slurred speech, lethargy, gingival hyperplasia, hirsutism, DRESS.",
      highYieldPearls: "Phenytoin follows non-linear (Michaelis-Menten) zero-order elimination at therapeutic doses; small dose increases produce toxic surges."
    }
  ],

  antimicrobial: [
    {
      id: "pharm-abx-mrsa-daptomycin",
      name: "MRSA PBP2a & Daptomycin Surfactant Warning (Contraindicated in Pneumonia)",
      category: "Gram-Positive MDR",
      subType: "MRSA mecA Gene encodes PBP2a • Daptomycin Lipopeptide • Bound & Inactivated by Pulmonary Surfactant • Linezolid DOC",
      pharmacologyProfile: "MRSA produces modified penicillin-binding protein PBP2a with low affinity for beta-lactams (except Ceftaroline).",
      mechanism: "Daptomycin inserts into bacterial membranes causing depolarization; however, alveolar pulmonary surfactant binds and inactivates it.",
      clinicalHallmarks: "Daptomycin is excellent for MRSA bacteremia/endocarditis, but NEVER for MRSA pneumonia; use Linezolid or Vancomycin for pneumonia.",
      highYieldPearls: "Daptomycin is inactivated by pulmonary surfactant and is STRICTLY CONTRAINDICATED in the treatment of pneumonia."
    },
    {
      id: "pharm-abx-esbl-carbapenems",
      name: "ESBL Hydrolysis & Carbapenem Sparing (Meropenem & Novel Inhibitors)",
      category: "Gram-Negative MDR",
      subType: "Hydrolyzes 3rd/4th Gen Cephalosporins (Ceftriaxone/Cefepime) • Meropenem Drug of Choice • Ceftolozane-Tazobactam Sparing",
      pharmacologyProfile: "Plasmid-encoded beta-lactamases (TEM, SHV, CTX-M) capable of hydrolyzing extended-spectrum cephalosporins and monobactams.",
      mechanism: "Carbapenems (Meropenem, Imipenem) resist ESBL hydrolysis; novel combinations like Ceftolozane-Tazobactam spare carbapenems.",
      clinicalHallmarks: "E. coli and Klebsiella pneumoniae urinary and intra-abdominal sepsis resistant to ceftriaxone; Meropenem is gold standard.",
      highYieldPearls: "Carbapenems (Meropenem) remain the definitive drugs of choice for severe infections caused by ESBL-producing Enterobacteriaceae."
    },
    {
      id: "pharm-abx-cre-inhibitors",
      name: "CRE Carbapenemase Neutralization (Ceftazidime-Avibactam & Vaborbactam)",
      category: "Carbapenem-Resistant",
      subType: "KPC, NDM-1, OXA-48 Enzymes • Ceftazidime-Avibactam • Meropenem-Vaborbactam • Non-Beta-Lactam Diazabicyclooctane Inhibitors",
      pharmacologyProfile: "Serine and metallo-beta-lactamases capable of hydrolyzing all carbapenems, penicillins, and cephalosporins.",
      mechanism: "Avibactam and Vaborbactam are non-beta-lactam inhibitors that covalently bind and inactivate Class A (KPC) and Class D carbapenemases.",
      clinicalHallmarks: "Pan-resistant Klebsiella bacteremia and ventilator-associated pneumonia; treated with Ceftazidime-Avibactam or Cefiderocol.",
      highYieldPearls: "Ceftazidime-Avibactam and Meropenem-Vaborbactam restore activity against Carbapenem-Resistant Enterobacteriaceae (CRE)."
    },
    {
      id: "pharm-abx-pseudomonas-coverage",
      name: "Pseudomonas Aeruginosa Dual Coverage (Antipseudomonal Beta-Lactam + Fluoroquinolone)",
      category: "Opportunistic Pathogen",
      subType: "Pip-Tazo / Cefepime / Meropenem / Ceftazidime +/- Tobramycin or Ciprofloxacin • Efflux Pumps & Porin Loss",
      pharmacologyProfile: "Gram-negative non-fermenting bacillus with multiple intrinsic resistance mechanisms (AmpC, MexAB efflux, OprD loss).",
      mechanism: "Synergistic dual coverage with antipseudomonal beta-lactam plus aminoglycoside or fluoroquinolone in severe sepsis.",
      clinicalHallmarks: "Ecthyma gangrenosum, ICU ventilator-associated pneumonia, cystic fibrosis exacerbations, hot tub folliculitis, neutropenic fever.",
      highYieldPearls: "Empiric antipseudomonal regimens require agents with proven activity (Piperacillin-Tazobactam, Cefepime, Meropenem, Ceftazidime)."
    }
  ],

  anticoagulation: [
    {
      id: "pharm-ac-idarucizumab-dabigatran",
      name: "Dabigatran Reversal via Idarucizumab (Humanized Fab Decoy 350x Affinity)",
      category: "Direct Thrombin Inhibitor",
      subType: "Idarucizumab (Praxbind, 5g IV) • 350x Higher Affinity for Dabigatran than Thrombin • Immediate Coagulation Normalization",
      pharmacologyProfile: "Direct competitive active-site thrombin (Factor IIa) inhibitor indicated for non-valvular atrial fibrillation and DVT/PE.",
      mechanism: "Idarucizumab is a humanized monoclonal Fab antibody fragment that binds free and bound dabigatran with 350x higher affinity than thrombin.",
      clinicalHallmarks: "Life-threatening intracranial hemorrhage or emergent surgery in dabigatran patients; 5g IV bolus normalizes dTT/ECT in minutes.",
      highYieldPearls: "Idarucizumab (Praxbind) is the specific, instant antidote for the direct thrombin inhibitor Dabigatran."
    },
    {
      id: "pharm-ac-andexanet-fxa",
      name: "Factor Xa Inhibitors & Andexanet Alfa (Decoy Inactive FXa)",
      category: "Factor Xa Inhibitors",
      subType: "Apixaban / Rivaroxaban / Edoxaban • Andexanet Alfa (Andexxa) Recombinant Decoy • 4-Factor PCC (50 U/kg) Alternative",
      pharmacologyProfile: "Direct competitive inhibitors of the active catalytic site of Factor Xa, blocking prothrombinase complex assembly.",
      mechanism: "Andexanet alfa is a recombinant modified decoy Factor Xa protein that binds and sequesters FXa inhibitors out of circulation.",
      clinicalHallmarks: "Acute GI bleed or trauma on Apixaban; Andexanet Alfa IV bolus/infusion or 4-Factor PCC rapidly restores hemostasis.",
      highYieldPearls: "Andexanet alfa is a catalytically inactive recombinant Factor Xa decoy that binds and neutralizes direct FXa inhibitors."
    },
    {
      id: "pharm-ac-warfarin-pcc-vitk",
      name: "Warfarin Urgent Reversal with 4-Factor PCC (Kcentra & IV Vitamin K)",
      category: "VKORC1 Antagonist",
      subType: "Inhibits Factors II, VII, IX, X, Protein C, S • 4-Factor PCC (Kcentra) Rapid INR Normalization (<15 min) + IV Vitamin K (10mg)",
      pharmacologyProfile: "Competitive inhibitor of Vitamin K Epoxide Reductase Complex 1 (VKORC1), blocking gamma-carboxylation of clotting factors.",
      mechanism: "4-Factor PCC provides immediate replacement of factors II, VII, IX, and X; IV Vitamin K stimulates sustained de novo hepatic synthesis.",
      clinicalHallmarks: "Elevated INR with bleeding; 4F-PCC is preferred over FFP because it normalizes INR in minutes without fluid overload (TACO).",
      highYieldPearls: "Always administer IV Vitamin K alongside 4-Factor PCC for Warfarin reversal to sustain factor synthesis after PCC factors decay."
    },
    {
      id: "pharm-ac-protamine-heparin",
      name: "Heparin Neutralization by Protamine Sulfate (Electrostatic Complexation)",
      category: "Heparin Antidote",
      subType: "Protamine Sulfate (1 mg per 100 U UFH) • Strongly Basic Cationic Protein • Incomplete (~60%) Neutralization of LMWH",
      pharmacologyProfile: "Unfractionated heparin activates antithrombin III, accelerating inactivation of thrombin (IIa) and Factor Xa.",
      mechanism: "Protamine is a positively charged basic protein derived from salmon sperm that electrostatically binds negatively charged acidic heparin.",
      clinicalHallmarks: "Post-cardiopulmonary bypass bleeding or heparin overdose; slow IV push to avoid hypotension and anaphylactoid reactions.",
      highYieldPearls: "Protamine sulfate completely reverses unfractionated heparin via electrostatic neutralization, but only partially (~60%) reverses LMWH."
    }
  ],

  chemotherapy: [
    {
      id: "pharm-chemo-doxorubicin-dexrazoxane",
      name: "Anthracycline Cardiotoxicity & Dexrazoxane (Iron Chelation Cardioprotectant)",
      category: "Anthracycline Oncology",
      subType: "Doxorubicin / Daunorubicin • Dose-Dependent Dilated Cardiomyopathy • Dexrazoxane (Zinecard) Iron-Chelating Antidote",
      pharmacologyProfile: "DNA intercalating agent and topoisomerase II-alpha/beta inhibitor generating high levels of intracellular free radicals.",
      mechanism: "Iron-dependent hydroxyl radical formation causes lipid peroxidation of cardiac myocytes; Dexrazoxane chelates intracellular iron.",
      clinicalHallmarks: "Congestive heart failure, decreased ejection fraction; cumulative lifetime dose limited to <=450-550 mg/m2; Dexrazoxane co-administration.",
      highYieldPearls: "Dexrazoxane is an intracellular iron chelator that prevents free radical-mediated dilated cardiomyopathy from Doxorubicin."
    },
    {
      id: "pharm-chemo-cisplatin-amifostine",
      name: "Cisplatin Nephrotoxicity & Amifostine (Proximal Tubular Protection)",
      category: "Platinum Chemotherapy",
      subType: "Cisplatin / Carboplatin • Dose-Limiting ATN Nephrotoxicity & Ototoxicity • Vigorous Saline Hydration + Amifostine Scavenger",
      pharmacologyProfile: "Platinum coordinate complex forming interstrand and intrastrand DNA cross-links, triggering cellular apoptosis.",
      mechanism: "Accumulation in renal proximal tubular epithelial cells causes acute tubular necrosis; Amifostine is a prodrug free radical scavenger.",
      clinicalHallmarks: "Acute kidney injury, hypomagnesemia, sensorineural hearing loss, severe emetogenicity; vigorous pre/post hydration is mandatory.",
      highYieldPearls: "Aggressive IV hydration and Amifostine free radical scavenging are standard to prevent Cisplatin-induced acute tubular necrosis."
    },
    {
      id: "pharm-chemo-cyclophosphamide-mesna",
      name: "Cyclophosphamide Acrolein Bladder Toxicity & Mesna (Thioether Conjugation)",
      category: "Alkylating Agent",
      subType: "Cyclophosphamide / Ifosfamide • Toxic Byproduct ACROLEIN • Hemorrhagic Cystitis • Mesna (Sodium 2-Mercaptoethanesulfonate)",
      pharmacologyProfile: "Nitrogen mustard prodrug activated by hepatic CYP450 into phosphoramide mustard (antineoplastic) and Acrolein (urotoxic).",
      mechanism: "Acrolein concentrates in the bladder causing severe hemorrhagic ulceration; Mesna sulfhydryl (-SH) groups bind and neutralize acrolein.",
      clinicalHallmarks: "Gross hematuria, dysuria, bladder fibrosis; co-administration of Mesna and hyperhydration prevents hemorrhagic cystitis.",
      highYieldPearls: "Mesna (sodium 2-mercaptoethanesulfonate) neutralizes the urotoxic metabolite Acrolein, preventing hemorrhagic cystitis."
    },
    {
      id: "pharm-chemo-methotrexate-leucovorin",
      name: "High-Dose Methotrexate & Leucovorin Rescue (Tetrahydrofolate DHFR Bypass)",
      category: "Antimetabolite",
      subType: "Dihydrofolate Reductase (DHFR) Inhibitor • Leucovorin (Folinic Acid) Rescues Healthy Cells • Glucarpidase for Renal Failure",
      pharmacologyProfile: "Competitive irreversible inhibitor of DHFR, halting synthesis of tetrahydrofolate (THF), thymidylate (dTMP), and purines.",
      mechanism: "Leucovorin (folinic acid) is converted directly to active THF without requiring DHFR, selectively rescuing normal bone marrow and GI cells.",
      clinicalHallmarks: "Myelosuppression, mucositis, acute kidney injury from tubular crystal deposition (treat with urine alkalinization + Glucarpidase).",
      highYieldPearls: "Leucovorin (Folinic Acid) rescue bypasses Dihydrofolate Reductase (DHFR) to rescue normal bone marrow and mucosal cells from MTX."
    }
  ]
};

interface ClinicalPharmacologyLabViewerProps {
  initialMode?: PharmacologyLabMode;
  height?: string;
  onNodeSelect?: (node: PharmacologyLabNode) => void;
}

export default function ClinicalPharmacologyLabViewer({
  initialMode = "tdm",
  height = "560px",
  onNodeSelect,
}: ClinicalPharmacologyLabViewerProps) {
  const [activeMode, setActiveMode] = useState<PharmacologyLabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // TDM Profiler State
  const [selectedTdm, setSelectedTdm] = useState<"vanco" | "amino" | "digoxin" | "phenytoin">("vanco");

  // Reversal Profiler State
  const [selectedReversal, setSelectedReversal] = useState<"dabigatran" | "apixaban" | "warfarin" | "heparin">("dabigatran");

  const tdmDetails = useMemo(() => {
    if (selectedTdm === "vanco") {
      return {
        title: "Vancomycin AUC24/MIC Pharmacokinetic Profiling",
        indices: "Target AUC24/MIC >= 400-600 mg*h/L • Reduces AKI Risk • Peak/Trough Bayesian Monitoring",
        rx: "Dose 15-20 mg/kg IV q8-12h; calculate AUC via 2-point kinetic sampling or Bayesian software",
        pearl: "Targeting AUC24/MIC >= 400-600 achieves optimal MRSA eradication while avoiding nephrotoxicity."
      };
    } else if (selectedTdm === "amino") {
      return {
        title: "Aminoglycoside Extended-Interval Once-Daily Dosing",
        indices: "Cmax/MIC >= 8-10 • Extended Interval (5-7 mg/kg QD) • Target Trough < 1 mcg/mL",
        rx: "Administer high once-daily dose; verify trough concentration 18-24h post-dose to prevent accumulation",
        pearl: "Once-daily aminoglycoside dosing exploits post-antibiotic effect (PAE) and prevents ATN."
      };
    } else if (selectedTdm === "digoxin") {
      return {
        title: "Digoxin Therapeutic Range & Toxicity Management",
        indices: "Target 0.5 - 0.9 ng/mL (CHF) • Exacerbated by Hypokalemia • DigiFab Antidote",
        rx: "Administer Digoxin Immune Fab (DigiFab) for life-threatening arrhythmias or severe hyperkalemia",
        pearl: "Hypokalemia enhances digoxin binding to Na+/K+ ATPase, dramatically increasing arrhythmogenicity."
      };
    } else {
      return {
        title: "Phenytoin Non-Linear Michaelis-Menten Kinetics",
        indices: "Target 10-20 mcg/mL • Hepatic CYP2C9 Saturation • Zero-Order Non-Linear Surge",
        rx: "Increase dose in small increments (25-50 mg/day); monitor for nystagmus, ataxia, and lethargy",
        pearl: "Phenytoin switches from first-order to zero-order elimination at therapeutic concentrations."
      };
    }
  }, [selectedTdm]);

  const reversalDetails = useMemo(() => {
    if (selectedReversal === "dabigatran") {
      return {
        title: "Idarucizumab (Praxbind) for Dabigatran Reversal",
        indices: "Humanized Monoclonal Fab Fragment • 350x Higher Affinity for Dabigatran than Thrombin",
        rx: "Administer Idarucizumab 5 g IV (two consecutive 2.5 g boluses) for life-threatening bleeding",
        pearl: "Idarucizumab instantly neutralizes dabigatran without prothrombotic rebound."
      };
    } else if (selectedReversal === "apixaban") {
      return {
        title: "Andexanet Alfa (Andexxa) for Factor Xa Inhibitors",
        indices: "Recombinant Modified Catalytically Inactive Decoy FXa Protein • Scavenges FXa Inhibitors",
        rx: "Administer IV bolus followed by 2-hour infusion; alternative: 4-Factor PCC (50 units/kg)",
        pearl: "Andexanet alfa acts as a high-affinity decoy receptor that binds and neutralizes direct FXa blockers."
      };
    } else if (selectedReversal === "warfarin") {
      return {
        title: "4-Factor PCC (Kcentra) & IV Vitamin K for Warfarin",
        indices: "Unactivated Factors II, VII, IX, X, Protein C, S • Normalizes INR in <15 minutes",
        rx: "Administer 4F-PCC (25-50 units/kg based on INR) + Intravenous Vitamin K 10 mg slow infusion",
        pearl: "Always give IV Vitamin K with 4F-PCC to sustain clotting factor synthesis as infused factors clear."
      };
    } else {
      return {
        title: "Protamine Sulfate for Heparin Neutralization",
        indices: "Strongly Basic Cationic Protein • Electrostatic Neutralization of Acidic Heparin",
        rx: "Administer Protamine Sulfate 1 mg per 100 units of active Unfractionated Heparin (slow IV)",
        pearl: "Protamine completely reverses unfractionated heparin, but only partially (~60%) reverses LMWH."
      };
    }
  }, [selectedReversal]);

  const currentNodes = useMemo(() => {
    return PHARMACOLOGY_LAB_NODES[activeMode] || PHARMACOLOGY_LAB_NODES.tdm;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: PharmacologyLabNode) => {
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
            <Pill size={14} /> PHARM-301
          </span>
          <span className={styles.titleText}>
            {activeMode === "tdm" && "Therapeutic Drug Monitoring (TDM) & Non-Linear Elimination Kinetics"}
            {activeMode === "antimicrobial" && "Antimicrobial Stewardship: ESBL, MRSA PBP2a, Pseudomonas & Novel Inhibitors"}
            {activeMode === "anticoagulation" && "Anticoagulation & Targeted Reversals: DOACs, Warfarin & Specific Antidotes"}
            {activeMode === "chemotherapy" && "Chemotherapy Toxicities & Rescue Pharmacotherapy: Anthracyclines, Cisplatin, MTX & Mesna"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Pharmacology Diagnostic Quiz"}
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
                <div className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                  Clinical Pharmacology Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Drug / Therapeutic Mechanism: {quizTargetNode.clinicalHallmarks}
                </div>
                {quizFeedback && (
                  <div className="text-xs text-purple-300 font-medium mt-1">{quizFeedback}</div>
                )}
              </div>
              <button
                onClick={nextQuizQuestion}
                className="px-3 py-1 bg-purple-950 text-xs rounded border border-purple-700 text-purple-200"
              >
                Next
              </button>
            </div>
          )}

          {/* Mode 1: TDM & Kinetics */}
          {activeMode === "tdm" && (
            <div className={styles.pharmCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={14} /> Therapeutic Drug Monitoring &amp; Michaelis-Menten Kinetics
                </span>
                <span className="text-[11px] text-slate-400">Vancomycin &bull; Aminoglycosides &bull; Digoxin &bull; Phenytoin</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => setSelectedTdm("vanco")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedTdm === "vanco"
                      ? "bg-purple-600 text-white border-purple-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🧪 Vancomycin (AUC)
                </button>
                <button
                  onClick={() => setSelectedTdm("amino")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedTdm === "amino"
                      ? "bg-purple-600 text-white border-purple-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  💊 Aminoglycosides (QD)
                </button>
                <button
                  onClick={() => setSelectedTdm("digoxin")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedTdm === "digoxin"
                      ? "bg-purple-600 text-white border-purple-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  ❤️ Digoxin (DigiFab)
                </button>
                <button
                  onClick={() => setSelectedTdm("phenytoin")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedTdm === "phenytoin"
                      ? "bg-purple-600 text-white border-purple-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  ⚡ Phenytoin (Zero-Order)
                </button>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                <div className="text-sm font-bold text-purple-300">{tdmDetails.title}</div>
                <div className="text-fuchsia-400 font-bold mt-1">{tdmDetails.indices}</div>
                <div className="text-slate-300 mt-1"><strong className="text-purple-400">Therapeutic Protocol:</strong> {tdmDetails.rx}</div>
                <div className="text-yellow-300 font-semibold mt-1"><strong className="text-yellow-400">Clinical Pearl:</strong> {tdmDetails.pearl}</div>
              </div>
            </div>
          )}

          {/* Mode 2: Antimicrobial Stewardship */}
          {activeMode === "antimicrobial" && (
            <div className={styles.pharmCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert size={14} /> Antimicrobial Resistance Mechanisms &amp; Stewardship
                </span>
                <span className="text-[11px] text-slate-400">MRSA &bull; ESBL &bull; CRE &bull; Pseudomonas</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-purple-300 font-bold">MRSA PBP2a &amp; Daptomycin Surfactant Inactivation</div>
                  <div className="text-slate-300 mt-1">mecA gene encodes altered penicillin-binding protein PBP2a. Daptomycin is highly effective for MRSA bacteremia and endocarditis, but is bound and inactivated by alveolar pulmonary surfactant &mdash; STRICTLY CONTRAINDICATED IN PNEUMONIA! Use Linezolid or Vancomycin for lung infections.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-purple-300 font-bold">ESBL, CRE &amp; Novel Beta-Lactamase Inhibitors</div>
                  <div className="text-slate-300 mt-1">ESBL hydrolyzes 3rd-generation cephalosporins (Ceftriaxone) &rarr; Meropenem is drug of choice. CRE produces carbapenemases (KPC/NDM-1) &rarr; treated with novel non-beta-lactam diazabicyclooctane combinations (Ceftazidime-Avibactam, Meropenem-Vaborbactam).</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 3: Anticoagulation & Reversals */}
          {activeMode === "anticoagulation" && (
            <div className={styles.pharmCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield size={14} /> Anticoagulation Reversal Protocols &amp; Target Antidotes
                </span>
                <span className="text-[11px] text-slate-400">Idarucizumab &bull; Andexanet Alfa &bull; 4F-PCC &bull; Protamine</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => setSelectedReversal("dabigatran")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedReversal === "dabigatran"
                      ? "bg-purple-600 text-white border-purple-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  💉 Dabigatran (Idarucizumab)
                </button>
                <button
                  onClick={() => setSelectedReversal("apixaban")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedReversal === "apixaban"
                      ? "bg-purple-600 text-white border-purple-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🛡️ FXa (Andexanet / 4F-PCC)
                </button>
                <button
                  onClick={() => setSelectedReversal("warfarin")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedReversal === "warfarin"
                      ? "bg-purple-600 text-white border-purple-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🩸 Warfarin (4F-PCC + Vit K)
                </button>
                <button
                  onClick={() => setSelectedReversal("heparin")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedReversal === "heparin"
                      ? "bg-purple-600 text-white border-purple-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  ⚡ Heparin (Protamine)
                </button>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                <div className="text-sm font-bold text-purple-300">{reversalDetails.title}</div>
                <div className="text-fuchsia-400 font-bold mt-1">{reversalDetails.indices}</div>
                <div className="text-slate-300 mt-1"><strong className="text-purple-400">Emergency Reversal:</strong> {reversalDetails.rx}</div>
                <div className="text-yellow-300 font-semibold mt-1"><strong className="text-yellow-400">Mechanistic Rule:</strong> {reversalDetails.pearl}</div>
              </div>
            </div>
          )}

          {/* Mode 4: Chemotherapy Toxicities & Rescue */}
          {activeMode === "chemotherapy" && (
            <div className={styles.pharmCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap size={14} /> Chemotherapy Organ Toxicities &amp; Targeted Antidote Rescues
                </span>
                <span className="text-[11px] text-slate-400">Dexrazoxane &bull; Amifostine &bull; Mesna &bull; Leucovorin</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-purple-300 font-bold">Anthracycline (Dexrazoxane) &amp; Cisplatin (Amifostine)</div>
                  <div className="text-slate-300 mt-1">Doxorubicin causes dose-dependent dilated cardiomyopathy via iron-mediated free radical lipid peroxidation &rarr; prevent with Dexrazoxane (iron chelator). Cisplatin causes proximal tubular ATN nephrotoxicity and ototoxicity &rarr; prevent with aggressive hydration and Amifostine free radical scavenger.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-purple-300 font-bold">Cyclophosphamide (Mesna) &amp; Methotrexate (Leucovorin)</div>
                  <div className="text-slate-300 mt-1">Cyclophosphamide yields toxic Acrolein in the bladder &rarr; Mesna sulfhydryl groups bind acrolein, preventing hemorrhagic cystitis. High-dose Methotrexate irreversibly inhibits DHFR &rarr; Leucovorin (folinic acid) bypasses DHFR to rescue normal bone marrow and mucosal cells.</div>
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
                    <span className="text-purple-400 font-bold">Pharmacology:</span> {node.pharmacologyProfile}
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

        {/* Right Side: High-Yield Clinical Pharmacology Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
              Pharmacology Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💊 Drug / Therapeutic Class</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🔬 Pharmacokinetics &amp; Mechanism</div>
            <div className="text-xs text-purple-300 font-semibold">{activeNode.pharmacologyProfile}</div>
            <div className={styles.inspectorBody}>{activeNode.mechanism}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🩺 Toxicities &amp; Clinical Hallmarks</div>
            <div className={styles.inspectorBody}>{activeNode.clinicalHallmarks}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 Gold Standard Therapeutics Pearls</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearls}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("tdm")}
          className={`${styles.modeTab} ${activeMode === "tdm" ? styles.modeTabActive : ""}`}
        >
          📈 1. TDM &amp; Kinetics
        </button>
        <button
          onClick={() => setActiveMode("antimicrobial")}
          className={`${styles.modeTab} ${activeMode === "antimicrobial" ? styles.modeTabActive : ""}`}
        >
          🛡️ 2. Antimicrobial Resistance
        </button>
        <button
          onClick={() => setActiveMode("anticoagulation")}
          className={`${styles.modeTab} ${activeMode === "anticoagulation" ? styles.modeTabActive : ""}`}
        >
          🩸 3. Anticoagulation Reversal
        </button>
        <button
          onClick={() => setActiveMode("chemotherapy")}
          className={`${styles.modeTab} ${activeMode === "chemotherapy" ? styles.modeTabActive : ""}`}
        >
          ⚡ 4. Chemo Toxicities &amp; Rescue
        </button>
      </div>
    </div>
  );
}
