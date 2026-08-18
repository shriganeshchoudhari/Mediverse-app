"use client";

import React, { useState, useMemo } from "react";
import styles from "./ClinicalPg3LabViewer.module.css";
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

export type Pg3LabMode = "dcl" | "visceral" | "reboa" | "teg";

export interface Pg3LabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  proceduralProfile: string;
  proceduralMechanism: string;
  clinicalHallmarks: string;
  highYieldPearls: string;
}

export const PG3_LAB_NODES: Record<Pg3LabMode, Pg3LabNode[]> = {
  dcl: [
    {
      id: "pg3-dc-lethal-triad-bloody-cycle",
      name: "Trauma Lethal Triad (Hypothermia <35°C, Acidosis pH <7.20 & Trauma-Induced Coagulopathy)",
      category: "Lethal Triad",
      subType: "Hypothermia <35°C &bull; Acidosis pH <7.20 (Base Deficit >6) &bull; Trauma Coagulopathy TIC &bull; 10% Clot Loss / °C Drop",
      proceduralProfile: "The fatal self-propagating pathophysiological triad precipitating non-mechanical microvascular hemorrhage.",
      proceduralMechanism: "Hypothermia inhibits enzymatic clotting cascade; acidosis disrupts thrombin generation; TIC drives systemic hyperfibrinolysis.",
      clinicalHallmarks: "Core temp <35°C, arterial pH <7.20, lactate >4 mmol/L, and microvascular oozing; mandates immediate surgical damage control.",
      highYieldPearls: "The lethal triad consists of Hypothermia (<35°C), Acidosis (pH <7.20), and Coagulopathy; mandates immediate abbreviated surgery."
    },
    {
      id: "pg3-dc-3-stage-dcl-paradigm",
      name: "3-Stage Damage Control Laparotomy Paradigm (Abbreviated Surgery, ICU Rewarming & Staged Re-exploration)",
      category: "DCL Paradigm",
      subType: "Stage 1: OR &lt;60-90m (Packing, Shunts, Stapling) &bull; Stage 2: ICU Rewarming & Resuscitation &bull; Stage 3: Planned Re-exploration",
      proceduralProfile: "Staged surgical rescue strategy aborting definitive reconstruction to restore survivable physiology.",
      proceduralMechanism: "Controls surgical hemorrhage and enteric spillage rapidly, deferring hand-sewn anastomoses until physiological normalization.",
      clinicalHallmarks: "Stage 1 in <60-90 min with temporary abdominal closure (TAC/ABThera); Stage 2 in SICU for 24-48h; Stage 3 re-entry in 48-72h.",
      highYieldPearls: "Stage 1 DCL must be completed in <60-90 min with four-quadrant packing and bowel stapling (no anastomoses) plus TAC."
    },
    {
      id: "pg3-dc-abdominal-compartment-syndrome",
      name: "Abdominal Compartment Syndrome & Bladder Manometry (Sustained IAP >20 mmHg, Oliguria & Emergent Decompressive Laparotomy)",
      category: "ACS Decompression",
      subType: "Bladder Pressure IAP &gt;20 mmHg &bull; Oliguria &bull; High Peak Airway Pressures &bull; Emergent Decompressive Laparotomy",
      proceduralProfile: "Life-threatening intra-abdominal hypertension producing multisystem organ failure.",
      proceduralMechanism: "Elevated intra-abdominal pressure compresses renal veins (oliguria), elevates diaphragms (hypoventilation), and restricts IVC return.",
      clinicalHallmarks: "Transurethral bladder Foley pressure >20 mmHg with new organ dysfunction; mandates immediate bedside surgical decompression.",
      highYieldPearls: "ACS is diagnosed when sustained IAP >20 mmHg produces new organ failure; requires emergent decompressive laparotomy."
    },
    {
      id: "pg3-dc-open-abdomen-vac-closure",
      name: "Open Abdomen Temporary Closure Techniques (Barker Vacuum Pack, ABThera Negative Pressure & Fascial Traction)",
      category: "Open Abdomen TAC",
      subType: "ABThera Negative Pressure &bull; Fenestrated Visceral Protective Layer &bull; Dynamic Fascial Suture Traction &bull; Prevents Retraction",
      proceduralProfile: "Temporary abdominal wall containment preventing fascial lateralization while evacuating peritoneal third-space fluid.",
      proceduralMechanism: "Continuous negative pressure (-125 mmHg) extracts inflammatory peritoneal fluid and maintains medial tension on fascial edges.",
      clinicalHallmarks: "Place non-adherent fenestrated layer over viscera; apply negative pressure foam with dynamic fascial traction for delayed primary closure.",
      highYieldPearls: "ABThera negative pressure dressing protects bowel and maintains fascial traction, enabling delayed primary closure in >80% of cases."
    }
  ],

  visceral: [
    {
      id: "pg3-vs-pringle-maneuver-hepatic-hemostasis",
      name: "Pringle Maneuver & Hepatic Trauma Hemostasis (Hepatoduodenal Ligament Clamping, Inflow vs Outflow & 15-20m Limit)",
      category: "Pringle Maneuver",
      subType: "Clamps Foramen of Winslow &bull; Compresses Portal Vein, Proper Hepatic Artery & Bile Duct &bull; 15-20 Min Safe Ischemia Limit",
      proceduralProfile: "Rapid vascular inflow occlusion controlling severe parenchymal hemorrhage in high-grade liver injuries.",
      proceduralMechanism: "Occludes hepatic inflow; bleeding cessation confirms inflow source; persistent bleeding proves retrohepatic IVC/hepatic vein tear.",
      clinicalHallmarks: "Clamp hepatoduodenal ligament for max 15-20 minutes; if bleeding stops, perform deep tractotomy and direct vessel suture ligation.",
      highYieldPearls: "Pringle maneuver clamps the hepatoduodenal ligament at the Foramen of Winslow; safe for 15-20 min; isolates inflow vs IVC bleeding."
    },
    {
      id: "pg3-vs-pancreaticoduodenal-trauma-management",
      name: "Pancreaticoduodenal Trauma & Ductal Disruptions (Grade III Distal Pancreatectomy vs Grade IV/V Diverticulization)",
      category: "Pancreas Trauma",
      subType: "Grade III Duct Injury Left of SMV (Distal Pancreatectomy) &bull; Grade IV/V Devitalization (Duodenal Diverticulization / Staged Whipple)",
      proceduralProfile: "Anatomical management of complex retroperitoneal duodenal and pancreatic parenchymal disruptions.",
      proceduralMechanism: "Ductal disruption left of SMV requires distal resection; complex pancreatic head disruptions require duodenal exclusion.",
      clinicalHallmarks: "Grade III injuries undergo distal pancreatectomy; Grade IV-V undergo damage control duodenal diverticulization or staged Whipple.",
      highYieldPearls: "Pancreatic duct disruption to the left of the SMV (Grade III) requires distal pancreatectomy with or without splenectomy."
    },
    {
      id: "pg3-vs-temporary-intraluminal-vascular-shunts",
      name: "Temporary Intraluminal Vascular Shunting (Argyle / Javid Shunts in Extremity Arteries within 6h Window)",
      category: "Vascular Shunting",
      subType: "Restores Distal Perfusion &bull; &lt;6 Hour Warm Ischemia Window &bull; Common Femoral / Popliteal &bull; Secures with Vessel Loops",
      proceduralProfile: "Damage control vascular intervention rapidly restoring arterial inflow to ischemic limbs.",
      proceduralMechanism: "Maintains pulsatile limb perfusion while orthopedic external fixators are applied and patient physiology is resuscitated.",
      clinicalHallmarks: "Place intraluminal shunt into transected artery within 6h warm ischemia window; secure with vessel loops; systemic heparinization if safe.",
      highYieldPearls: "Temporary vascular shunts must be placed within <6 hours of warm ischemia to prevent irreversible muscle necrosis and limb loss."
    },
    {
      id: "pg3-vs-retroperitoneal-hematoma-zones",
      name: "Retroperitoneal Hematoma Exploration Zones (Zone 1 Central Mandatory Exploration vs Zone 2/3 Selective Exploration)",
      category: "Retroperitoneum Zones",
      subType: "Zone 1 (Central Aorta/IVC: Mandatory Exploration) &bull; Zone 2 (Flank/Renal: Non-expanding Observe) &bull; Zone 3 (Pelvis: Angioembolize)",
      proceduralProfile: "Algorithmic exploration strategy for blunt and penetrating retroperitoneal hematomas.",
      proceduralMechanism: "Zone 1 contains major vascular structures requiring immediate surgical exposure; Zone 3 contains pelvic venous plexuses.",
      clinicalHallmarks: "Mandatory exploration of Zone 1 (Mattox/Cattell-Braasch maneuver); leave expanding Zone 3 pelvic hematomas closed for angioembolization.",
      highYieldPearls: "Zone 1 retroperitoneal hematomas require mandatory surgical exploration; Zone 3 pelvic hematomas should NOT be opened (pack/angio)."
    }
  ],

  reboa: [
    {
      id: "pg3-rb-aortic-zone-1-thoracic-occlusion",
      name: "Aortic Anatomical Zone 1 Thoracic Occlusion (Left Subclavian to Celiac T4-T12, NCTH Exsanguination & 30m Limit)",
      category: "Zone 1 REBOA",
      subType: "Left Subclavian to Celiac Trunk (T4-T12) &bull; Insertion Depth ~45-50 cm &bull; Max Occlusion 30 Min &bull; Subdiaphragmatic NCTH",
      proceduralProfile: "Resuscitative endovascular cross-clamping of the descending thoracic aorta for intra-abdominal exsanguination.",
      proceduralMechanism: "Inflating balloon stops subdiaphragmatic blood loss and augments coronary and cerebral perfusion pressures.",
      clinicalHallmarks: "Indicated in non-compressible torso hemorrhage with unrecordable BP; total occlusion strictly limited to <=30 minutes.",
      highYieldPearls: "REBOA Zone 1 extends from left subclavian to celiac axis (T4-T12); safe occlusion limit is strictly <=30 minutes."
    },
    {
      id: "pg3-rb-aortic-zone-2-contraindication",
      name: "Aortic Anatomical Zone 2 Paravisceral Contraindication (Celiac to Renal T12-L2, Absolute No-Inflation Zone & Visceral Ischemia)",
      category: "Zone 2 CONTRAINDICATED",
      subType: "Celiac to Lowest Renal Artery (T12-L2) &bull; STRICTLY FORBIDDEN &bull; Total Mesenteric & Renal Infarction Hazard",
      proceduralProfile: "Critical anatomical boundary where endovascular balloon occlusion is strictly prohibited.",
      proceduralMechanism: "Balloon inflation in Zone 2 occludes the superior mesenteric and renal arteries without offering any hemostatic control.",
      clinicalHallmarks: "Zone 2 is a NO-OCCLUSION ZONE; balloon inflation causes irreversible intestinal necrosis and acute tubular necrosis.",
      highYieldPearls: "Zone 2 (paravisceral aorta T12-L2) is STRICTLY CONTRAINDICATED for REBOA balloon inflation due to mesenteric gangrene risk."
    },
    {
      id: "pg3-rb-aortic-zone-3-infrarenal-occlusion",
      name: "Aortic Anatomical Zone 3 Infrarenal Occlusion (Lowest Renal to Bifurcation L2-L4, Pelvic Disruption & 60m Limit)",
      category: "Zone 3 REBOA",
      subType: "Lowest Renal to Aortic Bifurcation (L2-L4) &bull; Insertion Depth ~20-25 cm &bull; Max Occlusion 60 Min &bull; Pelvic Exsanguination",
      proceduralProfile: "Distal aortic balloon occlusion controlling catastrophic pelvic fracture hemorrhage and junctional groin trauma.",
      proceduralMechanism: "Isolates the iliac arterial circulation while maintaining visceral, mesenteric, and renal perfusion.",
      clinicalHallmarks: "Advance catheter to 20-25 cm depth; inflate balloon with 2-5 mL; safe occlusion time is up to 60 minutes.",
      highYieldPearls: "REBOA Zone 3 (infrarenal aorta L2-L4) controls pelvic and junctional hemorrhage with a safe occlusion limit of up to 60 minutes."
    },
    {
      id: "pg3-rb-partial-reboa-preboa-reperfusion",
      name: "Partial REBOA (pREBOA) & Reperfusion Physiology (Low-Volume Pulsatile Permissive Flow & Hyperkalemia Prevention)",
      category: "pREBOA Protocol",
      subType: "Permissive Low-Volume Pulsatile Distal Flow &bull; Titrated Micro-Deflation &bull; Mitigates Reperfusion Acidosis & Hyperkalemia",
      proceduralProfile: "Dynamic endovascular weaning protocol minimizing ischemic-reperfusion injury during definitive surgical hemostasis.",
      proceduralMechanism: "Partial balloon deflation allows calibrated distal perfusion, reducing metabolic wash-out shock and myocardial depression.",
      clinicalHallmarks: "Transition from complete to partial REBOA once proximal MAP reaches >=65 mmHg; monitor for reperfusion hyperkalemia.",
      highYieldPearls: "Partial REBOA (pREBOA) permits low-pressure distal pulsatile flow, preventing catastrophic reperfusion hyperkalemic arrest."
    }
  ],

  teg: [
    {
      id: "pg3-tg-clot-initiation-r-time-ffp",
      name: "Thromboelastography (TEG) Clot Initiation Kinetics (R-Time >10 min, Factor Deficiency & Targeted FFP / 4F-PCC)",
      category: "TEG R-Time / CT",
      subType: "R-Time &gt;10 min (ROTEM CT &gt;240s) &bull; Clotting Factor Depletion &bull; Fresh Frozen Plasma (10-15 mL/kg) or 4F-PCC",
      proceduralProfile: "Viscoelastic quantification of clotting factor enzymatic activity and initial thrombin burst.",
      proceduralMechanism: "Prolonged R-time reflects delayed conversion of prothrombin to thrombin due to factor consumption or dilution.",
      clinicalHallmarks: "R-time >10 min mandates transfusion of Fresh Frozen Plasma (FFP, 10-15 mL/kg) or 4-Factor PCC (25-50 IU/kg).",
      highYieldPearls: "Prolonged TEG R-time (>10 min) or ROTEM CT (>240s) indicates clotting factor deficiency; treat with FFP or 4F-PCC."
    },
    {
      id: "pg3-tg-clot-propagation-alpha-angle-cryo",
      name: "Clot Propagation & Alpha-Angle Dynamics (Alpha-Angle <53°, Fibrinogen Deficiency & Cryoprecipitate / Fibrinogen)",
      category: "TEG Alpha-Angle",
      subType: "Alpha-Angle &lt;53° (ROTEM CFT &gt;150s) &bull; Severe Hypofibrinogenemia (&lt;1.5 g/L) &bull; Cryoprecipitate (10-20 Units) or Fibrinogen",
      proceduralProfile: "Viscoelastic measurement of the rate of fibrin polymerization and clot kinetic build-up.",
      proceduralMechanism: "Low alpha-angle indicates poor fibrin lattice crosslinking due to consumptive hypofibrinogenemia.",
      clinicalHallmarks: "Alpha-angle <53° requires immediate administration of Cryoprecipitate (1-2 pools / 10-20 units) or Fibrinogen Concentrate (2-4 g).",
      highYieldPearls: "Decreased TEG alpha-angle (<53°) indicates severe hypofibrinogenemia; treat emergently with Cryoprecipitate or Fibrinogen."
    },
    {
      id: "pg3-tg-clot-strength-ma-platelets",
      name: "Maximum Amplitude (MA) & Platelet Function (MA <50 mm, Platelet Deficit & Apheresis Platelet / DDAVP Therapy)",
      category: "TEG MA / MCF",
      subType: "MA &lt;50 mm (ROTEM MCF &lt;45mm) &bull; Platelet Dysfunction / Thrombocytopenia &bull; 1 Apheresis Platelet Unit or DDAVP",
      proceduralProfile: "Viscoelastic quantification of ultimate clot tensile strength driven 80% by platelets and 20% by fibrin.",
      proceduralMechanism: "Low MA reflects impaired platelet-GPIIb/IIIa cross-linking or severe consumptive thrombocytopenia.",
      clinicalHallmarks: "MA <50 mm with normal alpha-angle mandates transfusion of 1 apheresis platelet unit or Desmopressin (DDAVP 0.3 mcg/kg).",
      highYieldPearls: "Low TEG Maximum Amplitude (MA <50 mm) proves platelet deficiency or dysfunction; treat with 1 apheresis unit of Platelets."
    },
    {
      id: "pg3-tg-fibrinolysis-crash2-txa-protocol",
      name: "Fibrinolysis & The CRASH-2 Tranexamic Acid Protocol (LY30 >3% Hyperfibrinolysis & 1 g + 1 g IV TXA within 3h)",
      category: "TEG LY30 & TXA",
      subType: "LY30 &gt;3% (ROTEM ML &gt;15%) &bull; Pathological Hyperfibrinolysis &bull; Tranexamic Acid 1 g Bolus + 1 g over 8h within &lt;3h",
      proceduralProfile: "Real-time detection of pathological clot breakdown driven by massive tissue-type plasminogen activator (tPA) release.",
      proceduralMechanism: "Plasmin actively degrades fibrin matrix; Tranexamic Acid competitively inhibits plasminogen lysine binding sites.",
      clinicalHallmarks: "LY30 >3% is diagnostic of hyperfibrinolysis; administer 1 g IV TXA over 10 min followed by 1 g over 8h (must be <3h from injury).",
      highYieldPearls: "Elevated TEG LY30 (>3%) confirms hyperfibrinolysis; administer IV Tranexamic Acid (1 g + 1 g) strictly within <3 hours of trauma."
    }
  ]
};

