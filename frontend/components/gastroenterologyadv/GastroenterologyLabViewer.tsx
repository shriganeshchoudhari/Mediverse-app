"use client";

import React, { useState, useMemo } from "react";
import styles from "./GastroenterologyLabViewer.module.css";
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

export type GastroenterologyLabMode = "cirrhosis" | "jaundice" | "ibd" | "pancreas";

export interface GastroenterologyLabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  pathophysiologyProfile: string;
  pathophysiology: string;
  clinicalHallmarks: string;
  highYieldPearls: string;
}

export const GASTROENTEROLOGY_LAB_NODES: Record<GastroenterologyLabMode, GastroenterologyLabNode[]> = {
  cirrhosis: [
    {
      id: "gastro-cirr-sbp",
      name: "Spontaneous Bacterial Peritonitis (ANC >250 & Albumin)",
      category: "Peritoneal Infection",
      subType: "Ascitic Fluid ANC >250/uL • E. coli / Klebsiella • IV Ceftriaxone + IV Albumin (1.5 g/kg Day 1)",
      pathophysiologyProfile: "Bacterial translocation from the gut across permeable mucosa into ascitic fluid with deficient bactericidal capacity.",
      pathophysiology: "Gram-negative bacillary seeding triggers severe peritoneal inflammation and secondary systemic arterial vasodilation.",
      clinicalHallmarks: "Fever, diffuse abdominal tenderness, worsening encephalopathy; urgent diagnostic paracentesis before antibiotics.",
      highYieldPearls: "IV Albumin (1.5 g/kg Day 1, 1.0 g/kg Day 3) significantly prevents hepatorenal syndrome and reduces mortality by >50%."
    },
    {
      id: "gastro-cirr-saag-gradient",
      name: "High SAAG Portal Hypertension (SAAG >=1.1 g/dL)",
      category: "Ascites Differentiation",
      subType: "SAAG >=1.1 g/dL • Transudative Mechanics • Low Protein (<2.5) Cirrhosis vs High Protein (>=2.5) Heart Failure",
      pathophysiologyProfile: "Elevated sinusoidal hydrostatic pressure forces transudation of protein-poor fluid into the peritoneal space.",
      pathophysiology: "Increased intrahepatic vascular resistance and splanchnic nitric oxide vasodilation expand plasma volume.",
      clinicalHallmarks: "Shifting dullness, fluid wave, spider angiomas, palmar erythema; managed with Spironolactone + Furosemide.",
      highYieldPearls: "SAAG >=1.1 = Portal Hypertension; SAAG <1.1 = Peritoneal Carcinomatosis / TB / Pancreatic Ascites / Nephrotic Syndrome."
    },
    {
      id: "gastro-cirr-varices",
      name: "Esophageal Variceal Hemorrhage (Octreotide & EVL)",
      category: "Vascular Emergency",
      subType: "HVPG >10-12 mmHg • Left Gastric Collaterals • IV Octreotide + Ceftriaxone + Endoscopic Band Ligation",
      pathophysiologyProfile: "Portosystemic collateral decompression across thin-walled submucosal esophageal veins prone to catastrophic rupture.",
      pathophysiology: "High portal inflow resistance forces portal blood through the coronary/left gastric vein into the azygos system.",
      clinicalHallmarks: "Massive painless hematemesis, melena, hemodynamic shock; emergency resuscitation with restrictive transfusion (Hb 7-8 g/dL).",
      highYieldPearls: "Non-selective beta-blockers (Nadolol/Propranolol) for primary prophylaxis; Octreotide + EVL for active rupture."
    },
    {
      id: "gastro-cirr-hrs",
      name: "Hepatorenal Syndrome (Splanchnic Vasodilation & AKI)",
      category: "Renal Complication",
      subType: "Extreme Renal Vasoconstriction • FeNa <1.0% with NO Intrinsic Pathology • Terlipressin + Albumin",
      pathophysiologyProfile: "Profound splanchnic arterial vasodilation triggers reflex systemic renal sympathetic and RAAS vasoconstriction.",
      pathophysiology: "Critically reduced renal cortical perfusion produces progressive oliguric renal failure that fails fluid challenge.",
      clinicalHallmarks: "Rising serum creatinine in tense cirrhotic ascites unresponsive to albumin expansion; definitive cure is Liver Transplantation.",
      highYieldPearls: "Diagnosis of exclusion: must withhold diuretics, rule out shock, and demonstrate lack of improvement after 2 days of IV albumin."
    }
  ],

  jaundice: [
    {
      id: "gastro-jaund-gilbert",
      name: "Gilbert Syndrome (UGT1A1 Promoter Mutation)",
      category: "Unconjugated Hyperbilirubinemia",
      subType: "Homozygous TA7 Promoter Insertion • ~30% Residual UGT1A1 • Stress/Fasting Jaundice • Normal LFTs",
      pathophysiologyProfile: "Decreased transcriptional efficiency of the UGT1A1 gene reduces hepatic bilirubin glucuronidation capacity.",
      pathophysiology: "Under conditions of caloric deprivation, physical exertion, or intercurrent illness, unconjugated bilirubin transiently rises.",
      clinicalHallmarks: "Mild asymptomatic scleral icterus in a young adult with completely normal AST, ALT, ALP, and hemoglobin; entirely benign.",
      highYieldPearls: "Isolated unconjugated bilirubin elevation (<4-5 mg/dL) with normal liver enzymes and normal reticulocytes = Gilbert; NO treatment."
    },
    {
      id: "gastro-jaund-dubin-johnson",
      name: "Dubin-Johnson Syndrome (Canalicular MRP2 Defect)",
      category: "Conjugated Hyperbilirubinemia",
      subType: "Autosomal Recessive MRP2/ABCC2 Mutation • Impaired Canalicular Biliary Export • DENSE BLACK LIVER",
      pathophysiologyProfile: "Defective adenosine triphosphate-dependent canalicular export of conjugated bilirubin into the bile canaliculus.",
      pathophysiology: "Impaired excretion of epinephrine metabolites leads to lysosomal dark pigment accumulation throughout the liver parenchyma.",
      clinicalHallmarks: "Episodic conjugated hyperbilirubinemia, normal transaminases, dense black macroscopic liver on biopsy; normal life expectancy.",
      highYieldPearls: "Dubin-Johnson = BLACK liver (MRP2 defect); Rotor Syndrome = NORMAL non-pigmented liver (OATP1B1/B3 uptake defect)."
    },
    {
      id: "gastro-jaund-crigler-najjar",
      name: "Crigler-Najjar Syndrome Type I (Absent UGT1A1)",
      category: "Unconjugated Hyperbilirubinemia",
      subType: "Complete Absence of UGT1A1 • Bilirubin >20-45 mg/dL • Fatal Kernicterus • Emergency Phototherapy/Transplant",
      pathophysiologyProfile: "Complete genetic absence of bilirubin uridine diphosphate glucuronosyltransferase activity.",
      pathophysiology: "Lipophilic unconjugated bilirubin crosses the blood-brain barrier and deposits in the basal ganglia and brainstem nuclei.",
      clinicalHallmarks: "Profound neonatal jaundice, lethargy, choreoathetosis, kernicterus; refractory to Phenobarbital (contrasts with Type II).",
      highYieldPearls: "Type I has ZERO UGT activity (fatal without transplant); Type II has <10% activity and responds to Phenobarbital enzyme induction."
    },
    {
      id: "gastro-jaund-cholestasis",
      name: "Malignant Biliary Obstruction (Courvoisier Sign)",
      category: "Extrahepatic Cholestasis",
      subType: "Pancreatic Head Carcinoma / Cholangiocarcinoma • Direct Bili >50% • ALP/GGT >4x • Acholic Stool",
      pathophysiologyProfile: "Physical compression or intraluminal occlusion of the common bile duct prevents bile flow into the duodenum.",
      pathophysiology: "Accumulation of bile salts causes pruritus; failure of bile to reach intestines produces acholic clay-colored stools and dark urine.",
      clinicalHallmarks: "Painless progressive jaundice, palpable non-tender gallbladder (Courvoisier sign), weight loss; ERCP/EUS with stent placement.",
      highYieldPearls: "Painless jaundice + palpable non-tender gallbladder = Malignant obstruction (Pancreatic Head Adenocarcinoma)."
    }
  ],

  ibd: [
    {
      id: "gastro-ibd-crohn",
      name: "Crohn Transmural Disease (Skip Lesions & Granulomas)",
      category: "Inflammatory Bowel Disease",
      subType: "Mouth-to-Anus (Terminal Ileum 80%) • Skip Lesions • Transmural • Non-Caseating Granulomas • ASCA+",
      pathophysiologyProfile: "Th1/Th17 cell-mediated chronic transmural granulomatous inflammation leading to strictures, fissures, and fistulae.",
      pathophysiology: "Loss of epithelial barrier integrity triggers inappropriate immune responses to commensal microbiota.",
      clinicalHallmarks: "Right lower quadrant abdominal pain, non-bloody diarrhea, perianal fistulas, aphthous ulcers; 'string sign' on barium.",
      highYieldPearls: "Terminal ileal inflammation impairs bile salt reabsorption, leading to cholesterol gallstones and calcium oxalate kidney stones."
    },
    {
      id: "gastro-ibd-uc",
      name: "Ulcerative Colitis (Continuous Mucosal & Crypt Abscesses)",
      category: "Inflammatory Bowel Disease",
      subType: "Colon Only (Rectum to Cecum) • Continuous • Mucosal/Submucosal • Crypt Abscesses • p-ANCA+ • PSC",
      pathophysiologyProfile: "Th2-atypical autoimmune inflammation confined strictly to the mucosal and submucosal layers of the colon.",
      pathophysiology: "Neutrophilic infiltration into the crypts of Lieberkühn forms microabscesses with diffuse mucosal ulceration and pseudopolyps.",
      clinicalHallmarks: "Bloody diarrhea with tenesmus, crampy abdominal pain; 'lead-pipe' colon; associated with Primary Sclerosing Cholangitis.",
      highYieldPearls: "Total Proctocolectomy is CURATIVE for intestinal disease in UC, whereas surgery in Crohn Disease is non-curative."
    },
    {
      id: "gastro-ibd-toxic-megacolon",
      name: "Toxic Megacolon Crisis (Colonic Dilation >6 cm)",
      category: "IBD Emergency",
      subType: "Severe UC Flare • Transverse Colon Diameter >6 cm • High Perforation Risk • IV Steroids / Colectomy",
      pathophysiologyProfile: "Severe transmural neuromuscular paralysis and inducible nitric oxide synthase overactivation.",
      pathophysiology: "Loss of smooth muscle tone allows rapid colonic distension, progressive ischemia, and potential life-threatening peritonitis.",
      clinicalHallmarks: "High fever, tachycardia, marked abdominal distension with peritoneal signs, leukocytosis; avoid colonoscopy or antidiarrheals!",
      highYieldPearls: "Barium enema and colonoscopy are strictly CONTRAINDICATED in toxic megacolon due to high perforation risk."
    },
    {
      id: "gastro-ibd-psc",
      name: "Primary Sclerosing Cholangitis (Onion-Skin & p-ANCA)",
      category: "Extraintestinal Association",
      subType: "Strong UC Association (70-80%) • 'Beaded' Biliary Tree on MRCP • Concentric 'Onion-Skin' Periductal Fibrosis",
      pathophysiologyProfile: "Progressive, immune-mediated obliterative fibrosis of both intrahepatic and extrahepatic bile ducts.",
      pathophysiology: "Periductular T-cell infiltration and concentric onion-skin fibrosis produce multifocal strictures and saccular dilations.",
      clinicalHallmarks: "Fatigue, pruritus, progressive jaundice, elevated ALP/GGT, p-ANCA+; marked increase in lifetime risk of Cholangiocarcinoma.",
      highYieldPearls: "MRCP shows pathognomonic 'string-of-beads' appearance; screening colonoscopy required due to severe colorectal cancer risk."
    }
  ],

  pancreas: [
    {
      id: "gastro-panc-acute-pancreatitis",
      name: "Acute Biliary Pancreatitis (Lipase >=3x & Ringer's)",
      category: "Exocrine Pancreatic Emergency",
      subType: "Gallstones (40%) / Alcohol (30%) • Lipase >=3x ULN • Early Aggressive Lactated Ringer's Hydration",
      pathophysiologyProfile: "Intra-acinar premature trypsinogen activation triggers autodigestion of pancreatic parenchyma and peripancreatic fat necrosis.",
      pathophysiology: "Enzyme extravasation into the systemic circulation causes systemic inflammatory response syndrome (SIRS) and capillary leak.",
      clinicalHallmarks: "Severe epigastric pain radiating straight to back, nausea, vomiting, Cullen/Grey Turner signs; early enteral nutrition within 24-48h.",
      highYieldPearls: "Serum Lipase is superior to amylase (remains elevated for 8-14 days); Lactated Ringer's is superior to normal saline (reduces SIRS)."
    },
    {
      id: "gastro-panc-celiac",
      name: "Celiac Enteropathy (Anti-tTG & Villous Atrophy)",
      category: "Small Intestinal Malabsorption",
      subType: "Anti-tTG IgA / Anti-EMA • Duodenal Villous Blunting & Crypt Hyperplasia • HLA-DQ2/DQ8 • Gluten-Free",
      pathophysiologyProfile: "Autoimmune enteropathy triggered by dietary gluten (gliadin) deamidated by tissue transglutaminase.",
      pathophysiology: "Presentation of deamidated gliadin via HLA-DQ2/DQ8 to CD4+ T cells stimulates cytotoxic intraepithelial lymphocyte destruction of enterocytes.",
      clinicalHallmarks: "Chronic steatorrhea, microcytic iron deficiency anemia, metabolic bone disease, weight loss; completely reverses on gluten-free diet.",
      highYieldPearls: "Dermatitis Herpetiformis (pruritic vesicles over extensor surfaces with granular IgA dermal papillae) is pathognomonic."
    },
    {
      id: "gastro-panc-whipple",
      name: "Whipple Systemic Lipodystrophy (PAS+ Macrophages)",
      category: "Infectious Malabsorption",
      subType: "Tropheryma whipplei • PAS-Positive Diastase-Resistant Macrophages • CAN Triad (Cardiac/Arthralgias/Neuro)",
      pathophysiologyProfile: "Infiltration of the small intestinal lamina propria by foamy macrophages laden with Tropheryma whipplei actinomycetes.",
      pathophysiology: "Macrophage accumulation compresses intestinal lacteals, blocking chylomicron transport and causing severe malabsorption.",
      clinicalHallmarks: "Hyperpigmentation, lymphadenopathy, migratory polyarthralgias, diarrhea, oculomasticatory myorhythmia; Ceftriaxone -> 1 yr TMP-SMX.",
      highYieldPearls: "Periodic Acid-Schiff (PAS) positive, diastase-resistant foamy macrophages in the lamina propria confirm Whipple disease."
    },
    {
      id: "gastro-panc-dermatitis-herpetiformis",
      name: "Dermatitis Herpetiformis (Granular IgA & Dapsone)",
      category: "Autoimmune Dermatopathy",
      subType: "Cutaneous Manifestation of Celiac • Granular IgA at Dermal Papillae • Pruritic Extensor Vesicles • Dapsone",
      pathophysiologyProfile: "Circulating anti-epidermal transglutaminase IgA autoantibodies deposit in a granular pattern at the dermal-epidermal junction.",
      pathophysiology: "IgA immune complex deposition recruits neutrophils, forming microabscesses at the tips of dermal papillae and subepidermal blisters.",
      clinicalHallmarks: "Intensely itchy, excoriated papulovesicular clusters on elbows, knees, buttocks, and upper back; responds rapidly to oral Dapsone.",
      highYieldPearls: "Direct immunofluorescence demonstrating granular IgA at dermal papillae tips is 100% specific for gluten-sensitive enteropathy."
    }
  ]
};

