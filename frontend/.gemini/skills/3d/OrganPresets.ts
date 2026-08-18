/**
 * Mediverse 3D WebGL Multi-Organ Scene Presets & Anatomical Landmark Pins
 * 
 * Defines high-fidelity organ system presets, camera targets, lighting themes,
 * and clinically-accurate landmark pins for interactive 3D physiology visualization.
 */

export interface LandmarkPin {
  id: string;
  name: string;
  category: 'structural' | 'cellular' | 'vascular' | 'electrophysiological' | 'functional';
  position: [number, number, number]; // [x, y, z] 3D coordinates
  color?: string;
  accentColor?: string;
  shortDescription: string;
  clinicalSignificance: string;
  physiologicalRole: string;
  pathologyNote?: string;
  histology?: string;
}

export interface OrganPreset {
  id: string;
  systemName: string;
  chapterIds: string[];
  title: string;
  subtitle: string;
  overview: string;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  themeColors: {
    primary: string;
    secondary: string;
    accent: string;
    ambient: string;
  };
  landmarks: LandmarkPin[];
  dissectionHints?: {
    recommendedPlane: 'sagittal' | 'coronal' | 'transverse';
    optimalOffset: number;
    description: string;
  };
}

export const ORGAN_PRESETS: Record<string, OrganPreset> = {
  // =========================================================================
  // 1. CARDIOVASCULAR SYSTEM
  // =========================================================================
  cardiovascular: {
    id: 'cardiovascular',
    systemName: 'Cardiovascular',
    chapterIds: ['cardiac-cycle', 'cardiovascular', 'hemodynamics', 'ecg-electrophysiology'],
    title: 'Cardiovascular & Ventricular Architecture',
    subtitle: 'Cardiac Conduction, Valvular Dynamics, and Myocardial Chambers',
    overview: 'High-pressure muscular pump coordinating systemic and pulmonary circulation via synchronized electro-mechanical coupling.',
    cameraPosition: [0, 0, 3.8],
    cameraTarget: [0, 0, 0],
    themeColors: {
      primary: '#ef4444',
      secondary: '#3b82f6',
      accent: '#f59e0b',
      ambient: '#1e1b4b',
    },
    dissectionHints: {
      recommendedPlane: 'coronal',
      optimalOffset: 0.1,
      description: 'Coronal section reveals the interventricular septum, aortic valve outflow tract, and interior ventricular cavities.',
    },
    landmarks: [
      {
        id: 'left-ventricle',
        name: 'Left Ventricle (LV)',
        category: 'structural',
        position: [-0.25, -0.28, 0.22],
        color: '#ef4444',
        accentColor: '#f87171',
        shortDescription: 'Thick muscular chamber generating systemic systolic arterial pressures (~120 mmHg).',
        physiologicalRole: 'Ejects stroke volume (~70 mL) across the aortic valve against systemic vascular resistance (SVR). Wall thickness is 3x greater than the right ventricle.',
        clinicalSignificance: 'Concentric Left Ventricular Hypertrophy (LVH) develops in chronic hypertension or aortic stenosis due to pressure overload. Left anterior descending (LAD) coronary occlusion causes anterior LV wall infarction.',
        pathologyNote: 'Reduced LV ejection fraction (LVEF < 40%) defines HFrEF (Heart Failure with reduced Ejection Fraction).',
        histology: 'Branching striated cardiomyocytes with intercalated discs containing gap junctions (connexin 43) and fascia adherens.',
      },
      {
        id: 'aortic-valve',
        name: 'Aortic Valve',
        category: 'structural',
        position: [0.08, 0.42, 0.26],
        color: '#fbbf24',
        accentColor: '#fde68a',
        shortDescription: 'Trifoliate semilunar valve situated between the left ventricular outflow tract (LVOT) and ascending aorta.',
        physiologicalRole: 'Opens during ventricular systole when LV pressure exceeds aortic diastolic pressure (~80 mmHg); prevents retrograde diastolic regurgitation.',
        clinicalSignificance: 'Calcific aortic stenosis presents with a crescendo-decrescendo systolic murmur radiating to carotids, exertional syncope, angina, and dyspnea (SAD triad).',
        pathologyNote: 'Congenital bicuspid aortic valve (1-2% prevalence) accelerates leaflet calcification and increases risk of aortic root dissection.',
        histology: 'Avascular trilaminar fibrous structure: fibrosa (collagen-rich), spongiosa (glycosaminoglycans), and ventricularis (elastin-rich).',
      },
      {
        id: 'sa-node',
        name: 'Sinoatrial (SA) Node',
        category: 'electrophysiological',
        position: [0.48, 0.65, -0.08],
        color: '#10b981',
        accentColor: '#6ee7b7',
        shortDescription: 'Primary physiological cardiac pacemaker located subepicardially in the high right atrium near the SVC orifice.',
        physiologicalRole: 'Generates spontaneous Phase 4 automaticity (intrinsic 60-100 bpm) driven by funny inward current (If: Na+/K+) and transient T-type/L-type Ca2+ currents.',
        clinicalSignificance: 'Sick Sinus Syndrome (SSS) causes alternating sinus bradycardia, sinus arrest, and paroxysmal supraventricular tachycardias (tachy-brady syndrome).',
        pathologyNote: 'Vagal parasympathetic stimulation via M2 muscarinic receptors (ACh) activates I_K,ACh channels, hyperpolarizing the pacemaker membrane and slowing heart rate.',
        histology: 'Specialized small pale P-cells (pacemaker cells) surrounded by dense collagenous stroma with few myofibrils.',
      },
      {
        id: 'interventricular-septum',
        name: 'Interventricular Septum (IVS)',
        category: 'structural',
        position: [0.02, -0.15, 0.12],
        color: '#b91c1c',
        accentColor: '#fca5a5',
        shortDescription: 'Musculomembranous partition separating the left and right ventricular chambers.',
        physiologicalRole: 'Transmits cardiac electrical action potentials through the specialized conduction system (Bundle of His and left/right bundle branches).',
        clinicalSignificance: 'Ventricular Septal Defect (VSD) presents as a harsh holosystolic murmur at the left lower sternal border with left-to-right shunting.',
        pathologyNote: 'Asymmetric Septal Hypertrophy in Hypertrophic Cardiomyopathy (HOCM) causes dynamic LVOT obstruction exacerbated by beta-agonists or dehydration.',
        histology: 'Dense helical myocardial fiber orientation with subendocardial Purkinje fibers on both septal surfaces.',
      },
    ],
  },

  // =========================================================================
  // 2. RESPIRATORY SYSTEM
  // =========================================================================
  respiratory: {
    id: 'respiratory',
    systemName: 'Respiratory',
    chapterIds: ['respiratory-mechanics', 'respiratory', 'gas-exchange', 'acid-base-respiratory'],
    title: 'Pulmonary Mechanics & Gas Exchange',
    subtitle: 'Airway Branching, Alveolar-Capillary Interface, and Thoracic Pump',
    overview: 'Dual-phase ventilation system coordinating gas diffusion across the ultra-thin alveolar-capillary blood-gas barrier.',
    cameraPosition: [0, 0, 3.6],
    cameraTarget: [0, 0, 0],
    themeColors: {
      primary: '#ec4899',
      secondary: '#06b6d4',
      accent: '#8b5cf6',
      ambient: '#0f172a',
    },
    dissectionHints: {
      recommendedPlane: 'sagittal',
      optimalOffset: 0.05,
      description: 'Sagittal cut opens the tracheobronchial tree to demonstrate alveolar branching and capillary sheet networks.',
    },
    landmarks: [
      {
        id: 'main-bronchus',
        name: 'Main (Primary) Bronchus',
        category: 'structural',
        position: [0.22, 0.52, 0.08],
        color: '#cbd5e1',
        accentColor: '#f1f5f9',
        shortDescription: 'Primary conducting airway originating at the tracheal carina and entering the pulmonary hilum.',
        physiologicalRole: 'Conducts inspired air into lobar and segmental bronchi; moistens and warms air while mucociliary escalator traps particulates.',
        clinicalSignificance: 'The right main bronchus is wider, shorter, and more vertical (~25° vs 45° left), making it the primary site for aspirated foreign objects.',
        pathologyNote: 'Bronchial asthma causes reversible airway hyperreactivity, smooth muscle bronchospasm, and thick eosinophilic mucus plugging.',
        histology: 'C-shaped hyaline cartilage rings lined by pseudostratified ciliated columnar epithelium with goblet cells and submucosal seromucous glands.',
      },
      {
        id: 'alveolar-sac',
        name: 'Alveolar Sac & Type II Pneumocyte',
        category: 'cellular',
        position: [0.52, 0.18, 0.22],
        color: '#ec4899',
        accentColor: '#f472b6',
        shortDescription: 'Terminal anatomical cluster of alveoli providing ~100 m² of surface area for passive gas diffusion.',
        physiologicalRole: 'Type I pneumocytes (95% surface area) execute gas exchange; Type II pneumocytes secrete pulmonary surfactant (dipalmitoylphosphatidylcholine).',
        clinicalSignificance: 'Neonatal Respiratory Distress Syndrome (NRDS) in preterm infants results from surfactant deficiency, leading to diffuse alveolar atelectasis and hyaline membrane formation.',
        pathologyNote: 'Emphysema (e.g. tobacco or alpha-1 antitrypsin deficiency) destroys alveolar septal walls, permanently reducing DL_CO (diffusing capacity).',
        histology: 'Ultra-thin alveolar septum composed of simple squamous Type I cells and cuboidal, lamellar body-containing Type II cells.',
      },
      {
        id: 'pulmonary-capillary',
        name: 'Pulmonary Capillary Network',
        category: 'vascular',
        position: [0.32, -0.12, 0.28],
        color: '#06b6d4',
        accentColor: '#67e8f9',
        shortDescription: 'Sheet-like dense microvascular network intimately wrapped around individual alveoli.',
        physiologicalRole: 'Enables rapid passive O2 uptake by deoxygenated red cell hemoglobin and CO2 unloading across the 0.2–0.5 μm blood-gas barrier.',
        clinicalSignificance: 'Cardiogenic Pulmonary Edema occurs when left atrial pressure exceeds 20-25 mmHg, overcoming capillary oncotic pressure and causing alveolar flooding.',
        pathologyNote: 'Pulmonary embolism blocks regional perfusion, creating high ventilation-to-perfusion (V/Q) dead space and acute hypoxemia.',
        histology: 'Non-fenestrated continuous capillary endothelium fused with alveolar epithelial basement membrane.',
      },
      {
        id: 'diaphragm',
        name: 'Diaphragm Muscle',
        category: 'functional',
        position: [0.0, -0.68, 0.14],
        color: '#b91c1c',
        accentColor: '#ef4444',
        shortDescription: 'Major dome-shaped musculotendinous muscle separating thoracic and abdominal cavities.',
        physiologicalRole: 'Contraction flattens the dome, descending ~1-2 cm (up to 10 cm in deep inspiration), creating negative intrapleural pressure (-5 to -8 cm H2O) to drive tidal airflow.',
        clinicalSignificance: 'Phrenic nerve lesion (C3, C4, C5: "3-4-5 keeps the diaphragm alive") causes paradoxical upward movement of the paralyzed hemidiaphragm during inspiration.',
        pathologyNote: 'In severe COPD, chronic air trapping flattens the diaphragm, placing it at a mechanical disadvantage and causing respiratory fatigue.',
        histology: 'Skeletal muscle fibers radiating from peripheral sternal, costal, and lumbar attachments into a central aponeurotic tendon.',
      },
    ],
  },

  // =========================================================================
  // 3. RENAL SYSTEM
  // =========================================================================
  renal: {
    id: 'renal',
    systemName: 'Renal',
    chapterIds: ['renal-filtration', 'renal', 'nephron-tubular-transport', 'renal-acid-base'],
    title: 'Nephron Architecture & Renal Clearance',
    subtitle: 'Glomerular Filtration Barrier, Countercurrent Multiplication, and Tubular Reabsorption',
    overview: 'High-flow filtration and selective reabsorption system maintaining fluid volume, electrolyte osmolarity, and acid-base homeostasis.',
    cameraPosition: [0, 0, 3.7],
    cameraTarget: [0, 0, 0],
    themeColors: {
      primary: '#eab308',
      secondary: '#dc2626',
      accent: '#10b981',
      ambient: '#1e1b4b',
    },
    dissectionHints: {
      recommendedPlane: 'sagittal',
      optimalOffset: -0.1,
      description: 'Sagittal cut reveals the glomerular capillary loops enclosed within Bowman capsule and tubular convolutions.',
    },
    landmarks: [
      {
        id: 'glomerulus',
        name: 'Glomerulus (Capillary Tuft)',
        category: 'vascular',
        position: [0.02, 0.04, 0.22],
        color: '#dc2626',
        accentColor: '#f87171',
        shortDescription: 'High-pressure anastomosing capillary bundle supplied by the afferent arteriole and drained by efferent arteriole.',
        physiologicalRole: 'Maintains glomerular hydrostatic pressure (P_GC ~45-50 mmHg) driving ultrafiltration of ~180 L/day of protein-free plasma.',
        clinicalSignificance: 'Glomerulonephritis (e.g. Post-streptococcal, IgA nephropathy, Lupus nephritis) causes hematuria with dysmorphic RBCs and RBC casts.',
        pathologyNote: 'Diabetic Nephropathy begins with glomerular hyperfiltration leading to mesangial expansion, nodular glomerulosclerosis (Kimmelstiel-Wilson nodules), and overt proteinuria.',
        histology: 'Fenestrated capillary endothelium (70-100 nm pores) enveloped by the trilaminar glomerular basement membrane (GBM).',
      },
      {
        id: 'bowmans-capsule',
        name: "Bowman's Capsule",
        category: 'structural',
        position: [-0.42, 0.32, 0.16],
        color: '#eab308',
        accentColor: '#fde047',
        shortDescription: 'Double-walled epithelial expansion at the proximal origin of the nephron collecting ultrafiltrate.',
        physiologicalRole: 'Visceral layer consists of specialized podocyte foot processes interdigitating around capillaries; parietal layer channels filtrate directly into the PCT.',
        clinicalSignificance: 'Rapidly Progressive Glomerulonephritis (RPGN) exhibits crescent formation in Bowman space made of proliferating parietal epithelial cells and fibrin.',
        pathologyNote: 'Minimal Change Disease causes diffuse effacement of podocyte foot processes, producing massive selective albuminuria and nephrotic syndrome in children.',
        histology: 'Visceral podocytes with nephrin-based slit diaphragms (4-14 nm pores) and parietal simple squamous epithelium.',
      },
      {
        id: 'proximal-convoluted-tubule',
        name: 'Proximal Convoluted Tubule (PCT)',
        category: 'cellular',
        position: [0.44, -0.26, 0.18],
        color: '#3b82f6',
        accentColor: '#93c5fd',
        shortDescription: 'Primary workhorse of tubular reabsorption in the renal cortex.',
        physiologicalRole: 'Reabsorbs 100% of filtered glucose (via SGLT2/SGLT1) and amino acids, and ~65-70% of filtered Na+, H2O, Cl-, and HCO3- (via carbonic anhydrase).',
        clinicalSignificance: 'Fanconi Syndrome presents with glucosuria, phosphaturia, aminoaciduria, and Type 2 (proximal) Renal Tubular Acidosis (RTA) due to generalized PCT dysfunction.',
        pathologyNote: 'Acute Tubular Necrosis (ATN) selectively damages PCT cells due to their high metabolic oxygen demand; presents with muddy brown granular casts.',
        histology: 'Simple cuboidal epithelial cells with dense apical microvillar brush border, extensive basolateral interdigitations, and abundant mitochondria.',
      },
      {
        id: 'loop-of-henle',
        name: 'Loop of Henle (Thick Ascending Limb)',
        category: 'functional',
        position: [-0.22, -0.58, -0.12],
        color: '#10b981',
        accentColor: '#34d399',
        shortDescription: 'Medullary hairpin loop establishing the corticomedullary osmotic gradient.',
        physiologicalRole: 'The thick ascending limb (TAL) actively transports Na+/K+/2Cl- via NKCC2 cotransporters; being water-impermeable, it dilutes tubular fluid and drives countercurrent multiplication.',
        clinicalSignificance: 'Loop Diuretics (Furosemide, Bumetanide) selectively inhibit apical NKCC2 in the TAL, abolishing medullary hypertonicity and causing potent diuresis.',
        pathologyNote: 'Bartter Syndrome is an autosomal recessive loss-of-function mutation in NKCC2 or ROMK, mimicking chronic loop diuretic ingestion (hypokalemia, metabolic alkalosis).',
        histology: 'Simple cuboidal epithelium with extensive basolateral invaginations housing densely packed Na+/K+-ATPase pumps.',
      },
    ],
  },

  // =========================================================================
  // 4. NEUROPHYSIOLOGY
  // =========================================================================
  neurophysiology: {
    id: 'neurophysiology',
    systemName: 'Neurophysiology',
    chapterIds: ['action-potential', 'neurophysiology', 'cns-synapse', 'synaptic-transmission'],
    title: 'Neuronal Excitability & Synaptic Transmission',
    subtitle: 'Axonal Spike Generation, Saltatory Conduction, and Vesicular Exocytosis',
    overview: 'High-speed electrochemical signaling network propagating all-or-none action potentials and chemical neurotransmission across synaptic clefts.',
    cameraPosition: [0, 0, 3.8],
    cameraTarget: [0, 0, 0],
    themeColors: {
      primary: '#fbbf24',
      secondary: '#10b981',
      accent: '#6366f1',
      ambient: '#09090b',
    },
    dissectionHints: {
      recommendedPlane: 'transverse',
      optimalOffset: 0.0,
      description: 'Transverse cut displays the axon cross-section, myelin sheath wrapping, and inner neurofilament cytoskeleton.',
    },
    landmarks: [
      {
        id: 'axon-hillock',
        name: 'Axon Hillock (Initial Segment)',
        category: 'electrophysiological',
        position: [0.0, 0.72, 0.18],
        color: '#fbbf24',
        accentColor: '#fde047',
        shortDescription: 'Conical trigger zone of the neuron with the highest density of voltage-gated Na+ channels.',
        physiologicalRole: 'Integrates incoming spatial and temporal EPSPs and IPSPs; if threshold (~ -55 mV) is reached, rapid Nav1.6 activation initiates an all-or-none action potential.',
        clinicalSignificance: 'Hypocalcemia decreases extracellular charge screening, lowering the action potential threshold and triggering spontaneous peripheral nerve firing (tetany, Trousseau sign).',
        pathologyNote: 'Local anesthetics (Lidocaine, Bupivacaine) block voltage-gated Na+ channels from the intracellular side, halting spike propagation.',
        histology: 'Nissl-free region of the soma where parallel arrays of neurofilaments, microtubules, and dense subaxolemmal actin scaffold begin.',
      },
      {
        id: 'myelin-sheath',
        name: 'Myelin Sheath & Node of Ranvier',
        category: 'structural',
        position: [0.38, 0.04, 0.22],
        color: '#10b981',
        accentColor: '#6ee7b7',
        shortDescription: 'Multi-layered insulating lipid sheath interrupted periodically at Nodes of Ranvier.',
        physiologicalRole: 'Increases membrane resistance (Rm) and decreases membrane capacitance (Cm), enabling rapid saltatory conduction (>100 m/s) with minimal energy expenditure.',
        clinicalSignificance: 'Multiple Sclerosis (MS) causes autoimmune CD4+ T-cell mediated demyelination in the CNS, manifesting with optic neuritis, internuclear ophthalmoplegia, and Lhermitte sign.',
        pathologyNote: 'Guillain-Barré Syndrome (AIDP) causes acute inflammatory post-infectious demyelination of peripheral nerves, leading to ascending symmetrical paralysis.',
        histology: 'Concentric spiral wraps of Schwann cell plasma membrane (PNS) or Oligodendrocyte processes (CNS) with major dense lines and intraperiod lines.',
      },
      {
        id: 'synaptic-cleft',
        name: 'Synaptic Cleft & Active Zone',
        category: 'cellular',
        position: [0.0, -0.52, 0.28],
        color: '#6366f1',
        accentColor: '#a5b4fc',
        shortDescription: '20–30 nm intercellular space separating the presynaptic terminal bouton and postsynaptic membrane.',
        physiologicalRole: 'Depolarization opens presynaptic voltage-gated Ca2+ channels (P/Q and N-type); Ca2+ binding to synaptotagmin triggers SNARE-mediated vesicular exocytosis of neurotransmitters.',
        clinicalSignificance: 'Myasthenia Gravis involves autoantibodies against postsynaptic muscle nicotinic acetylcholine receptors (AChR), resulting in fatigable ptosis, diplopia, and proximal muscle weakness.',
        pathologyNote: 'Botulinum Toxin cleaves presynaptic SNARE proteins (SNAP-25, Synaptobrevin), blocking ACh release and producing descending flaccid paralysis.',
        histology: 'Electron-dense presynaptic active zone with synaptic vesicles and postsynaptic density (PSD-95 scaffold, neurotransmitter receptors).',
      },
    ],
  },

  // =========================================================================
  // 5. GASTROINTESTINAL SYSTEM
  // =========================================================================
  gastrointestinal: {
    id: 'gastrointestinal',
    systemName: 'Gastrointestinal',
    chapterIds: ['gi-motility', 'gastrointestinal', 'gi-secretions', 'nutrient-absorption'],
    title: 'Gastrointestinal Mucosa & Enteric Secretion',
    subtitle: 'Oxyntic Glands, Absorptive Villi, and Crypt Stem Cell Niches',
    overview: 'Coordinated muscular and secretory tract orchestrating mechanical digestion, enzymatic breakdown, and nutrient/fluid absorption.',
    cameraPosition: [0, 0, 3.8],
    cameraTarget: [0, 0, 0],
    themeColors: {
      primary: '#f87171',
      secondary: '#fb923c',
      accent: '#ec4899',
      ambient: '#18181b',
    },
    dissectionHints: {
      recommendedPlane: 'coronal',
      optimalOffset: 0.0,
      description: 'Coronal section reveals the stomach body wall, mucosal rugae, pyloric sphincter, and duodenal C-loop lumen.',
    },
    landmarks: [
      {
        id: 'gastric-parietal-cell',
        name: 'Gastric Parietal (Oxyntic) Cell',
        category: 'cellular',
        position: [-0.34, 0.32, 0.18],
        color: '#f87171',
        accentColor: '#fca5a5',
        shortDescription: 'Specialized pyramidal epithelial cell in gastric oxyntic glands secreting HCl and Intrinsic Factor.',
        physiologicalRole: 'Secretes concentrated hydrochloric acid (pH ~0.8) via apical H+/K+-ATPase proton pumps driven by Histamine (H2), Gastrin (CCK-B), and Acetylcholine (M3) stimulation.',
        clinicalSignificance: 'Autoimmune Metaplastic Atrophic Gastritis causes antibody destruction of parietal cells and Intrinsic Factor, leading to achlorhydria, B12 deficiency, and Pernicious Anemia.',
        pathologyNote: 'Proton Pump Inhibitors (PPIs: Omeprazole, Pantoprazole) covalently and irreversibly bind the active H+/K+-ATPase, suppressing acid output by >90%.',
        histology: 'Eosinophilic pyramidal cells with extensive intracellular canaliculi, tubulovesicular system, and high mitochondrial density (~35% cell volume).',
      },
      {
        id: 'villi',
        name: 'Intestinal Villi & Enterocytes',
        category: 'structural',
        position: [0.36, 0.02, 0.22],
        color: '#fb923c',
        accentColor: '#fdba74',
        shortDescription: '0.5–1.0 mm finger-like mucosal projections expanding small intestinal absorptive surface area 30-fold.',
        physiologicalRole: 'Simple columnar enterocytes equipped with apical microvilli (brush border enzymes: lactase, maltase, enterokinase) absorb hexoses, amino acids, and lipids.',
        clinicalSignificance: 'Celiac Disease (Gluten-sensitive enteropathy) presents with anti-tTG IgA antibodies, intraepithelial lymphocytosis, crypt hyperplasia, and total villous blunting in the duodenum.',
        pathologyNote: 'Whipple Disease (Tropheryma whipplei) infiltrates villous lamina propria with PAS-positive, non-acid-fast foamy macrophages, obstructing lymphatic lacteals.',
        histology: 'Core of lamina propria containing a central blind-ended lymphatic lacteal, capillary tuft, and smooth muscle fibers lined by enterocytes with goblet cells.',
      },
      {
        id: 'crypt-of-lieberkuhn',
        name: 'Crypt of Lieberkühn & Paneth Cell',
        category: 'cellular',
        position: [0.18, -0.42, 0.14],
        color: '#a855f7',
        accentColor: '#d8b4fe',
        shortDescription: 'Tubular mucosal invagination at the base of intestinal villi housing stem cell and secretory niches.',
        physiologicalRole: 'Lgr5+ crypt base columnar stem cells continuously regenerate the entire epithelium every 3-5 days; Paneth cells at the base secrete alpha-defensins and lysozyme.',
        clinicalSignificance: 'Cholera Toxin permanently ADP-ribosylates Gsα in crypt cells, locking open CFTR chloride channels and driving profuse watery "rice-water" diarrhea.',
        pathologyNote: 'Colorectal Carcinoma frequently initiates in crypt stem cells via APC tumor suppressor inactivation (Wnt/beta-catenin signaling hyperactivation).',
        histology: 'Simple tubular glands containing immature proliferative enterocytes, enteroendocrine cells, and base-dwelling Paneth cells with bright eosinophilic granules.',
      },
    ],
  },

  // =========================================================================
  // 6. ENDOCRINE SYSTEM
  // =========================================================================
  endocrine: {
    id: 'endocrine',
    systemName: 'Endocrine',
    chapterIds: ['endocrine-hormones', 'endocrine', 'glucose-regulation', 'thyroid-adrenal-axis'],
    title: 'Endocrine Axis & Glandular Follicles',
    subtitle: 'Islet Beta Cells, Adrenocortical Zonation, and Thyroid Colloid Units',
    overview: 'Ductless hormonal control network regulating metabolic rate, glycemic homeostasis, electrolyte balance, and stress adaptation.',
    cameraPosition: [0, 0, 3.8],
    cameraTarget: [0, 0, 0],
    themeColors: {
      primary: '#b91c1c',
      secondary: '#f59e0b',
      accent: '#8b5cf6',
      ambient: '#1e1b4b',
    },
    dissectionHints: {
      recommendedPlane: 'sagittal',
      optimalOffset: 0.0,
      description: 'Sagittal cut exposes the thyroid isthmus, retrothyroid trachea, and glandular follicular lumens.',
    },
    landmarks: [
      {
        id: 'pancreatic-beta-cell',
        name: 'Pancreatic Beta Cell (Islet of Langerhans)',
        category: 'cellular',
        position: [-0.22, 0.24, 0.28],
        color: '#f59e0b',
        accentColor: '#fde68a',
        shortDescription: 'Major endocrine cell type in the Islets of Langerhans responsible for insulin synthesis and secretion.',
        physiologicalRole: 'Glucose enters via GLUT2/GLUT1; glucokinase generates ATP, closing K_ATP channels, depolarizing the membrane, and opening Cav channels to trigger insulin exocytosis.',
        clinicalSignificance: 'Type 1 Diabetes Mellitus results from autoimmune T-cell mediated destruction of beta cells (anti-GAD65, anti-IA-2), causing absolute insulin deficiency and DKA.',
        pathologyNote: 'Sulfonylureas (e.g. Glimepiride, Glipizide) bind the SUR1 subunit of K_ATP channels to stimulate glucose-independent insulin release.',
        histology: 'Centrally located within the islet, featuring membrane-bound secretory granules with crystalline zinc-insulin cores and electron-lucent halos.',
      },
      {
        id: 'adrenal-cortex',
        name: 'Adrenal Cortex (Zona Glomerulosa/Fasciculata/Reticularis)',
        category: 'structural',
        position: [0.36, 0.32, 0.16],
        color: '#ea580c',
        accentColor: '#fdba74',
        shortDescription: 'Three distinct concentric steroidogenic layers: G-F-R ("Salt, Sugar, Sex").',
        physiologicalRole: 'Zona Glomerulosa secretes Aldosterone (regulated by Angiotensin II/K+); Zona Fasciculata secretes Cortisol (ACTH-regulated); Zona Reticularis secretes DHEA (androgens).',
        clinicalSignificance: 'Primary Adrenal Insufficiency (Addison Disease) presents with hypotension, hyponatremia, hyperkalemia, hypoglycemia, and skin hyperpigmentation (elevated POMC/ACTH).',
        pathologyNote: "Cushing Syndrome presents with central obesity, moon facies, buffalo hump, purple abdominal striae, and proximal muscle wasting from cortisol excess.",
        histology: 'Z. Glomerulosa (arched cords), Z. Fasciculata (radial cords of lipid-rich clear spongiocytes), Z. Reticularis (branching anastomosing cords with lipofuscin).',
      },
      {
        id: 'thyroid-follicle',
        name: 'Thyroid Follicle & Colloid',
        category: 'cellular',
        position: [0.0, -0.12, 0.26],
        color: '#b91c1c',
        accentColor: '#fca5a5',
        shortDescription: 'Spherical structural unit lined by follicular cells enclosing central iodinated thyroglobulin colloid.',
        physiologicalRole: 'Follicular cells trap iodide via basolateral Na+/I- symporters (NIS); Thyroid Peroxidase (TPO) oxidizes and organifies iodide onto tyrosine residues to produce T4 and T3.',
        clinicalSignificance: "Hashimoto Thyroiditis features anti-TPO and anti-thyroglobulin antibodies causing chronic lymphocytic thyroiditis, Hürthle cell metaplasia, and primary hypothyroidism.",
        pathologyNote: "Graves Disease involves Thyroid-Stimulating Immunoglobulin (TSI) autoantibodies activating TSH receptors, resulting in diffuse toxic goiter, exophthalmos, and pretibial myxedema.",
        histology: 'Simple cuboidal epithelium (columnar when active, squamous when inactive) enclosing homogenous eosinophilic colloid with peripheral scalloping.',
      },
    ],
  },

  // =========================================================================
  // 7. CELL MEMBRANE & HOMEOSTASIS
  // =========================================================================
  homeostasis: {
    id: 'homeostasis',
    systemName: 'General',
    chapterIds: ['homeostasis', 'cell-membrane-transport'],
    title: 'Cell Membrane & Transport Dynamics',
    subtitle: 'Phospholipid Bilayer, Integral Transporters, and Electrochemical Gradients',
    overview: 'Selectively permeable fluid mosaic lipid bilayer regulating ion gradients, passive osmosis, and active trans-membrane transport.',
    cameraPosition: [0, 0, 3.6],
    cameraTarget: [0, 0, 0],
    themeColors: {
      primary: '#3b82f6',
      secondary: '#10b981',
      accent: '#f43f5e',
      ambient: '#09090b',
    },
    landmarks: [
      {
        id: 'lipid-bilayer',
        name: 'Phospholipid Bilayer Matrix',
        category: 'structural',
        position: [0.0, 0.65, 0.0],
        color: '#3b82f6',
        accentColor: '#93c5fd',
        shortDescription: 'Amphipathic phospholipid double layer creating a hydrophobic impermeable core.',
        physiologicalRole: 'Prevents free passive diffusion of hydrophilic solutes and ions while permitting lipophilic gases (O2, CO2) to diffuse down concentration gradients.',
        clinicalSignificance: 'Cholesterol incorporation stabilizes membrane fluidity at high temperatures and prevents crystallization at low temperatures.',
        pathologyNote: 'Acanthocytosis (spur cell anemia) results from excessive membrane cholesterol accumulation in severe liver cirrhosis.',
        histology: 'Hydrophilic choline-phosphate heads oriented toward intra/extracellular aqueous compartments with dual hydrophobic fatty acyl tails inward.',
      },
      {
        id: 'integral-protein',
        name: 'Integral Transport Protein (Na+/K+-ATPase)',
        category: 'functional',
        position: [0.0, 0.0, 0.42],
        color: '#10b981',
        accentColor: '#6ee7b7',
        shortDescription: 'Primary active transport pump consuming ~30% of basal metabolic cellular ATP.',
        physiologicalRole: 'Pumps 3 Na+ ions out and 2 K+ ions into the cell per ATP hydrolyzed, establishing the negative resting membrane potential (-70 mV) and Na+ electrochemical gradient.',
        clinicalSignificance: 'Cardiac glycosides (Digoxin) inhibit the Na+/K+-ATPase, raising intracellular Na+ and secondarily increasing intracellular Ca2+ via NCX to enhance myocardial contractility.',
        pathologyNote: 'Ischemic ATP depletion shuts down the pump, causing intracellular Na+ and H2O accumulation and cytotoxic cell swelling.',
        histology: 'Transmembrane alpha-helical protein complex with alpha (catalytic), beta (glycosylated), and gamma (FXYD regulator) subunits.',
      },
    ],
  },

  // =========================================================================
  // 8. BLOOD & HEMATOLOGY
  // =========================================================================
  'blood-composition': {
    id: 'blood-composition',
    systemName: 'Cardiovascular',
    chapterIds: ['blood-composition', 'hematology', 'coagulation'],
    title: 'Erythrocyte Morphology & Hemodynamics',
    subtitle: 'Biconcave RBC Architecture, Hemoglobin Loading, and Microcirculatory Rheology',
    overview: 'Specialized anucleate discocyte optimized for maximum surface-area-to-volume ratio and reversible oxygen/carbon dioxide transport.',
    cameraPosition: [0, 0, 3.6],
    cameraTarget: [0, 0, 0],
    themeColors: {
      primary: '#dc2626',
      secondary: '#991b1b',
      accent: '#f87171',
      ambient: '#18181b',
    },
    landmarks: [
      {
        id: 'rbc-membrane',
        name: 'Biconcave Erythrocyte Membrane (Spectrin/Ankyrin)',
        category: 'structural',
        position: [0.0, 0.72, 0.0],
        color: '#dc2626',
        accentColor: '#fca5a5',
        shortDescription: 'Flexible 7.5 μm biconcave disc capable of deforming through 3 μm splenic sinusoids.',
        physiologicalRole: 'Cytoskeletal spectrin-actin-ankyrin lattice grants elastic deformability and minimizes diffusion distance for O2/CO2 binding to tetrameric hemoglobin.',
        clinicalSignificance: 'Hereditary Spherocytosis (spectrin/ankyrin gene defect) causes loss of membrane surface area, producing osmotic fragility, extravascular hemolysis, and splenomegaly.',
        pathologyNote: 'Sickle Cell Disease (HbS β-globin Glu6Val mutation) polymerizes under deoxygenated conditions, causing microvascular vaso-occlusive crises.',
        histology: 'Anucleate cell with central pallor occupying ~1/3 of cell diameter on Wright-Giemsa stain.',
      },
    ],
  },

  // =========================================================================
  // 9. SPECIAL SENSES (VISION)
  // =========================================================================
  'special-senses-vision': {
    id: 'special-senses-vision',
    systemName: 'Neurophysiology',
    chapterIds: ['special-senses-vision', 'vision', 'retina-optics'],
    title: 'Ocular Anatomy & Photoreception',
    subtitle: 'Corneal Refraction, Pupillary Aperture, and Retinal Phototransduction',
    overview: 'Specialized optical sensor focusing incident electromagnetic radiation onto retinal rod and cone photoreceptors.',
    cameraPosition: [0, 0, 3.8],
    cameraTarget: [0, 0, 0],
    themeColors: {
      primary: '#2563eb',
      secondary: '#38bdf8',
      accent: '#e2e8f0',
      ambient: '#09090b',
    },
    landmarks: [
      {
        id: 'sclera-cornea',
        name: 'Cornea & Sclera Tunic',
        category: 'structural',
        position: [-0.65, 0.65, 0.1],
        color: '#f8fafc',
        accentColor: '#cbd5e1',
        shortDescription: 'Tough fibrous outer tunic providing 2/3 of total ocular refractive power (~40 diopters).',
        physiologicalRole: 'Avascular transparent corneal stroma refracts light rays while sclera maintains intraocular globe geometry and protects internal structures.',
        clinicalSignificance: 'Glaucoma occurs when aqueous humor drainage through the trabecular meshwork at the iridocorneal angle is impaired, raising intraocular pressure and damaging the optic nerve.',
        pathologyNote: 'Corneal abrasions and keratitis can be diagnosed with fluorescein staining under cobalt blue slit-lamp illumination.',
        histology: 'Stratified squamous non-keratinized epithelium, Bowman layer, orthogonal collagen lamellae stroma, Descemet membrane, and single endothelium layer.',
      },
      {
        id: 'iris-pupil',
        name: 'Iris & Pupillary Sphincter',
        category: 'functional',
        position: [0.72, 0.35, 0.15],
        color: '#2563eb',
        accentColor: '#60a5fa',
        shortDescription: 'Pigmented contractile diaphragm regulating pupil aperture and retinal illuminance.',
        physiologicalRole: 'Parasympathetic Edinger-Westphal fibers (CN III) constrict the sphincter muscle (miosis); sympathetic fibers from the superior cervical ganglion dilate the radial muscle (mydriasis).',
        clinicalSignificance: 'Horner Syndrome (ptosis, miosis, anhidrosis) arises from disruption of the cervical sympathetic chain (e.g. Pancoast tumor).',
        pathologyNote: "Argyll Robertson pupil ('prostitute's pupil' in neurosyphilis) accommodates to near target but fails to react to direct light.",
        histology: 'Anterior stromal melanocytes with posterior double-layered deeply pigmented iris epithelium.',
      },
    ],
  },

  // =========================================================================
  // 10. REPRODUCTIVE SYSTEM
  // =========================================================================
  'reproductive-cycles': {
    id: 'reproductive-cycles',
    systemName: 'Endocrine',
    chapterIds: ['reproductive-cycles', 'reproduction', 'ovarian-menstrual-cycle'],
    title: 'Reproductive Endocrinology & Organ Architecture',
    subtitle: 'Hypothalamic-Pituitary-Gonadal (HPG) Axis, Folliculogenesis, and Endometrial Cycling',
    overview: 'Cyclical endocrine and morphological reproductive tract governed by estrogen, progesterone, LH, and FSH pulsatility.',
    cameraPosition: [0, 0, 3.8],
    cameraTarget: [0, 0, 0],
    themeColors: {
      primary: '#ec4899',
      secondary: '#f472b6',
      accent: '#fbcfe8',
      ambient: '#1e1b4b',
    },
    landmarks: [
      {
        id: 'uterus',
        name: 'Uterine Myometrium & Endometrium',
        category: 'structural',
        position: [0.0, -0.65, 0.18],
        color: '#ec4899',
        accentColor: '#f472b6',
        shortDescription: 'Pear-shaped muscular organ providing maternal accommodation for blastocyst implantation and fetal gestation.',
        physiologicalRole: 'Functional layer of endometrium proliferates under estrogen influence and enters secretory phase post-ovulation under progesterone; sheds during menstruation.',
        clinicalSignificance: 'Endometriosis presents with functional endometrial glands and stroma outside the uterine cavity (e.g. ovaries, pelvic peritoneum), causing cyclical dysmenorrhea and infertility.',
        pathologyNote: 'Uterine Leiomyomas (fibroids) are benign monoclonal myometrial smooth muscle neoplasms presenting with heavy menstrual bleeding (menorrhagia).',
        histology: 'Stratum functionale and basale endometrium with spiral arteries surrounded by thick three-layered interlacing smooth muscle myometrium.',
      },
      {
        id: 'ovary',
        name: 'Ovary & Graafian Follicle',
        category: 'cellular',
        position: [0.68, 0.22, 0.12],
        color: '#fbcfe8',
        accentColor: '#fce7f3',
        shortDescription: 'Female gonad producing oocytes and cyclical steroid hormones (Estradiol and Progesterone).',
        physiologicalRole: 'LH surge triggers rupture of the mature Graafian follicle (ovulation); remaining granulosa/theca cells transform into the corpus luteum producing progesterone.',
        clinicalSignificance: 'Polycystic Ovary Syndrome (PCOS) involves hyperandrogenism, ovulatory dysfunction (amenorrhea/oligomenorrhea), polycystic ovarian morphology, and insulin resistance.',
        pathologyNote: 'Ovarian torsion presents with acute unilateral severe pelvic pain and requires immediate laparoscopic detorsion to preserve ovarian viability.',
        histology: 'Outer cortex with primordial, primary, secondary, and antral follicles embedded in cellular stroma; inner vascular medulla.',
      },
    ],
  },

  // =========================================================================
  // 11. INTEGRATED EXERCISE & SKELETAL MUSCLE
  // =========================================================================
  'integrated-exercise': {
    id: 'integrated-exercise',
    systemName: 'General',
    chapterIds: ['integrated-exercise', 'exercise-physiology', 'muscle-contraction'],
    title: 'Skeletal Muscle Sarcomere & Energetics',
    subtitle: 'Cross-Bridge Cycling, Sarcoplasmic Reticulum Ca2+ Release, and VO2 Max',
    overview: 'Contractile macromolecular engine converting chemical ATP energy into mechanical cross-bridge force and power.',
    cameraPosition: [0, 0, 3.8],
    cameraTarget: [0, 0, 0],
    themeColors: {
      primary: '#ef4444',
      secondary: '#fbbf24',
      accent: '#3b82f6',
      ambient: '#09090b',
    },
    landmarks: [
      {
        id: 'actin-filament',
        name: 'Thin Filament (Actin / Tropomyosin / Troponin)',
        category: 'functional',
        position: [0.22, 0.35, 0.2],
        color: '#dc2626',
        accentColor: '#f87171',
        shortDescription: 'Double-helical F-actin polymers wound with tropomyosin and regulatory troponin complexes (T, I, C).',
        physiologicalRole: 'Ca2+ binding to Troponin C induces a conformational shift in Tropomyosin, exposing myosin-binding sites on actin for cross-bridge attachment.',
        clinicalSignificance: 'Cardiac Troponin I (cTnI) and Troponin T (cTnT) are ultra-sensitive biomarkers released into systemic circulation following cardiomyocyte necrosis in acute MI.',
        pathologyNote: 'Rigor Mortis occurs post-mortem when ATP depletion prevents ATP binding to myosin heads, locking actin-myosin cross-bridges in a rigid bound state.',
        histology: 'Anchored at the Z-disc with alpha-actinin; interdigitates with myosin thick filaments within the I-band and A-band.',
      },
      {
        id: 'myosin-filament',
        name: 'Thick Filament (Myosin II Motor)',
        category: 'functional',
        position: [0.0, 0.0, -0.15],
        color: '#fbbf24',
        accentColor: '#fde047',
        shortDescription: 'Hexameric motor protein (two heavy chains with globular heads and four light chains).',
        physiologicalRole: 'ATP hydrolysis on the myosin head cocks the lever arm; actin binding triggers the power stroke (pulling actin ~10 nm toward the M-line) and ADP release.',
        clinicalSignificance: 'Duchenne Muscular Dystrophy (X-linked dystrophin deletion) disrupts mechanical transmission of sarcomeric force to the extracellular matrix, causing muscle necrosis and pseudohypertrophy.',
        pathologyNote: 'Malignant Hyperthermia involves RyR1 ryanodine receptor mutations causing uncontrolled sarcoplasmic Ca2+ release triggered by volatile anesthetics or succinylcholine.',
        histology: 'Bipolar thick filament centered at the M-line with titin elastic springs anchoring it to the Z-discs.',
      },
    ],
  },
};

