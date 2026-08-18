"use client";

import React, { useState, useMemo } from "react";
import styles from "./ClinicalPg4LabViewer.module.css";
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
  Baby,
} from "lucide-react";

export type Pg4LabMode = "hie" | "pphn" | "lisa" | "vis";

export interface Pg4LabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  proceduralProfile: string;
  proceduralMechanism: string;
  clinicalHallmarks: string;
  highYieldPearls: string;
}

export const PG4_LAB_NODES: Record<Pg4LabMode, Pg4LabNode[]> = {
  hie: [
    {
      id: "pg4-hi-sarnat-staging-encephalopathy",
      name: "Sarnat Staging of Neonatal Encephalopathy (Mild Jitteriness vs Moderate Seizures vs Severe Coma)",
      category: "Sarnat Staging",
      subType: "Stage 1 (Mild: 100% Normal) &bull; Stage 2 (Moderate: Seizures, Hypotonia) &bull; Stage 3 (Severe: Coma, Flaccid, >50% Disability)",
      proceduralProfile: "Standardized clinical stratification of intrapartum hypoxic-ischemic brain injury in term neonates.",
      proceduralMechanism: "Primary energy failure causes excitotoxic glutamate storm; Sarnat 2/3 reflects impending secondary mitochondrial failure.",
      clinicalHallmarks: "Stage 1: hyperalert; Stage 2: lethargy, seizures, burst aEEG; Stage 3: comatose, flaccid, isoelectric aEEG; Stage 2/3 qualify for cooling.",
      highYieldPearls: "Sarnat Stage 2 (lethargy, seizures, hypotonia) and Stage 3 (coma, flaccidity) meet criteria for therapeutic hypothermia."
    },
    {
      id: "pg4-hi-therapeutic-hypothermia-72h",
      name: "Therapeutic Hypothermia Cooling Protocol (33.5°C Whole-Body Target, 72 Consecutive Hours & Entry <=6h)",
      category: "Hypothermia Protocol",
      subType: "Core Temp 33.5°C (33.0-34.0°C) &bull; Initiate &le;6 Hours of Life &bull; 72 Consecutive Hours &bull; GA &ge;36w / Wt &ge;1,800g",
      proceduralProfile: "Evidence-based neuroprotective hypothermia protocol reducing mortality and cerebral palsy.",
      proceduralMechanism: "Lowers cerebral metabolic rate by 5-8% per 1°C drop, suppresses microglial neuroinflammation, nitric oxide synthase, and apoptosis.",
      clinicalHallmarks: "Initiate whole-body cooling within 6h of life; maintain esophageal/rectal temp at 33.5°C for 72h; target mild sinus bradycardia (80-100 bpm).",
      highYieldPearls: "Therapeutic hypothermia targets 33.5°C for 72 consecutive hours initiated within <=6 hours of life for moderate-severe HIE."
    },
    {
      id: "pg4-hi-slow-controlled-rewarming",
      name: "Slow Controlled Rewarming Dynamics (<=0.5°C/h Rewarming over >=6h & Rebound Prevention)",
      category: "Rewarming Protocol",
      subType: "Rewarming Rate &le;0.5°C / Hour &bull; Total Rewarming Duration &ge;6 Hours &bull; Prevents Rebound Seizures & Hypotension",
      proceduralProfile: "Critical terminal phase of neonatal therapeutic hypothermia preventing secondary reperfusion injury.",
      proceduralMechanism: "Rapid rewarming causes sudden cerebral vasodilation, systemic hypotension, apoptotic rebound, and intractable status epilepticus.",
      clinicalHallmarks: "Increase servo-set temperature by 0.5°C every 2 hours over at least 6-12 hours; monitor continuous aEEG for rebound seizures.",
      highYieldPearls: "Rewarming after therapeutic hypothermia must not exceed <=0.5°C per hour over >=6 hours to prevent rebound seizures and hypotension."
    },
    {
      id: "pg4-hi-aeeg-neuromonitoring-patterns",
      name: "Amplitude-Integrated EEG (aEEG) Backgrounds (Continuous vs Discontinuous vs Burst Suppression)",
      category: "aEEG Neuromonitoring",
      subType: "Continuous Normal Voltage (CNV) &bull; Discontinuous Low Voltage (DNV) &bull; Burst Suppression (BS) &bull; Flat Isoelectric",
      proceduralProfile: "Continuous bedside simplified cerebral function monitoring tracking background voltage and subclinical seizures.",
      proceduralMechanism: "Quantifies cortical electrocerebral activity suppression and detects subclinical electrographic seizures during cooling and rewarming.",
      clinicalHallmarks: "Normal: lower border >5 uV, upper >10 uV; Burst suppression: lower border <5 uV with intermittent high spikes; treat electrographic seizures.",
      highYieldPearls: "aEEG burst suppression (lower <5 uV) or isoelectric tracing confirms severe encephalopathy qualifying for cooling."
    }
  ],

  pphn: [
    {
      id: "pg4-pp-pre-post-ductal-saturation-gradients",
      name: "Pre- vs Post-Ductal Saturation Gradients (Right Hand vs Foot SpO2 Delta >=10% & PDA Shunt)",
      category: "Pre/Post SpO2",
      subType: "Right Hand (Pre-ductal) vs Foot (Post-ductal) &bull; &Delta;SpO2 &ge;10% (or &Delta;PaO2 &ge;20 mmHg) &bull; Right-to-Left Ductal Shunt",
      proceduralProfile: "Bedside non-invasive diagnostic marker confirming suprasystemic pulmonary artery hypertension and extrapulmonary shunting.",
      proceduralMechanism: "High pulmonary vascular resistance forces deoxygenated pulmonary blood across the ductus arteriosus into the descending aorta.",
      clinicalHallmarks: "Right hand SpO2 is >=10% higher than foot SpO2; confirms right-to-left PDA shunting and differential cyanosis in PPHN.",
      highYieldPearls: "A pre-to-post ductal SpO2 difference >=10% (right hand vs foot) confirms right-to-left extrapulmonary shunting in PPHN."
    },
    {
      id: "pg4-pp-oxygenation-index-severity-stratification",
      name: "Oxygenation Index (OI) Severity Stratification (OI >=25 for iNO vs OI >=40 Critical Threshold for VA-ECMO)",
      category: "Oxygenation Index",
      subType: "OI = (MAP x FiO2 x 100) / PaO2 &bull; OI &ge;25 (Inhaled Nitric Oxide Indication) &bull; OI &ge;40 (Neonatal ECMO Indication)",
      proceduralProfile: "Quantitative formula indexing the intensity of ventilatory support against arterial oxygenation.",
      proceduralMechanism: "Normalizes mean airway pressure and inspired oxygen fraction to PaO2, providing an objective threshold for advanced rescue.",
      clinicalHallmarks: "Calculate OI; if OI >=25 start Inhaled Nitric Oxide (20 ppm); if OI >=40 with persistent hypoxemia, initiate Neonatal VA-ECMO.",
      highYieldPearls: "Oxygenation Index OI = (MAP x FiO2 x 100) / PaO2; OI >=25 indicates iNO; OI >=40 is the critical threshold for neonatal VA-ECMO."
    },
    {
      id: "pg4-pp-inhaled-nitric-oxide-protocol",
      name: "Inhaled Nitric Oxide (iNO) Vasodilation Protocol (Starting 20 ppm, cGMP Smooth Muscle Relaxation & Step-Wise Weaning)",
      category: "iNO Vasodilation",
      subType: "Starting Dose 20 ppm &bull; Selective Pulmonary Arteriolar Dilator via cGMP &bull; Step-Wise Wean (20 &rarr; 5 &rarr; 1 ppm)",
      proceduralProfile: "Selective inhaled pulmonary vasodilator improving ventilation-perfusion matching without systemic hypotension.",
      proceduralMechanism: "Inhaled NO diffuses into pulmonary vascular smooth muscle, activating soluble guanylyl cyclase to generate cyclic GMP.",
      clinicalHallmarks: "Initiate at 20 ppm; positive response: PaO2 rise >20 mmHg; wean step-wise (5 ppm -> 1 ppm) when FiO2 <0.60 to avoid rebound PPHN.",
      highYieldPearls: "iNO is started at 20 ppm for PPHN (OI >=25); wean step-wise down to 1 ppm before stopping to prevent rebound vasoconstriction."
    },
    {
      id: "pg4-pp-methemoglobinemia-toxicity-monitoring",
      name: "Methemoglobinemia & NO2 Toxicity Surveillance (MetHb <2.5% Target & Ambient NO2 <0.5 ppm)",
      category: "iNO Toxicities",
      subType: "Methemoglobinemia (Keep MetHb &lt;2.5%) &bull; Nitrogen Dioxide (Keep NO2 &lt;0.5 ppm) &bull; Serial Blood Gas MetHb Co-Oximetry",
      proceduralProfile: "Safety monitoring during continuous inhaled nitric oxide therapy in critically ill neonates.",
      proceduralMechanism: "Nitric oxide oxidizes ferrous (Fe2+) hemoglobin to ferric (Fe3+) methemoglobin, which cannot bind and release oxygen.",
      clinicalHallmarks: "Measure serial MetHb levels via co-oximetry; if MetHb >2.5-5.0%, reduce iNO dose; keep ambient NO2 <0.5 ppm.",
      highYieldPearls: "Inhaled nitric oxide therapy requires tracking blood Methemoglobin (target MetHb <2.5%) and ambient NO2 (<0.5 ppm)."
    }
  ],

  lisa: [
    {
      id: "pg4-ls-less-invasive-surfactant-administration",
      name: "Less Invasive Surfactant Administration (LISA / MIST) (Spontaneous Breathing on Nasal CPAP & Thin Catheter Delivery)",
      category: "LISA Technique",
      subType: "Spontaneous Breathing on Nasal CPAP (6-8 cmH2O) &bull; Thin 16-18G Catheter / Feeding Tube &bull; Eliminates Intubation Barotrauma",
      proceduralProfile: "Non-invasive exogenous surfactant instillation in spontaneously breathing preterm infants failing CPAP.",
      proceduralMechanism: "Infant's spontaneous inspiratory efforts draw surfactant into distal alveolar spaces while maintaining continuous PEEP.",
      clinicalHallmarks: "Indicated in preterms (24-32 wks GA) on CPAP requiring FiO2 >0.30; place thin catheter under direct laryngoscopy; instill over 1-3 min.",
      highYieldPearls: "LISA delivers surfactant via a thin catheter during spontaneous breathing on CPAP, avoiding mechanical ventilation and cutting BPD."
    },
    {
      id: "pg4-ls-poractant-alfa-dosing-dynamics",
      name: "Natural Poractant Alfa Dosing Dynamics (200 mg/kg Curosurf Dosing & Functional Residual Capacity Rescue)",
      category: "Surfactant Dosing",
      subType: "Poractant Alfa (Curosurf) 200 mg/kg (2.5 mL/kg) Initial Dose &bull; Low Volume &bull; Rapid Alveolar Surface Tension Reduction",
      proceduralProfile: "Porcine-derived natural lung surfactant restoring pulmonary compliance in neonatal Respiratory Distress Syndrome.",
      proceduralMechanism: "Dipalmitoylphosphatidylcholine (DPPC) and SP-B/SP-C form an alveolar monolayer, preventing end-expiratory alveolar collapse.",
      clinicalHallmarks: "Administer initial high-dose 200 mg/kg (2.5 mL/kg); repeat 100 mg/kg after 12h if FiO2 >0.30 remains elevated.",
      highYieldPearls: "Initial Poractant alfa (Curosurf) dose is 200 mg/kg (2.5 mL/kg), providing rapid reduction in oxygen requirements."
    },
    {
      id: "pg4-ls-caffeine-citrate-apnea-bpd-prevention",
      name: "Caffeine Citrate Apnea & BPD Prevention (20 mg/kg Loading + 5-10 mg/kg/d Maintenance for Apnea of Prematurity)",
      category: "Caffeine Citrate",
      subType: "Loading Dose 20 mg/kg IV/PO &bull; Maintenance 5-10 mg/kg/day &bull; Adenosine Receptor Antagonism &bull; Cuts BPD & CP (CAP Trial)",
      proceduralProfile: "Methylxanthine central respiratory stimulant proven in the CAP trial to improve neurodevelopmental outcomes.",
      proceduralMechanism: "Antagonizes central A1 and A2A adenosine receptors in the brainstem, increasing sensitivity to hypercapnia and diaphragmatic contractility.",
      clinicalHallmarks: "Start within first 72h of life for all infants <1,250g or <30 wks GA; load 20 mg/kg, maintain 5-10 mg/kg/d until 34-36 wks PMA.",
      highYieldPearls: "Caffeine citrate (20 mg/kg load, 5-10 mg/kg/d) treats apnea of prematurity, facilitates early extubation, and reduces BPD rates."
    },
    {
      id: "pg4-ls-bpd-prevention-bundle-oxygen-targets",
      name: "Bronchopulmonary Dysplasia (BPD) Prevention Bundle (Target SpO2 91-95% & Volume-Targeted Extubation Strategy)",
      category: "BPD Prevention",
      subType: "Defined at 36 Weeks PMA &bull; Target SpO2 91-95% &bull; Volume-Targeted Ventilation (4-5 mL/kg) &bull; Early Extubation",
      proceduralProfile: "Multifaceted neonatal intensive care bundle minimizing chronic oxygen toxicity and ventilator-induced lung injury.",
      proceduralMechanism: "Avoids hyperoxia (SpO2 >95% generates toxic ROS causing ROP and alveolar simplification) while preventing hypoxemic pulmonary HTN.",
      clinicalHallmarks: "Maintain tight SpO2 targets 91-95%; use volume guarantee ventilation (4-5 mL/kg); diagnose BPD at 36 wks postmenstrual age.",
      highYieldPearls: "BPD is diagnosed at 36 weeks PMA; prevention relies on target SpO2 91-95%, caffeine citrate, and non-invasive LISA surfactant."
    }
  ],

  vis: [
    {
      id: "pg4-vs-pediatric-cold-shock-resuscitation",
      name: "Pediatric Cold Shock Phenotypic Resuscitation (Low Cardiac Output, High SVR & First-Line Epinephrine 0.05-0.3)",
      category: "Cold Shock Protocol",
      subType: "60-70% Pediatric Sepsis &bull; Low CO, High SVR, Cap Refill &gt;3s &bull; First-Line Epinephrine (0.05-0.3 mcg/kg/min)",
      proceduralProfile: "Precision inotropic resuscitation for the dominant pediatric septic shock phenotype.",
      proceduralMechanism: "Immature pediatric myocardium fails with high afterload; Epinephrine provides beta-1 inotropy and chronotropy plus stroke volume recruitment.",
      clinicalHallmarks: "Cool mottled extremities, delayed capillary refill >3s, thready pulses; infuse Epinephrine (0.05-0.3 mcg/kg/min) via central/IO line.",
      highYieldPearls: "Cold shock (low CO, high SVR, cap refill >3s) represents 60-70% of pediatric septic shock; treated with Epinephrine."
    },
    {
      id: "pg4-vs-pediatric-warm-shock-resuscitation",
      name: "Pediatric Warm Shock Phenotypic Resuscitation (High Output, Low SVR, Flash Refill & First-Line Norepinephrine)",
      category: "Warm Shock Protocol",
      subType: "30-40% Pediatric Sepsis &bull; High CO, Low SVR, Flash Refill &lt;1s &bull; First-Line Norepinephrine (0.05-0.3 mcg/kg/min)",
      proceduralProfile: "Vasopressor resuscitation for distributive pediatric septic shock phenotype.",
      proceduralMechanism: "Profound systemic vasodilation responsive to alpha-1 adrenergic vasoconstriction restoring systemic vascular resistance.",
      clinicalHallmarks: "Warm flushed extremities, bounding pulses, flash capillary refill <1s; infuse Norepinephrine (0.05-0.3 mcg/kg/min).",
      highYieldPearls: "Warm shock (high CO, low SVR, flash refill <1s) represents 30-40% of pediatric septic shock; treated with Norepinephrine."
    },
    {
      id: "pg4-vs-vasoactive-inotropic-score-calculation",
      name: "Vasoactive-Inotropic Score (VIS) Calculation (VIS >=20 High-Risk Alert & Pediatric VA-ECMO Mobilization)",
      category: "VIS Score",
      subType: "VIS = Dopamine + Dobutamine + 100(Epi) + 100(Norepi) + 10,000(Vaso) + 10(Milrinone) &bull; VIS &ge;20 Critical Threshold",
      proceduralProfile: "Standardized objective metric quantifying the total intensity of cardiovascular pharmacological support.",
      proceduralMechanism: "Weights distinct inotropic and vasopressor infusions to compute aggregate cardiovascular strain.",
      clinicalHallmarks: "Calculate VIS at bedside; VIS >=20 correlates with high in-hospital mortality, renal failure, and triggers VA-ECMO evaluation.",
      highYieldPearls: "Vasoactive-Inotropic Score (VIS) >=20 identifies critical refractory shock and serves as the trigger for pediatric ECMO mobilization."
    },
    {
      id: "pg4-vs-stress-dose-hydrocortisone-protocol",
      name: "Stress-Dose Hydrocortisone Protocol (50-100 mg/m2/d in Catecholamine-Resistant CIRCI Shock)",
      category: "Stress Hydrocortisone",
      subType: "Catecholamine-Resistant Shock &bull; Hydrocortisone 50-100 mg/m2/day (or 1-2 mg/kg Q6H IV) &bull; Up-regulates Adrenergic Receptors",
      proceduralProfile: "Endocrine rescue therapy for refractory pediatric septic shock with critical illness-related corticosteroid insufficiency.",
      proceduralMechanism: "Restores vascular tone by up-regulating alpha-1 and beta-1 adrenergic receptor density on vascular smooth muscle.",
      clinicalHallmarks: "Indicated when shock persists despite high-dose Epinephrine/Norepinephrine; administer Hydrocortisone 1-2 mg/kg Q6H IV boluses.",
      highYieldPearls: "Stress-dose Hydrocortisone (1-2 mg/kg Q6H IV) is indicated in pediatric septic shock refractory to high-dose catecholamines."
    }
  ]
};