interface GastroenterologyLabViewerProps {
  initialMode?: GastroenterologyLabMode;
  height?: string;
  onNodeSelect?: (node: GastroenterologyLabNode) => void;
}

export default function GastroenterologyLabViewer({
  initialMode = "cirrhosis",
  height = "560px",
  onNodeSelect,
}: GastroenterologyLabViewerProps) {
  const [activeMode, setActiveMode] = useState<GastroenterologyLabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Cirrhosis Selector State
  const [selectedCirr, setSelectedCirr] = useState<"sbp" | "saag" | "varices" | "hrs">("sbp");

  // Jaundice Profiler State
  const [selectedJaund, setSelectedJaund] = useState<"gilbert" | "dubin" | "crigler" | "cholestasis">("gilbert");

  const cirrDetails = useMemo(() => {
    if (selectedCirr === "sbp") {
      return {
        title: "Spontaneous Bacterial Peritonitis (SBP)",
        profile: "Ascitic Fluid ANC >250/uL • E. coli & Klebsiella • Translocation across Bowel",
        rx: "Immediate IV 3rd-Gen Cephalosporin (Ceftriaxone) + IV Albumin (1.5 g/kg Day 1, 1.0 g/kg Day 3)",
        pearl: "IV Albumin reduces the incidence of hepatorenal syndrome and improves survival by >50%."
      };
    } else if (selectedCirr === "saag") {
      return {
        title: "Serum-Ascites Albumin Gradient (SAAG)",
        profile: "SAAG >=1.1 g/dL (Portal Hypertension) vs SAAG <1.1 g/dL (Carcinomatosis / TB / Nephrotic)",
        rx: "High SAAG + Low Protein (<2.5): Cirrhosis. High SAAG + High Protein (>=2.5): Heart Failure.",
        pearl: "SAAG is calculated as Serum Albumin minus Ascitic Fluid Albumin."
      };
    } else if (selectedCirr === "varices") {
      return {
        title: "Esophageal Variceal Hemorrhage",
        profile: "HVPG >10-12 mmHg • Submucosal Coronary/Azygos Collateral Rupture",
        rx: "Restrictive Blood Transfusion (Hb 7-8 g/dL) + IV Octreotide + IV Ceftriaxone + Endoscopic Band Ligation",
        pearl: "Non-selective beta-blockers (Nadolol/Propranolol) provide proven primary bleed prophylaxis."
      };
    } else {
      return {
        title: "Hepatorenal Syndrome (HRS)",
        profile: "Profound Splanchnic Vasodilation -> Reflex Renal Cortical Vasoconstriction with FeNa <1.0%",
        rx: "Terlipressin + IV Albumin (or Norepinephrine + Albumin); Definitive is Liver Transplantation",
        pearl: "Diagnosis of exclusion: must withhold diuretics and confirm no improvement after 48h of IV albumin."
      };
    }
  }, [selectedCirr]);

  const jaundDetails = useMemo(() => {
    if (selectedJaund === "gilbert") {
      return {
        title: "Gilbert Syndrome (Benign Stress Jaundice)",
        indices: "Unconjugated Hyperbilirubinemia • UGT1A1 TA7 Promoter Mutation • Normal LFTs & Hemoglobin",
        rx: "Reassurance; no pharmacotherapy or dietary restriction required",
        pearl: "Episodic mild jaundice triggered by fasting, physical stress, alcohol, or intercurrent illness."
      };
    } else if (selectedJaund === "dubin") {
      return {
        title: "Dubin-Johnson Syndrome (Black Liver)",
        indices: "Conjugated Hyperbilirubinemia • Defective Canalicular MRP2/ABCC2 Export • Dense Black Pigmented Liver",
        rx: "Benign condition; normal life expectancy; avoid unnecessary surgical exploration",
        pearl: "Contrasts with Rotor syndrome which has defective OATP1B1/B3 uptake and a NORMAL non-pigmented liver."
      };
    } else if (selectedJaund === "crigler") {
      return {
        title: "Crigler-Najjar Syndrome Type I",
        indices: "Severe Unconjugated Hyperbilirubinemia (>20-45 mg/dL) • Complete Absence of UGT1A1",
        rx: "Intensive phototherapy, plasmapheresis, and emergent Orthotopic Liver Transplantation",
        pearl: "Type I has zero UGT activity (unresponsive to Phenobarbital); Type II responds to Phenobarbital."
      };
    } else {
      return {
        title: "Malignant Extrahepatic Cholestasis",
        indices: "Conjugated Hyperbilirubinemia (>50%) • Marked ALP/GGT Elevation • Acholic Pale Stools • Dark Urine",
        rx: "Biliary decompression with endoscopic stent placement (ERCP) and surgical oncological resection",
        pearl: "Courvoisier Sign: Painless jaundice + palpable non-tender gallbladder = Pancreatic Head Adenocarcinoma."
      };
    }
  }, [selectedJaund]);

  const currentNodes = useMemo(() => {
    return GASTROENTEROLOGY_LAB_NODES[activeMode] || GASTROENTEROLOGY_LAB_NODES.cirrhosis;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: GastroenterologyLabNode) => {
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
            <Flame size={14} /> GASTRO-301
          </span>
          <span className={styles.titleText}>
            {activeMode === "cirrhosis" && "Cirrhosis, Portal Hypertension, SAAG Ascites Gradient & SBP Management"}
            {activeMode === "jaundice" && "Differential Diagnosis of Jaundice & Bilirubin Metabolism"}
            {activeMode === "ibd" && "Inflammatory Bowel Disease: Crohn Disease vs Ulcerative Colitis"}
            {activeMode === "pancreas" && "Acute Pancreatitis, Celiac Disease (anti-tTG) & Malabsorption"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Gastroenterology Diagnostic Quiz"}
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
                  Gastroenterology Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify GI/Hepatic Entity: {quizTargetNode.clinicalHallmarks}
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

          {/* Mode 1: Cirrhosis & Portal HTN */}
          {activeMode === "cirrhosis" && (
            <div className={styles.gastroCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={14} /> Cirrhosis &amp; Portal Hypertension Diagnostic Suite
                </span>
                <span className="text-[11px] text-slate-400">SAAG Gradient &bull; SBP (ANC &gt;250) &bull; Varices &bull; HRS</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => setSelectedCirr("sbp")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedCirr === "sbp"
                      ? "bg-amber-600 text-white border-amber-400"
                      : "bg-stone-900 text-slate-300 border-stone-700"
                  }`}
                >
                  🦠 SBP (ANC &gt;250)
                </button>
                <button
                  onClick={() => setSelectedCirr("saag")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedCirr === "saag"
                      ? "bg-amber-600 text-white border-amber-400"
                      : "bg-stone-900 text-slate-300 border-stone-700"
                  }`}
                >
                  🧪 SAAG &ge;1.1 Ascites
                </button>
                <button
                  onClick={() => setSelectedCirr("varices")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedCirr === "varices"
                      ? "bg-amber-600 text-white border-amber-400"
                      : "bg-stone-900 text-slate-300 border-stone-700"
                  }`}
                >
                  🩸 Variceal Bleed
                </button>
                <button
                  onClick={() => setSelectedCirr("hrs")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedCirr === "hrs"
                      ? "bg-amber-600 text-white border-amber-400"
                      : "bg-stone-900 text-slate-300 border-stone-700"
                  }`}
                >
                  ⚡ Hepatorenal (HRS)
                </button>
              </div>

              <div className="p-3 bg-stone-950/80 rounded-lg border border-stone-800 text-xs">
                <div className="text-sm font-bold text-amber-300">{cirrDetails.title}</div>
                <div className="text-emerald-400 font-bold mt-1">{cirrDetails.profile}</div>
                <div className="text-slate-300 mt-1"><strong className="text-amber-400">Clinical Regimen:</strong> {cirrDetails.rx}</div>
                <div className="text-yellow-300 font-semibold mt-1"><strong className="text-yellow-400">High-Yield Pearl:</strong> {cirrDetails.pearl}</div>
              </div>
            </div>
          )}

          {/* Mode 2: Jaundice Differential */}
          {activeMode === "jaundice" && (
            <div className={styles.gastroCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Calculator size={14} /> Jaundice Differential &amp; Bilirubin Metabolism
                </span>
                <span className="text-[11px] text-slate-400">Gilbert &bull; Dubin-Johnson &bull; Crigler &bull; Cholestasis</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => setSelectedJaund("gilbert")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedJaund === "gilbert"
                      ? "bg-amber-600 text-white border-amber-400"
                      : "bg-stone-900 text-slate-300 border-stone-700"
                  }`}
                >
                  🟡 Gilbert (Stress)
                </button>
                <button
                  onClick={() => setSelectedJaund("dubin")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedJaund === "dubin"
                      ? "bg-amber-600 text-white border-amber-400"
                      : "bg-stone-900 text-slate-300 border-stone-700"
                  }`}
                >
                  ⚫ Dubin-Johnson (Black)
                </button>
                <button
                  onClick={() => setSelectedJaund("crigler")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedJaund === "crigler"
                      ? "bg-amber-600 text-white border-amber-400"
                      : "bg-stone-900 text-slate-300 border-stone-700"
                  }`}
                >
                  🚨 Crigler-Najjar Type I
                </button>
                <button
                  onClick={() => setSelectedJaund("cholestasis")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedJaund === "cholestasis"
                      ? "bg-amber-600 text-white border-amber-400"
                      : "bg-stone-900 text-slate-300 border-stone-700"
                  }`}
                >
                  ⚠️ Courvoisier Sign
                </button>
              </div>

              <div className="p-3 bg-stone-950/80 rounded-lg border border-stone-800 text-xs">
                <div className="text-sm font-bold text-amber-300">{jaundDetails.title}</div>
                <div className="text-emerald-400 font-bold mt-1">{jaundDetails.indices}</div>
                <div className="text-slate-300 mt-1"><strong className="text-amber-400">Management:</strong> {jaundDetails.rx}</div>
                <div className="text-yellow-300 font-semibold mt-1"><strong className="text-yellow-400">Diagnostic Rule:</strong> {jaundDetails.pearl}</div>
              </div>
            </div>
          )}

          {/* Mode 3: IBD Matrix */}
          {activeMode === "ibd" && (
            <div className={styles.gastroCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield size={14} /> Inflammatory Bowel Disease Matrix
                </span>
                <span className="text-[11px] text-slate-400">Crohn (Transmural/Skip/ASCA) vs UC (Mucosal/p-ANCA/PSC)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-stone-950/80 rounded-lg border border-stone-800">
                  <div className="text-amber-300 font-bold">Crohn Disease (CD)</div>
                  <div className="text-slate-300 mt-1">Transmural inflammation, skip lesions (mouth to anus, terminal ileum in 80%), non-caseating granulomas, fistulas, strictures (string sign), ASCA+, gallstones &amp; oxalate kidney stones.</div>
                </div>

                <div className="p-3 bg-stone-950/80 rounded-lg border border-stone-800">
                  <div className="text-amber-300 font-bold">Ulcerative Colitis (UC)</div>
                  <div className="text-slate-300 mt-1">Mucosal/submucosal depth, continuous from rectum, crypt abscesses with neutrophils, pseudopolyps, lead-pipe colon, toxic megacolon, p-ANCA+, PSC association, curative via total proctocolectomy.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 4: Pancreatitis & Malabsorption */}
          {activeMode === "pancreas" && (
            <div className={styles.gastroCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap size={14} /> Pancreatitis &amp; Malabsorption Workstation
                </span>
                <span className="text-[11px] text-slate-400">Acute Pancreatitis &bull; Celiac (anti-tTG) &bull; Whipple (PAS+)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-stone-950/80 rounded-lg border border-stone-800">
                  <div className="text-amber-300 font-bold">Acute Pancreatitis</div>
                  <div className="text-slate-300 mt-1">Atlanta criteria (Lipase &ge;3x ULN, epigastric pain to back, CT imaging). Gallstones (40%) and alcohol (30%). Aggressive IV Lactated Ringer's hydration + early enteral nutrition within 24-48h.</div>
                </div>

                <div className="p-3 bg-stone-950/80 rounded-lg border border-stone-800">
                  <div className="text-amber-300 font-bold">Celiac Disease &amp; Whipple Disease</div>
                  <div className="text-slate-300 mt-1">Celiac: Anti-tTG IgA, duodenal villous atrophy, HLA-DQ2/DQ8, Dermatitis Herpetiformis (Dapsone). Whipple: Tropheryma whipplei, PAS+ diastase-resistant foamy macrophages in lamina propria.</div>
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

                  <div className="text-[11px] text-slate-300 font-medium bg-stone-950/60 p-2 rounded border border-stone-800">
                    <span className="text-amber-400 font-bold">Pathophysiology:</span> {node.pathophysiologyProfile}
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

        {/* Right Side: High-Yield Gastroenterology Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Gastroenterology Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🔬 GI / Hepatic Entity</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>📊 Pathophysiology &amp; Diagnostics</div>
            <div className="text-xs text-amber-300 font-semibold">{activeNode.pathophysiologyProfile}</div>
            <div className={styles.inspectorBody}>{activeNode.pathophysiology}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🩺 Clinical Hallmarks &amp; Protocol</div>
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
          onClick={() => setActiveMode("cirrhosis")}
          className={`${styles.modeTab} ${activeMode === "cirrhosis" ? styles.modeTabActive : ""}`}
        >
          🩸 1. Cirrhosis &amp; SBP
        </button>
        <button
          onClick={() => setActiveMode("jaundice")}
          className={`${styles.modeTab} ${activeMode === "jaundice" ? styles.modeTabActive : ""}`}
        >
          🟡 2. Jaundice Differential
        </button>
        <button
          onClick={() => setActiveMode("ibd")}
          className={`${styles.modeTab} ${activeMode === "ibd" ? styles.modeTabActive : ""}`}
        >
          🛡️ 3. IBD (Crohn vs UC)
        </button>
        <button
          onClick={() => setActiveMode("pancreas")}
          className={`${styles.modeTab} ${activeMode === "pancreas" ? styles.modeTabActive : ""}`}
        >
          ⚡ 4. Pancreas &amp; Celiac
        </button>
      </div>
    </div>
  );
}
