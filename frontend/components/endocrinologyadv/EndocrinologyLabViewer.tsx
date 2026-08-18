"use client";

import React, { useState, useMemo } from "react";
import styles from "./EndocrinologyLabViewer.module.css";
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

export type EndocrinologyLabMode = "adrenal" | "thyroid" | "calcium" | "men";

export interface EndocrinologyLabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  endocrineProfile: string;
  pathophysiology: string;
  clinicalHallmarks: string;
  highYieldPearls: string;
}

export const ENDOCRINOLOGY_LAB_NODES: Record<EndocrinologyLabMode, EndocrinologyLabNode[]> = {
  adrenal: [
    {
      id: "endo-adr-cushing-dst",
      name: "Cushing Syndrome High-Dose DST (Pituitary vs Ectopic)",
      category: "Adrenal Hyperfunction",
      subType: "High-Dose (8 mg) Dexamethasone • Pituitary Suppresses >50% • Ectopic SCLC Fails Suppression",
      endocrineProfile: "Excessive autonomous glucocorticoid production leading to truncal obesity, purple abdominal striae, and muscle wasting.",
      pathophysiology: "Pituitary adenomas (Cushing disease) retain partial negative feedback and suppress cortisol with 8 mg dexamethasone; ectopic tumors do not.",
      clinicalHallmarks: "Hypertension, moon facies, buffalo hump, hyperglycemia, osteopenia; diagnosis via 24h UFC, late-night salivary cortisol, and DST.",
      highYieldPearls: "High-dose DST suppresses cortisol >50% in Cushing Disease (pituitary), but fails to suppress cortisol in Ectopic ACTH (Small Cell Lung Cancer)."
    },
    {
      id: "endo-adr-addison-cosyntropin",
      name: "Primary Adrenal Insufficiency Addison (Cortisol & Aldosterone)",
      category: "Adrenal Hypofunction",
      subType: "Autoimmune Adrenalitis • Cortisol + Aldosterone Deficit • High ACTH Hyperpigmentation • Cosyntropin <18",
      endocrineProfile: "Destruction of all three adrenal cortical zones resulting in combined glucocorticoid, mineralocorticoid, and androgen deficits.",
      pathophysiology: "Loss of negative feedback triggers high pro-opiomelanocortin (POMC) cleavage to ACTH and MSH, causing cutaneous hyperpigmentation.",
      clinicalHallmarks: "Hypotension, fatigue, hyperpigmentation of palmar creases and oral mucosa, hyponatremia, hyperkalemia, non-anion gap metabolic acidosis.",
      highYieldPearls: "Primary (Addison) has high ACTH, hyperpigmentation, and hyperkalemia; Secondary has low ACTH, pale skin, and normal potassium (RAAS intact)."
    },
    {
      id: "endo-adr-conn-arr",
      name: "Primary Hyperaldosteronism Conn (Aldo-to-Renin Ratio ARR)",
      category: "Mineralocorticoid Excess",
      subType: "Aldosterone-Producing Adenoma (60%) • ARR >20-30 • Hypokalemic Metabolic Alkalosis • Spironolactone",
      endocrineProfile: "Autonomous hypersecretion of aldosterone from zona glomerulosa driving cortical collecting duct sodium reabsorption and potassium wasting.",
      pathophysiology: "Increased ENaC and H+-ATPase activity in renal tubules causes sodium retention, severe hypertension, hypokalemia, and metabolic alkalosis.",
      clinicalHallmarks: "Refractory hypertension, muscle weakness, polyuria; ARR >20-30 with plasma aldosterone >15 ng/dL; adrenalectomy or Spironolactone.",
      highYieldPearls: "Screen for Conn syndrome with Aldosterone-to-Renin Ratio (ARR >20-30); unilateral adenoma -> surgery; bilateral hyperplasia -> eplerenone/spironolactone."
    },
    {
      id: "endo-adr-pheo-blockade",
      name: "Pheochromocytoma (Alpha-Blockade BEFORE Beta-Blockade!)",
      category: "Adrenal Medullary Chromaffin",
      subType: "24h Urinary Metanephrines • Paroxysmal 5 Ps • Mandatory Phenoxybenzamine 10-14 Days Before Beta-Blocker",
      endocrineProfile: "Hypersecretion of catecholamines (norepinephrine, epinephrine) by adrenal medulla chromaffin cell tumor.",
      pathophysiology: "Surges of catecholamines trigger profound vasoconstriction and tachycardia, precipitating hypertensive emergencies.",
      clinicalHallmarks: "Paroxysmal headache, sweating, palpitations, pallor, malignant hypertension; 24h fractionated metanephrines.",
      highYieldPearls: "CRITICAL: Always give an alpha-blocker (Phenoxybenzamine) FIRST for 10-14 days BEFORE giving a beta-blocker to prevent lethal unopposed alpha-vasoconstriction!"
    }
  ],

  thyroid: [
    {
      id: "endo-thy-graves-raiu",
      name: "Graves Disease Thyrotoxicosis (TSI & Diffuse High RAIU)",
      category: "Autoimmune Hyperthyroidism",
      subType: "Thyroid-Stimulating Immunoglobulin (TSI+) • Diffuse Homogeneous RAIU • Exophthalmos • Pretibial Myxedema",
      endocrineProfile: "Autoantibody binding to TSH receptors induces autonomous synthesis and release of thyroid hormones T3 and T4.",
      pathophysiology: "Retro-orbital and dermal fibroblasts express TSH receptors; cytokine activation produces glycosaminoglycan accumulation and proptosis.",
      clinicalHallmarks: "Weight loss, heat intolerance, tremor, palpitations, proptosis, localized pretibial dermopathy, thyroid bruit; Methimazole/RAI.",
      highYieldPearls: "Graves has diffuse high RAIU uptake and TSI antibodies; Subacute thyroiditis has low/absent RAIU and painful tender goiter."
    },
    {
      id: "endo-thy-storm-protocol",
      name: "Thyroid Storm 4-Step Emergency Protocol (Sequential)",
      category: "Thyrotoxic Crisis",
      subType: "Hyperpyrexia >40°C • Atrial Fibrillation • Step 1: Beta-Blocker -> Step 2: PTU -> Step 3: Lugol Iodine -> Step 4: Hydrocortisone",
      endocrineProfile: "Decompensated hypermetabolic storm triggered by infection, trauma, or surgery in poorly controlled thyrotoxicosis.",
      pathophysiology: "Extreme adrenergic hyperactivity and tissue saturation with free triiodothyronine (T3) precipitating high-output circulatory failure.",
      clinicalHallmarks: "Temp >40°C, tachycardia >140 bpm, delirium, jaundice; immediate 4-step medical resuscitation; aspirin strictly contraindicated.",
      highYieldPearls: "Lugol iodine / SSKI MUST be delayed >=1 hour AFTER thionamide (PTU) to prevent iodine from fueling new hormone synthesis!"
    },
    {
      id: "endo-thy-hashimoto-lymphoma",
      name: "Hashimoto Chronic Lymphocytic (Anti-TPO & Hürthle Cells)",
      category: "Autoimmune Hypothyroidism",
      subType: "Anti-TPO & Anti-Tg Antibodies • Germinal Centers & Hürthle Cells • Primary Thyroid B-Cell Lymphoma Risk",
      endocrineProfile: "CD4+ and CD8+ T-cell mediated destruction of thyroid follicular cells leading to chronic primary hypothyroidism.",
      pathophysiology: "Dense lymphocytic infiltrate with lymphoid germinal centers; follicular cells transform into oxyphilic, eosinophilic Hürthle cells.",
      clinicalHallmarks: "Fatigue, weight gain, cold intolerance, constipation, non-pitting myxedema, elevated TSH with low free T4; Levothyroxine therapy.",
      highYieldPearls: "Hashimoto thyroiditis is the most common cause of hypothyroidism in iodine-sufficient areas; predisposes to Primary Thyroid Non-Hodgkin Lymphoma."
    },
    {
      id: "endo-thy-myxedema-coma",
      name: "Myxedema Coma Hypothermia (IV T4/T3 & Hydrocortisone)",
      category: "Hypothyroid Crisis",
      subType: "Severe Hypothermia (<35°C) • Hypoventilation • Bradycardia • IV Hydrocortisone Pre-T4 Replacement",
      endocrineProfile: "Life-threatening decompensation of severe longstanding untreated or non-compliant hypothyroidism.",
      pathophysiology: "Profound cellular hypometabolism causes blunted ventilatory drive, alveolar hypoventilation, bradycardia, and cardiogenic shock.",
      clinicalHallmarks: "Hypothermia, obtundation, generalized puffy non-pitting edema; passive warming + IV Hydrocortisone + IV Levothyroxine (T4)/Liothyronine (T3).",
      highYieldPearls: "Always give IV Hydrocortisone before or with IV Levothyroxine in myxedema coma to prevent precipitating fatal adrenal crisis!"
    }
  ],

  calcium: [
    {
      id: "endo-ca-phpt-adenoma",
      name: "Primary Hyperparathyroidism (Parathyroid Adenoma & Stones)",
      category: "Hypercalcemia",
      subType: "Solitary Adenoma (85%) • High Ca + High/Normal PTH • Hypercalciuria (>200 mg/24h) • Stones, Bones, Groans",
      endocrineProfile: "Autonomous PTH hypersecretion stimulates osteoclast bone resorption, renal calcium reabsorption, and 1-alpha-hydroxylase calcitriol synthesis.",
      pathophysiology: "Elevated filtered calcium load overwhelms tubular reabsorption, causing hypercalciuria and calcium oxalate nephrolithiasis.",
      clinicalHallmarks: "Bones (osteitis fibrosa cystica), stones (nephrolithiasis), groans (constipation, ulcers, pancreatitis), psychiatric overtones; parathyroidectomy.",
      highYieldPearls: "High Serum Calcium + Inappropriately High/Normal PTH + Elevated 24h Urine Calcium (>200 mg) = Primary Hyperparathyroidism."
    },
    {
      id: "endo-ca-fhh-casr",
      name: "Familial Hypocalciuric Hypercalcemia (Inactivating CASR Mutation)",
      category: "Benign Familial Calcemia",
      subType: "Autosomal Dominant Inactivating CASR • High Ca + High/Normal PTH • EXTREMELY LOW Urine Ca (CCCR <0.01) • DO NOT OPERATE!",
      endocrineProfile: "Defective calcium-sensing receptor raises the set-point threshold required for calcium to suppress parathyroid and renal excretion.",
      pathophysiology: "Parathyroids perceive normal calcium as low, and kidneys perceive high calcium as low, avidly reabsorbing urinary calcium.",
      clinicalHallmarks: "Asymptomatic mild hypercalcemia in patient and relatives; 24h urine calcium <100 mg; CCCR <0.01; completely benign, surgery ineffective.",
      highYieldPearls: "FHH has CCCR <0.01 and low urine calcium; parathyroidectomy is completely ineffective and contraindicated (benign condition)."
    },
    {
      id: "endo-ca-hhm-pthrp",
      name: "Humoral Hypercalcemia of Malignancy (Squamous PTHrP)",
      category: "Paraneoplastic Syndrome",
      subType: "Squamous Cell Lung/Renal Carcinoma • High PTHrP • Suppressed Intact PTH (<5 pg/mL) • Marked Hypercalcemia",
      endocrineProfile: "Ectopic tumor secretion of parathyroid hormone-related peptide (PTHrP) binding to the PTH-1 receptor.",
      pathophysiology: "Massive osteoclast activation and renal calcium retention without 1-alpha-hydroxylase activation; intact PTH is completely suppressed.",
      clinicalHallmarks: "Rapid-onset severe hypercalcemia (>14 mg/dL), altered sensorium, volume depletion; treated with IV Saline + Zoledronic acid / Calcitonin.",
      highYieldPearls: "HHM has markedly elevated PTHrP with SUPPRESSED true intact PTH (<5 pg/mL); classic in Squamous Cell Carcinomas."
    },
    {
      id: "endo-ca-hypocalcemia-tetany",
      name: "Hypocalcemic Tetany (Chvostek, Trousseau & IV Calcium)",
      category: "Neuromuscular Hyperexcitability",
      subType: "Post-Thyroidectomy • DiGeorge (22q11) • Chvostek Sign • Trousseau Carpopedal Spasm • Prolonged QTc",
      endocrineProfile: "Decreased extracellular ionized calcium lowers the threshold for neuronal voltage-gated sodium channel activation.",
      pathophysiology: "Hypocalcemia induces spontaneous repetitive neuronal depolarization and skeletal muscle tetanic spasms.",
      clinicalHallmarks: "Perioral paresthesias, Chvostek sign (facial twitch), Trousseau sign (carpopedal spasm on BP cuff), long QTc; IV Calcium Gluconate.",
      highYieldPearls: "Trousseau sign (carpopedal spasm with BP cuff) is more sensitive and specific for hypocalcemia than Chvostek sign."
    }
  ],

  men: [
    {
      id: "endo-men-1-wermer",
      name: "MEN 1 Wermer Syndrome (3 Ps: Pituitary, Parathyroid, Pancreas)",
      category: "Inherited Tumor Syndrome",
      subType: "MEN1 (Menin) Tumor Suppressor • 3 Ps: Parathyroid Hyperplasia (95%), Pancreatic Islet Tumors, Pituitary Adenoma",
      endocrineProfile: "Loss of heterozygosity in the MEN1 tumor suppressor gene encoding menin on chromosome 11q13.",
      pathophysiology: "Multi-gland hyperplasia and adenomatosis targeting endocrine organs derived from foregut endoderm.",
      clinicalHallmarks: "Primary hyperparathyroidism (95%), Gastrinoma (Zollinger-Ellison severe peptic ulcers), Insulinoma (hypoglycemia), Prolactinoma.",
      highYieldPearls: "MEN 1 = 3 Ps: Pituitary (Prolactinoma), Parathyroid (Hyperplasia 95%), Pancreas (Gastrinoma / Insulinoma)."
    },
    {
      id: "endo-men-2a-sipple",
      name: "MEN 2A Sipple Syndrome (2 Ps: Parathyroid, Pheo & MTC)",
      category: "RET Proto-Oncogene",
      subType: "RET Proto-Oncogene Gain-of-Function • 2 Ps: Parathyroid Hyperplasia, Pheochromocytoma, Medullary Thyroid Ca (100%)",
      endocrineProfile: "Constitutive activation of RET receptor tyrosine kinase driving parafollicular C-cell, parathyroid, and chromaffin neoplasia.",
      pathophysiology: "Medullary thyroid carcinoma develops in 100% of patients; histopathology shows amyloid stroma staining with Congo red.",
      clinicalHallmarks: "Elevated serum calcitonin, neck mass, bilateral pheochromocytomas, hypercalcemia; prophylactic thyroidectomy in childhood.",
      highYieldPearls: "MEN 2A = 2 Ps: Parathyroid hyperplasia, Pheochromocytoma, plus Medullary Thyroid Carcinoma (100% of cases)."
    },
    {
      id: "endo-men-2b-neuromas",
      name: "MEN 2B (Pheo, Aggressive MTC, Mucosal Neuromas & Marfanoid)",
      category: "RET M918T Mutation",
      subType: "RET M918T Codon • 1 P: Pheochromocytoma, Early Aggressive MTC, Mucosal Neuromas (Lips/Tongue), Marfanoid Habitus",
      endocrineProfile: "Specific M918T kinase domain mutation triggering aggressive medullary thyroid carcinoma in infancy without parathyroid disease.",
      pathophysiology: "Hyperplasia of peripheral neural crest-derived Schwann cells forming mucosal neuromas and ganglioneuromatosis of the GI tract.",
      clinicalHallmarks: "Flesh-colored mucosal papules on tongue/lips, tall slender marfanoid body habitus, metastatic MTC in early childhood; rule out pheo.",
      highYieldPearls: "MEN 2B has Mucosal Neuromas and Marfanoid Habitus with early aggressive MTC, but NO parathyroid hyperplasia!"
    },
    {
      id: "endo-men-di-desmopressin",
      name: "Diabetes Insipidus (Central dDAVP Responsive vs Nephrogenic)",
      category: "Water Homeostasis",
      subType: "Polyuria & Polydipsia • Water Deprivation Test • Central DI: >50% Urine Osm Rise with dDAVP • Nephrogenic: Lithium Resistant",
      endocrineProfile: "Deficiency of hypothalamic/posterior pituitary ADH release (Central) or renal collecting duct resistance to ADH (Nephrogenic).",
      pathophysiology: "Inability to concentrate urine in medullary collecting ducts leads to massive hypotonic polyuria and hypernatremic dehydration.",
      clinicalHallmarks: "Urine Osm <300 with plasma Osm >295; Desmopressin increases urine Osm >50% in Central DI; Lithium causes Nephrogenic DI.",
      highYieldPearls: "Central DI responds dramatically to Desmopressin (>50-100% increase in urine osmolality); Nephrogenic DI shows <10% response."
    }
  ]
};

