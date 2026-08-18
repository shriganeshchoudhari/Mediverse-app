"use client";

import React, { useState, useMemo } from "react";
import styles from "./PediatricsAdvLabViewer.module.css";
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

export type PediatricsLabMode = "heart" | "respiratory" | "gi" | "immunometabolic";

export interface PediatricsLabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  pathophysiologyProfile: string;
  pathophysiology: string;
  clinicalHallmarks: string;
  highYieldPearls: string;
}

export const PEDIATRICS_LAB_NODES: Record<PediatricsLabMode, PediatricsLabNode[]> = {
  heart: [
    {
      id: "peds-ht-tof-spells",
      name: "Tetralogy of Fallot ToF (PROVe Tetrad & Squatting)",
      category: "Cyanotic 5 Ts",
      subType: "PROVe: Pulmonary Stenosis, RVH, Overriding Aorta, VSD • Boot-Shaped Heart • Squatting Reverses Shunt",
      pathophysiologyProfile: "Anterosuperior displacement of the infundibular septum creating severe right ventricular outflow tract obstruction.",
      pathophysiology: "Infundibular spasm diverts desaturated blood across VSD into aorta; squatting increases SVR, reversing shunt to Left-to-Right.",
      clinicalHallmarks: "'Tet spells' during crying/feeding with cyanosis; harsh systolic ejection murmur at left upper sternal border; boot-shaped heart (coeur en sabot).",
      highYieldPearls: "The severity of right ventricular outflow tract (pulmonary infundibular) stenosis dictates the degree of cyanosis in Tetralogy of Fallot."
    },
    {
      id: "peds-ht-tga-pge1",
      name: "Transposition of Great Arteries TGA (Egg-on-a-String & PGE1)",
      category: "Cyanotic 5 Ts",
      subType: "Aorta from RV, Pulm Artery from LV • Dual Parallel Circuits • 'Egg-on-a-String' CXR • Emergency PGE1 Infusion",
      pathophysiologyProfile: "Failure of the aorticopulmonary septum to spiral, creating two separate parallel circulatory loops.",
      pathophysiology: "Systemic venous blood continuously recirculates to the body without oxygenation; requires intercirculatory mixing for survival.",
      clinicalHallmarks: "Refractory cyanosis unresponsive to 100% hyperoxia; narrow mediastinum ('egg-on-a-string' CXR); immediate IV PGE1 (Alprostadil) -> Arterial Switch.",
      highYieldPearls: "D-TGA is the most common cause of cyanosis presenting in the FIRST 24 hours of life; maintain ductal patency with PGE1 immediately!"
    },
    {
      id: "peds-ht-coarctation-turner",
      name: "Coarctation of the Aorta (Turner Syndrome & Radio-Femoral Delay)",
      category: "Obstructive / Acyanotic",
      subType: "Juxtaductal Aortic Narrowing • Turner (45,X) • Radio-Femoral Pulse Delay • Rib Notching & Figure-3 Sign",
      pathophysiologyProfile: "Thickening and medial hyperplasia of the aortic wall near the insertion of the ductus arteriosus.",
      pathophysiology: "High resistance across stenosis causes upper extremity hypertension and hypoperfusion of the abdomen and lower extremities.",
      clinicalHallmarks: "Upper limb hypertension with diminished/delayed femoral pulses; cold feet, claudication; bilateral rib notching on CXR from dilated intercostals.",
      highYieldPearls: "Upper extremity hypertension with delayed femoral pulses + rib notching = Coarctation of the Aorta (associated with Turner Syndrome)."
    },
    {
      id: "peds-ht-pda-indomethacin",
      name: "Patent Ductus Arteriosus PDA (Machine Murmur & Indomethacin)",
      category: "Acyanotic Left-to-Right",
      subType: "Continuous 'Machine-Like' Murmur at Left Infraclavicular • Wide Pulse Pressure • Indomethacin Closure vs PGE1 Maintenance",
      pathophysiologyProfile: "Failure of smooth muscle constriction of the fetal ductus connecting the pulmonary artery to the descending aorta.",
      pathophysiology: "Aortic pressure exceeds pulmonary arterial pressure throughout both systole and diastole, producing continuous runoff.",
      clinicalHallmarks: "Bounding pulses, wide pulse pressure, hyperdynamic precordium, continuous machinery murmur; Indomethacin/Ibuprofen closes PDA.",
      highYieldPearls: "'Come IN and CLOSE the door' (Indomethacin closes PDA); 'KEEP open with Prostaglandin' (PGE1 keeps PDA open in cyanotic heart disease)."
    }
  ],

  respiratory: [
    {
      id: "peds-resp-rds-dppc",
      name: "Neonatal RDS Hyaline Membrane (Type II Surfactant DPPC)",
      category: "Surfactant Deficiency",
      subType: "Type II Alveolar Pneumocyte Immaturity • Prematurity (<34w) • Ground-Glass CXR • Antenatal Betamethasone + Postnatal Surfactant",
      pathophysiologyProfile: "Deficiency of dipalmitoylphosphatidylcholine (surfactant) elevates alveolar surface tension according to the Law of Laplace.",
      pathophysiology: "High surface tension precipitates diffuse microatelectasis, intrapulmonary shunting, hypoxia, and fibrin-rich hyaline membrane formation.",
      clinicalHallmarks: "Tachypnea, expiratory grunting, nasal flaring, subcostal retractions within 1 hour of birth; reticulogranular ground-glass CXR; surfactant + CPAP.",
      highYieldPearls: "Antenatal Corticosteroids (Betamethasone) administered to mothers at risk of preterm delivery stimulate fetal Type II pneumocyte surfactant synthesis."
    },
    {
      id: "peds-resp-ttn-fluid",
      name: "Transient Tachypnea of Newborn TTN (Elective C-Section Fluid Lag)",
      category: "Alveolar Fluid Resorption",
      subType: "Elective Cesarean Delivery • ENaC Fluid Resorption Lag • Fluid in Interlobar Fissures • Self-Resolves in 24-72h",
      pathophysiologyProfile: "Delayed clearance of fetal alveolar fluid due to absence of labor-induced catecholamine surge activating epithelial sodium channels.",
      pathophysiology: "Retained fluid in peribronchovascular spaces reduces lung compliance and stimulates tachypnea.",
      clinicalHallmarks: "Term infant delivered via elective C-section without labor presenting with mild-to-moderate tachypnea; CXR shows fluid in horizontal fissure.",
      highYieldPearls: "TTN occurs after elective C-section without labor; CXR shows fluid in fissures and perihilar streaking; resolves spontaneously in 24-72 hours."
    },
    {
      id: "peds-resp-mas-postterm",
      name: "Meconium Aspiration Syndrome MAS (Post-Term Vagal Gasping)",
      category: "Aspiration Pneumonitis",
      subType: "Post-Term (>41w) / Fetal Hypoxia • Vagal Gasping • Patchy Asymmetric Infiltrates • Risk of PPHN -> Inhaled Nitric Oxide (iNO)",
      pathophysiologyProfile: "Intrauterine fetal distress triggers vagal stimulation, anal sphincter relaxation, and deep gasping of meconium-laden amniotic fluid.",
      pathophysiology: "Meconium causes mechanical airway ball-valve obstruction, chemical pneumonitis, and surfactant inactivation.",
      clinicalHallmarks: "Post-term or SGA neonate with green-stained skin/cord, barrel chest, severe hypoxemia; coarse patchy infiltrates; iNO for PPHN.",
      highYieldPearls: "Meconium aspiration inactivates surfactant and causes ball-valve air trapping; major complication is Persistent Pulmonary Hypertension (PPHN)."
    },
    {
      id: "peds-resp-bpd-hyperoxia",
      name: "Bronchopulmonary Dysplasia BPD (Oxygen Toxicity & 36w PMA)",
      category: "Chronic Neonatal Lung Disease",
      subType: "Extreme Prematurity • Positive Pressure Ventilation & High FiO2 • Arrested Alveolarization • Oxygen Dependency at 36w PMA",
      pathophysiologyProfile: "Free radical oxygen toxicity and barotrauma/volutrauma interrupt secondary septation and alveolar capillary development.",
      pathophysiology: "Lungs develop simplified, enlarged alveolar structures with disordered capillary networks, causing chronic oxygen dependency.",
      clinicalHallmarks: "Persistent supplemental oxygen requirement at 36 weeks postmenstrual age in a very low birth weight preterm infant; cystic changes on CXR.",
      highYieldPearls: "BPD is defined as oxygen requirement at 36 weeks postmenstrual age; minimized by gentle ventilation and permissive hypercapnia."
    }
  ],

  gi: [
    {
      id: "peds-gi-ihps-alkalosis",
      name: "Infantile Pyloric Stenosis IHPS (Hypochloremic Alkalosis)",
      category: "Gastric Outlet Obstruction",
      subType: "3-6 Weeks Old • Non-Bilious Projectile Vomiting • Palpable 'Olive' Mass in RUQ • Hypochloremic Hypokalemic Alkalosis",
      pathophysiologyProfile: "Hypertrophy and hyperplasia of the circular smooth muscle layers of the pylorus.",
      pathophysiology: "Repetitive loss of gastric HCl leads to severe hypochloremic, hypokalemic metabolic alkalosis with paradoxical aciduria.",
      clinicalHallmarks: "Hungry vomiter, non-bilious projectile emesis, visible peristaltic waves, firm 2-cm olive mass; correct electrolytes BEFORE Ramstedt pyloromyotomy.",
      highYieldPearls: "Pyloric stenosis is a medical stabilization emergency, NOT an immediate surgical emergency; always correct alkalosis before surgery!"
    },
    {
      id: "peds-gi-intussusception-enema",
      name: "Intussusception Telescoping (Currant Jelly & Air Enema)",
      category: "Bowel Obstruction",
      subType: "6-36 Months Old • Colicky Pain (Legs to Chest) • 'Currant Jelly' Stools • Ultrasound Target Sign • Air Enema Reduction",
      pathophysiologyProfile: "Invagination of a bowel segment (usually terminal ileum into cecum) drawn forward by peristalsis.",
      pathophysiology: "Venous compression causes bowel wall ischemia, mucosal sloughing with blood and mucus ('currant jelly' stools), and potential perforation.",
      clinicalHallmarks: "Episodic severe abdominal pain with drawing up of legs, vomiting, sausage-shaped RUQ mass, currant jelly stools; US target sign; Air Enema reduction.",
      highYieldPearls: "Air or hydrostatic contrast enema is both DIAGNOSTIC and THERAPEUTIC in >85% of pediatric intussusceptions."
    },
    {
      id: "peds-gi-volvulus-ladd",
      name: "Midgut Malrotation & Volvulus (Bilious Vomiting & Ladd Surgery)",
      category: "Surgical Emergency",
      subType: "Neonate (1st Month) • SUDDEN BILIOUS (Green) Vomiting • Upper GI: 'Corkscrew' Duodenum • Emergency Ladd Procedure",
      pathophysiologyProfile: "Arrest of normal 270-degree counterclockwise embryonic midgut rotation leaving a narrow mesenteric base.",
      pathophysiology: "Entire small bowel twists around the superior mesenteric artery (SMA), precipitating acute midgut strangulation and necrosis.",
      clinicalHallmarks: "Healthy neonate suddenly develops dark green bilious vomiting and abdominal distension; Upper GI series shows corkscrew duodenum; Ladd procedure.",
      highYieldPearls: "Bilious (green) vomiting in a newborn is a surgical emergency until proven otherwise; rules out midgut volvulus via Upper GI series."
    },
    {
      id: "peds-gi-nec-pneumatosis",
      name: "Necrotizing Enterocolitis NEC (Pneumatosis Intestinalis)",
      category: "Neonatal Enteropathy",
      subType: "Preterm Low Birth Weight • Enteral Formula Feeding • Pneumatosis Intestinalis • Portal Venous Gas • Bowel Rest & Surgery",
      pathophysiologyProfile: "Immature intestinal mucosal barrier integrity combined with enteral bacterial colonization and microvascular ischemia.",
      pathophysiology: "Bacterial invasion into the submucosa produces gas (pneumatosis intestinalis) and transmural gangrenous necrosis.",
      clinicalHallmarks: "Preterm infant with abdominal distension, feeding intolerance, hematochezia, lethargy; X-ray shows pneumatosis and portal gas; bowel rest + antibiotics.",
      highYieldPearls: "Pneumatosis intestinalis (gas in bowel wall) and branching portal venous gas are pathognomonic radiological signs of NEC."
    }
  ],

  immunometabolic: [
    {
      id: "peds-imm-scid-thymus",
      name: "Severe Combined Immunodeficiency SCID (Absent Thymus)",
      category: "Primary Immunodeficiency",
      subType: "IL2RG / ADA Mutation • Absent T Cells (CD3+) • ABSENT THYMIC SHADOW on CXR • Severe Recurrent Infections • Bone Marrow Transplant",
      pathophysiologyProfile: "Defective common gamma chain cytokine signaling or adenosine deaminase (ADA) purine salvage toxicity arresting lymphocyte development.",
      pathophysiology: "Complete failure of T-cell maturation and secondary B-cell dysfunction leaves infant defenseless against all microbial classes.",
      clinicalHallmarks: "Severe recurrent viral, bacterial, fungal (Candida, PJP) infections, chronic diarrhea, failure to thrive, absent thymic shadow, lymphopenia; HSCT.",
      highYieldPearls: "Severe lymphopenia (<1,500/uL) + absent thymic shadow on CXR in an infant with opportunistic infections = SCID."
    },
    {
      id: "peds-imm-bruton-xla",
      name: "X-Linked Agammaglobulinemia Bruton (Absent CD19/20 B Cells)",
      category: "Primary Immunodeficiency",
      subType: "BTK (Bruton Tyrosine Kinase) • Defective Pre-B Maturation • ABSENT Mature B Cells (CD19/20) • Absent Tonsils • Low All Igs",
      pathophysiologyProfile: "Failure of pre-B cell receptor signaling preventing light chain gene rearrangement into mature B lymphocytes.",
      pathophysiology: "Complete absence of mature plasma cells eliminates all antibody isotypes (IgG, IgA, IgM, IgE) once maternal IgG wanes at 6-9 months.",
      clinicalHallmarks: "Male infant >6 months with recurrent pyogenic sinopulmonary infections (encapsulated bacteria) and Enterovirus; absent tonsils/lymph nodes; IVIG.",
      highYieldPearls: "Bruton XLA has ABSENT mature B cells (CD19/20) and absent tonsils; manifests after 6 months when transplacental maternal IgG decays."
    },
    {
      id: "peds-imm-pku-mousy",
      name: "Phenylketonuria PKU (Phenylalanine Hydroxylase & Mousy Odor)",
      category: "Inborn Error of Metabolism",
      subType: "PAH / BH4 Defect • Hyperphenylalaninemia • 'Musty' / 'Mousy' Body Odor • Fair Skin/Blue Eyes • Low Phenylalanine Diet",
      pathophysiologyProfile: "Inability to convert phenylalanine to tyrosine by hepatic phenylalanine hydroxylase.",
      pathophysiology: "Accumulated phenylalanine and neurotoxic metabolites (phenylacetate) impair brain myelin synthesis and neurotransmitter production.",
      clinicalHallmarks: "Severe intellectual disability, seizures, microcephaly, hypopigmentation (lack of tyrosine for melanin), mousy odor; newborn screening; low Phe diet.",
      highYieldPearls: "Musty/mousy body odor + fair hair/eyes + intellectual disability = PKU (Autosomal Recessive Phenylalanine Hydroxylase deficiency)."
    },
    {
      id: "peds-imm-galactosemia-cataracts",
      name: "Classic Galactosemia (GALT Defect, Oil-Drop Cataracts & E. Coli)",
      category: "Inborn Error of Metabolism",
      subType: "GALT Deficiency • Galactose-1-P & Galactitol Accumulation • Bilateral 'Oil-Drop' Cataracts • E. Coli Sepsis • Soy Formula",
      pathophysiologyProfile: "Deficiency of galactose-1-phosphate uridyltransferase arresting galactose metabolism from milk lactose.",
      pathophysiology: "Galactitol accumulation in the lens causes bilateral cataracts; galactose-1-P impairs liver function and neutrophil immunity against E. coli.",
      clinicalHallmarks: "Jaundice, hepatomegaly, failure to thrive, oil-drop cataracts, non-glucose reducing substances in urine, E. coli sepsis; immediate soy/lactose-free formula.",
      highYieldPearls: "Bilateral 'oil-drop' cataracts + hepatomegaly + E. coli sepsis following milk feeding = Classic Galactosemia (GALT deficiency)."
    }
  ]
};

