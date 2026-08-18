"use client";

import React, { useState, useMemo } from "react";
import styles from "./MicrobiologyLabViewer.module.css";
import {
  Activity,
  Flame,
  Zap,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Maximize2,
  Minimize2,
  ShieldAlert,
  Search,
  Eye,
  Microscope,
} from "lucide-react";

export type MicroLabMode = "bacteriology" | "hypersensitivity" | "toxins" | "virology";

export interface MicroLabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  diagnosticKey: string;
  pathophysiology: string;
  clinicalDisease: string;
  pharmacologyOrVaccine?: string;
  highYieldPearl: string;
}

export const MICRO_NODES: Record<MicroLabMode, MicroLabNode[]> = {
  bacteriology: [
    {
      id: "staph-aureus",
      name: "1. Staphylococcus aureus",
      category: "Gram-Positive Cocci in Clusters",
      subType: "Catalase (+), Coagulase (+), Beta-Hemolytic",
      diagnosticKey: "Golden yellow colonies on sheep blood agar; ferments mannitol on Mannitol Salt Agar (MSA turns yellow).",
      pathophysiology: "Protein A binds Fc portion of IgG, inhibiting complement activation and phagocytosis; preformed enterotoxins, TSST-1, exfoliatin.",
      clinicalDisease: "Skin abscesses, furuncles, impetigo, acute infective endocarditis (IV drug users, tricuspid), osteomyelitis, septic arthritis.",
      pharmacologyOrVaccine: "Nafcillin/Oxacillin (MSSA); Vancomycin/Daptomycin (MRSA - altered PBP2a via mecA gene).",
      highYieldPearl: "Protein A is the master virulence factor preventing opsonization and phagocytic engulfment."
    },
    {
      id: "strep-pyogenes",
      name: "2. Streptococcus pyogenes (Group A Strep)",
      category: "Gram-Positive Cocci in Chains",
      subType: "Catalase (-), Beta-Hemolytic, Bacitracin Sensitive",
      diagnosticKey: "Pyrrolidonyl arylamidase (PYR) test positive; wide zone of clear beta-hemolysis; inhibited by Bacitracin disk.",
      pathophysiology: "M protein inhibits phagocytosis (molecular mimicry triggers Rheumatic Fever); Streptolysin O (ASO titer), Streptokinase, Hyaluronidase.",
      clinicalDisease: "Pharyngitis, cellulitis, erysipelas, impetigo, scarlet fever (strawberry tongue), Post-Streptococcal Glomerulonephritis (PSGN), Rheumatic Fever.",
      pharmacologyOrVaccine: "Penicillin G / V or Amoxicillin; Early treatment of pharyngitis prevents Rheumatic Fever (but NOT PSGN).",
      highYieldPearl: "Rheumatic fever occurs after pharyngitis only, whereas PSGN follows both pharyngitis and cutaneous impetigo."
    },
    {
      id: "strep-pneumoniae",
      name: "3. Streptococcus pneumoniae (Pneumococcus)",
      category: "Gram-Positive Lancet Diplococci",
      subType: "Catalase (-), Alpha-Hemolytic, Optochin Sensitive",
      diagnosticKey: "Bile soluble (lysed by deoxycholate); sensitive to Optochin; positive Quellung capsule swelling reaction.",
      pathophysiology: "Polysaccharide capsule is the major virulence factor; IgA protease cleaves secretory IgA facilitating mucosal colonization.",
      clinicalDisease: "#1 cause of Community-Acquired Pneumonia (rusty sputum), Otitis Media, Sinusitis, and Bacterial Meningitis (MOPS).",
      pharmacologyOrVaccine: "PCV13 conjugate vaccine (T-cell dependent) and PPSV23 polysaccharide vaccine (T-cell independent).",
      highYieldPearl: "Asplenic patients (e.g. sickle cell disease) have high susceptibility to fatal encapsulated sepsis from S. pneumoniae."
    },
    {
      id: "pseudomonas-aeruginosa",
      name: "4. Pseudomonas aeruginosa",
      category: "Gram-Negative Aerobic Bacillus",
      subType: "Non-Lactose Fermenter, Oxidase (+), Pyocyanin (+)",
      diagnosticKey: "Blue-green pyocyanin/pyoverdin pigments, sweet grape-like fruity odor; grows at 42 C; obligate aerobe.",
      pathophysiology: "Exotoxin A ADP-ribosylates Elongation Factor-2; Endotoxin shock; Alginate slime biofilm; Phospholipase C.",
      clinicalDisease: "Pneumonia in Cystic Fibrosis, Ecthyma Gangrenosum (black necrotic skin ulcers) in neutropenic patients, hot tub folliculitis, malignant otitis externa in diabetics.",
      pharmacologyOrVaccine: "Antipseudomonal penicillins (Piperacillin-Tazobactam), Cefepime, Meropenem, Ciprofloxacin.",
      highYieldPearl: "Pseudomonas produces Exotoxin A which has the exact same molecular mechanism as Diphtheria toxin (EF-2 ADP-ribosylation)."
    }
  ],

  hypersensitivity: [
    {
      id: "type1-anaphylaxis",
      name: "1. Type I: Immediate / Anaphylactic",
      category: "Coombs Hypersensitivity",
      subType: "IgE Mediated • Mast Cell / Basophil Degranulation",
      diagnosticKey: "Elevated serum Tryptase (marker of mast cell degranulation) and specific IgE antibodies (RAST).",
      pathophysiology: "Antigen crosslinks membrane-bound IgE on mast cells -> explosive release of preformed Histamine, Tryptase, and de novo Leukotrienes (LTC4, LTD4, LTE4).",
      clinicalDisease: "Anaphylactic shock (peanut, penicillin, bee venom), Allergic Asthma, Allergic Rhinitis (hay fever), Atopic Eczema, Acute Urticaria.",
      pharmacologyOrVaccine: "Intramuscular Epinephrine (first-line for anaphylaxis); Antihistamines; Omalizumab (anti-IgE antibody).",
      highYieldPearl: "Epinephrine is the drug of choice for anaphylaxis: alpha-1 vasoconstriction reverses hypotension, beta-2 bronchodilates airways."
    },
    {
      id: "type2-cytotoxic",
      name: "2. Type II: Antibody-Mediated Cytotoxic",
      category: "Coombs Hypersensitivity",
      subType: "IgM & IgG Antibodies • Tissue-Specific Antigens",
      diagnosticKey: "Positive Direct/Indirect Antiglobulin (Coombs) test; linear immunofluorescence on biopsy.",
      pathophysiology: "Antibodies bind fixed cell-surface antigens -> complement-mediated membrane attack complex (MAC) lysis, Fc-receptor phagocytosis, or ADCC.",
      clinicalDisease: "Goodpasture Syndrome (anti-alpha3 Type IV collagen), Myasthenia Gravis (anti-AChR), Graves Disease (anti-TSH-R), Autoimmune Hemolytic Anemia, Rheumatic Fever.",
      pharmacologyOrVaccine: "Plasmapheresis, Corticosteroids, IVIG, Immunosuppressants (Azathioprine, Rituximab).",
      highYieldPearl: "Goodpasture presents with linear IgG and C3 deposition along the glomerular and alveolar basement membranes."
    },
    {
      id: "type3-immune-complex",
      name: "3. Type III: Immune-Complex Mediated",
      category: "Coombs Hypersensitivity",
      subType: "Circulating Antigen-Antibody Aggregates • Complement Activation",
      diagnosticKey: "Lumpy-bumpy granular immunofluorescence deposits; low serum C3 and C4 complement levels.",
      pathophysiology: "Circulating soluble Ag-Ab complexes deposit in vessel walls -> activate classical complement -> C5a recruits neutrophils -> release lysosomal enzymes causing fibrinoid vasculitis.",
      clinicalDisease: "Systemic Lupus Erythematosus (SLE), Post-Streptococcal Glomerulonephritis (PSGN), Polyarteritis Nodosa, Serum Sickness (fever, urticaria, arthralgia 7-10d post-serum).",
      pharmacologyOrVaccine: "Corticosteroids, Cyclophosphamide, Mycophenolate Mofetil.",
      highYieldPearl: "Serum sickness is a systemic Type III reaction occurring 1-2 weeks after foreign serum/protein administration."
    },
    {
      id: "type4-delayed",
      name: "4. Type IV: Delayed-Type Cell-Mediated",
      category: "Coombs Hypersensitivity",
      subType: "Sensitized T-Cells (CD4+ Th1 & CD8+ CTLs) • NO Antibodies",
      diagnosticKey: "Induration >=10-15 mm at 48-72 hours on Mantoux tuberculin PPD skin test; patch test positive.",
      pathophysiology: "Sensitized CD4+ Th1 cells recognize antigen -> secrete IFN-gamma and TNF-alpha -> activate macrophages -> tissue destruction and granuloma formation (takes 24-72 hours).",
      clinicalDisease: "Contact Dermatitis (Poison Ivy / Urushiol, Nickel), Tuberculin PPD Skin Test, Multiple Sclerosis, Type 1 Diabetes Mellitus, Graft-versus-Host Disease (GVHD).",
      pharmacologyOrVaccine: "Topical / Systemic Corticosteroids; Calcineurin inhibitors (Tacrolimus, Cyclosporine).",
      highYieldPearl: "Type IV hypersensitivity is the only class that is purely cell-mediated with zero involvement of antibodies."
    }
  ],

  toxins: [
    {
      id: "diphtheria-toxin",
      name: "1. Diphtheria Toxin & Pseudomonas Exotoxin A",
      category: "A-B Subunit Toxins",
      subType: "ADP-Ribosylation of Elongation Factor-2 (EF-2)",
      diagnosticKey: "Black colonies on cystine-tellurite agar; positive Elek immunodiffusion test for toxigenicity.",
      pathophysiology: "ADP-ribosylates and inactivates host cell EF-2 -> complete inhibition of protein synthesis -> host mucosal and myocardial necrosis.",
      clinicalDisease: "Corynebacterium diphtheriae: pseudomembranous pharyngitis ('bull neck' lymphadenopathy), fatal myocarditis, and peripheral neuropathies.",
      pharmacologyOrVaccine: "Diphtheria Antitoxin (passive equine antibodies) + Erythromycin; DTaP toxoid vaccine.",
      highYieldPearl: "Diphtheria toxin is encoded on a lysogenic corynephage (beta-phage) integrated into the bacterial chromosome."
    },
    {
      id: "cholera-toxin",
      name: "2. Cholera Toxin & ETEC Heat-Labile Enterotoxin",
      category: "Enterotoxins",
      subType: "ADP-Ribosylation of Gs Alpha Subunit (cAMP Activation)",
      diagnosticKey: "Yellow colonies on Thiosulfate-Citrate-Bile Salts-Sucrose (TCBS) agar; non-invasive stool microscopy (no RBCs/WBCs).",
      pathophysiology: "Permanently activates Gs alpha subunit -> continuous adenylate cyclase activation -> massive cAMP rise -> opening of CFTR chloride channels -> efflux of Cl-, Na+, and H2O into lumen.",
      clinicalDisease: "Vibrio cholerae: voluminous secretory 'rice-water' diarrhea (up to 20 L/day), profound dehydration, hypokalemic metabolic acidosis.",
      pharmacologyOrVaccine: "Oral Rehydration Salts (ORS with glucose and electrolytes); Doxycycline/Azithromycin.",
      highYieldPearl: "Oral rehydration therapy works because glucose-coupled sodium absorption (SGLT1) remains intact despite cholera toxin."
    },
    {
      id: "tetanospasmin-botulinum",
      name: "3. Tetanospasmin vs Botulinum Neurotoxins",
      category: "Neurotoxins",
      subType: "SNARE Protein Cleavage (Synaptobrevin / VAMP)",
      diagnosticKey: "Clinical diagnosis; Spatula test positive for tetanus (reflex spasm on touching posterior pharynx).",
      pathophysiology: "Tetanus toxin blocks inhibitory GABA/Glycine release from Renshaw cells (spastic paralysis). Botulinum blocks stimulatory ACh release at NMJ (flaccid paralysis).",
      clinicalDisease: "Clostridium tetani: Trismus (lockjaw), Risus sardonicus, Opisthotonos. Clostridium botulinum: Descending flaccid paralysis, ptosis, pupillary mydriasis, infant floppy baby.",
      pharmacologyOrVaccine: "Tetanus Toxoid Vaccine (DTaP); Tetanus Immune Globulin (TIG); Botulinum Antitoxin.",
      highYieldPearl: "Tetanospasmin causes spastic paralysis by blocking inhibitory interneurons; Botulinum causes flaccid paralysis by blocking stimulatory ACh."
    },
    {
      id: "superantigen-tsst1",
      name: "4. Toxic Shock Superantigens (TSST-1 & SpeA)",
      category: "Superantigens",
      subType: "MHC Class II + TCR V-Beta Direct Crosslinking",
      diagnosticKey: "Isolation of S. aureus from vaginal swab/wound; blood cultures typically negative (toxin-mediated disease).",
      pathophysiology: "Crosslinks MHC Class II to TCR variable beta-chain without antigen processing -> activates 20% of T-cells -> massive release of IL-1, IL-2, TNF-alpha, IFN-gamma.",
      clinicalDisease: "Staphylococcal / Streptococcal Toxic Shock Syndrome: high fever, sunburn-like erythrodermic rash (desquamates in 1-2 weeks), shock, and multi-organ failure.",
      pharmacologyOrVaccine: "IV fluids, Clindamycin (protein synthesis inhibitor that suppresses toxin production) + Vancomycin.",
      highYieldPearl: "Clindamycin is specifically added to beta-lactams in toxic shock and necrotizing fasciitis to shut down ribosomal toxin synthesis."
    }
  ],

  virology: [
    {
      id: "hbv-acute",
      name: "1. Acute Hepatitis B (Active Viral Replication)",
      category: "Viral Hepatitis Serology",
      subType: "HBsAg (+), HBeAg (+), Anti-HBc IgM (+)",
      diagnosticKey: "Presence of HBsAg (surface antigen) and Anti-HBc IgM (core IgM) confirms acute infection.",
      pathophysiology: "Partially double-stranded DNA virus with reverse transcriptase; hepatocellular injury is CD8+ T-cell mediated (not cytopathic).",
      clinicalDisease: "Jaundice, dark urine, tender hepatomegaly, markedly elevated AST/ALT (>1000 U/L), right upper quadrant pain.",
      pharmacologyOrVaccine: "Supportive care; Tenofovir / Entecavir in fulminant cases; Recombinant HBsAg vaccine.",
      highYieldPearl: "HBeAg indicates active viral replication, high HBV DNA levels, and maximal risk of transmission."
    },
    {
      id: "hbv-window",
      name: "2. Hepatitis B Window Period",
      category: "Viral Hepatitis Serology",
      subType: "Anti-HBc IgM is the ONLY Positive Marker!",
      diagnosticKey: "HBsAg has been cleared by host antibodies, but Anti-HBs has not yet reached detectable serum levels.",
      pathophysiology: "Transition period between disappearance of HBsAg and appearance of protective surface antibodies (Anti-HBs).",
      clinicalDisease: "Resolving acute hepatitis B infection.",
      pharmacologyOrVaccine: "Testing for Anti-HBc IgM is essential to prevent missed diagnosis during the window period.",
      highYieldPearl: "During the window period, Anti-HBc IgM is the only reliable diagnostic serological marker of HBV infection."
    },
    {
      id: "hiv-cd4-stages",
      name: "3. HIV Opportunistic Infection Milestones",
      category: "Retrovirus & AIDS Defining Conditions",
      subType: "CD4 Count Thresholds: <500, <200, <100, <50",
      diagnosticKey: "HIV-1/2 antigen/antibody combination immunoassay (p24 antigen) confirmed by HIV viral load RNA PCR.",
      pathophysiology: "gp120 binds CD4 and CCR5/CXCR4; reverse transcriptase integrates viral cDNA into host genome; progressive loss of CD4+ T-helper cells.",
      clinicalDisease: "CD4 <200: Pneumocystis jirovecii (PCP). CD4 <100: Toxoplasmosis (ring lesions), Cryptococcus. CD4 <50: Mycobacterium avium complex (MAC), CMV retinitis.",
      pharmacologyOrVaccine: "Triple ART (2 NRTIs + 1 Integrase Inhibitor e.g. Dolutegravir + Tenofovir/Emtricitabine); TMP-SMX prophylaxis for CD4 <200.",
      highYieldPearl: "TMP-SMX prophylaxis is initiated at CD4 <200/uL to prevent both Pneumocystis jirovecii pneumonia and Toxoplasma gondii encephalitis."
    }
  ]
};

