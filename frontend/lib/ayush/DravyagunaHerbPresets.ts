export interface AyurvedicHerb {
  id: string;
  botanicalName: string;
  sanskritName: string;
  commonName: string;
  family: string;
  partUsed: string;
  rasa: string[];
  guna: string[];
  virya: 'Ushna' | 'Sheeta' | 'Anushnasheeta (Not too hot)' | string;
  vipaka: 'Madhura' | 'Amla' | 'Katu' | string;
  prabhava: string;
  doshaAction: string;
  activePhytochemicals: string[];
  indications: string[];
  therapeuticDosage: string;
  cypInteractions: string[];
  allopathicDrugPrecautions: Array<{
    drugClass: string;
    potentialRisk: string;
    severity: 'high' | 'moderate' | 'low';
  }>;
}

export const DRAVYAGUNA_HERBS: AyurvedicHerb[] = [
  {
    id: 'herb_ashwagandha',
    botanicalName: 'Withania somnifera',
    sanskritName: 'Ashwagandha',
    commonName: 'Indian Ginseng',
    family: 'Solanaceae',
    partUsed: 'Root',
    rasa: ['Tikta (Bitter)', 'Kashaya (Astringent)', 'Madhura (Sweet)'],
    guna: ['Laghu (Light)', 'Snigdha (Unctuous)'],
    virya: 'Ushna',
    vipaka: 'Madhura',
    prabhava: 'Rasayana (Rejuvenative), Balya (Strength promoting)',
    doshaAction: 'Pacifies Vata and Kapha',
    activePhytochemicals: ['Withanolides', 'Withaferin A', 'Alkaloids (somniferine)'],
    indications: ['Stress', 'Anxiety', 'Fatigue', 'Insomnia', 'Male infertility', 'Joint pain'],
    therapeuticDosage: '3-6 grams of root powder per day',
    cypInteractions: ['CYP3A4 (mild induction)'],
    allopathicDrugPrecautions: [
      { drugClass: 'Sedatives (Benzodiazepines)', potentialRisk: 'Enhanced sedative effect', severity: 'moderate' },
      { drugClass: 'Immunosuppressants', potentialRisk: 'May counteract due to immunostimulant properties', severity: 'high' },
      { drugClass: 'Thyroid hormones', potentialRisk: 'May increase thyroid hormone levels', severity: 'moderate' }
    ]
  },
  {
    id: 'herb_haridra',
    botanicalName: 'Curcuma longa',
    sanskritName: 'Haridra',
    commonName: 'Turmeric',
    family: 'Zingiberaceae',
    partUsed: 'Rhizome',
    rasa: ['Tikta (Bitter)', 'Katu (Pungent)'],
    guna: ['Ruksha (Dry)', 'Laghu (Light)'],
    virya: 'Ushna',
    vipaka: 'Katu',
    prabhava: 'Vishaghna (Anti-toxic), Kushthaghna (Anti-dermatosis)',
    doshaAction: 'Tridosha shamaka (Balances all three doshas)',
    activePhytochemicals: ['Curcumin', 'Demethoxycurcumin', 'Turmerones'],
    indications: ['Inflammation', 'Arthritis', 'Skin disorders', 'Diabetes', 'Wounds', 'Allergies'],
    therapeuticDosage: '1-3 grams of powder per day',
    cypInteractions: ['CYP1A2 (inhibition)', 'CYP3A4 (inhibition)'],
    allopathicDrugPrecautions: [
      { drugClass: 'Anticoagulants / Antiplatelets', potentialRisk: 'Increased risk of bleeding', severity: 'high' },
      { drugClass: 'Antidiabetic drugs', potentialRisk: 'Risk of hypoglycemia', severity: 'moderate' }
    ]
  },
  {
    id: 'herb_brahmi',
    botanicalName: 'Bacopa monnieri',
    sanskritName: 'Brahmi',
    commonName: 'Water Hyssop',
    family: 'Plantaginaceae',
    partUsed: 'Whole plant',
    rasa: ['Tikta (Bitter)', 'Kashaya (Astringent)'],
    guna: ['Laghu (Light)'],
    virya: 'Sheeta',
    vipaka: 'Madhura',
    prabhava: 'Medhya (Nootropic / Brain tonic)',
    doshaAction: 'Pacifies Pitta and Kapha',
    activePhytochemicals: ['Bacosides (A and B)', 'Alkaloids (brahmine)'],
    indications: ['Cognitive impairment', 'Poor memory', 'Anxiety', 'ADHD', 'Epilepsy'],
    therapeuticDosage: '1-3 grams of powder per day',
    cypInteractions: ['CYP1A2 (mild inhibition)', 'CYP3A4 (mild inhibition)'],
    allopathicDrugPrecautions: [
      { drugClass: 'Acetylcholinesterase inhibitors', potentialRisk: 'Additive cholinergic effects', severity: 'moderate' },
      { drugClass: 'Sedatives', potentialRisk: 'Enhanced sedation', severity: 'low' }
    ]
  },
  {
    id: 'herb_guduchi',
    botanicalName: 'Tinospora cordifolia',
    sanskritName: 'Guduchi',
    commonName: 'Heart-leaved moonseed',
    family: 'Menispermaceae',
    partUsed: 'Stem',
    rasa: ['Tikta (Bitter)', 'Kashaya (Astringent)', 'Katu (Pungent)'],
    guna: ['Guru (Heavy)', 'Snigdha (Unctuous)'],
    virya: 'Ushna',
    vipaka: 'Madhura',
    prabhava: 'Jwaraghna (Antipyretic), Rasayana (Rejuvenative)',
    doshaAction: 'Tridosha shamaka',
    activePhytochemicals: ['Tinosporine', 'Berberine', 'Giloin'],
    indications: ['Fever', 'Immune deficiency', 'Gout', 'Diabetes', 'Liver disorders'],
    therapeuticDosage: '3-6 grams of powder per day',
    cypInteractions: [],
    allopathicDrugPrecautions: [
      { drugClass: 'Immunosuppressants', potentialRisk: 'Decreased efficacy of immunosuppressants', severity: 'high' },
      { drugClass: 'Antidiabetic drugs', potentialRisk: 'Hypoglycemia risk', severity: 'moderate' }
    ]
  },
  {
    id: 'herb_shatavari',
    botanicalName: 'Asparagus racemosus',
    sanskritName: 'Shatavari',
    commonName: 'Wild Asparagus',
    family: 'Asparagaceae',
    partUsed: 'Root',
    rasa: ['Madhura (Sweet)', 'Tikta (Bitter)'],
    guna: ['Guru (Heavy)', 'Snigdha (Unctuous)'],
    virya: 'Sheeta',
    vipaka: 'Madhura',
    prabhava: 'Vajikarana (Aphrodisiac), Stanyajanana (Galactagogue)',
    doshaAction: 'Pacifies Vata and Pitta',
    activePhytochemicals: ['Shatavarins (Steroidal saponins)'],
    indications: ['Menopausal symptoms', 'Peptic ulcers', 'Low breast milk supply', 'Infertility'],
    therapeuticDosage: '3-6 grams of powder per day',
    cypInteractions: [],
    allopathicDrugPrecautions: [
      { drugClass: 'Diuretics', potentialRisk: 'Additive diuretic effect', severity: 'low' },
      { drugClass: 'Hormone replacement therapy', potentialRisk: 'Phytoestrogenic effects may interfere', severity: 'moderate' }
    ]
  },
  {
    id: 'herb_tulsi',
    botanicalName: 'Ocimum sanctum',
    sanskritName: 'Tulasi / Tulsi',
    commonName: 'Holy Basil',
    family: 'Lamiaceae',
    partUsed: 'Leaves',
    rasa: ['Katu (Pungent)', 'Tikta (Bitter)'],
    guna: ['Laghu (Light)', 'Ruksha (Dry)', 'Tikshna (Sharp)'],
    virya: 'Ushna',
    vipaka: 'Katu',
    prabhava: 'Krimighna (Antimicrobial), Kasahara (Cough suppressant)',
    doshaAction: 'Pacifies Vata and Kapha',
    activePhytochemicals: ['Eugenol', 'Ursolic acid', 'Rosmarinic acid'],
    indications: ['Cough', 'Asthma', 'Fever', 'Stress', 'Immunodeficiency'],
    therapeuticDosage: '1-3 grams of powder per day',
    cypInteractions: ['CYP2B6 (induction)'],
    allopathicDrugPrecautions: [
      { drugClass: 'Anticoagulants', potentialRisk: 'Increased bleeding risk', severity: 'moderate' },
      { drugClass: 'Antidiabetics', potentialRisk: 'Hypoglycemia', severity: 'moderate' }
    ]
  },
  {
    id: 'herb_guggulu',
    botanicalName: 'Commiphora mukul',
    sanskritName: 'Guggulu',
    commonName: 'Indian Bdellium',
    family: 'Burseraceae',
    partUsed: 'Resin',
    rasa: ['Tikta (Bitter)', 'Katu (Pungent)', 'Kashaya (Astringent)'],
    guna: ['Laghu (Light)', 'Ruksha (Dry)', 'Tikshna (Sharp)'],
    virya: 'Ushna',
    vipaka: 'Katu',
    prabhava: 'Medohara (Anti-obesity/Lipid-lowering), Vatahara (Anti-inflammatory)',
    doshaAction: 'Pacifies Vata and Kapha',
    activePhytochemicals: ['Guggulsterones (E and Z)', 'Guggulsterols'],
    indications: ['Hyperlipidemia', 'Obesity', 'Rheumatoid arthritis', 'Osteoarthritis', 'Acne'],
    therapeuticDosage: '2-4 grams of purified resin per day',
    cypInteractions: ['CYP3A4 (induction)'],
    allopathicDrugPrecautions: [
      { drugClass: 'Statins', potentialRisk: 'Altered metabolism of statins via CYP3A4', severity: 'high' },
      { drugClass: 'Beta-blockers (Propranolol)', potentialRisk: 'Decreased absorption of the drug', severity: 'moderate' },
      { drugClass: 'Thyroid hormones', potentialRisk: 'Increased thyroid function', severity: 'moderate' }
    ]
  },
  {
    id: 'herb_amalaki',
    botanicalName: 'Phyllanthus emblica',
    sanskritName: 'Amalaki',
    commonName: 'Indian Gooseberry / Amla',
    family: 'Phyllanthaceae',
    partUsed: 'Fruit',
    rasa: ['Amla (Sour)', 'Madhura (Sweet)', 'Tikta (Bitter)', 'Kashaya (Astringent)', 'Katu (Pungent)'],
    guna: ['Guru (Heavy)', 'Sheeta (Cooling)'],
    virya: 'Sheeta',
    vipaka: 'Madhura',
    prabhava: 'Vayasthapana (Anti-aging/Rejuvenative)',
    doshaAction: 'Tridosha shamaka, especially Pitta',
    activePhytochemicals: ['Vitamin C (Ascorbic acid)', 'Tannins', 'Gallic acid', 'Ellagic acid'],
    indications: ['Hyperacidity', 'Peptic ulcer', 'Diabetes', 'Hair fall', 'Eye disorders', 'Immunodeficiency'],
    therapeuticDosage: '3-6 grams of powder per day',
    cypInteractions: [],
    allopathicDrugPrecautions: [
      { drugClass: 'Antidiabetics', potentialRisk: 'Hypoglycemia', severity: 'moderate' },
      { drugClass: 'Anticoagulants', potentialRisk: 'May prolong bleeding time', severity: 'low' }
    ]
  },
  {
    id: 'herb_neem',
    botanicalName: 'Azadirachta indica',
    sanskritName: 'Nimba / Neem',
    commonName: 'Neem',
    family: 'Meliaceae',
    partUsed: 'Leaves, Bark, Seed oil',
    rasa: ['Tikta (Bitter)', 'Kashaya (Astringent)'],
    guna: ['Laghu (Light)', 'Ruksha (Dry)'],
    virya: 'Sheeta',
    vipaka: 'Katu',
    prabhava: 'Kandughna (Anti-pruritic), Krimighna (Antimicrobial)',
    doshaAction: 'Pacifies Pitta and Kapha',
    activePhytochemicals: ['Azadirachtin', 'Nimbin', 'Nimbidin'],
    indications: ['Skin diseases', 'Acne', 'Wounds', 'Intestinal worms', 'Fever', 'Diabetes'],
    therapeuticDosage: '1-3 grams of leaf powder per day',
    cypInteractions: [],
    allopathicDrugPrecautions: [
      { drugClass: 'Immunosuppressants', potentialRisk: 'Immune stimulation', severity: 'moderate' },
      { drugClass: 'Antidiabetics', potentialRisk: 'Severe hypoglycemia risk', severity: 'high' }
    ]
  },
  {
    id: 'herb_yashtimadhu',
    botanicalName: 'Glycyrrhiza glabra',
    sanskritName: 'Yashtimadhu',
    commonName: 'Licorice',
    family: 'Fabaceae',
    partUsed: 'Root',
    rasa: ['Madhura (Sweet)'],
    guna: ['Guru (Heavy)', 'Snigdha (Unctuous)'],
    virya: 'Sheeta',
    vipaka: 'Madhura',
    prabhava: 'Kanthya (Throat soothing), Vranaropana (Wound healing)',
    doshaAction: 'Pacifies Vata and Pitta',
    activePhytochemicals: ['Glycyrrhizin', 'Glabridin', 'Liquiritin'],
    indications: ['Sore throat', 'Peptic ulcers', 'Cough', 'Asthma', 'Hyperacidity', 'Adrenal fatigue'],
    therapeuticDosage: '1-3 grams of powder per day',
    cypInteractions: ['CYP3A4 (induction)'],
    allopathicDrugPrecautions: [
      { drugClass: 'Corticosteroids', potentialRisk: 'Prolongs effect of cortisol (inhibits 11-beta-HSD)', severity: 'high' },
      { drugClass: 'Diuretics (Potassium-depleting)', potentialRisk: 'Hypokalemia and hypertension', severity: 'high' },
      { drugClass: 'Antihypertensives', potentialRisk: 'May antagonize effects (causes pseudoaldosteronism)', severity: 'high' }
    ]
  },
  {
    id: 'herb_shankhpushpi',
    botanicalName: 'Convolvulus prostratus',
    sanskritName: 'Shankhpushpi',
    commonName: 'Shankhpushpi',
    family: 'Convolvulaceae',
    partUsed: 'Whole plant',
    rasa: ['Tikta (Bitter)', 'Katu (Pungent)', 'Kashaya (Astringent)'],
    guna: ['Snigdha (Unctuous)', 'Picchila (Slimy)'],
    virya: 'Sheeta',
    vipaka: 'Madhura',
    prabhava: 'Medhya (Nootropic)',
    doshaAction: 'Tridosha shamaka',
    activePhytochemicals: ['Shankhpushpine', 'Convolvine'],
    indications: ['Mental fatigue', 'Insomnia', 'Anxiety', 'Hypertension', 'Memory loss'],
    therapeuticDosage: '3-6 grams of powder per day',
    cypInteractions: [],
    allopathicDrugPrecautions: [
      { drugClass: 'Sedatives', potentialRisk: 'Additive sedation', severity: 'moderate' },
      { drugClass: 'Antiepileptics', potentialRisk: 'May alter drug levels', severity: 'moderate' }
    ]
  },
  {
    id: 'herb_arjuna',
    botanicalName: 'Terminalia arjuna',
    sanskritName: 'Arjuna',
    commonName: 'Arjuna Tree',
    family: 'Combretaceae',
    partUsed: 'Bark',
    rasa: ['Kashaya (Astringent)'],
    guna: ['Ruksha (Dry)', 'Laghu (Light)'],
    virya: 'Sheeta',
    vipaka: 'Katu',
    prabhava: 'Hrudya (Cardiotonic)',
    doshaAction: 'Pacifies Pitta and Kapha',
    activePhytochemicals: ['Arjunolic acid', 'Arjunin', 'Tannins', 'Flavonoids'],
    indications: ['Ischemic heart disease', 'Hypertension', 'Heart failure', 'Hyperlipidemia'],
    therapeuticDosage: '3-6 grams of bark powder per day',
    cypInteractions: [],
    allopathicDrugPrecautions: [
      { drugClass: 'Antihypertensives', potentialRisk: 'Hypotension', severity: 'moderate' },
      { drugClass: 'Digoxin (Cardiac Glycosides)', potentialRisk: 'Additive cardiotonic effect', severity: 'high' }
    ]
  },
  {
    id: 'herb_punarnava',
    botanicalName: 'Boerhavia diffusa',
    sanskritName: 'Punarnava',
    commonName: 'Spreading Hogweed',
    family: 'Nyctaginaceae',
    partUsed: 'Whole plant',
    rasa: ['Madhura (Sweet)', 'Tikta (Bitter)', 'Kashaya (Astringent)'],
    guna: ['Laghu (Light)', 'Ruksha (Dry)'],
    virya: 'Ushna',
    vipaka: 'Katu',
    prabhava: 'Mutrala (Diuretic), Shothahara (Anti-inflammatory/Anti-edema)',
    doshaAction: 'Tridosha shamaka, mainly Kapha',
    activePhytochemicals: ['Punarnavine', 'Boeravinone'],
    indications: ['Edema', 'Kidney disorders', 'Liver disorders', 'Urinary tract infections', 'Anemia'],
    therapeuticDosage: '3-6 grams of powder per day',
    cypInteractions: [],
    allopathicDrugPrecautions: [
      { drugClass: 'Diuretics', potentialRisk: 'Additive diuretic effect, risk of dehydration/electrolyte imbalance', severity: 'high' }
    ]
  },
  {
    id: 'herb_kutki',
    botanicalName: 'Picrorhiza kurroa',
    sanskritName: 'Katuki / Kutki',
    commonName: 'Hellebore',
    family: 'Plantaginaceae',
    partUsed: 'Rhizome/Root',
    rasa: ['Tikta (Bitter)'],
    guna: ['Laghu (Light)', 'Ruksha (Dry)'],
    virya: 'Sheeta',
    vipaka: 'Katu',
    prabhava: 'Bhedana (Purgative), Yakrut-uttejaka (Hepatoprotective)',
    doshaAction: 'Pacifies Pitta and Kapha',
    activePhytochemicals: ['Picrosides', 'Kutkoside'],
    indications: ['Jaundice', 'Liver cirrhosis', 'Fever', 'Asthma', 'Constipation'],
    therapeuticDosage: '0.5-2 grams of powder per day',
    cypInteractions: [],
    allopathicDrugPrecautions: [
      { drugClass: 'Immunosuppressants', potentialRisk: 'Immunostimulant action may counteract', severity: 'moderate' },
      { drugClass: 'Hepatotoxic drugs', potentialRisk: 'May alter drug metabolism', severity: 'moderate' }
    ]
  },
  {
    id: 'herb_bhringraj',
    botanicalName: 'Eclipta alba',
    sanskritName: 'Bhringaraja',
    commonName: 'False Daisy',
    family: 'Asteraceae',
    partUsed: 'Whole plant',
    rasa: ['Katu (Pungent)', 'Tikta (Bitter)'],
    guna: ['Ruksha (Dry)', 'Laghu (Light)'],
    virya: 'Ushna',
    vipaka: 'Katu',
    prabhava: 'Keshya (Hair tonic), Yakrut-rasayana (Liver rejuvenative)',
    doshaAction: 'Pacifies Vata and Kapha',
    activePhytochemicals: ['Wedelolactone', 'Eclalbasaponins'],
    indications: ['Hair fall', 'Premature graying', 'Liver disorders', 'Jaundice', 'Anemia'],
    therapeuticDosage: '1-3 grams of powder per day',
    cypInteractions: [],
    allopathicDrugPrecautions: [
      { drugClass: 'Antihypertensives', potentialRisk: 'May lower blood pressure further', severity: 'low' },
      { drugClass: 'Diuretics', potentialRisk: 'Mild additive diuretic effect', severity: 'low' }
    ]
  },
  {
    id: 'herb_vidanga',
    botanicalName: 'Embelia ribes',
    sanskritName: 'Vidanga',
    commonName: 'False Black Pepper',
    family: 'Primulaceae',
    partUsed: 'Fruit',
    rasa: ['Katu (Pungent)', 'Kashaya (Astringent)'],
    guna: ['Laghu (Light)', 'Ruksha (Dry)', 'Tikshna (Sharp)'],
    virya: 'Ushna',
    vipaka: 'Katu',
    prabhava: 'Krimighna (Anthelmintic)',
    doshaAction: 'Pacifies Vata and Kapha',
    activePhytochemicals: ['Embelin'],
    indications: ['Intestinal worms', 'Indigestion', 'Skin diseases', 'Obesity'],
    therapeuticDosage: '1-3 grams of powder per day',
    cypInteractions: [],
    allopathicDrugPrecautions: [
      { drugClass: 'None specific', potentialRisk: 'Generally safe, avoid in pregnancy', severity: 'low' }
    ]
  },
  {
    id: 'herb_manjistha',
    botanicalName: 'Rubia cordifolia',
    sanskritName: 'Manjistha',
    commonName: 'Indian Madder',
    family: 'Rubiaceae',
    partUsed: 'Root',
    rasa: ['Tikta (Bitter)', 'Kashaya (Astringent)', 'Madhura (Sweet)'],
    guna: ['Guru (Heavy)', 'Ruksha (Dry)'],
    virya: 'Ushna',
    vipaka: 'Katu',
    prabhava: 'Raktashodhaka (Blood purifier)',
    doshaAction: 'Pacifies Pitta and Kapha',
    activePhytochemicals: ['Purpurin', 'Munjistin', 'Alizarin'],
    indications: ['Skin diseases (Acne, Eczema)', 'Pigmentation', 'Gout', 'Urinary tract disorders', 'Wounds'],
    therapeuticDosage: '1-3 grams of powder per day',
    cypInteractions: [],
    allopathicDrugPrecautions: [
      { drugClass: 'Anticoagulants', potentialRisk: 'May increase bleeding risk', severity: 'moderate' }
    ]
  },
  {
    id: 'herb_pippali',
    botanicalName: 'Piper longum',
    sanskritName: 'Pippali',
    commonName: 'Long Pepper',
    family: 'Piperaceae',
    partUsed: 'Fruit',
    rasa: ['Katu (Pungent)'],
    guna: ['Laghu (Light)', 'Snigdha (Unctuous)', 'Tikshna (Sharp)'],
    virya: 'Anushnasheeta (Not too hot)', // Often described as mildly Ushna
    vipaka: 'Madhura',
    prabhava: 'Rasayana (Rejuvenative), Yogavahi (Bioavailability enhancer)',
    doshaAction: 'Pacifies Vata and Kapha',
    activePhytochemicals: ['Piperine', 'Piplartine'],
    indications: ['Cough', 'Asthma', 'Indigestion', 'Fever', 'Hiccups', 'Anemia'],
    therapeuticDosage: '0.5-1 gram of powder per day',
    cypInteractions: ['CYP3A4 (inhibition)'],
    allopathicDrugPrecautions: [
      { drugClass: 'Many drugs metabolized by CYP enzymes', potentialRisk: 'Increases bioavailability and serum levels of various drugs (e.g., phenytoin, propranolol, theophylline)', severity: 'high' }
    ]
  },
  {
    id: 'herb_haritaki',
    botanicalName: 'Terminalia chebula',
    sanskritName: 'Haritaki',
    commonName: 'Chebulic Myrobalan',
    family: 'Combretaceae',
    partUsed: 'Fruit',
    rasa: ['Pancharasa (Five tastes, lacking salty)', 'Astringent predominant'],
    guna: ['Laghu (Light)', 'Ruksha (Dry)'],
    virya: 'Ushna',
    vipaka: 'Madhura',
    prabhava: 'Anulomana (Mild laxative), Rasayana (Rejuvenative)',
    doshaAction: 'Tridosha shamaka, mainly Vata',
    activePhytochemicals: ['Chebulinic acid', 'Chebulagic acid', 'Gallic acid'],
    indications: ['Constipation', 'Cough', 'Asthma', 'Hemorrhoids', 'Eye diseases'],
    therapeuticDosage: '3-6 grams of powder per day',
    cypInteractions: [],
    allopathicDrugPrecautions: [
      { drugClass: 'Laxatives', potentialRisk: 'Additive laxative effect', severity: 'moderate' },
      { drugClass: 'Antidiabetics', potentialRisk: 'Hypoglycemia', severity: 'low' }
    ]
  },
  {
    id: 'herb_bibhitaki',
    botanicalName: 'Terminalia bellirica',
    sanskritName: 'Bibhitaki',
    commonName: 'Beleric Myrobalan',
    family: 'Combretaceae',
    partUsed: 'Fruit',
    rasa: ['Kashaya (Astringent)'],
    guna: ['Ruksha (Dry)', 'Laghu (Light)'],
    virya: 'Ushna',
    vipaka: 'Madhura',
    prabhava: 'Khedana (Scraping), Kasahara (Cough suppressant)',
    doshaAction: 'Tridosha shamaka, mainly Kapha',
    activePhytochemicals: ['Gallic acid', 'Ellagic acid', 'Beta-sitosterol'],
    indications: ['Cough', 'Asthma', 'Sore throat', 'Eye diseases', 'Hair fall', 'Digestive disorders'],
    therapeuticDosage: '3-6 grams of powder per day',
    cypInteractions: [],
    allopathicDrugPrecautions: [
      { drugClass: 'Antidiabetics', potentialRisk: 'Hypoglycemia', severity: 'low' }
    ]
  }
];

