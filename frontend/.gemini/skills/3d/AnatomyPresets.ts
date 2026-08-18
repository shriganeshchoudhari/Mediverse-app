/**
 * Mediverse 3D Human Anatomy & Regional Dissection Presets
 * Authoritative 3D coordinates, layered anatomical structures, neurovascular landmarks,
 * and high-yield clinical dissection correlations.
 */

export interface DissectionLayer {
  id: string;
  name: string;
  depth: number; // 1 (superficial skin) to 5 (deep bone)
  color: string;
  roughness: number;
  metalness: number;
  opacity: number;
  description: string;
}

export interface AnatomyLandmarkPin {
  id: string;
  name: string;
  region: 'upper-limb' | 'lower-limb' | 'thorax' | 'abdomen' | 'head-neck' | 'neuroanatomy' | 'histology';
  category: 'osteology' | 'myology' | 'arterial' | 'venous' | 'neural' | 'visceral' | 'histology';
  layerDepth: number; // 1 to 5
  position: [number, number, number];
  color: string;
  nerveSupply?: string;
  bloodSupply?: string;
  actionOrFunction: string;
  clinicalSignificance: string;
  highYieldFact: string;
  histologyFeatures?: string;
}

export interface RegionalAnatomyPreset {
  id: string;
  title: string;
  subtitle: string;
  systemCode: string;
  overview: string;
  defaultCamera: [number, number, number];
  targetPoint: [number, number, number];
  layers: DissectionLayer[];
  landmarks: AnatomyLandmarkPin[];
}

export const DISSECTION_LAYERS: DissectionLayer[] = [
  { id: 'skin', name: '1. Integumentary (Skin & Dermis)', depth: 1, color: '#fbcfe8', roughness: 0.7, metalness: 0.1, opacity: 1.0, description: 'Stratified squamous keratinized epithelium and dense irregular collagenous dermis with Langer lines.' },
  { id: 'fascia', name: '2. Superficial & Deep Fascia', depth: 2, color: '#fef08a', roughness: 0.5, metalness: 0.05, opacity: 0.85, description: 'Subcutaneous adipose tissue containing cutaneous nerves, superficial veins, and deep investing fascia.' },
  { id: 'muscle', name: '3. Muscular System (Myology)', depth: 3, color: '#ef4444', roughness: 0.4, metalness: 0.1, opacity: 0.95, description: 'Skeletal muscle bellies, epimysium, tendinous insertions, and fascial compartments.' },
  { id: 'neurovascular', name: '4. Neurovascular Bundles', depth: 4, color: '#eab308', roughness: 0.3, metalness: 0.3, opacity: 0.95, description: 'Major distributing arteries (red), accompanying venae comitantes (blue), and peripheral nerve plexuses (yellow).' },
  { id: 'skeleton', name: '5. Skeletal Framework (Osteology)', depth: 5, color: '#f8fafc', roughness: 0.6, metalness: 0.2, opacity: 1.0, description: 'Cortical and trabecular bones, periosteum, articular cartilage, and joint capsules.' },
];