interface MicrobiologyLabViewerProps {
  initialMode?: MicroLabMode;
  height?: string;
  onNodeSelect?: (node: MicroLabNode) => void;
}

export default function MicrobiologyLabViewer({
  initialMode = "bacteriology",
  height = "560px",
  onNodeSelect,
}: MicrobiologyLabViewerProps) {
  const [activeMode, setActiveMode] = useState<MicroLabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const currentNodes = useMemo(() => {
    return MICRO_NODES[activeMode] || MICRO_NODES.bacteriology;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: MicroLabNode) => {
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
      {/* Top Header Controls */}
      <div className={styles.headerBar}>
        <div className={styles.titleArea}>
          <span className={styles.modeBadge}>
            <Sparkles size={14} /> MICR-201
          </span>
          <span className={styles.titleText}>
            {activeMode === "bacteriology" && "Systematic Bacteriology & Gram Flowcharts"}
            {activeMode === "hypersensitivity" && "Coombs Hypersensitivity Mechanisms (Types I-IV)"}
            {activeMode === "toxins" && "Bacterial Toxins & Virulence Mechanisms"}
            {activeMode === "virology" && "Hepatitis B Serology & HIV Opportunistic Stages"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Microbiology Quiz"}
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

      {/* Main Interactive Workspace */}
      <div className={styles.mainLayout}>
        {/* Left Side: Interactive Node Grid */}
        <div className={styles.labCanvas}>
          {/* Quiz Prompt Banner */}
          {isQuizMode && quizTargetNode && (
            <div className={styles.quizBanner}>
              <div>
                <div className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                  Diagnostic Microbiology Case • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify the Pathogen / Mechanism: {quizTargetNode.clinicalDisease}
                </div>
                {quizFeedback && (
                  <div className="text-xs text-emerald-300 font-medium mt-1">{quizFeedback}</div>
                )}
              </div>
              <button
                onClick={nextQuizQuestion}
                className="px-3 py-1 bg-slate-800 text-xs rounded border border-slate-700 text-slate-200"
              >
                Next
              </button>
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
                    <span className="text-purple-400 font-bold">Key Test:</span> {node.diagnosticKey}
                  </div>

                  <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400">
                    <span>Inspect virulence & clinical traits</span>
                    <ArrowRight size={12} className="text-slate-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: High-Yield Clinical & Microbiological Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
              Diagnostic Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🎯 Identity & Subtype</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🧪 Diagnostic Key & Culture</div>
            <div className={styles.inspectorBody}>{activeNode.diagnosticKey}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>⚡ Pathophysiology & Virulence</div>
            <div className={styles.inspectorBody}>{activeNode.pathophysiology}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🏥 Clinical Diseases & Vignette</div>
            <div className={styles.inspectorBody}>{activeNode.clinicalDisease}</div>
          </div>

          {activeNode.pharmacologyOrVaccine && (
            <div className={styles.inspectorCard}>
              <div className={styles.inspectorLabel}>💊 Antibiotics & Vaccines</div>
              <div className={styles.inspectorBody}>{activeNode.pharmacologyOrVaccine}</div>
            </div>
          )}

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 USMLE / NMC High-Yield Pearl</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearl}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("bacteriology")}
          className={`${styles.modeTab} ${activeMode === "bacteriology" ? styles.modeTabActive : ""}`}
        >
          🧫 1. Bacteriology Flowcharts
        </button>
        <button
          onClick={() => setActiveMode("hypersensitivity")}
          className={`${styles.modeTab} ${activeMode === "hypersensitivity" ? styles.modeTabActive : ""}`}
        >
          🛡️ 2. Hypersensitivity Types I-IV
        </button>
        <button
          onClick={() => setActiveMode("toxins")}
          className={`${styles.modeTab} ${activeMode === "toxins" ? styles.modeTabActive : ""}`}
        >
          ☠️ 3. Bacterial Toxins
        </button>
        <button
          onClick={() => setActiveMode("virology")}
          className={`${styles.modeTab} ${activeMode === "virology" ? styles.modeTabActive : ""}`}
        >
          🧬 4. HBV Serology & HIV
        </button>
      </div>
    </div>
  );
}