export function getHerbById(id: string): AyurvedicHerb | undefined {
  const norm = id.toLowerCase().trim();
  return DRAVYAGUNA_HERBS.find(herb => 
    herb.id.toLowerCase() === norm || 
    herb.id.toLowerCase() === `herb_${norm}` || 
    herb.sanskritName.toLowerCase() === norm ||
    herb.commonName.toLowerCase() === norm
  );
}

export function filterHerbsByDosha(dosha: string): AyurvedicHerb[] {
  const lowercaseDosha = dosha.toLowerCase();
  return DRAVYAGUNA_HERBS.filter(herb => 
    herb.doshaAction.toLowerCase().includes(lowercaseDosha) || 
    herb.doshaAction.toLowerCase().includes('tridosha')
  );
}

export function checkHerbDrugInteraction(herbId: string, drugClass: string): { risk: boolean; details?: any } {
  const herb = getHerbById(herbId);
  if (!herb) return { risk: false };

  const lowercaseDrugClass = drugClass.toLowerCase();
  const interaction = herb.allopathicDrugPrecautions.find(p => 
    p.drugClass.toLowerCase().includes(lowercaseDrugClass) || 
    lowercaseDrugClass.includes(p.drugClass.toLowerCase())
  );

  if (interaction) {
    return { risk: true, details: interaction };
  }
  return { risk: false };
}