interface PediatricsAdvLabViewerProps {
  initialMode?: PediatricsLabMode;
  height?: string;
  onNodeSelect?: (node: PediatricsLabNode) => void;
}

export default function PediatricsAdvLabViewer({
  initialMode = "heart",
  height = "560px",
  onNodeSelect,
}: PediatricsAdvLabViewerProps) {
  const [activeMode, setActiveMode] = useState<PediatricsLabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Heart Profiler State
  const [selectedHeart, setSelectedHeart] = useState<"tof" | "tga" | "coa" | "pda">("tof");

  // GI Profiler State
  const [selectedGi, setSelectedGi] = useState<"pyloric" | "intussusception" | "volvulus" | "nec">("pyloric");

  const heartDetails = useMemo(() => {
    if (selectedHeart === "tof") {
      return {
        title: "Tetralogy of Fallot (PROVe Tetrad)",
        indices: "Pulmonary Stenosis • RVH • Overriding Aorta • VSD • 'Boot-Shaped' Heart • Squatting Reversal",
        rx: "Knee-chest position / Squatting (increases SVR) + Oxygen + Morphine + Propranolol -> Surgical repair",
        pearl: "Pulmonary infundibular stenosis severity dictates the magnitude of right-to-left shunt and cyanosis."
      };
    } else if (selectedHeart === "tga") {
      return {
        title: "Transposition of the Great Arteries (TGA)",
        indices: "Dual Parallel Closed Circuits • 'Egg-on-a-String' Silhouette • Refractory Cyanosis",
        rx: "Continuous IV PGE1 (Alprostadil) infusion -> Balloon atrial septostomy -> Arterial switch surgery",
        pearl: "Most common cyanotic heart defect presenting in first 24 hours of life; maintain PDA with PGE1!"
      };
    } else if (selectedHeart === "coa") {
      return {
        title: "Coarctation of the Aorta (Turner Syndrome)",
        indices: "Upper Limb HTN • Radio-Femoral Delay • Rib Notching • Figure-3 Sign on Aorta",
        rx: "PGE1 in neonates with ductal shock; Balloon angioplasty / surgical resection for discrete coarctation",
        pearl: "Radio-femoral pulse delay + rib notching from dilated intercostal collaterals = Coarctation of Aorta."
      };
    } else {
      return {
        title: "Patent Ductus Arteriosus (PDA)",
        indices: "Continuous 'Machine-Like' Murmur • Wide Pulse Pressure • Bounding Pulses",
        rx: "Indomethacin / Ibuprofen to close PDA; Prostaglandin E1 to keep open in cyanotic heart lesions",
        pearl: "Indomethacin CLOSES the PDA; Prostaglandin E1 KEEPS the PDA open in ductal-dependent lesions."
      };
    }
  }, [selectedHeart]);

  const giDetails = useMemo(() => {
    if (selectedGi === "pyloric") {
      return {
        title: "Infantile Hypertrophic Pyloric Stenosis (IHPS)",
        indices: "3-6w Old • Non-Bilious Projectile Emesis • 'Olive' Mass • Hypochloremic Hypokalemic Alkalosis",
        rx: "IV Normal Saline + KCl electrolyte rehydration BEFORE Ramstedt pyloromyotomy surgery",
        pearl: "Pyloric stenosis is a medical resuscitation emergency, NOT an immediate surgical emergency."
      };
    } else if (selectedGi === "intussusception") {
      return {
        title: "Intussusception (Telescoping of Bowel)",
        indices: "6-36m Old • Cramping Colicky Pain (Legs to Chest) • 'Currant Jelly' Stools • US Target Sign",
        rx: "Air or Hydrostatic (Contrast/Saline) Enema reduction under ultrasound/fluoroscopy (>85% success)",
        pearl: "Air or hydrostatic enema is both DIAGNOSTIC and THERAPEUTIC in pediatric intussusception."
      };
    } else if (selectedGi === "volvulus") {
      return {
        title: "Midgut Malrotation with Volvulus",
        indices: "Neonate (1st mo) • SUDDEN BILIOUS (Green) Vomiting • Upper GI 'Corkscrew' Duodenum",
        rx: "Emergency surgical Ladd procedure (untwisting, division of Ladd bands, appendectomy)",
        pearl: "Bilious vomiting in a newborn is midgut volvulus until proven otherwise; emergency Ladd surgery."
      };
    } else {
      return {
        title: "Necrotizing Enterocolitis (NEC)",
        indices: "Preterm Low Birth Weight • Enteral Formula • Pneumatosis Intestinalis • Portal Venous Gas",
        rx: "Immediate bowel rest (NPO), NGT suction, IV broad-spectrum antibiotics; Laparotomy if perforation",
        pearl: "Pneumatosis intestinalis (gas in bowel wall) is the hallmark radiologic sign of necrotizing enterocolitis."
      };
    }
  }, [selectedGi]);

  const currentNodes = useMemo(() => {
    return PEDIATRICS_LAB_NODES[activeMode] || PEDIATRICS_LAB_NODES.heart;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: PediatricsLabNode) => {
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
            <HeartPulse size={14} /> PEDS-301
          </span>
          <span className={styles.titleText}>
            {activeMode === "heart" && "Congenital Heart Defects: Cyanotic (5 Ts: ToF, TGA) vs Acyanotic Shunts"}
            {activeMode === "respiratory" && "Neonatal Respiratory Distress: Surfactant RDS, TTN & Meconium Aspiration"}
            {activeMode === "gi" && "Pediatric GI Emergencies: Pyloric Stenosis (Alkalosis), Intussusception & Volvulus"}
            {activeMode === "immunometabolic" && "Pediatric Immunodeficiencies (SCID, Bruton) & Inborn Errors (PKU, Galactosemia)"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Pediatric Diagnostic Quiz"}
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
                <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                  Pediatrics Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Pediatric / Neonatal Disease: {quizTargetNode.clinicalHallmarks}
                </div>
                {quizFeedback && (
                  <div className="text-xs text-emerald-300 font-medium mt-1">{quizFeedback}</div>
                )}
              </div>
              <button
                onClick={nextQuizQuestion}
                className="px-3 py-1 bg-emerald-950 text-xs rounded border border-emerald-700 text-emerald-200"
              >
                Next
              </button>
            </div>
          )}

          {/* Mode 1: Congenital Heart Defects */}
          {activeMode === "heart" && (
            <div className={styles.pedsCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={14} /> Congenital Heart Defects &amp; Shunt Mechanics
                </span>
                <span className="text-[11px] text-slate-400">ToF &bull; TGA &bull; Coarctation &bull; PDA</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => setSelectedHeart("tof")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedHeart === "tof"
                      ? "bg-emerald-600 text-white border-emerald-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🥾 Tetralogy of Fallot
                </button>
                <button
                  onClick={() => setSelectedHeart("tga")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedHeart === "tga"
                      ? "bg-emerald-600 text-white border-emerald-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🥚 Transposition (PGE1)
                </button>
                <button
                  onClick={() => setSelectedHeart("coa")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedHeart === "coa"
                      ? "bg-emerald-600 text-white border-emerald-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🩺 Coarctation (Turner)
                </button>
                <button
                  onClick={() => setSelectedHeart("pda")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedHeart === "pda"
                      ? "bg-emerald-600 text-white border-emerald-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  ⚙️ PDA (Indomethacin)
                </button>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                <div className="text-sm font-bold text-emerald-300">{heartDetails.title}</div>
                <div className="text-teal-400 font-bold mt-1">{heartDetails.indices}</div>
                <div className="text-slate-300 mt-1"><strong className="text-emerald-400">Therapeutic Strategy:</strong> {heartDetails.rx}</div>
                <div className="text-yellow-300 font-semibold mt-1"><strong className="text-yellow-400">High-Yield Pearl:</strong> {heartDetails.pearl}</div>
              </div>
            </div>
          )}

          {/* Mode 2: Neonatal Respiratory Distress */}
          {activeMode === "respiratory" && (
            <div className={styles.pedsCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Flame size={14} /> Neonatal Respiratory Distress &amp; NICU Resuscitation
                </span>
                <span className="text-[11px] text-slate-400">Surfactant RDS &bull; TTN &bull; Meconium Aspiration &bull; BPD</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-emerald-300 font-bold">Surfactant Deficiency RDS (Hyaline Membrane)</div>
                  <div className="text-slate-300 mt-1">Preterm &lt;34w infant. Type II pneumocyte immaturity causes elevated surface tension. CXR shows diffuse reticulogranular ground-glass opacities with air bronchograms. Postnatal endotracheal surfactant + CPAP.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-emerald-300 font-bold">TTN vs Meconium Aspiration</div>
                  <div className="text-slate-300 mt-1">TTN occurs in term neonates after elective C-section due to delayed fluid clearance (fluid in fissures, resolves in 24-72h). MAS occurs in post-term neonates (patchy coarse infiltrates, risk of PPHN treated with inhaled Nitric Oxide).</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 3: Pediatric GI Emergencies */}
          {activeMode === "gi" && (
            <div className={styles.pedsCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield size={14} /> Pediatric Surgical &amp; GI Emergencies
                </span>
                <span className="text-[11px] text-slate-400">Pyloric Stenosis &bull; Intussusception &bull; Volvulus &bull; NEC</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => setSelectedGi("pyloric")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedGi === "pyloric"
                      ? "bg-emerald-600 text-white border-emerald-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🫒 Pyloric (Alkalosis)
                </button>
                <button
                  onClick={() => setSelectedGi("intussusception")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedGi === "intussusception"
                      ? "bg-emerald-600 text-white border-emerald-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🎯 Intussusception
                </button>
                <button
                  onClick={() => setSelectedGi("volvulus")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedGi === "volvulus"
                      ? "bg-emerald-600 text-white border-emerald-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🌀 Volvulus (Bilious)
                </button>
                <button
                  onClick={() => setSelectedGi("nec")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedGi === "nec"
                      ? "bg-emerald-600 text-white border-emerald-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  ⚡ NEC (Pneumatosis)
                </button>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                <div className="text-sm font-bold text-emerald-300">{giDetails.title}</div>
                <div className="text-teal-400 font-bold mt-1">{giDetails.indices}</div>
                <div className="text-slate-300 mt-1"><strong className="text-emerald-400">Clinical Protocol:</strong> {giDetails.rx}</div>
                <div className="text-yellow-300 font-semibold mt-1"><strong className="text-yellow-400">Diagnostic Rule:</strong> {giDetails.pearl}</div>
              </div>
            </div>
          )}

          {/* Mode 4: Immunodeficiencies & Inborn Errors */}
          {activeMode === "immunometabolic" && (
            <div className={styles.pedsCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap size={14} /> Primary Immunodeficiencies &amp; Inborn Errors
                </span>
                <span className="text-[11px] text-slate-400">SCID &bull; Bruton &bull; PKU &bull; Galactosemia</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-emerald-300 font-bold">SCID vs Bruton XLA</div>
                  <div className="text-slate-300 mt-1">SCID features absent T cells and ABSENT THYMIC SHADOW on CXR (severe opportunistic infections in early infancy). Bruton XLA features BTK defect, ABSENT mature CD19/20 B cells and absent tonsils (pyogenic infections after 6-9 months).</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-emerald-300 font-bold">PKU vs Classic Galactosemia</div>
                  <div className="text-slate-300 mt-1">PKU (PAH defect) causes intellectual disability, fair hair/eyes, and musty/mousy body odor. Galactosemia (GALT defect) causes jaundice, hepatomegaly, bilateral 'oil-drop' cataracts, and fatal E. coli neonatal sepsis upon milk feeding.</div>
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
                    <span className="text-emerald-400 font-bold">Pathophysiology:</span> {node.pathophysiologyProfile}
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

        {/* Right Side: High-Yield Pediatrics Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Pediatrics Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>👶 Pediatric Entity / Syndrome</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🔬 Embryology &amp; Pathophysiology</div>
            <div className="text-xs text-emerald-300 font-semibold">{activeNode.pathophysiologyProfile}</div>
            <div className={styles.inspectorBody}>{activeNode.pathophysiology}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🩺 Clinical Hallmarks &amp; Diagnostics</div>
            <div className={styles.inspectorBody}>{activeNode.clinicalHallmarks}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 Gold Standard Resuscitation Pearls</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearls}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("heart")}
          className={`${styles.modeTab} ${activeMode === "heart" ? styles.modeTabActive : ""}`}
        >
          ❤️ 1. Congenital Heart
        </button>
        <button
          onClick={() => setActiveMode("respiratory")}
          className={`${styles.modeTab} ${activeMode === "respiratory" ? styles.modeTabActive : ""}`}
        >
          🫁 2. Neonatal RDS &amp; NICU
        </button>
        <button
          onClick={() => setActiveMode("gi")}
          className={`${styles.modeTab} ${activeMode === "gi" ? styles.modeTabActive : ""}`}
        >
          🍽️ 3. Pediatric GI
        </button>
        <button
          onClick={() => setActiveMode("immunometabolic")}
          className={`${styles.modeTab} ${activeMode === "immunometabolic" ? styles.modeTabActive : ""}`}
        >
          🧬 4. Immuno &amp; Metabolic
        </button>
      </div>
    </div>
  );
}
