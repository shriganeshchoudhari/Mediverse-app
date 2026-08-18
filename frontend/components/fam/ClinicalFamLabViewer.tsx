"use client";

import React, { useState, useMemo } from "react";
import styles from "./ClinicalFamLabViewer.module.css";
import {
  HeartHandshake,
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
  UserCheck,
  Users,
  Activity,
  ClipboardList,
  Stethoscope,
} from "lucide-react";

export type FamLabMode = "screening" | "chronic" | "geriatrics" | "triage";

export interface FamLabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  primaryCareProfile: string;
  proceduralMechanism: string;
  clinicalHallmarks: string;
  highYieldPearls: string;
}

export const FAM_LAB_NODES: Record<FamLabMode, FamLabNode[]> = {
  screening: [
    {
      id: "fam-sc-colorectal-cancer-screening",
      name: "Colorectal Cancer Surveillance (Ages 45-75 Colonoscopy q10y & Stool FIT Annually)",
      category: "USPSTF Grade A",
      subType: "Colonoscopy Every 10 Years • Annual FIT • Stool FIT-DNA (Cologuard) Every 3 Years",
      primaryCareProfile: "Gold standard cancer screening framework for all average-risk adults aged 45 to 75.",
      proceduralMechanism: "Identifies and resects precancerous adenomatous polyps; detects early-stage localized malignancy.",
      clinicalHallmarks: "Screening starts at age 45; discontinue after age 75 (individualized) and routinely stop after age 85.",
      highYieldPearls: "Colorectal cancer screening is recommended for all average-risk adults aged 45-75 (Colonoscopy q10y or annual FIT)."
    },
    {
      id: "fam-sc-mammography-cervical-cytology",
      name: "Mammography & Cervical Cytology (Biennial Breast Screening & hrHPV / Pap Cytology Intervals)",
      category: "Women's Health",
      subType: "Mammography Biennial (40-74y) • Cervical (21-29y Pap q3y, 30-65y hrHPV q5y) • Stop at 65y",
      primaryCareProfile: "Population screening protocols detecting early ductal breast carcinoma and cervical intraepithelial neoplasia.",
      proceduralMechanism: "Low-energy X-ray mammography detects microcalcifications; Pap cytology/hrHPV detects oncogenic HPV strains 16/18.",
      clinicalHallmarks: "Mammography every 2 years from age 40 to 74; stop cervical screening at 65 if 3 consecutive negative Paps.",
      highYieldPearls: "Biennial mammography is recommended for women aged 40-74; cervical screening stops at 65 with adequate prior negative tests."
    },
    {
      id: "fam-sc-ldct-lung-cancer-screening",
      name: "Low-Dose CT Lung Cancer Screening (Ages 50-80 & &ge;20 Pack-Year Tobacco Thresholds)",
      category: "High-Risk Screening",
      subType: "Annual Low-Dose CT (LDCT) • Ages 50-80 Years • &ge;20 Pack-Year History • Current or Quit <15y",
      primaryCareProfile: "Targeted radiographic screening protocol reducing lung cancer mortality in heavy tobacco users.",
      proceduralMechanism: "Low-dose non-contrast helical CT detects early resectable non-small cell lung cancer nodules.",
      clinicalHallmarks: "Qualifies: Age 50-80, &ge;20 pack-years, and currently smoke or quit within past 15 years; stop if quit &ge;15 years.",
      highYieldPearls: "Annual LDCT is indicated for adults 50-80 with &ge;20 pack-years who currently smoke or quit within 15 years."
    },
    {
      id: "fam-sc-adult-immunizations-shingrix-pcv20",
      name: "Adult Immunization Schedules (Shingrix Recombinant Zoster & Pneumococcal PCV20 Updates)",
      category: "Immunization",
      subType: "Shingrix (&ge;50y, 2 Doses) • Pneumococcal PCV20 (&ge;65y) • Tdap (q10y + Pregnancy) • Annual Flu",
      primaryCareProfile: "CDC ACIP adult vaccine schedules preventing invasive pneumococcal disease, shingles, and pertussis.",
      proceduralMechanism: "Recombinant adjuvanted glycoprotein E triggers robust T-cell immunity against latent varicella-zoster reactivation.",
      clinicalHallmarks: "Shingrix 2 doses for all adults &ge;50; PCV20 single dose for all adults &ge;65; Tdap with every pregnancy.",
      highYieldPearls: "Shingrix is indicated for all adults &ge;50 (2 doses); PCV20 is given once at age &ge;65 for pneumococcal protection."
    }
  ],

  chronic: [
    {
      id: "fam-cd-hypertension-staging-algorithms",
      name: "ACC/AHA Hypertension Staging & Algorithms (Stage 1/2 Regimens & Demographic Drug Selections)",
      category: "Cardiovascular HTN",
      subType: "Stage 1 (130-139/80-89) • Stage 2 (&ge;140/&ge;90) • Black (CCB/Thiazide) • CKD (ACEI/ARB)",
      primaryCareProfile: "Evidence-based blood pressure categorization and demographic-tailored pharmacotherapeutic initiation.",
      proceduralMechanism: "Reduces systemic vascular resistance and glomerular hypertension to prevent stroke, myocardial infarction, and ESRD.",
      clinicalHallmarks: "Stage 2 HTN (&gt;20/10 above goal) requires 2 initial drugs; Black patients start CCB/Thiazide; CKD with proteinuria starts ACEI/ARB.",
      highYieldPearls: "In Black patients without CKD, start CCB or Thiazide; in patients with CKD and proteinuria, start ACEI or ARB."
    },
    {
      id: "fam-cd-diabetes-ada-guidelines",
      name: "ADA 2024 Diabetes Management (Glycemic Targets, SGLT2i Cardiorenal Protection & GLP-1 RAs)",
      category: "Endocrine T2DM",
      subType: "Target HbA1c < 7.0% • Metformin First-Line • SGLT2i (CKD / Heart Failure) • GLP-1 RA (ASCVD / Obesity)",
      primaryCareProfile: "Comprehensive management of type 2 diabetes balancing glycemic control with cardiorenal organ protection.",
      proceduralMechanism: "SGLT2 inhibitors block proximal tubule glucose/sodium reabsorption; GLP-1 agonists stimulate glucose-dependent insulin secretion.",
      clinicalHallmarks: "Metformin + SGLT2i for CKD/HF; Metformin + GLP-1 RA for high ASCVD risk; target HbA1c <7.0% for most adults.",
      highYieldPearls: "SGLT2 inhibitors (Empagliflozin) reduce heart failure and CKD progression; GLP-1 RAs reduce major adverse cardiac events."
    },
    {
      id: "fam-cd-diabetic-nephropathy-microalbuminuria",
      name: "Diabetic Nephropathy Microalbuminuria (Efferent Arteriolar ACEI/ARB Hemodynamics & Protection)",
      category: "Renal Protection",
      subType: "Urine ACR &ge; 30 mg/g • Efferent Arteriolar Vasodilation • ACEI / ARB • Glomerular Hyperfiltration",
      primaryCareProfile: "Targeted renal protective therapy slowing the progression of diabetic glomerular disease.",
      proceduralMechanism: "Inhibition of Angiotensin II selectively dilates the efferent arteriole, reducing intraglomerular capillary hydrostatic pressure.",
      clinicalHallmarks: "Screen annually with spot urine ACR; ACR &ge;30 mg/g mandates initiating an ACE inhibitor or ARB.",
      highYieldPearls: "ACE inhibitors/ARBs selectively dilate the efferent arteriole, reducing intraglomerular pressure in diabetic nephropathy."
    },
    {
      id: "fam-cd-ascvd-statin-risk-calculator",
      name: "Primary ASCVD Statin Risk Stratification (10-Year ASCVD Risk Score & High-Intensity Statin Dosing)",
      category: "Lipid Management",
      subType: "10-Year ASCVD Calculator • &ge;7.5% Moderate Statin • &ge;20% High-Intensity Statin (Atorva 40-80 mg)",
      primaryCareProfile: "Cardiovascular risk calculation guiding primary prevention statin therapy.",
      proceduralMechanism: "HMG-CoA reductase inhibition stabilizes atherosclerotic plaque, lowers LDL-C, and reduces cardiovascular events.",
      clinicalHallmarks: "High-intensity statins: Atorvastatin 40-80 mg or Rosuvastatin 20-40 mg (lowers LDL-C by &ge;50%).",
      highYieldPearls: "High-intensity statins (Atorvastatin 40-80 mg, Rosuvastatin 20-40 mg) are indicated for ASCVD risk &ge;20% or LDL &ge;190 mg/dL."
    }
  ],

  geriatrics: [
    {
      id: "fam-gt-adls-iadls-functional-assessment",
      name: "Functional Independence ADLs vs IADLs (Katz Index & Lawton Instrumental Executive Screening)",
      category: "Functional Status",
      subType: "Basic ADLs ('DEATH': Dressing, Eating, Ambulating, Toileting, Hygiene) • IADLs ('SHAFT': Finances, Meds, Shopping)",
      primaryCareProfile: "Stratification of functional autonomy in older adults to identify caregiver needs and executive decline.",
      proceduralMechanism: "IADLs require complex executive cognitive function and are lost early in mild dementia; basic ADLs are lost later.",
      clinicalHallmarks: "Loss of IADLs (managing money, meds) signals early dementia; loss of basic ADLs indicates severe dependency.",
      highYieldPearls: "Instrumental ADLs (finances, medications, driving) are lost first in cognitive decline; basic ADLs (eating, bathing) are lost later."
    },
    {
      id: "fam-gt-mini-cog-clock-drawing",
      name: "Mini-Cog & Clock Drawing Test (3-Word Recall & Visuospatial Executive Screening)",
      category: "Cognitive Screening",
      subType: "3-Word Registration • Clock Drawing Test (CDT 11:10) • 3-Word Recall • Rapid 3-Minute Office Screen",
      primaryCareProfile: "Rapid, highly validated cognitive screening instrument for primary care outpatient settings.",
      proceduralMechanism: "Evaluates short-term memory retrieval (word recall) and visuospatial executive planning (clock drawing).",
      clinicalHallmarks: "Score: 0/3 recall = Demented; 1-2/3 recall + abnormal clock = Demented; 3/3 recall or 1-2/3 + normal clock = Non-demented.",
      highYieldPearls: "Mini-Cog combines 3-word recall with a clock drawing test (drawing hands at 11:10) for rapid dementia screening."
    },
    {
      id: "fam-gt-tug-fall-risk-assessment",
      name: "Timed Up and Go (TUG) Fall Risk (>12 Seconds High Fall Risk Diagnostic Cutoff)",
      category: "Mobility & Balance",
      subType: "Stand from Armchair • Walk 3 Meters • Turn Around • Return & Sit • >12 Seconds Diagnostic Threshold",
      primaryCareProfile: "Objective physical performance test evaluating gait speed, balance, and fall susceptibility.",
      proceduralMechanism: "Integrates vestibular, proprioceptive, and musculoskeletal motor circuits during transitional movements.",
      clinicalHallmarks: "Time >12 seconds indicates high risk for future falls, requiring physical therapy balance training and home safety evaluation.",
      highYieldPearls: "A Timed Up and Go (TUG) test taking >12 seconds indicates a high fall risk in geriatric patients."
    },
    {
      id: "fam-gt-beers-criteria-deprescribing",
      name: "AGS Beers Criteria 2023 Deprescribing (Anticholinergic Delirium & Glyburide Hypoglycemia Hazards)",
      category: "Geriatric Polypharmacy",
      subType: "Diphenhydramine (Anticholinergic) • Zolpidem (Falls) • Glyburide (Prolonged Hypoglycemia) • NSAIDs (GI Ulcers)",
      primaryCareProfile: "Consensus guideline identifying potentially inappropriate medications with adverse risk-benefit ratios in older adults.",
      proceduralMechanism: "Age-related declines in renal clearance and increased blood-brain barrier permeability exacerbate drug toxicity.",
      clinicalHallmarks: "Avoid 1st-gen antihistamines (delirium), benzodiazepines/Z-drugs (hip fractures), long-acting sulfonylureas (hypoglycemia).",
      highYieldPearls: "Beers Criteria: Avoid Diphenhydramine (anticholinergic falls), Zolpidem (fractures), and Glyburide (prolonged hypoglycemia)."
    }
  ],

  triage: [
    {
      id: "fam-tr-cauda-equina-spinal-emergency",
      name: "Cauda Equina Syndrome Airway/Spinal Emergency (Saddle Anesthesia, Incontinence & Emergent MRI/Laminectomy)",
      category: "Spinal Emergency",
      subType: "Saddle Anesthesia (S2-S4) • Urinary Retention / Overflow • Fecal Incontinence • Bilateral Foot Drop • Stat MRI",
      primaryCareProfile: "Acute neurosurgical emergency caused by massive compression of the lumbosacral nerve roots.",
      proceduralMechanism: "Herniated disc or tumor compresses cauda equina; delayed decompression (>48h) causes permanent paraplegia and incontinence.",
      clinicalHallmarks: "Loss of sensation in groin/buttocks, urinary incontinence, absent anal tone; requires STAT MRI and emergency decompression.",
      highYieldPearls: "Cauda Equina Syndrome (saddle anesthesia, bowel/bladder incontinence) requires STAT lumbar MRI and emergency surgical decompression."
    },
    {
      id: "fam-tr-thunderclap-temporal-arteritis-headache",
      name: "Thunderclap & Temporal Arteritis Headaches (Subarachnoid SAH CT/LP Protocols & Vision-Saving Steroids)",
      category: "Headache Red Flags",
      subType: "Thunderclap (Peaks in 1 min &rarr; SAH &rarr; Head CT/LP) • Temporal Arteritis (Jaw Claudication &rarr; Immediate Steroids)",
      primaryCareProfile: "Critical outpatient headache presentations requiring emergent vascular or rheumatological intervention.",
      proceduralMechanism: "Aneurysm rupture causes subarachnoid hemorrhage; granulomatous vasculitis of temporal artery causes ischemic optic neuropathy.",
      clinicalHallmarks: "Thunderclap: Stat non-contrast head CT &rarr; LP if CT negative. Temporal arteritis: Start high-dose steroids BEFORE biopsy.",
      highYieldPearls: "Thunderclap headache: Non-contrast CT, then LP if negative. Temporal arteritis: Start high-dose steroids immediately to prevent blindness."
    },
    {
      id: "fam-tr-dyspepsia-alarms-malignancy",
      name: "Dyspepsia ALARMS Malignancy Red Flags (Anemia, Weight Loss, Dysphagia & Urgent EGD Referrals)",
      category: "GI Red Flags",
      subType: "ALARMS: Anemia, Loss of Weight, Anorexia, Recent Age >55y, Melena, Swallowing Dysphagia &rarr; Urgent EGD",
      primaryCareProfile: "Clinical decision framework identifying dyspeptic patients who require prompt upper endoscopy to rule out cancer.",
      proceduralMechanism: "Gastric adenocarcinoma or esophageal malignancy causes mucosal ulceration, blood loss, and luminal obstruction.",
      clinicalHallmarks: "Presence of any ALARMS feature in a patient with dyspepsia mandates urgent upper endoscopy (EGD).",
      highYieldPearls: "Dyspepsia with ALARMS features (Anemia, Weight loss, Dysphagia, Age >55, Melena) mandates urgent Upper Endoscopy (EGD)."
    },
    {
      id: "fam-tr-primary-specialty-referral-workflows",
      name: "Primary-to-Specialty Referral Workflows (Structured Clinical Inquiries & Closed-Loop Care Transitions)",
      category: "Care Coordination",
      subType: "Explicit Consultation Question • Pre-Consult Diagnostic Workup • Triage Scheduling • Closed-Loop Communication",
      primaryCareProfile: "Interprofessional care coordination framework ensuring high-value specialty consultations.",
      proceduralMechanism: "Clear consultative questions and pre-consult testing eliminate duplicate procedures and prevent lost-to-follow-up errors.",
      clinicalHallmarks: "Specify exact clinical question, attach relevant imaging/biopsies, categorize urgency, and reconcile post-consult recommendations.",
      highYieldPearls: "Effective specialty referrals provide specific consultative questions and pre-consult diagnostic workups to close the care loop."
    }
  ]
};