interface ClinicalPg3LabViewerProps {
  initialMode?: Pg3LabMode;
  height?: string;
  onNodeSelect?: (node: Pg3LabNode) => void;
}

export default function ClinicalPg3LabViewer({
  initialMode = "dcl",
  height = "560px",
  onNodeSelect,
}: ClinicalPg3LabViewerProps) {
  const [activeMode, setActiveMode] = useState<Pg3LabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const currentNodes = useMemo(() => {
    return PG3_LAB_NODES[activeMode] || PG3_LAB_NODES.dcl;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: Pg3LabNode) => {
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
            <Sparkles size={14} /> PG-603
          </span>
          <span className={styles.titleText}>
            {activeMode === "dcl" && "Damage Control Laparotomy: Lethal Triad, 3-Stage Paradigm & Abdominal Compartment"}
            {activeMode === "visceral" && "Complex Visceral Trauma: Pringle Maneuver, Pancreatic Injuries & Vascular Shunts"}
            {activeMode === "reboa" && "REBOA Endovascular Resuscitation: Anatomical Zones 1-3, Timing & pREBOA Protocols"}
            {activeMode === "teg" && "Viscoelastometry & Massive Transfusion: TEG/ROTEM Parameters, Targeted Products & TXA"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Trauma Surgery Quiz"}
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
                  Trauma Fellow Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Trauma Protocol: {quizTargetNode.clinicalHallmarks}
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

          {/* Mode 1: DCL */}
          {activeMode === "dcl" && (
            <div className={styles.proceduralCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert size={14} /> Damage Control Surgery &amp; The Lethal Triad
                </span>
                <span className="text-[11px] text-slate-400">Hypothermia &lt;35°C &bull; Acidosis pH &lt;7.20 &bull; 3-Stage DCL &bull; ACS IAP &gt;20 mmHg</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">Trauma Lethal Triad &amp; DCL Stage 1</div>
                  <div className="text-slate-300 mt-1">Hypothermia (&lt;35°C), Acidosis (pH &lt;7.20), Coagulopathy (TIC). Abbreviated laparotomy (&lt;60-90 min): four-quadrant packing, vascular shunts, bowel stapling (no anastomoses), and TAC / ABThera.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">Abdominal Compartment Syndrome (ACS)</div>
                  <div className="text-slate-300 mt-1">Sustained bladder pressure IAP &gt;20 mmHg accompanied by new organ failure (oliguria, high airway peak pressures). Requires emergency surgical decompressive laparotomy.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 2: Visceral */}
          {activeMode === "visceral" && (
            <div className={styles.proceduralCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={14} /> Complex Visceral, Hepatic &amp; Vascular Trauma
                </span>
                <span className="text-[11px] text-slate-400">Pringle Maneuver (15-20m) &bull; Pancreas Grade III Distal &bull; Vascular Shunt &lt;6h &bull; Zone 1 Hematoma</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">Pringle Maneuver Inflow Occlusion</div>
                  <div className="text-slate-300 mt-1">Clamping hepatoduodenal ligament at Foramen of Winslow (Portal vein, Hepatic artery, Bile duct) for 15-20 min. If bleeding ceases: inflow source; if bleeding continues: retrohepatic IVC tear.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">Pancreas Ductal Injury &amp; Shunts</div>
                  <div className="text-slate-300 mt-1">Grade III duct transection left of SMV requires distal pancreatectomy. Temporary intraluminal arterial shunts must be placed within &lt;6h warm ischemia to preserve limb viability.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 3: REBOA */}
          {activeMode === "reboa" && (
            <div className={styles.proceduralCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Crosshair size={14} /> REBOA Aortic Balloon Occlusion Zones
                </span>
                <span className="text-[11px] text-slate-400">Zone 1 Thoracic (&le;30m) &bull; Zone 2 CONTRAINDICATED &bull; Zone 3 Infrarenal (&le;60m) &bull; pREBOA</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">Zone 1 vs Zone 3 Aortic Occlusion</div>
                  <div className="text-slate-300 mt-1">Zone 1 (Thoracic T4-T12): Subdiaphragmatic exsanguination; max occlusion &le;30 min. Zone 3 (Infrarenal L2-L4): Pelvic fracture hemorrhage; max occlusion &le;60 min.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">Zone 2 Prohibition &amp; pREBOA</div>
                  <div className="text-slate-300 mt-1">Zone 2 (Paravisceral T12-L2) is STRICTLY CONTRAINDICATED (causes fatal bowel necrosis). Partial REBOA (pREBOA) titrates low-pressure distal flow to avoid reperfusion hyperkalemia.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 4: TEG */}
          {activeMode === "teg" && (
            <div className={styles.proceduralCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <TestTube size={14} /> Viscoelastometry (TEG / ROTEM) &amp; Transfusion
                </span>
                <span className="text-[11px] text-slate-400">R-Time (FFP) &bull; &alpha;-Angle (Cryo) &bull; MA (Platelets) &bull; LY30 &gt;3% (TXA &lt;3h) &bull; 1:1:1 Resuscitation</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">TEG Clot Initiation &amp; Propagation</div>
                  <div className="text-slate-300 mt-1">R-Time &gt;10 min: Clotting factor deficiency &rarr; Give FFP / 4F-PCC. &alpha;-Angle &lt;53°: Fibrinogen deficiency &rarr; Give Cryoprecipitate (10-20 units) or Fibrinogen Concentrate.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">Clot Strength (MA) &amp; Hyperfibrinolysis</div>
                  <div className="text-slate-300 mt-1">MA &lt;50 mm: Platelet deficit &rarr; Give 1 apheresis Platelet unit. LY30 &gt;3%: Pathological hyperfibrinolysis &rarr; Give Tranexamic Acid (TXA 1 g + 1 g IV within &lt;3h CRASH-2).</div>
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
                    <span>Inspect Trauma Protocol</span>
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
              Trauma Surgery Fellow Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>📋 Surgical Protocol</div>
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
            <div className={styles.inspectorLabel}>💡 Gold Standard Trauma Pearls</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearls}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("dcl")}
          className={`${styles.modeTab} ${activeMode === "dcl" ? styles.modeTabActive : ""}`}
        >
          🛡️ 1. DCL &amp; Lethal Triad
        </button>
        <button
          onClick={() => setActiveMode("visceral")}
          className={`${styles.modeTab} ${activeMode === "visceral" ? styles.modeTabActive : ""}`}
        >
          🔪 2. Visceral Trauma &amp; Pringle
        </button>
        <button
          onClick={() => setActiveMode("reboa")}
          className={`${styles.modeTab} ${activeMode === "reboa" ? styles.modeTabActive : ""}`}
        >
          🎯 3. REBOA Zones 1-3
        </button>
        <button
          onClick={() => setActiveMode("teg")}
          className={`${styles.modeTab} ${activeMode === "teg" ? styles.modeTabActive : ""}`}
        >
          🩸 4. TEG &amp; Transfusion
        </button>
      </div>
    </div>
  );
}
