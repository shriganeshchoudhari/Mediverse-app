export interface PanchakarmaTherapy {
  id: string;
  name: string;
  sanskritName: string;
  category: 'pradhana' | 'purva' | 'paschat';
  doshaTarget: 'Vata' | 'Pitta' | 'Kapha' | 'Tridosha';
  indications: string[];
  contraindications: string[];
  procedureSteps: string[];
  snehanaDays: number;
  samyakLakshana: string[];
  ayogaLakshana: string[];
  atiyogaLakshana: string[];
  emergencyProtocol: string;
}

export const PANCHAKARMA_THERAPIES: PanchakarmaTherapy[] = [
  {
    id: 'pk_vamana',
    name: 'Therapeutic Emesis',
    sanskritName: 'Vamana',
    category: 'pradhana',
    doshaTarget: 'Kapha',
    indications: ['Bronchial asthma', 'Chronic cough', 'Psoriasis', 'Acne', 'Obesity', 'Hyperacidity', 'Diabetes'],
    contraindications: ['Pregnancy', 'Heart disease', 'Extreme weakness', 'Children', 'Elderly', 'Acute fever'],
    procedureSteps: [
      'Purvakarma: Snehana (internal oleation) for 3-7 days until samyak snigdha lakshana appear',
      'Abhyanga and Swedana (massage and steam) on the day before and morning of Vamana',
      'Diet: Kapha-aggravating diet (e.g., yogurt, fish) the night before',
      'Pradhana Karma: Administration of Vamaka dravya (e.g., Madanaphala, Vacha, Yashtimadhu) in the early morning (Kapha kala)',
      'Observation of Vegas (bouts of vomiting) - Antiki (bile appearance indicates end)',
      'Paschat Karma: Samsarjana krama (special dietary regimen) for 3-7 days depending on Shuddhi'
    ],
    snehanaDays: 7,
    samyakLakshana: ['Expulsion of Kapha followed by Pitta (bile)', 'Feeling of lightness in chest', 'Clear voice', 'Absence of nausea post-procedure'],
    ayogaLakshana: ['Incomplete vomiting', 'Severe nausea', 'Heaviness in chest', 'Itching', 'Fever'],
    atiyogaLakshana: ['Appearance of blood', 'Severe weakness', 'Giddiness', 'Hoarseness of voice', 'Throat pain'],
    emergencyProtocol: 'Administer anti-emetics if atiyoga occurs. Treat with cold therapies, reassure patient, provide hydration, give symptomatic treatment for throat irritation.'
  },
  {
    id: 'pk_virechana',
    name: 'Therapeutic Purgation',
    sanskritName: 'Virechana',
    category: 'pradhana',
    doshaTarget: 'Pitta',
    indications: ['Skin diseases', 'Jaundice', 'Hyperacidity', 'Gout', 'Hemorrhoids', 'Chronic fever', 'Liver disorders'],
    contraindications: ['Pregnancy', 'Diarrhea', 'Bleeding from lower GI tract', 'Prolapse of rectum', 'Extreme weakness'],
    procedureSteps: [
      'Purvakarma: Internal Snehana for 3-7 days',
      'Rest period of 3 days with Abhyanga and Swedana',
      'Diet: Light, warm, Pitta-aggravating food',
      'Pradhana Karma: Administration of Virechana dravya (e.g., Trivrit, Castor oil, Aragvadha) in the morning',
      'Observation of Vegas - Antiki (appearance of mucus/kapha indicates end)',
      'Paschat Karma: Samsarjana krama'
    ],
    snehanaDays: 7,
    samyakLakshana: ['Cleansing of bowels ending with mucus', 'Feeling of lightness', 'Improved appetite', 'Clarity of mind'],
    ayogaLakshana: ['Constipation', 'Heaviness', 'Nausea', 'Skin eruptions', 'Anorexia'],
    atiyogaLakshana: ['Severe diarrhea', 'Blood in stools', 'Prolapse of rectum', 'Dehydration', 'Muscle cramps'],
    emergencyProtocol: 'Treat severe diarrhea with Pichha Basti. Provide ORS and IV fluids if dehydrated. Stambhana (astringent) herbs.'
  },
  {
    id: 'pk_anuvasana_basti',
    name: 'Oil Enema',
    sanskritName: 'Anuvasana Basti',
    category: 'pradhana',
    doshaTarget: 'Vata',
    indications: ['Constipation', 'Neurological disorders', 'Arthritis', 'Paralysis', 'Sciatica'],
    contraindications: ['Indigestion', 'Fever', 'Diarrhea', 'Obesity', 'Anemia'],
    procedureSteps: [
      'Purvakarma: Abhyanga and Swedana locally on abdomen and lower back',
      'Should be administered after food',
      'Pradhana Karma: Administration of medicated oil/ghee (e.g., Mahanarayana Taila) via rectum',
      'Patient lies on left side',
      'Paschat Karma: Gentle massage of soles and palms'
    ],
    snehanaDays: 0,
    samyakLakshana: ['Return of oil with feces', 'Feeling of lightness', 'Relief in pain', 'Good sleep'],
    ayogaLakshana: ['Retention of oil', 'Pain in abdomen', 'Constipation', 'Heaviness'],
    atiyogaLakshana: ['Nausea', 'Loss of appetite', 'Lethargy'],
    emergencyProtocol: 'If oil is retained for long, administer Niruha Basti or suppository to expel it. Fasting.'
  },
  {
    id: 'pk_niruha_basti',
    name: 'Decoction Enema',
    sanskritName: 'Niruha Basti (Kashaya Basti)',
    category: 'pradhana',
    doshaTarget: 'Vata',
    indications: ['Rheumatoid arthritis', 'Sciatica', 'Gout', 'Neurological disorders', 'Lower back ache'],
    contraindications: ['Immediately after food', 'Extreme weakness', 'Hemorrhoids (bleeding)', 'Severe ascites', 'Pregnancy'],
    procedureSteps: [
      'Purvakarma: Local Abhyanga and Swedana',
      'Administered on an empty stomach',
      'Preparation of Basti dravya combining honey, rock salt, oil, paste (kalka), and decoction (kashaya) in specific order',
      'Pradhana Karma: Administration via rectum',
      'Paschat Karma: Warm bath, light meal when hungry'
    ],
    snehanaDays: 0,
    samyakLakshana: ['Proper elimination of feces, urine, and flatus', 'Feeling of lightness', 'Relief from disease symptoms'],
    ayogaLakshana: ['Pain in abdomen', 'Retention of gas/feces', 'Headache'],
    atiyogaLakshana: ['Severe diarrhea', 'Blood in stools', 'Fainting', 'Hiccups'],
    emergencyProtocol: 'Manage complications based on symptoms. For severe diarrhea, use Anuvasana Basti with astringent oils.'
  },
  {
    id: 'pk_nasya',
    name: 'Nasal Administration',
    sanskritName: 'Nasya',
    category: 'pradhana',
    doshaTarget: 'Tridosha',
    indications: ['Sinusitis', 'Migraine', 'Facial paralysis', 'Cervical spondylosis', 'Hair fall', 'Premature graying'],
    contraindications: ['Acute fever', 'Indigestion', 'Pregnancy', 'Immediately after drinking alcohol or water'],
    procedureSteps: [
      'Purvakarma: Facial massage and steam',
      'Pradhana Karma: Administration of medicated oil/ghee or powder into nostrils while patient is supine with head slightly tilted back',
      'Inhalation and gentle massage of forehead, nose, and cheeks',
      'Paschat Karma: Gargling with warm water, avoid exposure to cold air or dust'
    ],
    snehanaDays: 0,
    samyakLakshana: ['Lightness of head', 'Clear breathing', 'Good sleep', 'Clarity of senses'],
    ayogaLakshana: ['Dryness of nose/mouth', 'Heaviness in head', 'Itching'],
    atiyogaLakshana: ['Excessive salivation', 'Heaviness in head', 'Pain in eyes/ears'],
    emergencyProtocol: 'Manage symptoms, provide dry fomentation to head. Avoid cold exposures.'
  },
  {
    id: 'pk_raktamokshana',
    name: 'Blood Letting Therapy',
    sanskritName: 'Raktamokshana',
    category: 'pradhana',
    doshaTarget: 'Pitta',
    indications: ['Skin diseases (Eczema, Psoriasis)', 'Gout', 'Abscesses', 'Varicose veins', 'Alopecia'],
    contraindications: ['Anemia', 'Edema', 'Pregnancy', 'Bleeding disorders', 'Extreme weakness'],
    procedureSteps: [
      'Selection of method: Jalauka (Leeches), Siravedha (Venesection), Pracchana (Scarification), Alabu, or Shrunga',
      'Purvakarma: Local oleation and fomentation (except for Pitta dominant conditions)',
      'Pradhana Karma: Application of method to remove vitiated blood',
      'Paschat Karma: Hemostasis using pressure, astringent powders (e.g., Turmeric), bandaging',
      'Diet: Light, cooling diet'
    ],
    snehanaDays: 0,
    samyakLakshana: ['Relief in pain', 'Reduction in redness and swelling', 'Feeling of lightness'],
    ayogaLakshana: ['Increase in swelling', 'Pain', 'Redness'],
    atiyogaLakshana: ['Severe weakness', 'Giddiness', 'Headache', 'Blindness (temporary)'],
    emergencyProtocol: 'Immediate hemostasis. Treat hypovolemic shock if occurs. Give cold, sweet, nourishing drinks.'
  },
  {
    id: 'pk_abhyanga',
    name: 'Therapeutic Massage',
    sanskritName: 'Abhyanga & Swedana',
    category: 'purva',
    doshaTarget: 'Vata',
    indications: ['Fatigue', 'Vata disorders', 'Muscle stiffness', 'Dry skin', 'Stress'],
    contraindications: ['Fever', 'Indigestion', 'Extreme Kapha aggravation', 'Acute inflammation'],
    procedureSteps: [
      'Selection of appropriate medicated oil based on Dosha',
      'Warming the oil',
      'Systematic massage over the whole body in the direction of body hair (Anuloma)',
      'Followed by Swedana (sudation/steam therapy)'
    ],
    snehanaDays: 0,
    samyakLakshana: ['Relaxation', 'Soft skin', 'Sweating (post-Swedana)', 'Relief from stiffness'],
    ayogaLakshana: ['No sweating', 'Continued stiffness', 'Dryness'],
    atiyogaLakshana: ['Excessive sweating', 'Fainting', 'Thirst', 'Skin rash'],
    emergencyProtocol: 'Stop Swedana immediately if atiyoga occurs. Provide cool air, hydration, and rest.'
  },
  {
    id: 'pk_shirodhara',
    name: 'Oil Pouring on Forehead',
    sanskritName: 'Shirodhara',
    category: 'purva',
    doshaTarget: 'Vata',
    indications: ['Insomnia', 'Anxiety', 'Depression', 'Hypertension', 'Stress', 'Headaches'],
    contraindications: ['Brain tumor', 'Recent head injury', 'Fever', 'Acute illness'],
    procedureSteps: [
      'Patient lies supine on the Dhara table',
      'Eyes covered with cotton pads',
      'Continuous pouring of warm medicated liquid (oil, milk, or buttermilk) over the forehead (Ajna chakra) from a specific height in a rhythmic pendular motion',
      'Usually performed for 30-45 minutes',
      'Paschat Karma: Head wash, rest'
    ],
    snehanaDays: 0,
    samyakLakshana: ['Deep relaxation', 'Sleep induction during procedure', 'Mental clarity', 'Lowered blood pressure'],
    ayogaLakshana: ['Lack of relaxation', 'Discomfort'],
    atiyogaLakshana: ['Heaviness in head', 'Cold', 'Lethargy'],
    emergencyProtocol: 'Stop procedure. Provide rest and symptomatic treatment.'
  }
];