interface ClinicalPg4LabViewerProps {
  initialMode?: Pg4LabMode;
  height?: string;
  onNodeSelect?: (node: Pg4LabNode) => void;
}

export default function ClinicalPg4LabViewer({
  initialMode = "hie",
  height = "560px",
  onNodeSelect,
}: ClinicalPg4LabViewerProps) {
  const [activeMode, setActiveMode] = useState<Pg4LabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const currentNodes = useMemo(() => {
    return PG4_LAB_NODES[activeMode] || PG4_LAB_NODES.hie;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: Pg4LabNode) => {
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
            <Sparkles size={14} /> PG-604
          </span>
          <span className={styles.titleText}>
            {activeMode === "hie" && "Neonatal HIE: Sarnat Staging, 72h Therapeutic Hypothermia & Controlled Rewarming"}
            {activeMode === "pphn" && "Persistent Pulmonary Hypertension: Pre/Post SpO2, Oxygenation Index & iNO"}
            {activeMode === "lisa" && "Extreme Prematurity: Less Invasive Surfactant (LISA), CPAP & BPD Prevention"}
            {activeMode === "vis" && "Pediatric Septic Shock: Cold vs Warm Shock, VIS Score & Stress Hydrocortisone"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Pediatric & NICU Quiz"}
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
                  Neonatology / PICU Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Pediatric Protocol: {quizTargetNode.clinicalHallmarks}
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

          {/* Mode 1: HIE */}
          {activeMode === "hie" && (
            <div className={styles.proceduralCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Brain size={14} /> Neonatal HIE &amp; Therapeutic Hypothermia
                </span>
                <span className="text-[11px] text-slate-400">Sarnat 1-3 &bull; 33.5°C Core Target for 72h &bull; &le;0.5°C/h Rewarming &bull; aEEG Backgrounds</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">Sarnat Staging &amp; Cooling Criteria</div>
                  <div className="text-slate-300 mt-1">Sarnat Stage 2 (moderate: lethargy, hypotonia, seizures) or Stage 3 (severe: coma, flaccid). GA &ge;36w, birth wt &ge;1,800g, age &le;6h, and cord pH &le;7.00 / base deficit &ge;16.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">Cooling Protocol &amp; Rewarming Target</div>
                  <div className="text-slate-300 mt-1">Maintain core temp at 33.5°C (33.0-34.0°C) for 72 consecutive hours. Rewarm slowly at &le;0.5°C per hour over &ge;6h to prevent rebound seizures, hypotension, and ICH.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 2: PPHN */}
          {activeMode === "pphn" && (
            <div className={styles.proceduralCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <HeartPulse size={14} /> Persistent Pulmonary Hypertension (PPHN) &amp; iNO
                </span>
                <span className="text-[11px] text-slate-400">Pre/Post &Delta;SpO2 &ge;10% &bull; OI = (MAP x FiO2 x 100)/PaO2 &bull; iNO 20 ppm &bull; MetHb &lt;2.5%</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">Pre/Post-Ductal Gradient &amp; OI Metric</div>
                  <div className="text-slate-300 mt-1">Right hand (pre-ductal) SpO2 is &ge;10% higher than foot (post-ductal), proving right-to-left PDA shunting. Oxygenation Index OI &ge;25 indicates iNO; OI &ge;40 indicates Neonatal VA-ECMO.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">Inhaled Nitric Oxide (iNO) Protocol</div>
                  <div className="text-slate-300 mt-1">Start at 20 ppm; selectively dilates pulmonary arterioles via cGMP. Wean step-wise (5 ppm &rarr; 1 ppm) before stopping. Monitor blood Methemoglobin (keep MetHb &lt;2.5%).</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 3: LISA */}
          {activeMode === "lisa" && (
            <div className={styles.proceduralCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Wind size={14} /> Extreme Prematurity, LISA Surfactant &amp; BPD
                </span>
                <span className="text-[11px] text-slate-400">LISA on Nasal CPAP (6-8 cmH2O) &bull; Poractant Alfa 200 mg/kg &bull; Caffeine Citrate &bull; BPD 36w</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">Less Invasive Surfactant (LISA / MIST)</div>
                  <div className="text-slate-300 mt-1">Spontaneously breathing preterm on nasal CPAP (6-8 cmH2O) receives Poractant alfa (200 mg/kg = 2.5 mL/kg) via thin 16-18G catheter, avoiding endotracheal barotrauma.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">Caffeine Citrate &amp; BPD Prevention</div>
                  <div className="text-slate-300 mt-1">Caffeine citrate (20 mg/kg load, 5-10 mg/kg/d maintenance) stimulates breathing and facilitates extubation. Maintain SpO2 91-95% to prevent BPD at 36 weeks PMA.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 4: VIS */}
          {activeMode === "vis" && (
            <div className={styles.proceduralCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap size={14} /> Pediatric Septic Shock &amp; Vasoactive Scores
                </span>
                <span className="text-[11px] text-slate-400">Cold Shock (Epi) &bull; Warm Shock (Norepi) &bull; VIS &ge;20 Alert &bull; Stress Hydrocortisone</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">Cold vs Warm Pediatric Shock</div>
                  <div className="text-slate-300 mt-1">Cold shock (60-70%: low CO, high SVR, cap refill &gt;3s) &rarr; Epinephrine (0.05-0.3 mcg/kg/min). Warm shock (30-40%: high CO, low SVR, flash refill &lt;1s) &rarr; Norepinephrine.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">Vasoactive-Inotropic Score (VIS)</div>
                  <div className="text-slate-300 mt-1">VIS = Dopa + Dobut + 100(Epi) + 100(Norepi) + 10,000(Vaso) + 10(Milrinone). VIS &ge;20 denotes critical shock. Add Hydrocortisone (1-2 mg/kg Q6H) for catecholamine resistance.</div>
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
                    <span>Inspect Pediatric Protocol</span>
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
              Neonatology / PICU Fellow Inspector
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
            <div className={styles.inspectorLabel}>💡 Gold Standard NICU/PICU Pearls</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearls}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("hie")}
          className={`${styles.modeTab} ${activeMode === "hie" ? styles.modeTabActive : ""}`}
        >
          🧠 1. Neonatal HIE &amp; Cooling
        </button>
        <button
          onClick={() => setActiveMode("pphn")}
          className={`${styles.modeTab} ${activeMode === "pphn" ? styles.modeTabActive : ""}`}
        >
          🫁 2. PPHN &amp; Inhaled NO
        </button>
        <button
          onClick={() => setActiveMode("lisa")}
          className={`${styles.modeTab} ${activeMode === "lisa" ? styles.modeTabActive : ""}`}
        >
          👶 3. LISA Surfactant &amp; BPD
        </button>
        <button
          onClick={() => setActiveMode("vis")}
          className={`${styles.modeTab} ${activeMode === "vis" ? styles.modeTabActive : ""}`}
        >
          ⚡ 4. Pediatric Shock &amp; VIS
        </button>
      </div>
    </div>
  );
}
