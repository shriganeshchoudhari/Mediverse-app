"use client";

import React, { useState, useMemo } from "react";
import styles from "./ClinicalPg5LabViewer.module.css";
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

export type Pg5LabMode = "ttts" | "fgr" | "afe" | "pmcd";

export interface Pg5LabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  proceduralProfile: string;
  proceduralMechanism: string;
  clinicalHallmarks: string;
  highYieldPearls: string;
}

export const PG5_LAB_NODES: Record<Pg5LabMode, Pg5LabNode[]> = {
  ttts: [
    {
      id: "pg5-tt-quintero-staging-system",
      name: "Quintero Clinical Staging of TTTS (Stage I Oligo/Poly to Stage IV Fetal Hydrops)",
      category: "Quintero Staging",
      subType: "Stage I (DVP &lt;2 / &gt;8cm) &bull; Stage II (Empty Bladder &gt;60m) &bull; Stage III (Abnormal Dopplers) &bull; Stage IV (Hydrops)",
      proceduralProfile: "Standardized ultrasound classification of Twin-to-Twin Transfusion Syndrome severity in monochorionic twins.",
      proceduralMechanism: "Unidirectional deep arteriovenous (AV) cotyledonary shunts drain donor blood volume into the hypervolemic recipient.",
      clinicalHallmarks: "Stage I: DVP <2cm (donor) / >8cm (recipient); Stage II: donor bladder invisible >60m; Stage III: UA AREDF / DV reversed a-wave.",
      highYieldPearls: "Quintero Stage II requires an empty/invisible donor bladder >60 min; Stages II-IV between 16-26w mandate laser ablation."
    },
    {
      id: "pg5-tt-solomon-laser-photocoagulation",
      name: "Solomon Fetoscopic Laser Photocoagulation (Selective Coagulation of AV Anastomoses along Vascular Equator)",
      category: "Fetoscopic Laser",
      subType: "Diode Laser (20-40W) &bull; 16-26 Weeks Gestation &bull; Continuous Equatorial Line &bull; Prevents TAPS & Residual Shunts",
      proceduralProfile: "Definitive surgical therapy functionally dichorionizing the placenta to halt unbalanced inter-twin transfusion.",
      proceduralMechanism: "Endoscopic diode laser photocoagulates all connecting AV, VA, AA, and VV vessels across the entire vascular equator.",
      clinicalHallmarks: "Introduced via 3.3mm curved fetoscope into recipient sac; coagulates individual anastomoses then draws continuous line across equator.",
      highYieldPearls: "Solomon fetoscopic laser photocoagulation at 16-26 weeks is the gold-standard treatment for Quintero Stages II-IV TTTS."
    },
    {
      id: "pg5-tt-twin-anemia-polycythemia-sequence",
      name: "Twin Anemia-Polycythemia Sequence (TAPS) (MCA-PSV Concordance & Reticulocyte Discrepancies)",
      category: "TAPS Surveillance",
      subType: "Donor MCA-PSV &gt;1.5 MoM (Severe Anemia) &bull; Recipient MCA-PSV &lt;1.0 MoM (Polycythemia) &bull; Normal Amniotic Fluid Volumes",
      proceduralProfile: "Chronic slow-flow inter-twin transfusion through tiny (<1mm) AV anastomoses causing marked hemoglobin discordance.",
      proceduralMechanism: "Slow erythrocyte transfusion creates severe donor anemia and recipient hyperviscosity without amniotic fluid discrepancies.",
      clinicalHallmarks: "Donor MCA Peak Systolic Velocity >1.5 MoM with recipient MCA-PSV <1.0 MoM; normal DVP in both amniotic sacs.",
      highYieldPearls: "TAPS is characterized by large hemoglobin discordance (donor MCA-PSV >1.5 MoM, recipient <1.0 MoM) with normal amniotic fluids."
    },
    {
      id: "pg5-tt-monochorionic-vascular-angioarchitecture",
      name: "Monochorionic Vascular Angioarchitecture (Deep Cotyledonary AV Shunts vs Superficial AA/VV Anastomoses)",
      category: "Angioarchitecture",
      subType: "Deep Cotyledonary AV Anastomoses (Unidirectional, Pathogenic) &bull; Superficial AA / VV Shunts (Bidirectional, Protective)",
      proceduralProfile: "Placental vascular anatomy underlying monochorionic shared hemodynamics and discordant twin pathology.",
      proceduralMechanism: "Deep AV anastomoses within shared cotyledons allow unidirectional blood flow; superficial AA shunts provide compensatory balance.",
      clinicalHallmarks: "Inspect placental vascular equator for paired artery-vein cotyledons; absence of superficial AA shunts predisposes to acute TTTS.",
      highYieldPearls: "Deep AV anastomoses within shared placental cotyledons drive TTTS; superficial AA anastomoses provide protective hemodynamic balance."
    }
  ],

  fgr: [
    {
      id: "pg5-fg-umbilical-artery-end-diastolic-flow",
      name: "Umbilical Artery End-Diastolic Flow (Normal PI to AEDF to Reversed REDF >70% Loss)",
      category: "UA Doppler",
      subType: "Elevated PI (&gt;95th%) &bull; Absent End-Diastolic Flow (AEDF) &bull; Reversed End-Diastolic Flow (REDF &gt;70% Obliteration)",
      proceduralProfile: "Arterial Doppler velocimetry indexing placental villous microvascular obliteration and afterload.",
      proceduralMechanism: "Progressive destruction of tertiary placental stem villi increases downstream resistance, reducing and reversing diastolic flow.",
      clinicalHallmarks: "AEDF indicates >50-60% obliteration (deliver at 33-34w); REDF indicates >70% obliteration (deliver at 30-32w after steroids).",
      highYieldPearls: "Umbilical Artery Reversed End-Diastolic Flow (REDF) indicates >70% placental bed obliteration; deliver at 30-32 weeks after steroids."
    },
    {
      id: "pg5-fg-mca-brain-sparing-autoregulation",
      name: "Middle Cerebral Artery Brain-Sparing Autoregulation (Low MCA-PI <5th% & Cerebroplacental Ratio CPR <1.08)",
      category: "MCA Vasodilation",
      subType: "MCA-PI &lt;5th Percentile &bull; Cerebroplacental Ratio CPR = MCA-PI / UA-PI &lt;1.08 &bull; Hypoxia-Induced Cerebral Vasodilation",
      proceduralProfile: "Fetal autoregulatory hemodynamic defense prioritizing cerebral, coronary, and adrenal perfusion during hypoxemia.",
      proceduralMechanism: "Fetal chemoreceptor stimulation triggers cerebral arteriolar vasodilation to protect cortical oxygen delivery.",
      clinicalHallmarks: "Decreased MCA Pulsatility Index with abnormal CPR <1.08; signals progressive placental insufficiency requiring intensified surveillance.",
      highYieldPearls: "Cerebroplacental Ratio CPR = MCA-PI / UA-PI <1.08 confirms fetal brain-sparing vasodilation in response to chronic hypoxia."
    },
    {
      id: "pg5-fg-ductus-venosus-a-wave-dynamics",
      name: "Ductus Venosus a-Wave Dynamics (Reversed a-Wave During Atrial Contraction & Emergency Delivery)",
      category: "Ductus Venosus",
      subType: "Precordial Venous Doppler &bull; Absent or Reversed a-Wave During Atrial Systole &bull; Severe Right Ventricular Acidemia",
      proceduralProfile: "Precordial venous Doppler waveform indexing fetal myocardial cardiac compliance and systemic acidemia.",
      proceduralMechanism: "High central venous pressure and RV end-diastolic pressure transmit retrograde flow through the ductus venosus during atrial systole.",
      clinicalHallmarks: "Reversed DV a-wave reflects severe metabolic acidemia (pH <7.20); absolute indication for emergency delivery at >=26-28 weeks.",
      highYieldPearls: "Ductus Venosus reversed a-wave during atrial contraction indicates severe fetal myocardial acidosis and triggers emergency delivery."
    },
    {
      id: "pg5-fg-truffle-trial-delivery-trigger",
      name: "The TRUFFLE Trial Delivery Trigger Strategy (Computerized CTG STV <3.5ms & DV a-Wave Reversal)",
      category: "TRUFFLE Protocol",
      subType: "Computerized CTG Short-Term Variation (STV &lt;3.5ms) &bull; Ductus Venosus a-Wave Reversal &bull; Maximize Intact Survival",
      proceduralProfile: "Evidence-based surveillance and delivery timing algorithm for early-onset FGR between 26 and 32 weeks.",
      proceduralMechanism: "Awaiting DV late changes or cCTG STV reduction avoids premature delivery while preventing stillbirth.",
      clinicalHallmarks: "Deliver when DV a-wave is persistently absent/reversed or cCTG STV <3.5 ms; give Betamethasone 12mg IM and MgSO4 neuroprotection.",
      highYieldPearls: "TRUFFLE trial established that waiting for DV a-wave reversal or cCTG STV <3.5 ms maximizes intact neurological survival at 2 years."
    }
  ],

  afe: [
    {
      id: "pg5-af-biphasic-pathophysiology-collapse",
      name: "Biphasic Pathophysiology of Amniotic Fluid Embolism (Phase 1 Acute Pulmonary Vasospasm/RV Failure vs Phase 2 DIC)",
      category: "AFE Biphasic",
      subType: "Phase 1 (Acute Pulmonary Hypertension, RV Failure & Arrest) &bull; Phase 2 (LV Dysfunction & Consumptive DIC Coagulopathy)",
      proceduralProfile: "Catastrophic obstetric emergency triggered by fetal antigen entry into maternal venous circulation during labor/delivery.",
      proceduralMechanism: "Fetal debris triggers anaphylactoid pulmonary vasospasm and acute cor pulmonale, followed by systemic endothelial lysis and DIC.",
      clinicalHallmarks: "Sudden hypoxia, cyanosis, cardiovascular collapse, seizures, followed by massive uterine atony and microvascular bleeding.",
      highYieldPearls: "AFE is a biphasic anaphylactoid syndrome: Phase 1 acute pulmonary vasospasm and RV failure; Phase 2 LV failure and fulminant DIC."
    },
    {
      id: "pg5-af-aok-resuscitation-protocol",
      name: "The A-OK Resuscitation Protocol (Atropine 1mg, Ondansetron 8mg, Ketorolac 30mg IV)",
      category: "A-OK Protocol",
      subType: "Atropine (0.8-1.0 mg IV Vagolytic) &bull; Ondansetron (8 mg IV 5-HT3 Antagonist) &bull; Ketorolac (30 mg IV COX Inhibitor)",
      proceduralProfile: "Targeted three-drug pharmacotherapeutic bundle designed to halt neurohumoral collapse and platelet lysis in AFE.",
      proceduralMechanism: "Atropine blocks vagal bradycardia; Ondansetron blocks serotonin 5-HT3 pulmonary collapse; Ketorolac halts thromboxane A2 release.",
      clinicalHallmarks: "Administer Atropine 1mg + Ondansetron 8mg + Ketorolac 30mg IV push immediately upon clinical suspicion of AFE alongside CPR.",
      highYieldPearls: "The A-OK protocol for AFE consists of Atropine 1mg, Ondansetron 8mg, and Ketorolac 30mg IV given immediately to halt collapse."
    },
    {
      id: "pg5-af-consumptive-coagulopathy-fibrinogen",
      name: "Consumptive Coagulopathy & Fibrinogen Rescue (Cryoprecipitate Target Fibrinogen >200 mg/dL & TXA)",
      category: "AFE DIC Rescue",
      subType: "Severe Hypofibrinogenemia (&lt;100 mg/dL) &bull; Cryoprecipitate (10-20 units, Target &gt;200 mg/dL) &bull; TXA 1g IV within &lt;3h",
      proceduralProfile: "Aggressive hemostatic resuscitation counteracting fulminant hyperfibrinolysis and factor consumption in Phase 2 AFE.",
      proceduralMechanism: "Massive tPA release and procoagulant activation consume fibrinogen, causing total hemostatic failure and massive PPH.",
      clinicalHallmarks: "Administer Cryoprecipitate to maintain Fibrinogen >200 mg/dL; infuse TXA 1g IV over 10 min; execute 1:1:1 balanced MTP.",
      highYieldPearls: "In AFE-induced DIC, maintain Fibrinogen >200 mg/dL using Cryoprecipitate and administer IV Tranexamic Acid (TXA 1g)."
    },
    {
      id: "pg5-af-va-ecmo-obstetric-collapse",
      name: "Extracorporeal Membrane Oxygenation (VA-ECMO in Refractory Obstetric Cardiopulmonary Collapse)",
      category: "Obstetric ECMO",
      subType: "Peripheral Veno-Arterial (VA) ECMO &bull; Femoral-Femoral Cannulation &bull; Refractory RV Failure & E-CPR Rescue",
      proceduralProfile: "Mechanical circulatory and respiratory rescue for refractory cardiogenic shock and cardiac arrest in maternal collapse.",
      proceduralMechanism: "Decompresses the failing right ventricle and provides oxygenated retrograde perfusion to the aorta and coronary arteries.",
      clinicalHallmarks: "Indicated when maternal arrest or cardiogenic shock fails conventional CPR and high-dose inotropes; mobilize ECMO cannulation.",
      highYieldPearls: "Veno-Arterial (VA) ECMO provides life-saving circulatory rescue in refractory maternal cardiac arrest and acute RV failure from AFE."
    }
  ],

  pmcd: [
    {
      id: "pg5-pm-aortocaval-compression-hemodynamics",
      name: "Aortocaval Compression & Maternal Hemodynamics (>=20 Weeks Gestation Decreases Venous Return 60%)",
      category: "Aortocaval Relief",
      subType: "Fundus at/above Umbilicus (&ge;20 Weeks) &bull; Compresses IVC & Aorta &bull; Decreases Venous Return by 60% & Nullifies CPR",
      proceduralProfile: "Anatomical vascular obstruction by the gravid uterus causing profound supine hypotensive syndrome during cardiac arrest.",
      proceduralMechanism: "The heavy gravid uterus compresses the low-pressure IVC against the lumbar spine, preventing blood return to the heart.",
      clinicalHallmarks: "In maternal cardiac arrest at >=20 weeks, closed-chest compressions generate <10% normal cardiac output unless IVC is relieved.",
      highYieldPearls: "At >=20 weeks gestation, the gravid uterus compresses the IVC, reducing venous return by 60% and rendering CPR ineffective."
    },
    {
      id: "pg5-pm-4-minute-rule-5-minute-delivery",
      name: "The 4-Minute Rule & 5-Minute Delivery Standard (Refractory Arrest at 4 min & Complete Delivery at 5 min)",
      category: "4-Minute Rule",
      subType: "Decision to Incise at 4 Minutes of Arrest &bull; Complete Fetal Extraction by 5 Minutes &bull; Restores 30-40% Maternal Cardiac Output",
      proceduralProfile: "Time-critical obstetric standard governing the execution of Resuscitative Hysterotomy in maternal cardiac arrest.",
      proceduralMechanism: "Uterine evacuation instantly decompresses the IVC and autotransfuses blood into the central circulation, driving maternal ROSC.",
      clinicalHallmarks: "If maternal arrest is refractory to CPR at 4 minutes, perform immediate bedside hysterotomy aiming for delivery by 5 minutes.",
      highYieldPearls: "Resuscitative hysterotomy must begin at 4 minutes of refractory maternal arrest, achieving delivery by 5 minutes to allow ROSC."
    },
    {
      id: "pg5-pm-left-uterine-displacement-technique",
      name: "Manual Left Lateral Uterine Displacement (LUD) (Displacing Uterus off Retroperitoneum During Uninterrupted CPR)",
      category: "Manual LUD",
      subType: "Two-Handed Cupping or One-Handed Push Technique &bull; Displaces Gravid Uterus Leftward &bull; Preserves Supine Sternal Angle",
      proceduralProfile: "First-line maternal positioning maneuver executed continuously during all resuscitation efforts.",
      proceduralMechanism: "Manually pushes the gravid uterus leftward off the inferior vena cava while maintaining the patient flat on the back for chest compressions.",
      clinicalHallmarks: "Dedicated provider stands on patient's right and pushes uterus leftward or stands on left and pulls uterus leftward during CPR.",
      highYieldPearls: "Manual Left Uterine Displacement (LUD) is preferred over whole-body tilting because it allows flat, high-quality chest compressions."
    },
    {
      id: "pg5-pm-bedside-surgical-execution",
      name: "Bedside Resuscitative Hysterotomy Execution (Immediate Laparotomy at Bedside Without Transfer or Prep)",
      category: "PMCD Execution",
      subType: "Perform Directly at Site of Arrest &bull; No Sterile Drapes / No Antiseptic Prep &bull; Rapid Vertical Scalpel Incision & Delivery",
      proceduralProfile: "Emergency operative technique prioritizing rapid maternal decompression over standard sterile precautions.",
      proceduralMechanism: "Direct midline vertical laparotomy and hysterotomy provides fastest access to empty the uterine cavity within 60 seconds.",
      clinicalHallmarks: "Scalpel midline incision from symphysis to umbilicus; enter peritoneal cavity; vertical uterine incision; extract infant; pack uterus.",
      highYieldPearls: "Resuscitative hysterotomy is performed directly at the arrest site without moving to an OR, without sterile drapes, and without prep."
    }
  ]
};

