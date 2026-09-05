/**
 * SimulatedPatientPersonaEngine.ts
 * Bedside Simulated Patient Conversational Persona & Natural Language History-Taking Engine.
 * Location: frontend/.gemini/skills/SimulatedPatientPersonaEngine.ts
 *
 * Implements:
 * 1. Persona knowledge graphs for standardized clinical cases (NMC CBME / USMLE Step 2 CS / PLAB 2).
 * 2. Realistic clinical bounds: patients report lay symptoms, cultural idioms, emotional affects (pain groans, breathlessness).
 * 3. Natural Language Intent Parser mapped to SOCRATES / OLD CARTS history dimensions.
 * 4. Empathy & rapport detection with affirmative patient responses.
 * 5. Jargon filter: alerts students when using incomprehensible medical jargon with patients.
 * 6. Real-time history-taking coverage scorer.
 */

export type PatientAffect =
  | 'ANXIOUS_PAIN'
  | 'BREATHLESS'
  | 'GUARDED'
  | 'CONFUSED'
  | 'STOIC'
  | 'TEARFUL'
  | 'COOPERATIVE';

export type HistoryDimension =
  | 'ONSET_TIMING'
  | 'LOCATION_RADIATION'
  | 'CHARACTER_SEVERITY'
  | 'AGGRAVATING_RELIEVING'
  | 'ASSOCIATED_SYMPTOMS'
  | 'PAST_HISTORY'
  | 'MEDS_ALLERGIES'
  | 'SOCIAL_FAMILY'
  | 'EMPATHY_RAPPORT';

export interface HistoryDimensionMeta {
  id: HistoryDimension;
  title: string;
  shortLabel: string;
  description: string;
  socratesCode: string;
}

export const HISTORY_DIMENSIONS: HistoryDimensionMeta[] = [
  {
    id: 'ONSET_TIMING',
    title: 'Onset & Chronology',
    shortLabel: 'Onset',
    description: 'When symptoms started, acute vs. insidious onset, constant vs. waxing/waning.',
    socratesCode: 'O / T'
  },
  {
    id: 'LOCATION_RADIATION',
    title: 'Location & Radiation',
    shortLabel: 'Location',
    description: 'Exact anatomical site of pain/discomfort and where it radiates (jaw, arm, back).',
    socratesCode: 'S / R'
  },
  {
    id: 'CHARACTER_SEVERITY',
    title: 'Character & Pain Severity (1-10)',
    shortLabel: 'Quality',
    description: 'Quality of pain (crushing, stabbing, dull, burning) and 1-10 severity rating.',
    socratesCode: 'C / S'
  },
  {
    id: 'AGGRAVATING_RELIEVING',
    title: 'Aggravating & Relieving Factors',
    shortLabel: 'Triggers',
    description: 'Exertion, breathing, position, food, rest, or medications that modify symptoms.',
    socratesCode: 'E'
  },
  {
    id: 'ASSOCIATED_SYMPTOMS',
    title: 'Associated Systemic Symptoms',
    shortLabel: 'Associated',
    description: 'Shortness of breath, diaphoresis, nausea, dizziness, vomiting, palpitations.',
    socratesCode: 'A'
  },
  {
    id: 'PAST_HISTORY',
    title: 'Past Medical & Surgical History',
    shortLabel: 'PMHx',
    description: 'Previous heart attacks, hypertension, diabetes, surgeries, or chronic illnesses.',
    socratesCode: 'PMHx'
  },
  {
    id: 'MEDS_ALLERGIES',
    title: 'Medications & Allergies',
    shortLabel: 'Meds/Allergy',
    description: 'Current prescription drugs, OTC remedies, compliance, and drug allergies.',
    socratesCode: 'Rx'
  },
  {
    id: 'SOCIAL_FAMILY',
    title: 'Social & Family History',
    shortLabel: 'Social/Fam',
    description: 'Tobacco use (pack-years), alcohol, occupation, and premature family history.',
    socratesCode: 'SHx/FHx'
  },
  {
    id: 'EMPATHY_RAPPORT',
    title: 'Empathy, Introduction & Rapport',
    shortLabel: 'Empathy',
    description: 'Introducing oneself, actively acknowledging pain, validating fears, showing warmth.',
    socratesCode: 'AETCOM'
  }
];

