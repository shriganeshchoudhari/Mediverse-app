import React from 'react';
import Link from 'next/link';
import { Activity, Wind, Brain, Droplets, FlaskConical, Stethoscope, Gauge, Heart, Radio, Microscope, Baby, Flame, Dna, Zap, Compass, Cpu, Scissors, ShieldAlert, Eye, Ear, Skull } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Virtual Physiology Labs & Solvers | Mediverse',
  description: 'Interactive mathematical simulation engines for cardiovascular, respiratory, renal, and electrophysiology systems.',
};

const SIMULATORS = [
  {
    id: 'lifelike-heart',
    title: 'Photorealistic Living Heart 3D',
    description: 'Explore living biological tissue shaders, dual-phase Wiggers pumping, apical wringing torsion, and cross-sectional dissection.',
    icon: <Heart className="w-7 h-7 text-rose-500 animate-pulse" />,
    badge: '3D Biomechanics',
    status: 'Available'
  },
  {
    id: 'acid-base',
    title: 'Acid-Base & Davenport Nomogram',
    description: 'Solve Henderson-Hasselbalch, analyze Anion Gap & Winter\'s compensation, and explore live 2D Davenport buffer lines.',
    icon: <FlaskConical className="w-7 h-7 text-teal-400" />,
    badge: 'Acid-Base Engine',
    status: 'Available'
  },
  {
    id: 'lab-interpretation',
    title: 'Diagnostic Lab & Blood Gas (ABG/VBG) Solver',
    description: 'Solve complex multi-disorder acid-base disturbances, Winter\'s formula, Delta-Delta ratios, microcytic/macrocytic anemia, osmolar gap, and 1:1 coagulation mixing studies.',
    icon: <Microscope className="w-7 h-7 text-emerald-400" />,
    badge: 'Diagnostic Laboratory',
    status: 'Available'
  },
  {
    id: 'mechanical-ventilation',
    title: 'Mechanical Ventilation & Respiratory Mechanics',
    description: 'Equation of motion solver: VCV/PCV waveforms, inspiratory hold mechanics (Pplat, Raw, Cstat), driving pressure, auto-PEEP, and ARDSNet PBW lung-protective titration.',
    icon: <Wind className="w-7 h-7 text-cyan-400" />,
    badge: 'Critical Care ICU',
    status: 'Available'
  },
  {
    id: 'pediatric-resuscitation',
    title: 'Pediatric & Neonatal Resuscitation (PALS / NRP)',
    description: 'Broselow tape weight estimation, pediatric endotracheal sizing, PALS weight-based emergency drug calculator, and NRP Golden Minute APGAR scoring.',
    icon: <Baby className="w-7 h-7 text-rose-400" />,
    badge: 'Pediatric Emergency',
    status: 'Available'
  },
  {
    id: 'cpet',
    title: 'Cardiopulmonary Exercise Testing (CPET)',
    description: 'Wasserman 9-panel diagnostic workstation: VO2 peak, anaerobic threshold (V-slope), ventilatory efficiency (VE/VCO2 slope), O2 pulse kinetics, breathing reserve, and exercise limitation classification.',
    icon: <Flame className="w-7 h-7 text-amber-400" />,
    badge: 'Metabolic Ergometry',
    status: 'Available'
  },
  {
    id: 'anesthesia-machine',
    title: 'Anesthesia Delivery & Vaporizer Workstation',
    description: 'Circle breathing system physics, Link-25 hypoxic guard, low-flow anesthesia kinetics, age-adjusted MAC, FA/FI uptake curves, CO2 absorber exhaustion, and Malignant Hyperthermia Dantrolene protocol.',
    icon: <Gauge className="w-7 h-7 text-amber-400" />,
    badge: 'Anesthesiology & Critical Care',
    status: 'Available'
  },
  {
    id: 'pharmacogenomics',
    title: 'Clinical Pharmacogenomics (PGx) & Precision Therapeutics',
    description: 'Star allele diplotype calling, CPIC Level 1A CDS rules (Clopidogrel, Codeine, 6-MP, 5-FU, Abacavir HLA-B*57:01), IWPC precision warfarin dosing, and 14-day INR kinetics.',
    icon: <Dna className="w-7 h-7 text-indigo-400" />,
    badge: 'Precision Therapeutics',
    status: 'Available'
  },
  {
    id: 'crrt',
    title: 'Continuous Renal Replacement Therapy (CRRT)',
    description: 'Extracorporeal blood purification: SCUF, CVVH, CVVHD, CVVHDF, TMP & filter clotting hydraulics, KDIGO effluent dosing, and regional citrate anticoagulation.',
    icon: <Droplets className="w-7 h-7 text-sky-400" />,
    badge: 'Critical Care Nephrology',
    status: 'Available'
  },
  {
    id: 'icp-dynamics',
    title: 'Neurocritical Care & ICP Dynamics',
    description: 'Monro-Kellie volume-pressure elastance, P1-P3 pulse waveform morphology, Lundberg A/B/C waves, and Brain Trauma Foundation (BTF) tiered intracranial hypertension protocols.',
    icon: <Brain className="w-7 h-7 text-purple-400" />,
    badge: 'Neurocritical Care',
    status: 'Available'
  },
  {
    id: 'cardiac-pacing',
    title: 'Temporary Pacemaker & Electrophysiology',
    description: 'Transvenous EPG mechanics: NASPE/BPEG modes (VVI, DDD, VOO), capture/sensing thresholds, R-on-T VF prevention, and pacemaker syndrome hemodynamics.',
    icon: <Zap className="w-7 h-7 text-amber-400" />,
    badge: 'Cardiac Electrophysiology',
    status: 'Available'
  },
  {
    id: 'iabp-counterpulsation',
    title: 'Intra-Aortic Balloon Pump (IABP) Workstation',
    description: 'Mechanical circulatory support: diastolic coronary augmentation, presystolic afterload reduction, dicrotic notch timing errors, and arterial line waveform analysis.',
    icon: <Heart className="w-7 h-7 text-rose-500 animate-pulse" />,
    badge: 'Mechanical Support',
    status: 'Available'
  },
  {
    id: 'ecmo-dynamics',
    title: 'Extracorporeal Membrane Oxygenation (ECMO)',
    description: 'VV & VA cannulation mechanics: sweep gas CO2 clearance, recirculation fraction, drainage chattering, Harlequin syndrome dual circulation, and ECPELLA LV venting.',
    icon: <Droplets className="w-7 h-7 text-sky-400" />,
    badge: 'Critical Care ECMO',
    status: 'Available'
  },
  {
    id: 'tee-navigation',
    title: 'Transesophageal Echocardiography (TEE) Workstation',
    description: 'ASE/SCA 28-view navigation, omniplane multiplane crystal rotation, aortic stenosis continuity equation, diastolic grading, and RVSP hemodynamics.',
    icon: <Compass className="w-7 h-7 text-cyan-400" />,
    badge: 'Cardiothoracic TEE',
    status: 'Available'
  },
  {
    id: 'cpb-perfusion',
    title: 'Cardiopulmonary Bypass (CPB) & Perfusion',
    description: 'Heart-lung machine hydraulics: roller vs centrifugal pumps, VAVD drainage, hypothermic gas strategies, cardioplegia arrest, and protamine stoichiometry.',
    icon: <Heart className="w-7 h-7 text-rose-500 animate-pulse" />,
    badge: 'Cardiothoracic CPB',
    status: 'Available'
  },
  {
    id: 'bronchoscopy-navigation',
    title: 'Flexible Bronchoscopy & EBUS Staging',
    description: '18-segment tracheobronchial navigation, EBUS mediastinal lymph node staging (Stations 2-11), TBNA needle aspiration, and massive hemoptysis emergencies.',
    icon: <Wind className="w-7 h-7 text-cyan-400" />,
    badge: 'Pulmonology & EBUS',
    status: 'Available'
  },
  {
    id: 'cardiac-cycle',
    title: 'Cardiac Cycle & PV Loop',
    description: 'Manipulate preload, afterload, and contractility to instantly visualize Suga-Sagawa pressure-volume loops and Wiggers dynamics.',
    icon: <Activity className="w-7 h-7 text-rose-400" />,
    badge: 'Hemodynamics',
    status: 'Available'
  },
  {
    id: 'renal-filtration',
    title: 'Renal Clearance & GFR',
    description: 'Adjust afferent/efferent arteriole resistance and observe Starling hydrostatic and oncotic forces on GFR and FeNa.',
    icon: <Droplets className="w-7 h-7 text-emerald-400" />,
    badge: 'Renal Kinetics',
    status: 'Available'
  },
  {
    id: 'respiratory-vq',
    title: 'V/Q Mismatch & Gas Exchange',
    description: 'Model ventilation-perfusion matching, physiological dead space, right-to-left shunt, and the Alveolar Gas Equation.',
    icon: <Wind className="w-7 h-7 text-sky-400" />,
    badge: 'Pulmonary Gas',
    status: 'Available'
  },
  {
    id: 'spirometry',
    title: 'Spirometry & Airway Mechanics',
    description: 'Simulate obstructive and restrictive pulmonary pathologies by adjusting airway radius, chest wall compliance, and FEV1/FVC.',
    icon: <Gauge className="w-7 h-7 text-blue-400" />,
    badge: 'Ventilatory Mechanics',
    status: 'Available'
  },
  {
    id: 'nerve-muscle',
    title: 'Nerve-Muscle Electrophysiology',
    description: 'Compute Goldman-Hodgkin-Katz membrane potentials and model nerve action potential conduction and muscle twitch summation.',
    icon: <Brain className="w-7 h-7 text-amber-400" />,
    badge: 'Biophysics',
    status: 'Available'
  },
  {
    id: 'patient-emergency',
    title: 'Emergency Resuscitation Simulator',
    description: 'Manage critically ill patients in acute cardiogenic shock, septic vasodilatation, and severe hypoxemic respiratory failure.',
    icon: <Stethoscope className="w-7 h-7 text-red-400" />,
    badge: 'Critical Care Lab',
    status: 'Available'
  },
  {
    id: 'pharmacokinetics',
    title: 'Pharmacokinetics PK/PD & TDM Solver',
    description: 'Two-compartment Bateman PK model: plot plasma concentration curves, compute Cmax, AUC, Tmax across IV/Oral/IM routes with MTC/MEC safety windows.',
    icon: <FlaskConical className="w-7 h-7 text-violet-400" />,
    badge: 'Drug Kinetics',
    status: 'Available'
  },
  {
    id: 'ecg-rhythm',
    title: '12-Lead ECG Rhythm Simulator',
    description: 'Synthesize PQRST waveforms with adjustable PR, QRS, QT intervals. Identify normal sinus, AF, STEMI, LBBB, and bradycardia patterns.',
    icon: <Activity className="w-7 h-7 text-green-400" />,
    badge: 'Electrocardiology',
    status: 'Available'
  },
  {
    id: 'hemodynamics-shock',
    title: 'Hemodynamic Shock Classifier',
    description: 'Input Swan-Ganz catheter data (CO, SVR, PCWP, CVP, SvO₂) to auto-classify shock phenotype with treatment guidance and radar fingerprint.',
    icon: <Stethoscope className="w-7 h-7 text-orange-400" />,
    badge: 'Critical Care',
    status: 'Available'
  },
  {
    id: 'clinical-case-branching',
    title: 'Clinical Case Branching & AI OSCE Evaluator',
    description: 'Interactive multi-branch patient encounters: manage acute RV STEMI, febrile neutropenia, dynamic hemodynamics, and receive 5-dimension AI rubric scoring with Attending Viva.',
    icon: <Brain className="w-7 h-7 text-indigo-400" />,
    badge: 'OSCE Clinical Exam',
    status: 'Available'
  },
  {
    id: 'icu-telemetry',
    title: 'ICU Central Telemetry Station',
    description: 'Multi-bed real-time physiological waveforms (Lead II ECG, Pleth, Art Line), crisis alarm surveillance, 6-second caliper strips, and emergency bedside interventions.',
    icon: <Activity className="w-7 h-7 text-rose-500 animate-pulse" />,
    badge: 'Critical Care Telemetry',
    status: 'Available'
  },
  {
    id: 'pocus',
    title: 'Point-of-Care Ultrasound (POCUS) Station',
    description: 'Virtual sonography: eFAST trauma survey, BLUE pleural protocol, 2D B-mode sector & M-mode sweeps, tissue attenuation physics, and electronic caliper mm measurement.',
    icon: <Radio className="w-7 h-7 text-sky-400" />,
    badge: 'Acute Care Sonography',
    status: 'Available'
  },
  {
    id: 'eeg-neurophysiology',
    title: 'Clinical Neurophysiology & Quantitative EEG (qEEG)',
    description: '16-channel electrophysiological tracing, International 10-20 montages (Double Banana, Transverse), 8 clinical presets (Absence 3Hz, PLEDs, Triphasic Waves, Burst Suppression), and FFT spectral analytics.',
    icon: <Brain className="w-7 h-7 text-cyan-400" />,
    badge: 'Clinical Neurophysiology',
    status: 'Available'
  },
  {
    id: 'bronchoscopy-navigation',
    title: 'Flexible Bronchoscopy & EBUS Staging Workstation',
    description: 'Tracheobronchial 18-segment navigation, IASLC lymph node map, EBUS-TBNA staging with ROSE cytology, BAL cell differentials, and massive hemoptysis balloon tamponade protocol.',
    icon: <Wind className="w-7 h-7 text-teal-400" />,
    badge: 'Interventional Pulmonology',
    status: 'Available'
  },
  {
    id: 'cpb-perfusion',
    title: 'Cardiopulmonary Bypass (CPB) Perfusion Workstation',
    description: 'Heart-lung machine hydraulics, roller vs centrifugal pump physics, alpha-stat vs pH-stat cooling, Del Nido vs Buckberg cardioplegia arrest, and protamine reversal stoichiometry.',
    icon: <Heart className="w-7 h-7 text-rose-500 animate-pulse" />,
    badge: 'Extracorporeal Perfusion',
    status: 'Available'
  },
  {
    id: 'tee-navigation',
    title: 'Transesophageal Echocardiography (TEE) 28-View Workstation',
    description: 'Master ASE/SCA 28 standard views across 4 depth zones, omniplane electronic crystal angle steering (0-180°), color flow Doppler, and continuity equation valve orifice hemodynamics.',
    icon: <Compass className="w-7 h-7 text-emerald-400" />,
    badge: 'Echocardiography Imaging',
    status: 'Available'
  },
  {
    id: 'coronary-angiography',
    title: 'Cardiac Catheterization & Coronary Angiography',
    description: 'C-Arm fluoroscopy projections (Spider view, RAO Caudal/Cranial), 18-segment coronary tree, Gorlin equation Aortic Valve Area, FFR/iFR adenosine physiology, and TIMI flow grading.',
    icon: <Radio className="w-7 h-7 text-red-500 animate-pulse" />,
    badge: 'Interventional Cardiology',
    status: 'Available'
  },
  {
    id: 'ventricular-assist-device',
    title: 'Mechanical Circulatory Support & Percutaneous VADs',
    description: 'Microaxial transvalvular blood pumps (Impella CP, 5.5, RP), TandemHeart, and ECPELLA synergy: real-time PV-loop unloading dynamics, P-level kinetics, purge fluidics, and suction troubleshooting.',
    icon: <Cpu className="w-7 h-7 text-cyan-400" />,
    badge: 'Mechanical Support & VAD',
    status: 'Available'
  },
  {
    id: 'robotic-surgery',
    title: 'Minimally Invasive Surgery & Robotic Laparoscopy',
    description: 'da Vinci surgical console, EndoWrist 7-DOF kinematics, CO2 pneumoperitoneum hemodynamics, steep Trendelenburg mechanics, electrosurgical thermal spread, and laparoscopic emergencies.',
    icon: <Scissors className="w-7 h-7 text-emerald-400" />,
    badge: 'Robotic Surgery & Laparoscopy',
    status: 'Available'
  },
  {
    id: 'trauma-atls',
    title: 'Trauma & ATLS Primary Survey',
    description: 'Hemorrhagic shock classification (Class I–IV), FAST/eFAST exam with free-fluid visualization, massive transfusion protocol 1:1:1, damage control surgery decision tree, tension pneumothorax, and cardiac tamponade.',
    icon: <ShieldAlert className="w-7 h-7 text-red-500 animate-pulse" />,
    badge: 'Trauma Surgery & ATLS',
    status: 'Available'
  },
  {
    id: 'fetal-monitoring',
    title: 'Fetal Monitoring & Cardiotocography (CTG)',
    description: 'ACOG/NICHD 3-tier fetal heart rate interpretation, deceleration biophysics (early, late, variable, prolonged, sinusoidal), Montevideo units (MVU), intrauterine resuscitation, and modified Bishop induction scoring.',
    icon: <Baby className="w-7 h-7 text-rose-400" />,
    badge: 'Obstetrics & Maternal-Fetal Medicine',
    status: 'Available'
  },
  {
    id: 'infectious-disease',
    title: 'Infectious Disease & Antibiogram Solver',
    description: 'CLSI/EUCAST breakpoint interpretation, PK/PD target attainment (%T>MIC, AUC/MIC, Cmax/MIC), MDRO resistance mechanisms (MRSA, VRE, ESBL, CRE NDM-1), Cockcroft-Gault CrCl dosing, and Surviving Sepsis 1-hour bundle.',
    icon: <Microscope className="w-7 h-7 text-emerald-400" />,
    badge: 'Clinical Microbiology & ID',
    status: 'Available'
  },
  {
    id: 'endoscopy-gi',
    title: 'Upper GI Endoscopy & ERCP Workstation',
    description: 'Peptic ulcer Forrest classification, dual endoscopic hemostasis (epinephrine + hemoclips), variceal band ligation, ERCP biliary cannulation, electrosurgical sphincterotomy, and post-ERCP pancreatitis prevention.',
    icon: <Compass className="w-7 h-7 text-amber-400" />,
    badge: 'Interventional Gastroenterology & ERCP',
    status: 'Available'
  },
  {
    id: 'compartment-syndrome',
    title: 'Orthopedic Surgery & Compartment Syndrome',
    description: 'Intracompartmental pressure manometry, Whitesides / McQueen Delta P perfusion calculation (DBP - ICP <= 30 mmHg), lower leg 4-compartment anatomy, emergent 2-incision fasciotomy, and Volkmann ischemia prevention.',
    icon: <Scissors className="w-7 h-7 text-cyan-400" />,
    badge: 'Orthopedic Traumatology',
    status: 'Available'
  },
  {
    id: 'slit-lamp-tonometry',
    title: 'Ophthalmology Slit Lamp & Goldmann Tonometry',
    description: 'Optical slit beam biomicroscopy, Goldmann applanation tonometry (GAT) Imbert-Fick mechanics, CCT pachymetry corrections, Van Herick angle grading, and acute angle-closure emergency deck.',
    icon: <Eye className="w-7 h-7 text-sky-400" />,
    badge: 'Ophthalmology & Optics',
    status: 'Available'
  },
  {
    id: 'neurosurgery-evd',
    title: 'Neurosurgery EVD & Ventriculostomy Workstation',
    description: 'Kocher\'s point stereotactic trajectory, Foramen of Monro frontal horn cannulation, EVD graduated burette hydrodynamics, tragus zero leveling, slit ventricle prevention, and intrathecal thrombolysis.',
    icon: <Brain className="w-7 h-7 text-purple-400" />,
    badge: 'Neurosurgery & Critical Care',
    status: 'Available'
  },
  {
    id: 'dermoscopy',
    title: 'Dermatology Dermoscopy & Wood\'s Lamp Workstation',
    description: 'Polarized vs immersion epiluminescence microscopy, 365 nm UVA Wood\'s fluorescence, Argenziano 7-point melanoma checklist, BCC arborizing vessels, and excisional biopsy planning.',
    icon: <Microscope className="w-7 h-7 text-amber-400" />,
    badge: 'Dermatology & Oncology',
    status: 'Available'
  },
  {
    id: 'stewart-acid-base',
    title: 'Nephrology & Acid-Base Stewart SID Workstation',
    description: 'Physico-chemical Stewart approach: apparent vs effective SID, Strong Ion Gap (SIG), Gamblegram ion balance stacks, normal saline dilutional acidosis, and Figge-Jabor-Kazda albumin correction.',
    icon: <FlaskConical className="w-7 h-7 text-teal-400" />,
    badge: 'Nephrology & Acid-Base',
    status: 'Available'
  },
  {
    id: 'audiometry-ent',
    title: 'Pure Tone Audiometry & Tympanometry Workstation',
    description: 'Octave pure tone air/bone conduction audiograms, Jerger middle ear compliance curves (Type A, As, Ad, B, C), speech discrimination rollover, stapedial acoustic reflexes, and otology clinical pathways.',
    icon: <Ear className="w-7 h-7 text-teal-400" />,
    badge: 'Otolaryngology & Audiology',
    status: 'Available'
  },
  {
    id: 'chest-tube-pleural',
    title: 'Pleural Dynamics & Chest Tube Thoracostomy Workstation',
    description: 'Intrapleural pressure swings, 3-chamber water seal drainage (collection, water seal, suction), tidaling, air leak grading, ATLS massive hemothorax thoracotomy triggers, and Light\'s criteria.',
    icon: <Wind className="w-7 h-7 text-sky-400" />,
    badge: 'Pulmonology & Trauma',
    status: 'Available'
  },
  {
    id: 'toxicology-antidote',
    title: 'Clinical Toxicology, Toxidromes & Antidote Precision',
    description: 'Toxidrome multi-system matrix (Hunter Serotonin vs Sympathomimetic, Cholinergic Killer Bs), Rumack-Matthew APAP nomogram solver, Osmolar/Anion gap diagnostics, and targeted antidote titration.',
    icon: <Skull className="w-7 h-7 text-rose-400" />,
    badge: 'Medical Toxicology',
    status: 'Available'
  },
  {
    id: 'endocrine-clamp',
    title: 'Hyperinsulinemic Glucose Clamp & HOMA2 Solver',
    description: 'DeFronzo gold-standard clamp dynamics, whole-body glucose disposal (M value), HOMA2-IR / HOMA2-Beta indices, and DKA two-bag transition protocols.',
    icon: <Flame className="w-7 h-7 text-amber-400" />,
    badge: 'Endocrinology & Metabolism',
    status: 'Available'
  },
  {
    id: 'teg-hemostasis',
    title: 'Thromboelastography (TEG / ROTEM) & Transfusion Solver',
    description: 'Viscoelastic clot dynamics (R, K, alpha, MA, LY30), differential ROTEM assays (FIBTEM, HEPTEM, APTEM), and goal-directed transfusion algorithms.',
    icon: <Droplets className="w-7 h-7 text-rose-500 animate-pulse" />,
    badge: 'Hematology & Transfusion',
    status: 'Available'
  },
  {
    id: 'tci-anesthesia',
    title: 'Target-Controlled Infusion (TCI) & Volatile MAC Workstation',
    description: 'Marsh & Schnider Propofol 3-compartment kinetics, Minto Remifentanil pharmacodynamics, Mapleson age-corrected volatile MAC, Emax BIS monitoring, and context-sensitive half-time.',
    icon: <Brain className="w-7 h-7 text-indigo-400" />,
    badge: 'Anesthesiology & TCI',
    status: 'Available'
  },
  {
    id: 'autoantibody-ana',
    title: 'Autoantibody Profiling & ANA HEp-2 IFA Workstation',
    description: 'ICAP standardized HEp-2 IFA patterns (AC-1 to AC-29), end-point titer kinetics, ENA multiplex panel, ANCA dual-fluorescence differential, and 2019 ACR/EULAR criteria solvers.',
    icon: <Microscope className="w-7 h-7 text-emerald-400" />,
    badge: 'Rheumatology & Immunology',
    status: 'Available'
  },
  {
    id: 'urea-kinetic-dialysis',
    title: 'Hemodialysis Urea Kinetic Modeling (Kt/V) Workstation',
    description: 'Daugirdas second-generation spKt/V & eKt/V, intracellular urea rebound, URR %, nPCR protein nutrition, vascular access recirculation (AR%), and ultrafiltration rate risk monitoring.',
    icon: <Droplets className="w-7 h-7 text-sky-400" />,
    badge: 'Nephrology & Dialysis',
    status: 'Available'
  },
  {
    id: 'cirrhosis-portal-hypertension',
    title: 'Cirrhosis Decompensation, MELD-Na & HVPG Solver',
    description: '2016 UNOS MELD-Na, Child-Turcotte-Pugh (CTP), Maddrey DF for alcoholic hepatitis, transjugular HVPG gradient, diagnostic paracentesis SAAG, SBP, and HRS-AKI protocols.',
    icon: <Stethoscope className="w-7 h-7 text-amber-400" />,
    badge: 'Hepatology & Gastroenterology',
    status: 'Available'
  },
  {
    id: 'labor-partogram',
    title: 'Labor Care Guide, Partogram & Bishop Score Solver',
    description: 'WHO Partogram Alert/Action curves, Calder Modified Bishop Score pre-induction ripening, Montevideo Units (MVU), oxytocin tachysystole resuscitation, and CPD diagnostics.',
    icon: <Baby className="w-7 h-7 text-rose-400" />,
    badge: 'Obstetrics & Intrapartum Care',
    status: 'Available'
  },
  {
    id: 'hiv-antiretroviral',
    title: 'HIV Antiretroviral & CD4 Prophylaxis Solver',
    description: 'DHHS/WHO first-line ART regimens, CD4 T-cell opportunistic infection prophylaxis (PCP, Toxoplasmosis, MAC), HLA-B*5701 hypersensitivity, HBV/TB interactions, and IRIS timing.',
    icon: <Microscope className="w-7 h-7 text-purple-400" />,
    badge: 'Infectious Disease & HIV',
    status: 'Available'
  },
  {
    id: 'visual-field-perimetry',
    title: 'Humphrey Automated Perimetry & Glaucoma Workstation',
    description: 'HFA 24-2 SITA-Standard testing, decibel threshold mapping, Glaucoma Hemifield Test (GHT), Hodapp-Anderson-Parrish (HAP) staging, corneal pachymetry CCT-adjusted IOP, and target IOP solver.',
    icon: <Eye className="w-7 h-7 text-cyan-400" />,
    badge: 'Ophthalmology & Glaucoma',
    status: 'Available'
  },
  {
    id: 'thyroid-storm-crisis',
    title: 'Thyroid Storm & Myxedema Coma Crisis Workstation',
    description: 'Burch-Wartofsky Point Scale (BWPS) scoring, 1-hour thionamide-to-iodine pharmacotherapy timing sequencer, and Popoveniuc Myxedema Coma triage and resuscitation protocols.',
    icon: <Flame className="w-7 h-7 text-amber-400" />,
    badge: 'Endocrinology Emergencies',
    status: 'Available'
  },
  {
    id: 'burns-resuscitation',
    title: 'Burns Resuscitation & Fluid Shift Workstation',
    description: 'Wallace Rule of Nines TBSA mapping, Parkland and ABA Consensus formulas, hourly urine output (UOP) titration, carboxyhemoglobin kinetics, and Ivy index fluid creep surveillance.',
    icon: <Droplets className="w-7 h-7 text-orange-400" />,
    badge: 'Trauma & Critical Care',
    status: 'Available'
  },
  {
    id: 'acute-stroke-thrombolysis',
    title: 'Acute Stroke Thrombolysis & Thrombectomy Workstation',
    description: 'NIH Stroke Scale (NIHSS) scoring, ASPECTS 10-region CT mapping, Tenecteplase/Alteplase precision dosing, BP thresholds, and Large Vessel Occlusion (LVO) mechanical thrombectomy solver.',
    icon: <Brain className="w-7 h-7 text-purple-400" />,
    badge: 'Neurology & Neurocritical Care',
    status: 'Available'
  },
  {
    id: 'neonatal-resuscitation-nrp',
    title: 'Neonatal Resuscitation Program (NRP 8th Ed.) Workstation',
    description: 'NRP 8th Edition decision tree, interactive APGAR scoring board, pre-ductal target SpO2 nomogram, MR. SOPA sequence, weight-based epinephrine/saline dosing, and Sarnat HIE cooling triage.',
    icon: <Baby className="w-7 h-7 text-rose-400" />,
    badge: 'Neonatology & Resuscitation',
    status: 'Available'
  },
  {
    id: 'aortic-stenosis-valve',
    title: 'Aortic Stenosis & Valve Hemodynamics Workstation',
    description: 'Doppler continuity equation, invasive Gorlin and Hakki equation solver, Energy Loss Index (ELI), Valvuloarterial Impedance (Zva), and ACC/AHA Heart Team TAVI vs SAVR decision tree.',
    icon: <Heart className="w-7 h-7 text-red-500 animate-pulse" />,
    badge: 'Cardiology & Valve Hemodynamics',
    status: 'Available'
  }
];

export default function SimulatorsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <div className="text-blue-400 text-xs font-bold tracking-wider uppercase mb-2">
            Mathematical Engines &amp; Simulation Solvers
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-3">
            Virtual Physiology Labs
          </h1>
          <p className="text-slate-300 text-base md:text-lg max-w-2xl leading-relaxed">
            Experience physiology in motion. Our interactive simulators allow you to manipulate key physiological variables and instantly compute real-time mathematical, biophysical, and clinical outcomes.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SIMULATORS.map((sim) => (
            <Link 
              key={sim.id} 
              href={`/simulators/${sim.id}`}
              className="group flex flex-col justify-between bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-2xl p-6 transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-950/20"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-slate-800 border border-slate-700">
                    {sim.icon}
                  </div>
                  <span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 text-[11px] font-bold rounded-md border border-blue-500/20">
                    {sim.badge}
                  </span>
                </div>
                
                <h2 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors mb-2">
                  {sim.title}
                </h2>
                <p className="text-slate-400 text-xs leading-relaxed">
                  {sim.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Interactive Engine
                </span>
                <span className="text-blue-400 font-bold group-hover:translate-x-1 transition-transform">
                  Launch Lab →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