interface ClinicalFamLabViewerProps {
  initialMode?: FamLabMode;
  height?: string;
  onNodeSelect?: (node: FamLabNode) => void;
}

export default function ClinicalFamLabViewer({
  initialMode = "screening",
  height = "560px",
  onNodeSelect,
}: ClinicalFamLabViewerProps) {
  const [activeMode, setActiveMode] = useState<FamLabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const currentNodes = useMemo(() => {
    return FAM_LAB_NODES[activeMode] || FAM_LAB_NODES.screening;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: FamLabNode) => {
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
            <HeartHandshake size={14} /> FAM-401
          </span>
          <span className={styles.titleText}>
            {activeMode === "screening" && "Preventive Health Screening: USPSTF Cancer Surveillance (CRC, Breast, Lung) & Vaccines"}
            {activeMode === "chronic" && "Chronic Disease Protocols: ACC/AHA Hypertension, ADA 2024 Diabetes & ASCVD Statins"}
            {activeMode === "geriatrics" && "Geriatric Assessment: ADLs/IADLs, Mini-Cog, Fall Risk (TUG) & Beers Deprescribing"}
            {activeMode === "triage" && "Outpatient Triage & Red Flags: Cauda Equina, Thunderclap Headache, ALARMS Dyspepsia"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Family Medicine Quiz"}
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
                  Primary Care Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Primary Care Protocol: {quizTargetNode.clinicalHallmarks}
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

          {/* Mode 1: Preventive Screening */}
          {activeMode === "screening" && (
            <div className={styles.famCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield size={14} /> USPSTF Cancer Screening Guidelines &amp; Immunization Schedules
                </span>
                <span className="text-[11px] text-slate-400">CRC 45-75y &bull; Breast 40-74y &bull; Cervical 21-65y &bull; Lung 50-80y</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-emerald-300 font-bold">USPSTF Cancer Surveillance</div>
                  <div className="text-slate-300 mt-1">Colorectal: Ages 45-75 (Colonoscopy q10y or annual FIT). Breast: Biennial mammography ages 40-74. Cervical: 21-29y Pap q3y; 30-65y hrHPV q5y; stop at 65. Lung: Annual LDCT ages 50-80 with &ge;20 pack-years.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-emerald-300 font-bold">Adult Immunization Schedules</div>
                  <div className="text-slate-300 mt-1">Shingrix (recombinant zoster): 2 doses for all adults &ge;50. Pneumococcal: PCV20 single dose for adults &ge;65. Tdap: Booster every 10 years and with each pregnancy (27-36 weeks).</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 2: Chronic Disease Protocols */}
          {activeMode === "chronic" && (
            <div className={styles.famCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <HeartPulse size={14} /> ACC/AHA Hypertension &amp; ADA 2024 Diabetes Management
                </span>
                <span className="text-[11px] text-slate-400">Stage 1/2 HTN &bull; SGLT2i Cardiorenal &bull; GLP-1 RA ASCVD &bull; Statins</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-emerald-300 font-bold">Hypertension &amp; ASCVD Algorithms</div>
                  <div className="text-slate-300 mt-1">Stage 2 HTN (&ge;140/90) requires 2 initial drugs. In Black patients without CKD, start CCB or Thiazide. In CKD with proteinuria (ACR &ge;30 mg/g), start ACEI/ARB. High-intensity statins for 10y ASCVD &ge;20%.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-emerald-300 font-bold">ADA 2024 Diabetes Guidelines</div>
                  <div className="text-slate-300 mt-1">Glycemic target HbA1c &lt;7.0%. Metformin first-line + SGLT2 inhibitor (Empagliflozin) for CKD or heart failure; GLP-1 receptor agonist (Semaglutide) for high ASCVD risk or obesity.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 3: Geriatric Assessment */}
          {activeMode === "geriatrics" && (
            <div className={styles.famCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <UserCheck size={14} /> Comprehensive Geriatric Assessment &amp; Beers Deprescribing
                </span>
                <span className="text-[11px] text-slate-400">ADLs/IADLs &bull; Mini-Cog &bull; TUG &gt;12s Fall Risk &bull; Beers 2023</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-emerald-300 font-bold">Cognitive &amp; Fall Risk Screening</div>
                  <div className="text-slate-300 mt-1">IADLs (finances, medications) lost early in dementia; basic ADLs (eating, bathing) lost later. Mini-Cog (3-word recall + clock draw). Timed Up and Go (TUG) &gt;12 seconds indicates high fall risk.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-emerald-300 font-bold">AGS Beers Criteria 2023 Deprescribing</div>
                  <div className="text-slate-300 mt-1">Avoid Diphenhydramine (anticholinergic delirium/falls), Zolpidem (nocturnal ataxia/fractures), and Glyburide (severe prolonged hypoglycemia due to renal metabolite accumulation).</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 4: Outpatient Triage & Red Flags */}
          {activeMode === "triage" && (
            <div className={styles.famCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert size={14} /> Outpatient Emergency Red Flags &amp; Referral Systems
                </span>
                <span className="text-[11px] text-slate-400">Cauda Equina &bull; Thunderclap SAH &bull; Temporal Arteritis &bull; ALARMS</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-emerald-300 font-bold">Emergency Outpatient Red Flags</div>
                  <div className="text-slate-300 mt-1">Cauda Equina (saddle anesthesia, bowel/bladder incontinence &rarr; stat MRI/decompression). Thunderclap headache (SAH &rarr; non-contrast CT &rarr; LP). Temporal arteritis &rarr; stat high-dose steroids.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-emerald-300 font-bold">Dyspepsia ALARMS &amp; Closed-Loop Referrals</div>
                  <div className="text-slate-300 mt-1">Dyspepsia with ALARMS criteria (Anemia, Loss of weight, Anorexia, Age &gt;55, Melena, Swallowing dysphagia) requires urgent upper endoscopy (EGD). Structured referral with closed-loop tracking.</div>
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
                    <span className="text-emerald-400 font-bold">Primary Care:</span> {node.primaryCareProfile}
                  </div>

                  <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400">
                    <span>Inspect Family Medicine Protocol</span>
                    <ArrowRight size={12} className="text-slate-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: High-Yield Family Medicine Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Family Medicine Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>📋 Clinical Protocol / Guideline</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🧬 Physiological Mechanism</div>
            <div className="text-xs text-emerald-300 font-semibold">{activeNode.primaryCareProfile}</div>
            <div className={styles.inspectorBody}>{activeNode.proceduralMechanism}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>📋 Clinical Hallmarks &amp; Maneuvers</div>
            <div className={styles.inspectorBody}>{activeNode.clinicalHallmarks}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 Gold Standard Primary Care Pearls</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearls}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("screening")}
          className={`${styles.modeTab} ${activeMode === "screening" ? styles.modeTabActive : ""}`}
        >
          🛡️ 1. Preventive Screening
        </button>
        <button
          onClick={() => setActiveMode("chronic")}
          className={`${styles.modeTab} ${activeMode === "chronic" ? styles.modeTabActive : ""}`}
        >
          💊 2. Chronic Disease Protocols
        </button>
        <button
          onClick={() => setActiveMode("geriatrics")}
          className={`${styles.modeTab} ${activeMode === "geriatrics" ? styles.modeTabActive : ""}`}
        >
          👵 3. Geriatric Assessment
        </button>
        <button
          onClick={() => setActiveMode("triage")}
          className={`${styles.modeTab} ${activeMode === "triage" ? styles.modeTabActive : ""}`}
        >
          ⚠️ 4. Outpatient Triage &amp; Red Flags
        </button>
      </div>
    </div>
  );
}
