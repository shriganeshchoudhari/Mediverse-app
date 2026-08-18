import { QuizQuestion } from '@/components/exam/QuizRunner';

export interface ExtendedQuizQuestion extends QuizQuestion {
  patientVignette?: string;
  vitals?: {
    bp?: string;
    hr?: string;
    rr?: string;
    spo2?: string;
    temp?: string;
  };
  labValues?: Array<{ test: string; value: string; normal: string }>;
  clinicalPearl?: string;
}

export const CLINICAL_EXAM_QUESTIONS: ExtendedQuizQuestion[] = [
  // ==========================================
  // PY1.1: General Physiology - Cellular Structure & Function
  // ==========================================
  {
    id: 'py1-1-q1',
    competencyCode: 'PY1.1',
    stem: 'A 6-month-old male infant is brought to the pediatric genetics clinic with failure to thrive, coarse facial features, severe developmental delay, and gingival hyperplasia. Physical examination reveals corneal clouding, hepatosplenomegaly, and claw-hand deformities. Laboratory investigations reveal markedly elevated serum levels of beta-hexosaminidase, beta-glucuronidase, and arylsulfatase A, but cultured skin fibroblasts demonstrate near-absence of these enzymes with dense intracytoplasmic inclusions (I-cells). Which biochemical defect is responsible for this condition?',
    options: [
      'Defective phosphorylation of mannose residues (Mannose-6-Phosphate) in the cis-Golgi apparatus',
      'Mutational disruption of the signal recognition particle (SRP) in the cytosol',
      'Impaired chaperone-assisted folding in the rough endoplasmic reticulum lumen',
      'Deficiency of ATP-binding cassette transporter (ABCD1) in peroxisomal membranes',
    ],
    correctIndex: 0,
    rationale: 'I-cell disease (mucolipidosis type II) is an autosomal recessive lysosomal storage disorder caused by a deficiency of UDP-N-acetylglucosamine-1-phosphotransferase in the Golgi apparatus. This enzyme normally phosphorylates mannose residues on acid hydrolases (creating Mannose-6-Phosphate, M6P), which serves as the cellular sorting tag directing them to lysosomes. Without M6P, the enzymes are misrouted and secreted extracellularly into the bloodstream, leading to deficient lysosomal degradation and cytoplasmic inclusion accumulation.',
    clinicalPearl: 'High serum lysosomal enzymes + intracellular inclusion bodies = I-cell disease (defective Golgi phosphorylation of mannose).',
    vitals: {
      bp: '85/55 mmHg',
      hr: '124 bpm',
      rr: '30/min',
      spo2: '98%',
      temp: '36.8°C',
    },
    labValues: [
      { test: 'Serum β-hexosaminidase', value: '480 U/L', normal: '10–35 U/L' },
      { test: 'Serum Arylsulfatase A', value: '310 U/L', normal: '5–20 U/L' },
      { test: 'Fibroblast Acid Hydrolases', value: '< 2%', normal: '100%' },
    ],
  },
  {
    id: 'py1-1-q2',
    competencyCode: 'PY1.1',
    stem: 'A 22-year-old female presents with progressive bilateral ptosis, proximal muscle weakness, and exercise intolerance. A muscle biopsy reveals "ragged red fibers" on Gomori trichrome staining. Genetic sequencing confirms a point mutation in mitochondrial DNA (mtDNA) affecting subunit 6 of NADH dehydrogenase (Complex I). Which of the following bioenergetic consequences will directly result from this mutation?',
    options: [
      'Impaired proton pumping across the inner mitochondrial membrane into the intermembrane space',
      'Complete inhibition of the citric acid cycle succinate dehydrogenase complex',
      'Direct uncoupling of oxidative phosphorylation without altering oxygen consumption',
      'Blockade of voltage-dependent anion channels on the outer mitochondrial membrane',
    ],
    correctIndex: 0,
    rationale: 'Mitochondrial Complex I (NADH:ubiquinone oxidoreductase) oxidizes NADH and transfers electrons to ubiquinone (coenzyme Q) while actively pumping 4 protons (H+) from the mitochondrial matrix into the intermembrane space. A loss-of-function mutation in Complex I impairs proton translocation, reducing the proton motive force (electrochemical gradient) necessary for ATP synthase (Complex V) to produce ATP, leading to lactic acid accumulation and myopathy.',
    clinicalPearl: 'Complexes I, III, and IV pump protons into the intermembrane space to establish the proton motive force that drives Complex V (ATP synthase).',
    vitals: {
      bp: '118/74 mmHg',
      hr: '76 bpm',
      rr: '16/min',
      spo2: '99%',
      temp: '36.9°C',
    },
    labValues: [
      { test: 'Venous Lactate (post-exercise)', value: '6.4 mmol/L', normal: '0.5–2.2 mmol/L' },
      { test: 'Serum Pyruvate', value: '0.42 mmol/L', normal: '0.05–0.15 mmol/L' },
      { test: 'Lactate/Pyruvate Ratio', value: '15.2', normal: '< 10' },
    ],
  },

  // ==========================================
  // PY1.3: General Physiology - Resting Membrane Potential
  // ==========================================
  {
    id: 'py1-3-q1',
    competencyCode: 'PY1.3',
    stem: 'A 58-year-old male with chronic kidney disease stage 5 presents to the emergency department after missing three hemodialysis sessions. He reports severe generalized weakness and ascending flaccid paralysis. An urgent ECG demonstrates peaked T-waves, PR prolongation, and marked widening of the QRS complex. His serum potassium is 8.2 mEq/L (normal: 3.5–5.0 mEq/L). Based on the Nernst and Goldman-Hodgkin-Katz equations, what is the initial electrophysiological alteration in myocardial resting membrane potential (RMP) and voltage-gated Na+ channel kinetics?',
    options: [
      'RMP shifts to a less negative (depolarized) value, resulting in sustained inactivation of fast voltage-gated Na+ channels',
      'RMP shifts to a more negative (hyperpolarized) value, moving further away from threshold potential',
      'The potassium equilibrium potential (E_K) becomes more negative, accelerating cardiac repolarization',
      'Voltage-gated Na+ channels remain permanently open in the activated conformation',
    ],
    correctIndex: 0,
    rationale: 'According to the Nernst equation for potassium (E_K = -61.5 * log([K+]_in / [K+]_out)), elevated extracellular [K+] decreases the concentration gradient across the cell membrane, making E_K and resting membrane potential (RMP) less negative (depolarized from -90 mV toward -70 mV). Although this initial depolarization brings RMP closer to threshold, prolonged baseline depolarization prevents voltage-gated Na+ channels from resetting their inactivation gates (h-gates). Consequently, fewer Na+ channels are available for Phase 0 upstroke, resulting in slow cardiac conduction velocity (wide QRS) and muscle paralysis.',
    clinicalPearl: 'Severe hyperkalemia depolarizes the baseline RMP, causing steady-state inactivation of fast Na+ channels and conduction slowing.',
    vitals: {
      bp: '148/92 mmHg',
      hr: '48 bpm',
      rr: '20/min',
      spo2: '96%',
      temp: '37.0°C',
    },
    labValues: [
      { test: 'Serum Potassium (K+)', value: '8.2 mEq/L', normal: '3.5–5.0 mEq/L' },
      { test: 'Serum Sodium (Na+)', value: '138 mEq/L', normal: '135–145 mEq/L' },
      { test: 'Serum Creatinine', value: '7.8 mg/dL', normal: '0.7–1.3 mg/dL' },
    ],
  },
  {
    id: 'py1-3-q2',
    competencyCode: 'PY1.3',
    stem: 'In an isolated mammalian neuron at 37°C, intracellular and extracellular ion concentrations are: [K+]_in = 140 mM, [K+]_out = 4 mM; [Na+]_in = 14 mM, [Na+]_out = 140 mM. At rest, the membrane permeability ratio P_K : P_Na : P_Cl is 1.0 : 0.04 : 0.45, giving an RMP of -70 mV. If a pharmacological agent selectively opens neuronal resting background potassium leak channels (K2P / TASK), increasing P_K fivefold without changing other permeabilities, what will happen to the resting membrane potential?',
    options: [
      'The RMP will hyperpolarize toward the potassium equilibrium potential (approx. -95 mV)',
      'The RMP will depolarize toward the sodium equilibrium potential (approx. +61 mV)',
      'The RMP will shift to 0 mV due to complete electrochemical dissipation',
      'The RMP will remain unchanged because the Na+/K+ ATPase is saturated',
    ],
    correctIndex: 0,
    rationale: 'According to the Goldman-Hodgkin-Katz (GHK) voltage equation, when the relative permeability of potassium (P_K) increases substantially relative to other ions, the membrane potential moves closer to the Nernst equilibrium potential of potassium (E_K). Since E_K = -61.5 * log(140 / 4) = -61.5 * 1.544 = -95 mV, increasing K+ leak conductance causes membrane hyperpolarization toward -95 mV, reducing neuronal excitability.',
    clinicalPearl: 'Increased K+ conductance hyperpolarizes the membrane toward E_K (-90 to -95 mV), inhibiting action potential generation.',
  },

  // ==========================================
  // PY3.1: Nerve-Muscle Physiology - Action Potential Mechanics
  // ==========================================
  {
    id: 'py3-1-q1',
    competencyCode: 'PY3.1',
    stem: 'A 32-year-old culinary tourist in Tokyo develops perioral tingling, numbness, ascending muscle weakness, and respiratory failure 45 minutes after consuming improperly prepared pufferfish liver (Fugu). Electrophysiological recordings demonstrate a complete failure of peripheral nerve action potential propagation despite preserved resting membrane potential. The offending toxin (Tetrodotoxin) exerts its effect by:',
    options: [
      'Selectively blocking the extracellular pore of voltage-gated fast Na+ channels',
      'Irreversibly inhibiting the delayed rectifier voltage-gated K+ channels',
      'Cleaving synaptobrevin (VAMP) at the neuromuscular junction presynaptic terminal',
      'Competitively antagonizing nicotinic acetylcholine receptors at the motor end plate',
    ],
    correctIndex: 0,
    rationale: 'Tetrodotoxin (TTX) from pufferfish and Saxitoxin from dinoflagellates bind with high affinity to site 1 of the outer pore loop of voltage-gated fast Na+ channels in nerves and skeletal muscle (Nav1.1–Nav1.7). By blocking Na+ influx, TTX completely abolishes the Phase 0 rapid depolarization upstroke of the action potential without affecting the resting membrane potential, leading to flaccid paralysis and respiratory arrest.',
    clinicalPearl: 'Tetrodotoxin (TTX) blocks voltage-gated Na+ channels -> prevents Phase 0 depolarization -> blocks nerve conduction.',
    vitals: {
      bp: '92/58 mmHg',
      hr: '110 bpm',
      rr: '8/min (shallow)',
      spo2: '86% on room air',
      temp: '36.5°C',
    },
  },
  {
    id: 'py3-1-q2',
    competencyCode: 'PY3.1',
    stem: 'During nerve conduction velocity studies on a myelinated A-alpha motor axon, an investigator observes that action potentials propagate at 100 m/s compared to 1 m/s in an unmyelinated C-fiber of the same diameter. Which biophysical mechanism explains why myelin sheath wrapping dramatically accelerates conduction velocity?',
    options: [
      'Decreases membrane capacitance (C_m) and increases membrane resistance (R_m), increasing the length constant (lambda)',
      'Increases membrane capacitance (C_m) and decreases internal axial resistance (R_i)',
      'Eliminates the nodes of Ranvier, allowing continuous linear electron flow',
      'Shifts the activation threshold of voltage-gated Na+ channels from -55 mV to -90 mV',
    ],
    correctIndex: 0,
    rationale: 'Myelin wraps around the axon in multiple lipid layers, which increases the distance between intracellular and extracellular charge layers. This dramatically reduces membrane capacitance (C_m = epsilon * A / d) and increases membrane electrical resistance (R_m). The reduction in C_m means less charge is required to depolarize the membrane (shorter time constant tau = R_m * C_m), and high R_m prevents current leakage, maximizing the length/space constant (lambda = sqrt(R_m / R_i)). Action potentials thus jump from node to node via saltatory conduction.',
    clinicalPearl: 'Myelination increases membrane resistance (R_m) and decreases membrane capacitance (C_m) -> increases length constant lambda and accelerates saltatory conduction.',
  },

  // ==========================================
  // PY5.1: Cardiovascular Physiology - Properties of Cardiac Muscle
  // ==========================================
  {
    id: 'py5-1-q1',
    competencyCode: 'PY5.1',
    stem: 'A 74-year-old female with chronic heart failure and atrial fibrillation presents with visual disturbances described as "yellow-green halos," nausea, and severe fatigue. ECG reveals frequent ventricular bigeminy and bidirectional ventricular tachycardia. She is taking digoxin and furosemide. Her serum digoxin level is 3.2 ng/mL (therapeutic: 0.5–2.0 ng/mL). Which cellular mechanism explains the positive inotropic effect of digoxin as well as its propensity to trigger delayed afterdepolarizations (DADs)?',
    options: [
      'Inhibition of Na+/K+ ATPase -> increased intracellular [Na+] -> decreased NCX (3Na+/1Ca2+ antiporter) activity -> increased sarcoplasmic reticulum Ca2+ loading',
      'Direct opening of Ryanodine Receptors (RyR2) during Phase 4 diastole',
      'Stimulation of the sarcolemmal Ca2+-ATPase pump (PMCA) enhancing calcium extrusion',
      'Prolongation of Phase 3 repolarization by blocking HERG K+ channels',
    ],
    correctIndex: 0,
    rationale: 'Digoxin reversibly inhibits the myocardial sarcolemmal Na+/K+ ATPase pump. The resulting accumulation of intracellular Na+ reduces the electrochemical gradient that drives the 3Na+/1Ca2+ exchanger (NCX), decreasing Ca2+ efflux. The excess intracellular Ca2+ is taken up into the sarcoplasmic reticulum by SERCA2a. During subsequent action potentials, greater Ca2+-induced Ca2+ release (CICR) enhances contractility (inotropy). In toxicity, severe Ca2+ overload causes spontaneous diastolic Ca2+ release from the SR, activating transient inward currents (I_ti) that produce delayed afterdepolarizations (DADs) and ventricular arrhythmias.',
    clinicalPearl: 'Digoxin: Na+/K+ ATPase inhibition -> intracellular Na+ rises -> NCX activity drops -> intracellular & SR Ca2+ rises -> inotropy (and DAD arrhythmias in toxicity).',
    vitals: {
      bp: '106/68 mmHg',
      hr: '52 bpm (irregular)',
      rr: '18/min',
      spo2: '97%',
      temp: '36.7°C',
    },
    labValues: [
      { test: 'Serum Digoxin', value: '3.2 ng/mL', normal: '0.5–2.0 ng/mL' },
      { test: 'Serum Potassium (K+)', value: '3.1 mEq/L', normal: '3.5–5.0 mEq/L' },
      { test: 'Serum Magnesium', value: '1.4 mg/dL', normal: '1.7–2.2 mg/dL' },
    ],
  },
  {
    id: 'py5-1-q2',
    competencyCode: 'PY5.1',
    stem: 'A 48-year-old male with inappropriate sinus tachycardia is treated with Ivabradine, a selective pharmacotherapy that reduces heart rate without altering myocardial inotropy or blood pressure. Which ionic current in the sinoatrial (SA) node is specifically blocked by this medication during Phase 4 spontaneous diastolic depolarization?',
    options: [
      'Hyperpolarization-activated cyclic nucleotide-gated inward funny current (I_f)',
      'L-type voltage-gated calcium current (I_Ca,L) responsible for Phase 0 upstroke',
      'Rapid delayed rectifier potassium outward current (I_Kr)',
      'Inwardly rectifying background potassium current (I_K1)',
    ],
    correctIndex: 0,
    rationale: 'Automaticity of pacemaker tissue (SA node and AV node) depends on the Phase 4 spontaneous diastolic depolarization slope. The primary initiator of this slow depolarization is the funny current (I_f), carried by mixed Na+ influx through hyperpolarization-activated cyclic nucleotide-gated (HCN4) channels when the membrane repolarizes below -50 mV. Ivabradine selectively blocks HCN channels, reducing the slope of Phase 4 depolarization and decreasing resting heart rate without affecting contractility.',
    clinicalPearl: 'Phase 4 pacemaker potential in SA node is initiated by the funny current (I_f via HCN channels); blocked by Ivabradine.',
    vitals: {
      bp: '122/78 mmHg',
      hr: '112 bpm (resting sinus tachycardia)',
      rr: '16/min',
      spo2: '99%',
      temp: '37.0°C',
    },
  },

  // ==========================================
  // PY5.2: Cardiovascular Physiology - Cardiac Cycle & Hemodynamics
  // ==========================================
  {
    id: 'py5-2-q1',
    competencyCode: 'PY5.2',
    stem: 'A 78-year-old man presents with progressive exertional angina, dyspnea, and an episode of syncope while climbing stairs. Physical examination reveals a loud, harsh crescendo-decrescendo systolic ejection murmur at the right 2nd intercostal space radiating to the carotids, with pulsus parvus et tardus. Cardiac catheterization Left Ventricular Pressure-Volume (PV) loop analysis reveals which characteristic set of changes in severe Aortic Stenosis?',
    options: [
      'Marked elevation in peak LV systolic pressure, increased End-Systolic Volume (ESV), and increased LV stroke work',
      'Loss of isovolumetric phases with a tall, widened loop and elevated End-Diastolic Volume',
      'Isolated reduction in End-Diastolic Volume with unchanged systolic pressures',
      'Rightward shift of the loop with reduced peak systolic pressure and increased compliance',
    ],
    correctIndex: 0,
    rationale: 'In aortic stenosis, the narrowed aortic valve orifice creates high resistance to LV ejection (increased afterload). The left ventricle must generate excessively high pressures (e.g., > 200 mmHg) during systole to overcome the transvalvular gradient. Because of the high impedance, ventricular emptying is impaired, resulting in increased End-Systolic Volume (ESV), reduced Stroke Volume, and a marked increase in peak systolic pressure and stroke work (loop becomes taller and narrower with increased ESV).',
    clinicalPearl: 'Aortic Stenosis PV Loop: Tall peak systolic LV pressure + increased ESV + decreased stroke volume.',
    vitals: {
      bp: '102/76 mmHg',
      hr: '84 bpm',
      rr: '20/min',
      spo2: '94%',
      temp: '36.8°C',
    },
    labValues: [
      { test: 'Aortic Valve Area (Echo)', value: '0.65 cm²', normal: '> 2.0 cm²' },
      { test: 'Mean Transvalvular Gradient', value: '48 mmHg', normal: '< 5 mmHg' },
      { test: 'LV Ejection Fraction', value: '55%', normal: '55–70%' },
    ],
  },
  {
    id: 'py5-2-q2',
    competencyCode: 'PY5.2',
    stem: 'On a standard Wiggers diagram integrating Left Ventricular (LV) pressure, Aortic pressure, Left Atrial (LA) pressure, and phonocardiogram tracings, the closure of the aortic valve is heralded by which physiological landmark?',
    options: [
      'The dicrotic notch (incisura) on the aortic pressure tracing, coinciding with the second heart sound (S2)',
      'The peak of the c-wave on the left atrial pressure tracing, coinciding with the first heart sound (S1)',
      'The rapid filling wave coinciding with the third heart sound (S3)',
      'The onset of the QRS complex on the surface electrocardiogram',
    ],
    correctIndex: 0,
    rationale: 'At the end of ventricular ejection (end-systole), LV pressure falls below aortic pressure. The momentary retrograde flow of blood rebounds against the closed semilunar cusps of the aortic valve, producing a transient pressure spike known as the dicrotic notch (incisura) on the aortic pulse contour. The mechanical vibration of valve closure corresponds to the A2 component of the second heart sound (S2) and marks the onset of isovolumetric relaxation.',
    clinicalPearl: 'Aortic valve closure = Dicrotic notch (incisura) on aortic pressure curve + S2 heart sound + start of isovolumetric relaxation.',
  },

  // ==========================================
  // PY6.1: Respiratory Physiology - Mechanics of Breathing
  // ==========================================
  {
    id: 'py6-1-q1',
    competencyCode: 'PY6.1',
    stem: 'A male infant born at 29 weeks of gestation develops severe respiratory distress syndrome (NRDS) characterized by tachypnea, cyanosis, and chest wall retractions. Amniotic fluid testing had revealed a lecithin-to-sphingomyelin (L/S) ratio of 1.2 (immature: < 2.0). According to the Law of Laplace (P = 2T / r), what is the direct physical consequence of surfactant deficiency on small versus large alveoli?',
    options: [
      'Surface tension (T) remains uniformly high; small alveoli (smaller radius r) generate higher collapsing pressures and empty into larger alveoli, causing widespread micro-atelectasis',
      'Surface tension (T) drops to zero, causing uncontrolled alveolar rupture and pneumothorax',
      'Transpulmonary pressure falls below intrapleural pressure, expanding residual volume',
      'Dynamic airway compression is eliminated, reducing work of breathing',
    ],
    correctIndex: 0,
    rationale: 'The Law of Laplace states that collapsing pressure P = 2T / r. Without surfactant (dipalmitoylphosphatidylcholine), surface tension T is constant and high across all alveoli. Consequently, smaller alveoli (smaller radius r) have a much higher collapsing pressure than larger alveoli. Air flows down the pressure gradient from small alveoli into larger ones, causing progressive collapse of small alveoli (atelectasis) and overdistension of large ones. Surfactant reduces T more in smaller alveoli, equalizing pressures and stabilizing alveolar architecture.',
    clinicalPearl: 'Surfactant reduces surface tension in smaller alveoli -> prevents atelectasis and increases pulmonary compliance (Law of Laplace P = 2T/r).',
    vitals: {
      bp: '56/32 mmHg',
      hr: '168 bpm',
      rr: '74/min',
      spo2: '82% on room air',
      temp: '36.4°C',
    },
    labValues: [
      { test: 'Arterial pH', value: '7.18', normal: '7.35–7.45' },
      { test: 'PaCO2', value: '62 mmHg', normal: '35–45 mmHg' },
      { test: 'PaO2', value: '44 mmHg', normal: '80–100 mmHg' },
      { test: 'L/S Ratio', value: '1.2', normal: '> 2.0' },
    ],
  },
  {
    id: 'py6-1-q2',
    competencyCode: 'PY6.1',
    stem: 'A 66-year-old male with severe chronic obstructive pulmonary disease (COPD) due to alpha-1 antitrypsin deficiency undergoes static pulmonary mechanics assessment. His static pressure-volume curve is shifted upward and to the left compared to normal controls. Which physiological property of the lung parenchyma is primarily increased in this patient?',
    options: [
      'Static lung compliance (Delta V / Delta P) due to loss of alveolar elastic recoil',
      'Radial tethering traction exerted on non-cartilaginous bronchioles',
      'Dynamic expiratory airflow velocity at low lung volumes',
      'Elastic recoil pressure exerted by the interstitial collagen matrix',
    ],
    correctIndex: 0,
    rationale: 'Emphysema is characterized by elastase-mediated enzymatic destruction of alveolar septa and elastin fibers. Because elastic fibers provide the inward recoil of the lung, destruction of elastin decreases elastic recoil and dramatically increases static compliance (C = Delta V / Delta P; leftward shift of the P-V curve). However, because elastic recoil normally holds small airways open via radial traction, its loss causes premature dynamic airway closure during expiration, leading to air trapping and increased residual volume (RV).',
    clinicalPearl: 'Emphysema = Loss of elastic recoil -> Increased static compliance (left shift on P-V curve) + Dynamic airway collapse.',
    vitals: {
      bp: '134/82 mmHg',
      hr: '88 bpm',
      rr: '22/min',
      spo2: '91% on room air',
      temp: '37.1°C',
    },
    labValues: [
      { test: 'FEV1 / FVC Ratio', value: '0.48', normal: '> 0.70' },
      { test: 'Total Lung Capacity (TLC)', value: '128% pred', normal: '80–120%' },
      { test: 'Residual Volume (RV)', value: '165% pred', normal: '80–120%' },
      { test: 'DLCO (Diffusing Capacity)', value: '42% pred', normal: '> 75%' },
    ],
  },

  // ==========================================
  // PY6.2: Respiratory Physiology - Alveolar Gas Exchange & V/Q
  // ==========================================
  {
    id: 'py6-2-q1',
    competencyCode: 'PY6.2',
    stem: 'A 62-year-old female presents to the emergency room with acute dyspnea and tachycardia 5 days after knee replacement. Room air arterial blood gas reveals: pH = 7.49, PaCO2 = 28 mmHg, PaO2 = 54 mmHg, HCO3- = 21 mEq/L (P_atm = 760 mmHg, P_H2O = 47 mmHg, FiO2 = 0.21, respiratory quotient R = 0.8). CT angiogram confirms acute pulmonary embolism. What is the calculated alveolar-arterial (A-a) oxygen gradient and the primary underlying V/Q mismatch mechanism?',
    options: [
      'A-a gradient = approx. 61 mmHg (widened); caused by alveolar dead space ventilation (V/Q -> infinity) in occluded zones and relative low V/Q shunting in hyperperfused non-occluded regions',
      'A-a gradient = approx. 10 mmHg (normal); caused by pure psychogenic hyperventilation',
      'A-a gradient = approx. 0 mmHg (normal); caused by decreased barometric pressure',
      'A-a gradient = approx. 85 mmHg (widened); caused exclusively by severe diffusion limitation across the alveolar-capillary membrane',
    ],
    correctIndex: 0,
    rationale: 'Using the alveolar gas equation: P_A O2 = FiO2 * (P_atm - P_H2O) - (PaCO2 / R) = 0.21 * (760 - 47) - (28 / 0.8) = 149.7 - 35 = 114.7 mmHg. The A-a gradient = P_A O2 - PaO2 = 114.7 - 54 = 60.7 mmHg (elevated; normal is < 15 mmHg). In pulmonary embolism, vascular obstruction creates dead space (V/Q = infinity) where alveoli are ventilated but not perfused. Diverted blood overperfuses non-obstructed regions, creating areas of low V/Q (physiological shunt-like effect), yielding severe hypoxemia with an elevated A-a gradient.',
    clinicalPearl: 'Pulmonary Embolism = Widened A-a gradient + Alveolar Dead Space (V/Q -> infinity) + low V/Q mismatch in non-occluded zones.',
    vitals: {
      bp: '110/72 mmHg',
      hr: '118 bpm (sinus tachycardia)',
      rr: '28/min',
      spo2: '88% on room air',
      temp: '37.3°C',
    },
    labValues: [
      { test: 'Arterial pH', value: '7.49', normal: '7.35–7.45' },
      { test: 'PaCO2', value: '28 mmHg', normal: '35–45 mmHg' },
      { test: 'PaO2', value: '54 mmHg', normal: '80–100 mmHg' },
      { test: 'D-dimer', value: '3450 ng/mL', normal: '< 500 ng/mL' },
    ],
  },
  {
    id: 'py6-2-q2',
    competencyCode: 'PY6.2',
    stem: 'In a healthy 25-year-old medical student standing upright at rest, which regional physiological difference is present when comparing the apex (Zone 1/2) to the base (Zone 3) of the lungs?',
    options: [
      'V/Q ratio is higher at the apex (approx. 3.3) than at the base (approx. 0.63) because pulmonary perfusion drops far more dramatically than ventilation toward the apex',
      'Alveolar PO2 is lower at the apex than at the base due to increased apical oxygen consumption',
      'Intrapleural pressure is more positive at the apex, causing greater baseline alveolar collapse',
      'Capillary blood flow is greatest at the apex because pulmonary arterial pressure exceeds systemic pressure',
    ],
    correctIndex: 0,
    rationale: 'Gravity exerts a hydrostatic gradient on both ventilation and blood flow in an upright lung. Both ventilation (V) and perfusion (Q) increase from apex to base, but perfusion increases much more steeply. Therefore, at the apex, Q is very low relative to V, giving a high V/Q ratio (~3.3), which results in high alveolar PO2 (approx. 130 mmHg) and low PCO2. At the base, Q is abundant relative to V, giving a low V/Q ratio (~0.63), which results in lower PO2 (approx. 89 mmHg) and higher PCO2.',
    clinicalPearl: 'Lung Apex: Higher V/Q ratio (~3.3), higher PO2, lower PCO2. Lung Base: Lower V/Q ratio (~0.6), lower PO2, higher PCO2.',
  },

  // ==========================================
  // PY7.1: Renal Physiology - Glomerular Filtration Rate & Starling Forces
  // ==========================================
  {
    id: 'py7-1-q1',
    competencyCode: 'PY7.1',
    stem: 'A 67-year-old male with type 2 diabetes mellitus, hypertension, and mild chronic kidney disease is treated with lisinopril (an ACE inhibitor). For severe osteoarthritis, he begins taking naproxen (an NSAID) twice daily. Ten days later, his serum creatinine jumps from 1.2 mg/dL to 3.8 mg/dL with acute oliguria. Which combination of arteriolar hemodynamic alterations caused this acute decline in Glomerular Filtration Rate (GFR)?',
    options: [
      'NSAID-mediated inhibition of prostaglandin synthesis causes afferent arteriolar constriction; ACE inhibitor-mediated loss of Angiotensin II causes efferent arteriolar dilation -> severe drop in Glomerular Hydrostatic Pressure (P_GC)',
      'NSAID causes efferent constriction; ACE inhibitor causes afferent dilation -> elevated P_GC',
      'Both agents selectively constrict the efferent arteriole, increasing renal plasma flow',
      'Both agents increase Bowman space oncotic pressure (Pi_BS)',
    ],
    correctIndex: 0,
    rationale: 'Renal autoregulation maintains GFR via two counterbalancing forces: renal prostaglandins (PGI2, PGE2) dilate the afferent arteriole, while Angiotensin II constricts the efferent arteriole, preserving glomerular capillary hydrostatic pressure (P_GC). NSAIDs inhibit COX enzymes, eliminating prostaglandin synthesis and leading to afferent arteriolar vasoconstriction (decreased blood entry into glomerulus). ACE inhibitors block Angiotensin II formation, preventing efferent arteriolar constriction and allowing efferent vasodilation (blood exits glomerulus too easily). Together, they cause a catastrophic collapse in P_GC and GFR.',
    clinicalPearl: 'NSAIDs constrict Afferent arteriole (block prostaglandins) + ACE inhibitors dilate Efferent arteriole (block ATII) -> drop in P_GC and acute renal failure.',
    vitals: {
      bp: '108/64 mmHg',
      hr: '78 bpm',
      rr: '16/min',
      spo2: '98%',
      temp: '36.9°C',
    },
    labValues: [
      { test: 'Serum Creatinine', value: '3.8 mg/dL', normal: '0.7–1.3 mg/dL' },
      { test: 'Blood Urea Nitrogen (BUN)', value: '62 mg/dL', normal: '7–20 mg/dL' },
      { test: 'Estimated GFR', value: '16 mL/min/1.73m²', normal: '> 90 mL/min' },
      { test: 'Serum Potassium (K+)', value: '5.6 mEq/L', normal: '3.5–5.0 mEq/L' },
    ],
  },
  {
    id: 'py7-1-q2',
    competencyCode: 'PY7.1',
    stem: 'During a renal clearance study in a 70-kg volunteer, inulin and para-aminohippuric acid (PAH) are infused at steady state. Urine and plasma measurements yield: Inulin Clearance (GFR) = 125 mL/min, PAH Clearance (effective RPF) = 625 mL/min, and Hematocrit = 40%. What are the patient\'s calculated Filtration Fraction (FF) and total Renal Blood Flow (RBF)?',
    options: [
      'Filtration Fraction = 20% (0.20); Renal Blood Flow = 1042 mL/min',
      'Filtration Fraction = 40% (0.40); Renal Blood Flow = 625 mL/min',
      'Filtration Fraction = 10% (0.10); Renal Blood Flow = 1250 mL/min',
      'Filtration Fraction = 25% (0.25); Renal Blood Flow = 850 mL/min',
    ],
    correctIndex: 0,
    rationale: 'GFR is measured by inulin clearance = 125 mL/min. Renal Plasma Flow (RPF) is measured by PAH clearance = 625 mL/min. Filtration Fraction (FF) = GFR / RPF = 125 / 625 = 0.20 (20%). Total Renal Blood Flow (RBF) = RPF / (1 - Hematocrit) = 625 / (1 - 0.40) = 625 / 0.60 = 1041.67 mL/min (approx. 1042 mL/min).',
    clinicalPearl: 'Filtration Fraction FF = GFR / RPF (normal ~20%). Renal Blood Flow RBF = RPF / (1 - Hct).',
  },
];