export interface PatientPersona {
  caseId: string;
  name: string;
  age: number;
  gender: string;
  chiefComplaint: string;
  affect: PatientAffect;
  affectDescription: string;
  voicePitch: number; // 0.8 to 1.3 for Web Speech API
  voiceRate: number;  // 0.8 to 1.1
  suggestedQuestions: string[];
  intents: Record<HistoryDimension, string[]>;
  jargonResponses: string[];
  fallbackResponses: string[];
  empathyResponses: string[];
}

export interface ParsedCandidateTurn {
  response: string;
  matchedDimension?: HistoryDimension;
  isEmpathy: boolean;
  isJargonWarning: boolean;
  detectedEmotion: 'pain' | 'reassured' | 'confused' | 'neutral';
}

export interface HistoryCoverageReport {
  scorePercentage: number;
  coveredDimensions: HistoryDimension[];
  missingDimensions: HistoryDimension[];
  feedback: string[];
}

/**
 * Standard Persona Registry for Mediverse Clinical Cases
 */
export const PATIENT_PERSONAS: Record<string, PatientPersona> = {
  'case-mbbs-01': {
    caseId: 'case-mbbs-01',
    name: 'Ramesh Sundaram',
    age: 58,
    gender: 'Male',
    chiefComplaint: 'Severe retrosternal squeezing chest pain radiating to left jaw & shoulder',
    affect: 'ANXIOUS_PAIN',
    affectDescription: 'Clutching chest (Levine sign), visibly sweating, pale, tachypneic, highly fearful of dying.',
    voicePitch: 0.9,
    voiceRate: 0.95,
    suggestedQuestions: [
      'When exactly did this chest pain start?',
      'Can you describe what the pain feels like?',
      'Does the pain spread anywhere else?',
      'On a scale of 1 to 10, how severe is the pain?',
      'Are you feeling short of breath, sweaty, or nauseous?',
      'What medications do you take at home?',
      'Do you have any known allergies?'
    ],
    intents: {
      ONSET_TIMING: [
        '*wincing, taking shallow breaths* It came on suddenly while I was climbing the stairs about two hours ago doctor! It hasn\'t let up at all... it just keeps building.',
        'About 90 to 120 minutes ago. I sat down on the sofa hoping it would go away, but it\'s relentless.',
        'It started abruptly, doctor. No warning at all.'
      ],
      LOCATION_RADIATION: [
        '*presses clenched fist against center of chest* Right here, right behind my breastbone! And it shoots up along the left side of my neck, into my jaw and down my left arm.',
        'It goes right down into my left arm and fingers, doctor. Feels heavy and numb.',
        'Mainly right in the middle of my chest, but my lower jaw is aching too.'
      ],
      CHARACTER_SEVERITY: [
        'It feels like an elephant is sitting right on my chest! Crushing... like a tight iron band squeezing my heart. It\'s easily a 9 or 10 out of 10!',
        'It\'s not sharp or stabbing, doctor. It\'s a heavy, suffocating pressure. A solid 10 on the pain scale.',
        'Deep squeezing pressure. I can barely take a breath without feeling crushed.'
      ],
      AGGRAVATING_RELIEVING: [
        'Nothing helps! I tried sitting quietly and taking deep breaths, but it didn\'t ease up even a bit. Walking makes it worse.',
        'Rest didn\'t help at all. My wife gave me an antacid tablet thinking it was acidity, but it made zero difference.',
        'Exertion makes it throb worse, and lying flat makes me feel like I\'m suffocating.'
      ],
      ASSOCIATED_SYMPTOMS: [
        '*wipes cold sweat from forehead* Yes! I\'m drenched in cold sweat, feeling very nauseous, and I feel like I can\'t catch my breath.',
        'I felt terribly lightheaded when I stood up, and my stomach feels sick like I might throw up.',
        'Very breathless, doctor. And my heart feels like it\'s racing in my throat.'
      ],
      PAST_HISTORY: [
        'I\'ve had high blood pressure and type 2 diabetes for about 8 years. My doctor told me my cholesterol was high last year.',
        'High blood pressure and sugar disease. I had a kidney stone removed 5 years ago, but never heart trouble before today.',
        'Just high BP and diabetes, doctor. No prior heart attacks that I know of.'
      ],
      MEDS_ALLERGIES: [
        'I take Metformin 500mg twice a day and Telmisartan 40mg every morning. I sometimes forget to take my cholesterol pill (Atorvastatin). No drug allergies that I know of!',
        'Metformin for diabetes and Telmisartan for BP. I\'m allergic to sulfa drugs—they gave me a terrible rash on my back once.',
        'My regular blood pressure and sugar tablets. No penicillin allergy.'
      ],
      SOCIAL_FAMILY: [
        'I smoked a pack of cigarettes a day for almost 30 years, though I cut down recently. I work as an accountant, so lots of sitting and stress. My father passed away suddenly from a heart attack when he was 54.',
        'Yes doctor, I\'m a smoker. And my older brother had a bypass surgery at age 56. Heart disease runs strong in our family.',
        'I don\'t drink much, just an occasional beer. But strong family history of heart attacks on my father\'s side.'
      ],
      EMPATHY_RAPPORT: [
        '*relaxes shoulders slightly* Thank you, doctor... thank you for listening. I was so terrified I was dying here alone.',
        '*nods tearfully* I appreciate that, doctor. Please help me get through this pain.',
        'Bless you, doctor. Your calm words help my anxiety a lot.'
      ]
    },
    jargonResponses: [
      'I... I don\'t know what that medical term means, doctor. Can you explain in simple words? My chest just hurts terribly!',
      'I\'m sorry doctor, I didn\'t understand that word. I\'m just an accountant, not a medical professional.'
    ],
    fallbackResponses: [
      'I\'m not quite sure about that doctor, but the main thing is this awful crushing feeling in my chest.',
      '*groans softly* Can you ask that again, doctor? The pain is making it hard to concentrate.',
      'I don\'t know doctor, but my wife might know when she arrives.'
    ],
    empathyResponses: [
      '*takes a deeper breath* Thank you for reassuring me, doctor. I trust you and your team.',
      'I feel safer knowing you are here taking care of me. Thank you.',
      'Thank you doctor, that gives me comfort.'
    ]
  },

  'case-mbbs-02': {
    caseId: 'case-mbbs-02',
    name: 'Priyanka Sen',
    age: 24,
    gender: 'Female',
    chiefComplaint: 'Bilateral symmetric wrist & MCP joint pain, butterfly facial rash, foamy urine, and extreme fatigue',
    affect: 'GUARDED',
    affectDescription: 'Exhausted, guarded about joint movements, embarrassed by facial malar erythema, wearing dark sunglasses due to photosensitivity.',
    voicePitch: 1.1,
    voiceRate: 0.9,
    suggestedQuestions: [
      'How long have your joints been aching?',
      'Tell me about the rash across your cheeks and nose.',
      'Does sunlight make your skin symptoms worse?',
      'Have you noticed any swelling or changes in your urine?',
      'Any ulcers in your mouth or hair thinning?',
      'Has anyone in your family had autoimmune or thyroid conditions?'
    ],
    intents: {
      ONSET_TIMING: [
        'The joint stiffness started about four months ago, doctor. At first I thought it was from typing at my IT job, but it has gotten progressively worse.',
        'It began gradually over the last 3-4 months. The mornings are by far the worst—it takes me two hours just to be able to make a fist.',
        'The fatigue has been dragging on for six months, but the facial redness flared up severely after my vacation to the beach last month.'
      ],
      LOCATION_RADIATION: [
        'Both my wrists, the knuckles on both hands, and both knees hurt symmetrically. It doesn\'t radiate like nerve pain; the joints themselves are hot and swollen.',
        'My knuckles, wrists, and ankles. It\'s bilateral and equal on both sides.',
        'Mainly in my hands and fingers. I can\'t even turn a doorknob or open a water bottle in the morning.'
      ],
      CHARACTER_SEVERITY: [
        'It\'s a throbbing, stiff ache. When I wake up, the stiffness is about an 8 out of 10. After a warm shower and moving around, it eases to a 5.',
        'Dull, aching soreness with burning warmth over the joints. My knuckles feel stiff like dried clay.',
        'Around 7 out of 10 in the mornings. It drains all my energy.'
      ],
      AGGRAVATING_RELIEVING: [
        'Sunlight makes everything worse! If I spend even 15 minutes in the sun, my cheeks turn bright red and burning hot. Warm water baths help loosen my fingers.',
        'Sun exposure triggers a major flare of my rash and fever. Resting helps the knees, but being still makes the morning stiffness stiffer.',
        'Cold weather and direct sun aggravate it. Taking ibuprofen gives mild temporary relief, but it upsets my stomach.'
      ],
      ASSOCIATED_SYMPTOMS: [
        'I\'ve noticed painless sores on the roof of my mouth, and my hair is coming out in clumps when I brush it. Also, my urine has looked frothy or foamy lately.',
        'Yes doctor, my ankles get puffy by evening, and my urine has bubbly foam on top. I also get low-grade fevers in the evening.',
        'Painless mouth ulcers and extreme photosensitivity. I feel wiped out even after sleeping 10 hours.'
      ],
      PAST_HISTORY: [
        'I was generally healthy before this. I had mild iron deficiency anemia two years ago. No previous surgeries.',
        'No major medical history, doctor. Just recurring mouth ulcers and fatigue over the past year.',
        'Never had major hospitalizations before.'
      ],
      MEDS_ALLERGIES: [
        'I take OTC Ibuprofen 400mg when the pain gets unbearable, and a multivitamin. I had an allergic hives reaction to Amoxicillin as a child.',
        'Just over-the-counter painkillers for the joints. Allergic to Amoxicillin and penicillin.',
        'No regular prescription medications currently.'
      ],
      SOCIAL_FAMILY: [
        'I work as a software QA engineer in Bangalore. I don\'t smoke or drink. My maternal aunt has Hashimoto\'s thyroiditis and vitiligo.',
        'Non-smoker, non-drinker. My mother has rheumatoid arthritis, and my aunt has thyroid trouble.',
        'I live with my parents. Autoimmune conditions run in my mother\'s sisters.'
      ],
      EMPATHY_RAPPORT: [
        '*smiles faintly* Thank you for taking me seriously, doctor. The last clinic told me I was just stressed and working too many hours.',
        'It means a lot that you understand how exhausting this is. Thank you.',
        'I really appreciate your kind approach.'
      ]
    },
    jargonResponses: [
      'I don\'t know what that term means doctor, could you explain simply?',
      'Is that a medical diagnosis? I\'m not familiar with that abbreviation.'
    ],
    fallbackResponses: [
      'I\'m not sure about that, doctor, but the joint stiffness and the rash on my face are what bother me the most.',
      'Could you repeat that? My brain feels a bit foggy today with this fatigue.',
      'I haven\'t really noticed that, doctor.'
    ],
    empathyResponses: [
      'Thank you so much, doctor. Having a doctor who really listens makes all the difference.',
      'I feel much more comfortable now. Thank you for your empathy.',
      'That is very reassuring to hear.'
    ]
  },

  'case-bds-01': {
    caseId: 'case-bds-01',
    name: 'Kavita Nair',
    age: 32,
    gender: 'Female',
    chiefComplaint: 'Throbbing, sleep-depriving toothache in right lower jaw with gum swelling and pain on biting',
    affect: 'ANXIOUS_PAIN',
    affectDescription: 'Holding right cheek with a cold water bottle, sleep-deprived, grimacing with any tooth contact.',
    voicePitch: 1.05,
    voiceRate: 0.95,
    suggestedQuestions: [
      'Which tooth is giving you this severe pain?',
      'Does cold water or hot tea make the pain worse?',
      'Does the pain keep you awake at night?',
      'Have you noticed any bad taste or swelling on your gums?',
      'What painkillers have you taken?'
    ],
    intents: {
      ONSET_TIMING: [
        'The deep ache started three days ago, doctor. But last night it became unbearable—a pounding throb that kept me crying all night!',
        'It was sensitive to sweets for a month, but two days ago it turned into this horrific constant throbbing pain.',
        'Since yesterday evening it became excruciating. Not a wink of sleep last night.'
      ],
      LOCATION_RADIATION: [
        '*points to lower right molar* Right here in my lower right back tooth! The pain shoots up into my right ear and my temple.',
        'Lower right jaw, doctor. It feels like the whole right side of my face is swollen and beating like a drum.',
        'Right lower molar, radiating all the way into my ear canal.'
      ],
      CHARACTER_SEVERITY: [
        'It\'s a relentless, pulsating, throbbing ache! A 9 out of 10. If my upper tooth even taps against it, electric shocks shoot through my head!',
        'Like a hot drill boring into my jawbone. Pulsating with my heartbeat. 10 out of 10!',
        'Severe throbbing and pressure. The tooth feels slightly raised and taller than the others.'
      ],
      AGGRAVATING_RELIEVING: [
        'Biting down is agony! Hot tea makes it throb ten times worse. Cold water gave brief relief at first, but now even cold hurts.',
        'Touching the tooth or eating anything solid is impossible. Lying flat at night makes the pounding rush of blood worse.',
        'Heat makes it flare violently. Only holding ice water in my mouth gave temporary numbing.'
      ],
      ASSOCIATED_SYMPTOMS: [
        'There is a tender little bump on the gum next to the tooth. I noticed a foul, salty taste earlier today, like something drained.',
        'I feel a bit feverish and my right neck gland feels swollen and sore.',
        'A swollen pimple on the gum and a bad taste in my mouth.'
      ],
      PAST_HISTORY: [
        'I had a large silver filling placed in that tooth about seven years ago. No other major medical conditions.',
        'Just dental fillings. No heart or kidney problems.',
        'Healthy overall, no history of bleeding disorders.'
      ],
      MEDS_ALLERGIES: [
        'I took 650mg paracetamol and two ibuprofen tablets last night, but they barely touched the pain. No allergies.',
        'Paracetamol and diclofenac. No known drug allergies.',
        'Just over-the-counter painkillers. No penicillin allergy.'
      ],
      SOCIAL_FAMILY: [
        'I work as a schoolteacher. I drink tea with two spoons of sugar three times a day. Non-smoker.',
        'No smoking, occasional social wine. Sweet tooth since childhood.',
        'Non-smoker, school teacher.'
      ],
      EMPATHY_RAPPORT: [
        '*sighs in relief* Thank you doctor... I was terrified of dental needles, but this pain is so terrible I just want relief.',
        'Thank you for being gentle doctor. I really appreciate your care.',
        'Bless you doctor, please help me stop this throb.'
      ]
    },
    jargonResponses: [
      'I don\'t understand dental terms doctor, is my tooth going to be pulled out?',
      'What does that mean doctor? Is it an infection?'
    ],
    fallbackResponses: [
      'I just know that my lower right tooth is pounding with agony, doctor.',
      'Can you please give me something to numb it first, doctor? The pain is overwhelming.',
      'I\'m not sure, doctor.'
    ],
    empathyResponses: [
      'Thank you for understanding doctor. I was so nervous coming in today.',
      'Your kindness helps me calm down. Thank you.',
      'I appreciate your gentleness.'
    ]
  }
};

