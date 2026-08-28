'use client';

import React, { useState, useMemo } from 'react';
import styles from './PanchakarmaScheduler.module.css';
import { 
  Calendar, 
  Clock, 
  Activity, 
  Flame, 
  Droplets, 
  Wind, 
  Utensils, 
  FileText, 
  Sliders, 
  Printer, 
  Download, 
  ChevronRight, 
  ChevronLeft, 
  User, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Info, 
  Pill,
  Heart,
  Layers,
  Copy,
  Check
} from 'lucide-react';

export type ProtocolDuration = 7 | 14 | 21;
export type TherapyType = 'pk_virechana' | 'pk_vamana' | 'pk_basti' | 'pk_nasya' | 'pk_raktamokshana';
export type StageType = 'Purvakarma' | 'Pradhanakarma' | 'Paschatkarma';

export interface ProcedureItem {
  id: string;
  time: string;
  name: string;
  sanskritName: string;
  stage: StageType;
  durationMin: number;
  description: string;
  herbsUsed: string[];
  precautions: string[];
  isCompleted?: boolean;
}

export interface FormulationItem {
  id: string;
  name: string;
  sanskritName: string;
  type: 'Ghrita' | 'Kashaya' | 'Taila' | 'Vati' | 'Churna' | 'Lehyam' | 'Asava';
  dosage: string;
  anupana: string;
  timeOfIntake: string;
  purpose: string;
}

export interface DietStageItem {
  stageName: 'Deepana-Pachana Ahara' | 'Snehapana Anupana' | 'Vishrama Ahara' | 'Manda' | 'Peya' | 'Vilepi' | 'Akrita Yusha' | 'Krita Yusha' | 'Odana with Yusha' | 'Samanya Ahara';
  ladderStep: number; // 0 for Purva, 1 for Manda, 2 for Peya, 3 for Vilepi, 4 for Yusha, 5 for Samanya
  consistency: string;
  waterRatio: string;
  meals: {
    breakfast: string;
    lunch: string;
    evening: string;
    dinner: string;
  };
  keyInstructions: string[];
  hydration: string;
  contraindicatedFoods: string[];
}

export interface VitalMonitoringItem {
  bp: string;
  hr: string;
  temp: string;
  targetVegas?: number;
  actualVegas?: number;
  agniLevel: 'Manda' | 'Madhyama' | 'Tikshna' | 'Sama';
  snehaJirnaAssessment?: string[];
  samyakLakshana: string[];
  dangerSigns: string[];
}

export interface DayProtocol {
  dayNumber: number;
  title: string;
  sanskritTitle: string;
  stage: StageType;
  stageSubtype: string;
  primaryKarma: string;
  doshaState: {
    vata: number;
    pitta: number;
    kapha: number;
    agni: number;
    ama: number;
    rationale: string;
  };
  procedures: ProcedureItem[];
  formulations: FormulationItem[];
  diet: DietStageItem;
  vitals: VitalMonitoringItem;
  clinicalNotes: string;
  swasthavrittaRules: string[];
}

export interface PatientProfile {
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  prakriti: 'Vata' | 'Pitta' | 'Kapha' | 'Vata-Pitta' | 'Pitta-Kapha' | 'Vata-Kapha' | 'Tridosha';
  kostha: 'Mridu (Soft)' | 'Madhyama (Moderate)' | 'Krura (Hard)';
  agni: 'Mandagni (Low)' | 'Tikshnagni (High)' | 'Vishamagni (Irregular)' | 'Samagni (Balanced)';
  shuddhiTarget: 'Pravara (Maximum)' | 'Madhyama (Moderate)' | 'Hina (Mild)';
  startDate: string;
}