/**
 * Resolves an organ preset by chapter ID or preset key.
 */
export function getOrganPresetByChapterId(chapterId?: string): OrganPreset {
  if (!chapterId) {
    return ORGAN_PRESETS.cardiovascular;
  }

  const directMatch = ORGAN_PRESETS[chapterId];
  if (directMatch) {
    return directMatch;
  }

  // Find by chapterIds mapping
  for (const preset of Object.values(ORGAN_PRESETS)) {
    if (preset.chapterIds.includes(chapterId)) {
      return preset;
    }
  }

  // System category fallbacks
  if (chapterId.includes('cardio') || chapterId.includes('heart') || chapterId.includes('cardiac') || chapterId.includes('ecg')) {
    return ORGAN_PRESETS.cardiovascular;
  }
  if (chapterId.includes('resp') || chapterId.includes('lung') || chapterId.includes('gas') || chapterId.includes('ventilation')) {
    return ORGAN_PRESETS.respiratory;
  }
  if (chapterId.includes('renal') || chapterId.includes('nephron') || chapterId.includes('kidney') || chapterId.includes('glomerul')) {
    return ORGAN_PRESETS.renal;
  }
  if (chapterId.includes('neuro') || chapterId.includes('axon') || chapterId.includes('synapse') || chapterId.includes('action-potential') || chapterId.includes('cns')) {
    return ORGAN_PRESETS.neurophysiology;
  }
  if (chapterId.includes('gi') || chapterId.includes('gastro') || chapterId.includes('stomach') || chapterId.includes('digest') || chapterId.includes('intestin')) {
    return ORGAN_PRESETS.gastrointestinal;
  }
  if (chapterId.includes('endocr') || chapterId.includes('thyroid') || chapterId.includes('hormon') || chapterId.includes('adrenal') || chapterId.includes('pancrea')) {
    return ORGAN_PRESETS.endocrine;
  }
  if (chapterId.includes('blood') || chapterId.includes('hema')) {
    return ORGAN_PRESETS['blood-composition'];
  }
  if (chapterId.includes('vis') || chapterId.includes('eye') || chapterId.includes('opt')) {
    return ORGAN_PRESETS['special-senses-vision'];
  }
  if (chapterId.includes('reprod') || chapterId.includes('uter') || chapterId.includes('ovar')) {
    return ORGAN_PRESETS['reproductive-cycles'];
  }
  if (chapterId.includes('exerc') || chapterId.includes('muscl')) {
    return ORGAN_PRESETS['integrated-exercise'];
  }
  if (chapterId.includes('homeo') || chapterId.includes('membran')) {
    return ORGAN_PRESETS.homeostasis;
  }

  return ORGAN_PRESETS.cardiovascular;
}

/**
 * Returns all registered organ presets.
 */
export function getAllOrganPresets(): OrganPreset[] {
  return Object.values(ORGAN_PRESETS);
}
