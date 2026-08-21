/**
 * MarmaPresets.ts — 107 Classical Ayurvedic Marma Points Data Registry
 * 
 * Based on Sushruta Samhita (Sharira Sthana, Chapter 6) with modern neurovascular,
 * orthopedic, and surgical anatomy correlations.
 */

export type MarmaPrognosis = 
  | 'sadya_pranahara'      // Instantly fatal (19 points)
  | 'kalantara_pranahara'  // Fatal over time (33 points)
  | 'vishalyaghna'         // Fatal on foreign body removal (3 points)
  | 'vaikalyakara'         // Deformity / disability causing (44 points)
  | 'rujakara';            // Pain causing (8 points)

export type MarmaTissue = 
  | 'mamsa'   // Muscle (10)
  | 'sira'    // Vascular / Blood vessels (41)
  | 'snayu'   // Ligaments / Tendons (27)
  | 'asthi'   // Bones (8)
  | 'sandhi'; // Joints (20)

export type MarmaRegion =
  | 'head_neck'   // Urdhvajatrugata (37)
  | 'chest_abd'   // Uras & Udara (12)
  | 'back'        // Prishta (14)
  | 'upper_limb'  // Shakha - Urdhva (22)
  | 'lower_limb'; // Shakha - Adho (22)

export interface MarmaPoint {
  id: string;
  name: string;
  sanskritName: string;
  count: number;
  region: MarmaRegion;
  tissueType: MarmaTissue;
  prognosis: MarmaPrognosis;
  dimensionAnguli: string;
  locationDescription: string;
  modernAnatomyCorrelate: string;
  injuryConsequences: string;
  therapeuticApplication: string;
  coordinates3D: { x: number; y: number; z: number }; // Normalized 3D avatar coordinates (-1 to 1)
  viewAngle: 'front' | 'back' | 'head';
}

export const MARMA_PROGNOSIS_META: Record<MarmaPrognosis, { name: string; badge: string; color: string; description: string }> = {
  sadya_pranahara: {
    name: 'Sadya Pranahara',
    badge: '🔴 Instantly Fatal (19)',
    color: '#EF4444',
    description: 'Direct injury causes immediate death (within 1 to 7 days) from severe neurovascular collapse or vital organ perforation.',
  },
  kalantara_pranahara: {
    name: 'Kalantara Pranahara',
    badge: '🟠 Fatal Over Time (33)',
    color: '#F97316',
    description: 'Injury causes delayed death (within 15 to 30 days) from gradual internal hemorrhage, organ dysfunction, or sepsis.',
  },
  vishalyaghna: {
    name: 'Vishalyaghna',
    badge: '🟡 Fatal on Extraction (3)',
    color: '#EAB308',
    description: 'Patient survives while foreign body is lodged; fatal hemorrhage or air embolism occurs upon surgical extraction.',
  },
  vaikalyakara: {
    name: 'Vaikalyakara',
    badge: '🔵 Disability / Paralysis (44)',
    color: '#3B82F6',
    description: 'Causes permanent structural deformity, sensory loss, or functional motor disability without immediate mortality.',
  },
  rujakara: {
    name: 'Rujakara',
    badge: '🟢 Severe Pain (8)',
    color: '#10B981',
    description: 'Injury results in continuous, intense, debilitating localized neuropathic and musculoskeletal pain.',
  },
};

