"use client";

import React, { useState, useMemo } from "react";
import styles from "./ClinicalRadiologyAdvLabViewer.module.css";
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

export type RadiologyLabMode = "contrast" | "hrct" | "acuteAbdomen" | "ir";

export interface RadiologyLabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  radiologyProfile: string;
  pathologyMechanism: string;
  clinicalHallmarks: string;
  highYieldPearls: string;
}

export const RADIOLOGY_LAB_NODES: Record<RadiologyLabMode, RadiologyLabNode[]> = {
  contrast: [
    {
      id: "rad-con-cin-hydration",
      name: "Contrast-Induced Nephropathy (CIN / PC-AKI Hydration Protocol)",
      category: "Iodinated Contrast Safety",
      subType: "eGFR < 30-45 mL/min • Medullary Vasoconstriction & Cytotoxicity • Isotonic Saline (1 mL/kg/h)",
      radiologyProfile: "Intravascular iodinated contrast causing renal vasoconstriction and tubular epithelial damage.",
      pathologyMechanism: "Endothelin/adenosine-mediated medullary ischemia combined with direct reactive oxygen species tubular necrosis.",
      clinicalHallmarks: "Creatinine rise >=0.3 mg/dL within 48h; prevent with 0.9% saline 1 mL/kg/h pre/post-scan; minimize contrast volume.",
      highYieldPearls: "Intravenous volume expansion with isotonic saline is the single most proven intervention to prevent CIN/PC-AKI."
    },
    {
      id: "rad-con-metformin-hold",
      name: "Metformin Safety & Lactic Acidosis (MALA Renal Clearance Hold)",
      category: "Medication Protocol",
      subType: "eGFR < 60 mL/min • Hold at Procedure • Withhold for 48 Hours • Fatal Lactic Acidosis (MALA) Prevention",
      radiologyProfile: "Metformin accumulation during post-contrast acute renal failure triggering severe hyperlactatemia.",
      pathologyMechanism: "Metformin is 100% renally cleared; contrast does not interact with metformin, but contrast AKI causes lethal metformin buildup.",
      clinicalHallmarks: "Metformin-Associated Lactic Acidosis (MALA) carries >50% mortality; hold metformin at scan and restart only after 48h stable labs.",
      highYieldPearls: "Hold Metformin at the time of iodinated contrast in eGFR <60, and withhold for 48 hours to prevent fatal MALA."
    },
    {
      id: "rad-con-nsf-gadolinium",
      name: "Gadolinium Macrocyclic Stability vs Linear NSF Risk in ESRD",
      category: "MRI Contrast Safety",
      subType: "Group I (Linear Omniscan) High NSF Risk • Group II (Macrocyclic Gadavist/Dotarem) Safe in eGFR <30 / Dialysis",
      radiologyProfile: "Dissociation of free toxic Gd3+ ions from linear chelates depositing in skin, fascia, and visceral organs.",
      pathologyMechanism: "Free Gd3+ stimulates CD34+/procollagen I+ circulating fibrocytes, causing irreversible, debilitating systemic sclerosis-like fibrosis.",
      clinicalHallmarks: "Woody skin induration, joint contractures in dialysis patients; Group II macrocyclic agents have tight cages and zero NSF risk.",
      highYieldPearls: "Group II Macrocyclic GBCAs (Gadobutrol, Gadoterate) are extremely stable and safe in severe renal failure (eGFR <30)."
    },
    {
      id: "rad-con-anaphylactoid-premed",
      name: "Contrast Anaphylactoid Reactions & Premedication Protocol",
      category: "Idiosyncratic Allergy",
      subType: "Non-IgE Direct Mast Cell De-granulation • 13-Hour Elective Premedication (Prednisone 50mg + Diphenhydramine)",
      radiologyProfile: "Idiosyncratic non-immune mediated direct histamine release from circulating basophils and mast cells.",
      pathologyMechanism: "High osmolality or chemical structure directly triggers mast cell degranulation without prior allergen sensitization.",
      clinicalHallmarks: "Urticaria, laryngeal edema, bronchospasm, shock; elective premedication with oral Prednisone (13h, 7h, 1h) + Benadryl.",
      highYieldPearls: "Contrast reactions are non-IgE direct mast cell degranulations; emergency treatment is Intramuscular Epinephrine."
    }
  ],

  hrct: [
    {
      id: "rad-hrct-uip-ipf",
      name: "Usual Interstitial Pneumonia (UIP Subpleural Honeycombing & IPF)",
      category: "Interstitial Lung Disease",
      subType: "Subpleural & Basal Predominance • Honeycombing (Thick-Walled Cysts) • Traction Bronchiectasis • No GGO",
      radiologyProfile: "Severe irreversible subpleural architectural distortion and microscopic fibroblastic foci.",
      pathologyMechanism: "Repeated alveolar epithelial micro-injuries with aberrant wound healing, excessive collagen deposition, and cystic remodeling.",
      clinicalHallmarks: "Progressive exertional dyspnea, dry cough, dry bibasilar 'Velcro' crackles, digital clubbing in older males; median survival 3-5 years.",
      highYieldPearls: "Definite UIP on HRCT requires basal subpleural honeycombing and traction bronchiectasis without inconsistent features."
    },
    {
      id: "rad-hrct-nsip-sparing",
      name: "Non-Specific Interstitial Pneumonia (NSIP Subpleural Sparing)",
      category: "Connective Tissue ILD",
      subType: "Ground-Glass Opacities (GGO) • Fine Reticulations • Pathognomonic Subpleural SPARING • Scleroderma Association",
      radiologyProfile: "Homogeneous alveolar septal inflammation and mild interstitial thickening without architectural destruction.",
      pathologyMechanism: "Immune-mediated cellular or fibrotic expansion of alveolar walls characteristically sparing the immediate 2-5mm subpleural rim.",
      clinicalHallmarks: "Associated with Systemic Sclerosis, Sjogren, Dermatomyositis; highly responsive to corticosteroids (unlike UIP/IPF).",
      highYieldPearls: "Subpleural sparing with ground-glass opacities and fine reticulations is the pathognomonic HRCT hallmark of NSIP."
    },
    {
      id: "rad-hrct-halo-sign-aspergillus",
      name: "Angioinvasive Aspergillosis Halo Sign (Central Infarct & Hemorrhage)",
      category: "Opportunistic Fungal",
      subType: "Nodule with Circumferential Ground-Glass Halo • Neutropenic Host (ANC <500) • Fungal Arteriolar Occlusion",
      radiologyProfile: "Angioinvasion of pulmonary arteries by Aspergillus fumigatus hyphae causing focal pulmonary infarction.",
      pathologyMechanism: "Central ischemic coagulative necrotic fungal infarct surrounded by an expanding perimeter of alveolar hemorrhage (halo).",
      clinicalHallmarks: "Prolonged neutropenia, persistent fever on broad-spectrum antibiotics, pleuritic pain, hemoptysis; Voriconazole DOC.",
      highYieldPearls: "The CT Halo Sign in a febrile neutropenic patient is pathognomonic for Angioinvasive Aspergillosis; start Voriconazole."
    },
    {
      id: "rad-hrct-reverse-halo-cop",
      name: "Cryptogenic Organizing Pneumonia (Reverse Halo / Atoll Sign)",
      category: "Organizing Pneumonia",
      subType: "Central Ground-Glass + Dense Outer Consolidation Ring • Masson Bodies in Alveoli • Corticosteroid Responsive",
      radiologyProfile: "Intra-alveolar polypoid plugs of loose organizing fibroblastic connective tissue (Masson bodies).",
      pathologyMechanism: "Reparative fibroblastic reaction following alveolar injury; outer ring represents dense organizing pneumonia.",
      clinicalHallmarks: "Flu-like onset, patchy peripheral consolidations, reverse halo (atoll sign); dramatic rapid response to systemic steroids.",
      highYieldPearls: "The Reverse Halo (Atoll) Sign is highly characteristic of Cryptogenic Organizing Pneumonia (COP) and Mucormycosis."
    }
  ],

  acuteAbdomen: [
    {
      id: "rad-abd-pneumoperitoneum-rigler",
      name: "Pneumoperitoneum & Rigler Sign (Double Bowel Wall Sign)",
      category: "Perforated Viscus",
      subType: "Extraluminal Free Gas • Subdiaphragmatic Air • Rigler Sign (Air Outlining Inner & Outer Bowel Wall) • Laparotomy",
      radiologyProfile: "Loss of gastrointestinal wall integrity allowing intraluminal air to escape into the peritoneal cavity.",
      pathologyMechanism: "Perforated peptic ulcer, diverticulum, or trauma; air on both sides of the bowel wall makes the wall brightly visible (Rigler sign).",
      clinicalHallmarks: "Sudden-onset peritonitis, board-like abdominal rigidity, free air under diaphragm on upright CXR; immediate laparotomy.",
      highYieldPearls: "Rigler Sign (visualization of both the mucosal and serosal surfaces of the bowel wall) indicates massive pneumoperitoneum."
    },
    {
      id: "rad-abd-mesenteric-ischemia",
      name: "Acute Mesenteric Ischemia Triad (Pale Bowel, Pneumatosis & Portal Gas)",
      category: "Vascular Emergency",
      subType: "Lack of Wall Enhancement ('Pale Bowel') + Pneumatosis Intestinalis + Porto-Venous Gas + SMA Thrombus",
      radiologyProfile: "Interruption of mesenteric arterial perfusion causing transmural intestinal ischemia and necrosis.",
      pathologyMechanism: "Mucosal barrier breakdown allows enteric gas to dissect into bowel wall (pneumatosis) and mesenteric/portal veins.",
      clinicalHallmarks: "Agonizing pain out of proportion to exam, high lactate; CT shows pale unenhancing bowel, pneumatosis, portal venous gas; laparotomy.",
      highYieldPearls: "Pneumatosis intestinalis and branching portal venous gas signify advanced transmural bowel necrosis in mesenteric ischemia."
    },
    {
      id: "rad-abd-appendicitis-ct",
      name: "Acute Appendicitis MDCT Signs (Appendicolith & Diameter >6mm)",
      category: "RLQ Emergency",
      subType: "Outer Diameter > 6 mm • Appendicolith (Calcified Fecalith) • Periappendiceal Fat Stranding • Target Enhancement",
      radiologyProfile: "Luminal obstruction of the vermiform appendix triggering bacterial proliferation and transmural inflammation.",
      pathologyMechanism: "Increased intraluminal pressure causes venous congestion, mucosal ischemia, and surrounding inflammatory stranding.",
      clinicalHallmarks: "Periumbilical pain migrating to McBurney's point, fever, leukocytosis; CT outer diameter >6mm + fat stranding confirms diagnosis.",
      highYieldPearls: "CT diagnosis of appendicitis requires an enlarged appendix (>6 mm outer diameter) with surrounding periappendiceal fat stranding."
    },
    {
      id: "rad-abd-diverticulitis-hinchey",
      name: "Hinchey Diverticulitis Staging (Hinchey I Phlegmon to Hinchey IV Feculent)",
      category: "Colonic Emergency",
      subType: "Hinchey I (Pericolic Abscess) -> II (Pelvic Abscess) -> III (Purulent Peritonitis) -> IV (Feculent Peritonitis / Hartmann)",
      radiologyProfile: "Micro- or macro-perforation of colonic diverticula with sigmoid wall thickening and pericolonic inflammation.",
      pathologyMechanism: "Fecalith obstruction of diverticular neck causes mucosal ulceration, ischemia, and localized or generalized perforation.",
      clinicalHallmarks: "LLQ pain, fever; Hinchey I (antibiotics), Hinchey II (percutaneous drainage), Hinchey III/IV (emergency Hartmann procedure).",
      highYieldPearls: "Hinchey staging guides diverticulitis management: II requires CT-guided percutaneous drainage; III/IV requires emergency surgery."
    }
  ],

  ir: [
    {
      id: "rad-ir-pelvic-embolization",
      name: "Pelvic Trauma Arterial Embolization (Internal Iliac Coils & Gelfoam)",
      category: "Vascular Interventions",
      subType: "Internal Iliac Artery Branches (Superior Gluteal / Internal Pudendal) • Microcoils & Gelfoam • Hemodynamic Stabilization",
      radiologyProfile: "Angiographic catheterization and transcatheter vessel occlusion of active arterial hemorrhage in pelvic fractures.",
      pathologyMechanism: "Pelvic bone disruption tears branches of internal iliac artery; metallic coils provide permanent thrombotic mechanical occlusion.",
      clinicalHallmarks: "Unstable open-book pelvic fracture with contrast 'blush' on CT; emergency transcatheter embolization provides rapid hemostasis.",
      highYieldPearls: "Transcatheter Arterial Embolization (TAE) of internal iliac branches is life-saving for hemodynamically unstable pelvic trauma."
    },
    {
      id: "rad-ir-tips-shunt",
      name: "TIPS Stenting for Portal Hypertension (ePTFE Covered Shunt)",
      category: "Portal Decompression",
      subType: "Right Hepatic Vein -> Portal Vein Branch • Reduces Portosystemic Gradient (<12 mmHg) • Post-TIPS Encephalopathy Risk",
      radiologyProfile: "Transjugular creation of an artificial low-resistance endovascular shunt using an expandable covered stent.",
      pathologyMechanism: "Decompresses portal hypertension, stopping variceal bleeding and resolving refractory ascites; bypasses liver clearance.",
      clinicalHallmarks: "Refractory variceal bleeding or ascites; common complication: Hepatic Encephalopathy (30-50%) treated with Lactulose/Rifaximin.",
      highYieldPearls: "TIPS effectively decompresses portal hypertension but carries a high risk of post-procedural Hepatic Encephalopathy."
    },
    {
      id: "rad-ir-ivc-filter-retrieval",
      name: "Infrarenal IVC Filter Placement (Nitinol Filter & Mandatory Retrieval)",
      category: "Venous Interventions",
      subType: "Infrarenal IVC Deployment • Indicated for Acute DVT/PE with Contraindication to Anticoagulation • Mandatory Retrieval Protocol",
      radiologyProfile: "Endovascular deployment of an expandable metallic basket to capture emboli originating from lower extremity deep veins.",
      pathologyMechanism: "Mechanical filtration of thrombi without obstructing central venous return; deployed below renal veins to avoid renal vein occlusion.",
      clinicalHallmarks: "Acute DVT in setting of active GI bleed or CNS trauma; filter MUST be retrieved once anticoagulation is safe to prevent thrombosis.",
      highYieldPearls: "IVC filters are deployed in the infrarenal IVC and must be retrieved promptly once anticoagulation can be safely resumed."
    },
    {
      id: "rad-ir-bronchial-embolization",
      name: "Bronchial Artery Embolization (Massive Hemoptysis Hemostasis)",
      category: "Pulmonary Hemostasis",
      subType: "Massive Hemoptysis (>300-600 mL/24h) • Bronchial Artery Tortuosity & Hypertrophy • Microparticle / Coil Embolization",
      radiologyProfile: "Systemic high-pressure bronchial artery neovascularization secondary to chronic inflammatory lung disease.",
      pathologyMechanism: "Tuberculosis, bronchiectasis, or aspergilloma induces bronchial artery hypertrophy; transcatheter embolization stops bleeding.",
      clinicalHallmarks: "Massive hemoptysis threatening asphyxiation; urgent bronchial arteriography and particle embolization provides >90% initial control.",
      highYieldPearls: "Bronchial Artery Embolization (BAE) is the definitive first-line procedure for controlling massive, life-threatening hemoptysis."
    }
  ]
};