// Helper to generate day-by-day protocols dynamically based on duration & therapy
function generateProtocolDays(duration: ProtocolDuration, therapy: TherapyType, patient: PatientProfile): DayProtocol[] {
  const days: DayProtocol[] = [];

  // Determine stage distribution
  let purvaDays = 3;
  let pradhanaDays = 1;
  let paschatDays = 3;

  if (duration === 14) {
    purvaDays = 5;
    pradhanaDays = 4;
    paschatDays = 5;
  } else if (duration === 21) {
    purvaDays = 7;
    pradhanaDays = 7;
    paschatDays = 7;
  }

  // Generate each day
  for (let d = 1; d <= duration; d++) {
    let stage: StageType = 'Purvakarma';
    let stageSubtype = 'Deepana-Pachana';

    if (d <= purvaDays) {
      stage = 'Purvakarma';
      if (d === 1) stageSubtype = 'Deepana & Pachana (Agni Rekindling & Toxin Digestion)';
      else if (d < purvaDays) stageSubtype = `Avarohana Snehapana (Internal Oleation Day ${d - 1})`;
      else stageSubtype = 'Sarvanga Abhyanga & Bashpa Swedana (Oleation & Sudation)';
    } else if (d <= purvaDays + pradhanaDays) {
      stage = 'Pradhanakarma';
      const pradhanaIdx = d - purvaDays;
      if (pradhanaIdx === 1 && duration > 7) {
        stageSubtype = 'Vishrama Kala (Rest & Preparatory Sudation)';
      } else {
        stageSubtype = `Pradhana Karma Session ${pradhanaIdx}`;
      }
    } else {
      stage = 'Paschatkarma';
      const paschatIdx = d - (purvaDays + pradhanaDays);
      if (paschatIdx === 1) stageSubtype = 'Samsarjana Krama - Manda Phase';
      else if (paschatIdx === 2) stageSubtype = 'Samsarjana Krama - Peya Phase';
      else if (paschatIdx === 3) stageSubtype = 'Samsarjana Krama - Vilepi Phase';
      else if (paschatIdx <= 5) stageSubtype = 'Samsarjana Krama - Yusha Phase';
      else stageSubtype = 'Rasayana & Agni Restoration Phase';
    }

    // Dosha calculations based on day progression
    let vataVal = 50;
    let pittaVal = 50;
    let kaphaVal = 50;
    let agniVal = 40;
    let amaVal = 70;
    let rationaleText = '';

    if (stage === 'Purvakarma') {
      const prog = d / purvaDays;
      agniVal = Math.round(35 + prog * 35);
      amaVal = Math.round(75 - prog * 40); // Ama is digested
      if (therapy === 'pk_virechana') {
        pittaVal = Math.round(65 + prog * 20); // Pitta mobilized to Kostha (Utklesha)
        vataVal = Math.round(45 - prog * 10);
        kaphaVal = Math.round(40);
        rationaleText = `Purvakarma Phase: Snehapana and Swedana mobilize Pitta and cellular endotoxins (Ama) from Shakha (periphery) to Kostha (GI tract). Agni is progressively rekindled.`;
      } else if (therapy === 'pk_vamana') {
        kaphaVal = Math.round(65 + prog * 25); // Kapha mobilized
        pittaVal = Math.round(45);
        vataVal = Math.round(40);
        rationaleText = `Purvakarma Phase: Snehana liquifies morbid Kapha and Meda toxins, driving them towards the stomach (Amashaya) for expulsion.`;
      } else if (therapy === 'pk_basti') {
        vataVal = Math.round(70 - prog * 20);
        pittaVal = Math.round(45);
        kaphaVal = Math.round(45);
        rationaleText = `Purvakarma Phase: Snehana pacifies Ruksha (dry) and Chala (mobile) qualities of Vata, lubricating Pakwashaya (colon).`;
      } else {
        pittaVal = Math.round(60 + prog * 15);
        vataVal = Math.round(45);
        kaphaVal = Math.round(45);
        rationaleText = `Purvakarma Phase: Internal oleation detaches deep-seated morbid humors and readies vascular bed.`;
      }
    } else if (stage === 'Pradhanakarma') {
      agniVal = 25; // Agni becomes sluggish right after intense evacuation (Manda Agni)
      amaVal = 15;
      if (therapy === 'pk_virechana') {
        pittaVal = 25; // Sharp Pitta drop
        vataVal = 55;  // Temporary Vata spike due to emptiness
        kaphaVal = 35;
        rationaleText = `Pradhanakarma Phase: Therapeutic purgation eliminates vitiated Pitta and Rakta toxins. Temporary Mandagni and Vata elevation occurs post-evacuation.`;
      } else if (therapy === 'pk_vamana') {
        kaphaVal = 20; // Sharp Kapha drop
        pittaVal = 30;
        vataVal = 50;
        rationaleText = `Pradhanakarma Phase: Vamana forcefully expels vitiated Kapha and mucus from upper GI tract. Agni is acutely delicate.`;
      } else if (therapy === 'pk_basti') {
        vataVal = 30; // Vata pacified
        pittaVal = 40;
        kaphaVal = 40;
        rationaleText = `Pradhanakarma Phase: Niruha and Anuvasana Bastis cleanse Pakwashaya, directly treating the primary seat of Vata.`;
      } else {
        pittaVal = 30;
        vataVal = 40;
        kaphaVal = 40;
        rationaleText = `Pradhanakarma Phase: Main elimination of morbid doshas completed. Vitals monitored continuously.`;
      }
    } else {
      // Paschatkarma
      const postIdx = d - (purvaDays + pradhanaDays);
      const postProg = postIdx / paschatDays;
      agniVal = Math.round(30 + postProg * 65); // Agni rebuilt to 95
      amaVal = Math.round(Math.max(5, 15 - postProg * 10));
      vataVal = Math.round(45 - postProg * 12);
      pittaVal = Math.round(35 + postProg * 8);
      kaphaVal = Math.round(35 + postProg * 8);
      rationaleText = `Paschatkarma Phase: Graded Samsarjana Krama rekindles Agni like a small spark fanned into a blazing fire (Agni Dipana). Tridoshic equilibrium achieved.`;
    }

    // Specific Day Details
    let dayTitle = `Day ${d}: ${stageSubtype}`;
    let sanskritTitle = stage === 'Purvakarma' ? 'पूर्वकर्म' : stage === 'Pradhanakarma' ? 'प्रधानकर्म' : 'पश्चात्कर्म';
    let primaryKarma = '';
    const procs: ProcedureItem[] = [];
    const forms: FormulationItem[] = [];
    let dietObj: DietStageItem;
    const vitalsObj: VitalMonitoringItem = {
      bp: '120/80 mmHg',
      hr: '72 bpm',
      temp: '98.4 °F',
      agniLevel: agniVal < 40 ? 'Manda' : agniVal < 70 ? 'Madhyama' : 'Sama',
      samyakLakshana: [],
      dangerSigns: []
    };

    // Construct Day-Specific Clinical Data
    if (stage === 'Purvakarma') {
      if (d === 1) {
        primaryKarma = 'Deepana & Pachana Initiation';
        sanskritTitle = 'दीपन पाचन कर्म';
        procs.push(
          {
            id: `p_${d}_1`,
            time: '07:00 AM',
            name: 'Prakriti & Kostha Assessment',
            sanskritName: 'प्रकृति कोष्ठ परीक्षा',
            stage: 'Purvakarma',
            durationMin: 30,
            description: 'Clinical baseline assessment of Agni, Kostha motility, pulse (Nadi), and BP before commencing Snehapana.',
            herbsUsed: ['N/A'],
            precautions: ['Assess for acute indigestion or fever']
          },
          {
            id: `p_${d}_2`,
            time: '08:00 AM',
            name: 'Deepana-Pachana Dravya Administration',
            sanskritName: 'दीपन पाचन द्रव्य सेवन',
            stage: 'Purvakarma',
            durationMin: 15,
            description: 'Administer carminative and digestive formulations to clear Ama and stimulate digestive enzymes.',
            herbsUsed: ['Chitrakadi Vati', 'Trikatu Churna', 'Shunthi Kwatha'],
            precautions: ['Consume with warm water, avoid heavy or oily breakfast']
          }
        );
        forms.push(
          {
            id: `f_${d}_1`,
            name: 'Chitrakadi Vati',
            sanskritName: 'चित्रकादि वटी',
            type: 'Vati',
            dosage: '2 tablets (500mg each)',
            anupana: 'Ushnodaka (Warm Water)',
            timeOfIntake: 'Pragbhakta (30 mins before meals)',
            purpose: 'Deepana (kindles digestive Agni) & Pachana (digests Ama toxins)'
          },
          {
            id: `f_${d}_2`,
            name: 'Trikatu Churna with Honey or Warm Water',
            sanskritName: 'त्रिकटु चूर्ण',
            type: 'Churna',
            dosage: '2 grams',
            anupana: 'Lukewarm Water',
            timeOfIntake: 'Twice daily before food',
            purpose: 'Bio-enhancer and clears Kapha-Ama coating in Koshta'
          }
        );
        dietObj = {
          stageName: 'Deepana-Pachana Ahara',
          ladderStep: 0,
          consistency: 'Light, warm, non-slimy, easily digestible',
          waterRatio: '1:4',
          meals: {
            breakfast: 'Warm ginger-infused boiled water, light roasted moong soup (Krita Yusha)',
            lunch: 'Laghvaahar: Steamed Shali rice with light green gram dal tempered with cumin and ginger',
            evening: 'Warm herbal infusion (Dhania-Jeera-Shunthi tea)',
            dinner: 'Warm vegetable soup or thin gruel, must be completed before 7:30 PM'
          },
          keyInstructions: ['Sip warm water only', 'Eat only when hungry (Kshudha bodha)', 'Avoid cold, refrigerated, or heavy food'],
          hydration: '1.5 - 2 Liters Ushnodaka (boiled warm water)',
          contraindicatedFoods: ['Dairy, yogurt, fried food, sweets, cold drinks, heavy lentils']
        };
        vitalsObj.samyakLakshana = ['Kshudha Pravritti (appetite arousal)', 'Laghuta (lightness in body)', 'Vatanulomana (clear flatulence)'];
        vitalsObj.dangerSigns = ['Severe burning sensation', 'Nausea due to high Pitta'];
      } else if (d < purvaDays) {
        const snehaDay = d - 1;
        const doseMl = Math.min(180, 30 + snehaDay * 30);
        primaryKarma = `Snehapana Day ${snehaDay} (${doseMl} ml)`;
        sanskritTitle = `स्नेहपान दिवस ${snehaDay}`;
        procs.push(
          {
            id: `p_${d}_1`,
            time: '06:00 AM',
            name: `Medicated Ghee Intake (Snehapana - ${doseMl} ml)`,
            sanskritName: 'सस्नेहपान विधि',
            stage: 'Purvakarma',
            durationMin: 30,
            description: `Administer titrated dose of medicated ghee on an empty stomach at sunrise. Patient must drink warm water continuously throughout the day until digestion (Sneha Jeerna).`,
            herbsUsed: therapy === 'pk_virechana' ? ['Panchatikta Ghrita', 'Mahatiktaka Ghrita'] : therapy === 'pk_vamana' ? ['Sukumara Ghrita', 'Indukantha Ghrita'] : ['Guggulutiktaka Ghrita'],
            precautions: ['Do not consume anything until Sneha is fully digested', 'Avoid sleep during daytime', 'Sip warm water strictly']
          },
          {
            id: `p_${d}_2`,
            time: '12:30 PM',
            name: 'Sneha Jeerna Assessment & Light Meal',
            sanskritName: 'स्नेह जीर्ण लक्षण परीक्षा',
            stage: 'Purvakarma',
            durationMin: 20,
            description: 'Evaluate belching (Udgara Shuddhi), lightness of body, and clear hunger before permitting liquid diet.',
            herbsUsed: ['Ushnodaka'],
            precautions: ['Meal permitted only after pure aromatic belching and appetite']
          }
        );
        forms.push({
          id: `f_${d}_1`,
          name: therapy === 'pk_virechana' ? 'Mahatiktaka Ghrita' : therapy === 'pk_vamana' ? 'Sukumara Ghrita' : 'Panchatikta Ghrita',
          sanskritName: therapy === 'pk_virechana' ? 'तिक्तक घृत' : 'सुकुमार घृत',
          type: 'Ghrita',
          dosage: `${doseMl} ml (warm)`,
          anupana: 'Warm water immediately after drinking',
          timeOfIntake: 'Abhakta (Empty stomach at dawn, 06:00 AM)',
          purpose: 'Internal cellular oleation, unseating fat-soluble endotoxins'
        });
        dietObj = {
          stageName: 'Snehapana Anupana',
          ladderStep: 0,
          consistency: 'Liquid, hot, non-greasy, unspiced',
          waterRatio: '1:6',
          meals: {
            breakfast: 'No solid breakfast allowed. Warm water sips only until Sneha digests.',
            lunch: 'Warm Peya (thin rice gruel) or light Moong dal water once clear hunger returns (approx 1-2 PM)',
            evening: 'Lukewarm water with dry ginger',
            dinner: 'Warm light Odana (boiled rice) with simple vegetable broth before 7:00 PM'
          },
          keyInstructions: ['Only boiled lukewarm water allowed for thirst', 'Strict Brahmacharya & physical rest', 'No AC or cold drafts'],
          hydration: 'Warm water whenever thirsty (approx 2 Liters)',
          contraindicatedFoods: ['All fats/oils, dairy, cold foods, raw salads, non-veg']
        };
        vitalsObj.snehaJirnaAssessment = [
          'Udgara Shuddhi (belching free from ghee taste/odor)',
          'Utsaha (mental cheerfulness and clarity)',
          'Laghuta (feeling light in abdomen and body)',
          'Kshudha & Trishna Pravritti (natural hunger & thirst)'
        ];
        vitalsObj.samyakLakshana = ['Snigdha Varcha (unctuous, oily stools)', 'Twak Mardava (softness of skin)', 'Snehodvega (slight natural aversion to ghee)'];
      } else {
        // Last Day of Purvakarma: Sarvanga Abhyanga & Bashpa Swedana
        primaryKarma = 'Sarvanga Abhyanga & Bashpa Swedana';
        sanskritTitle = 'सर्वाङ्ग अभ्यङ्ग एवं बाष्प स्वेदन';
        procs.push(
          {
            id: `p_${d}_1`,
            time: '07:30 AM',
            name: 'Sarvanga Abhyanga (Full Body Massage)',
            sanskritName: 'सर्वाङ्ग अभ्यङ्ग',
            stage: 'Purvakarma',
            durationMin: 45,
            description: 'Synchronized therapeutic full body massage in anuloma gati (hair direction) using warm medicated oil.',
            herbsUsed: ['Mahanarayana Taila', 'Ksheerabala Taila', 'Dhanwantharam Taila'],
            precautions: ['Moderate pressure, protect vital Marma points and eyes']
          },
          {
            id: `p_${d}_2`,
            time: '08:30 AM',
            name: 'Bashpa Swedana (Herbal Steam Box)',
            sanskritName: 'बाष्प स्वेदन',
            stage: 'Purvakarma',
            durationMin: 20,
            description: 'Full body steam with Dashamoola decoction keeping head cool with wet towel and rose water on eyes.',
            herbsUsed: ['Dashamoola Kwatha', 'Nirgundi Patra'],
            precautions: ['Stop immediately if patient feels giddiness or excessive sweating']
          }
        );
        forms.push({
          id: `f_${d}_1`,
          name: 'Mahanarayana Taila',
          sanskritName: 'महानारायण तैल',
          type: 'Taila',
          dosage: '100 ml (External Abhyanga)',
          anupana: 'External application',
          timeOfIntake: 'Morning pre-bath',
          purpose: 'External oleation, pacifying Vata, softening body tissues'
        });
        dietObj = {
          stageName: 'Vishrama Ahara',
          ladderStep: 0,
          consistency: 'Light, nourishing, warm',
          waterRatio: '1:4',
          meals: {
            breakfast: 'Warm semolina or rice gruel with rock salt',
            lunch: 'Steamed rice with green gram Yusha and boiled gourd vegetable',
            evening: 'Warm herbal decoction',
            dinner: therapy === 'pk_vamana' ? 'Kapha-provoking diet: Sweet porridge/Kheer or curd rice (to liquefy Kapha for next morning emesis)' : 'Very light Khichdi with cumin and ghee'
          },
          keyInstructions: ['Avoid exposure to breezes or fans post-steam', 'Warm water bath only after sweat subsides'],
          hydration: 'Lukewarm water with coriander seeds',
          contraindicatedFoods: ['Heavy meat, alcohol, cold water, strenuous exercise']
        };
        vitalsObj.samyakLakshana = ['Samyak Snigdha (soft lustrous skin, oily stool)', 'Sweda Pravritti (uniform sweating)', 'Gatra Laghava (body lightness)'];
      }
    } else if (stage === 'Pradhanakarma') {
      // Main Karma Days
      const pradhanaIndex = d - purvaDays;
      if (therapy === 'pk_virechana') {
        primaryKarma = 'Virechana Karma (Therapeutic Purgation)';
        sanskritTitle = 'विरेचन कर्म';
        procs.push(
          {
            id: `p_${d}_1`,
            time: '08:00 AM',
            name: 'Virechana Dravya Administration',
            sanskritName: 'विरेचन औषधि प्राशन',
            stage: 'Pradhanakarma',
            durationMin: 30,
            description: 'Administer classical purgative paste/oil after evaluating morning pulse, blood pressure, and ensuring empty stomach.',
            herbsUsed: ['Trivrit Lehyam (30g)', 'Avipattikar Churna', 'Eranda Taila (Castor oil 30ml with warm milk)'],
            precautions: ['Monitor dehydration, count evacuation bouts (Vegas), keep warm water ready']
          },
          {
            id: `p_${d}_2`,
            time: '10:00 AM - 03:00 PM',
            name: 'Vega Observation & Antiki Assessment',
            sanskritName: 'वेग परीक्षा एवं अन्तिकी लक्षण',
            stage: 'Pradhanakarma',
            durationMin: 300,
            description: 'Record each bout of purgation. Observe progression: Mala (stool) -> Pitta (bile) -> Kapha (mucus). Appearance of Kaphanta indicates complete purification.',
            herbsUsed: ['Lukewarm water sips', 'Pichha Basti on standby for atiyoga'],
            precautions: ['Patient must not suppress urges, must wash with warm water only']
          }
        );
        forms.push({
          id: `f_${d}_1`,
          name: 'Trivrit Lehyam',
          sanskritName: 'त्रिवृत् लेह्यम्',
          type: 'Lehyam',
          dosage: '35 - 50 grams',
          anupana: 'Warm water / Draksha Kashaya',
          timeOfIntake: '08:30 AM after digestion of previous night meal',
          purpose: 'Pradhana Virechana dravya - cleanses Pitta from liver, gallbladder, and small intestine'
        });
        vitalsObj.targetVegas = patient.shuddhiTarget.includes('Pravara') ? 30 : patient.shuddhiTarget.includes('Madhyama') ? 20 : 10;
        vitalsObj.actualVegas = 0;
        dietObj = {
          stageName: 'Manda',
          ladderStep: 1,
          consistency: 'Pure liquid, clear rice supernatant water without solid grains',
          waterRatio: '1:14',
          meals: {
            breakfast: 'Nil by mouth prior to Virechana',
            lunch: 'Sips of lukewarm water during bouts if thirsty',
            evening: 'Lukewarm Manda (clear rice water with pinch of rock salt) after all vegas subside',
            dinner: 'Warm Lajapeya or Manda'
          },
          keyInstructions: ['Do not eat solid food', 'Do not sleep during daytime', 'Avoid speaking loudly or walking around'],
          hydration: 'Small sips of lukewarm water only',
          contraindicatedFoods: ['All solids, spices, dairy, cold water, raw food']
        };
        vitalsObj.samyakLakshana = ['Kaphanta (evacuation ends with clear mucus)', 'Laghuta (immense lightness)', 'Indriya Prasada (clarity of sensory organs)'];
        vitalsObj.dangerSigns = ['Giddiness (Bhrama)', 'Appearance of pure blood (Raktatisara)', 'Severe muscle cramps'];
      } else if (therapy === 'pk_vamana') {
        primaryKarma = 'Vamana Karma (Therapeutic Emesis)';
        sanskritTitle = 'वमन कर्म';
        procs.push(
          {
            id: `p_${d}_1`,
            time: '06:30 AM',
            name: 'Akanthapana (Stomach Filling with Decoction)',
            sanskritName: 'आकण्ठपान',
            stage: 'Pradhanakarma',
            durationMin: 30,
            description: 'Administer Yashtimadhu Phanta or Milk until patient feels full up to the throat.',
            herbsUsed: ['Yashtimadhu Phanta', 'Ksheera (Milk)'],
            precautions: ['Ensure patient is seated on comfortable knee-high stool']
          },
          {
            id: `p_${d}_2`,
            time: '07:15 AM',
            name: 'Vamaka Yoga Administration & Vega Count',
            sanskritName: 'वामक योग प्राशन',
            stage: 'Pradhanakarma',
            durationMin: 90,
            description: 'Administer Madanaphala seed paste with Honey and Saindhava. Observe bouts: Kapha -> Pitta (bile). End at Pittanta.',
            herbsUsed: ['Madanaphala Pippali Churna', 'Vacha Churna', 'Saindhava Lavana', 'Madhu'],
            precautions: ['Support forehead, chest, and flanks during bouts']
          },
          {
            id: `p_${d}_3`,
            time: '09:30 AM',
            name: 'Dhoomapana & Gandusha',
            sanskritName: 'धूमपान एवं गण्डूष',
            stage: 'Pradhanakarma',
            durationMin: 15,
            description: 'Herbal medicated smoke inhalation through nostrils and mouth to clear residual Kapha from throat/sinuses.',
            herbsUsed: ['Haridra', 'Guggulu', 'Eladi Dhooma Varti'],
            precautions: ['Gargle with warm water immediately after']
          }
        );
        forms.push({
          id: `f_${d}_1`,
          name: 'Madanaphala Pippali Yoga',
          sanskritName: 'मदनफल पिप्पली योग',
          type: 'Churna',
          dosage: '4 to 6 grams',
          anupana: 'Honey & Yashtimadhu Kashaya',
          timeOfIntake: '07:00 AM (Kapha Kala)',
          purpose: 'Classical safe emetic agent that eliminates deep seated Kapha from chest & stomach'
        });
        vitalsObj.targetVegas = patient.shuddhiTarget.includes('Pravara') ? 8 : patient.shuddhiTarget.includes('Madhyama') ? 6 : 4;
        dietObj = {
          stageName: 'Manda',
          ladderStep: 1,
          consistency: 'Pure liquid, clear boiled rice water',
          waterRatio: '1:14',
          meals: {
            breakfast: 'Vamana procedure (Nil)',
            lunch: 'Lukewarm water sips post-rest',
            evening: 'Lukewarm Manda with rock salt',
            dinner: 'Warm Peya (thin gruel) before bed'
          },
          keyInstructions: ['Complete vocal rest for 24 hours', 'Stay inside room free from dust and draft'],
          hydration: 'Warm water sips',
          contraindicatedFoods: ['All solids, heavy food, cold drinks']
        };
        vitalsObj.samyakLakshana = ['Pittanta (emesis ends with yellow bile)', 'Urah Shuddhi (clear open chest and breathing)', 'Kanta Shuddhi (clarity in throat and voice)'];
      } else if (therapy === 'pk_basti') {
        const isNiruha = pradhanaIndex % 2 === 0;
        primaryKarma = isNiruha ? 'Niruha / Kashaya Basti (Decoction Enema)' : 'Anuvasana / Sneha Basti (Medicated Oil Enema)';
        sanskritTitle = isNiruha ? 'निरूह / कषाय बस्ति' : 'अनुवासन / स्नेह बस्ति';
        procs.push(
          {
            id: `p_${d}_1`,
            time: '08:00 AM',
            name: 'Local Kati & Udara Abhyanga-Sweda',
            sanskritName: 'कटि उदर अभ्यङ्ग स्वेद',
            stage: 'Pradhanakarma',
            durationMin: 25,
            description: 'Localized warm oil massage and herbal steam application to lower abdomen, pelvis, and lumbar spine.',
            herbsUsed: ['Sahacharadi Taila', 'Dashamoola Sweda'],
            precautions: ['Verify bladder and bowels are evacuated before Niruha']
          },
          {
            id: `p_${d}_2`,
            time: '09:00 AM',
            name: isNiruha ? 'Niruha Basti Administration' : 'Anuvasana Basti Administration',
            sanskritName: isNiruha ? 'निरूह बस्ति दान' : 'अनुवासन बस्ति दान',
            stage: 'Pradhanakarma',
            durationMin: 30,
            description: isNiruha 
              ? 'Administer 450ml emulsified decoction basti (Honey + Saindhava + Sneha + Kalka + Kashaya) in left lateral position.'
              : 'Administer 60-100ml warm medicated oil basti immediately after lunch.',
            herbsUsed: isNiruha ? ['Dashamoola Kashaya', 'Erandamoola', 'Madhu', 'Saindhava'] : ['Mahanarayana Taila', 'Sahacharadi 101'],
            precautions: ['Patient must retain Anuvasana for at least 3 hours; Niruha usually expels in 15-45 minutes']
          }
        );
        forms.push({
          id: `f_${d}_1`,
          name: isNiruha ? 'Dashamooladi Niruha Basti Yoga' : 'Sahacharadi Anuvasana Taila',
          sanskritName: isNiruha ? 'दशमूलादि निरूह योग' : 'सहचरादि अनुवासन तैल',
          type: isNiruha ? 'Kashaya' : 'Taila',
          dosage: isNiruha ? '400 - 500 ml' : '60 - 80 ml',
          anupana: 'Per Rectum via Basti Netra / Catheter',
          timeOfIntake: isNiruha ? 'Morning empty stomach' : 'Post-prandial (immediately after lunch)',
          purpose: 'Purifies Pakwashaya, pacifies aggravated Apana and Vyana Vata'
        });
        dietObj = {
          stageName: 'Peya',
          ladderStep: 2,
          consistency: 'Thin semi-liquid rice gruel cooked with digestive spices',
          waterRatio: '1:4',
          meals: {
            breakfast: isNiruha ? 'Light tea/water only' : 'Light warm rice with ghee before Anuvasana',
            lunch: 'Warm Peya or light Khichdi with cumin ghee tempering',
            evening: 'Warm herbal tea',
            dinner: 'Warm rice gruel with green gram soup'
          },
          keyInstructions: ['Avoid daytime sleep after Basti', 'Avoid sitting on uneven or hard surfaces'],
          hydration: 'Warm water 2 Liters',
          contraindicatedFoods: ['Dry food, raw food, pulses that cause gas (chana, rajma)']
        };
        vitalsObj.samyakLakshana = ['Samyak Basti Pratyagamana (smooth return of enema with flatus)', 'Vatanulomana', 'Laghavata (lightness in lower back and abdomen)'];
      } else {
        // Nasya / Raktamokshana
        primaryKarma = therapy === 'pk_nasya' ? 'Pradhamana / Marsha Nasya' : 'Siravedha / Jalaukavacharana (Leech Therapy)';
        sanskritTitle = therapy === 'pk_nasya' ? 'नस्य कर्म' : 'रक्तमोक्षण कर्म';
        procs.push({
          id: `p_${d}_1`,
          time: '08:30 AM',
          name: therapy === 'pk_nasya' ? 'Mukha Abhyanga, Nadi Sweda & Nasya' : 'Jalaukavacharana / Siravedha Application',
          sanskritName: therapy === 'pk_nasya' ? 'मुख अभ्यङ्ग एवं नस्य' : 'जलौकावचरण',
          stage: 'Pradhanakarma',
          durationMin: 45,
          description: therapy === 'pk_nasya' 
            ? 'Instillation of 8 drops of warm medicated oil into each nostril with head tilted backwards, followed by throat gargling and herbal dhooma.'
            : 'Application of sterile medicinal leeches (Jalauka) over affected area to aspirate vitiated venous blood.',
          herbsUsed: therapy === 'pk_nasya' ? ['Anu Taila', 'Shadbindu Taila'] : ['Nirvisha Jalauka', 'Haridra Churna', 'Shatadhauta Ghrita'],
          precautions: ['Check coagulation profile, clean sterile technique']
        });
        forms.push({
          id: `f_${d}_1`,
          name: therapy === 'pk_nasya' ? 'Anu Taila' : 'Shatadhauta Ghrita',
          sanskritName: therapy === 'pk_nasya' ? 'अणु तैल' : 'शतधौत घृत',
          type: therapy === 'pk_nasya' ? 'Taila' : 'Ghrita',
          dosage: therapy === 'pk_nasya' ? '8 drops each nostril' : 'External application',
          anupana: 'Nasal drops / Topical',
          timeOfIntake: 'Morning after mild facial steam',
          purpose: 'Reaches Shringataka marma, cleanses sinuses and cranial channels'
        });
        dietObj = {
          stageName: 'Vilepi',
          ladderStep: 3,
          consistency: 'Thick warm rice gruel with cumin and rock salt',
          waterRatio: '1:4',
          meals: {
            breakfast: 'Light ginger porridge',
            lunch: 'Warm Vilepi with cooked moong dal',
            evening: 'Warm herbal tea',
            dinner: 'Steamed rice with thin dal'
          },
          keyInstructions: ['Avoid cold wind, dust, smoke, daytime sleep'],
          hydration: 'Warm water 2 Liters',
          contraindicatedFoods: ['Ice water, ice creams, curd, exposure to AC']
        };
        vitalsObj.samyakLakshana = ['Indriya Prasada (clarity of vision and smell)', 'Shiro Laghuta (lightness of head)'];
      }
    } else {
      // Paschatkarma (Post-purification / Samsarjana Krama)
      const paschatIndex = d - (purvaDays + pradhanaDays);
      let dietStage: DietStageItem['stageName'] = 'Manda';
      let ladderStep = 1;
      let consistency = '';
      let ratio = '1:14';

      if (paschatIndex === 1) {
        dietStage = 'Manda';
        ladderStep = 1;
        consistency = 'Pure thin clear rice supernatant water (no solid grains), seasoned with pinch of rock salt.';
        ratio = '1:14';
        primaryKarma = 'Samsarjana Krama Step 1: Manda (Clear Rice Water)';
        sanskritTitle = 'संसर्जन क्रम: मण्ड सेवन';
      } else if (paschatIndex === 2) {
        dietStage = 'Peya';
        ladderStep = 2;
        consistency = 'Thin rice gruel with 1 part soft grains and 3 parts liquid broth.';
        ratio = '1:4';
        primaryKarma = 'Samsarjana Krama Step 2: Peya (Thin Rice Gruel)';
        sanskritTitle = 'संसर्जन क्रम: पेया सेवन';
      } else if (paschatIndex === 3) {
        dietStage = 'Vilepi';
        ladderStep = 3;
        consistency = 'Thick soft boiled rice paste/porridge with minimal liquid, easily chewable.';
        ratio = '1:4';
        primaryKarma = 'Samsarjana Krama Step 3: Vilepi (Thick Rice Paste)';
        sanskritTitle = 'संसर्जन क्रम: विलेपी सेवन';
      } else if (paschatIndex === 4) {
        dietStage = 'Akrita Yusha';
        ladderStep = 4;
        consistency = 'Unspiced green gram (Moong) lentil soup without added ghee or heavy spices.';
        ratio = '1:6';
        primaryKarma = 'Samsarjana Krama Step 4: Akrita Yusha (Plain Lentil Broth)';
        sanskritTitle = 'संसर्जन क्रम: अकृत यूष सेवन';
      } else if (paschatIndex === 5) {
        dietStage = 'Krita Yusha';
        ladderStep = 4;
        consistency = 'Green gram soup seasoned with rock salt, cumin, ginger, and half a teaspoon of pure cow ghee.';
        ratio = '1:6';
        primaryKarma = 'Samsarjana Krama Step 5: Krita Yusha (Spiced Lentil Broth with Ghee)';
        sanskritTitle = 'संसर्जन क्रम: कृत यूष सेवन';
      } else {
        dietStage = 'Samanya Ahara';
        ladderStep = 5;
        consistency = 'Regular wholesome balanced diet (Shali rice, Mudga dal, cooked gourd vegetables, warm milk).';
        ratio = '1:2';
        primaryKarma = 'Rasayana Initiation & Dinacharya Restoration';
        sanskritTitle = 'रसायन सेवन एवं सामान्य आहार';
      }

      procs.push(
        {
          id: `p_${d}_1`,
          time: '07:30 AM',
          name: 'Agni & Stool Assessment (Pashchat Pariksha)',
          sanskritName: 'अग्नि एवं कोष्ठ परीक्षा',
          stage: 'Paschatkarma',
          durationMin: 20,
          description: 'Assess appetite intensity, digestion speed, and restoration of gastrointestinal mucosal barrier.',
          herbsUsed: ['Ushnodaka'],
          precautions: ['Do not step up diet ladder if previous meal was not digested easily']
        },
        {
          id: `p_${d}_2`,
          time: '08:00 AM',
          name: ladderStep >= 4 ? 'Rasayana Chikitsa & Shiro-Abhyanga' : 'Kavala & Gandusha (Oral Gargle)',
          sanskritName: ladderStep >= 4 ? 'रसायन चिकित्सा' : 'कवल गण्डूष',
          stage: 'Paschatkarma',
          durationMin: 30,
          description: ladderStep >= 4 
            ? 'Initiation of adaptogenic rejuvenating herbs to rebuild Dhatus (plasma, muscle, bone marrow, ojas).'
            : 'Warm medicated water and Triphala decoction gargle to maintain oral and digestive channel hygiene.',
          herbsUsed: ladderStep >= 4 ? ['Chyawanprash', 'Brahma Rasayana', 'Ashwagandha'] : ['Triphala Kwatha', 'Irimedadi Taila'],
          precautions: ['Take Rasayana on empty stomach with warm milk or honey-ghee mix']
        }
      );

      forms.push(
        {
          id: `f_${d}_1`,
          name: ladderStep >= 4 ? 'Chyawanprash Lehyam' : 'Drakshadi Kashaya',
          sanskritName: ladderStep >= 4 ? 'च्यवनप्राश' : 'द्राक्षादि कषाय',
          type: ladderStep >= 4 ? 'Lehyam' : 'Kashaya',
          dosage: ladderStep >= 4 ? '10 grams twice daily' : '40 ml twice daily before meals',
          anupana: ladderStep >= 4 ? 'Warm cow milk' : 'Lukewarm water',
          timeOfIntake: 'Morning 07:00 AM on empty stomach',
          purpose: ladderStep >= 4 ? 'Rejuvenation of all 7 Dhatus, boosting Ojas & immunity' : 'Soothes gastrointestinal mucosa and balances Pitta'
        }
      );

      dietObj = {
        stageName: dietStage,
        ladderStep: ladderStep,
        consistency: consistency,
        waterRatio: ratio,
        meals: {
          breakfast: ladderStep === 1 ? 'Warm Manda (clear rice water with rock salt)' : ladderStep === 2 ? 'Warm Peya (thin gruel)' : ladderStep === 3 ? 'Warm Vilepi' : 'Warm Moong soup with light toast/rice',
          lunch: ladderStep <= 2 ? 'Warm Peya with pinch of roasted cumin' : ladderStep === 3 ? 'Warm Vilepi with cooked soft zucchini' : 'Steamed Shali rice with Krita Yusha & boiled lauki',
          evening: 'Warm dry ginger herbal infusion',
          dinner: ladderStep <= 2 ? 'Warm Manda or Peya' : 'Soft boiled rice with unspiced dal broth before 7:30 PM'
        },
        keyInstructions: [
          'Strict avoidance of Ashta Mahadosha (loud speech, travel, sun exposure, day sleep, suppressing natural urges)',
          'Eat only when prior meal is completely digested',
          'Avoid all spicy, sour, fermented, fried, and cold items'
        ],
        hydration: 'Boiled water reduced to half (Ardhawashesha Shrutashita Jala)',
        contraindicatedFoods: ['Raw salads, red meat, cheese, alcohol, deep-fried snacks, ice cream, curd']
      };

      vitalsObj.samyakLakshana = ['Dipta Agni (strong steady appetite)', 'Bala Vriddhi (strength returning)', 'Sharira Laghava (sustained lightness)', 'Sama Dhatu (balanced tissues)'];
    }

    days.push({
      dayNumber: d,
      title: dayTitle,
      sanskritTitle: sanskritTitle,
      stage: stage,
      stageSubtype: stageSubtype,
      primaryKarma: primaryKarma,
      doshaState: {
        vata: vataVal,
        pitta: pittaVal,
        kapha: kaphaVal,
        agni: agniVal,
        ama: amaVal,
        rationale: rationaleText
      },
      procedures: procs,
      formulations: forms,
      diet: dietObj,
      vitals: vitalsObj,
      clinicalNotes: `Patient is undergoing ${stageSubtype}. Vital monitoring and strict compliance with Samsarjana Ahara Niyama are mandatory.`,
      swasthavrittaRules: [
        'Avoid Ucchairbhashya (excessive or loud speaking)',
        'Avoid Rathakshobha & Yana (jerky travel and vehicle riding)',
        'Avoid Atichankramana (excessive walking or standing)',
        'Avoid Divaswapna (daytime sleeping which vitiates Kapha & Pitta)',
        'Avoid Vegadharana (suppression of natural urges like urine, feces, flatus, yawns)'
      ]
    });
  }

  return days;
}

