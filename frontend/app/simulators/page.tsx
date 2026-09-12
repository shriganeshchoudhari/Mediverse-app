import React from 'react';
import Link from 'next/link';
import { Activity, Wind, Brain, Droplets, FlaskConical, Stethoscope, Gauge, Heart, Radio, Microscope, Baby, Flame, Dna, Zap, Compass, Cpu, Scissors, ShieldAlert, Eye, Ear, Skull, Thermometer, Pill, Syringe } from 'lucide-react';
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
  },
  {
    id: 'right-heart-catheterization',
    title: 'Right Heart Catheterization (RHC) & Fick Workstation',
    description: 'Swan-Ganz catheterization pressure waveforms, direct and indirect Fick cardiac output, Pulmonary Vascular Resistance (PVR), 2022 ESC/ERS PH Phenotyping, and acute vasoreactivity challenge testing.',
    icon: <Activity className="w-7 h-7 text-sky-400" />,
    badge: 'Pulmonology & Critical Care',
    status: 'Available'
  },
  {
    id: 'hematology-morphology',
    title: 'Hematology Smear & Bone Marrow Morphology Workstation',
    description: 'Peripheral blood smear poikilocytosis, bone marrow M:E ratio calculation, WHO 2022 leukemia classification, and Cairo-Bishop tumor lysis syndrome triage.',
    icon: <Microscope className="w-7 h-7 text-purple-400" />,
    badge: 'Hematology & Pathology',
    status: 'Available'
  },
  {
    id: 'peritoneal-dialysis-pet',
    title: 'Peritoneal Dialysis, Adequacy & PET Workstation',
    description: 'Twardowski 4-hour PET transport curves, Three-Pore Model aquaporin-1 sodium sieving, Weekly Kt/V adequacy, Ultrafiltration Failure (UFF Type I-IV), and 2022 ISPD Peritonitis guidelines.',
    icon: <Droplets className="w-7 h-7 text-sky-400" />,
    badge: 'Nephrology & Dialysis',
    status: 'Available'
  },
  {
    id: 'difficult-airway-intubation',
    title: 'Difficult Airway & Awake Intubation Workstation',
    description: 'Mallampati & Cormack-Lehane scoring, STOP-BANG OSA risk, DAS 2015 Plan A–D algorithm, and CICO emergency scalpel-bougie cricothyroidotomy protocol.',
    icon: <ShieldAlert className="w-7 h-7 text-indigo-400" />,
    badge: 'Anesthesiology & Airway',
    status: 'Available'
  },
  {
    id: 'arterial-line-hemodynamics',
    title: 'Arterial Line Hemodynamics & PPV Workstation',
    description: 'Continuous arterial blood pressure, Pulse Pressure Variation (PPV), Dynamic Arterial Elastance (Ea_dyn), and Fast-Flush Square Wave Damping Analysis.',
    icon: <Activity className="w-7 h-7 text-rose-500" />,
    badge: 'Critical Care & Hemodynamics',
    status: 'Available'
  },
  {
    id: 'neonatal-hfov-ventilation',
    title: 'Neonatal HFOV & Surfactant Workstation',
    description: 'High-Frequency Oscillatory Ventilation (HFOV), sub-dead-space gas transport (Taylor dispersion, Pendelluft), Open-Lung hysteresis, and LISA surfactant kinetics.',
    icon: <Baby className="w-7 h-7 text-cyan-400" />,
    badge: 'Neonatology & HFOV',
    status: 'Available'
  },
  {
    id: 'neuraxial-spinal-epidural',
    title: 'Neuraxial Anesthesia, Spinal/Epidural & LAST Workstation',
    description: 'Dermatome sensory level mapping (T4-S5), Modified Bromage motor score, high/total spinal Bezold-Jarisch resuscitation, epidural test dose, and ASRA 20% Lipid Emulsion rescue.',
    icon: <ShieldAlert className="w-7 h-7 text-indigo-400" />,
    badge: 'Anesthesiology & Obstetrics',
    status: 'Available'
  },
  {
    id: 'dysnatremia-osmotherapy',
    title: 'Dysnatremia, Hyponatremia & Osmotherapy Workstation',
    description: 'Adrogué-Madias fluid kinetics, Osmotic Demyelination Syndrome (ODS) prevention, 3% hypertonic saline bolus, DDAVP clamp, and neuro-osmotherapy.',
    icon: <Droplets className="w-7 h-7 text-sky-400" />,
    badge: 'Nephrology & Critical Care',
    status: 'Available'
  },
  {
    id: 'preeclampsia-eclampsia-mgso4',
    title: 'Preeclampsia, Eclampsia & MgSO4 Workstation',
    description: 'ACOG severe feature classification, Zuspan/Pritchard Magnesium Sulfate kinetics, toxicity monitoring, 10% Calcium Gluconate antidote, and emergent antihypertensives.',
    icon: <Baby className="w-7 h-7 text-rose-400" />,
    badge: 'Obstetrics & Critical Care',
    status: 'Available'
  },
  {
    id: 'pulmonary-embolism-thrombolysis',
    title: 'Pulmonary Embolism, RV Strain & Thrombolysis (CDT) Workstation',
    description: 'ESC/AHA risk stratification, sPESI prognostic scoring, echocardiographic RV strain, systemic Alteplase, and EKOS catheter-directed thrombolysis.',
    icon: <Heart className="w-7 h-7 text-rose-500 animate-pulse" />,
    badge: 'Interventional Cardiology',
    status: 'Available'
  },
  {
    id: 'upper-gi-bleeding-hemostasis',
    title: 'Acute Upper GI Bleeding, Rockall & Hemostasis Workstation',
    description: 'Glasgow-Blatchford Score (GBS) triage, Full Rockall scoring, Forrest ulcer classification, vasoactive octreotide/terlipressin infusions, endoscopic dual therapy, and salvage Sengstaken-Blakemore balloon tamponade.',
    icon: <Flame className="w-7 h-7 text-rose-400" />,
    badge: 'Gastroenterology & Hepatology',
    status: 'Available'
  },
  {
    id: 'adrenal-crisis-steroid',
    title: 'Acute Adrenal Crisis, Cosyntropin & Steroid Equivalency Workstation',
    description: 'High-dose 250 mcg Cosyntropin stimulation test, steroid potency & mineralocorticoid cross-talk equivalency solver, stress-dose escalation regimens, and emergency crisis resuscitation.',
    icon: <Zap className="w-7 h-7 text-amber-400" />,
    badge: 'Endocrinology & Critical Care',
    status: 'Available'
  },
  {
    id: 'synovial-fluid-gout-microscopy',
    title: 'Synovial Fluid Polarized Microscopy & Gout Workstation',
    description: 'Compensated Polarized Light Microscopy (CPLM 530 nm red plate), MSU vs CPPD birefringence kinetics, arthrocentesis sepsis triaging, 2015 ACR/EULAR criteria, and HLA-B*5801 precision pharmacotherapy.',
    icon: <Microscope className="w-7 h-7 text-rose-400" />,
    badge: 'Rheumatology & Immunology',
    status: 'Available'
  },
  {
    id: 'massive-transfusion-dcr',
    title: 'Massive Transfusion Protocol (MTP) & DCR Workstation',
    description: 'Damage Control Resuscitation (DCR), balanced 1:1:1 blood product ratio cooler dispatch, ABC Score activation, Lethal Triad biophysics, permissive hypotension, and viscoelastic TEG hemostatic guidance.',
    icon: <Droplets className="w-7 h-7 text-rose-500 animate-pulse" />,
    badge: 'Trauma & Critical Care',
    status: 'Available'
  },
  {
    id: 'neuromuscular-blockade-tof',
    title: 'Neuromuscular Blockade, Train-of-Four & Reversal Workstation',
    description: 'Quantitative acceleromyography (TOF ratio >= 0.90), post-tetanic count (PTC), post-operative residual curarization (PORC) defense, and precision Sugammadex vs Neostigmine reversal protocols.',
    icon: <Zap className="w-7 h-7 text-emerald-400" />,
    badge: 'Anesthesiology & Critical Care',
    status: 'Available'
  },
  {
    id: 'renal-tubular-acidosis-gap',
    title: 'Renal Tubular Acidosis (RTA) & Urine Anion Gap Workstation',
    description: 'Normal Anion Gap Metabolic Acidosis (NAGMA) differential solver, RTA Types 1, 2, and 4 categorization, Urine Anion Gap (UAG) & Osmolal Gap ammonium excretion, and precision alkali dosing.',
    icon: <FlaskConical className="w-7 h-7 text-teal-400" />,
    badge: 'Nephrology & Acid-Base',
    status: 'Available'
  },
  {
    id: 'sepsis-antibiotic-pkpd',
    title: 'Sepsis Bundles (SEP-1), Antibiotic PK/PD & Procalcitonin Workstation',
    description: 'Surviving Sepsis Campaign Hour-1 bundle protocol adherence, time-dependent beta-lactam %fT>MIC extended infusions, Augmented Renal Clearance (ARC) detection, and serial procalcitonin de-escalation kinetics.',
    icon: <ShieldAlert className="w-7 h-7 text-amber-400" />,
    badge: 'Critical Care & Stewardship',
    status: 'Available'
  },
  {
    id: 'pupil-anisocoria-horner',
    title: 'Anisocoria, Pupillary Light Reflex & Horner Syndrome Workstation',
    description: 'Neuro-ophthalmologic pupil dynamics: light vs dark anisocoria, 3-neuron Horner localization, compressive CN III palsy, Adie tonic pupil, and Apraclonidine/Pilocarpine pharmacology.',
    icon: <Eye className="w-7 h-7 text-cyan-400" />,
    badge: 'Neuro-Ophthalmology',
    status: 'Available'
  },
  {
    id: 'toxic-alcohols-osmolal-gap',
    title: 'Toxic Alcohols, Osmolal Gap & Fomepizole Precision Solver',
    description: 'Critical care toxicology: Osmolal gap vs HAGMA crossover, Methanol snowstorm blindness, Ethylene Glycol calcium oxalate nephrocalcinosis, and Fomepizole/dialysis protocols.',
    icon: <FlaskConical className="w-7 h-7 text-emerald-400" />,
    badge: 'Toxicology & Critical Care',
    status: 'Available'
  },
  {
    id: 'last-lipid-rescue',
    title: 'Local Anesthetic Systemic Toxicity (LAST) & 20% Lipid Rescue Workstation',
    description: 'ASRA regional anesthesia crisis management: Bupivacaine Nav1.5 cardiotoxicity, QRS widening, 20% lipid emulsion dual-mechanism sink kinetics, and reduced-dose epinephrine.',
    icon: <Heart className="w-7 h-7 text-rose-500 animate-pulse" />,
    badge: 'Anesthesiology & Critical Care',
    status: 'Available'
  },
  {
    id: 'hdfn-rhogam-kleihauer',
    title: 'HDFN, RhIg (RhoGAM) & Kleihauer-Betke Precision Workstation',
    description: 'Maternal-fetal medicine & transfusion immunohematology: Model RhD alloimmunization, Kleihauer-Betke acid-elution FMH quantification, AABB precision RhoGAM dosing, and Fetal MCA Doppler PSV screening.',
    icon: <Baby className="w-7 h-7 text-rose-400" />,
    badge: 'Maternal-Fetal Medicine',
    status: 'Available'
  },
  {
    id: 'ino-pulmonary-vasoreactivity',
    title: 'Inhaled Nitric Oxide (iNO) & Acute Vasoreactivity Workstation',
    description: 'Pulmonology & critical care: Model selective pulmonary vasodilation, ESC/ERS acute vasoreactivity testing (Sitbon criteria), PVR/SVR hemodynamics, rebound pulmonary hypertension, and MetHb/NO2 toxicity.',
    icon: <Wind className="w-7 h-7 text-cyan-400" />,
    badge: 'Pulmonology & Critical Care',
    status: 'Available'
  },
  {
    id: 'digoxin-toxicity-fab',
    title: 'Digoxin Toxicity & DigiFab Stoichiometry Workstation',
    description: 'Cardiovascular toxicology: Model Na+/K+-ATPase blockade, hyperkalemia mortality risk (Smith curve), DigiFab antibody fragment neutralization stoichiometry, and Salvador Dalí scooped ST changes.',
    icon: <FlaskConical className="w-7 h-7 text-amber-400" />,
    badge: 'Cardiovascular Toxicology',
    status: 'Available'
  },
  {
    id: 'ttm-cardiac-arrest-neuro',
    title: 'Targeted Temperature Management (TTM) & Neuroprognostication',
    description: 'Resuscitation & neurocritical care: Model core hypothermia induction (32-36°C), shivering metabolic surge, controlled rewarming electrolyte shifts, and Day 3 multimodal neuroprognostication (SSEP N20, continuous EEG, NSE, and CT GWR).',
    icon: <Thermometer className="w-7 h-7 text-sky-400" />,
    badge: 'Resuscitation & Neuro-ICU',
    status: 'Available'
  },
  {
    id: 'salicylate-toxicity-alkalinization',
    title: 'Salicylate Toxicity, Ion Trapping & EXTRIP Dialysis Workstation',
    description: 'Toxicology & nephrology: Model mitochondrial uncoupling, mixed respiratory alkalosis + HAGMA, blood-brain barrier ion trapping biophysics, hypokalemic paradoxical aciduria, and EXTRIP emergent hemodialysis indications.',
    icon: <FlaskConical className="w-7 h-7 text-emerald-400" />,
    badge: 'Toxicology & Nephrology',
    status: 'Available'
  },
  {
    id: 'dka-hhs-two-bag',
    title: 'DKA, HHS & Two-Bag Fluid Titration Workstation',
    description: 'Endocrinology & critical care: Model DKA vs HHS glycemic crisis criteria, potassium safety interlock, dynamic two-bag dextrose titration, and osmotic cerebral edema prevention.',
    icon: <Flame className="w-7 h-7 text-rose-500 animate-pulse" />,
    badge: 'Endocrinology & ICU',
    status: 'Available'
  },
  {
    id: 'acute-pancreatitis-fluid-resuscitation',
    title: 'Acute Pancreatitis, Atlanta & WATERFALL Resuscitation',
    description: 'Gastroenterology & ICU: Model Revised Atlanta 2012 severity, Modified Marshall organ failure matrix, BISAP mortality index, and NEJM WATERFALL goal-directed fluid titration.',
    icon: <Activity className="w-7 h-7 text-amber-400" />,
    badge: 'Gastroenterology & ICU',
    status: 'Available'
  },
  {
    id: 'ards-driving-pressure',
    title: 'ARDS Berlin, Driving Pressure & Mechanical Power',
    description: 'Pulmonology & ICU: Model Berlin ARDS definitions, Amato driving pressure, Gattinoni mechanical power ergotrauma, and PROSEVA prone positioning protocols.',
    icon: <Wind className="w-7 h-7 text-cyan-400 animate-pulse" />,
    badge: 'Pulmonology & ICU',
    status: 'Available'
  },
  {
    id: 'acetaminophen-toxicity-nac',
    title: 'Acetaminophen Toxicity, Rumack-Matthew & NAC Workstation',
    description: 'Toxicology & hepatology: Model Rumack-Matthew nomogram, CYP2E1 NAPQI glutathione kinetics, 21-hour IV NAC protocols, and King\'s College emergency transplant criteria.',
    icon: <Pill className="w-7 h-7 text-emerald-400" />,
    badge: 'Toxicology & Hepatology',
    status: 'Available'
  },
  {
    id: 'acs-heart-troponin',
    title: 'ACS Risk Stratification, HEART & hs-cTn Delta Workstation',
    description: 'Emergency Medicine & Cardiology: Model HEART Score, TIMI, GRACE 2.0, European Society of Cardiology (ESC) 0/1h and 0/2h high-sensitivity troponin rapid algorithms, and evidence-based revascularization timing.',
    icon: <Heart className="w-7 h-7 text-rose-500 animate-pulse" />,
    badge: 'Emergency & Cardiology',
    status: 'Available'
  },
  {
    id: 'aki-kdigo-fst',
    title: 'Acute Kidney Injury (AKI) & FST Precision Workstation',
    description: 'Nephrology & Critical Care: Model KDIGO 2024 dynamic AKI staging, FeNa vs FeUrea differentiation with loop diuretic correction, Renal Angina Index (RAI), Chawla Furosemide Stress Test (FST), and fluid overload kinetics.',
    icon: <Droplets className="w-7 h-7 text-cyan-400" />,
    badge: 'Nephrology & ICU',
    status: 'Available'
  },
  {
    id: 'status-epilepticus-protocol',
    title: 'Status Epilepticus Emergency Protocol Workstation',
    description: 'Neurology & Critical Care: Model AES/NCS time-critical first-line benzodiazepine dosing, ESETT trial second-line ASMs (Keppra, Fosphenytoin, Valproate), refractory burst suppression, and Salzburg NCSE criteria.',
    icon: <Zap className="w-7 h-7 text-rose-500 animate-pulse" />,
    badge: 'Neurocritical Care',
    status: 'Available'
  },
  {
    id: 'heart-failure-stevenson',
    title: 'ADHF Stevenson Profiles & Inotropes Workstation',
    description: 'Cardiology & ICU: Model Stevenson-Nohria Forrester profiles (Warm/Cold, Wet/Dry), congestive nephropathy backpressure mechanics (RPP = MAP - CVP), DOSE trial diuretic titration, and inotrope/vasodilator safety interlocks.',
    icon: <Heart className="w-7 h-7 text-rose-500 animate-pulse" />,
    badge: 'Cardiology & ICU',
    status: 'Available'
  },
  {
    id: 'hit-4ts-argatroban',
    title: 'HIT 4Ts Score & Argatroban Workstation',
    description: 'Hematology & Critical Care: Model Warkentin 4Ts score stratification, anti-PF4 ELISA optical density vs SRA functional testing, organ-adjusted DTI dosing (Argatroban vs Bivalirudin), and Warfarin gangrene safeguards.',
    icon: <ShieldAlert className="w-7 h-7 text-amber-500 animate-pulse" />,
    badge: 'Hematology & ICU',
    status: 'Available'
  },
  {
    id: 'myxedema-coma-thyroid',
    title: 'Myxedema Coma & Thyroid Crisis Workstation',
    description: 'Endocrine & Neurocritical Care: Model Popoveniuc diagnostic score (>=60 diagnostic), mandatory "Steroids-Before-Thyroid" adrenal crisis interlock, IV T4 vs T3 hormone titration, and passive rewarming vs vasodilatory collapse hazards.',
    icon: <Thermometer className="w-7 h-7 text-cyan-400 animate-pulse" />,
    badge: 'Endocrine & ICU',
    status: 'Available'
  },
  {
    id: 'thyroid-storm-burch-wartofsky',
    title: 'Thyroid Storm & Burch-Wartofsky Workstation',
    description: 'Endocrine & Critical Care: Model Burch-Wartofsky Point Scale (>=45 storm), Japan Thyroid Association (Akamizu) criteria, 5-stage multimodal blockade, Wolff-Chaikoff 60-minute iodine delay, and Aspirin TBG displacement hazards.',
    icon: <Flame className="w-7 h-7 text-amber-400 animate-pulse" />,
    badge: 'Endocrine & ICU',
    status: 'Available'
  },
  {
    id: 'ccb-beta-blocker-hiet',
    title: 'CCB & Beta-Blocker Poisoning / HIET Workstation',
    description: 'Toxicology & Critical Care: Model High-Dose Insulin Euglycemia Therapy (HIET) titration (1-10 U/kg/h), dextrose clamp safety, potassium shifting defense, IV calcium salt stoichiometry (Chloride vs Gluconate), and 20% Lipid Emulsion / VA-ECMO refractory rescue protocols.',
    icon: <Syringe className="w-7 h-7 text-rose-400 animate-pulse" />,
    badge: 'Toxicology & ICU',
    status: 'Available'
  },
  {
    id: 'status-asthmaticus-mechanics',
    title: 'Status Asthmaticus & Mechanics Workstation',
    description: 'Pulmonology & Critical Care: Model GINA 2024 severe exacerbations, Peak Expiratory Flow kinetics, dynamic hyperinflation / intrinsic Auto-PEEP, venous return depression, multimodal bronchodilator escalation (Continuous SABA, SAMA, Steroids, IV Magnesium), and permissive hypercapnia mechanical ventilation.',
    icon: <Wind className="w-7 h-7 text-cyan-400 animate-pulse" />,
    badge: 'Pulmonology & ICU',
    status: 'Available'
  },
  {
    id: 'tca-toxicity-bicarbonate',
    title: 'TCA Overdose & Bicarbonate Workstation',
    description: 'Toxicology & Critical Care: Model Nav1.5 fast sodium-channel blockade, terminal R wave in aVR (> 3 mm), QRS duration risk stratification (100 ms seizure / 160 ms VT thresholds), hypertonic 8.4% NaHCO3 titration, absolute Physostigmine contraindications, and 20% Lipid Emulsion rescue.',
    icon: <Zap className="w-7 h-7 text-amber-400 animate-pulse" />,
    badge: 'Toxicology & ICU',
    status: 'Available'
  },
  {
    id: 'hypertensive-crisis-titration',
    title: 'Hypertensive Crisis & IV Titration Workstation',
    description: 'Cardiovascular Critical Care: Emergency vs Urgency triage, acute target organ damage stratification, cerebral autoregulation curve shifts (20-25% MAP drop ceiling), and precision parenteral pharmacotherapy bench (Nicardipine, Clevidipine, Labetalol, Esmolol, Nitroprusside, Nitroglycerin).',
    icon: <Activity className="w-7 h-7 text-rose-500 animate-pulse" />,
    badge: 'Critical Care & Neuroprotection',
    status: 'Available'
  },
  {
    id: 'stroke-nihss-thrombolysis',
    title: 'Acute Ischemic Stroke, NIHSS & Thrombolysis Workstation',
    description: 'Neurology & Neurocritical Care: Complete 11-item NIHSS examination scoring, 10-region ASPECTS neuroimaging, AHA/ASA IV Thrombolysis (Tenecteplase / Alteplase) eligibility & weight-adjusted dosing, LVO Endovascular Thrombectomy (EVT) triage, and permissive blood pressure guardrails.',
    icon: <Brain className="w-7 h-7 text-cyan-400 animate-pulse" />,
    badge: 'Neurology & Stroke Code',
    status: 'Available'
  },
  {
    id: 'tbi-icp-monroe-kellie',
    title: 'Traumatic Brain Injury & ICP Dynamics Workstation',
    description: 'Neurocritical Care & Neurosurgery: Monroe-Kellie volume-pressure doctrine, dynamic Lundberg A/B/C wave rhythms, Cerebral Perfusion Pressure (CPP) optimization, hyperosmolar therapy titration (Mannitol vs 23.4% Saline), and surgical decompressive craniectomy decision-making.',
    icon: <Brain className="w-7 h-7 text-indigo-400 animate-pulse" />,
    badge: 'Neurocritical Care & TBI',
    status: 'Available'
  },
  {
    id: 'malignant-hyperthermia-dantrolene',
    title: 'Malignant Hyperthermia & Hypermetabolic Crisis Workstation',
    description: 'Anesthesiology & Critical Care: Ryanodine receptor (RYR1) calcium kinetics, differential triage between MH, NMS & Serotonin Syndrome (Hunter Criteria), Ryanodex vs Traditional Dantrium reconstitution stoichiometry, and MHAUS emergency rescue protocols.',
    icon: <Flame className="w-7 h-7 text-rose-500 animate-pulse" />,
    badge: 'Anesthesiology & Crisis',
    status: 'Available'
  },
  {
    id: 'shunt-hypoxemia-vq-mismatch',
    title: 'Hypoxemic & Hypercapnic Respiratory Failure Workstation',
    description: 'Pulmonology, Critical Care & Respiratory Physiology: Alveolar Gas Equation (PAO2), A-a gradient, classic Berggren shunt fraction (Qs/Qt), 5 mechanisms of hypoxemia classifier, 100% O2 hyperoxia test bench, and DO2/VO2 oxygen delivery & consumption dynamics.',
    icon: <Wind className="w-7 h-7 text-sky-400 animate-pulse" />,
    badge: 'Critical Care & Pulmonology',
    status: 'Available'
  },
  {
    id: 'telehealth',
    title: 'Standardized Patient & Voice AI Telehealth Workstation',
    description: 'Clinical Simulation & Voice AI: Conduct live verbal patient history interviews with interactive standardized patients, perform targeted bedside physical exam maneuvers, order STAT diagnostic investigations, and receive automated evidence-based OSCE SOAP note evaluations.',
    icon: <Stethoscope className="w-7 h-7 text-emerald-400 animate-pulse" />,
    badge: 'Voice AI & OSCE',
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