/**
 * Fallback Generic Persona Generator for Unregistered Cases or General OSCE Stations
 */
export function getPersonaForCase(caseId: string): PatientPersona {
  if (PATIENT_PERSONAS[caseId]) {
    return PATIENT_PERSONAS[caseId];
  }

  // Create intelligent generic default persona
  return {
    caseId,
    name: 'Patient Bedside Simulator',
    age: 50,
    gender: 'Patient',
    chiefComplaint: 'Acute clinical symptoms requiring comprehensive history-taking',
    affect: 'COOPERATIVE',
    affectDescription: 'Cooperative, responsive to student examination and history-taking.',
    voicePitch: 1.0,
    voiceRate: 1.0,
    suggestedQuestions: [
      'When did your symptoms first start?',
      'Where is the problem located?',
      'How severe is the discomfort on a scale of 1 to 10?',
      'What makes the symptoms better or worse?',
      'Do you take any daily medications or have allergies?'
    ],
    intents: {
      ONSET_TIMING: [
        'It started a few hours ago and has been persisting since then, doctor.',
        'It began earlier today and has been steady.'
      ],
      LOCATION_RADIATION: [
        'It is primarily right here in this area, doctor.',
        'It seems focused in the main complaint area without spreading too far.'
      ],
      CHARACTER_SEVERITY: [
        'It is quite uncomfortable doctor, around a 7 out of 10 on the severity scale.',
        'Moderate to severe discomfort, noticeable with any movement.'
      ],
      AGGRAVATING_RELIEVING: [
        'Exertion and movement seem to aggravate it, doctor. Resting quietly helps a bit.',
        'Physical stress makes it worse, resting helps.'
      ],
      ASSOCIATED_SYMPTOMS: [
        'I felt a bit nauseous and fatigued when it came on, doctor.',
        'Mild dizziness and general tiredness along with it.'
      ],
      PAST_HISTORY: [
        'I have a history of high blood pressure, but no other major surgeries.',
        'Just routine checkups for blood pressure in the past.'
      ],
      MEDS_ALLERGIES: [
        'I take my daily blood pressure tablet. I don\'t have any known drug allergies.',
        'Regular maintenance medications, no allergies.'
      ],
      SOCIAL_FAMILY: [
        'I do not smoke, and I live with my family. My parents had hypertension.',
        'Non-smoker, supportive family background.'
      ],
      EMPATHY_RAPPORT: [
        'Thank you doctor, I appreciate your compassionate care and attention.',
        'Thank you for listening to my concerns, doctor.'
      ]
    },
    jargonResponses: [
      'I\'m sorry doctor, I\'m not familiar with that medical term. Could you explain what that means?',
      'What does that mean in simple terms, doctor?'
    ],
    fallbackResponses: [
      'I\'m not entirely sure about that, doctor, but I hope my answers help you figure out what\'s going on.',
      'Could you rephrase that question, doctor?'
    ],
    empathyResponses: [
      'Thank you for your kindness, doctor. It helps me feel much more at ease.',
      'I appreciate your caring bedside manner.'
    ]
  };
}