export const SAMSARJANA_KRAMA_SCHEDULE: Array<{ mealNumber: number; foodItem: string; consistency: string; agniStimulationStage: string }> = [
  {
    mealNumber: 1,
    foodItem: 'Peya (Thin Rice Gruel)',
    consistency: 'Mostly liquid, very little solid',
    agniStimulationStage: 'Gentle awakening of weak digestive fire'
  },
  {
    mealNumber: 2,
    foodItem: 'Peya (Thin Rice Gruel)',
    consistency: 'Mostly liquid, very little solid',
    agniStimulationStage: 'Maintaining gentle digestion'
  },
  {
    mealNumber: 3,
    foodItem: 'Vilepi (Thick Rice Gruel)',
    consistency: 'Thick paste-like, more solid than liquid',
    agniStimulationStage: 'Slightly increasing workload on Agni'
  },
  {
    mealNumber: 4,
    foodItem: 'Vilepi (Thick Rice Gruel)',
    consistency: 'Thick paste-like',
    agniStimulationStage: 'Stabilizing digestive capacity'
  },
  {
    mealNumber: 5,
    foodItem: 'Akrita Yusha (Unspiced Lentil Soup)',
    consistency: 'Liquid soup without spices/fats',
    agniStimulationStage: 'Introducing plant proteins'
  },
  {
    mealNumber: 6,
    foodItem: 'Krita Yusha (Spiced Lentil Soup)',
    consistency: 'Liquid soup with ghee and spices (jeera, ginger)',
    agniStimulationStage: 'Stimulating Agni with spices and fats'
  },
  {
    mealNumber: 7,
    foodItem: 'Akrita Mamsarasa (Unspiced Meat Soup) OR Odana with Yusha',
    consistency: 'Broth or solid rice with soup',
    agniStimulationStage: 'Introducing complex proteins (for non-vegetarians) or full meal'
  },
  {
    mealNumber: 8,
    foodItem: 'Krita Mamsarasa (Spiced Meat Soup) OR Normal Diet',
    consistency: 'Spiced broth or normal solid food',
    agniStimulationStage: 'Return to normal digestive capacity'
  }
];

export function getPanchakarmaById(id: string): PanchakarmaTherapy | undefined {
  return PANCHAKARMA_THERAPIES.find(therapy => therapy.id === id);
}