export default function PanchakarmaScheduler() {
  // State management
  const [duration, setDuration] = useState<ProtocolDuration>(14);
  const [selectedTherapy, setSelectedTherapy] = useState<TherapyType>('pk_virechana');
  const [selectedDayNum, setSelectedDayNum] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'procedures' | 'formulations' | 'diet' | 'vitals' | 'rules'>('procedures');
  
  // Patient Profile state
  const [patient, setPatient] = useState<PatientProfile>({
    name: 'Aarav Sharma',
    age: 38,
    gender: 'Male',
    prakriti: 'Pitta-Kapha',
    kostha: 'Madhyama (Moderate)',
    agni: 'Mandagni (Low)',
    shuddhiTarget: 'Pravara (Maximum)',
    startDate: new Date().toISOString().split('T')[0]
  });

  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [completedProcedures, setCompletedProcedures] = useState<Record<string, boolean>>({});
  const [checkedLakshanas, setCheckedLakshanas] = useState<Record<string, boolean>>({});
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);

  // Generate protocol days
  const protocolDays = useMemo(() => {
    return generateProtocolDays(duration, selectedTherapy, patient);
  }, [duration, selectedTherapy, patient]);

  // Active day data
  const currentDay = useMemo(() => {
    return protocolDays.find(d => d.dayNumber === selectedDayNum) || protocolDays[0];
  }, [protocolDays, selectedDayNum]);

  // Stage distribution counts
  const stageStats = useMemo(() => {
    const purvaCount = protocolDays.filter(d => d.stage === 'Purvakarma').length;
    const pradhanaCount = protocolDays.filter(d => d.stage === 'Pradhanakarma').length;
    const paschatCount = protocolDays.filter(d => d.stage === 'Paschatkarma').length;
    return { purvaCount, pradhanaCount, paschatCount };
  }, [protocolDays]);

  const toggleProcedure = (procId: string) => {
    setCompletedProcedures(prev => ({
      ...prev,
      [procId]: !prev[procId]
    }));
  };

  const toggleLakshana = (lakshanaKey: string) => {
    setCheckedLakshanas(prev => ({
      ...prev,
      [lakshanaKey]: !prev[lakshanaKey]
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  const copySummaryText = () => {
    const summary = `
=========================================
MEDIVERSE AYUSH - PANCHAKARMA CLINICAL PROTOCOL
=========================================
Patient: ${patient.name} (${patient.age}y / ${patient.gender})
Prakriti: ${patient.prakriti} | Kostha: ${patient.kostha}
Protocol: ${duration}-Day Clinical Course | Therapy: ${selectedTherapy.replace('pk_', '').toUpperCase()}
Target Shuddhi: ${patient.shuddhiTarget} | Start Date: ${patient.startDate}

STAGES BREAKDOWN:
- Purvakarma: Days 1 to ${stageStats.purvaCount} (Deepana, Pachana, Snehapana titration, Abhyanga, Swedana)
- Pradhanakarma: Days ${stageStats.purvaCount + 1} to ${stageStats.purvaCount + stageStats.pradhanaCount} (Main Elimination & Observation)
- Paschatkarma: Days ${stageStats.purvaCount + stageStats.pradhanaCount + 1} to ${duration} (Samsarjana Krama Dietary Ladder & Rasayana)

ACTIVE PROTOCOL FOR DAY ${currentDay.dayNumber}: ${currentDay.title}
Stage: ${currentDay.stage} (${currentDay.sanskritTitle})
Primary Procedure: ${currentDay.primaryKarma}

DIETARY STAGE:
${currentDay.diet.stageName} (Ladder Step ${currentDay.diet.ladderStep}/5)
Consistency: ${currentDay.diet.consistency}
Breakfast: ${currentDay.diet.meals.breakfast}
Lunch: ${currentDay.diet.meals.lunch}
Dinner: ${currentDay.diet.meals.dinner}
Hydration: ${currentDay.diet.hydration}

DOSHA BIO-RESPONSE:
Vata: ${currentDay.doshaState.vata}% | Pitta: ${currentDay.doshaState.pitta}% | Kapha: ${currentDay.doshaState.kapha}%
Agni Capacity: ${currentDay.doshaState.agni}% | Ama Level: ${currentDay.doshaState.ama}%
Clinical Rationale: ${currentDay.doshaState.rationale}
=========================================
    `.trim();

    navigator.clipboard.writeText(summary);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  return (
    <div className={styles.schedulerContainer}>
      {/* Top Header Section */}
      <header className={styles.headerSection}>
        <div className={styles.topBar}>
          <div className={styles.titleArea}>
            <h2>
              <Calendar className="text-sky-400" size={28} />
              Panchakarma Protocol Designer & Scheduler
            </h2>
            <div className={styles.sanskritSubtitle}>
              पञ्चकर्म चिकित्सा योजनाकार — चरक & सुश्रुत संहिता सम्मत नैदानिक मार्गदर्शिका
            </div>
          </div>

          <div className={styles.actionButtonGroup}>
            <button 
              className={styles.actionBtn} 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              title="Edit Patient & Clinical Parameters"
            >
              <User size={15} />
              {isProfileOpen ? 'Hide Patient' : 'Patient Profile'}
            </button>
            <button 
              className={styles.actionBtn}
              onClick={copySummaryText}
              title="Copy Clinical Prescription Summary"
            >
              {copiedSummary ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
              {copiedSummary ? 'Copied!' : 'Copy Summary'}
            </button>
            <button 
              className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
              onClick={() => setShowPrintModal(true)}
              title="Print Clinical Prescription Sheet"
            >
              <Printer size={15} />
              Prescription Print
            </button>
          </div>
        </div>

        {/* Patient Profile Expandable Bar */}
        {isProfileOpen && (
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-sm animate-fadeIn">
            <div>
              <label className="text-xs text-slate-400 font-semibold uppercase block mb-1">Patient Name</label>
              <input 
                type="text" 
                value={patient.name} 
                onChange={(e) => setPatient({...patient, name: e.target.value})}
                className={styles.selectInput}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 font-semibold uppercase block mb-1">Prakriti (Constitution)</label>
              <select 
                value={patient.prakriti} 
                onChange={(e) => setPatient({...patient, prakriti: e.target.value as any})}
                className={styles.selectInput}
                style={{ width: '100%' }}
              >
                <option value="Vata">Vata</option>
                <option value="Pitta">Pitta</option>
                <option value="Kapha">Kapha</option>
                <option value="Vata-Pitta">Vata-Pitta</option>
                <option value="Pitta-Kapha">Pitta-Kapha</option>
                <option value="Vata-Kapha">Vata-Kapha</option>
                <option value="Tridosha">Sama Tridosha</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 font-semibold uppercase block mb-1">Kostha (Bowel Motility)</label>
              <select 
                value={patient.kostha} 
                onChange={(e) => setPatient({...patient, kostha: e.target.value as any})}
                className={styles.selectInput}
                style={{ width: '100%' }}
              >
                <option value="Mridu (Soft)">Mridu (Soft / Fast)</option>
                <option value="Madhyama (Moderate)">Madhyama (Moderate)</option>
                <option value="Krura (Hard)">Krura (Hard / Costive)</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 font-semibold uppercase block mb-1">Shuddhi Target</label>
              <select 
                value={patient.shuddhiTarget} 
                onChange={(e) => setPatient({...patient, shuddhiTarget: e.target.value as any})}
                className={styles.selectInput}
                style={{ width: '100%' }}
              >
                <option value="Pravara (Maximum)">Pravara (Maximum / 30+ vegas)</option>
                <option value="Madhyama (Moderate)">Madhyama (Moderate / 20 vegas)</option>
                <option value="Hina (Mild)">Hina (Mild / 10 vegas)</option>
              </select>
            </div>
          </div>
        )}

        {/* Quick Patient Meta Strip */}
        <div className={styles.patientProfileBar}>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={styles.patientMetaTag}><User size={13} className="text-sky-400" /> Patient: <strong>{patient.name}</strong></span>
            <span className={styles.patientMetaTag}>Prakriti: <strong>{patient.prakriti}</strong></span>
            <span className={styles.patientMetaTag}>Kostha: <strong>{patient.kostha}</strong></span>
            <span className={styles.patientMetaTag}>Target: <strong>{patient.shuddhiTarget}</strong></span>
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-1">
            <Clock size={13} /> Active Day: <strong className="text-sky-300">Day {selectedDayNum} of {duration}</strong>
          </div>
        </div>

        {/* Master Controls: Protocol Duration & Primary Therapy */}
        <div className={styles.controlsGrid}>
          {/* Duration Selector */}
          <div className={styles.controlField}>
            <label className={styles.controlLabel}>
              <Clock size={14} className="text-amber-400" /> Course Duration
            </label>
            <div className={styles.pillGroup}>
              <button 
                className={`${styles.pillBtn} ${duration === 7 ? styles.pillActive : ''}`}
                onClick={() => { setDuration(7); if (selectedDayNum > 7) setSelectedDayNum(7); }}
              >
                7 Days (Laghu)
              </button>
              <button 
                className={`${styles.pillBtn} ${duration === 14 ? styles.pillActive : ''}`}
                onClick={() => { setDuration(14); if (selectedDayNum > 14) setSelectedDayNum(14); }}
              >
                14 Days (Madhyama)
              </button>
              <button 
                className={`${styles.pillBtn} ${duration === 21 ? styles.pillActive : ''}`}
                onClick={() => setDuration(21)}
              >
                21 Days (Maha)
              </button>
            </div>
          </div>

          {/* Primary Therapy Selector */}
          <div className={styles.controlField}>
            <label className={styles.controlLabel}>
              <Flame size={14} className="text-red-400" /> Primary Pradhanakarma
            </label>
            <select 
              value={selectedTherapy} 
              onChange={(e) => setSelectedTherapy(e.target.value as TherapyType)}
              className={styles.selectInput}
            >
              <option value="pk_virechana">Virechana (Purgation - Pitta / Rakta / Liver)</option>
              <option value="pk_vamana">Vamana (Therapeutic Emesis - Kapha / Meda / Lungs)</option>
              <option value="pk_basti">Basti (Medicated Enemas - Vata / Joints / Spine)</option>
              <option value="pk_nasya">Nasya (Nasal Therapy - Urdhwajatrugata / Head & Neck)</option>
              <option value="pk_raktamokshana">Raktamokshana (Bloodletting - Pitta-Rakta / Skin)</option>
            </select>
          </div>
        </div>

        {/* 3 Classical Stages Summary Banner */}
        <div className={styles.stagesBar}>
          <div className={`${styles.stageCard} ${styles.stagePurva} ${currentDay.stage === 'Purvakarma' ? styles.stageCardActive : ''}`}>
            <div className={styles.stageHeader}>
              <span>1. पूर्वकर्म (Purvakarma)</span>
              <span className={styles.stageDaysBadge}>Days 1 - {stageStats.purvaCount}</span>
            </div>
            <div className={styles.stageDesc}>
              Deepana, Pachana, Snehapana (medicated ghee titration), Sarvanga Abhyanga & Bashpa Swedana.
            </div>
          </div>

          <div className={`${styles.stageCard} ${styles.stagePradhana} ${currentDay.stage === 'Pradhanakarma' ? styles.stageCardActive : ''}`}>
            <div className={styles.stageHeader}>
              <span>2. प्रधानकर्म (Pradhanakarma)</span>
              <span className={styles.stageDaysBadge}>
                {duration === 7 ? 'Day 4' : `Days ${stageStats.purvaCount + 1} - ${stageStats.purvaCount + stageStats.pradhanaCount}`}
              </span>
            </div>
            <div className={styles.stageDesc}>
              Core bio-cleansing evacuation (Virechana / Vamana / Basti), continuous Vega and vital sign monitoring.
            </div>
          </div>

          <div className={`${styles.stageCard} ${styles.stagePaschat} ${currentDay.stage === 'Paschatkarma' ? styles.stageCardActive : ''}`}>
            <div className={styles.stageHeader}>
              <span>3. पश्चात्कर्म (Paschatkarma)</span>
              <span className={styles.stageDaysBadge}>
                {`Days ${stageStats.purvaCount + stageStats.pradhanaCount + 1} - ${duration}`}
              </span>
            </div>
            <div className={styles.stageDesc}>
              Graded Samsarjana Krama dietary ladder (Manda → Peya → Vilepi → Yusha) & Rasayana rejuvenation.
            </div>
          </div>
        </div>
      </header>

      {/* Interactive Day Timeline Calendar Ribbon */}
      <section className={styles.timelineRibbonSection}>
        <div className={styles.ribbonHeader}>
          <div className={styles.ribbonTitle}>
            <Calendar size={16} className="text-sky-400" />
            <span>Interactive Timeline Calendar</span>
          </div>
          <div className="flex items-center gap-1">
            <button 
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={selectedDayNum <= 1}
              onClick={() => setSelectedDayNum(Math.max(1, selectedDayNum - 1))}
              title="Previous Day"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs text-slate-400 px-1 font-semibold">
              Day {selectedDayNum} / {duration}
            </span>
            <button 
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={selectedDayNum >= duration}
              onClick={() => setSelectedDayNum(Math.min(duration, selectedDayNum + 1))}
              title="Next Day"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className={styles.dayCarousel}>
          {protocolDays.map((d) => {
            const isSelected = d.dayNumber === selectedDayNum;
            let tagClass = styles.tagPurva;
            if (d.stage === 'Pradhanakarma') tagClass = styles.tagPradhana;
            if (d.stage === 'Paschatkarma') tagClass = styles.tagPaschat;

            return (
              <div 
                key={d.dayNumber}
                className={`${styles.dayCard} ${isSelected ? styles.dayCardSelected : ''}`}
                onClick={() => setSelectedDayNum(d.dayNumber)}
              >
                <div className={styles.dayCardTop}>
                  <span className={styles.dayNumber}>D{d.dayNumber}</span>
                  <span className={`${styles.dayStageTag} ${tagClass}`}>
                    {d.stage === 'Purvakarma' ? 'Purva' : d.stage === 'Pradhanakarma' ? 'Pradhana' : 'Paschat'}
                  </span>
                </div>
                <div className={styles.dayCardKarma}>
                  {d.primaryKarma}
                </div>
                <div className={styles.dayCardBottom}>
                  <span>{d.diet.stageName.split(' ')[0]}</span>
                  <div className={styles.doshaMiniDots}>
                    <span className={`${styles.miniDot} ${styles.miniDotVata}`} title={`Vata: ${d.doshaState.vata}%`} />
                    <span className={`${styles.miniDot} ${styles.miniDotPitta}`} title={`Pitta: ${d.doshaState.pitta}%`} />
                    <span className={`${styles.miniDot} ${styles.miniDotKapha}`} title={`Kapha: ${d.doshaState.kapha}%`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Main Split Workspace Grid */}
      <main className={styles.mainWorkspaceGrid}>
        {/* Left Area: Selected Day Full Clinical Protocol */}
        <div className={styles.dayDetailCard}>
          {/* Day Detail Header */}
          <div className={styles.dayDetailHeader}>
            <div className={styles.dayTitleWrap}>
              <h3>
                Day {currentDay.dayNumber}: {currentDay.primaryKarma}
              </h3>
              <div className={styles.daySubtitle}>
                {currentDay.stageSubtype} • <span className="text-sky-400">{currentDay.sanskritTitle}</span>
              </div>
            </div>

            <div className={styles.dayBadgeGroup}>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                currentDay.stage === 'Purvakarma' 
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                  : currentDay.stage === 'Pradhanakarma' 
                  ? 'bg-red-500/20 text-red-300 border border-red-500/40' 
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}>
                {currentDay.stage}
              </span>
              <span className="text-xs bg-slate-800 text-slate-300 border border-slate-700 px-2.5 py-1 rounded-full font-medium">
                Agni: {currentDay.vitals.agniLevel}
              </span>
            </div>
          </div>

          {/* Navigation Tabs for Selected Day */}
          <div className={styles.detailTabs}>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'procedures' ? styles.activeTabBtn : ''}`}
              onClick={() => setActiveTab('procedures')}
            >
              <Clock size={15} />
              Procedures ({currentDay.procedures.length})
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'formulations' ? styles.activeTabBtn : ''}`}
              onClick={() => setActiveTab('formulations')}
            >
              <Pill size={15} />
              Herbal Prescriptions ({currentDay.formulations.length})
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'diet' ? styles.activeTabBtn : ''}`}
              onClick={() => setActiveTab('diet')}
            >
              <Utensils size={15} />
              Dietary Ladder ({currentDay.diet.stageName})
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'vitals' ? styles.activeTabBtn : ''}`}
              onClick={() => setActiveTab('vitals')}
            >
              <Activity size={15} />
              Vitals & Lakshana
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'rules' ? styles.activeTabBtn : ''}`}
              onClick={() => setActiveTab('rules')}
            >
              <ShieldAlert size={15} />
              Swasthavritta Rules
            </button>
          </div>

          {/* Tab 1: Procedural Workflow */}
          {activeTab === 'procedures' && (
            <div className={styles.tabContent}>
              <div className={styles.procedureTimeline}>
                {currentDay.procedures.map((proc) => {
                  const isDone = !!completedProcedures[proc.id];
                  return (
                    <div key={proc.id} className={styles.procItem}>
                      <div className={styles.procTimeCol}>
                        <span className={styles.procTime}>{proc.time}</span>
                        <span className={styles.procDuration}>{proc.durationMin} mins</span>
                      </div>
                      <div className={styles.procMainCol}>
                        <div className={styles.procHeader}>
                          <div>
                            <span className={styles.procName}>{proc.name}</span>
                            <span className={styles.procSanskrit}> ({proc.sanskritName})</span>
                          </div>
                        </div>
                        <p className={styles.procDesc}>{proc.description}</p>
                        <div className={styles.procMetaList}>
                          {proc.herbsUsed.map((h, i) => (
                            <span key={i} className={styles.procMetaTag}>🌿 {h}</span>
                          ))}
                          {proc.precautions.map((p, i) => (
                            <span key={i} className={`${styles.procMetaTag} text-amber-300 border-amber-700/40`}>⚠️ {p}</span>
                          ))}
                        </div>
                      </div>
                      <button 
                        className={`${styles.procCompleteBtn} ${isDone ? styles.procCompleted : ''}`}
                        onClick={() => toggleProcedure(proc.id)}
                        title={isDone ? 'Completed' : 'Mark as done'}
                      >
                        <CheckCircle2 size={18} />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Snehapana Titration Special Widget if in Snehapana */}
              {currentDay.stageSubtype.includes('Snehapana') && (
                <div className="bg-slate-900 border border-amber-500/30 rounded-lg p-3.5 mt-2 flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs font-bold text-amber-400">
                    <span>📈 SNEHAPANA TITRATION CURVE (AROPI SNEHA)</span>
                    <span>Target Max: 150-180 ml</span>
                  </div>
                  <div className="flex items-end gap-1.5 h-16 bg-slate-950 p-2 rounded border border-slate-800">
                    {[1, 2, 3, 4, 5].map((d) => {
                      const dose = 30 + (d - 1) * 30;
                      const isCurrent = currentDay.dayNumber === d + 1;
                      return (
                        <div key={d} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                          <div 
                            className={`w-full rounded-t transition-all ${isCurrent ? 'bg-amber-400' : 'bg-amber-700/50'}`}
                            style={{ height: `${(dose / 180) * 100}%` }}
                          />
                          <span className={`text-[10px] ${isCurrent ? 'font-bold text-amber-300' : 'text-slate-500'}`}>
                            {dose}ml
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-xs text-slate-300 italic">
                    Administer medicated ghee warm at sunrise on empty stomach. Sip lukewarm water until digested.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Herbal Formulations */}
          {activeTab === 'formulations' && (
            <div className={styles.tabContent}>
              <div className={styles.formulationGrid}>
                {currentDay.formulations.map((form) => (
                  <div key={form.id} className={styles.formulationCard}>
                    <div className={styles.formulationHeader}>
                      <div>
                        <div className={styles.formulationName}>{form.name}</div>
                        <div className="text-xs text-sky-400 italic">{form.sanskritName}</div>
                      </div>
                      <span className={styles.formulationTypeTag}>{form.type}</span>
                    </div>

                    <div className={styles.formulationDoseRow}>
                      <div><strong>Dose:</strong> {form.dosage}</div>
                      <div><strong>Anupana:</strong> {form.anupana}</div>
                    </div>

                    <div className="text-xs text-slate-300 bg-slate-900 p-2 rounded border border-slate-800">
                      <strong>Timing:</strong> {form.timeOfIntake}
                    </div>

                    <div className={styles.formulationPurpose}>
                      💡 {form.purpose}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Dietary Ladder (Samsarjana Krama) */}
          {activeTab === 'diet' && (
            <div className={styles.tabContent}>
              <div className={styles.dietLadderView}>
                {/* 4-Step Samsarjana Visual Ladder */}
                <div>
                  <div className="text-xs font-bold uppercase text-slate-400 mb-2 flex items-center gap-1.5">
                    <Layers size={14} className="text-emerald-400" />
                    Samsarjana Krama Dietary Reconstruction Ladder (अग्नि दीपन क्रम)
                  </div>
                  <div className={styles.ladderSteps}>
                    <div className={`${styles.ladderStepItem} ${currentDay.diet.ladderStep === 1 ? styles.ladderActive : ''}`}>
                      <span className={styles.ladderStepNum}>Step 1</span>
                      <span className={styles.ladderStepTitle}>Manda (मण्ड)</span>
                      <span className={styles.ladderStepRatio}>1:14 (Clear Water)</span>
                      <span className="text-[11px] text-slate-400">Deepana Awakening</span>
                    </div>

                    <div className={`${styles.ladderStepItem} ${currentDay.diet.ladderStep === 2 ? styles.ladderActive : ''}`}>
                      <span className={styles.ladderStepNum}>Step 2</span>
                      <span className={styles.ladderStepTitle}>Peya (पेया)</span>
                      <span className={styles.ladderStepRatio}>1:4 (Thin Gruel)</span>
                      <span className="text-[11px] text-slate-400">Gentle Digestion</span>
                    </div>

                    <div className={`${styles.ladderStepItem} ${currentDay.diet.ladderStep === 3 ? styles.ladderActive : ''}`}>
                      <span className={styles.ladderStepNum}>Step 3</span>
                      <span className={styles.ladderStepTitle}>Vilepi (विलेपी)</span>
                      <span className={styles.ladderStepRatio}>1:4 (Thick Paste)</span>
                      <span className="text-[11px] text-slate-400">Nutritive Base</span>
                    </div>

                    <div className={`${styles.ladderStepItem} ${currentDay.diet.ladderStep >= 4 ? styles.ladderActive : ''}`}>
                      <span className={styles.ladderStepNum}>Step 4 & 5</span>
                      <span className={styles.ladderStepTitle}>Yusha (यूष)</span>
                      <span className={styles.ladderStepRatio}>1:6 (Moong Soup)</span>
                      <span className="text-[11px] text-slate-400">Protein Restoration</span>
                    </div>
                  </div>
                </div>

                {/* Day-specific Meal Plan */}
                <div className={styles.mealPlanGrid}>
                  <div className={styles.mealCard}>
                    <div className={styles.mealName}>🌅 Morning / Breakfast</div>
                    <div className={styles.mealItem}>{currentDay.diet.meals.breakfast}</div>
                  </div>

                  <div className={styles.mealCard}>
                    <div className={styles.mealName}>☀️ Midday / Lunch</div>
                    <div className={styles.mealItem}>{currentDay.diet.meals.lunch}</div>
                  </div>

                  <div className={styles.mealCard}>
                    <div className={styles.mealName}>🍵 Afternoon Sip</div>
                    <div className={styles.mealItem}>{currentDay.diet.meals.evening}</div>
                  </div>

                  <div className={styles.mealCard}>
                    <div className={styles.mealName}>🌙 Evening / Dinner</div>
                    <div className={styles.mealItem}>{currentDay.diet.meals.dinner}</div>
                  </div>
                </div>

                {/* Diet Guidelines Notice */}
                <div className={styles.dietNoticeBox}>
                  <strong>Hydration Order:</strong> {currentDay.diet.hydration}
                  <div className="mt-1 text-xs text-amber-200">
                    🚫 <strong>Avoid:</strong> {currentDay.diet.contraindicatedFoods.join(', ')}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Vitals & Lakshana Monitoring */}
          {activeTab === 'vitals' && (
            <div className={styles.tabContent}>
              <div className={styles.vitalsMonitoringView}>
                <div className={styles.vitalsMetricsGrid}>
                  <div className={styles.vitalMetricBox}>
                    <div className={styles.vitalMetricLabel}>Blood Pressure</div>
                    <div className={styles.vitalMetricValue}>{currentDay.vitals.bp}</div>
                  </div>
                  <div className={styles.vitalMetricBox}>
                    <div className={styles.vitalMetricLabel}>Heart Rate</div>
                    <div className={styles.vitalMetricValue}>{currentDay.vitals.hr}</div>
                  </div>
                  <div className={styles.vitalMetricBox}>
                    <div className={styles.vitalMetricLabel}>Body Temperature</div>
                    <div className={styles.vitalMetricValue}>{currentDay.vitals.temp}</div>
                  </div>
                  <div className={styles.vitalMetricBox}>
                    <div className={styles.vitalMetricLabel}>Agni Intensity</div>
                    <div className="text-base font-bold text-amber-400">{currentDay.vitals.agniLevel}</div>
                  </div>
                  {currentDay.vitals.targetVegas !== undefined && (
                    <div className={styles.vitalMetricBox}>
                      <div className={styles.vitalMetricLabel}>Target Vega Count</div>
                      <div className="text-xl font-bold text-emerald-400">{currentDay.vitals.targetVegas} Vegas</div>
                    </div>
                  )}
                </div>

                {/* Sneha Jeerna Checkpoints if applicable */}
                {currentDay.vitals.snehaJirnaAssessment && currentDay.vitals.snehaJirnaAssessment.length > 0 && (
                  <div className={styles.checklistSection}>
                    <div className={styles.checklistTitle}>
                      <CheckCircle2 size={16} className="text-amber-400" />
                      Sneha Jeerna Pariksha (Digestion of Medicated Ghee Signs)
                    </div>
                    {currentDay.vitals.snehaJirnaAssessment.map((sign, idx) => {
                      const key = `sneha_${currentDay.dayNumber}_${idx}`;
                      return (
                        <label key={idx} className={styles.checklistItem}>
                          <input 
                            type="checkbox" 
                            checked={!!checkedLakshanas[key]} 
                            onChange={() => toggleLakshana(key)}
                          />
                          <span>{sign}</span>
                        </label>
                      );
                    })}
                  </div>
                )}

                {/* Samyak Lakshana Checklist */}
                <div className={styles.checklistSection}>
                  <div className={styles.checklistTitle}>
                    <Sparkles size={16} className="text-emerald-400" />
                    Samyak Lakshana (Optimal Signs of Procedure)
                  </div>
                  {currentDay.vitals.samyakLakshana.map((lakshana, idx) => {
                    const key = `lakshana_${currentDay.dayNumber}_${idx}`;
                    return (
                      <label key={idx} className={styles.checklistItem}>
                        <input 
                          type="checkbox" 
                          checked={!!checkedLakshanas[key]} 
                          onChange={() => toggleLakshana(key)}
                        />
                        <span>{lakshana}</span>
                      </label>
                    );
                  })}
                </div>

                {/* Danger Signs & Red Flags */}
                {currentDay.vitals.dangerSigns.length > 0 && (
                  <div className={styles.warningBox}>
                    <strong>⚠️ Red Flag Signs (Atiyoga / Emergency Protocols):</strong>
                    <ul className="list-disc list-inside mt-1">
                      {currentDay.vitals.dangerSigns.map((w, idx) => (
                        <li key={idx}>{w}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 5: Swasthavritta Rules */}
          {activeTab === 'rules' && (
            <div className={styles.tabContent}>
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col gap-3">
                <div className="text-sm font-bold text-amber-400 flex items-center gap-2">
                  <ShieldAlert size={18} />
                  Ashta Mahadosha Varjana (8 Prohibited Behaviors During Panchakarma)
                </div>
                <p className="text-xs text-slate-300">
                  Charaka Samhita explicitly mandates the strict avoidance of these 8 factors during Purva, Pradhana, and Paschat stages to prevent Vata aggravation and relapse:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                  {currentDay.swasthavrittaRules.map((rule, idx) => (
                    <div key={idx} className="bg-slate-950 border border-slate-800 p-2.5 rounded text-xs text-slate-200 flex items-start gap-2">
                      <span className="text-amber-400 font-bold">{idx + 1}.</span>
                      <span>{rule}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Visual Dosha Balance Response Indicator */}
        <aside className={styles.sidebarSection}>
          {/* Dynamic Dosha Gauges Card */}
          <div className={styles.doshaMonitorCard}>
            <h4 className={styles.cardHeading}>
              <Activity size={18} className="text-sky-400" />
              Dosha Balance Response
            </h4>

            <div className="text-xs text-slate-400">
              Real-time physiological equilibrium state for Day {currentDay.dayNumber}:
            </div>

            {/* Dosha Progress Bars */}
            <div className={styles.doshaGaugesGrid}>
              {/* Vata Bar */}
              <div className={styles.doshaBarItem}>
                <div className={styles.doshaBarLabelRow}>
                  <span className="text-sky-400 flex items-center gap-1">
                    <Wind size={13} /> Vata Dosha
                  </span>
                  <span className="text-sky-300">{currentDay.doshaState.vata}%</span>
                </div>
                <div className={styles.doshaBarTrack}>
                  <div 
                    className={`${styles.doshaBarFill} ${styles.fillVata}`} 
                    style={{ width: `${currentDay.doshaState.vata}%` }}
                  />
                </div>
              </div>

              {/* Pitta Bar */}
              <div className={styles.doshaBarItem}>
                <div className={styles.doshaBarLabelRow}>
                  <span className="text-amber-400 flex items-center gap-1">
                    <Flame size={13} /> Pitta Dosha
                  </span>
                  <span className="text-amber-300">{currentDay.doshaState.pitta}%</span>
                </div>
                <div className={styles.doshaBarTrack}>
                  <div 
                    className={`${styles.doshaBarFill} ${styles.fillPitta}`} 
                    style={{ width: `${currentDay.doshaState.pitta}%` }}
                  />
                </div>
              </div>

              {/* Kapha Bar */}
              <div className={styles.doshaBarItem}>
                <div className={styles.doshaBarLabelRow}>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <Droplets size={13} /> Kapha Dosha
                  </span>
                  <span className="text-emerald-300">{currentDay.doshaState.kapha}%</span>
                </div>
                <div className={styles.doshaBarTrack}>
                  <div 
                    className={`${styles.doshaBarFill} ${styles.fillKapha}`} 
                    style={{ width: `${currentDay.doshaState.kapha}%` }}
                  />
                </div>
              </div>

              {/* Agni Capacity Bar */}
              <div className={styles.doshaBarItem}>
                <div className={styles.doshaBarLabelRow}>
                  <span className="text-orange-400 flex items-center gap-1">
                    <Flame size={13} /> Agni (Digestive Fire)
                  </span>
                  <span className="text-orange-300">{currentDay.doshaState.agni}%</span>
                </div>
                <div className={styles.doshaBarTrack}>
                  <div 
                    className={`${styles.doshaBarFill} ${styles.fillAgni}`} 
                    style={{ width: `${currentDay.doshaState.agni}%` }}
                  />
                </div>
              </div>

              {/* Ama Clearance Bar */}
              <div className={styles.doshaBarItem}>
                <div className={styles.doshaBarLabelRow}>
                  <span className="text-purple-400 flex items-center gap-1">
                    <ShieldAlert size={13} /> Ama (Toxin Burden)
                  </span>
                  <span className="text-purple-300">{currentDay.doshaState.ama}%</span>
                </div>
                <div className={styles.doshaBarTrack}>
                  <div 
                    className={`${styles.doshaBarFill} ${styles.fillAma}`} 
                    style={{ width: `${currentDay.doshaState.ama}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Ayurvedic Pathophysiology Rationale */}
            <div className={styles.doshaExplanationBox}>
              <div className="font-bold text-sky-400 text-xs mb-1">🌿 Clinical Mechanism:</div>
              {currentDay.doshaState.rationale}
            </div>
          </div>

          {/* Full Course Dosha Progression Radar / Trend Chart */}
          <div className={styles.titrationCard}>
            <div className="flex justify-between items-center text-xs font-bold text-slate-300">
              <span>📊 Full Course Dosha Trajectory</span>
              <span className="text-slate-400">Days 1 - {duration}</span>
            </div>

            {/* SVG Trend Mini Line Chart */}
            <svg viewBox={`0 0 ${duration * 20} 80`} className={styles.titrationChartSvg}>
              {/* Grid Lines */}
              <line x1="0" y1="20" x2={duration * 20} y2="20" stroke="#334155" strokeDasharray="2" strokeWidth="0.5" />
              <line x1="0" y1="40" x2={duration * 20} y2="40" stroke="#334155" strokeDasharray="2" strokeWidth="0.5" />
              <line x1="0" y1="60" x2={duration * 20} y2="60" stroke="#334155" strokeDasharray="2" strokeWidth="0.5" />

              {/* Vata Line */}
              <polyline 
                fill="none" 
                stroke="#38bdf8" 
                strokeWidth="2" 
                points={protocolDays.map((d, i) => `${i * 20 + 10},${80 - (d.doshaState.vata * 0.7)}`).join(' ')} 
              />
              {/* Pitta Line */}
              <polyline 
                fill="none" 
                stroke="#fbbf24" 
                strokeWidth="2" 
                points={protocolDays.map((d, i) => `${i * 20 + 10},${80 - (d.doshaState.pitta * 0.7)}`).join(' ')} 
              />
              {/* Kapha Line */}
              <polyline 
                fill="none" 
                stroke="#34d399" 
                strokeWidth="2" 
                points={protocolDays.map((d, i) => `${i * 20 + 10},${80 - (d.doshaState.kapha * 0.7)}`).join(' ')} 
              />

              {/* Current Day Pointer Marker */}
              <line 
                x1={(selectedDayNum - 1) * 20 + 10} 
                y1="0" 
                x2={(selectedDayNum - 1) * 20 + 10} 
                y2="80" 
                stroke="#ffffff" 
                strokeWidth="1.5" 
                strokeDasharray="3" 
              />
            </svg>

            <div className="flex justify-between items-center text-[10px] text-slate-400">
              <span className="flex items-center gap-1 text-sky-400"><span className="w-2 h-2 rounded-full bg-sky-400 inline-block"/> Vata</span>
              <span className="flex items-center gap-1 text-amber-400"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block"/> Pitta</span>
              <span className="flex items-center gap-1 text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"/> Kapha</span>
            </div>
          </div>
        </aside>
      </main>

      {/* Prescription Print Modal */}
      {showPrintModal && (
        <div className={styles.modalOverlay} onClick={() => setShowPrintModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className="flex items-center gap-2">
                <Printer className="text-emerald-400" size={20} />
                <h3 className="text-lg font-bold text-white">Clinical Panchakarma Protocol & Prescription</h3>
              </div>
              <button className={styles.modalCloseBtn} onClick={() => setShowPrintModal(false)}>✕</button>
            </div>

            <div className={styles.modalBody}>
              <div className="border-b border-slate-700 pb-3 flex justify-between items-start flex-wrap gap-2 text-xs">
                <div>
                  <div className="font-bold text-white text-sm">MEDIVERSE AYURVEDIC CLINICAL RESEARCH CENTER</div>
                  <div className="text-slate-400">Department of Panchakarma & Kayachikitsa</div>
                </div>
                <div className="text-right text-slate-400">
                  <div>Date: {patient.startDate}</div>
                  <div>Protocol ID: PK-{duration}D-{patient.name.substring(0, 3).toUpperCase()}</div>
                </div>
              </div>

              {/* Patient Card in Print Modal */}
              <div className="bg-slate-900 p-3 rounded border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div>Patient: <strong className="text-white">{patient.name}</strong></div>
                <div>Age/Gender: <strong className="text-white">{patient.age}y / {patient.gender}</strong></div>
                <div>Prakriti: <strong className="text-white">{patient.prakriti}</strong></div>
                <div>Course: <strong className="text-emerald-400">{duration}-Day Protocol</strong></div>
              </div>

              {/* Summary Schedule Table */}
              <div className="flex flex-col gap-2">
                <div className="font-bold text-white text-xs uppercase text-slate-400">Full Schedule Breakdown:</div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border border-slate-800">
                    <thead className="bg-slate-900 text-slate-300">
                      <tr>
                        <th className="p-2 border border-slate-800">Day</th>
                        <th className="p-2 border border-slate-800">Stage</th>
                        <th className="p-2 border border-slate-800">Primary Karma</th>
                        <th className="p-2 border border-slate-800">Dietary Stage</th>
                        <th className="p-2 border border-slate-800">Medication</th>
                      </tr>
                    </thead>
                    <tbody>
                      {protocolDays.map((d) => (
                        <tr key={d.dayNumber} className="border-b border-slate-800 hover:bg-slate-900/50">
                          <td className="p-2 font-bold text-sky-400 border border-slate-800">D{d.dayNumber}</td>
                          <td className="p-2 border border-slate-800">{d.stage}</td>
                          <td className="p-2 border border-slate-800">{d.primaryKarma}</td>
                          <td className="p-2 border border-slate-800">{d.diet.stageName}</td>
                          <td className="p-2 border border-slate-800">
                            {d.formulations.length > 0 ? d.formulations.map(f => f.name).join(', ') : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Action Buttons in Modal */}
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button 
                  className={styles.actionBtn}
                  onClick={() => setShowPrintModal(false)}
                >
                  Close
                </button>
                <button 
                  className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                  onClick={handlePrint}
                >
                  <Printer size={15} />
                  Print Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