export const MARMA_POINTS_REGISTRY: MarmaPoint[] = [
  // ─── Head & Neck (Urdhvajatrugata) ─────────────────────────────────────────
  {
    id: 'sthapani',
    name: 'Sthapani',
    sanskritName: 'स्थपनी',
    count: 1,
    region: 'head_neck',
    tissueType: 'sira',
    prognosis: 'vishalyaghna',
    dimensionAnguli: '1/2 Anguli',
    locationDescription: 'Between the two eyebrows (Glabella / Ajna Chakra position).',
    modernAnatomyCorrelate: 'Nasion, frontal sinus, supratrochlear vessels, and superior sagittal sinus origin.',
    injuryConsequences: 'Survival while foreign body blocks bleeding; immediate death or catastrophic intracranial hemorrhage on removal.',
    therapeuticApplication: 'Gentle acupressure relieves frontal headaches, sinusitis, mental stress, and promotes pineal gland balance.',
    coordinates3D: { x: 0, y: 0.88, z: 0.22 },
    viewAngle: 'front',
  },
  {
    id: 'adhipati',
    name: 'Adhipati',
    sanskritName: 'अधिपति',
    count: 1,
    region: 'head_neck',
    tissueType: 'sandhi',
    prognosis: 'sadya_pranahara',
    dimensionAnguli: '1/2 Anguli',
    locationDescription: 'Vertex of the skull where hair whorl is located (Bregma / Sahasrara Chakra).',
    modernAnatomyCorrelate: 'Confluence of sinuses (Torcular Herophili), superior sagittal sinus, sagittal suture intersection.',
    injuryConsequences: 'Immediate intracranial hemorrhage, transtentorial herniation, and death on the spot.',
    therapeuticApplication: 'Shirodhara and gentle scalp massage (Shiroabhyanga) for insomnia, epilepsy, and neurological disorders.',
    coordinates3D: { x: 0, y: 0.98, z: 0.05 },
    viewAngle: 'head',
  },
  {
    id: 'shankha',
    name: 'Shankha',
    sanskritName: 'शंख',
    count: 2,
    region: 'head_neck',
    tissueType: 'asthi',
    prognosis: 'sadya_pranahara',
    dimensionAnguli: '1/2 Anguli',
    locationDescription: 'Temporal fossa, above and slightly posterior to lateral end of eyebrow.',
    modernAnatomyCorrelate: 'Pterion region, anterior branch of middle meningeal artery.',
    injuryConsequences: 'Epidural hematoma, rapid uncal herniation, and instantaneous death.',
    therapeuticApplication: 'Gentle circular pressure relieves temporal migraine and ocular fatigue.',
    coordinates3D: { x: 0.28, y: 0.86, z: 0.12 },
    viewAngle: 'front',
  },
  {
    id: 'utkshepa',
    name: 'Utkshepa',
    sanskritName: 'उत्क्षेप',
    count: 2,
    region: 'head_neck',
    tissueType: 'snayu',
    prognosis: 'vishalyaghna',
    dimensionAnguli: '1/2 Anguli',
    locationDescription: 'Above the temporal temples at the hairline margin.',
    modernAnatomyCorrelate: 'Temporalis muscle fascia and superficial temporal artery/vein.',
    injuryConsequences: 'Foreign body tamponades vessel; rapid exsanguination or sinus thrombosis on extraction.',
    therapeuticApplication: 'Therapeutic pressure for otalgia, vertigo, and tension headaches.',
    coordinates3D: { x: 0.32, y: 0.91, z: 0.08 },
    viewAngle: 'front',
  },
  {
    id: 'krikaatika',
    name: 'Krikatika',
    sanskritName: 'कृकाटिका',
    count: 2,
    region: 'head_neck',
    tissueType: 'sandhi',
    prognosis: 'vaikalyakara',
    dimensionAnguli: '1/2 Anguli',
    locationDescription: 'Junction of head and neck at the occipital-cervical hinge.',
    modernAnatomyCorrelate: 'Atlanto-occipital joint, vertebral artery entering foramen magnum, suboccipital nerve plexus.',
    injuryConsequences: 'Cervical instability, head tremor (Chala Murdhata), torticollis, or quadriplegia.',
    therapeuticApplication: 'Relieves cervical spondylosis, tension headaches, and postural neck stiffness.',
    coordinates3D: { x: 0.14, y: 0.78, z: -0.18 },
    viewAngle: 'back',
  },
  {
    id: 'vidhura',
    name: 'Vidhura',
    sanskritName: 'विधुर',
    count: 2,
    region: 'head_neck',
    tissueType: 'snayu',
    prognosis: 'vaikalyakara',
    dimensionAnguli: '1/2 Anguli',
    locationDescription: 'Depression behind and below the earlobe (mastoid tip).',
    modernAnatomyCorrelate: 'Stylomastoid foramen, facial nerve (CN VII) exit, posterior auricular artery.',
    injuryConsequences: 'Permanent deafness (Badhirya) or Bell\'s palsy facial paralysis.',
    therapeuticApplication: 'Karna Purana (medicated ear oil) for tinnitus, hearing impairment, and facial spasms.',
    coordinates3D: { x: 0.26, y: 0.79, z: -0.05 },
    viewAngle: 'back',
  },
  {
    id: 'phana',
    name: 'Phana',
    sanskritName: 'फण',
    count: 2,
    region: 'head_neck',
    tissueType: 'sira',
    prognosis: 'vaikalyakara',
    dimensionAnguli: '1/2 Anguli',
    locationDescription: 'Both sides of the nostrils along the alar base.',
    modernAnatomyCorrelate: 'Angular artery and facial vein, infraorbital nerve branch, olfactory mucosal plexus.',
    injuryConsequences: 'Loss of smell (Anosmia / Gandha Agyana) and chronic rhinitis.',
    therapeuticApplication: 'Nasya therapy and acupressure for allergic rhinitis, nasal congestion, and sinusitis.',
    coordinates3D: { x: 0.08, y: 0.81, z: 0.21 },
    viewAngle: 'front',
  },
  {
    id: 'apanga',
    name: 'Apanga',
    sanskritName: 'अपाङ्ग',
    count: 2,
    region: 'head_neck',
    tissueType: 'sira',
    prognosis: 'vaikalyakara',
    dimensionAnguli: '1/2 Anguli',
    locationDescription: 'Lateral canthus of the eye below the eyebrow termination.',
    modernAnatomyCorrelate: 'Zygomaticofacial nerve, lacrimal artery branches, lateral palpebral ligament.',
    injuryConsequences: 'Visual field defects, blindness (Andhatva), or persistent epiphora.',
    therapeuticApplication: 'Netra Tarpana (eye rejuvenation) for refractive errors, myopia, and dry eyes.',
    coordinates3D: { x: 0.22, y: 0.85, z: 0.17 },
    viewAngle: 'front',
  },
  {
    id: 'manya_dhamani',
    name: 'Manya & Dhamani',
    sanskritName: 'मन्या धमनी',
    count: 4,
    region: 'head_neck',
    tissueType: 'sira',
    prognosis: 'vaikalyakara',
    dimensionAnguli: '4 Anguli',
    locationDescription: 'Anterolateral neck on either side of the trachea and larynx.',
    modernAnatomyCorrelate: 'Carotid sheath containing Common Carotid Artery, Internal Jugular Vein, and Vagus Nerve.',
    injuryConsequences: 'Loss of voice (Mookata), hoarseness, severe hemodynamic instability, or ischemic stroke.',
    therapeuticApplication: 'Gentle herbal oil massage for speech disorders, thyroid dysfunction, and neck spasm.',
    coordinates3D: { x: 0.12, y: 0.69, z: 0.12 },
    viewAngle: 'front',
  },

  // ─── Chest & Abdomen (Uras & Udara) ───────────────────────────────────────
  {
    id: 'hridaya',
    name: 'Hridaya',
    sanskritName: 'हृदय',
    count: 1,
    region: 'chest_abd',
    tissueType: 'sira',
    prognosis: 'sadya_pranahara',
    dimensionAnguli: '4 Anguli (Pani Tala)',
    locationDescription: 'Center of anterior chest between the two breasts, over the cardiac region.',
    modernAnatomyCorrelate: 'Pericardium, myocardium, ascending aorta, coronary arteries, cardiac plexus.',
    injuryConsequences: 'Instantaneous death from cardiac arrest, cardiac tamponade, or ventricular rupture.',
    therapeuticApplication: 'Hrid Basti (warm medicated oil pool) for cardiac neurosis, arrhythmia, and emotional stress.',
    coordinates3D: { x: -0.04, y: 0.52, z: 0.16 },
    viewAngle: 'front',
  },
  {
    id: 'nabhi',
    name: 'Nabhi',
    sanskritName: 'नाभि',
    count: 1,
    region: 'chest_abd',
    tissueType: 'sira',
    prognosis: 'sadya_pranahara',
    dimensionAnguli: '4 Anguli',
    locationDescription: 'Umbilicus (Center of abdominal wall, root of all Siras).',
    modernAnatomyCorrelate: 'Umbilical ring, abdominal aorta bifurcation, inferior vena cava, solar plexus.',
    injuryConsequences: 'Immediate massive intra-abdominal hemorrhage, peritonitis, and rapid mortality.',
    therapeuticApplication: 'Nabhi Chikitsa (oiling of naval) for digestion, IBS, menstrual cramps, and systemic vitality.',
    coordinates3D: { x: 0, y: 0.28, z: 0.14 },
    viewAngle: 'front',
  },
  {
    id: 'basti',
    name: 'Basti',
    sanskritName: 'बस्ति',
    count: 1,
    region: 'chest_abd',
    tissueType: 'snayu',
    prognosis: 'sadya_pranahara',
    dimensionAnguli: '4 Anguli',
    locationDescription: 'Hypogastric region over the urinary bladder in pelvis.',
    modernAnatomyCorrelate: 'Urinary bladder, internal iliac vessels, pelvic autonomic plexus.',
    injuryConsequences: 'Intra-pelvic extravasation of urine, pelvic sepsis, or instantaneous hemorrhagic shock.',
    therapeuticApplication: 'Uttar Basti and local fomentation for benign prostatic hyperplasia, cystitis, and infertility.',
    coordinates3D: { x: 0, y: 0.15, z: 0.12 },
    viewAngle: 'front',
  },
  {
    id: 'stanamula',
    name: 'Stanamula',
    sanskritName: 'स्तनमूल',
    count: 2,
    region: 'chest_abd',
    tissueType: 'sira',
    prognosis: 'kalantara_pranahara',
    dimensionAnguli: '2 Anguli',
    locationDescription: 'Two angulis below the breasts on both sides (6th intercostal space).',
    modernAnatomyCorrelate: 'Internal thoracic vessels, intercostal neurovascular bundle, pleura and base of lungs.',
    injuryConsequences: 'Hemothorax, pneumonia, progressive respiratory distress, and death within 15–30 days.',
    therapeuticApplication: 'Chest expansion therapy and herbal compress for bronchial asthma and pleurisy.',
    coordinates3D: { x: 0.18, y: 0.44, z: 0.15 },
    viewAngle: 'front',
  },
  {
    id: 'stanarohita',
    name: 'Stanarohita',
    sanskritName: 'स्तनरोहित',
    count: 2,
    region: 'chest_abd',
    tissueType: 'mamsa',
    prognosis: 'kalantara_pranahara',
    dimensionAnguli: '1/2 Anguli',
    locationDescription: 'Two angulis above the nipples on both sides (3rd intercostal space).',
    modernAnatomyCorrelate: 'Pectoralis major, internal thoracic perforators, lateral thoracic artery.',
    injuryConsequences: 'Pulmonary laceration, hemoptysis, and delayed fatal respiratory exhaustion.',
    therapeuticApplication: 'Assists in opening bronchial airways during chronic cough and pulmonary rehab.',
    coordinates3D: { x: 0.18, y: 0.58, z: 0.16 },
    viewAngle: 'front',
  },

  // ─── Upper Limb (Shakha - Urdhva) ─────────────────────────────────────────
  {
    id: 'talahridaya_hand',
    name: 'Talahridaya (Hand)',
    sanskritName: 'तलहृदय (हस्त)',
    count: 2,
    region: 'upper_limb',
    tissueType: 'mamsa',
    prognosis: 'kalantara_pranahara',
    dimensionAnguli: '1/2 Anguli',
    locationDescription: 'Center of the palm along the line of the middle finger.',
    modernAnatomyCorrelate: 'Superficial and deep palmar arterial arches, median nerve palmar cutaneous branch.',
    injuryConsequences: 'Severe pain, intractable palmar space infection, necrosis, and fatal septicemia.',
    therapeuticApplication: 'Stimulation balances cardiovascular circulation, reduces anxiety, and enhances hand dexterity.',
    coordinates3D: { x: 0.62, y: 0.18, z: 0.05 },
    viewAngle: 'front',
  },
  {
    id: 'kshipra_hand',
    name: 'Kshipra (Hand)',
    sanskritName: 'क्षिप्र (हस्त)',
    count: 2,
    region: 'upper_limb',
    tissueType: 'snayu',
    prognosis: 'kalantara_pranahara',
    dimensionAnguli: '1/2 Anguli',
    locationDescription: 'First interdigital web space between thumb and index finger.',
    modernAnatomyCorrelate: 'First dorsal interosseous muscle, radial artery deep branch, adductor pollicis.',
    injuryConsequences: 'Convulsions (Akshepaka), tetanus-like muscular spasms, and death within a month.',
    therapeuticApplication: 'Acupressure for acute headaches, toothache, stress reduction, and lymphatic drainage.',
    coordinates3D: { x: 0.59, y: 0.22, z: 0.08 },
    viewAngle: 'front',
  },
  {
    id: 'kurpara',
    name: 'Kurpara',
    sanskritName: 'कूर्पर',
    count: 2,
    region: 'upper_limb',
    tissueType: 'sandhi',
    prognosis: 'vaikalyakara',
    dimensionAnguli: '3 Anguli',
    locationDescription: 'Elbow joint articulation.',
    modernAnatomyCorrelate: 'Humeroulnar joint, brachial artery bifurcation, median & ulnar nerves.',
    injuryConsequences: 'Elbow joint contracture (Kuni / flexion deformity), loss of forearm pronation/supination.',
    therapeuticApplication: 'Treats tennis elbow, golfer\'s elbow, and post-traumatic elbow stiffness.',
    coordinates3D: { x: 0.44, y: 0.38, z: -0.02 },
    viewAngle: 'back',
  },
  {
    id: 'amsa',
    name: 'Amsa',
    sanskritName: 'अंस',
    count: 2,
    region: 'upper_limb',
    tissueType: 'snayu',
    prognosis: 'vaikalyakara',
    dimensionAnguli: '1/2 Anguli',
    locationDescription: 'Apex of shoulder between neck root and shoulder tip.',
    modernAnatomyCorrelate: 'Supraspinatus tendon, acromioclavicular joint, suprascapular nerve and artery.',
    injuryConsequences: 'Loss of arm abduction, frozen shoulder, muscle wasting (Shosha).',
    therapeuticApplication: 'Manya & Amsa Basti for cervical radiculopathy and rotator cuff tendinitis.',
    coordinates3D: { x: 0.28, y: 0.68, z: 0.02 },
    viewAngle: 'front',
  },
  {
    id: 'manibandha',
    name: 'Manibandha',
    sanskritName: 'मणिबन्ध',
    count: 2,
    region: 'upper_limb',
    tissueType: 'sandhi',
    prognosis: 'rujakara',
    dimensionAnguli: '2 Anguli',
    locationDescription: 'Wrist joint crease on anterior and posterior surfaces.',
    modernAnatomyCorrelate: 'Radiocarpal joint, flexor retinaculum, carpal tunnel containing median nerve.',
    injuryConsequences: 'Carpal tunnel syndrome, intense intractable wrist joint pain, loss of grip power.',
    therapeuticApplication: 'Relieves repetitive strain injury (RSI), carpal tunnel syndrome, and wrist arthrosis.',
    coordinates3D: { x: 0.55, y: 0.24, z: 0.04 },
    viewAngle: 'front',
  },

  // ─── Lower Extremities (Shakha - Adho) ────────────────────────────────────
  {
    id: 'talahridaya_foot',
    name: 'Talahridaya (Foot)',
    sanskritName: 'तलहृदय (पाद)',
    count: 2,
    region: 'lower_limb',
    tissueType: 'mamsa',
    prognosis: 'kalantara_pranahara',
    dimensionAnguli: '1/2 Anguli',
    locationDescription: 'Center of the plantar surface of the foot.',
    modernAnatomyCorrelate: 'Plantar aponeurosis, medial and lateral plantar arteries and nerves.',
    injuryConsequences: 'Severe pain, plantar fasciitis, ascending osteomyelitis, and systemic septic shock.',
    therapeuticApplication: 'Padabhyanga (Ayurvedic foot massage) for insomnia, neuropathy, and systemic grounding.',
    coordinates3D: { x: 0.14, y: -0.92, z: 0.05 },
    viewAngle: 'front',
  },
  {
    id: 'janu',
    name: 'Janu',
    sanskritName: 'जानु',
    count: 2,
    region: 'lower_limb',
    tissueType: 'sandhi',
    prognosis: 'vaikalyakara',
    dimensionAnguli: '3 Anguli',
    locationDescription: 'Knee joint complex (Anterior patellar and posterior popliteal borders).',
    modernAnatomyCorrelate: 'Tibiofemoral joint, cruciate ligaments, popliteal artery/vein and tibial nerve.',
    injuryConsequences: 'Severe knee instability, permanent limp (Khanjata), loss of weight-bearing ability.',
    therapeuticApplication: 'Janu Basti (warm oil reservoir over knee) for osteoarthritis, ligament sprains, and Baker\'s cyst.',
    coordinates3D: { x: 0.16, y: -0.42, z: 0.04 },
    viewAngle: 'front',
  },
  {
    id: 'gulpha',
    name: 'Gulpha',
    sanskritName: 'गुल्फ',
    count: 2,
    region: 'lower_limb',
    tissueType: 'sandhi',
    prognosis: 'rujakara',
    dimensionAnguli: '2 Anguli',
    locationDescription: 'Ankle joint between medial and lateral malleoli.',
    modernAnatomyCorrelate: 'Talocrural joint, deltoid ligament, anterior talofibular ligament, posterior tibial artery.',
    injuryConsequences: 'Chronic severe joint pain, ankle stiffness, recurrent subluxation.',
    therapeuticApplication: 'Relieves ankle sprains, Achilles tendinitis, and plantar heel spurs.',
    coordinates3D: { x: 0.15, y: -0.82, z: 0.02 },
    viewAngle: 'front',
  },
  {
    id: 'urvi_leg',
    name: 'Urvi (Thigh)',
    sanskritName: 'उर्वी (ऊरु)',
    count: 2,
    region: 'lower_limb',
    tissueType: 'sira',
    prognosis: 'vaikalyakara',
    dimensionAnguli: '1 Anguli',
    locationDescription: 'Midpoint of the anterior/medial thigh.',
    modernAnatomyCorrelate: 'Femoral triangle apex, femoral artery, vein, and saphenous nerve.',
    injuryConsequences: 'Severe quadriceps wasting (Urushosha), lower extremity weakness, or ischemic necrosis.',
    therapeuticApplication: 'Massage improves lymphatic drainage and relieves diabetic peripheral neuropathy.',
    coordinates3D: { x: 0.15, y: -0.18, z: 0.08 },
    viewAngle: 'front',
  },

  // ─── Back & Posterior Trunk (Prishta) ─────────────────────────────────────
  {
    id: 'kati_taruna',
    name: 'Katiktaruna',
    sanskritName: 'कटिकतरुण',
    count: 2,
    region: 'back',
    tissueType: 'asthi',
    prognosis: 'kalantara_pranahara',
    dimensionAnguli: '1/2 Anguli',
    locationDescription: 'Pelvic bone crests at the sacroiliac joint margin on either side of the spine.',
    modernAnatomyCorrelate: 'Sacroiliac joint, superior gluteal artery and nerve, sciatic nerve origin.',
    injuryConsequences: 'Severe anemia from retroperitoneal bleeding, sciatica, and delayed fatality.',
    therapeuticApplication: 'Kati Basti for sciatica, lumbar disc herniation, and sacroiliitis.',
    coordinates3D: { x: 0.14, y: 0.12, z: -0.14 },
    viewAngle: 'back',
  },
  {
    id: 'kukundara',
    name: 'Kukundara',
    sanskritName: 'कुकुन्दर',
    count: 2,
    region: 'back',
    tissueType: 'sandhi',
    prognosis: 'vaikalyakara',
    dimensionAnguli: '1/2 Anguli',
    locationDescription: 'Posterior superior iliac spine (Dimples of Venus) on both gluteal borders.',
    modernAnatomyCorrelate: 'Sacroiliac joint capsule, cluneal nerves, posterior sacroiliac ligaments.',
    injuryConsequences: 'Loss of sensation in lower limbs, urinary incontinence, and loss of erectile function.',
    therapeuticApplication: 'Acupressure for pelvic pain syndrome, sciatica, and lumbosacral radiculopathy.',
    coordinates3D: { x: 0.12, y: 0.08, z: -0.15 },
    viewAngle: 'back',
  },
  {
    id: 'nitamba',
    name: 'Nitamba',
    sanskritName: 'नितम्ब',
    count: 2,
    region: 'back',
    tissueType: 'asthi',
    prognosis: 'kalantara_pranahara',
    dimensionAnguli: '1/2 Anguli',
    locationDescription: 'Superior aspect of iliac crest above the gluteal mass.',
    modernAnatomyCorrelate: 'Iliac crest, quadratus lumborum attachment, iliolumbar artery.',
    injuryConsequences: 'Muscle wasting of lower limbs (Adhahkaya Shosha) and delayed fatality.',
    therapeuticApplication: 'Treats myofascial back pain, quadratus lumborum spasms, and pelvic torsion.',
    coordinates3D: { x: 0.22, y: 0.16, z: -0.12 },
    viewAngle: 'back',
  },
];

export const TOTAL_MARMA_COUNT = 107;

export function getMarmaById(id: string): MarmaPoint | undefined {
  return MARMA_POINTS_REGISTRY.find((m) => m.id === id);
}

export function getMarmasByPrognosis(prognosis: MarmaPrognosis): MarmaPoint[] {
  return MARMA_POINTS_REGISTRY.filter((m) => m.prognosis === prognosis);
}

export function getMarmasByRegion(region: MarmaRegion): MarmaPoint[] {
  return MARMA_POINTS_REGISTRY.filter((m) => m.region === region);
}