export const REGIONAL_ANATOMY_PRESETS: Record<string, RegionalAnatomyPreset> = {
  // =========================================================================
  // 1. UPPER LIMB & BRACHIAL PLEXUS
  // =========================================================================
  'upper-limb': {
    id: 'upper-limb',
    title: 'Upper Limb & Brachial Plexus Dissection',
    subtitle: 'Axilla, Brachial Plexus, Cubital Fossa, and Carpal Tunnel Architecture',
    systemCode: 'AN1.1-AN12.1',
    overview: 'Regional dissection of the upper extremity focusing on the brachial plexus roots (C5-T1), shoulder girdle rotator cuff, cubital fossa, and hand fascial spaces.',
    defaultCamera: [0, 0, 4.0],
    targetPoint: [0, 0, 0],
    layers: DISSECTION_LAYERS,
    landmarks: [
      {
        id: 'brachial-plexus-cords',
        name: 'Brachial Plexus (Cords & Terminal Branches)',
        region: 'upper-limb',
        category: 'neural',
        layerDepth: 4,
        position: [0.15, 0.45, 0.12],
        color: '#eab308',
        nerveSupply: 'Ventral rami of spinal nerves C5, C6, C7, C8, T1',
        bloodSupply: 'Subclavian and Axillary artery branches',
        actionOrFunction: 'Innervates motor musculature and sensory dermatomes of the entire upper extremity.',
        clinicalSignificance: "Erb-Duchenne Palsy (C5-C6 upper trunk traction) causes 'waiter\'s tip' posture (arm adducted, internally rotated, forearm pronated). Klumpke Palsy (C8-T1 lower trunk traction) causes total claw hand.",
        highYieldFact: 'The cords (Lateral, Posterior, Medial) are named relative to their anatomical relation to the 2nd part of the Axillary Artery behind Pectoralis Minor.',
      },
      {
        id: 'supraspinatus-tendon',
        name: 'Supraspinatus Tendon (Rotator Cuff)',
        region: 'upper-limb',
        category: 'myology',
        layerDepth: 3,
        position: [-0.35, 0.55, 0.18],
        color: '#ef4444',
        nerveSupply: 'Suprascapular Nerve (C5, C6)',
        bloodSupply: 'Suprascapular and posterior circumflex humeral arteries',
        actionOrFunction: 'Initiates abduction of the arm (first 0° to 15°) before Deltoid takes over (15° to 90°).',
        clinicalSignificance: 'Most commonly torn rotator cuff tendon (positive Empty Can / Jobe test, painful arc between 60° and 120°).',
        highYieldFact: 'Passes beneath the subacromial arch and subacromial bursa where it is prone to impingement and avascular tendinopathy.',
      },
      {
        id: 'median-nerve-carpal-tunnel',
        name: 'Median Nerve in Carpal Tunnel',
        region: 'upper-limb',
        category: 'neural',
        layerDepth: 4,
        position: [0.28, -0.65, 0.22],
        color: '#eab308',
        nerveSupply: 'Lateral and Medial cords of Brachial Plexus (C5-T1)',
        bloodSupply: 'Median artery (branch of anterior interosseous) and radial/ulnar arches',
        actionOrFunction: 'Supplies thenar muscles (OAF: Opponens pollicis, Abductor pollicis brevis, Flexor pollicis brevis) and lateral 2 lumbricals.',
        clinicalSignificance: 'Carpal Tunnel Syndrome causes nocturnal paresthesias in the thumb, index, middle, and radial half of ring finger (positive Phalen and Tinel signs); thenar atrophy in chronic cases.',
        highYieldFact: 'The palmar cutaneous branch of the median nerve arises proximal to the flexor retinaculum and passes superficial to it, sparing sensation to the thenar eminence in carpal tunnel syndrome.',
      },
      {
        id: 'radial-nerve-spiral-groove',
        name: 'Radial Nerve (Spiral / Radial Groove)',
        region: 'upper-limb',
        category: 'neural',
        layerDepth: 4,
        position: [-0.22, 0.05, -0.15],
        color: '#eab308',
        nerveSupply: 'Posterior Cord of Brachial Plexus (C5-T1)',
        bloodSupply: 'Profunda Brachii (Deep Brachial) Artery',
        actionOrFunction: 'Innervates all extensor muscles of the arm (Triceps) and forearm (BEST: Brachioradialis, Extensors of wrist/fingers, Supinator, Triceps).',
        clinicalSignificance: "Midshaft humeral fracture or Saturday Night Palsy (crutch palsy) lacerates or compresses the radial nerve in the spiral groove, resulting in 'Wrist Drop' (inability to extend wrist and fingers).",
        highYieldFact: 'Triceps branch originates before the radial groove, so elbow extension is often preserved in midshaft humeral fractures.',
      },
    ],
  },

  // =========================================================================
  // 2. LOWER LIMB & GAIT ANATOMY
  // =========================================================================
  'lower-limb': {
    id: 'lower-limb',
    title: 'Lower Limb & Joint Mechanics',
    subtitle: 'Femoral Triangle, Popliteal Fossa, Cruciate Ligaments, and Tarsal Tunnel',
    systemCode: 'AN14.1-AN25.1',
    overview: 'Functional and regional dissection of the lower extremity focusing on weight-bearing joint biomechanics, compartment syndromes, and peripheral neurovascular bundles.',
    defaultCamera: [0, 0, 4.2],
    targetPoint: [0, 0, 0],
    layers: DISSECTION_LAYERS,
    landmarks: [
      {
        id: 'femoral-triangle',
        name: 'Femoral Triangle & Sheath (NAVEL)',
        region: 'lower-limb',
        category: 'arterial',
        layerDepth: 4,
        position: [0.18, 0.48, 0.22],
        color: '#dc2626',
        nerveSupply: 'Femoral nerve (L2, L3, L4)',
        bloodSupply: 'Femoral artery and deep femoral (profunda femoris)',
        actionOrFunction: 'Major vascular conduit to the lower extremity bounded by Inguinal Ligament (superior), Sartorius (lateral), and Adductor Longus (medial).',
        clinicalSignificance: 'Femoral hernia protrudes through the femoral ring into the femoral canal (medial to the femoral vein), carrying a high risk of incarceration and strangulation.',
        highYieldFact: 'From lateral to medial: Nerve, Artery, Vein, Empty space, Lymphatics (NAVEL). The Femoral Nerve lies OUTSIDE the femoral sheath.',
      },
      {
        id: 'anterior-cruciate-ligament',
        name: 'Anterior Cruciate Ligament (ACL)',
        region: 'lower-limb',
        category: 'osteology',
        layerDepth: 5,
        position: [0.02, -0.05, 0.18],
        color: '#f8fafc',
        nerveSupply: 'Articular branches from Tibial and Obturator nerves',
        bloodSupply: 'Middle genicular artery',
        actionOrFunction: 'Prevents anterior displacement of the tibia relative to the femur and resists excessive internal rotation.',
        clinicalSignificance: "ACL tear occurs during non-contact deceleration and pivoting maneuvers (positive Lachman test, Anterior Drawer test, and Pivot-Shift test; 'pop' heard on injury).",
        highYieldFact: "Unhappy Triad of O'Donoghue: Combined injury of ACL, Medial Collateral Ligament (MCL), and Medial (or Lateral in acute) Meniscus caused by lateral blow to flexed knee.",
      },
      {
        id: 'common-peroneal-nerve',
        name: 'Common Fibular (Peroneal) Nerve at Fibular Neck',
        region: 'lower-limb',
        category: 'neural',
        layerDepth: 4,
        position: [-0.32, -0.28, 0.14],
        color: '#eab308',
        nerveSupply: 'Sciatic nerve bifurcation (L4, L5, S1, S2)',
        bloodSupply: 'Anterior tibial recurrent artery',
        actionOrFunction: 'Bifurcates into Deep Fibular (dorsiflexors/toe extensors) and Superficial Fibular (foot everters).',
        clinicalSignificance: "Fracture of the fibular neck or tight plaster cast lacerates the nerve, leading to 'Foot Drop' (loss of dorsiflexion, steppage gait) and sensory loss on the dorsum of the foot.",
        highYieldFact: 'Most frequently injured peripheral nerve in the lower extremity due to its superficial subcutaneous location winding around the lateral neck of the fibula.',
      },
      {
        id: 'trendelenburg-gluteal',
        name: 'Superior Gluteal Nerve & Gluteus Medius',
        region: 'lower-limb',
        category: 'neural',
        layerDepth: 3,
        position: [-0.28, 0.62, -0.15],
        color: '#eab308',
        nerveSupply: 'L4, L5, S1 ventral rami',
        bloodSupply: 'Superior gluteal artery',
        actionOrFunction: 'Abducts hip and stabilizes the pelvis during single-leg stance phase of gait.',
        clinicalSignificance: 'Lesion of superior gluteal nerve results in a positive Trendelenburg sign (pelvis sags toward the CONTRALATERAL unsupported side when standing on the affected leg).',
        highYieldFact: 'Intramuscular injections in the buttock must be administered in the upper-outer quadrant (Von Hochstetter triangle) to avoid the Sciatic and Superior Gluteal nerves.',
      },
    ],
  },

  // =========================================================================
  // 3. THORAX, MEDIASTINUM & CORONARY ARCHITECTURE
  // =========================================================================
  'thorax': {
    id: 'thorax',
    title: 'Thorax & Mediastinal Compartments',
    subtitle: 'Superior/Posterior Mediastinum, Coronary Anatomy, and Bronchopulmonary Segments',
    systemCode: 'AN21.1-AN25.1',
    overview: 'Cross-sectional and compartmental anatomy of the thoracic cavity, sternal angle landmarks (T4/T5), mediastinal divisions, and coronary artery tree distribution.',
    defaultCamera: [0, 0, 3.8],
    targetPoint: [0, 0, 0],
    layers: DISSECTION_LAYERS,
    landmarks: [
      {
        id: 'sternal-angle-louis',
        name: 'Sternal Angle of Louis (T4-T5 Level)',
        region: 'thorax',
        category: 'osteology',
        layerDepth: 5,
        position: [0.0, 0.52, 0.28],
        color: '#f8fafc',
        nerveSupply: '2nd intercostal nerve (T2)',
        bloodSupply: 'Internal thoracic (mammary) artery branches',
        actionOrFunction: 'Key landmark for counting ribs (articulates with 2nd costal cartilage) and demarcating superior from inferior mediastinum.',
        clinicalSignificance: 'Reference level for: Bifurcation of trachea (Carina), Aortic arch origin and termination, Azygos vein arching into SVC, Thoracic duct crossing right to left.',
        highYieldFact: 'Remember mnemonic RATTS: Rib 2, Aortic arch, Tracheal bifurcation, Thoracic duct crossing, Superior vena cava.',
      },
      {
        id: 'left-anterior-descending',
        name: 'Left Anterior Descending (LAD) Coronary Artery',
        region: 'thorax',
        category: 'arterial',
        layerDepth: 4,
        position: [-0.08, -0.05, 0.32],
        color: '#dc2626',
        nerveSupply: 'Cardiac plexus (sympathetic T1-T4, parasympathetic CN X)',
        bloodSupply: 'Left Main Coronary Artery branch',
        actionOrFunction: 'Supplies anterior 2/3 of interventricular septum, anterior LV free wall, and apex of the heart.',
        clinicalSignificance: "Most common site of atherosclerotic coronary occlusion ('Widow Maker'), presenting with anterior ST-elevation myocardial infarction (STEMI in leads V1-V4).",
        highYieldFact: 'Supplies the anterior papillary muscle of the mitral valve (which has dual blood supply from LAD and LCx, making it less prone to rupture than posterior papillary).',
      },
      {
        id: 'posterior-mediastinum-esophagus',
        name: 'Posterior Mediastinum (Esophagus & Thoracic Duct)',
        region: 'thorax',
        category: 'visceral',
        layerDepth: 4,
        position: [0.05, 0.12, -0.22],
        color: '#fb923c',
        nerveSupply: 'Esophageal plexus (Vagus nerve) and sympathetic splanchnic nerves',
        bloodSupply: 'Esophageal branches of thoracic aorta and left gastric artery',
        actionOrFunction: 'Muscular conduit traversing diaphragm at T10 level to connect pharynx with stomach.',
        clinicalSignificance: 'Posterior mediastinal masses are most commonly neurogenic tumors (schwannomas, neurofibromas). Thoracic duct laceration causes chylothorax.',
        highYieldFact: 'Diaphragm aperture levels mnemonic: I Eat 10 Eggs At 12 (IVC at T8, Esophagus at T10, Aorta/Thoracic duct at T12).',
      },
    ],
  },

  // =========================================================================
  // 4. ABDOMEN, PELVIS & INGUINAL REGION
  // =========================================================================
  'abdomen': {
    id: 'abdomen',
    title: 'Abdomen, Pelvis & Inguinal Canal',
    subtitle: 'Inguinal Anatomy, Peritoneal Recesses, Celiac/SMA Branches, and Pelvic Diaphragm',
    systemCode: 'AN44.1-AN55.1',
    overview: 'Detailed layered dissection of the anterior abdominal wall, inguinal canal mechanics, Hesselbach triangle boundaries, and retroperitoneal neurovascular structures.',
    defaultCamera: [0, 0, 4.0],
    targetPoint: [0, 0, 0],
    layers: DISSECTION_LAYERS,
    landmarks: [
      {
        id: 'inguinal-canal-hesselbach',
        name: 'Inguinal Canal & Hesselbach Triangle',
        region: 'abdomen',
        category: 'visceral',
        layerDepth: 3,
        position: [-0.22, -0.45, 0.24],
        color: '#ef4444',
        nerveSupply: 'Ilioinguinal nerve (L1) and Genitofemoral genital branch (L1/L2)',
        bloodSupply: 'Inferior epigastric and testicular/ovarian vessels',
        actionOrFunction: 'Oblique passage transmitting spermatic cord (males) or round ligament (females) through abdominal wall.',
        clinicalSignificance: 'Direct Inguinal Hernia passes MEDIAL to inferior epigastric vessels through Hesselbach triangle (covered by external spermatic fascia only; seen in elderly men). Indirect passes LATERAL through deep ring.',
        highYieldFact: 'Hesselbach Triangle boundaries: Rectus abdominis (medial), Inferior epigastric vessels (lateral), Inguinal ligament of Poupart (inferior).',
      },
      {
        id: 'celiac-trunk',
        name: 'Celiac Trunk & SMA Branches',
        region: 'abdomen',
        category: 'arterial',
        layerDepth: 4,
        position: [0.0, 0.22, -0.12],
        color: '#dc2626',
        nerveSupply: 'Celiac sympathetic plexus (T5-T9 greater splanchnic)',
        bloodSupply: 'Anterior midline branch of abdominal aorta at T12 level',
        actionOrFunction: 'Supplies foregut structures: Stomach, Liver, Gallbladder, Spleen, and proximal half of Duodenum/Pancreas.',
        clinicalSignificance: 'Splenic flexure (Griffiths point) and Rectosigmoid junction (Sudeck point) are watershed ischemic zones prone to ischemic colitis during hypovolemic shock.',
        highYieldFact: 'Tri-radiate branches: Left Gastric, Splenic (tortuous superior border of pancreas), and Common Hepatic arteries.',
      },
      {
        id: 'morisons-pouch',
        name: "Hepatorenal Recess (Morison's Pouch)",
        region: 'abdomen',
        category: 'visceral',
        layerDepth: 4,
        position: [0.38, 0.15, 0.08],
        color: '#3b82f6',
        nerveSupply: 'Phrenic (peritoneum) and lower intercostal nerves',
        bloodSupply: 'Right hepatic and right renal vessels',
        actionOrFunction: 'Deepest potential space of the peritoneal cavity in the supine patient located between liver and right kidney.',
        clinicalSignificance: 'Primary ultrasound acoustic window on FAST exam (Focused Assessment with Sonography for Trauma) to detect hemoperitoneum or free fluid in trauma.',
        highYieldFact: 'Communicates with the lesser sac (omental bursa) through the Epiploic Foramen of Winslow (bounded anteriorly by the portal triad in hepatoduodenal ligament).',
      },
    ],
  },

  // =========================================================================
  // 5. HEAD, NECK & CRANIAL NERVES
  // =========================================================================
  'head-neck': {
    id: 'head-neck',
    title: 'Head, Neck & Cranial Nerves',
    subtitle: 'Cranial Base Foramina, Cavernous Sinus, Triangles of Neck, and Circle of Willis',
    systemCode: 'AN26.1-AN43.1',
    overview: 'Complex neurovascular and visceral anatomy of the head and neck, skull base foramina paths, cavernous sinus relations, and cerebral arterial circle.',
    defaultCamera: [0, 0, 3.8],
    targetPoint: [0, 0, 0],
    layers: DISSECTION_LAYERS,
    landmarks: [
      {
        id: 'cavernous-sinus',
        name: 'Cavernous Sinus & Cranial Nerves',
        region: 'head-neck',
        category: 'venous',
        layerDepth: 4,
        position: [0.12, 0.28, 0.16],
        color: '#3b82f6',
        nerveSupply: 'CN III (Oculomotor), CN IV (Trochlear), CN V1 (Ophthalmic), CN V2 (Maxillary), CN VI (Abducens)',
        bloodSupply: 'Internal Carotid Artery (ICA) siphon traversing center',
        actionOrFunction: 'Dural venous sinus draining ophthalmic veins, superficial cortical veins, and sphenoparietal sinuses into petrosal sinuses.',
        clinicalSignificance: 'Cavernous Sinus Thrombosis (often from facial furuncles in danger triangle of face) causes proptosis, chemosis, and ophthalmoplegia. CN VI is in the center next to ICA and is affected first.',
        highYieldFact: 'Lateral wall contents (superior to inferior): CN III, IV, V1, V2. Internal center contents: CN VI and Internal Carotid Artery.',
      },
      {
        id: 'carotid-triangle',
        name: 'Carotid Triangle & Bifurcation (C4 Level)',
        region: 'head-neck',
        category: 'arterial',
        layerDepth: 4,
        position: [-0.24, -0.18, 0.22],
        color: '#dc2626',
        nerveSupply: 'Carotid sinus nerve (CN IX) and Vagus (CN X)',
        bloodSupply: 'Common Carotid Artery bifurcating into Internal and External Carotid',
        actionOrFunction: 'Houses Carotid Sinus (baroreceptor sensing BP) and Carotid Body (chemoreceptor sensing pO2/pCO2/pH).',
        clinicalSignificance: 'Carotid endarterectomy carries risk of injuring Hypoglossal (CN XII), Vagus (CN X / recurrent laryngeal), and Marginal Mandibular branch of Facial nerve (CN VII).',
        highYieldFact: 'Boundaries of Carotid Triangle: Superior belly of Omohyoid, Anterior border of SCM, Posterior belly of Digastric.',
      },
      {
        id: 'circle-of-willis',
        name: 'Circle of Willis (Cerebral Arterial Circle)',
        region: 'neuroanatomy',
        category: 'arterial',
        layerDepth: 5,
        position: [0.0, 0.42, 0.05],
        color: '#dc2626',
        nerveSupply: 'Perivascular sympathetic nerves from Superior Cervical Ganglion',
        bloodSupply: 'Internal Carotid and Vertebrobasilar arterial systems',
        actionOrFunction: 'Provides crucial collateral anastomotic blood flow to cerebral hemispheres at the base of the brain (interpeduncular fossa).',
        clinicalSignificance: 'Berry (Saccular) Aneurysms most commonly occur at branch points in the Anterior Communicating Artery (AComA, 85%). Rupture causes sudden severe "Worst headache of life" (Subarachnoid Hemorrhage).',
        highYieldFact: 'Formed by: Anterior Cerebral, Anterior Communicating, Internal Carotid, Posterior Communicating, and Posterior Cerebral arteries.',
      },
    ],
  },

  // =========================================================================
  // 6. GENERAL & SYSTEMIC HISTOLOGY
  // =========================================================================
  'histology': {
    id: 'histology',
    title: 'Microscopic Anatomy & Functional Histology',
    subtitle: 'Epithelia, Connective Tissue ECM, Osteon Systems, and Organ Histology',
    systemCode: 'AN65.1-AN75.1',
    overview: 'High-resolution virtual light microscopy examining tissue architecture, basement membrane junctions, osteon Haversian remodeling, and specialized histochemical stains.',
    defaultCamera: [0, 0, 3.6],
    targetPoint: [0, 0, 0],
    layers: [
      { id: 'h-and-e', name: '1. Hematoxylin & Eosin (H&E)', depth: 1, color: '#ec4899', roughness: 0.5, metalness: 0.1, opacity: 1.0, description: 'Standard diagnostic stain: Hematoxylin stains acidic nuclei blue/purple; Eosin stains basic cytoplasm and collagen pink.' },
      { id: 'masson-trichrome', name: '2. Masson\'s Trichrome Stain', depth: 2, color: '#3b82f6', roughness: 0.4, metalness: 0.1, opacity: 0.9, description: 'Differentiates collagenous fibrosis (bright blue) from muscle fibers (red) and nuclei (dark brown/black).' },
      { id: 'pas-stain', name: '3. Periodic Acid-Schiff (PAS)', depth: 3, color: '#a855f7', roughness: 0.4, metalness: 0.1, opacity: 0.9, description: 'Stains 1,2-glycol groups in glycogen, mucus, and basement membranes magenta/purple (diagnostic in Whipple disease, fungal walls, glycogen storage diseases).' },
      { id: 'silver-stain', name: '4. Reticulin & Silver Stain', depth: 4, color: '#64748b', roughness: 0.6, metalness: 0.2, opacity: 0.9, description: 'Argyrophilic Type III collagen reticular fibers in liver sinusoids, spleen, lymph nodes, and basement membranes.' },
    ],
    landmarks: [
      {
        id: 'osteon-haversian',
        name: 'Osteon (Haversian System) & Volkmann Canals',
        region: 'histology',
        category: 'histology',
        layerDepth: 1,
        position: [0.15, 0.22, 0.22],
        color: '#f8fafc',
        actionOrFunction: 'Cylindrical structural unit of compact cortical bone with concentric lamellae surrounding a central neurovascular Haversian canal.',
        clinicalSignificance: 'Paget Disease of Bone (Osteitis Deformans) disrupts coordinated remodeling, producing a mosaic "jigsaw puzzle" pattern of cement lines with thickened weak trabeculae.',
        highYieldFact: 'Osteocytes trapped in lacunae communicate with each other and the central canal through dendritic processes traversing microscopic canaliculi (gap junctions).',
        histologyFeatures: 'Concentric bone lamellae with osteocytes in lacunae, central Haversian canal containing blood vessels, and transverse Volkmann canals connecting adjacent osteons.',
      },
      {
        id: 'transitional-epithelium-urothelium',
        name: 'Transitional Epithelium (Urothelium) & Umbrella Cells',
        region: 'histology',
        category: 'histology',
        layerDepth: 1,
        position: [-0.25, -0.15, 0.18],
        color: '#ec4899',
        actionOrFunction: 'Stratified specialized epithelium lining the renal calyces, ureters, bladder, and proximal urethra capable of stretching without tearing.',
        clinicalSignificance: 'Urothelial (Transitional Cell) Carcinoma presents with painless gross hematuria in smokers or workers exposed to industrial aniline dyes and beta-naphthylamine.',
        highYieldFact: 'Apical surface features dome-shaped "Umbrella Cells" containing specialized plaques (uroplakins) that prevent urine hypertonicity from drawing water out of the body.',
        histologyFeatures: 'Multi-layered epithelium; round/dome apical umbrella cells with scalloped borders that flatten into squamous morphology when the bladder is distended.',
      },
    ],
  },
};

export function getRegionalAnatomyPreset(presetId?: string): RegionalAnatomyPreset {
  if (!presetId || !REGIONAL_ANATOMY_PRESETS[presetId]) {
    return REGIONAL_ANATOMY_PRESETS['upper-limb'];
  }
  return REGIONAL_ANATOMY_PRESETS[presetId];
}