export interface ExamPreset {
  id: string;
  title: string;
  badge: string;
  description: string;
  durationSeconds: number;
  competencyCodes: string[];
  questionCount: number;
}

export const EXAM_PRESETS: ExamPreset[] = [
  {
    id: 'full-simulation',
    title: 'Comprehensive USMLE Step 1 / NMC CBME Board Mock',
    badge: 'High Yield • All 8 Competencies',
    description: 'Full-length clinical vignette examination covering all core NMC CBME competencies (PY1.1 to PY7.1). Complete with Starling forces, Wiggers PV loops, and membrane dynamics.',
    durationSeconds: 1500, // 25 minutes
    competencyCodes: ['PY1.1', 'PY1.3', 'PY3.1', 'PY5.1', 'PY5.2', 'PY6.1', 'PY6.2', 'PY7.1'],
    questionCount: 16,
  },
  {
    id: 'rapid-drill',
    title: 'Rapid High-Yield Vignette Drill',
    badge: '12 Min • High Intensity',
    description: 'One high-yield clinical vignette per competency. Designed for rapid knowledge checks and diagnostic mastery benchmarking.',
    durationSeconds: 720, // 12 minutes
    competencyCodes: ['PY1.1', 'PY1.3', 'PY3.1', 'PY5.1', 'PY5.2', 'PY6.1', 'PY6.2', 'PY7.1'],
    questionCount: 8,
  },
  {
    id: 'cardiopulmonary-renal',
    title: 'Cardiovascular, Respiratory & Renal Systems',
    badge: 'Clinical Core • PY5, PY6, PY7',
    description: 'Deep clinical vignette focus on cardiac cycle hemodynamics, Wiggers diagrams, Laplace mechanics, A-a gradients, and renal autoregulation.',
    durationSeconds: 900, // 15 minutes
    competencyCodes: ['PY5.1', 'PY5.2', 'PY6.1', 'PY6.2', 'PY7.1'],
    questionCount: 10,
  },
  {
    id: 'cellular-neuro',
    title: 'Cellular, Membrane & Nerve-Muscle Dynamics',
    badge: 'Foundations • PY1, PY3',
    description: 'Master organelle sorting, Nernst/GHK resting membrane potentials, action potential mechanics, and saltatory conduction.',
    durationSeconds: 600, // 10 minutes
    competencyCodes: ['PY1.1', 'PY1.3', 'PY3.1'],
    questionCount: 6,
  },
];

export function getQuestionsForPreset(presetId: string): ExtendedQuizQuestion[] {
  const preset = EXAM_PRESETS.find((p) => p.id === presetId);
  if (!preset) return CLINICAL_EXAM_QUESTIONS;

  if (presetId === 'rapid-drill') {
    // Pick 1 question per competency
    const selected: ExtendedQuizQuestion[] = [];
    const seenCodes = new Set<string>();
    for (const q of CLINICAL_EXAM_QUESTIONS) {
      if (!seenCodes.has(q.competencyCode)) {
        seenCodes.add(q.competencyCode);
        selected.push(q);
      }
    }
    return selected;
  }

  return CLINICAL_EXAM_QUESTIONS.filter((q) => preset.competencyCodes.includes(q.competencyCode));
}
