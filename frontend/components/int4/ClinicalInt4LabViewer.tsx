"use client";

import React, { useState, useMemo } from "react";
import styles from "./ClinicalInt4LabViewer.module.css";
import {
  Heart,
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
  Award,
  Flame,
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
} from "lucide-react";

export type Int4LabMode = "acs" | "dka" | "aki" | "cirrhosis";

export interface Int4LabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  proceduralProfile: string;
  proceduralMechanism: string;
  clinicalHallmarks: string;
  highYieldPearls: string;
}

export const INT4_LAB_NODES: Record<Int4LabMode, Int4LabNode[]> = {
  acs: [
    {
      id: "int4-ca-stemi-cath-lab-activation",
      name: "STEMI Cath Lab Activation Pathways (&le;90m Door-to-Balloon Primary PCI vs &le;30m Fibrinolysis)",
      category: "STEMI Reperfusion",
      subType: "ST Elevation &ge;1 mm in &ge;2 Contiguous Leads &bull; Door-to-Balloon &le;90 min &bull; Door-to-Needle &le;30 min",
      proceduralProfile: "Emergency coronary reperfusion protocol restoring epicardial and microvascular coronary blood flow.",
      proceduralMechanism: "Balloon inflation and drug-eluting stent deployment disrupt occlusive atherothrombus, salvaging myocardium.",
      clinicalHallmarks: "Activate Cath Lab immediately for STEMI with target door-to-balloon time &le;90 min; if transfer >120m, give fibrinolytics &le;30m.",
      highYieldPearls: "Door-to-Balloon time benchmark for Primary PCI in STEMI is &le;90 minutes (&le;120 min if transfer); Door-to-Needle for lytics is &le;30 min."
    },
    {
      id: "int4-ca-nstemi-risk-stratification",
      name: "NSTEMI & Unstable Angina Risk Stratification (Early Invasive Strategy &le;24h & GRACE/TIMI Risk Scoring)",
      category: "NSTEMI Pathways",
      subType: "GRACE Score >140 &bull; Dynamic ST Depressions &bull; Elevated Troponin &bull; Angiography &le;24h (Immediate &le;2h if Shock)",
      proceduralProfile: "Inpatient stratification deciding timing of coronary angiography in non-ST-elevation acute coronary syndrome.",
      proceduralMechanism: "Plaque rupture with non-occlusive thrombus produces subendocardial ischemia and micro-embolization.",
      clinicalHallmarks: "High-risk features (hemodynamic instability, refractory pain, GRACE >140) mandate early invasive strategy &le;24 hours.",
      highYieldPearls: "High-risk NSTEMI (dynamic ECG changes, positive troponin, GRACE >140) requires early invasive coronary angiography &le;24 hours."
    },
    {
      id: "int4-ca-dual-antiplatelet-anticoagulation",
      name: "Inpatient Dual Antiplatelet & Anticoagulation (Aspirin + Ticagrelor/Prasugrel Dosing & Heparin aPTT Protocols)",
      category: "Antiplatelet Regimen",
      subType: "Aspirin 325 mg &bull; Ticagrelor 180 mg Load &bull; Prasugrel 60 mg (BANNED in Stroke) &bull; UFH aPTT 50-70s",
      proceduralProfile: "Potent antiplatelet and antithrombotic combination therapy preventing acute stent thrombosis.",
      proceduralMechanism: "Dual blockade of thromboxane A2 and P2Y12 ADP receptors suppresses platelet activation and aggregation.",
      clinicalHallmarks: "Load Aspirin 325 mg + Ticagrelor 180 mg (or Prasugrel 60 mg, avoid if prior TIA/stroke) + UFH bolus and drip.",
      highYieldPearls: "Prasugrel is STRICTLY CONTRAINDICATED in patients with a history of stroke or TIA due to high intracranial hemorrhage risk."
    },
    {
      id: "int4-ca-high-intensity-statin-plaque",
      name: "High-Intensity Statin & Plaque Stabilization (Atorvastatin 80 mg Daily & Early Secondary Prevention)",
      category: "Secondary Prevention",
      subType: "Atorvastatin 80 mg (or Rosuvastatin 40 mg) &bull; Pleiotropic Plaque Stabilization &bull; Inpatient Initiation",
      proceduralProfile: "High-intensity lipid-lowering therapy improving endothelial function and reducing recurrent ischemic events.",
      proceduralMechanism: "HMG-CoA reductase inhibition lowers LDL-C, reduces lipid core necrotic volume, and stabilizes fibrous caps.",
      clinicalHallmarks: "Initiate high-intensity statin (Atorvastatin 80 mg) in all ACS patients regardless of baseline LDL cholesterol before discharge.",
      highYieldPearls: "High-intensity statin therapy (Atorvastatin 80 mg or Rosuvastatin 40 mg) is initiated in all ACS patients prior to discharge."
    }
  ],

  dka: [
    {
      id: "int4-dk-dka-hhs-discrimination",
      name: "DKA vs HHS Diagnostic Discrimination (Anion Gap Ketoacidosis vs Hyperosmolar Dehydration)",
      category: "Diagnostic Profiles",
      subType: "DKA: Gap >12, HCO3 <18, pH <7.30, Ketones &bull; HHS: Glucose >600, Osm >320, No Gap, 8-10L Deficit",
      proceduralProfile: "Differential biochemical classification separating ketoacidosis from severe hyperosmolar dehydration.",
      proceduralMechanism: "Absolute insulin deficiency drives lipolysis and ketogenesis in DKA; relative deficiency in HHS suppresses ketosis.",
      clinicalHallmarks: "DKA has high anion gap metabolic acidosis; HHS has profound hyperglycemia (>600), hyperosmolality (>320), and normal gap.",
      highYieldPearls: "DKA is characterized by high anion gap metabolic acidosis and positive ketones; HHS features severe hyperglycemia and osmolality >320."
    },
    {
      id: "int4-dk-two-bag-fluid-dextrose-switch",
      name: "Two-Bag Fluid Resuscitation & Dextrose Switch (Corrected Sodium Infusions & D5W Addition at Glucose <200)",
      category: "Fluid Protocols",
      subType: "0.9% NS &rarr; 0.45% NS based on Corrected Na &bull; Add D5W when Glucose <200 (DKA) or <300 (HHS)",
      proceduralProfile: "Systematic crystalloid titration preventing rapid osmolality drops, cerebral edema, and hypoglycemia.",
      proceduralMechanism: "Corrected Na = Measured Na + 1.6 &times; [(Glucose - 100)/100]; adding dextrose allows continued insulin for ketoacidosis.",
      clinicalHallmarks: "Switch to D5W 0.45% NS when glucose drops to <200 mg/dL in DKA to continue insulin infusion until acidosis resolves.",
      highYieldPearls: "Add 5% Dextrose to IV fluids when glucose drops below 200 mg/dL in DKA (or <300 in HHS) while continuing insulin infusion."
    },
    {
      id: "int4-dk-potassium-first-insulin-rules",
      name: "Potassium-First Rule & Regular Insulin Infusion (HOLD Insulin if K <3.3 mEq/L & Continuous 0.1 U/kg/hr)",
      category: "Potassium Safety",
      subType: "HOLD Insulin if K <3.3 mEq/L &bull; Give 20-40 mEq K/hr &bull; Start Regular Insulin 0.1 U/kg/hr when K &ge;3.3",
      proceduralProfile: "Critical safety rule preventing fatal hypokalemic cardiac arrest and respiratory muscle paralysis.",
      proceduralMechanism: "Insulin stimulates the Na+/K+ ATPase, driving potassium into cells and precipitating life-threatening hypokalemia.",
      clinicalHallmarks: "Check K+ before insulin; if K+ <3.3 mEq/L, HOLD insulin and infuse IV potassium until K+ &ge;3.3 mEq/L.",
      highYieldPearls: "NEVER start insulin in DKA if serum potassium is <3.3 mEq/L; administer IV potassium first to avoid cardiac arrest."
    },
    {
      id: "int4-dk-dka-resolution-subq-bridge",
      name: "DKA Resolution Criteria & Basal Insulin Bridge (Anion Gap Closure & 2-Hour Basal SubQ Overlap)",
      category: "Resolution & Bridge",
      subType: "Glucose <200, HCO3 &ge;18, pH >7.30, Gap &le;12 &bull; Inject SubQ Basal Insulin 2h BEFORE Stopping IV Drip",
      proceduralProfile: "Inpatient transition protocol ensuring durable glycemic control and preventing recurrent ketoacidosis.",
      proceduralMechanism: "Subcutaneous basal insulin (Glargine) requires 2 hours for systemic absorption and steady-state action.",
      clinicalHallmarks: "DKA is resolved when gap &le;12, HCO3 &ge;18, and pH >7.30; give SubQ basal insulin 2 hours before turning off IV insulin.",
      highYieldPearls: "Administer subcutaneous basal insulin 2 hours prior to stopping IV insulin infusion to prevent rebound diabetic ketoacidosis."
    }
  ],

  aki: [
    {
      id: "int4-ak-kdigo-staging-system",
      name: "KDIGO Acute Kidney Injury Staging System (Stage 1-3 Creatinine Multipliers & Oliguria Benchmarks)",
      category: "KDIGO Staging",
      subType: "Stage 1 (1.5-1.9x Cr) &bull; Stage 2 (2.0-2.9x Cr) &bull; Stage 3 (&ge;3x Cr or &ge;4.0 mg/dL or RRT / Anuria &ge;12h)",
      proceduralProfile: "Standardized nephrology classification quantifying acute deterioration in glomerular filtration function.",
      proceduralMechanism: "Tubular cell ischemic injury, microvascular endothelial swelling, and interstitial edema reduce GFR.",
      clinicalHallmarks: "Stage 1: Cr 1.5-1.9x baseline. Stage 2: Cr 2-2.9x baseline. Stage 3: Cr &ge;3x baseline, Cr &ge;4.0 mg/dL, or anuria &ge;12h.",
      highYieldPearls: "KDIGO Stage 3 AKI is defined by a 3-fold rise in baseline creatinine, serum Cr &ge;4.0 mg/dL, or initiation of dialysis."
    },
    {
      id: "int4-ak-prerenal-vs-atn-fena",
      name: "Prerenal Azotemia vs Intrinsic ATN Workup (FeNa <1% Tubular Conservation vs FeNa >2% Muddy Brown Casts)",
      category: "Diagnostic FeNa",
      subType: "Prerenal: BUN/Cr >20, FeNa <1%, FeUrea <35%, Urine Na <20 &bull; ATN: BUN/Cr ~10-15, FeNa >2%, Muddy Brown Casts",
      proceduralProfile: "Urine electrolyte and microscopy workup differentiating functional renal hypoperfusion from tubular necrosis.",
      proceduralMechanism: "Intact tubular cells avidity reabsorb sodium in prerenal states (FeNa <1%); necrotic tubules leak sodium (FeNa >2%).",
      clinicalHallmarks: "Prerenal responds to IV fluids with normalizing Cr; ATN shows muddy brown granular casts and elevated FeNa (>2%).",
      highYieldPearls: "Fractional Excretion of Sodium (FeNa) <1% indicates Prerenal Azotemia; FeNa >2% with muddy brown casts confirms ATN."
    },
    {
      id: "int4-ak-emergent-dialysis-aeiou",
      name: "Emergent Renal Replacement Indications AEIOU (Refractory Acidosis, Hyperkalemia, Overload & Uremic Pericarditis)",
      category: "AEIOU Dialysis",
      subType: "A: Acidosis (pH <7.1) &bull; E: Electrolytes (K >6.5) &bull; I: Ingestions (SLIME) &bull; O: Overload &bull; U: Uremia",
      proceduralProfile: "Life-saving indications for urgent inpatient hemodialysis or continuous renal replacement therapy.",
      proceduralMechanism: "Extracorporeal semipermeable membranes clear metabolic toxins, normalize electrolytes, and ultrafiltrate fluid.",
      clinicalHallmarks: "Indications: Acidosis pH <7.10, refractory K+ >6.5 with ECG changes, toxic ingestions, pulmonary edema, uremic rub.",
      highYieldPearls: "Emergent Dialysis 'AEIOU': Acidosis (pH <7.1), Electrolytes (K >6.5), Ingestions (SLIME), Overload, Uremia (pericarditis)."
    },
    {
      id: "int4-ak-nephrotoxic-stewardship",
      name: "Nephrotoxic Stewardship & Fluid Responsiveness (Contrast, NSAID Avoidance & Loop Diuretic Challenge)",
      category: "Renal Protection",
      subType: "Stop NSAIDs, ACEi/ARBs, Aminoglycosides &bull; IV Hydration for Contrast &bull; Furosemide Stress Test",
      proceduralProfile: "Inpatient renal stewardship preventing iatrogenic nephron loss and guiding fluid therapy.",
      proceduralMechanism: "NSAIDs block afferent arteriolar vasodilatory prostaglandins; ACE inhibitors block efferent vasoconstriction.",
      clinicalHallmarks: "Discontinue all nephrotoxins immediately upon AKI diagnosis; use isotonic crystalloid hydration for iodinated contrast.",
      highYieldPearls: "In acute kidney injury, immediately discontinue NSAIDs, aminoglycosides, and ACE inhibitors/ARBs to preserve GFR."
    }
  ],

  cirrhosis: [
    {
      id: "int4-ci-hepatic-encephalopathy-lactulose",
      name: "Hepatic Encephalopathy Ammonia Trapping (West Haven Grading, Lactulose pH Acidification & Rifaximin)",
      category: "Hepatic Encephalopathy",
      subType: "West Haven 1-4 &bull; Asterixis &bull; Lactulose (Titrated to 2-3 Soft Stools/day) &bull; Rifaximin 550 mg BID",
      proceduralProfile: "Inpatient management of hyperammonemic neurocognitive decompensation in end-stage liver disease.",
      proceduralMechanism: "Lactulose acidifies the colon, trapping NH3 as non-absorbable NH4+; Rifaximin eliminates urease-producing gut flora.",
      clinicalHallmarks: "Grade 2 features lethargy and asterixis (flapping tremor); treat with Lactulose (titrated to 2-3 soft stools/day) + Rifaximin.",
      highYieldPearls: "Lactulose acidifies colonic contents to trap ammonia as NH4+, and is titrated to 2-3 soft bowel movements daily."
    },
    {
      id: "int4-ci-variceal-bleeding-octreotide",
      name: "Acute Esophageal Variceal Bleeding Bundle (Restrictive Transfusion Target Hb 7-8 & Octreotide Splanchnic Vasoconstriction)",
      category: "Variceal Bleeding",
      subType: "Restrictive Transfusion (Hb 7-8 g/dL) &bull; Octreotide 50 mcg Bolus + 50 mcg/hr &bull; Splanchnic Vasoconstriction",
      proceduralProfile: "Emergency resuscitation bundle for upper gastrointestinal hemorrhage secondary to portal hypertension.",
      proceduralMechanism: "Somatostatin receptor activation induces selective splanchnic vasoconstriction, lowering portal inflow and variceal pressure.",
      clinicalHallmarks: "Target hemoglobin 7-8 g/dL; start Octreotide 50 mcg IV bolus and 50 mcg/hr infusion immediately upon presentation.",
      highYieldPearls: "Restrictive transfusion (target Hb 7-8 g/dL) combined with Octreotide reduces rebleeding and mortality in variceal hemorrhage."
    },
    {
      id: "int4-ci-prophylactic-ceftriaxone-egd",
      name: "Prophylactic Ceftriaxone & Urgent EGD Banding (Infection Prevention, SBP Prophylaxis & Endoscopic Variceal Ligation)",
      category: "Endoscopic Ligation",
      subType: "Ceftriaxone 1 g IV Daily for 7 Days &bull; Urgent EGD &le;12 Hours &bull; Endoscopic Variceal Band Ligation (EVL)",
      proceduralProfile: "Definitive endoscopic and antimicrobial bundle halting active variceal bleeding and preventing sepsis.",
      proceduralMechanism: "Broad-spectrum coverage prevents bacterial translocation and SBP; elastic rubber bands thrombose bleeding columns.",
      clinicalHallmarks: "Administer IV Ceftriaxone 1 g daily for 7 days to all cirrhotic GI bleeders; perform EGD with EVL within 12 hours.",
      highYieldPearls: "In cirrhotic patients with upper GI bleeding, prophylactic IV Ceftriaxone (1 g/day for 7 days) significantly reduces mortality."
    },
    {
      id: "int4-ci-hepatorenal-syndrome-terlipressin",
      name: "Hepatorenal Syndrome Type 1 Protocols (Cirrhotic Splanchnic Vasodilation & Terlipressin/Albumin Infusion)",
      category: "Hepatorenal Syndrome",
      subType: "Cirrhosis + Ascites + AKI Non-Responsive to 48h Albumin &bull; Terlipressin + IV Albumin (or Norepinephrine)",
      proceduralProfile: "Functional renal failure in advanced cirrhosis caused by profound splanchnic arterial vasodilation.",
      proceduralMechanism: "Terlipressin/Norepinephrine constricts dilated splanchnic beds; Albumin expands central effective arterial blood volume.",
      clinicalHallmarks: "HRS-AKI is diagnosed when AKI persists despite 48h of volume challenge with IV Albumin (1 g/kg/d); treat with Terlipressin + Albumin.",
      highYieldPearls: "Hepatorenal Syndrome: AKI unresponsive to 48h albumin challenge; first-line medical therapy is Terlipressin PLUS IV Albumin."
    }
  ]
};