interface ClinicalPg5LabViewerProps {
  initialMode?: Pg5LabMode;
  height?: string;
  onNodeSelect?: (node: Pg5LabNode) => void;
}

export default function ClinicalPg5LabViewer({
  initialMode = "ttts",
  height = "560px",
  onNodeSelect,
}: ClinicalPg5LabViewerProps) {
  const [activeMode, setActiveMode] = useState<Pg5LabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const currentNodes = useMemo(() => {
    return PG5_LAB_NODES[activeMode] || PG5_LAB_NODES.ttts;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: Pg5LabNode) => {
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
            <Sparkles size={14} /> PG-605
          </span>
          <span className={styles.titleText}>
            {activeMode === "ttts" && "Monochorionic Twins: TTTS Quintero Staging, Solomon Laser & TAPS Surveillance"}
            {activeMode === "fgr" && "Early-Onset FGR: Umbilical AREDF, MCA Brain Sparing & Ductus Venosus a-Wave"}
            {activeMode === "afe" && "Amniotic Fluid Embolism: Biphasic Collapse, The A-OK Protocol & DIC Rescue"}
            {activeMode === "pmcd" && "Resuscitative Hysterotomy: 4-Minute Decision, 5-Minute Delivery & Aortocaval Relief"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Obstetrics & Fetal Quiz"}
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
                  MFM / Maternal Critical Care Challenge • Score: {quizScore.correct} / {quizScore.total}
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

          {/* Mode 1: TTTS */}
          {activeMode === "ttts" && (
            <div className={styles.proceduralCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Baby size={14} /> Monochorionic Twins, TTTS &amp; Fetoscopic Laser
                </span>
                <span className="text-[11px] text-slate-400">Quintero Stages I-V &bull; Solomon Laser 16-26w &bull; TAPS MCA-PSV &bull; Deep AV Shunts</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">Quintero Staging Sequence</div>
                  <div className="text-slate-300 mt-1">Stage I: Donor DVP &lt;2cm / Recipient &gt;8cm. Stage II: Empty donor bladder &gt;60 min. Stage III: Abnormal Dopplers (UA AREDF / DV reversed a-wave). Stage IV: Fetal hydrops.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">Solomon Laser Technique</div>
                  <div className="text-slate-300 mt-1">Fetoscopic diode laser photocoagulation (16-26 weeks) selectively ablates all communicating AV anastomoses along the vascular equator, functionally dividing the placenta.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 2: FGR */}
          {activeMode === "fgr" && (
            <div className={styles.proceduralCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={14} /> Early-Onset FGR &amp; Doppler Velocimetry Triad
                </span>
                <span className="text-[11px] text-slate-400">UA REDF (&gt;70% Loss) &bull; MCA Brain Sparing (CPR &lt;1.08) &bull; DV Reversed a-Wave &bull; TRUFFLE Trial</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">UA AREDF &amp; MCA Vasodilation</div>
                  <div className="text-slate-300 mt-1">Umbilical artery REDF indicates &gt;70% placental obliteration. MCA brain-sparing vasodilation (CPR &lt;1.08) redistributes cardiac output to protect vital cerebral cortex.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">Ductus Venosus (DV) &amp; TRUFFLE Trigger</div>
                  <div className="text-slate-300 mt-1">Reversed DV a-wave during atrial contraction indicates severe RV myocardial diastolic failure and acidosis; mandates emergency delivery at &ge;26-28 weeks (TRUFFLE trial).</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 3: AFE */}
          {activeMode === "afe" && (
            <div className={styles.proceduralCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert size={14} /> Amniotic Fluid Embolism &amp; The A-OK Protocol
                </span>
                <span className="text-[11px] text-slate-400">Biphasic Collapse &bull; A-OK (Atropine, Ondansetron, Ketorolac) &bull; Fibrinogen &gt;200 mg/dL &bull; VA-ECMO</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">Biphasic Pathophysiology of AFE</div>
                  <div className="text-slate-300 mt-1">Phase 1: Acute pulmonary vasospasm, pulmonary HTN, and acute RV failure / arrest. Phase 2: LV failure, flash pulmonary edema, and fulminant consumptive DIC coagulopathy.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">The A-OK Resuscitation Bundle</div>
                  <div className="text-slate-300 mt-1">Administer Atropine (1mg IV vagolytic), Ondansetron (8mg IV 5-HT3 blocker), and Ketorolac (30mg IV COX inhibitor) immediately to interrupt the fatal cardiopulmonary cascade.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 4: PMCD */}
          {activeMode === "pmcd" && (
            <div className={styles.proceduralCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap size={14} /> Resuscitative Hysterotomy / PMCD Standards
                </span>
                <span className="text-[11px] text-slate-400">Aortocaval Relief &bull; 4-Minute Decision &bull; 5-Minute Delivery &bull; Bedside Execution &bull; Manual LUD</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">Aortocaval Compression Physiology</div>
                  <div className="text-slate-300 mt-1">Uterus &ge;20 weeks compresses IVC/Aorta, reducing venous return by 60% and nullifying CPR. Uterine evacuation increases maternal cardiac output by 30-40%, allowing ROSC.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">4-Minute Incision &amp; 5-Minute Delivery</div>
                  <div className="text-slate-300 mt-1">If maternal arrest is refractory at 4 minutes, begin bedside laparotomy immediately without transferring to OR, delivering the fetus by 5 minutes to save maternal life.</div>
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
                    <span>Inspect Obstetric Protocol</span>
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
              MFM / Maternal Critical Care Inspector
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
            <div className={styles.inspectorLabel}>💡 Gold Standard MFM Pearls</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearls}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("ttts")}
          className={`${styles.modeTab} ${activeMode === "ttts" ? styles.modeTabActive : ""}`}
        >
          👶 1. TTTS &amp; Laser Surgery
        </button>
        <button
          onClick={() => setActiveMode("fgr")}
          className={`${styles.modeTab} ${activeMode === "fgr" ? styles.modeTabActive : ""}`}
        >
          📈 2. FGR &amp; Ductus Venosus
        </button>
        <button
          onClick={() => setActiveMode("afe")}
          className={`${styles.modeTab} ${activeMode === "afe" ? styles.modeTabActive : ""}`}
        >
          🛡️ 3. AFE &amp; A-OK Protocol
        </button>
        <button
          onClick={() => setActiveMode("pmcd")}
          className={`${styles.modeTab} ${activeMode === "pmcd" ? styles.modeTabActive : ""}`}
        >
          ⚡ 4. Resuscitative Hysterotomy
        </button>
      </div>
    </div>
  );
}