/**
 * Natural Language Keyword Dictionaries for Clinical History Intent Matching
 */
const INTENT_KEYWORD_PATTERNS: Record<HistoryDimension, { strong: RegExp[]; moderate: RegExp[] }> = {
  ONSET_TIMING: {
    strong: [
      /\b(when|since when|how long|duration|start|started|begin|began|came on|timing|chronology)\b/i,
      /\b(sudden|gradual|constant|intermittent|wax|wane|frequency)\b/i
    ],
    moderate: [/\b(days?|hours?|weeks?|morning|night)\b/i]
  },
  LOCATION_RADIATION: {
    strong: [
      /\b(where|radiat|spread|shoot|travel|point to|which side|site of)\b/i,
      /\b(jaw|neck|arm|shoulder|back|flank|groin|wrist|knuckle|ear)\b/i
    ],
    moderate: [/\b(location|chest|belly|stomach|knee|joint)\b/i]
  },
  CHARACTER_SEVERITY: {
    strong: [
      /\b(scale|rate|1 to 10|1-10|how severe|severity|how bad|crush|squeeze|sharp|dull|throb|stab|burning|feel like|quality)\b/i,
      /\b(tight band|heavy weight|unbearable|intensity)\b/i
    ],
    moderate: [/\b(ache|aching|heavy|tight|mild|moderate)\b/i]
  },
  AGGRAVATING_RELIEVING: {
    strong: [
      /\b(aggravat|makes it worse|makes it better|reliev|what brings it on|trigger)\b/i,
      /\b(on exertion|climbing stairs|walking|at rest|with meals|deep breath|on breathing|lying flat|sitting up)\b/i
    ],
    moderate: [/\b(worse|better|rest|position|food|eat|movement)\b/i]
  },
  ASSOCIATED_SYMPTOMS: {
    strong: [
      /\b(short of breath|sob|breathless|dyspnea|sweat|sweaty|diaphor|nausea|vomit|lighthead|faint|palpitat|chills?|mouth ulcer|hair loss)\b/i,
      /\b(foamy urine|swollen gum|bad taste|photosensitiv)\b/i
    ],
    moderate: [/\b(dizzy|fatigue|tired|fever|cough|rash|swelling|edema|puffy)\b/i]
  },
  PAST_HISTORY: {
    strong: [
      /\b(past medical|pmh|pmhx|ever had|prior|previous|diagnos|chronic condition)\b/i,
      /\b(high bp|blood pressure|hypertension|diabetes|sugar disease|heart attack|myocardial|stroke|asthma|surgery|hospitaliz)\b/i
    ],
    moderate: [/\b(past|history|before|cholesterol|stone)\b/i]
  },
  MEDS_ALLERGIES: {
    strong: [
      /\b(medication|medicine|prescription|pills?|tablets?|drug|dose|over the counter|otc|blood thinner|antibiotic)\b/i,
      /\b(allerg|penicillin|sulfa|adverse reaction|hives)\b/i
    ],
    moderate: [/\b(aspirin|metformin|telmisartan|paracetamol|ibuprofen|taking anything|what meds)\b/i]
  },
  SOCIAL_FAMILY: {
    strong: [
      /\b(smoke|smoking|tobacco|cigarette|cigar|vape|pack[- ]years?|alcohol|drink|liquor|beer|wine)\b/i,
      /\b(family history|fhx|runs in the family|father|mother|brother|sister|parents|early heart attack)\b/i
    ],
    moderate: [/\b(occupation|job|work|stress|lifestyle|live with)\b/i]
  },
  EMPATHY_RAPPORT: {
    strong: [
      /\b(sorry|take good care|here to help|in good hands|don't worry|my name is|i am dr|dr\.)\b/i,
      /\b(understand how hard|reassur|we will find out|you are safe)\b/i
    ],
    moderate: [/\b(comfort|deep breath|take it easy)\b/i]
  }
};

const MEDICAL_JARGON_PATTERNS = [
  /\b(acute coronary syndrome|myocardial infarction|troponin|st-elevation|percutaneous coronary intervention|diaphoresis|dyspnea|orthopnea|paroxysmal nocturnal|systemic lupus erythematosus|antinuclear antibody|nephritic|endocarditis|cholelithiasis|ischemic)\b/i
];

/**
 * Natural Language Query Parser for Simulated Patient Bedside Interview
 */
export function parseCandidateQuery(
  query: string,
  persona: PatientPersona
): ParsedCandidateTurn {
  const trimmed = query.trim();
  if (!trimmed) {
    return {
      response: '... *patient looks at you attentively waiting for your question*',
      isEmpathy: false,
      isJargonWarning: false,
      detectedEmotion: 'neutral'
    };
  }

  // 1. Check for incomprehensible medical jargon
  const hasJargon = MEDICAL_JARGON_PATTERNS.some(p => p.test(trimmed));
  if (hasJargon && !trimmed.toLowerCase().includes('what is') && trimmed.split(' ').length < 8) {
    const jargonResp = persona.jargonResponses[Math.floor(Math.random() * persona.jargonResponses.length)] ||
      'I don\'t know what those medical terms mean doctor, can you explain simply?';
    return {
      response: jargonResp,
      isEmpathy: false,
      isJargonWarning: true,
      detectedEmotion: 'confused'
    };
  }

  // 2. Check for Empathy & Rapport statements
  const empathyStrong = INTENT_KEYWORD_PATTERNS.EMPATHY_RAPPORT.strong.some(p => p.test(trimmed));
  if (empathyStrong) {
    const empathyResp = persona.empathyResponses[Math.floor(Math.random() * persona.empathyResponses.length)] ||
      'Thank you doctor, your reassuring words mean a lot.';
    return {
      response: empathyResp,
      matchedDimension: 'EMPATHY_RAPPORT',
      isEmpathy: true,
      isJargonWarning: false,
      detectedEmotion: 'reassured'
    };
  }

  // 3. Compute weighted match scores across all dimensions
  const dimensionsToScore: HistoryDimension[] = [
    'ONSET_TIMING',
    'LOCATION_RADIATION',
    'CHARACTER_SEVERITY',
    'AGGRAVATING_RELIEVING',
    'ASSOCIATED_SYMPTOMS',
    'PAST_HISTORY',
    'MEDS_ALLERGIES',
    'SOCIAL_FAMILY'
  ];

  let bestDimension: HistoryDimension | undefined = undefined;
  let highestScore = 0;

  for (const dim of dimensionsToScore) {
    let score = 0;
    const { strong, moderate } = INTENT_KEYWORD_PATTERNS[dim];
    strong.forEach(p => {
      if (p.test(trimmed)) score += 5;
    });
    moderate.forEach(p => {
      if (p.test(trimmed)) score += 1;
    });

    if (score > highestScore) {
      highestScore = score;
      bestDimension = dim;
    }
  }

  if (bestDimension && highestScore >= 2) {
    const candidates = persona.intents[bestDimension] || [];
    const resp = candidates[Math.floor(Math.random() * candidates.length)] ||
      'Yes doctor, that is related to my symptoms.';
    return {
      response: resp,
      matchedDimension: bestDimension,
      isEmpathy: false,
      isJargonWarning: false,
      detectedEmotion: bestDimension === 'CHARACTER_SEVERITY' || bestDimension === 'LOCATION_RADIATION' ? 'pain' : 'neutral'
    };
  }

  // 4. Fallback contextual response
  const fallbackResp = persona.fallbackResponses[Math.floor(Math.random() * persona.fallbackResponses.length)] ||
    'I am not quite sure about that doctor, but the main issue is how unwell I feel.';

  return {
    response: fallbackResp,
    isEmpathy: false,
    isJargonWarning: false,
    detectedEmotion: 'neutral'
  };
}

/**
 * Compute candidate history-taking coverage score and identify omissions
 */
export function computeHistoryCoverage(coveredSet: Set<HistoryDimension>): HistoryCoverageReport {
  // We evaluate across 8 core clinical dimensions (excluding empathy which is bonus)
  const coreDimensions: HistoryDimension[] = [
    'ONSET_TIMING',
    'LOCATION_RADIATION',
    'CHARACTER_SEVERITY',
    'AGGRAVATING_RELIEVING',
    'ASSOCIATED_SYMPTOMS',
    'PAST_HISTORY',
    'MEDS_ALLERGIES',
    'SOCIAL_FAMILY'
  ];

  const coveredCore = coreDimensions.filter(d => coveredSet.has(d));
  const missingDimensions = coreDimensions.filter(d => !coveredSet.has(d));

  let scorePercentage = Math.round((coveredCore.length / coreDimensions.length) * 100);

  // Bonus 5% for empathy
  if (coveredSet.has('EMPATHY_RAPPORT') && scorePercentage < 100) {
    scorePercentage = Math.min(100, scorePercentage + 5);
  }

  const feedback: string[] = [];
  if (missingDimensions.length === 0) {
    feedback.push('Outstanding history-taking! You comprehensively explored all 8 essential SOCRATES / OLD CARTS dimensions.');
  } else {
    feedback.push(`You explored ${coveredCore.length} of 8 core history domains.`);
    if (missingDimensions.includes('MEDS_ALLERGIES')) {
      feedback.push('Remember to always query current medications and drug allergies before prescribing.');
    }
    if (missingDimensions.includes('SOCIAL_FAMILY')) {
      feedback.push('Inquire about smoking, occupational exposures, and premature family history.');
    }
    if (missingDimensions.includes('AGGRAVATING_RELIEVING')) {
      feedback.push('Explore what alleviates or exacerbates the symptom (exertion, rest, meals, position).');
    }
  }

  return {
    scorePercentage,
    coveredDimensions: Array.from(coveredSet),
    missingDimensions,
    feedback
  };
}