interface EndocrinologyLabViewerProps {
  initialMode?: EndocrinologyLabMode;
  height?: string;
  onNodeSelect?: (node: EndocrinologyLabNode) => void;
}

export default function EndocrinologyLabViewer({
  initialMode = "adrenal",
  height = "560px",
  onNodeSelect,
}: EndocrinologyLabViewerProps) {
  const [activeMode, setActiveMode] = useState<EndocrinologyLabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Adrenal Profiler State
  const [selectedAdr, setSelectedAdr] = useState<"cushing" | "addison" | "conn" | "pheo">("cushing");

  // Calcium Profiler State
  const [selectedCa, setSelectedCa] = useState<"phpt" | "fhh" | "hhm" | "tetany">("phpt");

  const adrDetails = useMemo(() => {
    if (selectedAdr === "cushing") {
      return {
        title: "Cushing Disease vs Ectopic ACTH",
        profile: "High-Dose (8 mg) DST: Suppresses >50% in Pituitary Adenoma; Fails in Ectopic SCLC",
        rx: "Transsphenoidal pituitary resection for Cushing Disease; Surgical resection / Somatostatin for Ectopic",
        pearl: "Suppression of cortisol by >50% with high-dose dexamethasone confirms Pituitary Cushing Disease."
      };
    } else if (selectedAdr === "addison") {
      return {
        title: "Primary Adrenal Insufficiency (Addison)",
        profile: "Cortisol + Aldosterone Deficit • High ACTH Hyperpigmentation • Hyperkalemic NAGMA • Cosyntropin <18",
        rx: "Daily oral Hydrocortisone + Fludrocortisone; Acute Crisis: Immediate IV Hydrocortisone 100 mg + Saline/Dextrose",
        pearl: "Primary (Addison) has hyperpigmentation and hyperkalemia; Secondary has normal potassium (RAAS intact)."
      };
    } else if (selectedAdr === "conn") {
      return {
        title: "Primary Hyperaldosteronism (Conn Syndrome)",
        profile: "ARR >20-30 with Aldo >15 ng/dL • Treatment-Resistant HTN • Hypokalemic Alkalosis",
        rx: "Laparoscopic unilateral adrenalectomy for adenoma; Spironolactone / Eplerenone for bilateral hyperplasia",
        pearl: "Screen with Aldosterone-to-Renin Ratio (ARR >20-30); unilateral adenoma -> surgery."
      };
    } else {
      return {
        title: "Pheochromocytoma Emergency Rule",
        profile: "Chromaffin Tumor • Paroxysmal 5 Ps • 24h Fractionated Metanephrines • MANDATORY Alpha-Blocker FIRST",
        rx: "Phenoxybenzamine (alpha-blocker) for 10-14 days BEFORE Beta-blocker; definitive laparoscopic resection",
        pearl: "Never start a beta-blocker before an alpha-blocker; causes lethal unopposed alpha-vasoconstriction!"
      };
    }
  }, [selectedAdr]);

  const caDetails = useMemo(() => {
    if (selectedCa === "phpt") {
      return {
        title: "Primary Hyperparathyroidism (PHPT)",
        indices: "Solitary Adenoma (85%) • High Ca + High/Normal PTH • Hypercalciuria (>200 mg/24h) • Stones & Bones",
        rx: "Parathyroidectomy (focused minimally invasive or four-gland exploration); Cinacalcet if non-surgical",
        pearl: "High Serum Calcium + Inappropriately High/Normal PTH + High 24h Urine Calcium = PHPT."
      };
    } else if (selectedCa === "fhh") {
      return {
        title: "Familial Hypocalciuric Hypercalcemia (FHH)",
        indices: "Inactivating CASR Mutation • High Ca + Normal/High PTH • CCCR <0.01 • LOW Urine Ca • BENIGN",
        rx: "Conservative observation and family counseling; Parathyroidectomy is completely ineffective and CONTRAINDICATED",
        pearl: "FHH has CCCR <0.01 and low urine calcium; parathyroidectomy is contraindicated (benign condition)."
      };
    } else if (selectedCa === "hhm") {
      return {
        title: "Humoral Hypercalcemia of Malignancy (HHM)",
        indices: "Squamous Cell Carcinoma • High PTHrP • SUPPRESSED Intact PTH (<5 pg/mL) • Severe Hypercalcemia",
        rx: "Aggressive IV Isotonic Saline hydration + IV Zoledronic Acid (bisphosphonate) or Subcutaneous Denosumab",
        pearl: "HHM has high PTHrP with SUPPRESSED true intact PTH (<5 pg/mL); classic in Squamous Cell Carcinomas."
      };
    } else {
      return {
        title: "Hypocalcemic Tetany & Laryngospasm",
        indices: "Post-Thyroidectomy / DiGeorge • Chvostek Sign • Trousseau Carpopedal Spasm • Long QTc",
        rx: "Immediate Intravenous Calcium Gluconate (10% solution, 10-20 mL over 10 min) + Oral Calcium/Calcitriol",
        pearl: "Trousseau sign (carpopedal spasm with BP cuff) is more sensitive and specific for hypocalcemia than Chvostek sign."
      };
    }
  }, [selectedCa]);

  const currentNodes = useMemo(() => {
    return ENDOCRINOLOGY_LAB_NODES[activeMode] || ENDOCRINOLOGY_LAB_NODES.adrenal;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: EndocrinologyLabNode) => {
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
            <Zap size={14} /> ENDO-301
          </span>
          <span className={styles.titleText}>
            {activeMode === "adrenal" && "Adrenal Pathophysiology: Cushing Algorithm, Addison, Conn & Pheochromocytoma"}
            {activeMode === "thyroid" && "Thyroid Pathophysiology: Graves, Hashimoto, Thyroid Storm & Myxedema"}
            {activeMode === "calcium" && "Calcium Homeostasis: Primary Hyperparathyroidism, FHH & Humoral Malignancy"}
            {activeMode === "men" && "Multiple Endocrine Neoplasia (MEN 1, 2A, 2B) & Diabetes Insipidus"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Endocrinology Diagnostic Quiz"}
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
                <div className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Endocrinology Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Endocrine / Metabolic Disorder: {quizTargetNode.clinicalHallmarks}
                </div>
                {quizFeedback && (
                  <div className="text-xs text-amber-300 font-medium mt-1">{quizFeedback}</div>
                )}
              </div>
              <button
                onClick={nextQuizQuestion}
                className="px-3 py-1 bg-amber-950 text-xs rounded border border-amber-700 text-amber-200"
              >
                Next
              </button>
            </div>
          )}

          {/* Mode 1: Adrenal Profiler */}
          {activeMode === "adrenal" && (
            <div className={styles.endoCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={14} /> Adrenal Axis &amp; Endocrine Hypertension Profiler
                </span>
                <span className="text-[11px] text-slate-400">Cushing &bull; Addison &bull; Conn &bull; Pheochromocytoma</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => setSelectedAdr("cushing")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedAdr === "cushing"
                      ? "bg-amber-600 text-white border-amber-400"
                      : "bg-indigo-950 text-slate-300 border-indigo-800"
                  }`}
                >
                  🌕 Cushing (High-Dose DST)
                </button>
                <button
                  onClick={() => setSelectedAdr("addison")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedAdr === "addison"
                      ? "bg-amber-600 text-white border-amber-400"
                      : "bg-indigo-950 text-slate-300 border-indigo-800"
                  }`}
                >
                  ⚡ Addison (Cosyntropin)
                </button>
                <button
                  onClick={() => setSelectedAdr("conn")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedAdr === "conn"
                      ? "bg-amber-600 text-white border-amber-400"
                      : "bg-indigo-950 text-slate-300 border-indigo-800"
                  }`}
                >
                  🩸 Conn (ARR &gt;20-30)
                </button>
                <button
                  onClick={() => setSelectedAdr("pheo")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedAdr === "pheo"
                      ? "bg-amber-600 text-white border-amber-400"
                      : "bg-indigo-950 text-slate-300 border-indigo-800"
                  }`}
                >
                  🎯 Pheo (Alpha 1st!)
                </button>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                <div className="text-sm font-bold text-amber-300">{adrDetails.title}</div>
                <div className="text-emerald-400 font-bold mt-1">{adrDetails.profile}</div>
                <div className="text-slate-300 mt-1"><strong className="text-amber-400">Therapeutic Protocol:</strong> {adrDetails.rx}</div>
                <div className="text-yellow-300 font-semibold mt-1"><strong className="text-yellow-400">High-Yield Pearl:</strong> {adrDetails.pearl}</div>
              </div>
            </div>
          )}

          {/* Mode 2: Thyroid Emergencies */}
          {activeMode === "thyroid" && (
            <div className={styles.endoCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Flame size={14} /> Thyroid Storm &amp; Myxedema Coma Resuscitation
                </span>
                <span className="text-[11px] text-slate-400">Graves &bull; 4-Step Storm Protocol &bull; Hashimoto &bull; Myxedema</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-amber-300 font-bold">Thyroid Storm 4-Step Sequential Protocol</div>
                  <div className="text-slate-300 mt-1">1. Beta-blocker (IV Propranolol) &rarr; 2. Thionamide (PTU) &rarr; 3. Potassium Iodide (Lugol solution delayed &ge;1h after PTU) &rarr; 4. IV Hydrocortisone. Aspirin is strictly CONTRAINDICATED (displaces T4/T3 from TBG).</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-amber-300 font-bold">Myxedema Coma Emergency Protocol</div>
                  <div className="text-slate-300 mt-1">Severe hypothermia (&lt;35°C), hypoventilation, bradycardia, coma. Immediate passive external warming + IV Hydrocortisone (administered before/with thyroid hormone) + IV Levothyroxine (T4)/Liothyronine (T3).</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 3: Calcium Homeostasis */}
          {activeMode === "calcium" && (
            <div className={styles.endoCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield size={14} /> Hypercalcemia Diagnostic Matrix &amp; Tetany
                </span>
                <span className="text-[11px] text-slate-400">PHPT vs FHH (CCCR &lt;0.01) vs Malignancy (PTHrP)</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => setSelectedCa("phpt")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedCa === "phpt"
                      ? "bg-amber-600 text-white border-amber-400"
                      : "bg-indigo-950 text-slate-300 border-indigo-800"
                  }`}
                >
                  🦴 PHPT (High Urine Ca)
                </button>
                <button
                  onClick={() => setSelectedCa("fhh")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedCa === "fhh"
                      ? "bg-amber-600 text-white border-amber-400"
                      : "bg-indigo-950 text-slate-300 border-indigo-800"
                  }`}
                >
                  🧬 FHH (CCCR &lt;0.01)
                </button>
                <button
                  onClick={() => setSelectedCa("hhm")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedCa === "hhm"
                      ? "bg-amber-600 text-white border-amber-400"
                      : "bg-indigo-950 text-slate-300 border-indigo-800"
                  }`}
                >
                  ⚠️ HHM (PTHrP Ectopic)
                </button>
                <button
                  onClick={() => setSelectedCa("tetany")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedCa === "tetany"
                      ? "bg-amber-600 text-white border-amber-400"
                      : "bg-indigo-950 text-slate-300 border-indigo-800"
                  }`}
                >
                  ⚡ Tetany (Trousseau Sign)
                </button>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                <div className="text-sm font-bold text-amber-300">{caDetails.title}</div>
                <div className="text-emerald-400 font-bold mt-1">{caDetails.indices}</div>
                <div className="text-slate-300 mt-1"><strong className="text-amber-400">Clinical Protocol:</strong> {caDetails.rx}</div>
                <div className="text-yellow-300 font-semibold mt-1"><strong className="text-yellow-400">Diagnostic Rule:</strong> {caDetails.pearl}</div>
              </div>
            </div>
          )}

          {/* Mode 4: MEN & DI */}
          {activeMode === "men" && (
            <div className={styles.endoCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap size={14} /> Multiple Endocrine Neoplasia &amp; Diabetes Insipidus
                </span>
                <span className="text-[11px] text-slate-400">MEN 1 (3 Ps) &bull; MEN 2A (2 Ps) &bull; MEN 2B (Mucosal Neuromas) &bull; DI</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-amber-300 font-bold">MEN 1 vs MEN 2A vs MEN 2B Matrix</div>
                  <div className="text-slate-300 mt-1">MEN 1 (Menin): 3 Ps (Pituitary, Parathyroid 95%, Pancreatic islet tumors). MEN 2A (RET): 2 Ps (Parathyroid, Pheo, Medullary Thyroid Ca 100%). MEN 2B (RET M918T): 1 P (Pheo, Early Aggressive MTC, Mucosal Neuromas, Marfanoid Habitus - NO parathyroid!).</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-amber-300 font-bold">Diabetes Insipidus Desmopressin Testing</div>
                  <div className="text-slate-300 mt-1">Central DI has posterior pituitary ADH deficiency and concentrates urine (&gt;50-100% increase in Osm) following Desmopressin (dDAVP). Nephrogenic DI (Lithium toxicity, hypercalcemia) shows minimal response (&lt;10%).</div>
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
                    <span className="text-amber-400 font-bold">Pathophysiology:</span> {node.endocrineProfile}
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

        {/* Right Side: High-Yield Endocrinology Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Endocrinology Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>⚡ Endocrine Entity / Syndrome</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🔬 Hormonal Axes &amp; Pathophysiology</div>
            <div className="text-xs text-amber-300 font-semibold">{activeNode.endocrineProfile}</div>
            <div className={styles.inspectorBody}>{activeNode.pathophysiology}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🩺 Clinical Hallmarks &amp; Diagnostics</div>
            <div className={styles.inspectorBody}>{activeNode.clinicalHallmarks}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 Gold Standard Clinical Pearls</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearls}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("adrenal")}
          className={`${styles.modeTab} ${activeMode === "adrenal" ? styles.modeTabActive : ""}`}
        >
          ⚡ 1. Adrenal Axis &amp; HTN
        </button>
        <button
          onClick={() => setActiveMode("thyroid")}
          className={`${styles.modeTab} ${activeMode === "thyroid" ? styles.modeTabActive : ""}`}
        >
          🔥 2. Thyroid Emergencies
        </button>
        <button
          onClick={() => setActiveMode("calcium")}
          className={`${styles.modeTab} ${activeMode === "calcium" ? styles.modeTabActive : ""}`}
        >
          🦴 3. Calcium &amp; Parathyroid
        </button>
        <button
          onClick={() => setActiveMode("men")}
          className={`${styles.modeTab} ${activeMode === "men" ? styles.modeTabActive : ""}`}
        >
          🧬 4. MEN &amp; Pituitary DI
        </button>
      </div>
    </div>
  );
}