interface ClinicalRadiologyAdvLabViewerProps {
  initialMode?: RadiologyLabMode;
  height?: string;
  onNodeSelect?: (node: RadiologyLabNode) => void;
}

export default function ClinicalRadiologyAdvLabViewer({
  initialMode = "contrast",
  height = "560px",
  onNodeSelect,
}: ClinicalRadiologyAdvLabViewerProps) {
  const [activeMode, setActiveMode] = useState<RadiologyLabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Contrast Profiler State
  const [selectedContrast, setSelectedContrast] = useState<"cin" | "metformin" | "gbca" | "allergy">("cin");

  // Hinchey Profiler State
  const [selectedHinchey, setSelectedHinchey] = useState<"h1" | "h2" | "h3" | "h4">("h2");

  const contrastDetails = useMemo(() => {
    if (selectedContrast === "cin") {
      return {
        title: "Iodinated Contrast-Induced Nephropathy (CIN / PC-AKI)",
        indices: "eGFR < 30-45 mL/min • Medullary Ischemia & Reactive Oxygen Species • Normal Saline (1 mL/kg/h)",
        rx: "Administer 0.9% saline 1 mL/kg/h for 6-12h pre/post-scan; minimize contrast volume; hold NSAIDs",
        pearl: "Isotonic saline hydration is the gold standard preventative strategy for contrast nephropathy."
      };
    } else if (selectedContrast === "metformin") {
      return {
        title: "Metformin Safety & Lactic Acidosis (MALA) Rules",
        indices: "eGFR < 60 mL/min • 100% Renal Elimination • Fatal MALA Risk (>50% Mortality) if AKI Occurs",
        rx: "Hold Metformin at time of scan; withhold for 48 hours; restart ONLY after verifying stable renal function",
        pearl: "Holding Metformin prevents lethal lactic acidosis in the event of unexpected contrast-induced AKI."
      };
    } else if (selectedContrast === "gbca") {
      return {
        title: "Gadolinium Agents: Macrocyclic vs Linear Chelates & NSF",
        indices: "Group I (Linear Omniscan) High NSF Risk • Group II (Macrocyclic Gadavist/Dotarem) Safe in eGFR <30",
        rx: "Use Group II Macrocyclic GBCAs exclusively in ESRD / dialysis patients; avoid Group I linear chelates",
        pearl: "Group II macrocyclic GBCAs have high thermodynamic stability and negligible risk of NSF in renal failure."
      };
    } else {
      return {
        title: "Contrast Anaphylactoid Reactions & Premedication",
        indices: "Direct Non-IgE Mast Cell Degranulation • 13-Hour Elective Regimen: Prednisone (50mg) + Benadryl",
        rx: "Oral Prednisone 50 mg at 13h, 7h, 1h prior to scan + Diphenhydramine 50 mg at 1h; IM Epinephrine for acute reaction",
        pearl: "Idiosyncratic contrast reactions are non-IgE direct mast cell degranulations; treat acutely with IM Epinephrine."
      };
    }
  }, [selectedContrast]);

  const hincheyDetails = useMemo(() => {
    if (selectedHinchey === "h1") {
      return {
        title: "Hinchey Stage I: Pericolic Phlegmon or Small Abscess",
        indices: "Pericolic Inflammatory Mass / Phlegmon or Small Walled-Off Abscess (<3-4 cm)",
        rx: "Intravenous or oral broad-spectrum antibiotics (Ciprofloxacin + Metronidazole) + Bowel rest",
        pearl: "Hinchey I diverticulitis is managed conservatively with antibiotics without surgical intervention."
      };
    } else if (selectedHinchey === "h2") {
      return {
        title: "Hinchey Stage II: Distant Pelvic / Retroperitoneal Abscess",
        indices: "Distant Pelvic, Intra-Abdominal, or Retroperitoneal Walled-Off Abscess (>4 cm)",
        rx: "CT-GUIDED PERCUTANEOUS CATHETER DRAINAGE + Intravenous broad-spectrum antibiotics",
        pearl: "Hinchey II abscesses >4 cm require CT-guided percutaneous drainage to avoid emergency colostomy."
      };
    } else if (selectedHinchey === "h3") {
      return {
        title: "Hinchey Stage III: Generalized Purulent Peritonitis",
        indices: "Rupture of Non-Communicating Abscess -> Diffuse Purulent Peritoneal Exudate",
        rx: "Emergency Surgical Intervention: Hartmann procedure (sigmoid resection + end colostomy) or Laparoscopic Lavage",
        pearl: "Hinchey III purulent peritonitis requires emergency surgical exploration and abdominal washout."
      };
    } else {
      return {
        title: "Hinchey Stage IV: Generalized Feculent Peritonitis",
        indices: "Free Uncontained Colonic Perforation with Active Stool Spillage -> Septic Shock",
        rx: "Emergency Hartmann Procedure (Sigmoid Colectomy + End Colostomy + Rectal Stump Closure)",
        pearl: "Hinchey IV feculent peritonitis is a life-threatening surgical emergency requiring a Hartmann procedure."
      };
    }
  }, [selectedHinchey]);

  const currentNodes = useMemo(() => {
    return RADIOLOGY_LAB_NODES[activeMode] || RADIOLOGY_LAB_NODES.contrast;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: RadiologyLabNode) => {
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
            <Radio size={14} /> RAD-301
          </span>
          <span className={styles.titleText}>
            {activeMode === "contrast" && "Contrast Media Safety: CIN/PC-AKI Hydration, Metformin Rules & Macrocyclic GBCAs"}
            {activeMode === "hrct" && "High-Resolution Chest CT (HRCT): UIP Honeycombing, NSIP Subpleural Sparing & The Halo Sign"}
            {activeMode === "acuteAbdomen" && "Acute Abdomen Emergency CT: Pneumoperitoneum (Rigler Sign), Mesenteric Ischemia & Diverticulitis"}
            {activeMode === "ir" && "Emergency Interventional Radiology: Pelvic Trauma Embolization, TIPS Stenting & IVC Filters"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Radiology Diagnostic Quiz"}
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
                <div className="text-xs font-bold text-blue-300 uppercase tracking-wider">
                  Diagnostic Radiology Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Radiological Entity / Sign: {quizTargetNode.clinicalHallmarks}
                </div>
                {quizFeedback && (
                  <div className="text-xs text-blue-300 font-medium mt-1">{quizFeedback}</div>
                )}
              </div>
              <button
                onClick={nextQuizQuestion}
                className="px-3 py-1 bg-blue-950 text-xs rounded border border-blue-700 text-blue-200"
              >
                Next
              </button>
            </div>
          )}

          {/* Mode 1: Contrast Safety & CIN/NSF */}
          {activeMode === "contrast" && (
            <div className={styles.radCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={14} /> Contrast Media Safety &amp; Nephroprotection Protocols
                </span>
                <span className="text-[11px] text-slate-400">CIN Hydration &bull; Metformin MALA &bull; GBCAs &bull; Premedication</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => setSelectedContrast("cin")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedContrast === "cin"
                      ? "bg-blue-600 text-white border-blue-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  💧 CIN Hydration (1 mL/kg/h)
                </button>
                <button
                  onClick={() => setSelectedContrast("metformin")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedContrast === "metformin"
                      ? "bg-blue-600 text-white border-blue-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  💊 Metformin Hold (48h)
                </button>
                <button
                  onClick={() => setSelectedContrast("gbca")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedContrast === "gbca"
                      ? "bg-blue-600 text-white border-blue-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🧲 Macrocyclic GBCAs (NSF)
                </button>
                <button
                  onClick={() => setSelectedContrast("allergy")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedContrast === "allergy"
                      ? "bg-blue-600 text-white border-blue-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  ⚡ Anaphylactoid Premed
                </button>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                <div className="text-sm font-bold text-blue-300">{contrastDetails.title}</div>
                <div className="text-cyan-400 font-bold mt-1">{contrastDetails.indices}</div>
                <div className="text-slate-300 mt-1"><strong className="text-blue-400">Radiology Protocol:</strong> {contrastDetails.rx}</div>
                <div className="text-yellow-300 font-semibold mt-1"><strong className="text-yellow-400">ACR Safety Rule:</strong> {contrastDetails.pearl}</div>
              </div>
            </div>
          )}

          {/* Mode 2: HRCT Chest Patterns */}
          {activeMode === "hrct" && (
            <div className={styles.radCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Flame size={14} /> High-Resolution Chest CT (HRCT) Pathognomonic Patterns
                </span>
                <span className="text-[11px] text-slate-400">UIP Honeycombing &bull; NSIP Sparing &bull; Halo Sign &bull; Atoll Sign</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-blue-300 font-bold">UIP Honeycombing vs NSIP Subpleural Sparing</div>
                  <div className="text-slate-300 mt-1">UIP (IPF) presents with strict basal and subpleural honeycombing (multi-layered thick-walled cysts) with minimal ground-glass opacities. NSIP presents with ground-glass opacities and fine reticulations with pathognomonic SUBPLEURAL SPARING (sparing the immediate 2-5mm subpleural parenchymal rim).</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-blue-300 font-bold">CT Halo Sign &amp; Reverse Halo (Atoll) Sign</div>
                  <div className="text-slate-300 mt-1">The CT Halo Sign (dense nodular infarct with ground-glass perimeter of alveolar hemorrhage) is pathognomonic for Angioinvasive Aspergillosis in neutropenia. The Reverse Halo (Atoll) Sign (central ground-glass surrounded by dense consolidation ring) is pathognomonic for Cryptogenic Organizing Pneumonia (COP).</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 3: Acute Abdomen CT */}
          {activeMode === "acuteAbdomen" && (
            <div className={styles.radCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert size={14} /> Acute Abdomen Emergency CT Signs &amp; Hinchey Staging
                </span>
                <span className="text-[11px] text-slate-400">Pneumoperitoneum &bull; Mesenteric Ischemia &bull; Appendicitis &bull; Hinchey I-IV</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => setSelectedHinchey("h1")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedHinchey === "h1"
                      ? "bg-blue-600 text-white border-blue-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🟢 Hinchey I (Phlegmon)
                </button>
                <button
                  onClick={() => setSelectedHinchey("h2")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedHinchey === "h2"
                      ? "bg-blue-600 text-white border-blue-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🟡 Hinchey II (Drainage)
                </button>
                <button
                  onClick={() => setSelectedHinchey("h3")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedHinchey === "h3"
                      ? "bg-blue-600 text-white border-blue-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🔴 Hinchey III (Purulent)
                </button>
                <button
                  onClick={() => setSelectedHinchey("h4")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedHinchey === "h4"
                      ? "bg-blue-600 text-white border-blue-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  ⚠️ Hinchey IV (Feculent)
                </button>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                <div className="text-sm font-bold text-blue-300">{hincheyDetails.title}</div>
                <div className="text-cyan-400 font-bold mt-1">{hincheyDetails.indices}</div>
                <div className="text-slate-300 mt-1"><strong className="text-blue-400">Surgical Triage:</strong> {hincheyDetails.rx}</div>
                <div className="text-yellow-300 font-semibold mt-1"><strong className="text-yellow-400">Emergency Pearl:</strong> {hincheyDetails.pearl}</div>
              </div>
            </div>
          )}

          {/* Mode 4: Interventional Radiology */}
          {activeMode === "ir" && (
            <div className={styles.radCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Scissors size={14} /> Emergency Interventional Radiology &amp; Endovascular Procedures
                </span>
                <span className="text-[11px] text-slate-400">Pelvic TAE &bull; TIPS Shunting &bull; IVC Filters &bull; Bronchial Embolization</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-blue-300 font-bold">Pelvic Trauma Embolization &amp; Bronchial BAE</div>
                  <div className="text-slate-300 mt-1">Transcatheter arterial embolization (TAE) with microcoils and Gelfoam provides immediate mechanical hemostasis in unstable pelvic fractures with active arterial extravasation ('blush'). Bronchial artery embolization is first-line for massive life-threatening hemoptysis (&gt;300-600 mL/24h).</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-blue-300 font-bold">TIPS Stenting &amp; Infrarenal IVC Filters</div>
                  <div className="text-slate-300 mt-1">TIPS creates an ePTFE covered shunt between hepatic vein and portal vein to decompress portal hypertension (stopping variceal bleeding and ascites); watch for post-TIPS hepatic encephalopathy. IVC filters must be deployed infrarenal and retrieved promptly once anticoagulation is safe.</div>
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
                    <span className="text-blue-400 font-bold">Radiology:</span> {node.radiologyProfile}
                  </div>

                  <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400">
                    <span>Inspect scan protocol</span>
                    <ArrowRight size={12} className="text-slate-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: High-Yield Clinical Radiology Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
              Radiology Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🩻 Imaging Entity / Procedure</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🔬 Radiological &amp; Pathological Signs</div>
            <div className="text-xs text-blue-300 font-semibold">{activeNode.radiologyProfile}</div>
            <div className={styles.inspectorBody}>{activeNode.pathologyMechanism}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🩺 Clinical Hallmarks &amp; Triage</div>
            <div className={styles.inspectorBody}>{activeNode.clinicalHallmarks}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 Gold Standard Radiology Pearls</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearls}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("contrast")}
          className={`${styles.modeTab} ${activeMode === "contrast" ? styles.modeTabActive : ""}`}
        >
          💧 1. Contrast Safety (CIN/NSF)
        </button>
        <button
          onClick={() => setActiveMode("hrct")}
          className={`${styles.modeTab} ${activeMode === "hrct" ? styles.modeTabActive : ""}`}
        >
          🫁 2. HRCT Chest Patterns
        </button>
        <button
          onClick={() => setActiveMode("acuteAbdomen")}
          className={`${styles.modeTab} ${activeMode === "acuteAbdomen" ? styles.modeTabActive : ""}`}
        >
          ⚡ 3. Acute Abdomen CT
        </button>
        <button
          onClick={() => setActiveMode("ir")}
          className={`${styles.modeTab} ${activeMode === "ir" ? styles.modeTabActive : ""}`}
        >
          ✂️ 4. Emergency IR Procedures
        </button>
      </div>
    </div>
  );
}