interface ClinicalInt4LabViewerProps {
  initialMode?: Int4LabMode;
  height?: string;
  onNodeSelect?: (node: Int4LabNode) => void;
}

export default function ClinicalInt4LabViewer({
  initialMode = "acs",
  height = "560px",
  onNodeSelect,
}: ClinicalInt4LabViewerProps) {
  const [activeMode, setActiveMode] = useState<Int4LabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const currentNodes = useMemo(() => {
    return INT4_LAB_NODES[activeMode] || INT4_LAB_NODES.acs;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: Int4LabNode) => {
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
            <Heart size={14} /> INT-504
          </span>
          <span className={styles.titleText}>
            {activeMode === "acs" && "Acute Coronary Syndromes: STEMI Reperfusion (<=90m Door-to-Balloon) & Dual Antiplatelets"}
            {activeMode === "dka" && "Hyperglycemic Crises: DKA vs HHS, Potassium Safety & Two-Bag Fluid Resuscitation"}
            {activeMode === "aki" && "Acute Kidney Injury: KDIGO Staging, FeNa Prerenal vs ATN & Emergent Dialysis (AEIOU)"}
            {activeMode === "cirrhosis" && "Cirrhotic Decompensation: Hepatic Encephalopathy (Lactulose) & Variceal Bleeding"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Inpatient Consult Quiz"}
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
                  Inpatient Medicine Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Clinical Protocol: {quizTargetNode.clinicalHallmarks}
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

          {/* Mode 1: ACS */}
          {activeMode === "acs" && (
            <div className={styles.proceduralCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <HeartPulse size={14} /> STEMI Reperfusion &amp; Inpatient ACS Protocols
                </span>
                <span className="text-[11px] text-slate-400">Door-to-Balloon &le;90m &bull; Ticagrelor/Prasugrel &bull; Prasugrel Stroke Ban &bull; Atorvastatin 80</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">STEMI Cath Lab Activation</div>
                  <div className="text-slate-300 mt-1">Door-to-balloon time &le;90 min for on-site Primary PCI. If transfer needed &gt;120m, administer IV fibrinolytics &le;30 min. High-risk NSTEMI (GRACE &gt;140, refractory pain) requires early invasive angiography &le;24 hours.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">Dual Antiplatelet &amp; Anticoagulant Therapy</div>
                  <div className="text-slate-300 mt-1">Aspirin 325 mg + Ticagrelor 180 mg (or Prasugrel 60 mg). Prasugrel is STRICTLY CONTRAINDICATED in prior stroke/TIA. Add UFH (target aPTT 50-70s) + high-intensity Atorvastatin 80 mg daily.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 2: DKA & HHS */}
          {activeMode === "dka" && (
            <div className={styles.proceduralCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Droplet size={14} /> Hyperglycemic Crises (DKA vs HHS Protocols)
                </span>
                <span className="text-[11px] text-slate-400">HOLD Insulin if K &lt;3.3 &bull; Two-Bag D5W &bull; Regular Insulin 0.1 U/kg/hr &bull; 2h SubQ Overlap</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">Potassium-First Safety &amp; Insulin Infusion</div>
                  <div className="text-slate-300 mt-1">If K+ &lt;3.3 mEq/L, HOLD insulin and infuse 20-40 mEq K+/hr until K+ &ge;3.3 to prevent fatal cardiac arrest. Start regular insulin at 0.1 units/kg/hr when K+ is safe.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">Dextrose Switch &amp; Resolution Criteria</div>
                  <div className="text-slate-300 mt-1">Add 5% Dextrose when glucose drops &lt;200 mg/dL in DKA (or &lt;300 in HHS) to continue insulin for ketoacidosis. DKA resolved: Gap &le;12, HCO3 &ge;18, pH &gt;7.30. Give basal insulin 2 hours prior to stopping IV drip.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 3: AKI & Dialysis */}
          {activeMode === "aki" && (
            <div className={styles.proceduralCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={14} /> Acute Kidney Injury (KDIGO &amp; Emergent Dialysis AEIOU)
                </span>
                <span className="text-[11px] text-slate-400">KDIGO 1-3 &bull; FeNa &lt;1% Prerenal vs &gt;2% ATN &bull; Muddy Brown Casts &bull; AEIOU</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">Prerenal Azotemia vs Intrinsic ATN</div>
                  <div className="text-slate-300 mt-1">Prerenal: FeNa &lt;1%, BUN/Cr &gt;20:1, urine Na &lt;20. ATN: FeNa &gt;2%, muddy brown granular casts, isosthenuria. Stop NSAIDs, aminoglycosides, and ACE inhibitors immediately.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">Emergent Dialysis Indications (AEIOU)</div>
                  <div className="text-slate-300 mt-1">A: Acidosis (pH &lt;7.10). E: Electrolytes (refractory K+ &gt;6.5). I: Intoxications (SLIME). O: Overload (pulmonary edema refractory to diuretics). U: Uremia (pericarditis, encephalopathy).</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 4: Cirrhosis */}
          {activeMode === "cirrhosis" && (
            <div className={styles.proceduralCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <TestTube size={14} /> Cirrhotic Decompensation &amp; Variceal Bleeding
                </span>
                <span className="text-[11px] text-slate-400">Lactulose + Rifaximin &bull; Restrictive Hb 7-8 &bull; Octreotide &bull; Ceftriaxone &bull; EVL &bull; Terlipressin</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">Hepatic Encephalopathy Protocols</div>
                  <div className="text-slate-300 mt-1">Lactulose acidifies the colon to trap NH3 as NH4+ (titrated to 2-3 soft stools/day). Add Rifaximin 550 mg PO BID to eliminate gut urease-producing bacteria and prevent recurrence.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">Acute Variceal Bleeding Emergency Bundle</div>
                  <div className="text-slate-300 mt-1">Restrictive transfusion (target Hb 7-8 g/dL) + Octreotide 50 mcg bolus and 50 mcg/hr infusion + prophylactic IV Ceftriaxone 1 g daily for 7 days + urgent EGD with band ligation &le;12 hours.</div>
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
              Consult Inspector
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
          onClick={() => setActiveMode("acs")}
          className={`${styles.modeTab} ${activeMode === "acs" ? styles.modeTabActive : ""}`}
        >
          ❤️ 1. ACS &amp; Cardiology
        </button>
        <button
          onClick={() => setActiveMode("dka")}
          className={`${styles.modeTab} ${activeMode === "dka" ? styles.modeTabActive : ""}`}
        >
          🩸 2. DKA &amp; HHS
        </button>
        <button
          onClick={() => setActiveMode("aki")}
          className={`${styles.modeTab} ${activeMode === "aki" ? styles.modeTabActive : ""}`}
        >
          🫘 3. AKI &amp; Dialysis
        </button>
        <button
          onClick={() => setActiveMode("cirrhosis")}
          className={`${styles.modeTab} ${activeMode === "cirrhosis" ? styles.modeTabActive : ""}`}
        >
          🧪 4. Cirrhosis &amp; Bleed
        </button>
      </div>
    </div>
  );
}
